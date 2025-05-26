import { settings } from "#settings";
import { brBuilder, createEmbed, createRow } from "@magicyan/discord";
import { ButtonBuilder, ButtonStyle } from "discord.js";

export const panelAllowlist = ()=>{
    const embed = createEmbed({
      author:{
        name:"CPX • Allowlist",
        iconURL:"https://i.imgur.com/FUGUdiA.gif"
      },
        title: "ALLOWLIST ",
        description:"> - Para vincular o seu Id ao discord envie o TOKEN informado no jogo.\n > - Após enviar o seu **TOKEN** aguarde a liberação do sistema.\n > - Você não sabe qual é seu **TOKEN**? Entre no servidor e aguarde o aviso na sua tela!"
           /*  "> - Para vincular o seu Id ao discord envie o **TOKEN** informado no jogo.",
            "> - Após enviar o seu **TOKEN** aguarde a liberação do sistema.",
            "> - Você não sabe qual é seu TOKEN? Entre no servidor e aguarde o aviso na sua tela!", */
        ,
         
        color:settings.colors.cpx,
        thumbnail: "https://i.imgur.com/FUGUdiA.gif",
      });

      const row = createRow(
            new ButtonBuilder({
               customId: "whitelist/allow",
               label: "Aprovar",
               emoji: "✅",
               style: ButtonStyle.Secondary

            })
        )
        return {
            embeds:[embed],
            components:[row]
        }
    }