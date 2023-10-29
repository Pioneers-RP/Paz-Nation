import {SlashCommandBuilder} from "discord.js";
import {menuEconomie} from "../../fonctions/functions";
import {readFileSync} from "fs";
const armeeObject = JSON.parse(readFileSync('src/data/armee.json', 'utf-8'));
const batimentObject = JSON.parse(readFileSync('src/data/batiment.json', 'utf-8'));

module.exports = {
    data: new SlashCommandBuilder()
        .setName('economie')
        .setDescription(`Consultez votre économie`),

    async execute(interaction: any) {
        const { connection } = require('../../index');

        menuEconomie(interaction, connection, armeeObject, batimentObject);
    },
};