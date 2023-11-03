import {ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder, codeBlock} from 'discord.js';
import {readFileSync} from 'fs';
import {toEmoji, toId, toName} from "../../fonctions/functions";

module.exports = {
    data: new SlashCommandBuilder()
        .setName('qachat')
        .setDescription(`Acheter des ressources sur le marché rapide (QM)`)
        .addStringOption(ressource =>
            ressource.setName('ressource')
            .setDescription(`La ressource que vous voulez acheter`)
            .addChoices(
                { name: `Acier`, value: `acier`},
                { name: `Béton`, value: `beton`},
                { name: `Biens de consommation`, value: `bc`},
                { name: `Bois`, value: `bois`},
                { name: `Carburant`, value: `carburant`},
                { name: `Charbon`, value: `charbon`},
                { name: `Eau`, value: `eau`},
                { name: `Métaux`, value: `metaux`},
                { name: `Nourriture`, value: `nourriture`},
                { name: `Pétrole`, value: `petrole`},
                { name: `Sable`, value: `sable`},
                { name: `Verre`, value: `verre`}
            )
            .setRequired(true))
        .addIntegerOption(quantite =>
            quantite.setName('quantité')
            .setDescription(`La quantité de ressources que vous voulez acheter`)
            .setMinValue(1)
            .setRequired(true)),

    async execute(interaction: any) {
        const { connection } = require('../../index.ts');

        const sql = `SELECT * FROM pays WHERE id_joueur=${interaction.member.id}`;

        connection.query(sql, async(err: any, results: any[]) => {if (err) {throw err;}
            const Pays = results[0];

            const resourceId: string = interaction.options.getString('ressource');
            const resourceName: string = toName(resourceId);
            const quantity = interaction.options.getInteger('quantité');
            const jsonPrix = JSON.parse(readFileSync('data/prix.json', 'utf-8'));
            function offre(prix_moyen: number, emoji: string) {
                const buyingPrice = parseFloat((prix_moyen * 1.3).toFixed(2));
                const price = Math.ceil(quantity * buyingPrice);

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
                                `• ${resourceName}\n` +
                                `• Prix moyen : ${prix_moyen}`) + `\u200B`
                        },
                        {
                            name: `> 📦 Quantité :`,
                            value: codeBlock(`• ${quantity.toLocaleString('en-US')}`) + `\u200B`
                        },
                        {
                            name: `> <:PAZ:1108440620101546105> Prix :`,
                            value: codeBlock(`• A l'unité (+30% du prix moyen) : ${buyingPrice}\n` +
                                `• Au total : ${price.toLocaleString('en-US')}`) + `\u200B`
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
            offre(eval(`jsonPrix.${resourceId}`), toEmoji(resourceId))
        });
    },
};