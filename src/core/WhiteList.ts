import {
  ButtonInteraction,
  ChannelType,
  ComponentType,
  GuildTextBasedChannel,
  ModalSubmitInteraction,
  PermissionFlagsBits,
  TextBasedChannel,
} from "discord.js";
import { WhitelistService } from "./services/WhitelistService.js";
import { Question } from "@prisma/client";
import { UserWhitelist } from "./userWhitelist.js";
import { settings } from "#settings";
import { DiscordService } from "./services/DiscordService.js";
import { FileService } from "./services/FileService.js";
import { MTAService } from "./services/MtaService.js";

export class WhiteListManager {
  private whitelistService: WhitelistService;
  private mtaService?: MTAService;

  public questions: Question[] = [];
  public whitelists: Map<string, UserWhitelist> = new Map();

  constructor(mtaService?: any) {
    this.whitelistService = new WhitelistService();
    if (mtaService) {
      this.mtaService = new MTAService(mtaService);
    }
    this.initializeData();
  }

  private async initializeData(): Promise<void> {
    try {
      const { questions, whitelists } =
        await this.whitelistService.initializeWhitelistData();
      this.questions = questions;
      this.whitelists = whitelists;
    } catch (error) {
      console.error("Error initializing WhiteListManager:", error);
    }
  }
  public getQuestions(): Question[] {
    return this.questions;
  }
  async deleteAllChannels(interaction: any): Promise<void> {
    const deletePromises = Array.from(this.whitelists.values()).map(
      async (whitelist) => {
        const channel = interaction.guild.channels.cache.get(
          whitelist.data.channelId
        );
        whitelist.data.started = false;

        if (channel) {
          this.whitelists.delete(whitelist.data.userId);

          try {
            await this.whitelistService.deleteWhitelistById(whitelist.data.id);
            await channel.delete();
          } catch (error) {
            console.error("Error deleting channel:", error);
          }
        }
      }
    );

    await Promise.all(deletePromises);

    interaction.reply({
      content: "Canais de whitelist apagados com sucesso!",
      ephemeral: true,
    });
  }

  async deleteWhitelist(interaction: any, user: any): Promise<void> {
    this.whitelists.delete(user.id);

    try {
      await this.whitelistService.cleanupWhitelistData(user.id);
    } catch (err) {
      console.error("Erro ao limpar os dados do banco de dados:", err);
    }

    interaction.reply({
      content: "Whitelist apagada com sucesso!",
      ephemeral: true,
    });
  }
  private async defaultMessage(interaction: any, receivedchannel: any) {
    const embed = DiscordService.createWelcomeEmbed(
      interaction.member.user.displayAvatarURL()
    );
    const row = DiscordService.createStartButton();

    const whitelist = await this.getWhitelistByUserId(interaction.user.id); // usa método com cache local

    const message = await receivedchannel.send({
      embeds: [embed],
      components: [row],
    });
    const collector = message.channel.createMessageComponentCollector({
      componentType: ComponentType.Button,
      time: 300000,
    });

    collector.on("collect", async (button: ButtonInteraction) => {
      if (button.customId === "start") {
        collector.stop();
        await this.startWhitelist(button, receivedchannel);
        await message.delete().catch(() => {}); // evita erro se já deletado
      }
    });

    collector.on("end", async (collected: any) => {
      if (whitelist?.ignore) return;
      if (collected.size === 0) {
        if (receivedchannel.deletable)
          await receivedchannel.delete().catch(() => {});
        await whitelist?.Delete();
        this.whitelists.delete(interaction.user.id);
      }
    });
  }
  public async createWhitelistChannel(
    interaction: any
  ): Promise<GuildTextBasedChannel | undefined> {
    try {
      const existingWhitelist = this.whitelists.get(interaction.user.id);
      if (existingWhitelist?.data.messageId) {
        await interaction.reply({
          content: "Você já tem um canal de whitelist",
          ephemeral: true,
        });
        return undefined; // retorna undefined pois não criou canal
      }

      const channel: GuildTextBasedChannel =
        await interaction.guild.channels.create({
          name: `${interaction.user.username}-whitelist`,
          type: ChannelType.GuildText,
          parent: settings.Setting.whitelist["WHITELIST-CATEGORY"],
          permissionOverwrites: [
            {
              id: interaction.guild.roles.everyone,
              deny: [PermissionFlagsBits.ViewChannel],
            },
            {
              id: interaction.user.id,
              allow: [PermissionFlagsBits.ViewChannel],
            },
          ],
        });

      await channel.setRateLimitPerUser(5);

      const createdWhitelist = await this.whitelistService.createWhitelist({
        userId: interaction.user.id,
        channelId: channel.id,
      });

      const userwhitelist = new UserWhitelist(createdWhitelist);
      this.whitelists.set(interaction.user.id, userwhitelist);

      await this.defaultMessage(interaction, channel);
      return channel;
    } catch (error) {
      console.error("Error creating whitelist channel:", error);
      if (!interaction.replied && !interaction.deferred) {
        await interaction.reply({
          content: "Erro ao criar canal de whitelist",
          ephemeral: true,
        });
      }
      return undefined;
    }
  }
  async addQuestion(question: string): Promise<Question> {
    try {
      const result = await this.whitelistService.createQuestion(question);
      this.questions = [...this.questions, result];
      return result;
    } catch (err) {
      console.error("Error adding question:", err);
      throw err;
    }
  }

