import { createCommand } from "#base";
import { res } from "#functions";
import { ApplicationCommandOptionType, ApplicationCommandType, ChannelType, codeBlock } from "discord.js";
import { panelCreateWhitelist } from "ui/panelCreateWhitelist.js";

createCommand({
  name: "setup",
  description: "Gerenciar perguntas da whitelist",
  type: ApplicationCommandType.ChatInput,
  options: [
    {
      name: "setupwhitelist",
      description: "Selecione o canal para enviar o painel de whitelist",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "canal",
          description: "Canal para enviar o painel de whitelist",
          type: ApplicationCommandOptionType.Channel,
          required: true,
        },
      ],
    },
],
async run(interaction) {
    const { options } = interaction;
    switch(options.getSubcommand(true)){
        case"setupwhitelist":{
           await interaction.deferReply({ephemeral:true});
           const channel = options.getChannel("canal",true,[ChannelType.GuildText]);
           channel.send(panelCreateWhitelist())
           .then(message=>{
             interaction.editReply(res.success(`✔️ O painel de tickets foi enviado com sucesso! ${message.url}`))
           })
           .catch(err =>{
             interaction.editReply(res.danger(`❌ Ocorreu um erro ao enviar o painel de tickets! ${codeBlock(err)}`))
           } )

           return;
        }
     }
},
})