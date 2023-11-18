import {SlashCommandBuilder} from "discord.js";
import {menuEconomie} from "../../fonctions/functions";

module.exports = {
    data: new SlashCommandBuilder()
        .setName('economie')
        .setDescription(`Consultez votre économie`),

    async execute(interaction: any) {
        const { connection } = require('../../index.ts');

        menuEconomie(interaction, connection);
    },
};