  async deleteQuestion(id: number): Promise<void> {
    try {
      await this.whitelistService.deleteQuestion(id);
      this.questions = this.questions.filter((question) => question.id !== id);
    } catch (err) {
      console.error("Error deleting question:", err);
      throw err;
    }
  }

  async editQuestion(id: number, questionText: string): Promise<Question> {
    try {
      const result = await this.whitelistService.updateQuestion(
        id,
        questionText
      );
      this.questions = this.questions.map((question) =>
        question.id === id ? { ...question, question: questionText } : question
      );
      return result;
    } catch (err) {
      console.error("Error editing question:", err);
      throw err;
    }
  }

  async getQuestionById(id: number): Promise<Question> {
    const localQuestion = this.questions.find((q) => q.id === id);
    if (localQuestion) return localQuestion;

    try {
      const questionFromDb = await this.whitelistService.getQuestionById(id);
      // Atualiza o cache se desejar manter tudo em memória
      this.questions.push(questionFromDb);
      return questionFromDb;
    } catch (err) {
      console.error("Error getting question by ID:", err);
      throw new Error("Failed to get question");
    }
  }

  async getWhitelistByUserId(userId: string): Promise<UserWhitelist | null> {
    // Verifica se existe localmente
    const localWhitelist = this.whitelists.get(userId);
    if (localWhitelist) return localWhitelist;

    // Se não tiver local, busca no banco de dados
    try {
      const dbWhitelist = await this.whitelistService.getWhitelistByUserId(
        userId
      );
      if (!dbWhitelist) return null;

      const userWhitelist = new UserWhitelist(dbWhitelist);
      this.whitelists.set(userId, userWhitelist); // Atualiza o cache
      return userWhitelist;
    } catch (err) {
      console.error("Erro ao buscar whitelist por ID:", err);
      return null;
    }
  }

  async endWhitelist(interaction: any): Promise<void> {
    const userId = interaction.member.user.id;
    const whitelist = this.whitelists.get(userId);
    if (!whitelist) return;

    

    try {
   
      await DiscordService.addRoleToUser(
        interaction.member,
        settings.Setting.whitelist["PREWHITELIST-ROLE"]
      );

      await interaction.channel.send({
        content: "✅ Sua whitelist foi concluída com sucesso! Este canal será encerrado em 5 segundos.",
      })
     
      whitelist.data.approved = true;

      
      setTimeout(async () => {
        await interaction.channel.delete();
        await this.processWhitelistFinalization(interaction, whitelist, userId);
      }, 5000);
    } catch (error) {
      console.error("Error ending whitelist:", error);
    }
  } 

  private async processWhitelistFinalization(
    interaction: any,
    whitelist: UserWhitelist,
    userId: string
  ): Promise<void> {
    try {
      const { answers, questions } =
        await this.whitelistService.finalizeWhitelist(userId);

      // Create file with answers
      FileService.createWhitelistFile(userId, answers, questions);

      // Clean up answers from database
      await this.whitelistService.deleteAnswersByWhitelistId(whitelist.data.id);

      // Prepare Discord message
      const file = FileService.readWhitelistFile(userId);
      const attachment = DiscordService.createFileAttachment(
        file,
        `${userId}.txt`
      );

      const embed = DiscordService.createWhitelistEmbed(
        "Whitelist",
        `Whitelist finalizada por ${interaction.user.username}`
      );

      const row = DiscordService.createActionRow();

      // Send to whitelist channel
      const whitelistChannel = await interaction.guild.channels.fetch(
        settings.Setting.whitelist["WHITELIST-CHANNEL"]
      );

      const message = await whitelistChannel.send({
        embeds: [embed],
        components: [row],
        files: [attachment],
      });

      // Update whitelist with message ID
      await this.whitelistService.updateWhitelist(whitelist.data.id, {
        messageId: `${message.id}`,
      });
      whitelist.data.messageId = message.id;

      // Clean up file
      FileService.deleteWhitelistFile(userId);
    } catch (error) {
      console.error("Error processing whitelist finalization:", error);
    }
  }

