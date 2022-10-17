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
const populationObject = JSON.parse(readFileSync('data/population.json', 'utf-8'));
const batimentObject = JSON.parse(readFileSync('data/batiment.json', 'utf-8'));
const gouvernementObject = JSON.parse(readFileSync('data/gouvernement.json', 'utf-8'));
    
module.exports = {
    name: 'interactionCreate',
    execute(interaction) {
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
            salon_logs.send({ embeds: [log] });

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
            salon_logs.send({ embeds: [log] });

            //#region [Réglement]
            if (interaction.customId.includes('réglement') === true) {

                let roleInvite = interaction.guild.roles.cache.find(r => r.name === "👤 » Invité");
                interaction.member.roles.add(roleInvite);
                interaction.deferUpdate()

                //endregion

                //#region [Start Menu]
            } else if (interaction.customId.includes('start') === true) {

                sql = `SELECT * FROM pays WHERE id_joueur=${interaction.member.id}`;
                connection.query(sql, async(err, results) => {if (err) {throw err;}
                    if (!results[0]) {
                        const modal = new Modal()
                            .setCustomId('start')
                            .setTitle('Créer votre cité');

                        const nom_cite = new TextInputComponent()
                            .setCustomId('nom_cite')
                            .setLabel("Quelle ville voulez-vous choisir ?")
                            .setStyle('SHORT')
                            .setPlaceholder('Ne pas prendre une ville déjà prise par un autre joueur')
                            .setMaxLength(40)
                            .setRequired(true)

                        const firstActionRow = new MessageActionRow().addComponents(nom_cite);
                        modal.addComponents(firstActionRow);
                        interaction.showModal(modal);
                    } else {
                        const reponse = codeBlock('diff', `- Vous avez déjà un pays. Demandez au staff pour recommencer une histoire`);
                        await interaction.reply({ content: reponse, ephemeral: true });
                    }
                })
                //#endregion

                //#region [Menu - Economie]
            } else if (interaction.customId.includes('menu_économie') === true) {

                joueur_id = interaction.customId.slice(14);
                const joueur = interaction.client.users.cache.find(user => user.id === joueur_id);

                function economie(joueur) {

                    const sql = `SELECT * FROM pays WHERE id_joueur='${joueur_id}'`;
                    connection.query(sql, async(err, results) => {if (err) {throw err;}

                        if (!results[0]) {
                            const reponse = codeBlock('diff', `- Cette personne ne joue pas.`);
                            await interaction.reply({ content: reponse, ephemeral: true });
                        } else {

                            const embed = {
                                author: {
                                    name: `${results[0].rang} de ${results[0].nom}`,
                                    icon_url: joueur.displayAvatarURL()
                                },
                                thumbnail: {
                                    url: results[0].drapeau
                                },
                                title: `\`Menu de l'économie\``,
                                fields: [{
                                    name: `> 💵 Argent :`,
                                    value: codeBlock(`• ${results[0].cash.toLocaleString('en-US')} $`) + `\u200B`
                                },
                                    {
                                        name: `> 🏭 Nombre d'usine total :`,
                                        value: codeBlock(`• ${results[0].usine_total.toLocaleString('en-US')}`) + `\u200B`
                                    },
                                ],
                                color: joueur.displayHexColor,
                                timestamp: new Date(),
                                footer: {
                                    text: `${results[0].devise}`
                                },
                            };

                            await interaction.reply({ embeds: [embed] });
                        }
                    });
                }

                economie(joueur);
                //#endregion

                //#region [Menu - Population]
            } else if (interaction.customId.includes('menu_population') === true) {

                joueur_id = interaction.customId.slice(16);
                const joueur = interaction.client.users.cache.find(user => user.id === joueur_id);

                function population(joueur) {
                    const sql = `SELECT * FROM pays WHERE id_joueur='${joueur_id}'`;
                    connection.query(sql, async(err, results) => {if (err) {throw err;}

                        if (!results[0]) {
                            const reponse = codeBlock('diff', `- Cette personne ne joue pas.`);
                            await interaction.reply({ content: reponse, ephemeral: true });
                        } else {
                            const habitants = results[0].enfant + results[0].jeune + results[0].adulte + results[0].vieux;
                            const densite = (habitants / results[0].T_total).toFixed(0);

                            const embed = {
                                author: {
                                    name: `${results[0].rang} de ${results[0].nom}`,
                                    icon_url: joueur.displayAvatarURL()
                                },
                                thumbnail: {
                                    url: results[0].drapeau
                                },
                                title: `\`Vue globale de la population\``,
                                fields: [{
                                    name: `> 👪 Population`,
                                    value: codeBlock(
                                        `• ${habitants.toLocaleString('en-US')} habitants\n` +
                                        `• ${results[0].bonheur}% bonheur\n` +
                                        `• ${densite.toLocaleString('en-US')} habitants/km²`) + `\u200B`
                                },
                                    {
                                        name: `> 🛒 Consommation/Approvisionnement`,
                                        value: codeBlock(
                                            `• ${Math.round((habitants * parseFloat(populationObject.EAU_CONSO))).toLocaleString('en-US')}/${results[0].eau_appro.toLocaleString('en-US')} eau\n` +
                                            `• ${Math.round((habitants * parseFloat(populationObject.NOURRITURE_CONSO))).toLocaleString('en-US')}/${results[0].nourriture_appro.toLocaleString('en-US')} nourriture\n` +
                                            `• ${(1 + results[0].bc_acces * 0.04 + results[0].bonheur * 0.016 + (habitants / 10000000) * 0.04).toFixed(1)}/${(batimentObject.usine_civile.PROD_USINE_CIVILE * results[0].usine_civile * 48 / habitants).toFixed(1)} biens de consommation`) + `\u200B`
                                    },
                                    {
                                        name: `> 🧎 Répartion`,
                                        value: codeBlock(
                                            `• ${results[0].enfant.toLocaleString('en-US')} enfants\n` +
                                            `• ${results[0].jeune.toLocaleString('en-US')} jeunes\n` +
                                            `• ${results[0].adulte.toLocaleString('en-US')} adultes\n` +
                                            `• ${results[0].vieux.toLocaleString('en-US')} vieux\n`) + `\u200B`
                                    },
                                    {
                                        name: `> 🏘️ Batiments`,
                                        value: codeBlock(
                                            `• ${results[0].quartier.toLocaleString('en-US')} quartiers`) + `\u200B`
                                    }
                                ],
                                color: joueur.displayHexColor,
                                timestamp: new Date(),
                                footer: {
                                    text: `${results[0].devise}`
                                },
                            };

                            await interaction.reply({ embeds: [embed] });
                        }
                    });
                }

                population(joueur);
                //endregion

                //#region [Menu - Gouvernement]
            } else if (interaction.customId.includes('menu_gouvernement') === true) {

                joueur_id = interaction.customId.slice(18);
                const joueur = interaction.client.users.cache.find(user => user.id === joueur_id);

                function gouvernement(joueur) {
                    const sql = `SELECT * FROM pays WHERE id_joueur='${joueur_id}'`;
                    connection.query(sql, async(err, results) => {if (err) {throw err;}

                        if (!results[0]) {
                            const reponse = codeBlock('diff', `- Cette personne ne joue pas.`);
                            await interaction.reply({ content: reponse, ephemeral: true });
                        } else {

                            const embed = {
                                author: {
                                    name: `${results[0].rang} de ${results[0].nom}`,
                                    icon_url: joueur.displayAvatarURL()
                                },
                                thumbnail: {
                                    url: results[0].drapeau
                                },
                                title: `\`Menu du gouvernement\``,
                                fields: [{
                                    name: `> 🪧 Nom de l'Etat : `,
                                    value: codeBlock(`• ${results[0].nom}`) + `\u200B`
                                },
                                    {
                                        name: `> ®️ Rang : `,
                                        value: codeBlock(`• ${results[0].rang}`) + `\u200B`
                                    },
                                    {
                                        name: `> 🔱 Forme de gouvernement : `,
                                        value: codeBlock(`• ${results[0].regime}`) + `\u200B`
                                    },
                                    {
                                        name: `> 🧠 Idéologie : `,
                                        value: codeBlock(`• ${results[0].ideologie}`) + `\u200B`
                                    },
                                    {
                                        name: `> 📯 Devise : `,
                                        value: codeBlock(`• ${results[0].devise}`) + `\u200B`
                                    }
                                ],
                                color: joueur.displayHexColor,
                                timestamp: new Date(),
                                footer: {
                                    text: `${results[0].devise}`
                                },
                            };

                            await interaction.reply({ embeds: [embed] });
                        }
                    });
                }

                gouvernement(joueur);
                //endregion

                //#region [Menu - Marché rapide]
            } else if (interaction.customId === 'menu_QM') {

                sql = `SELECT * FROM pays WHERE id_joueur=${interaction.member.id}`;
                connection.query(sql, async(err, results) => {if (err) {throw err;}

                    const jsonPrix = JSON.parse(readFileSync('data/prix.json', 'utf-8'));

                    const embed = {
                        author: {
                            name: `${results[0].rang} de ${results[0].nom}`,
                            icon_url: interaction.member.displayAvatarURL()
                        },
                        thumbnail: {
                            url: results[0].drapeau,
                        },
                        title: `Quick Market (QM) :`,
                        fields: [{
                            name: `> 💻 Biens de consommation : `,
                            value: codeBlock(`• Vente : ${(jsonPrix.bc * 0.7).toFixed(2)} | Prix moyen : ${jsonPrix.bc} | Achat : ${(jsonPrix.bc * 1.3).toFixed(2)}`) + `\u200B`
                        }, {
                            name: `> 🪵 Bois : `,
                            value: codeBlock(`• Vente : ${(jsonPrix.bois * 0.7).toFixed(2)} | Prix moyen : ${jsonPrix.bois} | Achat : ${(jsonPrix.bois * 1.3).toFixed(2)}`) + `\u200B`
                        }, {
                            name: `> 🧱 Brique : `,
                            value: codeBlock(`• Vente : ${(jsonPrix.brique * 0.7).toFixed(2)} | Prix moyen : ${jsonPrix.brique} | Achat : ${(jsonPrix.brique * 1.3).toFixed(2)}`) + `\u200B`
                        }, {
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
                        }, ],
                        color: interaction.member.displayHexColor,
                    };

                    interaction.reply({ embeds: [embed] })
                });
                //endregion

                //region [Construction]
            } else if (interaction.customId.includes('construction') === true) {

                id_joueur = interaction.customId.slice(13);
                if (id_joueur === interaction.member.id) {

                    sql = `SELECT * FROM pays WHERE id_joueur=${interaction.member.id}`;
                    connection.query(sql, async(err, results) => {
                        let embed;
                        let const_T_libre;
                        let const_bois;
                        let const_brique;
                        let const_metaux;
                        let sql;
                        let newbc;
                        if (err) {throw err;}

                        let title = interaction.message.embeds[0].title;
                        title = title.substring(16, title.length - 1);
                        const espace = title.indexOf(" ");
                        const nombre = title.slice(0, espace);
                        const batiment = title.slice(espace + 1);

                        switch (batiment) {

                            case 'Briqueterie':
                                const_T_libre = batimentObject.briqueterie.SURFACE_BRIQUETERIE * nombre;
                                const_bois = Math.round(batimentObject.briqueterie.CONST_BRIQUETERIE_BOIS * nombre * eval(`gouvernementObject.${results[0].ideologie}.construction`));
                                const_brique = Math.round(batimentObject.briqueterie.CONST_BRIQUETERIE_BRIQUE * nombre * eval(`gouvernementObject.${results[0].ideologie}.construction`));
                                const_metaux = Math.round(batimentObject.briqueterie.CONST_BRIQUETERIE_METAUX * nombre * eval(`gouvernementObject.${results[0].ideologie}.construction`));

                                sql = `
                                    UPDATE pays SET briqueterie=briqueterie+${nombre} WHERE id_joueur='${interaction.member.id}';
                                    UPDATE pays SET usine_total=usine_total+${nombre} WHERE id_joueur='${interaction.member.id}';
                                    UPDATE pays SET T_libre=T_libre-${const_T_libre} WHERE id_joueur='${interaction.member.id}';
                                    UPDATE pays SET T_occ=T_occ+${const_T_libre} WHERE id_joueur='${interaction.member.id}';
                                    UPDATE pays SET bois=bois-${const_bois} WHERE id_joueur='${interaction.member.id}';
                                    UPDATE pays SET brique=brique-${const_brique} WHERE id_joueur='${interaction.member.id}';
                                    UPDATE pays SET metaux=metaux-${const_metaux} WHERE id_joueur='${interaction.member.id}'`;
                                connection.query(sql, async(err) => {if (err) {throw err;}})

                                newbc = results[0].briqueterie + parseInt(nombre);

                                embed = {
                                    author: {
                                        name: `${results[0].rang} de ${results[0].nom}`,
                                        icon_url: interaction.member.displayAvatarURL()
                                    },
                                    thumbnail: {
                                        url: `${results[0].drapeau}`
                                    },
                                    title: `\`Construction : ${nombre.toLocaleString('en-US')} briqueteries\``,
                                    description: `> 🛠️ Vous avez désormais :\n` +
                                        codeBlock(`• ${newbc.toLocaleString('en-US')} briqueteries`) + `\u200B`,
                                    color: interaction.member.displayHexColor,
                                    timestamp: new Date(),
                                    footer: {
                                        text: `${results[0].devise}`
                                    },
                                };
                                break;

                            case 'Champ':
                                const_T_libre = batimentObject.champ.SURFACE_CHAMP * nombre;
                                const_bois = Math.round(batimentObject.champ.CONST_CHAMP_BOIS * nombre * eval(`gouvernementObject.${results[0].ideologie}.construction`));
                                const_brique = Math.round(batimentObject.champ.CONST_CHAMP_BRIQUE * nombre * eval(`gouvernementObject.${results[0].ideologie}.construction`));
                                const_metaux = Math.round(batimentObject.champ.CONST_CHAMP_METAUX * nombre * eval(`gouvernementObject.${results[0].ideologie}.construction`));

                                sql = `
                                    UPDATE pays SET champ=champ+${nombre} WHERE id_joueur='${interaction.member.id}';
                                    UPDATE pays SET usine_total=usine_total+${nombre} WHERE id_joueur='${interaction.member.id}';
                                    UPDATE pays SET T_libre=T_libre-${const_T_libre} WHERE id_joueur='${interaction.member.id}';
                                    UPDATE pays SET T_occ=T_occ+${const_T_libre} WHERE id_joueur='${interaction.member.id}';
                                    UPDATE pays SET bois=bois-${const_bois} WHERE id_joueur='${interaction.member.id}';
                                    UPDATE pays SET brique=brique-${const_brique} WHERE id_joueur='${interaction.member.id}';
                                    UPDATE pays SET metaux=metaux-${const_metaux} WHERE id_joueur='${interaction.member.id}'`;
                                connection.query(sql, async(err) => {if (err) {throw err;}})

                                newbc = results[0].champ + parseInt(nombre);

                                embed = {
                                    author: {
                                        name: `${results[0].rang} de ${results[0].nom}`,
                                        icon_url: interaction.member.displayAvatarURL()
                                    },
                                    thumbnail: {
                                        url: `${results[0].drapeau}`
                                    },
                                    title: `\`Construction : ${nombre.toLocaleString('en-US')} champs\``,
                                    description: `> 🛠️ Vous avez désormais :\n` +
                                        codeBlock(`• ${newbc.toLocaleString('en-US')} champs`) + `\u200B`,
                                    color: interaction.member.displayHexColor,
                                    timestamp: new Date(),
                                    footer: {
                                        text: `${results[0].devise}`
                                    },
                                };
                                break;

                            case 'Centrale au fioul':
                                const_T_libre = batimentObject.centrale_fioul.SURFACE_CENTRALE_FIOUL * nombre;
                                const_bois = Math.round(batimentObject.centrale_fioul.CONST_CENTRALE_FIOUL_BOIS * nombre * eval(`gouvernementObject.${results[0].ideologie}.construction`));
                                const_brique = Math.round(batimentObject.centrale_fioul.CONST_CENTRALE_FIOUL_BRIQUE * nombre * eval(`gouvernementObject.${results[0].ideologie}.construction`));
                                const_metaux = Math.round(batimentObject.centrale_fioul.CONST_CENTRALE_FIOUL_METAUX * nombre * eval(`gouvernementObject.${results[0].ideologie}.construction`));

                                sql = `
                                    UPDATE pays SET centrale_fioul=centrale_fioul+${nombre} WHERE id_joueur='${interaction.member.id}';
                                    UPDATE pays SET usine_total=usine_total+${nombre} WHERE id_joueur='${interaction.member.id}';
                                    UPDATE pays SET T_libre=T_libre-${const_T_libre} WHERE id_joueur='${interaction.member.id}';
                                    UPDATE pays SET T_occ=T_occ+${const_T_libre} WHERE id_joueur='${interaction.member.id}';
                                    UPDATE pays SET bois=bois-${const_bois} WHERE id_joueur='${interaction.member.id}';
                                    UPDATE pays SET brique=brique-${const_brique} WHERE id_joueur='${interaction.member.id}';
                                    UPDATE pays SET metaux=metaux-${const_metaux} WHERE id_joueur='${interaction.member.id}'`;
                                connection.query(sql, async(err) => {if (err) {throw err;}})

                                newbc = results[0].centrale_fioul + parseInt(nombre);

                                embed = {
                                    author: {
                                        name: `${results[0].rang} de ${results[0].nom}`,
                                        icon_url: interaction.member.displayAvatarURL()
                                    },
                                    thumbnail: {
                                        url: `${results[0].drapeau}`
                                    },
                                    title: `\`Construction : ${nombre.toLocaleString('en-US')} centrales électrique\``,
                                    description: `> 🛠️ Vous avez désormais :\n` +
                                        codeBlock(`• ${newbc.toLocaleString('en-US')} centrales électriques`) + `\u200B`,
                                    color: interaction.member.displayHexColor,
                                    timestamp: new Date(),
                                    footer: {
                                        text: `${results[0].devise}`
                                    },
                                };
                                break;

                            case 'Eolienne':
                                const_T_libre = batimentObject.eolienne.SURFACE_EOLIENNE * nombre;
                                const_metaux = Math.round(batimentObject.eolienne.CONST_EOLIENNE_METAUX * nombre * eval(`gouvernementObject.${results[0].ideologie}.construction`));

                                sql = `
                                        UPDATE pays SET eolienne=eolienne+${nombre} WHERE id_joueur="${interaction.member.id}";
                                        UPDATE pays SET usine_total=usine_total+${nombre} WHERE id_joueur="${interaction.member.id}";
                                        UPDATE pays SET T_libre=T_libre-${const_T_libre} WHERE id_joueur="${interaction.member.id}";
                                        UPDATE pays SET T_occ=T_occ+${const_T_libre} WHERE id_joueur="${interaction.member.id}";
                                        UPDATE pays SET metaux=metaux-${const_metaux} WHERE id_joueur="${interaction.member.id}"`;
                                connection.query(sql, async(err) => {if (err) {throw err;}})

                                newbc = results[0].eolienne + parseInt(nombre);

                                embed = {
                                    author: {
                                        name: `${results[0].rang} de ${results[0].nom}`,
                                        icon_url: interaction.member.displayAvatarURL()
                                    },
                                    thumbnail: {
                                        url: `${results[0].drapeau}`
                                    },
                                    title: `\`Construction : ${nombre.toLocaleString('en-US')} éoliennes\``,
                                    description: `> 🛠️ Vous avez désormais :\n` +
                                        codeBlock(`• ${newbc.toLocaleString('en-US')} éoliennes`) + `\u200B`,
                                    color: interaction.member.displayHexColor,
                                    timestamp: new Date(),
                                    footer: {
                                        text: `${results[0].devise}`
                                    },
                                };
                                break;

                            case 'Mine':
                                const_T_libre = batimentObject.mine.SURFACE_MINE * nombre;
                                const_bois = Math.round(batimentObject.mine.CONST_MINE_BOIS * nombre * eval(`gouvernementObject.${results[0].ideologie}.construction`));
                                const_brique = Math.round(batimentObject.mine.CONST_MINE_BRIQUE * nombre * eval(`gouvernementObject.${results[0].ideologie}.construction`));
                                const_metaux = Math.round(batimentObject.mine.CONST_MINE_METAUX * nombre * eval(`gouvernementObject.${results[0].ideologie}.construction`));

                                sql = `
                                    UPDATE pays SET mine=mine+${nombre} WHERE id_joueur='${interaction.member.id}';
                                    UPDATE pays SET usine_total=usine_total+${nombre} WHERE id_joueur='${interaction.member.id}';
                                    UPDATE pays SET T_libre=T_libre-${const_T_libre} WHERE id_joueur='${interaction.member.id}';
                                    UPDATE pays SET T_occ=T_occ+${const_T_libre} WHERE id_joueur='${interaction.member.id}';
                                    UPDATE pays SET bois=bois-${const_bois} WHERE id_joueur='${interaction.member.id}';
                                    UPDATE pays SET brique=brique-${const_brique} WHERE id_joueur='${interaction.member.id}';
                                    UPDATE pays SET metaux=metaux-${const_metaux} WHERE id_joueur='${interaction.member.id}'`;
                                connection.query(sql, async(err) => {if (err) {throw err;}})

                                newbc = results[0].mine + parseInt(nombre);

                                embed = {
                                    author: {
                                        name: `${results[0].rang} de ${results[0].nom}`,
                                        icon_url: interaction.member.displayAvatarURL()
                                    },
                                    thumbnail: {
                                        url: `${results[0].drapeau}`
                                    },
                                    title: `\`Construction : ${nombre.toLocaleString('en-US')} mines\``,
                                    description: `> 🛠️ Vous avez désormais :\n` +
                                        codeBlock(`• ${newbc.toLocaleString('en-US')} mines`) + `\u200B`,
                                    color: interaction.member.displayHexColor,
                                    timestamp: new Date(),
                                    footer: {
                                        text: `${results[0].devise}`
                                    },
                                };
                                break;

                            case 'Pompe à eau':
                                const_T_libre = batimentObject.pompe_a_eau.SURFACE_POMPE_A_EAU * nombre;
                                const_bois = Math.round(batimentObject.pompe_a_eau.CONST_POMPE_A_EAU_BOIS * nombre * eval(`gouvernementObject.${results[0].ideologie}.construction`));
                                const_brique = Math.round(batimentObject.pompe_a_eau.CONST_POMPE_A_EAU_BRIQUE * nombre * eval(`gouvernementObject.${results[0].ideologie}.construction`));
                                const_metaux = Math.round(batimentObject.pompe_a_eau.CONST_POMPE_A_EAU_METAUX * nombre * eval(`gouvernementObject.${results[0].ideologie}.construction`));

                                sql = `
                                    UPDATE pays SET pompe_a_eau=pompe_a_eau+${nombre} WHERE id_joueur='${interaction.member.id}';
                                    UPDATE pays SET usine_total=usine_total+${nombre} WHERE id_joueur='${interaction.member.id}';
                                    UPDATE pays SET T_libre=T_libre-${const_T_libre} WHERE id_joueur='${interaction.member.id}';
                                    UPDATE pays SET T_occ=T_occ+${const_T_libre} WHERE id_joueur='${interaction.member.id}';
                                    UPDATE pays SET bois=bois-${const_bois} WHERE id_joueur='${interaction.member.id}';
                                    UPDATE pays SET brique=brique-${const_brique} WHERE id_joueur='${interaction.member.id}';
                                    UPDATE pays SET metaux=metaux-${const_metaux} WHERE id_joueur='${interaction.member.id}'`;
                                connection.query(sql, async(err) => {if (err) {throw err;}})

                                newbc = results[0].pompe_a_eau + parseInt(nombre);

                                embed = {
                                    author: {
                                        name: `${results[0].rang} de ${results[0].nom}`,
                                        icon_url: interaction.member.displayAvatarURL()
                                    },
                                    thumbnail: {
                                        url: `${results[0].drapeau}`
                                    },
                                    title: `\`Construction : ${nombre.toLocaleString('en-US')} pompes à eau\``,
                                    description: `> 🛠️ Vous avez désormais :\n` +
                                        codeBlock(`• ${newbc.toLocaleString('en-US')} pompes à eau`) + `\u200B`,
                                    color: interaction.member.displayHexColor,
                                    timestamp: new Date(),
                                    footer: {
                                        text: `${results[0].devise}`
                                    },
                                };
                                break;

                            case 'Pumpjack':
                                const_T_libre = batimentObject.pumpjack.SURFACE_PUMPJACK * nombre;
                                const_bois = Math.round(batimentObject.pumpjack.CONST_PUMPJACK_BOIS * nombre * eval(`gouvernementObject.${results[0].ideologie}.construction`));
                                const_brique = Math.round(batimentObject.pumpjack.CONST_PUMPJACK_BRIQUE * nombre * eval(`gouvernementObject.${results[0].ideologie}.construction`));
                                const_metaux = Math.round(batimentObject.pumpjack.CONST_PUMPJACK_METAUX * nombre * eval(`gouvernementObject.${results[0].ideologie}.construction`));

                                sql = `
                                    UPDATE pays SET pumpjack=pumpjack+${nombre} WHERE id_joueur='${interaction.member.id}';
                                    UPDATE pays SET usine_total=usine_total+${nombre} WHERE id_joueur='${interaction.member.id}';
                                    UPDATE pays SET T_libre=T_libre-${const_T_libre} WHERE id_joueur='${interaction.member.id}';
                                    UPDATE pays SET T_occ=T_occ+${const_T_libre} WHERE id_joueur='${interaction.member.id}';
                                    UPDATE pays SET bois=bois-${const_bois} WHERE id_joueur='${interaction.member.id}';
                                    UPDATE pays SET brique=brique-${const_brique} WHERE id_joueur='${interaction.member.id}';
                                    UPDATE pays SET metaux=metaux-${const_metaux} WHERE id_joueur='${interaction.member.id}'`;
                                connection.query(sql, async(err) => {if (err) {throw err;}})

                                newbc = results[0].pumpjack + parseInt(nombre);

                                embed = {
                                    author: {
                                        name: `${results[0].rang} de ${results[0].nom}`,
                                        icon_url: interaction.member.displayAvatarURL()
                                    },
                                    thumbnail: {
                                        url: `${results[0].drapeau}`
                                    },
                                    title: `\`Construction : ${nombre.toLocaleString('en-US')} pumpjacks\``,
                                    description: `> 🛠️ Vous avez désormais :\n` +
                                        codeBlock(`• ${newbc.toLocaleString('en-US')} pumpjacks`) + `\u200B`,
                                    color: interaction.member.displayHexColor,
                                    timestamp: new Date(),
                                    footer: {
                                        text: `${results[0].devise}`
                                    },
                                };
                                break;

                            case 'Quartier':
                                const_T_libre = batimentObject.quartier.SURFACE_QUARTIER * nombre;
                                const_bois = Math.round(batimentObject.quartier.CONST_QUARTIER_BOIS * nombre * eval(`gouvernementObject.${results[0].ideologie}.construction`));
                                const_brique = Math.round(batimentObject.quartier.CONST_QUARTIER_BRIQUE * nombre * eval(`gouvernementObject.${results[0].ideologie}.construction`));
                                const_metaux = Math.round(batimentObject.quartier.CONST_QUARTIER_METAUX * nombre * eval(`gouvernementObject.${results[0].ideologie}.construction`));

                                sql = `
                                        UPDATE pays SET quartier=quartier+${nombre} WHERE id_joueur='${interaction.member.id}';
                                        UPDATE pays SET T_libre=T_libre-${const_T_libre} WHERE id_joueur='${interaction.member.id}';
                                        UPDATE pays SET T_occ=T_occ+${const_T_libre} WHERE id_joueur='${interaction.member.id}';
                                        UPDATE pays SET bois=bois-${const_bois} WHERE id_joueur='${interaction.member.id}';
                                        UPDATE pays SET brique=brique-${const_brique} WHERE id_joueur='${interaction.member.id}';
                                        UPDATE pays SET metaux=metaux-${const_metaux} WHERE id_joueur='${interaction.member.id}'`;
                                connection.query(sql, async(err) => {if (err) {throw err;}})

                                newbc = results[0].quartier + parseInt(nombre);

                                embed = {
                                    author: {
                                        name: `${results[0].rang} de ${results[0].nom}`,
                                        icon_url: interaction.member.displayAvatarURL()
                                    },
                                    thumbnail: {
                                        url: `${results[0].drapeau}`
                                    },
                                    title: `\`Construction : ${nombre.toLocaleString('en-US')} quartiers\``,
                                    description: `> 🛠️ Vous avez désormais :\n` +
                                        codeBlock(`• ${newbc.toLocaleString('en-US')} quartiers`) + `\u200B`,
                                    color: interaction.member.displayHexColor,
                                    timestamp: new Date(),
                                    footer: {
                                        text: `${results[0].devise}`
                                    },
                                };
                                break;

                            case 'Scierie':
                                const_T_libre = batimentObject.scierie.SURFACE_SCIERIE * nombre;
                                const_bois = Math.round(batimentObject.scierie.CONST_SCIERIE_BOIS * nombre * eval(`gouvernementObject.${results[0].ideologie}.construction`));
                                const_brique = Math.round(batimentObject.scierie.CONST_SCIERIE_BRIQUE * nombre * eval(`gouvernementObject.${results[0].ideologie}.construction`));
                                const_metaux = Math.round(batimentObject.scierie.CONST_SCIERIE_METAUX * nombre * eval(`gouvernementObject.${results[0].ideologie}.construction`));

                                sql = `
                                    UPDATE pays SET scierie=scierie+${nombre} WHERE id_joueur='${interaction.member.id}';
                                    UPDATE pays SET usine_total=usine_total+${nombre} WHERE id_joueur='${interaction.member.id}';
                                    UPDATE pays SET T_libre=T_libre-${const_T_libre} WHERE id_joueur='${interaction.member.id}';
                                    UPDATE pays SET T_occ=T_occ+${const_T_libre} WHERE id_joueur='${interaction.member.id}';
                                    UPDATE pays SET bois=bois-${const_bois} WHERE id_joueur='${interaction.member.id}';
                                    UPDATE pays SET brique=brique-${const_brique} WHERE id_joueur='${interaction.member.id}';
                                    UPDATE pays SET metaux=metaux-${const_metaux} WHERE id_joueur='${interaction.member.id}'`;
                                connection.query(sql, async(err) => {if (err) {throw err;}})

                                newbc = results[0].scierie + parseInt(nombre);

                                embed = {
                                    author: {
                                        name: `${results[0].rang} de ${results[0].nom}`,
                                        icon_url: interaction.member.displayAvatarURL()
                                    },
                                    thumbnail: {
                                        url: `${results[0].drapeau}`
                                    },
                                    title: `\`Construction : ${nombre.toLocaleString('en-US')} scieries\``,
                                    description: `> 🛠️ Vous avez désormais :\n` +
                                        codeBlock(`• ${newbc.toLocaleString('en-US')} scieries`) + `\u200B`,
                                    color: interaction.member.displayHexColor,
                                    timestamp: new Date(),
                                    footer: {
                                        text: `${results[0].devise}`
                                    },
                                };
                                break;

                            case 'Usine civile':
                                const_T_libre = batimentObject.usine_civile.SURFACE_USINE_CIVILE * nombre;
                                const_bois = Math.round(batimentObject.usine_civile.CONST_USINE_CIVILE_BOIS * nombre * eval(`gouvernementObject.${results[0].ideologie}.construction`));
                                const_brique = Math.round(batimentObject.usine_civile.CONST_USINE_CIVILE_BRIQUE * nombre * eval(`gouvernementObject.${results[0].ideologie}.construction`));
                                const_metaux = Math.round(batimentObject.usine_civile.CONST_USINE_CIVILE_METAUX * nombre * eval(`gouvernementObject.${results[0].ideologie}.construction`));

                                sql = `
                                    UPDATE pays SET usine_civile=usine_civile+${nombre} WHERE id_joueur='${interaction.member.id}';
                                    UPDATE pays SET usine_total=usine_total+${nombre} WHERE id_joueur='${interaction.member.id}';
                                    UPDATE pays SET T_libre=T_libre-${const_T_libre} WHERE id_joueur='${interaction.member.id}';
                                    UPDATE pays SET T_occ=T_occ+${const_T_libre} WHERE id_joueur='${interaction.member.id}';
                                    UPDATE pays SET bois=bois-${const_bois} WHERE id_joueur='${interaction.member.id}';
                                    UPDATE pays SET brique=brique-${const_brique} WHERE id_joueur='${interaction.member.id}';
                                    UPDATE pays SET metaux=metaux-${const_metaux} WHERE id_joueur='${interaction.member.id}'`;
                                connection.query(sql, async(err) => {if (err) {throw err;}})

                                newbc = results[0].usine_civile + parseInt(nombre);

                                embed = {
                                    author: {
                                        name: `${results[0].rang} de ${results[0].nom}`,
                                        icon_url: interaction.member.displayAvatarURL()
                                    },
                                    thumbnail: {
                                        url: `${results[0].drapeau}`
                                    },
                                    title: `\`Construction : ${nombre.toLocaleString('en-US')} usines civile\``,
                                    description: `> 🛠️ Vous avez désormais :\n` +
                                        codeBlock(`• ${newbc.toLocaleString('en-US')} usines civiles`) + `\u200B`,
                                    color: interaction.member.displayHexColor,
                                    timestamp: new Date(),
                                    footer: {
                                        text: `${results[0].devise}`
                                    },
                                };
                                break;
                        }

                        interaction.deferUpdate()

                        interaction.message.edit({ embeds: [embed], components: [] })
                    });

                } else {
                    reponse = codeBlock('diff', `- Vous n'êtes pas l'auteur de cette commande`);
                    interaction.reply({ content: reponse, ephemeral: true });
                }
                //endregion

                //region [Demolition]
            } else if (interaction.customId.includes('demolition') === true) {

                id_joueur = interaction.customId.slice(11);
                if (id_joueur === interaction.member.id) {

                    sql = `SELECT * FROM pays WHERE id_joueur=${interaction.member.id}`;
                    connection.query(sql, async(err, results) => {
                        let embed;
                        let newbc;
                        let sql;
                        let demo_metaux;
                        let demo_brique;
                        let demo_bois;
                        let demo_T_libre;
                        if (err) {throw err;}

                        let title = interaction.message.embeds[0].title;
                        title = title.substring(14, title.length - 1);
                        const espace = title.indexOf(" ");
                        const nombre = title.slice(0, espace);
                        const batiment = title.slice(espace + 1);
                        const batimentObject = JSON.parse(readFileSync('data/batiment.json', 'utf-8'));

                        if (batiment === 'Briqueterie') {

                            demo_T_libre = batimentObject.briqueterie.SURFACE_BRIQUETERIE * nombre;
                            demo_bois = Math.round(batimentObject.briqueterie.CONST_BRIQUETERIE_BOIS * nombre * batimentObject.RETOUR_POURCENTAGE);
                            demo_brique = Math.round(batimentObject.briqueterie.CONST_BRIQUETERIE_BRIQUE * nombre * batimentObject.RETOUR_POURCENTAGE);
                            demo_metaux = Math.round(batimentObject.briqueterie.CONST_BRIQUETERIE_METAUX * nombre * batimentObject.RETOUR_POURCENTAGE);

                            sql = `
                                UPDATE pays SET briqueterie=briqueterie-${nombre} WHERE id_joueur='${interaction.member.id}';
                                UPDATE pays SET usine_total=usine_total-${nombre} WHERE id_joueur='${interaction.member.id}';
                                UPDATE pays SET T_libre=T_libre+${demo_T_libre} WHERE id_joueur='${interaction.member.id}';
                                UPDATE pays SET T_occ=T_occ-${demo_T_libre} WHERE id_joueur='${interaction.member.id}';
                                UPDATE pays SET bois=bois+${demo_bois} WHERE id_joueur='${interaction.member.id}';
                                UPDATE pays SET brique=brique+${demo_brique} WHERE id_joueur='${interaction.member.id}';
                                UPDATE pays SET metaux=metaux+${demo_metaux} WHERE id_joueur='${interaction.member.id}'`;
                            connection.query(sql, async(err) => {if (err) {throw err;}})

                            newbc = results[0].briqueterie - parseInt(nombre);

                            embed = {
                                author: {
                                    name: `${results[0].rang} de ${results[0].nom}`,
                                    icon_url: interaction.member.displayAvatarURL()
                                },
                                thumbnail: {
                                    url: `${results[0].drapeau}`
                                },
                                title: `\`Démolition : ${nombre.toLocaleString('en-US')} briqueteries\``,
                                description: `> 🛠️ Vous avez désormais :\n` +
                                    codeBlock(`• ${newbc.toLocaleString('en-US')} briqueteries`) + `\u200B`,
                                color: interaction.member.displayHexColor,
                                timestamp: new Date(),
                                footer: {
                                    text: `${results[0].devise}`
                                },
                            };

                            interaction.deferUpdate()
                            interaction.message.edit({ embeds: [embed], components: [] })

                        } else if (batiment === 'Champ') {

                            demo_T_libre = batimentObject.champ.SURFACE_CHAMP * nombre;
                            demo_bois = Math.round(batimentObject.champ.CONST_CHAMP_BOIS * nombre * batimentObject.RETOUR_POURCENTAGE);
                            demo_brique = Math.round(batimentObject.champ.CONST_CHAMP_BRIQUE * nombre * batimentObject.RETOUR_POURCENTAGE);
                            demo_metaux = Math.round(batimentObject.champ.CONST_CHAMP_METAUX * nombre * batimentObject.RETOUR_POURCENTAGE);

                            sql = `
                                UPDATE pays SET champ=champ-'${nombre}' WHERE id_joueur='${interaction.member.id}';
                                UPDATE pays SET usine_total=usine_total-'${nombre}' WHERE id_joueur='${interaction.member.id}';
                                UPDATE pays SET T_libre=T_libre+'${demo_T_libre}' WHERE id_joueur='${interaction.member.id}';
                                UPDATE pays SET T_occ=T_occ-'${demo_T_libre}' WHERE id_joueur='${interaction.member.id}';
                                UPDATE pays SET bois=bois+'${demo_bois}' WHERE id_joueur='${interaction.member.id}';
                                UPDATE pays SET brique=brique+'${demo_brique}' WHERE id_joueur='${interaction.member.id}';
                                UPDATE pays SET metaux=metaux+'${demo_metaux}' WHERE id_joueur='${interaction.member.id}'`;
                            connection.query(sql, async(err) => {if (err) {throw err;}});

                            newbc = results[0].champ - parseInt(nombre);

                            embed = {
                                author: {
                                    name: `${results[0].rang} de ${results[0].nom}`,
                                    icon_url: interaction.member.displayAvatarURL()
                                },
                                thumbnail: {
                                    url: `${results[0].drapeau}`
                                },
                                title: `\`Démolition : ${nombre.toLocaleString('en-US')} champs\``,
                                description: `> 🛠️ Vous avez désormais :\n` +
                                    codeBlock(`• ${newbc.toLocaleString('en-US')} champs`) + `\u200B`,
                                color: interaction.member.displayHexColor,
                                timestamp: new Date(),
                                footer: {
                                    text: `${results[0].devise}`
                                },
                            };

                            interaction.deferUpdate()
                            interaction.message.edit({ embeds: [embed], components: [] })

                        } else if (batiment === 'Centrale au fioul') {

                            demo_T_libre = batimentObject.centrale_fioul.SURFACE_CENTRALE_FIOUL * nombre;
                            demo_bois = Math.round(batimentObject.centrale_fioul.CONST_CENTRALE_FIOUL_BOIS * nombre * batimentObject.RETOUR_POURCENTAGE);
                            demo_brique = Math.round(batimentObject.centrale_fioul.CONST_CENTRALE_FIOUL_BRIQUE * nombre * batimentObject.RETOUR_POURCENTAGE);
                            demo_metaux = Math.round(batimentObject.centrale_fioul.CONST_CENTRALE_FIOUL_METAUX * nombre * batimentObject.RETOUR_POURCENTAGE);

                            sql = `
                                UPDATE pays SET centrale_fioul=centrale_fioul-'${nombre}' WHERE id_joueur='${interaction.member.id}';
                                UPDATE pays SET usine_total=usine_total-'${nombre}' WHERE id_joueur='${interaction.member.id}';
                                UPDATE pays SET T_libre=T_libre+'${demo_T_libre}' WHERE id_joueur='${interaction.member.id}';
                                UPDATE pays SET T_occ=T_occ-'${demo_T_libre}' WHERE id_joueur='${interaction.member.id}';
                                UPDATE pays SET bois=bois+'${demo_bois}' WHERE id_joueur='${interaction.member.id}';
                                UPDATE pays SET brique=brique+'${demo_brique}' WHERE id_joueur='${interaction.member.id}';
                                UPDATE pays SET metaux=metaux+'${demo_metaux}' WHERE id_joueur='${interaction.member.id}'`;
                            connection.query(sql, async(err) => {if (err) {throw err;}});

                            newbc = results[0].centrale_fioul - parseInt(nombre);

                            embed = {
                                author: {
                                    name: `${results[0].rang} de ${results[0].nom}`,
                                    icon_url: interaction.member.displayAvatarURL()
                                },
                                thumbnail: {
                                    url: `${results[0].drapeau}`
                                },
                                title: `\`Démolition : ${nombre.toLocaleString('en-US')} centrales électrique\``,
                                description: `> 🛠️ Vous avez désormais :\n` +
                                    codeBlock(`• ${newbc.toLocaleString('en-US')} centrales électriques`) + `\u200B`,
                                color: interaction.member.displayHexColor,
                                timestamp: new Date(),
                                footer: {
                                    text: `${results[0].devise}`
                                },
                            };

                            interaction.deferUpdate()
                            interaction.message.edit({ embeds: [embed], components: [] })

                        } else if (batiment === 'Eolienne') {

                            demo_T_libre = batimentObject.eolienne.SURFACE_EOLIENNE * nombre;
                            demo_metaux = Math.round(batimentObject.eolienne.CONST_EOLIENNE_METAUX * nombre * batimentObject.RETOUR_POURCENTAGE);

                            sql = `
                                UPDATE pays SET eolienne=eolienne-'${nombre}' WHERE id_joueur='${interaction.member.id}';
                                UPDATE pays SET usine_total=usine_total-'${nombre}' WHERE id_joueur='${interaction.member.id}';
                                UPDATE pays SET T_libre=T_libre+'${demo_T_libre}' WHERE id_joueur='${interaction.member.id}';
                                UPDATE pays SET T_occ=T_occ-'${demo_T_libre}' WHERE id_joueur='${interaction.member.id}';
                                UPDATE pays SET metaux=metaux+'${demo_metaux}' WHERE id_joueur='${interaction.member.id}'`;
                            connection.query(sql, async(err) => {if (err) {throw err;}});

                            newbc = results[0].eolienne - parseInt(nombre);

                            embed = {
                                author: {
                                    name: `${results[0].rang} de ${results[0].nom}`,
                                    icon_url: interaction.member.displayAvatarURL()
                                },
                                thumbnail: {
                                    url: `${results[0].drapeau}`
                                },
                                title: `\`Démolition : ${nombre.toLocaleString('en-US')} eoliennes\``,
                                description: `> 🛠️ Vous avez désormais :\n` +
                                    codeBlock(`• ${newbc.toLocaleString('en-US')} eoliennes`) + `\u200B`,
                                color: interaction.member.displayHexColor,
                                timestamp: new Date(),
                                footer: {
                                    text: `${results[0].devise}`
                                },
                            };

                            interaction.deferUpdate()
                            interaction.message.edit({ embeds: [embed], components: [] })

                        } else if (batiment === 'Mine') {

                            demo_T_libre = batimentObject.mine.SURFACE_MINE * nombre;
                            demo_bois = Math.round(batimentObject.mine.CONST_MINE_BOIS * nombre * batimentObject.RETOUR_POURCENTAGE);
                            demo_brique = Math.round(batimentObject.mine.CONST_MINE_BRIQUE * nombre * batimentObject.RETOUR_POURCENTAGE);
                            demo_metaux = Math.round(batimentObject.mine.CONST_MINE_METAUX * nombre * batimentObject.RETOUR_POURCENTAGE);

                            sql = `
                                UPDATE pays SET mine=mine-${nombre} WHERE id_joueur='${interaction.member.id}';
                                UPDATE pays SET usine_total=usine_total-${nombre} WHERE id_joueur='${interaction.member.id}';
                                UPDATE pays SET T_libre=T_libre+${demo_T_libre} WHERE id_joueur='${interaction.member.id}';
                                UPDATE pays SET T_occ=T_occ-${demo_T_libre} WHERE id_joueur='${interaction.member.id}';
                                UPDATE pays SET bois=bois+${demo_bois} WHERE id_joueur='${interaction.member.id}';
                                UPDATE pays SET brique=brique+${demo_brique} WHERE id_joueur='${interaction.member.id}';
                                UPDATE pays SET metaux=metaux+${demo_metaux} WHERE id_joueur='${interaction.member.id}'`;
                            connection.query(sql, async(err) => {if (err) {throw err;}})

                            newbc = results[0].mine - parseInt(nombre);

                            embed = {
                                author: {
                                    name: `${results[0].rang} de ${results[0].nom}`,
                                    icon_url: interaction.member.displayAvatarURL()
                                },
                                thumbnail: {
                                    url: `${results[0].drapeau}`
                                },
                                title: `\`Démolition : ${nombre.toLocaleString('en-US')} mines\``,
                                description: `> 🛠️ Vous avez désormais :\n` +
                                    codeBlock(`• ${newbc.toLocaleString('en-US')} mines`) + `\u200B`,
                                color: interaction.member.displayHexColor,
                                timestamp: new Date(),
                                footer: {
                                    text: `${results[0].devise}`
                                },
                            };

                            interaction.deferUpdate()
                            interaction.message.edit({ embeds: [embed], components: [] })

                        } else if (batiment === 'Pompe à eau') {

                            demo_T_libre = batimentObject.pompe_a_eau.SURFACE_POMPE_A_EAU * nombre;
                            demo_bois = Math.round(batimentObject.pompe_a_eau.CONST_POMPE_A_EAU_BOIS * nombre * batimentObject.RETOUR_POURCENTAGE);
                            demo_brique = Math.round(batimentObject.pompe_a_eau.CONST_POMPE_A_EAU_BRIQUE * nombre * batimentObject.RETOUR_POURCENTAGE);
                            demo_metaux = Math.round(batimentObject.pompe_a_eau.CONST_POMPE_A_EAU_METAUX * nombre * batimentObject.RETOUR_POURCENTAGE);

                            sql = `
                                UPDATE pays SET pompe_a_eau=pompe_a_eau-${nombre} WHERE id_joueur='${interaction.member.id}';
                                UPDATE pays SET usine_total=usine_total-${nombre} WHERE id_joueur='${interaction.member.id}';
                                UPDATE pays SET T_libre=T_libre+${demo_T_libre} WHERE id_joueur='${interaction.member.id}';
                                UPDATE pays SET T_occ=T_occ-${demo_T_libre} WHERE id_joueur='${interaction.member.id}';
                                UPDATE pays SET bois=bois+${demo_bois} WHERE id_joueur='${interaction.member.id}';
                                UPDATE pays SET brique=brique+${demo_brique} WHERE id_joueur='${interaction.member.id}';
                                UPDATE pays SET metaux=metaux+${demo_metaux} WHERE id_joueur='${interaction.member.id}'`;
                            connection.query(sql, async(err) => {if (err) {throw err;}})

                            newbc = results[0].pompe_a_eau - parseInt(nombre);

                            embed = {
                                author: {
                                    name: `${results[0].rang} de ${results[0].nom}`,
                                    icon_url: interaction.member.displayAvatarURL()
                                },
                                thumbnail: {
                                    url: `${results[0].drapeau}`
                                },
                                title: `\`Démolition : ${nombre.toLocaleString('en-US')} pompes à eau\``,
                                description: `> 🛠️ Vous avez désormais :\n` +
                                    codeBlock(`• ${newbc.toLocaleString('en-US')} pompes à eau`) + `\u200B`,
                                color: interaction.member.displayHexColor,
                                timestamp: new Date(),
                                footer: {
                                    text: `${results[0].devise}`
                                },
                            };

                            interaction.deferUpdate()
                            interaction.message.edit({ embeds: [embed], components: [] })

                        } else if (batiment === 'Pumpjack') {

                            demo_T_libre = batimentObject.pumpjack.SURFACE_PUMPJACK * nombre;
                            demo_bois = Math.round(batimentObject.pumpjack.CONST_PUMPJACK_BOIS * nombre * batimentObject.RETOUR_POURCENTAGE);
                            demo_brique = Math.round(batimentObject.pumpjack.CONST_PUMPJACK_BRIQUE * nombre * batimentObject.RETOUR_POURCENTAGE);
                            demo_metaux = Math.round(batimentObject.pumpjack.CONST_PUMPJACK_METAUX * nombre * batimentObject.RETOUR_POURCENTAGE);

                            sql = `
                                UPDATE pays SET pumpjack=pumpjack-${nombre} WHERE id_joueur='${interaction.member.id}';
                                UPDATE pays SET usine_total=usine_total-${nombre} WHERE id_joueur='${interaction.member.id}';
                                UPDATE pays SET T_libre=T_libre+${demo_T_libre} WHERE id_joueur='${interaction.member.id}';
                                UPDATE pays SET T_occ=T_occ-${demo_T_libre} WHERE id_joueur='${interaction.member.id}';
                                UPDATE pays SET bois=bois+${demo_bois} WHERE id_joueur='${interaction.member.id}';
                                UPDATE pays SET brique=brique+${demo_brique} WHERE id_joueur='${interaction.member.id}';
                                UPDATE pays SET metaux=metaux+${demo_metaux} WHERE id_joueur='${interaction.member.id}'`;
                            connection.query(sql, async(err) => {if (err) {throw err;}})

                            newbc = results[0].pumpjack - parseInt(nombre);

                            embed = {
                                author: {
                                    name: `${results[0].rang} de ${results[0].nom}`,
                                    icon_url: interaction.member.displayAvatarURL()
                                },
                                thumbnail: {
                                    url: `${results[0].drapeau}`
                                },
                                title: `\`Démolition : ${nombre.toLocaleString('en-US')} pumpjacks\``,
                                description: `> 🛠️ Vous avez désormais :\n` +
                                    codeBlock(`• ${newbc.toLocaleString('en-US')} pumpjacks`) + `\u200B`,
                                color: interaction.member.displayHexColor,
                                timestamp: new Date(),
                                footer: {
                                    text: `${results[0].devise}`
                                },
                            };

                            interaction.deferUpdate()
                            interaction.message.edit({ embeds: [embed], components: [] })

                        } else if (batiment === 'Quartier') {

                            demo_T_libre = batimentObject.quartier.SURFACE_QUARTIER * nombre;
                            demo_bois = Math.round(batimentObject.quartier.CONST_QUARTIER_BOIS * nombre * batimentObject.RETOUR_POURCENTAGE);
                            demo_brique = Math.round(batimentObject.quartier.CONST_QUARTIER_BRIQUE * nombre * batimentObject.RETOUR_POURCENTAGE);
                            demo_metaux = Math.round(batimentObject.quartier.CONST_QUARTIER_METAUX * nombre * batimentObject.RETOUR_POURCENTAGE);

                            sql = `
                                UPDATE pays SET quartier=quartier-${nombre} WHERE id_joueur='${interaction.member.id}';
                                UPDATE pays SET T_libre=T_libre+${demo_T_libre} WHERE id_joueur='${interaction.member.id}';
                                UPDATE pays SET T_occ=T_occ-${demo_T_libre} WHERE id_joueur='${interaction.member.id}';
                                UPDATE pays SET bois=bois+${demo_bois} WHERE id_joueur='${interaction.member.id}';
                                UPDATE pays SET brique=brique+${demo_brique} WHERE id_joueur='${interaction.member.id}';
                                UPDATE pays SET metaux=metaux+${demo_metaux} WHERE id_joueur='${interaction.member.id}'`;
                            connection.query(sql, async(err) => {if (err) {throw err;}})

                            newbc = results[0].quartier - parseInt(nombre);

                            embed = {
                                author: {
                                    name: `${results[0].rang} de ${results[0].nom}`,
                                    icon_url: interaction.member.displayAvatarURL()
                                },
                                thumbnail: {
                                    url: `${results[0].drapeau}`
                                },
                                title: `\`Démolition : ${nombre.toLocaleString('en-US')} quartiers\``,
                                description: `> 🛠️ Vous avez désormais :\n` +
                                    codeBlock(`• ${newbc.toLocaleString('en-US')} quartiers`) + `\u200B`,
                                color: interaction.member.displayHexColor,
                                timestamp: new Date(),
                                footer: {
                                    text: `${results[0].devise}`
                                },
                            };

                            interaction.deferUpdate()
                            interaction.message.edit({ embeds: [embed], components: [] })

                        } else if (batiment === 'Scierie') {

                            demo_T_libre = batimentObject.scierie.SURFACE_SCIERIE * nombre;
                            demo_bois = Math.round(batimentObject.scierie.CONST_SCIERIE_BOIS * nombre * batimentObject.RETOUR_POURCENTAGE);
                            demo_brique = Math.round(batimentObject.scierie.CONST_SCIERIE_BRIQUE * nombre * batimentObject.RETOUR_POURCENTAGE);
                            demo_metaux = Math.round(batimentObject.scierie.CONST_SCIERIE_METAUX * nombre * batimentObject.RETOUR_POURCENTAGE);

                            sql = `
                                UPDATE pays SET scierie=scierie-${nombre} WHERE id_joueur='${interaction.member.id}';
                                UPDATE pays SET usine_total=usine_total-${nombre} WHERE id_joueur='${interaction.member.id}';
                                UPDATE pays SET T_libre=T_libre+${demo_T_libre} WHERE id_joueur='${interaction.member.id}';
                                UPDATE pays SET T_occ=T_occ-${demo_T_libre} WHERE id_joueur='${interaction.member.id}';
                                UPDATE pays SET bois=bois+${demo_bois} WHERE id_joueur='${interaction.member.id}';
                                UPDATE pays SET brique=brique+${demo_brique} WHERE id_joueur='${interaction.member.id}';
                                UPDATE pays SET metaux=metaux+${demo_metaux} WHERE id_joueur='${interaction.member.id}'`;
                            connection.query(sql, async(err) => {if (err) {throw err;}})

                            newbc = results[0].scierie - parseInt(nombre);

                            embed = {
                                author: {
                                    name: `${results[0].rang} de ${results[0].nom}`,
                                    icon_url: interaction.member.displayAvatarURL()
                                },
                                thumbnail: {
                                    url: `${results[0].drapeau}`
                                },
                                title: `\`Démolition : ${nombre.toLocaleString('en-US')} scieries\``,
                                description: `> 🛠️ Vous avez désormais :\n` +
                                    codeBlock(`• ${newbc.toLocaleString('en-US')} scieries`) + `\u200B`,
                                color: interaction.member.displayHexColor,
                                timestamp: new Date(),
                                footer: {
                                    text: `${results[0].devise}`
                                },
                            };

                            interaction.deferUpdate()
                            interaction.message.edit({ embeds: [embed], components: [] })

                        } else if (batiment === 'Usine civile') {

                            demo_T_libre = batimentObject.usine_civile.SURFACE_USINE_CIVILE * nombre;
                            demo_bois = Math.round(batimentObject.usine_civile.CONST_USINE_CIVILE_BOIS * nombre * batimentObject.RETOUR_POURCENTAGE);
                            demo_brique = Math.round(batimentObject.usine_civile.CONST_USINE_CIVILE_BRIQUE * nombre * batimentObject.RETOUR_POURCENTAGE);
                            demo_metaux = Math.round(batimentObject.usine_civile.CONST_USINE_CIVILE_METAUX * nombre * batimentObject.RETOUR_POURCENTAGE);

                            sql = `
                                UPDATE pays SET usine_civile=usine_civile-${nombre} WHERE id_joueur='${interaction.member.id}';
                                UPDATE pays SET usine_total=usine_total-${nombre} WHERE id_joueur='${interaction.member.id}';
                                UPDATE pays SET T_libre=T_libre+${demo_T_libre} WHERE id_joueur='${interaction.member.id}';
                                UPDATE pays SET T_occ=T_occ-${demo_T_libre} WHERE id_joueur='${interaction.member.id}';
                                UPDATE pays SET bois=bois+${demo_bois} WHERE id_joueur='${interaction.member.id}';
                                UPDATE pays SET brique=brique+${demo_brique} WHERE id_joueur='${interaction.member.id}';
                                UPDATE pays SET metaux=metaux+${demo_metaux} WHERE id_joueur='${interaction.member.id}'`;
                            connection.query(sql, async(err) => {if (err) {throw err;}})

                            newbc = results[0].usine_civile - parseInt(nombre);

                            embed = {
                                author: {
                                    name: `${results[0].rang} de ${results[0].nom}`,
                                    icon_url: interaction.member.displayAvatarURL()
                                },
                                thumbnail: {
                                    url: `${results[0].drapeau}`
                                },
                                title: `\`Démolition : ${nombre.toLocaleString('en-US')} usines civile\``,
                                description: `> 🛠️ Vous avez désormais : 🛠️\n` +
                                    codeBlock(`• ${newbc.toLocaleString('en-US')} usines civiles`) + `\u200B`,
                                color: interaction.member.displayHexColor,
                                timestamp: new Date(),
                                footer: {
                                    text: `${results[0].devise}`
                                },
                            };

                            interaction.deferUpdate()
                            interaction.message.edit({ embeds: [embed], components: [] })

                        }
                    });

                } else {
                    reponse = codeBlock('diff', `- Vous n'êtes pas l'auteur de cette commande`);
                    interaction.reply({ content: reponse, ephemeral: true });
                }
                //endregion

                //region [Acheter]
            } else if (interaction.customId.includes('acheter') === true) {

                id_joueur = interaction.customId.slice(8);
                if (id_joueur === interaction.member.id) {
                    reponse = codeBlock('diff', `- Vous ne pouvez pas acheter votre offre`);
                    interaction.reply({ content: reponse, ephemeral: true });
                } else {
                    fields = interaction.message.embeds[0].fields;
                    espace = fields[0].value.indexOf("Prix");
                    ressource = fields[0].value.slice(6, espace - 3);

                    quantite = interaction.message.embeds[0].fields[1].value.slice(6, fields[1].value.length - 4);
                    const search = ',';
                    const replaceWith = '';
                    quantite = parseInt(quantite.split(search).join(replaceWith));

                    const texte = interaction.message.embeds[0].fields[2].value
                    prix_u = Number(texte.slice((texte.indexOf(":") + 2), (texte.indexOf("(") - 1)));
                    prix = Math.round(prix_u * quantite);
                    //console.log(espace + ` | ` + ressource + ` | ` + prix_u + ` | ` + prix + ` | ` + texte + ` | ` + (texte.indexOf(":") + 2) + ` | ` + (texte.indexOf("Au") - 3))

                    sql = `SELECT * FROM pays WHERE id_joueur='${id_joueur}'`;

                    connection.query(sql, async(err) => {
                        let res;
                        if (err) {throw err;}

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
                        connection.query(sql, async(err, results) => {if (err) {throw err;}

                            if (results[0].cash >= prix) {

                                const acheteur = {
                                    author: {
                                        name: `${results[0].rang} de ${results[0].nom}`,
                                        icon_url: interaction.member.displayAvatarURL()
                                    },
                                    thumbnail: {
                                        url: results[0].drapeau,
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
                                        text: `${results[0].devise}`
                                    },
                                };

                                const vendeur = {
                                    author: {
                                        name: `${results[0].rang} de ${results[0].nom}`,
                                        icon_url: interaction.member.displayAvatarURL()
                                    },
                                    thumbnail: {
                                        url: results[0].drapeau,
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
                                        text: `${results[0].devise}`
                                    },
                                };

                                const commerce = {
                                    author: {
                                        name: `${results[0].rang} de ${results[0].nom}`,
                                        icon_url: interaction.member.displayAvatarURL()
                                    },
                                    thumbnail: {
                                        url: results[0].drapeau,
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
                                        text: `${results[0].devise}`
                                    },
                                };

                                const salon_commerce = interaction.client.channels.cache.get(process.env.SALON_COMMERCE);
                                salon_commerce.send({ embeds: [commerce] })

                                interaction.user.send({ embeds: [acheteur] });
                                const id_vendeur = await interaction.guild.members.fetch(id_joueur);
                                id_vendeur.send({ embeds: [vendeur] });

                                const thread = await interaction.channel.fetch();
                                await thread.delete();


                                let sql = `SELECT * FROM trade WHERE ressource="${ressource}" ORDER BY id_trade`;
                                connection.query(sql, async(err, results) => {if (err) {throw err;}
                                    const arrayQvente = Object.values(results);
                                    const sql = `DELETE FROM trade WHERE id_trade='${arrayQvente[0].id_trade}'`;
                                    connection.query(sql, async(err) => {if (err) {throw err;}});
                                });

                                sql = `
                                    INSERT INTO trade SET id_joueur="${interaction.user.id}", id_salon="${interaction.channelId}", ressource="${ressource}", quantite='${quantite}', prix='${prix}', prix_u='${prix_u}';
                                    UPDATE pays SET cash=cash+${prix} WHERE id_joueur="${id_joueur}";
                                    UPDATE pays SET cash=cash-${prix} WHERE id_joueur="${interaction.user.id}";
                                    UPDATE pays SET ${res}=${res}+${quantite} WHERE id_joueur="${interaction.user.id}";
                                    INSERT INTO historique SET id_joueur="${interaction.user.id}", id_salon="${interaction.channelId}", type="offre", ressource="${ressource}", quantite='${quantite}', prix='${prix}', prix_u='${prix_u}'`;
                                connection.query(sql, async(err) => {if (err) {throw err;}})

                            } else {
                                const reponse = codeBlock('diff', `- Vous n'avez pas l'argent nécessaire pour conclure l'affaire : ${results[0].cash.toLocaleString('en-US')}/${prix.toLocaleString('en-US')}`);
                                await interaction.reply({ content: reponse, ephemeral: true });
                            }
                        })
                    });

                }
                //endregion

                //region [Vendre]
            } else if (interaction.customId.includes('vendre') === true) {

                id_joueur = interaction.customId.slice(7);
                if (id_joueur === interaction.member.id) {

                    fields = interaction.message.embeds[0].fields;
                    espace = fields[0].value.indexOf("Prix");
                    ressource = fields[0].value.slice(6, espace - 3);

                    quantite = interaction.message.embeds[0].fields[1].value.slice(6, fields[1].value.length - 4);
                    const search = ',';
                    const replaceWith = '';
                    const quantite = parseInt(quantite.split(search).join(replaceWith));

                    espace2 = fields[2].value.indexOf("(");
                    prix_u = fields[2].value.slice(18, espace2 - 1);
                    prix = Math.round(prix_u * quantite);
                    //console.log(espace + ` | ` + ressource + ` | ` + espace2 + ` | ` + prix_u + ` | ` + prix)

                    sql = `SELECT * FROM pays WHERE id_joueur="${id_joueur}"`;
                    connection.query(sql, async(err, results) => {
                        let res;
                        if (err) {throw err;}

                        const pourcentage = fields[2].value.slice(fields[2].value.indexOf("(") - 1, fields[2].value.indexOf(")"));
                        const gouvernementObject = JSON.parse(readFileSync('data/gouvernement.json', 'utf-8'));
                        const vendreCommandCooldown = new CommandCooldown('vendre', ms(`${eval(`gouvernementObject.${results[0].ideologie}.commerce`)}m`));

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
                                name: `${results[0].rang} de ${results[0].nom}`,
                                icon_url: interaction.member.displayAvatarURL()
                            },
                            thumbnail: {
                                url: results[0].drapeau
                            },
                            title: `\`Vous avez fait une offre au marché internationnal :\``,
                            fields: interaction.message.embeds[0].fields,
                            color: interaction.member.displayHexColor,
                            timestamp: new Date(),
                            footer: {
                                text: `${results[0].devise}`
                            },
                        };

                        interaction.message.edit({ embeds: [embed], components: [] });

                        const salon_commerce = interaction.client.channels.cache.get(process.env.SALON_COMMERCE);
                        const thread = await salon_commerce.threads
                            .create({
                                name: `${quantite.toLocaleString('en-US')} [${ressource}] à ${prix_u.toLocaleString('en-US')} | ${prix.toLocaleString('en-US')} $ | ${interaction.member.displayName}`
                            });

                        const offre = {
                            author: {
                                name: `${results[0].rang} de ${results[0].nom}`,
                                icon_url: interaction.member.displayAvatarURL()
                            },
                            thumbnail: {
                                url: results[0].drapeau
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
                                text: `${results[0].devise}`
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

                        thread.send({ embeds: [offre], components: [row] });

                        interaction.channel.send({ content: `Votre offre a été publiée pour 1 jour : ${thread}` });
                        await vendreCommandCooldown.addUser(interaction.member.id);

                        const sql = `UPDATE pays SET ${res}=${res}-${quantite} WHERE id_joueur="${id_joueur}"`;
                        connection.query(sql, async(err) => {if (err) {throw err;}});
                    });

                } else {
                    reponse = codeBlock('diff', `- Vous n'êtes pas l'auteur de cette commande`);
                    interaction.reply({ content: reponse, ephemeral: true });
                }
                //endregion

                //region [Vente rapide]
            } else if (interaction.customId.includes('qvente') === true) {

                id_joueur = interaction.customId.slice(7);
                if (id_joueur === interaction.member.id) {

                    fields = interaction.message.embeds[0].fields;
                    espace = fields[0].value.indexOf("Prix");
                    ressource = fields[0].value.slice(6, espace - 3);

                    quantite = interaction.message.embeds[0].fields[1].value.slice(6, fields[1].value.length - 4);
                    const search = ',';
                    const replaceWith = '';
                    const quantite = quantite.split(search).join(replaceWith);

                    espace2 = fields[2].value.indexOf("Au");
                    prix_u = fields[2].value.slice(39, espace2 - 3);
                    prix = Math.round(prix_u * quantite);
                    //console.log(espace + ` | ` + ressource + ` | ` + espace2 + ` | ` + prix_u + ` | ` + prix)

                    sql = `SELECT * FROM pays WHERE id_joueur="${id_joueur}"`;

                    connection.query(sql, async(err, results) => {
                        let res;
                        if (err) {throw err;}

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
                                name: `${results[0].rang} de ${results[0].nom}`,
                                icon_url: interaction.member.displayAvatarURL()
                            },
                            thumbnail: {
                                url: results[0].drapeau
                            },
                            title: `\`Vous avez vendus au marché rapide :\``,
                            fields: interaction.message.embeds[0].fields,
                            color: interaction.member.displayHexColor,
                            timestamp: new Date(),
                            footer: {
                                text: `${results[0].devise}`
                            },
                        };

                        await interaction.deferUpdate()
                        interaction.message.edit({ embeds: [embed], components: [] });

                        let sql = `SELECT * FROM qvente WHERE ressource="${ressource}" ORDER BY id_vente`;
                        connection.query(sql, async(err, results) => {if (err) {throw err;}
                            const arrayQvente = Object.values(results);
                            const sql = `DELETE FROM qvente WHERE id_vente='${arrayQvente[0].id_vente}'`;
                            connection.query(sql, async(err) => {if (err) {throw err;}});
                        });

                        sql = `
                            INSERT INTO qvente SET id_joueur="${interaction.user.id}", id_salon="${interaction.channelId}", ressource="${ressource}", quantite='${quantite}', prix='${prix}', prix_u='${prix_u}';
                            UPDATE pays SET cash=cash+${prix} WHERE id_joueur="${id_joueur}";
                            UPDATE pays SET ${res}=${res}-${quantite} WHERE id_joueur="${id_joueur}";
                            INSERT INTO historique SET id_joueur="${interaction.user.id}", id_salon="${interaction.channelId}", type="qvente", ressource="${ressource}", quantite='${quantite}', prix='${prix}', prix_u='${prix_u}'`;
                        connection.query(sql, async(err) => {if (err) {throw err;}});
                    });

                } else {
                    reponse = codeBlock('diff', `- Vous n'êtes pas l'auteur de cette commande`);
                    interaction.reply({ content: reponse, ephemeral: true });
                }
                //endregion

                //region [Achat rapide]
            } else if (interaction.customId.includes('qachat') === true) {

                id_joueur = interaction.customId.slice(7);
                if (id_joueur === interaction.member.id) {

                    fields = interaction.message.embeds[0].fields;
                    espace = fields[0].value.indexOf("Prix");
                    ressource = fields[0].value.slice(6, espace - 3);

                    quantite = interaction.message.embeds[0].fields[1].value.slice(6, fields[1].value.length - 4);
                    const search = ',';
                    const replaceWith = '';
                    const quantite = quantite.split(search).join(replaceWith);

                    espace2 = fields[2].value.indexOf("Au");
                    prix_u = fields[2].value.slice(39, espace2 - 3);
                    prix = Math.round(prix_u * quantite);
                    //console.log(espace + ` | ` + ressource + ` | ` + espace2 + ` | ` + prix_u + ` | ` + prix)

                    sql = `SELECT * FROM pays WHERE id_joueur='${id_joueur}'`;
                    connection.query(sql, async(err, results) => {
                        let res;
                        if (err) {throw err;}

                        if (prix > results[0].cash) {
                            const reponse = codeBlock('diff', `- Vous n'avez pas assez d\'argent : ${results[0].cash.toLocaleString('en-US')}/${prix.toLocaleString('en-US')}`);
                            await interaction.reply({ content: reponse, ephemeral: true });
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
                                    name: `${results[0].rang} de ${results[0].nom}`,
                                    icon_url: interaction.member.displayAvatarURL()
                                },
                                thumbnail: {
                                    url: results[0].drapeau
                                },
                                title: `\`Vous avez acheté au marché rapide :\``,
                                fields: interaction.message.embeds[0].fields,
                                color: interaction.member.displayHexColor,
                                timestamp: new Date(),
                                footer: {
                                    text: `${results[0].devise}`
                                },
                            };

                            await interaction.deferUpdate()
                            interaction.message.edit({ embeds: [embed], components: [] });

                            let sql = `SELECT * FROM qachat WHERE ressource='${ressource}' ORDER BY id_achat`;
                            connection.query(sql, async(err, results) => {if (err) {throw err;}
                                var arrayQvente = Object.values(results);
                                var sql = `DELETE FROM qachat WHERE id_achat='${arrayQvente[0].id_achat}'`;
                                connection.query(sql, async(err) => {if (err) {throw err;}});
                            });

                            sql = `
                                INSERT INTO qachat SET id_joueur="${interaction.user.id}", id_salon="${interaction.channelId}", ressource="${ressource}", quantite='${quantite}', prix='${prix}', prix_u='${prix_u}';
                                UPDATE pays SET cash=cash-${prix} WHERE id_joueur="${id_joueur}";
                                UPDATE pays SET ${res}=${res}+${quantite} WHERE id_joueur="${id_joueur}";
                                INSERT INTO historique SET id_joueur="${interaction.user.id}", id_salon="${interaction.channelId}", type="qachat", ressource="${ressource}", quantite='${quantite}', prix='${prix}', prix_u='${prix_u}'`;
                            connection.query(sql, async(err) => {if (err) {throw err;}});
                        }
                    });

                } else {
                    reponse = codeBlock('diff', `- Vous n'êtes pas l'auteur de cette commande`);
                    interaction.reply({ content: reponse, ephemeral: true });
                }
                //endregion

                //#region [Refuser]
            } else if (interaction.customId.includes('refuser') === true) {

                id_joueur = interaction.customId.slice(8);
                if (id_joueur === interaction.member.id) {
                    interaction.message.delete()
                } else {
                    reponse = codeBlock('diff', `- Vous n'êtes pas l'auteur de cette commande`);
                    interaction.reply({ content: reponse, ephemeral: true });
                }
                //endregion

                //#region [Supprimer]
            } else if (interaction.customId.includes('supprimer') === true) {

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

                    sql = `UPDATE pays SET ${res}=${res}+${quantite} WHERE id_joueur="${interaction.user.id}"`;
                    connection.query(sql, async(err) => { if (err) { throw err; } })
                    interaction.channel.delete()

                } else {
                    reponse = codeBlock('diff', `- Vous n'êtes pas l'auteur de cette offre`);
                    interaction.reply({ content: reponse, ephemeral: true });
                }
            }
            //endregion

        } else if (interaction.isSelectMenu()) {

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
            salon_logs.send({ embeds: [log] });

            if (interaction.customId === 'usine') {
                sql = `SELECT * FROM pays WHERE id_joueur=${interaction.member.id}`;
                connection.query(sql, async(err, results) => {
                    let electricite;
                    let diff;
                    let conso;
                    if (err) {throw err;}

                    const regionObject = JSON.parse(readFileSync('data/region.json', 'utf-8'));
                    const gouvernementObject = JSON.parse(readFileSync('data/gouvernement.json', 'utf-8'));
                    const batimentObject = JSON.parse(readFileSync('data/batiment.json', 'utf-8'));
                    //region [Usine - Briqueterie]
                    if (interaction.values === 'briqueterie') {


                        const prod_T_briqueterie = Math.round(batimentObject.briqueterie.PROD_BRIQUETERIE * results[0].briqueterie * eval(`gouvernementObject.${results[0].ideologie}.production`));
                        const conso_T_briqueterie_bois = Math.round(batimentObject.briqueterie.CONSO_BRIQUETERIE_BOIS * results[0].briqueterie * eval(`gouvernementObject.${results[0].ideologie}.consommation`));
                        const conso_T_briqueterie_eau = Math.round(batimentObject.briqueterie.CONSO_BRIQUETERIE_EAU * results[0].briqueterie * eval(`gouvernementObject.${results[0].ideologie}.consommation`));
                        const conso_T_briqueterie_elec = Math.round(batimentObject.briqueterie.CONSO_BRIQUETERIE_ELECTRICITE * results[0].briqueterie);

                        const embed = {
                            author: {
                                name: `${results[0].rang} de ${results[0].nom}`,
                                icon_url: interaction.member.displayAvatarURL()
                            },
                            thumbnail: {
                                url: `${results[0].drapeau}`,
                            },
                            title: `\`Usine : Briqueterie\``,
                            fields: [{
                                name: `> Consommation : 🪵💧`,
                                value: `- Par usine : \n` +
                                    codeBlock(
                                        `• Bois : ${Math.round(batimentObject.briqueterie.CONSO_BRIQUETERIE_BOIS * eval(`gouvernementObject.${results[0].ideologie}.consommation`)).toLocaleString('en-US')}\n` +
                                        `• Eau : ${Math.round(batimentObject.briqueterie.CONSO_BRIQUETERIE_EAU * eval(`gouvernementObject.${results[0].ideologie}.consommation`)).toLocaleString('en-US')}`) +
                                    codeBlock(
                                        `• ⚡ Electricité : ${parseInt(batimentObject.briqueterie.CONSO_BRIQUETERIE_ELECTRICITE).toLocaleString('en-US')}`) + `\u200B`,
                                inline: true
                            },
                                {
                                    name: `\u200B`,
                                    value: `- Totale : \n` +
                                        codeBlock(
                                            `• Bois : ${conso_T_briqueterie_bois.toLocaleString('en-US')}\n` +
                                            `• Eau : ${conso_T_briqueterie_eau.toLocaleString('en-US')}`) +
                                        codeBlock(
                                            `• ⚡ Electricité : ${conso_T_briqueterie_elec.toLocaleString('en-US')}`) + `\u200B`,
                                    inline: true
                                },
                                {
                                    name: `> Production :`,
                                    value: `Ressource : 🧱 brique\n` +
                                        codeBlock(
                                            `• Par usine : ${Math.round(batimentObject.briqueterie.PROD_BRIQUETERIE * eval(`gouvernementObject.${results[0].ideologie}.production`)).toLocaleString('en-US')}\n` +
                                            `• Totale : ${prod_T_briqueterie.toLocaleString('en-US')}`) + `\u200B`
                                },
                                {
                                    name: `> En réserve :`,
                                    value: codeBlock(`• ${results[0].brique.toLocaleString('en-US')}`) + `\u200B`
                                },
                            ],
                            color: interaction.member.displayHexColor,
                            timestamp: new Date(),
                            footer: {text: `${results[0].devise}`}
                        };

                        interaction.reply({embeds: [embed]})
                        //endregion

                        //region [Usine - Champ]
                    } else if (interaction.values === 'champ') {

                        const prod_champ = Math.round(batimentObject.champ.PROD_CHAMP * eval(`gouvernementObject.${results[0].ideologie}.production`) * ((parseInt((eval(`regionObject.${results[0].region}.nourriture`))) + 100) / 100));
                        const conso_T_champ_eau = Math.round(batimentObject.champ.CONSO_CHAMP_EAU * results[0].champ * eval(`gouvernementObject.${results[0].ideologie}.consommation`));
                        const conso_T_champ_elec = Math.round(batimentObject.champ.CONSO_CHAMP_ELECTRICITE * results[0].champ);

                        const embed = {
                            author: {
                                name: `${results[0].rang} de ${results[0].nom}`,
                                icon_url: interaction.member.displayAvatarURL()
                            },
                            thumbnail: {
                                url: `${results[0].drapeau}`,
                            },
                            title: `\`Usine : Champ\``,
                            fields: [{
                                name: `> Consommation : 💧`,
                                value: `- Par usine : \n` +
                                    codeBlock(`• Eau : ${parseInt(batimentObject.champ.CONSO_CHAMP_EAU).toLocaleString('en-US')}`) +
                                    codeBlock(
                                        `• ⚡ Electricité : ${parseInt(batimentObject.champ.CONSO_CHAMP_ELECTRICITE).toLocaleString('en-US')}`) + `\u200B`,
                                inline: true
                            },
                                {
                                    name: `\u200B`,
                                    value: `- Totale : \n` +
                                        codeBlock(`• Eau : ${conso_T_champ_eau.toLocaleString('en-US')}`) +
                                        codeBlock(
                                            `• ⚡ Electricité : ${conso_T_champ_elec.toLocaleString('en-US')}`) + `\u200B`,
                                    inline: true
                                },
                                {
                                    name: `> Production :`,
                                    value: `Ressource : 🌽 Nourriture\n` +
                                        codeBlock(
                                            `• Par usine : ${prod_champ.toLocaleString('en-US')}\n` +
                                            `• Totale : ${(prod_champ * results[0].champ).toLocaleString('en-US')}`) + `\u200B`
                                },
                                {
                                    name: `> En réserve :`,
                                    value: codeBlock(`• ${results[0].nourriture.toLocaleString('en-US')}`) + `\u200B`
                                },
                            ],
                            color: interaction.member.displayHexColor,
                            timestamp: new Date(),
                            footer: {text: `${results[0].devise}`}
                        };

                        interaction.reply({embeds: [embed]})
                        //endregion

                        //region [Usine - Centrale au fioul]
                    } else if (interaction.values === 'centrale_fioul') {

                        const prod_T_centrale_fioul = Math.round(batimentObject.centrale_fioul.PROD_CENTRALE_FIOUL * results[0].centrale_fioul);
                        const prod_T_elec = Math.round((batimentObject.centrale_fioul.PROD_CENTRALE_FIOUL * results[0].centrale_fioul + batimentObject.eolienne.PROD_EOLIENNE * results[0].eolienne));
                        const conso_T_centrale_fioul_petrole = batimentObject.centrale_fioul.CONSO_CENTRALE_FIOUL_PETROLE * results[0].centrale_fioul;

                        conso = batimentObject.briqueterie.CONSO_BRIQUETERIE_ELECTRICITE * results[0].briqueterie + batimentObject.champ.CONSO_CHAMP_ELECTRICITE * results[0].champ + batimentObject.mine.CONSO_MINE_ELECTRICITE * results[0].mine + batimentObject.pompe_a_eau.CONSO_POMPE_A_EAU_ELECTRICITE * results[0].pompe_a_eau + batimentObject.pumpjack.CONSO_PUMPJACK_ELECTRICITE * results[0].pumpjack + batimentObject.quartier.CONSO_QUARTIER_ELECTRICITE * results[0].quartier + batimentObject.scierie.CONSO_SCIERIE_ELECTRICITE * results[0].scierie + batimentObject.usine_civile.CONSO_USINE_CIVILE_ELECTRICITE * results[0].usine_civile;
                        diff = (prod_T_elec - conso);
                        if (diff > 0) {
                            electricite = codeBlock('py', `'${conso.toLocaleString('en-US')}/${prod_T_elec.toLocaleString('en-US')} | ${(prod_T_elec - conso).toLocaleString('en-US')}'`);
                        } else if (diff === 0) {
                            electricite = codeBlock('fix', `${conso.toLocaleString('en-US')}/${prod_T_elec.toLocaleString('en-US')} | ${(prod_T_elec - conso).toLocaleString('en-US')}`);
                        } else {
                            electricite = codeBlock('diff', `- ${conso.toLocaleString('en-US')}/${prod_T_elec.toLocaleString('en-US')} | ${(prod_T_elec - conso).toLocaleString('en-US')}`);
                        }

                        const embed = {
                            author: {
                                name: `${results[0].rang} de ${results[0].nom}`,
                                icon_url: interaction.member.displayAvatarURL()
                            },
                            thumbnail: {
                                url: `${results[0].drapeau}`,
                            },
                            title: `\`Usine : Centrale au fioul\``,
                            fields: [{
                                name: `> Consommation : 🛢️`,
                                value: `- Par usine : \n` +
                                    codeBlock(`• Pétrole : ${parseInt(batimentObject.centrale_fioul.CONSO_CENTRALE_FIOUL_PETROLE).toLocaleString('en-US')}`) + `\u200B`,
                                inline: true
                            },
                                {
                                    name: `\u200B`,
                                    value: `- Totale : \n` +
                                        codeBlock(`• Petrole : ${conso_T_centrale_fioul_petrole.toLocaleString('en-US')}`) + `\u200B`,
                                    inline: true
                                },
                                {
                                    name: `> Production :`,
                                    value: `Flux : ⚡ Electricité\n` +
                                        codeBlock(
                                            `• Par usine : ${Math.round(batimentObject.centrale_fioul.PROD_CENTRALE_FIOUL).toLocaleString('en-US')}\n` +
                                            `• Totale : ${prod_T_centrale_fioul.toLocaleString('en-US')}`) + `\u200B`
                                },
                                {
                                    name: `> Flux :`,
                                    value: electricite + `\u200B`
                                },
                            ],
                            color: interaction.member.displayHexColor,
                            timestamp: new Date(),
                            footer: {text: `${results[0].devise}`}
                        };

                        interaction.reply({embeds: [embed]})
                        //endregion

                        //region [Usine - Eolienne]
                    } else if (interaction.values === 'eolienne') {

                        const prod_T_eolienne = Math.round(batimentObject.eolienne.PROD_EOLIENNE * results[0].eolienne);
                        const prod_T_elec = Math.round((batimentObject.centrale_fioul.PROD_CENTRALE_FIOUL * results[0].centrale_fioul + batimentObject.eolienne.PROD_EOLIENNE * results[0].eolienne));

                        conso = batimentObject.briqueterie.CONSO_BRIQUETERIE_ELECTRICITE * results[0].briqueterie + batimentObject.champ.CONSO_CHAMP_ELECTRICITE * results[0].champ + batimentObject.mine.CONSO_MINE_ELECTRICITE * results[0].mine + batimentObject.pompe_a_eau.CONSO_POMPE_A_EAU_ELECTRICITE * results[0].pompe_a_eau + batimentObject.pumpjack.CONSO_PUMPJACK_ELECTRICITE * results[0].pumpjack + batimentObject.quartier.CONSO_QUARTIER_ELECTRICITE * results[0].quartier + batimentObject.scierie.CONSO_SCIERIE_ELECTRICITE * results[0].scierie + batimentObject.usine_civile.CONSO_USINE_CIVILE_ELECTRICITE * results[0].usine_civile;
                        diff = (prod_T_elec - conso);
                        if (diff > 0) {
                            electricite = codeBlock('py', `'${conso.toLocaleString('en-US')}/${prod_T_elec.toLocaleString('en-US')} | ${(prod_T_elec - conso).toLocaleString('en-US')}'`);
                        } else if (diff === 0) {
                            electricite = codeBlock('fix', `${conso.toLocaleString('en-US')}/${prod_T_elec.toLocaleString('en-US')} | ${(prod_T_elec - conso).toLocaleString('en-US')}`);
                        } else {
                            electricite = codeBlock('diff', `- ${conso.toLocaleString('en-US')}/${prod_T_elec.toLocaleString('en-US')} | ${(prod_T_elec - conso).toLocaleString('en-US')}`);
                        }

                        const embed = {
                            author: {
                                name: `${results[0].rang} de ${results[0].nom}`,
                                icon_url: interaction.member.displayAvatarURL()
                            },
                            thumbnail: {
                                url: `${results[0].drapeau}`,
                            },
                            title: `\`Usine : Eolienne\``,
                            fields: [{
                                name: `> Production :`,
                                value: `Flux : ⚡ Electricité\n` +
                                    codeBlock(
                                        `• Par usine : ${Math.round(batimentObject.eolienne.PROD_EOLIENNE).toLocaleString('en-US')}\n` +
                                        `• Totale : ${prod_T_eolienne.toLocaleString('en-US')}`) + `\u200B`
                            },
                                {
                                    name: `> Flux :`,
                                    value: electricite + `\u200B`
                                },
                            ],
                            color: interaction.member.displayHexColor,
                            timestamp: new Date(),
                            footer: {text: `${results[0].devise}`}
                        };

                        interaction.reply({embeds: [embed]})
                        //endregion

                        //region [Usine - Mine]
                    } else if (interaction.values === 'mine') {

                        const prod_mine = Math.round(batimentObject.mine.PROD_MINE * eval(`gouvernementObject.${results[0].ideologie}.production`) * ((parseInt((eval(`regionObject.${results[0].region}.metaux`))) + 100) / 100));
                        const conso_T_mine_bois = Math.round(batimentObject.mine.CONSO_MINE_BOIS * results[0].mine * eval(`gouvernementObject.${results[0].ideologie}.consommation`));
                        const conso_T_mine_petrole = Math.round(batimentObject.mine.CONSO_MINE_PETROLE * results[0].mine * eval(`gouvernementObject.${results[0].ideologie}.consommation`));
                        const conso_T_mine_elec = batimentObject.mine.CONSO_MINE_ELECTRICITE * results[0].mine;

                        const embed = {
                            author: {
                                name: `${results[0].rang} de ${results[0].nom}`,
                                icon_url: interaction.member.displayAvatarURL()
                            },
                            thumbnail: {
                                url: `${results[0].drapeau}`,
                            },
                            title: `\`Usine : Mine\``,
                            fields: [{
                                name: `> Consommation :`,
                                value: `- Par usine : 🪵🛢️\n` +
                                    codeBlock(
                                        `• Bois : ${Math.round(batimentObject.mine.CONSO_MINE_BOIS * eval(`gouvernementObject.${results[0].ideologie}.production`)).toLocaleString('en-US')}\n` +
                                        `• Pétrole : ${Math.round(batimentObject.mine.CONSO_MINE_PETROLE * eval(`gouvernementObject.${results[0].ideologie}.consommation`)).toLocaleString('en-US')}`) +
                                    codeBlock(
                                        `• ⚡ Electricité : ${parseInt(batimentObject.mine.CONSO_MINE_ELECTRICITE).toLocaleString('en-US')}`) + `\u200B`,
                                inline: true
                            },
                                {
                                    name: `\u200B`,
                                    value: `- Totale : \n` +
                                        codeBlock(
                                            `• Bois : ${conso_T_mine_bois.toLocaleString('en-US')}\n` +
                                            `• Pétrole : ${conso_T_mine_petrole.toLocaleString('en-US')}`) +
                                        codeBlock(
                                            `• ⚡ Electricité : ${conso_T_mine_elec.toLocaleString('en-US')}`) + `\u200B`,
                                    inline: true
                                },
                                {
                                    name: `> Production :`,
                                    value: `Ressource : 🪨 Métaux\n` +
                                        codeBlock(
                                            `• Par usine : ${prod_mine.toLocaleString('en-US')}\n` +
                                            `• Totale : ${(prod_mine * results[0].mine).toLocaleString('en-US')}`) + `\u200B`
                                },
                                {
                                    name: `> En réserve :`,
                                    value: codeBlock(`• ${results[0].metaux.toLocaleString('en-US')}`) + `\u200B`
                                },
                            ],
                            color: interaction.member.displayHexColor,
                            timestamp: new Date(),
                            footer: {text: `${results[0].devise}`}
                        };

                        interaction.reply({embeds: [embed]})
                        //endregion

                        //region [Usine - Pompe à eau]
                    } else if (interaction.values === 'pompe_a_eau') {

                        const prod_pompe_a_eau = Math.round(batimentObject.pompe_a_eau.PROD_POMPE_A_EAU * eval(`gouvernementObject.${results[0].ideologie}.production`) * ((parseInt((eval(`regionObject.${results[0].region}.eau`))) + 100) / 100));
                        const conso_T_pompe_a_eau_petrole = Math.round(batimentObject.pompe_a_eau.CONSO_POMPE_A_EAU_PETROLE * results[0].pompe_a_eau * eval(`gouvernementObject.${results[0].ideologie}.consommation`));
                        const conso_T_pompe_a_eau_elec = batimentObject.pompe_a_eau.CONSO_POMPE_A_EAU_ELECTRICITE * results[0].pompe_a_eau;

                        const embed = {
                            author: {
                                name: `${results[0].rang} de ${results[0].nom}`,
                                icon_url: interaction.member.displayAvatarURL()
                            },
                            thumbnail: {
                                url: `${results[0].drapeau}`,
                            },
                            title: `\`Usine : Pompe à eau\``,
                            fields: [{
                                name: `> Consommation : 🛢️`,
                                value: `- Par usine : \n` +
                                    codeBlock(`• Pétrole : ${Math.round(batimentObject.pompe_a_eau.CONSO_POMPE_A_EAU_PETROLE * eval(`gouvernementObject.${results[0].ideologie}.consommation`)).toLocaleString('en-US')}\n`) +
                                    codeBlock(
                                        `• ⚡ Electricité : ${parseInt(batimentObject.pompe_a_eau.CONSO_POMPE_A_EAU_ELECTRICITE).toLocaleString('en-US')}`) + `\u200B`,
                                inline: true
                            },
                                {
                                    name: `\u200B`,
                                    value: `- Totale : \n` +
                                        codeBlock(`• Pétrole : ${conso_T_pompe_a_eau_petrole.toLocaleString('en-US')}`) +
                                        codeBlock(
                                            `• ⚡ Electricité : ${conso_T_pompe_a_eau_elec.toLocaleString('en-US')}`) + `\u200B`,
                                    inline: true
                                },
                                {
                                    name: `> Production :`,
                                    value: `Ressource : 💧 Eau\n` +
                                        codeBlock(
                                            `• Par usine : ${prod_pompe_a_eau.toLocaleString('en-US')}\n` +
                                            `• Totale : ${(prod_pompe_a_eau * results[0].pompe_a_eau).toLocaleString('en-US')}`) + `\u200B`
                                },
                                {
                                    name: `> En réserve :`,
                                    value: codeBlock(`• ${results[0].eau.toLocaleString('en-US')}`) + `\u200B`
                                },
                            ],
                            color: interaction.member.displayHexColor,
                            timestamp: new Date(),
                            footer: {text: `${results[0].devise}`}
                        };

                        interaction.reply({embeds: [embed]})
                        //endregion

                        //region [Usine - Pumpjack]
                    } else if (interaction.values === 'pumpjack') {

                        const prod_pumpjack = Math.round(batimentObject.pumpjack.PROD_PUMPJACK * eval(`gouvernementObject.${results[0].ideologie}.production`) * ((parseInt((eval(`regionObject.${results[0].region}.petrole`))) + 100) / 100));
                        const conso_T_pumpjack_elec = batimentObject.pumpjack.CONSO_PUMPJACK_ELECTRICITE * results[0].pumpjack;

                        const embed = {
                            author: {
                                name: `${results[0].rang} de ${results[0].nom}`,
                                icon_url: interaction.member.displayAvatarURL()
                            },
                            thumbnail: {
                                url: `${results[0].drapeau}`,
                            },
                            title: `\`Usine : Pumpjack\``,
                            fields: [{
                                name: `> Consommation :`,
                                value: `- Par usine : \n` +
                                    codeBlock(
                                        `• ⚡ Electricité : ${parseInt(batimentObject.pumpjack.CONSO_PUMPJACK_ELECTRICITE).toLocaleString('en-US')}`) + `\u200B`,
                                inline: true
                            },
                                {
                                    name: `\u200B`,
                                    value: `- Totale : \n` +
                                        codeBlock(
                                            `• ⚡ Electricité : ${conso_T_pumpjack_elec.toLocaleString('en-US')}`) + `\u200B`,
                                    inline: true
                                },
                                {
                                    name: `> Production :`,
                                    value: `Ressource : 🛢️ Pétrole\n` +
                                        codeBlock(
                                            `• Par usine : ${prod_pumpjack.toLocaleString('en-US')}\n` +
                                            `• Totale : ${(prod_pumpjack * results[0].pumpjack).toLocaleString('en-US')}`) + `\u200B`
                                },
                                {
                                    name: `> En réserve :`,
                                    value: codeBlock(`• ${results[0].petrole.toLocaleString('en-US')}`) + `\u200B`
                                },
                            ],
                            color: interaction.member.displayHexColor,
                            timestamp: new Date(),
                            footer: {text: `${results[0].devise}`}
                        };

                        interaction.reply({embeds: [embed]})
                        //endregion

                        //region [Usine - Scierie]
                    } else if (interaction.values === 'scierie') {

                        const prod_scierie = Math.round(batimentObject.scierie.PROD_SCIERIE * eval(`gouvernementObject.${results[0].ideologie}.production`) * ((parseInt((eval(`regionObject.${results[0].region}.bois`))) + 100) / 100));
                        const conso_T_scierie_petrole = Math.round(batimentObject.scierie.CONSO_SCIERIE_PETROLE * results[0].scierie * eval(`gouvernementObject.${results[0].ideologie}.consommation`));
                        const conso_T_scierie_elec = batimentObject.scierie.CONSO_SCIERIE_ELECTRICITE * results[0].scierie;

                        const embed = {
                            author: {
                                name: `${results[0].rang} de ${results[0].nom}`,
                                icon_url: interaction.member.displayAvatarURL()
                            },
                            thumbnail: {
                                url: `${results[0].drapeau}`,
                            },
                            title: `\`Usine : Scierie\``,
                            fields: [{
                                name: `> Consommation : 🛢️`,
                                value: `- Par usine : \n` +
                                    codeBlock(`• Pétrole : ${Math.round(batimentObject.scierie.CONSO_SCIERIE_PETROLE * eval(`gouvernementObject.${results[0].ideologie}.consommation`)).toLocaleString('en-US')}`) +
                                    codeBlock(
                                        `• ⚡ Electricité : ${parseInt(batimentObject.scierie.CONSO_SCIERIE_ELECTRICITE).toLocaleString('en-US')}`) + `\u200B`,
                                inline: true
                            },
                                {
                                    name: `\u200B`,
                                    value: `- Totale : \n` +
                                        codeBlock(`• Pétrole : ${conso_T_scierie_petrole.toLocaleString('en-US')}`) +
                                        codeBlock(
                                            `• ⚡ Electricité : ${conso_T_scierie_elec.toLocaleString('en-US')}`) + `\u200B`,
                                    inline: true
                                },
                                {
                                    name: `> Production :`,
                                    value: `Ressource : 🪵 Bois\n` +
                                        codeBlock(
                                            `• Par usine : ${prod_scierie.toLocaleString('en-US')}\n` +
                                            `• Totale : ${(prod_scierie * results[0].scierie).toLocaleString('en-US')}`) + `\u200B`
                                },
                                {
                                    name: `> En réserve :`,
                                    value: codeBlock(`• ${results[0].bois.toLocaleString('en-US')}`) + `\u200B`
                                },
                            ],
                            color: interaction.member.displayHexColor,
                            timestamp: new Date(),
                            footer: {text: `${results[0].devise}`}
                        };

                        interaction.reply({embeds: [embed]})
                        //endregion

                        //region [Usine - Usine civile]
                    } else if (interaction.values === 'usine_civile') {

                        const prod_T_usine_civile = Math.round(batimentObject.usine_civile.PROD_USINE_CIVILE * results[0].usine_civile * eval(`gouvernementObject.${results[0].ideologie}.production`));
                        const conso_T_usine_civile_bois = Math.round(batimentObject.usine_civile.CONSO_USINE_CIVILE_BOIS * results[0].usine_civile * eval(`gouvernementObject.${results[0].ideologie}.consommation`));
                        const conso_T_usine_civile_metaux = Math.round(batimentObject.usine_civile.CONSO_USINE_CIVILE_METAUX * results[0].usine_civile * eval(`gouvernementObject.${results[0].ideologie}.consommation`));
                        const conso_T_usine_civile_petrole = Math.round(batimentObject.usine_civile.CONSO_USINE_CIVILE_PETROLE * results[0].usine_civile * eval(`gouvernementObject.${results[0].ideologie}.consommation`));
                        const conso_T_usine_civile_elec = batimentObject.usine_civile.CONSO_USINE_CIVILE_ELECTRICITE * results[0].usine_civile;

                        const embed = {
                            author: {
                                name: `${results[0].rang} de ${results[0].nom}`,
                                icon_url: interaction.member.displayAvatarURL()
                            },
                            thumbnail: {
                                url: `${results[0].drapeau}`,
                            },
                            title: `\`Usine : Usine civile\``,
                            fields: [{
                                name: `> Consommation : 🪵🪨🛢️`,
                                value: `- Par usine : \n` +
                                    codeBlock(
                                        `• Bois : ${Math.round(batimentObject.usine_civile.CONSO_USINE_CIVILE_BOIS * eval(`gouvernementObject.${results[0].ideologie}.consommation`)).toLocaleString('en-US')}\n` +
                                        `• Métaux : ${Math.round(batimentObject.usine_civile.CONSO_USINE_CIVILE_METAUX * eval(`gouvernementObject.${results[0].ideologie}.consommation`)).toLocaleString('en-US')}\n` +
                                        `• Pétrole : ${Math.round(batimentObject.usine_civile.CONSO_USINE_CIVILE_PETROLE * eval(`gouvernementObject.${results[0].ideologie}.consommation`)).toLocaleString('en-US')}\n`) +
                                    codeBlock(
                                        `• ⚡ Electricité : ${parseInt(batimentObject.usine_civile.CONSO_USINE_CIVILE_ELECTRICITE).toLocaleString('en-US')}`) + `\u200B`,
                                inline: true
                            },
                                {
                                    name: `\u200B`,
                                    value: `- Totale :\n` +
                                        codeBlock(
                                            `• Bois : ${conso_T_usine_civile_bois.toLocaleString('en-US')}\n` +
                                            `• Métaux : ${conso_T_usine_civile_metaux.toLocaleString('en-US')}\n` +
                                            `• Pétrole : ${conso_T_usine_civile_petrole.toLocaleString('en-US')}`) +
                                        codeBlock(
                                            `• ⚡ Electricité : ${conso_T_usine_civile_elec.toLocaleString('en-US')}`) + `\u200B`,
                                    inline: true
                                },
                                {
                                    name: `> Production :`,
                                    value: `Ressource : 💻 Biens de consommation\n` +
                                        codeBlock(
                                            `• Par usine : ${Math.round(batimentObject.usine_civile.PROD_USINE_CIVILE * eval(`gouvernementObject.${results[0].ideologie}.production`)).toLocaleString('en-US')}\n` +
                                            `• Totale : ${prod_T_usine_civile.toLocaleString('en-US')}`) + `\u200B`
                                },
                                {
                                    name: `> En réserve :`,
                                    value: codeBlock(`• ${results[0].bc.toLocaleString('en-US')}`) + `\u200B`
                                },
                            ],
                            color: interaction.member.displayHexColor,
                            timestamp: new Date(),
                            footer: {text: `${results[0].devise}`}
                        };

                        interaction.reply({embeds: [embed]})
                        //endregion
                    }
                });
            } else if (interaction.customId === 'roles') {

                //region [Roles]
                if (interaction.values.indexOf('annonce') !== '-1') {
                    let role = interaction.guild.roles.cache.find(r => r.name === "📢 » Annonce");
                    interaction.member.roles.add(role)
                } else {
                    let role = interaction.guild.roles.cache.find(r => r.name === "📢 » Annonce");
                    interaction.member.roles.remove(role)
                }

                if (interaction.values.indexOf('concours') !== '-1') {
                    let role = interaction.guild.roles.cache.find(r => r.name === "🏆 » Compétition");
                    interaction.member.roles.add(role)
                } else {
                    let role = interaction.guild.roles.cache.find(r => r.name === "🏆 » Compétition");
                    interaction.member.roles.remove(role)
                }

                if (interaction.values.indexOf('giveaway') !== '-1') {
                    let role = interaction.guild.roles.cache.find(r => r.name === "🎁 » Giveaway");
                    interaction.member.roles.add(role)
                } else {
                    let role = interaction.guild.roles.cache.find(r => r.name === "🎁 » Giveaway");
                    interaction.member.roles.remove(role)
                }

                if (interaction.values.indexOf('animation') !== '-1') {
                    let role = interaction.guild.roles.cache.find(r => r.name === "🧩 » Animation");
                    interaction.member.roles.add(role)
                } else {
                    let role = interaction.guild.roles.cache.find(r => r.name === "🧩 » Animation");
                    interaction.member.roles.remove(role)
                }

                if (interaction.values.indexOf('mise_a_jour') !== '-1') {
                    let role = interaction.guild.roles.cache.find(r => r.name === "🎮 » Mise à jour");
                    interaction.member.roles.add(role)
                } else {
                    let role = interaction.guild.roles.cache.find(r => r.name === "🎮 » Mise à jour");
                    interaction.member.roles.remove(role)
                }

                interaction.reply('👍');
                wait(15000)
                interaction.deleteReply();
                //endregion
            } else if (interaction.customId === 'ideologie') {
                //#region [Menu - Ideologie]
                console.log(interaction.values)
                //endregion
            }
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
            salon_logs.send({ embeds: [log] });

            //#region [Modals - Start]
            if (interaction.customId.includes('start') === true) {
                const cite = interaction.fields.getTextInputValue('nom_cite');

                sql = `SELECT * FROM pays WHERE nom="${cite}"`;
                connection.query(sql, async(err, results) => {if (err) {throw err;}
                    if (!results[0]) {
                        function success (salon) {
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
                            salon.send({ content: `<@${interaction.member.id}>`, embeds: [nouveau_salon] })

                            const T_total = chance.integer({min: 14000, max: 14999});
                            const T_occ = 15 + 1 * batimentObject.champ.SURFACE_CHAMP + 1 * batimentObject.mine.SURFACE_MINE + 1 * batimentObject.pompe_a_eau.SURFACE_POMPE_A_EAU + 1 * batimentObject.pumpjack.SURFACE_PUMPJACK + 1 * batimentObject.scierie.SURFACE_SCIERIE + 2 * batimentObject.eolienne.SURFACE_EOLIENNE;
                            const T_libre = T_total - T_occ;
                            const cash = chance.integer({min: 975000, max: 1025000});
                            const jeune = chance.integer({min: 29000, max: 31000});

                            const sql = `INSERT INTO pays SET id_joueur="${interaction.user.id}", nom="${cite}", id_salon="${salon.id.toString()}", cash='${cash}', jeune='${jeune}', T_total='${T_total}', T_occ='${T_occ}', T_libre='${T_libre}', pweeter="@${interaction.user.username}", avatarURL="${interaction.user.displayAvatarURL()}"`;
                            connection.query(sql, async(err) => {if (err) {throw err;}});

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
                            salon_carte.send({ embeds: [annonce] });
                            interaction.user.send({ embeds: [ville] });
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
                        const reponse = codeBlock('diff', `- Cette cité est déjà prise. Pour voir la liste des cités déjà controlées, cliquez sur le bouton ci-dessous`);
                        const row = new MessageActionRow()
                            .addComponents(
                                new MessageButton()
                                    .setLabel(`Liste des cités`)
                                    .setEmoji(`🌇`)
                                    .setURL('https://discord.com/channels/826427184305537054/983316109367345152/987038188801503332')
                                    .setStyle('LINK'),
                            );
                        await interaction.user.send({ content: reponse, components: [row] });
                    }
                })
                interaction.deferUpdate()
                //endregion
            } else if (interaction.customId.includes('ideologie') === true) {
                //#region [Modals - Idéologie]

                // var sql = ` SELECT * FROM pays WHERE id_joueur="${interaction.member.id}";`;
                // connection.query(sql, async(err, results) => {if (err) {throw err;}

                //     const annonce = {
                //         author: {
                //             name: `${results[0].rang} de ${results[0].nom}`,
                //             icon_url: interaction.member.displayAvatarURL()
                //         },
                //         thumbnail: {
                //             url: `${results[0].drapeau}`,
                //         },
                //         title: `Une nouvelle idéologie a été mis en place :`,
                //         description: discours,
                //         fields: [{
                //             name: `> Nouvelle idéologie`,
                //             value: `*${results[0].ideologie}*`
                //         }],
                //         color: interaction.member.displayHexColor
                //     };

                //     const salon_annonce = interaction.client.channels.cache.get(process.env.SALON_ANNONCE);
                //     salon_annonce.send({ embeds: [annonce] });
                //     var reponse = `__**Votre annonce a été publié dans ${salon_annonce}**__`;
                //     await interaction.reply({ content: reponse });
                //     await ideologieCommandCooldown.addUser(interaction.member.id);
                // });
            }
        }
    }
};