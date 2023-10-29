import {SlashCommandBuilder} from 'discord.js';
import {menuArmee} from '../../fonctions/functions';
import {readFileSync} from 'fs';
const armeeObject = JSON.parse(readFileSync('src/OLD/data/armee.json', 'utf-8'));

module.exports = {
    data: new SlashCommandBuilder()
        .setName('armee')
        .setDescription(`Menu de votre armée`),

    async execute(interaction: any) {
        const { connection } = require("../../index");

        menuArmee(interaction, connection, armeeObject)
    },
};