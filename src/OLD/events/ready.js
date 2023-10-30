const { ActivityType, Events, codeBlock, ActionRowBuilder, ButtonBuilder, ButtonStyle} = require('discord.js');
const { readFileSync, writeFileSync } = require('fs');
const { connection } = require('../index');
const { globalBox } = require('global-box');
const box = globalBox();
const Chance = require('chance');
const chance = new Chance();
const ms = require('ms');
const CronJob = require('cron').CronJob;

const armeeObject = JSON.parse(readFileSync('src/OLD/data/armee.json', 'utf-8'));
const batimentObject = JSON.parse(readFileSync('src/OLD/data/batiment.json', 'utf-8'));
const biomeObject = JSON.parse(readFileSync('src/OLD/data/biome.json', 'utf-8'));
const gouvernementObject = JSON.parse(readFileSync('src/OLD/data/gouvernement.json', 'utf-8'));
const populationObject = JSON.parse(readFileSync('src/OLD/data/population.json', 'utf-8'));
const regionObject = JSON.parse(readFileSync('src/OLD/data/region.json', 'utf-8'));

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(client) {

        if (client.user.id === 834855105177845794) {
            client.channels.cache.get(process.env.SALON_ACTUALITE).send('<@834855105177845794> a été <@&1061392938829094913>')
        }

        //region Statut
        const arrayStatut = [
            {
                type: ActivityType.Playing,
                content: '🌍 𝐏𝐀𝐙 𝐍𝐀𝐓𝐈𝐎𝐍 👑',
                status: 'online'
            },
            {
                type: ActivityType.Watching,
                content: '🖥️ Subcher - Dev',
                status: 'online'
            },
            {
                type: ActivityType.Watching,
                content: '👑 Fexiop - Owner',
                status: 'online'
            },
            {
                type: ActivityType.Watching,
                content: '🧮 Arkylon - Stats',
                status: 'dnd'
            },
            {
                type: ActivityType.Watching,
                content: '🛎️ Lumber - Guide',
                status: 'online'
            },
            {
                type: ActivityType.Listening,
                content: `Ping: ${client.ws.ping}ms`,
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
        //endregion

        //region Production
        const autoUpdate = new CronJob(
            '0 0,10,20,30,40,50 * * * *',
            function autoUpdate() {

                const sql = `SELECT * FROM pays WHERE vacances=0`;
                connection.query(sql, async (err, results) => {
                    const arrayPays = Object.values(results);
                    arrayPays.forEach(chaquePays);

                    function chaquePays(value) {
                        const sql = `
                            SELECT * FROM armee WHERE id_joueur='${value.id_joueur}';
                            SELECT * FROM batiments WHERE id_joueur='${value.id_joueur}';
                            SELECT * FROM pays WHERE id_joueur='${value.id_joueur}';
                            SELECT * FROM population WHERE id_joueur='${value.id_joueur}';
                            SELECT * FROM ressources WHERE id_joueur='${value.id_joueur}';
                            SELECT * FROM territoire WHERE id_joueur='${value.id_joueur}';
                        `;
                        connection.query(sql, async(err, results) => {if (err) {throw err;}
                            const Armee = results[0][0];
                            const Batiment = results[1][0];
                            const Pays = results[2][0];
                            const Population = results[3][0];
                            const Ressources = results[4][0];
                            const Territoire = results[5][0];

                            //region Calcul des coefficients de production des ressources
                            const coef_bois = eval(`regionObject.${Territoire.region}.bois`)
                            const coef_charbon = eval(`regionObject.${Territoire.region}.charbon`)
                            const coef_eau = eval(`regionObject.${Territoire.region}.eau`)
                            const coef_eolienne = eval(`regionObject.${Territoire.region}.eolienne`)
                            const coef_metaux = eval(`regionObject.${Territoire.region}.metaux`)
                            const coef_nourriture = eval(`regionObject.${Territoire.region}.nourriture`)
                            const coef_petrole = eval(`regionObject.${Territoire.region}.petrole`)
                            const coef_sable = eval(`regionObject.${Territoire.region}.sable`)
                            //endregion

                            //region Calcul des emplois énergétiques
                            const emploies_centrale_biomasse = batimentObject.centrale_biomasse.EMPLOYES_CENTRALE_BIOMASSE * Batiment.centrale_biomasse;
                            const emploies_centrale_charbon = batimentObject.centrale_charbon.EMPLOYES_CENTRALE_CHARBON * Batiment.centrale_charbon;
                            const emploies_centrale_fioul = batimentObject.centrale_fioul.EMPLOYES_CENTRALE_FIOUL * Batiment.centrale_fioul;
                            const emploies_eolienne = batimentObject.eolienne.EMPLOYES_EOLIENNE * Batiment.eolienne;
                            const emploies_electricite = emploies_centrale_biomasse + emploies_centrale_charbon + emploies_centrale_fioul + emploies_eolienne;
                            const hommeArmee =
                                Armee.unite * eval(`armeeObject.${Armee.strategie}.aviation`) * eval(`armeeObject.aviation.homme`) +
                                Armee.unite * eval(`armeeObject.${Armee.strategie}.infanterie`) * eval(`armeeObject.infanterie.homme`) +
                                Armee.unite * eval(`armeeObject.${Armee.strategie}.mecanise`) * eval(`armeeObject.mecanise.homme`) +
                                Armee.unite * eval(`armeeObject.${Armee.strategie}.support`) * eval(`armeeObject.support.homme`) +
                                (Armee.aviation * armeeObject.aviation.homme) +
                                (Armee.infanterie * armeeObject.infanterie.homme) +
                                (Armee.mecanise * armeeObject.mecanise.homme) +
                                (Armee.support * armeeObject.support.homme);
                            //endregion
                            if ((Population.jeune + Population.adulte - hommeArmee - emploies_electricite) < 0.5) {
                                //region Pas assez d'employés
                                //endregion
                            } else {
                                //Assez d'employés
                                //region Production d'électricité
                                //region Production d'électricté des centrales biomasse
                                const conso_T_centrale_biomasse_bois = batimentObject.centrale_biomasse.CONSO_CENTRALE_BIOMASSE_BOIS * Batiment.centrale_biomasse
                                let prod_centrale_biomasse = true;
                                if (conso_T_centrale_biomasse_bois > Ressources.bois && conso_T_centrale_biomasse_bois !== 0) {
                                    prod_centrale_biomasse = false;
                                    let sql = `UPDATE ressources SET bois=0 WHERE id_joueur="${Pays.id_joueur}"`;
                                    connection.query(sql, async (err) => {if (err) {throw err;}})
                                } else {
                                    let sql = `UPDATE ressources SET bois=bois-${conso_T_centrale_biomasse_bois} WHERE id_joueur="${Pays.id_joueur}"`;
                                    connection.query(sql, async (err) => {if (err) {throw err;}})
                                }
                                const conso_T_centrale_biomasse_eau = batimentObject.centrale_biomasse.CONSO_CENTRALE_BIOMASSE_EAU * Batiment.centrale_biomasse
                                if (conso_T_centrale_biomasse_eau > Ressources.eau && conso_T_centrale_biomasse_eau !== 0) {
                                    prod_centrale_biomasse = false;
                                    let sql = `UPDATE ressources SET eau=0 WHERE id_joueur="${Pays.id_joueur}"`;
                                    connection.query(sql, async (err) => {if (err) {throw err;}})
                                } else {
                                    let sql = `UPDATE ressources SET eau=eau-${conso_T_centrale_biomasse_eau} WHERE id_joueur="${Pays.id_joueur}"`;
                                    connection.query(sql, async (err) => {if (err) {throw err;}})
                                }
                                //endregion
                                //region Production d'électricté des centrales au charbon
                                const conso_T_centrale_charbon_charbon = batimentObject.centrale_charbon.CONSO_CENTRALE_CHARBON_CHARBON * Batiment.centrale_charbon
                                let prod_centrale_charbon = true;
                                if (conso_T_centrale_charbon_charbon > Ressources.charbon && conso_T_centrale_charbon_charbon !== 0) {
                                    prod_centrale_charbon = false;
                                    let sql = `UPDATE ressources SET charbon=0 WHERE id_joueur="${Pays.id_joueur}"`;
                                    connection.query(sql, async (err) => {if (err) {throw err;}})
                                } else {
                                    let sql = `UPDATE ressources SET charbon=charbon-${conso_T_centrale_charbon_charbon} WHERE id_joueur="${Pays.id_joueur}"`;
                                    connection.query(sql, async (err) => {if (err) {throw err;}})
                                }
                                const conso_T_centrale_charbon_eau = batimentObject.centrale_charbon.CONSO_CENTRALE_CHARBON_EAU * Batiment.centrale_charbon
                                if (conso_T_centrale_charbon_eau > Ressources.eau && conso_T_centrale_charbon_eau !== 0) {
                                    prod_centrale_charbon = false;
                                    let sql = `UPDATE ressources SET eau=0 WHERE id_joueur="${Pays.id_joueur}"`;
                                    connection.query(sql, async (err) => {if (err) {throw err;}})
                                } else {
                                    let sql = `UPDATE ressources SET eau=eau-${conso_T_centrale_charbon_eau} WHERE id_joueur="${Pays.id_joueur}"`;
                                    connection.query(sql, async (err) => {if (err) {throw err;}})
                                }
                                //endregion
                                //region Production d'électricité des centrales au fioul
                                const conso_T_centrale_fioul_carburant = batimentObject.centrale_fioul.CONSO_CENTRALE_FIOUL_CARBURANT * Batiment.centrale_fioul
                                let prod_centrale_fioul = true;
                                if (conso_T_centrale_fioul_carburant > Ressources.carburant && conso_T_centrale_fioul_carburant !== 0) {
                                    prod_centrale_fioul = false;
                                    let sql = `UPDATE ressources SET carburant=0 WHERE id_joueur="${Pays.id_joueur}"`;
                                    connection.query(sql, async (err) => {if (err) {throw err;}})
                                } else {
                                    let sql = `UPDATE ressources SET carburant=carburant-${conso_T_centrale_fioul_carburant} WHERE id_joueur="${Pays.id_joueur}"`;
                                    connection.query(sql, async (err) => {if (err) {throw err;}})
                                }
                                const conso_T_centrale_fioul_eau = batimentObject.centrale_fioul.CONSO_CENTRALE_FIOUL_EAU * Batiment.centrale_fioul
                                if (conso_T_centrale_fioul_eau > Ressources.eau && conso_T_centrale_fioul_eau !== 0) {
                                    prod_centrale_fioul = false;
                                    let sql = `UPDATE ressources SET eau=0 WHERE id_joueur="${Pays.id_joueur}"`;
                                    connection.query(sql, async (err) => {if (err) {throw err;}})
                                } else {
                                    let sql = `UPDATE ressources SET eau=eau-${conso_T_centrale_fioul_eau} WHERE id_joueur="${Pays.id_joueur}"`;
                                    connection.query(sql, async (err) => {if (err) {throw err;}})
                                }
                                //endregion
                                //region Production d'électricité des éoliennes
                                let prod_eolienne = Math.round(batimentObject.eolienne.PROD_EOLIENNE * Batiment.eolienne * coef_eolienne);

                                let prod_elec = prod_eolienne;
                                if (prod_centrale_biomasse === true) {
                                    prod_elec += batimentObject.centrale_biomasse.PROD_CENTRALE_BIOMASSE * Batiment.centrale_biomasse
                                }
                                if (prod_centrale_charbon === true) {
                                    prod_elec += batimentObject.centrale_charbon.PROD_CENTRALE_CHARBON * Batiment.centrale_charbon
                                }
                                if (prod_centrale_fioul === true) {
                                    prod_elec += batimentObject.centrale_fioul.PROD_CENTRALE_FIOUL * Batiment.centrale_fioul
                                }
                                //endregion
                                //region Consommation totale d'électricté
                                const conso_elec = Math.round(
                                    batimentObject.acierie.CONSO_ACIERIE_ELEC * Batiment.acierie +
                                    batimentObject.atelier_verre.CONSO_ATELIER_VERRE_ELEC * Batiment.atelier_verre +
                                    batimentObject.carriere_sable.CONSO_CARRIERE_SABLE_ELEC * Batiment.carriere_sable +
                                    batimentObject.champ.CONSO_CHAMP_ELEC * Batiment.champ +
                                    batimentObject.cimenterie.CONSO_CIMENTERIE_ELEC * Batiment.cimenterie +
                                    batimentObject.derrick.CONSO_DERRICK_ELEC * Batiment.derrick +
                                    batimentObject.mine_charbon.CONSO_MINE_CHARBON_ELEC * Batiment.mine_charbon +
                                    batimentObject.mine_metaux.CONSO_MINE_METAUX_ELEC * Batiment.mine_metaux +
                                    batimentObject.station_pompage.CONSO_STATION_POMPAGE_ELEC * Batiment.station_pompage +
                                    batimentObject.quartier.CONSO_QUARTIER_ELEC * Batiment.quartier +
                                    batimentObject.raffinerie.CONSO_RAFFINERIE_ELEC * Batiment.raffinerie +
                                    batimentObject.scierie.CONSO_SCIERIE_ELEC * Batiment.scierie +
                                    batimentObject.usine_civile.CONSO_USINE_CIVILE_ELEC * Batiment.usine_civile
                                );
                                //endregion
                                //endregion

                                //region Production
                                if (prod_elec >= conso_elec) {
                                    if (Population.elec_acces < 1008) {
                                        let sql = `UPDATE population SET elec_acces=elec_acces+1 WHERE id_joueur="${Pays.id_joueur}"`;
                                        connection.query(sql, async (err) => {if (err) {throw err;}})
                                        //console.log('elec access')
                                    }

                                let sql = `
                                    SELECT * FROM batiments WHERE id_joueur='${Pays.id_joueur}';
                                    SELECT * FROM pays WHERE id_joueur='${Pays.id_joueur}';
                                    SELECT * FROM ressources WHERE id_joueur='${Pays.id_joueur}'
                                `;
                                    connection.query(sql, async (err, results) => {
                                        const Batiment = results[0][0];
                                        const Pays = results[1][0];
                                        const Ressources = results[2][0];
                                        let manque_bois = false;
                                        let manque_carburant = false;
                                        let manque_charbon = false;
                                        let manque_eau = false;
                                        let manque_metaux = false;
                                        let manque_petrole = false;
                                        let manque_sable = false;
                                        let manque_verre = false;

                                        //region Calcul du taux d'emploie
                                        const emploies_acierie = batimentObject.acierie.EMPLOYES_ACIERIE * Batiment.acierie;
                                        const emploies_atelier_verre = batimentObject.atelier_verre.EMPLOYES_ATELIER_VERRE * Batiment.atelier_verre;
                                        const emploies_carriere_sable = batimentObject.carriere_sable.EMPLOYES_CARRIERE_SABLE * Batiment.carriere_sable;
                                        const emploies_centrale_biomasse = batimentObject.centrale_biomasse.EMPLOYES_CENTRALE_BIOMASSE * Batiment.centrale_biomasse;
                                        const emploies_centrale_charbon = batimentObject.centrale_charbon.EMPLOYES_CENTRALE_CHARBON * Batiment.centrale_charbon;
                                        const emploies_centrale_fioul = batimentObject.centrale_fioul.EMPLOYES_CENTRALE_FIOUL * Batiment.centrale_fioul;
                                        const emploies_champ = batimentObject.champ.EMPLOYES_CHAMP * Batiment.champ;
                                        const emploies_cimenterie = batimentObject.cimenterie.EMPLOYES_CIMENTERIE * Batiment.cimenterie;
                                        const emploies_derrick = batimentObject.derrick.EMPLOYES_DERRICK * Batiment.derrick;
                                        const emploies_eolienne = batimentObject.eolienne.EMPLOYES_EOLIENNE * Batiment.eolienne;
                                        const emploies_mine_charbon = batimentObject.mine_charbon.EMPLOYES_MINE_CHARBON * Batiment.mine_charbon;
                                        const emploies_mine_metaux = batimentObject.mine_metaux.EMPLOYES_MINE_METAUX * Batiment.mine_metaux;
                                        const emploies_station_pompage = batimentObject.station_pompage.EMPLOYES_STATION_POMPAGE * Batiment.station_pompage;
                                        const emploies_raffinerie = batimentObject.raffinerie.EMPLOYES_RAFFINERIE * Batiment.raffinerie;
                                        const emploies_scierie = batimentObject.scierie.EMPLOYES_SCIERIE * Batiment.scierie;
                                        const emploies_usine_civile = batimentObject.usine_civile.EMPLOYES_USINE_CIVILE * Batiment.usine_civile;
                                        const emploies_total =
                                            emploies_acierie + emploies_atelier_verre + emploies_carriere_sable +
                                            emploies_centrale_biomasse + emploies_centrale_charbon + emploies_centrale_fioul +
                                            emploies_champ + emploies_cimenterie + emploies_derrick + emploies_eolienne +
                                            emploies_mine_charbon + emploies_mine_metaux + emploies_station_pompage +
                                            emploies_raffinerie + emploies_scierie + emploies_usine_civile;
                                        const hommeArmee =
                                            Armee.unite * eval(`armeeObject.${Armee.strategie}.aviation`) * eval(`armeeObject.aviation.homme`) +
                                            Armee.unite * eval(`armeeObject.${Armee.strategie}.infanterie`) * eval(`armeeObject.infanterie.homme`) +
                                            Armee.unite * eval(`armeeObject.${Armee.strategie}.mecanise`) * eval(`armeeObject.mecanise.homme`) +
                                            Armee.unite * eval(`armeeObject.${Armee.strategie}.support`) * eval(`armeeObject.support.homme`) +
                                            (Armee.aviation * armeeObject.aviation.homme) +
                                            (Armee.infanterie * armeeObject.infanterie.homme) +
                                            (Armee.mecanise * armeeObject.mecanise.homme) +
                                            (Armee.support * armeeObject.support.homme);

                                        let emplois = (Population.jeune + Population.adulte - hommeArmee)/emploies_total
                                        if ((Population.jeune + Population.adulte - hommeArmee)/emploies_total > 1) {
                                            emplois = 1
                                        }
                                        //endregion

                                        if (emplois >= 0.5) {
                                            //region Calcul des consommations
                                            //region Calcul de la consommation de bois par rapport à la réserve
                                            const conso_T_usine_civile_bois = Math.round(batimentObject.usine_civile.CONSO_USINE_CIVILE_BOIS * Batiment.usine_civile * eval(`gouvernementObject.${Pays.ideologie}.consommation`) * emplois);
                                            const conso_bois = conso_T_usine_civile_bois;
                                            if (conso_bois > Ressources.bois && conso_bois !== 0) {
                                                manque_bois = true;
                                            }
                                            //endregion
                                            //region Calcul de la consommation de carburant par rapport à la réserve
                                            const conso_T_carriere_sable_carburant = Math.round(batimentObject.carriere_sable.CONSO_CARRIERE_SABLE_CARBURANT * Batiment.carriere_sable * eval(`gouvernementObject.${Pays.ideologie}.consommation`) * emplois);
                                            const conso_T_champ_carburant = Math.round(batimentObject.champ.CONSO_CHAMP_CARBURANT * Batiment.champ * eval(`gouvernementObject.${Pays.ideologie}.consommation`) * emplois);
                                            const conso_T_mine_charbon_carburant = Math.round(batimentObject.mine_charbon.CONSO_MINE_CHARBON_CARBURANT * Batiment.mine_charbon * eval(`gouvernementObject.${Pays.ideologie}.consommation`) * emplois);
                                            const conso_T_mine_metaux_carburant = Math.round(batimentObject.mine_metaux.CONSO_MINE_METAUX_CARBURANT * Batiment.mine_metaux * eval(`gouvernementObject.${Pays.ideologie}.consommation`) * emplois);
                                            const conso_T_station_pompage_carburant = Math.round(batimentObject.station_pompage.CONSO_STATION_POMPAGE_CARBURANT * Batiment.station_pompage * eval(`gouvernementObject.${Pays.ideologie}.consommation`) * emplois);
                                            const conso_T_scierie_carburant = Math.round(batimentObject.scierie.CONSO_SCIERIE_CARBURANT * Batiment.scierie * eval(`gouvernementObject.${Pays.ideologie}.consommation`) * emplois);
                                            const conso_carburant = conso_T_carriere_sable_carburant + conso_T_champ_carburant + conso_T_mine_charbon_carburant + conso_T_mine_metaux_carburant + conso_T_station_pompage_carburant + conso_T_scierie_carburant;
                                            if (conso_carburant > Ressources.carburant && conso_carburant !== 0) {
                                                manque_carburant = true;
                                            }
                                            //endregion
                                            //region Calcul de la consommation de charbon par rapport à la réserve
                                            const conso_T_acierie_charbon = Math.round(batimentObject.acierie.CONSO_ACIERIE_CHARBON * Batiment.acierie * eval(`gouvernementObject.${Pays.ideologie}.consommation`) * emplois);
                                            const conso_charbon = conso_T_acierie_charbon;
                                            if (conso_charbon > Ressources.charbon && conso_charbon !== 0) {
                                                manque_charbon = true;
                                            }
                                            //endregion
                                            //region Calcul de la consommation d'eau par rapport à la réserve
                                            const conso_T_atelier_verre_eau = Math.round(batimentObject.atelier_verre.CONSO_ATELIER_VERRE_EAU * Batiment.atelier_verre * eval(`gouvernementObject.${Pays.ideologie}.consommation`) * emplois);
                                            const conso_T_champ_eau = Math.round(batimentObject.champ.CONSO_CHAMP_EAU * Batiment.champ * eval(`gouvernementObject.${Pays.ideologie}.consommation`) * emplois);
                                            const conso_T_cimenterie_eau = Math.round(batimentObject.cimenterie.CONSO_CIMENTERIE_EAU * Batiment.cimenterie * eval(`gouvernementObject.${Pays.ideologie}.consommation`) * emplois);
                                            const conso_eau = conso_T_atelier_verre_eau + conso_T_champ_eau + conso_T_cimenterie_eau;
                                            if (conso_eau > Ressources.eau && conso_eau !== 0) {
                                                manque_eau = true;
                                            }
                                            //endregion
                                            //region Calcul de la consommation de métaux par rapport à la réserve
                                            const conso_T_acierie_metaux = Math.round(batimentObject.acierie.CONSO_ACIERIE_METAUX * Batiment.acierie * eval(`gouvernementObject.${Pays.ideologie}.consommation`) * emplois);
                                            const conso_T_derrick_metaux = Math.round(batimentObject.derrick.CONSO_DERRICK_METAUX * Batiment.derrick * eval(`gouvernementObject.${Pays.ideologie}.consommation`) * emplois);
                                            const conso_T_usine_civile_metaux = Math.round(batimentObject.usine_civile.CONSO_USINE_CIVILE_METAUX * Batiment.usine_civile * eval(`gouvernementObject.${Pays.ideologie}.consommation`) * emplois);
                                            const conso_metaux = conso_T_acierie_metaux + conso_T_derrick_metaux + conso_T_usine_civile_metaux;
                                            if (conso_metaux > Ressources.metaux && conso_metaux !== 0) {
                                                manque_metaux = true;
                                            }
                                            //endregion
                                            //region Calcul de la consommation de pétrole par rapport à la réserve
                                            const conso_T_cimenterie_petrole = Math.round(batimentObject.cimenterie.CONSO_CIMENTERIE_PETROLE * Batiment.cimenterie * eval(`gouvernementObject.${Pays.ideologie}.consommation`) * emplois);
                                            const conso_T_raffinerie_petrole = Math.round(batimentObject.raffinerie.CONSO_RAFFINERIE_PETROLE * Batiment.raffinerie * eval(`gouvernementObject.${Pays.ideologie}.consommation`) * emplois);
                                            const conso_T_usine_civile_petrole = Math.round(batimentObject.usine_civile.CONSO_USINE_CIVILE_PETROLE * Batiment.usine_civile * eval(`gouvernementObject.${Pays.ideologie}.consommation`) * emplois);
                                            const conso_petrole = conso_T_cimenterie_petrole + conso_T_raffinerie_petrole + conso_T_usine_civile_petrole;
                                            if (conso_petrole > Ressources.petrole && conso_petrole !== 0) {
                                                manque_petrole = true;
                                            }
                                            //endregion
                                            //region Calcul de la consommation de sable par rapport à la réserve
                                            const conso_T_atelier_verre_sable = Math.round(batimentObject.atelier_verre.CONSO_ATELIER_VERRE_SABLE * Batiment.atelier_verre * eval(`gouvernementObject.${Pays.ideologie}.consommation`) * emplois);
                                            const conso_T_cimenterie_sable = Math.round(batimentObject.cimenterie.CONSO_CIMENTERIE_SABLE * Batiment.cimenterie * eval(`gouvernementObject.${Pays.ideologie}.consommation`) * emplois);
                                            const conso_sable = conso_T_atelier_verre_sable + conso_T_cimenterie_sable;
                                            if (conso_sable > Ressources.sable && conso_sable !== 0) {
                                                manque_sable = true;
                                            }
                                            //endregion
                                            //region Calcul de la consommation de verre par rapport à la réserve
                                            const conso_T_usine_civile_verre = Math.round(batimentObject.usine_civile.CONSO_USINE_CIVILE_VERRE * Batiment.usine_civile * eval(`gouvernementObject.${Pays.ideologie}.consommation`) * emplois);
                                            const conso_verre = conso_T_usine_civile_verre;
                                            if (conso_verre > Ressources.verre && conso_verre !== 0) {
                                                manque_verre = true;
                                            }
                                            //endregion
                                            //endregion

                                            //region Production des usines
                                            //region Production des acieries
                                            let list_batiment = [];
                                            if (manque_charbon === false && manque_metaux === false) {
                                                const prod_T_acierie = Math.round(batimentObject.acierie.PROD_ACIERIE * Batiment.acierie * eval(`gouvernementObject.${Pays.ideologie}.production`) * emplois);
                                                sql = `
                                                    UPDATE ressources
                                                    SET charbon=charbon - ${conso_T_acierie_charbon},
                                                        metaux=metaux - ${conso_T_acierie_metaux},
                                                        acier=acier + ${prod_T_acierie}
                                                    WHERE id_joueur = "${Pays.id_joueur}"
                                                `;
                                                connection.query(sql, async (err) => {
                                                    if (err) {
                                                        throw err;
                                                    }
                                                })
                                            } else {
                                                list_batiment.push('Acierie')
                                                //console.log('pas prod Acierie')
                                            }
                                            //endregion
                                            //region Production des ateliers de verre
                                            if (manque_eau === false && manque_sable === false) {
                                                const prod_T_atelier_verre = Math.round(batimentObject.atelier_verre.PROD_ATELIER_VERRE * Batiment.atelier_verre * eval(`gouvernementObject.${Pays.ideologie}.production`) * emplois);
                                                sql = `
                                                    UPDATE ressources
                                                    SET eau=eau - ${conso_T_atelier_verre_eau},
                                                        sable=sable - ${conso_T_atelier_verre_sable},
                                                        verre=verre + ${prod_T_atelier_verre}
                                                    WHERE id_joueur = "${Pays.id_joueur}"
                                                `;
                                                connection.query(sql, async (err) => {
                                                    if (err) {
                                                        throw err;
                                                    }
                                                })
                                            } else {
                                                list_batiment.push('Atelier de verre')
                                                //console.log('pas prod Atelier de verre')
                                            }
                                            //endregion
                                            //region Production des carrières de sable
                                            if (manque_carburant === false) {
                                                const prod_T_carriere_sable = Math.round(batimentObject.carriere_sable.PROD_CARRIERE_SABLE * Batiment.carriere_sable * eval(`gouvernementObject.${Pays.ideologie}.production`) * coef_sable * emplois);
                                                sql = `
                                                    UPDATE ressources
                                                    SET carburant=carburant - ${conso_T_carriere_sable_carburant},
                                                        sable=sable + ${prod_T_carriere_sable}
                                                    WHERE id_joueur = "${Pays.id_joueur}"
                                                `;
                                                connection.query(sql, async (err) => {
                                                    if (err) {
                                                        throw err;
                                                    }
                                                })
                                            } else {
                                                list_batiment.push('Carrière de sable')
                                                //console.log('pas prod Carrière de sable')
                                            }
                                            //endregion
                                            //region Production des champs
                                            if (manque_carburant === false && manque_eau === false) {
                                                const prod_T_champ = Math.round(batimentObject.champ.PROD_CHAMP * Batiment.champ * eval(`gouvernementObject.${Pays.ideologie}.production`) * coef_nourriture * emplois);
                                                sql = `
                                                    UPDATE ressources
                                                    SET carburant=carburant - ${conso_T_champ_carburant},
                                                        eau=eau - ${conso_T_champ_eau},
                                                        nourriture=nourriture + ${prod_T_champ}
                                                    WHERE id_joueur = "${Pays.id_joueur}"
                                                `;
                                                connection.query(sql, async (err) => {
                                                    if (err) {
                                                        throw err;
                                                    }
                                                })
                                            } else {
                                                list_batiment.push('Champ')
                                                //console.log('pas prod Champ')
                                            }
                                            //endregion
                                            //region Production des cimenteries
                                            if (manque_eau === false && manque_petrole === false && manque_sable === false) {
                                                const prod_T_cimenterie = Math.round(batimentObject.cimenterie.PROD_CIMENTERIE * Batiment.cimenterie * eval(`gouvernementObject.${Pays.ideologie}.production`) * emplois);
                                                sql = `
                                                    UPDATE ressources
                                                    SET eau=eau - ${conso_T_cimenterie_eau},
                                                        petrole=petrole - ${conso_T_cimenterie_petrole},
                                                        sable=sable - ${conso_T_cimenterie_sable},
                                                        beton=beton + ${prod_T_cimenterie}
                                                    WHERE id_joueur = "${Pays.id_joueur}"
                                                `;
                                                connection.query(sql, async (err) => {
                                                    if (err) {
                                                        throw err;
                                                    }
                                                })
                                            } else {
                                                list_batiment.push('Cimenterie')
                                                //console.log('pas prod Cimenterie')
                                            }
                                            //endregion
                                            //region Production des derrick
                                            if (manque_metaux === false) {
                                                const prod_T_derrick = Math.round(batimentObject.derrick.PROD_DERRICK * Batiment.derrick * eval(`gouvernementObject.${Pays.ideologie}.production`) * coef_petrole * emplois);
                                                sql = `
                                                    UPDATE ressources
                                                    SET metaux=metaux - ${conso_T_derrick_metaux},
                                                        petrole=petrole + ${prod_T_derrick}
                                                    WHERE id_joueur = "${Pays.id_joueur}"
                                                `;
                                                connection.query(sql, async (err) => {
                                                    if (err) {
                                                        throw err;
                                                    }
                                                })
                                            } else {
                                                list_batiment.push('Derrick')
                                                //console.log('pas prod Derrick')
                                            }
                                            //endregion
                                            //region Production des mines de charbon
                                            if (manque_carburant === false) {
                                                const prod_T_mine_charbon = Math.round(batimentObject.mine_charbon.PROD_MINE_CHARBON * Batiment.mine_charbon * eval(`gouvernementObject.${Pays.ideologie}.production`) * coef_charbon * emplois);
                                                sql = `
                                                    UPDATE ressources
                                                    SET carburant=carburant - ${conso_T_mine_charbon_carburant},
                                                        charbon=charbon + ${prod_T_mine_charbon}
                                                    WHERE id_joueur = "${Pays.id_joueur}"
                                                `;
                                                connection.query(sql, async (err) => {
                                                    if (err) {
                                                        throw err;
                                                    }
                                                })
                                            } else {
                                                list_batiment.push('Mine de charbon')
                                                //console.log('pas prod Mine de charbon')
                                            }
                                            //endregion
                                            //region Production des mines de métaux
                                            if (manque_carburant === false) {
                                                const prod_T_mine_metaux = Math.round(batimentObject.mine_metaux.PROD_MINE_METAUX * Batiment.mine_metaux * eval(`gouvernementObject.${Pays.ideologie}.production`) * coef_metaux * emplois);
                                                sql = `
                                                    UPDATE ressources
                                                    SET carburant=carburant - ${conso_T_mine_metaux_carburant},
                                                        metaux=metaux + ${prod_T_mine_metaux}
                                                    WHERE id_joueur = "${Pays.id_joueur}"
                                                `;
                                                connection.query(sql, async (err) => {
                                                    if (err) {
                                                        throw err;
                                                    }
                                                })
                                            } else {
                                                list_batiment.push('Mine de métaux')
                                                //console.log('pas prod Mine de métaux')
                                            }
                                            //endregion
                                            //region Production des stations de pompage
                                            if (manque_carburant === false) {
                                                const prod_T_station_pompage = Math.round(batimentObject.station_pompage.PROD_STATION_POMPAGE * Batiment.station_pompage * eval(`gouvernementObject.${Pays.ideologie}.production`) * coef_eau * emplois);
                                                sql = `
                                                    UPDATE ressources
                                                    SET carburant=carburant - ${conso_T_station_pompage_carburant},
                                                        eau=eau + ${prod_T_station_pompage}
                                                    WHERE id_joueur = "${Pays.id_joueur}"
                                                `;
                                                connection.query(sql, async (err) => {
                                                    if (err) {
                                                        throw err;
                                                    }
                                                })
                                            } else {
                                                list_batiment.push('Station de pompage')
                                                //console.log('pas prod Station de pompage')
                                            }
                                            //endregion
                                            //region Production des raffineries
                                            if (manque_petrole === false) {
                                                const prod_T_raffinerie = Math.round(batimentObject.raffinerie.PROD_RAFFINERIE * Batiment.raffinerie * eval(`gouvernementObject.${Pays.ideologie}.production`) * emplois);
                                                sql = `
                                                    UPDATE ressources
                                                    SET petrole=petrole - ${conso_T_raffinerie_petrole},
                                                        carburant=carburant + ${prod_T_raffinerie}
                                                    WHERE id_joueur = "${Pays.id_joueur}"
                                                `;
                                                connection.query(sql, async (err) => {
                                                    if (err) {
                                                        throw err;
                                                    }
                                                })
                                            } else {
                                                list_batiment.push('Raffinerie')
                                                //console.log('pas prod Raffinerie')
                                            }
                                            //endregion
                                            //region Production des scieries
                                            if (manque_carburant === false) {
                                                const prod_T_scierie = Math.round(batimentObject.scierie.PROD_SCIERIE * Batiment.scierie * eval(`gouvernementObject.${Pays.ideologie}.production`) * coef_bois * emplois);
                                                sql = `
                                                    UPDATE ressources
                                                    SET carburant=carburant - ${conso_T_scierie_carburant},
                                                        bois=bois + ${prod_T_scierie}
                                                    WHERE id_joueur = "${Pays.id_joueur}"
                                                `;
                                                connection.query(sql, async (err) => {
                                                    if (err) {
                                                        throw err;
                                                    }
                                                })
                                            } else {
                                                list_batiment.push('Scierie')
                                                //console.log('pas prod Scierie')
                                            }
                                            //endregion
                                            //region Production des usines civiles
                                            if (manque_bois === false && manque_metaux === false && manque_petrole === false && manque_verre === false) {
                                                const prod_T_usine_civile = Math.round(batimentObject.usine_civile.PROD_USINE_CIVILE * Batiment.usine_civile * eval(`gouvernementObject.${Pays.ideologie}.production`) * emplois);
                                                sql = `
                                                    UPDATE ressources
                                                    SET bois=bois - ${conso_T_usine_civile_bois},
                                                        metaux=metaux - ${conso_T_usine_civile_metaux},
                                                        petrole=petrole - ${conso_T_usine_civile_petrole},
                                                        verre=verre - ${conso_T_usine_civile_verre},
                                                        bc=bc + ${prod_T_usine_civile}
                                                    WHERE id_joueur = "${Pays.id_joueur}"
                                                `;
                                                connection.query(sql, async (err) => {
                                                    if (err) {
                                                        throw err;
                                                    }
                                                })
                                            } else {
                                                list_batiment.push('Usine civile')
                                                //console.log('pas prod Usine civile')
                                            }
                                            //endregion
                                            //endregion

                                            //var list_batiment = [];
                                            //if (Batiment.deja_prod === 1 && (manque_bois || manque_eau || manque_metaux || manque_petrole) === true) {
                                            //    //console.log('pas full prod')
                                            //    var manque = [];
                                            //    if (manque_bois === true) {
                                            //        manque.push({
                                            //            name: `> ⛔ Manque de bois ⛔ :`,
                                            //            value: `Bois : ${Ressources.bois.toLocaleString('en-US')}/${conso_bois.toLocaleString('en-US')}\n`
                                            //        })
                                            //    }
                                            //    if (manque_eau === true) {
                                            //        manque.push({
                                            //            name: `> ⛔ Manque d\'eau ⛔ :`,
                                            //            value: `Eau : ${Ressources.eau.toLocaleString('en-US')}/${conso_eau.toLocaleString('en-US')}\n`
                                            //        })
                                            //    }
                                            //    if (manque_metaux === true) {
                                            //        manque.push({
                                            //            name: `> ⛔ Manque de métaux ⛔ :`,
                                            //            value: `Métaux : ${Ressources.metaux.toLocaleString('en-US')}/${conso_metaux.toLocaleString('en-US')}\n`
                                            //        })
                                            //    }
                                            //    if (manque_petrole === true) {
                                            //        manque.push({
                                            //            name: `> ⛔ Manque de pétrole ⛔ :`,
                                            //            value: `Pétrole : ${Ressources.petrole.toLocaleString('en-US')}/${conso_petrole.toLocaleString('en-US')}\n`
                                            //        })
                                            //    }
                                            //    function listToString(list) {
                                            //        return list.join(" | ");
                                            //    }
//
                                            //    const embed = {
                                            //        author: {
                                            //            name: `${Pays.rang} de ${Pays.nom}`,
                                            //            icon_url: Pays.avatarURL
                                            //        },
                                            //        thumbnail: {
                                            //            url: Pays.drapeau
                                            //        },
                                            //        title: `\`Manque de matériaux pour : ${listToString(list_batiment)}\``,
                                            //        fields: manque,
                                            //        color: 'RED',
                                            //        timestamp: new Date(),
                                            //        footer: {
                                            //            text: `${Pays.devise}`
                                            //        }
                                            //    };
                                            //    client.channels.cache.get(Pays.id_salon).send({embeds: [embed]}).catch(console.error);
//
                                            //    sql = `UPDATE batiments SET deja_prod=0 WHERE id_joueur="${Pays.id_joueur}"`;
                                            //    connection.query(sql, async (err) => {if (err) {throw err;}})
                                            //}
//
                                            //if ((manque_bois && manque_eau && manque_metaux && manque_petrole) === false) {
                                            //    sql = `UPDATE batiments SET deja_prod=1 WHERE id_joueur="${Pays.id_joueur}"`;
                                            //    connection.query(sql, async (err) => {if (err) {throw err;}})
                                            //}
                                        }
                                    });
                                    //endregion
                                } else if (prod_elec >= batimentObject.quartier.CONSO_QUARTIER_ELEC * Batiment.quartier) {
                                    //region Blackout
                                    let sql;
                                    if (Population.elec_acces < 1008) {
                                        sql = `UPDATE population SET elec_acces=elec_acces+1 WHERE id_joueur="${Pays.id_joueur}"`;
                                        connection.query(sql, async (err) => {if (err) {throw err;}})
                                    }
                                    sql = `UPDATE batiments SET deja_prod=0 WHERE id_joueur="${Pays.id_joueur}"`;
                                    connection.query(sql, async (err) => {if (err) {throw err;}})

                                    //if (Batiment.deja_prod === 1) {
                                    //    const embed = {
                                    //        author: {
                                    //            name: `${Pays.rang} de ${Pays.nom}`,
                                    //            icon_url: Pays.avatarURL
                                    //        },
                                    //        thumbnail: {
                                    //            url: Pays.drapeau
                                    //        },
                                    //        title: `\`Pas assez d'électricité : Blackout\``,
                                    //        fields: {
                                    //            name: `> ⛔ Manque d'électricité ⛔ :`,
                                    //            value: `Vos usines n'ont pas produit mais vos quartiers ont été fournis en électricité\n` +
                                    //                `Electricité : ${prod_elec.toLocaleString('en-US')}/${conso_elec.toLocaleString('en-US')}\n`
                                    //        },
                                    //        color: 'RED',
                                    //        timestamp: new Date(),
                                    //        footer: {
                                    //            text: `${Pays.devise}`
                                    //        }
                                    //    }
                                    //    client.channels.cache.get(Pays.id_salon).send({embeds: [embed]}).catch(console.error);
                                    //}
                                    //endregion
                                } else if (prod_elec < conso_elec) {
                                    //region Total Blackout
                                    let sql = `UPDATE batiments SET deja_prod=0 WHERE id_joueur="${Pays.id_joueur}"`;
                                    connection.query(sql, async (err) => {if (err) {throw err;}})

                                    sql = `UPDATE population SET elec_acces=0 WHERE id_joueur="${Pays.id_joueur}"`;
                                    connection.query(sql, async (err) => {if (err) {throw err;}})
                                    //if (Batiment.deja_prod === 1 || Population.elec_acces !== 0) {
                                    //    const embed = {
                                    //        author: {
                                    //            name: `${Pays.rang} de ${Pays.nom}`,
                                    //            icon_url: Pays.avatarURL
                                    //        },
                                    //        thumbnail: {
                                    //            url: Pays.drapeau
                                    //        },
                                    //        title: `\`Pas assez d'électricité : Blackout\``,
                                    //        fields: {
                                    //            name: `> ⛔ Manque d'électricité ⛔ :`,
                                    //            value: `Vous manquez de production d'électricté. Pensez à construire des centrales au fioul ou des éoliennes !\n` +
                                    //                `Electricité : ${prod_elec.toLocaleString('en-US')}/${conso_elec.toLocaleString('en-US')}\n`
                                    //        },
                                    //        color: 'RED',
                                    //        timestamp: new Date(),
                                    //        footer: {
                                    //            text: `${Pays.devise}`
                                    //        }
                                    //    }
                                    //    client.channels.cache.get(Pays.id_salon).send({embeds: [embed]}).catch(console.error);
                                    //}
                                    //endregion
                                }
                            }
                            //endregion
                        })
                    }
                })
            },
            null,
            true,
            'Europe/Paris'
            //endregion
        );

        //region Process
        const autoProcess = new CronJob(
            '0 * * * * *',
            //'* * * * * *',
            function autoProcess() {
                let sql;
                sql = `SELECT * FROM processus`;
                connection.query(sql, async(err, results) => {if (err) {throw err;}
                    const arrayProcess = Object.values(results);
                    arrayProcess.forEach(chaqueProcess);
                    function chaqueProcess(value) {
                        // Fonction pour vérifier si un timestamp est déjà passé
                        function estTimestampPasse(timestamp) {
                            const maintenant = Date.now();
                            return timestamp < maintenant;
                        }

                        // Parcourir la liste de timestamps et vérifier si chaque timestamp est passé
                        if (estTimestampPasse(value.date)) {
                            sql = `
                                SELECT * FROM pays WHERE id_joueur='${value.id_joueur}';
                                SELECT * FROM territoire WHERE id_joueur='${value.id_joueur}'
                            `;
                            connection.query(sql, async (err, results) => {if (err) {throw err;}
                                const Pays = results[0][0];
                                const Territoire = results[1][0];

                                switch (value.type) {
                                    case 'exploration':
                                        //region Exploration
                                        const arrayBiome = Object.keys(eval(`biomeObject.${Territoire.region}.biome`));
                                        const arrayChance = Object.values(eval(`biomeObject.${Territoire.region}.biome`)).map(item => item.chance);
                                        const biomeChoisi = chance.weighted(arrayBiome, arrayChance)
                                        const tailleChoisi = chance.integer({
                                            min: parseInt(eval(`biomeObject.${Territoire.region}.biome.${biomeChoisi}.min`)),
                                            max: parseInt(eval(`biomeObject.${Territoire.region}.biome.${biomeChoisi}.max`))
                                        })
                                        //let densite;
                                        //switch (biomeChoisi) {
                                        //    case 'ville':
                                        //        densite = 376;
                                        //        break;
                                        //    case 'rocheuses':
                                        //        densite = 15;
                                        //        break;
                                        //    case 'volcan':
                                        //        densite = 0;
                                        //        break;
                                        //    case 'lac':
                                        //        densite = 0;
                                        //        break;
                                        //    default:
                                        //        densite = 33;
                                        //        break;
                                        //}
                                        //const enfant = Math.round(tailleChoisi * densite * 0.2);
                                        //const jeune = Math.round(tailleChoisi * densite * 0.3);
                                        //const adulte = Math.round(tailleChoisi * densite * 0.4);
                                        //const vieux = Math.round(tailleChoisi * densite * 0.1);

                                        const joueur = client.users.cache.get(Pays.id_joueur)
                                        const embedRevenu = {
                                            author: {
                                                name: `${Pays.rang} de ${Pays.nom}`,
                                                icon_url: joueur.avatarURL()
                                            },
                                            thumbnail: {
                                                url: Pays.drapeau
                                            },
                                            title: `\`L'explorateur est revenu de mission\``,
                                            fields: [
                                                {
                                                    name: `> 🌄 Territoire :`,
                                                    value: codeBlock(
                                                        `• Il a trouvé ${eval(`biomeObject.${Territoire.region}.biome.${biomeChoisi}.nom`)} de ${tailleChoisi} km²`) + `\u200B`
                                                }
                                                //{
                                                //    name: `> 👪 Population :`,
                                                //    value: codeBlock(
                                                //        `• ${enfant.toLocaleString('en-US')} enfants\n` +
                                                //        `• ${jeune.toLocaleString('en-US')} jeunes\n` +
                                                //        `• ${adulte.toLocaleString('en-US')} adultes\n` +
                                                //        `• ${vieux.toLocaleString('en-US')} personnes agées`) + `\u200B`
                                                //},
                                            ],
                                            color: 0x57F287,
                                            timestamp: new Date(),
                                            footer: {
                                                text: `${Pays.devise}`
                                            },
                                        };

                                        const row1 = new ActionRowBuilder()
                                            .addComponents(
                                                new ButtonBuilder()
                                                    .setLabel(`Renvoyer un explorateur`)
                                                    .setEmoji(`🧭`)
                                                    .setCustomId('explorateur-' + Pays.id_joueur)
                                                    .setStyle(ButtonStyle.Success)
                                            )
                                            .addComponents(
                                                new ButtonBuilder()
                                                    .setLabel(`Intégrer`)
                                                    .setEmoji(`✔`)
                                                    .setCustomId('integrer-' + Pays.id_joueur)
                                                    .setStyle(ButtonStyle.Success),
                                            )

                                        function bouton(message) {
                                            return new ActionRowBuilder()
                                                .addComponents(
                                                    new ButtonBuilder()
                                                        .setLabel(`Lien vers le message`)
                                                        .setEmoji(`🗺️`)
                                                        .setURL(message.url)
                                                        .setStyle(ButtonStyle.Link),
                                                )
                                        }

                                        client.channels.cache.get(Pays.id_salon).send({embeds: [embedRevenu], components: [row1]})
                                            .then(message => joueur.send({
                                                embeds: [embedRevenu],
                                                components: [bouton(message)]
                                            }))

                                        sql = `DELETE FROM processus WHERE id_processus='${value.id_processus}'`;
                                        connection.query(sql, async (err) => {if (err) {throw err;}});
                                        //endregion
                                        break;
                                    case 'integration':
                                        //region Integration
                                        sql = `
                                            UPDATE territoire
                                            SET T_national=T_national+${value.option2},
                                               T_libre=T_libre+${value.option2},
                                               T_controle=T_controle-${value.option2}
                                            WHERE id_joueur='${value.id_joueur}';
                                            DELETE FROM processus WHERE id_processus='${value.id_processus}'`;
                                        connection.query(sql, async (err) => {if (err) {throw err;}});
                                        //endregion
                                        break;
                                }
                            })
                        }
                    }
                })
            },
            null,
            true,
            'Europe/Paris'
        );
        //endregion

        const autoPopulation = new CronJob(
            //region Population
            '0 0 4,12,20 * * *',
            //'* * * * * *',
            function popUpdate() {
                let sql;
                sql = `SELECT * FROM pays WHERE vacances=0`;
                //sql = `SELECT * FROM pays WHERE id_joueur='764403931534065675'`;
                connection.query(sql, async(err, results) => {if (err) {throw err;}
                    const arrayPays = Object.values(results);
                    arrayPays.forEach(chaquePays);

                    function chaquePays(value) {
                        sql = `
                            SELECT * FROM pays WHERE id_joueur='${value.id_joueur}';
                            SELECT * FROM population WHERE id_joueur='${value.id_joueur}';
                            SELECT * FROM ressources WHERE id_joueur='${value.id_joueur}'
                        `;
                        connection.query(sql, async (err, results) => {if (err) {throw err;}
                            const Pays = results[0][0];
                            const Population = results[1][0];
                            const Ressources = results[2][0];

                            if (Ressources.nourriture >= (Population.habitant * parseFloat(populationObject.NOURRITURE_CONSO)) && Population.nourriture_acces < 21) {
                                sql = `UPDATE population SET nourriture_acces=nourriture_acces+0.33 WHERE id_joueur="${Pays.id_joueur}"`;
                                connection.query(sql, async(err) => { if (err) { throw err; }})
                            } else if (Ressources.nourriture < (Population.habitant * parseFloat(populationObject.NOURRITURE_CONSO))) {
                                sql = `UPDATE population SET nourriture_acces=0 WHERE id_joueur="${Pays.id_joueur}"`;
                                connection.query(sql, async(err) => { if (err) { throw err; }})
                            }

                            if (Ressources.eau >= (Population.habitant * parseFloat(populationObject.EAU_CONSO)) && Population.eau_acces < 21) {
                                sql = `UPDATE population SET eau_acces=eau_acces+0.33 WHERE id_joueur="${Pays.id_joueur}"`;
                                connection.query(sql, async(err) => { if (err) { throw err; }})
                            } else if (Ressources.eau < (Population.habitant * parseFloat(populationObject.EAU_CONSO))) {
                                sql = `UPDATE population SET eau_acces=0 WHERE id_joueur="${Pays.id_joueur}"`;
                                connection.query(sql, async(err) => { if (err) { throw err; }})
                            }

                            const conso_bc = (1 + Population.bc_acces * 0.04 + Population.bonheur * 0.016 + (Population.habitant / 10000000) * 0.04) * Population.habitant * eval(`gouvernementObject.${Pays.ideologie}.conso_bc`)
                            //console.log(conso_bc)
                            if (Ressources.bc > conso_bc && Population.bc_acces < 21) {
                                sql = `
                                    UPDATE population SET bc_acces=bc_acces+0.33 WHERE id_joueur="${Pays.id_joueur}";
                                    UPDATE ressources SET bc=bc-${conso_bc} WHERE id_joueur="${Pays.id_joueur}"`;
                                connection.query(sql, async(err) => { if (err) { throw err; }})
                            } else if (Ressources.bc < conso_bc) {
                                sql = `
                                    UPDATE population SET bc_acces=0 WHERE id_joueur="${Pays.id_joueur}";
                                    UPDATE ressources SET bc=0 WHERE id_joueur="${Pays.id_joueur}"`;
                                connection.query(sql, async(err) => { if (err) { throw err; }})
                            }

                            sql = `
                                SELECT * FROM batiments WHERE id_joueur='${Pays.id_joueur}';
                                SELECT * FROM pays WHERE id_joueur='${Pays.id_joueur}';
                                SELECT * FROM population WHERE id_joueur='${Pays.id_joueur}'
                            `;
                            connection.query(sql, async (err, results) => {if (err) {throw err;}
                                //region Bonheur
                                const Batiment = results[0][0];
                                const Pays = results[1][0];
                                const Population = results[2][0];

                                const nourriture_acces = Population.nourriture_acces * 1.6;
                                //console.log(nourriture_acces)

                                const eau_acces = Population.eau_acces * 1.7;
                                //console.log(eau_acces)
                                const elec_acces = Population.elec_acces * (0.8 / (6 * 8));

                                const bc_acces = Population.bc_acces * 1.45;
                                //console.log(bc_acces)

                                let tauxbcmadein = (batimentObject.usine_civile.PROD_USINE_CIVILE * Batiment.usine_civile * eval(`gouvernementObject.${Pays.ideologie}.production`)) / (Population.habitant * 9 * 0.5);
                                if (tauxbcmadein > 0.8) {
                                    tauxbcmadein = 0.8;
                                }
                                tauxbcmadein = tauxbcmadein * 25;
                                //console.log(tauxbcmadein)

                                const place = (Batiment.quartier * 1500)
                                let sans_abri = (Population.habitant - place);
                                if (sans_abri < 0) {
                                    sans_abri = 0;
                                }
                                const pourcentage_sans_abri = (sans_abri / Population.habitant)
                                const sdf = (1 - pourcentage_sans_abri) * 23;
                                //console.log(sdf)

                                const gouv =  eval(`gouvernementObject.${Pays.ideologie}.bonheur`) * 3

                                let pollution;
                                if (Batiment.centrale_biomasse + Batiment.centrale_charbon + Batiment.centrale_fioul === 0) {
                                    pollution = 9;
                                } else {
                                    pollution = 0
                                }
                                const modifier = parseFloat(populationObject.BONHEUR_BASE) + nourriture_acces + eau_acces + elec_acces + bc_acces + tauxbcmadein + sdf + gouv + pollution
                                const bonheur = parseFloat(((-92 * Math.exp(-0.02 * modifier)) + 100).toFixed(1));
                                //console.log(modifier)
                                //console.log(bonheur)
                                const sql = `UPDATE population SET bonheur="${bonheur}" WHERE id_joueur="${Pays.id_joueur}"`;
                                connection.query(sql, async(err) => { if (err) { throw err; }})
                                //endregion
                            })

                            //region Croissance démographique
                            const pop_taux_demo = ((10 + Population.eau_acces * 2.3 + Population.nourriture_acces * 2.3 + Population.bonheur * 1) / 100).toFixed(2);
                            let enfant = Math.round((15 / 16) * Population.enfant + (populationObject.NATALITE_JEUNE * pop_taux_demo * Population.jeune) + (populationObject.NATALITE_ADULTE * pop_taux_demo * Population.adulte) - populationObject.MORTALITE_ENFANT * Population.enfant);
                            if (enfant < 0) {
                                enfant = 0;
                            }
                            let jeune = Math.round((8 / 9) * Population.jeune + (1 / 15) * Population.enfant - populationObject.MORTALITE_JEUNE * Population.jeune);
                            if (jeune < 0) {
                                jeune = 0;
                            }
                            let adulte = Math.round((30 / 31) * Population.adulte + (1 / 9) * Population.jeune - populationObject.MORTALITE_ADULTE * Population.adulte);
                            if (adulte < 0) {
                                adulte = 0;
                            }
                            let vieux = Math.round(Population.vieux + (1 / 31) * Population.adulte - populationObject.MORTALITE_VIEUX * Population.vieux);
                            if (vieux < 0) {
                                vieux = 0;
                            }

                            sql = `
                                UPDATE population SET pop_taux_demo=${pop_taux_demo},
                                                      habitant=${enfant + jeune + adulte + vieux},
                                                      enfant=${enfant},
                                                      jeune=${jeune},
                                                      adulte=${adulte},
                                                      vieux=${vieux} WHERE id_joueur="${Pays.id_joueur}"`;
                            connection.query(sql, async(err) => { if (err) { throw err; }})
                            //endregion


                            function func_enfant(Population, mort) {
                                let enfant;
                                let enfant_mort;

                                if (Population.enfant - mort < 0) {
                                    enfant = 0;
                                    enfant_mort = Population.enfant;
                                } else {
                                    enfant = Population.enfant - mort;
                                    enfant_mort = mort;
                                }
                                return { enfant, enfant_mort };
                            }

                            function func_jeune(Population, mort) {
                                let jeune;
                                let jeune_mort;

                                if (Population.jeune - mort < 0) {
                                    jeune = 0;
                                    jeune_mort = Population.jeune;
                                } else {
                                    jeune = Population.jeune - mort;
                                    jeune_mort = mort;
                                }
                                return { jeune, jeune_mort };
                            }

                            function func_adulte(Population, mort) {
                                let adulte;
                                let adulte_mort;
                                if (Population.adulte - mort < 0) {
                                    adulte = 0;
                                    adulte_mort = Population.adulte;
                                } else {
                                    adulte = Population.adulte - mort;
                                    adulte_mort = mort;
                                }
                                return { adulte, adulte_mort };
                            }

                            function func_vieux(Population, mort) {
                                let vieux;
                                let vieux_mort;

                                if (Population.vieux - mort < 0) {
                                    vieux = 0;
                                    vieux_mort = Population.vieux;
                                } else {
                                    vieux = Population.vieux - mort;
                                    vieux_mort = mort;
                                }
                                return { vieux, vieux_mort };
                            }

                            sql = `
                                SELECT * FROM pays WHERE id_joueur='${Pays.id_joueur}';
                                SELECT * FROM population WHERE id_joueur='${Pays.id_joueur}';
                                SELECT * FROM ressources WHERE id_joueur='${Pays.id_joueur}'
                            `;
                            connection.query(sql, async (err, results) => {if (err) {throw err;}
                                const Pays = results[0][0];
                                const Population = results[1][0];
                                const Ressources = results[2][0];

                                //region Consommation nourriture
                                if (Ressources.nourriture >= (Population.habitant * populationObject.NOURRITURE_CONSO)) {
                                    //region Nourriture suffisante
                                    const sql = `UPDATE ressources SET nourriture=nourriture-${Math.round(Population.habitant * populationObject.NOURRITURE_CONSO)} WHERE id_joueur="${Pays.id_joueur}"`;
                                    connection.query(sql, async(err) => { if (err) { throw err; }})
                                    //endregion
                                } else {
                                    //region Nourriture insuffisante
                                    const manque = (Population.habitant * populationObject.NOURRITURE_CONSO) - Ressources.nourriture;
                                    const mort = Math.round(manque * 0.025);

                                    const mort_total = func_enfant(Population, mort).enfant_mort + func_jeune(Population, mort).jeune_mort + func_adulte(Population, mort).adulte_mort + func_vieux(Population, mort).vieux_mort;
                                    const habitants_next = func_enfant(Population, mort).enfant + func_jeune(Population, mort).jeune + func_adulte(Population, mort).adulte + func_vieux(Population, mort).vieux;

                                    if ((mort_total / Population.habitant) > 0.05) {
                                        const embed = {
                                            author: {
                                                name: `${Pays.rang} de ${Pays.nom}`,
                                                icon_url: Pays.avatarURL
                                            },
                                            thumbnail: {
                                                url: Pays.drapeau
                                            },
                                            title: `\`Une famine frappe votre pays :\``,
                                            fields: [{
                                                name: `> ⛔ Manque de nourriture ⛔ :`,
                                                value: `Nourriture : ${Ressources.nourriture.toLocaleString('en-US')}/${Math.round(Population.habitant * populationObject.NOURRITURE_CONSO).toLocaleString('en-US')}\n` +
                                                    `Morts : ${mort_total.toLocaleString('en-US')}\n` +
                                                    `Population restante : ${habitants_next.toLocaleString('en-US')}\n`
                                            }],
                                            color: 0xff0000,
                                            timestamp: new Date(),
                                            footer: {
                                                text: `${Pays.devise}`
                                            }
                                        };
                                        const joueur = client.users.cache.get(Pays.id_joueur)
                                        function bouton(message) {
                                            return new ActionRowBuilder()
                                                .addComponents(
                                                    new ButtonBuilder()
                                                        .setLabel(`Lien vers le message`)
                                                        .setEmoji(`🌽`)
                                                        .setURL(message.url)
                                                        .setStyle(ButtonStyle.Link),
                                                )
                                        }

                                        client.channels.cache.get(Pays.id_salon).send({embeds: [embed]})
                                            .then(message => joueur.send({
                                                embeds: [embed],
                                                components: [bouton(message)]
                                            }))
                                    }

                                    sql = `
                                        UPDATE ressources SET nourriture=0 WHERE id_joueur="${Pays.id_joueur}";
                                        UPDATE population SET habitant=${habitants_next},
                                                              enfant=enfant-${func_enfant(Population, mort).enfant_mort},
                                                              jeune=jeune-${func_jeune(Population, mort).jeune_mort},
                                                              adulte=adulte-${func_adulte(Population, mort).adulte_mort},
                                                              vieux=vieux-${func_vieux(Population, mort).vieux_mort} WHERE id_joueur="${Pays.id_joueur}"`;
                                    connection.query(sql, async(err) => { if (err) { throw err; }})
                                    //endregion
                                }
                                //endregion

                                sql = `
                                    SELECT * FROM pays WHERE id_joueur='${Pays.id_joueur}';
                                    SELECT * FROM population WHERE id_joueur='${Pays.id_joueur}';
                                    SELECT * FROM ressources WHERE id_joueur='${Pays.id_joueur}'
                                `;
                                connection.query(sql, async (err, results) => {if (err) {throw err;}
                                    const Pays = results[0][0];
                                    const Population = results[1][0];
                                    const Ressources = results[2][0];
                                    //region Consommation eau
                                    if (Ressources.eau >= Population.habitant * populationObject.EAU_CONSO) {
                                        //region Eau suffisante
                                        const sql = `UPDATE ressources SET eau=eau-${Math.round(Population.habitant * populationObject.EAU_CONSO)} WHERE id_joueur="${Pays.id_joueur}"`;
                                        connection.query(sql, async(err) => { if (err) { throw err; }})
                                        //endregion
                                    } else {
                                        //region Eau insuffisante
                                        const manque = (Population.habitant * populationObject.EAU_CONSO) - Ressources.eau;
                                        const mort = Math.round(manque * 0.025);

                                        const mort_total = func_enfant(Population, mort).enfant_mort + func_jeune(Population, mort).jeune_mort + func_adulte(Population, mort).adulte_mort + func_vieux(Population, mort).vieux_mort;
                                        const habitants_next = func_enfant(Population, mort).enfant + func_jeune(Population, mort).jeune + func_adulte(Population, mort).adulte + func_vieux(Population, mort).vieux;

                                        //console.log(Population.habitant)
                                        //console.log(func_enfant(mort).enfant_mort)
                                        //console.log(func_jeune(mort).jeune_mort)
                                        //console.log(func_adulte(mort).adulte_mort)
                                        //console.log(func_vieux(mort).vieux_mort)

                                        if ((mort_total / Population.habitant) > 0.05) {
                                            const embed = {
                                                author: {
                                                    name: `${Pays.rang} de ${Pays.nom}`,
                                                    icon_url: Pays.avatarURL
                                                },
                                                thumbnail: {
                                                    url: Pays.drapeau
                                                },
                                                title: `\`Une pénurie frappe votre pays :\``,
                                                fields: [{
                                                    name: `> ⛔ Manque d'eau ⛔ :`,
                                                    value: `Eau : ${Ressources.eau.toLocaleString('en-US')}/${Math.round(Population.habitant * populationObject.EAU_CONSO).toLocaleString('en-US')}\n` +
                                                        `Morts : ${mort_total.toLocaleString('en-US')}\n` +
                                                        `Population restante : ${habitants_next.toLocaleString('en-US')}\n`
                                                }],
                                                color: 0xff0000,
                                                timestamp: new Date(),
                                                footer: {
                                                    text: `${Pays.devise}`
                                                }
                                            };
                                            const joueur = client.users.cache.get(Pays.id_joueur)
                                            function bouton(message) {
                                                return new ActionRowBuilder()
                                                    .addComponents(
                                                        new ButtonBuilder()
                                                            .setLabel(`Lien vers le message`)
                                                            .setEmoji(`💧`)
                                                            .setURL(message.url)
                                                            .setStyle(ButtonStyle.Link),
                                                    )
                                            }

                                            client.channels.cache.get(Pays.id_salon).send({embeds: [embed]})
                                                .then(message => joueur.send({
                                                    embeds: [embed],
                                                    components: [bouton(message)]
                                                }))
                                        }

                                        sql = `
                                        UPDATE ressources SET eau=0 WHERE id_joueur="${Pays.id_joueur}";
                                        UPDATE population SET habitant=${habitants_next},
                                                              enfant=enfant-${func_enfant(Population, mort).enfant_mort},
                                                              jeune=jeune-${func_jeune(Population, mort).jeune_mort},
                                                              adulte=adulte-${func_adulte(Population, mort).adulte_mort},
                                                              vieux=vieux-${func_vieux(Population, mort).vieux_mort} WHERE id_joueur="${Pays.id_joueur}"`;
                                        connection.query(sql, async(err) => { if (err) { throw err; }})
                                        //endregion
                                    }
                                })
                            })
                        })
                    }
                })

                //if (client.user.id === 834855105177845794) {
                //    const embed = {
                //        title: `\`Votez pour Paz Nation !\``,
                //        thumbnail: {
                //            url: `https://discord.com/channels/826427184305537054/848913340737650698/940642782643621948`
                //        },
                //        description: `N'oubliez pas de faire /vote & /bump avec <@302050872383242240> et /bump avec <@528557940811104258> ainsi que de voter sur https://top.gg/servers/826427184305537054/vote. L'équipe de Paz Nation vous remercie pour votre soutien !\n` + `\u200B\n`,
                //        color: 0x359d82,
                //        timestamp: new Date(),
                //        footer: {
                //            text: `#1 Serveur RP sur Discord`
                //        },
                //    };
//
                //    const channel = client.channels.cache.get(process.env.SALON_COMMAND);
                //    channel.send({embeds: [embed] })
                //}
            },
            null,
            true,
            'Europe/Paris'
            //endregion
            //endregion
        );

        //region Marché international
        const autoMarket = new CronJob(
            '0 0,10,20,30,40,50 * * * *',

            function marketUpdate() {
                box.set('acier_prix_total', 2.5)
                box.set('acier_res_total', 1)

                box.set('beton_prix_total', 2.5)
                box.set('beton_res_total', 1)

                box.set('bc_prix_total', 5)
                box.set('bc_res_total', 1)

                box.set('bois_prix_total', 2.5)
                box.set('bois_res_total', 1)

                box.set('carburant_prix_total', 2.5)
                box.set('carburant_res_total', 1)

                box.set('charbon_prix_total', 1)
                box.set('charbon_res_total', 1)

                box.set('eau_prix_total', 2)
                box.set('eau_res_total', 1)

                box.set('metaux_prix_total', 3)
                box.set('metaux_res_total', 1)

                box.set('nourriture_prix_total', 2.5)
                box.set('nourriture_res_total', 1)

                box.set('petrole_prix_total', 3)
                box.set('petrole_res_total', 1)

                box.set('sable_prix_total', 1.5)
                box.set('sable_res_total', 1)

                box.set('verre_prix_total', 3)
                box.set('verre_res_total', 1)

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

                    function chaqueMarket(value) {
                        switch (value.ressource) {
                            case 'Acier':
                                box.set('acier_prix_total', (box.get('acier_prix_total') + value.prix));
                                box.set('acier_res_total', (box.get('acier_res_total') + value.quantite));
                                break;
                            case 'Beton':
                                box.set('beton_prix_total', (box.get('beton_prix_total') + value.prix));
                                box.set('beton_res_total', (box.get('beton_res_total') + value.quantite));
                                break;
                            case 'Biens de consommation':
                                box.set('bc_prix_total', (box.get('bc_prix_total') + value.prix));
                                box.set('bc_res_total', (box.get('bc_res_total') + value.quantite));
                                break;
                            case 'Bois':
                                box.set('bois_prix_total', (box.get('bois_prix_total') + value.prix));
                                box.set('bois_res_total', (box.get('bois_res_total') + value.quantite));
                                break;
                            case 'Carburant':
                                box.set('carburant_prix_total', (box.get('carburant_prix_total') + value.prix));
                                box.set('carburant_res_total', (box.get('carburant_res_total') + value.quantite));
                                break;
                            case 'Charbon':
                                box.set('charbon_prix_total', (box.get('charbon_prix_total') + value.prix));
                                box.set('charbon_res_total', (box.get('charbon_res_total') + value.quantite));
                                break;
                            case 'Eau':
                                box.set('eau_prix_total', (box.get('eau_prix_total') + value.prix));
                                box.set('eau_res_total', (box.get('eau_res_total') + value.quantite));
                                break;
                            case 'Metaux':
                                box.set('metaux_prix_total', (box.get('metaux_prix_total') + value.prix));
                                box.set('metaux_res_total', (box.get('metaux_res_total') + value.quantite));
                                break;
                            case 'Nourriture':
                                box.set('nourriture_prix_total', (box.get('nourriture_prix_total') + value.prix));
                                box.set('nourriture_res_total', (box.get('nourriture_res_total') + value.quantite));
                                break;
                            case 'Petrole':
                                box.set('petrole_prix_total', (box.get('petrole_prix_total') + value.prix));
                                box.set('petrole_res_total', (box.get('petrole_res_total') + value.quantite));
                                break;
                            case 'Sable':
                                box.set('sable_prix_total', (box.get('sable_prix_total') + value.prix));
                                box.set('sable_res_total', (box.get('sable_res_total') + value.quantite));
                                break;
                            case 'Verre':
                                box.set('verre_prix_total', (box.get('verre_prix_total') + value.prix));
                                box.set('verre_res_total', (box.get('verre_res_total') + value.quantite));
                                break;
                        }
                    }

                    const acier_prix_moyen = (box.get('acier_prix_total') / box.get('acier_res_total')) + chance.floating({ min: 0, max: 0.2, fixed: 2 });

                    const beton_prix_moyen = (box.get('beton_prix_total') / box.get('beton_res_total')) + chance.floating({ min: 0, max: 0.2, fixed: 2 });

                    const bc_prix_moyen = (box.get('bc_prix_total') / box.get('bc_res_total')) + chance.floating({ min: 0, max: 0.2, fixed: 2 });

                    const bois_prix_moyen = (box.get('bois_prix_total') / box.get('bois_res_total')) + chance.floating({ min: 0, max: 0.2, fixed: 2 });

                    const carburant_prix_moyen = (box.get('carburant_prix_total') / box.get('carburant_res_total')) + chance.floating({ min: 0, max: 0.2, fixed: 2 });

                    const charbon_prix_moyen = (box.get('charbon_prix_total') / box.get('charbon_res_total')) + chance.floating({ min: 0, max: 0.2, fixed: 2 });

                    const eau_prix_moyen = (box.get('eau_prix_total') / box.get('eau_res_total')) + chance.floating({ min: 0, max: 0.2, fixed: 2 });

                    const metaux_prix_moyen = (box.get('metaux_prix_total') / box.get('metaux_res_total')) + chance.floating({ min: 0, max: 0.2, fixed: 2 });

                    const nourriture_prix_moyen = (box.get('nourriture_prix_total') / box.get('nourriture_res_total')) + chance.floating({ min: 0, max: 0.2, fixed: 2 });

                    const petrole_prix_moyen = (box.get('petrole_prix_total') / box.get('petrole_res_total')) + chance.floating({ min: 0, max: 0.2, fixed: 2 });

                    const sable_prix_moyen = (box.get('sable_prix_total') / box.get('sable_res_total')) + chance.floating({ min: 0, max: 0.2, fixed: 2 });

                    const verre_prix_moyen = (box.get('verre_prix_total') / box.get('verre_res_total')) + chance.floating({ min: 0, max: 0.2, fixed: 2 });

                    const prix = {
                        "acier": acier_prix_moyen.toFixed(2),
                        "beton": beton_prix_moyen.toFixed(2),
                        "bc": bc_prix_moyen.toFixed(2),
                        "bois": bois_prix_moyen.toFixed(2),
                        "carburant": carburant_prix_moyen.toFixed(2),
                        "charbon": charbon_prix_moyen.toFixed(2),
                        "eau": eau_prix_moyen.toFixed(2),
                        "metaux": metaux_prix_moyen.toFixed(2),
                        "nourriture": nourriture_prix_moyen.toFixed(2),
                        "petrole": petrole_prix_moyen.toFixed(2),
                        "sable": sable_prix_moyen.toFixed(2),
                        "verre": verre_prix_moyen.toFixed(2),
                    };

                    let jsonPrix = JSON.stringify(prix);
                    writeFileSync('data/prix.json', jsonPrix)

                    jsonPrix = JSON.parse(readFileSync('OLD/data/prix.json', 'utf-8'));
                    const embed = {
                        title: `Marché international :`,
                        fields: [{
                            name: `> <:acier:1075776411329122304> Acier : `,
                            value: codeBlock(`• Vente : ${(jsonPrix.acier * 0.7).toFixed(2)} | Prix moyen : ${jsonPrix.acier} | Achat : ${(jsonPrix.acier * 1.3).toFixed(2)}`) + `\u200B`
                        }, {
                            name: `> <:beton:1075776342227943526> Béton : `,
                            value: codeBlock(`• Vente : ${(jsonPrix.beton * 0.7).toFixed(2)} | Prix moyen : ${jsonPrix.beton} | Achat : ${(jsonPrix.beton * 1.3).toFixed(2)}`) + `\u200B`
                        }, {
                            name: `> 💻 Biens de consommation : `,
                            value: codeBlock(`• Vente : ${(jsonPrix.bc * 0.7).toFixed(2)} | Prix moyen : ${jsonPrix.bc} | Achat : ${(jsonPrix.bc * 1.3).toFixed(2)}`) + `\u200B`
                        }, {
                            name: `> 🪵 Bois : `,
                            value: codeBlock(`• Vente : ${(jsonPrix.bois * 0.7).toFixed(2)} | Prix moyen : ${jsonPrix.bois} | Achat : ${(jsonPrix.bois * 1.3).toFixed(2)}`) + `\u200B`
                        }, {
                            name: `> ⛽ Carburant : `,
                            value: codeBlock(`• Vente : ${(jsonPrix.carburant * 0.7).toFixed(2)} | Prix moyen : ${jsonPrix.carburant} | Achat : ${(jsonPrix.carburant * 1.3).toFixed(2)}`) + `\u200B`
                        },{
                            name: `> <:charbon:1075776385517375638> Charbon : `,
                            value: codeBlock(`• Vente : ${(jsonPrix.charbon * 0.7).toFixed(2)} | Prix moyen : ${jsonPrix.charbon} | Achat : ${(jsonPrix.charbon * 1.3).toFixed(2)}`) + `\u200B`
                        },{
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
                        }, {
                            name: `> <:sable:1075776363782479873> Sable : `,
                            value: codeBlock(`• Vente : ${(jsonPrix.sable * 0.7).toFixed(2)} | Prix moyen : ${jsonPrix.sable} | Achat : ${(jsonPrix.sable * 1.3).toFixed(2)}`) + `\u200B`
                        },{
                            name: `> 🪟 Verre : `,
                            value: codeBlock(`• Vente : ${(jsonPrix.verre * 0.7).toFixed(2)} | Prix moyen : ${jsonPrix.verre} | Achat : ${(jsonPrix.verre * 1.3).toFixed(2)}`) + `\u200B`
                        }],
                        color: 0xe7ae24,
                        timestamp: new Date(),
                    };
                    const channel = client.channels.cache.get(process.env.SALON_PRIX);
                    await channel.bulkDelete(1)
                    channel.send({embeds: [embed] })
                })
            },
            null,
            true,
            'Europe/Paris'
            //endregion
        );

        //region Competition
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
                                codeBlock(`• ${item.T_total.toLocaleString('en-US')} km²`) + `\u200B`}
                        array1.push(element);
                        let sql = `UPDATE diplomatie SET influence=10 WHERE id_joueur="${item.id_joueur}"`;
                        connection.query(sql, async(err) => { if (err) { throw err; }})
                    }
                    const embed1 = {
                        title: `\`Classement mondial : 1/5 Territoire\``,
                        fields: array1,
                        color: 0x018242,
                        timestamp: new Date(),
                    };

                    let array2 = [];
                    secondPart.forEach(monClassement2);
                    function monClassement2(item) {
                        number += 1;
                        const element = {
                            name: `#${number}`,
                            value: `<@${item.id_joueur}>\n` +
                                codeBlock(`• ${item.T_total.toLocaleString('en-US')} km²`) + `\u200B`}
                        array2.push(element);
                        let sql = `UPDATE diplomatie SET influence=7 WHERE id_joueur="${item.id_joueur}"`;
                        connection.query(sql, async(err) => { if (err) { throw err; }})
                    }
                    const embed2 = {
                        title: `\`Classement mondial : 2/5 Territoire\``,
                        fields: array2,
                        color: 0x86bc30,
                        timestamp: new Date(),
                    };

                    let array3 = [];
                    thirdPart.forEach(monClassement3);
                    function monClassement3(item) {
                        number += 1;
                        const element = {
                            name: `#${number}`,
                            value: `<@${item.id_joueur}>\n` +
                                codeBlock(`• ${item.T_total.toLocaleString('en-US')} km²`) + `\u200B`}
                        array3.push(element);
                        let sql = `UPDATE diplomatie SET influence=5 WHERE id_joueur="${item.id_joueur}"`;
                        connection.query(sql, async(err) => { if (err) { throw err; }})
                    }
                    const embed3 = {
                        title: `\`Classement mondial : 3/5 Territoire\``,
                        fields: array3,
                        color: 0xfecb00,
                        timestamp: new Date(),
                    };

                    let array4 = [];
                    fourthPart.forEach(monClassement4);
                    function monClassement4(item) {
                        number += 1;
                        const element = {
                            name: `#${number}`,
                            value: `<@${item.id_joueur}>\n` +
                                codeBlock(`• ${item.T_total.toLocaleString('en-US')} km²`) + `\u200B`}
                        array4.push(element);
                        let sql = `UPDATE diplomatie SET influence=3 WHERE id_joueur="${item.id_joueur}"`;
                        connection.query(sql, async(err) => { if (err) { throw err; }})
                    }
                    const embed4 = {
                        title: `\`Classement mondial : 4/5 Territoire\``,
                        fields: array4,
                        color: 0xf28101,
                        timestamp: new Date(),
                    };

                    let array5 = [];
                    fifthPart.forEach(monClassement5);
                    function monClassement5(item) {
                        number += 1;
                        const element = {
                            name: `#${number}`,
                            value: `<@${item.id_joueur}>\n` +
                                codeBlock(`• ${item.T_total.toLocaleString('en-US')} km²`) + `\u200B`}
                        array5.push(element);
                        let sql = `UPDATE diplomatie SET influence=2 WHERE id_joueur="${item.id_joueur}"`;
                        connection.query(sql, async(err) => { if (err) { throw err; }})
                    }
                    const embed5 = {
                        title: `\`Classement mondial : 5/5 Territoire\``,
                        fields: array5,
                        color: 0xe73f12,
                        timestamp: new Date(),
                    };

                    const salon_compet = client.channels.cache.get(process.env.SALON_COMPET_TERRITOIRE);
                    salon_compet.send('‎');
                    salon_compet.send({ embeds: [embed1, embed2, embed3, embed4, embed5] });
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
                        color: 0x018242,
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
                        color: 0x86bc30,
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
                        color: 0xfecb00,
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
                        color: 0xf28101,
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
                        color: 0xe73f12,
                        timestamp: new Date(),
                    };

                    const salon_compet = client.channels.cache.get(process.env.SALON_COMPET_BONHEUR);
                    salon_compet.send('‎');
                    salon_compet.send({ embeds: [embed1, embed2, embed3, embed4, embed5] });
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
                                codeBlock(`• ${(item.habitant - item.ancien_pop).toLocaleString('en-US')} habitants`) + `\u200B`}
                        array1.push(element);
                        let sql = `UPDATE diplomatie SET influence=influence+15 WHERE id_joueur="${item.id_joueur}"`;
                        connection.query(sql, async(err) => { if (err) { throw err; }})
                    }
                    const embed1 = {
                        title: `\`Classement mondial : 1/5 Croissance démographique\``,
                        fields: array1,
                        color: 0x018242,
                        timestamp: new Date(),
                    };

                    let array2 = [];
                    secondPart.forEach(monClassement2);
                    function monClassement2(item) {
                        number += 1;
                        const element = {
                            name: `#${number}`,
                            value: `<@${item.id_joueur}>\n` +
                                codeBlock(`• ${(item.habitant - item.ancien_pop).toLocaleString('en-US')} habitants`) + `\u200B`}
                        array2.push(element);
                        let sql = `UPDATE diplomatie SET influence=influence+11 WHERE id_joueur="${item.id_joueur}"`;
                        connection.query(sql, async(err) => { if (err) { throw err; }})
                    }
                    const embed2 = {
                        title: `\`Classement mondial : 2/5 Croissance démographique\``,
                        fields: array2,
                        color: 0x86bc30,
                        timestamp: new Date(),
                    };

                    let array3 = [];
                    thirdPart.forEach(monClassement3);
                    function monClassement3(item) {
                        number += 1;
                        const element = {
                            name: `#${number}`,
                            value: `<@${item.id_joueur}>\n` +
                                codeBlock(`• ${(item.habitant - item.ancien_pop).toLocaleString('en-US')} habitants`) + `\u200B`}
                        array3.push(element);
                        let sql = `UPDATE diplomatie SET influence=influence+8 WHERE id_joueur="${item.id_joueur}"`;
                        connection.query(sql, async(err) => { if (err) { throw err; }})
                    }
                    const embed3 = {
                        title: `\`Classement mondial : 3/5 Croissance démographique\``,
                        fields: array3,
                        color: 0xfecb00,
                        timestamp: new Date(),
                    };

                    let array4 = [];
                    fourthPart.forEach(monClassement4);
                    function monClassement4(item) {
                        number += 1;
                        const element = {
                            name: `#${number}`,
                            value: `<@${item.id_joueur}>\n` +
                                codeBlock(`• ${(item.habitant - item.ancien_pop).toLocaleString('en-US')} habitants`) + `\u200B`}
                        array4.push(element);
                        let sql = `UPDATE diplomatie SET influence=influence+5 WHERE id_joueur="${item.id_joueur}"`;
                        connection.query(sql, async(err) => { if (err) { throw err; }})
                    }
                    const embed4 = {
                        title: `\`Classement mondial : 4/5 Croissance démographique\``,
                        fields: array4,
                        color: 0xf28101,
                        timestamp: new Date(),
                    };

                    let array5 = [];
                    fifthPart.forEach(monClassement5);
                    function monClassement5(item) {
                        number += 1;
                        const element = {
                            name: `#${number}`,
                            value: `<@${item.id_joueur}>\n` +
                                codeBlock(`• ${(item.habitant - item.ancien_pop).toLocaleString('en-US')} habitants`) + `\u200B`}
                        array5.push(element);
                        let sql = `UPDATE diplomatie SET influence=influence+3 WHERE id_joueur="${item.id_joueur}"`;
                        connection.query(sql, async(err) => { if (err) { throw err; }})
                    }
                    const embed5 = {
                        title: `\`Classement mondial : 5/5 Croissance démographique\``,
                        fields: array5,
                        color: 0xe73f12,
                        timestamp: new Date(),
                    };

                    list2.forEach(ancienPop)
                    function ancienPop(value) {
                        let sql = `UPDATE population SET ancien_pop="${value.habitant}" WHERE id_joueur="${value.id_joueur}"`;
                        connection.query(sql, async(err) => { if (err) { throw err; }})
                    }
                    const salon_compet = client.channels.cache.get(process.env.SALON_COMPET_POPULATION);
                    salon_compet.send('‎');
                    salon_compet.send({ embeds: [embed1, embed2, embed3, embed4, embed5] });

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

                setTimeout(() => {
                    sql = `SELECT * FROM diplomatie ORDER BY influence DESC`;
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
                                    codeBlock(`• ${item.influence.toLocaleString('en-US')} influence`) + `\u200B`}
                            array1.push(element);
                        }
                        const embed1 = {
                            title: `\`Classement mondial : 1/5 Influence\``,
                            fields: array1,
                            color: 0x018242,
                            timestamp: new Date(),
                        };

                        let array2 = [];
                        secondPart.forEach(monClassement2);
                        function monClassement2(item) {
                            number += 1;
                            const element = {
                                name: `#${number}`,
                                value: `<@${item.id_joueur}>\n` +
                                    codeBlock(`• ${item.influence.toLocaleString('en-US')} influence`) + `\u200B`}
                            array2.push(element);
                        }
                        const embed2 = {
                            title: `\`Classement mondial : 2/5 Influence\``,
                            fields: array2,
                            color: 0x86bc30,
                            timestamp: new Date(),
                        };

                        let array3 = [];
                        thirdPart.forEach(monClassement3);
                        function monClassement3(item) {
                            number += 1;
                            const element = {
                                name: `#${number}`,
                                value: `<@${item.id_joueur}>\n` +
                                    codeBlock(`• ${item.influence.toLocaleString('en-US')} influence`) + `\u200B`}
                            array3.push(element);
                        }
                        const embed3 = {
                            title: `\`Classement mondial : 3/5 Influence\``,
                            fields: array3,
                            color: 0xfecb00,
                            timestamp: new Date(),
                        };

                        let array4 = [];
                        fourthPart.forEach(monClassement4);
                        function monClassement4(item) {
                            number += 1;
                            const element = {
                                name: `#${number}`,
                                value: `<@${item.id_joueur}>\n` +
                                    codeBlock(`• ${item.influence.toLocaleString('en-US')} influence`) + `\u200B`}
                            array4.push(element);
                        }
                        const embed4 = {
                            title: `\`Classement mondial : 4/5 Influence\``,
                            fields: array4,
                            color: 0xf28101,
                            timestamp: new Date(),
                        };

                        let array5 = [];
                        fifthPart.forEach(monClassement5);
                        function monClassement5(item) {
                            number += 1;
                            const element = {
                                name: `#${number}`,
                                value: `<@${item.id_joueur}>\n` +
                                    codeBlock(`• ${item.influence.toLocaleString('en-US')} influence`) + `\u200B`}
                            array5.push(element);
                        }
                        const embed5 = {
                            title: `\`Classement mondial : 5/5 Influence\``,
                            fields: array5,
                            color: 0xe73f12,
                            timestamp: new Date(),
                        };

                        const salonCompet = client.channels.cache.get(process.env.SALON_COMPET);
                        salonCompet.send('<@&845692674111045673>');
                        salonCompet.send({ embeds: [embed1, embed2, embed3, embed4, embed5] });
                    })
                }, 2000)
            },
            null,
            true,
            'Europe/Paris'
            //endregion
        );

        //region Jour
        const autoJour = new CronJob(
            '0 0 0 * * *',
            //'0 * * * * *',
            function jourUpdate() {

                let sql = `SELECT * FROM pays WHERE vacances=0`;
                connection.query(sql, async(err, results) => {if (err) {throw err;}
                    results.forEach(dailyJour);
                    function dailyJour(item) {
                        let sql = `UPDATE pays SET daily=0 WHERE id_joueur="${item.id_joueur}"`;
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
            //endregion
        );
    }
}