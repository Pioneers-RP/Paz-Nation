const { SlashCommandBuilder } = require('@discordjs/builders');
var mysql = require('mysql');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('population')
        .setDescription(`Menu de votre population`),

    async execute(interaction) {

        const embed = {
            author: {
                name: `<\\Nom du pays>`,
                icon_url: 'https://cdn.discordapp.com/attachments/939251032297463879/940642380640583770/paz_v3.png'
            },
            thumbnail: {
                url: 'https://cdn.discordapp.com/attachments/939251032297463879/940642380640583770/paz_v3.png',
            },
            title: `Menu de l'économie`,
            description: `\nPopulation :\n\n <\\total pop>\n` +
                `Habitation :\n\n> <\\total de maison / pop>` +
                `\n\nBonheur \n\n> <\\Bonheur de la pop>` +
                ` _Taux de personne hébérgés/chomage ..._\n\n` +
                `📊 Taux d'emplois \n\n> <\\taux d'employé>`,
            fields: [{
                name: `Work in Progress`,
                value: `Work in Progress`
            }],
            color: interaction.member.displayHexColor,
        };

        await interaction.reply({ embeds: [embed] });
    },
};