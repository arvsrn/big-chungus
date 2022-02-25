import { CommandInteraction, MessageEmbed } from "discord.js";
import { Database } from "../database";
import { SlashCommandBuilder } from "@discordjs/builders";

export const command = new SlashCommandBuilder()
    .setName('help')
    .setDescription('Get some help');

export async function run(message: CommandInteraction, database: Database) {
    const helpEmbed = new MessageEmbed()
        .setColor("#5855f2")
        .setAuthor({ 
            name: "Big Chungus", 
            iconURL: "https://cdn.discordapp.com/attachments/758315694940749864/936667985341476914/shadowMoOOoOoO.png" 
        })
        .setDescription(
            "**AntiRaid**\n`antiraid` - Enable anti-raid mode.\n" + 
            "`unsafe` - Enable unsafe mode, allows webhooks to be created in the server. Unsafe mode is automatically disabled after two miutes." +
            "\n**Moderation**\n`strike` - Strike a user"
        );
    
    await message.reply({ embeds: [helpEmbed] })
};
