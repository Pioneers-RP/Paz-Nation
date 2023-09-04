const { ActionRowBuilder, SlashCommandBuilder, StringSelectMenuBuilder, ButtonBuilder, ButtonStyle, codeBlock} = require('discord.js');
const { readFileSync } = require('fs');
const {connection} = require("../../index");
const armeeObject = JSON.parse(readFileSync('data/armee.json', 'utf-8'));
const batimentObject = JSON.parse(readFileSync('data/batiment.json', 'utf-8'));
const biomeObject = JSON.parse(readFileSync('data/biome.json', 'utf-8'));

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pays')
        .setDescription(`Statistiques de votre pays`),

    async execute(interaction) {
        const { connection } = require("../../index");

        let sql = `
            SELECT * FROM armee WHERE id_joueur='${interaction.member.id}';
            SELECT * FROM batiments WHERE id_joueur='${interaction.member.id}';
            SELECT * FROM diplomatie WHERE id_joueur='${interaction.member.id}';
            SELECT * FROM pays WHERE id_joueur='${interaction.member.id}';
            SELECT * FROM population WHERE id_joueur='${interaction.member.id}';
            SELECT * FROM territoire WHERE id_joueur='${interaction.member.id}'
        `;
        connection.query(sql, async(err, results) => {if (err) {throw err;}
            const Armee = results[0][0];
            const Batiment = results[1][0];
            const Diplomatie = results[2][0];
            const Pays = results[3][0];
            const Population = results[4][0];
            const Territoire = results[5][0];

            if (!results[0][0]) {
                const reponse = codeBlock('ansi', `\u001b[0;0m\u001b[1;31mVous ne jouez actuellement pas. Commencez dès maintenant en allant dans #commencer`);
                const bouton1 = new ButtonBuilder()
                            .setLabel(`Débuter sur Paz Nation`)
                            .setEmoji(`🔌`)
                            .setURL('https://discord.com/channels/826427184305537054/983316109367345152/1058766018123673680')
                            .setStyle(ButtonStyle.Link)
                const row = new ActionRowBuilder()
                    .addComponents(bouton1)
                await interaction.reply({ content: reponse, components: [row], ephemeral: true });
            } else {
                const region = eval(`biomeObject.${Territoire.region}.nom`);

                //region Calcul du nombre d'employés
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
                    chomage = ((((Population.jeune + Population.adulte - hommeArmee)-emploies_total)/(Population.jeune + Population.adulte - hommeArmee))*100).toFixed(2)
                }
                //endregion
                let embed = {
                    author: {
                        name: `${Pays.rang} de ${Pays.nom}`,
                        icon_url: interaction.member.displayAvatarURL()
                    },
                    thumbnail: {
                        url: Pays.drapeau
                    },
                    title: `\`Vue globale du pays\``,
                    fields: [
                        {
                            name: `> <:PAZ:1108440620101546105> Argent :`,
                            value: codeBlock(`• ${Pays.cash.toLocaleString('en-US')} PAZ`) + `\u200B`
                        },
                        {
                            name: `> 👪 Population :`,
                            value: codeBlock(
                                `• ${Population.habitant.toLocaleString('en-US')} habitants\n` +
                                `• ${chomage.toLocaleString('en-US')}% de chômage`) + `\u200B`
                        },
                        {
                            name: `> 🌄 Territoire :`,
                            value: codeBlock(
                                `• ${region}\n` +
                                `• ${Territoire.T_total.toLocaleString('en-US')} km² total\n` +
                                `• ${Territoire.T_libre.toLocaleString('en-US')} km² libre\n` +
                                `• ${Territoire.hexagone.toLocaleString('en-US')} cases\n` +
                                `• ${(Territoire.cg * 1000).toLocaleString('en-US')} km² de capacité de gouvernance\n`) + `\u200B`
                        },
                        {
                            name: `> 🏦 Diplomatie :`,
                            value: codeBlock(
                                `• ${Diplomatie.influence} influence\n`) + `\u200B`
                        },
                    ],
                    color: interaction.member.displayColor,
                    timestamp: new Date(),
                    footer: {
                        text: `${Pays.devise}`
                    },
                };

                const options = [
                    {
                        label: `Diplomatie`,
                        emoji: `🏦`,
                        description: `Menu de la diplomatie`,
                        value: 'diplomatie',
                    },
                    {
                        label: `Economie`,
                        emoji: `💵`,
                        description: `Menu de l'économie`,
                        value: 'economie',
                    },
                    {
                        label: `Gouvernement`,
                        emoji: `🏛`,
                        description: `Menu du gouvernement`,
                        value: 'gouvernement',
                    },
                    {
                        label: `Industrie`,
                        emoji: `🏭`,
                        description: `Menu des industries`,
                        value: 'industrie',
                    },
                    {
                        label: `Population`,
                        emoji: `👪`,
                        description: `Menu de la population`,
                        value: 'population',
                    },
                    {
                        label: `Territoire`,
                        emoji: `🏞️`,
                        description: `Menu du territoire`,
                        value: 'territoire',
                    }
                ];
                if (Pays.rang !== 'Cité') {
                    options.unshift(
                        {
                            label: `Armée`,
                            emoji: `🪖`,
                            description: `Menu de l'armée`,
                            value: 'armee',
                        })
                }
                const row = new ActionRowBuilder()
                    .addComponents(
                        new StringSelectMenuBuilder()
                            .setCustomId('action-pays')
                            .setPlaceholder(`Afficher un autre menu`)
                            .addOptions(options),
                    );
                interaction.reply({ embeds: [embed], components: [row] });
            }
        });
    },
};