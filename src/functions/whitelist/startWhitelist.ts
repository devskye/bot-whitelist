import { Whitelist } from "@prisma/client";
import { UserWhitelist } from "core/userWhitelist.js";
import { WhiteListController } from "core/WhiteListController.js";
import { ButtonInteraction } from "discord.js";
import { question } from "menus/whitelist/question.js";

export async function startWhitelistFlow(
  interaction: ButtonInteraction,
  controller: WhiteListController,
  whitelist: UserWhitelist | undefined
) {
  const questions = controller.getQuestions();

  if (!questions || questions.length === 0) {
    return interaction.reply({
      content: "❌ Não há perguntas cadastradas!",
      ephemeral: true,
    });
  }
  const channel = interaction.channel;
  if (!channel || channel.type !== 0) {
    return interaction.reply({
      content: "❌ Não foi possível iniciar a whitelist neste canal.",
      ephemeral: true,
    });
  }

  if (whitelist?.data.started) {
    interaction.reply({
      content: "Você já iniciou a whitelist",
      ephemeral: true,
    });
    return;
  }
  interaction.reply({ content: "Iniciando whitelist...", ephemeral: true });

  // Marca como iniciado, se necessário
  /*  whitelist.start(); */

  const message = await channel.send(question(questions[0].question));
  const collector = message.channel.createMessageCollector({
    filter: (i: any) => i.author.id === interaction.user.id,
    time: 10000,
  });

  collector.on("collect", async (msg: any) => {
    collector.stop();
    try {
      whitelist?.firstQuestion(msg.content, questions[0].id);

      if (message.deletable) message.delete();
      if (msg.deletable) msg.delete();
      nextQuestion(interaction, controller);
    } catch (error) {
      console.error("Error updating whitelist:", error);
    }
  });
  collector.on("end", async (collected: any) => {
    if (collected.size === 0) {
      interaction.reply({
        content: "Tempo esgotado, whitelist cancelada.",
        ephemeral: true,
      });
      return;
    }
  });
}

export async function nextQuestion(
  interaction: any,
  controller: WhiteListController
) {
  const whitelist = controller.getWhitelistFromCache(interaction.user.id);
  const questions = controller.getQuestions();
  const channel = interaction.channel;

  if (!whitelist) {
    interaction.followUp({
      content: "Você não tem um canal de whitelist",
      ephemeral: true,
    });
    return;
  }
  const nextQuestionIndex = whitelist.data.lastquestion + 1;

  if (nextQuestionIndex == questions.length) {
    return endWhitelist(interaction);
  }

  const message = await channel.send(question(questions[nextQuestionIndex].question));
  const collector = message.channel.createMessageCollector({ filter: (i: any) => i.author.id === interaction.user.id, time: 10000 });

  collector.on('collect', async (msg: any) => {
    collector.stop();
    try {
        whitelist.nextQuestion(msg.content, questions[nextQuestionIndex].id);

        if (msg.deletable) msg.delete();
        message.edit({ content: 'Aguarde pela proxima pergunta ....', embeds: []}); 

        setTimeout(() => {
            nextQuestion(interaction,controller);
            message.delete();
        }, 2000);
    } catch (error) {
        console.error('Error updating whitelist:', error);
    }
});


}
async function endWhitelist(interaction: any) {
  return interaction.reply({
    content: "Whitelist finalizada!",
    ephemeral: true,
  });
}
