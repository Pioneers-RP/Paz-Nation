const { codeBlock } = require('@discordjs/builders');
const { Client, Collection, Intents, Guild } = require('discord.js');
const { readFileSync, writeFileSync } = require('fs');
const { connection } = require('../index.js');
const { globalBox } = require('global-box');
const box = globalBox();
const dotenv = require('dotenv');
var Chance = require('chance');
var chance = new Chance();
const ms = require('ms');
var CronJob = require('cron').CronJob;

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

        var autoUpdate = new CronJob(
            '0 0,10,20,30,40,50 * * * *',

            function autoUpdate() {
                const regionObject = JSON.parse(readFileSync('data/region.json', 'utf-8'));
                const gouvernementObject = JSON.parse(readFileSync('data/gouvernement.json', 'utf-8'));

                var sql = `SELECT * FROM pays`;
                connection.query(sql, async(err, results) => {

                    var arrayPays = Object.values(results);
                    arrayPays.forEach(chaquePays);

                    function chaquePays(value, index, array) {
                        //console.log(process.env.CONSO_CENTRALE_FIOUL_PETROLE * value.centrale_fioul)
                        if (value.petrole >= process.env.CONSO_CENTRALE_FIOUL_PETROLE * value.centrale_fioul) {
                            var prod_centrale = Math.round(process.env.PROD_CENTRALE_FIOUL * value.centrale_fioul)
                        } else {
                            var prod_centrale = 0
                                //console.log(prod_centrale)
                        }
                        //console.log(prod_centrale)
                        var prod_elec = Math.round(prod_centrale + process.env.PROD_EOLIENNE * value.eolienne);
                        //console.log(Number((value.petrole / (process.env.CONSO_CENTRALE_FIOUL_PETROLE * value.centrale_fioul)).toFixed(1)))
                        var conso_elec = process.env.CONSO_BRIQUETERIE_ELECTRICITE * value.briqueterie + process.env.CONSO_CHAMP_ELECTRICITE * value.champ + process.env.CONSO_MINE_ELECTRICITE * value.mine + process.env.CONSO_POMPE_A_EAU_ELECTRICITE * value.pompe_a_eau + process.env.CONSO_PUMPJACK_ELECTRICITE * value.pumpjack + process.env.CONSO_QUARTIER_ELECTRICITE * value.quartier + process.env.CONSO_SCIERIE_ELECTRICITE * value.scierie + process.env.CONSO_USINE_CIVILE_ELECTRICITE * value.usine_civile;

                        if (prod_elec > conso_elec) {
                            if (value.petrole >= process.env.CONSO_CENTRALE_FIOUL_PETROLE * value.centrale_fioul) {
                                var conso_centrale_petrole = process.env.CONSO_CENTRALE_FIOUL * value.centrale_fioul;
                                var sql = `UPDATE pays SET petrole=petrole-${conso_centrale_petrole} WHERE id_joueur="${value.id_joueur}"`;
                            }
                            if (value.nourriture_acces < 1008) {
                                var sql = sql + `;UPDATE pays SET elec_acces=elec_acces+1 WHERE id_joueur="${value.id_joueur}"`;
                            }
                            connection.query(sql, async(err) => { if (err) { throw err; } })

                            var sql = `SELECT * FROM pays WHERE id_joueur="${value.id_joueur}"`;
                            connection.query(sql, async(err, results) => {
                                var conso_briqueterie = true

                                var conso_T_briqueterie_bois = Math.round(process.env.CONSO_BRIQUETERIE_BOIS * value.briqueterie * eval(`gouvernementObject.${value.ideologie}.consommation`));
                                if (conso_T_briqueterie_bois > results[0].bois) {
                                    var conso_briqueterie = false
                                    var manque_bois = true
                                }

                                var conso_T_briqueterie_eau = Math.round(process.env.CONSO_BRIQUETERIE_EAU * value.briqueterie * eval(`gouvernementObject.${value.ideologie}.consommation`));
                                if (conso_T_briqueterie_eau > results[0].eau) {
                                    var conso_briqueterie = false
                                    var manque_eau = true
                                }

                                if (conso_briqueterie == true) {

                                    var prod_T_briqueterie = Math.round(process.env.PROD_BRIQUETERIE * value.briqueterie * eval(`gouvernementObject.${value.ideologie}.production`));
                                    var sql = `
                                    UPDATE pays SET bois=bois-${conso_T_briqueterie_bois} WHERE id_joueur="${value.id_joueur}";
                                    UPDATE pays SET eau=eau-${conso_T_briqueterie_eau} WHERE id_joueur="${value.id_joueur}";
                                    UPDATE pays SET brique=brique+${prod_T_briqueterie} WHERE id_joueur="${value.id_joueur}"`;
                                    connection.query(sql, async(err) => {if (err) {throw err;}})

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

                                    var embed = {
                                        author: {
                                            name: `${value.rang} de ${value.nom}`,
                                            icon_url: value.avatarURL
                                        },
                                        thumbnail: {
                                            url: `${value.drapeau}`,
                                        },
                                        title: `\`Manque de matériaux : Briqueterie\``,
                                        fields: manque,
                                        color: 'RED',
                                        timestamp: new Date(),
                                        footer: { text: `${value.devise}` }
                                    };

                                    client.channels.cache.get(value.id_salon).send({ embeds: [embed] })
                                        .catch(console.error);
                                }
                            })

                            var sql = `SELECT * FROM pays WHERE id_joueur="${value.id_joueur}"`;
                            connection.query(sql, async(err, results) => {
                                var conso_champ = true

                                var conso_T_champ_eau = Math.round(process.env.CONSO_CHAMP_EAU * value.champ * eval(`gouvernementObject.${value.ideologie}.consommation`));
                                if (conso_T_champ_eau > results[0].eau) {
                                    var conso_champ = false
                                    var manque_eau = true
                                }

                                if (conso_champ == true) {
                                    var prod_T_champ = Math.round(process.env.PROD_CHAMP * value.champ * eval(`gouvernementObject.${value.ideologie}.production`) * ((parseInt((eval(`regionObject.${value.region}.nourriture`))) + 100) / 100));
                                    var sql = `
                                    UPDATE pays SET eau=eau-${conso_T_champ_eau} WHERE id_joueur="${value.id_joueur}";
                                    UPDATE pays SET nourriture=nourriture+${prod_T_champ} WHERE id_joueur="${value.id_joueur}"`;
                                    connection.query(sql, async(err) => {if (err) {throw err;}})

                                } else {
                                    var manque = [];
                                    if (manque_eau == true) {
                                        manque.push({
                                            name: `> ⛔ Manque d\'eau ⛔ :`,
                                            value: `Eau : ${results[0].eau.toLocaleString('en-US')}/${conso_T_champ_eau.toLocaleString('en-US')}\n`
                                        })
                                    }

                                    var embed = {
                                        author: {
                                            name: `${value.rang} de ${value.nom}`,
                                            icon_url: value.avatarURL
                                        },
                                        thumbnail: {
                                            url: `${value.drapeau}`,
                                        },
                                        title: `\`Manque de matériaux : Champ\``,
                                        fields: manque,
                                        color: 'RED',
                                        timestamp: new Date(),
                                        footer: { text: `${value.devise}` }
                                    };

                                    client.channels.cache.get(value.id_salon).send({ embeds: [embed] })
                                        .catch(console.error);
                                }
                            })

                            var sql = `SELECT * FROM pays WHERE id_joueur="${value.id_joueur}"`;
                            connection.query(sql, async(err, results) => {
                                var conso_mine = true

                                var conso_T_mine_bois = Math.round(process.env.CONSO_MINE_BOIS * value.mine * eval(`gouvernementObject.${value.ideologie}.consommation`));
                                if (conso_T_mine_bois > results[0].bois) {
                                    var conso_mine = false
                                    var manque_bois = true
                                }

                                var conso_T_mine_petrole = Math.round(process.env.CONSO_MINE_PETROLE * value.mine * eval(`gouvernementObject.${value.ideologie}.consommation`));
                                if (conso_T_mine_petrole > results[0].petrole) {
                                    var conso_mine = false
                                    var manque_petrole = true
                                }

                                if (conso_mine == true) {

                                    var prod_T_mine = Math.round(process.env.PROD_MINE * value.mine * eval(`gouvernementObject.${value.ideologie}.production`) * ((parseInt((eval(`regionObject.${value.region}.metaux`))) + 100) / 100));
                                    var sql = `
                                        UPDATE pays SET bois=bois-${conso_T_mine_bois} WHERE id_joueur="${value.id_joueur}";
                                        UPDATE pays SET petrole=petrole-${conso_T_mine_petrole} WHERE id_joueur="${value.id_joueur}";
                                        UPDATE pays SET metaux=metaux+${prod_T_mine} WHERE id_joueur="${value.id_joueur}"`;
                                    connection.query(sql, async(err) => {if (err) {throw err;}})

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

                                    var embed = {
                                        author: {
                                            name: `${value.rang} de ${value.nom}`,
                                            icon_url: value.avatarURL
                                        },
                                        thumbnail: {
                                            url: `${value.drapeau}`,
                                        },
                                        title: `\`Manque de matériaux : Mine\``,
                                        fields: manque,
                                        color: 'RED',
                                        timestamp: new Date(),
                                        footer: { text: `${value.devise}` }
                                    };

                                    client.channels.cache.get(value.id_salon).send({ embeds: [embed] })
                                        .catch(console.error);
                                }
                            })

                            var sql = `SELECT * FROM pays WHERE id_joueur="${value.id_joueur}"`;
                            connection.query(sql, async(err, results) => {
                                var conso_pompe_a_eau = true

                                var conso_T_pompe_a_eau_petrole = Math.round(process.env.CONSO_POMPE_A_EAU_PETROLE * value.pompe_a_eau * eval(`gouvernementObject.${value.ideologie}.consommation`));
                                if (conso_T_pompe_a_eau_petrole > results[0].petrole) {
                                    var conso_pompe_a_eau = false
                                    var manque_petrole = true
                                }

                                if (conso_pompe_a_eau == true) {

                                    var prod_T_pompe_a_eau = Math.round(process.env.PROD_POMPE_A_EAU * value.pompe_a_eau * eval(`gouvernementObject.${value.ideologie}.production`) * ((parseInt((eval(`regionObject.${value.region}.eau`))) + 100) / 100));
                                    var sql = `
                                        UPDATE pays SET petrole=petrole-${conso_T_pompe_a_eau_petrole} WHERE id_joueur="${value.id_joueur}";
                                        UPDATE pays SET eau=eau+${prod_T_pompe_a_eau} WHERE id_joueur="${value.id_joueur}"`;
                                    connection.query(sql, async(err) => {if (err) {throw err;}})

                                } else {
                                    var manque = [];
                                    if (manque_petrole == true) {
                                        manque.push({
                                            name: `> ⛔ Manque de pétrole ⛔ :`,
                                            value: `Pétrole : ${results[0].petrole.toLocaleString('en-US')}/${conso_T_pompe_a_eau_petrole.toLocaleString('en-US')}\n`
                                        })
                                    }

                                    var embed = {
                                        author: {
                                            name: `${value.rang} de ${value.nom}`,
                                            icon_url: value.avatarURL
                                        },
                                        thumbnail: {
                                            url: `${value.drapeau}`,
                                        },
                                        title: `\`Manque de matériaux : Pompe à eau\``,
                                        fields: manque,
                                        color: 'RED',
                                        timestamp: new Date(),
                                        footer: { text: `${value.devise}` }
                                    };

                                    client.channels.cache.get(value.id_salon).send({ embeds: [embed] })
                                        .catch(console.error);
                                }
                            })

                            var sql = `SELECT * FROM pays WHERE id_joueur="${value.id_joueur}"`;
                            connection.query(sql, async(err, results) => {
                                var conso_pumpjack = true

                                if (conso_pumpjack == true) {

                                    var prod_T_pumpjack = Math.round(process.env.PROD_PUMPJACK * value.pumpjack * eval(`gouvernementObject.${value.ideologie}.production`) * ((parseInt((eval(`regionObject.${value.region}.petrole`))) + 100) / 100));
                                    var sql = `UPDATE pays SET petrole=petrole+${prod_T_pumpjack} WHERE id_joueur="${value.id_joueur}"`;
                                    connection.query(sql, async(err) => {if (err) {throw err;}})

                                } else {

                                    var embed = {
                                        author: {
                                            name: `${value.rang} de ${value.nom}`,
                                            icon_url: value.avatarURL
                                        },
                                        thumbnail: {
                                            url: `${value.drapeau}`,
                                        },
                                        title: `\`Manque de matériaux : Pumpjack\``,
                                        fields: manque,
                                        color: 'RED',
                                        timestamp: new Date(),
                                        footer: { text: `${value.devise}` }
                                    };

                                    client.channels.cache.get(value.id_salon).send({ embeds: [embed] })
                                        .catch(console.error);
                                }
                            })

                            var sql = `SELECT * FROM pays WHERE id_joueur="${value.id_joueur}"`;
                            connection.query(sql, async(err, results) => {
                                var conso_scierie = true

                                var conso_T_scierie_petrole = Math.round(process.env.CONSO_SCIERIE_PETROLE * value.scierie * eval(`gouvernementObject.${value.ideologie}.consommation`));
                                if (conso_T_scierie_petrole > results[0].petrole) {
                                    var conso_scierie = false
                                    var manque_petrole = true
                                }

                                if (conso_scierie == true) {

                                    var prod_T_scierie = Math.round(process.env.PROD_SCIERIE * value.scierie * eval(`gouvernementObject.${value.ideologie}.production`) * ((parseInt((eval(`regionObject.${value.region}.bois`))) + 100) / 100));
                                    var sql = `
                                        UPDATE pays SET petrole=petrole-${conso_T_scierie_petrole} WHERE id_joueur="${value.id_joueur}";
                                        UPDATE pays SET bois=bois+${prod_T_scierie} WHERE id_joueur="${value.id_joueur}"`;
                                    connection.query(sql, async(err) => {if (err) {throw err;}});

                                } else {
                                    var manque = [];
                                    if (manque_petrole == true) {
                                        manque.push({
                                            name: `> ⛔ Manque de pétrole ⛔ :`,
                                            value: `Pétrole : ${results[0].petrole.toLocaleString('en-US')}/${conso_T_scierie_petrole.toLocaleString('en-US')}\n`
                                        })
                                    }

                                    var embed = {
                                        author: {
                                            name: `${value.rang} de ${value.nom}`,
                                            icon_url: stats[0].avatarURL
                                        },
                                        thumbnail: {
                                            url: `${value.drapeau}`,
                                        },
                                        title: `\`Manque de matériaux : Scierie\``,
                                        fields: manque,
                                        color: 'RED',
                                        timestamp: new Date(),
                                        footer: { text: `${value.devise}` }
                                    };

                                    client.channels.cache.get(value.id_salon).send({ embeds: [embed] })
                                        .catch(console.error);
                                }
                            })

                            var sql = `SELECT * FROM pays WHERE id_joueur="${value.id_joueur}"`;
                            connection.query(sql, async(err, results) => {
                                var conso_usine_civile = true

                                var conso_T_usine_civile_bois = Math.round(process.env.CONSO_USINE_CIVILE_BOIS * value.usine_civile * eval(`gouvernementObject.${value.ideologie}.consommation`));
                                if (conso_T_usine_civile_bois > results[0].bois) {
                                    var conso_usine_civile = false
                                    var manque_bois = true
                                }

                                var conso_T_usine_civile_metaux = Math.round(process.env.CONSO_USINE_CIVILE_METAUX * value.usine_civile * eval(`gouvernementObject.${value.ideologie}.consommation`));
                                if (conso_T_usine_civile_metaux > results[0].metaux) {
                                    var conso_usine_civile = false
                                    var manque_metaux = true
                                }

                                var conso_T_usine_civile_petrole = Math.round(process.env.CONSO_USINE_CIVILE_PETROLE * value.usine_civile * eval(`gouvernementObject.${value.ideologie}.consommation`));
                                if (conso_T_usine_civile_petrole > results[0].petrole) {
                                    var conso_usine_civile = false
                                    var manque_petrole = true
                                }

                                if (conso_usine_civile == true) {

                                    var prod_T_usine_civile = Math.round(process.env.PROD_USINE_CIVILE * value.usine_civile * eval(`gouvernementObject.${value.ideologie}.production`));
                                    var sql = `
                                        UPDATE pays SET bois=bois-${conso_T_usine_civile_bois} WHERE id_joueur="${value.id_joueur}";
                                        UPDATE pays SET metaux=metaux-${conso_T_usine_civile_metaux} WHERE id_joueur="${value.id_joueur}";
                                        UPDATE pays SET petrole=petrole-${conso_T_usine_civile_petrole} WHERE id_joueur="${value.id_joueur}";
                                        UPDATE pays SET bc=bc+${prod_T_usine_civile} WHERE id_joueur="${value.id_joueur}"`;
                                    connection.query(sql, async(err) => {if (err) {throw err;}})

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

                                    var embed = {
                                        author: {
                                            name: `${value.rang} de ${value.nom}`,
                                            icon_url: value.avatarURL
                                        },
                                        thumbnail: {
                                            url: `${value.drapeau}`,
                                        },
                                        title: `\`Manque de matériaux : Usine civile\``,
                                        fields: manque,
                                        color: 'RED',
                                        timestamp: new Date(),
                                        footer: {
                                            text: value.devise
                                        }
                                    };

                                    client.channels.cache.get(value.id_salon).send({ embeds: [embed] })
                                        .catch(console.error);
                                }
                            });
                        } else if (prod_elec > process.env.CONSO_QUARTIER_ELECTRICITE * value.quartier) {
                            var sql = `UPDATE pays SET petrole=0 WHERE id_joueur="${value.id_joueur}";`;

                            if (value.nourriture_acces < 1008) {
                                var sql = sql + `UPDATE pays SET elec_acces=elec_acces+1 WHERE id_joueur="${value.id_joueur}"`;
                            }
                            connection.query(sql, async(err) => { if (err) { throw err;}})

                            const embed = {
                                author: {
                                    name: `${value.rang} de ${value.nom}`,
                                    icon_url: value.avatarURL
                                },
                                thumbnail: {
                                    url: `${value.drapeau}`,
                                },
                                title: `\`Pas assez d'électricité : Blackout\``,
                                fields: {
                                    name: `> ⛔ Manque d'électricité ⛔ :`,
                                    value: `Vos usines n'ont pas produit mais vos quartiers ont été fourni en électricité\n` +
                                        `Electricité : ${prod_elec.toLocaleString('en-US')}/${conso_elec.toLocaleString('en-US')}\n`
                                },
                                color: 'RED',
                                timestamp: new Date(),
                                footer: { text: `${value.devise}` }
                            }
                            client.channels.cache.get(value.id_salon).send({ embeds: [embed] })
                                .catch(console.error);
                        } else {
                            var sql = `UPDATE pays SET petrole=0 WHERE id_joueur="${value.id_joueur}"`;
                            connection.query(sql, async(err) => { if (err) { throw err; }})

                            const embed = {
                                author: {
                                    name: `${value.rang} de ${value.nom}`,
                                    icon_url: value.avatarURL
                                },
                                thumbnail: {
                                    url: `${value.drapeau}`,
                                },
                                title: `\`Pas assez d'électricité : Blackout\``,
                                fields: {
                                    name: `> ⛔ Manque d'électricité ⛔ :`,
                                    value: `Tout votre pays est dépourvu d'électricité !\n` +
                                        `Electricité : ${prod_elec.toLocaleString('en-US')}/${conso_elec.toLocaleString('en-US')}\n`
                                },
                                color: 'RED',
                                timestamp: new Date(),
                                footer: { text: `${value.devise}` }
                            }
                            client.channels.cache.get(value.id_salon).send({ embeds: [embed] })
                                .catch(console.error);
                        }
                    };
                });
            },
            null,
            true,
            'Europe/Paris'
        );

        // async function autoAction_diplo() {

        //     var sql = `
        //     SELECT * FROM pays`;
        //     connection.query(sql, async(err, results) => {
        //         if (err) {
        //             throw err;
        //         }
        //         var arrayPays = Object.values(results);
        //         arrayPays.forEach(chaquePays);

        //         function chaquePays(value, index, array) {
        //             var id = Object.values(value);
        //             array[index] = value.id_joueur;

        //             var sql = `SELECT * FROM pays WHERE id_joueur="${value.id_joueur}"`;
        //             connection.query(sql, async(err, results) => {
        //                 if (err) {
        //                     throw err;
        //                 }

        //                 var action_diplo = Math.round(results[0].influence * (results[0].reputation / 100)) + 10

        //                 var sql = `
        //                 UPDATE pays SET action_diplo=action_diplo+${action_diplo} WHERE id_joueur="${value.id_joueur}"`;
        //                 connection.query(sql, async(err, results) => {
        //                     if (err) {
        //                         throw err;
        //                     }
        //                 })
        //             })
        //         }
        //     });
        // }
        // setInterval(autoAction_diplo, ms('3h'));

        var autoPopulation = new CronJob(
            '0 0 6,12,20 * * *',

            function popUpdate() {

                var sql = `SELECT * FROM pays`;
                connection.query(sql, async(err, results) => {if (err) { throw err; }

                    var arrayPays = Object.values(results);
                    arrayPays.forEach(chaquePays);

                    function chaquePays(value, index, array) {
                        const gouvernementObject = JSON.parse(readFileSync('data/gouvernement.json', 'utf-8'));

                        if (value.nourriture >= (value.population * parseFloat(process.env.NOURRITURE_CONSO))) {
                            if (value.nourriture_appro >= (value.population * parseFloat(process.env.NOURRITURE_CONSO))) {
                                if (value.nourriture_acces < 21) {
                                    var sql = `UPDATE pays SET nourriture_acces=nourriture_acces+0.333 WHERE id_joueur="${value.id_joueur}";`;
                                } else {
                                    var sql = ``;
                                }
                            } else {
                                var sql = `UPDATE pays SET nourriture_acces=0 WHERE id_joueur="${value.id_joueur}";`;
                            }
                        } else {
                            var sql = `UPDATE pays SET nourriture_acces=0 WHERE id_joueur="${value.id_joueur}";`;
                        }

                        if (value.eau > (value.population * parseFloat(process.env.EAU_CONSO))) {
                            if (value.eau_appro >= (value.population * parseFloat(process.env.EAU_CONSO))) {
                                if (value.eau_acces < 21) {
                                    var sql = sql + `UPDATE pays SET eau_acces=eau_acces+0.33 WHERE id_joueur="${value.id_joueur}";`;
                                }
                            } else {
                                var sql = `UPDATE pays SET eau_acces=0 WHERE id_joueur="${value.id_joueur}";`;
                            }
                        } else {
                            var sql = sql + `UPDATE pays SET eau_acces=0 WHERE id_joueur="${value.id_joueur}";`;
                        }

                        const conso_bc = (1 + value.bc_acces * 0.04 + value.bonheur * 0.016 + (value.population / 10000000) * 0.04) * value.population * eval(`gouvernementObject.${value.ideologie}.conso_bc`)
                            //console.log(conso_bc)
                        if (value.bc > (conso_bc)) {
                            if (value.bc_acces < 21) {
                                var sql = sql + `UPDATE pays SET bc_acces=bc_acces+0.33 WHERE id_joueur="${value.id_joueur}";UPDATE pays SET bc=bc-${conso_bc} WHERE id_joueur="${value.id_joueur}"`;
                            } else {
                                var sql = sql + `UPDATE pays SET bc=bc-${conso_bc} WHERE id_joueur="${value.id_joueur}"`
                            }
                        } else {
                            var sql = sql + `UPDATE pays SET bc_acces=0 WHERE id_joueur="${value.id_joueur}";UPDATE pays SET bc=0 WHERE id_joueur="${value.id_joueur}"`;
                        }

                        var sql = sql + `SELECT * FROM pays WHERE id_joueur="${value.id_joueur}"`;
                        connection.query(sql, async(err) => { if (err) { throw err; }})

                        var sql = `SELECT * FROM pays WHERE id_joueur="${value.id_joueur}"`;
                        connection.query(sql, async(err, results) => {if (err) { throw err; }

                            const nourriture_acces = results[0].nourriture_acces * 1.7;
                            //console.log(nourriture_acces)

                            const eau_acces = results[0].eau_acces * 2.1;
                            //console.log(eau_acces)
                            const elec_acces = results[0].elec_acces * (0.8 / (6 * 8));

                            const bc_acces = results[0].bc_acces * 1.45;
                            //console.log(bc_acces)

                            var tauxbcmadein = (process.env.PROD_USINE_CIVILE * results[0].usine_civile * eval(`gouvernementObject.${value.ideologie}.production`)) / (results[0].population * 9 * 0.5);
                            if (tauxbcmadein > 0.8) {
                                var tauxbcmadein = 0.8;
                            }
                            var tauxbcmadein = tauxbcmadein * 29
                                //console.log(tauxbcmadein)

                            const place = (results[0].quartier * 1500)
                            var sans_abri = (results[0].population - place)
                            if (sans_abri < 0) {
                                var sans_abri = 0
                            }
                            const pourcentage_sans_abri = (sans_abri / results[0].population)
                            const sdf = (1 - pourcentage_sans_abri) * 18;
                            //console.log(sdf)

                            const modifier = parseFloat(process.env.BONHEUR_BASE) + nourriture_acces + eau_acces + elec_acces + bc_acces + tauxbcmadein + sdf + eval(`gouvernementObject.${value.ideologie}.bonheur`);
                            const bonheur = parseFloat(((-92 * Math.exp(-0.02 * modifier)) + 100).toFixed(1));
                            //console.log(modifier)
                            //console.log(bonheur)
                            var sql = `UPDATE pays SET bonheur="${bonheur}" WHERE id_joueur="${value.id_joueur}"`;
                            connection.query(sql, async(err) => { if (err) { throw err; }})
                        })

                        const pop_taux_demo = ((10 + value.eau_acces * 2.3 + value.nourriture_acces * 2.3 + value.bonheur * 1) / 100).toFixed(2);
                        var enfant = (15 / 16) * value.enfant + (process.env.NATALITE_JEUNE * pop_taux_demo * value.jeune) + (process.env.NATALITE_ADULTE * pop_taux_demo * value.adulte) - process.env.MORTALITE_ENFANT * value.enfant;
                        if (enfant < 0) {
                            var enfant = 0;
                        }
                        var jeune = (8 / 9) * value.jeune + (1 / 15) * value.enfant - process.env.MORTALITE_JEUNE * value.jeune;
                        if (jeune < 0) {
                            var jeune = 0;
                        }
                        var adulte = (30 / 31) * value.adulte + (1 / 9) * value.jeunes - process.env.MORTALITE_ADULTE * value.adulte;
                        if (enfant < 0) {
                            var adulte = 0;
                        }
                        var vieux = value.vieux + (1 / 31) * value.adulte - process.env.MORTALITE_VIEUX * value.vieux;
                        if (enfant < 0) {
                            var vieux = 0;
                        }

                        var sql = `
                        UPDATE pays SET pop_taux_demo="${pop_taux_demo}" WHERE id_joueur="${value.id_joueur}";
                        UPDATE pays SET enfant="${enfant}" WHERE id_joueur="${value.id_joueur}";
                        UPDATE pays SET jeune="${jeune}" WHERE id_joueur="${value.id_joueur}";
                        UPDATE pays SET adulte="${adulte}" WHERE id_joueur="${value.id_joueur}";
                        UPDATE pays SET vieux="${vieux}" WHERE id_joueur="${value.id_joueur}";`;
                        connection.query(sql, async(err) => { if (err) { throw err; }})

                        if (value.nourriture >= value.population * process.env.NOURRITURE_CONSO) {
                            if (value.nourriture_appro <= value.population * process.env.NOURRITURE_CONSO) {
                                var manque = (value.population * process.env.NOURRITURE_CONSO) - value.nourriture_appro;
                                var mort = Math.round(manque * 0.2);
                                var habitants_next = value.population - mort;

                                if (value.nourriture_acces != 0) {
                                    const embed = {
                                        author: {
                                            name: `${value.rang} de ${value.nom}`,
                                            icon_url: `${value.drapeau}`
                                        },
                                        thumbnail: {
                                            url: `${value.drapeau}`,
                                        },
                                        title: `\`Une famine frappe votre pays :\``,
                                        fields: {
                                            name: `> ⛔ Manque d'approvisionnement en nourriture ⛔ :`,
                                            value: `Nourriture : ${value.nourriture_appro.toLocaleString('en-US')}/${(value.population * process.env.NOURRITURE_CONSO).toLocaleString('en-US')}\n` +
                                                `Morts : ${mort.toLocaleString('en-US')}\n` +
                                                `Population restante : ${habitants_next.toLocaleString('en-US')}\n`
                                        },
                                        color: 'RED',
                                        timestamp: new Date(),
                                        footer: { text: `${value.devise}` }
                                    };
                                    client.channels.cache.get(value.id_salon).send({ embeds: [embed] });
                                }

                                var sql = `
                                UPDATE pays SET nourriture=nourriture-${value.nourriture_appro} WHERE id_joueur="${value.id_joueur}";
                                UPDATE pays SET population=population-${mort} WHERE id_joueur="${value.id_joueur}"`;
                                connection.query(sql, async(err) => { if (err) { throw err; }})
                            }
                        } else {
                            var manque = (value.population * process.env.NOURRITURE_CONSO) - value.nourriture
                            var mort = Math.round(manque * 0.2)
                            var habitants_next = value.population - mort

                            if (value.nourriture_acces != 0) {
                                const embed = {
                                    author: {
                                        name: `${value.rang} de ${value.nom}`,
                                        icon_url: `${value.drapeau}`
                                    },
                                    thumbnail: {
                                        url: `${value.drapeau}`,
                                    },
                                    title: `\`Une famine frappe votre pays :\``,
                                    fields: {
                                        name: `> ⛔ Manque de nourriture ⛔ :`,
                                        value: `Nourriture : ${value.nourriture.toLocaleString('en-US')}/${(value.population * parseFloat(process.env.NOURRITURE_CONSO)).toLocaleString('en-US')}\n` +
                                            `Morts : ${mort.toLocaleString('en-US')}\n` +
                                            `Population restante : ${habitants_next.toLocaleString('en-US')}\n`
                                    },
                                    color: 'RED',
                                    timestamp: new Date(),
                                    footer: { text: `${value.devise}` }
                                };

                                client.channels.cache.get(value.id_salon).send({ embeds: [embed] });
                            }

                            var sql = `
                            UPDATE pays SET nourriture=0 WHERE id_joueur="${value.id_joueur}";
                            UPDATE pays SET population=population-${mort} WHERE id_joueur="${value.id_joueur}"`;

                            connection.query(sql, async(err) => { if (err) { throw err; } })
                        }

                        if (value.eau >= value.population * process.env.EAU_CONSO) {
                            if (value.eau_appro <= value.population * process.env.EAU_CONSO) {
                                var manque = (value.population * process.env.EAU_CONSO) - value.eau_appro;
                                var mort = Math.round(manque * 0.2);
                                var habitants_next = value.population - mort;

                                if (value.eau_acces != 0) {
                                    const embed = {
                                        author: {
                                            name: `${value.rang} de ${value.nom}`,
                                            icon_url: `${value.drapeau}`
                                        },
                                        thumbnail: {
                                            url: `${value.drapeau}`,
                                        },
                                        title: `\`Une pénurie frappe votre pays :\``,
                                        fields: {
                                            name: `> ⛔ Manque d'approvisionnement en eau ⛔ :`,
                                            value: `Nourriture : ${value.eau_appro.toLocaleString('en-US')}/${(value.population * parseFloat(process.env.EAU_CONSO)).toLocaleString('en-US')}\n` +
                                                `Morts : ${mort.toLocaleString('en-US')}\n` +
                                                `Population restante : ${habitants_next.toLocaleString('en-US')}\n`
                                        },
                                        color: 'RED',
                                        timestamp: new Date(),
                                        footer: { text: `${value.devise}` }
                                    };
                                    client.channels.cache.get(value.id_salon).send({ embeds: [embed] });
                                }

                                var sql = `
                                UPDATE pays SET eau=eau-${value.eau_appro} WHERE id_joueur="${value.id_joueur}";
                                UPDATE pays SET population=population-${mort} WHERE id_joueur="${value.id_joueur}"`;
                                connection.query(sql, async(err) => { if (err) { throw err; } })
                            }
                        } else {
                            var manque = (value.population * process.env.EAU_CONSO) - value.eau
                            var mort = Math.round(manque * 0.2)
                            var habitants_next = value.population - mort

                            if (value.eau_acces != 0) {
                                const embed = {
                                    author: {
                                        name: `${value.rang} de ${value.nom}`,
                                        icon_url: `${value.drapeau}`
                                    },
                                    thumbnail: {
                                        url: `${value.drapeau}`,
                                    },
                                    title: `\`Une pénurie frappe votre pays :\``,
                                    fields: {
                                        name: `> ⛔ Manque d'eau ⛔ :`,
                                        value: `Nourriture : ${value.eau.toLocaleString('en-US')}/${(value.population * parseFloat(process.env.EAU_CONSO)).toLocaleString('en-US')}\n` +
                                            `Morts : ${mort.toLocaleString('en-US')}\n` +
                                            `Population restante : ${habitants_next.toLocaleString('en-US')}\n`
                                    },
                                    color: 'RED',
                                    timestamp: new Date(),
                                    footer: { text: `${value.devise}` }
                                };

                                client.channels.cache.get(value.id_salon).send({ embeds: [embed] });
                            }

                            var sql = `
                            UPDATE pays SET eau=0 WHERE id_joueur="${value.id_joueur}";
                            UPDATE pays SET population=population-${mort} WHERE id_joueur="${value.id_joueur}"`;

                            connection.query(sql, async(err) => { if (err) { throw err; } })
                        }
                    }
                })
            },
            null,
            true,
            'Europe/Paris'
        );

        var autoMarket = new CronJob(
            '0 0,10,20,30,40,50 * * * *',

            async function marketUpdate() {
                box.set('bc_prix_total', 5)
                box.set('bc_res_total', 1)

                box.set('bois_prix_total', 2.5)
                box.set('bois_res_total', 1)

                box.set('brique_prix_total', 2.5)
                box.set('brique_res_total', 1)

                box.set('eau_prix_total', 2)
                box.set('eau_res_total', 1)

                box.set('metaux_prix_total', 3)
                box.set('metaux_res_total', 1)

                box.set('nourriture_prix_total', 2.5)
                box.set('nourriture_res_total', 1)

                box.set('petrole_prix_total', 3)
                box.set('petrole_res_total', 1)

                var sql = `
                SELECT * FROM trade ORDER BY ressource;
                SELECT * FROM qvente ORDER BY ressource;
                SELECT * FROM qachat ORDER BY ressource`;
                connection.query(sql, async(err, results) => {if (err) { throw err; }

                    const arrayOffre = Object.values(results[0]);
                    const arrayQvente = Object.values(results[1]);
                    const arrayQachat = Object.values(results[2]);
                    arrayOffre.forEach(chaqueMarket);
                    arrayQvente.forEach(chaqueMarket);
                    arrayQachat.forEach(chaqueMarket);

                    function chaqueMarket(value, index, array) {
                        switch (value.ressource) {
                            case 'Biens de consommation':
                                box.set('bc_prix_total', (box.get('bc_prix_total') + value.prix));
                                box.set('bc_res_total', (box.get('bc_res_total') + value.quantite));
                            case 'Bois':
                                box.set('bois_prix_total', (box.get('bois_prix_total') + value.prix));
                                box.set('bois_res_total', (box.get('bois_res_total') + value.quantite));
                            case 'Brique':
                                box.set('brique_prix_total', (box.get('brique_prix_total') + value.prix));
                                box.set('brique_res_total', (box.get('brique_res_total') + value.quantite));
                            case 'Eau':
                                box.set('eau_prix_total', (box.get('eau_prix_total') + value.prix));
                                box.set('eau_res_total', (box.get('eau_res_total') + value.quantite));
                            case 'Metaux':
                                box.set('metaux_prix_total', (box.get('metaux_prix_total') + value.prix));
                                box.set('metaux_res_total', (box.get('metaux_res_total') + value.quantite));
                            case 'Nourriture':
                                box.set('nourriture_prix_total', (box.get('nourriture_prix_total') + value.prix));
                                box.set('nourriture_res_total', (box.get('nourriture_res_total') + value.quantite));
                            case 'Petrole':
                                box.set('petrole_prix_total', (box.get('petrole_prix_total') + value.prix));
                                box.set('petrole_res_total', (box.get('petrole_res_total') + value.quantite));
                        }
                    }

                    const bc_prix_moyen = (box.get('bc_prix_total') / box.get('bc_res_total')) + chance.floating({ min: 0, max: 0.1, fixed: 2 });

                    const bois_prix_moyen = (box.get('bois_prix_total') / box.get('bois_res_total')) + chance.floating({ min: 0, max: 0.1, fixed: 2 });

                    const brique_prix_moyen = (box.get('brique_prix_total') / box.get('brique_res_total')) + chance.floating({ min: 0, max: 0.1, fixed: 2 });

                    const eau_prix_moyen = (box.get('eau_prix_total') / box.get('eau_res_total')) + chance.floating({ min: 0, max: 0.1, fixed: 2 });

                    const metaux_prix_moyen = (box.get('metaux_prix_total') / box.get('metaux_res_total')) + chance.floating({ min: 0, max: 0.1, fixed: 2 });

                    const nourriture_prix_moyen = (box.get('nourriture_prix_total') / box.get('nourriture_res_total')) + chance.floating({ min: 0, max: 0.1, fixed: 2 });

                    const petrole_prix_moyen = (box.get('petrole_prix_total') / box.get('petrole_res_total')) + chance.floating({ min: 0, max: 0.1, fixed: 2 });

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
            },
            null,
            true,
            'Europe/Paris'
        );
    }
}