const { SlashCommandBuilder } = require('discord.js');
const { menuArmee } = require('../../fonctions/functions.js');
const { readFileSync } = require('fs');
const armeeObject = JSON.parse(readFileSync('data/armee.json', 'utf-8'));

module.exports = {
    data: new SlashCommandBuilder()
        .setName('armee')
        .setDescription(`Menu de votre armée`),

    async execute(interaction) {
        const { connection } = require("../../index");

        menuArmee(interaction, connection, armeeObject)
    },
};