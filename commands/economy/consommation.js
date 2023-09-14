const { readFileSync } = require('fs');
const { SlashCommandBuilder } = require("discord.js");
const { menuConsommation } = require("../../fonctions/functions");
const {connection} = require("../../index");
const armeeObject = JSON.parse(readFileSync('data/armee.json', 'utf-8'));
const batimentObject = JSON.parse(readFileSync('data/batiment.json', 'utf-8'));
const gouvernementObject = JSON.parse(readFileSync('data/gouvernement.json', 'utf-8'));
const populationObject = JSON.parse(readFileSync('data/population.json', 'utf-8'));
const regionObject = JSON.parse(readFileSync('data/region.json', 'utf-8'));

module.exports = {
    data: new SlashCommandBuilder()
        .setName('consommation')
        .setDescription(`Affiche votre consommation de ressource`),

    async execute(interaction) {
        const { connection } = require('../../index.js');

        const embed = menuConsommation(interaction, connection, armeeObject , batimentObject, gouvernementObject, populationObject, regionObject).embed;
        const row = menuConsommation(interaction, connection, armeeObject , batimentObject, gouvernementObject, populationObject, regionObject).row;

        await interaction.reply({ embeds: [embed], components: [row] });
    }
};
