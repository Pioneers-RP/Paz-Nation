const { SlashCommandBuilder } = require('@discordjs/builders');
var mysql = require('mysql');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('economie')
        .setDescription(`Consultez votre économie`),

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
            fields: [{
                    name: `Nombre d'usine total :`,
                    value: `<>`
                },
                {
                    name: `Stockage des ressources :`,
                    value: `<>/<>`
                },
                {
                    name: `Banque :`,
                    value: `<>`
                },
                {
                    name: `Electrité :`,
                    value: `<>/<>`
                }
            ],
            color: interaction.member.displayHexColor,
        };

        await interaction.reply({ embeds: [embed] });
    },
};