const { MessageActionRow, MessageSelectMenu } = require('discord.js');
const { SlashCommandBuilder, codeBlock } = require('@discordjs/builders');
const { readFileSync } = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('usine')
        .setDescription(`Menu pour voir vos usines`),

    async execute(interaction) {
        const { connection } = require('../index.js');
        const batimentObject = JSON.parse(readFileSync('data/batiment.json', 'utf-8'));

        const sql = `
            SELECT * FROM batiments WHERE id_joueur=${interaction.member.id};
            SELECT * FROM pays WHERE id_joueur=${interaction.member.id}
        `;
        connection.query(sql, async(err, results) => {if (err) {throw err;}
            const Batiment = results[0][0];
            const Pays = results[1][0];

            let surface_T_briqueterie = batimentObject.briqueterie.SURFACE_BRIQUETERIE * Batiment.briqueterie;
            let surface_T_champ = batimentObject.champ.SURFACE_CHAMP * Batiment.champ;
            let surface_T_centrale_fioul = batimentObject.centrale_fioul.SURFACE_CENTRALE_FIOUL * Batiment.centrale_fioul;
            let surface_T_eolienne = batimentObject.eolienne.SURFACE_EOLIENNE * Batiment.eolienne;
            let surface_T_mine = batimentObject.mine.SURFACE_MINE * Batiment.mine;
            let surface_T_pompe_a_eau = batimentObject.pompe_a_eau.SURFACE_POMPE_A_EAU * Batiment.pompe_a_eau;
            let surface_T_pumpjack = batimentObject.pumpjack.SURFACE_PUMPJACK * Batiment.pumpjack;
            let surface_T_scierie = batimentObject.scierie.SURFACE_SCIERIE * Batiment.scierie;
            let surface_T_usine_civile = batimentObject.usine_civile.SURFACE_USINE_CIVILE * Batiment.usine_civile;
            let surface_T = surface_T_briqueterie + surface_T_champ + surface_T_centrale_fioul + surface_T_eolienne + surface_T_pompe_a_eau + surface_T_pumpjack + surface_T_mine + surface_T_scierie + surface_T_usine_civile;

            const embed = {
                author: {
                    name: `${Pays.rang} de ${Pays.nom}`,
                    icon_url: interaction.member.displayAvatarURL()
                },
                thumbnail: {
                    url: `${Pays.drapeau}`
                },
                title: `\`Menu des usines\``,
                description: codeBlock(
                    `• Nombre d'usines totale : ${Batiment.usine_total.toLocaleString('en-US')}\n` +
                    `• Surface totale : ${surface_T.toLocaleString('en-US')}`) + `\u200B`,
                fields: [{
                    name: `> 🧱 Briqueterie :`,
                    value: codeBlock(
                        `• Nombre d'usine : ${Batiment.briqueterie.toLocaleString('en-US')}\n` +
                        `• Surface totale : ${surface_T_briqueterie.toLocaleString('en-US')} km²`) + `\u200B`
                },
                    {
                        name: `> 🌽 Champ :`,
                        value: codeBlock(
                            `• Nombre d'usine : ${Batiment.champ.toLocaleString('en-US')}\n` +
                            `• Surface totale : ${surface_T_champ.toLocaleString('en-US')} km²`) + `\u200B`
                    },
                    {
                        name: `> ⚡ Centrale au fioul :`,
                        value: codeBlock(
                            `• Nombre d'usine : ${Batiment.centrale_fioul.toLocaleString('en-US')}\n` +
                            `• Surface totale : ${surface_T_centrale_fioul.toLocaleString('en-US')} km²`) + `\u200B`
                    },
                    {
                        name: `> ⚡ Eolienne :`,
                        value: codeBlock(
                            `• Nombre d'usine : ${Batiment.eolienne.toLocaleString('en-US')}\n` +
                            `• Surface totale : ${surface_T_eolienne.toLocaleString('en-US')} km²`) + `\u200B`
                    },
                    {
                        name: `> 🪨 Mine :`,
                        value: codeBlock(
                            `• Nombre d'usine : ${Batiment.mine.toLocaleString('en-US')}\n` +
                            `• Surface totale : ${surface_T_mine.toLocaleString('en-US')} km²`) + `\u200B`
                    },
                    {
                        name: `> 💧 Pompe à eau :`,
                        value: codeBlock(
                            `• Nombre d'usine : ${Batiment.pompe_a_eau.toLocaleString('en-US')}\n` +
                            `• Surface totale : ${surface_T_pompe_a_eau.toLocaleString('en-US')} km²`) + `\u200B`
                    },
                    {
                        name: `> 🛢️ Pumpjack :`,
                        value: codeBlock(
                            `• Nombre d'usine : ${Batiment.pumpjack.toLocaleString('en-US')}\n` +
                            `• Surface totale : ${surface_T_pumpjack.toLocaleString('en-US')} km²`) + `\u200B`
                    },
                    {
                        name: `> 🪵 Scierie :`,
                        value: codeBlock(
                            `• Nombre d'usine : ${Batiment.scierie.toLocaleString('en-US')}\n` +
                            `• Surface totale : ${surface_T_scierie.toLocaleString('en-US')} km²`) + `\u200B`
                    },
                    {
                        name: `> 💻 Usine civile :`,
                        value: codeBlock(
                            `• Nombre d'usine : ${Batiment.usine_civile.toLocaleString('en-US')}\n` +
                            `• Surface totale : ${surface_T_usine_civile.toLocaleString('en-US')} km²`) + `\u200B`
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
                    new MessageSelectMenu()
                        .setCustomId('usine')
                        .setPlaceholder(`Le type d\'usine`)
                        .addOptions([
                            {
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
                                label: `Centrale au fioul`,
                                emoji: `⚡`,
                                description: `Produit de l'électricité`,
                                value: 'centrale_fioul',
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