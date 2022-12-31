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
        let sql;
        let reponse;
        const { connection } = require('../index.js');
        const SalonAnnonce = interaction.client.channels.cache.get(process.env.SALON_ANNONCE);
        const Annonce = interaction.options.getString('annonce');
        const Image = interaction.options.getString('url');

        if (Annonce.length <= 50) {
            reponse = codeBlock('diff', `- Votre annonce doit faire au minimum : 50 caractères`);
            await interaction.reply({ content: reponse, ephemeral: true });
        } else if (Annonce.length >= 2000) {
            reponse = codeBlock('diff', `- Votre annonce doit faire au maximum : 2000 caractères`);
            await interaction.reply({ content: reponse, ephemeral: true });
        } else {
            if (Image) {
                if (await isImageURL(Image) === true) {

                    sql = `SELECT * FROM pays WHERE id_joueur='${interaction.member.id}'`;
                    connection.query(sql, async(err, results) => {if (err) { throw err; }
                        const Pays = results[0];

                        const embed = {
                            author: {
                                name: `${Pays.rang} de ${Pays.nom}`,
                                icon_url: interaction.member.displayAvatarURL()
                            },
                            thumbnail: {
                                url: `${Pays.drapeau}`,
                            },
                            image: {
                                url: Image,
                            },
                            timestamp: new Date(),
                            description: Annonce,
                            color: '#1DA1F2',
                            footer: {
                                text: `${Pays.devise}`
                            },
                        };

                        SalonAnnonce.send({ embeds: [embed] })
                        const reponse = `__**Votre annonce a été publié dans ${SalonAnnonce}**__`;
                        await interaction.reply({ content: reponse });
                    });
                } else {
                    reponse = codeBlock('diff', `- Vous n'avez pas fourni une URL valide`);
                    await interaction.reply({ content: reponse, ephemeral: true });
                }

            } else {
                sql = `SELECT * FROM pays WHERE id_joueur='${interaction.member.id}'`;
                connection.query(sql, async(err, results) => {if (err) { throw err; }
                    const Pays = results[0];

                    const embed = {
                        author: {
                            name: `${Pays.rang} de ${Pays.nom}`,
                            icon_url: interaction.member.displayAvatarURL()
                        },
                        thumbnail: {
                            url: `${Pays.drapeau}`,
                        },
                        timestamp: new Date(),
                        description: Annonce,
                        color: interaction.member.displayHexColor,
                        footer: {
                            text: `${Pays.devise}`
                        },
                    };

                    SalonAnnonce.send({ embeds: [embed] })
                    const reponse = `__**Votre annonce a été publié dans ${SalonAnnonce}**__`;
                    await interaction.reply({ content: reponse });
                });
            }
        }
    }
};