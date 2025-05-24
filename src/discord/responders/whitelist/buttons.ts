import { createResponder, ResponderType } from "#base";
import { createLinkButton, createRow } from "@magicyan/discord";
import {

  GuildTextBasedChannel,
 
} from "discord.js";


createResponder({
  customId: "whitelist/:action",
  types: [ResponderType.Button],
  cache: "cached",
  async run(interaction, { action }) {
    const { client} = interaction;
    const controller = client.WhiteListManager
  

    switch (action) {
      case "start": {
        try {
            const channel = await controller.createWhitelistChannel(interaction);
            if (!channel) return; // já tratou o reply dentro da função
    
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
    }
  },
});