  async startWhitelist(
    interaction: any,
    receivedchannel: TextBasedChannel
  ): Promise<void> {
   
    try {
      if (this.questions.length === 0) {
        interaction.reply({
          content: "Não há perguntas cadastradas",
          ephemeral: true,
        });
        return;
      }

      const whitelist = this.whitelists.get(interaction.user.id);
      if (!whitelist) {
        interaction.reply({
          content: "Você não tem um canal de whitelist",
          ephemeral: true,
        });
        return;
      }
     

      if (whitelist?.data.started) {
        if (!interaction.replied && !interaction.deferred)
          await interaction.reply({
            content: "Whitelist já iniciada.",
            ephemeral: true,
          });
        return;
      }
      this.whitelists.get(interaction.user.id)!.data.started = true;
      
      await interaction.reply({
        content: "Whitelist iniciada!",
        ephemeral: true,
      });

      const firstQuestion = this.questions[0];
      
      await this.sendQuestionAndCollectAnswer(interaction, firstQuestion, true);
    } catch (error) {
      console.error("Error starting whitelist:", error);
    }
  }

  private async sendQuestionAndCollectAnswer(
    interaction: any,
    question: Question,
    isFirst = false
  ): Promise<void> {
    const embed = DiscordService.createWhitelistEmbed(
      "Whitelist",
      question.question
    );
    const message = await interaction.channel.send({ embeds: [embed] });

    const collector = message.channel.createMessageCollector({
      filter: (i: any) => i.author.id === interaction.user.id,
      time: 600000,
    });

    const whitelist = this.whitelists.get(interaction.user.id);
    if (!whitelist) return;

    collector.on("collect", async (msg: any) => {
      collector.stop();
      
      try {
        if (isFirst && whitelist.data.lastquestion === -1) {
          whitelist.firstQuestion(msg.content, question.id);
          whitelist.data.lastquestion = question.id;
        } else {
          whitelist.nextQuestion(msg.content, question.id);
          whitelist.data.lastquestion = question.id;
        }
        if (message.deletable) message.delete();
        if (msg.deletable) msg.delete();

        await this.processNextQuestion(interaction);
      } catch (error) {
        console.error("Error processing answer:", error);
      }
    });

    collector.on("end", async (collected: any) => {
      if (whitelist.ignore) return;
      if (collected.size === 0) {
        await this.handleWhitelistTimeout(interaction, whitelist);
      }
    });
  }

  private async processNextQuestion(interaction: any): Promise<void> {
    const whitelist = this.whitelists.get(interaction.user.id);
    if (!whitelist) return;

    let nextQuestionIndex = whitelist.data.lastquestion;

    if (nextQuestionIndex >= this.questions.length) {
      return this.endWhitelist(interaction);
    }

    const nextQuestion = this.questions[nextQuestionIndex];

    // Show waiting message
    const waitingMessage = await interaction.channel.send({
      content: "Aguarde pela próxima pergunta ...",
      embeds: [],
    });

    setTimeout(async () => {
      if (waitingMessage.deletable) waitingMessage.delete();
      await this.sendQuestionAndCollectAnswer(interaction, nextQuestion);
    }, 2000);
  }

  private async handleWhitelistTimeout(
    interaction: any,
    whitelist: UserWhitelist
  ): Promise<void> {
    if (interaction.channel?.deletable) {
      interaction.channel.delete();
    }
    whitelist.Delete();
    this.whitelists.delete(interaction.user.id);
  }

  public async nextQuestion(interaction: any): Promise<void> {
    await this.processNextQuestion(interaction);
  }

