import { Message } from "discord.js";
import { Database } from "./database";

type CommandFunction = (message: Message, database: Database) => Promise<void>;

export class CommandHandler {
    commands: Map<string, CommandFunction>

    constructor() {
        this.commands = new Map();
    }

    registerCommand(name: string, command: CommandFunction) {
        this.commands.set(name, command);
    }

    retrieveCommand(name: string): CommandFunction | undefined {
        return this.commands.get(name);
    } 
}
