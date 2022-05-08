const { SlashCommandBuilder } = require('@discordjs/builders');
var mysql = require('mysql');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('gouv')
        .setDescription(`Menu du gouvernement`),

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

            const embed = {
                author: {
                    name: `${results[0].rang} de ${results[0].nom}`,
                    icon_url: interaction.member.displayAvatarURL()
                },
                thumbnail: {
                    url: `${results[0].drapeau}`
                },
                title: `\`Menu du gouvernement\``,
                fields: [{
                        name: `> 🪧 Nom de l'Etat : `,
                        value: `${results[0].nom}\n\u200B`,
                    },
                    {
                        name: `> ®️ Rang : `,
                        value: `${results[0].rang}\n\u200B`
                    },
                    {
                        name: `> 🔱 Forme de gouvernement : `,
                        value: `${results[0].gouv_forme}\n\u200B`
                    },
                    {
                        name: `> 🧠 Idéologie : `,
                        value: `${results[0].ideologie}\n\u200B`
                    },
                    {
                        name: `> 📯 Devise : `,
                        value: `${results[0].devise}\n\u200B`
                    }
                ],
                color: interaction.member.displayHexColor,
                timestamp: new Date(),
                footer: { text: `${results[0].devise}` }
            };

            await interaction.reply({ embeds: [embed] });
        })
    },
};