  public async acceptManualWhitelist(
    interaction: any,
    user: any
  ): Promise<void> {
    try {
      const member = await interaction.guild.members.fetch(user.id);

      await DiscordService.removeRoleFromUser(
        member,
      settings.Setting.whitelist["PREWHITELIST-ROLE"]
      );

      await DiscordService.addRoleToUser(
        member,
      settings.Setting.whitelist["ALLOWLIST-ROLE"]
      );

      this.whitelists.delete(user.id);

      // Send logs
      const logEmbed = DiscordService.createLogEmbed(
        user.username,
        interaction.user.username,
        true
      );

      await DiscordService.sendToChannel(
        interaction.guild,
       settings.Setting.whitelist["LOGS-CHANNEL"],
        { embeds: [logEmbed] }
      );

      // Send approval message
      const approvalMessage = DiscordService.getApprovalMessage(user.id);
      await DiscordService.sendToChannel(
        interaction.guild,
       settings.Setting.whitelist["STATE-CHANNEL"],
        { content: approvalMessage }
      );

      interaction.reply({ content: "Usuário aceito", ephemeral: true });
    } catch (err) {
      console.error("Error accepting manual whitelist:", err);
      interaction.reply({
        content: "Erro ao processar aprovação",
        ephemeral: true,
      });
    }
  }

  public async denyManualWhitelist(interaction: any, user: any): Promise<void> {
    try {
      const member = await interaction.guild.members.fetch(user.id);

      await DiscordService.removeRoleFromUser(
        member,
       settings.Setting.whitelist["PREWHITELIST-ROLE"]
      );

      // Send logs
      const logEmbed = DiscordService.createLogEmbed(
        user.username,
        interaction.user.username,
        false
      );

      await DiscordService.sendToChannel(
        interaction.guild,
        settings.Setting.whitelist["LOGS-CHANNEL"],
        { embeds: [logEmbed] }
      );

      // Send denial message
      const denialMessage = DiscordService.getDenialMessage(user.id);
      await DiscordService.sendToChannel(
        interaction.guild,
       settings.Setting.whitelist["STATE-CHANNEL"],
        { content: denialMessage }
      );

      interaction.reply({ content: "Usuário negado", ephemeral: true });
    } catch (err) {
      console.error("Error denying manual whitelist:", err);
      interaction.reply({
        content: "Erro ao processar negação",
        ephemeral: true,
      });
    }
  }

  private findWhitelistByMessageId(
    messageId: string
  ): UserWhitelist | undefined {
    
    for (const whitelistdata of this.whitelists.values()) {
      if (whitelistdata.data.messageId === messageId) {
        return whitelistdata;
      }
    }
    return undefined;
  }

  public async acceptWhitelist(interaction: any): Promise<void> {
    const whitelist = this.findWhitelistByMessageId(interaction.message.id);

    if (!whitelist) {
      interaction.reply({
        content: "Whitelist não encontrada",
        ephemeral: true,
      });
      return;
    }

    try {
      const user = await interaction.guild.members.fetch(whitelist.data.userId);

      await DiscordService.removeRoleFromUser(
        user,
        settings.Setting.whitelist["PREWHITELIST-ROLE"]
      );

      await DiscordService.addRoleToUser(
        user,
        settings.Setting.whitelist["ALLOWLIST-ROLE"]
      );

      this.whitelists.delete(whitelist.data.userId);
      whitelist.Approve();

      // Update message buttons
      const disabledRow = DiscordService.createActionRow(true, true);
      interaction.message.edit({ components: [disabledRow] });

      // Envia logs e notificação de aprovação com DiscordService
      const logEmbed = DiscordService.createLogEmbed(
        user.user.username,
        interaction.user.username,
        true
      );
      await DiscordService.sendToChannel(
        interaction.guild,
        settings.Setting.whitelist["LOGS-CHANNEL"],
        { embeds: [logEmbed] }
      );

      const approvalMsg = DiscordService.getApprovalMessage(
        whitelist.data.userId
      );
      await DiscordService.sendToChannel(
        interaction.guild,
        settings.Setting.whitelist["STATE-CHANNEL"],
        { content: approvalMsg }
      );
    } catch (err) {
      console.error("Error accepting whitelist:", err);
      interaction.reply({
        content: "Erro ao processar aprovação",
        ephemeral: true,
      });
    }
  }

  public async denyWhitelist(interaction: any): Promise<void> {
    const whitelist = this.findWhitelistByMessageId(interaction.message.id);

    if (!whitelist) {
      interaction.reply({
        content: "Whitelist não encontrada",
        ephemeral: true,
      });
      return;
    }

    try {
      this.whitelists.delete(whitelist.data.userId);

      const disabledRow = DiscordService.createActionRow(true, true);
      interaction.message.edit({ components: [disabledRow] });

      const user = await interaction.guild.members.fetch(whitelist.data.userId);

      await DiscordService.removeRoleFromUser(
        user,
       settings.Setting.whitelist["PREWHITELIST-ROLE"]
      );

      // Delete whitelist from database
      await this.whitelistService.deleteWhitelistByUserId(
        whitelist.data.userId
      );
    } catch (err) {
      console.error("Error denying whitelist:", err);
      interaction.reply({
        content: "Erro ao processar negação",
        ephemeral: true,
      });
    }
  }

