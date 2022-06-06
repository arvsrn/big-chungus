import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, Permissions, GuildMember } from "discord.js";
import { Database } from "../../database";
import { canModerate } from "../../utilities/permission";

export const command = new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Ban a user.')
    .addUserOption(option => option
        .setName('user')
		.setDescription('The user to ban.')
		.setRequired(true)
    )
    .addStringOption(option => option
        .setName('reason')
        .setDescription('The reason you want to ban them.')
    );

export async function run(interaction: CommandInteraction, database: Database) {
    const user = interaction.options.getMember('user');
    const reason = interaction.options.getString('reason') || "No reason provided.";

    if (!interaction.inCachedGuild()) return;
    if (!interaction.member || !user) return;
    if (!(user instanceof GuildMember)) return;

    if (canModerate(interaction.member, user, Permissions.FLAGS.BAN_MEMBERS)) {
        try {
            await user.ban({reason: reason});
        } catch {
            await interaction.reply("I do not have permissions to ban this user.")
        }
    } else {
        await interaction.reply(`${String.raw`\🚫`} **Error (Handling will be updated soon)**`);
    }
}