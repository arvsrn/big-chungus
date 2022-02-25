import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { Database } from "../database";

export const command = new SlashCommandBuilder()
    .setName('unsafe')
    .setDescription('Enable/disable unsafe mode');

export async function run(interaction: CommandInteraction, database: Database) {
    let guild = await database.retrieveGuild(interaction.guildId as string);
    if (!guild) return;

    if (guild.antiRaid) {
        await interaction.reply("You can't enable unsafe mode when anti-raid mode is on.");
        return;
    }

    guild.unsafeMode = true;
    await database.insertGuild(interaction.guildId as string, guild);

    await interaction.reply(`${String.raw`\🔓`} **Unsafe mode has been turned on.**`);

    setTimeout(async () => {
        let guild = await database.retrieveGuild(interaction.guildId as string);
        if (!guild) return;
        await interaction.reply(`${String.raw`\🔒`} **Unsafe mode has been turned off.**`);

        guild.unsafeMode = false;
        await database.insertGuild(interaction.guildId as string, guild);
    }, 120000 /* two minutes */)
}
