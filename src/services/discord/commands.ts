import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';

export const ping = new SlashCommandBuilder()
    .setName('ping')
    .setDescription('It will pong');

export const test = new SlashCommandBuilder()
    .setName('test')
    .setDescription('for testing')
    .addMentionableOption((option) => {
        return option
            .setName('user1')
            .setDescription('just for test 1')
            .setRequired(true);
    })
    .addStringOption((option) => {
        return option
            .setName('string1')
            .setDescription('test string 2')
            .setRequired(false);
    });

export const splitEven = new SlashCommandBuilder()
    .setName('spliteven')
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
