import {SlashCommandBuilder} from "discord.js";
import {readFileSync} from 'fs';
import {menuPopulation} from "../../fonctions/functions";
const armeeObject = JSON.parse(readFileSync('src/data/armee.json', 'utf-8'));
const batimentObject = JSON.parse(readFileSync('src/data/batiment.json', 'utf-8'));
const gouvernementObject = JSON.parse(readFileSync('src/data/gouvernement.json', 'utf-8'));
const populationObject = JSON.parse(readFileSync('src/data/population.json', 'utf-8'));
const regionObject = JSON.parse(readFileSync('src/data/region.json', 'utf-8'));

module.exports = {
    data: new SlashCommandBuilder()
        .setName('population')
        .setDescription(`Menu de votre population`),

    async execute(interaction: any) {
        const { connection } = require('../../index');

        menuPopulation(interaction, connection, armeeObject, batimentObject, gouvernementObject, populationObject, regionObject)
    },
};