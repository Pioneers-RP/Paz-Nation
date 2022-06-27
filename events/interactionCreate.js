const { codeBlock } = require('@discordjs/builders');
const { Client, Collection, Intents, Guild, MessageActionRow, MessageButton } = require('discord.js');
const { connection } = require('../index.js');
const { globalBox } = require('global-box');
const box = globalBox();
const dotenv = require('dotenv');
const { readFileSync } = require('fs');
var Chance = require('chance');
var chance = new Chance();
const wait = require('node:timers/promises').setTimeout;
const ms = require('ms');
const { CommandCooldown, msToMinutes } = require('discord-command-cooldown');
const vendreCommandCooldown = new CommandCooldown('vendre', ms('10m'));

module.exports = {
    name: 'interactionCreate',
    execute(interaction) {

        if (interaction.isCommand()) {

            var log = {
                author: {
                    name: interaction.member.displayName,
                    icon_url: interaction.member.displayAvatarURL()
                },
                title: `\`Commande\``,
                description: `/${interaction.commandName} ${JSON.stringify(interaction.options.data)}`,
                timestamp: new Date(),
                footer: {
                    text: '#' + interaction.channel.name
                },
            };

            const salon_logs = interaction.client.channels.cache.get(process.env.SALON_LOGS);
            salon_logs.send({ embeds: [log] });

        } else if (interaction.isButton()) {

            var log = {
                author: {
                    name: interaction.member.displayName,
                    icon_url: interaction.member.displayAvatarURL()
                },
                title: `\`Bouton\``,
                description: `${interaction.customId}`,
                timestamp: new Date(),
                footer: {
                    text: '#' + interaction.channel.name
                },
            };

            const salon_logs = interaction.client.channels.cache.get(process.env.SALON_LOGS);
            salon_logs.send({ embeds: [log] });

            //#region [Réglement]
            if (interaction.customId.includes('réglement') == true) {

                let roleInvité = interaction.guild.roles.cache.find(r => r.name === "👤 » Invité");
                interaction.member.roles.add(roleInvité);
                interaction.deferUpdate()

                //endregion

                //#region [Menu - Economie]    
            } else if (interaction.customId.includes('menu_économie') == true) {

                var joueur_id = interaction.customId.slice(14);
                const joueur = interaction.client.users.cache.find(user => user.id === joueur_id);

                function economie(joueur) {

                    var sql = `
                        SELECT * FROM pays WHERE id_joueur='${joueur_id}'`;

                    connection.query(sql, async(err, results) => {
                        if (err) {
                            throw err;
                        }

                        if (!results[0]) {
                            var reponse = codeBlock('diff', `- Cette personne ne joue pas.`);
                            await interaction.reply({ content: reponse, ephemeral: true });
                        } else {

                            const embed = {
                                author: {
                                    name: `${results[0].rang} de ${results[0].nom}`,
                                    icon_url: joueur.displayAvatarURL()
                                },
                                thumbnail: {
                                    url: results[0].drapeau
                                },
                                title: `\`Menu de l'économie\``,
                                fields: [{
                                        name: `> 💵 Argent :`,
                                        value: codeBlock(`• ${results[0].cash.toLocaleString('en-US')} $`) + `\u200B`
                                    },
                                    {
                                        name: `> 🏭 Nombre d'usine total :`,
                                        value: codeBlock(`• ${results[0].usine_total.toLocaleString('en-US')}`) + `\u200B`
                                    },
                                ],
                                color: joueur.displayHexColor,
                                timestamp: new Date(),
                                footer: {
                                    text: `${results[0].devise}`
                                },
                            };

                            await interaction.reply({ embeds: [embed] });
                        }
                    });
                };

                economie(joueur);
                //#endregion

                //#region [Menu - Population]
            } else if (interaction.customId.includes('menu_population') == true) {

                var joueur_id = interaction.customId.slice(16);
                const joueur = interaction.client.users.cache.find(user => user.id === joueur_id);

                function population(joueur) {
                    var sql = `
                        SELECT * FROM pays WHERE id_joueur='${joueur_id}'`;

                    connection.query(sql, async(err, results) => {
                        if (err) {
                            throw err;
                        }

                        if (!results[0]) {
                            var reponse = codeBlock('diff', `- Cette personne ne joue pas.`);
                            await interaction.reply({ content: reponse, ephemeral: true });
                        } else {
                            densité = results[0].population / results[0].T_total;
                            densité = densité.toFixed(0);

                            const embed = {
                                author: {
                                    name: `${results[0].rang} de ${results[0].nom}`,
                                    icon_url: joueur.displayAvatarURL()
                                },
                                thumbnail: {
                                    url: results[0].drapeau
                                },
                                title: `\`Vue globale de la population\``,
                                fields: [{
                                        name: `> 👪 Population`,
                                        value: codeBlock(`• ${results[0].population.toLocaleString('en-US')} habitants`) + `\u200B`
                                    },
                                    {
                                        name: `> Approvisionnement`,
                                        value: codeBlock(`• ${results[0].approvisionnement.toLocaleString('en-US')}`) + `\u200B`
                                    },
                                    {
                                        name: `> Densité`,
                                        value: codeBlock(`• ${densité.toLocaleString('en-US')} habitants/km²`) + `\u200B`
                                    }
                                ],
                                color: joueur.displayHexColor,
                                timestamp: new Date(),
                                footer: {
                                    text: `${results[0].devise}`
                                },
                            };

                            await interaction.reply({ embeds: [embed] });
                        }
                    });
                };

                population(joueur);
                //endregion

                //#region [Menu - Gouvernement]
            } else if (interaction.customId.includes('menu_gouvernement') == true) {

                var joueur_id = interaction.customId.slice(18);
                const joueur = interaction.client.users.cache.find(user => user.id === joueur_id);

                function gouvernement(joueur) {
                    var sql = `
                        SELECT * FROM pays WHERE id_joueur='${joueur_id}'`;

                    connection.query(sql, async(err, results) => {
                        if (err) {
                            throw err;
                        }

                        if (!results[0]) {
                            var reponse = codeBlock('diff', `- Cette personne ne joue pas.`);
                            await interaction.reply({ content: reponse, ephemeral: true });
                        } else {

                            const embed = {
                                author: {
                                    name: `${results[0].rang} de ${results[0].nom}`,
                                    icon_url: joueur.displayAvatarURL()
                                },
                                thumbnail: {
                                    url: results[0].drapeau
                                },
                                title: `\`Menu du gouvernement\``,
                                fields: [{
                                        name: `> 🪧 Nom de l'Etat : `,
                                        value: codeBlock(`• ${results[0].nom}`) + `\u200B`
                                    },
                                    {
                                        name: `> ®️ Rang : `,
                                        value: codeBlock(`• ${results[0].rang}`) + `\u200B`
                                    },
                                    {
                                        name: `> 🔱 Forme de gouvernement : `,
                                        value: codeBlock(`• ${results[0].regime}`) + `\u200B`
                                    },
                                    {
                                        name: `> 🧠 Idéologie : `,
                                        value: codeBlock(`• ${results[0].ideologie}`) + `\u200B`
                                    },
                                    {
                                        name: `> 📯 Devise : `,
                                        value: codeBlock(`• ${results[0].devise}`) + `\u200B`
                                    }
                                ],
                                color: joueur.displayHexColor,
                                timestamp: new Date(),
                                footer: {
                                    text: `${results[0].devise}`
                                },
                            };

                            await interaction.reply({ embeds: [embed] });
                        }
                    });
                };

                gouvernement(joueur);
                //endregion

                //#region [Menu - Marché rapide]
            } else if (interaction.customId === 'menu_QM') {

                var sql = `
                    SELECT * FROM pays WHERE id_joueur=${interaction.member.id}`;
                connection.query(sql, async(err, results) => {
                    if (err) {
                        throw err;
                    }
                    const jsonPrix = JSON.parse(readFileSync('data/prix.json', 'utf-8'));

                    const embed = {
                        author: {
                            name: `${results[0].rang} de ${results[0].nom}`,
                            icon_url: interaction.member.displayAvatarURL()
                        },
                        thumbnail: {
                            url: results[0].drapeau,
                        },
                        title: `Quick Market (QM) :`,
                        fields: [{
                            name: `> 💻 Biens de consommation : `,
                            value: codeBlock(`• Vente : ${(jsonPrix.bc * 0.7).toFixed(2)} | Prix moyen : ${jsonPrix.bc} | Achat : ${(jsonPrix.bc * 1.3).toFixed(2)}`) + `\u200B`
                        }, {
                            name: `> 🪵 Bois : `,
                            value: codeBlock(`• Vente : ${(jsonPrix.bois * 0.7).toFixed(2)} | Prix moyen : ${jsonPrix.bois} | Achat : ${(jsonPrix.bois * 1.3).toFixed(2)}`) + `\u200B`
                        }, {
                            name: `> 🧱 Brique : `,
                            value: codeBlock(`• Vente : ${(jsonPrix.brique * 0.7).toFixed(2)} | Prix moyen : ${jsonPrix.brique} | Achat : ${(jsonPrix.brique * 1.3).toFixed(2)}`) + `\u200B`
                        }, {
                            name: `> 💧 Eau : `,
                            value: codeBlock(`• Vente : ${(jsonPrix.eau * 0.7).toFixed(2)} | Prix moyen : ${jsonPrix.eau} | Achat : ${(jsonPrix.eau * 1.3).toFixed(2)}`) + `\u200B`
                        }, {
                            name: `> 🪨 Métaux : `,
                            value: codeBlock(`• Vente : ${(jsonPrix.metaux * 0.7).toFixed(2)} | Prix moyen : ${jsonPrix.metaux} | Achat : ${(jsonPrix.metaux * 1.3).toFixed(2)}`) + `\u200B`
                        }, {
                            name: `> 🌽 Nourriture : `,
                            value: codeBlock(`• Vente : ${(jsonPrix.nourriture * 0.7).toFixed(2)} | Prix moyen : ${jsonPrix.nourriture} | Achat : ${(jsonPrix.nourriture * 1.3).toFixed(2)}`) + `\u200B`
                        }, {
                            name: `> 🛢️ Pétrole : `,
                            value: codeBlock(`• Vente : ${(jsonPrix.petrole * 0.7).toFixed(2)} | Prix moyen : ${jsonPrix.petrole} | Achat : ${(jsonPrix.petrole * 1.3).toFixed(2)}`) + `\u200B`
                        }, ],
                        color: interaction.member.displayHexColor,
                    };

                    interaction.reply({ embeds: [embed] })
                });
                //endregion

                //region [Construction]
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

                        switch (batiment) {
                            case 'Briqueterie':

                                var const_T_libre = process.env.SURFACE_BRIQUETERIE * nombre;
                                var const_bois = process.env.CONST_BRIQUETERIE_BOIS * nombre;
                                var const_brique = process.env.CONST_BRIQUETERIE_BRIQUE * nombre;
                                var const_metaux = process.env.CONST_BRIQUETERIE_METAUX * nombre;

                                var sql = `
                                    UPDATE pays SET briqueterie=briqueterie+${nombre} WHERE id_joueur='${interaction.member.id}';
                                    UPDATE pays SET usine_total=usine_total+${nombre} WHERE id_joueur='${interaction.member.id}';
                                    UPDATE pays SET T_libre=T_libre-${const_T_libre} WHERE id_joueur='${interaction.member.id}';
                                    UPDATE pays SET T_occ=T_occ+${const_T_libre} WHERE id_joueur='${interaction.member.id}';
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
                                    title: `\`Construction : ${nombre.toLocaleString('en-US')} briqueteries\``,
                                    description: `> 🛠️ Vous avez désormais :\n` +
                                        codeBlock(`• ${newbc.toLocaleString('en-US')} briqueteries`) + `\u200B`,
                                    color: interaction.member.displayHexColor,
                                    timestamp: new Date(),
                                    footer: {
                                        text: `${results[0].devise}`
                                    },
                                }
                                break;

                            case 'Champ':

                                var const_T_libre = process.env.SURFACE_CHAMP * nombre;
                                var const_bois = process.env.CONST_CHAMP_BOIS * nombre;
                                var const_brique = process.env.CONST_CHAMP_BRIQUE * nombre;
                                var const_metaux = process.env.CONST_CHAMP_METAUX * nombre;

                                var sql = `
                                    UPDATE pays SET champ=champ+${nombre} WHERE id_joueur='${interaction.member.id}';
                                    UPDATE pays SET usine_total=usine_total+${nombre} WHERE id_joueur='${interaction.member.id}';
                                    UPDATE pays SET T_libre=T_libre-${const_T_libre} WHERE id_joueur='${interaction.member.id}';
                                    UPDATE pays SET T_occ=T_occ+${const_T_libre} WHERE id_joueur='${interaction.member.id}';
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
                                    title: `\`Construction : ${nombre.toLocaleString('en-US')} champs\``,
                                    description: `> 🛠️ Vous avez désormais :\n` +
                                        codeBlock(`• ${newbc.toLocaleString('en-US')} champs`) + `\u200B`,
                                    color: interaction.member.displayHexColor,
                                    timestamp: new Date(),
                                    footer: {
                                        text: `${results[0].devise}`
                                    },
                                }
                                break;

                            case 'Centrale électrique':

                                var const_T_libre = process.env.SURFACE_CENTRALE_ELEC * nombre;
                                var const_bois = process.env.CONST_CENTRALE_ELEC_BOIS * nombre;
                                var const_brique = process.env.CONST_CENTRALE_ELEC_BRIQUE * nombre;
                                var const_metaux = process.env.CONST_CENTRALE_ELEC_METAUX * nombre;

                                var sql = `
                                    UPDATE pays SET centrale_elec=centrale_elec+${nombre} WHERE id_joueur='${interaction.member.id}';
                                    UPDATE pays SET usine_total=usine_total+${nombre} WHERE id_joueur='${interaction.member.id}';
                                    UPDATE pays SET T_libre=T_libre-${const_T_libre} WHERE id_joueur='${interaction.member.id}';
                                    UPDATE pays SET T_occ=T_occ+${const_T_libre} WHERE id_joueur='${interaction.member.id}';
                                    UPDATE pays SET bois=bois-${const_bois} WHERE id_joueur='${interaction.member.id}';
                                    UPDATE pays SET brique=brique-${const_brique} WHERE id_joueur='${interaction.member.id}';
                                    UPDATE pays SET metaux=metaux-${const_metaux} WHERE id_joueur='${interaction.member.id}'`;
                                connection.query(sql, async(err, results) => {
                                    if (err) {
                                        throw err;
                                    }
                                })

                                var newbc = results[0].centrale_elec + parseInt(nombre);

                                var embed = {
                                    author: {
                                        name: `${results[0].rang} de ${results[0].nom}`,
                                        icon_url: interaction.member.displayAvatarURL()
                                    },
                                    thumbnail: {
                                        url: `${results[0].drapeau}`
                                    },
                                    title: `\`Construction : ${nombre.toLocaleString('en-US')} centrales électrique\``,
                                    description: `> 🛠️ Vous avez désormais :\n` +
                                        codeBlock(`• ${newbc.toLocaleString('en-US')} centrales électrique`) + `\u200B`,
                                    color: interaction.member.displayHexColor,
                                    timestamp: new Date(),
                                    footer: {
                                        text: `${results[0].devise}`
                                    },
                                }
                                break;

                            case 'Eolienne':

                                var const_T_libre = process.env.SURFACE_EOLIENNE * nombre;
                                var const_metaux = process.env.CONST_EOLIENNE_METAUX * nombre;

                                var sql = `
                                        UPDATE pays SET eolienne=eolienne+${nombre} WHERE id_joueur="${interaction.member.id}";
                                        UPDATE pays SET usine_total=usine_total+${nombre} WHERE id_joueur="${interaction.member.id}";
                                        UPDATE pays SET T_libre=T_libre-${const_T_libre} WHERE id_joueur="${interaction.member.id}";
                                        UPDATE pays SET T_occ=T_occ+${const_T_libre} WHERE id_joueur="${interaction.member.id}";
                                        UPDATE pays SET metaux=metaux-${const_metaux} WHERE id_joueur="${interaction.member.id}"`;
                                connection.query(sql, async(err, results) => {
                                    if (err) {
                                        throw err;
                                    }
                                })

                                var newbc = results[0].eolienne + parseInt(nombre);

                                var embed = {
                                    author: {
                                        name: `${results[0].rang} de ${results[0].nom}`,
                                        icon_url: interaction.member.displayAvatarURL()
                                    },
                                    thumbnail: {
                                        url: `${results[0].drapeau}`
                                    },
                                    title: `\`Construction : ${nombre.toLocaleString('en-US')} éoliennes\``,
                                    description: `> 🛠️ Vous avez désormais :\n` +
                                        codeBlock(`• ${newbc.toLocaleString('en-US')} éoliennes`) + `\u200B`,
                                    color: interaction.member.displayHexColor,
                                    timestamp: new Date(),
                                    footer: {
                                        text: `${results[0].devise}`
                                    },
                                }
                                break;

                            case 'Mine':

                                var const_T_libre = process.env.SURFACE_MINE * nombre;
                                var const_bois = process.env.CONST_MINE_BOIS * nombre;
                                var const_brique = process.env.CONST_MINE_BRIQUE * nombre;
                                var const_metaux = process.env.CONST_MINE_METAUX * nombre;

                                var sql = `
                                    UPDATE pays SET mine=mine+${nombre} WHERE id_joueur='${interaction.member.id}';
                                    UPDATE pays SET usine_total=usine_total+${nombre} WHERE id_joueur='${interaction.member.id}';
                                    UPDATE pays SET T_libre=T_libre-${const_T_libre} WHERE id_joueur='${interaction.member.id}';
                                    UPDATE pays SET T_occ=T_occ+${const_T_libre} WHERE id_joueur='${interaction.member.id}';
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
                                    title: `\`Construction : ${nombre.toLocaleString('en-US')} mines\``,
                                    description: `> 🛠️ Vous avez désormais :\n` +
                                        codeBlock(`• ${newbc.toLocaleString('en-US')} mines`) + `\u200B`,
                                    color: interaction.member.displayHexColor,
                                    timestamp: new Date(),
                                    footer: {
                                        text: `${results[0].devise}`
                                    },
                                }
                                break;

                            case 'Pompe à eau':

                                var const_T_libre = process.env.SURFACE_POMPE_A_EAU * nombre;
                                var const_bois = process.env.CONST_POMPE_A_EAU_BOIS * nombre;
                                var const_brique = process.env.CONST_POMPE_A_EAU_BRIQUE * nombre;
                                var const_metaux = process.env.CONST_POMPE_A_EAU_METAUX * nombre;

                                var sql = `
                                    UPDATE pays SET pompe_a_eau=pompe_a_eau+${nombre} WHERE id_joueur='${interaction.member.id}';
                                    UPDATE pays SET usine_total=usine_total+${nombre} WHERE id_joueur='${interaction.member.id}';
                                    UPDATE pays SET T_libre=T_libre-${const_T_libre} WHERE id_joueur='${interaction.member.id}';
                                    UPDATE pays SET T_occ=T_occ+${const_T_libre} WHERE id_joueur='${interaction.member.id}';
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
                                    title: `\`Construction : ${nombre.toLocaleString('en-US')} pompes à eau\``,
                                    description: `> 🛠️ Vous avez désormais :\n` +
                                        codeBlock(`• ${newbc.toLocaleString('en-US')} pompes à eau`) + `\u200B`,
                                    color: interaction.member.displayHexColor,
                                    timestamp: new Date(),
                                    footer: {
                                        text: `${results[0].devise}`
                                    },
                                }
                                break;

                            case 'Pumpjack':

                                var const_T_libre = process.env.SURFACE_PUMPJACK * nombre;
                                var const_bois = process.env.CONST_PUMPJACK_BOIS * nombre;
                                var const_brique = process.env.CONST_PUMPJACK_BRIQUE * nombre;
                                var const_metaux = process.env.CONST_PUMPJACK_METAUX * nombre;

                                var sql = `
                                    UPDATE pays SET pumpjack=pumpjack+${nombre} WHERE id_joueur='${interaction.member.id}';
                                    UPDATE pays SET usine_total=usine_total+${nombre} WHERE id_joueur='${interaction.member.id}';
                                    UPDATE pays SET T_libre=T_libre-${const_T_libre} WHERE id_joueur='${interaction.member.id}';
                                    UPDATE pays SET T_occ=T_occ+${const_T_libre} WHERE id_joueur='${interaction.member.id}';
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
                                    title: `\`Construction : ${nombre.toLocaleString('en-US')} pumpjacks\``,
                                    description: `> 🛠️ Vous avez désormais :\n` +
                                        codeBlock(`• ${newbc.toLocaleString('en-US')} pumpjacks`) + `\u200B`,
                                    color: interaction.member.displayHexColor,
                                    timestamp: new Date(),
                                    footer: {
                                        text: `${results[0].devise}`
                                    },
                                }
                                break;

                            case 'Scierie':

                                var const_T_libre = process.env.SURFACE_SCIERIE * nombre;
                                var const_bois = process.env.CONST_SCIERIE_BOIS * nombre;
                                var const_brique = process.env.CONST_SCIERIE_BRIQUE * nombre;
                                var const_metaux = process.env.CONST_SCIERIE_METAUX * nombre;

                                var sql = `
                                    UPDATE pays SET scierie=scierie+${nombre} WHERE id_joueur='${interaction.member.id}';
                                    UPDATE pays SET usine_total=usine_total+${nombre} WHERE id_joueur='${interaction.member.id}';
                                    UPDATE pays SET T_libre=T_libre-${const_T_libre} WHERE id_joueur='${interaction.member.id}';
                                    UPDATE pays SET T_occ=T_occ+${const_T_libre} WHERE id_joueur='${interaction.member.id}';
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
                                    title: `\`Construction : ${nombre.toLocaleString('en-US')} scieries\``,
                                    description: `> 🛠️ Vous avez désormais :\n` +
                                        codeBlock(`• ${newbc.toLocaleString('en-US')} scieries`) + `\u200B`,
                                    color: interaction.member.displayHexColor,
                                    timestamp: new Date(),
                                    footer: {
                                        text: `${results[0].devise}`
                                    },
                                }
                                break;

                            case 'Usine civile':

                                var const_T_libre = process.env.SURFACE_USINE_CIVILE * nombre;
                                var const_bois = process.env.CONST_USINE_CIVILE_BOIS * nombre;
                                var const_brique = process.env.CONST_USINE_CIVILE_BRIQUE * nombre;
                                var const_metaux = process.env.CONST_USINE_CIVILE_METAUX * nombre;

                                var sql = `
                                    UPDATE pays SET usine_civile=usine_civile+${nombre} WHERE id_joueur='${interaction.member.id}';
                                    UPDATE pays SET usine_total=usine_total+${nombre} WHERE id_joueur='${interaction.member.id}';
                                    UPDATE pays SET T_libre=T_libre-${const_T_libre} WHERE id_joueur='${interaction.member.id}';
                                    UPDATE pays SET T_occ=T_occ+${const_T_libre} WHERE id_joueur='${interaction.member.id}';
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
                                    title: `\`Construction : ${nombre.toLocaleString('en-US')} usines civile\``,
                                    description: `> 🛠️ Vous avez désormais :\n` +
                                        codeBlock(`• ${newbc.toLocaleString('en-US')} usines civile`) + `\u200B`,
                                    color: interaction.member.displayHexColor,
                                    timestamp: new Date(),
                                    footer: {
                                        text: `${results[0].devise}`
                                    },
                                }
                                break;
                        }

                        interaction.deferUpdate()

                        interaction.message.edit({ embeds: [embed], components: [] })
                    });

                } else {
                    var reponse = codeBlock('diff', `- Vous n'êtes pas l'auteur de cette commande`);
                    interaction.reply({ content: reponse, ephemeral: true });
                }
                //endregion

                //region [Demolition]
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
                            var demo_bois = Math.round(process.env.CONST_BRIQUETERIE_BOIS * nombre * process.env.RETOUR_POURCENTAGE);
                            var demo_brique = Math.round(process.env.CONST_BRIQUETERIE_BRIQUE * nombre * process.env.RETOUR_POURCENTAGE);
                            var demo_metaux = Math.round(process.env.CONST_BRIQUETERIE_METAUX * nombre * process.env.RETOUR_POURCENTAGE);

                            var sql = `
                                UPDATE pays SET briqueterie=briqueterie-${nombre} WHERE id_joueur='${interaction.member.id}';
                                UPDATE pays SET usine_total=usine_total-${nombre} WHERE id_joueur='${interaction.member.id}';
                                UPDATE pays SET T_libre=T_libre+${demo_T_libre} WHERE id_joueur='${interaction.member.id}';
                                UPDATE pays SET T_occ=T_occ-${demo_T_libre} WHERE id_joueur='${interaction.member.id}';
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
                                title: `\`Démolition : ${nombre.toLocaleString('en-US')} briqueteries\``,
                                description: `> 🛠️ Vous avez désormais :\n` +
                                    codeBlock(`• ${newbc.toLocaleString('en-US')} briqueteries`) + `\u200B`,
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
                            var demo_bois = Math.round(process.env.CONST_CHAMP_BOIS * nombre * process.env.RETOUR_POURCENTAGE);
                            var demo_brique = Math.round(process.env.CONST_CHAMP_BRIQUE * nombre * process.env.RETOUR_POURCENTAGE);
                            var demo_metaux = Math.round(process.env.CONST_CHAMP_METAUX * nombre * process.env.RETOUR_POURCENTAGE);

                            var sql = `
                                UPDATE pays SET champ=champ-'${nombre}' WHERE id_joueur='${interaction.member.id}';
                                UPDATE pays SET usine_total=usine_total-'${nombre}' WHERE id_joueur='${interaction.member.id}';
                                UPDATE pays SET T_libre=T_libre+'${demo_T_libre}' WHERE id_joueur='${interaction.member.id}';
                                UPDATE pays SET T_occ=T_occ-'${demo_T_libre}' WHERE id_joueur='${interaction.member.id}';
                                UPDATE pays SET bois=bois+'${demo_bois}' WHERE id_joueur='${interaction.member.id}';
                                UPDATE pays SET brique=brique+'${demo_brique}' WHERE id_joueur='${interaction.member.id}';
                                UPDATE pays SET metaux=metaux+'${demo_metaux}' WHERE id_joueur='${interaction.member.id}'`;
                            connection.query(sql, async(err, results) => {
                                if (err) {
                                    throw err;
                                }
                            });

                            var newbc = results[0].champ - parseInt(nombre);

                            var embed = {
                                author: {
                                    name: `${results[0].rang} de ${results[0].nom}`,
                                    icon_url: interaction.member.displayAvatarURL()
                                },
                                thumbnail: {
                                    url: `${results[0].drapeau}`
                                },
                                title: `\`Démolition : ${nombre.toLocaleString('en-US')} champs\``,
                                description: `> 🛠️ Vous avez désormais :\n` +
                                    codeBlock(`• ${newbc.toLocaleString('en-US')} champs`) + `\u200B`,
                                color: interaction.member.displayHexColor,
                                timestamp: new Date(),
                                footer: {
                                    text: `${results[0].devise}`
                                },
                            }

                            interaction.deferUpdate()

                            interaction.message.edit({ embeds: [embed], components: [] })

                        } else if (batiment == 'Centrale électrique') {

                            var demo_T_libre = process.env.SURFACE_CENTRALE_ELEC * nombre;
                            var demo_bois = Math.round(process.env.CONST_CENTRALE_ELEC_BOIS * nombre * process.env.RETOUR_POURCENTAGE);
                            var demo_brique = Math.round(process.env.CONST_CENTRALE_ELEC_BRIQUE * nombre * process.env.RETOUR_POURCENTAGE);
                            var demo_metaux = Math.round(process.env.CONST_CENTRALE_ELEC_METAUX * nombre * process.env.RETOUR_POURCENTAGE);

                            var sql = `
                                UPDATE pays SET centrale_elec=centrale_elec-'${nombre}' WHERE id_joueur='${interaction.member.id}';
                                UPDATE pays SET usine_total=usine_total-'${nombre}' WHERE id_joueur='${interaction.member.id}';
                                UPDATE pays SET T_libre=T_libre+'${demo_T_libre}' WHERE id_joueur='${interaction.member.id}';
                                UPDATE pays SET T_occ=T_occ-'${demo_T_libre}' WHERE id_joueur='${interaction.member.id}';
                                UPDATE pays SET bois=bois+'${demo_bois}' WHERE id_joueur='${interaction.member.id}';
                                UPDATE pays SET brique=brique+'${demo_brique}' WHERE id_joueur='${interaction.member.id}';
                                UPDATE pays SET metaux=metaux+'${demo_metaux}' WHERE id_joueur='${interaction.member.id}'`;
                            connection.query(sql, async(err, results) => {
                                if (err) {
                                    throw err;
                                }
                            });

                            var newbc = results[0].centrale_elec - parseInt(nombre);

                            var embed = {
                                author: {
                                    name: `${results[0].rang} de ${results[0].nom}`,
                                    icon_url: interaction.member.displayAvatarURL()
                                },
                                thumbnail: {
                                    url: `${results[0].drapeau}`
                                },
                                title: `\`Démolition : ${nombre.toLocaleString('en-US')} centrales électrique\``,
                                description: `> 🛠️ Vous avez désormais :\n` +
                                    codeBlock(`• ${newbc.toLocaleString('en-US')} centrales électrique`) + `\u200B`,
                                color: interaction.member.displayHexColor,
                                timestamp: new Date(),
                                footer: {
                                    text: `${results[0].devise}`
                                },
                            }

                            interaction.deferUpdate()

                            interaction.message.edit({ embeds: [embed], components: [] })

                        } else if (batiment == 'Eolienne') {

                            var demo_T_libre = process.env.SURFACE_EOLIENNE * nombre;
                            var demo_metaux = Math.round(process.env.CONST_EOLIENNE_METAUX * nombre * process.env.RETOUR_POURCENTAGE);

                            var sql = `
                                UPDATE pays SET eolienne=eolienne-'${nombre}' WHERE id_joueur='${interaction.member.id}';
                                UPDATE pays SET usine_total=usine_total-'${nombre}' WHERE id_joueur='${interaction.member.id}';
                                UPDATE pays SET T_libre=T_libre+'${demo_T_libre}' WHERE id_joueur='${interaction.member.id}';
                                UPDATE pays SET T_occ=T_occ-'${demo_T_libre}' WHERE id_joueur='${interaction.member.id}';
                                UPDATE pays SET metaux=metaux+'${demo_metaux}' WHERE id_joueur='${interaction.member.id}'`;
                            connection.query(sql, async(err, results) => {
                                if (err) {
                                    throw err;
                                }
                            });

                            var newbc = results[0].eolienne - parseInt(nombre);

                            var embed = {
                                author: {
                                    name: `${results[0].rang} de ${results[0].nom}`,
                                    icon_url: interaction.member.displayAvatarURL()
                                },
                                thumbnail: {
                                    url: `${results[0].drapeau}`
                                },
                                title: `\`Démolition : ${nombre.toLocaleString('en-US')} eoliennes\``,
                                description: `> 🛠️ Vous avez désormais :\n` +
                                    codeBlock(`• ${newbc.toLocaleString('en-US')} eoliennes`) + `\u200B`,
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
                            var demo_bois = Math.round(process.env.CONST_MINE_BOIS * nombre * process.env.RETOUR_POURCENTAGE);
                            var demo_brique = Math.round(process.env.CONST_MINE_BRIQUE * nombre * process.env.RETOUR_POURCENTAGE);
                            var demo_metaux = Math.round(process.env.CONST_MINE_METAUX * nombre * process.env.RETOUR_POURCENTAGE);

                            var sql = `
                                UPDATE pays SET mine=mine-${nombre} WHERE id_joueur='${interaction.member.id}';
                                UPDATE pays SET usine_total=usine_total-${nombre} WHERE id_joueur='${interaction.member.id}';
                                UPDATE pays SET T_libre=T_libre+${demo_T_libre} WHERE id_joueur='${interaction.member.id}';
                                UPDATE pays SET T_occ=T_occ-${demo_T_libre} WHERE id_joueur='${interaction.member.id}';
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
                                title: `\`Démolition : ${nombre.toLocaleString('en-US')} mines\``,
                                description: `> 🛠️ Vous avez désormais :\n` +
                                    codeBlock(`• ${newbc.toLocaleString('en-US')} mines`) + `\u200B`,
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
                            var demo_bois = Math.round(process.env.CONST_POMPE_A_EAU_BOIS * nombre * process.env.RETOUR_POURCENTAGE);
                            var demo_brique = Math.round(process.env.CONST_POMPE_A_EAU_BRIQUE * nombre * process.env.RETOUR_POURCENTAGE);
                            var demo_metaux = Math.round(process.env.CONST_POMPE_A_EAU_METAUX * nombre * process.env.RETOUR_POURCENTAGE);

                            var sql = `
                                UPDATE pays SET pompe_a_eau=pompe_a_eau-${nombre} WHERE id_joueur='${interaction.member.id}';
                                UPDATE pays SET usine_total=usine_total-${nombre} WHERE id_joueur='${interaction.member.id}';
                                UPDATE pays SET T_libre=T_libre+${demo_T_libre} WHERE id_joueur='${interaction.member.id}';
                                UPDATE pays SET T_occ=T_occ-${demo_T_libre} WHERE id_joueur='${interaction.member.id}';
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
                                title: `\`Démolition : ${nombre.toLocaleString('en-US')} pompes à eau\``,
                                description: `> 🛠️ Vous avez désormais :\n` +
                                    codeBlock(`• ${newbc.toLocaleString('en-US')} pompes à eau`) + `\u200B`,
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
                            var demo_bois = Math.round(process.env.CONST_PUMPJACK_BOIS * nombre * process.env.RETOUR_POURCENTAGE);
                            var demo_brique = Math.round(process.env.CONST_PUMPJACK_BRIQUE * nombre * process.env.RETOUR_POURCENTAGE);
                            var demo_metaux = Math.round(process.env.CONST_PUMPJACK_METAUX * nombre * process.env.RETOUR_POURCENTAGE);

                            var sql = `
                                UPDATE pays SET pumpjack=pumpjack-${nombre} WHERE id_joueur='${interaction.member.id}';
                                UPDATE pays SET usine_total=usine_total-${nombre} WHERE id_joueur='${interaction.member.id}';
                                UPDATE pays SET T_libre=T_libre+${demo_T_libre} WHERE id_joueur='${interaction.member.id}';
                                UPDATE pays SET T_occ=T_occ-${demo_T_libre} WHERE id_joueur='${interaction.member.id}';
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
                                title: `\`Démolition : ${nombre.toLocaleString('en-US')} pumpjacks\``,
                                description: `> 🛠️ Vous avez désormais :\n` +
                                    codeBlock(`• ${newbc.toLocaleString('en-US')} pumpjacks`) + `\u200B`,
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
                            var demo_bois = Math.round(process.env.CONST_SCIERIE_BOIS * nombre * process.env.RETOUR_POURCENTAGE);
                            var demo_brique = Math.round(process.env.CONST_SCIERIE_BRIQUE * nombre * process.env.RETOUR_POURCENTAGE);
                            var demo_metaux = Math.round(process.env.CONST_SCIERIE_METAUX * nombre * process.env.RETOUR_POURCENTAGE);

                            var sql = `
                                UPDATE pays SET scierie=scierie-${nombre} WHERE id_joueur='${interaction.member.id}';
                                UPDATE pays SET usine_total=usine_total-${nombre} WHERE id_joueur='${interaction.member.id}';
                                UPDATE pays SET T_libre=T_libre+${demo_T_libre} WHERE id_joueur='${interaction.member.id}';
                                UPDATE pays SET T_occ=T_occ-${demo_T_libre} WHERE id_joueur='${interaction.member.id}';
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
                                title: `\`Démolition : ${nombre.toLocaleString('en-US')} scieries\``,
                                description: `> 🛠️ Vous avez désormais :\n` +
                                    codeBlock(`• ${newbc.toLocaleString('en-US')} scieries`) + `\u200B`,
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
                            var demo_bois = Math.round(process.env.CONST_USINE_CIVILE_BOIS * nombre * process.env.RETOUR_POURCENTAGE);
                            var demo_brique = Math.round(process.env.CONST_USINE_CIVILE_BRIQUE * nombre * process.env.RETOUR_POURCENTAGE);
                            var demo_metaux = Math.round(process.env.CONST_USINE_CIVILE_METAUX * nombre * process.env.RETOUR_POURCENTAGE);

                            var sql = `
                                UPDATE pays SET usine_civile=usine_civile-${nombre} WHERE id_joueur='${interaction.member.id}';
                                UPDATE pays SET usine_total=usine_total-${nombre} WHERE id_joueur='${interaction.member.id}';
                                UPDATE pays SET T_libre=T_libre+${demo_T_libre} WHERE id_joueur='${interaction.member.id}';
                                UPDATE pays SET T_occ=T_occ-${demo_T_libre} WHERE id_joueur='${interaction.member.id}';
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
                                title: `\`Démolition : ${nombre.toLocaleString('en-US')} usines civile\``,
                                description: `> 🛠️ Vous avez désormais : 🛠️\n` +
                                    codeBlock(`• ${newbc.toLocaleString('en-US')} usines civile`) + `\u200B`,
                                color: interaction.member.displayHexColor,
                                timestamp: new Date(),
                                footer: {
                                    text: `${results[0].devise}`
                                },
                            }

                            interaction.deferUpdate()

                            interaction.message.edit({ embeds: [embed], components: [] })

                        }
                    });

                } else {
                    var reponse = codeBlock('diff', `- Vous n'êtes pas l'auteur de cette commande`);
                    interaction.reply({ content: reponse, ephemeral: true });
                }
                //endregion

                //region [Expansion - Choix pacifique]
            } else if (interaction.customId === 'choix_pacifique') {

                var sql = `
                    SELECT * FROM pays WHERE id_joueur=${interaction.member.id}`;
                connection.query(sql, async(err, results) => {
                    if (err) {
                        throw err;
                    }

                    if (results[0].action_diplo < 10) {

                        var reponse = codeBlock('diff', `- Vous n'avez pas assez de points d'action diplomatique : ${results[0].action_diplo}/10`);
                        await interaction.reply({ content: reponse, ephemeral: true });

                    } else {

                        var random = chance.bool({ likelihood: results[0].reputation })

                        if (random == true) {

                            var territoire = chance.integer({ min: 1500, max: 2000 });
                            var pop = chance.integer({ min: process.env.EXP_MIN_POP, max: process.env.EXP_MAX_POP });

                            var sql = `
                            UPDATE pays SET T_total=T_total+${territoire} WHERE id_joueur=${interaction.user.id};
                            UPDATE pays SET T_libre=T_libre+${territoire} WHERE id_joueur=${interaction.user.id};
                            UPDATE pays SET population=population+${pop} WHERE id_joueur=${interaction.user.id};
                            UPDATE pays SET action_diplo=action_diplo-10 WHERE id_joueur=${interaction.user.id}`;

                            if (results[0].reputation < 100) {
                                var sql = sql + `;
                                UPDATE pays SET reputation=reputation+0.1 WHERE id_joueur=${interaction.user.id}`
                            }
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
                                    title: `\`Le/la ${results[0].regime} a désormais une influence sur une nouvelle case\``,
                                    description: `> Direction : ${results[0].direction}`,
                                    timestamp: new Date(),
                                    footer: {
                                        text: `${results[0].devise}`
                                    },
                                    color: interaction.member.displayHexColor
                                };

                                const salon_carte = interaction.client.channels.cache.get(process.env.SALON_CARTE);
                                salon_carte.send({ embeds: [annonce] });

                                var reponse = `__**Vous vous êtes étendu sur une nouvelle case : ${salon_carte}**__`;
                                const salon_joueur = interaction.client.channels.cache.get(results[0].id_salon);
                                salon_joueur.send({ content: reponse });
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
                                    value: codeBlock(
                                        `• ${territoire.toLocaleString('en-US')} km²\n` +
                                        `• ${pop.toLocaleString('en-US')} habitants`) + `\u200B`
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
                            }, 15000)

                        } else {

                            var sql = `
                            UPDATE pays SET action_diplo=action_diplo-10 WHERE id_joueur=${interaction.user.id}`;

                            if (results[0].reputation < 99.8) {
                                var sql = sql + `;
                                UPDATE pays SET reputation=reputation+0.3 WHERE id_joueur=${interaction.user.id}`
                            }
                            connection.query(sql, async(err, results) => {
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
                            }, 10000)
                        }
                    }
                });
                //endregion

                //region [Acheter]
            } else if (interaction.customId.includes('acheter') == true) {

                var id_joueur = interaction.customId.slice(8);

                var fields = interaction.message.embeds[0].fields
                var espace = fields[0].value.indexOf("Prix");
                var ressource = fields[0].value.slice(6, espace - 3)

                var quantite = interaction.message.embeds[0].fields[1].value.slice(6, fields[1].value.length - 4)
                const search = ',';
                const replaceWith = '';
                const quantité = parseInt(quantite.split(search).join(replaceWith));

                const texte = interaction.message.embeds[0].fields[2].value
                var prix_u = Number(texte.slice((texte.indexOf(":") + 2), (texte.indexOf("Au") - 2)));
                var prix = Math.round(prix_u * quantité);
                console.log(espace + ` | ` + ressource + ` | ` + prix_u + ` | ` + prix + ` | ` + texte + ` | ` + (texte.indexOf(":") + 2) + ` | ` + (texte.indexOf("Au") - 3))
                var sql = `
                        SELECT * FROM pays WHERE id_joueur='${id_joueur}'`;

                connection.query(sql, async(err, results) => {
                    if (err) {
                        throw err;
                    }

                    switch (ressource) {
                        case 'Biens de consommation':
                            var res = `bc`;
                            break;
                        case 'Bois':
                            var res = `bois`;
                            break;
                        case 'Brique':
                            var res = `brique`;
                            break;
                        case 'Eau':
                            var res = `eau`;
                            break;
                        case 'Metaux':
                            var res = `metaux`;
                            break;
                        case 'Nourriture':
                            var res = `nourriture`;
                            break;
                        case 'Petrole':
                            var res = `petrole`;
                            break;
                    }

                    var sql = `
                            SELECT * FROM pays WHERE id_joueur="${interaction.user.id}" LIMIT 1`;
                    connection.query(sql, async(err, results) => {
                        if (err) {
                            throw err;
                        }
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
                                        value: codeBlock(`• ${ressource}`)
                                    },
                                    {
                                        name: `Quantité :`,
                                        value: codeBlock(`• ${quantité.toLocaleString('en-US')}`)
                                    },
                                    {
                                        name: `Prix :`,
                                        value: codeBlock(
                                            `• A l'unité : ${prix_u}\n` +
                                            `• Au total : ${prix.toLocaleString('en-US')} $`)
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
                                    },
                                    {
                                        name: `Ressource :`,
                                        value: codeBlock(`• ${ressource}`)
                                    },
                                    {
                                        name: `Quantité :`,
                                        value: codeBlock(`• ${quantité.toLocaleString('en-US')}`)
                                    },
                                    {
                                        name: `Prix :`,
                                        value: codeBlock(`• A l'unité : ${prix_u}\n` +
                                            `• Au total : ${prix.toLocaleString('en-US')} $`)
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
                                        value: codeBlock(`• ${ressource}`)
                                    },
                                    {
                                        name: `Quantité :`,
                                        value: codeBlock(`• ${quantité.toLocaleString('en-US')}`)
                                    },
                                    {
                                        name: `Prix :`,
                                        value: codeBlock(`• A l'unité : ${prix_u}\n` +
                                            `• Au total : ${prix.toLocaleString('en-US')} $`)
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


                            var sql = `SELECT * FROM trade WHERE ressource="${ressource}" ORDER BY id_trade`;
                            connection.query(sql, async(err, results) => {
                                if (err) {
                                    throw err;
                                }
                                var arrayQvente = Object.values(results);
                                var sql = `DELETE FROM trade WHERE id_trade='${arrayQvente[0].id_trade}'`;
                                connection.query(sql, async(err, results) => {
                                    if (err) {
                                        throw err;
                                    }
                                });
                            });

                            var sql = `
                                    INSERT INTO trade SET id_joueur="${interaction.user.id}", id_salon="${interaction.channelId}", ressource="${ressource}", quantite='${quantité}', prix='${prix}', prix_u='${prix_u}';
                                    UPDATE pays SET cash=cash+${prix} WHERE id_joueur="${id_joueur}";
                                    UPDATE pays SET cash=cash-${prix} WHERE id_joueur="${interaction.user.id}";
                                    UPDATE pays SET ${res}=${res}+${quantité} WHERE id_joueur="${interaction.user.id}";
                                    INSERT INTO historique SET id_joueur="${interaction.user.id}", id_salon="${interaction.channelId}", type="offre", ressource="${ressource}", quantite='${quantité}', prix='${prix}', prix_u='${prix_u}'`;
                            connection.query(sql, async(err, results) => {
                                if (err) {
                                    throw err;
                                }
                            })

                        } else {
                            var reponse = codeBlock('diff', `- Vous n'avez pas l'argent nécessaire pour conclure l'affaire : ${results[0].cash.toLocaleString('en-US')}/${prix.toLocaleString('en-US')}`);
                            await interaction.reply({ content: reponse, ephemeral: true });
                        }
                    })
                });
                //endregion

                //region [Vendre]
            } else if (interaction.customId.includes('vendre') == true) {

                var id_joueur = interaction.customId.slice(7);
                if (id_joueur == interaction.member.id) {

                    var fields = interaction.message.embeds[0].fields
                    var espace = fields[0].value.indexOf("Prix");
                    var ressource = fields[0].value.slice(6, espace - 3)

                    var quantite = interaction.message.embeds[0].fields[1].value.slice(6, fields[1].value.length - 4)
                    const search = ',';
                    const replaceWith = '';
                    const quantité = parseInt(quantite.split(search).join(replaceWith));

                    var espace2 = fields[2].value.indexOf("Au");
                    var prix_u = fields[2].value.slice(18, espace2 - 3);
                    var prix = Math.round(prix_u * quantité);
                    //console.log(espace + ` | ` + ressource + ` | ` + espace2 + ` | ` + prix_u + ` | ` + prix)

                    var sql = `
                    SELECT * FROM pays WHERE id_joueur="${id_joueur}"`;

                    connection.query(sql, async(err, results) => {
                        if (err) {
                            throw err;
                        }

                        switch (ressource) {
                            case 'Biens de consommation':
                                var res = `bc`;
                                break;
                            case 'Bois':
                                var res = `bois`;
                                break;
                            case 'Brique':
                                var res = `brique`;
                                break;
                            case 'Eau':
                                var res = `eau`;
                                break;
                            case 'Metaux':
                                var res = `metaux`;
                                break;
                            case 'Nourriture':
                                var res = `nourriture`;
                                break;
                            case 'Petrole':
                                var res = `petrole`;
                                break;
                        }
                        var embed = {
                            author: {
                                name: `${results[0].rang} de ${results[0].nom}`,
                                icon_url: interaction.member.displayAvatarURL()
                            },
                            thumbnail: {
                                url: results[0].drapeau
                            },
                            title: `\`Vous avez fait une offre au marché internationnal :\``,
                            fields: interaction.message.embeds[0].fields,
                            color: interaction.member.displayHexColor,
                            timestamp: new Date(),
                            footer: {
                                text: `${results[0].devise}`
                            },
                        };

                        interaction.message.edit({ embeds: [embed], components: [] });

                        const salon_commerce = interaction.client.channels.cache.get(process.env.SALON_COMMERCE);
                        const thread = await salon_commerce.threads
                            .create({
                                name: `${quantité.toLocaleString('en-US')} [${ressource}] à ${prix_u.toLocaleString('en-US')} | ${prix.toLocaleString('en-US')} $ | ${interaction.member.displayName}`
                            });

                        const offre = {
                            author: {
                                name: `${results[0].rang} de ${results[0].nom}`,
                                icon_url: interaction.member.displayAvatarURL()
                            },
                            thumbnail: {
                                url: results[0].drapeau
                            },
                            title: `\`Nouvelle offre :\``,
                            fields: [{
                                    name: `Ressource :`,
                                    value: codeBlock(`• ${ressource}`) + `\u200B`
                                },
                                {
                                    name: `Quantité :`,
                                    value: codeBlock(`• ${quantité.toLocaleString('en-US')}`) + `\u200B`
                                },
                                {
                                    name: `Prix :`,
                                    value: codeBlock(`• A l'unité : ${prix_u.toLocaleString('en-US')}\n` +
                                        `• Au total : ${prix.toLocaleString('en-US')}`) + `\u200B`
                                }
                            ],
                            color: interaction.member.displayHexColor,
                            timestamp: new Date(),
                            footer: {
                                text: `${results[0].devise}`
                            },
                        };

                        const row = new MessageActionRow()
                            .addComponents(
                                new MessageButton()
                                .setLabel(`Acheter`)
                                .setEmoji(`💵`)
                                .setCustomId('acheter-' + id_joueur)
                                .setStyle('SUCCESS'),
                            )

                        thread.send({ embeds: [offre], components: [row] });

                        interaction.channel.send({ content: `Votre offre a été publié pour 1 jour : ${thread}` });
                        await vendreCommandCooldown.addUser(interaction.member.id);

                        var sql = `UPDATE pays SET ${res}=${res}-${quantité} WHERE id_joueur="${id_joueur}"`;

                        connection.query(sql, async(err, results) => {
                            if (err) {
                                throw err;
                            }
                        });
                    });

                } else {
                    var reponse = codeBlock('diff', `- Vous n'êtes pas l'auteur de cette commande`);
                    interaction.reply({ content: reponse, ephemeral: true });
                }
                //endregion

                //region [Vente rapide]
            } else if (interaction.customId.includes('qvente') == true) {

                var id_joueur = interaction.customId.slice(7);
                if (id_joueur == interaction.member.id) {

                    var fields = interaction.message.embeds[0].fields
                    var espace = fields[0].value.indexOf("Prix");
                    var ressource = fields[0].value.slice(6, espace - 3)

                    var quantite = interaction.message.embeds[0].fields[1].value.slice(6, fields[1].value.length - 4)
                    const search = ',';
                    const replaceWith = '';
                    const quantité = quantite.split(search).join(replaceWith);

                    var espace2 = fields[2].value.indexOf("Au");
                    var prix_u = fields[2].value.slice(39, espace2 - 3);
                    var prix = Math.round(prix_u * quantité);
                    //console.log(espace + ` | ` + ressource + ` | ` + espace2 + ` | ` + prix_u + ` | ` + prix)

                    var sql = `
                    SELECT * FROM pays WHERE id_joueur="${id_joueur}"`;

                    connection.query(sql, async(err, results) => {
                        if (err) {
                            throw err;
                        }

                        switch (ressource) {
                            case 'Biens de consommation':
                                var res = `bc`;
                                break;
                            case 'Bois':
                                var res = `bois`;
                                break;
                            case 'Brique':
                                var res = `brique`;
                                break;
                            case 'Eau':
                                var res = `eau`;
                                break;
                            case 'Metaux':
                                var res = `metaux`;
                                break;
                            case 'Nourriture':
                                var res = `nourriture`;
                                break;
                            case 'Petrole':
                                var res = `petrole`;
                                break;
                        }
                        var embed = {
                            author: {
                                name: `${results[0].rang} de ${results[0].nom}`,
                                icon_url: interaction.member.displayAvatarURL()
                            },
                            thumbnail: {
                                url: results[0].drapeau
                            },
                            title: `\`Vous avez vendus au marché rapide :\``,
                            fields: interaction.message.embeds[0].fields,
                            color: interaction.member.displayHexColor,
                            timestamp: new Date(),
                            footer: {
                                text: `${results[0].devise}`
                            },
                        };

                        await interaction.deferUpdate()
                        interaction.message.edit({ embeds: [embed], components: [] });

                        var sql = `SELECT * FROM qvente WHERE ressource="${ressource}" ORDER BY id_vente`;
                        connection.query(sql, async(err, results) => {
                            if (err) {
                                throw err;
                            }
                            var arrayQvente = Object.values(results);
                            var sql = `DELETE FROM qvente WHERE id_vente='${arrayQvente[0].id_vente}'`;
                            connection.query(sql, async(err, results) => {
                                if (err) {
                                    throw err;
                                }
                            });
                        });

                        var sql = `
                        INSERT INTO qvente SET id_joueur="${interaction.user.id}", id_salon="${interaction.channelId}", ressource="${ressource}", quantite='${quantité}', prix='${prix}', prix_u='${prix_u}';
                        UPDATE pays SET cash=cash+${prix} WHERE id_joueur="${id_joueur}";
                        UPDATE pays SET ${res}=${res}-${quantité} WHERE id_joueur="${id_joueur}";
                        INSERT INTO historique SET id_joueur="${interaction.user.id}", id_salon="${interaction.channelId}", type="qvente", ressource="${ressource}", quantite='${quantité}', prix='${prix}', prix_u='${prix_u}'`;

                        connection.query(sql, async(err, results) => {
                            if (err) {
                                throw err;
                            }
                        });
                    });

                } else {
                    var reponse = codeBlock('diff', `- Vous n'êtes pas l'auteur de cette commande`);
                    interaction.reply({ content: reponse, ephemeral: true });
                }
                //endregion

                //region [Achat rapide]
            } else if (interaction.customId.includes('qachat') == true) {

                var id_joueur = interaction.customId.slice(7);
                if (id_joueur == interaction.member.id) {

                    var fields = interaction.message.embeds[0].fields
                    var espace = fields[0].value.indexOf("Prix");
                    var ressource = fields[0].value.slice(6, espace - 3)

                    var quantite = interaction.message.embeds[0].fields[1].value.slice(6, fields[1].value.length - 4)
                    const search = ',';
                    const replaceWith = '';
                    const quantité = quantite.split(search).join(replaceWith);

                    var espace2 = fields[2].value.indexOf("Au");
                    var prix_u = fields[2].value.slice(39, espace2 - 3);
                    var prix = Math.round(prix_u * quantité);
                    //console.log(espace + ` | ` + ressource + ` | ` + espace2 + ` | ` + prix_u + ` | ` + prix)

                    var sql = `
                    SELECT * FROM pays WHERE id_joueur='${id_joueur}'`;

                    connection.query(sql, async(err, results) => {
                        if (err) {
                            throw err;
                        }

                        if (prix > results[0].cash) {
                            var reponse = codeBlock('diff', `- Vous n'avez pas assez d\'argent : ${results[0].cash.toLocaleString('en-US')}/${prix.toLocaleString('en-US')}`);
                            await interaction.reply({ content: reponse, ephemeral: true });
                        } else {
                            switch (ressource) {
                                case 'Biens de consommation':
                                    var res = `bc`;
                                    break;
                                case 'Bois':
                                    var res = `bois`;
                                    break;
                                case 'Brique':
                                    var res = `brique`;
                                    break;
                                case 'Eau':
                                    var res = `eau`;
                                    break;
                                case 'Metaux':
                                    var res = `metaux`;
                                    break;
                                case 'Nourriture':
                                    var res = `nourriture`;
                                    break;
                                case 'Petrole':
                                    var res = `petrole`;
                                    break;
                            }

                            var embed = {
                                author: {
                                    name: `${results[0].rang} de ${results[0].nom}`,
                                    icon_url: interaction.member.displayAvatarURL()
                                },
                                thumbnail: {
                                    url: results[0].drapeau
                                },
                                title: `\`Vous avez acheté au marché rapide :\``,
                                fields: interaction.message.embeds[0].fields,
                                color: interaction.member.displayHexColor,
                                timestamp: new Date(),
                                footer: {
                                    text: `${results[0].devise}`
                                },
                            };

                            await interaction.deferUpdate()
                            interaction.message.edit({ embeds: [embed], components: [] });

                            var sql = `SELECT * FROM qachat WHERE ressource='${ressource}' ORDER BY id_vente`;
                            connection.query(sql, async(err, results) => {
                                if (err) {
                                    throw err;
                                }
                                var arrayQvente = Object.values(results);
                                var sql = `DELETE FROM qachat WHERE ida_achat='${arrayQvente[0].id_vente}'`;
                                connection.query(sql, async(err, results) => {
                                    if (err) {
                                        throw err;
                                    }
                                });
                            });

                            var sql = `
                                INSERT INTO qachat SET id_joueur="${interaction.user.id}", id_salon="${interaction.channelId}", ressource="${ressource}", quantite='${quantité}', prix='${prix}', prix_u='${prix_u}';
                                UPDATE pays SET cash=cash-${prix} WHERE id_joueur="${id_joueur}";
                                UPDATE pays SET ${res}=${res}+${quantité} WHERE id_joueur="${id_joueur}";
                                INSERT INTO historique SET id_joueur="${interaction.user.id}", id_salon="${interaction.channelId}", type="qachat", ressource="${ressource}", quantite='${quantité}', prix='${prix}', prix_u='${prix_u}'`;

                            connection.query(sql, async(err, results) => {
                                if (err) {
                                    throw err;
                                }
                            });
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
            //endregion

        } else if (interaction.isSelectMenu()) {

            if (interaction.customId == 'usine') {

                var sql = `
                    SELECT * FROM pays WHERE id_joueur=${interaction.member.id}`;

                connection.query(sql, async(err, results) => {
                    if (err) {
                        throw err;
                    }

                    var log = {
                        author: {
                            name: interaction.member.displayName,
                            icon_url: interaction.member.displayAvatarURL()
                        },
                        title: `\`Select Menu\``,
                        description: `${interaction.customId} ${JSON.stringify(interaction.values)}`,
                        timestamp: new Date(),
                        footer: {
                            text: '#' + interaction.channel.name
                        },
                    };

                    const salon_logs = interaction.client.channels.cache.get(process.env.SALON_LOGS);
                    salon_logs.send({ embeds: [log] });


                    const jsonObject = JSON.parse(readFileSync('data/region.json', 'utf-8'));
                    //region [Usine - Briqueterie]
                    if (interaction.values == 'briqueterie') {


                        prod_T_briqueterie = process.env.PROD_BRIQUETERIE * results[0].briqueterie;
                        conso_T_briqueterie_bois = process.env.CONSO_BRIQUETERIE_BOIS * results[0].briqueterie;
                        conso_T_briqueterie_eau = process.env.CONSO_BRIQUETERIE_EAU * results[0].briqueterie;
                        conso_T_briqueterie_elec = process.env.CONSO_BRIQUETERIE_ELECTRICITE * results[0].briqueterie;

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
                                    name: `> Consommation : 🪵💧`,
                                    value: `- Par usine : \n` +
                                        codeBlock(
                                            `• Bois : ${parseInt(process.env.CONSO_BRIQUETERIE_BOIS).toLocaleString('en-US')}\n` +
                                            `• Eau : ${parseInt(process.env.CONSO_BRIQUETERIE_EAU).toLocaleString('en-US')}`) +
                                        codeBlock(
                                            `• ⚡ Electricité : ${parseInt(process.env.CONSO_BRIQUETERIE_ELECTRICITE).toLocaleString('en-US')}`) + `\u200B`,
                                    inline: true
                                },
                                {
                                    name: `\u200B`,
                                    value: `- Totale : \n` +
                                        codeBlock(
                                            `• Bois : ${conso_T_briqueterie_bois.toLocaleString('en-US')}\n` +
                                            `• Eau : ${conso_T_briqueterie_eau.toLocaleString('en-US')}`) +
                                        codeBlock(
                                            `• ⚡ Electricité : ${conso_T_briqueterie_elec.toLocaleString('en-US')}`) + `\u200B`,
                                    inline: true
                                },
                                {
                                    name: `> Production :`,
                                    value: `Ressource : 🧱 brique\n` +
                                        codeBlock(
                                            `• Par usine : ${parseInt(process.env.PROD_BRIQUETERIE).toLocaleString('en-US')}\n` +
                                            `• Totale : ${prod_T_briqueterie.toLocaleString('en-US')}`) + `\u200B`
                                },
                                {
                                    name: `> En réserve :`,
                                    value: codeBlock(`• ${results[0].brique.toLocaleString('en-US')}`) + `\u200B`
                                },
                            ],
                            color: interaction.member.displayHexColor,
                            timestamp: new Date(),
                            footer: { text: `${results[0].devise}` }
                        };

                        interaction.reply({ embeds: [embed] })
                            //endregion

                        //region [Usine - Champ]
                    } else if (interaction.values == 'champ') {

                        prod_champ = Math.round(process.env.PROD_CHAMP * ((parseInt((eval(`jsonObject.${results[0].region}.nourriture`))) + 100) / 100));
                        conso_T_champ_eau = process.env.CONSO_CHAMP_EAU * results[0].champ;
                        conso_T_champ_elec = process.env.CONSO_CHAMP_ELECTRICITE * results[0].champ;

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
                                    name: `> Consommation : 💧`,
                                    value: `- Par usine : \n` +
                                        codeBlock(`• Eau : ${parseInt(process.env.CONSO_CHAMP_EAU).toLocaleString('en-US')}`) +
                                        codeBlock(
                                            `• ⚡ Electricité : ${parseInt(process.env.CONSO_CHAMP_ELECTRICITE).toLocaleString('en-US')}`) + `\u200B`,
                                    inline: true
                                },
                                {
                                    name: `\u200B`,
                                    value: `- Totale : \n` +
                                        codeBlock(`• Eau : ${conso_T_champ_eau.toLocaleString('en-US')}`) +
                                        codeBlock(
                                            `• ⚡ Electricité : ${conso_T_champ_elec.toLocaleString('en-US')}`) + `\u200B`,
                                    inline: true
                                },
                                {
                                    name: `> Production :`,
                                    value: `Ressource : 🌽 Nourriture\n` +
                                        codeBlock(
                                            `• Par usine : ${prod_champ.toLocaleString('en-US')}\n` +
                                            `• Totale : ${(prod_champ * results[0].champ).toLocaleString('en-US')}`) + `\u200B`
                                },
                                {
                                    name: `> En réserve :`,
                                    value: codeBlock(`• ${results[0].nourriture.toLocaleString('en-US')}`) + `\u200B`
                                },
                            ],
                            color: interaction.member.displayHexColor,
                            timestamp: new Date(),
                            footer: { text: `${results[0].devise}` }
                        };

                        interaction.reply({ embeds: [embed] })
                            //endregion

                        //region [Usine - Centrale électrique]
                    } else if (interaction.values == 'centrale_elec') {

                        prod_T_centrale_elec = process.env.PROD_CENTRALE_ELEC * results[0].centrale_elec;
                        prod_T_elec = process.env.PROD_CENTRALE_ELEC * results[0].centrale_elec + process.env.PROD_EOLIENNE * results[0].eolienne;
                        conso_T_centrale_elec_petrole = process.env.CONSO_CENTRALE_ELEC_PETROLE * results[0].centrale_elec;

                        var conso = process.env.CONSO_BRIQUETERIE_ELECTRICITE * results[0].briqueterie + process.env.CONSO_CHAMP_ELECTRICITE * results[0].champ + process.env.CONSO_MINE_ELECTRICITE * results[0].mine + process.env.CONSO_POMPE_A_EAU_ELECTRICITE * results[0].pompe_a_eau + process.env.CONSO_PUMPJACK_ELECTRICITE * results[0].pumpjack + process.env.CONSO_SCIERIE_ELECTRICITE * results[0].scierie + process.env.CONSO_USINE_CIVILE_ELECTRICITE * results[0].usine_civile;
                        var diff = (prod_T_elec - conso);
                        if (diff > 0) {
                            var electricite = codeBlock('py', `'${conso.toLocaleString('en-US')}/${prod_T_elec.toLocaleString('en-US')} | ${(prod_T_elec - conso).toLocaleString('en-US')}'`);
                        } else if (diff == 0) {
                            var electricite = codeBlock('fix', `${conso.toLocaleString('en-US')}/${prod_T_elec.toLocaleString('en-US')} | ${(prod_T_elec - conso).toLocaleString('en-US')}`);
                        } else {
                            var electricite = codeBlock('diff', `- ${conso.toLocaleString('en-US')}/${prod_T_elec.toLocaleString('en-US')} | ${(prod_T_elec - conso).toLocaleString('en-US')}`);
                        };

                        const embed = {
                            author: {
                                name: `${results[0].rang} de ${results[0].nom}`,
                                icon_url: interaction.member.displayAvatarURL()
                            },
                            thumbnail: {
                                url: `${results[0].drapeau}`,
                            },
                            title: `\`Usine : Centrale électrique\``,
                            fields: [{
                                    name: `> Consommation : 🛢️`,
                                    value: `- Par usine : \n` +
                                        codeBlock(`• Pétrole : ${parseInt(process.env.CONSO_CENTRALE_ELEC_PETROLE).toLocaleString('en-US')}`) + `\u200B`,
                                    inline: true
                                },
                                {
                                    name: `\u200B`,
                                    value: `- Totale : \n` +
                                        codeBlock(`• Petrole : ${conso_T_centrale_elec_petrole.toLocaleString('en-US')}`) + `\u200B`,
                                    inline: true
                                },
                                {
                                    name: `> Production :`,
                                    value: `Flux : ⚡ Electricité\n` +
                                        codeBlock(
                                            `• Par usine : ${parseInt(process.env.PROD_CENTRALE_ELEC).toLocaleString('en-US')}\n` +
                                            `• Totale : ${prod_T_centrale_elec.toLocaleString('en-US')}`) + `\u200B`
                                },
                                {
                                    name: `> Flux :`,
                                    value: electricite + `\u200B`
                                },
                            ],
                            color: interaction.member.displayHexColor,
                            timestamp: new Date(),
                            footer: { text: `${results[0].devise}` }
                        };

                        interaction.reply({ embeds: [embed] })
                            //endregion

                        //region [Usine - Eolienne]
                    } else if (interaction.values == 'eolienne') {

                        prod_T_eolienne = process.env.PROD_EOLIENNE * results[0].eolienne;
                        prod_T_elec = process.env.PROD_CENTRALE_ELEC * results[0].centrale_elec + process.env.PROD_EOLIENNE * results[0].eolienne;

                        var conso = process.env.CONSO_BRIQUETERIE_ELECTRICITE * results[0].briqueterie + process.env.CONSO_CHAMP_ELECTRICITE * results[0].champ + process.env.CONSO_MINE_ELECTRICITE * results[0].mine + process.env.CONSO_POMPE_A_EAU_ELECTRICITE * results[0].pompe_a_eau + process.env.CONSO_PUMPJACK_ELECTRICITE * results[0].pumpjack + process.env.CONSO_SCIERIE_ELECTRICITE * results[0].scierie + process.env.CONSO_USINE_CIVILE_ELECTRICITE * results[0].usine_civile;
                        var diff = (prod_T_elec - conso);
                        if (diff > 0) {
                            var electricite = codeBlock('py', `'${conso.toLocaleString('en-US')}/${prod_T_elec.toLocaleString('en-US')} | ${(prod_T_elec - conso).toLocaleString('en-US')}'`);
                        } else if (diff == 0) {
                            var electricite = codeBlock('fix', `${conso.toLocaleString('en-US')}/${prod_T_elec.toLocaleString('en-US')} | ${(prod_T_elec - conso).toLocaleString('en-US')}`);
                        } else {
                            var electricite = codeBlock('diff', `- ${conso.toLocaleString('en-US')}/${prod_T_elec.toLocaleString('en-US')} | ${(prod_T_elec - conso).toLocaleString('en-US')}`);
                        };

                        const embed = {
                            author: {
                                name: `${results[0].rang} de ${results[0].nom}`,
                                icon_url: interaction.member.displayAvatarURL()
                            },
                            thumbnail: {
                                url: `${results[0].drapeau}`,
                            },
                            title: `\`Usine : Eolienne\``,
                            fields: [{
                                    name: `> Production :`,
                                    value: `Flux : ⚡ Electricité\n` +
                                        codeBlock(
                                            `• Par usine : ${parseInt(process.env.PROD_EOLIENNE).toLocaleString('en-US')}\n` +
                                            `• Totale : ${prod_T_eolienne.toLocaleString('en-US')}`) + `\u200B`
                                },
                                {
                                    name: `> Flux :`,
                                    value: electricite + `\u200B`
                                },
                            ],
                            color: interaction.member.displayHexColor,
                            timestamp: new Date(),
                            footer: { text: `${results[0].devise}` }
                        };

                        interaction.reply({ embeds: [embed] })
                            //endregion

                        //region [Usine - Mine]
                    } else if (interaction.values == 'mine') {

                        prod_mine = Math.round(process.env.PROD_MINE * ((parseInt((eval(`jsonObject.${results[0].region}.metaux`))) + 100) / 100));
                        conso_T_mine_bois = process.env.CONSO_MINE_BOIS * results[0].mine;
                        conso_T_mine_petrole = process.env.CONSO_MINE_PETROLE * results[0].mine;
                        conso_T_mine_elec = process.env.CONSO_MINE_ELECTRICITE * results[0].mine;

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
                                    value: `- Par usine : 🪵🛢️\n` +
                                        codeBlock(
                                            `• Bois : ${parseInt(process.env.CONSO_MINE_BOIS).toLocaleString('en-US')}\n` +
                                            `• Pétrole : ${parseInt(process.env.CONSO_MINE_PETROLE).toLocaleString('en-US')}`) +
                                        codeBlock(
                                            `• ⚡ Electricité : ${parseInt(process.env.CONSO_MINE_ELECTRICITE).toLocaleString('en-US')}`) + `\u200B`,
                                    inline: true
                                },
                                {
                                    name: `\u200B`,
                                    value: `- Totale : \n` +
                                        codeBlock(
                                            `• Bois : ${conso_T_mine_bois.toLocaleString('en-US')}\n` +
                                            `• Pétrole : ${conso_T_mine_petrole.toLocaleString('en-US')}`) +
                                        codeBlock(
                                            `• ⚡ Electricité : ${conso_T_mine_elec.toLocaleString('en-US')}`) + `\u200B`,
                                    inline: true
                                },
                                {
                                    name: `> Production :`,
                                    value: `Ressource : 🪨 Métaux\n` +
                                        codeBlock(
                                            `• Par usine : ${prod_mine.toLocaleString('en-US')}\n` +
                                            `• Totale : ${(prod_mine * results[0].mine).toLocaleString('en-US')}`) + `\u200B`
                                },
                                {
                                    name: `> En réserve :`,
                                    value: codeBlock(`• ${results[0].metaux.toLocaleString('en-US')}`) + `\u200B`
                                },
                            ],
                            color: interaction.member.displayHexColor,
                            timestamp: new Date(),
                            footer: { text: `${results[0].devise}` }
                        };

                        interaction.reply({ embeds: [embed] })
                            //endregion

                        //region [Usine - Pompe à eau]
                    } else if (interaction.values == 'pompe_a_eau') {

                        prod_pompe_a_eau = Math.round(process.env.PROD_POMPE_A_EAU * ((parseInt((eval(`jsonObject.${results[0].region}.eau`))) + 100) / 100));
                        conso_T_pompe_a_eau_petrole = process.env.CONSO_POMPE_A_EAU_PETROLE * results[0].pompe_a_eau;
                        conso_T_pompe_a_eau_elec = process.env.CONSO_POMPE_A_EAU_ELECTRICITE * results[0].pompe_a_eau;

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
                                    name: `> Consommation : 🛢️`,
                                    value: `- Par usine : \n` +
                                        codeBlock(`• Pétrole : ${parseInt(process.env.CONSO_POMPE_A_EAU_PETROLE).toLocaleString('en-US')}\n`) +
                                        codeBlock(
                                            `• ⚡ Electricité : ${parseInt(process.env.CONSO_POMPE_A_EAU_ELECTRICITE).toLocaleString('en-US')}`) + `\u200B`,
                                    inline: true
                                },
                                {
                                    name: `\u200B`,
                                    value: `- Totale : \n` +
                                        codeBlock(`• Pétrole : ${conso_T_pompe_a_eau_petrole.toLocaleString('en-US')}`) +
                                        codeBlock(
                                            `• ⚡ Electricité : ${conso_T_pompe_a_eau_elec.toLocaleString('en-US')}`) + `\u200B`,
                                    inline: true
                                },
                                {
                                    name: `> Production :`,
                                    value: `Ressource : 💧 Eau\n` +
                                        codeBlock(
                                            `• Par usine : ${prod_pompe_a_eau.toLocaleString('en-US')}\n` +
                                            `• Totale : ${(prod_pompe_a_eau * results[0].pompe_a_eau).toLocaleString('en-US')}`) + `\u200B`
                                },
                                {
                                    name: `> En réserve :`,
                                    value: codeBlock(`• ${results[0].eau.toLocaleString('en-US')}`) + `\u200B`
                                },
                            ],
                            color: interaction.member.displayHexColor,
                            timestamp: new Date(),
                            footer: { text: `${results[0].devise}` }
                        };

                        interaction.reply({ embeds: [embed] })
                            //endregion

                        //region [Usine - Pumpjack]
                    } else if (interaction.values == 'pumpjack') {

                        prod_pumpjack = Math.round(process.env.PROD_PUMPJACK * ((parseInt((eval(`jsonObject.${results[0].region}.petrole`))) + 100) / 100));
                        conso_T_pumpjack_elec = process.env.CONSO_PUMPJACK_ELECTRICITE * results[0].pumpjack;

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
                                        codeBlock(
                                            `• ⚡ Electricité : ${parseInt(process.env.CONSO_PUMPJACK_ELECTRICITE).toLocaleString('en-US')}`) + `\u200B`,
                                    inline: true
                                },
                                {
                                    name: `\u200B`,
                                    value: `- Totale : \n` +
                                        codeBlock(
                                            `• ⚡ Electricité : ${conso_T_pumpjack_elec.toLocaleString('en-US')}`) + `\u200B`,
                                    inline: true
                                },
                                {
                                    name: `> Production :`,
                                    value: `Ressource : 🛢️ Pétrole\n` +
                                        codeBlock(
                                            `• Par usine : ${prod_pumpjack.toLocaleString('en-US')}\n` +
                                            `• Totale : ${(prod_pumpjack * results[0].pumpjack).toLocaleString('en-US')}`) + `\u200B`
                                },
                                {
                                    name: `> En réserve :`,
                                    value: codeBlock(`• ${results[0].petrole.toLocaleString('en-US')}`) + `\u200B`
                                },
                            ],
                            color: interaction.member.displayHexColor,
                            timestamp: new Date(),
                            footer: { text: `${results[0].devise}` }
                        };

                        interaction.reply({ embeds: [embed] })
                            //endregion

                        //region [Usine - Scierie]
                    } else if (interaction.values == 'scierie') {

                        prod_scierie = Math.round(process.env.PROD_SCIERIE * ((parseInt((eval(`jsonObject.${results[0].region}.bois`))) + 100) / 100));
                        conso_T_scierie_petrole = process.env.CONSO_SCIERIE_PETROLE * results[0].scierie;
                        conso_T_scierie_elec = process.env.CONSO_SCIERIE_ELECTRICITE * results[0].scierie;

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
                                    name: `> Consommation : 🛢️`,
                                    value: `- Par usine : \n` +
                                        codeBlock(`• Pétrole : ${parseInt(process.env.CONSO_SCIERIE_PETROLE).toLocaleString('en-US')}`) +
                                        codeBlock(
                                            `• ⚡ Electricité : ${parseInt(process.env.CONSO_SCIERIE_ELECTRICITE).toLocaleString('en-US')}`) + `\u200B`,
                                    inline: true
                                },
                                {
                                    name: `\u200B`,
                                    value: `- Totale : \n` +
                                        codeBlock(`• Pétrole : ${conso_T_scierie_petrole.toLocaleString('en-US')}`) +
                                        codeBlock(
                                            `• ⚡ Electricité : ${conso_T_scierie_elec.toLocaleString('en-US')}`) + `\u200B`,
                                    inline: true
                                },
                                {
                                    name: `> Production :`,
                                    value: `Ressource : 🪵 Bois\n` +
                                        codeBlock(
                                            `• Par usine : ${prod_scierie.toLocaleString('en-US')}\n` +
                                            `• Totale : ${(prod_scierie * results[0].scierie).toLocaleString('en-US')}`) + `\u200B`
                                },
                                {
                                    name: `> En réserve :`,
                                    value: codeBlock(`• ${results[0].bois.toLocaleString('en-US')}`) + `\u200B`
                                },
                            ],
                            color: interaction.member.displayHexColor,
                            timestamp: new Date(),
                            footer: { text: `${results[0].devise}` }
                        };

                        interaction.reply({ embeds: [embed] })
                            //endregion

                        //region [Usine - Usine civile]
                    } else if (interaction.values == 'usine_civile') {

                        prod_T_usine_civile = process.env.PROD_USINE_CIVILE * results[0].usine_civile;
                        conso_T_usine_civile_bois = process.env.CONSO_USINE_CIVILE_BOIS * results[0].usine_civile;
                        conso_T_usine_civile_metaux = process.env.CONSO_USINE_CIVILE_METAUX * results[0].usine_civile;
                        conso_T_usine_civile_petrole = process.env.CONSO_USINE_CIVILE_PETROLE * results[0].usine_civile;
                        conso_T_usine_civile_elec = process.env.CONSO_USINE_CIVILE_ELECTRICITE * results[0].usine_civile;

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
                                    name: `> Consommation : 🪵🪨🛢️`,
                                    value: `- Par usine : \n` +
                                        codeBlock(
                                            `• Bois : ${parseInt(process.env.CONSO_USINE_CIVILE_BOIS).toLocaleString('en-US')}\n` +
                                            `• Métaux : ${parseInt(process.env.CONSO_USINE_CIVILE_METAUX).toLocaleString('en-US')}\n` +
                                            `• Pétrole : ${parseInt(process.env.CONSO_USINE_CIVILE_PETROLE).toLocaleString('en-US')}\n`) +
                                        codeBlock(
                                            `• ⚡ Electricité : ${parseInt(process.env.CONSO_USINE_CIVILE_ELECTRICITE).toLocaleString('en-US')}`) + `\u200B`,
                                    inline: true
                                },
                                {
                                    name: `\u200B`,
                                    value: `- Totale :\n` +
                                        codeBlock(
                                            `• Bois : ${conso_T_usine_civile_bois.toLocaleString('en-US')}\n` +
                                            `• Métaux : ${conso_T_usine_civile_metaux.toLocaleString('en-US')}\n` +
                                            `• Pétrole : ${conso_T_usine_civile_petrole.toLocaleString('en-US')}`) +
                                        codeBlock(
                                            `• ⚡ Electricité : ${conso_T_usine_civile_elec.toLocaleString('en-US')}`) + `\u200B`,
                                    inline: true
                                },
                                {
                                    name: `> Production :`,
                                    value: `Ressource : 💻 Biens de consommation\n` +
                                        codeBlock(
                                            `• Par usine : ${parseInt(process.env.PROD_USINE_CIVILE).toLocaleString('en-US')}\n` +
                                            `• Totale : ${prod_T_usine_civile.toLocaleString('en-US')}`) + `\u200B`
                                },
                                {
                                    name: `> En réserve :`,
                                    value: codeBlock(`• ${results[0].bc.toLocaleString('en-US')}`) + `\u200B`
                                },
                            ],
                            color: interaction.member.displayHexColor,
                            timestamp: new Date(),
                            footer: { text: `${results[0].devise}` }
                        };

                        interaction.reply({ embeds: [embed] })
                            //endregion
                    }
                });

                //#region [Roles]
            } else if (interaction.customId == 'roles') {

                if (interaction.values.indexOf('annonce') != '-1') {
                    let role = interaction.guild.roles.cache.find(r => r.name === "📢 » Annonce");
                    interaction.member.roles.add(role)
                } else {
                    let role = interaction.guild.roles.cache.find(r => r.name === "📢 » Annonce");
                    interaction.member.roles.remove(role)
                }

                if (interaction.values.indexOf('concours') != '-1') {
                    let role = interaction.guild.roles.cache.find(r => r.name === "🏆 » Compétition");
                    interaction.member.roles.add(role)
                } else {
                    let role = interaction.guild.roles.cache.find(r => r.name === "🏆 » Compétition");
                    interaction.member.roles.remove(role)
                }

                if (interaction.values.indexOf('giveaway') != '-1') {
                    let role = interaction.guild.roles.cache.find(r => r.name === "🎁 » Giveaway");
                    interaction.member.roles.add(role)
                } else {
                    let role = interaction.guild.roles.cache.find(r => r.name === "🎁 » Giveaway");
                    interaction.member.roles.remove(role)
                }

                if (interaction.values.indexOf('animation') != '-1') {
                    let role = interaction.guild.roles.cache.find(r => r.name === "🧩 » Animation");
                    interaction.member.roles.add(role)
                } else {
                    let role = interaction.guild.roles.cache.find(r => r.name === "🧩 » Animation");
                    interaction.member.roles.remove(role)
                }

                if (interaction.values.indexOf('mise_a_jour') != '-1') {
                    let role = interaction.guild.roles.cache.find(r => r.name === "🎮 » Mise à jour");
                    interaction.member.roles.add(role)
                } else {
                    let role = interaction.guild.roles.cache.find(r => r.name === "🎮 » Mise à jour");
                    interaction.member.roles.remove(role)
                }

                interaction.reply('👍');
                wait(15000)
                interaction.deleteReply();
            } //endregion
        };
    }
};