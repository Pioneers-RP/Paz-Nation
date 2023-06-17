const { ActionRowBuilder, SlashCommandBuilder, StringSelectMenuBuilder, codeBlock} = require("discord.js");
const { readFileSync } = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('population')
        .setDescription(`Menu de votre population`),

    async execute(interaction) {
        const { connection } = require('../../index.js');

        const sql = `
                    SELECT * FROM batiments WHERE id_joueur='${interaction.member.id}';
                    SELECT * FROM pays WHERE id_joueur='${interaction.member.id}';
                    SELECT * FROM population WHERE id_joueur='${interaction.member.id}';
                    SELECT * FROM territoire WHERE id_joueur='${interaction.member.id}'
            `;
            connection.query(sql, async(err, results) => {if (err) {throw err;}
                const Batiment = results[0][0];
                const Pays = results[1][0];
                const Population = results[2][0];
                const Territoire = results[3][0];
                const populationObject = JSON.parse(readFileSync('data/population.json', 'utf-8'));
                const gouvernementObject = JSON.parse(readFileSync('data/gouvernement.json', 'utf-8'));
                const batimentObject = JSON.parse(readFileSync('data/batiment.json', 'utf-8'));

                let Logement;
                let Nourriture;
                let Eau;
                let Bc;

                if (!results[0][0]) {
                    const reponse = codeBlock('ansi', `\u001b[0;0m\u001b[1;31mCette personne ne joue pas.`);
                    await interaction.reply({content: reponse, ephemeral: true});
                } else {
                    const logement = Batiment.quartier * 1500
                    if (logement / Population.habitant > 1.1) {
                        Logement = codeBlock('md', `> • ${Population.habitant.toLocaleString('en-US')}/${logement.toLocaleString('en-US')} logements\n`);
                    } else if (logement / Population.habitant >= 1) {
                        Logement = codeBlock('ansi', `\u001b[0;0m\u001b[1;33m> • ${Population.habitant.toLocaleString('en-US')}/${logement.toLocaleString('en-US')} logements\n`);
                    } else {
                        Logement = codeBlock('ansi', `\u001b[0;0m\u001b[1;31m> • ${Population.habitant.toLocaleString('en-US')}/${logement.toLocaleString('en-US')} logements\n`);
                    }

                    const conso_nourriture = Math.round((Population.habitant * parseFloat(populationObject.NOURRITURE_CONSO)))
                    if (Population.nourriture_appro / conso_nourriture > 1.1) {
                        Nourriture = codeBlock('md', `> • ${conso_nourriture.toLocaleString('en-US')}/${Population.nourriture_appro.toLocaleString('en-US')} nourriture\n`);
                    } else if (Population.nourriture_appro / conso_nourriture >= 1) {
                        Nourriture = codeBlock('ansi', `\u001b[0;0m\u001b[1;33m> • ${conso_nourriture.toLocaleString('en-US')}/${Population.nourriture_appro.toLocaleString('en-US')} nourriture\n`);
                    } else {
                        Nourriture = codeBlock('ansi', `\u001b[0;0m\u001b[1;31m> • ${conso_nourriture.toLocaleString('en-US')}/${Population.nourriture_appro.toLocaleString('en-US')} nourriture\n`);
                    }

                    const conso_eau = Math.round((Population.habitant * parseFloat(populationObject.EAU_CONSO)))
                    if (Population.eau_appro / conso_eau > 1.1) {
                        Eau = codeBlock('md', `> • ${conso_eau.toLocaleString('en-US')}/${Population.eau_appro.toLocaleString('en-US')} eau\n`);
                    } else if (Population.eau_appro / conso_eau >= 1) {
                        Eau = codeBlock('ansi', `\u001b[0;0m\u001b[1;33m> • ${conso_eau.toLocaleString('en-US')}/${Population.eau_appro.toLocaleString('en-US')} eau\n`);
                    } else {
                        Eau = codeBlock('ansi', `\u001b[0;0m\u001b[1;31m> • ${conso_eau.toLocaleString('en-US')}/${Population.eau_appro.toLocaleString('en-US')} eau\n`);
                    }

                    const conso_bc =  Math.round((1 + Population.bc_acces * 0.04 + Population.bonheur * 0.016 + (Population.habitant / 10000000) * 0.04) * Population.habitant * eval(`gouvernementObject.${Pays.ideologie}.conso_bc`))
                    const prod_bc = Math.round(batimentObject.usine_civile.PROD_USINE_CIVILE * Batiment.usine_civile * eval(`gouvernementObject.${Pays.ideologie}.production`) * 48)
                    if (prod_bc / conso_bc > 1.1) {
                        Bc = codeBlock('md', `> • ${conso_bc.toLocaleString('en-US')}/${prod_bc.toLocaleString('en-US')} biens de consommation\n`);
                    } else if (prod_bc / conso_bc >= 1) {
                        Bc = codeBlock('ansi', `\u001b[0;0m\u001b[1;33m> • ${conso_bc.toLocaleString('en-US')}/${prod_bc.toLocaleString('en-US')} biens de consommation\n`);
                    } else {
                        Bc = codeBlock('ansi', `\u001b[0;0m\u001b[1;31m> • ${conso_bc.toLocaleString('en-US')}/${prod_bc.toLocaleString('en-US')} biens de consommation\n`);
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
                    if (Population.habitant/emploies_total < 1) {
                        chomage = 0
                    } else {
                        chomage = ((emploies_total/Population.habitant-1)*100).toFixed(2)
                    }
                    const Chomage = `• ${emploies_total.toLocaleString('en-US')} emplois (${chomage}% chômage)\n`;
                    //endregion

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
                                    Eau +
                                    Nourriture +
                                    Bc +
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

                    await interaction.reply({embeds: [embed], components: [row]});
                }
            });
    },
};