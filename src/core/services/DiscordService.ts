import { ActionRowBuilder, AttachmentBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } from 'discord.js';


export class DiscordService {
    static createWhitelistEmbed(title: string, description: string, color: any = "Gold"): EmbedBuilder {
        return new EmbedBuilder()
            .setTitle(title)
            .setColor(color)
            .setDescription(description);
    }

    static createActionRow(acceptDisabled = false, denyDisabled = false): ActionRowBuilder<ButtonBuilder> {
        const accept = new ButtonBuilder()
            .setCustomId('whitelist/accept')
            .setLabel('Aceitar')
            .setStyle(ButtonStyle.Success)
            .setDisabled(acceptDisabled);

        const deny = new ButtonBuilder()
            .setCustomId('whitelist/deny')
            .setLabel('Negar')
            .setStyle(ButtonStyle.Danger)
            .setDisabled(denyDisabled);

        const row = new ActionRowBuilder<ButtonBuilder>();
        return row.addComponents(accept, deny);
    }

    static createFileAttachment(fileBuffer: Buffer, filename: string): AttachmentBuilder {
        return new AttachmentBuilder(fileBuffer, { name: filename });
    }

    static createLogEmbed(username: string, actionBy: string, approved: boolean): EmbedBuilder {
        return new EmbedBuilder()
            .setTitle('Whitelist')
            .setColor(approved ? "Green" : "Red")
            .addFields(
                {
                    name: 'Usuário',
                    value: username
                },
                {
                    name: approved ? 'Aprovado por' : 'Negado por',
                    value: actionBy
                }
            );
    }

    static createWelcomeEmbed(userDisplayAvatarURL: string): EmbedBuilder {
        const description = `**Aqui vão algumas dicas para você antes de iniciar a sua ALLOWLIST:**

> *Você tem 10 minutos por pergunta para responder, caso contrário a sala se fecha e você terá que começar novamente.*

> *Cada RESPOSTA tem o limite de 4000 CARACTERES para quem TEM NITRO e 2000 CARACTERES para quem NÃO TEM NITRO.*

> *Caso você não responda alguma pergunta, sua whitelist será ANULADA e você terá que começar do zero.*

> *Caso não queira enviar sua WHITELIST para análise no final por algum erro você pode esperar o tempo de 5 MINUTOS que ela se fechará automático e você poderá refazer.*

> *Sua Whitelist será recusada se:*

> ↪ História incompleta;
> ↪ Houver Muitos erros ortográfico
> ↪ Discord não encontrado, incorreto ou com mais de uma resposta.
> ↪ Respostas curtas, ou sem sentido; 

> *Observação: Não altere o nome do Discord após realizar este formulário.*`;

        return new EmbedBuilder()
            .setColor("#66b17d")
            .setTitle(`Seja bem vindo ao sistema de whitelist`)
            .setDescription(description)
            .setTimestamp()
            .setFooter({ 
                text: `Complexo Roleplay © Todos os direitos reservados.`, 
                iconURL: userDisplayAvatarURL 
            });
    }

    static createStartButton(): ActionRowBuilder<ButtonBuilder> {
        const startbutton = new ButtonBuilder()
            .setCustomId('start')
            .setLabel('Iniciar')
            .setStyle(ButtonStyle.Success);

        const row = new ActionRowBuilder<ButtonBuilder>();
        return row.addComponents(startbutton);
    }

    static async addRoleToUser(user: any, roleId: string): Promise<void> {
        try {
            await user.roles.add(roleId);
        } catch (error) {
            console.error('Error adding role to user:', error);
            throw error;
        }
    }

    static async removeRoleFromUser(user: any, roleId: string): Promise<void> {
        try {
            await user.roles.remove(roleId);
        } catch (error) {
            console.error('Error removing role from user:', error);
            throw error;
        }
    }

    static async sendToChannel(guild: any, channelId: string, content: any): Promise<any> {
        try {
            const channel = await guild.channels.fetch(channelId);
            return await channel.send(content);
        } catch (error) {
            console.error('Error sending message to channel:', error);
            throw error;
        }
    }

    static getApprovalMessage(userid: string): string {
        return `✅  <@${userid}>, sua WHITELIST foi **APROVADO** com sucesso em nosso servidor! `;
    }

    static getDenialMessage(userid: string): string {
        return `❌ <@${userid}>, sua WHITELIST foi **REPROVADA** em nosso servidor! Preste mais atenção nas perguntas e na elaboração da sua próxima WHITELIST.`;
    }


    static async setUserNickname(user: any, nickname: string): Promise<void> {
        try {
          await user.setNickname(nickname);
        } catch (error) {
          console.error("Bot sem permissões para setar nickname:", error);
          
        }
      }
}