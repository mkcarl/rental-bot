import { client } from '@service/discord';
import {
    editDebtors,
    getAllInvoices,
    getInvoice,
    insertInvoice,
} from '@service/firebase/firestore';
import {
    ActionRowBuilder,
    ActionRowData,
    ButtonBuilder,
    ButtonStyle,
    ComponentType,
    EmbedBuilder,
    GuildMember,
    Role,
    User,
} from 'discord.js';
import _, { sum } from 'lodash';
import dayjs from 'dayjs';

async function reloadCache() {
    for (const [, guild] of await client.guilds.fetch()) {
        const a = await guild.fetch();
        await a.members.fetch();
        await a.channels.fetch();
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
        const payer = interaction.options.getUser('payer') ?? interaction.user;
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

        users.add(payer);
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

        const now = dayjs();
        const invoice: Invoice = {
            timestamp: now.unix(),
            title,
            guildId: interaction.guildId!,
            payer: payer.id,
            debtor: Array.from(users).map((u) => {
                return {
                    id: u.id,
                    amount: split,
                    paid: u === payer ? split : 0,
                };
            }),
        };
        const invoiceId = await insertInvoice(invoice);

        const embed = await generateInvoiceEmbed(invoiceId);
        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
                .setLabel('Paid')
                .setCustomId(invoiceId)
                .setStyle(ButtonStyle.Primary)
        );

        const message = await interaction.reply({
            embeds: [embed],
            content: Array.from(users).join(' '),
            components: [row],
        });
    }
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isButton()) return;
    const message = interaction.message;
    const invoiceId = message.embeds.pop()?.footer?.text.slice(1);
    if (!invoiceId) {
        await interaction.reply('An error occurred. Cannot find invoice.');
        return;
    }
    const invoice = await getInvoice(invoiceId);
    if (
        !invoice.debtor.map((debtor) => debtor.id).includes(interaction.user.id)
    ) {
        await interaction.reply({
            content: 'You are not part of this invoice.',
            ephemeral: true,
        });
        return;
    }
    const debtor = invoice.debtor.find(
        (value) => value.id === interaction.user.id
    );
    if (!debtor) {
        await interaction.reply('An error occurred. Cannot find debtor.');
        return;
    }
    debtor.paid = debtor.amount;
    invoice.debtor
        .filter((value) => value.id !== interaction.user.id)
        .push(debtor);

    await editDebtors(invoiceId, invoice.debtor);

    await interaction.reply({
        content: interaction.message.content,
        components: interaction.message.components,
        embeds: [await generateInvoiceEmbed(invoiceId)],
    });
});

async function generateInvoiceEmbed(invoiceId: string) {
    const invoice = await getInvoice(invoiceId);

    const embed = new EmbedBuilder()
        .setTitle(
            `${invoice.title} (${dayjs
                .unix(invoice.timestamp)
                .format('DD-MMM-YYYY')})`
        )
        .setDescription(
            `RM ${sum(
                invoice.debtor.map((value) => value.amount)
            )} has been paid by ${client.users.cache.get(invoice.payer)}.\n\n` +
                invoice.debtor
                    .map(
                        (usr) =>
                            `${client.users.cache.get(usr.id)} - RM ${
                                usr.amount
                            }${usr.paid > 0 ? ' ✅' : ''}\n`
                    )
                    .join('')
        )
        .setFooter({ text: `#${invoiceId}` }).data;

    return embed;
}
