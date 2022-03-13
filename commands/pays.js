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
        SELECT * FROM pays WHERE id_joueur=${interaction.member.id}`;

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
                    url: `${results[0].drapeau}`,
                },
                title: `📊 Stats`,
                fields: [{
                        name: `**__Argent :__**`,
                        value: `${results[0].cash} ♞`
                    },
                    {
                        name: `**__Population__**`,
                        value: `${results[0].population}`
                    },
                    {
                        name: `**__Territoire :__**`,
                        value: `${results[0].T_total} km² total\n
                        ${results[0].T_libre}² libre`
                    },
                    {
                        name: `**__Points d’action diplomatique :__**`,
                        value: `${results[0].cash_diplo}`
                    },
                    {
                        name: `**__Prestige :__**`,
                        value: `${results[0].prestige}`
                    }
                ],
                color: interaction.member.displayHexColor,
                footer: {
                    text: `Suède, Travail, Investissement`
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