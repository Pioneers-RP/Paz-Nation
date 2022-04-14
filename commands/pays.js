const { MessageActionRow, MessageButton } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
var mysql = require('mysql');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pays')
        .setDescription(`Statistiques de votre pays`),

    async execute(interaction) {

        const connection = new mysql.createConnection({
            host: 'eu01-sql.pebblehost.com',
            user: 'customer_260507_paznation',
            password: 'lidmGbk8edPkKXv1#ZO',
            database: 'customer_260507_paznation',
            multipleStatements: true
        })

        var sql = `
        SELECT * FROM pays WHERE id_joueur='${interaction.member.id}'`;

        connection.query(sql, async(err, results) => {
            if (err) {
                throw err;
            }

            var embed = {
                author: {
                    name: `${results[0].rang} de ${results[0].nom}`,
                    icon_url: interaction.member.displayAvatarURL()
                },
                thumbnail: {
                    url: `${results[0].drapeau}`
                },
                title: `\`Vue globale du pays\``,
                fields: [{
                        name: `💵 **Argent**`,
                        value: `${results[0].cash} $\n\u200B`
                    },
                    {
                        name: `👪 **Population**`,
                        value: `${results[0].population}\n\u200B`
                    },
                    {
                        name: `🌄 **Territoire**`,
                        value: `${results[0].T_total} km² total\n` +
                            `${results[0].T_libre} km² libre\n\u200B`
                    },
                    {
                        name: `☎️ **Diplomatique**`,
                        value: `${results[0].action_diplo} points d'action diplomatique\n\u200B`
                    },
                    {
                        name: `🎖️ __Prestige :__`,
                        value: `${results[0].prestige}\n\u200B`
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
                    .setLabel(`Economie`)
                    .setEmoji(`💵`)
                    .setCustomId('menu_économie')
                    .setStyle('SUCCESS'),
                )
                .addComponents(
                    new MessageButton()
                    .setLabel(`Population`)
                    .setEmoji(`👪`)
                    .setCustomId('menu_population')
                    .setStyle('SECONDARY'),
                )
                .addComponents(
                    new MessageButton()
                    .setLabel(`Gouvernement`)
                    .setEmoji(`🏛`)
                    .setCustomId('menu_gouvernement')
                    .setStyle('PRIMARY'),
                )
                .addComponents(
                    new MessageButton()
                    .setLabel(`Armée`)
                    .setEmoji(`⚔`)
                    .setCustomId('menu_armée')
                    .setStyle('DANGER')
                    .setDisabled(true),
                )

            await interaction.reply({ embeds: [embed], components: [row] });
        });
    },
};