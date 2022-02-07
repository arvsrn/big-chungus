import { Database } from "./database";
import { log } from "./logging";
import { token } from "./config.json";

import { Client, Collection, Intents, Message } from "discord.js";

import fs from 'fs';
import path from 'path';

type CommandFunction = (message: Message, database: Database) => Promise<void>;

const client = new Client({
    intents: [Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_WEBHOOKS]
});

/* Initiailize database and command handler */
const database = new Database();
const commandHandler: Collection<string, CommandFunction> = new Collection();

client.once("ready", async (client) => {
    const commandsPath = path.resolve(__dirname, "commands");
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

    /* Register all commands from the `commands` folder */
    for (const file of commandFiles) {
        const commandName = file.slice(0, file.length - 3);
        const { run } = await import(`${commandsPath}/${file}`);
        commandHandler.set(commandName, run);
    }    

    /* Add all guilds to the database */
    for (const guild of client.guilds.cache.values()) {
        await database.defaultGuild(guild.id);
    }

    log(`b{Logged in as ${client.user.username}.}`);
})

client.on("webhookUpdate", async (channel) => {
    let guild = await database.retrieveGuild(channel.guildId);

    /* Webhooks won't be deleted if unsafe mode is enabled */ 
    if (guild?.unsafeMode) return;

    let webhooks = await channel.fetchWebhooks();

    webhooks.forEach(async webhook => {
        try {
            await webhook.delete();
        } catch {}
    });
});

/* Text command handler */
client.on("messageCreate", async message => {
    if (message.content.startsWith("!")) {
        /* If guild does not exist in the database, add it */
        if (!await database.retrieveGuild(message.guildId as string)) await database.defaultGuild(message.guildId as string);
        
        /* Weird but working code to extract command name */
        let commandName = message.content
            .toLowerCase()
            .split(" ")[0]
            .slice(1, message.content.length);

        let executeFunction = commandHandler.get(commandName);
        if (executeFunction) await executeFunction(message, database);
    }
})

/* Go to src/config.json and put your token there */
client.login(token);
