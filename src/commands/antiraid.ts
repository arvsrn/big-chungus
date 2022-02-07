import { CommandInteraction, Message } from "discord.js";
import { Database } from "../database";

export async function run(message: Message | CommandInteraction, database: Database) {
    let guild = await database.retrieveGuild(message.guildId as string);
    if (!guild) return;

    let additional = "";

    /* If anti-raid will be enabled, disable unsafe mode */
    if (guild.unsafeMode && (!guild.antiRaid == true)) {
        additional = "Extra: Disabled unsafe mode.";
        guild.unsafeMode = false;
    }

    guild.antiRaid = !guild.antiRaid;
    await database.insertGuild(message.guildId as string, guild);

    await message.reply(
        `${guild.antiRaid ? String.raw`\🔒` : String.raw`\🔓`} **Anti-raid mode has been turned ${guild.antiRaid ? 'on' : 'off'}.**\n${additional}`
    );
}
