const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('im')
        .setDescription('Offres internationalles')
        .addStringOption(option =>
            option.setName('ressource')
            .setDescription('Le nom de la ressource')
            .setRequired(true)
            .addChoice('Biens de consommation', 'biens de consomation')
            .addChoice('Bois', 'bois')
            .addChoice('Brique', 'brique')
            .addChoice('Eau', 'eau')
            .addChoice('Métaux', 'métaux')
            .addChoice('Nourriture', 'nouriture')
            .addChoice('Pétrole', 'pétrole')
        ),

    async execute(interaction) {

        const embed = {
            author: {
                name: `<\\Nom du pays>`,
                icon_url: `https://cdn.discordapp.com/attachments/939251032297463879/940642380640583770/paz_v3.png`
            },
            title: 'Marché International (IM) :',
            fields: [{
                name: `Work in Progress`,
                value: `Work in Progress`
            }],
            color: interaction.member.displayHexColor,
        };

        await interaction.reply({ embeds: [embed] });
    },
};