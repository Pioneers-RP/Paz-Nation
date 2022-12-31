const { codeBlock } = require('@discordjs/builders');
const { readFileSync, writeFileSync } = require('fs');
const { connection } = require('../index.js');
const { globalBox } = require('global-box');
const box = globalBox();
const dotenv = require('dotenv');
const Chance = require('chance');
const chance = new Chance();
const ms = require('ms');
const {client} = require("../index");
const CronJob = require('cron').CronJob;
const ressourceObject = JSON.parse(readFileSync('data/ressource.json', 'utf-8'));
const gouvernementObject = JSON.parse(readFileSync('data/gouvernement.json', 'utf-8'));
const batimentObject = JSON.parse(readFileSync('data/batiment.json', 'utf-8'));
const populationObject = JSON.parse(readFileSync('data/population.json', 'utf-8'));

module.exports = {
    name: 'ready',
    once: true,
    execute(client) {
        console.log(`Lancé sous le bot ${client.user.tag}`);

        const arrayStatut = [
            {
                type: 'PLAYING',
                content: '🌍 𝐏𝐀𝐙 𝐍𝐀𝐓𝐈𝐎𝐍 👑',
                status: 'online'
            },
            {
                type: 'WATCHING',
                content: '🖥️ Subcher Dev #1',
                status: 'online'
            },
            {
                type: 'WATCHING',
                content: '👑 Fexiop Owner #1',
                status: 'online'
            },
            {
                type: 'WATCHING',
                content: '🧮 Arkylon Stats #1',
                status: 'dnd'
            },
            {
                type: 'WATCHING',
                content: '🛎️ Lumber Guide #1',
                status: 'online'
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

        const autoUpdate = new CronJob(
            '0 0,10,20,30,40,50 * * * *',
            //'0 * * * * *',
            function autoUpdate() {

                const sql = `SELECT * FROM pays`;
                connection.query(sql, async (err, results) => {
                    const arrayPays = Object.values(results);
                    arrayPays.forEach(chaquePays);

                    function chaquePays(value, index, array) {
                        const sql = `
                            SELECT * FROM batiments WHERE id_joueur='${value.id_joueur}';
                            SELECT * FROM pays WHERE id_joueur='${value.id_joueur}';
                            SELECT * FROM population WHERE id_joueur='${value.id_joueur}';
                            SELECT * FROM ressources WHERE id_joueur='${value.id_joueur}';
                            SELECT * FROM territoire WHERE id_joueur='${value.id_joueur}'
                        `;
                        connection.query(sql, async (err, results) => {if (err) {throw err;}
                            const Batiment = results[0][0];
                            const Pays = results[1][0];
                            const Population = results[2][0];
                            const Ressources = results[3][0];
                            const Territoire = results[4][0];
                            console.log(Batiment)
                            console.log(Pays)
                            console.log(Population)
                            console.log(Ressources)
                            console.log(Territoire)
                            const pourVille = (Territoire.ville/Territoire.T_total)
                            const pourForet = (Territoire.foret/Territoire.T_total)
                            const pourPrairie = (Territoire.prairie/Territoire.T_total)
                            const pourDesert = (Territoire.desert/Territoire.T_total)
                            const pourToundra = (Territoire.toundra/Territoire.T_total)
                            const pourTaiga = (Territoire.taiga/Territoire.T_total)
                            const pourSavane = (Territoire.savane/Territoire.T_total)
                            const pourRocheuses = (Territoire.rocheuses/Territoire.T_total)
                            const pourVolcan = (Territoire.volcan/Territoire.T_total)
                            const pourMangrove = (Territoire.mangrove/Territoire.T_total)
                            const pourSteppe = (Territoire.steppe/Territoire.T_total)

                            const coef_brique = parseFloat((pourVille * ressourceObject.brique.ville + pourForet * ressourceObject.brique.foret + pourPrairie * ressourceObject.brique.prairie + pourDesert * ressourceObject.brique.desert + pourToundra * ressourceObject.brique.toundra + pourTaiga * ressourceObject.brique.taiga + pourSavane * ressourceObject.brique.savane + pourRocheuses * ressourceObject.brique.rocheuses + pourVolcan * ressourceObject.brique.volcan + pourMangrove * ressourceObject.brique.mangrove + pourSteppe * ressourceObject.brique.steppe).toFixed(2))
                            const coef_nourriture = parseFloat((pourVille * ressourceObject.nourriture.ville + pourForet * ressourceObject.nourriture.foret + pourPrairie * ressourceObject.nourriture.prairie + pourDesert * ressourceObject.nourriture.desert + pourToundra * ressourceObject.nourriture.toundra + pourTaiga * ressourceObject.nourriture.taiga + pourSavane * ressourceObject.nourriture.savane + pourRocheuses * ressourceObject.nourriture.rocheuses + pourVolcan * ressourceObject.nourriture.volcan + pourMangrove * ressourceObject.nourriture.mangrove + pourSteppe * ressourceObject.nourriture.steppe).toFixed(2))
                            const coef_eolienne = parseFloat((pourVille * ressourceObject.electricite.ville + pourForet * ressourceObject.electricite.foret + pourPrairie * ressourceObject.electricite.prairie + pourDesert * ressourceObject.electricite.desert + pourToundra * ressourceObject.electricite.toundra + pourTaiga * ressourceObject.electricite.taiga + pourSavane * ressourceObject.electricite.savane + pourRocheuses * ressourceObject.electricite.rocheuses + pourVolcan * ressourceObject.electricite.volcan + pourMangrove * ressourceObject.electricite.mangrove + pourSteppe * ressourceObject.electricite.steppe).toFixed(2))
                            const coef_metaux = parseFloat((pourVille * ressourceObject.metaux.ville + pourForet * ressourceObject.metaux.foret + pourPrairie * ressourceObject.metaux.prairie + pourDesert * ressourceObject.metaux.desert + pourToundra * ressourceObject.metaux.toundra + pourTaiga * ressourceObject.metaux.taiga + pourSavane * ressourceObject.metaux.savane + pourRocheuses * ressourceObject.metaux.rocheuses + pourVolcan * ressourceObject.metaux.volcan + pourMangrove * ressourceObject.metaux.mangrove + pourSteppe * ressourceObject.metaux.steppe).toFixed(2))
                            const coef_eau = parseFloat((pourVille * ressourceObject.eau.ville + pourForet * ressourceObject.eau.foret + pourPrairie * ressourceObject.eau.prairie + pourDesert * ressourceObject.eau.desert + pourToundra * ressourceObject.eau.toundra + pourTaiga * ressourceObject.eau.taiga + pourSavane * ressourceObject.eau.savane + pourRocheuses * ressourceObject.eau.rocheuses + pourVolcan * ressourceObject.eau.volcan + pourMangrove * ressourceObject.eau.mangrove + pourSteppe * ressourceObject.eau.steppe).toFixed(2))
                            const coef_petrole = parseFloat((pourVille * ressourceObject.petrole.ville + pourForet * ressourceObject.petrole.foret + pourPrairie * ressourceObject.petrole.prairie + pourDesert * ressourceObject.petrole.desert + pourToundra * ressourceObject.petrole.toundra + pourTaiga * ressourceObject.petrole.taiga + pourSavane * ressourceObject.petrole.savane + pourRocheuses * ressourceObject.petrole.rocheuses + pourVolcan * ressourceObject.petrole.volcan + pourMangrove * ressourceObject.petrole.mangrove + pourSteppe * ressourceObject.petrole.steppe).toFixed(2))
                            const coef_bois = parseFloat((pourVille * ressourceObject.bois.ville + pourForet * ressourceObject.bois.foret + pourPrairie * ressourceObject.bois.prairie + pourDesert * ressourceObject.bois.desert + pourToundra * ressourceObject.bois.toundra + pourTaiga * ressourceObject.bois.taiga + pourSavane * ressourceObject.bois.savane + pourRocheuses * ressourceObject.bois.rocheuses + pourVolcan * ressourceObject.bois.volcan + pourMangrove * ressourceObject.bois.mangrove + pourSteppe * ressourceObject.bois.steppe).toFixed(2))

                            let sql;
                            let prod_centrale_fioul;
                            if (Ressources.petrole >= batimentObject.centrale_fioul.CONSO_CENTRALE_FIOUL_PETROLE * Batiment.centrale_fioul) {
                                prod_centrale_fioul = Math.round(batimentObject.centrale_fioul.PROD_CENTRALE_FIOUL * Batiment.centrale_fioul);
                            } else {
                                prod_centrale_fioul = 0;
                            }

                            const prod_elec = Math.round(prod_centrale_fioul + batimentObject.eolienne.PROD_EOLIENNE * Batiment.eolienne * coef_eolienne);
                            const conso_elec = Math.round(batimentObject.briqueterie.CONSO_BRIQUETERIE_ELECTRICITE * Batiment.briqueterie + batimentObject.champ.CONSO_CHAMP_ELECTRICITE * Batiment.champ + batimentObject.mine.CONSO_MINE_ELECTRICITE * Batiment.mine + batimentObject.pompe_a_eau.CONSO_POMPE_A_EAU_ELECTRICITE * Batiment.pompe_a_eau + batimentObject.pumpjack.CONSO_PUMPJACK_ELECTRICITE * Batiment.pumpjack + batimentObject.quartier.CONSO_QUARTIER_ELECTRICITE * Batiment.quartier + batimentObject.scierie.CONSO_SCIERIE_ELECTRICITE * Batiment.scierie + batimentObject.usine_civile.CONSO_USINE_CIVILE_ELECTRICITE * Batiment.usine_civile);

                            if (prod_elec >= conso_elec) {
                                if (Ressources.petrole >= (batimentObject.centrale_fioul.CONSO_CENTRALE_FIOUL_PETROLE * Batiment.centrale_fioul)) {
                                    const conso_centrale_petrole = batimentObject.centrale_fioul.CONSO_CENTRALE_FIOUL_PETROLE * Batiment.centrale_fioul;
                                    sql = `UPDATE ressources SET petrole=petrole-${conso_centrale_petrole} WHERE id_joueur="${Pays.id_joueur}"`;
                                    connection.query(sql, async (err) => {if (err) {throw err;}})
                                }
                                if (Population.nourriture_acces < 1008) {
                                    sql = `UPDATE population SET elec_acces=elec_acces+1 WHERE id_joueur="${Pays.id_joueur}"`;
                                    connection.query(sql, async (err) => {if (err) {throw err;}})
                                }

                                sql = `
                                    SELECT * FROM batiments WHERE id_joueur='${Pays.id_joueur}';
                                    SELECT * FROM pays WHERE id_joueur='${Pays.id_joueur}';
                                    SELECT * FROM ressources WHERE id_joueur='${Pays.id_joueur}'
                                `;
                                connection.query(sql, async (err, results) => {
                                    const Batiment = results[0][0];
                                    const Pays = results[1][0];
                                    const Ressources = results[2][0];
                                    let conso_briqueterie = true;
                                    let manque_bois = false;
                                    let manque_eau = false;

                                    const conso_T_briqueterie_bois = Math.round(batimentObject.briqueterie.CONSO_BRIQUETERIE_BOIS * Batiment.briqueterie * eval(`gouvernementObject.${Pays.ideologie}.consommation`));
                                    if (conso_T_briqueterie_bois > Ressources.bois) {
                                        conso_briqueterie = false;
                                        manque_bois = true;
                                    }

                                    const conso_T_briqueterie_eau = Math.round(batimentObject.briqueterie.CONSO_BRIQUETERIE_EAU * Batiment.briqueterie * eval(`gouvernementObject.${Pays.ideologie}.consommation`));
                                    if (conso_T_briqueterie_eau > Ressources.eau) {
                                        conso_briqueterie = false;
                                        manque_eau = true;
                                    }

                                    if (conso_briqueterie === true) {
                                        const prod_T_briqueterie = Math.round(batimentObject.briqueterie.PROD_BRIQUETERIE * Batiment.briqueterie * eval(`gouvernementObject.${Pays.ideologie}.production`) * coef_brique);
                                        sql = `
                                            UPDATE ressources SET bois=bois-${conso_T_briqueterie_bois},
                                                                  eau=eau-${conso_T_briqueterie_eau},
                                                                  brique=brique+${prod_T_briqueterie} WHERE id_joueur="${Pays.id_joueur}"
                                        `;
                                        connection.query(sql, async (err) => {if (err) {throw err;}})
                                    } else {
                                        var manque = [];
                                        if (manque_bois === true) {
                                            manque.push({
                                                name: `> ⛔ Manque de bois ⛔ :`,
                                                value: `Bois : ${Ressources.bois.toLocaleString('en-US')}/${conso_T_briqueterie_bois.toLocaleString('en-US')}\n`
                                            })
                                        }
                                        if (manque_eau === true) {
                                            manque.push({
                                                name: `> ⛔ Manque d\'eau ⛔ :`,
                                                value: `Eau : ${Ressources.eau.toLocaleString('en-US')}/${conso_T_briqueterie_eau.toLocaleString('en-US')}\n`
                                            })
                                        }

                                        const embed = {
                                            author: {
                                                name: `${Pays.rang} de ${Pays.nom}`,
                                                icon_url: Pays.avatarURL
                                            },
                                            thumbnail: {
                                                url: Pays.drapeau
                                            },
                                            title: `\`Manque de matériaux : Briqueterie\``,
                                            fields: manque,
                                            color: 'RED',
                                            timestamp: new Date(),
                                            footer: {
                                                text: `${Pays.devise}`
                                            }
                                        };

                                        client.channels.cache.get(Pays.id_salon).send({embeds: [embed]})
                                            .catch(console.error);
                                    }
                                })

                                sql = `
                                    SELECT * FROM batiments WHERE id_joueur='${Pays.id_joueur}';
                                    SELECT * FROM pays WHERE id_joueur='${Pays.id_joueur}';
                                    SELECT * FROM ressources WHERE id_joueur='${Pays.id_joueur}'
                                `;
                                connection.query(sql, async (err, results) => {
                                    const Batiment = results[0][0];
                                    const Pays = results[1][0];
                                    const Ressources = results[2][0];
                                    let conso_champ = true;

                                    const conso_T_champ_eau = Math.round(batimentObject.champ.CONSO_CHAMP_EAU * Batiment.champ * eval(`gouvernementObject.${Pays.ideologie}.consommation`));
                                    if (conso_T_champ_eau > Ressources.eau) {
                                        conso_champ = false;
                                        var manque_eau = true
                                    }

                                    if (conso_champ === true) {
                                        const prod_T_champ = Math.round(batimentObject.champ.PROD_CHAMP * Batiment.champ * eval(`gouvernementObject.${Pays.ideologie}.production`) * coef_nourriture);
                                        sql = `
                                            UPDATE ressources SET eau=eau-${conso_T_champ_eau},
                                                                  nourriture=nourriture+${prod_T_champ} WHERE id_joueur="${Pays.id_joueur}"
                                            `;
                                        connection.query(sql, async (err) => {if (err) {throw err;}})
                                    } else {
                                        var manque = [];
                                        if (manque_eau === true) {
                                            manque.push({
                                                name: `> ⛔ Manque d\'eau ⛔ :`,
                                                value: `Eau : ${Ressources.eau.toLocaleString('en-US')}/${conso_T_champ_eau.toLocaleString('en-US')}\n`
                                            })
                                        }

                                        const embed = {
                                            author: {
                                                name: `${Pays.rang} de ${Pays.nom}`,
                                                icon_url: Pays.avatarURL
                                            },
                                            thumbnail: {
                                                url: Pays.drapeau
                                            },
                                            title: `\`Manque de matériaux : Champ\``,
                                            fields: manque,
                                            color: 'RED',
                                            timestamp: new Date(),
                                            footer: {
                                                text: `${Pays.devise}`
                                            }
                                        };

                                        client.channels.cache.get(Pays.id_salon).send({embeds: [embed]})
                                            .catch(console.error);
                                    }
                                })

                                sql = `
                                    SELECT * FROM batiments WHERE id_joueur='${Pays.id_joueur}';
                                    SELECT * FROM pays WHERE id_joueur='${Pays.id_joueur}';
                                    SELECT * FROM ressources WHERE id_joueur='${Pays.id_joueur}'
                                `;
                                connection.query(sql, async (err, results) => {
                                    const Batiment = results[0][0];
                                    const Pays = results[1][0];
                                    const Ressources = results[2][0];
                                    var conso_mine = true

                                    const conso_T_mine_bois = Math.round(batimentObject.mine.CONSO_MINE_BOIS * Batiment.mine * eval(`gouvernementObject.${Pays.ideologie}.consommation`));
                                    if (conso_T_mine_bois > Ressources.bois) {
                                        var conso_mine = false
                                        var manque_bois = true
                                    }

                                    const conso_T_mine_petrole = Math.round(batimentObject.mine.CONSO_MINE_PETROLE * Batiment.mine * eval(`gouvernementObject.${Pays.ideologie}.consommation`));
                                    if (conso_T_mine_petrole >Ressources.petrole) {
                                        var conso_mine = false
                                        var manque_petrole = true
                                    }

                                    if (conso_mine === true) {
                                        const prod_T_mine = Math.round(batimentObject.mine.PROD_MINE * Batiment.mine * eval(`gouvernementObject.${Pays.ideologie}.production`) * coef_metaux);
                                        sql = `
                                        UPDATE ressources SET bois=bois-${conso_T_mine_bois},
                                                              petrole=petrole-${conso_T_mine_petrole},
                                                              metaux=metaux+${prod_T_mine} WHERE id_joueur="${Pays.id_joueur}"`;
                                        connection.query(sql, async (err) => {if (err) {throw err;}})
                                    } else {
                                        var manque = [];
                                        if (manque_bois === true) {
                                            manque.push({
                                                name: `> ⛔ Manque de bois ⛔ :`,
                                                value: `Bois : ${Ressources.bois.toLocaleString('en-US')}/${conso_T_mine_bois.toLocaleString('en-US')}\n`
                                            })
                                        }
                                        if (manque_petrole === true) {
                                            manque.push({
                                                name: `> ⛔ Manque de pétrole ⛔ :`,
                                                value: `Pétrole : ${Ressources.petrole.toLocaleString('en-US')}/${conso_T_mine_petrole.toLocaleString('en-US')}\n`
                                            })
                                        }

                                        const embed = {
                                            author: {
                                                name: `${Pays.rang} de ${Pays.nom}`,
                                                icon_url: Pays.avatarURL
                                            },
                                            thumbnail: {
                                                url: Pays.drapeau
                                            },
                                            title: `\`Manque de matériaux : Mine\``,
                                            fields: manque,
                                            color: 'RED',
                                            timestamp: new Date(),
                                            footer: {
                                                text: `${Pays.devise}`
                                            }
                                        };

                                        client.channels.cache.get(Pays.id_salon).send({embeds: [embed]})
                                            .catch(console.error);
                                    }
                                })

                                sql = `
                                    SELECT * FROM batiments WHERE id_joueur='${Pays.id_joueur}';
                                    SELECT * FROM pays WHERE id_joueur='${Pays.id_joueur}';
                                    SELECT * FROM ressources WHERE id_joueur='${Pays.id_joueur}'
                                `;
                                connection.query(sql, async (err, results) => {
                                    const Batiment = results[0][0];
                                    const Pays = results[1][0];
                                    const Ressources = results[2][0];
                                    var conso_pompe_a_eau = true

                                    var conso_T_pompe_a_eau_petrole = Math.round(batimentObject.pompe_a_eau.CONSO_POMPE_A_EAU_PETROLE * Batiment.pompe_a_eau * eval(`gouvernementObject.${Pays.ideologie}.consommation`));
                                    if (conso_T_pompe_a_eau_petrole > Ressources.petrole) {
                                        var conso_pompe_a_eau = false
                                        var manque_petrole = true
                                    }

                                    if (conso_pompe_a_eau === true) {
                                        const prod_T_pompe_a_eau = Math.round(batimentObject.pompe_a_eau.PROD_POMPE_A_EAU * Batiment.pompe_a_eau * eval(`gouvernementObject.${Pays.ideologie}.production`) * coef_eau);
                                        sql = `
                                            UPDATE ressources SET petrole=petrole-${conso_T_pompe_a_eau_petrole},
                                                                  eau=eau+${prod_T_pompe_a_eau} WHERE id_joueur="${Pays.id_joueur}"`;
                                        connection.query(sql, async (err) => {if (err) {throw err;}})
                                    } else {
                                        var manque = [];
                                        if (manque_petrole === true) {
                                            manque.push({
                                                name: `> ⛔ Manque de pétrole ⛔ :`,
                                                value: `Pétrole : ${Ressources.petrole.toLocaleString('en-US')}/${conso_T_pompe_a_eau_petrole.toLocaleString('en-US')}\n`
                                            })
                                        }

                                        const embed = {
                                            author: {
                                                name: `${Pays.rang} de ${Pays.nom}`,
                                                icon_url: Pays.avatarURL
                                            },
                                            thumbnail: {
                                                url: Pays.drapeau
                                            },
                                            title: `\`Manque de matériaux : Pompe à eau\``,
                                            fields: manque,
                                            color: 'RED',
                                            timestamp: new Date(),
                                            footer: {
                                                text: `${Pays.devise}`
                                            }
                                        };

                                        client.channels.cache.get(Pays.id_salon).send({embeds: [embed]})
                                            .catch(console.error);
                                    }
                                })

                                sql = `
                                    SELECT * FROM batiments WHERE id_joueur='${Pays.id_joueur}';
                                    SELECT * FROM pays WHERE id_joueur='${Pays.id_joueur}';
                                    SELECT * FROM ressources WHERE id_joueur='${Pays.id_joueur}'
                                `;
                                connection.query(sql, async (err, results) => {
                                    const Batiment = results[0][0];
                                    const Pays = results[1][0];
                                    const Ressources = results[2][0];
                                    var conso_pumpjack = true

                                    if (conso_pumpjack === true) {
                                        const prod_T_pumpjack = Math.round(batimentObject.pumpjack.PROD_PUMPJACK * Batiment.pumpjack * eval(`gouvernementObject.${Pays.ideologie}.production`) * coef_petrole);
                                        sql = `UPDATE ressources SET petrole=petrole+${prod_T_pumpjack} WHERE id_joueur="${Pays.id_joueur}"`;
                                        connection.query(sql, async (err) => {if (err) {throw err;}})
                                    } else {
                                        const embed = {
                                            author: {
                                                name: `${Pays.rang} de ${Pays.nom}`,
                                                icon_url: Pays.avatarURL
                                            },
                                            thumbnail: {
                                                url: Pays.drapeau
                                            },
                                            title: `\`Manque de matériaux : Pumpjack\``,
                                            fields: manque,
                                            color: 'RED',
                                            timestamp: new Date(),
                                            footer: {
                                                text: `${Pays.devise}`
                                            }
                                        };

                                        client.channels.cache.get(Pays.id_salon).send({embeds: [embed]})
                                            .catch(console.error);
                                    }
                                })

                                sql = `
                                    SELECT * FROM batiments WHERE id_joueur='${Pays.id_joueur}';
                                    SELECT * FROM pays WHERE id_joueur='${Pays.id_joueur}';
                                    SELECT * FROM ressources WHERE id_joueur='${Pays.id_joueur}'
                                `;
                                connection.query(sql, async (err, results) => {
                                    const Batiment = results[0][0];
                                    const Pays = results[1][0];
                                    const Ressources = results[2][0];
                                    var conso_scierie = true

                                    const conso_T_scierie_petrole = Math.round(batimentObject.scierie.CONSO_SCIERIE_PETROLE * Batiment.scierie * eval(`gouvernementObject.${Pays.ideologie}.consommation`));
                                    if (conso_T_scierie_petrole > Ressources.petrole) {
                                        var conso_scierie = false
                                        var manque_petrole = true
                                    }

                                    if (conso_scierie === true) {
                                        const prod_T_scierie = Math.round(batimentObject.scierie.PROD_SCIERIE * Batiment.scierie * eval(`gouvernementObject.${Pays.ideologie}.production`) * coef_bois);
                                        sql = `
                                            UPDATE ressources SET petrole=petrole-${conso_T_scierie_petrole},
                                                                  bois=bois+${prod_T_scierie} WHERE id_joueur="${Pays.id_joueur}"`;
                                        connection.query(sql, async (err) => {if (err) {throw err;}});
                                    } else {
                                        var manque = [];
                                        if (manque_petrole === true) {
                                            manque.push({
                                                name: `> ⛔ Manque de pétrole ⛔ :`,
                                                value: `Pétrole : ${Ressources.petrole.toLocaleString('en-US')}/${conso_T_scierie_petrole.toLocaleString('en-US')}\n`
                                            })
                                        }

                                        const embed = {
                                            author: {
                                                name: `${Pays.rang} de ${Pays.nom}`,
                                                icon_url: Pays.avatarURL
                                            },
                                            thumbnail: {
                                                url: Pays.drapeau
                                            },
                                            title: `\`Manque de matériaux : Scierie\``,
                                            fields: manque,
                                            color: 'RED',
                                            timestamp: new Date(),
                                            footer: {
                                                text: `${Pays.devise}`
                                            }
                                        };

                                        client.channels.cache.get(Pays.id_salon).send({embeds: [embed]})
                                            .catch(console.error);
                                    }
                                })

                                sql = `
                                    SELECT * FROM batiments WHERE id_joueur='${Pays.id_joueur}';
                                    SELECT * FROM pays WHERE id_joueur='${Pays.id_joueur}';
                                    SELECT * FROM ressources WHERE id_joueur='${Pays.id_joueur}'
                                `;
                                connection.query(sql, async (err, results) => {
                                    const Batiment = results[0][0];
                                    const Pays = results[1][0];
                                    const Ressources = results[2][0];
                                    var conso_usine_civile = true

                                    const conso_T_usine_civile_bois = Math.round(batimentObject.usine_civile.CONSO_USINE_CIVILE_BOIS * Batiment.usine_civile * eval(`gouvernementObject.${Pays.ideologie}.consommation`));
                                    if (conso_T_usine_civile_bois > Ressources.bois) {
                                        var conso_usine_civile = false
                                        var manque_bois = true
                                    }

                                    const conso_T_usine_civile_metaux = Math.round(batimentObject.usine_civile.CONSO_USINE_CIVILE_METAUX * Batiment.usine_civile * eval(`gouvernementObject.${Pays.ideologie}.consommation`));
                                    if (conso_T_usine_civile_metaux > Ressources.metaux) {
                                        var conso_usine_civile = false
                                        var manque_metaux = true
                                    }

                                    const conso_T_usine_civile_petrole = Math.round(batimentObject.usine_civile.CONSO_USINE_CIVILE_PETROLE * Batiment.usine_civile * eval(`gouvernementObject.${Pays.ideologie}.consommation`));
                                    if (conso_T_usine_civile_petrole > Ressources.petrole) {
                                        var conso_usine_civile = false
                                        var manque_petrole = true
                                    }

                                    if (conso_usine_civile === true) {

                                        const prod_T_usine_civile = Math.round(batimentObject.usine_civile.PROD_USINE_CIVILE * Batiment.usine_civile * eval(`gouvernementObject.${Pays.ideologie}.production`));
                                        sql = `
                                            UPDATE ressources SET bois=bois-${conso_T_usine_civile_bois},
                                                                  metaux=metaux-${conso_T_usine_civile_metaux},
                                                                  petrole=petrole-${conso_T_usine_civile_petrole},
                                                                  bc=bc+${prod_T_usine_civile} WHERE id_joueur="${Pays.id_joueur}"`;
                                        connection.query(sql, async (err) => {if (err) {throw err;}})
                                    } else {
                                        var manque = [];
                                        if (manque_bois === true) {
                                            manque.push({
                                                name: `> ⛔ Manque de bois ⛔ :`,
                                                value: `Bois : ${Ressources.bois.toLocaleString('en-US')}/${conso_T_usine_civile_bois.toLocaleString('en-US')}\n`
                                            })
                                        }
                                        if (manque_metaux === true) {
                                            manque.push({
                                                name: `> ⛔ Manque de métaux ⛔ :`,
                                                value: `Métaux : ${Ressources.metaux.toLocaleString('en-US')}/${conso_T_usine_civile_metaux.toLocaleString('en-US')}\n`
                                            })
                                        }
                                        if (manque_petrole === true) {
                                            manque.push({
                                                name: `> ⛔ Manque de pétrole ⛔ :`,
                                                value: `Pétrole : ${Ressources.petrole.toLocaleString('en-US')}/${conso_T_usine_civile_petrole.toLocaleString('en-US')}\n`
                                            })
                                        }

                                        const embed = {
                                            author: {
                                                name: `${Pays.rang} de ${Pays.nom}`,
                                                icon_url: Pays.avatarURL
                                            },
                                            thumbnail: {
                                                url: Pays.drapeau
                                            },
                                            title: `\`Manque de matériaux : Usine civile\``,
                                            fields: manque,
                                            color: 'RED',
                                            timestamp: new Date(),
                                            footer: {
                                                text: `${Pays.devise}`
                                            }
                                        };

                                        client.channels.cache.get(Pays.id_salon).send({embeds: [embed]})
                                            .catch(console.error);
                                    }
                                });
                            } else if (prod_elec > batimentObject.quartier.CONSO_QUARTIER_ELECTRICITE * Batiment.quartier) {
                                sql = `UPDATE ressources SET petrole=0 WHERE id_joueur="${Pays.id_joueur}";`;

                                if (Population.elec_acces < 1008) {
                                    sql = sql + `UPDATE population SET elec_acces=elec_acces+1 WHERE id_joueur="${Pays.id_joueur}"`;
                                }
                                connection.query(sql, async (err) => {if (err) {throw err;}})

                                const embed = {
                                    author: {
                                        name: `${Pays.rang} de ${Pays.nom}`,
                                        icon_url: Pays.avatarURL
                                    },
                                    thumbnail: {
                                        url: Pays.drapeau
                                    },
                                    title: `\`Pas assez d'électricité : Blackout\``,
                                    fields: {
                                        name: `> ⛔ Manque d'électricité ⛔ :`,
                                        value: `Vos usines n'ont pas produit mais vos quartiers ont été fourni en électricité\n` +
                                            `Electricité : ${prod_elec.toLocaleString('en-US')}/${conso_elec.toLocaleString('en-US')}\n`
                                    },
                                    color: 'RED',
                                    timestamp: new Date(),
                                    footer: {
                                        text: `${Pays.devise}`
                                    }
                                }
                                client.channels.cache.get(Pays.id_salon).send({embeds: [embed]})
                                    .catch(console.error);
                            } else {
                                sql = `UPDATE ressources SET petrole=0 WHERE id_joueur="${Pays.id_joueur}"`;
                                connection.query(sql, async (err) => {if (err) {throw err;}})

                                const embed = {
                                    author: {
                                        name: `${Pays.rang} de ${Pays.nom}`,
                                        icon_url: Pays.avatarURL
                                    },
                                    thumbnail: {
                                        url: Pays.drapeau
                                    },
                                    title: `\`Pas assez d'électricité : Blackout\``,
                                    fields: {
                                        name: `> ⛔ Manque d'électricité ⛔ :`,
                                        value: `Tout votre pays est dépourvu d'électricité !\n` +
                                            `Electricité : ${prod_elec.toLocaleString('en-US')}/${conso_elec.toLocaleString('en-US')}\n`
                                    },
                                    color: 'RED',
                                    timestamp: new Date(),
                                    footer: {
                                        text: `${Pays.devise}`
                                    }
                                }
                                client.channels.cache.get(Pays.id_salon).send({embeds: [embed]})
                                    .catch(console.error);
                            }
                        })
                    }
                })
            },
            null,
            true,
            'Europe/Paris'
        );

        const autoPopulation = new CronJob(
            '0 0 6,12,20 * * *',

            function popUpdate() {
                let sql;
                sql = `SELECT * FROM pays`;
                connection.query(sql, async(err, results) => {if (err) {throw err;}
                    const arrayPays = Object.values(results);
                    arrayPays.forEach(chaquePays);

                    function chaquePays(value, index, array) {
                        const sql = `
                            SELECT * FROM batiments WHERE id_joueur='${value.id_joueur}';
                            SELECT * FROM pays WHERE id_joueur='${value.id_joueur}';
                            SELECT * FROM population WHERE id_joueur='${value.id_joueur}';
                            SELECT * FROM ressources WHERE id_joueur='${value.id_joueur}'
                        `;
                        connection.query(sql, async (err, results) => {if (err) {throw err;}
                            const Batiment = results[0][0];
                            const Pays = results[1][0];
                            const Population = results[2][0];
                            const Ressources = results[3][0];

                            if (Ressources.nourriture >= (Population.habitant * parseFloat(populationObject.NOURRITURE_CONSO))) {
                                if (Population.nourriture_appro >= (Population.habitant * parseFloat(populationObject.NOURRITURE_CONSO))) {
                                    if (Population.nourriture_acces < 21) {
                                        var sql = `UPDATE population SET nourriture_acces=nourriture_acces+0.33 WHERE id_joueur="${Pays.id_joueur}";`;
                                    } else {
                                        var sql = ``;
                                    }
                                } else {
                                    var sql = `UPDATE population SET nourriture_acces=0 WHERE id_joueur="${Pays.id_joueur}";`;
                                }
                            } else {
                                var sql = `UPDATE population SET nourriture_acces=0 WHERE id_joueur="${Pays.id_joueur}";`;
                            }

                            if (Ressources.eau > (Population.habitant * parseFloat(populationObject.EAU_CONSO))) {
                                if (Population.eau_appro >= (Population.habitant * parseFloat(populationObject.EAU_CONSO))) {
                                    if (Population.eau_acces < 21) {
                                        var sql = sql + `UPDATE population SET eau_acces=eau_acces+0.33 WHERE id_joueur="${Pays.id_joueur}";`;
                                    }
                                } else {
                                    var sql = `UPDATE population SET eau_acces=0 WHERE id_joueur="${Pays.id_joueur}";`;
                                }
                            } else {
                                var sql = sql + `UPDATE population SET eau_acces=0 WHERE id_joueur="${Pays.id_joueur}";`;
                            }

                            const conso_bc = (1 + Population.bc_acces * 0.04 + Population.bonheur * 0.016 + (Population.habitant / 10000000) * 0.04) * Population.habitant * eval(`gouvernementObject.${Pays.ideologie}.conso_bc`)
                            //console.log(conso_bc)
                            if (Ressources.bc > (conso_bc)) {
                                if (Population.bc_acces < 21) {
                                    var sql = sql + `UPDATE population SET bc_acces=bc_acces+0.33 WHERE id_joueur="${Pays.id_joueur}";UPDATE ressources SET bc=bc-${conso_bc} WHERE id_joueur="${Pays.id_joueur}";`;
                                } else {
                                    var sql = sql + `UPDATE ressources SET bc=bc-${conso_bc} WHERE id_joueur="${Pays.id_joueur}";`
                                }
                            } else {
                                var sql = sql + `UPDATE population SET bc_acces=0 WHERE id_joueur="${Pays.id_joueur}";UPDATE ressources SET bc=0 WHERE id_joueur="${Pays.id_joueur}";`;
                            }

                            var sql = sql + `SELECT * FROM pays WHERE id_joueur="${Pays.id_joueur}"`;
                            connection.query(sql, async(err) => { if (err) { throw err; }})

                            var sql = `
                            SELECT * FROM batiments WHERE id_joueur='${Pays.id_joueur}';
                            SELECT * FROM pays WHERE id_joueur='${Pays.id_joueur}';
                            SELECT * FROM population WHERE id_joueur='${Pays.id_joueur}';
                            SELECT * FROM ressources WHERE id_joueur='${Pays.id_joueur}'
                            `;
                            connection.query(sql, async (err, results) => {if (err) {throw err;}
                                const Batiment = results[0][0];
                                const Pays = results[1][0];
                                const Population = results[2][0];
                                const Ressources = results[3][0];

                                const nourriture_acces = Population.nourriture_acces * 1.7;
                                //console.log(nourriture_acces)

                                const eau_acces = Population.eau_acces * 2.1;
                                //console.log(eau_acces)
                                const elec_acces = Population.elec_acces * (0.8 / (6 * 8));

                                const bc_acces = Population.bc_acces * 1.45;
                                //console.log(bc_acces)

                                var tauxbcmadein = (batimentObject.usine_civile.PROD_USINE_CIVILE * Batiment.usine_civile * eval(`gouvernementObject.${Pays.ideologie}.production`)) / (Population.habitant * 9 * 0.5);
                                if (tauxbcmadein > 0.8) {
                                    var tauxbcmadein = 0.8;
                                }
                                var tauxbcmadein = tauxbcmadein * 29
                                //console.log(tauxbcmadein)

                                const place = (Batiment.quartier * 1500)
                                var sans_abri = (Population.habitant - place)
                                if (sans_abri < 0) {
                                    var sans_abri = 0
                                }
                                const pourcentage_sans_abri = (sans_abri / Population.habitant)
                                const sdf = (1 - pourcentage_sans_abri) * 18;
                                //console.log(sdf)

                                const modifier = parseFloat(populationObject.BONHEUR_BASE) + nourriture_acces + eau_acces + elec_acces + bc_acces + tauxbcmadein + sdf + eval(`gouvernementObject.${Pays.ideologie}.bonheur`);
                                const bonheur = parseFloat(((-92 * Math.exp(-0.02 * modifier)) + 100).toFixed(1));
                                //console.log(modifier)
                                //console.log(bonheur)
                                var sql = `UPDATE population SET bonheur="${bonheur}" WHERE id_joueur="${Pays.id_joueur}"`;
                                connection.query(sql, async(err) => { if (err) { throw err; }})
                            })

                            const pop_taux_demo = ((10 + Population.eau_acces * 2.3 + Population.nourriture_acces * 2.3 + Population.bonheur * 1) / 100).toFixed(2);
                            var enfant = Math.round((15 / 16) * Population.enfant + (populationObject.NATALITE_JEUNE * pop_taux_demo * Population.jeune) + (populationObject.NATALITE_ADULTE * pop_taux_demo * Population.adulte) - populationObject.MORTALITE_ENFANT * Population.enfant);
                            if (enfant < 0) {
                                var enfant = 0;
                            }
                            var jeune = Math.round((8 / 9) * Population.jeune + (1 / 15) * Population.enfant - populationObject.MORTALITE_JEUNE * Population.jeune);
                            if (jeune < 0) {
                                var jeune = 0;
                            }
                            var adulte = Math.round((30 / 31) * Population.adulte + (1 / 9) * Population.jeune - populationObject.MORTALITE_ADULTE * Population.adulte);
                            if (adulte < 0) {
                                var adulte = 0;
                            }
                            var vieux = Math.round(Population.vieux + (1 / 31) * Population.adulte - populationObject.MORTALITE_VIEUX * Population.vieux);
                            if (vieux < 0) {
                                var vieux = 0;
                            }

                            var sql = `
                                UPDATE population SET pop_taux_demo="${pop_taux_demo}",
                                                      enfant="${enfant}",
                                                      jeune="${jeune}",
                                                      adulte="${adulte}",
                                                      vieux="${vieux}" WHERE id_joueur="${Pays.id_joueur}";`;
                            connection.query(sql, async(err) => { if (err) { throw err; }})

                            if (Ressources.nourriture >= Population.habitant * populationObject.NOURRITURE_CONSO) {
                                if (Population.nourriture_appro >= Population.habitant * populationObject.NOURRITURE_CONSO) {
                                    //C'est good
                                } else {
                                    const manque = (Population.habitant * populationObject.NOURRITURE_CONSO) - Population.nourriture_appro;
                                    const mort = Math.round(manque * 0.2);
                                    const habitants_next = Population.habitant - mort;

                                    if (Population.nourriture_acces !== 0) {
                                        const embed = {
                                            author: {
                                                name: `${Pays.rang} de ${Pays.nom}`,
                                                icon_url: Pays.avatarURL
                                            },
                                            thumbnail: {
                                                url: Pays.drapeau
                                            },
                                            title: `\`Une famine frappe votre pays :\``,
                                            fields: {
                                                name: `> ⛔ Manque d'approvisionnement en nourriture ⛔ :`,
                                                value: `Approvisionnement : ${Population.nourriture_appro.toLocaleString('en-US')}/${(Population.habitant * populationObject.NOURRITURE_CONSO).toLocaleString('en-US')}\n` +
                                                    `Morts : ${(mort * 4).toLocaleString('en-US')}\n` +
                                                    `Population restante : ${habitants_next.toLocaleString('en-US')}\n`
                                            },
                                            color: 'RED',
                                            timestamp: new Date(),
                                            footer: {
                                                text: `${Pays.devise}`
                                            }
                                        };
                                        client.channels.cache.get(Pays.id_salon).send({ embeds: [embed] });
                                    }

                                    var sql = `
                                        UPDATE ressources SET nourriture=nourriture-${Population.nourriture_appro} WHERE id_joueur="${Pays.id_joueur}";
                                        UPDATE poulation SET habitant=habitant-${mort * 4},
                                                             enfant=enfant-${mort},
                                                             jeune=jeune-${mort},
                                                             adulte=adulte-${mort},
                                                             vieux=vieux-${mort} WHERE id_joueur="${Pays.id_joueur}"`;
                                    connection.query(sql, async(err) => { if (err) { throw err; }})
                                }
                            } else {
                                if (Population.nourriture_appro >= Population.habitant * populationObject.NOURRITURE_CONSO) {
                                    const manque = (Population.habitant * populationObject.NOURRITURE_CONSO) - Ressources.nourriture;
                                    const mort = Math.round(manque * 0.2);
                                    const habitants_next = Population.habitant - mort;

                                    if (value.nourriture_acces !== 0) {
                                        const embed = {
                                            author: {
                                                name: `${Pays.rang} de ${Pays.nom}`,
                                                icon_url: Pays.avatarURL
                                            },
                                            thumbnail: {
                                                url: Pays.drapeau
                                            },
                                            title: `\`Une famine frappe votre pays :\``,
                                            fields: {
                                                name: `> ⛔ Manque de nourriture ⛔ :`,
                                                value: `Nourriture : ${Ressources.nourriture.toLocaleString('en-US')}/${(Population.habitant * populationObject.NOURRITURE_CONSO).toLocaleString('en-US')}\n` +
                                                    `Morts : ${(mort * 4).toLocaleString('en-US')}\n` +
                                                    `Population restante : ${habitants_next.toLocaleString('en-US')}\n`
                                            },
                                            color: 'RED',
                                            timestamp: new Date(),
                                            footer: {
                                                text: `${Pays.devise}`
                                            }
                                        };
                                        client.channels.cache.get(Pays.id_salon).send({ embeds: [embed] });
                                    }

                                    var sql = `
                                        UPDATE ressources SET nourriture=0 WHERE id_joueur="${Pays.id_joueur}";
                                        UPDATE population SET habitant=habitant-${mort * 4},
                                                              enfant=enfant-${mort},
                                                              jeune=jeune-${mort},
                                                              adulte=adulte-${mort},
                                                              vieux=vieux-${mort} WHERE id_joueur="${Pays.id_joueur}"`;
                                    connection.query(sql, async(err) => { if (err) { throw err; }})
                                } else {
                                    const manque = (habitants * populationObject.NOURRITURE_CONSO) - value.nourriture
                                    const mort = Math.round(manque * 0.2)
                                    const habitants_next = habitants - mort

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
                                                name: `> ⛔ Manque de nourriture et d'approvisionnement⛔ :`,
                                                value: `Nourriture : ${value.nourriture.toLocaleString('en-US')}/${(habitants * parseFloat(populationObject.NOURRITURE_CONSO)).toLocaleString('en-US')}\n` +
                                                    `Approvisionnement : ${value.nourriture_appro.toLocaleString('en-US')}/${(habitants * parseFloat(populationObject.NOURRITURE_CONSO)).toLocaleString('en-US')}\n` +
                                                    `Morts : ${(mort * 4).toLocaleString('en-US')}\n` +
                                                    `Population restante : ${habitants_next.toLocaleString('en-US')}\n`
                                            },
                                            color: 'RED',
                                            timestamp: new Date(),
                                            footer: {
                                                text: `${Pays.devise}`
                                            }
                                        };
                                        client.channels.cache.get(Pays.id_salon).send({ embeds: [embed] });
                                    }

                                    var sql = `
                                        UPDATE ressources SET nourriture=0 WHERE id_joueur="${Pays.id_joueur}";
                                        UPDATE population SET habitant=habitant-${mort * 4},
                                                              enfant=enfant-${mort},
                                                              jeune=jeune-${mort},
                                                              adulte=adulte-${mort},
                                                              vieux=vieux-${mort} WHERE id_joueur="${value.id_joueur}"
                                    `;
                                    connection.query(sql, async(err) => { if (err) { throw err; }})
                                }
                            }

                            if (Ressources.eau >= Population.habitant * populationObject.EAU_CONSO) {
                                if (Population.eau_appro >= Population.habitant * populationObject.EAU_CONSO) {
                                    //C'est good
                                } else {
                                    const manque = (Population.habitant * populationObject.EAU_CONSO) - Population.eau_appro;
                                    const mort = Math.round(manque * 0.2);
                                    const habitants_next = Population.habitant - mort;

                                    if (Population.eau_acces !== 0) {
                                        const embed = {
                                            author: {
                                                name: `${Pays.rang} de ${Pays.nom}`,
                                                icon_url: Pays.avatarURL
                                            },
                                            thumbnail: {
                                                url: Pays.drapeau
                                            },
                                            title: `\`Une pénurie frappe votre pays :\``,
                                            fields: {
                                                name: `> ⛔ Manque d'approvisionnement en eau ⛔ :`,
                                                value: `Approvisionnement : ${Population.eau_appro.toLocaleString('en-US')}/${(Population.habitant * populationObject.EAU_CONSO).toLocaleString('en-US')}\n` +
                                                    `Morts : ${(mort * 4).toLocaleString('en-US')}\n` +
                                                    `Population restante : ${habitants_next.toLocaleString('en-US')}\n`
                                            },
                                            color: 'RED',
                                            timestamp: new Date(),
                                            footer: {
                                                text: `${Pays.devise}`
                                            }
                                        };
                                        client.channels.cache.get(Pays.id_salon).send({ embeds: [embed] });
                                    }

                                    var sql = `
                                        UPDATE ressources SET eau=eau-${Population.eau_appro} WHERE id_joueur="${Pays.id_joueur}";
                                        UPDATE population SET habitant=habitant-${mort * 4},
                                                              enfant=enfant-${mort},
                                                              jeune=jeune-${mort},
                                                              adulte=adulte-${mort},
                                                              vieux=vieux-${mort} WHERE id_joueur="${Pays.id_joueur}"`;
                                    connection.query(sql, async(err) => { if (err) { throw err; }})
                                }
                            } else {
                                if (Population.eau_appro >= Population.habitant * populationObject.EAU_CONSO) {
                                    const manque = (habitants * populationObject.EAU_CONSO) - Ressources.eau;
                                    const mort = Math.round(manque * 0.2);
                                    const habitants_next = habitants - mort;

                                    if (Population.eau_acces !== 0) {
                                        const embed = {
                                            author: {
                                                name: `${Pays.rang} de ${Pays.nom}`,
                                                icon_url: Pays.avatarURL
                                            },
                                            thumbnail: {
                                                url: Pays.drapeau
                                            },
                                            title: `\`Une pénurie frappe votre pays :\``,
                                            fields: {
                                                name: `> ⛔ Manque d'eau ⛔ :`,
                                                value: `Nourriture : ${Ressources.eau.toLocaleString('en-US')}/${(Population.habitant * populationObject.EAU_CONSO).toLocaleString('en-US')}\n` +
                                                    `Morts : ${(mort * 4).toLocaleString('en-US')}\n` +
                                                    `Population restante : ${habitants_next.toLocaleString('en-US')}\n`
                                            },
                                            color: 'RED',
                                            timestamp: new Date(),
                                            footer: {
                                                text: `${Pays.devise}`
                                            }
                                        };
                                        client.channels.cache.get(Pays.id_salon).send({ embeds: [embed] });
                                    }

                                    var sql = `
                                        UPDATE ressources SET eau=0 WHERE id_joueur="${Pays.id_joueur}";
                                        UPDATE population SET habitant=habitant-${mort * 4},
                                                              enfant=enfant-${mort},
                                                              jeune=jeune-${mort},
                                                              adulte=adulte-${mort},
                                                              vieux=vieux-${mort} WHERE id_joueur="${Pays.id_joueur}"`;
                                    connection.query(sql, async(err) => { if (err) { throw err; }})
                                } else {
                                    const manque = (Population.habitant * populationObject.EAU_CONSO) - Ressources.eau
                                    const mort = Math.round(manque * 0.2)
                                    const habitants_next = Population.habitant - mort

                                    if (Population.eau_acces !== 0) {
                                        const embed = {
                                            author: {
                                                name: `${Pays.rang} de ${Pays.nom}`,
                                                icon_url: Pays.drapeau
                                            },
                                            thumbnail: {
                                                url: Pays.drapeau
                                            },
                                            title: `\`Une famine frappe votre pays :\``,
                                            fields: {
                                                name: `> ⛔ Manque d'eau et d'approvisionnement⛔ :`,
                                                value: `Eau : ${Ressources.eau.toLocaleString('en-US')}/${(Population.habitant * parseFloat(populationObject.EAU_CONSO)).toLocaleString('en-US')}\n` +
                                                    `Approvisionnement : ${Population.eau_appro.toLocaleString('en-US')}/${(Population.habitant * parseFloat(populationObject.EAU_CONSO)).toLocaleString('en-US')}\n` +
                                                    `Morts : ${(mort * 4).toLocaleString('en-US')}\n` +
                                                    `Population restante : ${habitants_next.toLocaleString('en-US')}\n`
                                            },
                                            color: 'RED',
                                            timestamp: new Date(),
                                            footer: {
                                                text: `${Pays.devise}`
                                            }
                                        };

                                        client.channels.cache.get(Pays.id_salon).send({ embeds: [embed] });
                                    }

                                    var sql = `
                                        UPDATE ressources SET eau=0 WHERE id_joueur="${Pays.id_joueur}";
                                        UPDATE population SET habitant=habitant-${mort * 4},
                                                              enfant=enfant-${mort},
                                                              jeune=jeune-${mort},
                                                              adulte=adulte-${mort},
                                                              vieux=vieux-${mort} WHERE id_joueur="${value.id_joueur}"`;
                                    connection.query(sql, async(err) => { if (err) { throw err; } })
                                }
                            }

                        })
                    }
                })
            },
            null,
            true,
            'Europe/Paris'
        );

        const autoMarket = new CronJob(
            '0 0,10,20,30,40,50 * * * *',

            function marketUpdate() {
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

                const sql = `
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

                    const bc_prix_moyen = (box.get('bc_prix_total') / box.get('bc_res_total')) + chance.floating({ min: 0, max: 0.2, fixed: 2 });

                    const bois_prix_moyen = (box.get('bois_prix_total') / box.get('bois_res_total')) + chance.floating({ min: 0, max: 0.2, fixed: 2 });

                    const brique_prix_moyen = (box.get('brique_prix_total') / box.get('brique_res_total')) + chance.floating({ min: 0, max: 0.2, fixed: 2 });

                    const eau_prix_moyen = (box.get('eau_prix_total') / box.get('eau_res_total')) + chance.floating({ min: 0, max: 0.2, fixed: 2 });

                    const metaux_prix_moyen = (box.get('metaux_prix_total') / box.get('metaux_res_total')) + chance.floating({ min: 0, max: 0.2, fixed: 2 });

                    const nourriture_prix_moyen = (box.get('nourriture_prix_total') / box.get('nourriture_res_total')) + chance.floating({ min: 0, max: 0.2, fixed: 2 });

                    const petrole_prix_moyen = (box.get('petrole_prix_total') / box.get('petrole_res_total')) + chance.floating({ min: 0, max: 0.2, fixed: 2 });

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

        const autoCompetition = new CronJob(
            '0 0 18 * * sat',
            //'0 * * * * *',
            function competitionUpdate() {

                let sql = `SELECT * FROM territoire ORDER BY T_total DESC`;
                connection.query(sql, async(err, results) => {if (err) {throw err;}
                    const list = results;
                    const fivePartIndex = Math.round(list.length / 5);

                    const fifthPart = list.splice(-fivePartIndex);
                    const fourthPart = list.splice(-fivePartIndex);
                    const thirdPart = list.splice(-fivePartIndex);
                    const secondPart = list.splice(-fivePartIndex);
                    let number = 0;

                    let array1 = [];
                    list.forEach(monClassement1);
                    function monClassement1(item) {
                        number += 1;
                        const element = {
                            name: `#${number}`,
                            value: `<@${item.id_joueur}>\n` +
                                codeBlock(`• ${item.T_total} km²`) + `\u200B`}
                        array1.push(element);
                        let sql = `UPDATE diplomatie SET influence=0 WHERE id_joueur="${item.id_joueur}"`;
                        connection.query(sql, async(err) => { if (err) { throw err; }})
                        sql = `UPDATE diplomatie SET influence=influence+10 WHERE id_joueur="${item.id_joueur}"`;
                        connection.query(sql, async(err) => { if (err) { throw err; }})
                    }
                    const embed1 = {
                        title: `\`Classement mondial : 1/5 Territoire\``,
                        fields: array1,
                        color: `#018242`,
                        timestamp: new Date(),
                    };

                    let array2 = [];
                    secondPart.forEach(monClassement2);
                    function monClassement2(item) {
                        number += 1;
                        const element = {
                            name: `#${number}`,
                            value: `<@${item.id_joueur}>\n` +
                                codeBlock(`• ${item.T_total} km²`) + `\u200B`}
                        array2.push(element);
                        let sql = `UPDATE diplomatie SET influence=0 WHERE id_joueur="${item.id_joueur}"`;
                        connection.query(sql, async(err) => { if (err) { throw err; }})
                        sql = `UPDATE diplomatie SET influence=influence+7 WHERE id_joueur="${item.id_joueur}"`;
                        connection.query(sql, async(err) => { if (err) { throw err; }})
                    }
                    const embed2 = {
                        title: `\`Classement mondial : 2/5 Territoire\``,
                        fields: array2,
                        color: `#86bc30`,
                        timestamp: new Date(),
                    };

                    let array3 = [];
                    thirdPart.forEach(monClassement3);
                    function monClassement3(item) {
                        number += 1;
                        const element = {
                            name: `#${number}`,
                            value: `<@${item.id_joueur}>\n` +
                                codeBlock(`• ${item.T_total} km²`) + `\u200B`}
                        array3.push(element);
                        let sql = `UPDATE diplomatie SET influence=0 WHERE id_joueur="${item.id_joueur}"`;
                        connection.query(sql, async(err) => { if (err) { throw err; }})
                        sql = `UPDATE diplomatie SET influence=influence+5 WHERE id_joueur="${item.id_joueur}"`;
                        connection.query(sql, async(err) => { if (err) { throw err; }})
                    }
                    const embed3 = {
                        title: `\`Classement mondial : 3/5 Territoire\``,
                        fields: array3,
                        color: `#fecb00`,
                        timestamp: new Date(),
                    };

                    let array4 = [];
                    fourthPart.forEach(monClassement4);
                    function monClassement4(item) {
                        number += 1;
                        const element = {
                            name: `#${number}`,
                            value: `<@${item.id_joueur}>\n` +
                                codeBlock(`• ${item.T_total} km²`) + `\u200B`}
                        array4.push(element);
                        let sql = `UPDATE diplomatie SET influence=0 WHERE id_joueur="${item.id_joueur}"`;
                        connection.query(sql, async(err) => { if (err) { throw err; }})
                        sql = `UPDATE diplomatie SET influence=influence+3 WHERE id_joueur="${item.id_joueur}"`;
                        connection.query(sql, async(err) => { if (err) { throw err; }})
                    }
                    const embed4 = {
                        title: `\`Classement mondial : 4/5 Territoire\``,
                        fields: array4,
                        color: `#f28101`,
                        timestamp: new Date(),
                    };

                    let array5 = [];
                    fifthPart.forEach(monClassement5);
                    function monClassement5(item) {
                        number += 1;
                        const element = {
                            name: `#${number}`,
                            value: `<@${item.id_joueur}>\n` +
                                codeBlock(`• ${item.T_total} km²`) + `\u200B`}
                        array5.push(element);
                        let sql = `UPDATE diplomatie SET influence=0 WHERE id_joueur="${item.id_joueur}"`;
                        connection.query(sql, async(err) => { if (err) { throw err; }})
                        sql = `UPDATE diplomatie SET influence=influence+2 WHERE id_joueur="${item.id_joueur}"`;
                        connection.query(sql, async(err) => { if (err) { throw err; }})
                    }
                    const embed5 = {
                        title: `\`Classement mondial : 5/5 Territoire\``,
                        fields: array5,
                        color: `#e73f12`,
                        timestamp: new Date(),
                    };

                    const salon_compet = client.channels.cache.get(process.env.SALON_COMPET_TERRITOIRE);
                    salon_compet.send({ embeds: [embed1, embed2, embed3, embed4, embed5] });
                    salon_compet.send('‎');
                })

                sql = `SELECT * FROM population ORDER BY bonheur DESC`;
                connection.query(sql, async(err, results) => {if (err) {throw err;}
                    const list = results;
                    const fivePartIndex = Math.round(list.length / 5);

                    const fifthPart = list.splice(-fivePartIndex);
                    const fourthPart = list.splice(-fivePartIndex);
                    const thirdPart = list.splice(-fivePartIndex);
                    const secondPart = list.splice(-fivePartIndex);
                    let number = 0;

                    let array1 = [];
                    list.forEach(monClassement1);
                    function monClassement1(item) {
                        number += 1;
                        const element = {
                            name: `#${number}`,
                            value: `<@${item.id_joueur}>\n` +
                                codeBlock(`• ${item.bonheur}%`) + `\u200B`}
                        array1.push(element);
                        let sql = `UPDATE diplomatie SET influence=influence+10 WHERE id_joueur="${item.id_joueur}"`;
                        connection.query(sql, async(err) => { if (err) { throw err; }})
                    }
                    const embed1 = {
                        title: `\`Classement mondial : 1/5 Bonheur\``,
                        fields: array1,
                        color: `#018242`,
                        timestamp: new Date(),
                    };

                    let array2 = [];
                    secondPart.forEach(monClassement2);
                    function monClassement2(item) {
                        number += 1;
                        const element = {
                            name: `#${number}`,
                            value: `<@${item.id_joueur}>\n` +
                                codeBlock(`• ${item.bonheur}%`) + `\u200B`}
                        array2.push(element);
                        let sql = `UPDATE diplomatie SET influence=influence+7 WHERE id_joueur="${item.id_joueur}"`;
                        connection.query(sql, async(err) => { if (err) { throw err; }})
                    }
                    const embed2 = {
                        title: `\`Classement mondial : 2/5 Bonheur\``,
                        fields: array2,
                        color: `#86bc30`,
                        timestamp: new Date(),
                    };

                    let array3 = [];
                    thirdPart.forEach(monClassement3);
                    function monClassement3(item) {
                        number += 1;
                        const element = {
                            name: `#${number}`,
                            value: `<@${item.id_joueur}>\n` +
                                codeBlock(`• ${item.bonheur}%`) + `\u200B`}
                        array3.push(element);
                        let sql = `UPDATE diplomatie SET influence=influence+5 WHERE id_joueur="${item.id_joueur}"`;
                        connection.query(sql, async(err) => { if (err) { throw err; }})
                    }
                    const embed3 = {
                        title: `\`Classement mondial : 3/5 Bonheur\``,
                        fields: array3,
                        color: `#fecb00`,
                        timestamp: new Date(),
                    };

                    let array4 = [];
                    fourthPart.forEach(monClassement4);
                    function monClassement4(item) {
                        number += 1;
                        const element = {
                            name: `#${number}`,
                            value: `<@${item.id_joueur}>\n` +
                                codeBlock(`• ${item.bonheur}%`) + `\u200B`}
                        array4.push(element);
                        let sql = `UPDATE diplomatie SET influence=influence+3 WHERE id_joueur="${item.id_joueur}"`;
                        connection.query(sql, async(err) => { if (err) { throw err; }})
                    }
                    const embed4 = {
                        title: `\`Classement mondial : 4/5 Bonheur\``,
                        fields: array4,
                        color: `#f28101`,
                        timestamp: new Date(),
                    };

                    let array5 = [];
                    fifthPart.forEach(monClassement5);
                    function monClassement5(item) {
                        number += 1;
                        const element = {
                            name: `#${number}`,
                            value: `<@${item.id_joueur}>\n` +
                                codeBlock(`• ${item.bonheur}%`) + `\u200B`}
                        array5.push(element);
                        let sql = `UPDATE diplomatie SET influence=influence+2 WHERE id_joueur="${item.id_joueur}"`;
                        connection.query(sql, async(err) => { if (err) { throw err; }})
                    }
                    const embed5 = {
                        title: `\`Classement mondial : 5/5 Bonheur\``,
                        fields: array5,
                        color: `#e73f12`,
                        timestamp: new Date(),
                    };

                    const salon_compet = client.channels.cache.get(process.env.SALON_COMPET_BONHEUR);
                    salon_compet.send({ embeds: [embed1, embed2, embed3, embed4, embed5] });
                    salon_compet.send('‎');
                })

                sql = `SELECT * FROM population`;
                connection.query(sql, async(err, results) => {if (err) {throw err;}
                    const list = results;
                    const list2 = new Set(list)
                    list.sort(function(a, b){return (b.habitant - b.ancien_pop) - (a.habitant - a.ancien_pop)})
                    const fivePartIndex = Math.round(list.length / 5);

                    const fifthPart = list.splice(-fivePartIndex);
                    const fourthPart = list.splice(-fivePartIndex);
                    const thirdPart = list.splice(-fivePartIndex);
                    const secondPart = list.splice(-fivePartIndex);
                    let number = 0;

                    let array1 = [];
                    list.forEach(monClassement1);
                    function monClassement1(item) {
                        number += 1;
                        const element = {
                            name: `#${number}`,
                            value: `<@${item.id_joueur}>\n` +
                                codeBlock(`• ${(item.habitant - item.ancien_pop)} habitants`) + `\u200B`}
                        array1.push(element);
                        let sql = `UPDATE diplomatie SET influence=influence+15 WHERE id_joueur="${item.id_joueur}"`;
                        connection.query(sql, async(err) => { if (err) { throw err; }})
                    }
                    const embed1 = {
                        title: `\`Classement mondial : 1/5 Croissance démographique\``,
                        fields: array1,
                        color: `#018242`,
                        timestamp: new Date(),
                    };

                    let array2 = [];
                    secondPart.forEach(monClassement2);
                    function monClassement2(item) {
                        number += 1;
                        const element = {
                            name: `#${number}`,
                            value: `<@${item.id_joueur}>\n` +
                                codeBlock(`• ${(item.habitant - item.ancien_pop)} habitants`) + `\u200B`}
                        array2.push(element);
                        let sql = `UPDATE diplomatie SET influence=influence+11 WHERE id_joueur="${item.id_joueur}"`;
                        connection.query(sql, async(err) => { if (err) { throw err; }})
                    }
                    const embed2 = {
                        title: `\`Classement mondial : 2/5 Croissance démographique\``,
                        fields: array2,
                        color: `#86bc30`,
                        timestamp: new Date(),
                    };

                    let array3 = [];
                    thirdPart.forEach(monClassement3);
                    function monClassement3(item) {
                        number += 1;
                        const element = {
                            name: `#${number}`,
                            value: `<@${item.id_joueur}>\n` +
                                codeBlock(`• ${(item.habitant - item.ancien_pop)} habitants`) + `\u200B`}
                        array3.push(element);
                        let sql = `UPDATE diplomatie SET influence=influence+8 WHERE id_joueur="${item.id_joueur}"`;
                        connection.query(sql, async(err) => { if (err) { throw err; }})
                    }
                    const embed3 = {
                        title: `\`Classement mondial : 3/5 Croissance démographique\``,
                        fields: array3,
                        color: `#fecb00`,
                        timestamp: new Date(),
                    };

                    let array4 = [];
                    fourthPart.forEach(monClassement4);
                    function monClassement4(item) {
                        number += 1;
                        const element = {
                            name: `#${number}`,
                            value: `<@${item.id_joueur}>\n` +
                                codeBlock(`• ${(item.habitant - item.ancien_pop)} habitants`) + `\u200B`}
                        array4.push(element);
                        let sql = `UPDATE diplomatie SET influence=influence+5 WHERE id_joueur="${item.id_joueur}"`;
                        connection.query(sql, async(err) => { if (err) { throw err; }})
                    }
                    const embed4 = {
                        title: `\`Classement mondial : 4/5 Croissance démographique\``,
                        fields: array4,
                        color: `#f28101`,
                        timestamp: new Date(),
                    };

                    let array5 = [];
                    fifthPart.forEach(monClassement5);
                    function monClassement5(item) {
                        number += 1;
                        const element = {
                            name: `#${number}`,
                            value: `<@${item.id_joueur}>\n` +
                                codeBlock(`• ${(item.habitant - item.ancien_pop)} habitants`) + `\u200B`}
                        array5.push(element);
                        let sql = `UPDATE diplomatie SET influence=influence+3 WHERE id_joueur="${item.id_joueur}"`;
                        connection.query(sql, async(err) => { if (err) { throw err; }})
                    }
                    const embed5 = {
                        title: `\`Classement mondial : 5/5 Croissance démographique\``,
                        fields: array5,
                        color: `#e73f12`,
                        timestamp: new Date(),
                    };

                    list2.forEach(ancienPop)
                    function ancienPop(value, index, array) {
                        let sql = `UPDATE population SET ancien_pop="${value.habitant}" WHERE id_joueur="${value.id_joueur}"`;
                        connection.query(sql, async(err) => { if (err) { throw err; }})
                    }
                    const salon_compet = client.channels.cache.get(process.env.SALON_COMPET_POPULATION);
                    salon_compet.send({ embeds: [embed1, embed2, embed3, embed4, embed5] });
                    salon_compet.send('‎');

                    list2.forEach(nouvelleCg);
                    function nouvelleCg(item) {
                        const sql = `
                            SELECT * FROM diplomatie WHERE id_joueur='${item.id_joueur}';
                            SELECT * FROM pays WHERE id_joueur='${item.id_joueur}'
                        `;
                        connection.query(sql, async (err, results) => {if (err) {throw err;}
                            const Diplomatie = results[0][0];
                            const Pays = results[1][0]

                            function cg(influence, gouv, jour){
                                return (72.4+(310.4-72.4)/180*jour)*gouv*Math.exp(influence*0.01)
                            }

                            let sql = `UPDATE territoire SET cg=${cg(Diplomatie.influence, eval(`gouvernementObject.${Pays.ideologie}.gouvernance`), (Pays.jour))} WHERE id_joueur="${item.id_joueur}"`;
                            connection.query(sql, async (err) => {if (err) {throw err;}})
                        })
                    }
                })
            },
            null,
            true,
            'Europe/Paris'
        );

        const autoJour = new CronJob(
            '0 0 0 * * *',
            function jourUpdate() {

                let sql = `SELECT * FROM pays`;
                connection.query(sql, async(err, results) => {if (err) {throw err;}
                    results.forEach(jourPlus1);
                    function jourPlus1(item) {
                        let sql = `UPDATE pays SET jour=jour+1 WHERE id_joueur = "${item.id_joueur}"`;
                        connection.query(sql, async (err) => {if (err) {throw err;}})
                    }

                    results.forEach(nouvelleCg);
                    function nouvelleCg(item) {
                        const sql = `
                            SELECT * FROM diplomatie WHERE id_joueur='${item.id_joueur}';
                            SELECT * FROM pays WHERE id_joueur='${item.id_joueur}'
                        `;
                        connection.query(sql, async (err, results) => {if (err) {throw err;}
                            const Diplomatie = results[0][0];
                            const Pays = results[1][0]

                            function cg(influence, gouv, jour){
                                return (72.4+(310.4-72.4)/180*jour)*gouv*Math.exp(influence*0.01)
                            }

                            let sql = `UPDATE territoire SET cg=${cg(Diplomatie.influence, eval(`gouvernementObject.${Pays.ideologie}.gouvernance`), (Pays.jour))} WHERE id_joueur="${item.id_joueur}"`;
                            connection.query(sql, async (err) => {if (err) {throw err;}})
                        })
                    }
                })
            },
            null,
            true,
            'Europe/Paris'
        );
    }
}