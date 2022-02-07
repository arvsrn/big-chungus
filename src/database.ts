import Keyv from "keyv";

/* Stores all the data that needs to be cached when anti-raid mode is turned on. */
export interface RaidCache {
    bannedUsers: string[],
}

/* Represents a discord guild and is used in the database */
export interface Guild {
    moderators: string[],

    antiRaid: boolean,
    unsafeMode: boolean,

    raidCache: RaidCache,
    banCache: string[],
    eventRateCache: Map<string, number>
}

export class Database {
    inner: Keyv<Guild>

    constructor() {
        this.inner = new Keyv({});
    }

    async defaultGuild(id: string) { 
        await this.insertGuild(id, {
            moderators: [],

            antiRaid: false,
            unsafeMode: false,

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
}
