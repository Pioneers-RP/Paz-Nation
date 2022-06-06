const { SlashCommandBuilder, codeBlock } = require('@discordjs/builders');
const isImageURL = require('image-url-validator').default;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('annonce')
        .setDescription(`Faites un annonce`)
        .addStringOption(option =>
            option.setName('annonce')
            .setDescription(`Le contenu de votre annonce (Maximum 2000 caractères)`)
            .setRequired(true))
        .addStringOption(option =>
            option.setName('url')
            .setDescription(`L'URL de l'image`)),

    async execute(interaction) {
        const { connection } = require('../index.js');

        const annonce = interaction.options.getString('annonce');
        const image = interaction.options.getString('url');

        if (annonce.length <= 115) {
            var reponse = codeBlock('diff', `- Votre annonce doit faire au minimum : 115 caractères`);
            await interaction.reply({ content: reponse, ephemeral: true });
        } else if (annonce.length >= 2000) {
            var reponse = codeBlock('diff', `- Votre annonce doit faire au maximum : 2000 caractères`);
            await interaction.reply({ content: reponse, ephemeral: true });
        } else {
            if (image) {
                if (await isImageURL(image) == true) {

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
                                url: `${results[0].drapeau}`,
                            },
                            image: {
                                url: image,
                            },
                            timestamp: new Date(),
                            description: annonce,
                            color: '#1DA1F2',
                            footer: {
                                text: `${results[0].devise}`
                            },
                        };

                        const salon_annonce = interaction.client.channels.cache.get(process.env.SALON_ANNONCE);

                        salon_annonce.send({ embeds: [embed] })
                        var reponse = `__**Votre annonce a été publié dans ${salon_annonce}**__`;

                        await interaction.reply({ content: reponse });
                    });
                } else {
                    var reponse = codeBlock('diff', `- Vous n'avez pas fourni une URL valide`);
                    await interaction.reply({ content: reponse, ephemeral: true });
                };

            } else {
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
                            url: `${results[0].drapeau}`,
                        },
                        timestamp: new Date(),
                        description: annonce,
                        color: interaction.member.displayHexColor,
                        footer: {
                            text: `${results[0].devise}`
                        },
                    };

                    const salon_annonce = interaction.client.channels.cache.get(process.env.SALON_ANNONCE);

                    salon_annonce.send({ embeds: [embed] })
                    var reponse = `__**Votre annonce a été publié dans ${salon_annonce}**__`;

                    await interaction.reply({ content: reponse });
                });

            };

        };
    }
};