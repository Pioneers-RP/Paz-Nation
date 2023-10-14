const { SlashCommandBuilder } = require('discord.js');
const {menuTerritoire} = require("../../fonctions/functions");
const { readFileSync } = require("fs");
const biomeObject = JSON.parse(readFileSync('src/data/biome.json', 'utf-8'));

module.exports = {
    data: new SlashCommandBuilder()
        .setName('territoire')
        .setDescription(`Vue globale de votre territoire`),

    async execute(interaction) {
        const { connection } = require('../../index.ts');

        menuTerritoire(interaction, connection, biomeObject)
    },
};