const { SlashCommandBuilder, codeBlock } = require('@discordjs/builders');
const isImageURL = require('image-url-validator').default;
var mysql = require('mysql');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('drapeau')
        .setDescription(`Choisissez un drapeau qui sera affiché sur tous vos menus`)
        .addStringOption(option =>
            option.setName('url')
            .setDescription(`L'URL de l'image`)
            .setRequired(true)),

    async execute(interaction) {

        const drapeau = interaction.options.getString('url');

        if (await isImageURL(drapeau) == true) {

            const connection = new mysql.createConnection({
                host: 'eu01-sql.pebblehost.com',
                user: 'customer_260507_paznation',
                password: 'lidmGbk8edPkKXv1#ZO',
                database: 'customer_260507_paznation',
                multipleStatements: true
            });

            var sql = `
            UPDATE pays SET drapeau="${drapeau}" WHERE id_joueur='${interaction.member.id}' LIMIT 1`;

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
                    image: {
                        url: results[0].drapeau,
                    },
                    title: `\`Une nouveau drapeau a été adopté :\``,
                    timestamp: new Date(),
                    color: interaction.member.displayHexColor,
                    footer: {
                        text: `${results[0].devise}`
                    },
                };

                const salon_annonce = interaction.client.channels.cache.get(process.env.SALON_ANNONCE);

                salon_annonce.send({ embeds: [annonce] });
                var reponse = `__**Votre annonce a été publié dans ${salon_annonce}**__`;

                await interaction.reply({ content: reponse });
            })
        } else {
            var reponse = codeBlock('diff', `- Vous n'avez pas fourni une URL valide`);
            await interaction.reply({ content: reponse });
        }
    }
};