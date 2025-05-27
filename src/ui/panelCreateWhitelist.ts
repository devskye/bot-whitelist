import { settings } from "#settings";
import { createEmbed, createRow } from "@magicyan/discord";
import { ButtonBuilder, ButtonStyle } from "discord.js";

export const panelCreateWhitelist = ()=>{
    const embed = createEmbed({
      author:{
        name:"CPX • Whitelist",
        iconURL:"https://i.imgur.com/FUGUdiA.gif"
      },
        title: "WHITELIST ",
        description:
          "**Para dar início e responder a nossa allowlist clique no botão abaixo.**",
        color: settings.colors.cpx,
        thumbnail: "https://i.imgur.com/FUGUdiA.gif",
      }); 
      
      const row = createRow(
            new ButtonBuilder({
               customId: "whitelist/createchannel",
               label: "Criar canal",
               style: ButtonStyle.Secondary
             }),
            new ButtonBuilder({
               
               label: "Ler as regras",
               style: ButtonStyle.Link,
               url: "https://discord.com/channels/1114353893120804934/1114353893120804934/1114353893120804934"
             }),
            
       
      );
      return {embeds:[embed],components:[row]}
}