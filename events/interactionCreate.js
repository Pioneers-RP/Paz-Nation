const { codeBlock } = require('@discordjs/builders');
var mysql = require('mysql');
var Chance = require('chance');
var chance = new Chance();

module.exports = {
    name: 'interactionCreate',
    execute(interaction) {

        const connection = new mysql.createConnection({
            host: 'eu01-sql.pebblehost.com',
            user: 'customer_260507_paznation',
            password: 'lidmGbk8edPkKXv1#ZO',
            database: 'customer_260507_paznation',
            multipleStatements: true
        });

        if (interaction.isCommand()) {
            console.log(`${interaction.user.tag} a utilisé une intéraction dans #${interaction.channel.name}.`);

        } //FIN DU CODE POUR LES SLASHS COMMANDES

        //code pour les boutons
        else if (interaction.isButton()) {
            console.log(`${interaction.user.tag} a utilisé un bouton dans #${interaction.channel.name}.`);

            //Menu de l'économie
            if (interaction.customId === 'menu_économie') {

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
                            url: results[0].drapeau
                        },
                        title: `\`Menu de l'économie\``,
                        fields: [{
                                name: `Argent :`,
                                value: `${results[0].cash} 💵\n\u200B`
                            },
                            {
                                name: `Nombre d'usine total :`,
                                value: `${results[0].usine_total}\n\u200B`
                            },
                            {
                                name: `Electrité :`,
                                value: `${results[0].need_électricité}/${results[0].prod_électricité}\n\u200B`
                            }
                        ],
                        color: interaction.member.displayHexColor,
                    };

                    interaction.reply({ embeds: [embed] });
                })

                //Menu de la population
            } else if (interaction.customId === 'menu_population') {

                var sql = `
                SELECT * FROM pays WHERE id_joueur=${interaction.member.id}`;

                connection.query(sql, async(err, results) => {
                    if (err) {
                        throw err;
                    }

                    densité = results[0].population / results[0].T_total;
                    densité = densité.toFixed(0);

                    const embed = {
                        author: {
                            name: `${results[0].rang} de ${results[0].nom}`,
                            icon_url: interaction.member.displayAvatarURL()
                        },
                        thumbnail: {
                            url: `${results[0].drapeau}`
                        },
                        title: `\`Vue globale de la population\``,
                        fields: [{
                                name: `👪 **Population **`,
                                value: `${results[0].population} habitants\n\u200B`
                            },
                            {
                                name: ` **Maison**`,
                                value: `${results[0].maison} \n\u200B`
                            },
                            {
                                name: ` **Densité**`,
                                value: `${densité} habitants/km²\n\u200B`
                            }
                        ],
                        color: interaction.member.displayHexColor,
                        timestamp: new Date(),
                        footer: {
                            text: `${results[0].devise}`
                        },
                    };

                    interaction.reply({ embeds: [embed] });
                })

                //Menu du gouvernement
            } else if (interaction.customId === 'menu_gouvernement') {

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
                                url: `${results[0].drapeau}`
                            },
                            title: `\`Menu du gouvernement\``,
                            fields: [{
                                    name: `Nom de l'Etat : `,
                                    value: `${results[0].nom}\n\u200B`,
                                },
                                {
                                    name: `Rang : `,
                                    value: `${results[0].rang}\n\u200B`
                                },
                                {
                                    name: `Forme de gouvernement : `,
                                    value: `${results[0].gouv_forme}\n\u200B`
                                },
                                {
                                    name: `Idéologie : `,
                                    value: `${results[0].ideologie}\n\u200B`
                                },
                                {
                                    name: `Devise : `,
                                    value: `${results[0].devise}\n\u200B`
                                }
                            ],
                            color: interaction.member.displayHexColor,
                            timestamp: new Date(),
                            footer: { text: `${results[0].devise}` }
                        };

                        interaction.reply({ embeds: [embed] });
                    })
                    //Menu de l'armée
            } else if (interaction.customId === 'menu_armée') {

                const embed = {
                    author: {
                        name: `<\\Nom du pays>`,
                        icon_url: interaction.member.displayAvatarURL()
                    },
                    thumbnail: {
                        url: 'https://cdn.discordapp.com/attachments/939251032297463879/940642380640583770/paz_v3.png',
                    },
                    title: `Menu de l\'armée :`,
                    fields: [{
                        name: `Work in Progress`,
                        value: `Work in Progress`
                    }],
                    color: interaction.member.displayHexColor,
                    footer: {
                        text: `Suède, Travail, Investissement`
                    }
                };

                interaction.reply({ embeds: [embed] })

                //International market
            } else if (interaction.customId === 'menu_IM') {
                const embed = {
                    thumbnail: {
                        url: 'https://cdn.discordapp.com/attachments/939251032297463879/940642380640583770/paz_v3.png',
                    },
                    title: `Marché International (IM) :`,
                    fields: [{
                        name: `Work in Progress`,
                        value: `Work in Progress`
                    }],
                    color: interaction.member.displayHexColor,
                };
                interaction.reply({ embeds: [embed] })

                //Quick Sell
            } else if (interaction.customId === 'menu_QS') {
                const embed = {
                    thumbnail: {
                        url: 'https://cdn.discordapp.com/attachments/939251032297463879/940642380640583770/paz_v3.png',
                    },
                    title: `Quick Sell (QS) :`,
                    fields: [{
                        name: `Work in Progress`,
                        value: `Work in Progress`
                    }],
                    color: interaction.member.displayHexColor,
                };
                interaction.reply({ embeds: [embed] })

                //Choix pacifique
            } else if (interaction.customId === 'choix_pacifique') {

                var sql = `
                    SELECT * FROM pays WHERE id_joueur=${interaction.member.id}`;
                connection.query(sql, async(err, results) => {
                    if (err) {
                        throw err;
                    }

                    if (results[0].rang < 10) {

                        var reponse = codeBlock('diff', `- Vous n'avez pas assez de points d'action diplomatique : 10`);
                        await interaction.reply({ content: reponse });

                    } else {

                        var random = chance.bool({ likelihood: results[0].réputation })
                        console.log(random)

                        if (random == true) {

                            var territoire = chance.integer({ min: process.env.EXP_MIN_TERRITOIRE, max: process.env.EXP_MAX_TERRITOIRE })
                            console.log(territoire)
                            var pop = chance.integer({ min: process.env.EXP_MIN_POP, max: process.env.EXP_MAX_POP })
                            console.log(pop)
                            var maison = chance.integer({ min: process.env.EXP_MIN_MAISON, max: process.env.EXP_MAX_MAISON })
                            console.log(maison)

                            var sql1 = `
                            UPDATE pays SET T_total=T_total+${territoire} WHERE id_joueur=${interaction.user.id};
                            UPDATE pays SET population=population+${pop} WHERE id_joueur=${interaction.user.id};
                            UPDATE pays SET maison=maison+${maison} WHERE id_joueur=${interaction.user.id}`;
                            connection.query(sql1, async(err, results) => {
                                if (err) {
                                    throw err;
                                }
                            })

                            const embed = {

                                author: {
                                    name: `${results[0].rang} de ${results[0].nom}`,
                                    icon_url: interaction.member.displayAvatarURL()
                                },
                                thumbnail: {
                                    url: results[0].drapeau,
                                },
                                image: {
                                    url: 'https://media.discordapp.net/attachments/956128090617184297/956128174520008754/Choix_pacifique.png',
                                },
                                title: `\`Négociations réussies :\``,
                                fields: [{
                                    name: `Les peuples autochtones ont décidé de se joindre à vous :`,
                                    value: `> ${territoire} km²\n` +
                                        `> ${pop} habitants\n` +
                                        `> ${maison} maisons\n`
                                }],
                                color: interaction.member.displayHexColor,
                                timestamp: new Date(),
                                footer: {
                                    text: `${results[0].devise}`
                                },
                            };

                            interaction.reply({ embeds: [embed] })

                        } else {

                            const embed = {

                                author: {
                                    name: `${results[0].rang} de ${results[0].nom}`,
                                    icon_url: interaction.member.displayAvatarURL()
                                },
                                thumbnail: {
                                    url: results[0].drapeau,
                                },
                                image: {
                                    url: 'https://media.discordapp.net/attachments/956128090617184297/956128174520008754/Choix_pacifique.png',
                                },
                                title: `\`Echec des négociations :\``,
                                description: `Les peuples autochtones ne sont pas d'accord pour se joindre à vous`,
                                color: interaction.member.displayHexColor,
                                timestamp: new Date(),
                                footer: {
                                    text: `${results[0].devise}`
                                },
                            };

                            interaction.reply({ embeds: [embed] })
                        }
                    }
                });

                //Choix dissuasif
            } else if (interaction.customId === 'choix_dissuasif') {
                const embed = {
                    author: {
                        name: `<\\Nom du pays>`,
                        icon_url: interaction.member.displayAvatarURL()
                    },
                    thumbnail: {
                        url: 'https://cdn.discordapp.com/attachments/939251032297463879/940642380640583770/paz_v3.png',
                    },
                    title: `Négociation armée en cours :`,
                    fields: [{
                        name: `Work in Progress`,
                        value: `Work in Progress`
                    }],
                    color: interaction.member.displayHexColor,
                    footer: {
                        text: `Suède, Travail, Investissement`
                    }
                }

                interaction.reply({ embeds: [embed] })

                //Choix armée
            } else if (interaction.customId === 'choix_armée') {
                const embed = {
                    author: {
                        name: `<\\Nom du pays>`,
                        icon_url: interaction.member.displayAvatarURL()
                    },
                    thumbnail: {
                        url: 'https://cdn.discordapp.com/attachments/939251032297463879/940642380640583770/paz_v3.png',
                    },
                    title: `Vous avez envoyer l\'armée :`,
                    fields: [{
                        name: `Work in Progress`,
                        value: `Work in Progress`
                    }],
                    color: interaction.member.displayHexColor,
                    footer: {
                        text: `Suède, Travail, Investissement`
                    }
                };

                interaction.reply({ embeds: [embed] })

            } //FIN DU CODE POUR LES BOUTONS

            //code pour les menus
        } else if (interaction.isSelectMenu()) {
            console.log(`${interaction.user.tag} a utilisé un menu dans #${interaction.channel.name}.`);
            if (interaction.customId == 'usine') {

                var sql = `
                SELECT * FROM pays WHERE id_joueur=${interaction.member.id}`;

                if (interaction.values == 'briqueterie') {

                    connection.query(sql, async(err, results) => {
                        if (err) {
                            throw err;
                        }

                        prod_T_briqueterie = process.env.PROD_BRIQUETERIE * results[0].briqueterie;
                        conso_T_briqueterie_1 = process.env.CONSO_BRIQUETERIE_ELECTRICITE * results[0].briqueterie;
                        conso_T_briqueterie_2 = process.env.CONSO_BRIQUETERIE_BOIS * results[0].briqueterie;
                        conso_T_briqueterie_3 = process.env.CONSO_BRIQUETERIE_EAU * results[0].briqueterie;

                        const embed = {
                            author: {
                                name: `${results[0].rang} de ${results[0].nom}`,
                                icon_url: interaction.member.displayAvatarURL()
                            },
                            thumbnail: {
                                url: `${results[0].drapeau}`,
                            },
                            title: `\`Usine : Briqueterie\``,
                            fields: [{
                                    name: `Production :`,
                                    value: `Ressource : brique\n` +
                                        `Par usine :${process.env.PROD_BRIQUETERIE}\n` +
                                        `Totale : ${prod_T_briqueterie}`,
                                    inline: true
                                },
                                {
                                    name: `En réserve :`,
                                    value: `${results[0].brique}`,
                                    inline: true
                                },
                                {
                                    name: '\u200B',
                                    value: '\u200B'
                                },
                                {
                                    name: `Consommation :`,
                                    value: `- Par usine : \n` +
                                        `Electricité : ${process.env.CONSO_BRIQUETERIE_ELECTRICITE}\n` +
                                        `Bois : ${process.env.CONSO_BRIQUETERIE_BOIS}\n` +
                                        `Eau : ${process.env.CONSO_BRIQUETERIE_EAU}\n`,
                                    inline: true
                                },
                                {
                                    name: `\u200B`,
                                    value: `- Totale : \n` +
                                        `Electricité : ${conso_T_briqueterie_1}\n` +
                                        `Bois : ${conso_T_briqueterie_2}\n` +
                                        `Eau : ${conso_T_briqueterie_3}`,
                                    inline: true
                                },
                                {
                                    name: `Construction :`,
                                    value: `*pour une usine* \n` +
                                        `<ressource1>: ${process.env.CONST_BRIQUETERIE_1}\n` +
                                        `<ressource2>: ${process.env.CONST_BRIQUETERIE_2}\n` +
                                        `<ressource3>: ${process.env.CONST_BRIQUETERIE_3}\n` +
                                        `Surface : ${process.env.SURFACE_BRIQUETERIE} km²`
                                }
                            ],
                            color: interaction.member.displayHexColor,
                            timestamp: new Date(),
                            footer: { text: `${results[0].devise}` }
                        };

                        interaction.reply({ embeds: [embed] })
                    })
                } else if (interaction.values == 'champ') {

                    const embed = {
                        author: {
                            name: `<\\Nom du pays>`,
                            icon_url: interaction.member.displayAvatarURL()
                        },
                        thumbnail: {
                            url: 'https://cdn.discordapp.com/attachments/939251032297463879/940642380640583770/paz_v3.png',
                        },
                        title: `Usine : Champ`,
                        description: `Nombre d'usines total : \n` +
                            `Territoire utilisé :`,
                        fields: [{
                                name: `Production :`,
                                value: `Ressource : nourriture\n` +
                                    `Par usine : \n` +
                                    `Totale :`,
                                inline: true
                            },
                            {
                                name: `En réserve :`,
                                value: `<>`,
                                inline: true
                            },
                            {
                                name: '\u200B',
                                value: '\u200B'
                            },
                            {
                                name: `Consommation :`,
                                value: `- Par usine : \n` +
                                    `<ressource1> :\n` +
                                    `<ressource2>:\n` +
                                    `<ressource3>:\n`,
                                inline: true
                            },
                            {
                                name: `\u200B`,
                                value: `- Totale : \n` +
                                    `<ressource1>:\n` +
                                    `<ressource2>:\n` +
                                    `<ressource3>:`,
                                inline: true
                            },
                            {
                                name: `Construction :`,
                                value: `*pour une usine* \n` +
                                    `<ressource1>:\n` +
                                    `<ressource2>:\n` +
                                    `<ressource3>:`
                            }
                        ],
                        color: interaction.member.displayHexColor,
                        footer: {
                            text: `Suède, Travail, Investissement`
                        }
                    };

                    interaction.reply({ embeds: [embed] })
                } else if (interaction.values == 'centrale_électrique') {

                    const embed = {
                        author: {
                            name: `<\\Nom du pays>`,
                            icon_url: interaction.member.displayAvatarURL()
                        },
                        thumbnail: {
                            url: 'https://cdn.discordapp.com/attachments/939251032297463879/940642380640583770/paz_v3.png',
                        },
                        title: `Usine : Centrale électrique`,
                        description: `Nombre d'usines total : \n` +
                            `Territoire utilisé :`,
                        fields: [{
                                name: `Production :`,
                                value: `Ressource : électricité\n` +
                                    `Par usine : \n` +
                                    `Totale :`,
                                inline: true
                            },
                            {
                                name: `En réserve :`,
                                value: `<>`,
                                inline: true
                            },
                            {
                                name: '\u200B',
                                value: '\u200B'
                            },
                            {
                                name: `Consommation :`,
                                value: `- Par usine : \n` +
                                    `<ressource1> :\n` +
                                    `<ressource2>:\n` +
                                    `<ressource3>:\n`,
                                inline: true
                            },
                            {
                                name: `\u200B`,
                                value: `- Totale : \n` +
                                    `<ressource1>:\n` +
                                    `<ressource2>:\n` +
                                    `<ressource3>:`,
                                inline: true
                            },
                            {
                                name: `Construction :`,
                                value: `*pour une usine* \n` +
                                    `<ressource1>:\n` +
                                    `<ressource2>:\n` +
                                    `<ressource3>:`
                            }
                        ],
                        color: interaction.member.displayHexColor,
                        footer: {
                            text: `Suède, Travail, Investissement`
                        }
                    };

                    interaction.reply({ embeds: [embed] })
                } else if (interaction.values == 'mine') {

                    const embed = {
                        author: {
                            name: `<\\Nom du pays>`,
                            icon_url: interaction.member.displayAvatarURL()
                        },
                        thumbnail: {
                            url: 'https://cdn.discordapp.com/attachments/939251032297463879/940642380640583770/paz_v3.png',
                        },
                        title: `Usine : Mine`,
                        description: `Nombre d'usines total : \n` +
                            `Territoire utilisé :`,
                        fields: [{
                                name: `Production :`,
                                value: `Ressource : métaux\n` +
                                    `Par usine : \n` +
                                    `Totale :`,
                                inline: true
                            },
                            {
                                name: `En réserve :`,
                                value: `<>`,
                                inline: true
                            },
                            {
                                name: '\u200B',
                                value: '\u200B'
                            },
                            {
                                name: `Consommation :`,
                                value: `- Par usine : \n` +
                                    `<ressource1> :\n` +
                                    `<ressource2>:\n` +
                                    `<ressource3>:\n`,
                                inline: true
                            },
                            {
                                name: `\u200B`,
                                value: `- Totale : \n` +
                                    `<ressource1>:\n` +
                                    `<ressource2>:\n` +
                                    `<ressource3>:`,
                                inline: true
                            },
                            {
                                name: `Construction :`,
                                value: `*pour une usine* \n` +
                                    `<ressource1>:\n` +
                                    `<ressource2>:\n` +
                                    `<ressource3>:`
                            }
                        ],
                        color: interaction.member.displayHexColor,
                        footer: {
                            text: `Suède, Travail, Investissement`
                        }
                    };

                    interaction.reply({ embeds: [embed] })
                } else if (interaction.values == 'pompe_à_eau') {

                    const embed = {
                        author: {
                            name: `<\\Nom du pays>`,
                            icon_url: interaction.member.displayAvatarURL()
                        },
                        thumbnail: {
                            url: 'https://cdn.discordapp.com/attachments/939251032297463879/940642380640583770/paz_v3.png',
                        },
                        title: `Usine : Pompe à eau`,
                        description: `Nombre d'usines total : \n` +
                            `Territoire utilisé :`,
                        fields: [{
                                name: `Production :`,
                                value: `Ressource : eau\n` +
                                    `Par usine : \n` +
                                    `Totale :`,
                                inline: true
                            },
                            {
                                name: `En réserve :`,
                                value: `<>`,
                                inline: true
                            },
                            {
                                name: '\u200B',
                                value: '\u200B'
                            },
                            {
                                name: `Consommation :`,
                                value: `- Par usine : \n` +
                                    `<ressource1> :\n` +
                                    `<ressource2>:\n` +
                                    `<ressource3>:\n`,
                                inline: true
                            },
                            {
                                name: `\u200B`,
                                value: `- Totale : \n` +
                                    `<ressource1>:\n` +
                                    `<ressource2>:\n` +
                                    `<ressource3>:`,
                                inline: true
                            },
                            {
                                name: `Construction :`,
                                value: `*pour une usine* \n` +
                                    `<ressource1>:\n` +
                                    `<ressource2>:\n` +
                                    `<ressource3>:`
                            }
                        ],
                        color: interaction.member.displayHexColor,
                        footer: {
                            text: `Suède, Travail, Investissement`
                        }
                    };

                    interaction.reply({ embeds: [embed] })
                } else if (interaction.values == 'pumpjack') {

                    const embed = {
                        author: {
                            name: `<\\Nom du pays>`,
                            icon_url: interaction.member.displayAvatarURL()
                        },
                        thumbnail: {
                            url: 'https://cdn.discordapp.com/attachments/939251032297463879/940642380640583770/paz_v3.png',
                        },
                        title: `Usine : Pumpjack`,
                        description: `Nombre d'usines total : \n` +
                            `Territoire utilisé :`,
                        fields: [{
                                name: `Production :`,
                                value: `Ressource : pétrole\n` +
                                    `Par usine : \n` +
                                    `Totale :`,
                                inline: true
                            },
                            {
                                name: `En réserve :`,
                                value: `<>`,
                                inline: true
                            },
                            {
                                name: '\u200B',
                                value: '\u200B'
                            },
                            {
                                name: `Consommation :`,
                                value: `- Par usine : \n` +
                                    `<ressource1> :\n` +
                                    `<ressource2>:\n` +
                                    `<ressource3>:\n`,
                                inline: true
                            },
                            {
                                name: `\u200B`,
                                value: `- Totale : \n` +
                                    `<ressource1>:\n` +
                                    `<ressource2>:\n` +
                                    `<ressource3>:`,
                                inline: true
                            },
                            {
                                name: `Construction :`,
                                value: `*pour une usine* \n` +
                                    `<ressource1>:\n` +
                                    `<ressource2>:\n` +
                                    `<ressource3>:`
                            }
                        ],
                        color: interaction.member.displayHexColor,
                        footer: {
                            text: `Suède, Travail, Investissement`
                        }
                    };

                    interaction.reply({ embeds: [embed] })
                } else if (interaction.values == 'scierie') {

                    const embed = {
                        author: {
                            name: `<\\Nom du pays>`,
                            icon_url: interaction.member.displayAvatarURL()
                        },
                        thumbnail: {
                            url: 'https://cdn.discordapp.com/attachments/939251032297463879/940642380640583770/paz_v3.png',
                        },
                        title: `Usine : Scierie`,
                        description: `Nombre d'usines total : \n` +
                            `Territoire utilisé :`,
                        fields: [{
                                name: `Production :`,
                                value: `Ressource : bois\n` +
                                    `Par usine : \n` +
                                    `Totale :`,
                                inline: true
                            },
                            {
                                name: `En réserve :`,
                                value: `<>`,
                                inline: true
                            },
                            {
                                name: '\u200B',
                                value: '\u200B'
                            },
                            {
                                name: `Consommation :`,
                                value: `- Par usine : \n` +
                                    `<ressource1> :\n` +
                                    `<ressource2>:\n` +
                                    `<ressource3>:\n`,
                                inline: true
                            },
                            {
                                name: `\u200B`,
                                value: `- Totale : \n` +
                                    `<ressource1>:\n` +
                                    `<ressource2>:\n` +
                                    `<ressource3>:`,
                                inline: true
                            },
                            {
                                name: `Construction :`,
                                value: `*pour une usine* \n` +
                                    `<ressource1>:\n` +
                                    `<ressource2>:\n` +
                                    `<ressource3>:`
                            }
                        ],
                        color: interaction.member.displayHexColor,
                        footer: {
                            text: `Suède, Travail, Investissement`
                        }
                    };

                    interaction.reply({ embeds: [embed] })
                } else if (interaction.values == 'usine_civile') {

                    const embed = {
                        author: {
                            name: `<\\Nom du pays>`,
                            icon_url: interaction.member.displayAvatarURL()
                        },
                        thumbnail: {
                            url: 'https://cdn.discordapp.com/attachments/939251032297463879/940642380640583770/paz_v3.png',
                        },
                        title: `Usine : Civile`,
                        description: `Nombre d'usines total : \n` +
                            `Territoire utilisé :`,
                        fields: [{
                                name: `Production :`,
                                value: `Ressource : biens de consommation\n` +
                                    `Par usine : \n` +
                                    `Totale :`,
                                inline: true
                            },
                            {
                                name: `En réserve :`,
                                value: `<>`,
                                inline: true
                            },
                            {
                                name: '\u200B',
                                value: '\u200B'
                            },
                            {
                                name: `Consommation :`,
                                value: `- Par usine : \n` +
                                    `<ressource1> :\n` +
                                    `<ressource2>:\n` +
                                    `<ressource3>:\n`,
                                inline: true
                            },
                            {
                                name: `\u200B`,
                                value: `- Totale : \n` +
                                    `<ressource1>:\n` +
                                    `<ressource2>:\n` +
                                    `<ressource3>:`,
                                inline: true
                            },
                            {
                                name: `Construction :`,
                                value: `*pour une usine* \n` +
                                    `<ressource1>:\n` +
                                    `<ressource2>:\n` +
                                    `<ressource3>:`
                            }
                        ],
                        color: interaction.member.displayHexColor,
                        footer: {
                            text: `Suède, Travail, Investissement`
                        }
                    };

                    interaction.reply({ embeds: [embed] })
                }
            }; //FIN DU CODE POUR LES MENUS
        };
    }
};