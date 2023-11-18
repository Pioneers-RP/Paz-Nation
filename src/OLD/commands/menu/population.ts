import {SlashCommandBuilder} from "discord.js";
import {menuPopulation} from "../../fonctions/functions";

module.exports = {
    data: new SlashCommandBuilder()
        .setName('population')
        .setDescription(`Menu de votre population`),

    async execute(interaction: any) {
        const { connection } = require('../../index');

        menuPopulation(interaction, connection)
    },
};