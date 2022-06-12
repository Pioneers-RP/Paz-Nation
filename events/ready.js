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
                if (err) {
                    throw err;
                }
                var arrayPays = Object.values(results);
                arrayPays.forEach(chaquePays);

                function chaquePays(value, index, array) {

                    var sql = `SELECT * FROM pays WHERE id_joueur="${results[index].id_joueur}"`;
                    connection.query(sql, async(err, results) => {
                        if (err) {
                            throw err;
                        }

                        //Electricité

                        var prod_elec = process.env.PROD_CENTRALE_ELEC * results[0].centrale_elec;
                        var conso_elec = process.env.CONSO_BRIQUETERIE_ELECTRICITE * results[0].briqueterie + process.env.CONSO_CHAMP_ELECTRICITE * results[0].champ + process.env.CONSO_MINE_ELECTRICITE * results[0].mine + process.env.CONSO_POMPE_A_EAU_ELECTRICITE * results[0].pompe_a_eau + process.env.CONSO_PUMPJACK_ELECTRICITE * results[0].pumpjack + process.env.CONSO_SCIERIE_ELECTRICITE * results[0].scierie + process.env.CONSO_USINE_CIVILE_ELECTRICITE * results[0].usine_civile;

                        if (prod_elec > conso_elec) {

                            var sql = `SELECT * FROM pays WHERE id_joueur="${results[0].id_joueur}"`;
                            connection.query(sql, async(err, results) => {
                                if (err) {
                                    throw err;
                                }

                                //Briqueterie
                                var conso_briqueterie = true

                                var conso_T_briqueterie_bois = process.env.CONSO_BRIQUETERIE_BOIS * results[0].briqueterie;
                                if (conso_T_briqueterie_bois > results[0].bois) {
                                    var conso_briqueterie = false
                                    var manque_bois = true
                                }

                                var conso_T_briqueterie_eau = process.env.CONSO_BRIQUETERIE_EAU * results[0].briqueterie;
                                if (conso_T_briqueterie_eau > results[0].eau) {
                                    var conso_briqueterie = false
                                    var manque_eau = true
                                }

                                if (conso_briqueterie == true) {

                                    var prod_T_briqueterie = process.env.PROD_BRIQUETERIE * results[0].briqueterie;
                                    var sql = `
                                    UPDATE pays SET bois=bois-${conso_T_briqueterie_bois} WHERE id_joueur='${results[0].id_joueur}';
                                    UPDATE pays SET eau=eau-${conso_T_briqueterie_eau} WHERE id_joueur='${results[0].id_joueur}';
                                    UPDATE pays SET brique=brique+${prod_T_briqueterie} WHERE id_joueur='${results[0].id_joueur}'`;
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
                                            value: `Bois : ${results[0].bois.toLocaleString('en-US')}/${conso_T_briqueterie_bois.toLocaleString('en-US')}\n`
                                        })
                                    }
                                    if (manque_eau == true) {
                                        manque.push({
                                            name: `> ⛔ Manque d\'eau ⛔ :`,
                                            value: `Eau : ${results[0].eau.toLocaleString('en-US')}/${conso_T_briqueterie_eau.toLocaleString('en-US')}\n`
                                        })
                                    }

                                    const embed = {
                                        author: {
                                            name: `${results[0].rang} de ${results[0].nom}`,
                                            icon_url: results[0].avatarURL
                                        },
                                        thumbnail: {
                                            url: `${results[0].drapeau}`,
                                        },
                                        title: `\`Manque de matériaux : Briqueterie\``,
                                        fields: manque,
                                        color: 'RED',
                                        timestamp: new Date(),
                                        footer: { text: `${results[0].devise}` }
                                    };

                                    const salon_joueur = client.channels.cache.get(results[0].id_salon);
                                    salon_joueur.send({ embeds: [embed] });
                                }
                            })

                            var sql = `SELECT * FROM pays WHERE id_joueur="${results[0].id_joueur}"`;
                            connection.query(sql, async(err, results) => {
                                if (err) {
                                    throw err;
                                }

                                //Champ
                                var conso_champ = true

                                var conso_T_champ_eau = process.env.CONSO_CHAMP_EAU * results[0].champ;
                                if (conso_T_champ_eau > results[0].eau) {
                                    var conso_champ = false
                                    var manque_eau = true
                                }

                                if (conso_champ == true) {

                                    var prod_T_champ = process.env.PROD_CHAMP * results[0].champ * ((parseInt((eval(`jsonObject.${results[0].region}.nourriture`))) + 100) / 100);
                                    var sql = `
                                    UPDATE pays SET eau=eau-${conso_T_champ_eau} WHERE id_joueur='${results[0].id_joueur}';
                                    UPDATE pays SET nourriture=nourriture+${prod_T_champ} WHERE id_joueur='${results[0].id_joueur}'`;
                                    connection.query(sql, async(err, results) => {
                                        if (err) {
                                            throw err;
                                        }
                                    })

                                } else {
                                    var manque = [];
                                    if (manque_eau == true) {
                                        manque.push({
                                            name: `> ⛔ Manque d\'eau ⛔ :`,
                                            value: `Eau : ${results[0].eau.toLocaleString('en-US')}/${conso_T_champ_eau.toLocaleString('en-US')}\n`
                                        })
                                    }

                                    const embed = {
                                        author: {
                                            name: `${results[0].rang} de ${results[0].nom}`,
                                            icon_url: results[0].avatarURL
                                        },
                                        thumbnail: {
                                            url: `${results[0].drapeau}`,
                                        },
                                        title: `\`Manque de matériaux : Champ\``,
                                        fields: manque,
                                        color: 'RED',
                                        timestamp: new Date(),
                                        footer: { text: `${results[0].devise}` }
                                    };

                                    const salon_joueur = client.channels.cache.get(results[0].id_salon);
                                    salon_joueur.send({ embeds: [embed] });

                                }
                            })

                            var sql = `SELECT * FROM pays WHERE id_joueur="${results[0].id_joueur}"`;
                            connection.query(sql, async(err, results) => {
                                if (err) {
                                    throw err;
                                }

                                //Mine
                                var conso_mine = true

                                var conso_T_mine_bois = process.env.CONSO_MINE_BOIS * results[0].mine;
                                if (conso_T_mine_bois > results[0].bois) {
                                    var conso_mine = false
                                    var manque_bois = true
                                }

                                var conso_T_mine_petrole = process.env.CONSO_MINE_PETROLE * results[0].mine;
                                if (conso_T_mine_petrole > results[0].petrole) {
                                    var conso_mine = false
                                    var manque_petrole = true
                                }

                                if (conso_mine == true) {

                                    var prod_T_mine = process.env.PROD_MINE * results[0].mine * ((parseInt((eval(`jsonObject.${results[0].region}.metaux`))) + 100) / 100);
                                    var sql1 = `
                                        UPDATE pays SET bois=bois-${conso_T_mine_bois} WHERE id_joueur='${results[0].id_joueur}';
                                        UPDATE pays SET petrole=petrole-${conso_T_mine_petrole} WHERE id_joueur='${results[0].id_joueur}';
                                        UPDATE pays SET metaux=metaux+${prod_T_mine} WHERE id_joueur='${results[0].id_joueur}'`;
                                    connection.query(sql1, async(err, results) => {
                                        if (err) {
                                            throw err;
                                        }
                                    })

                                } else {
                                    var manque = [];
                                    if (manque_bois == true) {
                                        manque.push({
                                            name: `> ⛔ Manque de bois ⛔ :`,
                                            value: `Bois : ${results[0].bois.toLocaleString('en-US')}/${conso_T_mine_bois.toLocaleString('en-US')}\n`
                                        })
                                    }
                                    if (manque_petrole == true) {
                                        manque.push({
                                            name: `> ⛔ Manque de pétrole ⛔ :`,
                                            value: `Pétrole : ${results[0].petrole.toLocaleString('en-US')}/${conso_T_mine_petrole.toLocaleString('en-US')}\n`
                                        })
                                    }

                                    const embed = {
                                        author: {
                                            name: `${results[0].rang} de ${results[0].nom}`,
                                            icon_url: results[0].avatarURL
                                        },
                                        thumbnail: {
                                            url: `${results[0].drapeau}`,
                                        },
                                        title: `\`Manque de matériaux : Mine\``,
                                        fields: manque,
                                        color: 'RED',
                                        timestamp: new Date(),
                                        footer: { text: `${results[0].devise}` }
                                    };

                                    const salon_joueur = client.channels.cache.get(results[0].id_salon);
                                    salon_joueur.send({ embeds: [embed] });

                                }
                            })

                            var sql = `SELECT * FROM pays WHERE id_joueur="${results[0].id_joueur}"`;
                            connection.query(sql, async(err, results) => {
                                if (err) {
                                    throw err;
                                }

                                //Pompe à eau
                                var conso_pompe_a_eau = true

                                var conso_T_pompe_a_eau_petrole = process.env.CONSO_POMPE_A_EAU_PETROLE * results[0].pompe_a_eau;
                                if (conso_T_pompe_a_eau_petrole > results[0].petrole) {
                                    var conso_pompe_a_eau = false
                                    var manque_petrole = true
                                }

                                if (conso_pompe_a_eau == true) {

                                    var prod_T_pompe_a_eau = process.env.PROD_POMPE_A_EAU * results[0].pompe_a_eau * ((parseInt((eval(`jsonObject.${results[0].region}.eau`))) + 100) / 100);
                                    var sql = `
                                        UPDATE pays SET petrole=petrole-${conso_T_pompe_a_eau_petrole} WHERE id_joueur='${results[0].id_joueur}';
                                        UPDATE pays SET eau=eau+${prod_T_pompe_a_eau} WHERE id_joueur='${results[0].id_joueur}'`;
                                    connection.query(sql, async(err, results) => {
                                        if (err) {
                                            throw err;
                                        }
                                    })

                                } else {
                                    var manque = [];
                                    if (manque_petrole == true) {
                                        manque.push({
                                            name: `> ⛔ Manque de pétrole ⛔ :`,
                                            value: `Pétrole : ${results[0].petrole.toLocaleString('en-US')}/${conso_T_pompe_a_eau_petrole.toLocaleString('en-US')}\n`
                                        })
                                    }

                                    const embed = {
                                        author: {
                                            name: `${results[0].rang} de ${results[0].nom}`,
                                            icon_url: results[0].avatarURL
                                        },
                                        thumbnail: {
                                            url: `${results[0].drapeau}`,
                                        },
                                        title: `\`Manque de matériaux : Pompe à eau\``,
                                        fields: manque,
                                        color: 'RED',
                                        timestamp: new Date(),
                                        footer: { text: `${results[0].devise}` }
                                    };

                                    const salon_joueur = client.channels.cache.get(results[0].id_salon);
                                    salon_joueur.send({ embeds: [embed] });

                                }
                            })

                            var sql = `SELECT * FROM pays WHERE id_joueur="${results[0].id_joueur}"`;
                            connection.query(sql, async(err, results) => {
                                if (err) {
                                    throw err;
                                }

                                //Pumpjack
                                var conso_pumpjack = true

                                if (conso_pumpjack == true) {

                                    var prod_T_pumpjack = process.env.PROD_PUMPJACK * results[0].pumpjack * ((parseInt((eval(`jsonObject.${results[0].region}.petrole`))) + 100) / 100);
                                    var sql = `
                                        UPDATE pays SET petrole=petrole+${prod_T_pumpjack} WHERE id_joueur='${results[0].id_joueur}'`;
                                    connection.query(sql, async(err, results) => {
                                        if (err) {
                                            throw err;
                                        }
                                    })

                                } else {

                                    const embed = {
                                        author: {
                                            name: `${results[0].rang} de ${results[0].nom}`,
                                            icon_url: results[0].avatarURL
                                        },
                                        thumbnail: {
                                            url: `${results[0].drapeau}`,
                                        },
                                        title: `\`Manque de matériaux : Pumpjack\``,
                                        fields: manque,
                                        color: 'RED',
                                        timestamp: new Date(),
                                        footer: { text: `${results[0].devise}` }
                                    };

                                    const salon_joueur = client.channels.cache.get(results[0].id_salon);
                                    salon_joueur.send({ embeds: [embed] });

                                }
                            })

                            var sql = `SELECT * FROM pays WHERE id_joueur="${results[0].id_joueur}"`;
                            connection.query(sql, async(err, results) => {
                                if (err) {
                                    throw err;
                                }

                                //Scierie
                                var conso_scierie = true

                                var conso_T_scierie_petrole = process.env.CONSO_SCIERIE_PETROLE * results[0].scierie;
                                if (conso_T_scierie_petrole > results[0].petrole) {
                                    var conso_scierie = false
                                    var manque_petrole = true
                                }

                                if (conso_scierie == true) {

                                    var prod_T_scierie = process.env.PROD_SCIERIE * results[0].scierie * ((parseInt((eval(`jsonObject.${results[0].region}.bois`))) + 100) / 100);
                                    var sql = `
                                        UPDATE pays SET petrole=petrole-${conso_T_scierie_petrole} WHERE id_joueur='${results[0].id_joueur}';
                                        UPDATE pays SET bois=bois+${prod_T_scierie} WHERE id_joueur='${results[0].id_joueur}'`;
                                    connection.query(sql, async(err, results) => {
                                        if (err) {
                                            throw err;
                                        }
                                    });

                                } else {
                                    var manque = [];
                                    if (manque_petrole == true) {
                                        manque.push({
                                            name: `> ⛔ Manque de pétrole ⛔ :`,
                                            value: `Pétrole : ${results[0].petrole.toLocaleString('en-US')}/${conso_T_scierie_petrole.toLocaleString('en-US')}\n`
                                        })
                                    }

                                    const embed = {
                                        author: {
                                            name: `${results[0].rang} de ${results[0].nom}`,
                                            icon_url: results[0].avatarURL
                                        },
                                        thumbnail: {
                                            url: `${results[0].drapeau}`,
                                        },
                                        title: `\`Manque de matériaux : Scierie\``,
                                        fields: manque,
                                        color: 'RED',
                                        timestamp: new Date(),
                                        footer: { text: `${results[0].devise}` }
                                    };

                                    const salon_joueur = client.channels.cache.get(results[0].id_salon);
                                    salon_joueur.send({ embeds: [embed] });

                                }
                            })

                            var sql = `SELECT * FROM pays WHERE id_joueur="${results[0].id_joueur}"`;
                            connection.query(sql, async(err, results) => {
                                if (err) {
                                    throw err;
                                }
                                //Usine civile
                                var conso_usine_civile = true

                                var conso_T_usine_civile_bois = process.env.CONSO_USINE_CIVILE_BOIS * results[0].usine_civile;
                                if (conso_T_usine_civile_bois > results[0].bois) {
                                    var conso_usine_civile = false
                                    var manque_bois = true
                                }

                                var conso_T_usine_civile_metaux = process.env.CONSO_USINE_CIVILE_METAUX * results[0].usine_civile;
                                if (conso_T_usine_civile_metaux > results[0].metaux) {
                                    var conso_usine_civile = false
                                    var manque_metaux = true
                                }

                                var conso_T_usine_civile_petrole = process.env.CONSO_USINE_CIVILE_PETROLE * results[0].usine_civile;
                                if (conso_T_usine_civile_petrole > results[0].petrole) {
                                    var conso_usine_civile = false
                                    var manque_petrole = true
                                }

                                if (conso_usine_civile == true) {

                                    var prod_T_usine_civile = process.env.PROD_BRIQUETERIE * results[0].usine_civile;
                                    var sql = `
                                        UPDATE pays SET bois=bois-${conso_T_usine_civile_bois} WHERE id_joueur='${results[0].id_joueur}';
                                        UPDATE pays SET metaux=metaux-${conso_T_usine_civile_metaux} WHERE id_joueur='${results[0].id_joueur}';
                                        UPDATE pays SET petrole=petrole-${conso_T_usine_civile_petrole} WHERE id_joueur='${results[0].id_joueur}';
                                        UPDATE pays SET bc=bc+${prod_T_usine_civile} WHERE id_joueur='${results[0].id_joueur}'`;
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
                                            value: `Bois : ${results[0].bois.toLocaleString('en-US')}/${conso_T_usine_civile_bois.toLocaleString('en-US')}\n`
                                        })
                                    }
                                    if (manque_metaux == true) {
                                        manque.push({
                                            name: `> ⛔ Manque de métaux ⛔ :`,
                                            value: `Métaux : ${results[0].metaux.toLocaleString('en-US')}/${conso_T_usine_civile_metaux.toLocaleString('en-US')}\n`
                                        })
                                    }
                                    if (manque_petrole == true) {
                                        manque.push({
                                            name: `> ⛔ Manque de pétrole ⛔ :`,
                                            value: `Pétrole : ${results[0].petrole.toLocaleString('en-US')}/${conso_T_usine_civile_petrole.toLocaleString('en-US')}\n`
                                        })
                                    }

                                    const embed = {
                                        author: {
                                            name: `${results[0].rang} de ${results[0].nom}`,
                                            icon_url: results[0].avatarURL
                                        },
                                        thumbnail: {
                                            url: `${results[0].drapeau}`,
                                        },
                                        title: `\`Manque de matériaux : Usine civile\``,
                                        fields: manque,
                                        color: 'RED',
                                        timestamp: new Date(),
                                        footer: { text: `${results[0].devise}` }
                                    };

                                    const salon_joueur = client.channels.cache.get(results[0].id_salon);
                                    salon_joueur.send({ embeds: [embed] });
                                }
                            });

                        } else {

                            const embed = {
                                author: {
                                    name: `${results[index].rang} de ${results[index].nom}`,
                                    icon_url: results[index].avatarURL
                                },
                                thumbnail: {
                                    url: `${results[index].drapeau}`,
                                },
                                title: `\`Pas assez d'électricité : Blackout\``,
                                fields: {
                                    name: `> ⛔ Manque d'électricité ⛔ :`,
                                    value: `Vos usines n'ont pas produit\n` +
                                        `Electricité : ${prod_elec.toLocaleString('en-US')}/${conso_elec.toLocaleString('en-US')}\n`
                                },
                                color: 'RED',
                                timestamp: new Date(),
                                footer: { text: `${results[index].devise}` }
                            }
                            const salon_joueur = client.channels.cache.get(results[index].id_salon);
                            salon_joueur.send({ embeds: [embed] });
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

                    var sql = `SELECT * FROM pays WHERE id_joueur='${results[index].id_joueur}'`;
                    connection.query(sql, async(err, results) => {
                        if (err) {
                            throw err;
                        }

                        var action_diplo = Math.round(results[0].influence * (results[0].reputation / 100)) + 10

                        var sql = `
                        UPDATE pays SET action_diplo=action_diplo+${action_diplo} WHERE id_joueur='${results[0].id_joueur}'`;
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

                    var sql = `SELECT * FROM pays WHERE id_joueur='${results[index].id_joueur}'`;
                    connection.query(sql, async(err, results) => {
                        if (err) {
                            throw err;
                        }

                        var habitants = results[0].population;
                        var nourriture = results[0].nourriture;

                        if (habitants < nourriture) {
                            var reste = nourriture - habitants;
                            var coef = nourriture / habitants * 5;
                            var naissance = Math.sqrt(reste) * Math.exp(habitants / reste) * coef;

                            var sql = `
                                UPDATE pays SET nourriture=nourriture-${nourriture} WHERE id_joueur='${results[0].id_joueur}';
                                UPDATE pays SET population=population+${naissance} WHERE id_joueur='${results[0].id_joueur}'`;
                            connection.query(sql, async(err, results) => {
                                if (err) {
                                    throw err;
                                }
                            })
                        } else {
                            var manque = -(nourriture - habitants)
                            var mort = Math.round(manque * 0.2)
                            var habitants_next = habitants - mort

                            const embed = {
                                author: {
                                    name: `${results[0].rang} de ${results[0].nom}`,
                                    icon_url: process.env.URL_LOGO
                                },
                                thumbnail: {
                                    url: `${results[0].drapeau}`,
                                },
                                title: `\`Une famine frappe votre pays :\``,
                                fields: {
                                    name: `> ⛔ Manque de nourriture ⛔ :`,
                                    value: `Nourriture : ${results[0].nourriture.toLocaleString('en-US')}/${habitants.toLocaleString('en-US')}\n` +
                                        `Morts : ${mort.toLocaleString('en-US')}\n` +
                                        `Population restante : ${habitants_next.toLocaleString('en-US')}\n`
                                },
                                color: 'RED',
                                timestamp: new Date(),
                                footer: { text: `${results[0].devise}` }
                            };

                            const salon_joueur = client.channels.cache.get(results[0].id_salon);
                            salon_joueur.send({ embeds: [embed] });

                            var sql = `
                                UPDATE pays SET nourriture=nourriture-${nourriture} WHERE id_joueur='${results[0].id_joueur}';
                                UPDATE pays SET population=population-${mort} WHERE id_joueur='${results[0].id_joueur}'`;
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

            var bc_prix_total = 0;
            var bc_res_total = 0;

            bois_prix_total = 0;
            bois_res_total = 0;

            brique_prix_total = 0;
            brique_res_total = 0;

            eau_prix_total = 0;
            eau_res_total = 0;

            metaux_prix_total = 0;
            metaux_res_total = 0;

            nourriture_prix_total = 0;
            nourriture_res_total = 0;

            petrole_prix_total = 0;
            petrole_res_total = 0;

            var sql = `
                    SELECT * FROM trade`;
            connection.query(sql, async(err, results) => {
                if (err) {
                    throw err;
                }
                var arrayOffre = Object.values(results);
                arrayOffre.forEach(chaqueOffre);

                function chaqueOffre(value, index, array) {

                    switch (results[index].ressource) {
                        case 'Biens de consommation':
                            bc_prix_total += results[index].prix;
                            bc_res_total += results[index].quantite;
                        case 'Bois':
                            bois_prix_total += results[index].prix;
                            bois_res_total += results[index].quantite;
                        case 'Brique':
                            brique_prix_total += results[index].prix;
                            brique_res_total += results[index].quantite;
                        case 'Eau':
                            eau_prix_total += results[index].prix;
                            eau_res_total += results[index].quantite;
                        case 'Metaux':
                            metaux_prix_total += results[index].prix;
                            metaux_res_total += results[index].quantite;
                        case 'Nourriture':
                            nourriture_prix_total += results[index].prix;
                            nourriture_res_total += results[index].quantite;
                        case 'Petrole':
                            petrole_prix_total += results[index].prix;
                            petrole_res_total += results[index].quantite;
                    }
                }
            })

            var sql = `
                    SELECT * FROM qm`;
            connection.query(sql, async(err, results) => {
                if (err) {
                    throw err;
                }
                var arrayQm = Object.values(results);
                arrayQm.forEach(chaqueQm);

                function chaqueQm(value, index, array) {

                    switch (results[index].ressource) {
                        case 'Biens de consommation':
                            bc_prix_total += results[index].prix;
                            bc_res_total += results[index].quantite;
                        case 'Bois':
                            bois_prix_total += results[index].prix;
                            bois_res_total += results[index].quantite;
                        case 'Brique':
                            brique_prix_total += results[index].prix;
                            brique_res_total += results[index].quantite;
                        case 'Eau':
                            eau_prix_total += results[index].prix;
                            eau_res_total += results[index].quantite;
                        case 'Metaux':
                            metaux_prix_total += results[index].prix;
                            metaux_res_total += results[index].quantite;
                        case 'Nourriture':
                            nourriture_prix_total += results[index].prix;
                            nourriture_res_total += results[index].quantite;
                        case 'Petrole':
                            petrole_prix_total += results[index].prix;
                            petrole_res_total += results[index].quantite;
                    }
                }

                bc_prix_moyen = bc_prix_total / bc_res_total;

                bois_prix_moyen = bois_prix_total / bois_res_total;

                brique_prix_moyen = brique_prix_total / brique_res_total;

                eau_prix_moyen = eau_prix_total / eau_res_total;

                metaux_prix_moyen = metaux_prix_total / metaux_res_total;

                nourriture_prix_moyen = nourriture_prix_total / nourriture_res_total;

                petrole_prix_moyen = petrole_prix_total / petrole_res_total;

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
            })

        }

        setInterval(marketUpdate, ms('1m'));
    }
}