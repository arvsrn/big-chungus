import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import { token } from './config.json';
import fs from 'fs';
import path from 'path/posix';

import { log } from './logging';

const rest = new REST({ version: '9' }).setToken(token);

let commands: object[] = [];
log('Started refreshing application p{[/]} commands.');

const clientId = '951422464527831060';

function deploy(dir: string) {
    const commandFiles = fs.readdirSync(dir).filter(file => file.endsWith('.js'));
    
    for (const file of commandFiles) {
        const data = require(path.join(dir, file));
        commands.push(data.command)
    }

    const commandFolders = fs.readdirSync(dir)
        .filter(file => fs.lstatSync(path.join(dir, file)).isDirectory());
    
    for (const commandFolder of commandFolders) {
        deploy(path.join(dir, commandFolder));
    }
}

deploy(path.join(__dirname, 'commands'));

rest.put(
    Routes.applicationCommands(clientId),
    { body: commands },
);

log('Successfully reloaded application p{[/]} commands.');
