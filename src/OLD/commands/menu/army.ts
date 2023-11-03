import {SlashCommandBuilder} from 'discord.js';
import {menuArmee} from '../../fonctions/functions';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('armee')
        .setDescription(`Menu de votre armée`),

    async execute(interaction: any) {
        const { connection } = require("../../index");

        menuArmee(interaction, connection)
    },
};