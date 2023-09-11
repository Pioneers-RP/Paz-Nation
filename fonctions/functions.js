const {codeBlock, ActionRowBuilder, StringSelectMenuBuilder} = require("discord.js");

function calculerEmploi(Armee, Batiment, Population, armeeObject, batimentObject) {
    const emplois_acierie = batimentObject.acierie.EMPLOYES_ACIERIE * Batiment.acierie;
    const emplois_atelier_verre = batimentObject.atelier_verre.EMPLOYES_ATELIER_VERRE * Batiment.atelier_verre;
    const emplois_carriere_sable = batimentObject.carriere_sable.EMPLOYES_CARRIERE_SABLE * Batiment.carriere_sable;
    const emplois_centrale_biomasse = batimentObject.centrale_biomasse.EMPLOYES_CENTRALE_BIOMASSE * Batiment.centrale_biomasse;
    const emplois_centrale_charbon = batimentObject.centrale_charbon.EMPLOYES_CENTRALE_CHARBON * Batiment.centrale_charbon;
    const emplois_centrale_fioul = batimentObject.centrale_fioul.EMPLOYES_CENTRALE_FIOUL * Batiment.centrale_fioul;
    const emplois_champ = batimentObject.champ.EMPLOYES_CHAMP * Batiment.champ;
    const emplois_cimenterie = batimentObject.cimenterie.EMPLOYES_CIMENTERIE * Batiment.cimenterie;
    const emplois_derrick = batimentObject.derrick.EMPLOYES_DERRICK * Batiment.derrick;
    const emplois_eolienne = batimentObject.eolienne.EMPLOYES_EOLIENNE * Batiment.eolienne;
    const emplois_mine_charbon = batimentObject.mine_charbon.EMPLOYES_MINE_CHARBON * Batiment.mine_charbon;
    const emplois_mine_metaux = batimentObject.mine_metaux.EMPLOYES_MINE_METAUX * Batiment.mine_metaux;
    const emplois_station_pompage = batimentObject.station_pompage.EMPLOYES_STATION_POMPAGE * Batiment.station_pompage;
    const emplois_raffinerie = batimentObject.raffinerie.EMPLOYES_RAFFINERIE * Batiment.raffinerie;
    const emplois_scierie = batimentObject.scierie.EMPLOYES_SCIERIE * Batiment.scierie;
    const emplois_usine_civile = batimentObject.usine_civile.EMPLOYES_USINE_CIVILE * Batiment.usine_civile;
    const emploisTotaux =
        emplois_acierie + emplois_atelier_verre + emplois_carriere_sable +
        emplois_centrale_biomasse + emplois_centrale_charbon + emplois_centrale_fioul +
        emplois_champ + emplois_cimenterie + emplois_derrick + emplois_eolienne +
        emplois_mine_charbon + emplois_mine_metaux + emplois_station_pompage +
        emplois_raffinerie + emplois_scierie + emplois_usine_civile

    return {
        emploisTotaux: emploisTotaux,
        emploies: Population.jeune + Population.adulte - calculerSoldat(Armee, armeeObject),
        efficacite: Math.min(((Population.jeune + Population.adulte - calculerSoldat(Armee, armeeObject))/emploisTotaux).toFixed(4), 1),
    };
}
function calculerSoldat(Armee, armeeObject) {
    return Armee.unite * eval(`armeeObject.${Armee.strategie}.aviation`) * eval(`armeeObject.aviation.homme`) +
        Armee.unite * eval(`armeeObject.${Armee.strategie}.infanterie`) * eval(`armeeObject.infanterie.homme`) +
        Armee.unite * eval(`armeeObject.${Armee.strategie}.mecanise`) * eval(`armeeObject.mecanise.homme`) +
        Armee.unite * eval(`armeeObject.${Armee.strategie}.support`) * eval(`armeeObject.support.homme`) +
        (Armee.aviation * armeeObject.aviation.homme) +
        (Armee.infanterie * armeeObject.infanterie.homme) +
        (Armee.mecanise * armeeObject.mecanise.homme) +
        (Armee.support * armeeObject.support.homme);
}