  //MTA

  public async setMTAWhitelist(interaction: any, user: any, id: string): Promise<void> {
    if (!this.mtaService) {
      await interaction.reply({
        content: "Serviço MTA não está disponível",
        ephemeral: true
      });
      return;
    }

    try {
      const nickname = await this.mtaService.setWhitelist(user.id, id);
      
      await this.processMTAWhitelistSet(user, nickname);
      
      await interaction.reply({
        content: "Jogador setado na whitelist com sucesso!",
        ephemeral: true
      });

    } catch (error) {
      console.error("Error in setMTAWhitelist:", error);
      
      const errorMessage = error instanceof Error ? error.message : "Erro ao setar whitelist";
      
      await interaction.reply({
        content: errorMessage,
        ephemeral: true
      });
    }
  }
  public async removeMTAWhitelist(interaction: any, id: string): Promise<void> {
    if (!this.mtaService) {
      await interaction.reply({
        content: "Serviço MTA não está disponível",
        ephemeral: true
      });
      return;
    }

    try {
      const discordUserId = await this.mtaService.removeWhitelist(id);
      
      const user = interaction.guild.members.cache.get(discordUserId);
      
      if (!user) {
        await interaction.reply({
          content: "Jogador não encontrado",
          ephemeral: true
        });
        return;
      }

      await this.processMTAWhitelistRemoval(user);
      
      await interaction.reply({
        content: "Jogador removido da whitelist com sucesso!",
        ephemeral: true
      });

    } catch (error) {
      console.error("Error in removeMTAWhitelist:", error);
      
      const errorMessage = error instanceof Error ? error.message : "Erro ao remover whitelist";
      
      await interaction.reply({
        content: errorMessage,
        ephemeral: true
      });
    }
  }
  
  public async removeMTAWhitelistByDiscordID(id: string): Promise<void> {
    if (!this.mtaService) {
      console.warn("MTA Service not available for removeMTAWhitelistByDiscordID");
      return;
    }
    try {
      await this.mtaService.removeByDiscordID(id);
    } catch (error) {
      console.error("Error in removeMTAWhitelistByDiscordID:", error);
    
    }
  }
  private async processMTAWhitelistSet(user: any, nickname: string): Promise<void> {
    try {
      // setar nick
      await DiscordService.setUserNickname(user, nickname);
      // adicionar cargo whitelist
      await DiscordService.addRoleToUser(
        user,
        settings.Setting.whitelist['WHITELIST-ROLE']
      );
      //remover pre-whitiliste
      await DiscordService.removeRoleFromUser(
        user,
        settings.Setting.whitelist["PREWHITELIST-ROLE"]
      );
    } catch (error) {
      console.error("Error processing MTA whitelist set:", error);  
    }
  }

  
  private async processMTAWhitelistRemoval(user: any): Promise<void> {
    try {
      // remove cargo whitelist
      await DiscordService.removeRoleFromUser(
        user,
        settings.Setting.whitelist['WHITELIST-ROLE']
      );
      
      // reseta pro nick original
      await DiscordService.setUserNickname(user, user.user.username);

    } catch (error) {
      console.error("Error processing MTA whitelist removal:", error);
      
    }
  }

  public  async allowToken(interaction:ModalSubmitInteraction,code:string): Promise<void> {
    if (!this.mtaService) {
      await interaction.reply({
        content: "Serviço MTA não está disponível",
        ephemeral: true
      });
      return;
    }
    const user = interaction.user
    const userId = user.id
 
    try {
     const response = await this.mtaService.aprovePlayer(userId, code);
      if(!response ){
        await interaction.reply({
          content: "Código inválido",
          ephemeral: true
        });
        return;
      }
       await this.processMTAWhitelistSet(user,response)
       
        interaction.reply({
        content: "Jogador setado na whitelist com sucesso!",
        ephemeral: true
        
    });
   
    } catch (error) {
      console.error("Error processing MTA whitelist set:", error); 
      await interaction.reply({
        content: "Erro ao setar whitelist",
        ephemeral: true
      });
      return;
    }

}

}