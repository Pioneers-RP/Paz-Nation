const { SlashCommandBuilder } = require("discord.js");
const { menuEconomie } = require("../../fonctions/functions.js");
const {readFileSync} = require("fs");
const armeeObject = JSON.parse(readFileSync('src/data/armee.json', 'utf-8'));
const batimentObject = JSON.parse(readFileSync('src/data/batiment.json', 'utf-8'));

module.exports = {
    data: new SlashCommandBuilder()
        .setName('economie')
        .setDescription(`Consultez votre économie`),

    async execute(interaction) {
        const { connection } = require('../../index.ts');

        menuEconomie(interaction, connection, armeeObject, batimentObject);
    },
};