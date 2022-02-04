import Keyv from "keyv";

/* Represents a discord guild and is used in the database */
export interface Guild {
    moderators: string[],
}

export class Database {
    inner: Keyv<Guild>

    constructor() {
        this.inner = new Keyv({});
    }

    async insertGuild(id: string, guild: Guild) {
        await this.inner.set(id, guild);
    }

    async retrieveGuild(id: string): Promise<Guild | undefined> {
        return await this.inner.get(id);
    }
}
