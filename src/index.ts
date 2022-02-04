import { Database, Guild } from "./database";
import { log } from "./logging";
import { token } from "./config.json";
import { CommandHandler } from "./handler";

import { Client, Intents } from "discord.js";

const client = new Client({
    intents: [Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILDS]
});

const database = new Database();
const commandHandler = new CommandHandler();

commandHandler.registerCommand("ping", async (message, database) => {
    await message.reply("Large Chungus says hello from TypeScript!");
});

client.once("ready", async (client) => {
    log(`b{Logged in as ${client.user.username}.}`);

    for (const guild of client.guilds.cache.values()) {
        database.insertGuild(guild.id, {
            moderators: []
        }).then(() => {});
    }
})

/* Text command handler */
client.on("messageCreate", async message => {
    if (message.content.startsWith("!")) {
        /* Weird but working code to extract command name */
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
