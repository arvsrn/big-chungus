import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, Message } from "discord.js";
import { Database } from "../database";

export const command = new SlashCommandBuilder()
    .setName('raidmode')
    .setDescription('Enable/disable anti-raid mode');

export async function run(interaction: CommandInteraction, database: Database) {
    let guild = await database.retrieveGuild(interaction.guildId as string);
    if (!guild) return;

    let additional = "";

    /* If anti-raid will be enabled, disable unsafe mode */
    if (guild.unsafeMode && (!guild.antiRaid == true)) {
        additional = "Extra: Disabled unsafe mode.";
        guild.unsafeMode = false;
    }

    guild.antiRaid = !guild.antiRaid;

    /* Unban any members that were banned when antiraid was on */
    if (!guild.antiRaid) {
        for (const id of guild.raidCache.bannedUsers) {
            interaction.guild?.members.unban(id);
        }

        const banCacheLen = guild.raidCache.bannedUsers.length;
        
        additional += `Extra: Unbanned \`${banCacheLen}\` user${banCacheLen > 1 ? 's' : ''}.`;
        guild.raidCache.bannedUsers = [];
    }

    await database.insertGuild(interaction.guildId as string, guild);

    await interaction.reply(
        `${guild.antiRaid ? String.raw`\🔒` : String.raw`\🔓`} **Anti-raid mode has been turned ${guild.antiRaid ? 'on' : 'off'}.**\n${additional}`
    );
}
