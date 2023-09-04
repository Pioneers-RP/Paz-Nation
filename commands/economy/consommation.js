const { readFileSync } = require('fs');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder, codeBlock } = require("discord.js");
const { connection } = require("../../index");
const armeeObject = JSON.parse(readFileSync('data/armee.json', 'utf-8'));
const batimentObject = JSON.parse(readFileSync('data/batiment.json', 'utf-8'));
const gouvernementObject = JSON.parse(readFileSync('data/gouvernement.json', 'utf-8'));
const populationObject = JSON.parse(readFileSync('data/population.json', 'utf-8'));
const regionObject = JSON.parse(readFileSync('data/region.json', 'utf-8'));

module.exports = {
    data: new SlashCommandBuilder()
        .setName('consommation')
        .setDescription(`Affiche votre consommation de ressource`),

    async execute(interaction) {
        const { connection } = require('../../index.js');

        const sql = `
            SELECT * FROM armee WHERE id_joueur='${interaction.member.id}';
            SELECT * FROM batiments WHERE id_joueur='${interaction.member.id}';
            SELECT * FROM pays WHERE id_joueur='${interaction.member.id}';
            SELECT * FROM population WHERE id_joueur='${interaction.member.id}';
            SELECT * FROM ressources WHERE id_joueur='${interaction.member.id}';
            SELECT * FROM territoire WHERE id_joueur='${interaction.member.id}';
        `;
        connection.query(sql, async(err, results) => {if (err) {throw err;}
            const Armee = results[0][0];
            const Batiment = results[1][0];
            const Pays = results[2][0];
            const Population = results[3][0];
            const Ressources = results[4][0];
            const Territoire = results[5][0];

            const coef_eolienne = eval(`regionObject.${Territoire.region}.eolienne`)

            //region Production d'électricité
            //region Production d'électricté des centrales biomasse
            const conso_T_centrale_biomasse_bois = batimentObject.centrale_biomasse.CONSO_CENTRALE_BIOMASSE_BOIS * Batiment.centrale_biomasse
            let prod_centrale_biomasse = true;
            if (conso_T_centrale_biomasse_bois > Ressources.bois && conso_T_centrale_biomasse_bois !== 0) {
                prod_centrale_biomasse = false;
            }
            const conso_T_centrale_biomasse_eau = batimentObject.centrale_biomasse.CONSO_CENTRALE_BIOMASSE_EAU * Batiment.centrale_biomasse
            if (conso_T_centrale_biomasse_eau > Ressources.eau && conso_T_centrale_biomasse_eau !== 0) {
                prod_centrale_biomasse = false;
            }
            //endregion
            //region Production d'électricté des centrales au charbon
            const conso_T_centrale_charbon_charbon = batimentObject.centrale_charbon.CONSO_CENTRALE_CHARBON_CHARBON * Batiment.centrale_charbon
            let prod_centrale_charbon = true;
            if (conso_T_centrale_charbon_charbon > Ressources.charbon && conso_T_centrale_charbon_charbon !== 0) {
                prod_centrale_charbon = false;
            }
            const conso_T_centrale_charbon_eau = batimentObject.centrale_charbon.CONSO_CENTRALE_CHARBON_EAU * Batiment.centrale_charbon
            if (conso_T_centrale_charbon_eau > Ressources.eau && conso_T_centrale_charbon_eau !== 0) {
                prod_centrale_charbon = false;
            }
            //endregion
            //region Production d'électricité des centrales au fioul
            const conso_T_centrale_fioul_carburant = batimentObject.centrale_fioul.CONSO_CENTRALE_FIOUL_CARBURANT * Batiment.centrale_fioul
            let prod_centrale_fioul = true;
            if (conso_T_centrale_fioul_carburant > Ressources.carburant && conso_T_centrale_fioul_carburant !== 0) {
                prod_centrale_fioul = false;
            }
            const conso_T_centrale_fioul_eau = batimentObject.centrale_fioul.CONSO_CENTRALE_FIOUL_EAU * Batiment.centrale_fioul
            if (conso_T_centrale_fioul_eau > Ressources.eau && conso_T_centrale_fioul_eau !== 0) {
                prod_centrale_fioul = false;
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

            //region Calcul du taux d'emploies
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

            //region Calcul des coefficients de production des ressources
            const coef_bois = eval(`regionObject.${Territoire.region}.bois`)
            const coef_charbon = eval(`regionObject.${Territoire.region}.charbon`)
            const coef_eau = eval(`regionObject.${Territoire.region}.eau`)
            const coef_metaux = eval(`regionObject.${Territoire.region}.metaux`)
            const coef_nourriture = eval(`regionObject.${Territoire.region}.nourriture`)
            const coef_petrole = eval(`regionObject.${Territoire.region}.petrole`)
            const coef_sable = eval(`regionObject.${Territoire.region}.sable`)
            //endregion
            function convertMillisecondsToTime(milliseconds) {
                const seconds = Math.floor(milliseconds / 1000);
                const hours = Math.floor(seconds / 3600);
                return `${hours}h`;
            }

            let Prod;
            let Conso;
            let Diff;
            let boisName;
            const conso_T_scierie_carburant = Math.round(batimentObject.scierie.CONSO_SCIERIE_CARBURANT * Batiment.scierie * eval(`gouvernementObject.${Pays.ideologie}.consommation`) * emplois);
            if (conso_T_scierie_carburant > Ressources.carburant) {
                boisName = `> ⚠️ Bois : ⛏️ x${coef_bois} ⚠️`;
            } else if (prod_elec < conso_elec) {
                boisName = `> 🪫 Bois : ⛏️ x${coef_bois} 🪫`;
            } else if (emplois < 0.5) {
                boisName = `> 🚷 Bois : ⛏️ x${coef_bois} 🚷`;
            } else {
                boisName = `> 🪵 Bois : ⛏️ x${coef_bois}`;
            }
            let Bois;
            Prod = Math.round(batimentObject.scierie.PROD_SCIERIE * Batiment.scierie * eval(`gouvernementObject.${Pays.ideologie}.production`) * coef_bois * emplois);
            const conso_T_usine_civile_bois = Math.round(batimentObject.usine_civile.CONSO_USINE_CIVILE_BOIS * Batiment.usine_civile * eval(`gouvernementObject.${Pays.ideologie}.consommation`) * emplois);
            Conso = conso_T_usine_civile_bois + conso_T_centrale_biomasse_bois;
            Diff = Prod - Conso;
            if (Diff / Prod > 0.1) {
                Bois = codeBlock('md', `> -${Conso.toLocaleString('en-US')} | +${Prod.toLocaleString('en-US')} | :${Diff.toLocaleString('en-US')}" | 📦 ${Ressources.bois.toLocaleString('en-US')} | 🟩 ∞`);
            } else if (Diff / Prod >= 0) {
                Bois = codeBlock('ansi', `\u001b[0;0m\u001b[1;33m> -${Conso.toLocaleString('en-US')} | +${Prod.toLocaleString('en-US')} | :${Diff.toLocaleString('en-US')} | 📦 ${Ressources.bois.toLocaleString('en-US')} | 🟨 ∞`);
            } else {
                Bois = codeBlock('ansi', `\u001b[0;0m\u001b[1;31m> -${Conso.toLocaleString('en-US')} | +${Prod.toLocaleString('en-US')} | :${Diff.toLocaleString('en-US')} | 📦 ${Ressources.bois.toLocaleString('en-US')} | 🟥⌛ ${convertMillisecondsToTime(Math.floor(- Ressources.bois / Diff) * 10 * 60 * 1000)}`);
            }

            let charbonName;
            const conso_T_mine_charbon_carburant = Math.round(batimentObject.mine_charbon.CONSO_MINE_CHARBON_CARBURANT * Batiment.mine_charbon * eval(`gouvernementObject.${Pays.ideologie}.consommation`) * emplois);
            if (conso_T_mine_charbon_carburant > Ressources.carburant) {
                charbonName = `> ⚠️ Charbon : ⛏️ x${coef_charbon} ⚠️`;
            } else if (prod_elec < conso_elec) {
                charbonName = `> 🪫 Charbon : ⛏️ x${coef_charbon} 🪫`;
            } else if (emplois < 0.5) {
                charbonName = `> 🚷 Charbon : ⛏️ x${coef_charbon} 🚷`;
            } else {
                charbonName = `> <:charbon:1075776385517375638> Charbon : ⛏️ x${coef_charbon}`;
            }
            let Charbon;
            Prod = Math.round(batimentObject.mine_charbon.PROD_MINE_CHARBON * Batiment.mine_charbon * eval(`gouvernementObject.${Pays.ideologie}.production`) * coef_charbon * emplois);
            const conso_T_acierie_charbon = Math.round(batimentObject.acierie.CONSO_ACIERIE_CHARBON * Batiment.acierie * eval(`gouvernementObject.${Pays.ideologie}.consommation`) * emplois);
            Conso = conso_T_acierie_charbon + conso_T_centrale_charbon_charbon;
            Diff = Prod - Conso;
            if (Diff / Prod > 0.1) {
                Charbon = codeBlock('md', `> -${Conso.toLocaleString('en-US')} | +${Prod.toLocaleString('en-US')} | :${Diff.toLocaleString('en-US')}" | 📦 ${Ressources.charbon.toLocaleString('en-US')} | 🟩 ∞`);
            } else if (Diff / Prod >= 0) {
                Charbon = codeBlock('ansi', `\u001b[0;0m\u001b[1;33m> -${Conso.toLocaleString('en-US')} | +${Prod.toLocaleString('en-US')} | :${Diff.toLocaleString('en-US')} | 📦 ${Ressources.charbon.toLocaleString('en-US')} | 🟨 ∞`);
            } else {
                Charbon = codeBlock('ansi', `\u001b[0;0m\u001b[1;31m> -${Conso.toLocaleString('en-US')} | +${Prod.toLocaleString('en-US')} | :${Diff.toLocaleString('en-US')} | 📦 ${Ressources.charbon.toLocaleString('en-US')} | 🟥⌛ ${convertMillisecondsToTime(Math.floor(- Ressources.charbon / Diff) * 10 * 60 * 1000)}`);
            }

            let eauName;
            const conso_T_station_pompage_carburant = Math.round(batimentObject.station_pompage.CONSO_STATION_POMPAGE_CARBURANT * Batiment.station_pompage * eval(`gouvernementObject.${Pays.ideologie}.consommation`) * emplois);
            if (conso_T_station_pompage_carburant > Ressources.carburant) {
                eauName = `> ⚠️ Eau : ⛏️ x${coef_eau} ⚠️`;
            } else if (prod_elec < conso_elec) {
                eauName = `> 🪫 Eau : ⛏️ x${coef_eau} 🪫`;
            } else if (emplois < 0.5) {
                eauName = `> 🚷 Eau : ⛏️ x${coef_eau} 🚷`;
            } else {
                eauName = `> 💧 Eau : ⛏️ x${coef_eau}`;
            }
            let Eau;
            Prod = Math.round(batimentObject.station_pompage.PROD_STATION_POMPAGE * Batiment.station_pompage * eval(`gouvernementObject.${Pays.ideologie}.production`) * coef_eau * emplois);
            const conso_T_atelier_verre_eau = Math.round(batimentObject.atelier_verre.CONSO_ATELIER_VERRE_EAU * Batiment.atelier_verre * eval(`gouvernementObject.${Pays.ideologie}.consommation`) * emplois);
            const conso_T_champ_eau = Math.round(batimentObject.champ.CONSO_CHAMP_EAU * Batiment.champ * eval(`gouvernementObject.${Pays.ideologie}.consommation`) * emplois);
            const conso_T_cimenterie_eau = Math.round(batimentObject.cimenterie.CONSO_CIMENTERIE_EAU * Batiment.cimenterie * eval(`gouvernementObject.${Pays.ideologie}.consommation`) * emplois);
            const conso_pop = Math.round((Population.habitant * populationObject.EAU_CONSO) / 48);
            Conso = conso_T_atelier_verre_eau + conso_T_champ_eau + conso_T_cimenterie_eau + conso_T_centrale_biomasse_eau + conso_T_centrale_charbon_eau + conso_T_centrale_fioul_eau + conso_pop;
            Diff = Prod - Conso;
            if (Diff / Prod > 0.1) {
                Eau = codeBlock('md', `> -${Conso.toLocaleString('en-US')} | +${Prod.toLocaleString('en-US')} | :${Diff.toLocaleString('en-US')}" | 📦 ${Ressources.eau.toLocaleString('en-US')} | 🟩 ∞`);
            } else if (Diff / Prod >= 0) {
                Eau = codeBlock('ansi', `\u001b[0;0m\u001b[1;33m> -${Conso.toLocaleString('en-US')} | +${Prod.toLocaleString('en-US')} | :${Diff.toLocaleString('en-US')} | 📦 ${Ressources.eau.toLocaleString('en-US')} | 🟨 ∞`);
            } else {
                Eau = codeBlock('ansi', `\u001b[0;0m\u001b[1;31m> -${Conso.toLocaleString('en-US')} | +${Prod.toLocaleString('en-US')} | :${Diff.toLocaleString('en-US')} | 📦 ${Ressources.eau.toLocaleString('en-US')} | 🟥⌛ ${convertMillisecondsToTime(Math.floor(- Ressources.eau / Diff) * 10 * 60 * 1000)}`);
            }

            let metauxName;
            const conso_T_mine_metaux_carburant = Math.round(batimentObject.mine_metaux.CONSO_MINE_METAUX_CARBURANT * Batiment.mine_metaux * eval(`gouvernementObject.${Pays.ideologie}.consommation`) * emplois);
            if (conso_T_mine_metaux_carburant > Ressources.carburant) {
                metauxName = `> ⚠️ Metaux : ⛏️ x${coef_metaux} ⚠️`;
            } else if (prod_elec < conso_elec) {
                metauxName = `> 🪫 Metaux : ⛏️ x${coef_metaux} 🪫`;
            } else if (emplois < 0.5) {
                metauxName = `> 🚷 Metaux : ⛏️ x${coef_metaux} 🚷`;
            } else {
                metauxName = `> 🪨 Metaux : ⛏️ x${coef_metaux}`;
            }
            let Metaux;
            Prod = Math.round(batimentObject.mine_metaux.PROD_MINE_METAUX * Batiment.mine_metaux * eval(`gouvernementObject.${Pays.ideologie}.production`) * coef_metaux * emplois);
            const conso_T_acierie_metaux = Math.round(batimentObject.acierie.CONSO_ACIERIE_METAUX * Batiment.acierie * eval(`gouvernementObject.${Pays.ideologie}.consommation`) * emplois);
            const conso_T_derrick_metaux = Math.round(batimentObject.derrick.CONSO_DERRICK_METAUX * Batiment.derrick * eval(`gouvernementObject.${Pays.ideologie}.consommation`) * emplois);
            const conso_T_usine_civile_metaux = Math.round(batimentObject.usine_civile.CONSO_USINE_CIVILE_METAUX * Batiment.usine_civile * eval(`gouvernementObject.${Pays.ideologie}.consommation`) * emplois);
            Conso = conso_T_acierie_metaux + conso_T_derrick_metaux + conso_T_usine_civile_metaux;
            Diff = Prod - Conso;
            if (Diff / Prod > 0.1) {
                Metaux = codeBlock('md', `> -${Conso.toLocaleString('en-US')} | +${Prod.toLocaleString('en-US')} | :${Diff.toLocaleString('en-US')}" | 📦 ${Ressources.metaux.toLocaleString('en-US')} | 🟩 ∞`);
            } else if (Diff / Prod >= 0) {
                Metaux = codeBlock('ansi', `\u001b[0;0m\u001b[1;33m> -${Conso.toLocaleString('en-US')} | +${Prod.toLocaleString('en-US')} | :${Diff.toLocaleString('en-US')} | 📦 ${Ressources.metaux.toLocaleString('en-US')} | 🟨 ∞`);
            } else {
                Metaux = codeBlock('ansi', `\u001b[0;0m\u001b[1;31m> -${Conso.toLocaleString('en-US')} | +${Prod.toLocaleString('en-US')} | :${Diff.toLocaleString('en-US')} | 📦 ${Ressources.metaux.toLocaleString('en-US')} | 🟥⌛ ${convertMillisecondsToTime(Math.floor(- Ressources.metaux / Diff) * 10 * 60 * 1000)}`);
            }

            let nourritureName;
            const conso_T_champ_carburant = Math.round(batimentObject.champ.CONSO_CHAMP_CARBURANT * Batiment.champ * eval(`gouvernementObject.${Pays.ideologie}.consommation`) * emplois);
            if (conso_T_champ_carburant > Ressources.carburant) {
                nourritureName = `> ⚠️ Nourriture : ⛏️ x${coef_nourriture} ⚠️`;
            } else if (conso_T_champ_eau > Ressources.eau) {
                nourritureName = `> ⚠️ Nourriture : ⛏️ x${coef_nourriture} ⚠️`;
            } else if (prod_elec < conso_elec) {
                nourritureName = `> 🪫 Nourriture : ⛏️ x${coef_nourriture} 🪫`;
            } else if (emplois < 0.5) {
                nourritureName = `> 🚷 Nourriture : ⛏️ x${coef_nourriture} 🚷`;
            } else {
                nourritureName = `> 🌽 Nourriture : ⛏️ x${coef_nourriture}`;
            }
            let Nourriture;
            Prod = Math.round(batimentObject.champ.PROD_CHAMP * Batiment.champ * eval(`gouvernementObject.${Pays.ideologie}.production`) * coef_nourriture * emplois);
            Conso = Math.round((Population.habitant * populationObject.NOURRITURE_CONSO) / 48);
            Diff = Prod - Conso;
            if (Diff / Prod > 0.1) {
                Nourriture = codeBlock('md', `> -${Conso.toLocaleString('en-US')} | +${Prod.toLocaleString('en-US')} | :${Diff.toLocaleString('en-US')}" | 📦 ${Ressources.nourriture.toLocaleString('en-US')} | 🟩 ∞`);
            } else if (Diff / Prod >= 0) {
                Nourriture = codeBlock('ansi', `\u001b[0;0m\u001b[1;33m> -${Conso.toLocaleString('en-US')} | +${Prod.toLocaleString('en-US')} | :${Diff.toLocaleString('en-US')} | 📦 ${Ressources.nourriture.toLocaleString('en-US')} | 🟨 ∞`);
            } else {
                Nourriture = codeBlock('ansi', `\u001b[0;0m\u001b[1;31m> -${Conso.toLocaleString('en-US')} | +${Prod.toLocaleString('en-US')} | :${Diff.toLocaleString('en-US')} | 📦 ${Ressources.nourriture.toLocaleString('en-US')} | 🟥⌛ ${convertMillisecondsToTime(Math.floor(- Ressources.nourriture / Diff) * 10 * 60 * 1000)}`);
            }

            let petroleName;
            if (conso_T_derrick_metaux > Ressources.metaux) {
                petroleName = `> ⚠️ Pétrole : ⛏️ x${coef_petrole} ⚠️`;
            } else if (prod_elec < conso_elec) {
                petroleName = `> 🪫 Pétrole : ⛏️ x${coef_petrole} 🪫`;
            } else if (emplois < 0.5) {
                petroleName = `> 🚷 Pétrole : ⛏️ x${coef_petrole} 🚷`;
            } else {
                petroleName = `> 🛢️ Pétrole : ⛏️ x${coef_petrole}`;
            }
            let Petrole;
            Prod = Math.round(batimentObject.derrick.PROD_DERRICK * Batiment.derrick * eval(`gouvernementObject.${Pays.ideologie}.production`) * coef_petrole * emplois);
            const conso_T_cimenterie_petrole = Math.round(batimentObject.cimenterie.CONSO_CIMENTERIE_PETROLE * Batiment.cimenterie * eval(`gouvernementObject.${Pays.ideologie}.consommation`) * emplois);
            const conso_T_raffinerie_petrole = Math.round(batimentObject.raffinerie.CONSO_RAFFINERIE_PETROLE * Batiment.raffinerie * eval(`gouvernementObject.${Pays.ideologie}.consommation`) * emplois);
            const conso_T_usine_civile_petrole = Math.round(batimentObject.usine_civile.CONSO_USINE_CIVILE_PETROLE * Batiment.usine_civile * eval(`gouvernementObject.${Pays.ideologie}.consommation`) * emplois);
            Conso = conso_T_cimenterie_petrole + conso_T_raffinerie_petrole + conso_T_usine_civile_petrole;
            Diff = Prod - Conso;
            if (Diff / Prod > 0.1) {
                Petrole = codeBlock('md', `> -${Conso.toLocaleString('en-US')} | +${Prod.toLocaleString('en-US')} | :${Diff.toLocaleString('en-US')}" | 📦 ${Ressources.petrole.toLocaleString('en-US')} | 🟩 ∞`);
            } else if (Diff / Prod >= 0) {
                Petrole = codeBlock('ansi', `\u001b[0;0m\u001b[1;33m> -${Conso.toLocaleString('en-US')} | +${Prod.toLocaleString('en-US')} | :${Diff.toLocaleString('en-US')} | 📦 ${Ressources.petrole.toLocaleString('en-US')} | 🟨 ∞`);
            } else {
                Petrole = codeBlock('ansi', `\u001b[0;0m\u001b[1;31m> -${Conso.toLocaleString('en-US')} | +${Prod.toLocaleString('en-US')} | :${Diff.toLocaleString('en-US')} | 📦 ${Ressources.petrole.toLocaleString('en-US')} | 🟥⌛ ${convertMillisecondsToTime(Math.floor(- Ressources.petrole / Diff) * 10 * 60 * 1000)}`);
            }

            let sableName;
            const conso_T_carriere_sable_carburant = Math.round(batimentObject.carriere_sable.CONSO_CARRIERE_SABLE_CARBURANT * Batiment.carriere_sable * eval(`gouvernementObject.${Pays.ideologie}.consommation`) * emplois);
            if (conso_T_carriere_sable_carburant > Ressources.carburant) {
                sableName = `> ⚠️ Sable : ⛏️ x${coef_sable} ⚠️️`;
            } else if (prod_elec < conso_elec) {
                sableName = `> 🪫 Sable : ⛏️ x${coef_sable} 🪫`;
            } else if (emplois < 0.5) {
                sableName = `> 🚷 Sable : ⛏️ x${coef_sable} 🚷`;
            } else {
                sableName = `> <:sable:1075776363782479873> Sable : ⛏️ x${coef_sable}`;
            }
            let Sable;
            Prod = Math.round(batimentObject.carriere_sable.PROD_CARRIERE_SABLE * Batiment.carriere_sable * eval(`gouvernementObject.${Pays.ideologie}.production`) * coef_sable * emplois);
            const conso_T_atelier_verre_sable = Math.round(batimentObject.atelier_verre.CONSO_ATELIER_VERRE_SABLE * Batiment.atelier_verre * eval(`gouvernementObject.${Pays.ideologie}.consommation`) * emplois);
            const conso_T_cimenterie_sable = Math.round(batimentObject.cimenterie.CONSO_CIMENTERIE_SABLE * Batiment.cimenterie * eval(`gouvernementObject.${Pays.ideologie}.consommation`) * emplois);
            Conso = conso_T_atelier_verre_sable + conso_T_cimenterie_sable;
            Diff = Prod - Conso;
            if (Diff / Prod > 0.1) {
                Sable = codeBlock('md', `> -${Conso.toLocaleString('en-US')} | +${Prod.toLocaleString('en-US')} | :${Diff.toLocaleString('en-US')}" | 📦 ${Ressources.sable.toLocaleString('en-US')} | 🟩 ∞`);
            } else if (Diff / Prod >= 0) {
                Sable = codeBlock('ansi', `\u001b[0;0m\u001b[1;33m> -${Conso.toLocaleString('en-US')} | +${Prod.toLocaleString('en-US')} | :${Diff.toLocaleString('en-US')} | 📦 ${Ressources.sable.toLocaleString('en-US')} | 🟨 ∞`);
            } else {
                Sable = codeBlock('ansi', `\u001b[0;0m\u001b[1;31m> -${Conso.toLocaleString('en-US')} | +${Prod.toLocaleString('en-US')} | :${Diff.toLocaleString('en-US')} | 📦 ${Ressources.sable.toLocaleString('en-US')} | 🟥⌛ ${convertMillisecondsToTime(Math.floor(- Ressources.sable / Diff) * 10 * 60 * 1000)}`);
            }

            const embed = {
                author: {
                    name: `${Pays.rang} de ${Pays.nom}`,
                    icon_url: interaction.member.displayAvatarURL()
                },
                thumbnail: {
                    url: Pays.drapeau
                },
                title: `\`Consommation en : Matières premières\``,
                fields: [
                    {
                        name: boisName,
                        value: Bois,
                    },
                    {
                        name: charbonName,
                        value: Charbon,
                    },
                    {
                        name: eauName,
                        value: Eau,
                    },
                    {
                        name: metauxName,
                        value: Metaux,
                    },
                    {
                        name: nourritureName,
                        value: Nourriture,
                    },
                    {
                        name: petroleName,
                        value: Petrole,
                    },
                    {
                        name: sableName,
                        value: Sable,
                    },
                ],
                color: interaction.member.displayColor,
                timestamp: new Date(),
                footer: { text: Pays.devise }
            };

            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setLabel(`Matières premières`)
                        .setCustomId('matiere_premiere')
                        .setEmoji('<:charbon:1075776385517375638>')
                        .setStyle(ButtonStyle.Secondary)
                        .setDisabled(true)
                ).addComponents(
                    new ButtonBuilder()
                        .setLabel(`Ressources manufacturés`)
                        .setCustomId('ressource_manufacture')
                        .setEmoji('<:acier:1075776411329122304>')
                        .setStyle(ButtonStyle.Primary)
                )
                .addComponents(
                    new ButtonBuilder()
                        .setLabel(`Produits manufacturés`)
                        .setCustomId('produit_manufacture')
                        .setEmoji('💻')
                        .setStyle(ButtonStyle.Primary)
                )
                .addComponents(
                    new ButtonBuilder()
                        .setLabel(`Autre`)
                        .setCustomId('autre')
                        .setEmoji('⚡')
                        .setStyle(ButtonStyle.Primary)
                )

            await interaction.reply({ embeds: [embed], components: [row] });
        });
    }
};
