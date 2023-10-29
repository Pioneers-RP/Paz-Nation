import {SlashCommandBuilder} from 'discord.js';
import {menuTerritoire} from "../../fonctions/functions";
import {readFileSync} from "fs";
const biomeObject = JSON.parse(readFileSync('src/data/biome.json', 'utf-8'));

module.exports = {
    data: new SlashCommandBuilder()
        .setName('territoire')
        .setDescription(`Vue globale de votre territoire`),

    async execute(interaction: any) {
        const { connection } = require('../../index.ts');

        menuTerritoire(interaction, connection, biomeObject)
    },
};