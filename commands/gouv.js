const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('gouv')
        .setDescription(`Menu du gouvernement`),

    async execute(interaction) {

        const embed = {
            author: {
                name: `<\\Nom du pays>`,
                icon_url: interaction.member.displayAvatarURL()
            },
            thumbnail: {
                url: 'https://cdn.discordapp.com/attachments/939251032297463879/940642380640583770/paz_v3.png',
            },
            title: `Menu du gouvernement`,
            fields: [{
                name: `Forme de gouvernement : `,
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
            timestamp: new Date(),
            footer: { text: `Suède, Travail, Investissement` }
        };

        await interaction.reply({ embeds: [embed] });
    },
};