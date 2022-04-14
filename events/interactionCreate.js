const { codeBlock } = require('@discordjs/builders');
const { Client, Collection, Intents, Guild } = require('discord.js');
var mysql = require('mysql');
const { globalBox } = require('global-box');
const box = globalBox();
const dotenv = require('dotenv');
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
                                value: `${results[0].cash} $\n\u200B`
                            },
                            {
                                name: `Nombre d'usine total :`,
                                value: `${results[0].usine_total}\n\u200B`
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

                    if (results[0].action_diplo < 10) {

                        var reponse = codeBlock('diff', `- Vous n'avez pas assez de points d'action diplomatique : ${results[0].action_diplo}/10`);
                        await interaction.reply({ content: reponse });

                    } else {

                        var random = chance.bool({ likelihood: results[0].réputation })
                        console.log(random)

                        if (random == true) {

                            var territoire = chance.integer({ min: 2500, max: 5000 });
                            console.log(territoire);
                            var pop = chance.integer({ min: process.env.EXP_MIN_POP, max: process.env.EXP_MAX_POP });
                            console.log(pop);

                            var sql1 = `
                            UPDATE pays SET T_total=T_total+${territoire} WHERE id_joueur=${interaction.user.id};
                            UPDATE pays SET population=population+${pop} WHERE id_joueur=${interaction.user.id};
                            UPDATE pays SET action_diplo=action_diplo-10 WHERE id_joueur=${interaction.user.id};
                            UPDATE pays SET réputation=réputation+0.5 WHERE id_joueur=${interaction.user.id}`;
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
                                        `> ${pop} habitants\n`
                                }],
                                color: interaction.member.displayHexColor,
                                timestamp: new Date(),
                                footer: {
                                    text: `${results[0].devise}`
                                },
                            };

                            interaction.reply({ embeds: [embed] })

                        } else {

                            var sql3 = `
                            UPDATE pays SET action_diplo=action_diplo-10 WHERE id_joueur=${interaction.user.id};
                            UPDATE pays SET réputation=réputation+0.2 WHERE id_joueur=${interaction.user.id}`;
                            connection.query(sql3, async(err, results) => {
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
            } else if (interaction.customId.includes('acheter') == true) {

                var id_salon = interaction.customId.slice(8);
                var sql = `
                SELECT * FROM trade WHERE id_salon="${id_salon}" LIMIT 1`;

                connection.query(sql, async(err, results) => {
                        if (err) {
                            throw err;
                        }

                        box.set('ressource', results[0].ressource);
                        var quantité = results[0].quantite;
                        var prix = results[0].prix;
                        var prix_u = results[0].prix_u;
                        var id_joueur = results[0].id_joueur;

                        var sql5 = `
                        SELECT * FROM pays WHERE id_joueur='${id_joueur}'`;

                        connection.query(sql5, async(err, results) => {
                            if (err) {
                                throw err;
                            }

                            if (box.get('ressource') == 'Biens de consommation') {
                                var res = 'bc';
                                box.set('joueur_res', results[0].bc);
                                if (results[0].bc >= quantité) {
                                    var enought_res = true
                                } else {
                                    var enought_res = false
                                }
                            } else if (box.get('ressource') == 'Bois') {
                                var res = 'bois';
                                box.set('joueur_res', results[0].bois);
                                if (results[0].bois >= quantité) {
                                    var enought_res = true
                                } else {
                                    var enought_res = false
                                }
                            } else if (box.get('ressource') == 'Brique') {
                                var res = 'brique';
                                box.set('joueur_res', results[0].brique);
                                if (results[0].brique >= quantité) {
                                    var enought_res = true
                                } else {
                                    var enought_res = false
                                }
                            } else if (box.get('ressource') == 'Eau') {
                                var res = 'eau';
                                box.set('joueur_res', results[0].eau);
                                if (results[0].eau >= quantité) {
                                    var enought_res = true
                                } else {
                                    var enought_res = false
                                }
                            } else if (box.get('ressource') == 'Metaux') {
                                var res = 'metaux';
                                box.set('joueur_res', results[0].metaux);
                                if (results[0].metaux >= quantité) {
                                    var enought_res = true
                                } else {
                                    var enought_res = false
                                }
                            } else if (box.get('ressource') == 'Nourriture') {
                                var res = 'nourriture';
                                box.set('joueur_res', results[0].nourriture);
                                if (results[0].nourriture >= quantité) {
                                    var enought_res = true
                                } else {
                                    var enought_res = false
                                }
                            } else if (box.get('ressource') == 'Petrole') {
                                var res = 'petrole';
                                box.set('joueur_res', results[0].petrole);
                                if (results[0].petrole >= quantité) {
                                    var enought_res = true
                                } else {
                                    var enought_res = false
                                }
                            }

                            var sql6 = `
                                SELECT * FROM pays WHERE id_joueur="${interaction.user.id}" LIMIT 1`;
                            connection.query(sql6, async(err, results) => {
                                if (err) {
                                    throw err;
                                }

                                if (enought_res == true) {
                                    if (results[0].cash >= prix) {

                                        const acheteur = {
                                            author: {
                                                name: `${results[0].rang} de ${results[0].nom}`,
                                                icon_url: interaction.member.displayAvatarURL()
                                            },
                                            thumbnail: {
                                                url: results[0].drapeau,
                                            },
                                            title: `\`Achat validé :\``,
                                            fields: [{
                                                    name: `Vendeur :`,
                                                    value: `<@${id_joueur}>`
                                                },
                                                {
                                                    name: `Ressource :`,
                                                    value: `${box.get('ressource')}`
                                                },
                                                {
                                                    name: `Quantité :`,
                                                    value: `${quantité}`
                                                },
                                                {
                                                    name: `Prix :`,
                                                    value: `Au total : ${prix} $
                                                            A l'unité : ${prix_u}`
                                                }
                                            ],
                                            color: interaction.member.displayHexColor,
                                            timestamp: new Date(),
                                            footer: {
                                                text: `${results[0].devise}`
                                            },
                                        };

                                        const vendeur = {
                                            author: {
                                                name: `${results[0].rang} de ${results[0].nom}`,
                                                icon_url: interaction.member.displayAvatarURL()
                                            },
                                            thumbnail: {
                                                url: results[0].drapeau,
                                            },
                                            title: `\`Marché conclu :\``,
                                            fields: [{
                                                    name: `Acheteur :`,
                                                    value: `<@${interaction.user.id}>`
                                                }, {
                                                    name: `Ressource :`,
                                                    value: `${box.get('ressource')}`
                                                },
                                                {
                                                    name: `Quantité :`,
                                                    value: `${quantité}`
                                                },
                                                {
                                                    name: `Prix :`,
                                                    value: `Au total : ${prix} $
                                                            A l'unité : ${prix_u}`
                                                }
                                            ],
                                            color: interaction.member.displayHexColor,
                                            timestamp: new Date(),
                                            footer: {
                                                text: `${results[0].devise}`
                                            },
                                        };

                                        const commerce = {
                                            author: {
                                                name: `${results[0].rang} de ${results[0].nom}`,
                                                icon_url: interaction.member.displayAvatarURL()
                                            },
                                            thumbnail: {
                                                url: results[0].drapeau,
                                            },
                                            title: `\`Marché conclu :\``,
                                            fields: [{
                                                    name: `Vendeur :`,
                                                    value: `<@${id_joueur}>`,
                                                    inline: true
                                                },
                                                {
                                                    name: `Acheteur :`,
                                                    value: `<@${interaction.user.id}>`,
                                                    inline: true
                                                },
                                                {
                                                    name: `Ressource :`,
                                                    value: `${box.get('ressource')}`
                                                },
                                                {
                                                    name: `Quantité :`,
                                                    value: `${quantité}`
                                                },
                                                {
                                                    name: `Prix :`,
                                                    value: `Au total : ${prix} $
                                                            A l'unité : ${prix_u}`
                                                }
                                            ],
                                            color: interaction.member.displayHexColor,
                                            timestamp: new Date(),
                                            footer: {
                                                text: `${results[0].devise}`
                                            },
                                        };

                                        const salon_commerce = interaction.client.channels.cache.get(process.env.SALON_COMMERCE);
                                        salon_commerce.send({ embeds: [commerce] })

                                        interaction.user.send({ embeds: [acheteur] });
                                        const id_vendeur = await interaction.guild.members.fetch(id_joueur);
                                        id_vendeur.send({ embeds: [vendeur] });

                                        const thread = await interaction.channel.fetch();
                                        await thread.delete();

                                        var sql7 = `
                                        UPDATE pays SET cash=cash+${prix} WHERE id_joueur="${id_joueur}";
                                        UPDATE pays SET cash=cash-${prix} WHERE id_joueur="${interaction.user.id}";
                                        UPDATE pays SET ${res}=${res}-${quantité} WHERE id_joueur="${id_joueur}";
                                        UPDATE pays SET ${res}=${res}+${quantité} WHERE id_joueur="${interaction.user.id}"`;
                                        connection.query(sql7, async(err, results) => {
                                            if (err) {
                                                throw err;
                                            }
                                        })

                                    } else {
                                        var reponse = codeBlock('diff', `- Vous n'avez pas l'argent nécessaire pour conclure l'affaire : ${results[0].cash}/${prix}`);
                                        await interaction.reply({ content: reponse, ephemeral: true });
                                    }
                                } else {
                                    var reponse = codeBlock('diff', `- ${interaction.member.displayName} n'a pas les ressources suffisantes pour conclure l'affaire : ${box.get('joueur_res')}/${quantité}`);
                                    await interaction.reply({ content: reponse });

                                }
                            })
                        });
                        //Choix dissuasif
                    }) //FIN DU CODE POUR LES BOUTONS
                    //code pour les menus
            }
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
                        conso_T_briqueterie_bois = process.env.CONSO_BRIQUETERIE_BOIS * results[0].briqueterie;
                        conso_T_briqueterie_eau = process.env.CONSO_BRIQUETERIE_EAU * results[0].briqueterie;

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
                                    name: `> Consommation :`,
                                    value: `- Par usine : \n` +
                                        `Bois : ${process.env.CONSO_BRIQUETERIE_BOIS}\n` +
                                        `Eau : ${process.env.CONSO_BRIQUETERIE_EAU}\n` +
                                        `\u200B`,
                                    inline: true
                                },
                                {
                                    name: `\u200B`,
                                    value: `- Totale : \n` +
                                        `Bois : ${conso_T_briqueterie_bois}\n` +
                                        `Eau : ${conso_T_briqueterie_eau}`,
                                    inline: true
                                },
                                {
                                    name: `> Production :`,
                                    value: `Ressource : brique\n` +
                                        `Par usine  ${process.env.PROD_BRIQUETERIE}\n` +
                                        `Totale : ${prod_T_briqueterie}` +
                                        `\u200B`
                                },
                                {
                                    name: `> En réserve :`,
                                    value: `${results[0].brique}`
                                },
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
                } else if (interaction.values == 'pompe_a_eau') {

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
}