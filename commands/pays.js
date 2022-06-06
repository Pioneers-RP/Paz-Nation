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
        var joueur = interaction.options.getUser('joueur');
        const jsonObject = JSON.parse(readFileSync('data/region.json', 'utf-8'));

        if (!joueur) {
            var joueur = interaction.member;
        };

        function pays(joueur) {

            var sql = `
            SELECT * FROM pays WHERE id_joueur='${joueur.id}'`;

            connection.query(sql, async(err, results) => {
                if (err) {
                    throw err;
                }
                if (!results[0]) {
                    var reponse = codeBlock('diff', `- Cette personne ne joue pas.`);
                    await interaction.reply({ content: reponse, ephemeral: true });
                } else {
                    var région = eval(`jsonObject.${results[0].region}.nom`);
                    var embed = {
                        author: {
                            name: `${results[0].rang} de ${results[0].nom}`,
                            icon_url: joueur.displayAvatarURL()
                        },
                        thumbnail: {
                            url: `${results[0].drapeau}`
                        },
                        title: `\`Vue globale du pays\``,
                        fields: [{
                                name: `> 💵 Argent :`,
                                value: codeBlock(`• ${results[0].cash.toLocaleString('en-US')} $`) + `\u200B`
                            },
                            {
                                name: `> 👪 Population :`,
                                value: codeBlock(`• ${results[0].population.toLocaleString('en-US')}`) + `\u200B`
                            },
                            {
                                name: `> 🌄 Territoire :`,
                                value: codeBlock(
                                    `• ${région}\n` +
                                    `• ${results[0].T_total.toLocaleString('en-US')} km² total\n` +
                                    `• ${results[0].T_libre.toLocaleString('en-US')} km² libre\n` +
                                    `• ${results[0].hexagone.toLocaleString('en-US')} cases`) + `\u200B`

                            },
                            {
                                name: `> ☎️ Diplomatie :`,
                                value: codeBlock(
                                    `• ${results[0].action_diplo.toLocaleString('en-US')} points d'action diplomatique\n\u200B` +
                                    `• ${results[0].influence} influences\n` +
                                    `• ${results[0].reputation}% réputation\n`) + `\u200B`
                            },
                        ],
                        color: joueur.displayHexColor,
                        timestamp: new Date(),
                        footer: {
                            text: `${results[0].devise}`
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