const { SlashCommandBuilder } = require('discord.js');
const { menuIndustrie } = require("../../fonctions/functions");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('industrie')
        .setDescription(`Voir vos industries`),

    async execute(interaction) {
        const { connection } = require('../../index.js');

        menuIndustrie(interaction, connection)
    },
};