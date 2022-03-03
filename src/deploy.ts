import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import { token } from './config.json';
import fs from 'fs';
import path from 'path/posix';

import { log } from './logging';

const rest = new REST({ version: '9' }).setToken(token);

let commands: object[] = [];
log('Started refreshing application p{[/]} commands.');

const commandFiles = fs.readdirSync(path.join(__dirname, 'commands'))
    .filter(file => file.endsWith('.js'));

const clientId = '936494176277758013';
const guildId = '935143108092506152';

for (const file of commandFiles) {
    const data = require(path.join(__dirname, 'commands', file));
    commands.push(data.command)
}

rest.put(
    Routes.applicationGuildCommands(clientId, guildId),
    { body: commands },
);

log('Successfully reloaded application p{[/]} commands.');
