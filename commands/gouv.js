const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('gouv')
        .setDescription('Menu du gouvernement'),

    async execute(interaction) {

        const embed = {
            author: {
                name: '<\\Nom du pays>',
                icon_url: interaction.member.displayAvatarURL()
            },
            thumbnail: 'https://media.discordapp.net/attachments/845932351811878913/934778568846762054/flag.png?width=757&height=473',
            title: 'Menu du gouvernement',
            fields: [{
                name: 'Forme de gouvernement : ',
                value: `Work in Progress`
            }, {
                name: `Idéologie : `,
                value: `Work in Progress`
            }, {
                name: `Rang : `,
                value: `Work in Progress`
            }, {
                name: `Nom de l'Etat : `,
                value: `Work in Progress`
            }, {
                name: `Devise : `,
                value: `Work in Progress`
            }],
            color: interaction.member.displayHexColor,
            footer: { text: 'Suède, Travail, Investissement' }
        };

        await interaction.reply({ embeds: [embed] });
    },
};