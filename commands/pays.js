const { MessageActionRow, MessageButton } = require('discord.js');
const { SlashCommandBuilder, codeBlock } = require('@discordjs/builders');
const { readFileSync } = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pays')
        .setDescription(`Statistiques de votre pays`)
        .addUserOption(user =>
            user.setName('joueur')
                .setDescription(`Le joueur dont vous voulez voir l'économie`)),

    async execute(interaction) {
        const { connection } = require('../index.js');
        let joueur = interaction.options.getUser('joueur');

        if (!joueur) {
            joueur = interaction.member;
        }

        function pays(joueur) {
            const sql = `
                    SELECT * FROM diplomatie WHERE id_joueur='${joueur.id}';
                    SELECT * FROM pays WHERE id_joueur='${joueur.id}';
                    SELECT * FROM population WHERE id_joueur='${joueur.id}';
                    SELECT * FROM territoire WHERE id_joueur='${joueur.id}'
            `;
            connection.query(sql, async(err, results) => {if (err) {throw err;}
                const Diplomatie = results[0][0];
                const Pays = results[1][0];
                const Population = results[2][0];
                const Territoire = results[3][0];

                if (!results[0][0]) {
                    const reponse = codeBlock('diff', `- Cette personne ne joue pas.`);
                    await interaction.reply({ content: reponse, ephemeral: true });
                } else {
                    const regionObject = JSON.parse(readFileSync('data/region.json', 'utf-8'));
                    const region = eval(`regionObject.${Territoire.region}.nom`);
                    const habitants = Population.enfant + Population.jeune + Population.adulte + Population.vieux;

                    const embed = {
                        author: {
                            name: `${Pays.rang} de ${Pays.nom}`,
                            icon_url: joueur.displayAvatarURL()
                        },
                        thumbnail: {
                            url: Pays.drapeau
                        },
                        title: `\`Vue globale du pays\``,
                        fields: [{
                            name: `> 💵 Argent :`,
                            value: codeBlock(`• ${Pays.cash.toLocaleString('en-US')} $`) + `\u200B`
                        },
                            {
                                name: `> 👪 Population :`,
                                value: codeBlock(`• ${habitants.toLocaleString('en-US')}`) + `\u200B`
                            },
                            {
                                name: `> 🌄 Territoire :`,
                                value: codeBlock(
                                    `• ${region}\n` +
                                    `• ${Territoire.T_total.toLocaleString('en-US')} km² total\n` +
                                    `• ${Territoire.T_libre.toLocaleString('en-US')} km² libre\n` +
                                    `• ${Territoire.hexagone.toLocaleString('en-US')} cases`) + `\u200B`

                            },
                            {
                                name: `> ☎ Diplomatie :`,
                                value: codeBlock(
                                    `• ${Pays.action_diplo.toLocaleString('en-US')} points d'action diplomatique\n\u200B` +
                                    `• ${Diplomatie.influence} influences\n` +
                                    `• ${Pays.reputation}% réputation\n`) + `\u200B`
                            },
                        ],
                        color: joueur.displayHexColor,
                        timestamp: new Date(),
                        footer: {
                            text: `${Pays.devise}`
                        },
                    };

                    const row = new MessageActionRow()
                        .addComponents(
                            new MessageButton()
                                .setLabel(`Economie`)
                                .setEmoji(`💵`)
                                .setCustomId('menu_économie-' + joueur.id)
                                .setStyle('SUCCESS'),
                        )
                        .addComponents(
                            new MessageButton()
                                .setLabel(`Population`)
                                .setEmoji(`👪`)
                                .setCustomId('menu_population-' + joueur.id)
                                .setStyle('SECONDARY'),
                        )
                        .addComponents(
                            new MessageButton()
                                .setLabel(`Gouvernement`)
                                .setEmoji(`🏛`)
                                .setCustomId('menu_gouvernement-' + joueur.id)
                                .setStyle('PRIMARY'),
                        )
                        .addComponents(
                            new MessageButton()
                                .setLabel(`Armée`)
                                .setEmoji(`⚔`)
                                .setCustomId('menu_armée-' + joueur.id)
                                .setStyle('DANGER')
                                .setDisabled(true),
                        )

                    await interaction.reply({ embeds: [embed], components: [row] });
                }
            });
        }

        pays(joueur);
    },
};