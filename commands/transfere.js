const { SlashCommandBuilder, codeBlock } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('transfere')
        .setDescription(`Donner de l'argent à un joueur`)
        .addUserOption(user =>
            user.setName('joueur')
            .setDescription(`Le joueur à qui vous voulez donner de l'argent`)
            .setRequired(true))
        .addIntegerOption(montant =>
            montant.setName('montant')
            .setDescription(`Le montant du transfert`)
            .setRequired(true)),

    async execute(interaction) {
        const { connection } = require('../index.js');

        const user = interaction.options.getUser('joueur');
        const montant = interaction.options.getInteger('montant');

        if (montant <= 0) {
            const reponse = codeBlock('diff', `- Veillez indiquer un montant positive`);
            await interaction.reply({ content: reponse, ephemeral: true });
        } else {
            const sql = `SELECT * FROM pays WHERE id_joueur='${interaction.member.id}'`;
            connection.query(sql, async(err, results) => {if (err) {throw err;}
                if (results[0].cash >= montant) {

                    let sql = `
                    UPDATE pays SET cash=cash-${montant} WHERE id_joueur='${interaction.member.id}';
                    UPDATE pays SET cash=cash+${montant} WHERE id_joueur='${user.id}'`;
                    connection.query(sql, async(err) => {if (err) {throw err;}});

                    sql = `SELECT * FROM pays WHERE id_joueur='${user.id}'`;
                    connection.query(sql, async(err, results) => {if (err) {throw err;}

                        const cite_user = `${results[0].rang} de ${results[0].nom}`;
                        const drapeau_user = results[0].drapeau;

                        const sql = `SELECT * FROM pays WHERE id_joueur='${interaction.member.id}'`;
                        connection.query(sql, async(err, results) => {if (err) {throw err;}

                            const cite_joueur = `${results[0].rang} de ${results[0].nom}`;
                            const drapeau_joueur = results[0].drapeau;

                            const paiement = {
                                author: {
                                    name: cite_user,
                                    icon_url: user.displayAvatarURL()
                                },
                                thumbnail: {
                                    url: drapeau_user
                                },
                                title: `\`Paiement validé !\``,
                                description: `Vous avez payé un joueur. ` +
                                    `Aucun remboursement ne sera effectué en cas d'erreur de votre part ou d'arnaque. ` +
                                    `Si vous voulez récupérer votre argent en cas d'erreur, veuillez vous adresser au joueur payé. ` +
                                    `Vous avez alors deux moyens de récupérer votre argent, la guerre ou la négociation.`,
                                fields: [{
                                        name: `\u200B`,
                                        value: codeBlock(`• 💸 Valeur du paiement : ${montant.toLocaleString('en-US')}`) + `\u200B`,
                                        inline: true
                                    },
                                    {
                                        name: `\u200B`,
                                        value: codeBlock(`• 🏧 Argent en réserve : ${results[0].cash.toLocaleString('en-US')}`) + `\u200B`,
                                        inline: true
                                    }
                                ],
                                image: {
                                    url: 'https://media.discordapp.net/attachments/848913340737650698/944327803455832094/paiement.png'
                                },
                                color: interaction.member.displayHexColor,
                                timestamp: new Date(),
                                footer: {
                                    text: `${results[0].devise}`
                                },
                            };

                            await interaction.reply({ embeds: [paiement] });

                            const sql = `SELECT * FROM pays WHERE id_joueur='${user.id}'`;
                            connection.query(sql, async(err, results) => {if (err) {throw err;}

                                const recu = {
                                    author: {
                                        name: `${cite_joueur}`,
                                        icon_url: interaction.member.displayAvatarURL()
                                    },
                                    thumbnail: {
                                        url: drapeau_joueur
                                    },
                                    title: `\`Paiement reçu !\``,
                                    description: `Vous avez reçu un paiement de <@${interaction.member.id}>`,
                                    fields: [{
                                            name: `\u200B`,
                                            value: codeBlock(`• 💸 Valeur du paiement : ${montant.toLocaleString('en-US')}`) + `\u200B`,
                                            inline: true
                                        },
                                        {
                                            name: `\u200B`,
                                            value: codeBlock(`• 🏧 Argent en réserve : ${results[0].cash.toLocaleString('en-US')}`) + `\u200B`,
                                            inline: true
                                        }
                                    ],
                                    image: {
                                        url: 'https://media.discordapp.net/attachments/848913340737650698/944327803455832094/paiement.png'
                                    },
                                    color: interaction.member.displayHexColor,
                                    timestamp: new Date(),
                                    footer: {
                                        text: `${results[0].devise}`
                                    },
                                };

                                user.send({ embeds: [recu] });
                            })
                        });
                    });

                } else {
                    const reponse = codeBlock('diff', `- Vous n'avez pas assez d'argent : ${results[0].cash.toLocaleString('en-US')}/${montant.toLocaleString('en-US')}`);
                    await interaction.reply({ content: reponse, ephemeral: true });
                }
            });

        }
    },
};