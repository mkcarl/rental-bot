import DiscordService from './service';
import * as dotenv from 'dotenv';
dotenv.config();

const token = process.env.DISCORD_API_TOKEN as string;
const app = new DiscordService(token);

export const client = app.client;
