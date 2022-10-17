const { SlashCommandBuilder, codeBlock } = require('@discordjs/builders');
const isImageURL = require('image-url-validator').default;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pweet')
        .setDescription(`Faites un pweet`)
        .addStringOption(option =>
            option.setName('pweet')
            .setDescription(`Le contenu de votre pweet (Maximum 280 caractères)`)
            .setRequired(true))
        .addStringOption(option =>
            option.setName('url')
            .setDescription(`L'URL de l'image`)),

    async execute(interaction) {
        let sql;
        let reponse;
        const { connection } = require('../index.js');

        const pweet = interaction.options.getString('pweet');
        const image = interaction.options.getString('url');

        if (pweet.length >= 280) {
            reponse = codeBlock('diff', `- Votre pweet doit faire au maximum : 280 caractères`);
            await interaction.reply({ content: reponse, ephemeral: true });
        } else {
            if (image) {
                if (await isImageURL(image) === true) {
                    sql = `SELECT * FROM pays WHERE id_joueur='${interaction.member.id}'`;
                    connection.query(sql, async(err, results) => {if (err) {throw err;}

                        const annonce = {
                            author: {
                                name: `${results[0].rang} de ${results[0].nom}`,
                                icon_url: interaction.member.displayAvatarURL()
                            },
                            image: {
                                url: image,
                            },
                            timestamp: new Date(),
                            description: `**${interaction.user.username} <:Certif:981918077027504159> (${results[0].pweeter})\n\u200B**` + pweet,
                            footer: {
                                text: "Pweeter",
                                icon_url: "https://cdn.discordapp.com/attachments/939251032297463879/981915716821319680/Pweeter.png"
                            },
                            color: '#1bc7df',
                        };

                        const salon_pweeter = interaction.client.channels.cache.get(process.env.SALON_PWEETER);

                        salon_pweeter.send({ embeds: [annonce] }).then(sentMessage => {
                            sentMessage.react('<:Pike:981918620282134579>');
                        });
                        const reponse = `${salon_pweeter}`;

                        await interaction.reply({ content: reponse });
                    });
                } else {
                    reponse = codeBlock('diff', `- Vous n'avez pas fourni une URL valide`);
                    await interaction.reply({ content: reponse, ephemeral: true });
                }

            } else {
                sql = `SELECT * FROM pays WHERE id_joueur='${interaction.member.id}'`;
                connection.query(sql, async(err, results) => {if (err) {throw err;}

                    const annonce = {
                        author: {
                            name: `${results[0].rang} de ${results[0].nom}`,
                            icon_url: interaction.member.displayAvatarURL()
                        },
                        timestamp: new Date(),
                        description: `**${interaction.user.username} <:Certif:981918077027504159> (${results[0].pweeter})\n\u200B**` + pweet,
                        footer: {
                            text: "Pweeter",
                            icon_url: "https://cdn.discordapp.com/attachments/939251032297463879/981915716821319680/Pweeter.png"
                        },
                        color: '#1DA1F2',
                    };

                    const salon_pweeter = interaction.client.channels.cache.get(process.env.SALON_PWEETER);

                    salon_pweeter.send({ embeds: [annonce] }).then(sentMessage => {
                        sentMessage.react('<:Pike:981918620282134579>');
                    });
                    const reponse = `${salon_pweeter}`;

                    await interaction.reply({ content: reponse });
                });
            }
        }
    }
};