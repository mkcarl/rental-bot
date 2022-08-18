import * as discord from 'discord.js';

export default class DiscordService {
    readonly client: discord.Client;

    constructor(apiToken: string) {
        this.client = new discord.Client({ intents: [] });
        this.client.login(apiToken).then(() => {
            console.log('Discord bot successfully connected.');
        });
    }
}
