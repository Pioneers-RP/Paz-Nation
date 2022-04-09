const { SlashCommandBuilder, codeBlock } = require('@discordjs/builders');
var mysql = require('mysql');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('gouvernement')
        .setDescription(`Choisissez votre forme de gouvernement`)
        .addStringOption(gouvernement =>
            gouvernement.setName('forme')
            .setDescription(`Votre forme de gouvernement`)
            .addChoice(`Emirat`, 'Emirat')
            .addChoice(`Confédération`, 'Confédération')
            .addChoice(`Fédération`, 'Fédération')
            .addChoice(`Principauté`, 'Principauté')
            .addChoice(`République`, 'République')
            .addChoice(`Royaume`, 'Royaume')
            .setRequired(true)),

    async execute(interaction) {

        const gouvernement = interaction.options.getString('forme');

        const connection = new mysql.createConnection({
            host: 'eu01-sql.pebblehost.com',
            user: 'customer_260507_paznation',
            password: 'lidmGbk8edPkKXv1#ZO',
            database: 'customer_260507_paznation',
            multipleStatements: true
        });

        var sql = `
        UPDATE pays SET gouv_forme="${gouvernement}" WHERE id_joueur=${interaction.member.id} LIMIT 1`;

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
                title: `Une nouveau gouvernement a été mis en place :`,
                description: `${results[0].gouv_forme}`,
                color: interaction.member.displayHexColor
            };

            const salon_annonce = interaction.client.channels.cache.get(process.env.SALON_ANNONCE);
            salon_annonce.send({ embeds: [annonce] });
            var reponse = `__**Votre annonce a été publié dans ${salon_annonce}**__`;

            await interaction.reply({ content: reponse });
        });
    },
};