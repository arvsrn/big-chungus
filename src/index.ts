import { Database, Guild } from "./database";
import { log } from "./logging";
import { token } from "./config.json";
import { CommandHandler } from "./handler";
import ms from "ms";

import { Client, Intents } from "discord.js";

const client = new Client({
    intents: [Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_WEBHOOKS]
});

const database = new Database();
const commandHandler = new CommandHandler();

commandHandler.registerCommand("antiraid", async (message, database) => {
    let guild = await database.retrieveGuild(message.guildId as string);
    if (!guild) return;

    guild.antiRaid = !guild.antiRaid;
    await database.insertGuild(message.guildId as string, guild);

    await message.reply(
        `${guild.antiRaid ? String.raw`\🔒` : String.raw`\🔓`} **Anti-raid mode has been turned ${guild.antiRaid ? 'on' : 'off'}**`
    );
});

commandHandler.registerCommand("unsafe", async (message, database) => {
    let guild = await database.retrieveGuild(message.guildId as string);
    if (!guild) return;

    guild.unsafeMode = true;
    await database.insertGuild(message.guildId as string, guild);

    await message.reply(
        `${guild.unsafeMode ? String.raw`\🔓` : String.raw`\🔒`} **Unsafe mode has been turned ${guild.unsafeMode ? 'on' : 'off'}**`
    );

    setTimeout(async () => {
        let guild = await database.retrieveGuild(message.guildId as string);
        if (!guild) return;

        guild.unsafeMode = false;
        await database.insertGuild(message.guildId as string, guild);
    }, 120000 /* two minutes */)
});

client.once("ready", async (client) => {
    log(`b{Logged in as ${client.user.username}.}`);

    for (const guild of client.guilds.cache.values()) {
        database.defaultGuild(guild.id).then(() => {});
    }
})

client.on("webhookUpdate", async (channel) => {
    let guild = await database.retrieveGuild(channel.guildId);
    if (guild?.unsafeMode) return;

    let webhooks = await channel.fetchWebhooks();

    webhooks.forEach(async element => {
        try {
            await element.delete();
        } catch {}
    });
});

/* Text command handler */
client.on("messageCreate", async message => {
    if (message.content.startsWith("!")) {
        /* If guild does not exist in the database, add it. */
        if (!await database.retrieveGuild(message.guildId as string)) await database.defaultGuild(message.guildId as string);
        
        /* Weird but working code to extract command name. */
        let commandName = message.content
            .toLowerCase()
            .split(" ")[0]
            .slice(1, message.content.length);

        let executeFunction = commandHandler.retrieveCommand(commandName);
        if (executeFunction) await executeFunction(message, database);
    }
})

/* Go to src/config.json and put your token there. */
client.login(token);
