/*  import { createCommand } from "#base";
import { res } from "#functions";
import { settings } from "#settings";
import { findMember } from "@magicyan/discord";
import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
  codeBlock,
} from "discord.js";
import Settings from "fast-glob/out/settings.js";
import { fetchGuildMember, safeModifyRoles } from "functions/utils/discord.js";

createCommand({
  name: "whitelist",
  description: "Gerenciar whitelist",
  type: ApplicationCommandType.ChatInput,
  options: [
    {
      name: "set",
      description: "Adicionar ou setar usuário na whitelist",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "id",
          description: "ID do jogador",
          type: ApplicationCommandOptionType.Integer,
          required: true,
        },
        {
          name: "user",
          description: "Usuário a ser setado",
          type: ApplicationCommandOptionType.User,
          required: true,
        },
      ],
    },
    {
      name: "remove",
      description: "Remover usuário da whitelist pelo ID",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "id",
          description: "ID do jogador",
          type: ApplicationCommandOptionType.Integer,
          required: true,
        },
      ],
    },
    {
      name: "fix",
      description: "Apagar whitelist pelo usuário",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "user",
          description: "Usuário a apagar",
          type: ApplicationCommandOptionType.User,
          required: true,
        },
      ],
    },
    {
      name: "deny",
      description: "Reprovar whitelist manualmente",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "user",
          description: "Usuário a reprovar",
          type: ApplicationCommandOptionType.User,
          required: true,
        },
      ],
    },
    {
      name: "approve",
      description: "Aprovar whitelist manualmente",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "user",
          description: "Usuário a aprovar",
          type: ApplicationCommandOptionType.User,
          required: true,
        },
      ],
    },
  ],

  async run(interaction) {
    const { options, client, guild } = interaction;
    const manager = client.whiteListController; // variável para o whitelist manager
    const subcommand = options.getSubcommand();
    const user = options.getUser("user", true);

    try {
      switch (subcommand) {
        case "set": {
          const id = options.getInteger("id", true);
          const user = options.getUser("user", true);
          const member = guild.members.cache.get(user.id);

          await manager.setWhitelist(interaction, member, id);

          await interaction.reply(
            res.success(`Usuário ${user.tag} setado na whitelist com ID ${id}.`)
          );
          return;
        }

        case "remove": {
          const id = options.getInteger("id", true);

          await manager.removeWhitelist(interaction, id);

          await interaction.reply(
            res.success(`Whitelist com ID ${id} removida.`)
          );
          return;
        }

        case "fix": {
          const user = options.getUser("user", true);

          await manager.deleteWhitelist(interaction, user);

          await interaction.reply(
            res.success(`Whitelist do usuário ${user.tag} apagada.`)
          );
          return;
        }

        case "deny": {
          const user = options.getUser("user", true);

          await manager.denyManualWhitelist(interaction, user);

          await interaction.reply(
            res.success(`Whitelist do usuário ${user.tag} reprovada.`)
          );
          return;
        }

        case "approve": {
          const member = findMember(guild).byId(user.id);

          if (!member) {
            await interaction.reply(res.danger("❌ Membro não encontrado."));
            return;
          }
          //buscar os cargos na guild com findRole
          const result = await safeModifyRoles(
            member,
            settings.Setting.whitelist["PREWHITELIST-ROLE"],
            settings.Setting.whitelist["ALLOWLIST-ROLE"]
          );

          if (!result.success) {
            await interaction.reply(res.danger(`❌ ${result.error}`));
            return;
          }

          
          await interaction.reply(
            res.success(`Whitelist do usuário ${user.tag} aprovada.`)
          );
          return;
        }

        default: {
          await interaction.reply(res.danger("Subcomando inválido."));
        }
      }
    } catch (error) {
      console.error(error);
      await interaction.reply(
        res.danger(`Erro ao executar comando:\n${codeBlock(String(error))}`)
      );
    }
  },
});
 */