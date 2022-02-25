import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import { token } from './config.json';
import fs from 'fs';
import path from 'path/posix';

const commands: object[] = [];
const commandFiles = fs.readdirSync(path.join(__dirname, 'commands')).filter(file => file.endsWith('.js'));

const clientId = '936494176277758013';
const guildId = '935143108092506152';

for (const file of commandFiles) {
    import(`./commands/${file}`).then(data => commands.push(data.command));
}

const rest = new REST({ version: '9' }).setToken(token);

(async () => {
    try {
        console.log('Started refreshing application [/] commands.');

        await rest.put(
            Routes.applicationGuildCommands(clientId, guildId),
            { body: commands },
        );

        console.log('Successfully reloaded application [/] commands.');
    } catch (error) {
        console.error(error);
    }
})();
