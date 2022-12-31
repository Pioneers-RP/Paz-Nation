const { SlashCommandBuilder, codeBlock } = require('@discordjs/builders');
const { readFileSync } = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('consommation')
        .setDescription(`Affiche votre consommation de ressource`),

    async execute(interaction) {
        const { connection } = require('../index.js');
        const ressourceObject = JSON.parse(readFileSync('data/ressource.json', 'utf-8'));
        const gouvernementObject = JSON.parse(readFileSync('data/gouvernement.json', 'utf-8'));
        const batimentObject = JSON.parse(readFileSync('data/batiment.json', 'utf-8'));

        const sql = `
            SELECT * FROM batiments WHERE id_joueur='${interaction.member.id}';
            SELECT * FROM pays WHERE id_joueur='${interaction.member.id}';
            SELECT * FROM population WHERE id_joueur='${interaction.member.id}';
            SELECT * FROM ressources WHERE id_joueur='${interaction.member.id}';
            SELECT * FROM territoire WHERE id_joueur='${interaction.member.id}';
        `;
        connection.query(sql, async(err, results) => {if (err) {throw err;}
            const Batiment = results[0][0];
            const Pays = results[1][0];
            const Population = results[2][0];
            const Ressources = results[3][0];
            const Territoire = results[4][0];

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

            let coef;
            let Petrole;
            let Nourriture;
            let Metaux;
            let Electricite;
            let Eau;
            let Brique;
            let Bois;
            let Bc;
            const Habitants = Population.enfant + Population.jeune + Population.adulte + Population.vieux;

            let Prod = Math.round(batimentObject.usine_civile.PROD_USINE_CIVILE * Batiment.usine_civile * eval(`gouvernementObject.${Pays.ideologie}.production`));
            let Conso = Math.round((1 + Population.bc_acces * 0.04 + Population.bonheur * 0.016 + (Habitants / 10000000) * 0.04) * Habitants / 48 * eval(`gouvernementObject.${Pays.ideologie}.conso_bc`));
            let Diff = Prod - Conso;
            if (Diff > 0) {
                Bc = codeBlock('ml', `"-${Conso.toLocaleString('en-US')} | +${Prod.toLocaleString('en-US')} | :${Diff.toLocaleString('en-US')}" | 📦 ${Ressources.bc.toLocaleString('en-US')}`);
            } else if (Diff === 0) {
                Bc = codeBlock('fix', `-${Conso.toLocaleString('en-US')} | +${Prod.toLocaleString('en-US')} | :${Diff.toLocaleString('en-US')} | 📦 ${Ressources.bc.toLocaleString('en-US')}`);
            } else {
                Bc = codeBlock('diff', `-${Conso.toLocaleString('en-US')} | +${Prod.toLocaleString('en-US')} | :${Diff.toLocaleString('en-US')} | 📦 ${Ressources.bc.toLocaleString('en-US')}`);
            }

            coef = parseFloat((pourVille * ressourceObject.bois.ville + pourForet * ressourceObject.bois.foret + pourPrairie * ressourceObject.bois.prairie + pourDesert * ressourceObject.bois.desert + pourToundra * ressourceObject.bois.toundra + pourTaiga * ressourceObject.bois.taiga + pourSavane * ressourceObject.bois.savane + pourRocheuses * ressourceObject.bois.rocheuses + pourVolcan * ressourceObject.bois.volcan + pourMangrove * ressourceObject.bois.mangrove + pourSteppe * ressourceObject.bois.steppe).toFixed(2))
            Prod = Math.round(batimentObject.scierie.PROD_SCIERIE * Batiment.scierie * eval(`gouvernementObject.${Pays.ideologie}.production`) * coef);
            Conso = Math.round((batimentObject.briqueterie.CONSO_BRIQUETERIE_BOIS * Batiment.briqueterie + batimentObject.mine.CONSO_MINE_BOIS * Batiment.mine + batimentObject.usine_civile.CONSO_USINE_CIVILE_BOIS * Batiment.usine_civile) * eval(`gouvernementObject.${Pays.ideologie}.consommation`));
            Diff = Prod - Conso;
            if (Diff > 0) {
                Bois = codeBlock('ml', `"-${Conso.toLocaleString('en-US')} | +${Prod.toLocaleString('en-US')} | :${Diff.toLocaleString('en-US')}" | 📦 ${Ressources.bois.toLocaleString('en-US')}`);
            } else if (Diff === 0) {
                Bois = codeBlock('fix', `-${Conso.toLocaleString('en-US')} | +${Prod.toLocaleString('en-US')} | :${Diff.toLocaleString('en-US')} | 📦 ${Ressources.bois.toLocaleString('en-US')}`);
            } else {
                Bois = codeBlock('diff', `-${Conso.toLocaleString('en-US')} | +${Prod.toLocaleString('en-US')} | :${Diff.toLocaleString('en-US')} | 📦 ${Ressources.bois.toLocaleString('en-US')}`);
            }

            coef = parseFloat((pourVille * ressourceObject.brique.ville + pourForet * ressourceObject.brique.foret + pourPrairie * ressourceObject.brique.prairie + pourDesert * ressourceObject.brique.desert + pourToundra * ressourceObject.brique.toundra + pourTaiga * ressourceObject.brique.taiga + pourSavane * ressourceObject.brique.savane + pourRocheuses * ressourceObject.brique.rocheuses + pourVolcan * ressourceObject.brique.volcan + pourMangrove * ressourceObject.brique.mangrove + pourSteppe * ressourceObject.brique.steppe).toFixed(2))
            Prod = Math.round(batimentObject.briqueterie.PROD_BRIQUETERIE * Batiment.briqueterie * eval(`gouvernementObject.${Pays.ideologie}.production`) * coef);
            Conso = 0;
            Diff = Prod - Conso;
            if (Diff > 0) {
                Brique = codeBlock('ml', `"-${Conso.toLocaleString('en-US')} | +${Prod.toLocaleString('en-US')} | :${Diff.toLocaleString('en-US')}" | 📦 ${Ressources.brique.toLocaleString('en-US')}`);
            } else if (Diff === 0) {
                Brique = codeBlock('fix', `-${Conso.toLocaleString('en-US')} | +${Prod.toLocaleString('en-US')} | :${Diff.toLocaleString('en-US')} | 📦 ${Ressources.brique.toLocaleString('en-US')}`);
            } else {
                Brique = codeBlock('diff', `-${Conso.toLocaleString('en-US')} | +${Prod.toLocaleString('en-US')} | :${Diff.toLocaleString('en-US')} | 📦 ${Ressources.brique.toLocaleString('en-US')}`);
            }

            coef = parseFloat((pourVille * ressourceObject.eau.ville + pourForet * ressourceObject.eau.foret + pourPrairie * ressourceObject.eau.prairie + pourDesert * ressourceObject.eau.desert + pourToundra * ressourceObject.eau.toundra + pourTaiga * ressourceObject.eau.taiga + pourSavane * ressourceObject.eau.savane + pourRocheuses * ressourceObject.eau.rocheuses + pourVolcan * ressourceObject.eau.volcan + pourMangrove * ressourceObject.eau.mangrove + pourSteppe * ressourceObject.eau.steppe).toFixed(2))
            Prod = Math.round(batimentObject.pompe_a_eau.PROD_POMPE_A_EAU * Batiment.pompe_a_eau * eval(`gouvernementObject.${Pays.ideologie}.production`) * coef);
            Conso = Math.round((batimentObject.briqueterie.CONSO_BRIQUETERIE_EAU * Batiment.briqueterie + batimentObject.champ.CONSO_CHAMP_EAU * Batiment.champ + Population.eau_appro / 48) * eval(`gouvernementObject.${Pays.ideologie}.consommation`));
            Diff = Prod - Conso;
            if (Diff > 0) {
                Eau = codeBlock('ml', `"-${Conso.toLocaleString('en-US')} | +${Prod.toLocaleString('en-US')} | :${Diff.toLocaleString('en-US')}" | 📦 ${Ressources.eau.toLocaleString('en-US')}`);
            } else if (Diff === 0) {
                Eau = codeBlock('fix', `-${Conso.toLocaleString('en-US')} | +${Prod.toLocaleString('en-US')} | :${Diff.toLocaleString('en-US')} | 📦 ${Ressources.eau.toLocaleString('en-US')}`);
            } else {
                Eau = codeBlock('diff', `-${Conso.toLocaleString('en-US')} | +${Prod.toLocaleString('en-US')} | :${Diff.toLocaleString('en-US')} | 📦 ${Ressources.eau.toLocaleString('en-US')}`);
            }

            coef = parseFloat((pourVille * ressourceObject.electricite.ville + pourForet * ressourceObject.electricite.foret + pourPrairie * ressourceObject.electricite.prairie + pourDesert * ressourceObject.electricite.desert + pourToundra * ressourceObject.electricite.toundra + pourTaiga * ressourceObject.electricite.taiga + pourSavane * ressourceObject.electricite.savane + pourRocheuses * ressourceObject.electricite.rocheuses + pourVolcan * ressourceObject.electricite.volcan + pourMangrove * ressourceObject.electricite.mangrove + pourSteppe * ressourceObject.electricite.steppe).toFixed(2))
            Prod = Math.round(batimentObject.centrale_fioul.PROD_CENTRALE_FIOUL * Batiment.centrale_fioul + batimentObject.eolienne.PROD_EOLIENNE * Batiment.eolienne * coef);
            Conso = Math.round(batimentObject.briqueterie.CONSO_BRIQUETERIE_ELECTRICITE * Batiment.briqueterie + batimentObject.champ.CONSO_CHAMP_ELECTRICITE * Batiment.champ + batimentObject.mine.CONSO_MINE_ELECTRICITE * Batiment.mine + batimentObject.pompe_a_eau.CONSO_POMPE_A_EAU_ELECTRICITE * Batiment.pompe_a_eau + batimentObject.pumpjack.CONSO_PUMPJACK_ELECTRICITE * Batiment.pumpjack + batimentObject.quartier.CONSO_QUARTIER_ELECTRICITE * Batiment.quartier + batimentObject.scierie.CONSO_SCIERIE_ELECTRICITE * Batiment.scierie + batimentObject.usine_civile.CONSO_USINE_CIVILE_ELECTRICITE * Batiment.usine_civile);
            Diff = Prod - Conso;
            if (Diff > 0) {
                Electricite = codeBlock('ml', `"-${Conso.toLocaleString('en-US')} | +${Prod.toLocaleString('en-US')} | :${Diff.toLocaleString('en-US')}"`);
            } else if (Diff === 0) {
                Electricite = codeBlock('fix', `-${Conso.toLocaleString('en-US')} | +${Prod.toLocaleString('en-US')} | :${Diff.toLocaleString('en-US')}`);
            } else {
                Electricite = codeBlock('diff', `-${Conso.toLocaleString('en-US')} | +${Prod.toLocaleString('en-US')} | :${Diff.toLocaleString('en-US')}`);
            }

            coef = parseFloat((pourVille * ressourceObject.metaux.ville + pourForet * ressourceObject.metaux.foret + pourPrairie * ressourceObject.metaux.prairie + pourDesert * ressourceObject.metaux.desert + pourToundra * ressourceObject.metaux.toundra + pourTaiga * ressourceObject.metaux.taiga + pourSavane * ressourceObject.metaux.savane + pourRocheuses * ressourceObject.metaux.rocheuses + pourVolcan * ressourceObject.metaux.volcan + pourMangrove * ressourceObject.metaux.mangrove + pourSteppe * ressourceObject.metaux.steppe).toFixed(2))
            Prod = Math.round(batimentObject.mine.PROD_MINE * Batiment.mine * eval(`gouvernementObject.${Pays.ideologie}.production`) * coef);
            Conso = Math.round(batimentObject.usine_civile.CONSO_USINE_CIVILE_METAUX * Batiment.usine_civile * eval(`gouvernementObject.${Pays.ideologie}.consommation`));
            Diff = Prod - Conso;
            if (Diff > 0) {
                Metaux = codeBlock('ml', `"-${Conso.toLocaleString('en-US')} | +${Prod.toLocaleString('en-US')} | :${Diff.toLocaleString('en-US')}" | 📦 ${Ressources.metaux.toLocaleString('en-US')}`);
            } else if (Diff === 0) {
                Metaux = codeBlock('fix', `-${Conso.toLocaleString('en-US')} | +${Prod.toLocaleString('en-US')} | :${Diff.toLocaleString('en-US')} | 📦 ${Ressources.metaux.toLocaleString('en-US')}`);
            } else {
                Metaux = codeBlock('diff', `-${Conso.toLocaleString('en-US')} | +${Prod.toLocaleString('en-US')} | :${Diff.toLocaleString('en-US')} | 📦 ${Ressources.metaux.toLocaleString('en-US')}`);
            }

            coef = parseFloat((pourVille * ressourceObject.nourriture.ville + pourForet * ressourceObject.nourriture.foret + pourPrairie * ressourceObject.nourriture.prairie + pourDesert * ressourceObject.nourriture.desert + pourToundra * ressourceObject.nourriture.toundra + pourTaiga * ressourceObject.nourriture.taiga + pourSavane * ressourceObject.nourriture.savane + pourRocheuses * ressourceObject.nourriture.rocheuses + pourVolcan * ressourceObject.nourriture.volcan + pourMangrove * ressourceObject.nourriture.mangrove + pourSteppe * ressourceObject.nourriture.steppe).toFixed(2))
            Prod = Math.round(batimentObject.champ.PROD_CHAMP * Batiment.champ * eval(`gouvernementObject.${Pays.ideologie}.production`) * coef);
            Conso = Math.round((Population.nourriture_appro) / 48 * eval(`gouvernementObject.${Pays.ideologie}.consommation`));
            Diff = Prod - Conso;
            if (Diff > 0) {
                Nourriture = codeBlock('ml', `"-${Conso.toLocaleString('en-US')} | +${Prod.toLocaleString('en-US')} | :${Diff.toLocaleString('en-US')}" | 📦 ${Ressources.nourriture.toLocaleString('en-US')}`);
            } else if (Diff === 0) {
                Nourriture = codeBlock('fix', `-${Conso.toLocaleString('en-US')} | +${Prod.toLocaleString('en-US')} | :${Diff.toLocaleString('en-US')} | 📦 ${Ressources.nourriture.toLocaleString('en-US')}`);
            } else {
                Nourriture = codeBlock('diff', `-${Conso.toLocaleString('en-US')} | +${Prod.toLocaleString('en-US')} | :${Diff.toLocaleString('en-US')} | 📦 ${Ressources.nourriture.toLocaleString('en-US')}`);
            }

            coef = parseFloat((pourVille * ressourceObject.petrole.ville + pourForet * ressourceObject.petrole.foret + pourPrairie * ressourceObject.petrole.prairie + pourDesert * ressourceObject.petrole.desert + pourToundra * ressourceObject.petrole.toundra + pourTaiga * ressourceObject.petrole.taiga + pourSavane * ressourceObject.petrole.savane + pourRocheuses * ressourceObject.petrole.rocheuses + pourVolcan * ressourceObject.petrole.volcan + pourMangrove * ressourceObject.petrole.mangrove + pourSteppe * ressourceObject.petrole.steppe).toFixed(2))
            Prod = Math.round(batimentObject.pumpjack.PROD_PUMPJACK * Batiment.pumpjack * eval(`gouvernementObject.${Pays.ideologie}.production`) * coef);
            Conso = Math.round((batimentObject.centrale_fioul.CONSO_CENTRALE_FIOUL_PETROLE * Batiment.centrale_fioul + batimentObject.mine.CONSO_MINE_PETROLE * Batiment.mine + batimentObject.pompe_a_eau.CONSO_POMPE_A_EAU_PETROLE * Batiment.pompe_a_eau + batimentObject.scierie.CONSO_SCIERIE_PETROLE * Batiment.scierie + batimentObject.usine_civile.CONSO_USINE_CIVILE_PETROLE * Batiment.usine_civile) * eval(`gouvernementObject.${Pays.ideologie}.consommation`));
            Diff = Prod - Conso;
            if (Diff > 0) {
                Petrole = codeBlock('ml', `"-${Conso.toLocaleString('en-US')} | +${Prod.toLocaleString('en-US')} | :${Diff.toLocaleString('en-US')}" | 📦 ${Ressources.petrole.toLocaleString('en-US')}`);
            } else if (Diff === 0) {
                Petrole = codeBlock('fix', `-${Conso.toLocaleString('en-US')} | +${Prod.toLocaleString('en-US')} | :${Diff.toLocaleString('en-US')} | 📦 ${Ressources.petrole.toLocaleString('en-US')}`);
            } else {
                Petrole = codeBlock('diff', `-${Conso.toLocaleString('en-US')} | +${Prod.toLocaleString('en-US')} | :${Diff.toLocaleString('en-US')} | 📦 ${Ressources.petrole.toLocaleString('en-US')}`);
            }

            const embed = {
                author: {
                    name: `${Pays.rang} de ${Pays.nom}`,
                    icon_url: interaction.member.displayAvatarURL()
                },
                thumbnail: {
                    url: `${Pays.drapeau}`,
                },
                title: `\`Consommation en ressources\``,
                fields: [
                    {
                        name: `> 💻 Biens de consommation :`,
                        value: Bc,
                    },
                    {
                        name: `> 🪵 Bois :`,
                        value: Bois,
                    },
                    {
                        name: `> 🧱 Brique :`,
                        value: Brique,
                    },
                    {
                        name: `> 💧 Eau :`,
                        value: Eau,
                    },
                    {
                        name: `> ⚡ Electricité :`,
                        value: Electricite,
                    },
                    {
                        name: `> 🪨 Metaux :`,
                        value: Metaux,
                    },
                    {
                        name: `> 🌽 Nourriture :`,
                        value: Nourriture,
                    },
                    {
                        name: `> 🛢️ Pétrole :`,
                        value: Petrole,
                    }
                ],
                color: interaction.member.displayHexColor,
                timestamp: new Date(),
                footer: { text: Pays.devise }
            };

            await interaction.reply({ embeds: [embed] });
        });
    }
};
