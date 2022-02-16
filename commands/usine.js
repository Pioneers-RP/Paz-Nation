const { MessageActionRow, MessageSelectMenu } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('usine')
        .setDescription(`Menu pour voir vos usines`),

    async execute(interaction) {

        const embed = {
            author: {
                name: `<\\Nom du pays>`,
                icon_url: interaction.member.displayAvatarURL()
            },
            thumbnail: {
                url: 'https://cdn.discordapp.com/attachments/939251032297463879/940642380640583770/paz_v3.png',
            },
            title: `Menu des Usines`,
            description: `work in progress`,
            color: interaction.member.displayHexColor,
            footer: {
                text: `Suède, Travail, Investissement`
            },
        };

        const row = new MessageActionRow()
            .addComponents(
                new MessageSelectMenu()
                .setCustomId('usine')
                .setPlaceholder(`Le type d\'Usine`)
                .addOptions([{
                        label: `Briqueterie`,
                        description: `Produit de la Brique`,
                        value: 'briqueterie',
                    },
                    {
                        label: `Champ`,
                        description: `Produit de la Nourriture`,
                        value: 'champ',
                    },
                    {
                        label: `Centrale électrique`,
                        description: `Produit de l\'électricité`,
                        value: 'centrale_éléctrique',
                    },
                    {
                        label: `Mine`,
                        description: `Produit des Métaux`,
                        value: 'mine',
                    },
                    {
                        label: `Pompe à eau`,
                        description: `Produit de l\'Eau`,
                        value: 'pompe_à_eau',
                    },
                    {
                        label: `Pumpjack`,
                        description: `Produit du Pétrole`,
                        value: 'pumpjack',
                    },
                    {
                        label: `Scierie`,
                        description: `Produit du Bois`,
                        value: 'scierie',
                    },
                    {
                        label: `Usine biens de consommation`,
                        description: `Produit des Biens de consommation`,
                        value: 'usine_bienconso',
                    },
                ]),
            );

        await interaction.reply({ embeds: [embed], components: [row] });
    },
};