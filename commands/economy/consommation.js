const { readFileSync } = require('fs');
const {ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder, codeBlock} = require("discord.js");
const batimentObject = JSON.parse(readFileSync('data/batiment.json', 'utf-8'));
const gouvernementObject = JSON.parse(readFileSync('data/gouvernement.json', 'utf-8'));
const populationObject = JSON.parse(readFileSync('data/population.json', 'utf-8'));
const regionObject = JSON.parse(readFileSync('data/region.json', 'utf-8'));
const ressourceObject = JSON.parse(readFileSync('data/ressource.json', 'utf-8'));

module.exports = {
    data: new SlashCommandBuilder()
        .setName('consommation')
        .setDescription(`Affiche votre consommation de ressource`),

    async execute(interaction) {
        const { connection } = require('../../index.js');

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
            let emplois = Population.habitant/emploies_total
            if (Population.habitant/emploies_total > 1) {
                emplois = 1
            }
            //endregion

            let Prod;
            let Conso;
            let Diff;

            //region Calcul des coefficients de production des ressources
            let T_bois = (Territoire.foret + Territoire.taiga + Territoire.rocheuses + Territoire.mangrove + Territoire.jungle);
            if (T_bois === 0) {
                T_bois = 1;
            }
            let T_eau = (Territoire.foret + Territoire.prairie + Territoire.toundra + Territoire.taiga + Territoire.savane + Territoire.rocheuses + Territoire.mangrove + Territoire.steppe + Territoire.jungle + Territoire.lac);
            if (T_eau === 0) {
                T_eau = 1;
            }
            let T_nourriture = (Territoire.prairie + Territoire.desert + Territoire.savane + Territoire.steppe + Territoire.jungle)
            if (T_nourriture === 0) {
                T_nourriture = 1;
            }
            const coef_bois = parseFloat(((Territoire.foret/T_bois) * ressourceObject.bois.foret + (Territoire.taiga/T_bois) * ressourceObject.bois.taiga + (Territoire.rocheuses/T_bois) * ressourceObject.bois.rocheuses + (Territoire.mangrove/T_bois) * ressourceObject.bois.mangrove + (Territoire.jungle/T_bois) * ressourceObject.bois.jungle).toFixed(2))
            const coef_charbon = eval(`regionObject.${Territoire.region}.charbon`)
            const coef_eau = parseFloat(((Territoire.foret/T_eau) * ressourceObject.eau.foret + (Territoire.prairie/T_eau) * ressourceObject.eau.prairie + (Territoire.toundra/T_eau) * ressourceObject.eau.toundra + (Territoire.taiga/T_eau) * ressourceObject.eau.taiga + (Territoire.savane/T_eau) * ressourceObject.eau.savane + (Territoire.rocheuses/T_eau) * ressourceObject.eau.rocheuses + (Territoire.mangrove/T_eau) * ressourceObject.eau.mangrove + (Territoire.steppe/T_eau) * ressourceObject.eau.steppe  + (Territoire.jungle/T_eau) * ressourceObject.eau.jungle  + (Territoire.lac/T_eau) * ressourceObject.eau.lac).toFixed(2))
            const coef_metaux = eval(`regionObject.${Territoire.region}.metaux`)
            const coef_nourriture = parseFloat(((Territoire.prairie/T_nourriture) * ressourceObject.nourriture.prairie + (Territoire.savane/T_nourriture) * ressourceObject.nourriture.savane + (Territoire.mangrove/T_nourriture) * ressourceObject.nourriture.mangrove + (Territoire.steppe/T_nourriture) * ressourceObject.nourriture.steppe + (Territoire.jungle/T_nourriture) * ressourceObject.nourriture.jungle).toFixed(2))
            const coef_petrole = eval(`regionObject.${Territoire.region}.petrole`)
            const coef_sable = eval(`regionObject.${Territoire.region}.sable`)
            //endregion

            let Bois;
            Prod = Math.round(batimentObject.scierie.PROD_SCIERIE * Batiment.scierie * eval(`gouvernementObject.${Pays.ideologie}.production`) * coef_bois * emplois);
            const conso_T_centrale_biomasse_bois = batimentObject.centrale_biomasse.CONSO_CENTRALE_BIOMASSE_BOIS * Batiment.centrale_biomasse
            const conso_T_usine_civile_bois = Math.round(batimentObject.usine_civile.CONSO_USINE_CIVILE_BOIS * Batiment.usine_civile * eval(`gouvernementObject.${Pays.ideologie}.consommation`) * emplois);
            Conso = conso_T_usine_civile_bois + conso_T_centrale_biomasse_bois;
            Diff = Prod - Conso;
            if (Diff / Prod > 0.1) {
                Bois = codeBlock('md', `> -${Conso.toLocaleString('en-US')} | +${Prod.toLocaleString('en-US')} | :${Diff.toLocaleString('en-US')}" | 📦 ${Ressources.bois.toLocaleString('en-US')}`);
            } else if (Diff / Prod >= 0) {
                Bois = codeBlock('ansi', `\u001b[0;0m\u001b[1;33m> -${Conso.toLocaleString('en-US')} | +${Prod.toLocaleString('en-US')} | :${Diff.toLocaleString('en-US')} | 📦 ${Ressources.bois.toLocaleString('en-US')}`);
            } else {
                Bois = codeBlock('ansi', `\u001b[0;0m\u001b[1;31m> -${Conso.toLocaleString('en-US')} | +${Prod.toLocaleString('en-US')} | :${Diff.toLocaleString('en-US')} | 📦 ${Ressources.bois.toLocaleString('en-US')}`);
            }

            let Charbon;
            Prod = Math.round(batimentObject.mine_charbon.PROD_MINE_CHARBON * Batiment.mine_charbon * eval(`gouvernementObject.${Pays.ideologie}.production`) * coef_charbon * emplois);
            const conso_T_acierie_charbon = Math.round(batimentObject.acierie.CONSO_ACIERIE_CHARBON * Batiment.acierie * eval(`gouvernementObject.${Pays.ideologie}.consommation`) * emplois);
            const conso_T_centrale_charbon_charbon = batimentObject.centrale_charbon.CONSO_CENTRALE_CHARBON_CHARBON * Batiment.centrale_charbon;
            Conso = conso_T_acierie_charbon + conso_T_centrale_charbon_charbon;
            Diff = Prod - Conso;
            if (Diff / Prod > 0.1) {
                Charbon = codeBlock('md', `> -${Conso.toLocaleString('en-US')} | +${Prod.toLocaleString('en-US')} | :${Diff.toLocaleString('en-US')}" | 📦 ${Ressources.charbon.toLocaleString('en-US')}`);
            } else if (Diff / Prod >= 0) {
                Charbon = codeBlock('ansi', `\u001b[0;0m\u001b[1;33m> -${Conso.toLocaleString('en-US')} | +${Prod.toLocaleString('en-US')} | :${Diff.toLocaleString('en-US')} | 📦 ${Ressources.charbon.toLocaleString('en-US')}`);
            } else {
                Charbon = codeBlock('ansi', `\u001b[0;0m\u001b[1;31m> -${Conso.toLocaleString('en-US')} | +${Prod.toLocaleString('en-US')} | :${Diff.toLocaleString('en-US')} | 📦 ${Ressources.charbon.toLocaleString('en-US')}`);
            }

            let Eau;
            Prod = Math.round(batimentObject.station_pompage.PROD_STATION_POMPAGE * Batiment.station_pompage * eval(`gouvernementObject.${Pays.ideologie}.production`) * coef_eau * emplois);
            const conso_T_atelier_verre_eau = Math.round(batimentObject.atelier_verre.CONSO_ATELIER_VERRE_EAU * Batiment.atelier_verre * eval(`gouvernementObject.${Pays.ideologie}.consommation`) * emplois);
            const conso_T_champ_eau = Math.round(batimentObject.champ.CONSO_CHAMP_EAU * Batiment.champ * eval(`gouvernementObject.${Pays.ideologie}.consommation`) * emplois);
            const conso_T_cimenterie_eau = Math.round(batimentObject.cimenterie.CONSO_CIMENTERIE_EAU * Batiment.cimenterie * eval(`gouvernementObject.${Pays.ideologie}.consommation`) * emplois);
            const conso_T_centrale_biomasse_eau = batimentObject.centrale_biomasse.CONSO_CENTRALE_BIOMASSE_EAU * Batiment.centrale_biomasse;
            const conso_T_centrale_charbon_eau = batimentObject.centrale_charbon.CONSO_CENTRALE_CHARBON_EAU * Batiment.centrale_charbon;
            const conso_T_centrale_fioul_eau = batimentObject.centrale_fioul.CONSO_CENTRALE_FIOUL_EAU * Batiment.centrale_fioul;
            const conso_pop = Math.round((Population.habitant * populationObject.EAU_CONSO) / 48 * eval(`gouvernementObject.${Pays.ideologie}.consommation`));
            Conso = conso_T_atelier_verre_eau + conso_T_champ_eau + conso_T_cimenterie_eau + conso_T_centrale_biomasse_eau + conso_T_centrale_charbon_eau + conso_T_centrale_fioul_eau + conso_pop;
            Diff = Prod - Conso;
            if (Diff / Prod > 0.1) {
                Eau = codeBlock('md', `> -${Conso.toLocaleString('en-US')} | +${Prod.toLocaleString('en-US')} | :${Diff.toLocaleString('en-US')}" | 📦 ${Ressources.eau.toLocaleString('en-US')}`);
            } else if (Diff / Prod >= 0) {
                Eau = codeBlock('ansi', `\u001b[0;0m\u001b[1;33m> -${Conso.toLocaleString('en-US')} | +${Prod.toLocaleString('en-US')} | :${Diff.toLocaleString('en-US')} | 📦 ${Ressources.eau.toLocaleString('en-US')}`);
            } else {
                Eau = codeBlock('ansi', `\u001b[0;0m\u001b[1;31m> -${Conso.toLocaleString('en-US')} | +${Prod.toLocaleString('en-US')} | :${Diff.toLocaleString('en-US')} | 📦 ${Ressources.eau.toLocaleString('en-US')}`);
            }

            let Metaux;
            Prod = Math.round(batimentObject.mine_metaux.PROD_MINE_METAUX * Batiment.mine_metaux * eval(`gouvernementObject.${Pays.ideologie}.production`) * coef_metaux * emplois);
            const conso_T_acierie_metaux = Math.round(batimentObject.acierie.CONSO_ACIERIE_METAUX * Batiment.acierie * eval(`gouvernementObject.${Pays.ideologie}.consommation`) * emplois);
            const conso_T_derrick_metaux = Math.round(batimentObject.derrick.CONSO_DERRICK_METAUX * Batiment.derrick * eval(`gouvernementObject.${Pays.ideologie}.consommation`) * emplois);
            const conso_T_usine_civile_metaux = Math.round(batimentObject.usine_civile.CONSO_USINE_CIVILE_METAUX * Batiment.usine_civile * eval(`gouvernementObject.${Pays.ideologie}.consommation`) * emplois);
            Conso = conso_T_acierie_metaux + conso_T_derrick_metaux + conso_T_usine_civile_metaux;
            Diff = Prod - Conso;
            if (Diff / Prod > 0.1) {
                Metaux = codeBlock('md', `> -${Conso.toLocaleString('en-US')} | +${Prod.toLocaleString('en-US')} | :${Diff.toLocaleString('en-US')}" | 📦 ${Ressources.metaux.toLocaleString('en-US')}`);
            } else if (Diff / Prod >= 0) {
                Metaux = codeBlock('ansi', `\u001b[0;0m\u001b[1;33m> -${Conso.toLocaleString('en-US')} | +${Prod.toLocaleString('en-US')} | :${Diff.toLocaleString('en-US')} | 📦 ${Ressources.metaux.toLocaleString('en-US')}`);
            } else {
                Metaux = codeBlock('ansi', `\u001b[0;0m\u001b[1;31m> -${Conso.toLocaleString('en-US')} | +${Prod.toLocaleString('en-US')} | :${Diff.toLocaleString('en-US')} | 📦 ${Ressources.metaux.toLocaleString('en-US')}`);
            }

            let Nourriture;
            Prod = Math.round(batimentObject.champ.PROD_CHAMP * Batiment.champ * eval(`gouvernementObject.${Pays.ideologie}.production`) * coef_nourriture * emplois);
            Conso = Math.round((Population.habitant * populationObject.NOURRITURE_CONSO) / 48 * eval(`gouvernementObject.${Pays.ideologie}.consommation`));
            Diff = Prod - Conso;
            if (Diff / Prod > 0.1) {
                Nourriture = codeBlock('md', `> -${Conso.toLocaleString('en-US')} | +${Prod.toLocaleString('en-US')} | :${Diff.toLocaleString('en-US')}" | 📦 ${Ressources.nourriture.toLocaleString('en-US')}`);
            } else if (Diff / Prod >= 0) {
                Nourriture = codeBlock('ansi', `\u001b[0;0m\u001b[1;33m> -${Conso.toLocaleString('en-US')} | +${Prod.toLocaleString('en-US')} | :${Diff.toLocaleString('en-US')} | 📦 ${Ressources.nourriture.toLocaleString('en-US')}`);
            } else {
                Nourriture = codeBlock('ansi', `\u001b[0;0m\u001b[1;31m> -${Conso.toLocaleString('en-US')} | +${Prod.toLocaleString('en-US')} | :${Diff.toLocaleString('en-US')} | 📦 ${Ressources.nourriture.toLocaleString('en-US')}`);
            }

            let Petrole;
            Prod = Math.round(batimentObject.derrick.PROD_DERRICK * Batiment.derrick * eval(`gouvernementObject.${Pays.ideologie}.production`) * coef_petrole * emplois);
            const conso_T_cimenterie_petrole = Math.round(batimentObject.cimenterie.CONSO_CIMENTERIE_PETROLE * Batiment.cimenterie * eval(`gouvernementObject.${Pays.ideologie}.consommation`) * emplois);
            const conso_T_raffinerie_petrole = Math.round(batimentObject.raffinerie.CONSO_RAFFINERIE_PETROLE * Batiment.raffinerie * eval(`gouvernementObject.${Pays.ideologie}.consommation`) * emplois);
            const conso_T_usine_civile_petrole = Math.round(batimentObject.usine_civile.CONSO_USINE_CIVILE_PETROLE * Batiment.usine_civile * eval(`gouvernementObject.${Pays.ideologie}.consommation`) * emplois);
            Conso = conso_T_cimenterie_petrole + conso_T_raffinerie_petrole + conso_T_usine_civile_petrole;
            Diff = Prod - Conso;
            if (Diff / Prod > 0.1) {
                Petrole = codeBlock('md', `> -${Conso.toLocaleString('en-US')} | +${Prod.toLocaleString('en-US')} | :${Diff.toLocaleString('en-US')}" | 📦 ${Ressources.petrole.toLocaleString('en-US')}`);
            } else if (Diff / Prod >= 0) {
                Petrole = codeBlock('ansi', `\u001b[0;0m\u001b[1;33m> -${Conso.toLocaleString('en-US')} | +${Prod.toLocaleString('en-US')} | :${Diff.toLocaleString('en-US')} | 📦 ${Ressources.petrole.toLocaleString('en-US')}`);
            } else {
                Petrole = codeBlock('ansi', `\u001b[0;0m\u001b[1;31m> -${Conso.toLocaleString('en-US')} | +${Prod.toLocaleString('en-US')} | :${Diff.toLocaleString('en-US')} | 📦 ${Ressources.petrole.toLocaleString('en-US')}`);
            }

            let Sable;
            Prod = Math.round(batimentObject.carriere_sable.PROD_CARRIERE_SABLE * Batiment.carriere_sable * eval(`gouvernementObject.${Pays.ideologie}.production`) * coef_sable * emplois);
            const conso_T_atelier_verre_sable = Math.round(batimentObject.atelier_verre.CONSO_ATELIER_VERRE_SABLE * Batiment.atelier_verre * eval(`gouvernementObject.${Pays.ideologie}.consommation`) * emplois);
            const conso_T_cimenterie_sable = Math.round(batimentObject.cimenterie.CONSO_CIMENTERIE_SABLE * Batiment.cimenterie * eval(`gouvernementObject.${Pays.ideologie}.consommation`) * emplois);
            Conso = conso_T_atelier_verre_sable + conso_T_cimenterie_sable;
            Diff = Prod - Conso;
            if (Diff / Prod > 0.1) {
                Sable = codeBlock('md', `> -${Conso.toLocaleString('en-US')} | +${Prod.toLocaleString('en-US')} | :${Diff.toLocaleString('en-US')}" | 📦 ${Ressources.sable.toLocaleString('en-US')}`);
            } else if (Diff / Prod >= 0) {
                Sable = codeBlock('ansi', `\u001b[0;0m\u001b[1;33m> -${Conso.toLocaleString('en-US')} | +${Prod.toLocaleString('en-US')} | :${Diff.toLocaleString('en-US')} | 📦 ${Ressources.sable.toLocaleString('en-US')}`);
            } else {
                Sable = codeBlock('ansi', `\u001b[0;0m\u001b[1;31m> -${Conso.toLocaleString('en-US')} | +${Prod.toLocaleString('en-US')} | :${Diff.toLocaleString('en-US')} | 📦 ${Ressources.sable.toLocaleString('en-US')}`);
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
                        name: `> 🪵 Bois : ⚙ x${coef_bois}`,
                        value: Bois,
                    },
                    {
                        name: `> <:charbon:1075776385517375638> Charbon : ⚙ x${coef_charbon}`,
                        value: Charbon,
                    },
                    {
                        name: `> 💧 Eau : ⚙ x${coef_eau}`,
                        value: Eau,
                    },
                    {
                        name: `> 🪨 Metaux : ⚙ x${coef_metaux}`,
                        value: Metaux,
                    },
                    {
                        name: `> 🌽 Nourriture : ⚙ x${coef_nourriture}`,
                        value: Nourriture,
                    },
                    {
                        name: `> 🛢️ Pétrole : ⚙ x${coef_petrole}`,
                        value: Petrole,
                    },
                    {
                        name: `> <:sable:1075776363782479873> Sable : ⚙ x${coef_sable}`,
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
                ).addComponents(
                    new ButtonBuilder()
                        .setLabel(`Ressources manufacturés`)
                        .setCustomId('ressource_manufacture')
                        .setEmoji('<:acier:1075776411329122304>')
                        .setStyle(ButtonStyle.Secondary)
                )
                .addComponents(
                    new ButtonBuilder()
                        .setLabel(`Produits manufacturés`)
                        .setCustomId('produit_manufacture')
                        .setEmoji('💻')
                        .setStyle(ButtonStyle.Secondary)
                )
                .addComponents(
                    new ButtonBuilder()
                        .setLabel(`Autre`)
                        .setCustomId('autre')
                        .setEmoji('⚡')
                        .setStyle(ButtonStyle.Secondary)
                )

            await interaction.reply({ embeds: [embed], components: [row] });
        });
    }
};