function menuEconomie(interaction, connection, armeeObject, batimentObject) {
    let sql = `
        SELECT *
        FROM armee
        WHERE id_joueur = '${interaction.member.id}';
        SELECT *
        FROM batiments
        WHERE id_joueur = '${interaction.member.id}';
        SELECT *
        FROM pays
        WHERE id_joueur = '${interaction.member.id}';
        SELECT *
        FROM population
        WHERE id_joueur = '${interaction.member.id}'
    `;
    connection.query(sql, async(err, results) => {if (err) {throw err;}
        const Armee = results[0][0];
        const Batiment = results[1][0];
        const Pays = results[2][0];
        const Population = results[3][0];

        if (!results[0][0]) {
            const reponse = codeBlock('ansi', `\u001b[0;0m\u001b[1;31mCette personne ne joue pas.`);
            await interaction.reply({ content: reponse, ephemeral: true });
        } else {
            const Argent = codeBlock('ansi', `\u001b[0;0m\u001b[1;33m> -0 | +0 | :0 | ${Pays.cash.toLocaleString('en-US')} $`);

            const emploies = calculerEmploi(Armee, Batiment, Population, armeeObject, batimentObject).emploies;
            const emploisTotaux = calculerEmploi(Armee, Batiment, Population, armeeObject, batimentObject).emploisTotaux;
            const efficacite = calculerEmploi(Armee, Batiment, Population, armeeObject, batimentObject).efficacite;

            let Emploi;
            if (efficacite >= 0.9) {
                Emploi = codeBlock('md', `> • ${emploies.toLocaleString('en-US')}/${emploisTotaux.toLocaleString('en-US')} emplois (${efficacite*100}% d'efficacité)`);
            } else if (efficacite >= 0.5) {
                Emploi = codeBlock('ansi', `\u001b[0;0m\u001b[1;33m> • ${emploies.toLocaleString('en-US')}/${emploisTotaux.toLocaleString('en-US')} emplois (${efficacite*100}% d'efficacité)`);
            } else {
                Emploi = codeBlock('ansi', `\u001b[0;0m\u001b[1;31m> • ${emploies.toLocaleString('en-US')}/${emploisTotaux.toLocaleString('en-US')} emplois (${efficacite*100}% d'efficacité)`);
            }

            const embed = {
                author: {
                    name: `${Pays.rang} de ${Pays.nom}`,
                    icon_url: interaction.member.displayAvatarURL()
                },
                thumbnail: {
                    url: Pays.drapeau
                },
                title: `\`Menu de l'économie\``,
                fields: [
                    {
                        name: `> <:PAZ:1108440620101546105> Argent :`,
                        value: Argent + `\u200B`
                    },
                    {
                        name: `> 👩‍🔧 Emplois :`,
                        value: Emploi + `\u200B`
                    },
                    {
                        name: `> 🏭 Nombre d'usine total :`,
                        value: codeBlock(`• ${Batiment.usine_total.toLocaleString('en-US')}`) + `\u200B`
                    },
                ],
                color: interaction.member.displayColor,
                timestamp: new Date(),
                footer: {
                    text: Pays.devise
                },
            };

            const row = new ActionRowBuilder()
                .addComponents(
                    new StringSelectMenuBuilder()
                        .setCustomId('action-economie')
                        .setPlaceholder(`Consommations`)
                        .addOptions([
                            {
                                label: `Consommations`,
                                emoji: `📦`,
                                description: `Voir vos flux de ressources`,
                                value: 'consommations',
                            },
                            {
                                label: `Emploi`,
                                emoji: `👩‍🔧`,
                                description: `Voir vos postes de travail`,
                                value: 'emploi',
                            },
                            {
                                label: `Industrie`,
                                emoji: `🏭`,
                                description: `Voir vos industries`,
                                value: 'industrie',
                            }
                        ]),
                );

            await interaction.reply({ embeds: [embed], components: [row] });
        }
    });
}

module.exports = {
    calculerEmploi,
    calculerSoldat,
    menuEconomie
}