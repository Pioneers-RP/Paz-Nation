const { ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder, codeBlock} = require('discord.js');
const { readFileSync } = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('qachat')
        .setDescription(`Acheter des ressources sur le marché rapide (QM)`)
        .addStringOption(ressource =>
            ressource.setName('ressource')
            .setDescription(`La ressource que vous voulez acheter`)
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
            .setDescription(`La quantité de ressources que vous voulez acheter`)
            .setMinValue(1)
            .setRequired(true)),

    async execute(interaction) {
        const { connection } = require('../../index');

        const sql = `SELECT * FROM pays WHERE id_joueur=${interaction.member.id}`;

        connection.query(sql, async(err, results) => {if (err) {throw err;}
            const Pays = results[0];

            const ressource = interaction.options.getString('ressource');
            const quantite = interaction.options.getInteger('quantité');
            const jsonPrix = JSON.parse(readFileSync('OLD/data/prix.json', 'utf-8'));
            function offre(prix_moyen, emoji) {

                const prix_achat = parseFloat((prix_moyen * 1.3).toFixed(2));
                const prix = Math.ceil(quantite * prix_achat);

                const embed = {
                    author: {
                        name: `${Pays.rang} de ${Pays.nom}`,
                        icon_url: interaction.member.displayAvatarURL()
                    },
                    thumbnail: {
                        url: Pays.drapeau
                    },
                    title: `\`Acheter au marché rapide :\``,
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
                            value: codeBlock(`• A l'unité (+30% du prix moyen) : ${prix_achat}\n` +
                                `• Au total : ${prix.toLocaleString('en-US')}`) + `\u200B`
                        },
                        {
                            name: `> <:PAZ:1108440620101546105> Votre argent :`,
                            value: codeBlock(`• ${Pays.cash.toLocaleString('en-US')}`) + `\u200B`
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
                        .setLabel(`Acheter`)
                        .setEmoji(`💵`)
                        .setCustomId(`qachat-${interaction.user.id}`)
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
                    offre(jsonPrix.acier, '<:acier:1075776411329122304>')
                    break;
                case 'Béton':
                    offre(jsonPrix.beton, '<:beton:1075776342227943526>')
                    break;
                case 'Biens de consommation':
                    offre(jsonPrix.bc, '💻')
                    break;
                case 'Bois':
                    offre(jsonPrix.bois, '🪵')
                    break;
                case 'Carburant':
                    offre(jsonPrix.carburant, '⛽')
                    break;
                case 'Charbon':
                    offre(jsonPrix.charbon, '<:charbon:1075776385517375638>')
                    break;
                case 'Eau':
                    offre(jsonPrix.eau, '💧')
                    break;
                case 'Métaux':
                    offre(jsonPrix.metaux, '🪨')
                    break;
                case 'Nourriture':
                    offre(jsonPrix.nourriture, '🌽')
                    break;
                case 'Pétrole':
                    offre(jsonPrix.petrole, '🛢️')
                    break;
                case 'Sable':
                    offre(jsonPrix.sable, '<:sable:1075776363782479873>')
                    break;
                case 'Verre':
                    offre(jsonPrix.verre, '🪟')
                    break;
            }
        });
    },
};