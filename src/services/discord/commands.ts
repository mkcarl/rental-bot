import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';

export const ping = new SlashCommandBuilder()
    .setName('ping')
    .setDescription('It will pong');

export const split = new SlashCommandBuilder()
    .setName('split')
    .setDescription('Split bill accordingly')
    .addSubcommand((subcommand) => {
        return subcommand
            .setName('even')
            .setDescription('Splits the bill evenly')
            .addNumberOption((option) => {
                return option
                    .setName('amount')
                    .setDescription('Total amount')
                    .setRequired(true)
                    .setMinValue(0);
            })
            .addStringOption((option) => {
                return option
                    .setName('title')
                    .setDescription('Title of the bill')
                    .setRequired(true);
            })
            .addMentionableOption((option) => {
                return option
                    .setName('user')
                    .setDescription('Mention a role or one user')
                    .setRequired(true);
            })
            .addUserOption((option) => {
                return option
                    .setName('payer')
                    .setDescription('Payer')
                    .setRequired(false);
            })
            .addUserOption((option) => {
                return option
                    .setName('user1')
                    .setDescription('Another user')
                    .setRequired(false);
            })
            .addUserOption((option) => {
                return option
                    .setName('user2')
                    .setDescription('Another user')
                    .setRequired(false);
            })
            .addUserOption((option) => {
                return option
                    .setName('user3')
                    .setDescription('Another user')
                    .setRequired(false);
            })
            .addUserOption((option) => {
                return option
                    .setName('user4')
                    .setDescription('Another user')
                    .setRequired(false);
            })
            .addUserOption((option) => {
                return option
                    .setName('user5')
                    .setDescription('Another user')
                    .setRequired(false);
            })
            .addUserOption((option) => {
                return option
                    .setName('user6')
                    .setDescription('Another user')
                    .setRequired(false);
            })
            .addUserOption((option) => {
                return option
                    .setName('user7')
                    .setDescription('Another user')
                    .setRequired(false);
            })
            .addUserOption((option) => {
                return option
                    .setName('user8')
                    .setDescription('Another user')
                    .setRequired(false);
            })
            .addUserOption((option) => {
                return option
                    .setName('user9')
                    .setDescription('Another user')
                    .setRequired(false);
            });
    })
    .addSubcommand((subcommand) => {
        return subcommand
            .setName('manual')
            .setDescription('Splits the bill manually')
            .addStringOption((option) => {
                return option
                    .setName('title')
                    .setDescription('Title of the bill')
                    .setRequired(true);
            })
            .addUserOption((option) => {
                return option
                    .setName('debtor1')
                    .setDescription('Debtor 1')
                    .setRequired(true);
            })
            .addNumberOption((option) => {
                return option
                    .setName('amount1')
                    .setDescription('Amount owed by Debtor 1')
                    .setRequired(true);
            })
            .addUserOption((option) => {
                return option
                    .setName('payer')
                    .setDescription('Payer')
                    .setRequired(false);
            })
            .addUserOption((option) => {
                return option.setName('debtor2').setDescription('Debtor 2');
            })
            .addNumberOption((option) => {
                return option
                    .setName('amount2')
                    .setDescription('Amount owed by Debtor 2');
            })
            .addUserOption((option) => {
                return option.setName('debtor3').setDescription('Debtor 3');
            })
            .addNumberOption((option) => {
                return option
                    .setName('amount3')
                    .setDescription('Amount owed by Debtor 3');
            })
            .addUserOption((option) => {
                return option.setName('debtor4').setDescription('Debtor 4');
            })
            .addNumberOption((option) => {
                return option
                    .setName('amount4')
                    .setDescription('Amount owed by Debtor 4');
            })
            .addUserOption((option) => {
                return option.setName('debtor5').setDescription('Debtor 5');
            })
            .addNumberOption((option) => {
                return option
                    .setName('amount5')
                    .setDescription('Amount owed by Debtor 5');
            })
            .addUserOption((option) => {
                return option.setName('debtor6').setDescription('Debtor 6');
            })
            .addNumberOption((option) => {
                return option
                    .setName('amount6')
                    .setDescription('Amount owed by Debtor 6');
            })
            .addUserOption((option) => {
                return option.setName('debtor7').setDescription('Debtor 7');
            })
            .addNumberOption((option) => {
                return option
                    .setName('amount7')
                    .setDescription('Amount owed by Debtor 7');
            })
            .addUserOption((option) => {
                return option.setName('debtor8').setDescription('Debtor 8');
            })
            .addNumberOption((option) => {
                return option
                    .setName('amount8')
                    .setDescription('Amount owed by Debtor 8');
            })
            .addUserOption((option) => {
                return option.setName('debtor9').setDescription('Debtor 9');
            })
            .addNumberOption((option) => {
                return option
                    .setName('amount9')
                    .setDescription('Amount owed by Debtor 9');
            })
            .addUserOption((option) => {
                return option.setName('debtor10').setDescription('Debtor 10');
            })
            .addNumberOption((option) => {
                return option
                    .setName('amount10')
                    .setDescription('Amount owed by Debtor 10');
            });
    });

export const invoiceDetail = new SlashCommandBuilder()
    .setName('invoice')
    .setDescription('Show invoice detail')
    .addStringOption((option) => {
        return option
            .setName('id')
            .setDescription('Invoice ID')
            .setRequired(true);
    });

export const invoiceChecker = new SlashCommandBuilder()
    .setName('check')
    .setDescription('Check how much you loaned or how much you paid.')
    .addSubcommand((subcommand) => {
        return subcommand
            .setName('loan')
            .setDescription('Check which invoice you are the payer.')
            .addStringOption((option) => {
                return option
                    .setName('type')
                    .setDescription('Type of invoice you want to check')
                    .addChoices(
                        { name: 'all', value: 'all' },
                        { name: 'active', value: 'active' },
                        { name: 'completed', value: 'completed' }
                    )
                    .setRequired(true);
            });
    })
    .addSubcommand((subcommand) => {
        return subcommand
            .setName('debt')
            .setDescription('Check which invoice you are the debtor.')
            .addStringOption((option) => {
                return option
                    .setName('type')
                    .setDescription('Type of invoice you want to check')
                    .addChoices(
                        { name: 'all', value: 'all' },
                        { name: 'pending', value: 'pending' },
                        { name: 'completed', value: 'completed' }
                    )
                    .setRequired(true);
            });
    });
