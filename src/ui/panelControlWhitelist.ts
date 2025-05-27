import {  createEmbed, createRow } from "@magicyan/discord"
import { AttachmentBuilder, ButtonBuilder, ButtonStyle } from "discord.js"



export const panelControlWhitelist =(fileBuffer:Buffer, filename: string,/* acceptDisabled = false, denyDisabled = false */username:string) => {
    const file = new AttachmentBuilder(fileBuffer, { name: filename });
       
    const embed = createEmbed({
      title:"Controle de Whitelist",
      description:"**Clique em um dos botões abaixo para aceitar ou negar a whitelist do usuário.** \n - # Whitelist finalizada por  " + username,
      thumbnail: {
        url: "https://cdn.discordapp.com/attachments/1114353893120804934/1114354159170103316/logo.png"
      }
})
    const row = createRow(
      new ButtonBuilder({
        customId:"whitelist/accept",
        label:"Aceitar",
        style:ButtonStyle.Success,
        disabled:false
}),
      new ButtonBuilder({
        customId:"whitelist/deny",
        label:"Negar",
        style:ButtonStyle.Danger,
        disabled:false
})
    )
    return {components:[row],files:[file],embeds:[embed]}
}

