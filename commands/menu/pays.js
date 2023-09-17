const { ActionRowBuilder, SlashCommandBuilder, StringSelectMenuBuilder, ButtonBuilder, ButtonStyle, codeBlock} = require('discord.js');
const { readFileSync } = require('fs');
const {calculerSoldat, calculerEmploi} = require("../../fonctions/functions");
const armeeObject = JSON.parse(readFileSync('data/armee.json', 'utf-8'));
const batimentObject = JSON.parse(readFileSync('data/batiment.json', 'utf-8'));
const biomeObject = JSON.parse(readFileSync('data/biome.json', 'utf-8'));

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pays')
        .setDescription(`Statistiques de votre pays`),

    async execute(interaction) {
        const { connection } = require("../../index");

        let sql = `
            SELECT * FROM armee WHERE id_joueur='${interaction.member.id}';
            SELECT * FROM batiments WHERE id_joueur='${interaction.member.id}';
            SELECT * FROM diplomatie WHERE id_joueur='${interaction.member.id}';
            SELECT * FROM pays WHERE id_joueur='${interaction.member.id}';
            SELECT * FROM population WHERE id_joueur='${interaction.member.id}';
            SELECT * FROM territoire WHERE id_joueur='${interaction.member.id}'
        `;
        connection.query(sql, async(err, results) => {if (err) {throw err;}
            const Armee = results[0][0];
            const Batiment = results[1][0];
            const Diplomatie = results[2][0];
            const Pays = results[3][0];
            const Population = results[4][0];
            const Territoire = results[5][0];

            if (!results[0][0]) {
                const reponse = codeBlock('ansi', `\u001b[0;0m\u001b[1;31mVous ne jouez actuellement pas. Commencez dès maintenant en allant dans #commencer`);
                const bouton1 = new ButtonBuilder()
                            .setLabel(`Débuter sur Paz Nation`)
                            .setEmoji(`🔌`)
                            .setURL('https://discord.com/channels/826427184305537054/983316109367345152/1058766018123673680')
                            .setStyle(ButtonStyle.Link)
                const row = new ActionRowBuilder()
                    .addComponents(bouton1)
                await interaction.reply({ content: reponse, components: [row], ephemeral: true });
            } else {
                const region = eval(`biomeObject.${Territoire.region}.nom`);

                //region Calcul du nombre d'employés
                const emploisTotaux = calculerEmploi(Armee, Batiment, Population, armeeObject, batimentObject).emploisTotaux;
                const soldat = calculerSoldat(Armee, armeeObject)

                let chomage;
                if (emploisTotaux/(Population.jeune + Population.adulte - soldat) > 1) {
                    chomage = 0
                } else {
                    chomage = ((((Population.jeune + Population.adulte - soldat)-emploisTotaux)/(Population.jeune + Population.adulte - soldat))*100).toFixed(2)
                }
                //endregion
                let embed = {
                    author: {
                        name: `${Pays.rang} de ${Pays.nom}`,
                        icon_url: interaction.member.displayAvatarURL()
                    },
                    thumbnail: {
                        url: Pays.drapeau
                    },
                    title: `\`Vue globale du pays\``,
                    fields: [
                        {
                            name: `> <:PAZ:1108440620101546105> Argent :`,
                            value: codeBlock(`• ${Pays.cash.toLocaleString('en-US')} PAZ`) + `\u200B`
                        },
                        {
                            name: `> 👪 Population :`,
                            value: codeBlock(
                                `• ${Population.habitant.toLocaleString('en-US')} habitants\n` +
                                `• ${chomage.toLocaleString('en-US')}% de chômage`) + `\u200B`
                        },
                        {
                            name: `> 🌄 Territoire :`,
                            value: codeBlock(
                                `• ${region}\n` +
                                `• ${Territoire.T_total.toLocaleString('en-US')} km² total\n` +
                                `• ${Territoire.T_libre.toLocaleString('en-US')} km² libre\n` +
                                `• ${Territoire.hexagone.toLocaleString('en-US')} cases\n` +
                                `• ${(Territoire.cg * 1000).toLocaleString('en-US')} km² de capacité de gouvernance\n`) + `\u200B`
                        },
                        {
                            name: `> 🏦 Diplomatie :`,
                            value: codeBlock(
                                `• ${Diplomatie.influence} influence\n`) + `\u200B`
                        },
                    ],
                    color: interaction.member.displayColor,
                    timestamp: new Date(),
                    footer: {
                        text: `${Pays.devise}`
                    },
                };

                const options = [
                    {
                        label: `Diplomatie`,
                        emoji: `🏦`,
                        description: `Menu de la diplomatie`,
                        value: 'diplomatie',
                    },
                    {
                        label: `Economie`,
                        emoji: `💵`,
                        description: `Menu de l'économie`,
                        value: 'economie',
                    },
                    {
                        label: `Gouvernement`,
                        emoji: `🏛`,
                        description: `Menu du gouvernement`,
                        value: 'gouvernement',
                    },
                    {
                        label: `Industrie`,
                        emoji: `🏭`,
                        description: `Menu des industries`,
                        value: 'industrie',
                    },
                    {
                        label: `Population`,
                        emoji: `👪`,
                        description: `Menu de la population`,
                        value: 'population',
                    },
                    {
                        label: `Options`,
                        emoji: `⚙️`,
                        description: `Menu des options`,
                        value: 'options',
                    },
                    {
                        label: `Territoire`,
                        emoji: `🏞️`,
                        description: `Menu du territoire`,
                        value: 'territoire',
                    }
                ];
                if (Pays.rang !== 'Cité') {
                    options.unshift(
                        {
                            label: `Armée`,
                            emoji: `🪖`,
                            description: `Menu de l'armée`,
                            value: 'armee',
                        })
                }
                const row = new ActionRowBuilder()
                    .addComponents(
                        new StringSelectMenuBuilder()
                            .setCustomId('action-pays')
                            .setPlaceholder(`Afficher un autre menu`)
                            .addOptions(options),
                    );
                interaction.reply({ embeds: [embed], components: [row] });
            }
        });
    },
};