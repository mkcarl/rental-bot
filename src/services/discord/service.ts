import * as discord from 'discord.js';

export default class DiscordService {
    readonly client: discord.Client;

    constructor(apiToken: string) {
        this.client = new discord.Client({ intents: ['GuildMembers'] });
        this.client.login(apiToken).then(() => {
            console.log('Discord client successfully logged in.');
        });
    }
}
