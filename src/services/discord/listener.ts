import { client } from '@service/discord';
import { getAllInvoices } from '@service/firebase/firestore';
import { isNonNullObject } from 'firebase-admin/lib/utils/validator';
import { EmbedBuilder, GuildMember, Role, User } from 'discord.js';
import _ from 'lodash';

async function reloadCache() {
    for (const [, guild] of await client.guilds.fetch()) {
        const a = await guild.fetch();
        await a.members.fetch();
    }
}

client.on('ready', async () => {
    await reloadCache();
    console.log('Discord bot ready.');
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'ping') {
        await interaction.reply('PONG!');
    }

    if (interaction.commandName === 'test') {
        const data = await getAllInvoices();
        await interaction.reply('```' + JSON.stringify(data, null, 4) + '```');
    }

    if (interaction.commandName === 'spliteven') {
        interaction?.guild?.members.fetch();
        const title = interaction.options.getString('title')!;
        const amount = interaction.options.getNumber('amount')!;
        const user = interaction.options.getMentionable('user');
        const usersFromInteraction = [
            interaction.options.getUser('user1'),
            interaction.options.getUser('user2'),
            interaction.options.getUser('user3'),
            interaction.options.getUser('user4'),
            interaction.options.getUser('user5'),
            interaction.options.getUser('user6'),
            interaction.options.getUser('user7'),
            interaction.options.getUser('user8'),
            interaction.options.getUser('user9'),
        ];
        const users: Set<User> = new Set<User>();
        for (const usr of usersFromInteraction) {
            if (usr === null) continue;
            users.add(usr);
        }

        if (user instanceof User) {
            users.add(user);
        } else if (user instanceof GuildMember) {
            users.add(user.user);
        } else if (user instanceof Role) {
            for (const member of user.members.values()) {
                users.add(member.user);
            }
        } else {
            console.log('Uncaught type');
            await interaction.reply('unknown error. report to dev.');
        }

        const n = users.size;
        const split = _.round(amount / n, 2);
        const embed = new EmbedBuilder()
            .setTitle(`${title}`)
            .setDescription(
                `RM ${amount} has been paid by ${interaction.user}.\n\n` +
                    Array.from(users)
                        .map((usr) => `${usr} - RM ${split}\n`)
                        .join('')
            )
            .setFooter({ text: '#123123123' }).data;
        await interaction.reply({
            embeds: [embed],
            content: Array.from(users).join(' '),
        });
    }
});
