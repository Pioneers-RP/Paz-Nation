const { SlashCommandBuilder } = require('@discordjs/builders');
var mysql = require('mysql');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('direction')
        .setDescription(`Choisissez dans quelle direction vous voulez vous étendre`)
        .addStringOption(direction =>
            direction.setName('vers')
            .setDescription(`Choisissez dans quelle direction vous voulez vous étendre`)
            .addChoice(`⬆️ Nord`, 'Nord')
            .addChoice(`⬅️ Ouest`, 'Ouest')
            .addChoice(`➡️ Est`, 'Est')
            .addChoice(`⬇️ Sud`, 'Sud')
            .setRequired(true)),

    async execute(interaction) {

        const direction = interaction.options.getString('vers');

        const connection = new mysql.createConnection({
            host: 'eu01-sql.pebblehost.com',
            user: 'customer_260507_paznation',
            password: 'lidmGbk8edPkKXv1#ZO',
            database: 'customer_260507_paznation',
            multipleStatements: true
        });

        var sql = `
        UPDATE pays SET direction="${direction}" WHERE id_joueur=${interaction.member.id} LIMIT 1`;

        connection.query(sql, async(err, results) => {
            if (err) {
                throw err;
            }
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
                    url: `${results[0].drapeau}`,
                },
                title: `\`Vous vous étendez désormais vers le ${direction}\``,
                color: interaction.member.displayHexColor
            };

            await interaction.reply({ embeds: [embed] });
        });
    },
};