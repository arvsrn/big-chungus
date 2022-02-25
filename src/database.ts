import { Guild as DiscordGuild } from "discord.js";
import Keyv from "keyv";

/* Stores all the data that needs to be cached when anti-raid mode is turned on */
export interface RaidCache {
    bannedUsers: string[],
}

export interface SpamFilter {}

export interface MessageFilter {
    blacklist: string[],
    discordInvites: boolean,
    links: boolean,

    /* The messages to send when a message is deleted */
    messages: {
        blacklist: string,
        discordInvites: string,
        links: string
    },

    spamFilter: SpamFilter,
}

/* Represents a discord guild and is used in the database */
export interface Guild {
    moderators: string[],

    antiRaid: boolean,
    unsafeMode: boolean,

    webhooksWhitelist: string[],
    messageFilters: MessageFilter

    raidCache: RaidCache,
    banCache: string[],
    eventRateCache: Map<string, number>
}

export class Database {
    inner: Keyv<Guild>

    constructor() {
        this.inner = new Keyv({});
    }

    async defaultGuild(guild: DiscordGuild) { 
        const webhooksWhiteList: string[] = [];
        
        /* All webhooks when the bot is added to the guild are whitelisted */
        for (const webhook of await guild.fetchWebhooks()) {
            webhooksWhiteList.push(webhook[1].id);
        }

        await this.insertGuild(guild.id, {
            moderators: [],

            antiRaid: false,
            unsafeMode: false,

            webhooksWhitelist: webhooksWhiteList,

            messageFilters: {
                blacklist: [],
                discordInvites: true,
                links: true,

                messages: {
                    blacklist: "{user} This word is not allowed in this server!",
                    discordInvites: "{user} discord invites are not allowed in this server!",
                    links: "{user} links are not allowed in this server!",
                },

                spamFilter: {},
            },

            raidCache: { bannedUsers: [] },
            banCache: [],
            eventRateCache: new Map()
        });
    }

    async insertGuild(id: string, guild: Guild) {
        await this.inner.set(id, guild);
    }

    async retrieveGuild(id: string): Promise<Guild | undefined> {
        return await this.inner.get(id);
    }

    async removeGuild(id: string) {
        await this.inner.delete(id);
    }
}
