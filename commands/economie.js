const { SlashCommandBuilder } = require('@discordjs/builders');
var mysql = require('mysql');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('economie')
        .setDescription(`Consultez votre économie`),

    async execute(interaction) {

        const connection = new mysql.createConnection({
            host: 'eu01-sql.pebblehost.com',
            user: 'customer_260507_paznation',
            password: 'lidmGbk8edPkKXv1#ZO',
            database: 'customer_260507_paznation',
            multipleStatements: true
        });

        var sql = `
            SELECT * FROM pays WHERE id_joueur='${interaction.member.id}'`;

        connection.query(sql, async(err, results) => {
            if (err) {
                throw err;
            }

            const embed = {
                author: {
                    name: `${results[0].rang} de ${results[0].nom}`,
                    icon_url: interaction.member.displayAvatarURL()
                },
                thumbnail: {
                    url: results[0].drapeau
                },
                title: `\`Menu de l'économie\``,
                fields: [{
                        name: `> 💵 Argent :`,
                        value: `${results[0].cash} $\n\u200B`
                    },
                    {
                        name: `> 🏭 Nombre d'usine total :`,
                        value: `${results[0].usine_total}\n\u200B`
                    },
                ],
                color: interaction.member.displayHexColor,
                timestamp: new Date(),
                footer: {
                    text: `${results[0].devise}`
                },
            };

            await interaction.reply({ embeds: [embed] });
        })
    },
};