import { CommandInteraction, MessageEmbed } from "discord.js";
import { Database } from "../database";
import { SlashCommandBuilder } from "@discordjs/builders";

export const command = new SlashCommandBuilder()
    .setName('info')
    .setDescription('Information about the bot');

export async function run(message: CommandInteraction, database: Database) {
    await message.reply("- Have a question? [Join the support server](<https://discord.gg/ycngKFV9>).\n- Found a bug? [Report it on the github issues page](<https://github.com/duclit/big-chungus/issues>).");
};
