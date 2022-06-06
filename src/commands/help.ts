import { CommandInteraction, MessageEmbed } from "discord.js";
import { Database } from "../database";
import { SlashCommandBuilder } from "@discordjs/builders";
import { lines } from "../utilities/format";

export const command = new SlashCommandBuilder()
    .setName('help')
    .setDescription('Get some help');

export async function run(message: CommandInteraction, database: Database) {
    await message.reply(lines(
        "Press \`/\` to view commands."
    ));
};
