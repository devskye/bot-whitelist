import { Guild, GuildMember, User } from "discord.js";


/**
 * Tenta remover e adicionar roles com tratamento de erro
 */
export async function safeModifyRoles(
  member: GuildMember,
  removeRoleId: string,
  addRoleId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await member.roles.remove(removeRoleId);
    await member.roles.add(addRoleId);
    return { success: true };
  } catch (err) {
    console.error("Erro ao modificar roles:", err);
    return { success: false, error: "Erro ao modificar as permissões do membro." };
  }
}
