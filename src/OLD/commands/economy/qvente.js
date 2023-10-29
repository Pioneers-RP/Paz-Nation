const { ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder, codeBlock} = require('discord.js');
const { readFileSync } = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('qvente')
        .setDescription(`Vendre des ressources sur le marché rapide (QM)`)
        .addStringOption(ressource =>
            ressource.setName('ressource')
                .setDescription(`La ressource que vous voulez vendre`)
                .addChoices(
                    { name: `Acier`, value: `Acier`},
                    { name: `Béton`, value: `Béton`},
                    { name: `Biens de consommation`, value: `Biens de consommation`},
                    { name: `Bois`, value: `Bois`},
                    { name: `Carburant`, value: `Carburant`},
                    { name: `Charbon`, value: `Charbon`},
                    { name: `Eau`, value: `Eau`},
                    { name: `Métaux`, value: `Métaux`},
                    { name: `Nourriture`, value: `Nourriture`},
                    { name: `Pétrole`, value: `Pétrole`},
                    { name: `Sable`, value: `Sable`},
                    { name: `Verre`, value: `Verre`}
                )
            .setRequired(true))
        .addIntegerOption(quantite =>
            quantite.setName('quantité')
            .setDescription(`La quantité de ressources que vous voulez vendre`)
            .setMinValue(1)
            .setRequired(true)),

    async execute(interaction) {
        const { connection } = require('../../index');

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
            function offre(prix_moyen, emoji) {
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
                    fields: [
                        {
                            name: `> ${emoji} Ressource :`,
                            value: codeBlock(
                                `• ${ressource}\n` +
                                `• Prix moyen : ${prix_moyen}`) + `\u200B`
                        },
                        {
                            name: `> 📦 Quantité :`,
                            value: codeBlock(`• ${quantite.toLocaleString('en-US')}`) + `\u200B`
                        },
                        {
                            name: `> <:PAZ:1108440620101546105> Prix :`,
                            value: codeBlock(
                                `• A l'unité (-30% du prix moyen) : ${prix_vente}\n` +
                                `• Au total : ${prix.toLocaleString('en-US')}`) + `\u200B`
                        }
                    ],
                    color: interaction.member.displayColor,
                    timestamp: new Date(),
                    footer: {
                        text: `${Pays.devise}`
                    },
                };

                const row = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                        .setLabel(`Vendre`)
                        .setEmoji(`💵`)
                        .setCustomId(`qvente-${interaction.user.id}`)
                        .setStyle(ButtonStyle.Success),
                    )
                    .addComponents(
                        new ButtonBuilder()
                        .setLabel(`Refuser`)
                        .setEmoji(`✋`)
                        .setCustomId(`refuser-${interaction.user.id}`)
                        .setStyle(ButtonStyle.Danger),
                    )

                interaction.reply({ embeds: [embed], components: [row] });
            }

            switch (ressource) {
                case 'Acier':
                    if (quantite > Ressources.acier) {
                        reponse = codeBlock('ansi', `\u001b[0m\u001b[1;31mVous n'avez pas assez d'acier : ${Ressources.acier.toLocaleString('en-US')}/${quantite.toLocaleString('en-US')}`);
                        await interaction.reply({ content: reponse, ephemeral: true });
                        break;
                    } else {
                        offre(jsonPrix.acier, '<:acier:1075776411329122304>')
                        break;
                    }
                case 'Béton':
                    if (quantite > Ressources.beton) {
                        reponse = codeBlock('ansi', `\u001b[0m\u001b[1;31mVous n'avez pas assez de béton : ${Ressources.beton.toLocaleString('en-US')}/${quantite.toLocaleString('en-US')}`);
                        await interaction.reply({ content: reponse, ephemeral: true });
                        break;
                    } else {
                        offre(jsonPrix.beton, '<:beton:1075776342227943526>')
                        break;
                    }
                case 'Biens de consommation':
                    if (quantite > Ressources.bc) {
                        reponse = codeBlock('ansi', `\u001b[0m\u001b[1;31mVous n'avez pas assez de biens de consommation : ${Ressources.bc.toLocaleString('en-US')}/${quantite.toLocaleString('en-US')}`);
                        await interaction.reply({ content: reponse, ephemeral: true });
                        break;
                    } else {
                        offre(jsonPrix.bc, '💻')
                        break;
                    }
                case 'Bois':
                    if (quantite > Ressources.bois) {
                        reponse = codeBlock('ansi', `\u001b[0m\u001b[1;31mVous n'avez pas assez de bois : ${Ressources.bois.toLocaleString('en-US')}/${quantite.toLocaleString('en-US')}`);
                        await interaction.reply({ content: reponse, ephemeral: true });
                        break;
                    } else {
                        offre(jsonPrix.bois, '🪵')
                        break;
                    }
                case 'Carburant':
                    if (quantite > Ressources.carburant) {
                        reponse = codeBlock('ansi', `\u001b[0m\u001b[1;31mVous n'avez pas assez de carburant : ${Ressources.carburant.toLocaleString('en-US')}/${quantite.toLocaleString('en-US')}`);
                        await interaction.reply({ content: reponse, ephemeral: true });
                        break;
                    } else {
                        offre(jsonPrix.carburant, '⛽')
                        break;
                    }
                case 'Charbon':
                    if (quantite > Ressources.charbon) {
                        reponse = codeBlock('ansi', `\u001b[0m\u001b[1;31mVous n'avez pas assez de charbon : ${Ressources.charbon.toLocaleString('en-US')}/${quantite.toLocaleString('en-US')}`);
                        await interaction.reply({ content: reponse, ephemeral: true });
                        break;
                    } else {
                        offre(jsonPrix.charbon, '<:charbon:1075776385517375638>')
                        break;
                    }
                case 'Eau':
                    if (quantite > Ressources.eau) {
                        reponse = codeBlock('ansi', `\u001b[0m\u001b[1;31mVous n'avez pas assez d'eau : ${Ressources.eau.toLocaleString('en-US')}/${quantite.toLocaleString('en-US')}`);
                        await interaction.reply({ content: reponse, ephemeral: true });
                        break;
                    } else {
                        offre(jsonPrix.eau, '💧')
                        break;
                    }
                case 'Métaux':
                    if (quantite > Ressources.metaux) {
                        reponse = codeBlock('ansi', `\u001b[0m\u001b[1;31mVous n'avez pas assez de métaux : ${Ressources.metaux.toLocaleString('en-US')}/${quantite.toLocaleString('en-US')}`);
                        await interaction.reply({ content: reponse, ephemeral: true });
                        break;
                    } else {
                        offre(jsonPrix.metaux, '🪨')
                        break;
                    }
                case 'Nourriture':
                    if (quantite > Ressources.nourriture) {
                        reponse = codeBlock('ansi', `\u001b[0m\u001b[1;31mVous n'avez pas assez de nourriture : ${Ressources.nourriture.toLocaleString('en-US')}/${quantite.toLocaleString('en-US')}`);
                        await interaction.reply({ content: reponse, ephemeral: true });
                        break;
                    } else {
                        offre(jsonPrix.nourriture, '🌽')
                        break;
                    }
                case 'Pétrole':
                    if (quantite > Ressources.petrole) {
                        reponse = codeBlock('ansi', `\u001b[0m\u001b[1;31mVous n'avez pas assez de pétrole : ${Ressources.petrole.toLocaleString('en-US')}/${quantite.toLocaleString('en-US')}`);
                        await interaction.reply({ content: reponse, ephemeral: true });
                        break;
                    } else {
                        offre(jsonPrix.petrole, '🛢️')
                        break;
                    }
                case 'Sable':
                    if (quantite > Ressources.sable) {
                        reponse = codeBlock('ansi', `\u001b[0m\u001b[1;31mVous n'avez pas assez de sable : ${Ressources.sable.toLocaleString('en-US')}/${quantite.toLocaleString('en-US')}`);
                        await interaction.reply({ content: reponse, ephemeral: true });
                        break;
                    } else {
                        offre(jsonPrix.sable, '<:sable:1075776363782479873>')
                        break;
                    }
                case 'Verre':
                    if (quantite > Ressources.verre) {
                        reponse = codeBlock('ansi', `\u001b[0m\u001b[1;31mVous n'avez pas assez de verre : ${Ressources.verre.toLocaleString('en-US')}/${quantite.toLocaleString('en-US')}`);
                        await interaction.reply({ content: reponse, ephemeral: true });
                        break;
                    } else {
                        offre(jsonPrix.verre, '🪟')
                        break;
                    }
            }
        });
    },
};