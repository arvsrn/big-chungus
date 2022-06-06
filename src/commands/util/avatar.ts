import { CommandInteraction } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";

export const command = new SlashCommandBuilder()
    .setName('avatar')
    .setDescription('Steal someone\'s profile pic')
    .addUserOption(option => option
        .setName('user')
        .setDescription('Target')
    );

export async function run(message: CommandInteraction) {
    const member = message.options.getUser('user') || message.user;
    message.reply(member.displayAvatarURL());
};

