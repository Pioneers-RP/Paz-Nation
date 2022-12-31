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

        const sql = `
            SELECT * FROM pays WHERE id_joueur=${interaction.member.id};
            SELECT * FROM ressources WHERE id_joueur=${interaction.member.id}
        `;
        connection.query(sql, async(err, results) => {if (err) {throw err;}
            let reponse;

            const Pays = results[0][0];
            const Ressources = results[1][0];
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
                            name: `${Pays.rang} de ${Pays.nom}`,
                            icon_url: interaction.member.displayAvatarURL()
                        },
                        thumbnail: {
                            url: Pays.drapeau
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
                            text: `${Pays.devise}`
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
                        if (quantite > Ressources.bc) {
                            reponse = codeBlock('diff', `- Vous n'avez pas assez de biens de consommation : ${Ressources.bc.toLocaleString('en-US')}/${quantite.toLocaleString('en-US')}`);
                            await interaction.reply({ content: reponse, ephemeral: true });
                            break;
                        } else {
                            offre(jsonPrix.bc)
                            break;
                        }
                    case 'Bois':
                        if (quantite > Ressources.bois) {
                            reponse = codeBlock('diff', `- Vous n'avez pas assez de bois : ${Ressources.bois.toLocaleString('en-US')}/${quantite.toLocaleString('en-US')}`);
                            await interaction.reply({ content: reponse, ephemeral: true });
                            break;
                        } else {
                            offre(jsonPrix.bois)
                            break;
                        }
                    case 'Brique':
                        if (quantite > Ressources.brique) {
                            reponse = codeBlock('diff', `- Vous n'avez pas assez de brique : ${Ressources.brique.toLocaleString('en-US')}/${quantite.toLocaleString('en-US')}`);
                            await interaction.reply({ content: reponse, ephemeral: true });
                            break;
                        } else {
                            offre(jsonPrix.brique)
                            break;
                        }
                    case 'Eau':
                        if (quantite > Ressources.eau) {
                            reponse = codeBlock('diff', `- Vous n'avez pas assez d'eau : ${Ressources.eau.toLocaleString('en-US')}/${quantite.toLocaleString('en-US')}`);
                            await interaction.reply({ content: reponse, ephemeral: true });
                            break;
                        } else {
                            offre(jsonPrix.eau)
                            break;
                        }
                    case 'Metaux':
                        if (quantite > Ressources.metaux) {
                            reponse = codeBlock('diff', `- Vous n'avez pas assez de métaux : ${Ressources.metaux.toLocaleString('en-US')}/${quantite.toLocaleString('en-US')}`);
                            await interaction.reply({ content: reponse, ephemeral: true });
                            break;
                        } else {
                            offre(jsonPrix.metaux)
                            break;
                        }
                    case 'Nourriture':
                        if (quantite > Ressources.nourriture) {
                            reponse = codeBlock('diff', `- Vous n'avez pas assez de nourriture : ${Ressources.nourriture.toLocaleString('en-US')}/${quantite.toLocaleString('en-US')}`);
                            await interaction.reply({ content: reponse, ephemeral: true });
                            break;
                        } else {
                            offre(jsonPrix.nourriture)
                            break;
                        }
                    case 'Petrole':
                        if (quantite > Ressources.petrole) {
                            reponse = codeBlock('diff', `- Vous n'avez pas assez de pétrole : ${Ressources.petrole.toLocaleString('en-US')}/${quantite.toLocaleString('en-US')}`);
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