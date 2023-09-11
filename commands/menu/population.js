const { SlashCommandBuilder, codeBlock} = require("discord.js");
const { readFileSync } = require('fs');
const armeeObject = JSON.parse(readFileSync('data/armee.json', 'utf-8'));
const populationObject = JSON.parse(readFileSync('data/population.json', 'utf-8'));
const gouvernementObject = JSON.parse(readFileSync('data/gouvernement.json', 'utf-8'));
const batimentObject = JSON.parse(readFileSync('data/batiment.json', 'utf-8'));
const regionObject = JSON.parse(readFileSync('data/region.json', 'utf-8'));

module.exports = {
    data: new SlashCommandBuilder()
        .setName('population')
        .setDescription(`Menu de votre population`),

    async execute(interaction) {
        const { connection } = require('../../index.js');

        const sql = `
            SELECT * FROM armee WHERE id_joueur='${interaction.member.id}';
            SELECT * FROM batiments WHERE id_joueur='${interaction.member.id}';
            SELECT * FROM pays WHERE id_joueur='${interaction.member.id}';
            SELECT * FROM population WHERE id_joueur='${interaction.member.id}';
            SELECT * FROM ressources WHERE id_joueur='${interaction.member.id}';
            SELECT * FROM territoire WHERE id_joueur='${interaction.member.id}'
        `;
        connection.query(sql, async(err, results) => {if (err) {throw err;}
            const Armee = results[0][0];
            const Batiment = results[1][0];
            const Pays = results[2][0];
            const Population = results[3][0];
            const Ressources = results[4][0];
            const Territoire = results[5][0];

            if (!results[0][0]) {
                const reponse = codeBlock('ansi', `\u001b[0;0m\u001b[1;31mCette personne ne joue pas.`);
                await interaction.reply({content: reponse, ephemeral: true});
            } else {
                let Logement;
                const logement = Batiment.quartier * 1500
                if (logement / Population.habitant > 1.1) {
                    Logement = codeBlock('md', `> • ${Population.habitant.toLocaleString('en-US')}/${logement.toLocaleString('en-US')} logements\n`);
                } else if (logement / Population.habitant >= 1) {
                    Logement = codeBlock('ansi', `\u001b[0;0m\u001b[1;33m> • ${Population.habitant.toLocaleString('en-US')}/${logement.toLocaleString('en-US')} logements\n`);
                } else {
                    const quartier = Math.ceil((Population.habitant - logement)/1500);
                    Logement = codeBlock('ansi', `\u001b[0;0m\u001b[1;31m> • ${Population.habitant.toLocaleString('en-US')}/${logement.toLocaleString('en-US')} logements | ${quartier} quartiers manquants\n`);
                }

                //region Calcul du nombre d'employé
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
                let chomage;
                const hommeArmee =
                    Armee.unite * eval(`armeeObject.${Armee.strategie}.aviation`) * eval(`armeeObject.aviation.homme`) +
                    Armee.unite * eval(`armeeObject.${Armee.strategie}.infanterie`) * eval(`armeeObject.infanterie.homme`) +
                    Armee.unite * eval(`armeeObject.${Armee.strategie}.mecanise`) * eval(`armeeObject.mecanise.homme`) +
                    Armee.unite * eval(`armeeObject.${Armee.strategie}.support`) * eval(`armeeObject.support.homme`) +
                    (Armee.aviation * armeeObject.aviation.homme) +
                    (Armee.infanterie * armeeObject.infanterie.homme) +
                    (Armee.mecanise * armeeObject.mecanise.homme) +
                    (Armee.support * armeeObject.support.homme);
                if (emploies_total/(Population.jeune + Population.adulte - hommeArmee) > 1) {
                    chomage = 0
                } else {
                    chomage = (((Population.jeune + Population.adulte - hommeArmee)-emploies_total)/(Population.jeune + Population.adulte - hommeArmee)*100).toFixed(2)
                }
                const Chomage = `• ${emploies_total.toLocaleString('en-US')} emplois (${chomage}% chômage)\n`;
                let emplois = (Population.jeune + Population.adulte - hommeArmee)/emploies_total
                if ((Population.jeune + Population.adulte - hommeArmee)/emploies_total > 1) {
                    emplois = 1
                }
                //endregion
                let Prod;
                let Conso;
                let Diff;
                const coef_eau = eval(`regionObject.${Territoire.region}.eau`)
                const coef_nourriture = eval(`regionObject.${Territoire.region}.nourriture`)

                let Bc;
                Prod = Math.round(batimentObject.usine_civile.PROD_USINE_CIVILE * Batiment.usine_civile * eval(`gouvernementObject.${Pays.ideologie}.production`) * emplois * 48)
                Conso =  Math.round((1 + Population.bc_acces * 0.04 + Population.bonheur * 0.016 + (Population.habitant / 10000000) * 0.04) * Population.habitant * eval(`gouvernementObject.${Pays.ideologie}.conso_bc`))
                Diff = Prod - Conso;
                if (Prod / Conso > 1.1) {
                    Bc = codeBlock('md', `> ${Conso.toLocaleString('en-US')}/${Prod.toLocaleString('en-US')} 💻 | 📦 ${Ressources.bc.toLocaleString('en-US')} | 🟩 ∞`);
                } else if (Prod / Conso >= 1) {
                    Bc = codeBlock('ansi', `\u001b[0;0m\u001b[1;33m> ${Conso.toLocaleString('en-US')}/${Prod.toLocaleString('en-US')} 💻 | 📦 ${Ressources.bc.toLocaleString('en-US')} | 🟨 ∞`);
                } else {
                    Bc = codeBlock('ansi', `\u001b[0;0m\u001b[1;31m> ${Conso.toLocaleString('en-US')}/${Prod.toLocaleString('en-US')} 💻 | 📦 ${Ressources.bc.toLocaleString('en-US')} | 🟥⌛ ${Math.floor(- Ressources.bc / Diff)}`);
                }

                let Eau;
                Prod = Math.round(batimentObject.station_pompage.PROD_STATION_POMPAGE * Batiment.station_pompage * eval(`gouvernementObject.${Pays.ideologie}.production`) * coef_eau * emplois * 48);
                Conso = Math.round((Population.habitant * populationObject.EAU_CONSO));
                Diff = Prod - Conso;
                if (Prod / Conso > 1.1) {
                    Eau = codeBlock('md', `> ${Conso.toLocaleString('en-US')}/${Prod.toLocaleString('en-US')} 💧 | 📦 ${Ressources.eau.toLocaleString('en-US')} | 🟩 ∞`);
                } else if (Prod / Conso >= 1) {
                    Eau = codeBlock('ansi', `\u001b[0;0m\u001b[1;33m> ${Conso.toLocaleString('en-US')}/${Prod.toLocaleString('en-US')} 💧 | 📦 ${Ressources.eau.toLocaleString('en-US')} | 🟨 ∞`);
                } else {
                    Eau = codeBlock('ansi', `\u001b[0;0m\u001b[1;31m> ${Conso.toLocaleString('en-US')}/${Prod.toLocaleString('en-US')} 💧 | 📦 ${Ressources.eau.toLocaleString('en-US')} | 🟥⌛ ${Math.floor(- Ressources.eau / Diff)}`);
                }

                let Nourriture;
                Prod = Math.round(batimentObject.champ.PROD_CHAMP * Batiment.champ * eval(`gouvernementObject.${Pays.ideologie}.production`) * coef_nourriture * emplois * 48);
                Conso = Math.round((Population.habitant * populationObject.NOURRITURE_CONSO));
                Diff = Prod - Conso;
                if (Prod / Conso > 1.1) {
                    Nourriture = codeBlock('md', `> ${Conso.toLocaleString('en-US')}/${Prod.toLocaleString('en-US')} 🌽 | 📦 ${Ressources.nourriture.toLocaleString('en-US')} | 🟩 ∞`);
                } else if (Prod / Conso >= 1) {
                    Nourriture = codeBlock('ansi', `\u001b[0;0m\u001b[1;33m> ${Conso.toLocaleString('en-US')}/${Prod.toLocaleString('en-US')} 🌽 | 📦 ${Ressources.nourriture.toLocaleString('en-US')} | 🟨 ∞`);
                } else {
                    Nourriture = codeBlock('ansi', `\u001b[0;0m\u001b[1;31m> ${Conso.toLocaleString('en-US')}/${Prod.toLocaleString('en-US')} 🌽 | 📦 ${Ressources.nourriture.toLocaleString('en-US')} | 🟥⌛ ${Math.floor(- Ressources.nourriture / Diff)}`);
                }

                const embed = {
                    author: {
                        name: `${Pays.rang} de ${Pays.nom}`,
                        icon_url: interaction.member.displayAvatarURL()
                    },
                    thumbnail: {
                        url: Pays.drapeau
                    },
                    title: `\`Vue globale de la population\``,
                    fields: [
                        {
                            name: `> 👪 Population`,
                            value: codeBlock(
                                    `• ${Population.habitant.toLocaleString('en-US')} habitants\n` +
                                    Chomage +
                                    `• ${Population.bonheur}% bonheur\n`) +
                                Logement + `\u200B`
                        },
                        {
                            name: `> 🛒 Consommation/Approvisionnement`,
                            value:
                                Bc +
                                Eau +
                                Nourriture +
                                `\u200B`
                        },
                        {
                            name: `> 🧎 Répartion`,
                            value: codeBlock(
                                `• ${Population.enfant.toLocaleString('en-US')} enfants\n` +
                                `• ${Population.jeune.toLocaleString('en-US')} jeunes\n` +
                                `• ${Population.adulte.toLocaleString('en-US')} adultes\n` +
                                `• ${Population.vieux.toLocaleString('en-US')} personnes âgées\n`) + `\u200B`
                        },
                        {
                            name: `> 🏘️ Batiments`,
                            value: codeBlock(
                                `• ${Batiment.quartier.toLocaleString('en-US')} quartiers`) + `\u200B`
                        }
                    ],
                    color: interaction.member.displayColor,
                    timestamp: new Date(),
                    footer: {
                        text: `${Pays.devise}`
                    },
                };

                await interaction.reply({embeds: [embed]});
            }
        });
    },
};