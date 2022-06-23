const { MessageActionRow, MessageSelectMenu } = require('discord.js');
const { SlashCommandBuilder, codeBlock } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('usine')
        .setDescription(`Menu pour voir vos usines`),

    async execute(interaction) {
        const { connection } = require('../index.js');

        var sql = `
            SELECT * FROM pays WHERE id_joueur=${interaction.member.id}`;

        connection.query(sql, async(err, results) => {
            if (err) {
                throw err;
            }

            surface_T_briqueterie = process.env.SURFACE_BRIQUETERIE * results[0].briqueterie;
            surface_T_champ = process.env.SURFACE_CHAMP * results[0].champ;
            surface_T_centrale_elec = process.env.SURFACE_CENTRALE_ELEC * results[0].centrale_elec;
            surface_T_eolienne = process.env.SURFACE_EOLIENNE * results[0].eolienne;
            surface_T_mine = process.env.SURFACE_MINE * results[0].mine;
            surface_T_pompe_a_eau = process.env.SURFACE_POMPE_A_EAU * results[0].pompe_a_eau;
            surface_T_pumpjack = process.env.SURFACE_PUMPJACK * results[0].pumpjack;
            surface_T_scierie = process.env.SURFACE_SCIERIE * results[0].scierie;
            surface_T_usine_civile = process.env.SURFACE_USINE_CIVILE * results[0].usine_civile;
            surface_T = surface_T_briqueterie + surface_T_champ + surface_T_centrale_elec + surface_T_eolienne + surface_T_pompe_a_eau + surface_T_pumpjack + surface_T_mine + surface_T_scierie + surface_T_usine_civile;

            const embed = {
                author: {
                    name: `${results[0].rang} de ${results[0].nom}`,
                    icon_url: interaction.member.displayAvatarURL()
                },
                thumbnail: {
                    url: `${results[0].drapeau}`
                },
                title: `\`Menu des usines\``,
                description: codeBlock(
                    `• Nombre d'usines totale : ${results[0].usine_total.toLocaleString('en-US')}\n` +
                    `• Surface totale : ${surface_T.toLocaleString('en-US')}`) + `\u200B`,
                fields: [{
                        name: `> 🧱 Briqueterie :`,
                        value: codeBlock(
                            `• Nombre d'usine : ${results[0].briqueterie.toLocaleString('en-US')}\n` +
                            `• Surface totale : ${surface_T_briqueterie.toLocaleString('en-US')} km²`) + `\u200B`
                    },
                    {
                        name: `> 🌽 Champ :`,
                        value: codeBlock(
                            `• Nombre d'usine : ${results[0].champ.toLocaleString('en-US')}\n` +
                            `• Surface totale : ${surface_T_champ.toLocaleString('en-US')} km²`) + `\u200B`
                    },
                    {
                        name: `> ⚡ Centrale électrique :`,
                        value: codeBlock(
                            `• Nombre d'usine : ${results[0].centrale_elec.toLocaleString('en-US')}\n` +
                            `• Surface totale : ${surface_T_centrale_elec.toLocaleString('en-US')} km²`) + `\u200B`
                    },
                    {
                        name: `> ⚡ Eolienne :`,
                        value: codeBlock(
                            `• Nombre d'usine : ${results[0].eolienne.toLocaleString('en-US')}\n` +
                            `• Surface totale : ${surface_T_eolienne.toLocaleString('en-US')} km²`) + `\u200B`
                    },
                    {
                        name: `> 🪨 Mine :`,
                        value: codeBlock(
                            `• Nombre d'usine : ${results[0].mine.toLocaleString('en-US')}\n` +
                            `• Surface totale : ${surface_T_mine.toLocaleString('en-US')} km²`) + `\u200B`
                    },
                    {
                        name: `> 💧 Pompe à eau :`,
                        value: codeBlock(
                            `• Nombre d'usine : ${results[0].pompe_a_eau.toLocaleString('en-US')}\n` +
                            `• Surface totale : ${surface_T_pompe_a_eau.toLocaleString('en-US')} km²`) + `\u200B`
                    },
                    {
                        name: `> 🛢️ Pumpjack :`,
                        value: codeBlock(
                            `• Nombre d'usine : ${results[0].pumpjack.toLocaleString('en-US')}\n` +
                            `• Surface totale : ${surface_T_pumpjack.toLocaleString('en-US')} km²`) + `\u200B`
                    },
                    {
                        name: `> 🪵 Scierie :`,
                        value: codeBlock(
                            `• Nombre d'usine : ${results[0].scierie.toLocaleString('en-US')}\n` +
                            `• Surface totale : ${surface_T_scierie.toLocaleString('en-US')} km²`) + `\u200B`
                    },
                    {
                        name: `> 💻 Usine civile :`,
                        value: codeBlock(
                            `• Nombre d'usine : ${results[0].usine_civile.toLocaleString('en-US')}\n` +
                            `• Surface totale : ${surface_T_usine_civile.toLocaleString('en-US')} km²`) + `\u200B`
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
                            emoji: `🧱`,
                            description: `Produit de la brique`,
                            value: 'briqueterie',
                        },
                        {
                            label: `Champ`,
                            emoji: `🌽`,
                            description: `Produit de la nourriture`,
                            value: 'champ',
                        },
                        {
                            label: `Centrale électrique`,
                            emoji: `⚡`,
                            description: `Produit de l'électricité`,
                            value: 'centrale_elec',
                        },
                        {
                            label: `Eolienne`,
                            emoji: `⚡`,
                            description: `Produit de l'électricité`,
                            value: 'eolienne',
                        },
                        {
                            label: `Mine`,
                            emoji: `🪨`,
                            description: `Produit des métaux`,
                            value: 'mine',
                        },
                        {
                            label: `Pompe à eau`,
                            emoji: `💧`,
                            description: `Produit de l\'eau`,
                            value: 'pompe_a_eau',
                        },
                        {
                            label: `Pumpjack`,
                            emoji: `🛢️`,
                            description: `Produit du pétrole`,
                            value: 'pumpjack',
                        },
                        {
                            label: `Scierie`,
                            emoji: `🪵`,
                            description: `Produit du bois`,
                            value: 'scierie',
                        },
                        {
                            label: `Usine civile`,
                            emoji: `💻`,
                            description: `Produit des biens de consommation`,
                            value: 'usine_civile',
                        },
                    ]),
                );

            await interaction.reply({ embeds: [embed], components: [row] });
        });
    },
};