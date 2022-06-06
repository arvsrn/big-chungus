import { Database } from "./database";
import { log } from "./logging";
import { token } from "./config.json";
import { isBadMessage, replaceValues } from "./utilities/messages";

import { Client, Collection, CommandInteraction, Intents } from "discord.js";

import fs from 'fs';
import path from 'path';

type CommandFunction = (interaction: CommandInteraction, database: Database) => Promise<void>;

const client = new Client({
    intents: [
        Intents.FLAGS.GUILD_MESSAGES, 
        Intents.FLAGS.GUILDS, 
        Intents.FLAGS.GUILD_WEBHOOKS, 
        Intents.FLAGS.GUILD_MEMBERS
    ]
});

/* Initiailize database and command handler */
const database = new Database();
const commandHandler: Collection<string, CommandFunction> = new Collection();

/* Regular expression to match URLs */
const linksRegex = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/

/* Helper function to recursively scan all the files and sub-directories and register the commands */
function registerCommands(dir: string) {
    const commandFiles = fs.readdirSync(dir).filter(file => file.endsWith('.js'));
    
    for (const file of commandFiles) {
        const data = require(path.join(dir, file));
        commandHandler.set(data.command.name, data.run)
    }

    const commandFolders = fs.readdirSync(dir)
        .filter(file => fs.lstatSync(path.join(dir, file)).isDirectory());
    
    for (const commandFolder of commandFolders) {
        registerCommands(path.join(dir, commandFolder));
    }
}

client.once("ready", async (client) => {
    const commandsPath = path.resolve(__dirname, "commands");
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

    /* Register all commands from the `commands` folder */
    registerCommands(path.join(__dirname, "commands"));   

    /* Add all guilds to the database */
    for (const guild of client.guilds.cache.values()) {
        await database.defaultGuild(guild);
    }

    log(`b{Logged in as ${client.user.username}.}`);
});

client.on("webhookUpdate", async (channel) => {
    let guild = await database.retrieveGuild(channel.guildId);

    /* Webhooks won't be deleted if unsafe mode is disabled */
    if (guild?.unsafeMode) {
        /* Refresh whitelist for this guild as new webhooks may have been created */
        for (const webhook of await channel.guild.fetchWebhooks()) {
            guild.webhooksWhitelist.push(webhook[1].id);
        }

        database.insertGuild(channel.guildId, guild);
        return;
    };

    let webhooks = await channel.fetchWebhooks();

    webhooks.forEach(async webhook => {
        try {
            await webhook.delete();
        } catch {}
    });
});

client.on("channelCreate", async channel => {
    await database.retrieveGuild(channel.guild.id);
});

client.on("guildMemberAdd", async (member) => {
    let guild = await database.retrieveGuild(member.guild.id);

    /* Ban the member if anti-raid is enabled, and add them to the ban cache */
    if (guild?.antiRaid) {
        await member.ban({ reason: "[Big Chungus] Anti-raid was enabled." });
        guild.raidCache.bannedUsers.push(member.id);

        database.insertGuild(member.guild.id, guild);
    }

    /* Kick any ban-evaders */
    else if (guild?.banCache.includes(member.id)) {
        await member.kick();
    }
});

client.on("guildBanAdd", async (ban) => {
    let guild = await database.retrieveGuild(ban.guild.id);
    if (!guild) return;

    /* If member was not banned due to antiraid mode, add them to the server ban cache */
    if (!guild.raidCache.bannedUsers.includes(ban.user.id)) {
        guild.banCache.push(ban.user.id);
        database.insertGuild(ban.guild.id, guild);
    }
});

client.on("channelCreate", async (channel) => {
    let guild = await database.retrieveGuild(channel.guild.id);
    if (!guild) return;

    if (guild.antiRaid) await channel.delete("[Big Chungus] Anti-raid was enabled.");
});

client.on("roleCreate", async (role) => {
    let guild = await database.retrieveGuild(role.guild.id);
    if (!guild) return;

    if (guild.antiRaid) await role.delete("[Big Chungus] Anti-raid was enabled.");
});

client.on("guildCreate", async (guild) => await database.defaultGuild(guild));
client.on("guildDelete", async (guild) => await database.removeGuild(guild.id as string));

client.on("messageCreate", async message => {
    if (!message.guildId || message.author.bot) return;
    let guild = await database.retrieveGuild(message.guildId);

    if (message.content.search(linksRegex) > 0 && guild?.messageFilters.links) {
        await message.delete();
        await message.channel.send(
            replaceValues(guild.messageFilters.messages.links, message)
        );
        return;
    } else if (
        (message.content.includes("discord.gg/") || message.content.includes(".gg/")) 
        && guild?.messageFilters.discordInvites
    ) {
        await message.delete();
        await message.channel.send(
            replaceValues(guild.messageFilters.messages.discordInvites, message)
        );
        return;
    } else if (isBadMessage(message.content, guild?.messageFilters.blacklist ? guild?.messageFilters.blacklist : [])) {
        await message.delete();
        await message.channel.send(
            replaceValues(guild?.messageFilters.messages.blacklist as string, message)
        );
        return;
    } else if ((message.content.replace(/(.)\1{5,}/gm, "$1") != message.content) && guild?.messageFilters.spam) {
        await message.delete();
        await message.channel.send(
            replaceValues(guild?.messageFilters.messages.spam as string, message)
        );
        return;
    }
})

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    let executeFunction = commandHandler.get(interaction.commandName);
    if (executeFunction) await executeFunction(interaction, database);
});

/* Go to src/config.json and put your token there */
client.login(token);
