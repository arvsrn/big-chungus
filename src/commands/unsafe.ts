import { CommandInteraction, Message } from "discord.js";
import { Database } from "../database";

export async function run(message: Message | CommandInteraction, database: Database) {
    let guild = await database.retrieveGuild(message.guildId as string);
    if (!guild) return;

    if (guild.antiRaid) {
        await message.reply("You can't enable unsafe mode when anti-raid mode is on.");
        return;
    }

    guild.unsafeMode = true;
    await database.insertGuild(message.guildId as string, guild);

    await message.reply(`${String.raw`\🔓`} **Unsafe mode has been turned on.**`);

    setTimeout(async () => {
        let guild = await database.retrieveGuild(message.guildId as string);
        if (!guild) return;
        await message.reply(`${String.raw`\🔒`} **Unsafe mode has been turned off.**`);

        guild.unsafeMode = false;
        await database.insertGuild(message.guildId as string, guild);
    }, 120000 /* two minutes */)
}
