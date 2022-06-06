import { CommandInteraction } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";

export const command = new SlashCommandBuilder()
    .setName('qrcode')
    .setDescription('Generate a QRCode')
    .addStringOption(option => option
        .setName('content')
        .setDescription('Content of the QRCode.')
        .setRequired(true)
    );

export async function run(message: CommandInteraction) {
    message.reply(`http://api.qrserver.com/v1/create-qr-code/?data=${message.options.getString('content')?.replace(/\s/g, '%20')}!&size=500x500`)
};

