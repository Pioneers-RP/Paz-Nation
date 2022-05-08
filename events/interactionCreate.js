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
                                name: `> 💵 Argent :`,
                                value: `${results[0].cash} $\n\u200B`
                            },
                            {
                                name: `> 🏭 Nombre d'usine total :`,
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
                                name: `> 👪 Population :`,
                                value: `${results[0].population} habitants\n\u200B`
                            },
                            {
                                name: `> 🏡 Densité :`,
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
                    SELECT * FROM pays WHERE id_joueur='${interaction.member.id}'`;

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
                                name: `> 🪧 Nom de l'Etat : `,
                                value: `${results[0].nom}\n\u200B`,
                            },
                            {
                                name: `> ®️ Rang : `,
                                value: `${results[0].rang}\n\u200B`
                            },
                            {
                                name: `> 🔱 Forme de gouvernement : `,
                                value: `${results[0].gouv_forme}\n\u200B`
                            },
                            {
                                name: `> 🧠 Idéologie : `,
                                value: `${results[0].ideologie}\n\u200B`
                            },
                            {
                                name: `> 📯 Devise : `,
                                value: `${results[0].devise}\n\u200B`
                            }
                        ],
                        color: interaction.member.displayHexColor,
                        timestamp: new Date(),
                        footer: { text: `${results[0].devise}` }
                    };

                    interaction.reply({ embeds: [embed] });
                })

                //Quick Sell
            } else if (interaction.customId === 'menu_QM') {

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
                            url: results[0].drapeau,
                        },
                        title: `Quick Sell (QS) :`,
                        description: `Biens de consommation : ${box.get('bc_prix_moyen')}\n` +
                            `Bois : ${box.get('bois_prix_moyen')}\n` +
                            `Brique : ${box.get('brique_prix_moyen')}\n` +
                            `Eau : ${box.get('eau_prix_moyen')}\n` +
                            `Métaux : ${box.get('metaux_prix_moyen')}\n` +
                            `Nourriture : ${box.get('nourriture_prix_moyen')}\n` +
                            `Pétrole : ${box.get('petrole_prix_moyen')}\n`,
                        color: interaction.member.displayHexColor,
                    };

                    interaction.reply({ embeds: [embed] })
                })

                //Choix pacifique
            } else if (interaction.customId.includes('construction') == true) {

                var id_joueur = interaction.customId.slice(13);
                if (id_joueur == interaction.member.id) {

                    var sql = `
                        SELECT * FROM pays WHERE id_joueur=${interaction.member.id}`;
                    connection.query(sql, async(err, results) => {
                        if (err) {
                            throw err;
                        }

                        var title = interaction.message.embeds[0].title
                        var title = title.substring(16, title.length - 1)
                        var espace = title.indexOf(" ");
                        var nombre = title.slice(0, espace)
                        var batiment = title.slice(espace + 1)

                        if (batiment == 'Briqueterie') {

                            var const_T_libre = process.env.SURFACE_BRIQUETERIE * nombre;
                            var const_bois = process.env.CONST_BRIQUETERIE_BOIS * nombre;
                            var const_brique = process.env.CONST_BRIQUETERIE_BRIQUE * nombre;
                            var const_metaux = process.env.CONST_BRIQUETERIE_METAUX * nombre;

                            var sql = `
                                UPDATE pays SET briqueterie=briqueterie+${nombre} WHERE id_joueur='${interaction.member.id}';
                                UPDATE pays SET T_libre=T_libre-${const_T_libre} WHERE id_joueur='${interaction.member.id}';
                                UPDATE pays SET bois=bois-${const_bois} WHERE id_joueur='${interaction.member.id}';
                                UPDATE pays SET brique=brique-${const_brique} WHERE id_joueur='${interaction.member.id}';
                                UPDATE pays SET metaux=metaux-${const_metaux} WHERE id_joueur='${interaction.member.id}'`;
                            connection.query(sql, async(err, results) => {
                                if (err) {
                                    throw err;
                                }
                            })

                            var newbc = results[0].briqueterie + parseInt(nombre);

                            var embed = {
                                author: {
                                    name: `${results[0].rang} de ${results[0].nom}`,
                                    icon_url: interaction.member.displayAvatarURL()
                                },
                                thumbnail: {
                                    url: `${results[0].drapeau}`
                                },
                                title: `\`Construction : ${nombre} briqueteries\``,
                                description: `> 🛠️ Vous avez désormais :\n` +
                                    `${newbc} briqueteries`,
                                color: interaction.member.displayHexColor,
                                timestamp: new Date(),
                                footer: {
                                    text: `${results[0].devise}`
                                },
                            }

                            interaction.deferUpdate()

                            interaction.message.edit({ embeds: [embed], components: [] })

                        } else if (batiment == 'Champ') {

                            var const_T_libre = process.env.SURFACE_CHAMP * nombre;
                            var const_bois = process.env.CONST_CHAMP_BOIS * nombre;
                            var const_brique = process.env.CONST_CHAMP_BRIQUE * nombre;
                            var const_metaux = process.env.CONST_CHAMP_METAUX * nombre;

                            var sql = `
                                UPDATE pays SET champ=champ+${nombre} WHERE id_joueur='${interaction.member.id}';
                                UPDATE pays SET T_libre=T_libre-${const_T_libre} WHERE id_joueur='${interaction.member.id}';
                                UPDATE pays SET bois=bois-${const_bois} WHERE id_joueur='${interaction.member.id}';
                                UPDATE pays SET brique=brique-${const_brique} WHERE id_joueur='${interaction.member.id}';
                                UPDATE pays SET metaux=metaux-${const_metaux} WHERE id_joueur='${interaction.member.id}'`;
                            connection.query(sql, async(err, results) => {
                                if (err) {
                                    throw err;
                                }
                            })

                            var newbc = results[0].champ + parseInt(nombre);

                            var embed = {
                                author: {
                                    name: `${results[0].rang} de ${results[0].nom}`,
                                    icon_url: interaction.member.displayAvatarURL()
                                },
                                thumbnail: {
                                    url: `${results[0].drapeau}`
                                },
                                title: `\`Construction : ${nombre} champs\``,
                                description: `> 🛠️ Vous avez désormais :\n` +
                                    `${newbc} champs`,
                                color: interaction.member.displayHexColor,
                                timestamp: new Date(),
                                footer: {
                                    text: `${results[0].devise}`
                                },
                            }

                            interaction.deferUpdate()

                            interaction.message.edit({ embeds: [embed], components: [] })

                        } else if (batiment == 'Mine') {

                            var const_T_libre = process.env.SURFACE_MINE * nombre;
                            var const_bois = process.env.CONST_MINE_BOIS * nombre;
                            var const_brique = process.env.CONST_MINE_BRIQUE * nombre;
                            var const_metaux = process.env.CONST_MINE_METAUX * nombre;

                            var sql = `
                                UPDATE pays SET mine=mine+${nombre} WHERE id_joueur='${interaction.member.id}';
                                UPDATE pays SET T_libre=T_libre-${const_T_libre} WHERE id_joueur='${interaction.member.id}';
                                UPDATE pays SET bois=bois-${const_bois} WHERE id_joueur='${interaction.member.id}';
                                UPDATE pays SET brique=brique-${const_brique} WHERE id_joueur='${interaction.member.id}';
                                UPDATE pays SET metaux=metaux-${const_metaux} WHERE id_joueur='${interaction.member.id}'`;
                            connection.query(sql, async(err, results) => {
                                if (err) {
                                    throw err;
                                }
                            })

                            var newbc = results[0].mine + parseInt(nombre);

                            var embed = {
                                author: {
                                    name: `${results[0].rang} de ${results[0].nom}`,
                                    icon_url: interaction.member.displayAvatarURL()
                                },
                                thumbnail: {
                                    url: `${results[0].drapeau}`
                                },
                                title: `\`Construction : ${nombre} mines\``,
                                description: `> 🛠️ Vous avez désormais :\n` +
                                    `${newbc} mines`,
                                color: interaction.member.displayHexColor,
                                timestamp: new Date(),
                                footer: {
                                    text: `${results[0].devise}`
                                },
                            }

                            interaction.deferUpdate()

                            interaction.message.edit({ embeds: [embed], components: [] })

                        } else if (batiment == 'Pompe à eau') {

                            var const_T_libre = process.env.SURFACE_POMPE_A_EAU * nombre;
                            var const_bois = process.env.CONST_POMPE_A_EAU_BOIS * nombre;
                            var const_brique = process.env.CONST_POMPE_A_EAU_BRIQUE * nombre;
                            var const_metaux = process.env.CONST_POMPE_A_EAU_METAUX * nombre;

                            var sql = `
                                UPDATE pays SET pompe_a_eau=pompe_a_eau+${nombre} WHERE id_joueur='${interaction.member.id}';
                                UPDATE pays SET T_libre=T_libre-${const_T_libre} WHERE id_joueur='${interaction.member.id}';
                                UPDATE pays SET bois=bois-${const_bois} WHERE id_joueur='${interaction.member.id}';
                                UPDATE pays SET brique=brique-${const_brique} WHERE id_joueur='${interaction.member.id}';
                                UPDATE pays SET metaux=metaux-${const_metaux} WHERE id_joueur='${interaction.member.id}'`;
                            connection.query(sql, async(err, results) => {
                                if (err) {
                                    throw err;
                                }
                            })

                            var newbc = results[0].pompe_a_eau + parseInt(nombre);

                            var embed = {
                                author: {
                                    name: `${results[0].rang} de ${results[0].nom}`,
                                    icon_url: interaction.member.displayAvatarURL()
                                },
                                thumbnail: {
                                    url: `${results[0].drapeau}`
                                },
                                title: `\`Construction : ${nombre} pompes à eau\``,
                                description: `> 🛠️ Vous avez désormais :\n` +
                                    `${newbc} pompes à eau`,
                                color: interaction.member.displayHexColor,
                                timestamp: new Date(),
                                footer: {
                                    text: `${results[0].devise}`
                                },
                            }

                            interaction.deferUpdate()

                            interaction.message.edit({ embeds: [embed], components: [] })

                        } else if (batiment == 'Pumpjack') {

                            var const_T_libre = process.env.SURFACE_PUMPJACK * nombre;
                            var const_bois = process.env.CONST_PUMPJACK_BOIS * nombre;
                            var const_brique = process.env.CONST_PUMPJACK_BRIQUE * nombre;
                            var const_metaux = process.env.CONST_PUMPJACK_METAUX * nombre;

                            var sql = `
                                UPDATE pays SET pumpjack=pumpjack+${nombre} WHERE id_joueur='${interaction.member.id}';
                                UPDATE pays SET T_libre=T_libre-${const_T_libre} WHERE id_joueur='${interaction.member.id}';
                                UPDATE pays SET bois=bois-${const_bois} WHERE id_joueur='${interaction.member.id}';
                                UPDATE pays SET brique=brique-${const_brique} WHERE id_joueur='${interaction.member.id}';
                                UPDATE pays SET metaux=metaux-${const_metaux} WHERE id_joueur='${interaction.member.id}'`;
                            connection.query(sql, async(err, results) => {
                                if (err) {
                                    throw err;
                                }
                            })

                            var newbc = results[0].pumpjack + parseInt(nombre);

                            var embed = {
                                author: {
                                    name: `${results[0].rang} de ${results[0].nom}`,
                                    icon_url: interaction.member.displayAvatarURL()
                                },
                                thumbnail: {
                                    url: `${results[0].drapeau}`
                                },
                                title: `\`Construction : ${nombre} pumpjacks\``,
                                description: `> 🛠️ Vous avez désormais :\n` +
                                    `${newbc} pumpjacks`,
                                color: interaction.member.displayHexColor,
                                timestamp: new Date(),
                                footer: {
                                    text: `${results[0].devise}`
                                },
                            }

                            interaction.deferUpdate()

                            interaction.message.edit({ embeds: [embed], components: [] })

                        } else if (batiment == 'Scierie') {

                            var const_T_libre = process.env.SURFACE_SCIERIE * nombre;
                            var const_bois = process.env.CONST_SCIERIE_BOIS * nombre;
                            var const_brique = process.env.CONST_SCIERIE_BRIQUE * nombre;
                            var const_metaux = process.env.CONST_SCIERIE_METAUX * nombre;

                            var sql = `
                                UPDATE pays SET scierie=scierie+${nombre} WHERE id_joueur='${interaction.member.id}';
                                UPDATE pays SET T_libre=T_libre-${const_T_libre} WHERE id_joueur='${interaction.member.id}';
                                UPDATE pays SET bois=bois-${const_bois} WHERE id_joueur='${interaction.member.id}';
                                UPDATE pays SET brique=brique-${const_brique} WHERE id_joueur='${interaction.member.id}';
                                UPDATE pays SET metaux=metaux-${const_metaux} WHERE id_joueur='${interaction.member.id}'`;
                            connection.query(sql, async(err, results) => {
                                if (err) {
                                    throw err;
                                }
                            })

                            var newbc = results[0].scierie + parseInt(nombre);

                            var embed = {
                                author: {
                                    name: `${results[0].rang} de ${results[0].nom}`,
                                    icon_url: interaction.member.displayAvatarURL()
                                },
                                thumbnail: {
                                    url: `${results[0].drapeau}`
                                },
                                title: `\`Construction : ${nombre} scieries\``,
                                description: `> 🛠️ Vous avez désormais :\n` +
                                    `${newbc} scierie`,
                                color: interaction.member.displayHexColor,
                                timestamp: new Date(),
                                footer: {
                                    text: `${results[0].devise}`
                                },
                            }

                            interaction.deferUpdate()

                            interaction.message.edit({ embeds: [embed], components: [] })

                        } else if (batiment == 'Usine civile') {

                            var const_T_libre = process.env.SURFACE_USINE_CIVILE * nombre;
                            var const_bois = process.env.CONST_USINE_CIVILE_BOIS * nombre;
                            var const_brique = process.env.CONST_USINE_CIVILE_BRIQUE * nombre;
                            var const_metaux = process.env.CONST_USINE_CIVILE_METAUX * nombre;

                            var sql = `
                                UPDATE pays SET usine_civile=usine_civile+${nombre} WHERE id_joueur='${interaction.member.id}';
                                UPDATE pays SET T_libre=T_libre-${const_T_libre} WHERE id_joueur='${interaction.member.id}';
                                UPDATE pays SET bois=bois-${const_bois} WHERE id_joueur='${interaction.member.id}';
                                UPDATE pays SET brique=brique-${const_brique} WHERE id_joueur='${interaction.member.id}';
                                UPDATE pays SET metaux=metaux-${const_metaux} WHERE id_joueur='${interaction.member.id}'`;
                            connection.query(sql, async(err, results) => {
                                if (err) {
                                    throw err;
                                }
                            })

                            var newbc = results[0].usine_civile + parseInt(nombre);

                            var embed = {
                                author: {
                                    name: `${results[0].rang} de ${results[0].nom}`,
                                    icon_url: interaction.member.displayAvatarURL()
                                },
                                thumbnail: {
                                    url: `${results[0].drapeau}`
                                },
                                title: `\`Construction : ${nombre} usines civile\``,
                                description: `> 🛠️ Vous avez désormais :\n` +
                                    `${newbc} usines civile`,
                                color: interaction.member.displayHexColor,
                                timestamp: new Date(),
                                footer: {
                                    text: `${results[0].devise}`
                                },
                            }

                            interaction.deferUpdate()

                            interaction.message.edit({ embeds: [embed], components: [] })

                        }
                    })

                } else {
                    var reponse = codeBlock('diff', `- Vous n'êtes pas l'auteur de cette commande`);
                    interaction.reply({ content: reponse, ephemeral: true });
                }
                //Choix pacifique
            } else if (interaction.customId.includes('demolition') == true) {

                var id_joueur = interaction.customId.slice(11);
                if (id_joueur == interaction.member.id) {

                    var sql = `
                        SELECT * FROM pays WHERE id_joueur=${interaction.member.id}`;
                    connection.query(sql, async(err, results) => {
                        if (err) {
                            throw err;
                        }

                        var title = interaction.message.embeds[0].title
                        var title = title.substring(14, title.length - 1)
                        var espace = title.indexOf(" ");
                        var nombre = title.slice(0, espace)
                        var batiment = title.slice(espace + 1)

                        if (batiment == 'Briqueterie') {

                            var demo_T_libre = process.env.SURFACE_BRIQUETERIE * nombre;
                            var demo_bois = process.env.CONST_BRIQUETERIE_BOIS * nombre * process.env.RETOUR_POURCENTAGE;
                            var demo_brique = process.env.CONST_BRIQUETERIE_BRIQUE * nombre * process.env.RETOUR_POURCENTAGE;
                            var demo_metaux = process.env.CONST_BRIQUETERIE_METAUX * nombre * process.env.RETOUR_POURCENTAGE;

                            var sql = `
                                UPDATE pays SET briqueterie=briqueterie-${nombre} WHERE id_joueur='${interaction.member.id}';
                                UPDATE pays SET T_libre=T_libre+${demo_T_libre} WHERE id_joueur='${interaction.member.id}';
                                UPDATE pays SET bois=bois+${demo_bois} WHERE id_joueur='${interaction.member.id}';
                                UPDATE pays SET brique=brique+${demo_brique} WHERE id_joueur='${interaction.member.id}';
                                UPDATE pays SET metaux=metaux+${demo_metaux} WHERE id_joueur='${interaction.member.id}'`;
                            connection.query(sql, async(err, results) => {
                                if (err) {
                                    throw err;
                                }
                            })

                            var newbc = results[0].briqueterie - parseInt(nombre);

                            var embed = {
                                author: {
                                    name: `${results[0].rang} de ${results[0].nom}`,
                                    icon_url: interaction.member.displayAvatarURL()
                                },
                                thumbnail: {
                                    url: `${results[0].drapeau}`
                                },
                                title: `\`Démolition : ${nombre} briqueteries\``,
                                description: `> 🛠️ Vous avez désormais :\n` +
                                    `${newbc} briqueteries`,
                                color: interaction.member.displayHexColor,
                                timestamp: new Date(),
                                footer: {
                                    text: `${results[0].devise}`
                                },
                            }

                            interaction.deferUpdate()

                            interaction.message.edit({ embeds: [embed], components: [] })

                        } else if (batiment == 'Champ') {

                            var demo_T_libre = process.env.SURFACE_CHAMP * nombre;
                            var demo_bois = process.env.CONST_CHAMP * nombre * process.env.RETOUR_POURCENTAGE;
                            var demo_brique = process.env.CONST_CHAMP_BRIQUE * nombre * process.env.RETOUR_POURCENTAGE;
                            var demo_metaux = process.env.CONST_CHAMP_METAUX * nombre * process.env.RETOUR_POURCENTAGE;

                            var sql = `
                                UPDATE pays SET champ=champ-${nombre} WHERE id_joueur='${interaction.member.id}';
                                UPDATE pays SET T_libre=T_libre+${demo_T_libre} WHERE id_joueur='${interaction.member.id}';
                                UPDATE pays SET bois=bois+${demo_bois} WHERE id_joueur='${interaction.member.id}';
                                UPDATE pays SET brique=brique+${demo_brique} WHERE id_joueur='${interaction.member.id}';
                                UPDATE pays SET metaux=metaux+${demo_metaux} WHERE id_joueur='${interaction.member.id}'`;
                            connection.query(sql, async(err, results) => {
                                if (err) {
                                    throw err;
                                }
                            })

                            var newbc = results[0].champ - parseInt(nombre);

                            var embed = {
                                author: {
                                    name: `${results[0].rang} de ${results[0].nom}`,
                                    icon_url: interaction.member.displayAvatarURL()
                                },
                                thumbnail: {
                                    url: `${results[0].drapeau}`
                                },
                                title: `\`Démolition : ${nombre} champs\``,
                                description: `> 🛠️ Vous avez désormais :\n` +
                                    `${newbc} champs`,
                                color: interaction.member.displayHexColor,
                                timestamp: new Date(),
                                footer: {
                                    text: `${results[0].devise}`
                                },
                            }

                            interaction.deferUpdate()

                            interaction.message.edit({ embeds: [embed], components: [] })

                        } else if (batiment == 'Mine') {

                            var demo_T_libre = process.env.SURFACE_MINE * nombre;
                            var demo_bois = process.env.CONST_MINE_BOIS * nombre * process.env.RETOUR_POURCENTAGE;
                            var demo_brique = process.env.CONST_MINE_BRIQUE * nombre * process.env.RETOUR_POURCENTAGE;
                            var demo_metaux = process.env.CONST_MINE_METAUX * nombre * process.env.RETOUR_POURCENTAGE;

                            var sql = `
                                UPDATE pays SET mine=mine-${nombre} WHERE id_joueur='${interaction.member.id}';
                                UPDATE pays SET T_libre=T_libre+${demo_T_libre} WHERE id_joueur='${interaction.member.id}';
                                UPDATE pays SET bois=bois+${demo_bois} WHERE id_joueur='${interaction.member.id}';
                                UPDATE pays SET brique=brique+${demo_brique} WHERE id_joueur='${interaction.member.id}';
                                UPDATE pays SET metaux=metaux+${demo_metaux} WHERE id_joueur='${interaction.member.id}'`;
                            connection.query(sql, async(err, results) => {
                                if (err) {
                                    throw err;
                                }
                            })

                            var newbc = results[0].mine - parseInt(nombre);

                            var embed = {
                                author: {
                                    name: `${results[0].rang} de ${results[0].nom}`,
                                    icon_url: interaction.member.displayAvatarURL()
                                },
                                thumbnail: {
                                    url: `${results[0].drapeau}`
                                },
                                title: `\`Démolition : ${nombre} mines\``,
                                description: `> 🛠️ Vous avez désormais :\n` +
                                    `${newbc} mines`,
                                color: interaction.member.displayHexColor,
                                timestamp: new Date(),
                                footer: {
                                    text: `${results[0].devise}`
                                },
                            }

                            interaction.deferUpdate()

                            interaction.message.edit({ embeds: [embed], components: [] })

                        } else if (batiment == 'Pompe à eau') {

                            var demo_T_libre = process.env.SURFACE_POMPE_A_EAU * nombre;
                            var demo_bois = process.env.CONST_POMPE_A_EAU_BOIS * nombre * process.env.RETOUR_POURCENTAGE;
                            var demo_brique = process.env.CONST_POMPE_A_EAU_BRIQUE * nombre * process.env.RETOUR_POURCENTAGE;
                            var demo_metaux = process.env.CONST_POMPE_A_EAU_METAUX * nombre * process.env.RETOUR_POURCENTAGE;

                            var sql = `
                                UPDATE pays SET pompe_a_eau=pompe_a_eau-${nombre} WHERE id_joueur='${interaction.member.id}';
                                UPDATE pays SET T_libre=T_libre+${demo_T_libre} WHERE id_joueur='${interaction.member.id}';
                                UPDATE pays SET bois=bois+${demo_bois} WHERE id_joueur='${interaction.member.id}';
                                UPDATE pays SET brique=brique+${demo_brique} WHERE id_joueur='${interaction.member.id}';
                                UPDATE pays SET metaux=metaux+${demo_metaux} WHERE id_joueur='${interaction.member.id}'`;
                            connection.query(sql, async(err, results) => {
                                if (err) {
                                    throw err;
                                }
                            })

                            var newbc = results[0].pompe_a_eau - parseInt(nombre);

                            var embed = {
                                author: {
                                    name: `${results[0].rang} de ${results[0].nom}`,
                                    icon_url: interaction.member.displayAvatarURL()
                                },
                                thumbnail: {
                                    url: `${results[0].drapeau}`
                                },
                                title: `\`Démolition : ${nombre} pompes à eau\``,
                                description: `> 🛠️ Vous avez désormais :\n` +
                                    `${newbc} pompes à eau`,
                                color: interaction.member.displayHexColor,
                                timestamp: new Date(),
                                footer: {
                                    text: `${results[0].devise}`
                                },
                            }

                            interaction.deferUpdate()

                            interaction.message.edit({ embeds: [embed], components: [] })

                        } else if (batiment == 'Pumpjack') {

                            var demo_T_libre = process.env.SURFACE_PUMPJACK * nombre;
                            var demo_bois = process.env.CONST_PUMPJACK_BOIS * nombre * process.env.RETOUR_POURCENTAGE;
                            var demo_brique = process.env.CONST_PUMPJACK_BRIQUE * nombre * process.env.RETOUR_POURCENTAGE;
                            var demo_metaux = process.env.CONST_PUMPJACK_METAUX * nombre * process.env.RETOUR_POURCENTAGE;

                            var sql = `
                                UPDATE pays SET pumpjack=pumpjack-${nombre} WHERE id_joueur='${interaction.member.id}';
                                UPDATE pays SET T_libre=T_libre+${demo_T_libre} WHERE id_joueur='${interaction.member.id}';
                                UPDATE pays SET bois=bois+${demo_bois} WHERE id_joueur='${interaction.member.id}';
                                UPDATE pays SET brique=brique+${demo_brique} WHERE id_joueur='${interaction.member.id}';
                                UPDATE pays SET metaux=metaux+${demo_metaux} WHERE id_joueur='${interaction.member.id}'`;
                            connection.query(sql, async(err, results) => {
                                if (err) {
                                    throw err;
                                }
                            })

                            var newbc = results[0].pumpjack - parseInt(nombre);

                            var embed = {
                                author: {
                                    name: `${results[0].rang} de ${results[0].nom}`,
                                    icon_url: interaction.member.displayAvatarURL()
                                },
                                thumbnail: {
                                    url: `${results[0].drapeau}`
                                },
                                title: `\`Démolition : ${nombre} pumpjacks\``,
                                description: `> 🛠️ Vous avez désormais :\n` +
                                    `${newbc} pumpjacks`,
                                color: interaction.member.displayHexColor,
                                timestamp: new Date(),
                                footer: {
                                    text: `${results[0].devise}`
                                },
                            }

                            interaction.deferUpdate()

                            interaction.message.edit({ embeds: [embed], components: [] })

                        } else if (batiment == 'Scierie') {

                            var demo_T_libre = process.env.SURFACE_SCIERIE * nombre;
                            var demo_bois = process.env.CONST_SCIERIE_BOIS * nombre * process.env.RETOUR_POURCENTAGE;
                            var demo_brique = process.env.CONST_SCIERIE_BRIQUE * nombre * process.env.RETOUR_POURCENTAGE;
                            var demo_metaux = process.env.CONST_SCIERIE_METAUX * nombre * process.env.RETOUR_POURCENTAGE;

                            var sql = `
                                UPDATE pays SET scierie=scierie-${nombre} WHERE id_joueur='${interaction.member.id}';
                                UPDATE pays SET T_libre=T_libre+${demo_T_libre} WHERE id_joueur='${interaction.member.id}';
                                UPDATE pays SET bois=bois+${demo_bois} WHERE id_joueur='${interaction.member.id}';
                                UPDATE pays SET brique=brique+${demo_brique} WHERE id_joueur='${interaction.member.id}';
                                UPDATE pays SET metaux=metaux+${demo_metaux} WHERE id_joueur='${interaction.member.id}'`;
                            connection.query(sql, async(err, results) => {
                                if (err) {
                                    throw err;
                                }
                            })

                            var newbc = results[0].scierie - parseInt(nombre);

                            var embed = {
                                author: {
                                    name: `${results[0].rang} de ${results[0].nom}`,
                                    icon_url: interaction.member.displayAvatarURL()
                                },
                                thumbnail: {
                                    url: `${results[0].drapeau}`
                                },
                                title: `\`Démolition : ${nombre} scieries\``,
                                description: `> 🛠️ Vous avez désormais :\n` +
                                    `${newbc} scierie`,
                                color: interaction.member.displayHexColor,
                                timestamp: new Date(),
                                footer: {
                                    text: `${results[0].devise}`
                                },
                            }

                            interaction.deferUpdate()

                            interaction.message.edit({ embeds: [embed], components: [] })

                        } else if (batiment == 'Usine civile') {

                            var demo_T_libre = process.env.SURFACE_USINE_CIVILE * nombre;
                            var demo_bois = process.env.CONST_USINE_CIVILE_BOIS * nombre * process.env.RETOUR_POURCENTAGE;
                            var demo_brique = process.env.CONST_USINE_CIVILE_BRIQUE * nombre * process.env.RETOUR_POURCENTAGE;
                            var demo_metaux = process.env.CONST_USINE_CIVILE_METAUX * nombre * process.env.RETOUR_POURCENTAGE;

                            var sql = `
                                UPDATE pays SET usine_civile=usine_civile-${nombre} WHERE id_joueur='${interaction.member.id}';
                                UPDATE pays SET T_libre=T_libre+${demo_T_libre} WHERE id_joueur='${interaction.member.id}';
                                UPDATE pays SET bois=bois+${demo_bois} WHERE id_joueur='${interaction.member.id}';
                                UPDATE pays SET brique=brique+${demo_brique} WHERE id_joueur='${interaction.member.id}';
                                UPDATE pays SET metaux=metaux+${demo_metaux} WHERE id_joueur='${interaction.member.id}'`;
                            connection.query(sql, async(err, results) => {
                                if (err) {
                                    throw err;
                                }
                            })

                            var newbc = results[0].usine_civile - parseInt(nombre);

                            var embed = {
                                author: {
                                    name: `${results[0].rang} de ${results[0].nom}`,
                                    icon_url: interaction.member.displayAvatarURL()
                                },
                                thumbnail: {
                                    url: `${results[0].drapeau}`
                                },
                                title: `\`Démolition : ${nombre} usines civile\``,
                                description: `> 🛠️ Vous avez désormais : 🛠️\n` +
                                    `${newbc} usines civile`,
                                color: interaction.member.displayHexColor,
                                timestamp: new Date(),
                                footer: {
                                    text: `${results[0].devise}`
                                },
                            }

                            interaction.deferUpdate()

                            interaction.message.edit({ embeds: [embed], components: [] })

                        }
                    })

                } else {
                    var reponse = codeBlock('diff', `- Vous n'êtes pas l'auteur de cette commande`);
                    interaction.reply({ content: reponse, ephemeral: true });
                }
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

                        if (random == true) {

                            var territoire = chance.integer({ min: 2500, max: 5000 });
                            var pop = chance.integer({ min: process.env.EXP_MIN_POP, max: process.env.EXP_MAX_POP });

                            var sql = `
                            UPDATE pays SET T_total=T_total+${territoire} WHERE id_joueur=${interaction.user.id};
                            UPDATE pays SET T_libre=T_libre+${territoire} WHERE id_joueur=${interaction.user.id};
                            UPDATE pays SET population=population+${pop} WHERE id_joueur=${interaction.user.id};
                            UPDATE pays SET action_diplo=action_diplo-10 WHERE id_joueur=${interaction.user.id};
                            UPDATE pays SET reputation=reputation+0.5 WHERE id_joueur=${interaction.user.id}`;
                            connection.query(sql, async(err, results) => {
                                if (err) {
                                    throw err;
                                }
                            })

                            if ((results[0].T_total + territoire) > (results[0].hexagone * 15000)) {
                                var sql = `
                                UPDATE pays SET hexagone=hexagone+1 WHERE id_joueur=${interaction.user.id}`;
                                connection.query(sql, async(err, results) => {
                                    if (err) {
                                        throw err;
                                    }
                                })

                                var annonce = {
                                    author: {
                                        name: `${results[0].rang} de ${results[0].nom}`,
                                        icon_url: interaction.member.displayAvatarURL()
                                    },
                                    thumbnail: {
                                        url: results[0].drapeau,
                                    },
                                    title: `\`Le/la ${results[0].gouv_forme} a désormais une influence sur une nouvelle case !\``,
                                    description: `> Direction : ${results[0].direction}`,
                                    timestamp: new Date(),
                                    color: interaction.member.displayHexColor
                                };

                                const salon_carte = interaction.client.channels.cache.get(process.env.SALON_CARTE);

                                salon_carte.send({ embeds: [annonce] });
                                var reponse = `__**Vous vous êtes étendu sur une nouvelle case : ${salon_carte}**__`;
                            }

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
                            setTimeout(() => {
                                interaction.deleteReply()
                            }, 5000)

                        } else {

                            var sql3 = `
                            UPDATE pays SET action_diplo=action_diplo-10 WHERE id_joueur=${interaction.user.id};
                            UPDATE pays SET reputation=reputation+0.2 WHERE id_joueur=${interaction.user.id}`;
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

                            interaction.reply({ embeds: [embed] });
                            setTimeout(() => {
                                interaction.deleteReply()
                            }, 5000)
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
            } else if (interaction.customId.includes('qvendre') == true) {

                var id_joueur = interaction.customId.slice(8);
                if (id_joueur == interaction.member.id) {

                    var fields = interaction.message.embeds[0].fields
                    var espace = fields[0].value.indexOf("Prix");
                    var ressource = fields[0].value.slice(0, espace - 1)

                    var espace2 = fields[2].value.indexOf("Au");
                    var prix_u = fields[2].value.slice(33, espace2 - 1);
                    var prix = (prix_u * interaction.message.embeds[0].fields[1].value);

                    var sql5 = `
                    SELECT * FROM pays WHERE id_joueur='${id_joueur}'`;

                    connection.query(sql5, async(err, results) => {
                        if (err) {
                            throw err;
                        }

                        switch (ressource) {
                            case 'Biens de consommation':

                                var embed = {
                                    author: {
                                        name: `${results[0].rang} de ${results[0].nom}`,
                                        icon_url: interaction.member.displayAvatarURL()
                                    },
                                    thumbnail: {
                                        url: results[0].drapeau
                                    },
                                    title: `\`Vous avez vendus au marché international :\``,
                                    fields: interaction.message.embeds[0].fields,
                                    color: interaction.member.displayHexColor,
                                    timestamp: new Date(),
                                    footer: {
                                        text: `${results[0].devise}`
                                    },
                                };

                                await interaction.deferUpdate()
                                interaction.message.edit({ embeds: [embed], components: [] });

                                var sql5 = `
                                INSERT INTO qm SET id_joueur="${interaction.user.id}", id_salon="${interaction.channelId}", ressource="${ressource}", quantite='${interaction.message.embeds[0].fields[1].value}', prix='${prix.toFixed(0)}', prix_u='${prix_u}';
                                UPDATE pays SET cash=cash+${prix.toFixed(0)} WHERE id_joueur="${id_joueur}";
                                UPDATE pays SET bc=bc-${interaction.message.embeds[0].fields[1].value} WHERE id_joueur="${id_joueur}"`;

                                connection.query(sql5, async(err, results) => {
                                    if (err) {
                                        throw err;
                                    }
                                })
                                break;

                            case 'Bois':

                                var embed = {
                                    author: {
                                        name: `${results[0].rang} de ${results[0].nom}`,
                                        icon_url: interaction.member.displayAvatarURL()
                                    },
                                    thumbnail: {
                                        url: results[0].drapeau
                                    },
                                    title: `\`Vous avez vendus au marché international :\``,
                                    fields: interaction.message.embeds[0].fields,
                                    color: interaction.member.displayHexColor,
                                    timestamp: new Date(),
                                    footer: {
                                        text: `${results[0].devise}`
                                    },
                                };

                                await interaction.deferUpdate()
                                interaction.message.edit({ embeds: [embed], components: [] });

                                var sql5 = `
                                INSERT INTO qm SET id_joueur="${interaction.user.id}", id_salon="${interaction.channelId}", ressource="${ressource}", quantite='${interaction.message.embeds[0].fields[1].value}', prix='${prix.toFixed(0)}', prix_u='${prix_u}';
                                UPDATE pays SET cash=cash+${prix.toFixed(0)} WHERE id_joueur="${id_joueur}";
                                UPDATE pays SET bois=bois-${interaction.message.embeds[0].fields[1].value} WHERE id_joueur="${id_joueur}"`;

                                connection.query(sql5, async(err, results) => {
                                    if (err) {
                                        throw err;
                                    }
                                })
                                break;

                            case 'Brique':

                                var embed = {
                                    author: {
                                        name: `${results[0].rang} de ${results[0].nom}`,
                                        icon_url: interaction.member.displayAvatarURL()
                                    },
                                    thumbnail: {
                                        url: results[0].drapeau
                                    },
                                    title: `\`Vous avez vendus au marché international :\``,
                                    fields: interaction.message.embeds[0].fields,
                                    color: interaction.member.displayHexColor,
                                    timestamp: new Date(),
                                    footer: {
                                        text: `${results[0].devise}`
                                    },
                                };

                                await interaction.deferUpdate()
                                interaction.message.edit({ embeds: [embed], components: [] });

                                var sql5 = `
                                INSERT INTO qm SET id_joueur="${interaction.user.id}", id_salon="${interaction.channelId}", ressource="${ressource}", quantite='${interaction.message.embeds[0].fields[1].value}', prix='${prix.toFixed(0)}', prix_u='${prix_u}';
                                UPDATE pays SET cash=cash+${prix.toFixed(0)} WHERE id_joueur="${id_joueur}";
                                UPDATE pays SET brique=brique-${interaction.message.embeds[0].fields[1].value} WHERE id_joueur="${id_joueur}"`;

                                connection.query(sql5, async(err, results) => {
                                    if (err) {
                                        throw err;
                                    }
                                })
                                break;

                            case 'Eau':

                                var embed = {
                                    author: {
                                        name: `${results[0].rang} de ${results[0].nom}`,
                                        icon_url: interaction.member.displayAvatarURL()
                                    },
                                    thumbnail: {
                                        url: results[0].drapeau
                                    },
                                    title: `\`Vous avez vendus au marché international :\``,
                                    fields: interaction.message.embeds[0].fields,
                                    color: interaction.member.displayHexColor,
                                    timestamp: new Date(),
                                    footer: {
                                        text: `${results[0].devise}`
                                    },
                                };

                                await interaction.deferUpdate()
                                interaction.message.edit({ embeds: [embed], components: [] });

                                var sql5 = `
                                INSERT INTO qm SET id_joueur="${interaction.user.id}", id_salon="${interaction.channelId}", ressource="${ressource}", quantite='${interaction.message.embeds[0].fields[1].value}', prix='${prix.toFixed(0)}', prix_u='${prix_u}';
                                UPDATE pays SET cash=cash+${prix.toFixed(0)} WHERE id_joueur="${id_joueur}";
                                UPDATE pays SET eau=eau-${interaction.message.embeds[0].fields[1].value} WHERE id_joueur="${id_joueur}"`;

                                connection.query(sql5, async(err, results) => {
                                    if (err) {
                                        throw err;
                                    }
                                })
                                break;

                            case 'Metaux':

                                var embed = {
                                    author: {
                                        name: `${results[0].rang} de ${results[0].nom}`,
                                        icon_url: interaction.member.displayAvatarURL()
                                    },
                                    thumbnail: {
                                        url: results[0].drapeau
                                    },
                                    title: `\`Vous avez vendus au marché international :\``,
                                    fields: interaction.message.embeds[0].fields,
                                    color: interaction.member.displayHexColor,
                                    timestamp: new Date(),
                                    footer: {
                                        text: `${results[0].devise}`
                                    },
                                };

                                await interaction.deferUpdate()
                                interaction.message.edit({ embeds: [embed], components: [] });

                                var sql5 = `
                                INSERT INTO qm SET id_joueur="${interaction.user.id}", id_salon="${interaction.channelId}", ressource="${ressource}", quantite='${interaction.message.embeds[0].fields[1].value}', prix='${prix.toFixed(0)}', prix_u='${prix_u}';
                                UPDATE pays SET cash=cash+${prix.toFixed(0)} WHERE id_joueur="${id_joueur}";
                                UPDATE pays SET metaux=metaux-${interaction.message.embeds[0].fields[1].value} WHERE id_joueur="${id_joueur}"`;

                                connection.query(sql5, async(err, results) => {
                                    if (err) {
                                        throw err;
                                    }
                                })
                                break;

                            case 'Nourriture':

                                var embed = {
                                    author: {
                                        name: `${results[0].rang} de ${results[0].nom}`,
                                        icon_url: interaction.member.displayAvatarURL()
                                    },
                                    thumbnail: {
                                        url: results[0].drapeau
                                    },
                                    title: `\`Vous avez vendus au marché international :\``,
                                    fields: interaction.message.embeds[0].fields,
                                    color: interaction.member.displayHexColor,
                                    timestamp: new Date(),
                                    footer: {
                                        text: `${results[0].devise}`
                                    },
                                };

                                await interaction.deferUpdate()
                                interaction.message.edit({ embeds: [embed], components: [] });

                                var sql5 = `
                                INSERT INTO qm SET id_joueur="${interaction.user.id}", id_salon="${interaction.channelId}", ressource="${ressource}", quantite='${interaction.message.embeds[0].fields[1].value}', prix='${prix.toFixed(0)}', prix_u='${prix_u}';
                                UPDATE pays SET cash=cash+${prix.toFixed(0)} WHERE id_joueur="${id_joueur}";
                                UPDATE pays SET nourriture=nourriture-${interaction.message.embeds[0].fields[1].value} WHERE id_joueur="${id_joueur}"`;

                                connection.query(sql5, async(err, results) => {
                                    if (err) {
                                        throw err;
                                    }
                                })
                                break;

                            case 'Petrole':

                                var embed = {
                                    author: {
                                        name: `${results[0].rang} de ${results[0].nom}`,
                                        icon_url: interaction.member.displayAvatarURL()
                                    },
                                    thumbnail: {
                                        url: results[0].drapeau
                                    },
                                    title: `\`Vous avez vendus au marché international :\``,
                                    fields: interaction.message.embeds[0].fields,
                                    color: interaction.member.displayHexColor,
                                    timestamp: new Date(),
                                    footer: {
                                        text: `${results[0].devise}`
                                    },
                                };

                                await interaction.deferUpdate()
                                interaction.message.edit({ embeds: [embed], components: [] });

                                var sql5 = `
                                INSERT INTO qm SET id_joueur="${interaction.user.id}", id_salon="${interaction.channelId}", ressource="${ressource}", quantite='${interaction.message.embeds[0].fields[1].value}', prix='${prix.toFixed(0)}', prix_u='${prix_u}';
                                UPDATE pays SET cash=cash+${prix.toFixed(0)} WHERE id_joueur="${id_joueur}";
                                UPDATE pays SET petrole=petrole-${interaction.message.embeds[0].fields[1].value} WHERE id_joueur="${id_joueur}"`;

                                connection.query(sql5, async(err, results) => {
                                    if (err) {
                                        throw err;
                                    }
                                })
                                break;
                        }
                    });

                } else {
                    var reponse = codeBlock('diff', `- Vous n'êtes pas l'auteur de cette commande`);
                    interaction.reply({ content: reponse, ephemeral: true });
                }
            } else if (interaction.customId.includes('qachat') == true) {

                var id_joueur = interaction.customId.slice(7);
                if (id_joueur == interaction.member.id) {

                    var fields = interaction.message.embeds[0].fields
                    var espace = fields[0].value.indexOf("Prix");
                    var ressource = fields[0].value.slice(0, espace - 1)

                    var espace2 = fields[2].value.indexOf("Au");
                    var prix_u = fields[2].value.slice(33, espace2 - 1);
                    var prix = (prix_u * interaction.message.embeds[0].fields[1].value);

                    var sql5 = `
                    SELECT * FROM pays WHERE id_joueur='${id_joueur}'`;

                    connection.query(sql5, async(err, results) => {
                        if (err) {
                            throw err;
                        }

                        switch (ressource) {
                            case 'Biens de consommation':

                                if (prix.toFixed(0) > results[0].cash) {
                                    var reponse = codeBlock('diff', `- Vous n'avez pas assez d\'argent : ${results[0].cash}/${prix.toFixed(0)}`);
                                    await interaction.reply({ content: reponse, ephemeral: true });
                                } else {

                                    var sql5 = `
                                    INSERT INTO qm SET id_joueur="${interaction.user.id}", id_salon="${interaction.channelId}", ressource="${ressource}", quantite='${interaction.message.embeds[0].fields[1].value}', prix='${prix.toFixed(0)}', prix_u='${prix_u}';
                                    UPDATE pays SET cash=cash-${prix.toFixed(0)} WHERE id_joueur="${id_joueur}";
                                    UPDATE pays SET bc=bc+${interaction.message.embeds[0].fields[1].value} WHERE id_joueur="${id_joueur}"`;

                                    connection.query(sql5, async(err, results) => {
                                        if (err) {
                                            throw err;
                                        }
                                    })

                                    var embed = {
                                        author: {
                                            name: `${results[0].rang} de ${results[0].nom}`,
                                            icon_url: interaction.member.displayAvatarURL()
                                        },
                                        thumbnail: {
                                            url: results[0].drapeau
                                        },
                                        title: `\`Vous avez acheter au marché international :\``,
                                        fields: interaction.message.embeds[0].fields,
                                        color: interaction.member.displayHexColor,
                                        timestamp: new Date(),
                                        footer: {
                                            text: `${results[0].devise}`
                                        },
                                    };

                                    await interaction.deferUpdate()
                                    interaction.message.edit({ embeds: [embed], components: [] });
                                }
                                break;

                            case 'Bois':

                                var embed = {
                                    author: {
                                        name: `${results[0].rang} de ${results[0].nom}`,
                                        icon_url: interaction.member.displayAvatarURL()
                                    },
                                    thumbnail: {
                                        url: results[0].drapeau
                                    },
                                    title: `\`Vous avez vendus au marché international :\``,
                                    fields: interaction.message.embeds[0].fields,
                                    color: interaction.member.displayHexColor,
                                    timestamp: new Date(),
                                    footer: {
                                        text: `${results[0].devise}`
                                    },
                                };

                                await interaction.deferUpdate()
                                interaction.message.edit({ embeds: [embed], components: [] });

                                var sql5 = `
                                INSERT INTO qm SET id_joueur="${interaction.user.id}", id_salon="${interaction.channelId}", ressource="${ressource}", quantite='${interaction.message.embeds[0].fields[1].value}', prix='${prix.toFixed(0)}', prix_u='${prix_u}';
                                UPDATE pays SET cash=cash-${prix.toFixed(0)} WHERE id_joueur="${id_joueur}";
                                UPDATE pays SET bois=bois+${interaction.message.embeds[0].fields[1].value} WHERE id_joueur="${id_joueur}"`;

                                connection.query(sql5, async(err, results) => {
                                    if (err) {
                                        throw err;
                                    }
                                })
                                break;

                            case 'Brique':

                                var embed = {
                                    author: {
                                        name: `${results[0].rang} de ${results[0].nom}`,
                                        icon_url: interaction.member.displayAvatarURL()
                                    },
                                    thumbnail: {
                                        url: results[0].drapeau
                                    },
                                    title: `\`Vous avez vendus au marché international :\``,
                                    fields: interaction.message.embeds[0].fields,
                                    color: interaction.member.displayHexColor,
                                    timestamp: new Date(),
                                    footer: {
                                        text: `${results[0].devise}`
                                    },
                                };

                                await interaction.deferUpdate()
                                interaction.message.edit({ embeds: [embed], components: [] });

                                var sql5 = `
                                INSERT INTO qm SET id_joueur="${interaction.user.id}", id_salon="${interaction.channelId}", ressource="${ressource}", quantite='${interaction.message.embeds[0].fields[1].value}', prix='${prix.toFixed(0)}', prix_u='${prix_u}';
                                UPDATE pays SET cash=cash-${prix.toFixed(0)} WHERE id_joueur="${id_joueur}";
                                UPDATE pays SET brique=brique+${interaction.message.embeds[0].fields[1].value} WHERE id_joueur="${id_joueur}"`;

                                connection.query(sql5, async(err, results) => {
                                    if (err) {
                                        throw err;
                                    }
                                })
                                break;

                            case 'Eau':

                                var embed = {
                                    author: {
                                        name: `${results[0].rang} de ${results[0].nom}`,
                                        icon_url: interaction.member.displayAvatarURL()
                                    },
                                    thumbnail: {
                                        url: results[0].drapeau
                                    },
                                    title: `\`Vous avez vendus au marché international :\``,
                                    fields: interaction.message.embeds[0].fields,
                                    color: interaction.member.displayHexColor,
                                    timestamp: new Date(),
                                    footer: {
                                        text: `${results[0].devise}`
                                    },
                                };

                                await interaction.deferUpdate()
                                interaction.message.edit({ embeds: [embed], components: [] });

                                var sql5 = `
                                INSERT INTO qm SET id_joueur="${interaction.user.id}", id_salon="${interaction.channelId}", ressource="${ressource}", quantite='${interaction.message.embeds[0].fields[1].value}', prix='${prix.toFixed(0)}', prix_u='${prix_u}';
                                UPDATE pays SET cash=cash-${prix.toFixed(0)} WHERE id_joueur="${id_joueur}";
                                UPDATE pays SET eau=eau+${interaction.message.embeds[0].fields[1].value} WHERE id_joueur="${id_joueur}"`;

                                connection.query(sql5, async(err, results) => {
                                    if (err) {
                                        throw err;
                                    }
                                })
                                break;

                            case 'Metaux':

                                var embed = {
                                    author: {
                                        name: `${results[0].rang} de ${results[0].nom}`,
                                        icon_url: interaction.member.displayAvatarURL()
                                    },
                                    thumbnail: {
                                        url: results[0].drapeau
                                    },
                                    title: `\`Vous avez vendus au marché international :\``,
                                    fields: interaction.message.embeds[0].fields,
                                    color: interaction.member.displayHexColor,
                                    timestamp: new Date(),
                                    footer: {
                                        text: `${results[0].devise}`
                                    },
                                };

                                await interaction.deferUpdate()
                                interaction.message.edit({ embeds: [embed], components: [] });

                                var sql5 = `
                                INSERT INTO qm SET id_joueur="${interaction.user.id}", id_salon="${interaction.channelId}", ressource="${ressource}", quantite='${interaction.message.embeds[0].fields[1].value}', prix='${prix.toFixed(0)}', prix_u='${prix_u}';
                                UPDATE pays SET cash=cash-${prix.toFixed(0)} WHERE id_joueur="${id_joueur}";
                                UPDATE pays SET metaux=metaux+${interaction.message.embeds[0].fields[1].value} WHERE id_joueur="${id_joueur}"`;

                                connection.query(sql5, async(err, results) => {
                                    if (err) {
                                        throw err;
                                    }
                                })
                                break;

                            case 'Nourriture':

                                var embed = {
                                    author: {
                                        name: `${results[0].rang} de ${results[0].nom}`,
                                        icon_url: interaction.member.displayAvatarURL()
                                    },
                                    thumbnail: {
                                        url: results[0].drapeau
                                    },
                                    title: `\`Vous avez vendus au marché international :\``,
                                    fields: interaction.message.embeds[0].fields,
                                    color: interaction.member.displayHexColor,
                                    timestamp: new Date(),
                                    footer: {
                                        text: `${results[0].devise}`
                                    },
                                };

                                await interaction.deferUpdate()
                                interaction.message.edit({ embeds: [embed], components: [] });

                                var sql5 = `
                                INSERT INTO qm SET id_joueur="${interaction.user.id}", id_salon="${interaction.channelId}", ressource="${ressource}", quantite='${interaction.message.embeds[0].fields[1].value}', prix='${prix.toFixed(0)}', prix_u='${prix_u}';
                                UPDATE pays SET cash=cash-${prix.toFixed(0)} WHERE id_joueur="${id_joueur}";
                                UPDATE pays SET nourriture=nourriture+${interaction.message.embeds[0].fields[1].value} WHERE id_joueur="${id_joueur}"`;

                                connection.query(sql5, async(err, results) => {
                                    if (err) {
                                        throw err;
                                    }
                                })
                                break;

                            case 'Petrole':

                                var embed = {
                                    author: {
                                        name: `${results[0].rang} de ${results[0].nom}`,
                                        icon_url: interaction.member.displayAvatarURL()
                                    },
                                    thumbnail: {
                                        url: results[0].drapeau
                                    },
                                    title: `\`Vous avez vendus au marché international :\``,
                                    fields: interaction.message.embeds[0].fields,
                                    color: interaction.member.displayHexColor,
                                    timestamp: new Date(),
                                    footer: {
                                        text: `${results[0].devise}`
                                    },
                                };

                                await interaction.deferUpdate()
                                interaction.message.edit({ embeds: [embed], components: [] });

                                var sql5 = `
                                INSERT INTO qm SET id_joueur="${interaction.user.id}", id_salon="${interaction.channelId}", ressource="${ressource}", quantite='${interaction.message.embeds[0].fields[1].value}', prix='${prix.toFixed(0)}', prix_u='${prix_u}';
                                UPDATE pays SET cash=cash-${prix.toFixed(0)} WHERE id_joueur="${id_joueur}";
                                UPDATE pays SET petrole=petrole+${interaction.message.embeds[0].fields[1].value} WHERE id_joueur="${id_joueur}"`;

                                connection.query(sql5, async(err, results) => {
                                    if (err) {
                                        throw err;
                                    }
                                })
                                break;
                        }
                    });

                } else {
                    var reponse = codeBlock('diff', `- Vous n'êtes pas l'auteur de cette commande`);
                    interaction.reply({ content: reponse, ephemeral: true });
                }
            } else if (interaction.customId.includes('refuser') == true) {

                var id_joueur = interaction.customId.slice(8);
                if (id_joueur == interaction.member.id) {
                    interaction.message.delete()
                } else {
                    var reponse = codeBlock('diff', `- Vous n'êtes pas l'auteur de cette commande`);
                    interaction.reply({ content: reponse, ephemeral: true });
                }
            }

        } else if (interaction.isSelectMenu()) {

            console.log(`${interaction.user.tag} a utilisé un menu dans #${interaction.channel.name}.`);

            if (interaction.customId == 'usine') {

                var sql = `
                    SELECT * FROM pays WHERE id_joueur=${interaction.member.id}`;

                connection.query(sql, async(err, results) => {
                    if (err) {
                        throw err;
                    }

                    if (interaction.values == 'briqueterie') {


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
                    } else if (interaction.values == 'champ') {

                        prod_T_champ = process.env.PROD_CHAMP * results[0].champ;
                        conso_T_champ_eau = process.env.CONSO_CHAMP_EAU * results[0].champ;

                        const embed = {
                            author: {
                                name: `${results[0].rang} de ${results[0].nom}`,
                                icon_url: interaction.member.displayAvatarURL()
                            },
                            thumbnail: {
                                url: `${results[0].drapeau}`,
                            },
                            title: `\`Usine : Champ\``,
                            fields: [{
                                    name: `> Consommation :`,
                                    value: `- Par usine : \n` +
                                        `Eau : ${process.env.CONSO_CHAMP_EAU}\n` +
                                        `\u200B`,
                                    inline: true
                                },
                                {
                                    name: `\u200B`,
                                    value: `- Totale : \n` +
                                        `Eau : ${conso_T_champ_eau}`,
                                    inline: true
                                },
                                {
                                    name: `> Production :`,
                                    value: `Ressource : Nourriture\n` +
                                        `Par usine  ${process.env.PROD_CHAMP}\n` +
                                        `Totale : ${prod_T_champ}` +
                                        `\u200B`
                                },
                                {
                                    name: `> En réserve :`,
                                    value: `${results[0].nourriture}`
                                },
                            ],
                            color: interaction.member.displayHexColor,
                            timestamp: new Date(),
                            footer: { text: `${results[0].devise}` }
                        };

                        interaction.reply({ embeds: [embed] })

                    } else if (interaction.values == 'mine') {

                        prod_T_mine = process.env.PROD_MINE * results[0].mine;
                        conso_T_mine_bois = process.env.CONSO_MINE_BOIS * results[0].mine;
                        conso_T_mine_petrole = process.env.CONSO_MINE_PETROLE * results[0].mine;

                        const embed = {
                            author: {
                                name: `${results[0].rang} de ${results[0].nom}`,
                                icon_url: interaction.member.displayAvatarURL()
                            },
                            thumbnail: {
                                url: `${results[0].drapeau}`,
                            },
                            title: `\`Usine : Mine\``,
                            fields: [{
                                    name: `> Consommation :`,
                                    value: `- Par usine : \n` +
                                        `Bois : ${process.env.CONSO_MINE_BOIS}\n` +
                                        `Pétrole : ${process.env.CONSO_MINE_PETROLE}\n` +
                                        `\u200B`,
                                    inline: true
                                },
                                {
                                    name: `\u200B`,
                                    value: `- Totale : \n` +
                                        `Bois : ${conso_T_mine_bois}\n` +
                                        `Pétrole : ${conso_T_mine_petrole}`,
                                    inline: true
                                },
                                {
                                    name: `> Production :`,
                                    value: `Ressource : Métaux\n` +
                                        `Par usine  ${process.env.PROD_MINE}\n` +
                                        `Totale : ${prod_T_mine}` +
                                        `\u200B`
                                },
                                {
                                    name: `> En réserve :`,
                                    value: `${results[0].metaux}`
                                },
                            ],
                            color: interaction.member.displayHexColor,
                            timestamp: new Date(),
                            footer: { text: `${results[0].devise}` }
                        };

                        interaction.reply({ embeds: [embed] })
                    } else if (interaction.values == 'pompe_a_eau') {

                        prod_T_pompe_a_eau = process.env.PROD_POMPE_A_EAU * results[0].pompe_a_eau;
                        conso_T_pompe_a_eau_petrole = process.env.CONSO_POMPE_A_EAU_PETROLE * results[0].pompe_a_eau;

                        const embed = {
                            author: {
                                name: `${results[0].rang} de ${results[0].nom}`,
                                icon_url: interaction.member.displayAvatarURL()
                            },
                            thumbnail: {
                                url: `${results[0].drapeau}`,
                            },
                            title: `\`Usine : Pompe à eau\``,
                            fields: [{
                                    name: `> Consommation :`,
                                    value: `- Par usine : \n` +
                                        `Pétrole : ${process.env.CONSO_POMPE_A_EAU_PETROLE}\n` +
                                        `\u200B`,
                                    inline: true
                                },
                                {
                                    name: `\u200B`,
                                    value: `- Totale : \n` +
                                        `Pétrole : ${conso_T_pompe_a_eau_petrole}`,
                                    inline: true
                                },
                                {
                                    name: `> Production :`,
                                    value: `Ressource : Eau\n` +
                                        `Par usine  ${process.env.PROD_POMPE_A_EAU}\n` +
                                        `Totale : ${prod_T_pompe_a_eau}` +
                                        `\u200B`
                                },
                                {
                                    name: `> En réserve :`,
                                    value: `${results[0].eau}`
                                },
                            ],
                            color: interaction.member.displayHexColor,
                            timestamp: new Date(),
                            footer: { text: `${results[0].devise}` }
                        };

                        interaction.reply({ embeds: [embed] })
                    } else if (interaction.values == 'pumpjack') {
                        prod_T_pumpjack = process.env.PROD_PUMPJACK * results[0].pumpjack;

                        prod_T_mine = process.env.PROD_MINE * results[0].mine;
                        conso_T_mine_bois = process.env.CONSO_MINE_BOIS * results[0].mine;
                        conso_T_mine_petrole = process.env.CONSO_MINE_PETROLE * results[0].mine;

                        const embed = {
                            author: {
                                name: `${results[0].rang} de ${results[0].nom}`,
                                icon_url: interaction.member.displayAvatarURL()
                            },
                            thumbnail: {
                                url: `${results[0].drapeau}`,
                            },
                            title: `\`Usine : Pumpjack\``,
                            fields: [{
                                    name: `> Consommation :`,
                                    value: `- Par usine : \n` +
                                        `\u200B`,
                                    inline: true
                                },
                                {
                                    name: `\u200B`,
                                    value: `- Totale : \n`,
                                    inline: true
                                },
                                {
                                    name: `> Production :`,
                                    value: `Ressource : Pétrole\n` +
                                        `Par usine  ${process.env.PROD_PUMPJACK}\n` +
                                        `Totale : ${prod_T_pumpjack}` +
                                        `\u200B`
                                },
                                {
                                    name: `> En réserve :`,
                                    value: `${results[0].petrole}`
                                },
                            ],
                            color: interaction.member.displayHexColor,
                            timestamp: new Date(),
                            footer: { text: `${results[0].devise}` }
                        };

                        interaction.reply({ embeds: [embed] })
                    } else if (interaction.values == 'scierie') {

                        prod_T_scierie = process.env.PROD_SCIERIE * results[0].scierie;
                        conso_T_scierie_petrole = process.env.CONSO_SCIERIE_PETROLE * results[0].scierie;

                        const embed = {
                            author: {
                                name: `${results[0].rang} de ${results[0].nom}`,
                                icon_url: interaction.member.displayAvatarURL()
                            },
                            thumbnail: {
                                url: `${results[0].drapeau}`,
                            },
                            title: `\`Usine : Scierie\``,
                            fields: [{
                                    name: `> Consommation :`,
                                    value: `- Par usine : \n` +
                                        `Pétrole : ${process.env.CONSO_SCIERIE_PETROLE}\n` +
                                        `\u200B`,
                                    inline: true
                                },
                                {
                                    name: `\u200B`,
                                    value: `- Totale : \n` +
                                        `Pétrole : ${conso_T_scierie_petrole}`,
                                    inline: true
                                },
                                {
                                    name: `> Production :`,
                                    value: `Ressource : Bois\n` +
                                        `Par usine  ${process.env.PROD_SCIERIE}\n` +
                                        `Totale : ${prod_T_scierie}` +
                                        `\u200B`
                                },
                                {
                                    name: `> En réserve :`,
                                    value: `${results[0].bois}`
                                },
                            ],
                            color: interaction.member.displayHexColor,
                            timestamp: new Date(),
                            footer: { text: `${results[0].devise}` }
                        };

                        interaction.reply({ embeds: [embed] })
                    } else if (interaction.values == 'usine_civile') {

                        prod_T_usine_civile = process.env.PROD_USINE_CIVILE * results[0].usine_civile;
                        conso_T_usine_civile_bois = process.env.CONSO_USINE_CIVILE_BOIS * results[0].usine_civile;
                        conso_T_usine_civile_metaux = process.env.CONSO_USINE_CIVILE_METAUX * results[0].usine_civile;
                        conso_T_usine_civile_petrole = process.env.CONSO_USINE_CIVILE_PETROLE * results[0].usine_civile;

                        const embed = {
                            author: {
                                name: `${results[0].rang} de ${results[0].nom}`,
                                icon_url: interaction.member.displayAvatarURL()
                            },
                            thumbnail: {
                                url: `${results[0].drapeau}`,
                            },
                            title: `\`Usine : Usine civile\``,
                            fields: [{
                                    name: `> Consommation :`,
                                    value: `- Par usine : \n` +
                                        `Bois : ${process.env.CONSO_USINE_CIVILE_BOIS}\n` +
                                        `Métaux : ${process.env.CONSO_USINE_CIVILE_METAUX}\n` +
                                        `Pétrole : ${process.env.CONSO_USINE_CIVILE_PETROLE}\n` +
                                        `\u200B`,
                                    inline: true
                                },
                                {
                                    name: `\u200B`,
                                    value: `- Totale : \n` +
                                        `Bois : ${conso_T_usine_civile_bois}\n` +
                                        `Métaux : ${conso_T_usine_civile_metaux}\n` +
                                        `Pétrole : ${conso_T_usine_civile_petrole}`,
                                    inline: true
                                },
                                {
                                    name: `> Production :`,
                                    value: `Ressource : Biens de cosommation\n` +
                                        `Par usine  ${process.env.PROD_USINE_CIVILE}\n` +
                                        `Totale : ${prod_T_usine_civile}` +
                                        `\u200B`
                                },
                                {
                                    name: `> En réserve :`,
                                    value: `${results[0].bc}`
                                },
                            ],
                            color: interaction.member.displayHexColor,
                            timestamp: new Date(),
                            footer: { text: `${results[0].devise}` }
                        };

                        interaction.reply({ embeds: [embed] })
                    }
                })
            }; //FIN DU CODE POUR LES MENUS
        };
    }
}
