const { codeBlock } = require('@discordjs/builders');
const { Client, Collection, Intents, Guild } = require('discord.js');
const { readFileSync, writeFileSync } = require('fs');
const { connection } = require('../index.js');
const dotenv = require('dotenv');
var Chance = require('chance');
var chance = new Chance();
const ms = require('ms');

module.exports = {
    name: 'ready',
    once: true,
    execute(client) {
        console.log(`Lancé sous le bot ${client.user.tag}`);

        const arrayStatut = [{
                type: 'PLAYING',
                content: '🌍 𝐏𝐀𝐙 𝐍𝐀𝐓𝐈𝐎𝐍 👑',
                status: 'online'
            },
            {
                type: 'WATCHING',
                content: '🖥️ Subcher Dev #1',
                status: 'dnd'
            },
            {
                type: 'WATCHING',
                content: '👑 Fexiop Owner #1',
                status: 'dnd'
            },
            {
                type: 'WATCHING',
                content: '🧮 Arkylon Stats #1',
                status: 'dnd'
            },
            {
                type: 'WATCHING',
                content: '🛎️ Lumber Guide #1',
                status: 'dnd'
            },
            {
                type: 'WATCHING',
                content: '🏹 Dus Mod #1',
                status: 'dnd'
            },
            {
                type: 'LISTENING',
                content: `ping: ${client.ws.ping}ms`,
                status: 'idle'
            }
        ]
        async function pickPresence() {
            const option = Math.floor(Math.random() * arrayStatut.length);

            try {
                await client.user.setPresence({
                    activities: [{
                        name: arrayStatut[option].content,
                        type: arrayStatut[option].type
                    }],
                    status: arrayStatut[option].status
                });
            } catch (error) {
                console.log(error)
            }
        }
        setInterval(pickPresence, ms('5s'));

        async function autoUpdate() {
            const jsonObject = JSON.parse(readFileSync('data/region.json', 'utf-8'));

            var sql = `SELECT * FROM pays`;
            connection.query(sql, async(err, results) => {

                var arrayPays = Object.values(results);
                arrayPays.forEach(chaquePays);

                function chaquePays(value, index, array) {
                    var id = Object.values(value);
                    array[index] = id[1];

                    var sql = `SELECT * FROM pays WHERE id_joueur="${id[1]}"`;
                    connection.query(sql, async(err, results) => {
                        var stats = results;
                        var prod_elec = process.env.PROD_CENTRALE_ELEC * stats[0].centrale_elec + process.env.PROD_EOLIENNE * stats[0].eolienne;
                        var conso_elec = process.env.CONSO_BRIQUETERIE_ELECTRICITE * stats[0].briqueterie + process.env.CONSO_CHAMP_ELECTRICITE * stats[0].champ + process.env.CONSO_MINE_ELECTRICITE * stats[0].mine + process.env.CONSO_POMPE_A_EAU_ELECTRICITE * stats[0].pompe_a_eau + process.env.CONSO_PUMPJACK_ELECTRICITE * stats[0].pumpjack + process.env.CONSO_SCIERIE_ELECTRICITE * stats[0].scierie + process.env.CONSO_USINE_CIVILE_ELECTRICITE * stats[0].usine_civile;

                        if (stats[0].petrole < (process.env.CONSO_CENTRALE_ELEC_PETROLE * stats[0].centrale_elec) && conso_elec > (process.env.PROD_EOLIENNE * stats[0].eolienne)) {

                            var embed = {
                                author: {
                                    name: `${stats[0].rang} de ${stats[0].nom}`,
                                    icon_url: stats[0].avatarURL
                                },
                                thumbnail: {
                                    url: `${stats[0].drapeau}`,
                                },
                                title: `\`Pas assez d'électricité : Blackout\``,
                                fields: {
                                    name: `> ⛔ Manque de pétrole ⛔ :`,
                                    value: `Vos usines n'ont pas produit\n` +
                                        `Pétrole : ${stats[0].petrole.toLocaleString('en-US')}/${(process.env.CONSO_CENTRALE_ELEC_PETROLE * stats[0].centrale_elec).toLocaleString('en-US')}\n`
                                },
                                color: 'RED',
                                timestamp: new Date(),
                                footer: {
                                    text: stats[0].devise
                                }
                            };

                            client.channels.cache.get(stats[0].id_salon).send({ embeds: [embed] })
                                .catch(console.error);

                        } else if (prod_elec > conso_elec) {

                            var sql = `SELECT * FROM pays WHERE id_joueur="${id[1]}";
                            UPDATE pays SET petrole=petrole-${process.env.CONSO_CENTRALE_ELEC_PETROLE * stats[0].centrale_elec} WHERE id_joueur='${id[1]}'`;
                            connection.query(sql, async(err, results) => {
                                let stats = results[0];
                                var conso_briqueterie = true

                                var conso_T_briqueterie_bois = process.env.CONSO_BRIQUETERIE_BOIS * stats[0].briqueterie;
                                if (conso_T_briqueterie_bois > stats[0].bois) {
                                    var conso_briqueterie = false
                                    var manque_bois = true
                                }

                                var conso_T_briqueterie_eau = process.env.CONSO_BRIQUETERIE_EAU * stats[0].briqueterie;
                                if (conso_T_briqueterie_eau > stats[0].eau) {
                                    var conso_briqueterie = false
                                    var manque_eau = true
                                }

                                if (conso_briqueterie == true) {

                                    var prod_T_briqueterie = process.env.PROD_BRIQUETERIE * stats[0].briqueterie;
                                    var sql = `
                                    UPDATE pays SET bois=bois-${conso_T_briqueterie_bois} WHERE id_joueur="${id[1]}";
                                    UPDATE pays SET eau=eau-${conso_T_briqueterie_eau} WHERE id_joueur="${id[1]}";
                                    UPDATE pays SET brique=brique+${prod_T_briqueterie} WHERE id_joueur="${id[1]}"`;
                                    connection.query(sql, async(err, results) => {
                                        if (err) {
                                            throw err;
                                        }
                                    })

                                } else {
                                    var manque = [];
                                    if (manque_bois == true) {
                                        manque.push({
                                            name: `> ⛔ Manque de bois ⛔ :`,
                                            value: `Bois : ${stats[0].bois.toLocaleString('en-US')}/${conso_T_briqueterie_bois.toLocaleString('en-US')}\n`
                                        })
                                    }
                                    if (manque_eau == true) {
                                        manque.push({
                                            name: `> ⛔ Manque d\'eau ⛔ :`,
                                            value: `Eau : ${stats[0].eau.toLocaleString('en-US')}/${conso_T_briqueterie_eau.toLocaleString('en-US')}\n`
                                        })
                                    }

                                    var embed = {
                                        author: {
                                            name: `${stats[0].rang} de ${stats[0].nom}`,
                                            icon_url: stats[0].avatarURL
                                        },
                                        thumbnail: {
                                            url: `${stats[0].drapeau}`,
                                        },
                                        title: `\`Manque de matériaux : Briqueterie\``,
                                        fields: manque,
                                        color: 'RED',
                                        timestamp: new Date(),
                                        footer: { text: `${stats[0].devise}` }
                                    };

                                    client.channels.cache.get(stats[0].id_salon).send({ embeds: [embed] })
                                        .catch(console.error);
                                }
                            })

                            var sql = `SELECT * FROM pays WHERE id_joueur="${id[1]}"`;
                            connection.query(sql, async(err, results) => {
                                let stats = results;
                                var conso_champ = true

                                var conso_T_champ_eau = process.env.CONSO_CHAMP_EAU * stats[0].champ;
                                if (conso_T_champ_eau > stats[0].eau) {
                                    var conso_champ = false
                                    var manque_eau = true
                                }

                                if (conso_champ == true) {
                                    var prod_T_champ = Math.round(process.env.PROD_CHAMP * stats[0].champ * ((parseInt((eval(`jsonObject.${stats[0].region}.nourriture`))) + 100) / 100));
                                    var sql = `
                                    UPDATE pays SET eau=eau-${conso_T_champ_eau} WHERE id_joueur="${id[1]}";
                                    UPDATE pays SET nourriture=nourriture+${prod_T_champ} WHERE id_joueur="${id[1]}"`;
                                    connection.query(sql, async(err, results) => {})

                                } else {
                                    var manque = [];
                                    if (manque_eau == true) {
                                        manque.push({
                                            name: `> ⛔ Manque d\'eau ⛔ :`,
                                            value: `Eau : ${stats[0].eau.toLocaleString('en-US')}/${conso_T_champ_eau.toLocaleString('en-US')}\n`
                                        })
                                    }

                                    var embed = {
                                        author: {
                                            name: `${stats[0].rang} de ${stats[0].nom}`,
                                            icon_url: stats[0].avatarURL
                                        },
                                        thumbnail: {
                                            url: `${stats[0].drapeau}`,
                                        },
                                        title: `\`Manque de matériaux : Champ\``,
                                        fields: manque,
                                        color: 'RED',
                                        timestamp: new Date(),
                                        footer: { text: `${stats[0].devise}` }
                                    };

                                    client.channels.cache.get(stats[0].id_salon).send({ embeds: [embed] })
                                        .catch(console.error);
                                }
                            })

                            var sql = `SELECT * FROM pays WHERE id_joueur="${id[1]}"`;
                            connection.query(sql, async(err, results) => {
                                let stats = results;
                                var conso_mine = true

                                var conso_T_mine_bois = process.env.CONSO_MINE_BOIS * stats[0].mine;
                                if (conso_T_mine_bois > stats[0].bois) {
                                    var conso_mine = false
                                    var manque_bois = true
                                }

                                var conso_T_mine_petrole = process.env.CONSO_MINE_PETROLE * stats[0].mine;
                                if (conso_T_mine_petrole > stats[0].petrole) {
                                    var conso_mine = false
                                    var manque_petrole = true
                                }

                                if (conso_mine == true) {

                                    var prod_T_mine = Math.round(process.env.PROD_MINE * stats[0].mine * ((parseInt((eval(`jsonObject.${stats[0].region}.metaux`))) + 100) / 100));
                                    var sql = `
                                        UPDATE pays SET bois=bois-${conso_T_mine_bois} WHERE id_joueur="${id[1]}";
                                        UPDATE pays SET petrole=petrole-${conso_T_mine_petrole} WHERE id_joueur="${id[1]}";
                                        UPDATE pays SET metaux=metaux+${prod_T_mine} WHERE id_joueur="${id[1]}"`;
                                    connection.query(sql, async(err, results) => {
                                        if (err) {
                                            throw err;
                                        }
                                    })

                                } else {
                                    var manque = [];
                                    if (manque_bois == true) {
                                        manque.push({
                                            name: `> ⛔ Manque de bois ⛔ :`,
                                            value: `Bois : ${stats[0].bois.toLocaleString('en-US')}/${conso_T_mine_bois.toLocaleString('en-US')}\n`
                                        })
                                    }
                                    if (manque_petrole == true) {
                                        manque.push({
                                            name: `> ⛔ Manque de pétrole ⛔ :`,
                                            value: `Pétrole : ${stats[0].petrole.toLocaleString('en-US')}/${conso_T_mine_petrole.toLocaleString('en-US')}\n`
                                        })
                                    }

                                    var embed = {
                                        author: {
                                            name: `${stats[0].rang} de ${stats[0].nom}`,
                                            icon_url: stats[0].avatarURL
                                        },
                                        thumbnail: {
                                            url: `${stats[0].drapeau}`,
                                        },
                                        title: `\`Manque de matériaux : Mine\``,
                                        fields: manque,
                                        color: 'RED',
                                        timestamp: new Date(),
                                        footer: { text: `${stats[0].devise}` }
                                    };

                                    client.channels.cache.get(stats[0].id_salon).send({ embeds: [embed] })
                                        .catch(console.error);
                                }
                            })

                            var sql = `SELECT * FROM pays WHERE id_joueur="${id[1]}"`;
                            connection.query(sql, async(err, results) => {
                                let stats = results;
                                var conso_pompe_a_eau = true

                                var conso_T_pompe_a_eau_petrole = process.env.CONSO_POMPE_A_EAU_PETROLE * stats[0].pompe_a_eau;
                                if (conso_T_pompe_a_eau_petrole > stats[0].petrole) {
                                    var conso_pompe_a_eau = false
                                    var manque_petrole = true
                                }

                                if (conso_pompe_a_eau == true) {

                                    var prod_T_pompe_a_eau = Math.round(process.env.PROD_POMPE_A_EAU * stats[0].pompe_a_eau * ((parseInt((eval(`jsonObject.${stats[0].region}.eau`))) + 100) / 100));
                                    var sql = `
                                        UPDATE pays SET petrole=petrole-${conso_T_pompe_a_eau_petrole} WHERE id_joueur="${id[1]}";
                                        UPDATE pays SET eau=eau+${prod_T_pompe_a_eau} WHERE id_joueur="${id[1]}"`;
                                    connection.query(sql, async(err, results) => {})

                                } else {
                                    var manque = [];
                                    if (manque_petrole == true) {
                                        manque.push({
                                            name: `> ⛔ Manque de pétrole ⛔ :`,
                                            value: `Pétrole : ${stats[0].petrole.toLocaleString('en-US')}/${conso_T_pompe_a_eau_petrole.toLocaleString('en-US')}\n`
                                        })
                                    }

                                    var embed = {
                                        author: {
                                            name: `${stats[0].rang} de ${stats[0].nom}`,
                                            icon_url: stats[0].avatarURL
                                        },
                                        thumbnail: {
                                            url: `${stats[0].drapeau}`,
                                        },
                                        title: `\`Manque de matériaux : Pompe à eau\``,
                                        fields: manque,
                                        color: 'RED',
                                        timestamp: new Date(),
                                        footer: { text: `${stats[0].devise}` }
                                    };

                                    client.channels.cache.get(stats[0].id_salon).send({ embeds: [embed] })
                                        .catch(console.error);
                                }
                            })

                            var sql = `SELECT * FROM pays WHERE id_joueur="${id[1]}"`;
                            connection.query(sql, async(err, results) => {
                                let stats = results;
                                var conso_pumpjack = true

                                if (conso_pumpjack == true) {

                                    var prod_T_pumpjack = Math.round(process.env.PROD_PUMPJACK * stats[0].pumpjack * ((parseInt((eval(`jsonObject.${stats[0].region}.petrole`))) + 100) / 100));
                                    var sql = `
                                        UPDATE pays SET petrole=petrole+${prod_T_pumpjack} WHERE id_joueur="${id[1]}"`;
                                    connection.query(sql, async(err, results) => {})

                                } else {

                                    var embed = {
                                        author: {
                                            name: `${stats[0].rang} de ${stats[0].nom}`,
                                            icon_url: stats[0].avatarURL
                                        },
                                        thumbnail: {
                                            url: `${stats[0].drapeau}`,
                                        },
                                        title: `\`Manque de matériaux : Pumpjack\``,
                                        fields: manque,
                                        color: 'RED',
                                        timestamp: new Date(),
                                        footer: { text: `${stats[0].devise}` }
                                    };

                                    client.channels.cache.get(stats[0].id_salon).send({ embeds: [embed] })
                                        .catch(console.error);
                                }
                            })

                            var sql = `SELECT * FROM pays WHERE id_joueur="${id[1]}"`;
                            connection.query(sql, async(err, results) => {
                                let stats = results;
                                var conso_scierie = true

                                var conso_T_scierie_petrole = process.env.CONSO_SCIERIE_PETROLE * stats[0].scierie;
                                if (conso_T_scierie_petrole > stats[0].petrole) {
                                    var conso_scierie = false
                                    var manque_petrole = true
                                }

                                if (conso_scierie == true) {

                                    var prod_T_scierie = Math.round(process.env.PROD_SCIERIE * stats[0].scierie * ((parseInt((eval(`jsonObject.${stats[0].region}.bois`))) + 100) / 100));
                                    var sql = `
                                        UPDATE pays SET petrole=petrole-${conso_T_scierie_petrole} WHERE id_joueur="${id[1]}";
                                        UPDATE pays SET bois=bois+${prod_T_scierie} WHERE id_joueur="${id[1]}"`;
                                    connection.query(sql, async(err, results) => {});

                                } else {
                                    var manque = [];
                                    if (manque_petrole == true) {
                                        manque.push({
                                            name: `> ⛔ Manque de pétrole ⛔ :`,
                                            value: `Pétrole : ${stats[0].petrole.toLocaleString('en-US')}/${conso_T_scierie_petrole.toLocaleString('en-US')}\n`
                                        })
                                    }

                                    var embed = {
                                        author: {
                                            name: `${stats[0].rang} de ${stats[0].nom}`,
                                            icon_url: stats[0].avatarURL
                                        },
                                        thumbnail: {
                                            url: `${stats[0].drapeau}`,
                                        },
                                        title: `\`Manque de matériaux : Scierie\``,
                                        fields: manque,
                                        color: 'RED',
                                        timestamp: new Date(),
                                        footer: { text: `${stats[0].devise}` }
                                    };

                                    client.channels.cache.get(stats[0].id_salon).send({ embeds: [embed] })
                                        .catch(console.error);
                                }
                            })

                            var sql = `SELECT * FROM pays WHERE id_joueur="${id[1]}"`;
                            connection.query(sql, async(err, results) => {
                                let stats = results;
                                var conso_usine_civile = true

                                var conso_T_usine_civile_bois = process.env.CONSO_USINE_CIVILE_BOIS * stats[0].usine_civile;
                                if (conso_T_usine_civile_bois > stats[0].bois) {
                                    var conso_usine_civile = false
                                    var manque_bois = true
                                }

                                var conso_T_usine_civile_metaux = process.env.CONSO_USINE_CIVILE_METAUX * stats[0].usine_civile;
                                if (conso_T_usine_civile_metaux > stats[0].metaux) {
                                    var conso_usine_civile = false
                                    var manque_metaux = true
                                }

                                var conso_T_usine_civile_petrole = process.env.CONSO_USINE_CIVILE_PETROLE * stats[0].usine_civile;
                                if (conso_T_usine_civile_petrole > stats[0].petrole) {
                                    var conso_usine_civile = false
                                    var manque_petrole = true
                                }

                                if (conso_usine_civile == true) {

                                    var prod_T_usine_civile = process.env.PROD_USINE_CIVILE * stats[0].usine_civile;
                                    var sql = `
                                        UPDATE pays SET bois=bois-${conso_T_usine_civile_bois} WHERE id_joueur="${id[1]}";
                                        UPDATE pays SET metaux=metaux-${conso_T_usine_civile_metaux} WHERE id_joueur="${id[1]}";
                                        UPDATE pays SET petrole=petrole-${conso_T_usine_civile_petrole} WHERE id_joueur="${id[1]}";
                                        UPDATE pays SET bc=bc+${prod_T_usine_civile} WHERE id_joueur="${id[1]}"`;
                                    connection.query(sql, async(err, results) => {})

                                } else {
                                    var manque = [];
                                    if (manque_bois == true) {
                                        manque.push({
                                            name: `> ⛔ Manque de bois ⛔ :`,
                                            value: `Bois : ${stats[0].bois.toLocaleString('en-US')}/${conso_T_usine_civile_bois.toLocaleString('en-US')}\n`
                                        })
                                    }
                                    if (manque_metaux == true) {
                                        manque.push({
                                            name: `> ⛔ Manque de métaux ⛔ :`,
                                            value: `Métaux : ${stats[0].metaux.toLocaleString('en-US')}/${conso_T_usine_civile_metaux.toLocaleString('en-US')}\n`
                                        })
                                    }
                                    if (manque_petrole == true) {
                                        manque.push({
                                            name: `> ⛔ Manque de pétrole ⛔ :`,
                                            value: `Pétrole : ${stats[0].petrole.toLocaleString('en-US')}/${conso_T_usine_civile_petrole.toLocaleString('en-US')}\n`
                                        })
                                    }

                                    var embed = {
                                        author: {
                                            name: `${stats[0].rang} de ${stats[0].nom}`,
                                            icon_url: stats[0].avatarURL
                                        },
                                        thumbnail: {
                                            url: `${stats[0].drapeau}`,
                                        },
                                        title: `\`Manque de matériaux : Usine civile\``,
                                        fields: manque,
                                        color: 'RED',
                                        timestamp: new Date(),
                                        footer: {
                                            text: stats[0].devise
                                        }
                                    };

                                    client.channels.cache.get(stats[0].id_salon).send({ embeds: [embed] })
                                        .catch(console.error);
                                }
                            });

                        } else {
                            var sql = `SELECT * FROM pays WHERE id_joueur="${id[1]}"`;
                            connection.query(sql, async(err, results) => {
                                let stats = results;
                                var embed = {
                                    author: {
                                        name: `${stats[0].rang} de ${stats[0].nom}`,
                                        icon_url: stats[0].avatarURL
                                    },
                                    thumbnail: {
                                        url: `${stats[0].drapeau}`,
                                    },
                                    title: `\`Pas assez d'électricité : Blackout\``,
                                    fields: {
                                        name: `> ⛔ Manque d'électricité ⛔ :`,
                                        value: `Vos usines n'ont pas produit\n` +
                                            `Electricité : ${prod_elec.toLocaleString('en-US')}/${conso_elec.toLocaleString('en-US')}\n`
                                    },
                                    color: 'RED',
                                    timestamp: new Date(),
                                    footer: { text: `${stats[0].devise}` }
                                }
                                client.channels.cache.get(stats[0].id_salon).send({ embeds: [embed] })
                                    .catch(console.error);
                            })
                        }
                    });
                };
            });
        }
        setInterval(autoUpdate, ms('10m'));

        async function autoAction_diplo() {

            var sql = `
            SELECT * FROM pays`;
            connection.query(sql, async(err, results) => {
                if (err) {
                    throw err;
                }
                var arrayPays = Object.values(results);
                arrayPays.forEach(chaquePays);

                function chaquePays(value, index, array) {
                    var id = Object.values(value);
                    array[index] = id[1];

                    var sql = `SELECT * FROM pays WHERE id_joueur="${id[1]}"`;
                    connection.query(sql, async(err, results) => {
                        if (err) {
                            throw err;
                        }

                        var action_diplo = Math.round(results[0].influence * (results[0].reputation / 100)) + 10

                        var sql = `
                        UPDATE pays SET action_diplo=action_diplo+${action_diplo} WHERE id_joueur="${id[1]}"`;
                        connection.query(sql, async(err, results) => {
                            if (err) {
                                throw err;
                            }
                        })
                    })
                }
            });
        }
        setInterval(autoAction_diplo, ms('3h'));

        async function popUpdate() {

            var sql = `
                SELECT * FROM pays`;
            connection.query(sql, async(err, results) => {
                if (err) {
                    throw err;
                }
                var arrayPays = Object.values(results);
                arrayPays.forEach(chaquePays);

                function chaquePays(value, index, array) {
                    var id = Object.values(value);
                    array[index] = id[1];

                    var sql = `SELECT * FROM pays WHERE id_joueur="${id[1]}"`;
                    connection.query(sql, async(err, results) => {
                        if (err) {
                            throw err;
                        }
                        var stats = results;

                        var habitants = stats[0].population;
                        var nourriture = stats[0].nourriture;
                        var approvisionnement = stats[0].approvisionnement;

                        if (nourriture >= habitants) {
                            if (approvisionnement >= habitants) {
                                var reste = approvisionnement - habitants;
                                var naissance = Math.round(reste * 0.1);

                                var sql = `
                                UPDATE pays SET nourriture=nourriture-${approvisionnement} WHERE id_joueur="${id[1]}";
                                UPDATE pays SET population=population+${naissance} WHERE id_joueur="${id[1]}"`;
                                connection.query(sql, async(err, results) => {
                                    if (err) {
                                        throw err;
                                    }
                                })

                            } else {
                                var manque = habitants - approvisionnement;
                                var mort = Math.round(manque * 0.2);
                                var habitants_next = habitants - mort;

                                const embed = {
                                    author: {
                                        name: `${stats[0].rang} de ${stats[0].nom}`,
                                        icon_url: process.env.URL_LOGO
                                    },
                                    thumbnail: {
                                        url: `${stats[0].drapeau}`,
                                    },
                                    title: `\`Une famine frappe votre pays :\``,
                                    fields: {
                                        name: `> ⛔ Manque d'approvisionnement ⛔ :`,
                                        value: `Nourriture : ${approvisionnement.toLocaleString('en-US')}/${habitants.toLocaleString('en-US')}\n` +
                                            `Morts : ${mort.toLocaleString('en-US')}\n` +
                                            `Population restante : ${habitants_next.toLocaleString('en-US')}\n`
                                    },
                                    color: 'RED',
                                    timestamp: new Date(),
                                    footer: { text: `${results[0].devise}` }
                                };

                                client.channels.cache.get(stats[0].id_salon).send({ embeds: [embed] });

                                var sql = `
                                UPDATE pays SET nourriture=nourriture-${approvisionnement} WHERE id_joueur="${id[1]}";
                                UPDATE pays SET population=population-${mort} WHERE id_joueur="${id[1]}"`;
                                connection.query(sql, async(err, results) => {
                                    if (err) {
                                        throw err;
                                    }
                                })
                            }
                        } else {
                            var manque = habitants - nourriture
                            var mort = Math.round(manque * 0.2)
                            var habitants_next = habitants - mort

                            const embed = {
                                author: {
                                    name: `${stats[0].rang} de ${stats[0].nom}`,
                                    icon_url: process.env.URL_LOGO
                                },
                                thumbnail: {
                                    url: `${stats[0].drapeau}`,
                                },
                                title: `\`Une famine frappe votre pays :\``,
                                fields: {
                                    name: `> ⛔ Manque de nourriture ⛔ :`,
                                    value: `Nourriture : ${nourriture.toLocaleString('en-US')}/${habitants.toLocaleString('en-US')}\n` +
                                        `Morts : ${mort.toLocaleString('en-US')}\n` +
                                        `Population restante : ${habitants_next.toLocaleString('en-US')}\n`
                                },
                                color: 'RED',
                                timestamp: new Date(),
                                footer: { text: `${results[0].devise}` }
                            };

                            client.channels.cache.get(stats[0].id_salon).send({ embeds: [embed] });

                            var sql = `
                            UPDATE pays SET nourriture=0 WHERE id_joueur="${id[1]}";
                            UPDATE pays SET population=population-${mort} WHERE id_joueur="${id[1]}"`;

                            connection.query(sql, async(err, results) => {
                                if (err) {
                                    throw err;
                                }
                            })
                        }
                    })
                }
            })
        }
        setInterval(popUpdate, ms('8h'));

        async function marketUpdate() {

            bc_prix_total = 5;
            bc_res_total = 5;

            bois_prix_total = 2.5;
            bois_res_total = 2.5;

            brique_prix_total = 2.5;
            brique_res_total = 2.5;

            eau_prix_total = 2;
            eau_res_total = 2;

            metaux_prix_total = 3;
            metaux_res_total = 3;

            nourriture_prix_total = 2.5;
            nourriture_res_total = 2.5;

            petrole_prix_total = 3;
            petrole_res_total = 3;

            var sql = `
                    SELECT * FROM trade ORDER BY ressource`;
            connection.query(sql, async(err, results) => {
                if (err) {
                    throw err;
                }
                var arrayOffre = Object.values(results);
                arrayOffre.forEach(chaqueMarket);

                function chaqueMarket(value, index, array) {

                    switch (value.ressource) {
                        case 'Biens de consommation':
                            bc_prix_total += value.prix;
                            bc_res_total += value.quantite;
                        case 'Bois':
                            bois_prix_total += value.prix;
                            bois_res_total += value.quantite;
                        case 'Brique':
                            brique_prix_total += value.prix;
                            brique_res_total += value.quantite;
                        case 'Eau':
                            eau_prix_total += value.prix;
                            eau_res_total += value.quantite;
                        case 'Metaux':
                            metaux_prix_total += value.prix;
                            metaux_res_total += value.quantite;
                        case 'Nourriture':
                            nourriture_prix_total += value.prix;
                            nourriture_res_total += value.quantite;
                        case 'Petrole':
                            petrole_prix_total += value.prix;
                            petrole_res_total += value.quantite;
                    }
                }
            })

            var sql = `
                    SELECT * FROM qvente ORDER BY ressource`;
            connection.query(sql, async(err, results) => {
                if (err) {
                    throw err;
                }
                var arrayOffre = Object.values(results);
                arrayOffre.forEach(chaqueMarket);

                function chaqueMarket(value, index, array) {

                    switch (value.ressource) {
                        case 'Biens de consommation':
                            bc_prix_total += value.prix;
                            bc_res_total += value.quantite;
                        case 'Bois':
                            bois_prix_total += value.prix;
                            bois_res_total += value.quantite;
                        case 'Brique':
                            brique_prix_total += value.prix;
                            brique_res_total += value.quantite;
                        case 'Eau':
                            eau_prix_total += value.prix;
                            eau_res_total += value.quantite;
                        case 'Metaux':
                            metaux_prix_total += value.prix;
                            metaux_res_total += value.quantite;
                        case 'Nourriture':
                            nourriture_prix_total += value.prix;
                            nourriture_res_total += value.quantite;
                        case 'Petrole':
                            petrole_prix_total += value.prix;
                            petrole_res_total += value.quantite;
                    }
                }
            })

            var sql = `
                    SELECT * FROM qachat ORDER BY ressource`;
            connection.query(sql, async(err, results) => {
                if (err) {
                    throw err;
                }
                var arrayOffre = Object.values(results);
                arrayOffre.forEach(chaqueMarket);

                function chaqueMarket(value, index, array) {

                    switch (value.ressource) {
                        case 'Biens de consommation':
                            bc_prix_total += value.prix;
                            bc_res_total += value.quantite;
                        case 'Bois':
                            bois_prix_total += value.prix;
                            bois_res_total += value.quantite;
                        case 'Brique':
                            brique_prix_total += value.prix;
                            brique_res_total += value.quantite;
                        case 'Eau':
                            eau_prix_total += value.prix;
                            eau_res_total += value.quantite;
                        case 'Metaux':
                            metaux_prix_total += value.prix;
                            metaux_res_total += value.quantite;
                        case 'Nourriture':
                            nourriture_prix_total += value.prix;
                            nourriture_res_total += value.quantite;
                        case 'Petrole':
                            petrole_prix_total += value.prix;
                            petrole_res_total += value.quantite;
                    }
                }
            })

            bc_prix_moyen = bc_prix_total / bc_res_total + chance.floating({ min: 0, max: 0.1, fixed: 2 });

            bois_prix_moyen = bois_prix_total / bois_res_total + chance.floating({ min: 0, max: 0.1, fixed: 2 });

            brique_prix_moyen = brique_prix_total / brique_res_total + chance.floating({ min: 0, max: 0.1, fixed: 2 });

            eau_prix_moyen = eau_prix_total / eau_res_total + chance.floating({ min: 0, max: 0.1, fixed: 2 });

            metaux_prix_moyen = metaux_prix_total / metaux_res_total + chance.floating({ min: 0, max: 0.1, fixed: 2 });

            nourriture_prix_moyen = nourriture_prix_total / nourriture_res_total + chance.floating({ min: 0, max: 0.1, fixed: 2 });

            petrole_prix_moyen = petrole_prix_total / petrole_res_total + chance.floating({ min: 0, max: 0.1, fixed: 2 });

            const prix = {
                "bc": bc_prix_moyen.toFixed(2),
                "bois": bois_prix_moyen.toFixed(2),
                "brique": brique_prix_moyen.toFixed(2),
                "eau": eau_prix_moyen.toFixed(2),
                "metaux": metaux_prix_moyen.toFixed(2),
                "nourriture": nourriture_prix_moyen.toFixed(2),
                "petrole": petrole_prix_moyen.toFixed(2)
            };
            const jsonPrix = JSON.stringify(prix);
            writeFileSync('data/prix.json', jsonPrix)
        }
        setInterval(marketUpdate, ms('10m'));
    }
}