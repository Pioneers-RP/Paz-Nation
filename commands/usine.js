const { MessageActionRow, MessageSelectMenu } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
var mysql = require('mysql');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('usine')
        .setDescription(`Menu pour voir vos usines`),

    async execute(interaction) {

        const connection = new mysql.createConnection({
            host: 'eu01-sql.pebblehost.com',
            user: 'customer_260507_paznation',
            password: 'lidmGbk8edPkKXv1#ZO',
            database: 'customer_260507_paznation',
            multipleStatements: true
        });

        var sql = `
            SELECT * FROM pays WHERE id_joueur=${interaction.member.id}`;

        connection.query(sql, async(err, results) => {
            if (err) {
                throw err;
            }

            surface_T_briqueterie = process.env.SURFACE_BRIQUETERIE * results[0].briqueterie
            surface_T_champ = process.env.SURFACE_CHAMP * results[0].champ
            surface_T_mine = process.env.SURFACE_MINE * results[0].mine
            surface_T_pompe_à_eau = process.env.SURFACE_POMPE_A_EAU * results[0].pompe_à_eau
            surface_T_pumpjack = process.env.SURFACE_PUMPJACK * results[0].pumpjack
            surface_T_scierie = process.env.SURFACE_SCIERIE * results[0].scierie
            surface_T_usine_civile = process.env.SURFACE_USINE_CIVILE * results[0].usine_civile
            surface_T = surface_T_briqueterie + surface_T_champ + surface_T_pompe_à_eau + surface_T_pumpjack + surface_T_mine + surface_T_scierie + surface_T_usine_civile;

            const embed = {
                author: {
                    name: `${results[0].rang} de ${results[0].nom}`,
                    icon_url: interaction.member.displayAvatarURL()
                },
                thumbnail: {
                    url: `${results[0].drapeau}`
                },
                title: `\`Menu des usines\``,
                description: `Nombre d'usines totale : ${results[0].usine_total}\n` +
                    `Surface totale : ${surface_T}`,
                fields: [{
                        name: `Briqueterie :`,
                        value: `Nombre d'usine : ${results[0].briqueterie}\n` +
                            `Surface totale : ${surface_T_briqueterie} km²`
                    },
                    {
                        name: `Champ :`,
                        value: `Nombre d'usine : ${results[0].champ}\n` +
                            `Surface totale : ${surface_T_champ} km²`
                    },
                    {
                        name: `Mine :`,
                        value: `Nombre d'usine : ${results[0].mine}\n` +
                            `Surface totale : ${surface_T_mine} km²`
                    },
                    {
                        name: `Pompe à eau :`,
                        value: `Nombre d'usine : ${results[0].pompe_à_eau}\n` +
                            `Surface totale : ${surface_T_pompe_à_eau} km²`
                    },
                    {
                        name: `Pumpjack :`,
                        value: `Nombre d'usine : ${results[0].pumpjack}\n` +
                            `Surface totale : ${surface_T_pumpjack} km²`
                    },
                    {
                        name: `Scierie :`,
                        value: `Nombre d'usine : ${results[0].scierie}\n` +
                            `Surface totale : ${surface_T_scierie} km²`
                    },
                    {
                        name: `Usine civile :`,
                        value: `Nombre d'usine : ${results[0].usine_civile}\n` +
                            `Surface totale : ${surface_T_usine_civile} km²`
                    }
                ],
                color: interaction.member.displayHexColor,
                timestamp: new Date(),
                footer: {
                    text: `${results[0].devise}`
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
                            label: `Mine`,
                            description: `Produit des métaux`,
                            value: 'mine',
                        },
                        {
                            label: `Pompe à eau`,
                            description: `Produit de l\'eau`,
                            value: 'pompe_a_eau',
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
        })
    },
};