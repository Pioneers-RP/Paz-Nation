const { SlashCommandBuilder, codeBlock } = require('@discordjs/builders');
const { MessageActionRow, MessageButton } = require('discord.js');
const { readFileSync } = require('fs');

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
        .addIntegerOption(quantite =>
            quantite.setName('quantité')
            .setDescription(`La quantité de ressource que vous voulez vendre`)
            .setRequired(true)),

    async execute(interaction) {
        const { connection } = require('../index.js');

        const sql = `SELECT * FROM pays WHERE id_joueur=${interaction.member.id}`;

        connection.query(sql, async(err, results) => {
            let reponse;
            if (err) {throw err;}

            const ressource = interaction.options.getString('ressource');
            const quantite = interaction.options.getInteger('quantité');
            const jsonPrix = JSON.parse(readFileSync('data/prix.json', 'utf-8'));

            if (quantite < 0) {
                reponse = codeBlock('diff', `- Veillez indiquer une quantité positive`);
                await interaction.reply({ content: reponse, ephemeral: true });
            } else {
                function offre(prix_moyen) {
                    const prix_vente = parseFloat((prix_moyen * 0.7).toFixed(2));
                    const prix = Math.round(quantite * prix_vente);

                    const embed = {
                        author: {
                            name: `${results[0].rang} de ${results[0].nom}`,
                            icon_url: interaction.member.displayAvatarURL()
                        },
                        thumbnail: {
                            url: results[0].drapeau
                        },
                        title: `\`Vendre au marché rapide :\``,
                        fields: [{
                                name: `Ressource :`,
                                value: codeBlock(
                                    `• ${ressource}\n` +
                                    `• Prix moyen : ${prix_moyen}`) + `\u200B`
                            },
                            {
                                name: `Quantité :`,
                                value: codeBlock(`• ${quantite.toLocaleString('en-US')}`) + `\u200B`
                            },
                            {
                                name: `Prix :`,
                                value: codeBlock(
                                    `• A l'unité (-30% du prix moyen) : ${prix_vente}\n` +
                                    `• Au total : ${prix.toLocaleString('en-US')}`) + `\u200B`
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
                            .setCustomId(`qvente-${interaction.user.id}`)
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
                        if (quantite > results[0].bc) {
                            reponse = codeBlock('diff', `- Vous n'avez pas assez de biens de consommation : ${results[0].bc.toLocaleString('en-US')}/${quantite.toLocaleString('en-US')}`);
                            await interaction.reply({ content: reponse, ephemeral: true });
                            break;
                        } else {
                            offre(jsonPrix.bc)
                            break;
                        }
                    case 'Bois':
                        if (quantite > results[0].bois) {
                            reponse = codeBlock('diff', `- Vous n'avez pas assez de bois : ${results[0].bois.toLocaleString('en-US')}/${quantite.toLocaleString('en-US')}`);
                            await interaction.reply({ content: reponse, ephemeral: true });
                            break;
                        } else {
                            offre(jsonPrix.bois)
                            break;
                        }
                    case 'Brique':
                        if (quantite > results[0].brique) {
                            reponse = codeBlock('diff', `- Vous n'avez pas assez de brique : ${results[0].brique.toLocaleString('en-US')}/${quantite.toLocaleString('en-US')}`);
                            await interaction.reply({ content: reponse, ephemeral: true });
                            break;
                        } else {
                            offre(jsonPrix.brique)
                            break;
                        }
                    case 'Eau':
                        if (quantite > results[0].eau) {
                            reponse = codeBlock('diff', `- Vous n'avez pas assez d'eau : ${results[0].eau.toLocaleString('en-US')}/${quantite.toLocaleString('en-US')}`);
                            await interaction.reply({ content: reponse, ephemeral: true });
                            break;
                        } else {
                            offre(jsonPrix.eau)
                            break;
                        }
                    case 'Metaux':
                        if (quantite > results[0].metaux) {
                            reponse = codeBlock('diff', `- Vous n'avez pas assez de métaux : ${results[0].metaux.toLocaleString('en-US')}/${quantite.toLocaleString('en-US')}`);
                            await interaction.reply({ content: reponse, ephemeral: true });
                            break;
                        } else {
                            offre(jsonPrix.metaux)
                            break;
                        }
                    case 'Nourriture':
                        if (quantite > results[0].nourriture) {
                            reponse = codeBlock('diff', `- Vous n'avez pas assez de nourriture : ${results[0].nourriture.toLocaleString('en-US')}/${quantite.toLocaleString('en-US')}`);
                            await interaction.reply({ content: reponse, ephemeral: true });
                            break;
                        } else {
                            offre(jsonPrix.nourriture)
                            break;
                        }
                    case 'Petrole':
                        if (quantite > results[0].petrole) {
                            reponse = codeBlock('diff', `- Vous n'avez pas assez de pétrole : ${results[0].petrole.toLocaleString('en-US')}/${quantite.toLocaleString('en-US')}`);
                            await interaction.reply({ content: reponse, ephemeral: true });
                            break;
                        } else {
                            offre(jsonPrix.petrole)
                            break;
                        }
                }
            }
        });
    },
};