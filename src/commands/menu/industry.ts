import {SlashCommandBuilder} from 'discord.js';
import {menuIndustrie} from "../../fonctions/functions";

module.exports = {
    data: new SlashCommandBuilder()
        .setName('industrie')
        .setDescription(`Voir vos industries`),

    async execute(interaction: any) {
        const { connection } = require('../../index');

        menuIndustrie(interaction, connection)
    },
};