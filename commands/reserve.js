const { SlashCommandBuilder } = require('@discordjs/builders');
var mysql = require('mysql');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('reserve')
        .setDescription(`Voir vos reserves en ressource`),

    async execute(interaction) {

        const connection = new mysql.createConnection({
            host: 'eu01-sql.pebblehost.com',
            user: 'customer_260507_paznation',
            password: 'lidmGbk8edPkKXv1#ZO',
            database: 'customer_260507_paznation',
            multipleStatements: true
        });

        var sql = `
            SELECT * FROM pays WHERE id_joueur=${interaction.member.id}`;

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
                title: `\`Réserve :\``,
                description: `
                        Biens de consommation : ${results[0].bc}\n
                        Bois : ${results[0].bois}\n
                        Brique : ${results[0].brique}\n
                        Eau : ${results[0].eau}\n
                        Métaux : ${results[0].métaux}\n
                        Nourriture : ${results[0].nourriture}\n
                        Pétrole : ${results[0].pétrole}\n`,
                color: interaction.member.displayHexColor,
                timestamp: new Date(),
                footer: {
                    text: `${results[0].devise}`
                },
            };

            await interaction.reply({ embeds: [embed] })
        })
    }
}