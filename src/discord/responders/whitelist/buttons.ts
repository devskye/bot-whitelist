import { createResponder, ResponderType } from "#base";
import { createLinkButton, createModalFields, createRow } from "@magicyan/discord";
import { TextInputStyle } from "discord.js";


createResponder({
  customId: "whitelist/:action",
  types: [ResponderType.Button],
  cache: "cached",
  async run(interaction, { action }) {
    const { client} = interaction;
    const controller = client.WhiteListManager
  
console.log("actionButton",action)
    switch (action) {
      case "createchannel": {
        try {
            const channel = await controller.createWhitelistChannel(interaction);
            if (!channel) return; 
    
            const row = createRow(
                createLinkButton({ url:channel.url, label: "Acessar Ticket" })
            );
    
            await interaction.reply({
                content: "Ticket criado com sucesso!",
                ephemeral: true,
                components: [row],
            });
        } catch (error) {
            console.error(error);
            if (!interaction.replied && !interaction.deferred) {
                await interaction.reply({
                    content: "❌ Ocorreu um erro ao criar seu ticket. Tente novamente mais tarde.",
                    ephemeral: true,
                });
            }
        }
        return;
    }
    case"allow":{
        interaction.showModal({
            customId: "modal/allowlist",
            title: "Liberar",
            components: createModalFields({
              token:{
                    label: "Código",
                    style: TextInputStyle.Short,
                    required: true,
                }, 
            })
        });
    }
   case"deny":{
    client.WhiteListManager.denyWhitelist(interaction)
   }
   case"accept":{
    client.WhiteListManager.acceptWhitelist(interaction)
    }
  }
  }
});
