import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, Permissions, GuildMember } from "discord.js";
import { Database } from "../../database";
import { canModerate } from "../../utilities/permission";
import ms from 'ms';

function intoMilliseconds(input: string): number | null {
    let time = 0;
    
    for (const item of input.split(' ')) {
        let milliseconds = ms(item);
        if (!milliseconds) return null; 
        time += milliseconds
    }

    return time;
}

export const command = new SlashCommandBuilder()
    .setName('timeout')
    .setDescription('Timeout a user.')
    .addUserOption(option => option
        .setName('user')
		.setDescription('The user to timeout.')
		.setRequired(true)
    )
    .addStringOption(option => option
        .setName('time')
        .setDescription('The amount of time to timeout the user for. Defaults to 1 hour.')
    );

export async function run(interaction: CommandInteraction, database: Database) {
    const user = interaction.options.getMember('user');
    const time = interaction.options.getString('time') || '1h';
    const timeMs = intoMilliseconds(time);

    if (!interaction.inCachedGuild()) return;
    if (!interaction.member || !user) return;
    if (!(user instanceof GuildMember)) return;

    if (!timeMs) {
        await interaction.reply("An invalid time value was provided.")
    } else if (canModerate(interaction.member, user, Permissions.FLAGS.MUTE_MEMBERS)) {
        try {
            await user.timeout(timeMs);
        } catch {
            await interaction.reply("I do not have permissions to mute this user.")
        }
    } else {
        await interaction.reply(`${String.raw`\🚫`} **Error (Handling will be updated soon)**`);
    }
}