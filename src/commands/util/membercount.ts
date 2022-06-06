import { CommandInteraction } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";

export const command = new SlashCommandBuilder()
    .setName('membercount')
    .setDescription('Amount of members in the server')

export async function run(message: CommandInteraction) {
    if (!message.guild) return;
    message.reply(`${message.guild.memberCount}`);
};

