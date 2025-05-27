import { settings } from "#settings";
import { createEmbed, createRow } from "@magicyan/discord"
import { ButtonBuilder, ButtonStyle } from "discord.js";

export const startWhitelistPanel=()=>{
    const embed = createEmbed({
        title:"Seja bem vindo ao sistema de whitelist",
        description:
         `**Aqui vão algumas dicas para você antes de iniciar a sua ALLOWLIST:**

> *Você tem 10 minutos por pergunta para responder, caso contrário a sala se fecha e você terá que começar novamente.*

> *Cada RESPOSTA tem o limite de 4000 CARACTERES para quem TEM NITRO e 2000 CARACTERES para quem NÃO TEM NITRO.*

> *Caso você não responda alguma pergunta, sua whitelist será ANULADA e você terá que começar do zero.*

> *Caso não queira enviar sua WHITELIST para análise no final por algum erro você pode esperar o tempo de 5 MINUTOS que ela se fechará automático e você poderá refazer.*

> *Sua Whitelist será recusada se:*

> ↪ História incompleta;
> ↪ Houver Muitos erros ortográfico
> ↪ Discord não encontrado, incorreto ou com mais de uma resposta.
> ↪ Respostas curtas, ou sem sentido; 

> *Observação: Não altere o nome do Discord após realizar este formulário.*`,
        color: settings.colors.cpx,
        thumbnail: "https://i.imgur.com/FUGUdiA.gif",
      });

      const row = createRow(
        new ButtonBuilder({
          customId: "start",
          label: "Iniciar Whitelist",
          emoji: "✅",
          style: ButtonStyle.Secondary,
        }),
      );

      return {embeds:[embed],components:[row]}
}