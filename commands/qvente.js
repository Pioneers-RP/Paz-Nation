const { SlashCommandBuilder } = require('@discordjs/builders');
const { codeBlock } = require('@discordjs/builders');
const { MessageActionRow, MessageButton } = require('discord.js');
var mysql = require('mysql');
const ms = require('ms');
const { globalBox } = require('global-box');
const box = globalBox();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('qvente')
        .setDescription(`Vendre des ressources sur le marché rapide (QM)`)
        .addStringOption(ressource =>
            ressource.setName('ressource')
            .setDescription(`La ressource que vous voulez vendre`)
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
            .setDescription(`La quantité de ressource que vous voulez vendre`)
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

                    var prix_vente = prix_moyen * 0.7;
                    var prix = quantité * prix_vente;

                    const embed = {
                        author: {
                            name: `${results[0].rang} de ${results[0].nom}`,
                            icon_url: interaction.member.displayAvatarURL()
                        },
                        thumbnail: {
                            url: results[0].drapeau
                        },
                        title: `\`Vendre au marché international :\``,
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
                                value: `A l'unité (-30% du prix moyen) : ${prix_vente.toFixed(2)}\n` +
                                    `Au total : ${prix.toFixed(0)}`
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
                            .setLabel(`Vendre`)
                            .setEmoji(`💵`)
                            .setCustomId(`qvendre-${interaction.user.id}`)
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
                        if (quantité > results[0].bc) {
                            var reponse = codeBlock('diff', `- Vous n'avez pas assez de biens de consommation : ${results[0].bc}/${quantité}`);
                            await interaction.reply({ content: reponse, ephemeral: true });
                            break;
                        } else {
                            offre(box.get('bc_prix_moyen'))
                            break;
                        }
                    case 'Bois':
                        if (quantité > results[0].bois) {
                            var reponse = codeBlock('diff', `- Vous n'avez pas assez de bois : ${results[0].bois}/${quantité}`);
                            await interaction.reply({ content: reponse, ephemeral: true });
                            break;
                        } else {
                            offre(box.get('bois_prix_moyen'))
                            break;
                        }
                    case 'Brique':
                        if (quantité > results[0].brique) {
                            var reponse = codeBlock('diff', `- Vous n'avez pas assez de brique : ${results[0].brique}/${quantité}`);
                            await interaction.reply({ content: reponse, ephemeral: true });
                            break;
                        } else {
                            offre(box.get('brique_prix_moyen'))
                            break;
                        }
                    case 'Eau':
                        if (quantité > results[0].eau) {
                            var reponse = codeBlock('diff', `- Vous n'avez pas assez d'eau : ${results[0].eau}/${quantité}`);
                            await interaction.reply({ content: reponse, ephemeral: true });
                            break;
                        } else {
                            offre(box.get('eau_prix_moyen'))
                            break;
                        }
                    case 'Metaux':
                        if (quantité > results[0].metaux) {
                            var reponse = codeBlock('diff', `- Vous n'avez pas assez de métaux : ${results[0].metaux}/${quantité}`);
                            await interaction.reply({ content: reponse, ephemeral: true });
                            break;
                        } else {
                            offre(box.get('metaux_prix_moyen'))
                            break;
                        }
                    case 'Nourriture':
                        if (quantité > results[0].nourriture) {
                            var reponse = codeBlock('diff', `- Vous n'avez pas assez de nourriture : ${results[0].nourriture}/${quantité}`);
                            await interaction.reply({ content: reponse, ephemeral: true });
                            break;
                        } else {
                            offre(box.get('nourriture_prix_moyen'))
                            break;
                        }
                    case 'Petrole':
                        if (quantité > results[0].petrole) {
                            var reponse = codeBlock('diff', `- Vous n'avez pas assez de pétrole : ${results[0].petrole}/${quantité}`);
                            await interaction.reply({ content: reponse, ephemeral: true });
                            break;
                        } else {
                            offre(box.get('petrole_prix_moyen'))
                            break;
                        }
                }
            }
        })
    },
};