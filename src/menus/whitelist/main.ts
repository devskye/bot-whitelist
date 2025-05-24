import { createEmbed, createRow } from "@magicyan/discord";
import { ButtonBuilder, ButtonStyle } from "discord.js";
import { create } from "domain";

export const whitelistPanel = ()=>{
    const embed = createEmbed({
      author:{
        name:"CPX • Allowlist",
        iconURL:"https://i.imgur.com/FUGUdiA.gif"
      },
        title: "ALLOWLIST ",
        description:
          "*Clique no botão para iniciar o processo de allowlist*.\n\n" +
          "> • Caso ocorra algum problema, contacte a **STAFF**\n" +
          " > • Para obter seu ID, basta conectar no servidor usando a sala <#1119617693532835890> \n",
        color: "Gold",
        thumbnail: "https://i.imgur.com/FUGUdiA.gif",
      }); 
      
      const row = createRow(
            new ButtonBuilder({
               customId: "whitelist/start",
               label: "Iniciar Whitelist",
               emoji: "✅",
               style: ButtonStyle.Secondary
             }),
       
      );
      return {embeds:[embed],components:[row]}
}