const { ActionRowBuilder, SlashCommandBuilder, StringSelectMenuBuilder, codeBlock} = require('discord.js');
const { readFileSync } = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('industrie')
        .setDescription(`Voir vos industries`),

    async execute(interaction) {
        const { connection } = require('../../index.js');
        const batimentObject = JSON.parse(readFileSync('data/batiment.json', 'utf-8'));

        const sql = `
            SELECT * FROM batiments WHERE id_joueur=${interaction.member.id};
            SELECT * FROM pays WHERE id_joueur=${interaction.member.id}
        `;
        connection.query(sql, async(err, results) => {if (err) {throw err;}
            const Batiment = results[0][0];
            const Pays = results[1][0];

            const embed = {
                author: {
                    name: `${Pays.rang} de ${Pays.nom}`,
                    icon_url: interaction.member.displayAvatarURL()
                },
                title: `\`Menu des industries\``,
                thumbnail: {
                    url: `${Pays.drapeau}`
                },
                fields: [
                    {
                        name: `> <:acier:1075776411329122304> Acierie :`,
                        value: codeBlock(
                            `• Nombre d'usine : ${Batiment.acierie.toLocaleString('en-US')}\n`) + `\u200B`
                    },
                    {
                        name: `> 🪟 Atelier de verre :`,
                        value: codeBlock(
                            `• Nombre d'usine : ${Batiment.atelier_verre.toLocaleString('en-US')}\n`) + `\u200B`
                    },
                    {
                        name: `> <:sable:1075776363782479873> Carrière de sable :`,
                        value: codeBlock(
                            `• Nombre d'usine : ${Batiment.carriere_sable.toLocaleString('en-US')}\n`) + `\u200B`
                    },
                    {
                        name: `> ⚡ Centrale biomasse :`,
                        value: codeBlock(
                            `• Nombre d'usine : ${Batiment.centrale_biomasse.toLocaleString('en-US')}\n`) + `\u200B`
                    },
                    {
                        name: `> ⚡ Centrale au charbon :`,
                        value: codeBlock(
                            `• Nombre d'usine : ${Batiment.centrale_charbon.toLocaleString('en-US')}\n`) + `\u200B`
                    },
                    {
                        name: `> ⚡ Centrale au fioul :`,
                        value: codeBlock(
                            `• Nombre d'usine : ${Batiment.centrale_fioul.toLocaleString('en-US')}\n`) + `\u200B`
                    },
                    {
                        name: `> 🌽 Champ :`,
                        value: codeBlock(
                            `• Nombre d'usine : ${Batiment.champ.toLocaleString('en-US')}\n`) + `\u200B`
                    },
                    {
                        name: `> <:beton:1075776342227943526> Cimenterie :`,
                        value: codeBlock(
                            `• Nombre d'usine : ${Batiment.cimenterie.toLocaleString('en-US')}\n`) + `\u200B`
                    },
                    {
                        name: `> 🛢️ Derrick :`,
                        value: codeBlock(
                            `• Nombre d'usine : ${Batiment.derrick.toLocaleString('en-US')}\n`) + `\u200B`
                    },
                    {
                        name: `> ⚡ Eolienne :`,
                        value: codeBlock(
                            `• Nombre d'usine : ${Batiment.eolienne.toLocaleString('en-US')}\n`) + `\u200B`
                    },
                    {
                        name: `> <:charbon:1075776385517375638> Mine de charbon :`,
                        value: codeBlock(
                            `• Nombre d'usine : ${Batiment.mine_charbon.toLocaleString('en-US')}\n`) + `\u200B`
                    },
                    {
                        name: `> 🪨 Mine de métaux:`,
                        value: codeBlock(
                            `• Nombre d'usine : ${Batiment.mine_metaux.toLocaleString('en-US')}\n`) + `\u200B`
                    },
                    {
                        name: `> 💧 Station de pompage :`,
                        value: codeBlock(
                            `• Nombre d'usine : ${Batiment.station_pompage.toLocaleString('en-US')}\n`) + `\u200B`
                    },
                    {
                        name: `> ⛽ Raffinerie :`,
                        value: codeBlock(
                            `• Nombre d'usine : ${Batiment.raffinerie.toLocaleString('en-US')}\n`) + `\u200B`
                    },
                    {
                        name: `> 🪵 Scierie :`,
                        value: codeBlock(
                            `• Nombre d'usine : ${Batiment.scierie.toLocaleString('en-US')}\n`) + `\u200B`
                    },
                    {
                        name: `> 💻 Usine civile :`,
                        value: codeBlock(
                            `• Nombre d'usine : ${Batiment.usine_civile.toLocaleString('en-US')}\n`) + `\u200B`
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
                    new StringSelectMenuBuilder()
                        .setCustomId('usine')
                        .setPlaceholder(`Le type d\'usine`)
                        .addOptions([
                            {
                                label: `Acierie`,
                                emoji: `<:acier:1075776411329122304>`,
                                description: `Produit de l'acier`,
                                value: 'acierie',
                            },
                            {
                                label: `Atelier de verre`,
                                emoji: `🪟`,
                                description: `Produit du verre`,
                                value: 'atelier_verre',
                            },
                            {
                                label: `Carrière de sable`,
                                emoji: `<:sable:1075776363782479873>`,
                                description: `Produit du sable`,
                                value: 'carriere_sable',
                            },
                            {
                                label: `Centrale biomasse`,
                                emoji: `⚡`,
                                description: `Produit de l'électricité`,
                                value: 'centrale_biomasse',
                            },
                            {
                                label: `Centrale au charbon`,
                                emoji: `⚡`,
                                description: `Produit de l'électricité`,
                                value: 'centrale_charbon',
                            },
                            {
                                label: `Centrale au fioul`,
                                emoji: `⚡`,
                                description: `Produit de l'électricité`,
                                value: 'centrale_fioul',
                            },
                            {
                                label: `Champ`,
                                emoji: `🌽`,
                                description: `Produit de la nourriture`,
                                value: 'champ',
                            },
                            {
                                label: `Cimenterie`,
                                emoji: `<:beton:1075776342227943526>`,
                                description: `Produit du béton`,
                                value: 'cimenterie',
                            },
                            {
                                label: `Derrick`,
                                emoji: `🛢️`,
                                description: `Produit du pétrole`,
                                value: 'derrick',
                            },
                            {
                                label: `Eolienne`,
                                emoji: `⚡`,
                                description: `Produit de l'électricité`,
                                value: 'eolienne',
                            },
                            {
                                label: `Mine de charbon`,
                                emoji: `<:charbon:1075776385517375638>`,
                                description: `Produit du charbon`,
                                value: 'mine_charbon',
                            },
                            {
                                label: `Mine de métaux`,
                                emoji: `🪨`,
                                description: `Produit des métaux`,
                                value: 'mine_metaux',
                            },
                            {
                                label: `Station de pompage`,
                                emoji: `💧`,
                                description: `Produit de l\'eau`,
                                value: 'station_pompage',
                            },
                            {
                                label: `Raffinerie`,
                                emoji: `⛽`,
                                description: `Produit du carburant`,
                                value: 'raffinerie',
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