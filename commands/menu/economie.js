const { ActionRowBuilder, StringSelectMenuBuilder, SlashCommandBuilder, codeBlock} = require("discord.js");
const {readFileSync} = require("fs");
const batimentObject = JSON.parse(readFileSync('data/batiment.json', 'utf-8'));

module.exports = {
    data: new SlashCommandBuilder()
        .setName('economie')
        .setDescription(`Consultez votre économie`),

    async execute(interaction) {
        const { connection } = require('../../index.js');

        const sql = `
                SELECT * FROM batiments WHERE id_joueur='${interaction.member.id}';
                SELECT * FROM pays WHERE id_joueur='${interaction.member.id}';
                SELECT * FROM population WHERE id_joueur='${interaction.member.id}'
            `;
            connection.query(sql, async(err, results) => {if (err) {throw err;}
                const Batiment = results[0][0];
                const Pays = results[1][0];
                const Population = results[2][0];

                if (!results[0][0]) {
                    const reponse = codeBlock('diff', `- Cette personne ne joue pas.`);
                    await interaction.reply({ content: reponse, ephemeral: true });
                } else {
                    const Argent = codeBlock('ansi', `\u001b[0;0m\u001b[1;33m> -0 | +0 | :0 | ${Pays.cash.toLocaleString('en-US')} $`);

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
                    let emploi = (Population.habitant/emploies_total*100).toFixed(2)
                    if (Population.habitant/emploies_total > 1) {
                        emploi = 100
                    }
                    if (emploi >= 90) {
                        Emploi = codeBlock('md', `> • ${Population.habitant.toLocaleString('en-US')}/${emploies_total.toLocaleString('en-US')} emplois (${emploi}%)`);
                    } else if (emploi >= 50) {
                        Emploi = codeBlock('ansi', `\u001b[0;0m\u001b[1;33m> • ${Population.habitant.toLocaleString('en-US')}/${emploies_total.toLocaleString('en-US')} emplois (${emploi}%)`);
                    } else {
                        Emploi = codeBlock('ansi', `\u001b[0;0m\u001b[1;31m> • ${Population.habitant.toLocaleString('en-US')}/${emploies_total.toLocaleString('en-US')} emplois (${emploi}%)`);
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
                            text: `${Pays.devise}`
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
                                    }
                                ]),
                        );

                    await interaction.reply({ embeds: [embed], components: [row] });
                }
            });
    },
};