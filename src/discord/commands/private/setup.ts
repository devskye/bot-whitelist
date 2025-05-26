import { createCommand } from "#base";
import { res } from "#functions";
import { ApplicationCommandOptionType, ApplicationCommandType, ChannelType, codeBlock } from "discord.js";
import { panelAllowlist } from "ui/panelAllowlist.js";
import { panelCreateWhitelist } from "ui/panelCreateWhitelist.js";

createCommand({
  name: "setup",
  description: "Gerenciar perguntas da whitelist",
  type: ApplicationCommandType.ChatInput,
  options: [
    {
      name: "whitelist",
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
    {
      name: "allowlist",
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
        case"whitelist":{
           await interaction.deferReply({ephemeral:true});
           const channel = options.getChannel("canal",true,[ChannelType.GuildText]);
           channel.send(panelCreateWhitelist())
           .then(message=>{
             interaction.editReply(res.success(`✔️ O painel de whitlist foi enviado com sucesso! ${message.url}`))
           })
           .catch(err =>{
             interaction.editReply(res.danger(`❌ Ocorreu um erro ao enviar o painel de whitelist! ${codeBlock(err)}`))
           } )

           return;
        }
        case"allowlist":{
          await interaction.deferReply({ephemeral:true});
          const channel = options.getChannel("canal",true,[ChannelType.GuildText]);
          channel.send(panelAllowlist())
          .then(message=>{
            interaction.editReply(res.success(`✔️ O painel de allowlist foi enviado com sucesso! ${message.url}`))
          })
          .catch(err =>{
            interaction.editReply(res.danger(`❌ Ocorreu um erro ao enviar o painel de allow! ${codeBlock(err)}`))
          } )

        }
     }
},

})