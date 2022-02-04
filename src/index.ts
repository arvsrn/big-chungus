import { Client } from "discord.js";
import { token } from "./config.json";

const client = new Client({
    intents: []
});

/* Go to src/config.json and put your token there. */
client.login(token);