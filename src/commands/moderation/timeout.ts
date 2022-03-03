import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { Database } from "../../database";

export const command = new SlashCommandBuilder()
    .setName('timeout')
    .setDescription('Timeout a user.');

export async function run(interaction: CommandInteraction, database: Database) {
    interaction.reply("This works!");
}