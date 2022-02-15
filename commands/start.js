const { MessageActionRow, MessageButton } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('start')
        .setDescription('Démarrer votre aventure en temps que cité !')
        .addStringOption(option =>
            option.setName('cité')
            .setDescription('Le nom de votre ville de départ')
            .setRequired(true)),

    async execute(interaction) {

        const cité = interaction.options.getString('cité');

        const ville = {
            author: {
                name: 'Cité de ' + cité,
                icon_url: interaction.member.displayAvatarURL()
            },
            thumbnail: 'https://media.discordapp.net/attachments/845932351811878913/934778568846762054/flag.png?width=757&height=473',
            title: 'Vous avez fondé votre Cité !',
            fields: [{
                name: 'Work in Progress',
                value: 'Work in Progress'
            }],
            color: interaction.member.displayHexColor,
            footer: {
                text: 'Suède, Travail, Investissement'
            },
        };

        await interaction.reply({ embeds: [ville] });
    },
};