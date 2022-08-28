import DiscordService from './service';
import * as dotenv from 'dotenv';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord.js';
import { ping, splitEven, splitManual, test } from '@service/discord/commands';
dotenv.config();

const token = process.env.DISCORD_API_TOKEN as string;
const applicationId = process.env.DISCORD_BOT_APPLICATION_ID as string;
const app = new DiscordService(token);

export const client = app.client;

const commands = [ping, test, splitEven, splitManual];

const rest = new REST({ version: '10' }).setToken(token);

rest.put(Routes.applicationCommands(applicationId), {
    body: commands,
}).then(() => {
    console.log('Discord slash commands loaded.');
    commands.forEach((command) => {
        console.log(`\t${command.name}`);
    });
});
