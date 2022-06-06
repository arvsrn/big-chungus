import mexp from 'math-expression-evaluator';
import { CommandInteraction } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";

export const command = new SlashCommandBuilder()
    .setName('calculate')
    .setDescription('Calculate a mathematical expression')
    .addStringOption(option => option
        .setName('expression')
        .setDescription('The expression you want to calculate.')
        .setRequired(true)
    );

export async function run(message: CommandInteraction) {
    const expression = message.options.getString('expression');

    try {
        const result = mexp.eval(expression || '');
        message.reply(`\`${result}\``);
    } catch (err) {
        message.reply('Invalid expression')
    }
};

