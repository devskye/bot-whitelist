
import { createCommand } from "#base";
import { ApplicationCommandType, ComponentType } from "discord.js";
import { panelSettings } from "ui/panelSettings.js";

import { res } from "#functions";
import { setConfigValue } from "functions/utils/configGuild.js";
import { fields } from "data/settings.js";

createCommand({
  name: "settings",
  description: "Configurações do servidor",
  type: ApplicationCommandType.ChatInput,

  async run(interaction) {
    const msg = await interaction.reply(panelSettings());

    const collector = msg.createMessageComponentCollector({
      componentType: ComponentType.Button,
      time: 60000,
    });

    collector.on("collect", async (btnInteraction) => {
      
      if (btnInteraction.user.id !== interaction.user.id) {
        return btnInteraction.reply({
          content: "Apenas quem usou o comando pode responder.",
          ephemeral: true,
        });
      }

      const field = fields.find(
        (f) => `edit_${f.label}` === btnInteraction.customId
      );
      if (!field) {
        return btnInteraction.reply({
          content: "Campo inválido.",
          ephemeral: true,
        });
      }

      try {
       
        await btnInteraction.deferReply({ ephemeral: true });

        if (!interaction.channel || !("awaitMessages" in interaction.channel)) {
          return btnInteraction.followUp({
            content: "Não consegui acessar o canal para coletar a mensagem.",
            ephemeral: true,
          });
        }
       
        await btnInteraction.editReply(
          res.developer(`✏️ Digite o novo valor para **${field.label}**:`)
        );

       
        const collected = await interaction.channel.awaitMessages({
          filter: (m) => m.author.id === interaction.user.id,
          max: 1,
          time: 30000,
          errors: ["time"],
        });

        const resposta = collected.first();
        if (!resposta) {
          return btnInteraction.followUp({
            content: "Nenhuma resposta recebida.",
            ephemeral: true,
          });
        }

      
        setConfigValue(field.path, resposta.content);

        await btnInteraction.followUp({
          content: `✅ Valor de **${field.label}** atualizado para: \`${resposta.content}\``,
          ephemeral: true,
        });
      } catch (error) {
        console.error("Erro na coleta de mensagem:", error);
        await btnInteraction.followUp({
          content: "⏰ Tempo para responder expirou ou ocorreu um erro.",
          ephemeral: true,
        });
      }
    });
  },
});
