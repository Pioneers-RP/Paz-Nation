const { codeBlock } = require('@discordjs/builders');
const { MessageActionRow, MessageButton, Modal, TextInputComponent } = require('discord.js');
const { connection } = require('../index.js');
const { globalBox } = require('global-box');
const box = globalBox();
const dotenv = require('dotenv');
const { readFileSync } = require('fs');
const Chance = require('chance');
const chance = new Chance();
const wait = require('node:timers/promises').setTimeout;

const { CommandCooldown, msToMinutes } = require('discord-command-cooldown');
const ms = require('ms');
const ideologieCommandCooldown = new CommandCooldown('ideologie', ms('7d'));

const batimentObject = JSON.parse(readFileSync('data/batiment.json', 'utf-8'));
const gouvernementObject = JSON.parse(readFileSync('data/gouvernement.json', 'utf-8'));
const populationObject = JSON.parse(readFileSync('data/population.json', 'utf-8'));
const regionObject = JSON.parse(readFileSync('data/region.json', 'utf-8'));

    
module.exports = {
    name: 'interactionCreate',
    execute: function (interaction) {
        let res;
        let espace2;
        let prix;
        let prix_u;
        let quantite;
        let ressource;
        let espace;
        let fields;
        let reponse;
        let id_joueur;
        let joueur_id;
        let sql;
        let log;

        //region Commande
        if (interaction.isCommand()) {

            log = {
                author: {
                    name: interaction.member.displayName,
                    icon_url: interaction.member.displayAvatarURL()
                },
                title: `\`Commande\``,
                description: `/${interaction.commandName} ${JSON.stringify(interaction.options.data)}`,
                timestamp: new Date(),
                footer: {
                    text: '#' + interaction.channel.name
                },
            };

            const salon_logs = interaction.client.channels.cache.get(process.env.SALON_LOGS);
            salon_logs.send({embeds: [log]});
            //endregion
            //region Bouton
        } else if (interaction.isButton()) {

            log = {
                author: {
                    name: interaction.member.displayName,
                    icon_url: interaction.member.displayAvatarURL()
                },
                title: `\`Bouton\``,
                description: `${interaction.customId}`,
                timestamp: new Date(),
                footer: {
                    text: '#' + interaction.channel.name
                },
            };

            const salon_logs = interaction.client.channels.cache.get(process.env.SALON_LOGS);
            salon_logs.send({embeds: [log]});

            if (interaction.customId.includes('réglement') === true) {
                //region Réglement
                let roleInvite = interaction.guild.roles.cache.find(r => r.name === "👤 » Invité");
                interaction.member.roles.add(roleInvite);
                interaction.deferUpdate()
                //endregion
            } else if (interaction.customId.includes('menu_économie') === true) {
                //region Economie

                joueur_id = interaction.customId.slice(14);
                const joueur = interaction.client.users.cache.find(user => user.id === joueur_id);

                function economie(joueur) {

                    const sql = `
                        SELECT * FROM batiments WHERE id_joueur='${joueur.id}';
                        SELECT * FROM pays WHERE id_joueur='${joueur.id}'`;
                    connection.query(sql, async (err, results) => {if (err) {throw err;}
                        const Batiments = results[0][0];
                        const Pays = results[1][0];

                        if (!results[0]) {
                            const reponse = codeBlock('ansi', `\u001b[0;0m\u001b[1;31mCette personne ne joue pas.`);
                            await interaction.reply({content: reponse, ephemeral: true});
                        } else {

                            const embed = {
                                author: {
                                    name: `${Pays.rang} de ${Pays.nom}`,
                                    icon_url: joueur.displayAvatarURL()
                                },
                                thumbnail: {
                                    url: Pays.drapeau
                                },
                                title: `\`Menu de l'économie\``,
                                fields: [{
                                    name: `> 💵 Argent :`,
                                    value: codeBlock(`• ${Pays.cash.toLocaleString('en-US')} $`) + `\u200B`
                                },
                                    {
                                        name: `> 🏭 Nombre d'usine total :`,
                                        value: codeBlock(`• ${Batiments.usine_total.toLocaleString('en-US')}`) + `\u200B`
                                    },
                                ],
                                color: joueur.displayHexColor,
                                timestamp: new Date(),
                                footer: {
                                    text: `${Pays.devise}`
                                },
                            };

                            await interaction.reply({embeds: [embed]});
                        }
                    });
                }
                economie(joueur);
                //endregion
            } else if (interaction.customId.includes('menu_population') === true) {
                //region Population

                joueur_id = interaction.customId.slice(16);
                const joueur = interaction.client.users.cache.find(user => user.id === joueur_id);

                function population(joueur) {

                    const sql = `
                        SELECT * FROM batiments WHERE id_joueur='${joueur.id}';
                        SELECT * FROM pays WHERE id_joueur='${joueur.id}';
                        SELECT * FROM population WHERE id_joueur='${joueur.id}';
                        SELECT * FROM territoire WHERE id_joueur='${joueur.id}'
                    `;
                    connection.query(sql, async (err, results) => {if (err) {throw err;}
                        const Batiment = results[0][0];
                        const Pays = results[1][0];
                        const Population = results[2][0];
                        const Territoire = results[3][0];

                        if (!results[0]) {
                            const reponse = codeBlock('ansi', `\u001b[0;0m\u001b[1;31mCette personne ne joue pas.`);
                            await interaction.reply({content: reponse, ephemeral: true});
                        } else {
                            const densite = (Population.habitant / Territoire.T_total).toFixed(0);

                            const embed = {
                                author: {
                                    name: `${Pays.rang} de ${Pays.nom}`,
                                    icon_url: joueur.displayAvatarURL()
                                },
                                thumbnail: {
                                    url: Pays.drapeau
                                },
                                title: `\`Vue globale de la population\``,
                                fields: [{
                                    name: `> 👪 Population`,
                                    value: codeBlock(
                                        `• ${Population.habitant.toLocaleString('en-US')} habitants\n` +
                                        `• ${Population.bonheur}% bonheur\n` +
                                        `• ${densite.toLocaleString('en-US')} habitants/km²`) + `\u200B`
                                },
                                    {
                                        name: `> 🛒 Consommation/Approvisionnement`,
                                        value: codeBlock(
                                            `• ${Math.round((Population.habitant * parseFloat(populationObject.EAU_CONSO))).toLocaleString('en-US')}/${Population.eau_appro.toLocaleString('en-US')} eau\n` +
                                            `• ${Math.round((Population.habitant * parseFloat(populationObject.NOURRITURE_CONSO))).toLocaleString('en-US')}/${Population.nourriture_appro.toLocaleString('en-US')} nourriture\n` +
                                            `• ${(1 + Population.bc_acces * 0.04 + Population.bonheur * 0.016 + (Population.habitant / 10000000) * 0.04).toFixed(1)}/${(batimentObject.usine_civile.PROD_USINE_CIVILE * Batiment.usine_civile * 48 / Population.habitant).toFixed(1)} biens de consommation`) + `\u200B`
                                    },
                                    {
                                        name: `> 🧎 Répartion`,
                                        value: codeBlock(
                                            `• ${Population.enfant.toLocaleString('en-US')} enfants\n` +
                                            `• ${Population.jeune.toLocaleString('en-US')} jeunes\n` +
                                            `• ${Population.adulte.toLocaleString('en-US')} adultes\n` +
                                            `• ${Population.vieux.toLocaleString('en-US')} vieux\n`) + `\u200B`
                                    },
                                    {
                                        name: `> 🏘️ Batiments`,
                                        value: codeBlock(
                                            `• ${Batiment.quartier.toLocaleString('en-US')} quartiers`) + `\u200B`
                                    }
                                ],
                                color: joueur.displayHexColor,
                                timestamp: new Date(),
                                footer: {
                                    text: `${Pays.devise}`
                                },
                            };

                            await interaction.reply({embeds: [embed]});
                        }
                    });
                }
                population(joueur);
                //endregion
            } else if (interaction.customId.includes('menu_gouvernement') === true) {
                //region Gouvernement

                joueur_id = interaction.customId.slice(18);
                const joueur = interaction.client.users.cache.find(user => user.id === joueur_id);

                function gouvernement(joueur) {
                    const sql = `SELECT * FROM pays WHERE id_joueur='${joueur.id}'`;
                    connection.query(sql, async (err, results) => {if (err) {throw err;}
                        const Pays = results[0];

                        if (!results[0]) {
                            const reponse = codeBlock('diff', `- Cette personne ne joue pas.`);
                            await interaction.reply({content: reponse, ephemeral: true});
                        } else {

                            const embed = {
                                author: {
                                    name: `${Pays.rang} de ${Pays.nom}`,
                                    icon_url: joueur.displayAvatarURL()
                                },
                                thumbnail: {
                                    url: Pays.drapeau
                                },
                                title: `\`Menu du gouvernement\``,
                                fields: [
                                    {
                                        name: `> 🪧 Nom de l'Etat : `,
                                        value: codeBlock(`• ${Pays.nom}`) + `\u200B`
                                    },
                                    {
                                        name: `> ®️ Rang : `,
                                        value: codeBlock(`• ${Pays.rang}`) + `\u200B`
                                    },
                                    {
                                        name: `> 🔱 Forme de gouvernement : `,
                                        value: codeBlock(`• ${Pays.regime}`) + `\u200B`
                                    },
                                    {
                                        name: `> 🧠 Idéologie : `,
                                        value: codeBlock(`• ${Pays.ideologie}`) + `\u200B`
                                    },
                                    {
                                        name: `> 📯 Devise : `,
                                        value: codeBlock(`• ${Pays.devise}`) + `\u200B`
                                    }
                                ],
                                color: joueur.displayHexColor,
                                timestamp: new Date(),
                                footer: {
                                    text: `${Pays.devise}`
                                },
                            };
                            await interaction.reply({embeds: [embed]});
                        }
                    });
                }
                gouvernement(joueur);
                //endregion
            } else if (interaction.customId.includes('construction') === true) {
                //region Construction

                id_joueur = interaction.customId.slice(13);
                if (id_joueur === interaction.member.id) {

                    sql = `
                        SELECT * FROM batiments WHERE id_joueur=${interaction.member.id};
                        SELECT * FROM pays WHERE id_joueur=${interaction.member.id}
                    `;
                    connection.query(sql, async (err, results) => {if (err) {throw err;}
                        const Batiment = results[0][0];
                        const Pays = results[1][0];
                        let embed;
                        let const_T_libre;
                        let const_bois;
                        let const_brique;
                        let const_metaux;
                        let sql;
                        let newbc;

                        let title = interaction.message.embeds[0].title;
                        title = title.substring(16, title.length - 1);
                        const espace = title.indexOf(" ");
                        const nombre = title.slice(0, espace);
                        const batiment = title.slice(espace + 1);

                        switch (batiment) {
                            //region Briqueterie
                            case 'Briqueterie':
                                const_T_libre = batimentObject.briqueterie.SURFACE_BRIQUETERIE * nombre;
                                const_bois = Math.round(batimentObject.briqueterie.CONST_BRIQUETERIE_BOIS * nombre * eval(`gouvernementObject.${Pays.ideologie}.construction`));
                                const_brique = Math.round(batimentObject.briqueterie.CONST_BRIQUETERIE_BRIQUE * nombre * eval(`gouvernementObject.${Pays.ideologie}.construction`));
                                const_metaux = Math.round(batimentObject.briqueterie.CONST_BRIQUETERIE_METAUX * nombre * eval(`gouvernementObject.${Pays.ideologie}.construction`));

                                sql = `
                                    UPDATE batiments SET briqueterie=briqueterie+${nombre}, usine_total=usine_total+${nombre} WHERE id_joueur='${interaction.member.id}';
                                    UPDATE territoire SET T_libre=T_libre-${const_T_libre}, T_occ=T_occ+${const_T_libre} WHERE id_joueur='${interaction.member.id}';
                                    UPDATE ressources SET bois=bois-${const_bois}, brique=brique-${const_brique}, metaux=metaux-${const_metaux} WHERE id_joueur='${interaction.member.id}'`;
                                connection.query(sql, async (err) => {if (err) {throw err;}})

                                newbc = Batiment.briqueterie + parseInt(nombre);

                                embed = {
                                    author: {
                                        name: `${Pays.rang} de ${Pays.nom}`,
                                        icon_url: interaction.member.displayAvatarURL()
                                    },
                                    thumbnail: {
                                        url: Pays.drapeau
                                    },
                                    title: `\`Construction : ${nombre.toLocaleString('en-US')} briqueteries\``,
                                    description: `> 🛠️ Vous avez désormais :\n` +
                                        codeBlock(`• ${newbc.toLocaleString('en-US')} briqueteries`) + `\u200B`,
                                    color: interaction.member.displayHexColor,
                                    timestamp: new Date(),
                                    footer: {
                                        text: `${Pays.devise}`
                                    },
                                };
                                break;
                            //endregion
                            //region Champ
                            case 'Champ':
                                const_T_libre = batimentObject.champ.SURFACE_CHAMP * nombre;
                                const_bois = Math.round(batimentObject.champ.CONST_CHAMP_BOIS * nombre * eval(`gouvernementObject.${Pays.ideologie}.construction`));
                                const_brique = Math.round(batimentObject.champ.CONST_CHAMP_BRIQUE * nombre * eval(`gouvernementObject.${Pays.ideologie}.construction`));
                                const_metaux = Math.round(batimentObject.champ.CONST_CHAMP_METAUX * nombre * eval(`gouvernementObject.${Pays.ideologie}.construction`));

                                sql = `
                                    UPDATE batiments SET champ=champ+${nombre}, usine_total=usine_total+${nombre} WHERE id_joueur='${interaction.member.id}';
                                    UPDATE territoire SET T_libre=T_libre-${const_T_libre}, T_occ=T_occ+${const_T_libre} WHERE id_joueur='${interaction.member.id}';
                                    UPDATE ressources SET bois=bois-${const_bois}, brique=brique-${const_brique}, metaux=metaux-${const_metaux} WHERE id_joueur='${interaction.member.id}'`;
                                connection.query(sql, async (err) => {if (err) {throw err;}})

                                newbc = Batiment.champ + parseInt(nombre);

                                embed = {
                                    author: {
                                        name: `${Pays.rang} de ${Pays.nom}`,
                                        icon_url: interaction.member.displayAvatarURL()
                                    },
                                    thumbnail: {
                                        url: Pays.drapeau
                                    },
                                    title: `\`Construction : ${nombre.toLocaleString('en-US')} champs\``,
                                    description: `> 🛠️ Vous avez désormais :\n` +
                                        codeBlock(`• ${newbc.toLocaleString('en-US')} champs`) + `\u200B`,
                                    color: interaction.member.displayHexColor,
                                    timestamp: new Date(),
                                    footer: {
                                        text: `${Pays.devise}`
                                    },
                                };
                                break;
                            //endregion
                            //region Centrale au fioul
                            case 'Centrale au fioul':
                                const_T_libre = batimentObject.centrale_fioul.SURFACE_CENTRALE_FIOUL * nombre;
                                const_bois = Math.round(batimentObject.centrale_fioul.CONST_CENTRALE_FIOUL_BOIS * nombre * eval(`gouvernementObject.${Pays.ideologie}.construction`));
                                const_brique = Math.round(batimentObject.centrale_fioul.CONST_CENTRALE_FIOUL_BRIQUE * nombre * eval(`gouvernementObject.${Pays.ideologie}.construction`));
                                const_metaux = Math.round(batimentObject.centrale_fioul.CONST_CENTRALE_FIOUL_METAUX * nombre * eval(`gouvernementObject.${Pays.ideologie}.construction`));

                                sql = `
                                    UPDATE batiments SET centrale_fioul=centrale_fioul+${nombre}, usine_total=usine_total+${nombre} WHERE id_joueur='${interaction.member.id}';
                                    UPDATE territoire SET T_libre=T_libre-${const_T_libre}, T_occ=T_occ+${const_T_libre} WHERE id_joueur='${interaction.member.id}';
                                    UPDATE ressources SET bois=bois-${const_bois}, brique=brique-${const_brique}, metaux=metaux-${const_metaux} WHERE id_joueur='${interaction.member.id}'`;
                                connection.query(sql, async (err) => {if (err) {throw err;}})

                                newbc = Batiment.centrale_fioul + parseInt(nombre);

                                embed = {
                                    author: {
                                        name: `${Pays.rang} de ${Pays.nom}`,
                                        icon_url: interaction.member.displayAvatarURL()
                                    },
                                    thumbnail: {
                                        url: Pays.drapeau
                                    },
                                    title: `\`Construction : ${nombre.toLocaleString('en-US')} centrales électrique\``,
                                    description: `> 🛠️ Vous avez désormais :\n` +
                                        codeBlock(`• ${newbc.toLocaleString('en-US')} centrales électriques`) + `\u200B`,
                                    color: interaction.member.displayHexColor,
                                    timestamp: new Date(),
                                    footer: {
                                        text: `${Pays.devise}`
                                    },
                                };
                                break;
                            //endregion
                            //region Eolienne
                            case 'Eolienne':
                                const_T_libre = batimentObject.eolienne.SURFACE_EOLIENNE * nombre;
                                const_metaux = Math.round(batimentObject.eolienne.CONST_EOLIENNE_METAUX * nombre * eval(`gouvernementObject.${Pays.ideologie}.construction`));

                                sql = `
                                    UPDATE batiments SET eolienne=eolienne+${nombre}, usine_total=usine_total+${nombre} WHERE id_joueur='${interaction.member.id}';
                                    UPDATE territoire SET T_libre=T_libre-${const_T_libre}, T_occ=T_occ+${const_T_libre} WHERE id_joueur='${interaction.member.id}';
                                    UPDATE ressources SET metaux=metaux-${const_metaux} WHERE id_joueur='${interaction.member.id}'`;

                                connection.query(sql, async (err) => {if (err) {throw err;}})

                                newbc = Batiment.eolienne + parseInt(nombre);

                                embed = {
                                    author: {
                                        name: `${Pays.rang} de ${Pays.nom}`,
                                        icon_url: interaction.member.displayAvatarURL()
                                    },
                                    thumbnail: {
                                        url: Pays.drapeau
                                    },
                                    title: `\`Construction : ${nombre.toLocaleString('en-US')} éoliennes\``,
                                    description: `> 🛠️ Vous avez désormais :\n` +
                                        codeBlock(`• ${newbc.toLocaleString('en-US')} éoliennes`) + `\u200B`,
                                    color: interaction.member.displayHexColor,
                                    timestamp: new Date(),
                                    footer: {
                                        text: `${Pays.devise}`
                                    },
                                };
                                break;
                            //endregion
                            //region Mine
                            case 'Mine':
                                const_T_libre = batimentObject.mine.SURFACE_MINE * nombre;
                                const_bois = Math.round(batimentObject.mine.CONST_MINE_BOIS * nombre * eval(`gouvernementObject.${Pays.ideologie}.construction`));
                                const_brique = Math.round(batimentObject.mine.CONST_MINE_BRIQUE * nombre * eval(`gouvernementObject.${Pays.ideologie}.construction`));
                                const_metaux = Math.round(batimentObject.mine.CONST_MINE_METAUX * nombre * eval(`gouvernementObject.${Pays.ideologie}.construction`));

                                sql = `
                                    UPDATE batiments SET mine=mine+${nombre}, usine_total=usine_total+${nombre} WHERE id_joueur='${interaction.member.id}';
                                    UPDATE territoire SET T_libre=T_libre-${const_T_libre}, T_occ=T_occ+${const_T_libre} WHERE id_joueur='${interaction.member.id}';
                                    UPDATE ressources SET bois=bois-${const_bois}, brique=brique-${const_brique}, metaux=metaux-${const_metaux} WHERE id_joueur='${interaction.member.id}'`;
                                connection.query(sql, async (err) => {if (err) {throw err;}})

                                newbc = Batiment.mine + parseInt(nombre);

                                embed = {
                                    author: {
                                        name: `${Pays.rang} de ${Pays.nom}`,
                                        icon_url: interaction.member.displayAvatarURL()
                                    },
                                    thumbnail: {
                                        url: Pays.drapeau
                                    },
                                    title: `\`Construction : ${nombre.toLocaleString('en-US')} mines\``,
                                    description: `> 🛠️ Vous avez désormais :\n` +
                                        codeBlock(`• ${newbc.toLocaleString('en-US')} mines`) + `\u200B`,
                                    color: interaction.member.displayHexColor,
                                    timestamp: new Date(),
                                    footer: {
                                        text: `${Pays.devise}`
                                    },
                                };
                                break;
                            //endregion
                            //region Pompe à eau
                            case 'Pompe à eau':
                                const_T_libre = batimentObject.pompe_a_eau.SURFACE_POMPE_A_EAU * nombre;
                                const_bois = Math.round(batimentObject.pompe_a_eau.CONST_POMPE_A_EAU_BOIS * nombre * eval(`gouvernementObject.${Pays.ideologie}.construction`));
                                const_brique = Math.round(batimentObject.pompe_a_eau.CONST_POMPE_A_EAU_BRIQUE * nombre * eval(`gouvernementObject.${Pays.ideologie}.construction`));
                                const_metaux = Math.round(batimentObject.pompe_a_eau.CONST_POMPE_A_EAU_METAUX * nombre * eval(`gouvernementObject.${Pays.ideologie}.construction`));

                                sql = `
                                    UPDATE batiments SET pompe_a_eau=pompe_a_eau+${nombre}, usine_total=usine_total+${nombre} WHERE id_joueur='${interaction.member.id}';
                                    UPDATE territoire SET T_libre=T_libre-${const_T_libre}, T_occ=T_occ+${const_T_libre} WHERE id_joueur='${interaction.member.id}';
                                    UPDATE ressources SET bois=bois-${const_bois}, brique=brique-${const_brique}, metaux=metaux-${const_metaux} WHERE id_joueur='${interaction.member.id}'`;
                                connection.query(sql, async (err) => {if (err) {throw err;}})

                                newbc = Batiment.pompe_a_eau + parseInt(nombre);

                                embed = {
                                    author: {
                                        name: `${Pays.rang} de ${Pays.nom}`,
                                        icon_url: interaction.member.displayAvatarURL()
                                    },
                                    thumbnail: {
                                        url: Pays.drapeau
                                    },
                                    title: `\`Construction : ${nombre.toLocaleString('en-US')} pompes à eau\``,
                                    description: `> 🛠️ Vous avez désormais :\n` +
                                        codeBlock(`• ${newbc.toLocaleString('en-US')} pompes à eau`) + `\u200B`,
                                    color: interaction.member.displayHexColor,
                                    timestamp: new Date(),
                                    footer: {
                                        text: `${Pays.devise}`
                                    },
                                };
                                break;
                            //endregion
                            //region Pumpjack
                            case 'Pumpjack':
                                const_T_libre = batimentObject.pumpjack.SURFACE_PUMPJACK * nombre;
                                const_bois = Math.round(batimentObject.pumpjack.CONST_PUMPJACK_BOIS * nombre * eval(`gouvernementObject.${Pays.ideologie}.construction`));
                                const_brique = Math.round(batimentObject.pumpjack.CONST_PUMPJACK_BRIQUE * nombre * eval(`gouvernementObject.${Pays.ideologie}.construction`));
                                const_metaux = Math.round(batimentObject.pumpjack.CONST_PUMPJACK_METAUX * nombre * eval(`gouvernementObject.${Pays.ideologie}.construction`));

                                sql = `
                                    UPDATE batiments SET pumpjack=pumpjack+${nombre}, usine_total=usine_total+${nombre} WHERE id_joueur='${interaction.member.id}';
                                    UPDATE territoire SET T_libre=T_libre-${const_T_libre}, T_occ=T_occ+${const_T_libre} WHERE id_joueur='${interaction.member.id}';
                                    UPDATE ressources SET bois=bois-${const_bois}, brique=brique-${const_brique}, metaux=metaux-${const_metaux} WHERE id_joueur='${interaction.member.id}'`;
                                connection.query(sql, async (err) => {if (err) {throw err;}})

                                newbc = Batiment.pumpjack + parseInt(nombre);

                                embed = {
                                    author: {
                                        name: `${Pays.rang} de ${Pays.nom}`,
                                        icon_url: interaction.member.displayAvatarURL()
                                    },
                                    thumbnail: {
                                        url: Pays.drapeau
                                    },
                                    title: `\`Construction : ${nombre.toLocaleString('en-US')} pumpjacks\``,
                                    description: `> 🛠️ Vous avez désormais :\n` +
                                        codeBlock(`• ${newbc.toLocaleString('en-US')} pumpjacks`) + `\u200B`,
                                    color: interaction.member.displayHexColor,
                                    timestamp: new Date(),
                                    footer: {
                                        text: `${Pays.devise}`
                                    },
                                };
                                break;
                            //endregion
                            //region Quartier
                            case 'Quartier':
                                const_T_libre = batimentObject.quartier.SURFACE_QUARTIER * nombre;
                                const_bois = Math.round(batimentObject.quartier.CONST_QUARTIER_BOIS * nombre * eval(`gouvernementObject.${Pays.ideologie}.construction`));
                                const_brique = Math.round(batimentObject.quartier.CONST_QUARTIER_BRIQUE * nombre * eval(`gouvernementObject.${Pays.ideologie}.construction`));
                                const_metaux = Math.round(batimentObject.quartier.CONST_QUARTIER_METAUX * nombre * eval(`gouvernementObject.${Pays.ideologie}.construction`));

                                sql = `
                                    UPDATE batiments SET quartier=quartier+${nombre}, usine_total=usine_total+${nombre} WHERE id_joueur='${interaction.member.id}';
                                    UPDATE territoire SET T_libre=T_libre-${const_T_libre}, T_occ=T_occ+${const_T_libre} WHERE id_joueur='${interaction.member.id}';
                                    UPDATE ressources SET bois=bois-${const_bois}, brique=brique-${const_brique}, metaux=metaux-${const_metaux} WHERE id_joueur='${interaction.member.id}'`;
                                connection.query(sql, async (err) => {if (err) {throw err;}})

                                newbc = Batiment.quartier + parseInt(nombre);

                                embed = {
                                    author: {
                                        name: `${Pays.rang} de ${Pays.nom}`,
                                        icon_url: interaction.member.displayAvatarURL()
                                    },
                                    thumbnail: {
                                        url: Pays.drapeau
                                    },
                                    title: `\`Construction : ${nombre.toLocaleString('en-US')} quartiers\``,
                                    description: `> 🛠️ Vous avez désormais :\n` +
                                        codeBlock(`• ${newbc.toLocaleString('en-US')} quartiers`) + `\u200B`,
                                    color: interaction.member.displayHexColor,
                                    timestamp: new Date(),
                                    footer: {
                                        text: `${Pays.devise}`
                                    },
                                };
                                break;
                            //endregion
                            //region Scierie
                            case 'Scierie':
                                const_T_libre = batimentObject.scierie.SURFACE_SCIERIE * nombre;
                                const_bois = Math.round(batimentObject.scierie.CONST_SCIERIE_BOIS * nombre * eval(`gouvernementObject.${Pays.ideologie}.construction`));
                                const_brique = Math.round(batimentObject.scierie.CONST_SCIERIE_BRIQUE * nombre * eval(`gouvernementObject.${Pays.ideologie}.construction`));
                                const_metaux = Math.round(batimentObject.scierie.CONST_SCIERIE_METAUX * nombre * eval(`gouvernementObject.${Pays.ideologie}.construction`));

                                sql = `
                                    UPDATE batiments SET scierie=scierie+${nombre}, usine_total=usine_total+${nombre} WHERE id_joueur='${interaction.member.id}';
                                    UPDATE territoire SET T_libre=T_libre-${const_T_libre}, T_occ=T_occ+${const_T_libre} WHERE id_joueur='${interaction.member.id}';
                                    UPDATE ressources SET bois=bois-${const_bois}, brique=brique-${const_brique}, metaux=metaux-${const_metaux} WHERE id_joueur='${interaction.member.id}'`;
                                connection.query(sql, async (err) => {if (err) {throw err;}})

                                newbc = Batiment.scierie + parseInt(nombre);

                                embed = {
                                    author: {
                                        name: `${Pays.rang} de ${Pays.nom}`,
                                        icon_url: interaction.member.displayAvatarURL()
                                    },
                                    thumbnail: {
                                        url: Pays.drapeau
                                    },
                                    title: `\`Construction : ${nombre.toLocaleString('en-US')} scieries\``,
                                    description: `> 🛠️ Vous avez désormais :\n` +
                                        codeBlock(`• ${newbc.toLocaleString('en-US')} scieries`) + `\u200B`,
                                    color: interaction.member.displayHexColor,
                                    timestamp: new Date(),
                                    footer: {
                                        text: `${Pays.devise}`
                                    },
                                };
                                break;
                            //endregion
                            //region Usine civile
                            case 'Usine civile':
                                const_T_libre = batimentObject.usine_civile.SURFACE_USINE_CIVILE * nombre;
                                const_bois = Math.round(batimentObject.usine_civile.CONST_USINE_CIVILE_BOIS * nombre * eval(`gouvernementObject.${Pays.ideologie}.construction`));
                                const_brique = Math.round(batimentObject.usine_civile.CONST_USINE_CIVILE_BRIQUE * nombre * eval(`gouvernementObject.${Pays.ideologie}.construction`));
                                const_metaux = Math.round(batimentObject.usine_civile.CONST_USINE_CIVILE_METAUX * nombre * eval(`gouvernementObject.${Pays.ideologie}.construction`));

                                sql = `
                                    UPDATE batiments SET usine_civile=usine_civile+${nombre}, usine_total=usine_total+${nombre} WHERE id_joueur='${interaction.member.id}';
                                    UPDATE territoire SET T_libre=T_libre-${const_T_libre}, T_occ=T_occ+${const_T_libre} WHERE id_joueur='${interaction.member.id}';
                                    UPDATE ressources SET bois=bois-${const_bois}, brique=brique-${const_brique}, metaux=metaux-${const_metaux} WHERE id_joueur='${interaction.member.id}'`;
                                connection.query(sql, async (err) => {if (err) {throw err;}})

                                newbc = Batiment.usine_civile + parseInt(nombre);

                                embed = {
                                    author: {
                                        name: `${Pays.rang} de ${Pays.nom}`,
                                        icon_url: interaction.member.displayAvatarURL()
                                    },
                                    thumbnail: {
                                        url: Pays.drapeau
                                    },
                                    title: `\`Construction : ${nombre.toLocaleString('en-US')} usines civile\``,
                                    description: `> 🛠️ Vous avez désormais :\n` +
                                        codeBlock(`• ${newbc.toLocaleString('en-US')} usines civiles`) + `\u200B`,
                                    color: interaction.member.displayHexColor,
                                    timestamp: new Date(),
                                    footer: {
                                        text: `${Pays.devise}`
                                    },
                                };
                                break;
                            //endregion
                        }

                        interaction.deferUpdate()

                        interaction.message.edit({embeds: [embed], components: []})
                    });

                } else {
                    reponse = codeBlock('diff', `- Vous n'êtes pas l'auteur de cette commande`);
                    interaction.reply({content: reponse, ephemeral: true});
                }
                //endregion
                //region Démolition
            } else if (interaction.customId.includes('demolition') === true) {

                id_joueur = interaction.customId.slice(11);
                if (id_joueur === interaction.member.id) {

                    sql = `
                        SELECT * FROM batiments WHERE id_joueur=${interaction.member.id};
                        SELECT * FROM pays WHERE id_joueur=${interaction.member.id}
                    `;
                    connection.query(sql, async (err, results) => {if (err) {throw err;}
                        const Batiment = results[0][0];
                        const Pays = results[1][0];
                        let embed;
                        let newbc;
                        let sql;
                        let demo_metaux;
                        let demo_brique;
                        let demo_bois;
                        let demo_T_libre;
                        if (err) {
                            throw err;
                        }

                        let title = interaction.message.embeds[0].title;
                        title = title.substring(14, title.length - 1);
                        const espace = title.indexOf(" ");
                        const nombre = title.slice(0, espace);
                        const batiment = title.slice(espace + 1);
                        const batimentObject = JSON.parse(readFileSync('data/batiment.json', 'utf-8'));

                        //region Briqueterie
                        if (batiment === 'Briqueterie') {

                            demo_T_libre = batimentObject.briqueterie.SURFACE_BRIQUETERIE * nombre;
                            demo_bois = Math.round(batimentObject.briqueterie.CONST_BRIQUETERIE_BOIS * nombre * batimentObject.RETOUR_POURCENTAGE);
                            demo_brique = Math.round(batimentObject.briqueterie.CONST_BRIQUETERIE_BRIQUE * nombre * batimentObject.RETOUR_POURCENTAGE);
                            demo_metaux = Math.round(batimentObject.briqueterie.CONST_BRIQUETERIE_METAUX * nombre * batimentObject.RETOUR_POURCENTAGE);

                            sql = `
                                UPDATE batiments SET briqueterie=briqueterie-${nombre}, usine_total=usine_total-${nombre} WHERE id_joueur='${interaction.member.id}';
                                UPDATE territoire SET T_libre=T_libre+${demo_T_libre}, T_occ=T_occ-${demo_T_libre} WHERE id_joueur='${interaction.member.id}';
                                UPDATE ressources SET bois=bois+${demo_bois}, brique=brique+${demo_brique}, metaux=metaux+${demo_metaux} WHERE id_joueur='${interaction.member.id}'`;
                            connection.query(sql, async (err) => {if (err) {throw err;}})

                            newbc = Batiment.briqueterie - parseInt(nombre);

                            embed = {
                                author: {
                                    name: `${Pays.rang} de ${Pays.nom}`,
                                    icon_url: interaction.member.displayAvatarURL()
                                },
                                thumbnail: {
                                    url: Pays.drapeau
                                },
                                title: `\`Démolition : ${nombre.toLocaleString('en-US')} briqueteries\``,
                                description: `> 🛠️ Vous avez désormais :\n` +
                                    codeBlock(`• ${newbc.toLocaleString('en-US')} briqueteries`) + `\u200B`,
                                color: interaction.member.displayHexColor,
                                timestamp: new Date(),
                                footer: {
                                    text: `${Pays.devise}`
                                },
                            };

                            interaction.deferUpdate()
                            interaction.message.edit({embeds: [embed], components: []})
                            //endregion
                            //region Champ
                        } else if (batiment === 'Champ') {

                            demo_T_libre = batimentObject.champ.SURFACE_CHAMP * nombre;
                            demo_bois = Math.round(batimentObject.champ.CONST_CHAMP_BOIS * nombre * batimentObject.RETOUR_POURCENTAGE);
                            demo_brique = Math.round(batimentObject.champ.CONST_CHAMP_BRIQUE * nombre * batimentObject.RETOUR_POURCENTAGE);
                            demo_metaux = Math.round(batimentObject.champ.CONST_CHAMP_METAUX * nombre * batimentObject.RETOUR_POURCENTAGE);

                            sql = `
                                UPDATE batiments SET champ=champ-${nombre}, usine_total=usine_total-${nombre} WHERE id_joueur='${interaction.member.id}';
                                UPDATE territoire SET T_libre=T_libre+${demo_T_libre}, T_occ=T_occ-${demo_T_libre} WHERE id_joueur='${interaction.member.id}';
                                UPDATE ressources SET bois=bois+${demo_bois}, brique=brique+${demo_brique}, metaux=metaux+${demo_metaux} WHERE id_joueur='${interaction.member.id}'`;
                            connection.query(sql, async (err) => {if (err) {throw err;}})

                            newbc = Batiment.champ - parseInt(nombre);

                            embed = {
                                author: {
                                    name: `${Pays.rang} de ${Pays.nom}`,
                                    icon_url: interaction.member.displayAvatarURL()
                                },
                                thumbnail: {
                                    url: Pays.drapeau
                                },
                                title: `\`Démolition : ${nombre.toLocaleString('en-US')} champs\``,
                                description: `> 🛠️ Vous avez désormais :\n` +
                                    codeBlock(`• ${newbc.toLocaleString('en-US')} champs`) + `\u200B`,
                                color: interaction.member.displayHexColor,
                                timestamp: new Date(),
                                footer: {
                                    text: `${Pays.devise}`
                                },
                            };

                            interaction.deferUpdate()
                            interaction.message.edit({embeds: [embed], components: []})
                            //endregion
                            //region Centrale au fioul
                        } else if (batiment === 'Centrale au fioul') {

                            demo_T_libre = batimentObject.centrale_fioul.SURFACE_CENTRALE_FIOUL * nombre;
                            demo_bois = Math.round(batimentObject.centrale_fioul.CONST_CENTRALE_FIOUL_BOIS * nombre * batimentObject.RETOUR_POURCENTAGE);
                            demo_brique = Math.round(batimentObject.centrale_fioul.CONST_CENTRALE_FIOUL_BRIQUE * nombre * batimentObject.RETOUR_POURCENTAGE);
                            demo_metaux = Math.round(batimentObject.centrale_fioul.CONST_CENTRALE_FIOUL_METAUX * nombre * batimentObject.RETOUR_POURCENTAGE);

                            sql = `
                                UPDATE batiments SET centrale_fioul=centrale_fioul-${nombre}, usine_total=usine_total-${nombre} WHERE id_joueur='${interaction.member.id}';
                                UPDATE territoire SET T_libre=T_libre+${demo_T_libre}, T_occ=T_occ-${demo_T_libre} WHERE id_joueur='${interaction.member.id}';
                                UPDATE ressources SET bois=bois+${demo_bois}, brique=brique+${demo_brique}, metaux=metaux+${demo_metaux} WHERE id_joueur='${interaction.member.id}'`;
                            connection.query(sql, async (err) => {if (err) {throw err;}})

                            newbc = Batiment.centrale_fioul - parseInt(nombre);

                            embed = {
                                author: {
                                    name: `${Pays.rang} de ${Pays.nom}`,
                                    icon_url: interaction.member.displayAvatarURL()
                                },
                                thumbnail: {
                                    url: Pays.drapeau
                                },
                                title: `\`Démolition : ${nombre.toLocaleString('en-US')} centrales électrique\``,
                                description: `> 🛠️ Vous avez désormais :\n` +
                                    codeBlock(`• ${newbc.toLocaleString('en-US')} centrales électriques`) + `\u200B`,
                                color: interaction.member.displayHexColor,
                                timestamp: new Date(),
                                footer: {
                                    text: `${Pays.devise}`
                                },
                            };

                            interaction.deferUpdate()
                            interaction.message.edit({embeds: [embed], components: []})
                            //endregion
                            //region Eolienne
                        } else if (batiment === 'Eolienne') {

                            demo_T_libre = batimentObject.eolienne.SURFACE_EOLIENNE * nombre;
                            demo_metaux = Math.round(batimentObject.eolienne.CONST_EOLIENNE_METAUX * nombre * batimentObject.RETOUR_POURCENTAGE);

                            sql = `
                                UPDATE batiments SET briqueterie=briqueterie-${nombre}, usine_total=usine_total-${nombre} WHERE id_joueur='${interaction.member.id}';
                                UPDATE territoire SET T_libre=T_libre+${demo_T_libre}, T_occ=T_occ-${demo_T_libre} WHERE id_joueur='${interaction.member.id}';
                                UPDATE ressources SET metaux=metaux+${demo_metaux} WHERE id_joueur='${interaction.member.id}'`;
                            connection.query(sql, async (err) => {if (err) {throw err;}})

                            newbc = Pays.eolienne - parseInt(nombre);

                            embed = {
                                author: {
                                    name: `${Pays.rang} de ${Pays.nom}`,
                                    icon_url: interaction.member.displayAvatarURL()
                                },
                                thumbnail: {
                                    url: Pays.drapeau
                                },
                                title: `\`Démolition : ${nombre.toLocaleString('en-US')} eoliennes\``,
                                description: `> 🛠️ Vous avez désormais :\n` +
                                    codeBlock(`• ${newbc.toLocaleString('en-US')} eoliennes`) + `\u200B`,
                                color: interaction.member.displayHexColor,
                                timestamp: new Date(),
                                footer: {
                                    text: `${Pays.devise}`
                                },
                            };

                            interaction.deferUpdate()
                            interaction.message.edit({embeds: [embed], components: []})
//endregion
                            //region Mine
                        } else if (batiment === 'Mine') {

                            demo_T_libre = batimentObject.mine.SURFACE_MINE * nombre;
                            demo_bois = Math.round(batimentObject.mine.CONST_MINE_BOIS * nombre * batimentObject.RETOUR_POURCENTAGE);
                            demo_brique = Math.round(batimentObject.mine.CONST_MINE_BRIQUE * nombre * batimentObject.RETOUR_POURCENTAGE);
                            demo_metaux = Math.round(batimentObject.mine.CONST_MINE_METAUX * nombre * batimentObject.RETOUR_POURCENTAGE);

                            sql = `
                                UPDATE batiments SET mine=mine-${nombre}, usine_total=usine_total-${nombre} WHERE id_joueur='${interaction.member.id}';
                                UPDATE territoire SET T_libre=T_libre+${demo_T_libre}, T_occ=T_occ-${demo_T_libre} WHERE id_joueur='${interaction.member.id}';
                                UPDATE ressources SET bois=bois+${demo_bois}, brique=brique+${demo_brique}, metaux=metaux+${demo_metaux} WHERE id_joueur='${interaction.member.id}'`;
                            connection.query(sql, async (err) => {if (err) {throw err;}})

                            newbc = Batiment.mine - parseInt(nombre);

                            embed = {
                                author: {
                                    name: `${Pays.rang} de ${Pays.nom}`,
                                    icon_url: interaction.member.displayAvatarURL()
                                },
                                thumbnail: {
                                    url: Pays.drapeau
                                },
                                title: `\`Démolition : ${nombre.toLocaleString('en-US')} mines\``,
                                description: `> 🛠️ Vous avez désormais :\n` +
                                    codeBlock(`• ${newbc.toLocaleString('en-US')} mines`) + `\u200B`,
                                color: interaction.member.displayHexColor,
                                timestamp: new Date(),
                                footer: {
                                    text: `${Pays.devise}`
                                },
                            };

                            interaction.deferUpdate()
                            interaction.message.edit({embeds: [embed], components: []})
//endregion
                            //region Pompe à eau
                        } else if (batiment === 'Pompe à eau') {

                            demo_T_libre = batimentObject.pompe_a_eau.SURFACE_POMPE_A_EAU * nombre;
                            demo_bois = Math.round(batimentObject.pompe_a_eau.CONST_POMPE_A_EAU_BOIS * nombre * batimentObject.RETOUR_POURCENTAGE);
                            demo_brique = Math.round(batimentObject.pompe_a_eau.CONST_POMPE_A_EAU_BRIQUE * nombre * batimentObject.RETOUR_POURCENTAGE);
                            demo_metaux = Math.round(batimentObject.pompe_a_eau.CONST_POMPE_A_EAU_METAUX * nombre * batimentObject.RETOUR_POURCENTAGE);

                            sql = `
                                UPDATE batiments SET pompe_a_eau=pompe_a_eau-${nombre}, usine_total=usine_total-${nombre} WHERE id_joueur='${interaction.member.id}';
                                UPDATE territoire SET T_libre=T_libre+${demo_T_libre}, T_occ=T_occ-${demo_T_libre} WHERE id_joueur='${interaction.member.id}';
                                UPDATE ressources SET bois=bois+${demo_bois}, brique=brique+${demo_brique}, metaux=metaux+${demo_metaux} WHERE id_joueur='${interaction.member.id}'`;
                            connection.query(sql, async (err) => {if (err) {throw err;}})

                            newbc = Batiment.pompe_a_eau - parseInt(nombre);

                            embed = {
                                author: {
                                    name: `${Pays.rang} de ${Pays.nom}`,
                                    icon_url: interaction.member.displayAvatarURL()
                                },
                                thumbnail: {
                                    url: Pays.drapeau
                                },
                                title: `\`Démolition : ${nombre.toLocaleString('en-US')} pompes à eau\``,
                                description: `> 🛠️ Vous avez désormais :\n` +
                                    codeBlock(`• ${newbc.toLocaleString('en-US')} pompes à eau`) + `\u200B`,
                                color: interaction.member.displayHexColor,
                                timestamp: new Date(),
                                footer: {
                                    text: `${Pays.devise}`
                                },
                            };

                            interaction.deferUpdate()
                            interaction.message.edit({embeds: [embed], components: []})
//endregion
                            //region Pumpjack
                        } else if (batiment === 'Pumpjack') {

                            demo_T_libre = batimentObject.pumpjack.SURFACE_PUMPJACK * nombre;
                            demo_bois = Math.round(batimentObject.pumpjack.CONST_PUMPJACK_BOIS * nombre * batimentObject.RETOUR_POURCENTAGE);
                            demo_brique = Math.round(batimentObject.pumpjack.CONST_PUMPJACK_BRIQUE * nombre * batimentObject.RETOUR_POURCENTAGE);
                            demo_metaux = Math.round(batimentObject.pumpjack.CONST_PUMPJACK_METAUX * nombre * batimentObject.RETOUR_POURCENTAGE);

                            sql = `
                                UPDATE batiments SET pumpjack=pumpjack-${nombre}, usine_total=usine_total-${nombre} WHERE id_joueur='${interaction.member.id}';
                                UPDATE territoire SET T_libre=T_libre+${demo_T_libre}, T_occ=T_occ-${demo_T_libre} WHERE id_joueur='${interaction.member.id}';
                                UPDATE ressources SET bois=bois+${demo_bois}, brique=brique+${demo_brique}, metaux=metaux+${demo_metaux} WHERE id_joueur='${interaction.member.id}'`;
                            connection.query(sql, async (err) => {if (err) {throw err;}})

                            newbc = Batiment.pumpjack - parseInt(nombre);

                            embed = {
                                author: {
                                    name: `${Pays.rang} de ${Pays.nom}`,
                                    icon_url: interaction.member.displayAvatarURL()
                                },
                                thumbnail: {
                                    url: Pays.drapeau
                                },
                                title: `\`Démolition : ${nombre.toLocaleString('en-US')} pumpjacks\``,
                                description: `> 🛠️ Vous avez désormais :\n` +
                                    codeBlock(`• ${newbc.toLocaleString('en-US')} pumpjacks`) + `\u200B`,
                                color: interaction.member.displayHexColor,
                                timestamp: new Date(),
                                footer: {
                                    text: `${Pays.devise}`
                                },
                            };

                            interaction.deferUpdate()
                            interaction.message.edit({embeds: [embed], components: []})
//endregion
                            //region Quartier
                        } else if (batiment === 'Quartier') {

                            demo_T_libre = batimentObject.quartier.SURFACE_QUARTIER * nombre;
                            demo_bois = Math.round(batimentObject.quartier.CONST_QUARTIER_BOIS * nombre * batimentObject.RETOUR_POURCENTAGE);
                            demo_brique = Math.round(batimentObject.quartier.CONST_QUARTIER_BRIQUE * nombre * batimentObject.RETOUR_POURCENTAGE);
                            demo_metaux = Math.round(batimentObject.quartier.CONST_QUARTIER_METAUX * nombre * batimentObject.RETOUR_POURCENTAGE);

                            sql = `
                                UPDATE batiments SET quartier=quartier-${nombre}, usine_total=usine_total-${nombre} WHERE id_joueur='${interaction.member.id}';
                                UPDATE territoire SET T_libre=T_libre+${demo_T_libre}, T_occ=T_occ-${demo_T_libre} WHERE id_joueur='${interaction.member.id}';
                                UPDATE ressources SET bois=bois+${demo_bois}, brique=brique+${demo_brique}, metaux=metaux+${demo_metaux} WHERE id_joueur='${interaction.member.id}'`;
                            connection.query(sql, async (err) => {if (err) {throw err;}})

                            newbc = Batiment.quartier - parseInt(nombre);

                            embed = {
                                author: {
                                    name: `${Pays.rang} de ${Pays.nom}`,
                                    icon_url: interaction.member.displayAvatarURL()
                                },
                                thumbnail: {
                                    url: Pays.drapeau
                                },
                                title: `\`Démolition : ${nombre.toLocaleString('en-US')} quartiers\``,
                                description: `> 🛠️ Vous avez désormais :\n` +
                                    codeBlock(`• ${newbc.toLocaleString('en-US')} quartiers`) + `\u200B`,
                                color: interaction.member.displayHexColor,
                                timestamp: new Date(),
                                footer: {
                                    text: `${Pays.devise}`
                                },
                            };

                            interaction.deferUpdate()
                            interaction.message.edit({embeds: [embed], components: []})
//endregion
                            //region Scierie
                        } else if (batiment === 'Scierie') {

                            demo_T_libre = batimentObject.scierie.SURFACE_SCIERIE * nombre;
                            demo_bois = Math.round(batimentObject.scierie.CONST_SCIERIE_BOIS * nombre * batimentObject.RETOUR_POURCENTAGE);
                            demo_brique = Math.round(batimentObject.scierie.CONST_SCIERIE_BRIQUE * nombre * batimentObject.RETOUR_POURCENTAGE);
                            demo_metaux = Math.round(batimentObject.scierie.CONST_SCIERIE_METAUX * nombre * batimentObject.RETOUR_POURCENTAGE);

                            sql = `
                                UPDATE batiments SET scierie=scierie-${nombre}, usine_total=usine_total-${nombre} WHERE id_joueur='${interaction.member.id}';
                                UPDATE territoire SET T_libre=T_libre+${demo_T_libre}, T_occ=T_occ-${demo_T_libre} WHERE id_joueur='${interaction.member.id}';
                                UPDATE ressources SET bois=bois+${demo_bois}, brique=brique+${demo_brique}, metaux=metaux+${demo_metaux} WHERE id_joueur='${interaction.member.id}'`;
                            connection.query(sql, async (err) => {if (err) {throw err;}})

                            newbc = Batiment.scierie - parseInt(nombre);

                            embed = {
                                author: {
                                    name: `${Pays.rang} de ${Pays.nom}`,
                                    icon_url: interaction.member.displayAvatarURL()
                                },
                                thumbnail: {
                                    url: Pays.drapeau
                                },
                                title: `\`Démolition : ${nombre.toLocaleString('en-US')} scieries\``,
                                description: `> 🛠️ Vous avez désormais :\n` +
                                    codeBlock(`• ${newbc.toLocaleString('en-US')} scieries`) + `\u200B`,
                                color: interaction.member.displayHexColor,
                                timestamp: new Date(),
                                footer: {
                                    text: `${Pays.devise}`
                                },
                            };

                            interaction.deferUpdate()
                            interaction.message.edit({embeds: [embed], components: []})
//endregion
                            //region Usine civile
                        } else if (batiment === 'Usine civile') {

                            demo_T_libre = batimentObject.usine_civile.SURFACE_USINE_CIVILE * nombre;
                            demo_bois = Math.round(batimentObject.usine_civile.CONST_USINE_CIVILE_BOIS * nombre * batimentObject.RETOUR_POURCENTAGE);
                            demo_brique = Math.round(batimentObject.usine_civile.CONST_USINE_CIVILE_BRIQUE * nombre * batimentObject.RETOUR_POURCENTAGE);
                            demo_metaux = Math.round(batimentObject.usine_civile.CONST_USINE_CIVILE_METAUX * nombre * batimentObject.RETOUR_POURCENTAGE);

                            sql = `
                                UPDATE batiments SET usine_civile=usine_civile-${nombre}, usine_total=usine_total-${nombre} WHERE id_joueur='${interaction.member.id}';
                                UPDATE territoire SET T_libre=T_libre+${demo_T_libre}, T_occ=T_occ-${demo_T_libre} WHERE id_joueur='${interaction.member.id}';
                                UPDATE ressources SET bois=bois+${demo_bois}, brique=brique+${demo_brique}, metaux=metaux+${demo_metaux} WHERE id_joueur='${interaction.member.id}'`;
                            connection.query(sql, async (err) => {if (err) {throw err;}})

                            newbc = Batiment.usine_civile - parseInt(nombre);

                            embed = {
                                author: {
                                    name: `${Pays.rang} de ${Pays.nom}`,
                                    icon_url: interaction.member.displayAvatarURL()
                                },
                                thumbnail: {
                                    url: Pays.drapeau
                                },
                                title: `\`Démolition : ${nombre.toLocaleString('en-US')} usines civile\``,
                                description: `> 🛠️ Vous avez désormais : 🛠️\n` +
                                    codeBlock(`• ${newbc.toLocaleString('en-US')} usines civiles`) + `\u200B`,
                                color: interaction.member.displayHexColor,
                                timestamp: new Date(),
                                footer: {
                                    text: `${Pays.devise}`
                                },
                            };

                            interaction.deferUpdate()
                            interaction.message.edit({embeds: [embed], components: []})
                            //endregion
                        }
                    });

                } else {
                    reponse = codeBlock('diff', `- Vous n'êtes pas l'auteur de cette commande`);
                    interaction.reply({content: reponse, ephemeral: true});
                }
                //endregion
                //region Acheter
            } else if (interaction.customId.includes('acheter') === true) {

                id_joueur = interaction.customId.slice(8);
                if (id_joueur === interaction.member.id) {
                    reponse = codeBlock('diff', `- Vous ne pouvez pas acheter votre offre`);
                    interaction.reply({content: reponse, ephemeral: true});
                } else {
                    const fields = interaction.message.embeds[0].fields;
                    const espace = fields[0].value.indexOf("Prix");
                    const ressource = fields[0].value.slice(6, espace - 3);

                    const quantiteAvecVirgule = interaction.message.embeds[0].fields[1].value.slice(6, fields[1].value.length - 4);
                    const search = ',';
                    const replaceWith = '';
                    const quantite = parseInt(quantiteAvecVirgule.split(search).join(replaceWith));

                    const texte = interaction.message.embeds[0].fields[2].value
                    const prix_u = Number(texte.slice((texte.indexOf(":") + 2), (texte.indexOf("(") - 1)));
                    const prix = Math.round(prix_u * quantite);
                    //console.log(espace + ` | ` + ressource + ` | ` + prix_u + ` | ` + prix + ` | ` + texte + ` | ` + (texte.indexOf(":") + 2) + ` | ` + (texte.indexOf("Au") - 3))

                    sql = `SELECT * FROM pays WHERE id_joueur='${id_joueur}'`;

                    connection.query(sql, async (err) => {if (err) {throw err;}
                        let res;
                        const pourcentage = fields[2].value.slice(fields[2].value.indexOf("(") - 1, fields[2].value.indexOf(")"));

                        switch (ressource) {
                            case 'Biens de consommation':
                                res = `bc`;
                                break;
                            case 'Bois':
                                res = `bois`;
                                break;
                            case 'Brique':
                                res = `brique`;
                                break;
                            case 'Eau':
                                res = `eau`;
                                break;
                            case 'Metaux':
                                res = `metaux`;
                                break;
                            case 'Nourriture':
                                res = `nourriture`;
                                break;
                            case 'Petrole':
                                res = `petrole`;
                                break;
                        }

                        const sql = `SELECT * FROM pays WHERE id_joueur="${interaction.user.id}" LIMIT 1`;
                        connection.query(sql, async (err, results) => {if (err) {throw err;}
                            const Pays = results[0];

                            if (Pays.cash >= prix) {

                                const acheteur = {
                                    author: {
                                        name: `${Pays.rang} de ${Pays.nom}`,
                                        icon_url: interaction.member.displayAvatarURL()
                                    },
                                    thumbnail: {
                                        url: Pays.drapeau,
                                    },
                                    title: `\`Achat validé :\``,
                                    fields: [{
                                        name: `Vendeur :`,
                                        value: `<@${id_joueur}>`
                                    },
                                        {
                                            name: `Ressource :`,
                                            value: codeBlock(`• ${ressource}`)
                                        },
                                        {
                                            name: `Quantité :`,
                                            value: codeBlock(`• ${quantite.toLocaleString('en-US')}`)
                                        },
                                        {
                                            name: `Prix :`,
                                            value: codeBlock(
                                                `• A l'unité : ${prix_u} (${pourcentage}%)\n` +
                                                `• Au total : ${prix.toLocaleString('en-US')} $`)
                                        }
                                    ],
                                    color: interaction.member.displayHexColor,
                                    timestamp: new Date(),
                                    footer: {
                                        text: `${Pays.devise}`
                                    },
                                };

                                const vendeur = {
                                    author: {
                                        name: `${Pays.rang} de ${Pays.nom}`,
                                        icon_url: interaction.member.displayAvatarURL()
                                    },
                                    thumbnail: {
                                        url: Pays.drapeau,
                                    },
                                    title: `\`Marché conclu :\``,
                                    fields: [{
                                        name: `Acheteur :`,
                                        value: `<@${interaction.user.id}>`
                                    },
                                        {
                                            name: `Ressource :`,
                                            value: codeBlock(`• ${ressource}`)
                                        },
                                        {
                                            name: `Quantité :`,
                                            value: codeBlock(`• ${quantite.toLocaleString('en-US')}`)
                                        },
                                        {
                                            name: `Prix :`,
                                            value: codeBlock(
                                                `• A l'unité : ${prix_u} (${pourcentage}%)\n` +
                                                `• Au total : ${prix.toLocaleString('en-US')} $`)
                                        }
                                    ],
                                    color: interaction.member.displayHexColor,
                                    timestamp: new Date(),
                                    footer: {
                                        text: `${Pays.devise}`
                                    },
                                };

                                const commerce = {
                                    author: {
                                        name: `${Pays.rang} de ${Pays.nom}`,
                                        icon_url: interaction.member.displayAvatarURL()
                                    },
                                    thumbnail: {
                                        url: Pays.drapeau,
                                    },
                                    title: `\`Marché conclu :\``,
                                    fields: [{
                                        name: `Vendeur :`,
                                        value: `<@${id_joueur}>`,
                                        inline: true
                                    },
                                        {
                                            name: `Acheteur :`,
                                            value: `<@${interaction.user.id}>`,
                                            inline: true
                                        },
                                        {
                                            name: `Ressource :`,
                                            value: codeBlock(`• ${ressource}`)
                                        },
                                        {
                                            name: `Quantité :`,
                                            value: codeBlock(`• ${quantite.toLocaleString('en-US')}`)
                                        },
                                        {
                                            name: `Prix :`,
                                            value: codeBlock(
                                                `• A l'unité : ${prix_u} (${pourcentage}%)\n` +
                                                `• Au total : ${prix.toLocaleString('en-US')} $`)
                                        }
                                    ],
                                    color: interaction.member.displayHexColor,
                                    timestamp: new Date(),
                                    footer: {
                                        text: `${Pays.devise}`
                                    },
                                };

                                const salon_commerce = interaction.client.channels.cache.get(process.env.SALON_COMMERCE);
                                salon_commerce.send({embeds: [commerce]})

                                interaction.user.send({embeds: [acheteur]});
                                const id_vendeur = await interaction.guild.members.fetch(id_joueur);
                                id_vendeur.send({embeds: [vendeur]});

                                const thread = await interaction.channel.fetch();
                                await thread.delete();


                                let sql = `SELECT * FROM trade WHERE ressource="${ressource}" ORDER BY id_trade`;
                                connection.query(sql, async (err, results) => {if (err) {throw err;}
                                    const arrayQvente = Object.values(results);
                                    const sql = `DELETE FROM trade WHERE id_trade='${arrayQvente[0].id_trade}'`;
                                    connection.query(sql, async (err) => {if (err) {throw err;}});
                                });

                                sql = `
                                    INSERT INTO trade SET id_joueur="${interaction.user.id}",
                                                          id_salon="${interaction.channelId}",
                                                          ressource="${ressource}",
                                                          quantite='${quantite}',
                                                          prix='${prix}',
                                                          prix_u='${prix_u}';
                                    UPDATE pays SET cash=cash+${prix} WHERE id_joueur="${id_joueur}";
                                    UPDATE pays SET cash=cash-${prix} WHERE id_joueur="${interaction.user.id}";
                                    UPDATE ressources SET ${res}=${res}+${quantite} WHERE id_joueur="${interaction.user.id}";
                                    INSERT INTO historique SET id_joueur="${interaction.user.id}",
                                                               id_salon="${interaction.channelId}",
                                                               type="offre",
                                                               ressource="${ressource}",
                                                               quantite='${quantite}',
                                                               prix='${prix}',
                                                               prix_u='${prix_u}'`;
                                connection.query(sql, async (err) => {if (err) {throw err;}})
                            } else {
                                const reponse = codeBlock('diff', `- Vous n'avez pas l'argent nécessaire pour conclure l'affaire : ${Pays.cash.toLocaleString('en-US')}/${prix.toLocaleString('en-US')}`);
                                await interaction.reply({content: reponse, ephemeral: true});
                            }
                        })
                    });

                }
                //endregion
            } else if (interaction.customId.includes('vendre') === true) {
                //region Vendre
                id_joueur = interaction.customId.slice(7);
                if (id_joueur === interaction.member.id) {

                    const fields = interaction.message.embeds[0].fields;
                    const espace = fields[0].value.indexOf("Prix");
                    const ressource = fields[0].value.slice(6, espace - 3);

                    const quantiteAvecVirgule = interaction.message.embeds[0].fields[1].value.slice(6, fields[1].value.length - 4);
                    const search = ',';
                    const replaceWith = '';
                    const quantite = parseInt(quantiteAvecVirgule.split(search).join(replaceWith));

                    const espace2 = fields[2].value.indexOf("(");
                    const prix_u = fields[2].value.slice(18, espace2 - 1);
                    const prix = Math.round(prix_u * quantite);
                    //console.log(espace + ` | ` + ressource + ` | ` + espace2 + ` | ` + prix_u + ` | ` + prix)

                    sql = `SELECT * FROM pays WHERE id_joueur="${id_joueur}"`;
                    connection.query(sql, async (err, results) => {if (err) {throw err;}
                        const Pays = results[0];
                        let res;

                        const pourcentage = fields[2].value.slice(fields[2].value.indexOf("(") - 1, fields[2].value.indexOf(")"));
                        const gouvernementObject = JSON.parse(readFileSync('data/gouvernement.json', 'utf-8'));
                        const vendreCommandCooldown = new CommandCooldown('vendre', ms(`${eval(`gouvernementObject.${Pays.ideologie}.commerce`)}m`));

                        switch (ressource) {
                            case 'Biens de consommation':
                                res = `bc`;
                                break;
                            case 'Bois':
                                res = `bois`;
                                break;
                            case 'Brique':
                                res = `brique`;
                                break;
                            case 'Eau':
                                res = `eau`;
                                break;
                            case 'Metaux':
                                res = `metaux`;
                                break;
                            case 'Nourriture':
                                res = `nourriture`;
                                break;
                            case 'Petrole':
                                res = `petrole`;
                                break;
                        }
                        const embed = {
                            author: {
                                name: `${Pays.rang} de ${Pays.nom}`,
                                icon_url: interaction.member.displayAvatarURL()
                            },
                            thumbnail: {
                                url: Pays.drapeau
                            },
                            title: `\`Vous avez fait une offre au marché internationnal :\``,
                            fields: interaction.message.embeds[0].fields,
                            color: interaction.member.displayHexColor,
                            timestamp: new Date(),
                            footer: {
                                text: `${Pays.devise}`
                            },
                        };

                        interaction.message.edit({embeds: [embed], components: []});

                        const salon_commerce = interaction.client.channels.cache.get(process.env.SALON_COMMERCE);
                        const thread = await salon_commerce.threads
                            .create({
                                name: `${quantite.toLocaleString('en-US')} [${ressource}] à ${prix_u.toLocaleString('en-US')} | ${prix.toLocaleString('en-US')} $ | ${interaction.member.displayName}`
                            });

                        const offre = {
                            author: {
                                name: `${Pays.rang} de ${Pays.nom}`,
                                icon_url: interaction.member.displayAvatarURL()
                            },
                            thumbnail: {
                                url: Pays.drapeau
                            },
                            title: `\`Nouvelle offre :\``,
                            fields: [{
                                name: `Ressource :`,
                                value: codeBlock(`• ${ressource}`) + `\u200B`
                            },
                                {
                                    name: `Quantité :`,
                                    value: codeBlock(`• ${quantite.toLocaleString('en-US')}`) + `\u200B`
                                },
                                {
                                    name: `Prix :`,
                                    value: codeBlock(`• A l'unité : ${prix_u.toLocaleString('en-US')} (${pourcentage}%)\n` +
                                        `• Au total : ${prix.toLocaleString('en-US')}`) + `\u200B`
                                }
                            ],
                            color: interaction.member.displayHexColor,
                            timestamp: new Date(),
                            footer: {
                                text: `${Pays.devise}`
                            },
                        };

                        const row = new MessageActionRow()
                            .addComponents(
                                new MessageButton()
                                    .setLabel(`Acheter`)
                                    .setEmoji(`💵`)
                                    .setCustomId('acheter-' + id_joueur)
                                    .setStyle('SUCCESS'),
                            )
                            .addComponents(
                                new MessageButton()
                                    .setLabel(`Supprimer`)
                                    .setEmoji(`✖️`)
                                    .setCustomId('supprimer-' + id_joueur)
                                    .setStyle('DANGER'),
                            )

                        thread.send({embeds: [offre], components: [row]});

                        interaction.channel.send({content: `Votre offre a été publiée pour 1 jour : ${thread}`});
                        await vendreCommandCooldown.addUser(interaction.member.id);

                        const sql = `UPDATE ressources SET ${res}=${res}-${quantite} WHERE id_joueur="${id_joueur}"`;
                        connection.query(sql, async (err) => {if (err) {throw err;}});
                    });
                } else {
                    reponse = codeBlock('diff', `- Vous n'êtes pas l'auteur de cette commande`);
                    interaction.reply({content: reponse, ephemeral: true});
                }
                //endregion
                //region Vente rapide
            } else if (interaction.customId.includes('qvente') === true) {

                id_joueur = interaction.customId.slice(7);
                if (id_joueur === interaction.member.id) {

                    const fields = interaction.message.embeds[0].fields;
                    const espace = fields[0].value.indexOf("Prix");
                    const ressource = fields[0].value.slice(6, espace - 3);

                    const quantiteAvecVirgule = interaction.message.embeds[0].fields[1].value.slice(6, fields[1].value.length - 4);
                    const search = ',';
                    const replaceWith = '';
                    const quantite = quantiteAvecVirgule.split(search).join(replaceWith);

                    const espace2 = fields[2].value.indexOf("Au");
                    const prix_u = fields[2].value.slice(39, espace2 - 3);
                    const prix = Math.round(prix_u * quantite);
                    //console.log(espace + ` | ` + ressource + ` | ` + espace2 + ` | ` + prix_u + ` | ` + prix)

                    sql = `SELECT * FROM pays WHERE id_joueur="${id_joueur}"`;
                    connection.query(sql, async (err, results) => {if (err) {throw err;}
                        const Pays = results[0];
                        let res;

                        switch (ressource) {
                            case 'Biens de consommation':
                                res = `bc`;
                                break;
                            case 'Bois':
                                res = `bois`;
                                break;
                            case 'Brique':
                                res = `brique`;
                                break;
                            case 'Eau':
                                res = `eau`;
                                break;
                            case 'Metaux':
                                res = `metaux`;
                                break;
                            case 'Nourriture':
                                res = `nourriture`;
                                break;
                            case 'Petrole':
                                res = `petrole`;
                                break;
                        }
                        const embed = {
                            author: {
                                name: `${Pays.rang} de ${Pays.nom}`,
                                icon_url: interaction.member.displayAvatarURL()
                            },
                            thumbnail: {
                                url: Pays.drapeau
                            },
                            title: `\`Vous avez vendus au marché rapide :\``,
                            fields: interaction.message.embeds[0].fields,
                            color: interaction.member.displayHexColor,
                            timestamp: new Date(),
                            footer: {
                                text: `${Pays.devise}`
                            },
                        };

                        await interaction.deferUpdate()
                        interaction.message.edit({embeds: [embed], components: []});

                        let sql = `SELECT * FROM qvente WHERE ressource="${ressource}" ORDER BY id_vente`;
                        connection.query(sql, async (err, results) => {if (err) {throw err;}
                            const arrayQvente = Object.values(results);
                            const sql = `DELETE FROM qvente WHERE id_vente='${arrayQvente[0].id_vente}'`;
                            connection.query(sql, async (err) => {if (err) {throw err;}});
                        });

                        sql = `
                            INSERT INTO qvente SET id_joueur="${interaction.user.id}",
                                                   id_salon="${interaction.channelId}",
                                                   ressource="${ressource}",
                                                   quantite='${quantite}',
                                                   prix='${prix}',
                                                   prix_u='${prix_u}';
                            UPDATE pays SET cash=cash+${prix} WHERE id_joueur="${id_joueur}";
                            UPDATE ressources SET ${res}=${res}-${quantite} WHERE id_joueur="${id_joueur}";
                            INSERT INTO historique SET id_joueur="${interaction.user.id}",
                                                       id_salon="${interaction.channelId}",
                                                       type="qvente",
                                                       ressource="${ressource}",
                                                       quantite='${quantite}',
                                                       prix='${prix}',
                                                       prix_u='${prix_u}'`;
                        connection.query(sql, async (err) => {if (err) {throw err;}});
                    });
                } else {
                    reponse = codeBlock('diff', `- Vous n'êtes pas l'auteur de cette commande`);
                    interaction.reply({content: reponse, ephemeral: true});
                }
                //endregion
                //region Achat rapide
            } else if (interaction.customId.includes('qachat') === true) {

                id_joueur = interaction.customId.slice(7);
                if (id_joueur === interaction.member.id) {

                    const fields = interaction.message.embeds[0].fields;
                    const espace = fields[0].value.indexOf("Prix");
                    const ressource = fields[0].value.slice(6, espace - 3);

                    const quantiteAvecVirgule = interaction.message.embeds[0].fields[1].value.slice(6, fields[1].value.length - 4);
                    const search = ',';
                    const replaceWith = '';
                    const quantite = quantiteAvecVirgule.split(search).join(replaceWith);

                    const espace2 = fields[2].value.indexOf("Au");
                    const prix_u = fields[2].value.slice(39, espace2 - 3);
                    const prix = Math.round(prix_u * quantite);
                    //console.log(espace + ` | ` + ressource + ` | ` + espace2 + ` | ` + prix_u + ` | ` + prix)

                    sql = `SELECT * FROM pays WHERE id_joueur='${id_joueur}'`;
                    connection.query(sql, async (err, results) => {if (err) {throw err;}
                        const Pays = results[0];
                        let res;

                        if (prix > Pays.cash) {
                            const reponse = codeBlock('diff', `- Vous n'avez pas assez d\'argent : ${Pays.cash.toLocaleString('en-US')}/${prix.toLocaleString('en-US')}`);
                            await interaction.reply({content: reponse, ephemeral: true});
                        } else {
                            switch (ressource) {
                                case 'Biens de consommation':
                                    res = `bc`;
                                    break;
                                case 'Bois':
                                    res = `bois`;
                                    break;
                                case 'Brique':
                                    res = `brique`;
                                    break;
                                case 'Eau':
                                    res = `eau`;
                                    break;
                                case 'Metaux':
                                    res = `metaux`;
                                    break;
                                case 'Nourriture':
                                    res = `nourriture`;
                                    break;
                                case 'Petrole':
                                    res = `petrole`;
                                    break;
                            }

                            const embed = {
                                author: {
                                    name: `${Pays.rang} de ${Pays.nom}`,
                                    icon_url: interaction.member.displayAvatarURL()
                                },
                                thumbnail: {
                                    url: Pays.drapeau
                                },
                                title: `\`Vous avez acheté au marché rapide :\``,
                                fields: interaction.message.embeds[0].fields,
                                color: interaction.member.displayHexColor,
                                timestamp: new Date(),
                                footer: {
                                    text: `${Pays.devise}`
                                },
                            };

                            await interaction.deferUpdate()
                            interaction.message.edit({embeds: [embed], components: []});

                            let sql = `SELECT * FROM qachat WHERE ressource='${ressource}' ORDER BY id_achat`;
                            connection.query(sql, async (err, results) => {if (err) {throw err;}
                                const arrayQvente = Object.values(results);
                                const sql = `DELETE FROM qachat WHERE id_achat='${arrayQvente[0].id_achat}'`;
                                connection.query(sql, async (err) => {if (err) {throw err;}});
                            });

                            sql = `
                                INSERT INTO qachat SET id_joueur="${interaction.user.id}",
                                                       id_salon="${interaction.channelId}",
                                                       ressource="${ressource}",
                                                       quantite='${quantite}',
                                                       prix='${prix}',
                                                       prix_u='${prix_u}';
                                UPDATE pays SET cash=cash-${prix} WHERE id_joueur="${id_joueur}";
                                UPDATE ressources SET ${res}=${res}+${quantite} WHERE id_joueur="${id_joueur}";
                                INSERT INTO historique SET id_joueur="${interaction.user.id}",
                                                           id_salon="${interaction.channelId}",
                                                           type="qachat",
                                                           ressource="${ressource}",
                                                           quantite='${quantite}',
                                                           prix='${prix}',
                                                           prix_u='${prix_u}'`;
                            connection.query(sql, async (err) => {if (err) {throw err;}});
                        }
                    });
                } else {
                    reponse = codeBlock('diff', `- Vous n'êtes pas l'auteur de cette commande`);
                    interaction.reply({content: reponse, ephemeral: true});
                }
                //endregion
            } else if (interaction.customId.includes('refuser') === true) {
                //region Refuser
                id_joueur = interaction.customId.slice(8);
                if (id_joueur === interaction.member.id) {
                    interaction.message.delete()
                } else {
                    reponse = codeBlock('diff', `- Vous n'êtes pas l'auteur de cette commande`);
                    interaction.reply({content: reponse, ephemeral: true});
                }
                //endregion
            } else if (interaction.customId.includes('supprimer') === true) {
                //region Supprimer
                id_joueur = interaction.customId.slice(10);
                if (id_joueur === interaction.member.id) {

                    fields = interaction.message.embeds[0].fields;
                    espace = fields[0].value.indexOf("Prix");
                    ressource = fields[0].value.slice(6, espace - 3);

                    quantite = interaction.message.embeds[0].fields[1].value.slice(6, fields[1].value.length - 4);
                    const search = ',';
                    const replaceWith = '';
                    const quantite = parseInt(quantite.split(search).join(replaceWith));

                    switch (ressource) {
                        case 'Biens de consommation':
                            res = `bc`;
                            break;
                        case 'Bois':
                            res = `bois`;
                            break;
                        case 'Brique':
                            res = `brique`;
                            break;
                        case 'Eau':
                            res = `eau`;
                            break;
                        case 'Metaux':
                            res = `metaux`;
                            break;
                        case 'Nourriture':
                            res = `nourriture`;
                            break;
                        case 'Petrole':
                            res = `petrole`;
                            break;
                    }

                    sql = `UPDATE ressources SET ${res}=${res}+${quantite} WHERE id_joueur="${interaction.user.id}"`;
                    connection.query(sql, async (err) => {if (err) {throw err;}})
                    interaction.channel.delete()
                } else {
                    reponse = codeBlock('diff', `- Vous n'êtes pas l'auteur de cette offre`);
                    interaction.reply({content: reponse, ephemeral: true});
                }
                //endregion
            } else if (interaction.customId.includes('explorateur') === true) {
                //region Explorateur
                id_joueur = interaction.customId.slice(12);
                if (id_joueur === interaction.member.id) {
                    const sql = `
                        SELECT * FROM diplomatie WHERE id_joueur='${id_joueur}';
                        SELECT * FROM pays WHERE id_joueur='${id_joueur}';
                        SELECT * FROM population WHERE id_joueur='${id_joueur}';
                        SELECT * FROM territoire WHERE id_joueur='${id_joueur}'
                    `;
                    connection.query(sql, async (err, results) => {if (err) {throw err;}
                        const Diplomatie = results[0][0];
                        const Pays = results[1][0];
                        const Population = results[2][0];
                        const Territoire = results[3][0];

                        const explorateurCooldown = new CommandCooldown('explorateur', ms(`${eval(`regionObject.${Territoire.region}.cooldown`)}min`));
                        const userCooldowned = await explorateurCooldown.getUser(interaction.member.id);
                        if (userCooldowned) {
                            const timeLeft = msToMinutes(userCooldowned.msLeft, false);
                            const reponse = codeBlock('ansi', `\u001b[0m\u001b[1;31mVous avez déjà envoyé l'explorateur récemment. Il reste ${timeLeft.hours}h ${timeLeft.minutes}min avant que celui-ci ne reviennent.`);
                            await interaction.reply({content: reponse, ephemeral: true});
                        } else {
                            function convertMillisecondsToTime(milliseconds) {
                                const seconds = Math.floor(milliseconds / 1000);
                                const hours = Math.floor(seconds / 3600);
                                const minutes = Math.floor((seconds % 3600) / 60);
                                const remainingSeconds = seconds % 60;
                                return `${hours} heures, ${minutes} minutes, ${remainingSeconds} secondes`;
                            }

                            const embedSuccess = {
                                author: {
                                    name: `${Pays.rang} de ${Pays.nom}`,
                                    icon_url: interaction.member.displayAvatarURL()
                                },
                                thumbnail: {
                                    url: Pays.drapeau
                                },
                                title: `\`Expansion territoriale\``,
                                description: codeBlock(
                                    `• Vous avez envoyé l'explorateur en mission.\n` +
                                    `• Celui-ci vous notifira de sa rentrée dans ${convertMillisecondsToTime(ms(`${eval(`regionObject.${Territoire.region}.cooldown`)}min`))}.`) + `\u200B`,
                                color: interaction.member.displayHexColor,
                                timestamp: new Date(),
                                footer: {
                                    text: `${Pays.devise}`
                                },
                            };
                            await interaction.reply({embeds: [embedSuccess]});
                            await explorateurCooldown.addUser(interaction.member.id);
                            await wait(ms(`${eval(`regionObject.${Territoire.region}.cooldown`)}min`))

                            const arrayBiome = Object.keys(eval(`regionObject.${Territoire.region}.biome`));
                            const arrayChance = Object.values(eval(`regionObject.${Territoire.region}.biome`)).map(item => item.chance);
                            const biomeChoisi = chance.weighted(arrayBiome, arrayChance)
                            const tailleChoisi = chance.integer({
                                min: parseInt(eval(`regionObject.${Territoire.region}.biome.${biomeChoisi}.min`)),
                                max: parseInt(eval(`regionObject.${Territoire.region}.biome.${biomeChoisi}.max`))
                            })

                            const embedRevenu = {
                                author: {
                                    name: `${Pays.rang} de ${Pays.nom}`,
                                    icon_url: interaction.member.displayAvatarURL()
                                },
                                thumbnail: {
                                    url: Pays.drapeau
                                },
                                title: `\`Expansion territoriale\``,
                                fields: [
                                    {
                                        name: `L'explorateur est revenu de mission`,
                                        value: codeBlock(
                                            `• Il a trouvé ${eval(`regionObject.${Territoire.region}.biome.${biomeChoisi}.nom`)} de ${tailleChoisi} km²`) + `\u200B`
                                    }
                                ],
                                color: interaction.member.displayHexColor,
                                timestamp: new Date(),
                                footer: {
                                    text: `${Pays.devise}`
                                },
                            };

                            const row1 = new MessageActionRow()
                                .addComponents(
                                    new MessageButton()
                                        .setLabel(`Intégrer`)
                                        .setEmoji(`✔`)
                                        .setCustomId('integrer-' + interaction.member.id)
                                        .setStyle('SUCCESS'),
                                )
                                .addComponents(
                                    new MessageButton()
                                        .setLabel(`Refuser`)
                                        .setEmoji(`✖`)
                                        .setCustomId('refuser-' + interaction.member.id)
                                        .setStyle('DANGER'),
                                )

                            function bouton(message) {
                                return new MessageActionRow()
                                    .addComponents(
                                        new MessageButton()
                                            .setLabel(`Lien vers le message`)
                                            .setEmoji(`🗺️`)
                                            .setURL(message.url)
                                            .setStyle('LINK'),
                                    )
                            }

                            interaction.fetchReply()
                                .then(reponse => reponse.reply({embeds: [embedRevenu], components: [row1]})
                                    .then(message =>
                                        interaction.user.send({embeds: [embedRevenu], components: [bouton(message)]})))
                        }
                    })
                } else {
                    reponse = codeBlock('diff', `- Vous n'êtes pas l'auteur de cette commande`);
                    interaction.reply({content: reponse, ephemeral: true});
                }
                //endregion
            } else if (interaction.customId.includes('integrer') === true) {
                //region Intégrer
                id_joueur = interaction.customId.slice(9);
                if (id_joueur === interaction.member.id) {

                    const description = interaction.message.embeds[0].fields[0];
                    const de = description.value.lastIndexOf("de");
                    const km = description.value.indexOf("km²");
                    const taille = description.value.slice(de + 3, km - 1);
                    const spaceIndices = [];
                    for (let i = 0; i < description.value.length; i++) {
                        if (description.value[i] === " ") {
                            spaceIndices.push(i);
                        }
                    }
                    const biome = description.value.slice(spaceIndices[5] + 1, de - 1);
                    let sql = `UPDATE territoire SET T_total=T_total+${taille}, 
                                                     T_controle=T_controle+${taille}, 
                                                     ${biome.toLowerCase()}=${biome.toLowerCase()}+${taille} WHERE id_joueur='${interaction.member.id}'`;
                    connection.query(sql, async(err) => {if (err) {throw err;}});
                    sql = `
                        SELECT * FROM pays WHERE id_joueur='${interaction.member.id}';
                        SELECT * FROM territoire WHERE id_joueur='${interaction.member.id}'
                    `;
                    connection.query(sql, async(err, results) => {if (err) {throw err;}
                        const Pays = results[0][0];
                        const Territoire = results[1][0];

                        if(Math.floor(Territoire.T_total/15000) !== Territoire.hexagone) {
                            let sql = `UPDATE territoire SET hexagone=territoire.hexagone+1 WHERE id_joueur='${interaction.member.id}'`;
                            connection.query(sql, async(err) => {if (err) {throw err;}});
                            const direction = chance.pickone(['Nord', 'Nord-Est', 'Est', 'Sud-Est', 'Sud', 'Sud-Ouest', 'Ouest', 'Nord-Ouest']);
                            const annonce = {
                                author: {
                                    name: `${Pays.rang} de ${Pays.nom}`,
                                    icon_url: interaction.member.displayAvatarURL()
                                },
                                thumbnail: {
                                    url: Pays.drapeau,
                                },
                                title: `\`Expansion territoriale\``,
                                description: codeBlock(
                                    `• ${Pays.regime} de ${Pays.nom} contrôle une nouvelle case en ${eval(`regionObject.${Territoire.region}.nom`)}\n` +
                                    `• Direction : ${direction}`) + `\u200B`
                                ,
                                timestamp: new Date(),
                                footer: {
                                    text: `${Pays.devise}`
                                },
                                color: interaction.member.displayHexColor
                            };

                            const salon_carte = interaction.client.channels.cache.get(process.env.SALON_CARTE);
                            salon_carte.send({ embeds: [annonce] });

                            const reponse = `__**Vous vous êtes étendu sur une nouvelle case : ${salon_carte}**__`;
                            interaction.reply(reponse)
                        }

                        function convertMillisecondsToTime(milliseconds) {
                            const seconds = Math.floor(milliseconds / 1000);
                            const hours = Math.floor(seconds / 3600);
                            const minutes = Math.floor((seconds % 3600) / 60);
                            const remainingSeconds = seconds % 60;
                            return `${hours} heures, ${minutes} minutes, ${remainingSeconds} secondes`;
                        }

                        const embed = {
                            author: {
                                name: interaction.message.embeds[0].author.name,
                                icon_url: interaction.member.displayAvatarURL()
                            },
                            thumbnail: {
                                url: interaction.message.embeds[0].thumbnail.url
                            },
                            title: interaction.message.embeds[0].title,
                            fields: {
                                name: `‎`,
                                value: codeBlock(
                                    `• Vous avez intégré${description.value.slice(spaceIndices[3], de - 1)} de ${taille} km² à votre territoire contôlé.\n` +
                                    `• Celui-ci deviendra national dans ${convertMillisecondsToTime(ms(`2min`) * eval(`gouvernementObject.${Pays.ideologie}.assimilation`))}.`) + `\u200B`
                            },
                            color: interaction.member.displayHexColor,
                            timestamp: new Date(),
                            footer: {
                                text: interaction.message.embeds[0].footer.text
                            },
                        };
                        interaction.message.edit({embeds: [embed], components: []});

                        await wait(ms(`2min`) * eval(`gouvernementObject.${Pays.ideologie}.assimilation`))

                        sql = `UPDATE territoire SET T_national=T_national+${taille}, 
                                                     T_libre=T_libre+${taille}, 
                                                     T_controle=T_controle-${taille}  WHERE id_joueur='${interaction.member.id}'`;
                        connection.query(sql, async(err) => {if (err) {throw err;}});
                    })
                } else {
                    reponse = codeBlock('diff', `- Vous n'êtes pas l'auteur de cette commande`);
                    interaction.reply({content: reponse, ephemeral: true});
                }
                //endregion
            }
            //endregion
        } else if (interaction.isSelectMenu()) {
            //region Select Menu
            log = {
                author: {
                    name: interaction.member.displayName,
                    icon_url: interaction.member.displayAvatarURL()
                },
                title: `\`Select Menu\``,
                description: `${interaction.customId} ${JSON.stringify(interaction.values)}`,
                timestamp: new Date(),
                footer: {
                    text: '#' + interaction.channel.name
                },
            };

            const salon_logs = interaction.client.channels.cache.get(process.env.SALON_LOGS);
            salon_logs.send({embeds: [log]});

            //region Usine
            if (interaction.customId === 'usine') {
                sql = `
                    SELECT * FROM batiments WHERE id_joueur=${interaction.member.id};
                    SELECT * FROM pays WHERE id_joueur=${interaction.member.id};
                    SELECT * FROM ressources WHERE id_joueur=${interaction.member.id};
                    SELECT * FROM territoire WHERE id_joueur='${interaction.member.id}'
                `;
                connection.query(sql, async (err, results) => {if (err) {throw err;}
                    const Batiment = results[0][0];
                    const Pays = results[1][0];
                    const Ressource = results[2][0];
                    const Territoire = results[3][0];
                    let electricite;
                    let diff;
                    let conso;

                    const ressourceObject = JSON.parse(readFileSync('data/ressource.json', 'utf-8'));
                    const gouvernementObject = JSON.parse(readFileSync('data/gouvernement.json', 'utf-8'));
                    const batimentObject = JSON.parse(readFileSync('data/batiment.json', 'utf-8'));

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
                    //region Briqueterie
                    if (interaction.values == 'briqueterie') {
                        const coef = parseFloat((pourVille * ressourceObject.brique.ville + pourForet * ressourceObject.brique.foret + pourPrairie * ressourceObject.brique.prairie + pourDesert * ressourceObject.brique.desert + pourToundra * ressourceObject.brique.toundra + pourTaiga * ressourceObject.brique.taiga + pourSavane * ressourceObject.brique.savane + pourRocheuses * ressourceObject.brique.rocheuses + pourVolcan * ressourceObject.brique.volcan + pourMangrove * ressourceObject.brique.mangrove + pourSteppe * ressourceObject.brique.steppe).toFixed(2))

                        const prod_briqueterie = Math.round(batimentObject.briqueterie.PROD_BRIQUETERIE * eval(`gouvernementObject.${Pays.ideologie}.production`) * coef);
                        const conso_briqueterie_bois = Math.round(batimentObject.briqueterie.CONSO_BRIQUETERIE_BOIS * eval(`gouvernementObject.${Pays.ideologie}.consommation`));
                        const conso_briqueterie_eau = Math.round(batimentObject.briqueterie.CONSO_BRIQUETERIE_EAU * eval(`gouvernementObject.${Pays.ideologie}.consommation`));
                        const conso_briqueterie_elec = Math.round(batimentObject.briqueterie.CONSO_BRIQUETERIE_ELECTRICITE);

                        const embed = {
                            author: {
                                name: `${Pays.rang} de ${Pays.nom}`,
                                icon_url: interaction.member.displayAvatarURL()
                            },
                            thumbnail: {
                                url: Pays.drapeau
                            },
                            title: `\`Usine : Briqueterie\``,
                            fields: [
                                {
                                    name: `> Consommation : 🪵💧`,
                                    value: `- Par usine : \n` +
                                        codeBlock(
                                            `• Bois : ${conso_briqueterie_bois.toLocaleString('en-US')}\n` +
                                            `• Eau : ${conso_briqueterie_eau.toLocaleString('en-US')}`) +
                                        codeBlock(
                                            `• ⚡ Electricité : ${conso_briqueterie_elec.toLocaleString('en-US')}`) + `\u200B`,
                                    inline: true
                                },
                                {
                                    name: `\u200B`,
                                    value: `- Totale : \n` +
                                        codeBlock(
                                            `• Bois : ${(conso_briqueterie_bois * Batiment.briqueterie).toLocaleString('en-US')}\n` +
                                            `• Eau : ${(conso_briqueterie_eau * Batiment.briqueterie).toLocaleString('en-US')}`) +
                                        codeBlock(
                                            `• ⚡ Electricité : ${(conso_briqueterie_elec * Batiment.briqueterie).toLocaleString('en-US')}`) + `\u200B`,
                                    inline: true
                                },
                                {
                                    name: `> Production :`,
                                    value: `Ressource : 🧱 brique\n` +
                                        codeBlock(
                                            `• Par usine : ${prod_briqueterie.toLocaleString('en-US')}\n` +
                                            `• Totale : ${(prod_briqueterie * Batiment.briqueterie).toLocaleString('en-US')}`) + `\u200B`
                                },
                                {
                                    name: `> En réserve :`,
                                    value: codeBlock(`• ${Ressource.brique.toLocaleString('en-US')}`) + `\u200B`
                                },
                            ],
                            color: interaction.member.displayHexColor,
                            timestamp: new Date(),
                            footer: {
                                text: `${Pays.devise}`
                            }
                        };

                        interaction.reply({embeds: [embed]})
                        //endregion
                        //region Champ
                    } else if (interaction.values == 'champ') {
                        const coef = parseFloat((pourVille * ressourceObject.nourriture.ville + pourForet * ressourceObject.nourriture.foret + pourPrairie * ressourceObject.nourriture.prairie + pourDesert * ressourceObject.nourriture.desert + pourToundra * ressourceObject.nourriture.toundra + pourTaiga * ressourceObject.nourriture.taiga + pourSavane * ressourceObject.nourriture.savane + pourRocheuses * ressourceObject.nourriture.rocheuses + pourVolcan * ressourceObject.nourriture.volcan + pourMangrove * ressourceObject.nourriture.mangrove + pourSteppe * ressourceObject.nourriture.steppe).toFixed(2))

                        const prod_champ = Math.round(batimentObject.champ.PROD_CHAMP * eval(`gouvernementObject.${Pays.ideologie}.production`) * coef);
                        const conso_champ_eau = Math.round(batimentObject.champ.CONSO_CHAMP_EAU * eval(`gouvernementObject.${Pays.ideologie}.consommation`));
                        const conso_champ_elec = Math.round(batimentObject.champ.CONSO_CHAMP_ELECTRICITE);

                        const embed = {
                            author: {
                                name: `${Pays.rang} de ${Pays.nom}`,
                                icon_url: interaction.member.displayAvatarURL()
                            },
                            thumbnail: {
                                url: Pays.drapeau
                            },
                            title: `\`Usine : Champ\``,
                            fields: [
                                {
                                    name: `> Consommation : 💧`,
                                    value: `- Par usine : \n` +
                                        codeBlock(`• Eau : ${conso_champ_eau.toLocaleString('en-US')}`) +
                                        codeBlock(`• ⚡ Electricité : ${conso_champ_elec.toLocaleString('en-US')}`) + `\u200B`,
                                    inline: true
                                },
                                {
                                    name: `\u200B`,
                                    value: `- Totale : \n` +
                                        codeBlock(`• Eau : ${(conso_champ_eau * Batiment.champ).toLocaleString('en-US')}`) +
                                        codeBlock(
                                            `• ⚡ Electricité : ${(conso_champ_elec * Batiment.champ).toLocaleString('en-US')}`) + `\u200B`,
                                    inline: true
                                },
                                {
                                    name: `> Production :`,
                                    value: `Ressource : 🌽 Nourriture\n` +
                                        codeBlock(
                                            `• Par usine : ${prod_champ.toLocaleString('en-US')}\n` +
                                            `• Totale : ${(prod_champ * Batiment.champ).toLocaleString('en-US')}`) + `\u200B`
                                },
                                {
                                    name: `> En réserve :`,
                                    value: codeBlock(`• ${Ressource.nourriture.toLocaleString('en-US')}`) + `\u200B`
                                },
                            ],
                            color: interaction.member.displayHexColor,
                            timestamp: new Date(),
                            footer: {
                                text: `${Pays.devise}`
                            }
                        };

                        interaction.reply({embeds: [embed]})
                        //endregion
                    } else if (interaction.values == 'centrale_fioul') {
                        //region Centrale au fioul
                        const coef = parseFloat((pourVille * ressourceObject.electricite.ville + pourForet * ressourceObject.electricite.foret + pourPrairie * ressourceObject.electricite.prairie + pourDesert * ressourceObject.electricite.desert + pourToundra * ressourceObject.electricite.toundra + pourTaiga * ressourceObject.electricite.taiga + pourSavane * ressourceObject.electricite.savane + pourRocheuses * ressourceObject.electricite.rocheuses + pourVolcan * ressourceObject.electricite.volcan + pourMangrove * ressourceObject.electricite.mangrove + pourSteppe * ressourceObject.electricite.steppe).toFixed(2))

                        const prod_centrale_fioul = Math.round(batimentObject.centrale_fioul.PROD_CENTRALE_FIOUL);
                        const prod_elec_eolienne = Math.round(batimentObject.eolienne.PROD_EOLIENNE * coef);
                        const conso_centrale_fioul_petrole = Math.round(batimentObject.centrale_fioul.CONSO_CENTRALE_FIOUL_PETROLE);

                        const conso = batimentObject.briqueterie.CONSO_BRIQUETERIE_ELECTRICITE * Batiment.briqueterie + batimentObject.champ.CONSO_CHAMP_ELECTRICITE * Batiment.champ + batimentObject.mine.CONSO_MINE_ELECTRICITE * Batiment.mine + batimentObject.pompe_a_eau.CONSO_POMPE_A_EAU_ELECTRICITE * Batiment.pompe_a_eau + batimentObject.pumpjack.CONSO_PUMPJACK_ELECTRICITE * Batiment.pumpjack + batimentObject.quartier.CONSO_QUARTIER_ELECTRICITE * Batiment.quartier + batimentObject.scierie.CONSO_SCIERIE_ELECTRICITE * Batiment.scierie + batimentObject.usine_civile.CONSO_USINE_CIVILE_ELECTRICITE * Batiment.usine_civile;
                        const diff = ((prod_centrale_fioul * Batiment.centrale_fioul + prod_elec_eolienne * Batiment.eolienne * coef) - conso);
                        if (diff > 0) {
                            electricite = codeBlock('py', `'${conso.toLocaleString('en-US')}/${(prod_centrale_fioul * Batiment.centrale_fioul + prod_elec_eolienne * Batiment.eolienne * coef).toLocaleString('en-US')} | ${((prod_centrale_fioul * Batiment.centrale_fioul + prod_elec_eolienne * Batiment.eolienne * coef) - conso).toLocaleString('en-US')}'`);
                        } else if (diff === 0) {
                            electricite = codeBlock('fix', `${conso.toLocaleString('en-US')}/${(prod_centrale_fioul * Batiment.centrale_fioul + prod_elec_eolienne * Batiment.eolienne * coef).toLocaleString('en-US')} | ${((prod_centrale_fioul * Batiment.centrale_fioul + prod_elec_eolienne * Batiment.eolienne * coef) - conso).toLocaleString('en-US')}`);
                        } else {
                            electricite = codeBlock('diff', `- ${conso.toLocaleString('en-US')}/${(prod_centrale_fioul * Batiment.centrale_fioul + prod_elec_eolienne * Batiment.eolienne * coef).toLocaleString('en-US')} | ${((prod_centrale_fioul * Batiment.centrale_fioul + prod_elec_eolienne * Batiment.eolienne * coef) - conso).toLocaleString('en-US')}`);
                        }

                        const embed = {
                            author: {
                                name: `${Pays.rang} de ${Pays.nom}`,
                                icon_url: interaction.member.displayAvatarURL()
                            },
                            thumbnail: {
                                url: Pays.drapeau
                            },
                            title: `\`Usine : Centrale au fioul\``,
                            fields: [
                                {
                                    name: `> Consommation : 🛢️`,
                                    value: `- Par usine : \n` +
                                        codeBlock(`• Pétrole : ${conso_centrale_fioul_petrole.toLocaleString('en-US')}`) + `\u200B`,
                                    inline: true
                                },
                                {
                                    name: `\u200B`,
                                    value: `- Totale : \n` +
                                        codeBlock(`• Petrole : ${(conso_centrale_fioul_petrole * Batiment.centrale_fioul).toLocaleString('en-US')}`) + `\u200B`,
                                    inline: true
                                },
                                {
                                    name: `> Production :`,
                                    value: `Flux : ⚡ Electricité\n` +
                                        codeBlock(
                                            `• Par usine : ${(prod_centrale_fioul * Batiment.centrale_fioul).toLocaleString('en-US')}\n` +
                                            `• Totale : ${(prod_centrale_fioul * Batiment.centrale_fioul + prod_elec_eolienne * Batiment.eolienne * coef).toLocaleString('en-US')}`) + `\u200B`
                                },
                                {
                                    name: `> Flux :`,
                                    value: electricite + `\u200B`
                                },
                            ],
                            color: interaction.member.displayHexColor,
                            timestamp: new Date(),
                            footer: {
                                text: `${Pays.devise}`
                            }
                        };

                        interaction.reply({embeds: [embed]})
                        //endregion
                    } else if (interaction.values == 'eolienne') {
                        //region Eolienne
                        const coef = parseFloat((pourVille * ressourceObject.electricite.ville + pourForet * ressourceObject.electricite.foret + pourPrairie * ressourceObject.electricite.prairie + pourDesert * ressourceObject.electricite.desert + pourToundra * ressourceObject.electricite.toundra + pourTaiga * ressourceObject.electricite.taiga + pourSavane * ressourceObject.electricite.savane + pourRocheuses * ressourceObject.electricite.rocheuses + pourVolcan * ressourceObject.electricite.volcan + pourMangrove * ressourceObject.electricite.mangrove + pourSteppe * ressourceObject.electricite.steppe).toFixed(2))

                        const prod_centrale_fioul = Math.round(batimentObject.centrale_fioul.PROD_CENTRALE_FIOUL);
                        const prod_elec_eolienne = Math.round(batimentObject.eolienne.PROD_EOLIENNE * coef);
                        const conso_centrale_fioul_petrole = Math.round(batimentObject.centrale_fioul.CONSO_CENTRALE_FIOUL_PETROLE);

                        const conso = batimentObject.briqueterie.CONSO_BRIQUETERIE_ELECTRICITE * Batiment.briqueterie + batimentObject.champ.CONSO_CHAMP_ELECTRICITE * Batiment.champ + batimentObject.mine.CONSO_MINE_ELECTRICITE * Batiment.mine + batimentObject.pompe_a_eau.CONSO_POMPE_A_EAU_ELECTRICITE * Batiment.pompe_a_eau + batimentObject.pumpjack.CONSO_PUMPJACK_ELECTRICITE * Batiment.pumpjack + batimentObject.quartier.CONSO_QUARTIER_ELECTRICITE * Batiment.quartier + batimentObject.scierie.CONSO_SCIERIE_ELECTRICITE * Batiment.scierie + batimentObject.usine_civile.CONSO_USINE_CIVILE_ELECTRICITE * Batiment.usine_civile;
                        const diff = ((prod_centrale_fioul * Batiment.centrale_fioul + prod_elec_eolienne * Batiment.eolienne * coef) - conso);
                        if (diff > 0) {
                            electricite = codeBlock('py', `'${conso.toLocaleString('en-US')}/${(prod_centrale_fioul * Batiment.centrale_fioul + prod_elec_eolienne * Batiment.eolienne * coef).toLocaleString('en-US')} | ${((prod_centrale_fioul * Batiment.centrale_fioul + prod_elec_eolienne * Batiment.eolienne * coef) - conso).toLocaleString('en-US')}'`);
                        } else if (diff === 0) {
                            electricite = codeBlock('fix', `${conso.toLocaleString('en-US')}/${(prod_centrale_fioul * Batiment.centrale_fioul + prod_elec_eolienne * Batiment.eolienne * coef).toLocaleString('en-US')} | ${((prod_centrale_fioul * Batiment.centrale_fioul + prod_elec_eolienne * Batiment.eolienne * coef) - conso).toLocaleString('en-US')}`);
                        } else {
                            electricite = codeBlock('diff', `- ${conso.toLocaleString('en-US')}/${(prod_centrale_fioul * Batiment.centrale_fioul + prod_elec_eolienne * Batiment.eolienne * coef).toLocaleString('en-US')} | ${((prod_centrale_fioul * Batiment.centrale_fioul + prod_elec_eolienne * Batiment.eolienne * coef) - conso).toLocaleString('en-US')}`);
                        }

                        const embed = {
                            author: {
                                name: `${Pays.rang} de ${Pays.nom}`,
                                icon_url: interaction.member.displayAvatarURL()
                            },
                            thumbnail: {
                                url: Pays.drapeau
                            },
                            title: `\`Usine : Eolienne\``,
                            fields: [
                                {
                                    name: `> Production :`,
                                    value: `Flux : ⚡ Electricité\n` +
                                        codeBlock(
                                            `• Par usine : ${Math.round(batimentObject.eolienne.PROD_EOLIENNE).toLocaleString('en-US')}\n` +
                                            `• Totale : ${(prod_eolienne * Batiment.eolienne).toLocaleString('en-US')}`) + `\u200B`
                                },
                                {
                                    name: `> Flux :`,
                                    value: electricite + `\u200B`
                                },
                            ],
                            color: interaction.member.displayHexColor,
                            timestamp: new Date(),
                            footer: {
                                text: `${Pays.devise}`
                            }
                        };

                        interaction.reply({embeds: [embed]})
                        //endregion
                    } else if (interaction.values == 'mine') {
                        //region Mine
                        const coef = parseFloat((pourVille * ressourceObject.metaux.ville + pourForet * ressourceObject.metaux.foret + pourPrairie * ressourceObject.metaux.prairie + pourDesert * ressourceObject.metaux.desert + pourToundra * ressourceObject.metaux.toundra + pourTaiga * ressourceObject.metaux.taiga + pourSavane * ressourceObject.metaux.savane + pourRocheuses * ressourceObject.metaux.rocheuses + pourVolcan * ressourceObject.metaux.volcan + pourMangrove * ressourceObject.metaux.mangrove + pourSteppe * ressourceObject.metaux.steppe).toFixed(2))

                        const prod_mine = Math.round(batimentObject.mine.PROD_MINE * eval(`gouvernementObject.${Pays.ideologie}.production`) * coef);
                        const conso_mine_bois = Math.round(batimentObject.mine.CONSO_MINE_BOIS * eval(`gouvernementObject.${Pays.ideologie}.consommation`));
                        const conso_mine_petrole = Math.round(batimentObject.mine.CONSO_MINE_PETROLE * eval(`gouvernementObject.${Pays.ideologie}.consommation`));
                        const conso_mine_elec = Math.round(batimentObject.mine.CONSO_MINE_ELECTRICITE);

                        const embed = {
                            author: {
                                name: `${Pays.rang} de ${Pays.nom}`,
                                icon_url: interaction.member.displayAvatarURL()
                            },
                            thumbnail: {
                                url: Pays.drapeau
                            },
                            title: `\`Usine : Mine\``,
                            fields: [
                                {
                                    name: `> Consommation :`,
                                    value: `- Par usine : 🪵🛢️\n` +
                                        codeBlock(
                                            `• Bois : ${conso_mine_bois.toLocaleString('en-US')}\n` +
                                            `• Pétrole : ${conso_mine_petrole.toLocaleString('en-US')}`) +
                                        codeBlock(
                                            `• ⚡ Electricité : ${conso_mine_elec.toLocaleString('en-US')}`) + `\u200B`,
                                    inline: true
                                },
                                {
                                    name: `\u200B`,
                                    value: `- Totale : \n` +
                                        codeBlock(
                                            `• Bois : ${(conso_mine_bois * Batiment.mine).toLocaleString('en-US')}\n` +
                                            `• Pétrole : ${(conso_mine_petrole * Batiment.mine).toLocaleString('en-US')}`) +
                                        codeBlock(
                                            `• ⚡ Electricité : ${(conso_mine_elec * Batiment.mine).toLocaleString('en-US')}`) + `\u200B`,
                                    inline: true
                                },
                                {
                                    name: `> Production :`,
                                    value: `Ressource : 🪨 Métaux\n` +
                                        codeBlock(
                                            `• Par usine : ${prod_mine.toLocaleString('en-US')}\n` +
                                            `• Totale : ${(prod_mine * Batiment.mine).toLocaleString('en-US')}`) + `\u200B`
                                },
                                {
                                    name: `> En réserve :`,
                                    value: codeBlock(`• ${Ressource.metaux.toLocaleString('en-US')}`) + `\u200B`
                                },
                            ],
                            color: interaction.member.displayHexColor,
                            timestamp: new Date(),
                            footer: {
                                text: `${Pays.devise}`
                            }
                        };

                        interaction.reply({embeds: [embed]})
                        //endregion
                    } else if (interaction.values == 'pompe_a_eau') {
                        //region Pompe à eau
                        const coef = parseFloat((pourVille * ressourceObject.eau.ville + pourForet * ressourceObject.eau.foret + pourPrairie * ressourceObject.eau.prairie + pourDesert * ressourceObject.eau.desert + pourToundra * ressourceObject.eau.toundra + pourTaiga * ressourceObject.eau.taiga + pourSavane * ressourceObject.eau.savane + pourRocheuses * ressourceObject.eau.rocheuses + pourVolcan * ressourceObject.eau.volcan + pourMangrove * ressourceObject.eau.mangrove + pourSteppe * ressourceObject.eau.steppe).toFixed(2))

                        const prod_pompe_a_eau = Math.round(batimentObject.pompe_a_eau.PROD_POMPE_A_EAU * eval(`gouvernementObject.${Pays.ideologie}.production`) * coef);
                        const conso_pompe_a_eau_petrole = Math.round(batimentObject.pompe_a_eau.CONSO_POMPE_A_EAU_PETROLE * eval(`gouvernementObject.${Pays.ideologie}.consommation`));
                        const conso_pompe_a_eau_elec = Math.round(batimentObject.pompe_a_eau.CONSO_POMPE_A_EAU_ELECTRICITE);

                        const embed = {
                            author: {
                                name: `${Pays.rang} de ${Pays.nom}`,
                                icon_url: interaction.member.displayAvatarURL()
                            },
                            thumbnail: {
                                url: Pays.drapeau
                            },
                            title: `\`Usine : Pompe à eau\``,
                            fields: [
                                {
                                    name: `> Consommation : 🛢️`,
                                    value: `- Par usine : \n` +
                                        codeBlock(`• Pétrole : ${conso_pompe_a_eau_petrole.toLocaleString('en-US')}\n`) +
                                        codeBlock(`• ⚡ Electricité : ${conso_pompe_a_eau_elec.toLocaleString('en-US')}`) + `\u200B`,
                                    inline: true
                                },
                                {
                                    name: `\u200B`,
                                    value: `- Totale : \n` +
                                        codeBlock(`• Pétrole : ${(conso_pompe_a_eau_petrole * Batiment.pompe_a_eau).toLocaleString('en-US')}`) +
                                        codeBlock(`• ⚡ Electricité : ${(conso_pompe_a_eau_elec * Batiment.pompe_a_eau).toLocaleString('en-US')}`) + `\u200B`,
                                    inline: true
                                },
                                {
                                    name: `> Production :`,
                                    value: `Ressource : 💧 Eau\n` +
                                        codeBlock(
                                            `• Par usine : ${prod_pompe_a_eau.toLocaleString('en-US')}\n` +
                                            `• Totale : ${(prod_pompe_a_eau * Batiment.pompe_a_eau).toLocaleString('en-US')}`) + `\u200B`
                                },
                                {
                                    name: `> En réserve :`,
                                    value: codeBlock(`• ${Ressource.eau.toLocaleString('en-US')}`) + `\u200B`
                                },
                            ],
                            color: interaction.member.displayHexColor,
                            timestamp: new Date(),
                            footer: {
                                text: `${Pays.devise}`
                            }
                        };

                        interaction.reply({embeds: [embed]})
                        //endregion
                    } else if (interaction.values == 'pumpjack') {
                        //region Pumpjack
                        const coef = parseFloat((pourVille * ressourceObject.petrole.ville + pourForet * ressourceObject.petrole.foret + pourPrairie * ressourceObject.petrole.prairie + pourDesert * ressourceObject.petrole.desert + pourToundra * ressourceObject.petrole.toundra + pourTaiga * ressourceObject.petrole.taiga + pourSavane * ressourceObject.petrole.savane + pourRocheuses * ressourceObject.petrole.rocheuses + pourVolcan * ressourceObject.petrole.volcan + pourMangrove * ressourceObject.petrole.mangrove + pourSteppe * ressourceObject.petrole.steppe).toFixed(2))

                        const prod_pumpjack = Math.round(batimentObject.pumpjack.PROD_PUMPJACK * eval(`gouvernementObject.${Pays.ideologie}.production`) * coef);
                        const conso_pumpjack_elec = Math.round(batimentObject.pumpjack.CONSO_PUMPJACK_ELECTRICITE);

                        const embed = {
                            author: {
                                name: `${Pays.rang} de ${Pays.nom}`,
                                icon_url: interaction.member.displayAvatarURL()
                            },
                            thumbnail: {
                                url: Pays.drapeau
                            },
                            title: `\`Usine : Pumpjack\``,
                            fields: [
                                {
                                    name: `> Consommation :`,
                                    value: `- Par usine : \n` +
                                        codeBlock(
                                            `• ⚡ Electricité : ${conso_pumpjack_elec.toLocaleString('en-US')}`) + `\u200B`,
                                    inline: true
                                },
                                {
                                    name: `\u200B`,
                                    value: `- Totale : \n` +
                                        codeBlock(
                                            `• ⚡ Electricité : ${(conso_pumpjack_elec * Batiment.pumpjack).toLocaleString('en-US')}`) + `\u200B`,
                                    inline: true
                                },
                                {
                                    name: `> Production :`,
                                    value: `Ressource : 🛢️ Pétrole\n` +
                                        codeBlock(
                                            `• Par usine : ${prod_pumpjack.toLocaleString('en-US')}\n` +
                                            `• Totale : ${(prod_pumpjack * Batiment.pumpjack).toLocaleString('en-US')}`) + `\u200B`
                                },
                                {
                                    name: `> En réserve :`,
                                    value: codeBlock(`• ${Ressource.petrole.toLocaleString('en-US')}`) + `\u200B`
                                },
                            ],
                            color: interaction.member.displayHexColor,
                            timestamp: new Date(),
                            footer: {
                                text: `${Pays.devise}`
                            }
                        };

                        interaction.reply({embeds: [embed]})
                        //endregion
                    } else if (interaction.values == 'scierie') {
                        //region Scierie
                        const coef = parseFloat((pourVille * ressourceObject.bois.ville + pourForet * ressourceObject.bois.foret + pourPrairie * ressourceObject.bois.prairie + pourDesert * ressourceObject.bois.desert + pourToundra * ressourceObject.bois.toundra + pourTaiga * ressourceObject.bois.taiga + pourSavane * ressourceObject.bois.savane + pourRocheuses * ressourceObject.bois.rocheuses + pourVolcan * ressourceObject.bois.volcan + pourMangrove * ressourceObject.bois.mangrove + pourSteppe * ressourceObject.bois.steppe).toFixed(2))

                        const prod_scierie = Math.round(batimentObject.scierie.PROD_SCIERIE * eval(`gouvernementObject.${Pays.ideologie}.production`) * coef);
                        const conso_scierie_petrole = Math.round(batimentObject.scierie.CONSO_SCIERIE_PETROLE * eval(`gouvernementObject.${Pays.ideologie}.consommation`));
                        const conso_scierie_elec = Math.round(batimentObject.scierie.CONSO_SCIERIE_ELECTRICITE);

                        const embed = {
                            author: {
                                name: `${Pays.rang} de ${Pays.nom}`,
                                icon_url: interaction.member.displayAvatarURL()
                            },
                            thumbnail: {
                                url: Pays.drapeau
                            },
                            title: `\`Usine : Scierie\``,
                            fields: [
                                {
                                    name: `> Consommation : 🛢️`,
                                    value: `- Par usine : \n` +
                                        codeBlock(`• Pétrole : ${conso_scierie_petrole.toLocaleString('en-US')}`) +
                                        codeBlock(
                                            `• ⚡ Electricité : ${conso_scierie_elec.toLocaleString('en-US')}`) + `\u200B`,
                                    inline: true
                                },
                                {
                                    name: `\u200B`,
                                    value: `- Totale : \n` +
                                        codeBlock(`• Pétrole : ${(conso_scierie_petrole * Batiment.scierie).toLocaleString('en-US')}`) +
                                        codeBlock(
                                            `• ⚡ Electricité : ${(conso_scierie_elec * Batiment.scierie).toLocaleString('en-US')}`) + `\u200B`,
                                    inline: true
                                },
                                {
                                    name: `> Production :`,
                                    value: `Ressource : 🪵 Bois\n` +
                                        codeBlock(
                                            `• Par usine : ${prod_scierie.toLocaleString('en-US')}\n` +
                                            `• Totale : ${(prod_scierie * Batiment.scierie).toLocaleString('en-US')}`) + `\u200B`
                                },
                                {
                                    name: `> En réserve :`,
                                    value: codeBlock(`• ${Ressource.bois.toLocaleString('en-US')}`) + `\u200B`
                                },
                            ],
                            color: interaction.member.displayHexColor,
                            timestamp: new Date(),
                            footer: {
                                text: `${Pays.devise}`
                            }
                        };

                        interaction.reply({embeds: [embed]})
                        //endregion
                    } else if (interaction.values == 'usine_civile') {
                        //region Usine civile

                        const prod_usine_civile = Math.round(batimentObject.usine_civile.PROD_USINE_CIVILE * eval(`gouvernementObject.${Pays.ideologie}.production`));
                        const conso_usine_civile_bois = Math.round(batimentObject.usine_civile.CONSO_USINE_CIVILE_BOIS * eval(`gouvernementObject.${Pays.ideologie}.consommation`));
                        const conso_usine_civile_metaux = Math.round(batimentObject.usine_civile.CONSO_USINE_CIVILE_METAUX * eval(`gouvernementObject.${Pays.ideologie}.consommation`));
                        const conso_usine_civile_petrole = Math.round(batimentObject.usine_civile.CONSO_USINE_CIVILE_PETROLE * eval(`gouvernementObject.${Pays.ideologie}.consommation`));
                        const conso_usine_civile_elec = Math.round(batimentObject.usine_civile.CONSO_USINE_CIVILE_ELECTRICITE);

                        const embed = {
                            author: {
                                name: `${Pays.rang} de ${Pays.nom}`,
                                icon_url: interaction.member.displayAvatarURL()
                            },
                            thumbnail: {
                                url: Pays.drapeau
                            },
                            title: `\`Usine : Usine civile\``,
                            fields: [
                                {
                                    name: `> Consommation : 🪵🪨🛢️`,
                                    value: `- Par usine : \n` +
                                        codeBlock(
                                            `• Bois : ${conso_usine_civile_bois.toLocaleString('en-US')}\n` +
                                            `• Métaux : ${conso_usine_civile_metaux.toLocaleString('en-US')}\n` +
                                            `• Pétrole : ${conso_usine_civile_petrole.toLocaleString('en-US')}\n`) +
                                        codeBlock(
                                            `• ⚡ Electricité : ${conso_usine_civile_elec.toLocaleString('en-US')}`) + `\u200B`,
                                    inline: true
                                },
                                {
                                    name: `\u200B`,
                                    value: `- Totale :\n` +
                                        codeBlock(
                                            `• Bois : ${(conso_usine_civile_bois * Batiment.usine_civile).toLocaleString('en-US')}\n` +
                                            `• Métaux : ${(conso_usine_civile_metaux * Batiment.usine_civile).toLocaleString('en-US')}\n` +
                                            `• Pétrole : ${(conso_usine_civile_petrole * Batiment.usine_civile).toLocaleString('en-US')}`) +
                                        codeBlock(
                                            `• ⚡ Electricité : ${(conso_usine_civile_elec * Batiment.usine_civile).toLocaleString('en-US')}`) + `\u200B`,
                                    inline: true
                                },
                                {
                                    name: `> Production :`,
                                    value: `Ressource : 💻 Biens de consommation\n` +
                                        codeBlock(
                                            `• Par usine : ${prod_usine_civile.toLocaleString('en-US')}\n` +
                                            `• Totale : ${(prod_usine_civile * Batiment.usine_civile).toLocaleString('en-US')}`) + `\u200B`
                                },
                                {
                                    name: `> En réserve :`,
                                    value: codeBlock(`• ${Ressource.bc.toLocaleString('en-US')}`) + `\u200B`
                                },
                            ],
                            color: interaction.member.displayHexColor,
                            timestamp: new Date(),
                            footer: {
                                text: `${Pays.devise}`
                            }
                        };

                        interaction.reply({embeds: [embed]})
                        //endregion
                    }
                });
                //endregion
            } else if (interaction.customId === 'roles') {
                //region Rôles

                if (interaction.values.indexOf('annonce') != '-1') {
                    let role = interaction.guild.roles.cache.find(r => r.name === "📢 » Annonce");
                    interaction.member.roles.add(role)
                } else {
                    let role = interaction.guild.roles.cache.find(r => r.name === "📢 » Annonce");
                    interaction.member.roles.remove(role)
                }

                if (interaction.values.indexOf('concours') != '-1') {
                    let role = interaction.guild.roles.cache.find(r => r.name === "🏆 » Compétition");
                    interaction.member.roles.add(role)
                } else {
                    let role = interaction.guild.roles.cache.find(r => r.name === "🏆 » Compétition");
                    interaction.member.roles.remove(role)
                }

                if (interaction.values.indexOf('giveaway') != '-1') {
                    let role = interaction.guild.roles.cache.find(r => r.name === "🎁 » Giveaway");
                    interaction.member.roles.add(role)
                } else {
                    let role = interaction.guild.roles.cache.find(r => r.name === "🎁 » Giveaway");
                    interaction.member.roles.remove(role)
                }

                if (interaction.values.indexOf('animation') != '-1') {
                    let role = interaction.guild.roles.cache.find(r => r.name === "🧩 » Animation");
                    interaction.member.roles.add(role)
                } else {
                    let role = interaction.guild.roles.cache.find(r => r.name === "🧩 » Animation");
                    interaction.member.roles.remove(role)
                }

                if (interaction.values.indexOf('mise_a_jour') != '-1') {
                    let role = interaction.guild.roles.cache.find(r => r.name === "🎮 » Mise à jour");
                    interaction.member.roles.add(role)
                } else {
                    let role = interaction.guild.roles.cache.find(r => r.name === "🎮 » Mise à jour");
                    interaction.member.roles.remove(role)
                }

                interaction.reply({ content: '👍', ephemeral: true });
                //endregion
            } else if (interaction.customId === 'menu_start') {
                //region Start
                sql = `SELECT * FROM pays WHERE id_joueur=${interaction.member.id}`;
                connection.query(sql, async (err, results) => {if (err) {throw err;}
                    if (results.length === 0) {
                        function modalStart(region) {
                            const modal = new Modal()
                                .setCustomId(`start-${interaction.values[0]}`)
                                .setTitle(`Créer votre cité en ${region}`);

                            const nom_cite = new TextInputComponent()
                                .setCustomId('nom_cite')
                                .setLabel(`Quelle ville voulez-vous choisir ?`)
                                .setStyle('SHORT')
                                .setPlaceholder('Ne pas prendre une ville déjà prise par un autre joueur')
                                .setMaxLength(40)
                                .setRequired(true)

                            const firstActionRow = new MessageActionRow().addComponents(nom_cite);
                            modal.addComponents(firstActionRow);
                            interaction.showModal(modal);
                        }

                        switch (interaction.values[0]) {
                            case 'afrique_australe':
                                modalStart('Afrique australe')
                                break;
                            case 'afrique_equatoriale':
                                modalStart('Afrique équatoriale')
                                break;
                            case 'afrique_du_nord':
                                modalStart('Afrique du nord')
                                break;
                            case 'amerique_du_nord':
                                modalStart('Amérique du nord')
                                break;
                            case 'nord_amerique_latine':
                                modalStart('Amérique latine du nord')
                                break;
                            case 'asie_du_nord':
                                modalStart('Asie du nord')
                                break;
                            case 'asie_du_sud':
                                modalStart('Asie du sud')
                                break;
                            case 'europe':
                                modalStart('Europe')
                                break;
                            case 'moyen_orient':
                                modalStart('Moyen orient')
                                break;
                            case 'oceanie':
                                modalStart('Océanie')
                                break;
                            case 'pays_du_nord':
                                modalStart('Pays du nord')
                                break;
                            case 'sud_amerique_latine':
                                modalStart('Amérique latine du sud')
                                break;
                        }
                    } else {
                        const reponse = codeBlock('ansi', `\u001b[0;0m\u001b[1;31mVous avez déjà un pays. Demandez au staff pour recommencer une simulation`);
                        await interaction.reply({content: reponse, ephemeral: true});
                    }
                })
                //endregion
            } else if (interaction.customId == 'ideologie') {
                //region Idéologie
                console.log(interaction.values)
                //endregion
            }
            //endregion
            //endregion
            //region Modals
        } else if (interaction.isModalSubmit()) {

            log = {
                author: {
                    name: interaction.member.displayName,
                    icon_url: interaction.member.displayAvatarURL()
                },
                title: `\`Modals\``,
                description: `${interaction.customId} ${JSON.stringify(interaction.fields)}`,
                timestamp: new Date(),
                footer: {
                    text: '#' + interaction.channel.name
                },
            };

            const salon_logs = interaction.client.channels.cache.get(process.env.SALON_LOGS);
            salon_logs.send({embeds: [log]});

            if (interaction.customId.includes('start') == true) {
                //region Start
                const cite = interaction.fields.getTextInputValue('nom_cite');
                const region = interaction.customId.slice(6)

                sql = `SELECT * FROM pays WHERE nom="${cite}"`;
                connection.query(sql, async (err, results) => {
                    if (err) {
                        throw err;
                    }
                    if (!results[0]) {

                        function success(salon) {
                            const nouveau_salon = {
                                author: {
                                    name: `Cité de ${cite}`,
                                    icon_url: interaction.member.displayAvatarURL()
                                },
                                thumbnail: {
                                    url: 'https://cdn.discordapp.com/attachments/939251032297463879/940642380640583770/paz_v3.png',
                                },
                                title: `\`Bienvenue dans votre cité !\``,
                                fields: [{
                                    name: `Commencement :`,
                                    value: `Menez votre peuple à la gloire !`
                                }],
                                color: interaction.member.displayHexColor,
                                timestamp: new Date(),
                                footer: {
                                    text: `Paz Nation, le meilleur serveur Discord Français`
                                },
                            };
                            salon.send({content: `<@${interaction.member.id}>`, embeds: [nouveau_salon]})

                            const T_total = 16000;
                            const T_occ = 15 + 1 * batimentObject.champ.SURFACE_CHAMP + 1 * batimentObject.mine.SURFACE_MINE + 1 * batimentObject.pompe_a_eau.SURFACE_POMPE_A_EAU + 1 * batimentObject.pumpjack.SURFACE_PUMPJACK + 1 * batimentObject.scierie.SURFACE_SCIERIE + 2 * batimentObject.eolienne.SURFACE_EOLIENNE;
                            const T_libre = T_total - T_occ;
                            const cash = chance.integer({min: 975000, max: 1025000});
                            const jeune = chance.integer({min: 29000, max: 31000});

                            let sql = `
                                INSERT INTO batiments SET id_joueur="${interaction.user.id}";
                                INSERT INTO diplomatie SET id_joueur="${interaction.user.id}";
                                INSERT INTO pays SET id_joueur="${interaction.user.id}",
                                                     nom="${cite}",
                                                     id_salon="${salon.id.toString()}",
                                                     avatarURL="${interaction.user.displayAvatarURL()}",
                                                     cash='${cash}',
                                                     pweeter="@${interaction.user.username}";
                                INSERT INTO population SET id_joueur="${interaction.user.id}",
                                                           habitant='${jeune}',
                                                           jeune='${jeune}',
                                                          ancien_pop='${jeune}';
                                INSERT INTO ressources SET id_joueur="${interaction.user.id}"
                            `;
                            connection.query(sql, async (err) => {if (err) {throw err;}});
                            switch (region) {
                                case 'afrique_australe':
                                    sql = `INSERT INTO territoire
                                           SET id_joueur="${interaction.user.id}",
                                               T_total='${T_total}',
                                               T_libre='${T_libre}',
                                               T_occ='${T_occ}',
                                               ville=50,
                                               foret=0,
                                               prairie=4000,
                                               desert=4000,
                                               toundra=0,
                                               taiga=0,
                                               savane=1600,
                                               rocheuses=1390,
                                               volcan=80,
                                               mangrove=0,
                                               steppe=4880`;
                                    break;
                                case 'afrique_equatoriale':
                                    sql = `INSERT INTO territoire
                                           SET id_joueur="${interaction.user.id}",
                                               T_total='${T_total}',
                                               T_libre='${T_libre}',
                                               T_occ='${T_occ}',
                                               ville=50,
                                               foret=8800,
                                               prairie=2000,
                                               desert=0,
                                               toundra=0,
                                               taiga=0,
                                               savane=2880,
                                               rocheuses=1390,
                                               volcan=80,
                                               mangrove=800,
                                               steppe=0`;
                                    break;
                                case 'afrique_du_nord':
                                    sql = `INSERT INTO territoire
                                           SET id_joueur="${interaction.user.id}",
                                               T_total='${T_total}',
                                               T_libre='${T_libre}',
                                               T_occ='${T_occ}',
                                               ville=50,
                                               foret=0,
                                               prairie=0,
                                               desert=12080,
                                               toundra=0,
                                               taiga=0,
                                               savane=0,
                                               rocheuses=1390,
                                               volcan=80,
                                               mangrove=0,
                                               steppe=2400`;
                                    break;
                                case 'amerique_du_nord':
                                    sql = `INSERT INTO territoire
                                           SET id_joueur="${interaction.user.id}",
                                               T_total='${T_total}',
                                               T_libre='${T_libre}',
                                               T_occ='${T_occ}',
                                               ville=50,
                                               foret=3680,
                                               prairie=2800,
                                               desert=2400,
                                               toundra=0,
                                               taiga=0,
                                               savane=1600,
                                               rocheuses=1390,
                                               volcan=80,
                                               mangrove=800,
                                               steppe=3200`;
                                    break;
                                case 'asie_du_nord':
                                    sql = `INSERT INTO territoire
                                           SET id_joueur="${interaction.user.id}",
                                               T_total='${T_total}',
                                               T_libre='${T_libre}',
                                               T_occ='${T_occ}',
                                               ville=50,
                                               foret=5600,
                                               prairie=2400,
                                               desert=3200,
                                               toundra=0,
                                               taiga=880,
                                               savane=0,
                                               rocheuses=1390,
                                               volcan=80,
                                               mangrove=0,
                                               steppe=2400`;
                                    break;
                                case 'asie_du_sud':
                                    sql = `INSERT INTO territoire
                                           SET id_joueur="${interaction.user.id}",
                                               T_total='${T_total}',
                                               T_libre='${T_libre}',
                                               T_occ='${T_occ}',
                                               ville=50,
                                               foret=10480,
                                               prairie=0,
                                               desert=0,
                                               toundra=2400,
                                               taiga=0,
                                               savane=0,
                                               rocheuses=1390,
                                               volcan=80,
                                               mangrove=1600,
                                               steppe=0`;
                                    break;
                                case 'europe':
                                    sql = `INSERT INTO territoire
                                           SET id_joueur="${interaction.user.id}",
                                               T_total='${T_total}',
                                               T_libre='${T_libre}',
                                               T_occ='${T_occ}',
                                               ville=50,
                                               foret=11280,
                                               prairie=3200,
                                               desert=0,
                                               toundra=0,
                                               taiga=0,
                                               savane=0,
                                               rocheuses=1390,
                                               volcan=80,
                                               mangrove=0,
                                               steppe=1600`;
                                    break;
                                case 'moyen_orient':
                                    sql = `INSERT INTO territoire
                                           SET id_joueur="${interaction.user.id}",
                                               T_total='${T_total}',
                                               T_libre='${T_libre}',
                                               T_occ='${T_occ}',
                                               ville=50,
                                               foret=0,
                                               prairie=0,
                                               desert=12880,
                                               toundra=0,
                                               taiga=0,
                                               savane=0,
                                               rocheuses=1390,
                                               volcan=80,
                                               mangrove=0,
                                               steppe=1600`;
                                    break;
                                case 'nord_amerique_latine':
                                    sql = `INSERT INTO territoire
                                           SET id_joueur="${interaction.user.id}",
                                               T_total='${T_total}',
                                               T_libre='${T_libre}',
                                               T_occ='${T_occ}',
                                               ville=50,
                                               foret=4800,
                                               prairie=4560,
                                               desert=1600,
                                               toundra=1120,
                                               taiga=0,
                                               savane=0,
                                               rocheuses=1390,
                                               volcan=80,
                                               mangrove=2400,
                                               steppe=0`;
                                    break;
                                case 'oceanie':
                                    sql = `INSERT INTO territoire
                                           SET id_joueur="${interaction.user.id}",
                                               T_total='${T_total}',
                                               T_libre='${T_libre}',
                                               T_occ='${T_occ}',
                                               ville=50,
                                               foret=2720,
                                               prairie=4000,
                                               desert=5600,
                                               toundra=0,
                                               taiga=0,
                                               savane=1040,
                                               rocheuses=1390,
                                               volcan=80,
                                               mangrove=1120,
                                               steppe=0`;
                                    break;
                                case 'pays_du_nord':
                                    sql = `INSERT INTO territoire
                                           SET id_joueur="${interaction.user.id}",
                                               T_total='${T_total}',
                                               T_libre='${T_libre}',
                                               T_occ='${T_occ}',
                                               ville=50,
                                               foret=0,
                                               prairie=0,
                                               desert=0,
                                               toundra=4000,
                                               taiga=10480,
                                               savane=0,
                                               rocheuses=1390,
                                               volcan=80,
                                               mangrove=0,
                                               steppe=0`;
                                    break;
                                case 'sud_amerique_latine':
                                    sql = `INSERT INTO territoire
                                           SET id_joueur="${interaction.user.id}",
                                               T_total='${T_total}',
                                               T_libre='${T_libre}',
                                               T_occ='${T_occ}',
                                               ville=50,
                                               foret=2440,
                                               prairie=4000,
                                               desert=2240,
                                               toundra=0,
                                               taiga=0,
                                               savane=1840,
                                               rocheuses=1390,
                                               volcan=80,
                                               mangrove=0,
                                               steppe=4000`;
                                    break;
                            }
                            connection.query(sql, async (err) => {if (err) {throw err;}});

                            interaction.member.setNickname(`[${cite}] ${interaction.member.displayName}`);

                            let roleJoueur = interaction.guild.roles.cache.find(r => r.name === "👤 » Joueur");
                            interaction.member.roles.add(roleJoueur)

                            let roleInvite = interaction.guild.roles.cache.find(r => r.name === "👤 » Invité");
                            interaction.member.roles.remove(roleInvite)

                            const ville = {
                                author: {
                                    name: `Cité de ${cite}`,
                                    icon_url: interaction.member.displayAvatarURL()
                                },
                                thumbnail: {
                                    url: 'https://cdn.discordapp.com/attachments/939251032297463879/940642380640583770/paz_v3.png',
                                },
                                title: `\`Vous avez fondé votre cité !\``,
                                fields: [{
                                    name: `Place de votre gouvernement :`,
                                    value: `${salon.toString()}`
                                }],
                                color: interaction.member.displayHexColor,
                                timestamp: new Date(),
                                footer: {
                                    text: `Paz Nation, le meilleur serveur Discord Français`
                                },
                            };

                            const annonce = {
                                description: `**<@${interaction.member.id}> a fondé une nouvelle Cité : ${cite}**`,
                                image: {
                                    url: 'https://media.discordapp.net/attachments/848913340737650698/947508565415981096/zefghyiuuie.png',
                                },
                                color: interaction.member.displayHexColor,
                                footer: {
                                    text: `Paz Nation, le meilleur serveur Discord Français`
                                },
                            };

                            const salon_carte = interaction.client.channels.cache.get(process.env.SALON_CARTE);
                            salon_carte.send({embeds: [annonce]});
                            interaction.user.send({embeds: [ville]});
                        }

                        interaction.guild.channels.create(`${cite}`, {
                            type: "GUILD_TEXT",
                            permissionOverwrites: [{
                                id: interaction.member.id,
                                allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'MANAGE_CHANNELS', 'MANAGE_ROLES', 'READ_MESSAGE_HISTORY', 'MANAGE_MESSAGES', 'USE_APPLICATION_COMMANDS'],
                            },
                                {
                                    id: interaction.guild.roles.everyone,
                                    deny: ['VIEW_CHANNEL']
                                },
                            ],
                            parent: process.env.CATEGORY_PAYS,
                        })
                            .then(salon => success(salon))
                    } else {
                        const reponse = codeBlock('ansi', `\u001b[0m\u001b[1;31mCette cité est déjà prise. Pour voir la liste des cités déjà controlées, cliquez sur le bouton ci-dessous`);
                        const row = new MessageActionRow()
                            .addComponents(
                                new MessageButton()
                                    .setLabel(`Liste des cités`)
                                    .setEmoji(`🌇`)
                                    .setURL('https://discord.com/channels/826427184305537054/983316109367345152/987038188801503332')
                                    .setStyle('LINK'),
                            );
                        await interaction.user.send({content: reponse, components: [row]});
                    }
                })
                interaction.deferUpdate()
            }
            //endregion
            //region
        }
    }
};