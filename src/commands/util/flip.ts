import { CommandInteraction } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";

export const command = new SlashCommandBuilder()
    .setName('flip')
    .setDescription('Do a coin flip!')

export async function run(message: CommandInteraction) {
    message.reply(`${Math.random() > 0.5 ? 'Heads' : 'Tails'}`);
};
