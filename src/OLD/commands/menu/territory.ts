import {SlashCommandBuilder} from 'discord.js';
import {menuTerritoire} from "../../fonctions/functions";

module.exports = {
    data: new SlashCommandBuilder()
        .setName('territoire')
        .setDescription(`Vue globale de votre territoire`),

    async execute(interaction: any) {
        const { connection } = require('../../index');

        menuTerritoire(interaction, connection)
    },
};