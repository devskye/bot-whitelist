import { ButtonBuilder, ButtonStyle } from "discord.js";
import { settings } from "#settings";
import { brBuilder, createEmbed, createRow } from "@magicyan/discord";

const fields = [
  { label: "WHITELIST-CHANNEL", path: "whitelist.WHITELIST-CHANNEL" },
  { label: "WHITELIST-ROLE", path: "whitelist.WHITELIST-ROLE" },
  { label: "PREWHITELIST-ROLE", path: "whitelist.PREWHITELIST-ROLE" },
  { label: "LOGS-CHANNEL", path: "whitelist.LOGS-CHANNEL" },
] as const;

export const panelSettings = () => {
  const embed = createEmbed({
    title: "Configurações da Whitelist System",
    description: brBuilder(
      "Selecione abaixo o campo de configuração que deseja editar.",
      "",
      "- Cada botão representa uma configuração importante do sistema de whitelist.",
      "- Você poderá digitar o novo valor diretamente após selecionar o item desejado.",
      "",
      "⚠️ **ATENÇÂO:** *Certifique-se de digitar corretamente o novo valor.",
      "Especialmente IDs de canais ou cargos, pois valores incorretos podem causar falhas no sistema.*"
    ),
    color: settings.colors.cpx,
    
  });
  const row = createRow(
    fields.map(
      (field) =>
        new ButtonBuilder({
          customId: `edit_${field.label}`,
          label: field.label,
          emoji: "⚙️",
          style: ButtonStyle.Secondary,
        })
    )
  );
  return { embeds: [embed], components: [row] };
};
