const { SlashCommandBuilder, codeBlock } = require('@discordjs/builders');
var mysql = require('mysql');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ideologie')
        .setDescription(`Choisissez votre idéologie`)
        .addStringOption(ideologie =>
            ideologie.setName('ideologie')
            .setDescription(`Choisissez votre idéologie`)
            .addChoice(`Libéralisme`, 'Libéralisme')
            .addChoice(`Capitalisme`, 'Capitalisme')
            .addChoice(`Oligarchique`, 'Oligarchique')
            .addChoice(`Centriste`, 'Centriste')
            .addChoice(`Socialisme`, 'Socialisme')
            .addChoice(`Maxisme`, 'Maxisme')
            .addChoice(`Anarchisme`, 'Anarchisme')
            .setRequired(true)),

    async execute(interaction) {

        const ideologie = interaction.options.getString('ideologie');

        const connection = new mysql.createConnection({
            host: 'eu01-sql.pebblehost.com',
            user: 'customer_260507_paznation',
            password: 'lidmGbk8edPkKXv1#ZO',
            database: 'customer_260507_paznation',
            multipleStatements: true
        });

        var sql = `
        UPDATE pays SET ideologie="${ideologie}" WHERE id_joueur=${interaction.member.id} LIMIT 1`;

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

            const annonce = {
                author: {
                    name: `${results[0].rang} de ${results[0].nom}`,
                    icon_url: interaction.member.displayAvatarURL()
                },
                thumbnail: {
                    url: `${results[0].drapeau}`,
                },
                title: `Une nouvelle idéologie a été mis en place :`,
                description: `${results[0].ideologie}`,
                color: interaction.member.displayHexColor
            };

            const salon_annonce = interaction.client.channels.cache.get(process.env.SALON_ANNONCE);
            salon_annonce.send({ embeds: [annonce] });
            var reponse = `__**Votre annonce a été publié dans ${salon_annonce}**__`;

            await interaction.reply({ content: reponse });
        });
    },
};