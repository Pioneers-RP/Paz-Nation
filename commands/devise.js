const { SlashCommandBuilder, codeBlock } = require('@discordjs/builders');
var mysql = require('mysql');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('devise')
        .setDescription(`Choisissez une devise qui sera affiché sous tous vos menus`)
        .addStringOption(option =>
            option.setName('définir')
            .setDescription(`Votre devise`)
            .setRequired(true)),

    async execute(interaction) {

        const devise = interaction.options.getString('définir');

        if (devise.length <= 60) {

            var newdevise = "";

            for (var i = 0; i < devise.length; i++)
                if (!(devise[i] == '\n' || devise[i] == '\r'))
                    newdevise += devise[i];

            const connection = new mysql.createConnection({
                host: 'eu01-sql.pebblehost.com',
                user: 'customer_260507_paznation',
                password: 'lidmGbk8edPkKXv1#ZO',
                database: 'customer_260507_paznation',
                multipleStatements: true
            });

            var sql = `
            UPDATE pays SET devise="${newdevise}" WHERE id_joueur='${interaction.member.id}' LIMIT 1`;

            connection.query(sql, async(err, results) => {
                if (err) {
                    throw err;
                }
            });

            var sql = `
            SELECT * FROM pays WHERE id_joueur='${interaction.member.id}'`;

            connection.query(sql, async(err, results) => {
                if (err) {
                    throw err;
                }

                var annonce = {
                    author: {
                        name: `${results[0].rang} de ${results[0].nom}`,
                        icon_url: interaction.member.displayAvatarURL()
                    },
                    thumbnail: {
                        url: results[0].drapeau,
                    },
                    title: `\`Une nouvelle devise a été adopté :\``,
                    description: `> *${newdevise}*`,
                    timestamp: new Date(),
                    color: interaction.member.displayHexColor
                };

                const salon_annonce = interaction.client.channels.cache.get(process.env.SALON_ANNONCE);

                salon_annonce.send({ embeds: [annonce] });
                var reponse = `__**Votre annonce a été publié dans ${salon_annonce}**__`;

                await interaction.reply({ content: reponse });
            });
        } else {
            var reponse = codeBlock('diff', `- Vous avez dépassé la limite de caratères: 60 max`);
            await interaction.reply({ content: reponse });
        }
    },
};