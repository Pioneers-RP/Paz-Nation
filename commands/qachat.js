const { SlashCommandBuilder, codeBlock } = require('@discordjs/builders');
const { MessageActionRow, MessageButton } = require('discord.js');
const { readFileSync } = require('fs');

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
        const { connection } = require('../index.js');

        var sql = `SELECT * FROM pays WHERE id_joueur=${interaction.member.id}`;

        connection.query(sql, async(err, results) => {if (err) {throw err;}

            const ressource = interaction.options.getString('ressource');
            var quantité = interaction.options.getInteger('quantité');
            const jsonPrix = JSON.parse(readFileSync('data/prix.json', 'utf-8'));

            if (quantité < 0) {
                var reponse = codeBlock('diff', `- Veillez indiquer une quantité positive`);
                await interaction.reply({ content: reponse, ephemeral: true });
            } else {
                function offre(prix_moyen) {

                    var prix_achat = parseFloat((prix_moyen * 1.3).toFixed(2));
                    var prix = Math.round(quantité * prix_achat);

                    const embed = {
                        author: {
                            name: `${results[0].rang} de ${results[0].nom}`,
                            icon_url: interaction.member.displayAvatarURL()
                        },
                        thumbnail: {
                            url: results[0].drapeau
                        },
                        title: `\`Acheter au marché rapide :\``,
                        fields: [{
                                name: `Ressource :`,
                                value: codeBlock(
                                    `• ${ressource}\n` +
                                    `• Prix moyen : ${prix_moyen}`) + `\u200B`
                            },
                            {
                                name: `Quantité :`,
                                value: codeBlock(`• ${quantité.toLocaleString('en-US')}`) + `\u200B`
                            },
                            {
                                name: `Prix :`,
                                value: codeBlock(`• A l'unité (+30% du prix moyen) : ${prix_achat}\n` +
                                    `• Au total : ${prix.toLocaleString('en-US')}`) + `\u200B`
                            },
                            {
                                name: `Votre argent :`,
                                value: codeBlock(`• ${results[0].cash.toLocaleString('en-US')}`) + `\u200B`
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
                        offre(jsonPrix.bc)
                        break;
                    case 'Bois':
                        offre(jsonPrix.bois)
                        break;
                    case 'Brique':
                        offre(jsonPrix.brique)
                        break;
                    case 'Eau':
                        offre(jsonPrix.eau)
                        break;
                    case 'Metaux':
                        offre(jsonPrix.metaux)
                        break;
                    case 'Nourriture':
                        offre(jsonPrix.nourriture)
                        break;
                    case 'Petrole':
                        offre(jsonPrix.petrole)
                        break;
                }
            }
        });
    },
};