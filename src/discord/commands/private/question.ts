import { question } from 'ui/question.js';
import { createCommand } from "#base";
import { res } from "#functions";
import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
  codeBlock,
} from "discord.js";

createCommand({
  name: "question",
  description: "Gerenciar perguntas da whitelist",
  type: ApplicationCommandType.ChatInput,
  options: [
    {
      name: "create",
      description: "Criar uma nova pergunta",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "question",
          description: "Texto da pergunta",
          type: ApplicationCommandOptionType.String,
          required: true,
        },
      ],
    },
    {
      name: "edit",
      description: "Editar uma pergunta existente",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "id",
          description: "ID da pergunta a ser editada",
          type: ApplicationCommandOptionType.Integer,
          required: true,
        },
        {
          name: "question",
          description: "Novo texto da pergunta",
          type: ApplicationCommandOptionType.String,
          required: true,
        },
      ],
    },
    {
      name: "remove",
      description: "Remover uma pergunta",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "id",
          description: "ID da pergunta a ser removida",
          type: ApplicationCommandOptionType.Integer,
          required: true,
        },
      ],
    },
    {
      name: "list",
      description: "Listar todas as perguntas",
      type: ApplicationCommandOptionType.Subcommand,
    },
  ],

  async run(interaction) {
    const { options, client } = interaction;
    const controller = client.WhiteListManager
    const subcommand = options.getSubcommand();

    try {
      switch (subcommand) {
        case "create": {
          const questionText = options.getString("question", true);
          const result = await controller.addQuestion(questionText);
       
 
          await interaction.reply(
            res.success(" ## ✅ Pergunta criada com sucesso!", {
              fields: [
                {
                  name: "🆔 ID",
                  value: `\`\`\`${result.id}\`\`\``,
                  inline: true,
                },
                {
                  name: "❓ Pergunta",
                  value: `\`\`\`${result.question}\`\`\``,
                  inline: true,
                },
              ],
            })
          );
          break;
        }

        case "edit": {
          const id = options.getInteger("id", true);
          const newQuestion = options.getString("question", true);
          const result = await controller.editQuestion(id,newQuestion);

          await interaction.reply(
            res.success("Pergunta atualizada:", {
              fields: [
                { name: "🆔 ID", value: `\`${result.id}\``, inline: true },
                {
                  name: "✏️ Nova Pergunta",
                  value: `\`${result.question}\``,
                  inline: true,
                },
              ],
            })
          );
          break;
        }

        case "remove": {
          const id = options.getInteger("id", true);
          await controller.deleteQuestion(id)
          

          await interaction.reply(
            res.success("Pergunta removida com sucesso:", {
              fields: [{ name: "🆔 ID", value: `\`${id}\`` }],
            })
          );

          break;
        }

        case "list": {
          const questions =  controller.questions
          if (!questions.length) {
            await interaction.reply(
              res.warning("Nenhuma pergunta cadastrada.")
            ); 
            break;
          }

          const fields = questions.map((q) => ({
            name: "🆔 ID",
            value: `\`${q.id}\`\n❓ ${q.question}`,
          }));
          await interaction.reply(
            res.success("Perguntas cadastradas:", { fields })
          );
          break;
        }

        default:
          await interaction.reply(res.danger("Subcomando inválido."));
      }
    } catch (error) {
      await interaction.reply(res.danger(`Erro:\n${codeBlock(String(error))}`));
    }
  },
});
