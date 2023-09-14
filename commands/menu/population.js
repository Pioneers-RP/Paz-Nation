const { SlashCommandBuilder, codeBlock} = require("discord.js");
const { readFileSync } = require('fs');
const { menuPopulation } = require("../../fonctions/functions");
const armeeObject = JSON.parse(readFileSync('data/armee.json', 'utf-8'));
const batimentObject = JSON.parse(readFileSync('data/batiment.json', 'utf-8'));
const gouvernementObject = JSON.parse(readFileSync('data/gouvernement.json', 'utf-8'));
const populationObject = JSON.parse(readFileSync('data/population.json', 'utf-8'));
const regionObject = JSON.parse(readFileSync('data/region.json', 'utf-8'));

module.exports = {
    data: new SlashCommandBuilder()
        .setName('population')
        .setDescription(`Menu de votre population`),

    async execute(interaction) {
        const { connection } = require('../../index.js');

        menuPopulation(interaction, connection, armeeObject, populationObject, gouvernementObject, batimentObject, regionObject)
    },
};