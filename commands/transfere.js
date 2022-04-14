const { SlashCommandBuilder, codeBlock } = require('@discordjs/builders');
var mysql = require('mysql');

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

    async execute(interaction, client) {

        const user = interaction.options.getUser('joueur');
        const montant = interaction.options.getInteger('montant');

        const connection = new mysql.createConnection({
            host: 'eu01-sql.pebblehost.com',
            user: 'customer_260507_paznation',
            password: 'lidmGbk8edPkKXv1#ZO',
            database: 'customer_260507_paznation',
            multipleStatements: true
        });

        var sql = `
            SELECT * FROM pays WHERE id_joueur='${interaction.member.id}'`;

        connection.query(sql, async(err, results) => {
            if (err) {
                throw err;
            }

            if (results[0].cash >= montant) {

                var sql2 = `
                UPDATE pays SET cash=cash-${montant} WHERE id_joueur='${interaction.member.id}';
                UPDATE pays SET cash=cash+${montant} WHERE id_joueur='${user.id}'`;

                connection.query(sql2, async(err, results) => {
                    if (err) {
                        throw err;
                    }
                })

                var sql3 = `
                SELECT * FROM pays WHERE id_joueur='${interaction.member.id}'`;

                connection.query(sql3, async(err, results) => {
                    if (err) {
                        throw err;
                    }

                    const embed = {
                        author: {
                            name: `${results[0].rang} de ${results[0].nom}`,
                            icon_url: interaction.member.displayAvatarURL()
                        },
                        thumbnail: {
                            url: results[0].drapeau
                        },
                        title: `\`Paiement validé !\``,
                        description: `Vous avez payé un joueur. ` +
                            `Aucun remboursement ne sera effectué en cas d'erreur de votre part ou d'arnaque. ` +
                            `Si vous voulez récupérer votre argent en cas d'erreur, veuillez vous adresser au joueur payé. ` +
                            `Vous avez alors deux moyens de récupérer votre argent, la guerre ou la négociation.`,
                        fields: [{
                                name: `\u200B`,
                                value: `🏧 Argent en réserve : ${results[0].cash}`,
                                inline: true
                            },
                            {
                                name: `\u200B`,
                                value: `💸 Valeur du paiement : ${montant}`,
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

                    await interaction.reply({ embeds: [embed] });


                })

                var sql4 = `
                SELECT * FROM pays WHERE id_joueur='${user.id}'`;

                connection.query(sql4, async(err, results) => {
                    if (err) {
                        throw err;
                    }

                    const paiement = {
                        author: {
                            name: `${results[0].rang} de ${results[0].nom}`,
                            icon_url: interaction.member.displayAvatarURL()
                        },
                        thumbnail: {
                            url: results[0].drapeau,
                        },
                        title: `\`Paiement validé !\``,
                        description: `Vous avez reçu un paiement de <@${interaction.member.id}>`,
                        fields: [{
                                name: `\u200B`,
                                value: `💸 Valeur du paiement : ${montant}`,
                                inline: true
                            },
                            {
                                name: `\u200B`,
                                value: `🏧 Argent en réserve : ${results[0].cash}`,
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

                    user.send({ embeds: [paiement] });
                })
            } else {
                var reponse = codeBlock('diff', `- Vous n'avez pas assez d'agent`);
                await interaction.reply({ content: reponse });
            }
        })
    },
};