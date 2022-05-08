const { SlashCommandBuilder } = require('@discordjs/builders');
const { codeBlock } = require('@discordjs/builders');
const { MessageActionRow, MessageButton } = require('discord.js');
var mysql = require('mysql');
const ms = require('ms');
const { globalBox } = require('global-box');
const box = globalBox();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('qachat')
        .setDescription(`Acheter des ressources sur le marché rapide (QM)`)
        .addStringOption(ressource =>
            ressource.setName('ressource')
            .setDescription(`La ressource que vous voulez acheter`)
            .addChoice(`Biens de consommation`, 'Biens de consommation')
            .addChoice(`Bois`, 'Bois')
            .addChoice(`Brique`, 'Brique')
            .addChoice(`Eau`, 'Eau')
            .addChoice(`Métaux`, 'Metaux')
            .addChoice(`Nourriture`, 'Nourriture')
            .addChoice(`Pétrole`, 'Petrole')
            .setRequired(true))
        .addIntegerOption(quantité =>
            quantité.setName('quantité')
            .setDescription(`La quantité de ressource que vous voulez acheter`)
            .setRequired(true)),

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

            const ressource = interaction.options.getString('ressource');
            var quantité = interaction.options.getInteger('quantité');

            if (quantité < 0) {
                var reponse = codeBlock('diff', `- Veillez indiquer une quantité positive`);
                await interaction.reply({ content: reponse, ephemeral: true });
            } else {
                function offre(prix_moyen) {

                    var prix_achat = prix_moyen * 1.3;
                    var prix = quantité * prix_achat;

                    const embed = {
                        author: {
                            name: `${results[0].rang} de ${results[0].nom}`,
                            icon_url: interaction.member.displayAvatarURL()
                        },
                        thumbnail: {
                            url: results[0].drapeau
                        },
                        title: `\`Acheter au marché international :\``,
                        fields: [{
                                name: `Ressource :`,
                                value: `${ressource}\n` +
                                    `Prix moyen : ${prix_moyen}`
                            },
                            {
                                name: `Quantité :`,
                                value: `${quantité}`
                            },
                            {
                                name: `Prix :`,
                                value: `A l'unité (-30% du prix moyen) : ${prix_achat.toFixed(2)}\n` +
                                    `Au total : ${prix.toFixed(0)}`
                            },
                            {
                                name: `Votre argent :`,
                                value: `${results[0].cash}`
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
                            new MessageButton()
                            .setLabel(`Acheter`)
                            .setEmoji(`💵`)
                            .setCustomId(`qachat-${interaction.user.id}`)
                            .setStyle('SUCCESS'),
                        )
                        .addComponents(
                            new MessageButton()
                            .setLabel(`Refuser`)
                            .setEmoji(`✋`)
                            .setCustomId(`refuser-${interaction.user.id}`)
                            .setStyle('DANGER'),
                        )

                    interaction.reply({ embeds: [embed], components: [row] });
                }

                switch (ressource) {
                    case 'Biens de consommation':
                        offre(box.get('bc_prix_moyen'))
                        break;
                    case 'Bois':
                        offre(box.get('bois_prix_moyen'))
                        break;
                    case 'Brique':
                        offre(box.get('brique_prix_moyen'))
                        break;
                    case 'Eau':
                        offre(box.get('eau_prix_moyen'))
                        break;
                    case 'Metaux':
                        offre(box.get('metaux_prix_moyen'))
                        break;
                    case 'Nourriture':
                        offre(box.get('nourriture_prix_moyen'))
                        break;
                    case 'Petrole':
                        offre(box.get('petrole_prix_moyen'))
                        break;
                }
            }
        })
    },
};