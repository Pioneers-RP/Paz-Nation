const { MessageActionRow, MessageButton } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pays')
        .setDescription(`Statistiques de votre pays`)
        .addUserOption(option =>
            option.setName('joueur')
            .setDescription(`Statistique d\'un joueur`)),

    async execute(interaction) {

        const embed = {
            author: {
                name: `<\\Nom du pays>`,
                icon_url: interaction.member.displayAvatarURL()
            },
            thumbnail: {
                url: 'https://cdn.discordapp.com/attachments/939251032297463879/940642380640583770/paz_v3.png',
            },
            title: `📊 Stats`,
            fields: [{
                    name: `**__Argent :__**`,
                    value: `9,693,181,630 ♞`
                },
                {
                    name: `**__Population__**`,
                    value: `9,693`
                },
                {
                    name: `**__Territoire :__**`,
                    value: `693 km² total\n` +
                        `438 km² libre`
                },
                {
                    name: `**__Points d’action diplomatique :__**`,
                    value: `181`
                },
                {
                    name: `**__Prestige :__**`,
                    value: `328`
                }
            ],
            color: interaction.member.displayHexColor,
            footer: {
                text: `Suède, Travail, Investissement`
            },
        };

        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                .setLabel(`Economie`)
                .setEmoji(`💵`)
                .setCustomId('menu_économie')
                .setStyle('SUCCESS'),
            )
            .addComponents(
                new MessageButton()
                .setLabel(`Population`)
                .setEmoji(`👪`)
                .setCustomId('menu_population')
                .setStyle('SECONDARY'),
            )
            .addComponents(
                new MessageButton()
                .setLabel(`Gouvernement`)
                .setEmoji(`🏛`)
                .setCustomId('menu_gouvernement')
                .setStyle('PRIMARY'),
            )
            .addComponents(
                new MessageButton()
                .setLabel(`Armée`)
                .setEmoji(`⚔`)
                .setCustomId('menu_armée')
                .setStyle('DANGER')
                .setDisabled(true),
            )

        await interaction.reply({ embeds: [embed], components: [row] });
    },
};