const { MessageActionRow, MessageSelectMenu } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
var mysql = require('mysql');

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
                .setPlaceholder(`Le type d\'usine`)
                .addOptions([{
                        label: `Briqueterie`,
                        description: `Produit de la brique`,
                        value: 'briqueterie',
                    },
                    {
                        label: `Champ`,
                        description: `Produit de la nourriture`,
                        value: 'champ',
                    },
                    {
                        label: `Centrale électrique`,
                        description: `Produit de l\'électricité`,
                        value: 'centrale_électrique',
                    },
                    {
                        label: `Mine`,
                        description: `Produit des métaux`,
                        value: 'mine',
                    },
                    {
                        label: `Pompe à eau`,
                        description: `Produit de l\'eau`,
                        value: 'pompe_à_eau',
                    },
                    {
                        label: `Pumpjack`,
                        description: `Produit du pétrole`,
                        value: 'pumpjack',
                    },
                    {
                        label: `Scierie`,
                        description: `Produit du bois`,
                        value: 'scierie',
                    },
                    {
                        label: `Usine civile`,
                        description: `Produit des biens de consommation`,
                        value: 'usine_civile',
                    },
                ]),
            );

        await interaction.reply({ embeds: [embed], components: [row] });
    },
};