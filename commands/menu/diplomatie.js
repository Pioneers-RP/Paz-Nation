const { SlashCommandBuilder } = require("discord.js");
const { menuDiplomatie } = require("../../fonctions/functions.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('diplomatie')
        .setDescription(`Consultez votre diplomatie`),

    async execute(interaction) {
        const { connection } = require('../../index.js');

        menuDiplomatie(interaction, connection);
    },
};