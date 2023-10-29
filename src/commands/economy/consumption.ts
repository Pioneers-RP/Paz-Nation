import {readFileSync} from 'fs';
import {SlashCommandBuilder} from "discord.js";
import {menuConsommation} from "../../fonctions/functions";
import {connection} from '../../index';
const armeeObject = JSON.parse(readFileSync('src/data/armee.json', 'utf-8'));
const batimentObject = JSON.parse(readFileSync('src/data/batiment.json', 'utf-8'));
const gouvernementObject = JSON.parse(readFileSync('src/data/gouvernement.json', 'utf-8'));
const populationObject = JSON.parse(readFileSync('src/data/population.json', 'utf-8'));
const regionObject = JSON.parse(readFileSync('src/data/region.json', 'utf-8'));

module.exports = {
    data: new SlashCommandBuilder()
        .setName('consommation')
        .setDescription(`Affiche votre consommation de ressource`),

    async execute(interaction: any) {

        menuConsommation('menu', interaction, connection, armeeObject , batimentObject, gouvernementObject, populationObject, regionObject);
    }
};
