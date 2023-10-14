const { SlashCommandBuilder } = require("discord.js");
const { menuGouvernement } = require("../../fonctions/functions");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('gouv')
        .setDescription(`Menu du gouvernement`),

    async execute(interaction) {
        const { connection } = require('../../index.ts');

        menuGouvernement(interaction, connection);
    },
};