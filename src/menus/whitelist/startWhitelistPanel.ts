import { settings } from "#settings";
import { createEmbed, createRow } from "@magicyan/discord"
import { ButtonBuilder, ButtonStyle } from "discord.js";

export const startWhitelistPanel=()=>{
    const embed = createEmbed({
        title:"Seja bem vindo ao sistema de whitelist",
        description:
         `**Aqui vão algumas dicas para você antes de iniciar a sua ALLOWLIST:**\n\n> *Você tem 10 minutos por pergunta para responder, caso contrário a sala se fecha e você terá que começar novamente.*\n\n> *Cada RESPOSTA tem o limite de 4000 CARACTERES para quem TEM NITRO e 2000 CARACTERES para quem NÃO TEM NITRO.*\n\n> *Caso você não responda alguma pergunta, sua whitelist será ANULADA e você terá que começar do zero.*\n\n> *Caso não queira enviar sua WHITELIST para análise no final por algum erro você pode esperar o tempo de 5 MINUTOS que ela se fechará automático e você > > poderá refazer.*\n\n> *Sua Whitelist será recusada se:*\n\n> ↪ História incompleta;\n> ↪ Houver Muitos erros ortográfico\n> ↪ Discord não encontrado,
          incorreto ou com mais de uma resposta.\n> ↪ Respostas curtas, ou sem sentido; \n\n> *Observação: Não altere o nome do Discord após realizar este formulário.*\n`,
        color: settings.colors.nitro,
        thumbnail: "https://i.imgur.com/FUGUdiA.gif",
      });

      const row = createRow(
        new ButtonBuilder({
          customId: "whitelist/startconfirm",
          label: "Iniciar Whitelist",
          emoji: "✅",
          style: ButtonStyle.Secondary,
        }),
      );

      return {embeds:[embed],components:[row]}
}