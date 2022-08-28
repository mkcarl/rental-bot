import { client } from '@service/discord';
import {
    editDebtors,
    getAllInvoices,
    getInvoice,
    insertInvoice,
} from '@service/firebase/firestore';
import {
    ActionRowBuilder,
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

    if (interaction.commandName === 'split') {
        if (interaction.options.getSubcommand() === 'even') {
            interaction?.guild?.members.fetch();
            const title = interaction.options.getString('title')!;
            const amount = interaction.options.getNumber('amount')!;
            const user = interaction.options.getMentionable('user');
            const payer =
                interaction.options.getUser('payer') ?? interaction.user;
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
                    if (!member.user.bot) users.add(member.user);
                }
            } else {
                console.log('Uncaught type');
                await interaction.reply('unknown error. report to dev.');
            }

            const n = users.size;
            const split = amount / n;

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
        if (interaction.options.getSubcommand() === 'manual') {
            const title = interaction.options.getString('title')!;
            const payer =
                interaction.options.getUser('payer') ?? interaction.user;
            const debtors = [
                {
                    debtor: interaction.options.getUser('debtor1'),
                    amount: interaction.options.getNumber('amount1'),
                },
                {
                    debtor: interaction.options.getUser('debtor2'),
                    amount: interaction.options.getNumber('amount2'),
                },
                {
                    debtor: interaction.options.getUser('debtor3'),
                    amount: interaction.options.getNumber('amount3'),
                },
                {
                    debtor: interaction.options.getUser('debtor4'),
                    amount: interaction.options.getNumber('amount4'),
                },
                {
                    debtor: interaction.options.getUser('debtor5'),
                    amount: interaction.options.getNumber('amount5'),
                },
                {
                    debtor: interaction.options.getUser('debtor6'),
                    amount: interaction.options.getNumber('amount6'),
                },
                {
                    debtor: interaction.options.getUser('debtor7'),
                    amount: interaction.options.getNumber('amount7'),
                },
                {
                    debtor: interaction.options.getUser('debtor8'),
                    amount: interaction.options.getNumber('amount8'),
                },
                {
                    debtor: interaction.options.getUser('debtor9'),
                    amount: interaction.options.getNumber('amount9'),
                },
                {
                    debtor: interaction.options.getUser('debtor10'),
                    amount: interaction.options.getNumber('amount10'),
                },
            ].filter((d) => d.debtor && d.amount);

            if (
                new Set(debtors.map((d) => d.debtor)).size !==
                debtors.map((d) => d.debtor).length
            ) {
                await interaction.reply({
                    content:
                        '❌ Command failed. There are __duplicated debtors__ found',
                    ephemeral: true,
                });
                return;
            }

            const now = dayjs();
            const invoice: Invoice = {
                timestamp: now.unix(),
                title,
                guildId: interaction.guildId!,
                payer: payer.id,
                debtor: debtors.map((d) => {
                    return {
                        id: d.debtor!.id,
                        amount: d.amount!,
                        paid: d.debtor === payer ? d.amount! : 0,
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
                content: debtors.map((d) => d.debtor).join(' '),
                components: [row],
            });
        }
    }

    if (interaction.commandName === 'invoice') {
        const invoiceId = interaction.options.getString('id')!;
        try {
            const invoice = await getInvoice(invoiceId);
            if (invoice.guildId !== interaction.guildId) throw Error();

            const embed = await generateInvoiceEmbed(invoiceId);
            const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
                new ButtonBuilder()
                    .setLabel('Paid')
                    .setCustomId(invoiceId)
                    .setStyle(ButtonStyle.Primary)
            );

            await interaction.reply({
                embeds: [embed],
                content: '',
                components: [row],
            });
        } catch (e) {
            await interaction.reply({
                content: `❌ Invoice ID \`${invoiceId}\` not found.`,
                ephemeral: true,
            });
        }
    }

    if (interaction.commandName === 'check') {
        if (interaction.options.getSubcommand() === 'loan') {
            const loanType = interaction.options.getString('type') as
                | 'all'
                | 'active'
                | 'completed';

            const invoices: Record<string, Invoice> = {};

            const allInvoices = await getAllInvoices();
            switch (loanType) {
                case 'completed':
                    for (const [id, invoice] of _.entries(allInvoices)) {
                        if (invoice.guildId !== interaction.guildId) continue;
                        const payerIsUser =
                            invoice.payer === interaction.user.id;
                        const invoiceIsCompleted = isInvoiceCompleted(invoice);
                        if (payerIsUser && invoiceIsCompleted) {
                            invoices[id] = invoice;
                        }
                    }
                    break;
                case 'active':
                    for (const [id, invoice] of _.entries(allInvoices)) {
                        if (invoice.guildId !== interaction.guildId) continue;
                        const payerIsUser =
                            invoice.payer === interaction.user.id;
                        const invoiceIsCompleted = isInvoiceCompleted(invoice);
                        if (payerIsUser && !invoiceIsCompleted) {
                            invoices[id] = invoice;
                        }
                    }
                    break;
                case 'all':
                    for (const [id, invoice] of _.entries(allInvoices)) {
                        if (invoice.guildId !== interaction.guildId) continue;
                        const payerIsUser =
                            invoice.payer === interaction.user.id;
                        if (payerIsUser) {
                            invoices[id] = invoice;
                        }
                    }
                    break;
                default:
                    break;
            }

            const description = _.entries(invoices)
                .map(([id, iv], index) => {
                    return `${index + 1}. ${iv.title} (${dayjs
                        .unix(iv.timestamp)
                        .format('DD-MM-YYYY HH:mm')}) - \`${id}\` ${
                        isInvoiceCompleted(iv) ? '✅' : '❌'
                    }`;
                })
                .join('\n');

            const embed = new EmbedBuilder()
                .setTitle(`${interaction.user.username} as payer (${loanType})`)
                .setDescription(
                    description !== '' ? description : 'No invoices found'
                );

            await interaction.reply({ embeds: [embed] });
        }
        if (interaction.options.getSubcommand() === 'debt') {
            const debtType = interaction.options.getString('type') as
                | 'all'
                | 'pending'
                | 'completed';

            const invoices: Record<string, Invoice> = {};

            const allInvoices = await getAllInvoices();

            switch (debtType) {
                case 'completed':
                    for (const [id, invoice] of _.entries(allInvoices)) {
                        if (invoice.guildId !== interaction.guildId) continue;
                        const debtorIDs = invoice.debtor.map((d) => d.id);
                        const userIsDebtor = debtorIDs.includes(
                            interaction.user.id
                        );

                        if (userIsDebtor) {
                            const debtIsPaid = isDebtPaid(
                                invoice,
                                interaction.user.id
                            );
                            if (debtIsPaid) invoices[id] = invoice;
                        }
                    }
                    break;
                case 'pending':
                    for (const [id, invoice] of _.entries(allInvoices)) {
                        if (invoice.guildId !== interaction.guildId) continue;
                        const debtorIDs = invoice.debtor.map((d) => d.id);
                        const userIsDebtor = debtorIDs.includes(
                            interaction.user.id
                        );

                        if (userIsDebtor) {
                            const debtIsPaid = isDebtPaid(
                                invoice,
                                interaction.user.id
                            );
                            if (!debtIsPaid) invoices[id] = invoice;
                        }
                    }
                    break;
                case 'all':
                    for (const [id, invoice] of _.entries(allInvoices)) {
                        if (invoice.guildId !== interaction.guildId) continue;
                        const debtorIDs = invoice.debtor.map((d) => d.id);
                        const userIsDebtor = debtorIDs.includes(
                            interaction.user.id
                        );
                        if (userIsDebtor) {
                            invoices[id] = invoice;
                        }
                    }
                    break;
                default:
                    break;
            }
            const description = _.entries(invoices)
                .map(([id, iv], index) => {
                    return `${index + 1}. ${iv.title} - \`${id}\` ${
                        isDebtPaid(iv, interaction.user.id) ? '✅' : '❌'
                    }`;
                })
                .join('\n');
            const embed = new EmbedBuilder()
                .setTitle(
                    `${interaction.user.username} as debtor (${debtType})`
                )
                .setDescription(
                    description !== '' ? description : 'No invoice found.'
                );

            await interaction.reply({ embeds: [embed] });
        }
    }
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isButton()) return;
    const message = interaction.message;
    const invoiceId = message.embeds.pop()?.footer?.text.slice(1);
    if (!invoiceId) {
        await interaction.reply('❌ An error occurred. Cannot find invoice.');
        return;
    }
    const invoice = await getInvoice(invoiceId);
    if (
        !invoice.debtor.map((debtor) => debtor.id).includes(interaction.user.id)
    ) {
        await interaction.reply({
            content: '❌ You are not part of this invoice.',
            ephemeral: true,
        });
        return;
    }
    const debtor = invoice.debtor.find(
        (value) => value.id === interaction.user.id
    );
    if (!debtor) {
        await interaction.reply('❌ An error occurred. Cannot find debtor.');
        return;
    }

    if (isDebtPaid(invoice, debtor.id)) {
        await interaction.reply({
            content: 'You have already paid for this invoice.',
            ephemeral: true,
        });
        return;
    }

    debtor.paid = debtor.amount;
    invoice.debtor
        .filter((value) => value.id !== interaction.user.id)
        .push(debtor);

    await editDebtors(invoiceId, invoice.debtor);

    try {
        await interaction.reply({
            content: interaction.message.content,
            components: interaction.message.components,
            embeds: [await generateInvoiceEmbed(invoiceId)],
        });
    } catch (e) {
        await interaction.channel?.send({
            content: interaction.message.content,
            components: interaction.message.components,
            embeds: [await generateInvoiceEmbed(invoiceId)],
        });
    }
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
                            `${client.users.cache.get(usr.id)} - RM ${_.round(
                                usr.amount,
                                2
                            )}${usr.paid > 0 ? ' ✅' : ''}\n`
                    )
                    .join('')
        )
        .setFooter({ text: `#${invoiceId}` }).data;

    return embed;
}

function isInvoiceCompleted(invoice: Invoice) {
    const loanedAmount = invoice.debtor.reduce(
        (previousValue, currentValue) => {
            return previousValue + currentValue.amount;
        },
        0
    );
    const receivedAmount = invoice.debtor.reduce(
        (previousValue, currentValue) => {
            return previousValue + currentValue.paid;
        },
        0
    );
    return loanedAmount === receivedAmount;
}

function isDebtPaid(invoice: Invoice, debtorID: string) {
    const debtorIDs = invoice.debtor.map((d) => d.id);
    const userIsDebtor = debtorIDs.includes(debtorID);
    const debtor = invoice.debtor.find((d) => d.id === debtorID);
    if (debtor === undefined) throw Error('Debtor not found.');
    return debtor.amount === debtor.paid;
}
