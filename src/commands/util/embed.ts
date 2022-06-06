import mexp from 'math-expression-evaluator';
import { CommandInteraction, MessageEmbed } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";

export const command = new SlashCommandBuilder()
    .setName('embed')
    .setDescription('Send an embed')
    .addStringOption(option => option
        .setName('title')
        .setDescription('Title of the embed.')
    )
    .addStringOption(option => option
        .setName('description')
        .setDescription('Description of the embed.')
    )
    .addStringOption(option => option
        .setName('color')
        .setDescription('Color of the embed.')
        .setChoices([['Blue', '5865F2'], ['Green', '57F287'], ['Yellow', 'FEE75C'], ['Pink', 'EB459E'], ['Red', 'ED4245'], ['White', 'FFFFFF'], ['Transparent', '2F3136']])
    )
    .addStringOption(option => option
        .setName('footer')
        .setDescription('Footer of the embed.')
    )
    .addChannelOption(option => option
        .setName('channel')
        .setDescription('The channel you want to send this embed in.')
    );

export async function run(message: CommandInteraction) {
    const embed = new MessageEmbed()
        .setDescription(message.options.getString('description') || '')
        .setFooter(message.options.getString('footer') || '')
        .setColor(parseInt(message.options.getString('color') || '000000', 16) || 0x000000)
        .setTitle(message.options.getString('title') || '');
    
    await message.reply({embeds: [embed]})
};
