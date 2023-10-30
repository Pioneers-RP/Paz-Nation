const { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, EmbedBuilder, Events, ModalBuilder, AttachmentBuilder, PermissionFlagsBits, TextInputBuilder, TextInputStyle, StringSelectMenuBuilder, ThreadAutoArchiveDuration, codeBlock} = require('discord.js');
const { connection, client } = require('../index');
const { menuArmee, menuConsommation, menuEconomie, menuDiplomatie, menuGouvernement, menuIndustrie, menuPopulation, menuTerritoire,
    calculerEmploi,
} = require("../fonctions/functions");

const { readFileSync } = require('fs');
const Chance = require('chance');
const chance = new Chance();
const wait = require('node:timers/promises').setTimeout;
const isImageURL = require('image-url-validator').default;
const fs = require('fs')
const { createCanvas, loadImage } = require('canvas')

const { CommandCooldown, msToMinutes } = require('discord-command-cooldown');
const ms = require('ms');
const deviseCommandCooldown = new CommandCooldown('devise', ms('7d'));
const drapeauCommandCooldown = new CommandCooldown('drapeau', ms('7d'));
const pweeterCommandCooldown = new CommandCooldown('pweeter', ms('7d'));
const organisationCommandCooldown = new CommandCooldown('organisation', ms('7d'));
const strategieCommandCooldown = new CommandCooldown('strategie', ms('7d'));
const vacancesCommandCooldown = new CommandCooldown('vacances', ms('7d'));

const armeeObject = JSON.parse(readFileSync('src/OLD/data/armee.json', 'utf-8'));
const assemblageObject = JSON.parse(readFileSync('src/OLD/data/assemblage.json', 'utf-8'));
const batimentObject = JSON.parse(readFileSync('src/OLD/data/batiment.json', 'utf-8'));
const biomeObject = JSON.parse(readFileSync('src/OLD/data/biome.json', 'utf-8'));
const gouvernementObject = JSON.parse(readFileSync('src/OLD/data/gouvernement.json', 'utf-8'));
const populationObject = JSON.parse(readFileSync('src/OLD/data/population.json', 'utf-8'));
const regionObject = JSON.parse(readFileSync('src/OLD/data/region.json', 'utf-8'));
const strategieObject = JSON.parse(readFileSync('src/OLD/data/strategie.json', 'utf-8'));

module.exports = {
    name: Events.InteractionCreate,
    execute: async function (interaction) {
        let res;
        let quantite;
        let ressource;
        let espace;
        let fields;
        let reponse;
        let id_joueur;
        let sql;
        let log;
        //region Commande
        if (interaction.isChatInputCommand()) {
            sql = `SELECT * FROM pays WHERE id_joueur='${interaction.member.id}'`;
            connection.query(sql, async (err, results) => {if (err) {throw err;}
                const Pays = results[0];

                if (Pays.vacances === 0) {
                    sql = `SELECT * FROM pays WHERE id_joueur='${interaction.member.id}'`;
                    connection.query(sql, async (err, results) => {if (err) {throw err;}
                        const Pays = results[0];

                        if (Pays.daily === 0) {
                            let salon;
                            let sql = `UPDATE pays SET daily=1, jour=jour+1 WHERE id_joueur="${interaction.member.id}"`;
                            connection.query(sql, async (err) => {if (err) {throw err;}})

                            switch (Pays.jour) {
                                case 1:
                                    sql = `UPDATE pays SET rang='Cité-Etat' WHERE id_joueur="${interaction.member.id}"`;
                                    connection.query(sql, async (err) => {if (err) {throw err;}})

                                    if (interaction.member.roles.cache.some(role => role.name === '🕊️ » Administrateur')) {
                                    } else {
                                        let roleMaire = interaction.guild.roles.cache.find(r => r.name === "👤 » Maire");
                                        interaction.member.roles.add(roleMaire);
                                        let roleBourgmestre = interaction.guild.roles.cache.find(r => r.name === "👤 » Bourgmestre");
                                        interaction.member.roles.remove(roleBourgmestre);
                                    }

                                    embed = {
                                        author: {
                                            name: `Cité-Etat de ${Pays.nom}`,
                                            icon_url: interaction.member.displayAvatarURL()
                                        },
                                        thumbnail: {
                                            url: Pays.drapeau
                                        },
                                        title: `\`Devenir une Cité-Etat :\``,
                                        description: `
                                    Vous êtes devenus une Cité-Etat grâce à votre activité de jeu. Vous êtes sur la voie de devenir une puissance internationale mais il reste du chemin à faire.
                                    Ce passage au Rang de Cité-Etat débloque de nouveaux éléments de jeu tels que l'armée et les raids, ainsi que les ambassades et la création d\'organisations.\n
                                `,
                                        fields: [
                                            {
                                                name: `> 🆕 Débloque :`,
                                                value: codeBlock(
                                                    `• /armee\n` +
                                                    `• /assembler\n` +
                                                    `• /former\n` +
                                                    `• /ideologie\n` +
                                                    `• /raid\n` +
                                                    `• Création d'organisation`) + `\u200B`
                                            },
                                        ],
                                        color: interaction.member.displayColor,
                                        timestamp: new Date(),
                                        footer: {
                                            text: `${Pays.devise}`
                                        },
                                    };
                                    salon = interaction.client.channels.cache.get(Pays.id_salon);
                                    salon.send({ embeds: [embed] });

                                    embed = {
                                        author: {
                                            name: `${Pays.rang} de ${Pays.nom}`,
                                            icon_url: interaction.member.displayAvatarURL()
                                        },
                                        thumbnail: {
                                            url: `${Pays.drapeau}`,
                                        },
                                        title: `\`Breaking news :\``,
                                        fields: [{
                                            name: `> :white_square_button: Nouveau rang :`,
                                            value: `*Cité-Etat*` + `\u200B`
                                        }],
                                        color: 0x42E2B8,
                                        timestamp: new Date(),
                                        footer: {text: `${Pays.devise}`},
                                    };

                                    salon = interaction.client.channels.cache.get(process.env.SALON_ANNONCE);
                                    salon.send({ embeds: [embed] });
                                    break;
                                case 32:
                                    sql = `UPDATE pays SET rang='Etat' WHERE id_joueur="${interaction.member.id}"`;
                                    connection.query(sql, async (err) => {if (err) {throw err;}})

                                    if (interaction.member.roles.cache.some(role => role.name === '🕊️ » Administrateur')) {
                                    } else {
                                        let roleDirigent = interaction.guild.roles.cache.find(r => r.name === "👤 » Dirigent");
                                        interaction.member.roles.add(roleDirigent);
                                        let roleMaire = interaction.guild.roles.cache.find(r => r.name === "👤 » Maire");
                                        interaction.member.roles.remove(roleMaire);
                                    }

                                    embed = {
                                        author: {
                                            name: `Etat de ${Pays.nom}`,
                                            icon_url: interaction.member.displayAvatarURL()
                                        },
                                        thumbnail: {
                                            url: Pays.drapeau
                                        },
                                        title: `\`Devenir un Etat :\``,
                                        description: `
                                            Vous êtes devenus un Etat grâce à votre activité de jeu. Merci beaucoup pour votre implication dans Paz Nation.
                                            Ce passage au Rang d'Etat débloque de nouveaux éléments de jeu et donne la possibilité de changer de nom par rapport au territoire sur lequel vous vous êtes étendus.
                                            Choisissez un nom de région comme \`\`\`Alsace\`\`\` ou \`\`\`Prusse\`\`\`\n
                                        `,
                                        fields: [
                                            {
                                                name: `> 🆕 Débloque :`,
                                                value: codeBlock(
                                                    `• Changement de forme de gouvernement`) + `\u200B`
                                            },
                                        ],
                                        color: interaction.member.displayColor,
                                        timestamp: new Date(),
                                        footer: {
                                            text: `${Pays.devise}`
                                        },
                                    };
                                    salon = interaction.client.channels.cache.get(Pays.id_salon);
                                    salon.send({ embeds: [embed] });

                                    embed = {
                                        author: {
                                            name: `${Pays.rang} de ${Pays.nom}`,
                                            icon_url: interaction.member.displayAvatarURL()
                                        },
                                        thumbnail: {
                                            url: `${Pays.drapeau}`,
                                        },
                                        title: `\`Breaking news :\``,
                                        fields: [{
                                            name: `> :white_square_button: Nouveau rang :`,
                                            value: `*Etat*` + `\u200B`
                                        }],
                                        color: 0x42E2B8,
                                        timestamp: new Date(),
                                        footer: {text: `${Pays.devise}`},
                                    };

                                    salon = interaction.client.channels.cache.get(process.env.SALON_ANNONCE);
                                    salon.send({ embeds: [embed] });
                                    break;
                                case 122:
                                    sql = `UPDATE pays SET rang='Pays' WHERE id_joueur="${interaction.member.id}"`;
                                    connection.query(sql, async (err) => {if (err) {throw err;}})

                                    if (interaction.member.roles.cache.some(role => role.name === '🕊️ » Administrateur')) {
                                    } else {
                                        let roleChef = interaction.guild.roles.cache.find(r => r.name === "👤 » Chef d'état");
                                        interaction.member.roles.add(roleChef);
                                        let roleDirigent = interaction.guild.roles.cache.find(r => r.name === "👤 » Dirigent");
                                        interaction.member.roles.remove(roleDirigent);
                                    }

                                    embed = {
                                        author: {
                                            name: `Pays de ${Pays.nom}`,
                                            icon_url: interaction.member.displayAvatarURL()
                                        },
                                        thumbnail: {
                                            url: Pays.drapeau
                                        },
                                        title: `\`Devenir une Päys :\``,
                                        description: `
                                    Vous êtes devenus une Pays grâce à votre activité de jeu. Vous êtes devenus une puissance internationale !
                                    Ce passage au Rang de Pays débloque de nouveaux éléments de jeuet donne la possibilité de changer de nom par rapport au territoire sur lequel vous vous êtes étendus.
                                    Choisissez un nom de pays comme \`\`\`France\`\`\` ou \`\`\`Allemagne\`\`\`\n
                                `,
                                        fields: [
                                            {
                                                name: `> 🆕 Débloque :`,
                                                value: codeBlock(
                                                    `• `) + `\u200B`
                                            },
                                        ],
                                        color: interaction.member.displayColor,
                                        timestamp: new Date(),
                                        footer: {
                                            text: `${Pays.devise}`
                                        },
                                    };
                                    salon = interaction.client.channels.cache.get(Pays.id_salon);
                                    salon.send({ embeds: [embed] });
                                    break;
                            }
                        }
                    });
                    const command = interaction.client.commands.get(interaction.commandName);

                    if (!command) {
                        console.error(`No command matching ${interaction.commandName} was found.`);
                        return;
                    }

                    try {
                        await command.execute(interaction);
                    } catch (error) {
                        console.error(error);
                        if (interaction.replied || interaction.deferred) {
                            await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
                        } else {
                            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
                        }
                    }
                } else {
                    const reponse = codeBlock('ansi', `\u001b[0;0m\u001b[1;31mVous êtes en vacances, vous ne pouvez pas utiliser de commandes.`);
                    const bouton = new ButtonBuilder()
                        .setLabel(`Sortir du mode Vacances`)
                        .setEmoji(`🚪`)
                        .setCustomId(`sortirvacances`)
                        .setStyle(ButtonStyle.Success)

                    const row = new ActionRowBuilder()
                        .addComponents(bouton)
                    interaction.reply({ content: reponse, components: [row] });
                }
            });
            //endregion
        } else if (interaction.isButton()) {
            //region Bouton

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

            if (interaction.customId.includes('construction') === true) {
                //region Construction
                id_joueur = interaction.customId.slice(13);
                if (id_joueur === interaction.member.id) {

                    sql = `
                        SELECT * FROM batiments WHERE id_joueur=${interaction.member.id};
                        SELECT * FROM pays WHERE id_joueur=${interaction.member.id};
                        SELECT * FROM ressources WHERE id_joueur=${interaction.member.id};
                        SELECT * FROM territoire WHERE id_joueur=${interaction.member.id}
                    `;
                    connection.query(sql, async (err, results) => {if (err) {throw err;}
                        const Batiment = results[0][0];
                        const Pays = results[1][0];
                        const Ressources = results[2][0];
                        const Territoire = results[3][0];

                        let manque_acier;
                        let const_acier;
                        let manque_beton;
                        let const_beton;
                        let manque_bois;
                        let const_bois;
                        let manque_eolienne;
                        let const_eolienne;
                        let manque_verre;
                        let const_verre;
                        let manque_T_libre;
                        let const_T_libre;

                        let nom;
                        let const_batiment = true;
                        let need_acier = false;
                        let need_beton = false;
                        let need_bois = false;
                        let need_eolienne = false;
                        let need_verre = false;

                        let title = interaction.message.embeds[0].title;
                        title = title.substring(16, title.length - 1);
                        const espace = title.indexOf(" ");
                        let nombre = title.slice(0, espace);
                        nombre = nombre.replace(/,/g, "");
                        const batiment = title.slice(espace + 1);

                        switch (batiment) {
                            case 'Acierie':
                                //region Acierie
                                nom = 'acierie';
                                need_acier = true;
                                need_beton = true;

                                const_T_libre = batimentObject.acierie.SURFACE_ACIERIE * nombre;
                                if (const_T_libre > Territoire.T_libre) {
                                    const_batiment = false;
                                    manque_T_libre = true;
                                }

                                const_acier = Math.round(batimentObject.acierie.CONST_ACIERIE_ACIER * nombre * eval(`gouvernementObject.${Pays.ideologie}.construction`));
                                if (const_acier > Ressources.acier) {
                                    const_batiment = false;
                                    manque_acier = true;
                                }

                                const_beton = Math.round(batimentObject.acierie.CONST_ACIERIE_BETON * nombre * eval(`gouvernementObject.${Pays.ideologie}.construction`));
                                if (const_beton > Ressources.beton) {
                                    const_batiment = false;
                                    manque_beton = true;
                                }
                                //endregion
                                break;

                            case 'Atelier de verre':
                                //region Atelier de verre
                                nom = 'atelier_verre';
                                need_acier = true;
                                need_beton = true;
                                need_bois = true;

                                const_T_libre = batimentObject.atelier_verre.SURFACE_ATELIER_VERRE * nombre;
                                if (const_T_libre > Territoire.T_libre) {
                                    const_batiment = false;
                                    manque_T_libre = true;
                                }

                                const_acier = Math.round(batimentObject.atelier_verre.CONST_ATELIER_VERRE_ACIER * nombre * eval(`gouvernementObject.${Pays.ideologie}.construction`));
                                if (const_acier > Ressources.acier) {
                                    const_batiment = false;
                                    manque_acier = true;
                                }

                                const_beton = Math.round(batimentObject.atelier_verre.CONST_ATELIER_VERRE_BETON * nombre * eval(`gouvernementObject.${Pays.ideologie}.construction`));
                                if (const_beton > Ressources.beton) {
                                    const_batiment = false;
                                    manque_beton = true;
                                }

                                const_bois = Math.round(batimentObject.atelier_verre.CONST_ATELIER_VERRE_BOIS * nombre * eval(`gouvernementObject.${Pays.ideologie}.construction`));
                                if (const_bois > Ressources.bois) {
                                    const_batiment = false;
                                    manque_bois = true;
                                }
                                //endregion
                                break;

                            case 'Carriere de sable':
                                //region Carriere de sable
                                nom = 'carriere_sable';
                                need_acier = true;

                                const_T_libre = batimentObject.carriere_sable.SURFACE_CARRIERE_SABLE * nombre;
                                if (const_T_libre > Territoire.T_libre) {
                                    const_batiment = false;
                                    manque_T_libre = true;
                                }

                                const_acier = Math.round(batimentObject.carriere_sable.CONST_CARRIERE_SABLE_ACIER * nombre * eval(`gouvernementObject.${Pays.ideologie}.construction`));
                                if (const_acier > Ressources.acier) {
                                    const_batiment = false;
                                    manque_acier = true;
                                }
                                //endregion
                                break;

                            case 'Centrale biomasse':
                                //region Centrale biomasse
                                nom = 'centrale_biomasse';
                                need_acier = true;
                                need_beton = true;

                                const_T_libre = batimentObject.centrale_biomasse.SURFACE_CENTRALE_BIOMASSE * nombre;
                                if (const_T_libre > Territoire.T_libre) {
                                    const_batiment = false;
                                    manque_T_libre = true;
                                }

                                const_acier = Math.round(batimentObject.centrale_biomasse.CONST_CENTRALE_BIOMASSE_ACIER * nombre * eval(`gouvernementObject.${Pays.ideologie}.construction`));
                                if (const_acier > Ressources.acier) {
                                    const_batiment = false;
                                    manque_acier = true;
                                }

                                const_beton = Math.round(batimentObject.centrale_biomasse.CONST_CENTRALE_BIOMASSE_BETON * nombre * eval(`gouvernementObject.${Pays.ideologie}.construction`));
                                if (const_beton > Ressources.beton) {
                                    const_batiment = false;
                                    manque_beton = true;
                                }
                                //endregion
                                break;

                            case 'Centrale au charbon':
                                //region Centrale au charbon
                                nom = 'centrale_charbon';
                                need_acier = true;
                                need_beton = true;

                                const_T_libre = batimentObject.centrale_charbon.SURFACE_CENTRALE_CHARBON * nombre;
                                if (const_T_libre > Territoire.T_libre) {
                                    const_batiment = false;
                                    manque_T_libre = true;
                                }

                                const_acier = Math.round(batimentObject.centrale_charbon.CONST_CENTRALE_CHARBON_ACIER * nombre * eval(`gouvernementObject.${Pays.ideologie}.construction`));
                                if (const_acier > Ressources.acier) {
                                    const_batiment = false;
                                    manque_acier = true;
                                }

                                const_beton = Math.round(batimentObject.centrale_charbon.CONST_CENTRALE_CHARBON_BETON * nombre * eval(`gouvernementObject.${Pays.ideologie}.construction`));
                                if (const_beton > Ressources.beton) {
                                    const_batiment = false;
                                    manque_beton = true;
                                }
                                //endregion
                                break;

                            case 'Centrale au fioul':
                                //region Centrale au fioul
                                nom = 'centrale_fioul';
                                need_acier = true;
                                need_beton = true;

                                const_T_libre = batimentObject.centrale_fioul.SURFACE_CENTRALE_FIOUL * nombre;
                                if (const_T_libre > Territoire.T_libre) {
                                    const_batiment = false;
                                    manque_T_libre = true;
                                }

                                const_acier = Math.round(batimentObject.centrale_fioul.CONST_CENTRALE_FIOUL_ACIER * nombre * eval(`gouvernementObject.${Pays.ideologie}.construction`));
                                if (const_acier > Ressources.acier) {
                                    const_batiment = false;
                                    manque_acier = true;
                                }

                                const_beton = Math.round(batimentObject.centrale_fioul.CONST_CENTRALE_FIOUL_BETON * nombre * eval(`gouvernementObject.${Pays.ideologie}.construction`));
                                if (const_beton > Ressources.beton) {
                                    const_batiment = false;
                                    manque_beton = true;
                                }
                                //endregion
                                break;

                            case 'Champ':
                                //region Champ
                                nom = 'champ';
                                need_acier = true;
                                need_beton = true;
                                need_bois = true;

                                const_T_libre = batimentObject.champ.SURFACE_CHAMP * nombre;
                                if (const_T_libre > Territoire.T_libre) {
                                    const_batiment = false;
                                    manque_T_libre = true;
                                }

                                const_acier = Math.round(batimentObject.champ.CONST_CHAMP_ACIER * nombre * eval(`gouvernementObject.${Pays.ideologie}.construction`));
                                if (const_acier > Ressources.acier) {
                                    const_batiment = false;
                                    manque_acier = true;
                                }

                                const_beton = Math.round(batimentObject.champ.CONST_CHAMP_BETON * nombre * eval(`gouvernementObject.${Pays.ideologie}.construction`));
                                if (const_beton > Ressources.beton) {
                                    const_batiment = false;
                                    manque_beton = true;
                                }

                                const_bois = Math.round(batimentObject.champ.CONST_CHAMP_BOIS * nombre * eval(`gouvernementObject.${Pays.ideologie}.construction`));
                                if (const_bois > Ressources.bois) {
                                    const_batiment = false;
                                    manque_bois = true;
                                }
                                //endregion
                                break;

                            case 'Champ d\'eoliennes':
                                //region Champ d'eoliennes
                                nom = 'eolienne';
                                need_beton = true;
                                need_eolienne = true;

                                const_T_libre = batimentObject.eolienne.SURFACE_EOLIENNE * nombre;
                                if (const_T_libre > Territoire.T_libre) {
                                    const_batiment = false;
                                    manque_T_libre = true;
                                }

                                const_beton = Math.round(batimentObject.eolienne.CONST_EOLIENNE_BETON * nombre * eval(`gouvernementObject.${Pays.ideologie}.construction`));
                                if (const_beton > Ressources.beton) {
                                    const_batiment = false;
                                    manque_beton = true;
                                }

                                const_eolienne = Math.round(batimentObject.eolienne.CONST_EOLIENNE_EOLIENNE * nombre);
                                if (const_eolienne > Ressources.eolienne) {
                                    const_batiment = false;
                                    manque_eolienne = true;
                                }
                                //endregion
                                break;

                            case 'Cimenterie':
                                //region Cimenterie
                                nom = 'cimenterie';
                                need_acier = true;
                                need_beton = true;

                                const_T_libre = batimentObject.cimenterie.SURFACE_CIMENTERIE * nombre;
                                if (const_T_libre > Territoire.T_libre) {
                                    const_batiment = false;
                                    manque_T_libre = true;
                                }

                                const_acier = Math.round(batimentObject.cimenterie.CONST_CIMENTERIE_ACIER * nombre * eval(`gouvernementObject.${Pays.ideologie}.construction`));
                                if (const_acier > Ressources.acier) {
                                    const_batiment = false;
                                    manque_acier = true;
                                }

                                const_beton = Math.round(batimentObject.cimenterie.CONST_CIMENTERIE_BETON * nombre * eval(`gouvernementObject.${Pays.ideologie}.construction`));
                                if (const_beton > Ressources.beton) {
                                    const_batiment = false;
                                    manque_beton = true;
                                }
                                //endregion
                                break;

                            case 'Derrick':
                                //region Derrick
                                nom = 'derrick';
                                need_acier = true;
                                need_beton = true;

                                const_T_libre = batimentObject.derrick.SURFACE_DERRICK * nombre;
                                if (const_T_libre > Territoire.T_libre) {
                                    const_batiment = false;
                                    manque_T_libre = true;
                                }

                                const_acier = Math.round(batimentObject.derrick.CONST_DERRICK_ACIER * nombre * eval(`gouvernementObject.${Pays.ideologie}.construction`));
                                if (const_acier > Ressources.acier) {
                                    const_batiment = false;
                                    manque_acier = true;
                                }

                                const_beton = Math.round(batimentObject.derrick.CONST_DERRICK_BETON * nombre * eval(`gouvernementObject.${Pays.ideologie}.construction`));
                                if (const_beton > Ressources.beton) {
                                    const_batiment = false;
                                    manque_beton = true;
                                }
                                //endregion
                                break;

                            case 'Mine de charbon':
                                //region Mine de charbon
                                nom = 'mine_charbon';
                                need_acier = true;
                                need_beton = true;

                                const_T_libre = batimentObject.mine_charbon.SURFACE_MINE_CHARBON * nombre;
                                if (const_T_libre > Territoire.T_libre) {
                                    const_batiment = false;
                                    manque_T_libre = true;
                                }

                                const_acier = Math.round(batimentObject.mine_charbon.CONST_MINE_CHARBON_ACIER * nombre * eval(`gouvernementObject.${Pays.ideologie}.construction`));
                                if (const_acier > Ressources.acier) {
                                    const_batiment = false;
                                    manque_acier = true;
                                }

                                const_beton = Math.round(batimentObject.mine_charbon.CONST_MINE_CHARBON_BETON * nombre * eval(`gouvernementObject.${Pays.ideologie}.construction`));
                                if (const_beton > Ressources.beton) {
                                    const_batiment = false;
                                    manque_beton = true;
                                }
                                //endregion
                                break;

                            case 'Mine de metaux':
                                //region Mine de metaux
                                nom = 'mine_metaux';
                                need_acier = true;

                                const_T_libre = batimentObject.mine_metaux.SURFACE_MINE_METAUX * nombre;
                                if (const_T_libre > Territoire.T_libre) {
                                    const_batiment = false;
                                    manque_T_libre = true;
                                }

                                const_acier = Math.round(batimentObject.mine_metaux.CONST_MINE_METAUX_ACIER * nombre * eval(`gouvernementObject.${Pays.ideologie}.construction`));
                                if (const_acier > Ressources.acier) {
                                    const_batiment = false;
                                    manque_acier = true;
                                }
                                //endregion
                                break;

                            case 'Station de pompage':
                                //region Station de pompage
                                nom = 'station_pompage';
                                need_acier = true;
                                need_beton = true;

                                const_T_libre = batimentObject.station_pompage.SURFACE_STATION_POMPAGE * nombre;
                                if (const_T_libre > Territoire.T_libre) {
                                    const_batiment = false;
                                    manque_T_libre = true;
                                }

                                const_acier = Math.round(batimentObject.station_pompage.CONST_STATION_POMPAGE_ACIER * nombre * eval(`gouvernementObject.${Pays.ideologie}.construction`));
                                if (const_acier > Ressources.acier) {
                                    const_batiment = false;
                                    manque_acier = true;
                                }

                                const_beton = Math.round(batimentObject.station_pompage.CONST_STATION_POMPAGE_BETON * nombre * eval(`gouvernementObject.${Pays.ideologie}.construction`));
                                if (const_beton > Ressources.beton) {
                                    const_batiment = false;
                                    manque_beton = true;
                                }
                                //endregion
                                break;

                            case 'Quartier':
                                //region Quartier
                                nom = 'quartier';
                                need_acier = true;
                                need_beton = true;
                                need_bois = true;
                                need_verre = true;

                                const_T_libre = batimentObject.quartier.SURFACE_QUARTIER * nombre;
                                if (const_T_libre > Territoire.T_libre) {
                                    const_batiment = false;
                                    manque_T_libre = true;
                                }

                                const_acier = Math.round(batimentObject.quartier.CONST_QUARTIER_ACIER * nombre * eval(`gouvernementObject.${Pays.ideologie}.construction`));
                                if (const_acier > Ressources.acier) {
                                    const_batiment = false;
                                    manque_acier = true;
                                }

                                const_beton = Math.round(batimentObject.quartier.CONST_QUARTIER_BETON * nombre * eval(`gouvernementObject.${Pays.ideologie}.construction`));
                                if (const_beton > Ressources.beton) {
                                    const_batiment = false;
                                    manque_beton = true;
                                }

                                const_bois = Math.round(batimentObject.quartier.CONST_QUARTIER_BOIS * nombre * eval(`gouvernementObject.${Pays.ideologie}.construction`));
                                if (const_bois > Ressources.bois) {
                                    const_batiment = false;
                                    manque_bois = true;
                                }

                                const_verre = Math.round(batimentObject.quartier.CONST_QUARTIER_VERRE * nombre * eval(`gouvernementObject.${Pays.ideologie}.construction`));
                                if (const_verre > Ressources.verre) {
                                    const_batiment = false;
                                    manque_verre = true;
                                }
                                //endregion
                                break;

                            case 'Raffinerie':
                                //region Raffinerie
                                nom = 'raffinerie';
                                need_acier = true;
                                need_beton = true;

                                const_T_libre = batimentObject.raffinerie.SURFACE_RAFFINERIE * nombre;
                                if (const_T_libre > Territoire.T_libre) {
                                    const_batiment = false;
                                    manque_T_libre = true;
                                }

                                const_acier = Math.round(batimentObject.raffinerie.CONST_RAFFINERIE_ACIER * nombre * eval(`gouvernementObject.${Pays.ideologie}.construction`));
                                if (const_acier > Ressources.acier) {
                                    const_batiment = false;
                                    manque_acier = true;
                                }

                                const_beton = Math.round(batimentObject.raffinerie.CONST_RAFFINERIE_BETON * nombre * eval(`gouvernementObject.${Pays.ideologie}.construction`));
                                if (const_beton > Ressources.beton) {
                                    const_batiment = false;
                                    manque_beton = true;
                                }
                                //endregion
                                break;

                            case 'Scierie':
                                //region Scierie
                                nom = 'scierie';
                                need_acier = true;
                                need_beton = true;
                                need_bois = true;

                                const_T_libre = batimentObject.scierie.SURFACE_SCIERIE * nombre;
                                if (const_T_libre > Territoire.T_libre) {
                                    const_batiment = false;
                                    manque_T_libre = true;
                                }

                                const_acier = Math.round(batimentObject.scierie.CONST_SCIERIE_ACIER * nombre * eval(`gouvernementObject.${Pays.ideologie}.construction`));
                                if (const_acier > Ressources.acier) {
                                    const_batiment = false;
                                    manque_acier = true;
                                }

                                const_beton = Math.round(batimentObject.scierie.CONST_SCIERIE_BETON * nombre * eval(`gouvernementObject.${Pays.ideologie}.construction`));
                                if (const_beton > Ressources.beton) {
                                    const_batiment = false;
                                    manque_beton = true;
                                }

                                const_bois = Math.round(batimentObject.scierie.CONST_SCIERIE_BOIS * nombre * eval(`gouvernementObject.${Pays.ideologie}.construction`));
                                if (const_bois > Ressources.bois) {
                                    const_batiment = false;
                                    manque_bois = true;
                                }
                                //endregion
                                break;

                            case 'Usine civile':
                                //region Usine civile
                                nom = 'usine_civile';
                                need_acier = true;
                                need_beton = true;
                                need_bois = true;

                                const_T_libre = batimentObject.usine_civile.SURFACE_USINE_CIVILE * nombre;
                                if (const_T_libre > Territoire.T_libre) {
                                    const_batiment = false;
                                    manque_T_libre = true;
                                }

                                const_acier = Math.round(batimentObject.usine_civile.CONST_USINE_CIVILE_ACIER * nombre * eval(`gouvernementObject.${Pays.ideologie}.construction`));
                                if (const_acier > Ressources.acier) {
                                    const_batiment = false;
                                    manque_acier = true;
                                }

                                const_beton = Math.round(batimentObject.usine_civile.CONST_USINE_CIVILE_BETON * nombre * eval(`gouvernementObject.${Pays.ideologie}.construction`));
                                if (const_beton > Ressources.beton) {
                                    const_batiment = false;
                                    manque_beton = true;
                                }

                                const_bois = Math.round(batimentObject.usine_civile.CONST_USINE_CIVILE_BOIS * nombre * eval(`gouvernementObject.${Pays.ideologie}.construction`));
                                if (const_bois > Ressources.bois) {
                                    const_batiment = false;
                                    manque_bois = true;
                                }
                                //endregion
                                break;
                        }

                        interaction.deferUpdate()
                        const fields = [];
                        const receivedEmbed = interaction.message.embeds[0];
                        if (const_batiment === true) {
                            fields.push({
                                name: `> ⚒️ Vous avez désormais :`,
                                value: codeBlock(`• ${(parseInt(eval(`Batiment.${nom}`)) + parseInt(nombre)).toLocaleString('en-US')} ${batiment}`) + `\u200B`,
                            })
                            const embed = EmbedBuilder.from(receivedEmbed).setFields(fields);
                            interaction.message.edit({embeds: [embed], components: []})

                            sql = `UPDATE batiments SET ${nom}=${nom}+${nombre},
                                                        usine_total=usine_total+${nombre} WHERE id_joueur='${interaction.member.id}';
                                   UPDATE territoire SET T_libre=T_libre-${const_T_libre},
                                                         T_occ=T_occ+${const_T_libre} WHERE id_joueur='${interaction.member.id}'`;
                            if (need_acier === true) {
                                sql = sql + `;UPDATE ressources SET acier=acier-${const_acier} WHERE id_joueur='${interaction.member.id}'`
                            }

                            if (need_beton === true) {
                                sql = sql + `;UPDATE ressources SET beton=beton-${const_beton} WHERE id_joueur='${interaction.member.id}'`
                            }

                            if (need_bois === true) {
                                sql = sql + `;UPDATE ressources SET bois=bois-${const_bois} WHERE id_joueur='${interaction.member.id}'`
                            }

                            if (need_eolienne === true) {
                                sql = sql + `;UPDATE ressources SET eolienne=eolienne-${const_eolienne} WHERE id_joueur='${interaction.member.id}'`
                            }

                            if (need_verre === true) {
                                sql = sql + `;UPDATE ressources SET verre=verre-${const_verre} WHERE id_joueur='${interaction.member.id}'`
                            }

                            connection.query(sql, async (err) => {if (err) {throw err;}})
                        } else {
                            if (manque_T_libre === true) {
                                fields.push({
                                    name: `> ⛔ Manque de terrain libre ⛔ :`,
                                    value: codeBlock(`• Terrain : ${Territoire.T_libre.toLocaleString('en-US')}/${const_T_libre.toLocaleString('en-US')}\n`) + `\u200B`
                                })
                            } else {
                                fields.push({
                                    name: `> ✅ Terrain libre suffisant ✅ :`,
                                    value: codeBlock(`• Terrain : ${const_T_libre.toLocaleString('en-US')}/${const_T_libre.toLocaleString('en-US')}\n`) + `\u200B`
                                })
                            }

                            if (need_acier === true) {
                                if (manque_acier === true) {
                                    fields.push({
                                        name: `> ⛔ Manque d'acier ⛔ :`,
                                        value: codeBlock(`• Acier : ${Ressources.acier.toLocaleString('en-US')}/${const_acier.toLocaleString('en-US')}\n`) + `\u200B`
                                    })
                                } else {
                                    fields.push({
                                        name: `> ✅ Acier suffisant ✅ :`,
                                        value: codeBlock(`• Acier : ${const_acier.toLocaleString('en-US')}/${const_acier.toLocaleString('en-US')}\n`) + `\u200B`
                                    })
                                }
                            }

                            if (need_beton === true) {
                                if (manque_beton === true) {
                                    fields.push({
                                        name: `> ⛔ Manque de béton ⛔ :`,
                                        value: codeBlock(`• Béton : ${Ressources.beton.toLocaleString('en-US')}/${const_beton.toLocaleString('en-US')}\n`) + `\u200B`
                                    })
                                } else {
                                    fields.push({
                                        name: `> ✅ Béton suffisant ✅ :`,
                                        value: codeBlock(`• Béton : ${const_beton.toLocaleString('en-US')}/${const_beton.toLocaleString('en-US')}\n`) + `\u200B`
                                    })
                                }
                            }

                            if (need_bois === true) {
                                if (manque_bois === true) {
                                    fields.push({
                                        name: `> ⛔ Manque de bois ⛔ :`,
                                        value: codeBlock(`• Bois : ${Ressources.bois.toLocaleString('en-US')}/${const_bois.toLocaleString('en-US')}\n`) + `\u200B`
                                    })
                                } else {
                                    fields.push({
                                        name: `> ✅ Bois suffisant ✅ :`,
                                        value: codeBlock(`• Bois : ${const_bois.toLocaleString('en-US')}/${const_bois.toLocaleString('en-US')}\n`) + `\u200B`
                                    })
                                }
                            }

                            if (need_eolienne === true) {
                                if (manque_eolienne === true) {
                                    fields.push({
                                        name: `> ⛔ Manque d'éolienne' ⛔ :`,
                                        value: codeBlock(`• Eolienne : ${Ressources.eolienne.toLocaleString('en-US')}/${const_eolienne.toLocaleString('en-US')}\n`) + `\u200B`
                                    })
                                } else {
                                    fields.push({
                                        name: `> ✅ Eolienne suffisant ✅ :`,
                                        value: codeBlock(`• Eolienne : ${const_eolienne.toLocaleString('en-US')}/${const_eolienne.toLocaleString('en-US')}\n`) + `\u200B`
                                    })
                                }
                            }

                            if (need_verre === true) {
                                if (manque_verre === true) {
                                    fields.push({
                                        name: `> ⛔ Manque de verre ⛔ :`,
                                        value: codeBlock(`• Verre : ${Ressources.verre.toLocaleString('en-US')}/${const_verre.toLocaleString('en-US')}\n`) + `\u200B`
                                    })
                                } else {
                                    fields.push({
                                        name: `> ✅ Verre suffisant ✅ :`,
                                        value: codeBlock(`• Verre : ${const_verre.toLocaleString('en-US')}/${const_verre.toLocaleString('en-US')}\n`) + `\u200B`
                                    })
                                }
                            }

                            const embed = EmbedBuilder.from(receivedEmbed).setFields(fields);

                            const row = new ActionRowBuilder()
                                .addComponents(
                                    new ButtonBuilder()
                                        .setLabel(`Construire`)
                                        .setEmoji(`⚒️`)
                                        .setCustomId(`construction`)
                                        .setStyle(ButtonStyle.Danger)
                                        .setDisabled(true)
                                )
                                .addComponents(
                                    new ButtonBuilder()
                                        .setLabel(`Refuser`)
                                        .setEmoji(`✋`)
                                        .setCustomId(`refuser-${interaction.user.id}`)
                                        .setStyle(ButtonStyle.Danger),
                                )
                                .addComponents(
                                    new ButtonBuilder()
                                        .setLabel(`Actualiser`)
                                        .setEmoji(`🔁`)
                                        .setCustomId(`construct-reload-${interaction.user.id}`)
                                        .setStyle(ButtonStyle.Primary),
                                )
                            interaction.message.edit({embeds: [embed], components: [row]})
                        }
                    });
                } else {
                    reponse = codeBlock('diff', `- Vous n'êtes pas l'auteur de cette commande`);
                    interaction.reply({content: reponse, ephemeral: true});
                }
                //endregion
            } else if (interaction.customId.includes('assemblage') === true) {
                //region Assemblage
                id_joueur = interaction.customId.slice(11);
                if (id_joueur === interaction.member.id) {
                    sql = `
                        SELECT * FROM armee WHERE id_joueur=${interaction.member.id};
                        SELECT * FROM pays WHERE id_joueur=${interaction.member.id};
                        SELECT * FROM ressources WHERE id_joueur=${interaction.member.id}
                    `;
                    connection.query(sql, async (err, results) => {if (err) {throw err;}
                        const Armee = results[0][0];
                        const Pays = results[1][0];
                        const Ressources = results[2][0];

                        let manque_acier;
                        let const_acier;
                        let manque_metaux;
                        let const_metaux;
                        let manque_verre;
                        let const_verre;

                        let nom;
                        let table;
                        let const_batiment = true;
                        let need_acier = false;
                        let need_metaux = false;
                        let need_verre = false;

                        let title = interaction.message.embeds[0].title;
                        title = title.substring(14, title.length - 1);
                        const espace = title.indexOf(" ");
                        let nombre = title.slice(0, espace);
                        nombre = nombre.replace(/,/g, "");
                        const ressource = title.slice(espace + 1);

                        switch (ressource) {
                            case 'Avion':
                                //region Avion
                                nom = 'avion';
                                table = 'armee';
                                need_acier = true;
                                need_metaux = true;

                                const_acier = Math.round(assemblageObject.avion.CONST_AVION_ACIER * nombre);
                                if (const_acier > Ressources.acier) {
                                    const_batiment = false;
                                    manque_acier = true;
                                }
                                const_metaux = Math.round(assemblageObject.avion.CONST_AVION_METAUX * nombre);
                                if (const_metaux > Ressources.metaux) {
                                    const_batiment = false;
                                    manque_metaux = true;
                                }
                                //endregion
                                break;
                            case 'Eolienne':
                                //region Eolienne
                                nom = 'eolienne';
                                table = 'ressources';
                                need_acier = true;

                                const_acier = Math.round(assemblageObject.eolienne.CONST_EOLIENNE_ACIER * nombre);
                                if (const_acier > Ressources.acier) {
                                    const_batiment = false;
                                    manque_acier = true;
                                }
                                const_verre = Math.round(assemblageObject.eolienne.CONST_EOLIENNE_VERRE * nombre);
                                if (const_verre > Ressources.verre) {
                                    const_batiment = false;
                                    manque_verre = true;
                                }
                                //endregion
                                break;
                            case 'Equipement de support':
                                //region Equipement de support
                                nom = 'equipement_support';
                                table = 'armee';
                                need_acier = true;
                                need_metaux = true;

                                const_acier = Math.round(assemblageObject.equipement_support.CONST_EQUIPEMENT_SUPPORT_ACIER * nombre);
                                if (const_acier > Ressources.acier) {
                                    const_batiment = false;
                                    manque_acier = true;
                                }
                                const_metaux = Math.round(assemblageObject.equipement_support.CONST_EQUIPEMENT_SUPPORT_METAUX * nombre);
                                if (const_metaux > Ressources.metaux) {
                                    const_batiment = false;
                                    manque_metaux = true;
                                }
                                //endregion
                                break;
                            case 'Matériel d\'infanterie':
                                //region Matériel d'infanterie
                                nom = 'materiel_infanterie';
                                table = 'armee';
                                need_acier = true;
                                need_metaux = true;

                                const_acier = Math.round(assemblageObject.materiel_infanterie.CONST_MATERIEL_INFANTERIE_ACIER * nombre);
                                if (const_acier > Ressources.acier) {
                                    const_batiment = false;
                                    manque_acier = true;
                                }
                                const_metaux = Math.round(assemblageObject.materiel_infanterie.CONST_MATERIEL_INFANTERIE_METAUX * nombre);
                                if (const_metaux > Ressources.metaux) {
                                    const_batiment = false;
                                    manque_metaux = true;
                                }
                                //endregion
                                break;
                            case 'Véhicule':
                                //region Véhicule
                                nom = 'vehicule';
                                table = 'armee';
                                need_acier = true;
                                need_metaux = true;

                                const_acier = Math.round(assemblageObject.vehicule.CONST_VEHICULE_ACIER * nombre);
                                if (const_acier > Ressources.acier) {
                                    const_batiment = false;
                                    manque_acier = true;
                                }
                                const_metaux = Math.round(assemblageObject.vehicule.CONST_VEHICULE_METAUX * nombre);
                                if (const_metaux > Ressources.metaux) {
                                    const_batiment = false;
                                    manque_metaux = true;
                                }
                                //endregion
                                break;
                        }

                        interaction.deferUpdate()
                        const fields = [];
                        const receivedEmbed = interaction.message.embeds[0];
                        if (const_batiment === true) {
                            fields.push({
                                name: `> 🪛 Vous avez désormais :`,
                                value: codeBlock(`• ${(parseInt(eval(`${chance.capitalize(table)}.${nom}`)) + parseInt(nombre)).toLocaleString('en-US')} ${ressource}`) + `\u200B`,
                            })
                            const embed = EmbedBuilder.from(receivedEmbed).setFields(fields);
                            interaction.message.edit({embeds: [embed], components: []})

                            sql = `UPDATE ${table} SET ${nom}=${nom}+${nombre} WHERE id_joueur='${interaction.member.id}'`;
                            if (need_acier === true) {
                                sql = sql + `;UPDATE ressources SET acier=acier-${const_acier} WHERE id_joueur='${interaction.member.id}'`
                            }

                            if (need_metaux === true) {
                                sql = sql + `;UPDATE ressources SET metaux=metaux-${const_metaux} WHERE id_joueur='${interaction.member.id}'`
                            }

                            if (need_verre === true) {
                                sql = sql + `;UPDATE ressources SET verre=verre-${const_verre} WHERE id_joueur='${interaction.member.id}'`
                            }

                            connection.query(sql, async (err) => {if (err) {throw err;}})
                        } else {

                            if (need_acier === true) {
                                if (manque_acier === true) {
                                    fields.push({
                                        name: `> ⛔ Manque d'acier ⛔ :`,
                                        value: codeBlock(`• Acier : ${Ressources.acier.toLocaleString('en-US')}/${const_acier.toLocaleString('en-US')}\n`) + `\u200B`
                                    })
                                } else {
                                    fields.push({
                                        name: `> ✅ Acier suffisant ✅ :`,
                                        value: codeBlock(`• Acier : ${const_acier.toLocaleString('en-US')}/${const_acier.toLocaleString('en-US')}\n`) + `\u200B`
                                    })
                                }
                            }

                            if (need_metaux === true) {
                                if (manque_metaux === true) {
                                    fields.push({
                                        name: `> ⛔ Manque de métaux ⛔ :`,
                                        value: codeBlock(`• Métaux : ${Ressources.metaux.toLocaleString('en-US')}/${const_metaux.toLocaleString('en-US')}\n`) + `\u200B`
                                    })
                                } else {
                                    fields.push({
                                        name: `> ✅ Métaux suffisant ✅ :`,
                                        value: codeBlock(`• Métaux : ${const_metaux.toLocaleString('en-US')}/${const_metaux.toLocaleString('en-US')}\n`) + `\u200B`
                                    })
                                }
                            }

                            if (need_verre === true) {
                                if (manque_verre === true) {
                                    fields.push({
                                        name: `> ⛔ Manque de verre ⛔ :`,
                                        value: codeBlock(`• Verre : ${Ressources.verre.toLocaleString('en-US')}/${const_verre.toLocaleString('en-US')}\n`) + `\u200B`
                                    })
                                } else {
                                    fields.push({
                                        name: `> ✅ Verre suffisant ✅ :`,
                                        value: codeBlock(`• Verre : ${const_verre.toLocaleString('en-US')}/${const_verre.toLocaleString('en-US')}\n`) + `\u200B`
                                    })
                                }
                            }

                            const embed = EmbedBuilder.from(receivedEmbed).setFields(fields);

                            const row = new ActionRowBuilder()
                                .addComponents(
                                    new ButtonBuilder()
                                        .setLabel(`Assembler`)
                                        .setEmoji(`🪛`)
                                        .setCustomId(`assemblage`)
                                        .setStyle(ButtonStyle.Danger)
                                        .setDisabled(true)
                                )
                                .addComponents(
                                    new ButtonBuilder()
                                        .setLabel(`Refuser`)
                                        .setEmoji(`✋`)
                                        .setCustomId(`refuser-${interaction.user.id}`)
                                        .setStyle(ButtonStyle.Danger),
                                )
                                .addComponents(
                                    new ButtonBuilder()
                                        .setLabel(`Actualiser`)
                                        .setEmoji(`🔁`)
                                        .setCustomId(`assembly-reload-${interaction.user.id}`)
                                        .setStyle(ButtonStyle.Primary),
                                )
                            interaction.message.edit({embeds: [embed], components: [row]})
                        }
                    });
                } else {
                    reponse = codeBlock('diff', `- Vous n'êtes pas l'auteur de cette commande`);
                    interaction.reply({content: reponse, ephemeral: true});
                }
                //endregion
            } else if (interaction.customId.includes('demolition') === true) {
                //region Démolition

                id_joueur = interaction.customId.slice(11);
                if (id_joueur === interaction.member.id) {

                    sql = `
                        SELECT * FROM batiments WHERE id_joueur=${interaction.member.id};
                        SELECT * FROM pays WHERE id_joueur=${interaction.member.id}
                    `;
                    connection.query(sql, async (err, results) => {if (err) {throw err;}
                        const Batiment = results[0][0];
                        const Pays = results[1][0];

                        let demo_batiment = true;
                        let need_acier = false;
                        let need_bois = false;
                        let need_eolienne = false;
                        let need_verre = false;

                        let demo_T_libre;
                        let demo_acier;
                        let demo_bois;
                        let demo_eolienne;
                        let demo_verre;

                        let nom;
                        let apres;
                        let avant;

                        let title = interaction.message.embeds[0].title;
                        title = title.substring(14, title.length - 1);
                        const espace = title.indexOf(" ");
                        let nombre = title.slice(0, espace);
                        nombre = nombre.replace(/,/g, "");
                        const batiment = title.slice(espace + 1);

                        switch (batiment) {
                            case 'Acierie':
                                //region Acierie

                                if (nombre > Batiment.acierie) {
                                    demo_batiment = false;
                                    reponse = codeBlock('ansi', `\u001b[0m\u001b[1;31mVous n'avez que ${Batiment.acierie}/${nombre} acieries`);
                                    await interaction.reply({ content: reponse, ephemeral: true });
                                }
                                nom = 'acierie';
                                demo_T_libre = batimentObject.acierie.SURFACE_ACIERIE * nombre;
                                demo_acier = Math.round(batimentObject.acierie.CONST_ACIERIE_ACIER * nombre * eval(`gouvernementObject.${Pays.ideologie}.construction`) * batimentObject.RETOUR_POURCENTAGE);
                                avant = Batiment.acierie;
                                apres = Batiment.acierie - nombre;
                                //endregion
                                break;

                            case 'Atelier de verre':
                                //region Atelier de verre
                                need_acier = true;
                                need_bois = true;

                                if (nombre > Batiment.atelier_verre) {
                                    demo_batiment = false;
                                    reponse = codeBlock('ansi', `\u001b[0m\u001b[1;31mVous n'avez que ${Batiment.atelier_verre}/${nombre} ateliers de verre`);
                                    await interaction.reply({ content: reponse, ephemeral: true });
                                }
                                nom = 'atelier_verre';
                                demo_T_libre = batimentObject.atelier_verre.SURFACE_ATELIER_VERRE * nombre;
                                demo_acier = Math.round(batimentObject.atelier_verre.CONST_ATELIER_VERRE_ACIER * nombre * eval(`gouvernementObject.${Pays.ideologie}.construction`) * batimentObject.RETOUR_POURCENTAGE);
                                demo_bois = Math.round(batimentObject.atelier_verre.CONST_ATELIER_VERRE_BOIS * nombre * eval(`gouvernementObject.${Pays.ideologie}.construction`) * batimentObject.RETOUR_POURCENTAGE);
                                avant = Batiment.atelier_verre;
                                apres = Batiment.atelier_verre - nombre;
                                //endregion
                                break;

                            case 'Carriere de sable':
                                //region Carriere de sable
                                need_acier = true;

                                if (nombre > Batiment.carriere_sable) {
                                    demo_batiment = false;
                                    reponse = codeBlock('ansi', `\u001b[0m\u001b[1;31mVous n'avez que ${Batiment.carriere_sable}/${nombre} carrieres de sable`);
                                    await interaction.reply({ content: reponse, ephemeral: true });
                                }
                                nom = 'carriere_sable';
                                demo_T_libre = batimentObject.carriere_sable.SURFACE_CARRIERE_SABLE * nombre;
                                demo_acier = Math.round(batimentObject.carriere_sable.CONST_CARRIERE_SABLE_ACIER * nombre * eval(`gouvernementObject.${Pays.ideologie}.construction`) * batimentObject.RETOUR_POURCENTAGE);
                                avant = Batiment.carriere_sable;
                                apres = Batiment.carriere_sable - nombre;
                                //endregion
                                break;

                            case 'Centrale biomasse':
                                //region Centrale biomasse
                                need_acier = true;

                                if (nombre > Batiment.centrale_biomasse) {
                                    demo_batiment = false;
                                    reponse = codeBlock('ansi', `\u001b[0m\u001b[1;31mVous n'avez que ${Batiment.centrale_biomasse}/${nombre} centrales biomasse`);
                                    await interaction.reply({ content: reponse, ephemeral: true });
                                }
                                nom = 'centrale_biomasse';
                                demo_T_libre = batimentObject.centrale_biomasse.SURFACE_CENTRALE_BIOMASSE * nombre;
                                demo_acier = Math.round(batimentObject.centrale_biomasse.CONST_CENTRALE_BIOMASSE_ACIER * nombre * eval(`gouvernementObject.${Pays.ideologie}.construction`) * batimentObject.RETOUR_POURCENTAGE);
                                avant = Batiment.centrale_biomasse;
                                apres = Batiment.centrale_biomasse - nombre;
                                //endregion
                                break;

                            case 'Centrale au charbon':
                                //region Centrale au charbon
                                need_acier = true;

                                if (nombre > Batiment.centrale_charbon) {
                                    demo_batiment = false;
                                    reponse = codeBlock('ansi', `\u001b[0m\u001b[1;31mVous n'avez que ${Batiment.centrale_charbon}/${nombre} centrales au charbon`);
                                    await interaction.reply({ content: reponse, ephemeral: true });
                                }
                                nom = 'centrale_charbon';
                                demo_T_libre = batimentObject.centrale_charbon.SURFACE_CENTRALE_CHARBON * nombre;
                                demo_acier = Math.round(batimentObject.centrale_charbon.CONST_CENTRALE_CHARBON_ACIER * nombre * eval(`gouvernementObject.${Pays.ideologie}.construction`) * batimentObject.RETOUR_POURCENTAGE);
                                avant = Batiment.centrale_charbon;
                                apres = Batiment.centrale_charbon - nombre;
                                //endregion
                                break;

                            case 'Centrale au fioul':
                                //region Centrale au fioul
                                need_acier = true;

                                if (nombre > Batiment.centrale_fioul) {
                                    demo_batiment = false;
                                    reponse = codeBlock('ansi', `\u001b[0m\u001b[1;31mVous n'avez que ${Batiment.centrale_fioul}/${nombre} centrales au fioul`);
                                    await interaction.reply({ content: reponse, ephemeral: true });
                                }
                                nom = 'centrale_fioul';
                                demo_T_libre = batimentObject.centrale_fioul.SURFACE_CENTRALE_FIOUL * nombre;
                                demo_acier = Math.round(batimentObject.centrale_fioul.CONST_CENTRALE_FIOUL_ACIER * nombre * eval(`gouvernementObject.${Pays.ideologie}.construction`) * batimentObject.RETOUR_POURCENTAGE);
                                avant = Batiment.centrale_fioul;
                                apres = Batiment.centrale_fioul - nombre;
                                //endregion
                                break;

                            case 'Champ':
                                //region Champ
                                need_acier = true;
                                need_bois = true;

                                if (nombre > Batiment.champ) {
                                    demo_batiment = false;
                                    reponse = codeBlock('ansi', `\u001b[0m\u001b[1;31mVous n'avez que ${Batiment.champ}/${nombre} champs`);
                                    await interaction.reply({ content: reponse, ephemeral: true });
                                }
                                nom = 'champ';
                                demo_T_libre = batimentObject.champ.SURFACE_CHAMP * nombre;
                                demo_acier = Math.round(batimentObject.champ.CONST_CHAMP_ACIER * nombre * eval(`gouvernementObject.${Pays.ideologie}.construction`) * batimentObject.RETOUR_POURCENTAGE);
                                demo_bois = Math.round(batimentObject.champ.CONST_CHAMP_BOIS * nombre * eval(`gouvernementObject.${Pays.ideologie}.construction`) * batimentObject.RETOUR_POURCENTAGE);
                                avant = Batiment.champ;
                                apres = Batiment.champ - nombre;
                                //endregion
                                break;

                            case 'Champ d\'eoliennes':
                                //region Champ d'éoliennes
                                need_eolienne = true;

                                if (nombre > Batiment.eolienne) {
                                    demo_batiment = false;
                                    reponse = codeBlock('ansi', `\u001b[0m\u001b[1;31mVous n'avez que ${Batiment.eolienne}/${nombre} champs d'éoliennes`);
                                    await interaction.reply({ content: reponse, ephemeral: true });
                                }
                                nom = 'eolienne';
                                demo_T_libre = batimentObject.eolienne.SURFACE_EOLIENNE * nombre;
                                demo_eolienne = Math.round(batimentObject.eolienne.CONST_EOLIENNE_EOLIENNE * nombre);
                                avant = Batiment.eolienne;
                                apres = Batiment.eolienne - nombre;
                                //endregion
                                break;

                            case 'Cimenterie':
                                //region Cimenterie
                                need_acier = true;

                                if (nombre > Batiment.cimenterie) {
                                    demo_batiment = false;
                                    reponse = codeBlock('ansi', `\u001b[0m\u001b[1;31mVous n'avez que ${Batiment.cimenterie}/${nombre} cimenteries`);
                                    await interaction.reply({ content: reponse, ephemeral: true });
                                }
                                nom = 'cimenterie';
                                demo_T_libre = batimentObject.cimenterie.SURFACE_CIMENTERIE * nombre;
                                demo_acier = Math.round(batimentObject.cimenterie.CONST_CIMENTERIE_ACIER * nombre * eval(`gouvernementObject.${Pays.ideologie}.construction`) * batimentObject.RETOUR_POURCENTAGE);
                                avant = Batiment.cimenterie;
                                apres = Batiment.cimenterie - nombre;
                                //endregion
                                break;

                            case 'Derrick':
                                //region Derrick
                                need_acier = true;

                                if (nombre > Batiment.derrick) {
                                    demo_batiment = false;
                                    reponse = codeBlock('ansi', `\u001b[0m\u001b[1;31mVous n'avez que ${Batiment.derrick}/${nombre} derricks`);
                                    await interaction.reply({ content: reponse, ephemeral: true });
                                }
                                nom = 'derrick';
                                demo_T_libre = batimentObject.derrick.SURFACE_DERRICK * nombre;
                                demo_acier = Math.round(batimentObject.derrick.CONST_DERRICK_ACIER * nombre * eval(`gouvernementObject.${Pays.ideologie}.construction`) * batimentObject.RETOUR_POURCENTAGE);
                                avant = Batiment.derrick;
                                apres = Batiment.derrick - nombre;
                                //endregion
                                break;

                            case 'Mine de charbon':
                                //region Mine de charbon
                                need_acier = true;

                                if (nombre > Batiment.mine_charbon) {
                                    demo_batiment = false;
                                    reponse = codeBlock('ansi', `\u001b[0m\u001b[1;31mVous n'avez que ${Batiment.mine_charbon}/${nombre} mines de charbon`);
                                    await interaction.reply({ content: reponse, ephemeral: true });
                                }
                                nom = 'mine_charbon';
                                demo_T_libre = batimentObject.mine_charbon.SURFACE_MINE_CHARBON * nombre;
                                demo_acier = Math.round(batimentObject.mine_charbon.CONST_MINE_CHARBON_ACIER * nombre * eval(`gouvernementObject.${Pays.ideologie}.construction`)) * batimentObject.RETOUR_POURCENTAGE;
                                avant = Batiment.mine_charbon;
                                apres = Batiment.mine_charbon - nombre;
                                //endregion
                                break;

                            case 'Mine de metaux':
                                //region Mine de metaux
                                need_acier = true;

                                if (nombre > Batiment.mine_metaux) {
                                    demo_batiment = false;
                                    reponse = codeBlock('ansi', `\u001b[0m\u001b[1;31mVous n'avez que ${Batiment.mine_metaux}/${nombre} mines de metaux`);
                                    await interaction.reply({ content: reponse, ephemeral: true });
                                }
                                nom = 'mine_metaux';
                                demo_T_libre = batimentObject.mine_metaux.SURFACE_MINE_METAUX * nombre;
                                demo_acier = Math.round(batimentObject.mine_metaux.CONST_MINE_METAUX_ACIER * nombre * eval(`gouvernementObject.${Pays.ideologie}.construction`) * batimentObject.RETOUR_POURCENTAGE);
                                avant = Batiment.mine_metaux;
                                apres = Batiment.mine_metaux - nombre;
                                //endregion
                                break;

                            case 'Station de pompage':
                                //region Station de pompage
                                need_acier = true;

                                if (nombre > Batiment.station_pompage) {
                                    demo_batiment = false;
                                    reponse = codeBlock('ansi', `\u001b[0m\u001b[1;31mVous n'avez que ${Batiment.station_pompage}/${nombre} stations de pompage`);
                                    await interaction.reply({ content: reponse, ephemeral: true });
                                }
                                nom = 'station_pompage';
                                demo_T_libre = batimentObject.station_pompage.SURFACE_STATION_POMPAGE * nombre;
                                demo_acier = Math.round(batimentObject.station_pompage.CONST_STATION_POMPAGE_ACIER * nombre * eval(`gouvernementObject.${Pays.ideologie}.construction`) * batimentObject.RETOUR_POURCENTAGE);
                                avant = Batiment.station_pompage;
                                apres = Batiment.station_pompage - nombre;
                                //endregion
                                break;

                            case 'Quartier':
                                //region Quartier
                                need_acier = true;
                                need_bois = true;
                                need_verre = true;

                                if (nombre > Batiment.quartier) {
                                    demo_batiment = false;
                                    reponse = codeBlock('ansi', `\u001b[0m\u001b[1;31mVous n'avez que ${Batiment.quartier}/${nombre} quartiers`);
                                    await interaction.reply({ content: reponse, ephemeral: true });
                                }
                                nom = 'quartier';
                                demo_T_libre = batimentObject.quartier.SURFACE_QUARTIER * nombre;
                                demo_acier = Math.round(batimentObject.quartier.CONST_QUARTIER_ACIER * nombre * eval(`gouvernementObject.${Pays.ideologie}.construction`) * batimentObject.RETOUR_POURCENTAGE);
                                demo_bois = Math.round(batimentObject.quartier.CONST_QUARTIER_BOIS * nombre * eval(`gouvernementObject.${Pays.ideologie}.construction`) * batimentObject.RETOUR_POURCENTAGE);
                                demo_verre = Math.round(batimentObject.quartier.CONST_QUARTIER_VERRE * nombre * eval(`gouvernementObject.${Pays.ideologie}.construction`) * batimentObject.RETOUR_POURCENTAGE);
                                avant = Batiment.quartier;
                                apres = Batiment.quartier - nombre;
                                //endregion
                                break;

                            case 'Raffinerie':
                                //region Raffinerie
                                need_acier = true;

                                if (nombre > Batiment.raffinerie) {
                                    demo_batiment = false;
                                    reponse = codeBlock('ansi', `\u001b[0m\u001b[1;31mVous n'avez que ${Batiment.raffinerie}/${nombre} raffineries`);
                                    await interaction.reply({ content: reponse, ephemeral: true });
                                }
                                nom = 'raffinerie';
                                demo_T_libre = batimentObject.raffinerie.SURFACE_RAFFINERIE * nombre;
                                demo_acier = Math.round(batimentObject.raffinerie.CONST_RAFFINERIE_ACIER * nombre * eval(`gouvernementObject.${Pays.ideologie}.construction`) * batimentObject.RETOUR_POURCENTAGE);
                                avant = Batiment.raffinerie;
                                apres = Batiment.raffinerie - nombre;
                                //endregion
                                break;

                            case 'Scierie':
                                //region Scierie
                                need_acier = true;
                                need_bois = true;

                                if (nombre > Batiment.scierie) {
                                    demo_batiment = false;
                                    reponse = codeBlock('ansi', `\u001b[0m\u001b[1;31mVous n'avez que ${Batiment.scierie}/${nombre} scieries`);
                                    await interaction.reply({ content: reponse, ephemeral: true });
                                }
                                nom = 'scierie';
                                demo_T_libre = batimentObject.scierie.SURFACE_SCIERIE * nombre;
                                demo_acier = Math.round(batimentObject.scierie.CONST_SCIERIE_ACIER * nombre * eval(`gouvernementObject.${Pays.ideologie}.construction`));
                                demo_bois = Math.round(batimentObject.scierie.CONST_SCIERIE_BOIS * nombre * eval(`gouvernementObject.${Pays.ideologie}.construction`));
                                avant = Batiment.scierie;
                                apres = Batiment.scierie - nombre;
                                //endregion
                                break;

                            case 'Usine civile':
                                //region Usine civile
                                need_acier = true;
                                need_bois = true;

                                if (nombre > Batiment.usine_civile) {
                                    demo_batiment = false;
                                    reponse = codeBlock('ansi', `\u001b[0m\u001b[1;31mVous n'avez que ${Batiment.usine_civile}/${nombre} usines civile`);
                                    await interaction.reply({ content: reponse, ephemeral: true });
                                }
                                nom = 'usine_civile';
                                demo_T_libre = batimentObject.usine_civile.SURFACE_USINE_CIVILE * nombre;
                                demo_acier = Math.round(batimentObject.usine_civile.CONST_USINE_CIVILE_ACIER * nombre * eval(`gouvernementObject.${Pays.ideologie}.construction`) * batimentObject.RETOUR_POURCENTAGE);
                                demo_bois = Math.round(batimentObject.usine_civile.CONST_USINE_CIVILE_BOIS * nombre * eval(`gouvernementObject.${Pays.ideologie}.construction`) * batimentObject.RETOUR_POURCENTAGE);
                                avant = Batiment.usine_civile;
                                apres = Batiment.usine_civile - nombre;
                                //endregion
                                break;
                        }
                        if (demo_batiment === true) {
                            let sql = `UPDATE batiments SET ${nom}=${nom}-${nombre},
                                                            usine_total=usine_total-${nombre} WHERE id_joueur = '${interaction.member.id}';
                                       UPDATE territoire SET T_libre=T_libre+${demo_T_libre},
                                                             T_occ=T_occ-${demo_T_libre} WHERE id_joueur = '${interaction.member.id}'
                            `;

                            if (need_acier === true) {
                                sql = sql + `;UPDATE ressources SET acier=acier+${demo_acier} WHERE id_joueur='${interaction.member.id}'`;
                            }
                            if (need_bois === true) {
                                sql = sql + `;UPDATE ressources SET bois=bois+${demo_bois} WHERE id_joueur='${interaction.member.id}\'`;
                            }
                            if (need_eolienne === true) {
                                sql = sql + `;UPDATE ressources SET eolienne=eolienne+${demo_eolienne} WHERE id_joueur='${interaction.member.id}'`;
                            }
                            if (need_verre === true) {
                                sql = sql + `;UPDATE ressources SET verre=verre+${demo_verre} WHERE id_joueur='${interaction.member.id}'`;
                            }
                            connection.query(sql, async (err) => {if (err) {throw err;}})

                            const embed = {
                                author: {
                                    name: `${Pays.rang} de ${Pays.nom}`,
                                    icon_url: interaction.member.displayAvatarURL()
                                },
                                thumbnail: {
                                    url: Pays.drapeau
                                },
                                title: `\`Démolition : ${nombre.toLocaleString('en-US')} ${batiment}\``,
                                description: `> 🧨 Vous avez désormais :\n` +
                                    codeBlock(`• ${apres.toLocaleString('en-US')} ${batiment}`) + `\u200B`,
                                color: interaction.member.displayColor,
                                timestamp: new Date(),
                                footer: {
                                    text: `${Pays.devise}`
                                },
                            };
                            interaction.deferUpdate()
                            interaction.message.edit({embeds: [embed], components: []})
                        }
                    });

                } else {
                    reponse = codeBlock('diff', `- Vous n'êtes pas l'auteur de cette commande`);
                    interaction.reply({content: reponse, ephemeral: true});
                }
                //endregion
            } else if (interaction.customId.includes('former') === true) {
                //region Former
                id_joueur = interaction.customId.slice(7);
                if (id_joueur === interaction.member.id) {

                    sql = `
                        SELECT * FROM armee WHERE id_joueur='${interaction.member.id}';
                        SELECT * FROM population WHERE id_joueur='${interaction.member.id}'
                    `;
                    connection.query(sql, async (err, results) => {if (err) {throw err;}
                        const Armee = results[0][0];
                        const Population = results[1][0];

                        const hommeArmee =
                            Armee.unite * eval(`armeeObject.${Armee.strategie}.aviation`) * eval(`armeeObject.aviation.homme`) +
                            Armee.unite * eval(`armeeObject.${Armee.strategie}.infanterie`) * eval(`armeeObject.infanterie.homme`) +
                            Armee.unite * eval(`armeeObject.${Armee.strategie}.mecanise`) * eval(`armeeObject.mecanise.homme`) +
                            Armee.unite * eval(`armeeObject.${Armee.strategie}.support`) * eval(`armeeObject.support.homme`) +
                            (Armee.aviation * armeeObject.aviation.homme) +
                            (Armee.infanterie * armeeObject.infanterie.homme) +
                            (Armee.mecanise * armeeObject.mecanise.homme) +
                            (Armee.support * armeeObject.support.homme);

                        let manque_homme;
                        let const_homme;
                        let manque_avion;
                        let const_avion;
                        let manque_equipement_support;
                        let const_equipement_support;
                        let manque_materiel_infanterie;
                        let const_materiel_infanterie;
                        let manque_vehicule;
                        let const_vehicule;

                        let nom;
                        let const_unite = true;
                        let need_homme = false;
                        let need_avion = false;
                        let need_equipement_support = false;
                        let need_materiel_infanterie = false;
                        let need_vehicule = false;

                        let title = interaction.message.embeds[0].title;
                        title = title.substring(10, title.length - 1);
                        const espace = title.indexOf(" ");
                        let nombre = title.slice(0, espace);
                        nombre = nombre.replace(/,/g, "");
                        const ressource = title.slice(espace + 1);

                        switch (ressource) {
                            case 'Aviation':
                                //region Aviation
                                nom = 'aviation';
                                need_homme = true;
                                need_avion = true;
                                need_equipement_support = true;
                                need_materiel_infanterie = true;
                                need_vehicule = true;

                                const_homme = armeeObject.aviation.homme * nombre;
                                if (const_homme > (Population.jeune + Population.adulte - hommeArmee)) {
                                    const_unite = false;
                                    manque_homme = true;
                                }
                                const_avion = armeeObject.aviation.avion * nombre;
                                if (const_avion > Armee.avion) {
                                    const_unite = false;
                                    manque_avion = true;
                                }
                                const_equipement_support = armeeObject.aviation.equipement_support * nombre;
                                if (const_equipement_support > Armee.equipement_support) {
                                    const_unite = false;
                                    manque_equipement_support = true;
                                }
                                const_materiel_infanterie = armeeObject.aviation.materiel_infanterie * nombre;
                                if (const_materiel_infanterie > Armee.materiel_infanterie) {
                                    const_unite = false;
                                    manque_materiel_infanterie = true;
                                }
                                const_vehicule = armeeObject.aviation.vehicule * nombre;
                                if (const_vehicule > Armee.vehicule) {
                                    const_unite = false;
                                    manque_vehicule = true;
                                }
                                //endregion
                                break;
                            case 'Infanterie':
                                //region Infanterie
                                nom = 'infanterie';
                                need_homme = true;
                                need_equipement_support = true;
                                need_materiel_infanterie = true;
                                need_vehicule = true;

                                const_homme = armeeObject.infanterie.homme * nombre;
                                if (const_homme > (Population.jeune + Population.adulte - hommeArmee)) {
                                    const_unite = false;
                                    manque_homme = true;
                                }
                                const_equipement_support = armeeObject.infanterie.equipement_support * nombre;
                                if (const_equipement_support > Armee.equipement_support) {
                                    const_unite = false;
                                    manque_equipement_support = true;
                                }
                                const_materiel_infanterie = armeeObject.infanterie.materiel_infanterie * nombre;
                                if (const_materiel_infanterie > Armee.materiel_infanterie) {
                                    const_unite = false;
                                    manque_materiel_infanterie = true;
                                }
                                const_vehicule = armeeObject.infanterie.vehicule * nombre;
                                if (const_vehicule > Armee.vehicule) {
                                    const_unite = false;
                                    manque_vehicule = true;
                                }
                                //endregion
                                break;
                            case 'Mécanisé':
                                //region Mecanisé
                                nom = 'mecanise';
                                need_homme = true;
                                need_equipement_support = true;
                                need_materiel_infanterie = true;
                                need_vehicule = true;

                                const_homme = armeeObject.mecanise.homme * nombre;
                                if (const_homme > (Population.jeune + Population.adulte - hommeArmee)) {
                                    const_unite = false;
                                    manque_homme = true;
                                }
                                const_equipement_support = armeeObject.mecanise.equipement_support * nombre;
                                if (const_equipement_support > Armee.equipement_support) {
                                    const_unite = false;
                                    manque_equipement_support = true;
                                }
                                const_materiel_infanterie = armeeObject.mecanise.materiel_infanterie * nombre;
                                if (const_materiel_infanterie > Armee.materiel_infanterie) {
                                    const_unite = false;
                                    manque_materiel_infanterie = true;
                                }
                                const_vehicule = armeeObject.mecanise.vehicule * nombre;
                                if (const_vehicule > Armee.vehicule) {
                                    const_unite = false;
                                    manque_vehicule = true;
                                }
                                //endregion
                                break;
                            case 'Support':
                                //region Support
                                nom = 'support';
                                need_homme = true;
                                need_equipement_support = true;
                                need_materiel_infanterie = true;
                                need_vehicule = true;

                                const_homme = armeeObject.support.homme * nombre;
                                if (const_homme > (Population.jeune + Population.adulte - hommeArmee)) {
                                    const_unite = false;
                                    manque_homme = true;
                                }
                                const_equipement_support = armeeObject.support.equipement_support * nombre;
                                if (const_equipement_support > Armee.equipement_support) {
                                    const_unite = false;
                                    manque_equipement_support = true;
                                }
                                const_materiel_infanterie = armeeObject.support.materiel_infanterie * nombre;
                                if (const_materiel_infanterie > Armee.materiel_infanterie) {
                                    const_unite = false;
                                    manque_materiel_infanterie = true;
                                }
                                const_vehicule = armeeObject.support.vehicule * nombre;
                                if (const_vehicule > Armee.vehicule) {
                                    const_unite = false;
                                    manque_vehicule = true;
                                }
                                //endregion
                                break;
                        }

                        interaction.deferUpdate()
                        const fields = [];
                        const receivedEmbed = interaction.message.embeds[0];
                        if (const_unite === true) {
                            fields.push({
                                name: `> 🪖 Vous avez désormais :`,
                                value: codeBlock(`• ${(parseInt(eval(`Armee.${nom}`)) + parseInt(nombre)).toLocaleString('en-US')} ${ressource}`) + `\u200B`,
                            })
                            const embed = EmbedBuilder.from(receivedEmbed).setFields(fields);
                            interaction.message.edit({embeds: [embed], components: []})

                            sql = `UPDATE armee SET ${nom}=${nom}+${nombre} WHERE id_joueur='${interaction.member.id}'`;

                            if (need_avion === true) {
                                sql = sql + `;UPDATE armee SET avion=avion-${const_avion} WHERE id_joueur='${interaction.member.id}'`
                            }

                            if (need_equipement_support === true) {
                                sql = sql + `;UPDATE armee SET equipement_support=equipement_support-${const_equipement_support} WHERE id_joueur='${interaction.member.id}'`
                            }

                            if (need_materiel_infanterie === true) {
                                sql = sql + `;UPDATE armee SET materiel_infanterie=materiel_infanterie-${const_materiel_infanterie} WHERE id_joueur='${interaction.member.id}'`
                            }

                            if (need_vehicule === true) {
                                sql = sql + `;UPDATE armee SET vehicule=vehicule-${const_vehicule} WHERE id_joueur='${interaction.member.id}'`
                            }

                            connection.query(sql, async (err) => {if (err) {throw err;}})
                        } else {
                            if (need_homme === true) {
                                if (manque_homme === true) {
                                    fields.push({
                                        name: `> ⛔ Manque d'hommes ⛔ :`,
                                        value: codeBlock(`• Homme : ${(Population.jeune + Population.adulte - hommeArmee).toLocaleString('en-US')}/${const_homme.toLocaleString('en-US')}\n`) + `\u200B`
                                    })
                                } else {
                                    fields.push({
                                        name: `> ✅ Hommes suffisant ✅ :`,
                                        value: codeBlock(`• Homme : ${const_homme.toLocaleString('en-US')}/${const_homme.toLocaleString('en-US')}\n`) + `\u200B`
                                    })
                                }
                            }

                            if (need_avion === true) {
                                if (manque_avion === true) {
                                    fields.push({
                                        name: `> ⛔ Manque d'avion ⛔ :`,
                                        value: codeBlock(`• Avion : ${Armee.avion.toLocaleString('en-US')}/${const_avion.toLocaleString('en-US')}\n`) + `\u200B`
                                    })
                                } else {
                                    fields.push({
                                        name: `> ✅ Avion suffisant ✅ :`,
                                        value: codeBlock(`• Avion : ${const_avion.toLocaleString('en-US')}/${const_avion.toLocaleString('en-US')}\n`) + `\u200B`
                                    })
                                }
                            }

                            if (need_equipement_support === true) {
                                if (manque_equipement_support === true) {
                                    fields.push({
                                        name: `> ⛔ Manque d'équipement de support ⛔ :`,
                                        value: codeBlock(`• Equipement de support : ${Armee.equipement_support.toLocaleString('en-US')}/${const_equipement_support.toLocaleString('en-US')}\n`) + `\u200B`
                                    })
                                } else {
                                    fields.push({
                                        name: `> ✅ Equipement de support suffisant ✅ :`,
                                        value: codeBlock(`• Equipement de support : ${const_equipement_support.toLocaleString('en-US')}/${const_equipement_support.toLocaleString('en-US')}\n`) + `\u200B`
                                    })
                                }
                            }

                            if (need_materiel_infanterie === true) {
                                if (manque_materiel_infanterie === true) {
                                    fields.push({
                                        name: `> ⛔ Manque de materiel d'infanterie ⛔ :`,
                                        value: codeBlock(`• Materiel d'infanterie : ${Armee.materiel_infanterie.toLocaleString('en-US')}/${const_materiel_infanterie.toLocaleString('en-US')}\n`) + `\u200B`
                                    })
                                } else {
                                    fields.push({
                                        name: `> ✅ Materiel d'infanterie suffisant ✅ :`,
                                        value: codeBlock(`• Materiel d'infanterie : ${const_materiel_infanterie.toLocaleString('en-US')}/${const_materiel_infanterie.toLocaleString('en-US')}\n`) + `\u200B`
                                    })
                                }
                            }

                            if (need_vehicule === true) {
                                if (manque_vehicule === true) {
                                    fields.push({
                                        name: `> ⛔ Manque de véhicule ⛔ :`,
                                        value: codeBlock(`• Véhicule : ${Armee.vehicule.toLocaleString('en-US')}/${const_vehicule.toLocaleString('en-US')}\n`) + `\u200B`
                                    })
                                } else {
                                    fields.push({
                                        name: `> ✅ Véhicule suffisant ✅ :`,
                                        value: codeBlock(`• Véhicule : ${const_vehicule.toLocaleString('en-US')}/${const_vehicule.toLocaleString('en-US')}\n`) + `\u200B`
                                    })
                                }
                            }

                            const embed = EmbedBuilder.from(receivedEmbed).setFields(fields);

                            const row = new ActionRowBuilder()
                                .addComponents(
                                    new ButtonBuilder()
                                        .setLabel(`Former`)
                                        .setEmoji(`🪖`)
                                        .setCustomId(`former-${interaction.user.id}`)
                                        .setStyle(ButtonStyle.Danger)
                                        .setDisabled(true)
                                )
                                .addComponents(
                                    new ButtonBuilder()
                                        .setLabel(`Refuser`)
                                        .setEmoji(`✋`)
                                        .setCustomId(`refuser-${interaction.user.id}`)
                                        .setStyle(ButtonStyle.Danger),
                                )
                                .addComponents(
                                    new ButtonBuilder()
                                        .setLabel(`Actualiser`)
                                        .setEmoji(`🔁`)
                                        .setCustomId(`train-reload-${interaction.user.id}`)
                                        .setStyle(ButtonStyle.Primary),
                                )
                            interaction.message.edit({embeds: [embed], components: [row]})
                        }
                    });
                } else {
                    reponse = codeBlock('diff', `- Vous n'êtes pas l'auteur de cette commande`);
                    interaction.reply({content: reponse, ephemeral: true});
                }
                //endregion
            } else if (interaction.customId.includes('construct-reload') === true) {
                //region Actualiser construction
                id_joueur = interaction.customId.slice(17);
                if (id_joueur === interaction.member.id) {

                    sql = `
                        SELECT * FROM pays WHERE id_joueur=${interaction.member.id};
                        SELECT * FROM ressources WHERE id_joueur=${interaction.member.id};
                        SELECT * FROM territoire WHERE id_joueur=${interaction.member.id}
                    `;
                    connection.query(sql, async (err, results) => {if (err) {throw err;}
                        const Pays = results[0][0];
                        const Ressources = results[1][0];
                        const Territoire = results[2][0];

                        let title = interaction.message.embeds[0].title;
                        title = title.substring(16, title.length - 1);
                        let nombre = title.slice(0, title.indexOf(" ")).replace(/,/g, "");
                        const batiment = title.slice(title.indexOf(" ") + 1);

                        let manque_acier;
                        let const_acier;
                        let manque_beton;
                        let const_beton;
                        let manque_bois;
                        let const_bois;
                        let manque_eolienne;
                        let const_eolienne;
                        let manque_verre;
                        let const_verre;
                        let manque_T_libre;
                        let const_T_libre;

                        let const_batiment = true;
                        let need_acier = false;
                        let need_beton = false;
                        let need_bois = false;
                        let need_eolienne = false;
                        let need_verre = false;


                        switch (batiment) {
                            case 'Acierie':
                                need_acier = true;
                                need_beton = true;

                                const_T_libre = batimentObject.acierie.SURFACE_ACIERIE * nombre;
                                if (const_T_libre > Territoire.T_libre) {
                                    const_batiment = false;
                                    manque_T_libre = true;
                                }

                                const_acier = Math.round(batimentObject.acierie.CONST_ACIERIE_ACIER * nombre * eval(`gouvernementObject.${Pays.ideologie}.construction`));
                                if (const_acier > Ressources.acier) {
                                    const_batiment = false;
                                    manque_acier = true;
                                }

                                const_beton = Math.round(batimentObject.acierie.CONST_ACIERIE_BETON * nombre * eval(`gouvernementObject.${Pays.ideologie}.construction`));
                                if (const_beton > Ressources.beton) {
                                    const_batiment = false;
                                    manque_beton = true;
                                }
                                break;

                            case 'Atelier de verre':
                                need_acier = true;
                                need_beton = true;
                                need_bois = true;

                                const_T_libre = batimentObject.atelier_verre.SURFACE_ATELIER_VERRE * nombre;
                                if (const_T_libre > Territoire.T_libre) {
                                    const_batiment = false;
                                    manque_T_libre = true;
                                }

                                const_acier = Math.round(batimentObject.atelier_verre.CONST_ATELIER_VERRE_ACIER * nombre * eval(`gouvernementObject.${Pays.ideologie}.construction`));
                                if (const_acier > Ressources.acier) {
                                    const_batiment = false;
                                    manque_acier = true;
                                }

                                const_beton = Math.round(batimentObject.atelier_verre.CONST_ATELIER_VERRE_BETON * nombre * eval(`gouvernementObject.${Pays.ideologie}.construction`));
                                if (const_beton > Ressources.beton) {
                                    const_batiment = false;
                                    manque_beton = true;
                                }

                                const_bois = Math.round(batimentObject.atelier_verre.CONST_ATELIER_VERRE_BOIS * nombre * eval(`gouvernementObject.${Pays.ideologie}.construction`));
                                if (const_bois > Ressources.bois) {
                                    const_batiment = false;
                                    manque_bois = true;
                                }
                                break;

                            case 'Carriere de sable':
                                need_acier = true;

                                const_T_libre = batimentObject.carriere_sable.SURFACE_CARRIERE_SABLE * nombre;
                                if (const_T_libre > Territoire.T_libre) {
                                    const_batiment = false;
                                    manque_T_libre = true;
                                }

                                const_acier = Math.round(batimentObject.carriere_sable.CONST_CARRIERE_SABLE_ACIER * nombre * eval(`gouvernementObject.${Pays.ideologie}.construction`));
                                if (const_acier > Ressources.acier) {
                                    const_batiment = false;
                                    manque_acier = true;
                                }
                                break;

                            case 'Centrale biomasse':
                                need_acier = true;
                                need_beton = true;

                                const_T_libre = batimentObject.centrale_biomasse.SURFACE_CENTRALE_BIOMASSE * nombre;
                                if (const_T_libre > Territoire.T_libre) {
                                    const_batiment = false;
                                    manque_T_libre = true;
                                }

                                const_acier = Math.round(batimentObject.centrale_biomasse.CONST_CENTRALE_BIOMASSE_ACIER * nombre * eval(`gouvernementObject.${Pays.ideologie}.construction`));
                                if (const_acier > Ressources.acier) {
                                    const_batiment = false;
                                    manque_acier = true;
                                }

                                const_beton = Math.round(batimentObject.centrale_biomasse.CONST_CENTRALE_BIOMASSE_BETON * nombre * eval(`gouvernementObject.${Pays.ideologie}.construction`));
                                if (const_beton > Ressources.beton) {
                                    const_batiment = false;
                                    manque_beton = true;
                                }
                                break;

                            case 'Centrale au charbon':
                                need_acier = true;
                                need_beton = true;

                                const_T_libre = batimentObject.centrale_charbon.SURFACE_CENTRALE_CHARBON * nombre;
                                if (const_T_libre > Territoire.T_libre) {
                                    const_batiment = false;
                                    manque_T_libre = true;
                                }

                                const_acier = Math.round(batimentObject.centrale_charbon.CONST_CENTRALE_CHARBON_ACIER * nombre * eval(`gouvernementObject.${Pays.ideologie}.construction`));
                                if (const_acier > Ressources.acier) {
                                    const_batiment = false;
                                    manque_acier = true;
                                }

                                const_beton = Math.round(batimentObject.centrale_charbon.CONST_CENTRALE_CHARBON_BETON * nombre * eval(`gouvernementObject.${Pays.ideologie}.construction`));
                                if (const_beton > Ressources.beton) {
                                    const_batiment = false;
                                    manque_beton = true;
                                }
                                break;

                            case 'Centrale au fioul':
                                need_acier = true;
                                need_beton = true;

                                const_T_libre = batimentObject.centrale_fioul.SURFACE_CENTRALE_FIOUL * nombre;
                                if (const_T_libre > Territoire.T_libre) {
                                    const_batiment = false;
                                    manque_T_libre = true;
                                }

                                const_acier = Math.round(batimentObject.centrale_fioul.CONST_CENTRALE_FIOUL_ACIER * nombre * eval(`gouvernementObject.${Pays.ideologie}.construction`));
                                if (const_acier > Ressources.acier) {
                                    const_batiment = false;
                                    manque_acier = true;
                                }

                                const_beton = Math.round(batimentObject.centrale_fioul.CONST_CENTRALE_FIOUL_BETON * nombre * eval(`gouvernementObject.${Pays.ideologie}.construction`));
                                if (const_beton > Ressources.beton) {
                                    const_batiment = false;
                                    manque_beton = true;
                                }
                                break;

                            case 'Champ':
                                need_acier = true;
                                need_beton = true;
                                need_bois = true;

                                const_T_libre = batimentObject.champ.SURFACE_CHAMP * nombre;
                                if (const_T_libre > Territoire.T_libre) {
                                    const_batiment = false;
                                    manque_T_libre = true;
                                }

                                const_acier = Math.round(batimentObject.champ.CONST_CHAMP_ACIER * nombre * eval(`gouvernementObject.${Pays.ideologie}.construction`));
                                if (const_acier > Ressources.acier) {
                                    const_batiment = false;
                                    manque_acier = true;
                                }

                                const_beton = Math.round(batimentObject.champ.CONST_CHAMP_BETON * nombre * eval(`gouvernementObject.${Pays.ideologie}.construction`));
                                if (const_beton > Ressources.beton) {
                                    const_batiment = false;
                                    manque_beton = true;
                                }

                                const_bois = Math.round(batimentObject.champ.CONST_CHAMP_BOIS * nombre * eval(`gouvernementObject.${Pays.ideologie}.construction`));
                                if (const_bois > Ressources.bois) {
                                    const_batiment = false;
                                    manque_bois = true;
                                }
                                break;

                            case 'Champ d\'eoliennes':
                                need_beton = true;
                                need_eolienne = true;

                                const_T_libre = batimentObject.eolienne.SURFACE_EOLIENNE * nombre;
                                if (const_T_libre > Territoire.T_libre) {
                                    const_batiment = false;
                                    manque_T_libre = true;
                                }

                                const_beton = Math.round(batimentObject.eolienne.CONST_EOLIENNE_BETON * nombre * eval(`gouvernementObject.${Pays.ideologie}.construction`));
                                if (const_beton > Ressources.beton) {
                                    const_batiment = false;
                                    manque_beton = true;
                                }

                                const_eolienne = Math.round(batimentObject.eolienne.CONST_EOLIENNE_EOLIENNE * nombre);
                                if (const_eolienne > Ressources.eolienne) {
                                    const_batiment = false;
                                    manque_eolienne = true;
                                }
                                break;

                            case 'Cimenterie':
                                need_acier = true;
                                need_beton = true;

                                const_T_libre = batimentObject.cimenterie.SURFACE_CIMENTERIE * nombre;
                                if (const_T_libre > Territoire.T_libre) {
                                    const_batiment = false;
                                    manque_T_libre = true;
                                }

                                const_acier = Math.round(batimentObject.cimenterie.CONST_CIMENTERIE_ACIER * nombre * eval(`gouvernementObject.${Pays.ideologie}.construction`));
                                if (const_acier > Ressources.acier) {
                                    const_batiment = false;
                                    manque_acier = true;
                                }

                                const_beton = Math.round(batimentObject.cimenterie.CONST_CIMENTERIE_BETON * nombre * eval(`gouvernementObject.${Pays.ideologie}.construction`));
                                if (const_beton > Ressources.beton) {
                                    const_batiment = false;
                                    manque_beton = true;
                                }
                                break;

                            case 'Derrick':
                                need_acier = true;
                                need_beton = true;

                                const_T_libre = batimentObject.derrick.SURFACE_DERRICK * nombre;
                                if (const_T_libre > Territoire.T_libre) {
                                    const_batiment = false;
                                    manque_T_libre = true;
                                }

                                const_acier = Math.round(batimentObject.derrick.CONST_DERRICK_ACIER * nombre * eval(`gouvernementObject.${Pays.ideologie}.construction`));
                                if (const_acier > Ressources.acier) {
                                    const_batiment = false;
                                    manque_acier = true;
                                }

                                const_beton = Math.round(batimentObject.derrick.CONST_DERRICK_BETON * nombre * eval(`gouvernementObject.${Pays.ideologie}.construction`));
                                if (const_beton > Ressources.beton) {
                                    const_batiment = false;
                                    manque_beton = true;
                                }
                                break;

                            case 'Mine de charbon':
                                need_acier = true;
                                need_beton = true;

                                const_T_libre = batimentObject.mine_charbon.SURFACE_MINE_CHARBON * nombre;
                                if (const_T_libre > Territoire.T_libre) {
                                    const_batiment = false;
                                    manque_T_libre = true;
                                }

                                const_acier = Math.round(batimentObject.mine_charbon.CONST_MINE_CHARBON_ACIER * nombre * eval(`gouvernementObject.${Pays.ideologie}.construction`));
                                if (const_acier > Ressources.acier) {
                                    const_batiment = false;
                                    manque_acier = true;
                                }

                                const_beton = Math.round(batimentObject.mine_charbon.CONST_MINE_CHARBON_BETON * nombre * eval(`gouvernementObject.${Pays.ideologie}.construction`));
                                if (const_beton > Ressources.beton) {
                                    const_batiment = false;
                                    manque_beton = true;
                                }
                                break;

                            case 'Mine de metaux':
                                need_acier = true;

                                const_T_libre = batimentObject.mine_metaux.SURFACE_MINE_METAUX * nombre;
                                if (const_T_libre > Territoire.T_libre) {
                                    const_batiment = false;
                                    manque_T_libre = true;
                                }

                                const_acier = Math.round(batimentObject.mine_metaux.CONST_MINE_METAUX_ACIER * nombre * eval(`gouvernementObject.${Pays.ideologie}.construction`));
                                if (const_acier > Ressources.acier) {
                                    const_batiment = false;
                                    manque_acier = true;
                                }
                                break;

                            case 'Station de pompage':
                                need_acier = true;
                                need_beton = true;

                                const_T_libre = batimentObject.station_pompage.SURFACE_STATION_POMPAGE * nombre;
                                if (const_T_libre > Territoire.T_libre) {
                                    const_batiment = false;
                                    manque_T_libre = true;
                                }

                                const_acier = Math.round(batimentObject.station_pompage.CONST_STATION_POMPAGE_ACIER * nombre * eval(`gouvernementObject.${Pays.ideologie}.construction`));
                                if (const_acier > Ressources.acier) {
                                    const_batiment = false;
                                    manque_acier = true;
                                }

                                const_beton = Math.round(batimentObject.station_pompage.CONST_STATION_POMPAGE_BETON * nombre * eval(`gouvernementObject.${Pays.ideologie}.construction`));
                                if (const_beton > Ressources.beton) {
                                    const_batiment = false;
                                    manque_beton = true;
                                }
                                break;

                            case 'Quartier':
                                need_acier = true;
                                need_beton = true;
                                need_bois = true;
                                need_verre = true;

                                const_T_libre = batimentObject.quartier.SURFACE_QUARTIER * nombre;
                                if (const_T_libre > Territoire.T_libre) {
                                    const_batiment = false;
                                    manque_T_libre = true;
                                }

                                const_acier = Math.round(batimentObject.quartier.CONST_QUARTIER_ACIER * nombre * eval(`gouvernementObject.${Pays.ideologie}.construction`));
                                if (const_acier > Ressources.acier) {
                                    const_batiment = false;
                                    manque_acier = true;
                                }

                                const_beton = Math.round(batimentObject.quartier.CONST_QUARTIER_BETON * nombre * eval(`gouvernementObject.${Pays.ideologie}.construction`));
                                if (const_beton > Ressources.beton) {
                                    const_batiment = false;
                                    manque_beton = true;
                                }

                                const_bois = Math.round(batimentObject.quartier.CONST_QUARTIER_BOIS * nombre * eval(`gouvernementObject.${Pays.ideologie}.construction`));
                                if (const_bois > Ressources.bois) {
                                    const_batiment = false;
                                    manque_bois = true;
                                }

                                const_verre = Math.round(batimentObject.quartier.CONST_QUARTIER_VERRE * nombre * eval(`gouvernementObject.${Pays.ideologie}.construction`));
                                if (const_verre > Ressources.verre) {
                                    const_batiment = false;
                                    manque_verre = true;
                                }
                                break;

                            case 'Raffinerie':
                                need_acier = true;
                                need_beton = true;

                                const_T_libre = batimentObject.raffinerie.SURFACE_RAFFINERIE * nombre;
                                if (const_T_libre > Territoire.T_libre) {
                                    const_batiment = false;
                                    manque_T_libre = true;
                                }

                                const_acier = Math.round(batimentObject.raffinerie.CONST_RAFFINERIE_ACIER * nombre * eval(`gouvernementObject.${Pays.ideologie}.construction`));
                                if (const_acier > Ressources.acier) {
                                    const_batiment = false;
                                    manque_acier = true;
                                }

                                const_beton = Math.round(batimentObject.raffinerie.CONST_RAFFINERIE_BETON * nombre * eval(`gouvernementObject.${Pays.ideologie}.construction`));
                                if (const_beton > Ressources.beton) {
                                    const_batiment = false;
                                    manque_beton = true;
                                }
                                break;

                            case 'Scierie':
                                need_acier = true;
                                need_beton = true;
                                need_bois = true;

                                const_T_libre = batimentObject.scierie.SURFACE_SCIERIE * nombre;
                                if (const_T_libre > Territoire.T_libre) {
                                    const_batiment = false;
                                    manque_T_libre = true;
                                }

                                const_acier = Math.round(batimentObject.scierie.CONST_SCIERIE_ACIER * nombre * eval(`gouvernementObject.${Pays.ideologie}.construction`));
                                if (const_acier > Ressources.acier) {
                                    const_batiment = false;
                                    manque_acier = true;
                                }

                                const_beton = Math.round(batimentObject.scierie.CONST_SCIERIE_BETON * nombre * eval(`gouvernementObject.${Pays.ideologie}.construction`));
                                if (const_beton > Ressources.beton) {
                                    const_batiment = false;
                                    manque_beton = true;
                                }

                                const_bois = Math.round(batimentObject.scierie.CONST_SCIERIE_BOIS * nombre * eval(`gouvernementObject.${Pays.ideologie}.construction`));
                                if (const_bois > Ressources.bois) {
                                    const_batiment = false;
                                    manque_bois = true;
                                }
                                break;

                            case 'Usine civile':
                                need_acier = true;
                                need_beton = true;
                                need_bois = true;

                                const_T_libre = batimentObject.usine_civile.SURFACE_USINE_CIVILE * nombre;
                                if (const_T_libre > Territoire.T_libre) {
                                    const_batiment = false;
                                    manque_T_libre = true;
                                }

                                const_acier = Math.round(batimentObject.usine_civile.CONST_USINE_CIVILE_ACIER * nombre * eval(`gouvernementObject.${Pays.ideologie}.construction`));
                                if (const_acier > Ressources.acier) {
                                    const_batiment = false;
                                    manque_acier = true;
                                }

                                const_beton = Math.round(batimentObject.usine_civile.CONST_USINE_CIVILE_BETON * nombre * eval(`gouvernementObject.${Pays.ideologie}.construction`));
                                if (const_beton > Ressources.beton) {
                                    const_batiment = false;
                                    manque_beton = true;
                                }

                                const_bois = Math.round(batimentObject.usine_civile.CONST_USINE_CIVILE_BOIS * nombre * eval(`gouvernementObject.${Pays.ideologie}.construction`));
                                if (const_bois > Ressources.bois) {
                                    const_batiment = false;
                                    manque_bois = true;
                                }
                                break;
                        }

                        const fields = [];
                        if (manque_T_libre === true) {
                            fields.push({
                                name: `> ⛔ Manque de terrain libre ⛔ :`,
                                value: codeBlock(`• Terrain : ${Territoire.T_libre.toLocaleString('en-US')}/${const_T_libre.toLocaleString('en-US')}\n`) + `\u200B`
                            })
                        } else {
                            fields.push({
                                name: `> ✅ Terrain libre suffisant ✅ :`,
                                value: codeBlock(`• Terrain : ${const_T_libre.toLocaleString('en-US')}/${const_T_libre.toLocaleString('en-US')}\n`) + `\u200B`
                            })
                        }

                        if (need_acier === true) {
                            if (manque_acier === true) {
                                fields.push({
                                    name: `> ⛔ Manque d'acier ⛔ :`,
                                    value: codeBlock(`• Acier : ${Ressources.acier.toLocaleString('en-US')}/${const_acier.toLocaleString('en-US')}\n`) + `\u200B`
                                })
                            } else {
                                fields.push({
                                    name: `> ✅ Acier suffisant ✅ :`,
                                    value: codeBlock(`• Acier : ${const_acier.toLocaleString('en-US')}/${const_acier.toLocaleString('en-US')}\n`) + `\u200B`
                                })
                            }
                        }

                        if (need_beton === true) {
                            if (manque_beton === true) {
                                fields.push({
                                    name: `> ⛔ Manque de béton ⛔ :`,
                                    value: codeBlock(`• Béton : ${Ressources.beton.toLocaleString('en-US')}/${const_beton.toLocaleString('en-US')}\n`) + `\u200B`
                                })
                            } else {
                                fields.push({
                                    name: `> ✅ Béton suffisant ✅ :`,
                                    value: codeBlock(`• Béton : ${const_beton.toLocaleString('en-US')}/${const_beton.toLocaleString('en-US')}\n`) + `\u200B`
                                })
                            }
                        }

                        if (need_bois === true) {
                            if (manque_bois === true) {
                                fields.push({
                                    name: `> ⛔ Manque de bois ⛔ :`,
                                    value: codeBlock(`• Bois : ${Ressources.bois.toLocaleString('en-US')}/${const_bois.toLocaleString('en-US')}\n`) + `\u200B`
                                })
                            } else {
                                fields.push({
                                    name: `> ✅ Bois suffisant ✅ :`,
                                    value: codeBlock(`• Bois : ${const_bois.toLocaleString('en-US')}/${const_bois.toLocaleString('en-US')}\n`) + `\u200B`
                                })
                            }
                        }

                        if (need_eolienne === true) {
                            if (manque_eolienne === true) {
                                fields.push({
                                    name: `> ⛔ Manque d'éolienne' ⛔ :`,
                                    value: codeBlock(`• Eolienne : ${Ressources.eolienne.toLocaleString('en-US')}/${const_eolienne.toLocaleString('en-US')}\n`) + `\u200B`
                                })
                            } else {
                                fields.push({
                                    name: `> ✅ Eolienne suffisant ✅ :`,
                                    value: codeBlock(`• Eolienne : ${const_eolienne.toLocaleString('en-US')}/${const_eolienne.toLocaleString('en-US')}\n`) + `\u200B`
                                })
                            }
                        }

                        if (need_verre === true) {
                            if (manque_verre === true) {
                                fields.push({
                                    name: `> ⛔ Manque de verre ⛔ :`,
                                    value: codeBlock(`• Verre : ${Ressources.verre.toLocaleString('en-US')}/${const_verre.toLocaleString('en-US')}\n`) + `\u200B`
                                })
                            } else {
                                fields.push({
                                    name: `> ✅ Verre suffisant ✅ :`,
                                    value: codeBlock(`• Verre : ${const_verre.toLocaleString('en-US')}/${const_verre.toLocaleString('en-US')}\n`) + `\u200B`
                                })
                            }
                        }

                        const embed = EmbedBuilder.from(interaction.message.embeds[0]).setFields(fields);

                        if (const_batiment === true) {
                            const row = new ActionRowBuilder()
                                .addComponents(
                                    new ButtonBuilder()
                                        .setLabel(`Construire`)
                                        .setEmoji(`⚒️`)
                                        .setCustomId(`construction-${interaction.user.id}`)
                                        .setStyle(ButtonStyle.Success),
                                )
                                .addComponents(
                                    new ButtonBuilder()
                                        .setLabel(`Refuser`)
                                        .setEmoji(`✋`)
                                        .setCustomId(`refuser-${interaction.user.id}`)
                                        .setStyle(ButtonStyle.Danger),
                                )
                                .addComponents(
                                    new ButtonBuilder()
                                        .setLabel(`Actualiser`)
                                        .setEmoji(`🔁`)
                                        .setCustomId(`construct-reload-${interaction.user.id}`)
                                        .setStyle(ButtonStyle.Primary),
                                )

                            interaction.deferUpdate()
                            interaction.message.edit({embeds: [embed], components: [row]})
                        } else {
                            const row = new ActionRowBuilder()
                                .addComponents(
                                    new ButtonBuilder()
                                        .setLabel(`Construire`)
                                        .setEmoji(`⚒️`)
                                        .setCustomId(`construction`)
                                        .setStyle(ButtonStyle.Danger)
                                        .setDisabled(true)
                                )
                                .addComponents(
                                    new ButtonBuilder()
                                        .setLabel(`Refuser`)
                                        .setEmoji(`✋`)
                                        .setCustomId(`refuser-${interaction.user.id}`)
                                        .setStyle(ButtonStyle.Danger),
                                )
                                .addComponents(
                                    new ButtonBuilder()
                                        .setLabel(`Actualiser`)
                                        .setEmoji(`🔁`)
                                        .setCustomId(`construct-reload-${interaction.user.id}`)
                                        .setStyle(ButtonStyle.Primary),
                                )

                            interaction.deferUpdate()
                            interaction.message.edit({embeds: [embed], components: [row]})
                        }
                    });

                } else {
                    reponse = codeBlock('ansi', `\u001b[0m\u001b[1;31mVous n'êtes pas l'auteur de cette commande`);
                    interaction.reply({content: reponse, ephemeral: true});
                }
                //endregion
            } else if (interaction.customId.includes('assembly-reload') === true) {
                //region Actualiser assemblage
                id_joueur = interaction.customId.slice(16);
                if (id_joueur === interaction.member.id) {

                    sql = `
                        SELECT * FROM pays WHERE id_joueur=${interaction.member.id};
                        SELECT * FROM ressources WHERE id_joueur=${interaction.member.id}
                    `;
                    connection.query(sql, async (err, results) => {if (err) {throw err;}
                        const Pays = results[0][0];
                        const Ressources = results[1][0];

                        let title = interaction.message.embeds[0].title;
                        title = title.substring(14, title.length - 1);
                        let nombre = title.slice(0, title.indexOf(" ")).replace(/,/g, "");
                        const batiment = title.slice(title.indexOf(" ") + 1);

                        let manque_acier;
                        let const_acier;
                        let manque_metaux;
                        let const_metaux;
                        let manque_verre;
                        let const_verre;

                        let const_batiment = true;
                        let need_acier = false;
                        let need_metaux = false;
                        let need_verre = false;


                        switch (batiment) {
                            case 'Avion':
                                //region Avion
                                need_acier = true;
                                need_metaux = true;

                                const_acier = Math.round(assemblageObject.avion.CONST_AVION_ACIER * nombre);
                                if (const_acier > Ressources.acier) {
                                    const_batiment = false;
                                    manque_acier = true;
                                }
                                const_metaux = Math.round(assemblageObject.avion.CONST_AVION_METAUX * nombre);
                                if (const_metaux > Ressources.metaux) {
                                    const_batiment = false;
                                    manque_metaux = true;
                                }
                                //endregion
                                break;
                            case 'Eolienne':
                                //region Eolienne
                                need_acier = true;
                                need_verre = true;

                                const_acier = Math.round(assemblageObject.eolienne.CONST_EOLIENNE_ACIER * nombre);
                                if (const_acier > Ressources.acier) {
                                    const_batiment = false;
                                    manque_acier = true;
                                }
                                const_verre = Math.round(assemblageObject.eolienne.CONST_EOLIENNE_VERRE * nombre);
                                if (const_verre > Ressources.verre) {
                                    const_batiment = false;
                                    manque_verre = true;
                                }
                                //endregion
                                break;
                            case 'Equipement de support':
                                //region Equipement de support
                                need_metaux = true;

                                const_metaux = Math.round(assemblageObject.equipement_support.CONST_EQUIPEMENT_SUPPORT_METAUX * nombre);
                                if (const_metaux > Ressources.metaux) {
                                    const_batiment = false;
                                    manque_metaux = true;
                                }
                                //endregion
                                break;
                            case 'Matériel d\'infanterie':
                                //region Matériel d'infanterie
                                need_metaux = true;

                                const_metaux = Math.round(assemblageObject.materiel_infanterie.CONST_MATERIEL_INFANTERIE_METAUX * nombre);
                                if (const_metaux > Ressources.metaux) {
                                    const_batiment = false;
                                    manque_metaux = true;
                                }
                                //endregion
                                break;
                            case 'Véhicule':
                                //region Véhicule
                                need_acier = true;
                                need_metaux = true;

                                const_acier = Math.round(assemblageObject.vehicule.CONST_VEHICULE_ACIER * nombre);
                                if (const_acier > Ressources.acier) {
                                    const_batiment = false;
                                    manque_acier = true;
                                }
                                const_metaux = Math.round(assemblageObject.vehicule.CONST_VEHICULE_METAUX * nombre);
                                if (const_metaux > Ressources.metaux) {
                                    const_batiment = false;
                                    manque_metaux = true;
                                }
                                //endregion
                                break;
                        }

                        const fields = [];
                        if (need_acier === true) {
                            if (manque_acier === true) {
                                fields.push({
                                    name: `> ⛔ Manque d'acier ⛔ :`,
                                    value: codeBlock(`• Acier : ${Ressources.acier.toLocaleString('en-US')}/${const_acier.toLocaleString('en-US')}\n`) + `\u200B`
                                })
                            } else {
                                fields.push({
                                    name: `> ✅ Acier suffisant ✅ :`,
                                    value: codeBlock(`• Acier : ${const_acier.toLocaleString('en-US')}/${const_acier.toLocaleString('en-US')}\n`) + `\u200B`
                                })
                            }
                        }

                        if (need_metaux === true) {
                            if (manque_metaux === true) {
                                fields.push({
                                    name: `> ⛔ Manque de métaux ⛔ :`,
                                    value: codeBlock(`• Métaux : ${Ressources.metaux.toLocaleString('en-US')}/${const_metaux.toLocaleString('en-US')}\n`) + `\u200B`
                                })
                            } else {
                                fields.push({
                                    name: `> ✅ Métaux suffisant ✅ :`,
                                    value: codeBlock(`• Métaux : ${const_metaux.toLocaleString('en-US')}/${const_metaux.toLocaleString('en-US')}\n`) + `\u200B`
                                })
                            }
                        }

                        if (need_verre === true) {
                            if (manque_verre === true) {
                                fields.push({
                                    name: `> ⛔ Manque de verre ⛔ :`,
                                    value: codeBlock(`• Verre : ${Ressources.verre.toLocaleString('en-US')}/${const_verre.toLocaleString('en-US')}\n`) + `\u200B`
                                })
                            } else {
                                fields.push({
                                    name: `> ✅ Verre suffisant ✅ :`,
                                    value: codeBlock(`• Verre : ${const_verre.toLocaleString('en-US')}/${const_verre.toLocaleString('en-US')}\n`) + `\u200B`
                                })
                            }
                        }

                        const embed = EmbedBuilder.from(interaction.message.embeds[0]).setFields(fields);

                        if (const_batiment === true) {
                            const row = new ActionRowBuilder()
                                .addComponents(
                                    new ButtonBuilder()
                                        .setLabel(`Assembler`)
                                        .setEmoji(`🪛`)
                                        .setCustomId(`assemblage-${interaction.user.id}`)
                                        .setStyle(ButtonStyle.Success),
                                )
                                .addComponents(
                                    new ButtonBuilder()
                                        .setLabel(`Refuser`)
                                        .setEmoji(`✋`)
                                        .setCustomId(`refuser-${interaction.user.id}`)
                                        .setStyle(ButtonStyle.Danger),
                                )
                                .addComponents(
                                    new ButtonBuilder()
                                        .setLabel(`Actualiser`)
                                        .setEmoji(`🔁`)
                                        .setCustomId(`assembly-reload-${interaction.user.id}`)
                                        .setStyle(ButtonStyle.Primary),
                                )

                            interaction.deferUpdate()
                            interaction.message.edit({embeds: [embed], components: [row]})
                        } else {
                            const row = new ActionRowBuilder()
                                .addComponents(
                                    new ButtonBuilder()
                                        .setLabel(`Assembler`)
                                        .setEmoji(`🪛`)
                                        .setCustomId(`assemblage`)
                                        .setStyle(ButtonStyle.Danger)
                                        .setDisabled(true)
                                )
                                .addComponents(
                                    new ButtonBuilder()
                                        .setLabel(`Refuser`)
                                        .setEmoji(`✋`)
                                        .setCustomId(`refuser-${interaction.user.id}`)
                                        .setStyle(ButtonStyle.Danger),
                                )
                                .addComponents(
                                    new ButtonBuilder()
                                        .setLabel(`Actualiser`)
                                        .setEmoji(`🔁`)
                                        .setCustomId(`assembly-reload-${interaction.user.id}`)
                                        .setStyle(ButtonStyle.Primary),
                                )

                            interaction.deferUpdate()
                            interaction.message.edit({embeds: [embed], components: [row]})
                        }
                    });

                } else {
                    reponse = codeBlock('ansi', `\u001b[0m\u001b[1;31mVous n'êtes pas l'auteur de cette commande`);
                    interaction.reply({content: reponse, ephemeral: true});
                }
                //endregion
            } else if (interaction.customId.includes('train-reload') === true) {
                //region Actualiser formation
                id_joueur = interaction.customId.slice(13);
                if (id_joueur === interaction.member.id) {

                    sql = `
                        SELECT * FROM armee WHERE id_joueur='${interaction.member.id}';
                        SELECT * FROM pays WHERE id_joueur='${interaction.member.id}';
                        SELECT * FROM population WHERE id_joueur='${interaction.member.id}'
                    `;
                    connection.query(sql, async (err, results) => {if (err) {throw err;}
                        const Armee = results[0][0];
                        const Pays = results[1][0];
                        const Population = results[2][0];
                        const hommeArmee =
                            Armee.unite * eval(`armeeObject.${Armee.strategie}.aviation`) * eval(`armeeObject.aviation.homme`) +
                            Armee.unite * eval(`armeeObject.${Armee.strategie}.infanterie`) * eval(`armeeObject.infanterie.homme`) +
                            Armee.unite * eval(`armeeObject.${Armee.strategie}.mecanise`) * eval(`armeeObject.mecanise.homme`) +
                            Armee.unite * eval(`armeeObject.${Armee.strategie}.support`) * eval(`armeeObject.support.homme`) +
                            (Armee.aviation * armeeObject.aviation.homme) +
                            (Armee.infanterie * armeeObject.infanterie.homme) +
                            (Armee.mecanise * armeeObject.mecanise.homme) +
                            (Armee.support * armeeObject.support.homme);

                        let manque_homme;
                        let const_homme;
                        let manque_avion;
                        let const_avion;
                        let manque_equipement_support;
                        let const_equipement_support;
                        let manque_materiel_infanterie;
                        let const_materiel_infanterie;
                        let manque_vehicule;
                        let const_vehicule;

                        let const_unite = true;
                        let need_homme = false;
                        let need_avion = false;
                        let need_equipement_support = false;
                        let need_materiel_infanterie = false;
                        let need_vehicule = false;

                        switch (uniteChoisi) {
                            case 'Aviation':
                                //region Aviation
                                need_homme = true;
                                need_avion = true;
                                need_equipement_support = true;
                                need_materiel_infanterie = true;
                                need_vehicule = true;

                                const_homme = armeeObject.aviation.homme * nombre;
                                if (const_homme > (Population.jeune + Population.adulte - hommeArmee)) {
                                    const_unite = false;
                                    manque_homme = true;
                                }
                                const_avion = armeeObject.aviation.avion * nombre;
                                if (const_avion > Armee.avion) {
                                    const_unite = false;
                                    manque_avion = true;
                                }
                                const_equipement_support = armeeObject.aviation.equipement_support * nombre;
                                if (const_equipement_support > Armee.equipement_support) {
                                    const_unite = false;
                                    manque_equipement_support = true;
                                }
                                const_materiel_infanterie = armeeObject.aviation.materiel_infanterie * nombre;
                                if (const_materiel_infanterie > Armee.materiel_infanterie) {
                                    const_unite = false;
                                    manque_materiel_infanterie = true;
                                }
                                const_vehicule = armeeObject.aviation.vehicule * nombre;
                                if (const_vehicule > Armee.vehicule) {
                                    const_unite = false;
                                    manque_vehicule = true;
                                }
                                //endregion
                                break;
                            case 'Infanterie':
                                //region Infanterie
                                need_homme = true;
                                need_equipement_support = true;
                                need_materiel_infanterie = true;
                                need_vehicule = true;

                                const_homme = armeeObject.infanterie.homme * nombre;
                                if (const_homme > (Population.jeune + Population.adulte - hommeArmee)) {
                                    const_unite = false;
                                    manque_homme = true;
                                }
                                const_equipement_support = armeeObject.infanterie.equipement_support * nombre;
                                if (const_equipement_support > Armee.equipement_support) {
                                    const_unite = false;
                                    manque_equipement_support = true;
                                }
                                const_materiel_infanterie = armeeObject.infanterie.materiel_infanterie * nombre;
                                if (const_materiel_infanterie > Armee.materiel_infanterie) {
                                    const_unite = false;
                                    manque_materiel_infanterie = true;
                                }
                                const_vehicule = armeeObject.infanterie.vehicule * nombre;
                                if (const_vehicule > Armee.vehicule) {
                                    const_unite = false;
                                    manque_vehicule = true;
                                }
                                //endregion
                                break;
                            case 'Mécanisé':
                                //region Mecanisé
                                need_homme = true;
                                need_equipement_support = true;
                                need_materiel_infanterie = true;
                                need_vehicule = true;

                                const_homme = armeeObject.mecanise.homme * nombre;
                                if (const_homme > (Population.jeune + Population.adulte - hommeArmee)) {
                                    const_unite = false;
                                    manque_homme = true;
                                }
                                const_equipement_support = armeeObject.mecanise.equipement_support * nombre;
                                if (const_equipement_support > Armee.equipement_support) {
                                    const_unite = false;
                                    manque_equipement_support = true;
                                }
                                const_materiel_infanterie = armeeObject.mecanise.materiel_infanterie * nombre;
                                if (const_materiel_infanterie > Armee.materiel_infanterie) {
                                    const_unite = false;
                                    manque_materiel_infanterie = true;
                                }
                                const_vehicule = armeeObject.mecanise.vehicule * nombre;
                                if (const_vehicule > Armee.vehicule) {
                                    const_unite = false;
                                    manque_vehicule = true;
                                }
                                //endregion
                                break;
                            case 'Support':
                                //region Support
                                need_homme = true;
                                need_avion = true;
                                need_equipement_support = true;
                                need_materiel_infanterie = true;
                                need_vehicule = true;

                                const_homme = armeeObject.support.homme * nombre;
                                if (const_homme > (Population.jeune + Population.adulte - hommeArmee)) {
                                    const_unite = false;
                                    manque_homme = true;
                                }
                                const_avion = armeeObject.support.avion * nombre;
                                if (const_avion > Armee.avion) {
                                    const_unite = false;
                                    manque_avion = true;
                                }
                                const_equipement_support = armeeObject.support.equipement_support * nombre;
                                if (const_equipement_support > Armee.equipement_support) {
                                    const_unite = false;
                                    manque_equipement_support = true;
                                }
                                const_materiel_infanterie = armeeObject.support.materiel_infanterie * nombre;
                                if (const_materiel_infanterie > Armee.materiel_infanterie) {
                                    const_unite = false;
                                    manque_materiel_infanterie = true;
                                }
                                const_vehicule = armeeObject.support.vehicule * nombre;
                                if (const_vehicule > Armee.vehicule) {
                                    const_unite = false;
                                    manque_vehicule = true;
                                }
                                //endregion
                                break;
                        }

                        const fields = [];

                        if (need_homme === true) {
                            if (manque_homme === true) {
                                fields.push({
                                    name: `> ⛔ Manque d'hommes ⛔ :`,
                                    value: codeBlock(`• Homme : ${(Population.jeune + Population.adulte - hommeArmee).toLocaleString('en-US')}/${const_homme.toLocaleString('en-US')}\n`) + `\u200B`
                                })
                            } else {
                                fields.push({
                                    name: `> ✅ Hommes suffisant ✅ :`,
                                    value: codeBlock(`• Homme : ${const_homme.toLocaleString('en-US')}/${const_homme.toLocaleString('en-US')}\n`) + `\u200B`
                                })
                            }
                        }

                        if (need_avion === true) {
                            if (manque_avion === true) {
                                fields.push({
                                    name: `> ⛔ Manque d'avion ⛔ :`,
                                    value: codeBlock(`• Avion : ${Armee.avion.toLocaleString('en-US')}/${const_avion.toLocaleString('en-US')}\n`) + `\u200B`
                                })
                            } else {
                                fields.push({
                                    name: `> ✅ Avion suffisant ✅ :`,
                                    value: codeBlock(`• Avion : ${const_avion.toLocaleString('en-US')}/${const_avion.toLocaleString('en-US')}\n`) + `\u200B`
                                })
                            }
                        }

                        if (need_equipement_support === true) {
                            if (manque_equipement_support === true) {
                                fields.push({
                                    name: `> ⛔ Manque d'équipement de support ⛔ :`,
                                    value: codeBlock(`• Equipement de support : ${Armee.equipement_support.toLocaleString('en-US')}/${const_equipement_support.toLocaleString('en-US')}\n`) + `\u200B`
                                })
                            } else {
                                fields.push({
                                    name: `> ✅ Equipement de support suffisant ✅ :`,
                                    value: codeBlock(`• Equipement de support : ${const_equipement_support.toLocaleString('en-US')}/${const_equipement_support.toLocaleString('en-US')}\n`) + `\u200B`
                                })
                            }
                        }

                        if (need_materiel_infanterie === true) {
                            if (manque_materiel_infanterie === true) {
                                fields.push({
                                    name: `> ⛔ Manque de materiel d'infanterie ⛔ :`,
                                    value: codeBlock(`• Materiel d'infanterie : ${Armee.materiel_infanterie.toLocaleString('en-US')}/${const_materiel_infanterie.toLocaleString('en-US')}\n`) + `\u200B`
                                })
                            } else {
                                fields.push({
                                    name: `> ✅ Materiel d'infanterie suffisant ✅ :`,
                                    value: codeBlock(`• Materiel d'infanterie : ${const_materiel_infanterie.toLocaleString('en-US')}/${const_materiel_infanterie.toLocaleString('en-US')}\n`) + `\u200B`
                                })
                            }
                        }

                        if (need_vehicule === true) {
                            if (manque_vehicule === true) {
                                fields.push({
                                    name: `> ⛔ Manque de véhicule ⛔ :`,
                                    value: codeBlock(`• Véhicule : ${Armee.vehicule.toLocaleString('en-US')}/${const_vehicule.toLocaleString('en-US')}\n`) + `\u200B`
                                })
                            } else {
                                fields.push({
                                    name: `> ✅ Véhicule suffisant ✅ :`,
                                    value: codeBlock(`• Véhicule : ${const_vehicule.toLocaleString('en-US')}/${const_vehicule.toLocaleString('en-US')}\n`) + `\u200B`
                                })
                            }
                        }

                        const embed = EmbedBuilder.from(interaction.message.embeds[0]).setFields(fields);

                        if (const_unite === true) {
                            const row = new ActionRowBuilder()
                                .addComponents(
                                    new ButtonBuilder()
                                        .setLabel(`Former`)
                                        .setEmoji(`🪖`)
                                        .setCustomId(`former-${interaction.user.id}`)
                                        .setStyle(ButtonStyle.Success),
                                )
                                .addComponents(
                                    new ButtonBuilder()
                                        .setLabel(`Refuser`)
                                        .setEmoji(`✋`)
                                        .setCustomId(`refuser-${interaction.user.id}`)
                                        .setStyle(ButtonStyle.Danger),
                                )
                                .addComponents(
                                    new ButtonBuilder()
                                        .setLabel(`Actualiser`)
                                        .setEmoji(`🔁`)
                                        .setCustomId(`train-reload-${interaction.user.id}`)
                                        .setStyle(ButtonStyle.Primary),
                                )

                            interaction.deferUpdate()
                            interaction.message.edit({embeds: [embed], components: [row]})
                        } else {
                            const row = new ActionRowBuilder()
                                .addComponents(
                                    new ButtonBuilder()
                                        .setLabel(`Former`)
                                        .setEmoji(`🪖`)
                                        .setCustomId(`former-${interaction.user.id}`)
                                        .setStyle(ButtonStyle.Danger)
                                        .setDisabled(true)
                                )
                                .addComponents(
                                    new ButtonBuilder()
                                        .setLabel(`Refuser`)
                                        .setEmoji(`✋`)
                                        .setCustomId(`refuser-${interaction.user.id}`)
                                        .setStyle(ButtonStyle.Danger),
                                )
                                .addComponents(
                                    new ButtonBuilder()
                                        .setLabel(`Actualiser`)
                                        .setEmoji(`🔁`)
                                        .setCustomId(`train-reload-${interaction.user.id}`)
                                        .setStyle(ButtonStyle.Primary),
                                )

                            interaction.deferUpdate()
                            interaction.message.edit({embeds: [embed], components: [row]})
                        }
                    });

                } else {
                    reponse = codeBlock('ansi', `\u001b[0m\u001b[1;31mVous n'êtes pas l'auteur de cette commande`);
                    interaction.reply({content: reponse, ephemeral: true});
                }
                //endregion
            } else if (interaction.customId.includes('acheter') === true) {
                //region Acheter

                id_joueur = interaction.customId.slice(8);
                if (id_joueur === interaction.member.id) {
                    reponse = codeBlock('ansi', `\u001b[0;0m\u001b[1;31mVous ne pouvez pas acheter votre propre offre`);
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

                    connection.query(sql, async (err) => {
                        if (err) {
                            throw err;
                        }
                        let res;
                        let emoji = ''
                        const pourcentage = fields[2].value.slice(fields[2].value.indexOf("(") - 1, fields[2].value.indexOf(")") + 1);

                        switch (ressource) {
                            case 'Acier':
                                res = `acier`;
                                emoji = '<:acier:1075776411329122304>';
                                break;
                            case 'Béton':
                                res = `beton`;
                                emoji = '<:beton:1075776342227943526>';
                                break;
                            case 'Biens de consommation':
                                res = `bc`;
                                emoji = '💻';
                                break;
                            case 'Bois':
                                res = `bois`;
                                emoji = '🪵';
                                break;
                            case 'Carburant':
                                res = `carburant`;
                                emoji = '⛽';
                                break;
                            case 'Charbon':
                                res = `charbon`;
                                emoji = '<:charbon:1075776385517375638>';
                                break;
                            case 'Eau':
                                res = `eau`;
                                emoji = '💧';
                                break;
                            case 'Eolienne':
                                res = `eolienne`;
                                emoji = '<:windmill:1108767955442991225>';
                                break;
                            case 'Métaux':
                                res = `metaux`;
                                emoji = '🪨';
                                break;
                            case 'Nourriture':
                                res = `nourriture`;
                                emoji = '🌽';
                                break;
                            case 'Pétrole':
                                res = `petrole`;
                                emoji = '🛢️';
                                break;
                            case 'Sable':
                                res = `sable`;
                                emoji = '<:sable:1075776363782479873>';
                                break;
                            case 'Verre':
                                res = `verre`;
                                emoji = '🪟';
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
                                    fields: [
                                        {
                                            name: `> 📥 Vendeur :`,
                                            value: `<@${id_joueur}>`
                                        },
                                        {
                                            name: `> ${emoji} Ressource :`,
                                            value: codeBlock(`• ${ressource}`)
                                        },
                                        {
                                            name: `> 📦 Quantité :`,
                                            value: codeBlock(`• ${quantite.toLocaleString('en-US')}`)
                                        },
                                        {
                                            name: `> <:PAZ:1108440620101546105> Prix :`,
                                            value: codeBlock(
                                                `• A l'unité : ${prix_u}${pourcentage}\n` +
                                                `• Au total : ${prix.toLocaleString('en-US')}`)
                                        }
                                    ],
                                    color: interaction.member.displayColor,
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
                                    fields: [
                                        {
                                            name: `> 📤 Acheteur :`,
                                            value: `<@${interaction.user.id}>`
                                        },
                                        {
                                            name: `> ${emoji} Ressource :`,
                                            value: codeBlock(`• ${ressource}`)
                                        },
                                        {
                                            name: `> 📦 Quantité :`,
                                            value: codeBlock(`• ${quantite.toLocaleString('en-US')}`)
                                        },
                                        {
                                            name: `> <:PAZ:1108440620101546105> Prix :`,
                                            value: codeBlock(
                                                `• A l'unité : ${prix_u}${pourcentage}\n` +
                                                `• Au total : ${prix.toLocaleString('en-US')}`)
                                        }
                                    ],
                                    color: interaction.member.displayColor,
                                    timestamp: new Date(),
                                    footer: {
                                        text: `${Pays.devise}`
                                    },
                                };

                                interaction.user.send({embeds: [acheteur]});
                                const id_vendeur = await interaction.guild.members.fetch(id_joueur);
                                id_vendeur.send({embeds: [vendeur]});

                                const thread = await interaction.channel.fetch();
                                await thread.delete();


                                let sql = `SELECT * FROM trade WHERE ressource="${ressource}" ORDER BY id_trade`;
                                connection.query(sql, async (err, results) => {
                                    if (err) {
                                        throw err;
                                    }
                                    const arrayQvente = Object.values(results);
                                    const sql = `DELETE FROM trade WHERE id_trade='${arrayQvente[0].id_trade}'`;
                                    connection.query(sql, async (err) => {
                                        if (err) {
                                            throw err;
                                        }
                                    });
                                });

                                sql = `
                                    INSERT INTO trade 
                                    SET id_joueur="${interaction.user.id}",
                                        id_salon="${interaction.channelId}",
                                        ressource="${ressource}",
                                        quantite='${quantite}',
                                        prix='${prix}',
                                        prix_u='${prix_u}';
                                    UPDATE pays
                                    SET cash=cash + ${prix}
                                    WHERE id_joueur = "${id_joueur}";
                                    UPDATE pays
                                    SET cash=cash - ${prix}
                                    WHERE id_joueur = "${interaction.user.id}";
                                    UPDATE ressources
                                    SET ${res}=${res}+${quantite}
                                    WHERE id_joueur = "${interaction.user.id}";
                                    INSERT INTO historique
                                    SET id_joueur="${interaction.user.id}",
                                        id_salon="${interaction.channelId}",
                                        type='offre',
                                        ressource="${ressource}",
                                        quantite='${quantite}',
                                        prix='${prix}',
                                        prix_u='${prix_u}'
                                `;
                                connection.query(sql, async (err) => {
                                    if (err) {
                                        throw err;
                                    }
                                })
                            } else {
                                const reponse = codeBlock('ansi', `\u001b[0;0m\u001b[1;31mVous n'avez pas l'argent nécessaire pour conclure l'affaire : ${Pays.cash.toLocaleString('en-US')}/${prix.toLocaleString('en-US')}`);
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
                    const prix_u = parseFloat(fields[2].value.slice(18, espace2 - 1));
                    const prix = Math.round(prix_u * quantite);
                    //console.log(espace + ` | ` + ressource + ` | ` + espace2 + ` | ` + prix_u + ` | ` + prix)

                    sql = `SELECT * FROM pays WHERE id_joueur="${id_joueur}"`;
                    connection.query(sql, async (err, results) => {if (err) {throw err;}
                        const Pays = results[0];
                        let res;
                        let tag;
                        let emoji = ''

                        const pourcentage = fields[2].value.slice(fields[2].value.indexOf("(") - 1, fields[2].value.indexOf(")") + 1);
                        const gouvernementObject = JSON.parse(readFileSync('data/gouvernement.json', 'utf-8'));
                        const vendreCommandCooldown = new CommandCooldown('vendre', ms(`${eval(`gouvernementObject.${Pays.ideologie}.commerce`)}m`));

                        switch (ressource) {
                            case 'Acier':
                                res = `acier`;
                                tag = `1108468572902142052`;
                                emoji = '<:acier:1075776411329122304>';
                                break;
                            case 'Béton':
                                res = `beton`;
                                tag = `1108468896689819679`;
                                emoji = '<:beton:1075776342227943526>';
                                break;
                            case 'Biens de consommation':
                                res = `bc`;
                                tag = `1108469180929429626`;
                                emoji = '💻';
                                break;
                            case 'Bois':
                                res = `bois`;
                                tag = `1108469239309947062`;
                                emoji = '🪵';
                                break;
                            case 'Carburant':
                                res = `carburant`;
                                tag = `1108469311519068252`;
                                emoji = '⛽';
                                break;
                            case 'Charbon':
                                res = `charbon`;
                                tag = `1108469391349264415`;
                                emoji = '<:charbon:1075776385517375638>';
                                break;
                            case 'Eau':
                                res = `eau`;
                                tag = `1108469512266858496`;
                                emoji = '💧';
                                break;
                            case 'Eolienne':
                                res = `eolienne`;
                                tag = `1108469566331433110`;
                                emoji = '<:windmill:1108767955442991225>';
                                break;
                            case 'Métaux':
                                res = `metaux`;
                                tag = `1108469631703851099`;
                                emoji = '🪨';
                                break;
                            case 'Nourriture':
                                res = `nourriture`;
                                tag = `1108469709663371324`;
                                emoji = '🌽';
                                break;
                            case 'Pétrole':
                                res = `petrole`;
                                tag = `1108469768161337374`;
                                emoji = '🛢️';
                                break;
                            case 'Sable':
                                res = `sable`;
                                tag = `1108470623908409414`;
                                emoji = '<:sable:1075776363782479873>';
                                break;
                            case 'Verre':
                                res = `verre`;
                                tag = `1108470717663686676`;
                                emoji = '🪟';
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
                            color: interaction.member.displayColor,
                            timestamp: new Date(),
                            footer: {
                                text: `${Pays.devise}`
                            },
                        };

                        interaction.message.edit({embeds: [embed], components: []});

                        let prixMoyen;
                        if (res === 'eolienne') {
                            prixMoyen = 'Pas de prix moyen'
                        } else {
                            const jsonPrix = JSON.parse(readFileSync('OLD/data/prix.json', 'utf-8'));
                            prixMoyen = eval(`jsonPrix.${res}`)
                        }
                        const offre = {
                            author: {
                                name: `${Pays.rang} de ${Pays.nom}`,
                                icon_url: interaction.member.displayAvatarURL()
                            },
                            thumbnail: {
                                url: Pays.drapeau
                            },
                            title: `\`Nouvelle offre :\``,
                            fields: [
                                {
                                    name: `> ${emoji} Ressource :`,
                                    value: codeBlock(
                                        `• ${ressource}\n` +
                                        `• Prix moyen : ${prixMoyen}`) + `\u200B`
                                },
                                {
                                    name: `> 📦 Quantité :`,
                                    value: codeBlock(`• ${quantite.toLocaleString('en-US')}`) + `\u200B`
                                },
                                {
                                    name: `> <:PAZ:1108440620101546105> Prix :`,
                                    value: codeBlock(
                                        `• A l'unité : ${prix_u.toFixed(2)}${pourcentage}\n` +
                                        `• Au total : ${prix.toLocaleString('en-US')}`) + `\u200B`
                                }
                            ],
                            color: interaction.member.displayColor,
                            timestamp: new Date(),
                            footer: {
                                text: `${Pays.devise}`
                            },
                        };

                        const row = new ActionRowBuilder()
                            .addComponents(
                                new ButtonBuilder()
                                    .setLabel(`Acheter`)
                                    .setEmoji(`💵`)
                                    .setCustomId('acheter-' + id_joueur)
                                    .setStyle(ButtonStyle.Success),
                            )
                            .addComponents(
                                new ButtonBuilder()
                                    .setLabel(`Supprimer`)
                                    .setEmoji(`✖️`)
                                    .setCustomId('supprimer-' + id_joueur)
                                    .setStyle(ButtonStyle.Danger),
                            )

                        const salon_commerce = interaction.client.channels.cache.get(process.env.SALON_COMMERCE);
                        const thread = await salon_commerce.threads.create({
                            name: `${quantite.toLocaleString('en-US')} [${ressource}] à ${prix_u.toLocaleString('en-US')} | ${prix.toLocaleString('en-US')} PAZ | ${interaction.member.displayName}`,
                            message: { embeds: [offre], components: [row] },
                            appliedTags: [tag] });

                        interaction.channel.send({content: `Votre offre a été publiée pour 1 jour : ${thread}`});
                        await vendreCommandCooldown.addUser(interaction.member.id);

                        const sql = `UPDATE ressources
                                     SET ${res}=${res} - ${quantite}
                                     WHERE id_joueur = "${id_joueur}"`;
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
                    connection.query(sql, async (err, results) => {
                        if (err) {
                            throw err;
                        }
                        const Pays = results[0];
                        let res;

                        switch (ressource) {
                            case 'Acier':
                                res = `acier`;
                                break;
                            case 'Béton':
                                res = `beton`;
                                break;
                            case 'Biens de consommation':
                                res = `bc`;
                                break;
                            case 'Bois':
                                res = `bois`;
                                break;
                            case 'Carburant':
                                res = `carburant`;
                                break;
                            case 'Charbon':
                                res = `charbon`;
                                break;
                            case 'Eau':
                                res = `eau`;
                                break;
                            case 'Métaux':
                                res = `metaux`;
                                break;
                            case 'Nourriture':
                                res = `nourriture`;
                                break;
                            case 'Pétrole':
                                res = `petrole`;
                                break;
                            case 'Sable':
                                res = `sable`;
                                break;
                            case 'Verre':
                                res = `verre`;
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
                            color: interaction.member.displayColor,
                            timestamp: new Date(),
                            footer: {
                                text: `${Pays.devise}`
                            },
                        };

                        await interaction.deferUpdate()
                        interaction.message.edit({embeds: [embed], components: []});

                        let sql = `SELECT * FROM qvente WHERE ressource="${ressource}" ORDER BY id_vente`;
                        connection.query(sql, async (err, results) => {
                            if (err) {
                                throw err;
                            }
                            const arrayQvente = Object.values(results);
                            const sql = `DELETE FROM qvente WHERE id_vente='${arrayQvente[0].id_vente}'`;
                            connection.query(sql, async (err) => {
                                if (err) {
                                    throw err;
                                }
                            });
                        });

                        sql = `
                            INSERT INTO qvente
                            SET id_joueur="${interaction.user.id}",
                                id_salon="${interaction.channelId}",
                                ressource="${ressource}",
                                quantite='${quantite}',
                                prix='${prix}',
                                prix_u='${prix_u}';
                            UPDATE pays
                            SET cash=cash + ${prix}
                            WHERE id_joueur = "${id_joueur}";
                            UPDATE ressources
                            SET ${res}=${res} - ${quantite}
                            WHERE id_joueur = "${id_joueur}";
                            INSERT INTO historique
                            SET id_joueur="${interaction.user.id}",
                                id_salon="${interaction.channelId}",
                                type='qvente',
                                ressource="${ressource}",
                                quantite='${quantite}',
                                prix='${prix}',
                                prix_u='${prix_u}'`;
                        connection.query(sql, async (err) => {
                            if (err) {
                                throw err;
                            }
                        });
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
                                case 'Acier':
                                    res = `acier`;
                                    break;
                                case 'Biens de consommation':
                                    res = `bc`;
                                    break;
                                case 'Béton':
                                    res = `beton`;
                                    break;
                                case 'Bois':
                                    res = `bois`;
                                    break;
                                case 'Carburant':
                                    res = `carburant`;
                                    break;
                                case 'Charbon':
                                    res = `charbon`;
                                    break;
                                case 'Eau':
                                    res = `eau`;
                                    break;
                                case 'Métaux':
                                    res = `metaux`;
                                    break;
                                case 'Nourriture':
                                    res = `nourriture`;
                                    break;
                                case 'Pétrole':
                                    res = `petrole`;
                                    break;
                                case 'Sable':
                                    res = `sable`;
                                    break;
                                case 'Verre':
                                    res = `verre`;
                                    break;
                            }

                            const receivedEmbed = interaction.message.embeds[0];
                            const embed = EmbedBuilder.from(receivedEmbed).setTitle('\`Vous avez acheté au marché rapide :\`');

                            await interaction.deferUpdate()
                            interaction.message.edit({embeds: [embed], components: []});

                            let sql = `SELECT * FROM qachat WHERE ressource='${ressource}' ORDER BY id_achat`;
                            connection.query(sql, async (err, results) => {
                                if (err) {
                                    throw err;
                                }
                                const arrayQvente = Object.values(results);
                                const sql = `DELETE FROM qachat WHERE id_achat='${arrayQvente[0].id_achat}'`;
                                connection.query(sql, async (err) => {
                                    if (err) {
                                        throw err;
                                    }
                                });
                            });

                            sql = `
                                INSERT INTO qachat
                                SET id_joueur="${interaction.user.id}",
                                    id_salon="${interaction.channelId}",
                                    ressource="${ressource}",
                                    quantite='${quantite}',
                                    prix='${prix}',
                                    prix_u='${prix_u}';
                                UPDATE pays
                                SET cash=cash - ${prix}
                                WHERE id_joueur = "${id_joueur}";
                                UPDATE ressources
                                SET ${res}=${res} + ${quantite}
                                WHERE id_joueur = "${id_joueur}";
                                INSERT INTO historique
                                SET id_joueur="${interaction.user.id}",
                                    id_salon="${interaction.channelId}",
                                    type='qachat',
                                    ressource="${ressource}",
                                    quantite='${quantite}',
                                    prix='${prix}',
                                    prix_u='${prix_u}'`;
                            connection.query(sql, async (err) => {
                                if (err) {
                                    throw err;
                                }
                            });
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
            } else if (interaction.customId.includes('ambassade-oui') === true) {
                //region Ambassade oui
                id_joueur = interaction.customId.slice(14);
                sql = `
                    SELECT * FROM diplomatie WHERE id_joueur='${interaction.member.id}';
                    SELECT * FROM pays WHERE id_joueur='${interaction.member.id}'
                `;
                connection.query(sql, async(err, results) => {if (err) {throw err;}
                    const Diplomatie = results[0][0];
                    const Pays = results[1][0];

                    const embed = {
                        author: {
                            name: `${Pays.rang} de ${Pays.nom}`,
                            icon_url: interaction.member.displayAvatarURL()
                        },
                        thumbnail: {
                            url: Pays.drapeau
                        },
                        title: `\`Invitation acceptée !\``,
                        description: `Vous avez acceptés une demande d'ambassade de <@${id_joueur}>.`,
                        color: interaction.member.displayColor,
                        timestamp: new Date(),
                        footer: {
                            text: `${Pays.devise}`
                        },
                    };

                    interaction.reply({embeds: [embed]})
                    interaction.message.edit({components: []})

                    sql = `
                        SELECT * FROM diplomatie WHERE id_joueur='${id_joueur}';
                        SELECT * FROM pays WHERE id_joueur='${id_joueur}'
                    `;
                    connection.query(sql, async(err, results) => {if (err) {throw err;}
                        const Diplomatie2 = results[0][0];
                        const Pays2 = results[1][0];

                        let ambassades = JSON.parse(Diplomatie.ambassade.replace(/\s/g, ''));
                        ambassades.push(Pays2.id_joueur);
                        ambassades = JSON.stringify(ambassades);
                        ambassades = ambassades.replace(/"/g, '');

                        sql = `UPDATE diplomatie SET ambassade="${ambassades}" WHERE id_joueur="${interaction.member.id}"`;
                        connection.query(sql, async(err) => { if (err) { throw err; }})

                        let ambassades2 = JSON.parse(Diplomatie2.ambassade.replace(/\s/g, ''));
                        ambassades2.push(interaction.member.id);
                        ambassades2 = JSON.stringify(ambassades2);
                        ambassades2 = ambassades2.replace(/"/g, '');

                        sql = `UPDATE diplomatie SET ambassade="${ambassades2}" WHERE id_joueur="${Pays2.id_joueur}"`;
                        connection.query(sql, async(err) => { if (err) { throw err; }})

                        const refus = {
                            author: {
                                name: `${Pays.rang} de ${Pays.nom}`,
                                icon_url: interaction.member.displayAvatarURL()
                            },
                            thumbnail: {
                                url: Pays.drapeau
                            },
                            title: `\`Invitation acceptée !\``,
                            description: `${interaction.member} a accepté votre demande d'ambassade.`,
                            color: interaction.member.displayColor,
                            timestamp: new Date(),
                            footer: {
                                text: `${Pays.devise}`
                            },
                        };
                        function bouton(message) {
                            return new ActionRowBuilder()
                                .addComponents(
                                    new ButtonBuilder()
                                        .setLabel(`Lien vers le message`)
                                        .setEmoji(`🏛️`)
                                        .setURL(message.url)
                                        .setStyle(ButtonStyle.Link),
                                )
                        }
                        const joueur = interaction.client.users.cache.get(id_joueur)
                        interaction.client.channels.cache.get(Pays2.id_salon)
                            .send({embeds: [refus]})
                            .then(message => joueur.send({
                                embeds: [refus],
                                components: [bouton(message)]
                            }));

                        const channel = client.channels.cache.get(process.env.SALON_AMBASSADE);
                        channel.threads
                            .create({
                                name: `${Pays.nom} - ${Pays2.nom}`,
                                autoArchiveDuration: ThreadAutoArchiveDuration.OneWeek,
                                type: ChannelType.PrivateThread,
                                reason: 'Nouvelle ambassade',
                            })
                            .then(thread => {thread.send(`${interaction.member} <@${Pays2.id_joueur}>`)})
                            .catch(console.error);
                    })

                })
                //endregion
            } else if (interaction.customId.includes('ambassade-non') === true) {
                //region Ambassade non
                id_joueur = interaction.customId.slice(14);
                sql = `
                    SELECT * FROM pays WHERE id_joueur='${interaction.member.id}'
                `;
                connection.query(sql, async(err, results) => {if (err) {throw err;}
                    const Pays = results[0];

                    const embed = {
                        author: {
                            name: `${Pays.rang} de ${Pays.nom}`,
                            icon_url: interaction.member.displayAvatarURL()
                        },
                        thumbnail: {
                            url: Pays.drapeau
                        },
                        title: `\`Invitation refusée !\``,
                        description: `Vous avez refusé une demande d'ambassade de <@${id_joueur}>.`,
                        color: interaction.member.displayColor,
                        timestamp: new Date(),
                        footer: {
                            text: `${Pays.devise}`
                        },
                    };

                    interaction.reply({embeds: [embed]})
                    interaction.message.edit({components: []})

                    sql = `
                        SELECT * FROM pays WHERE id_joueur='${id_joueur}'
                    `;
                    connection.query(sql, async(err, results) => {if (err) {throw err;}
                        const Pays2 = results[0];

                        const refus = {
                            author: {
                                name: `${Pays.rang} de ${Pays.nom}`,
                                icon_url: interaction.member.displayAvatarURL()
                            },
                            thumbnail: {
                                url: Pays.drapeau
                            },
                            title: `\`Invitation refusée !\``,
                            description: `${interaction.member} a refusé votre demande d'ambassade.`,
                            color: interaction.member.displayColor,
                            timestamp: new Date(),
                            footer: {
                                text: `${Pays.devise}`
                            },
                        };
                        function bouton(message) {
                            return new ActionRowBuilder()
                                .addComponents(
                                    new ButtonBuilder()
                                        .setLabel(`Lien vers le message`)
                                        .setEmoji(`🏛️`)
                                        .setURL(message.url)
                                        .setStyle(ButtonStyle.Link),
                                )
                        }
                        const joueur = interaction.client.users.cache.get(id_joueur)
                        interaction.client.channels.cache.get(Pays2.id_salon)
                            .send({embeds: [refus]})
                            .then(message => joueur.send({
                                embeds: [refus],
                                components: [bouton(message)]
                            }))
                    })

                })
                //endregion
            } else if (interaction.customId.includes('drapeau_aleatoire') === true) {
                //region Drapeau aléatoire
                const sql = `SELECT * FROM pays WHERE id_joueur='${interaction.member.id}'`;
                connection.query(sql, async(err, results) => {if (err) {throw err;}
                    const Pays = results[0];

                    if (!results[0]) {
                        const reponse = codeBlock('diff', `- Vous ne jouez pas.`);
                        await interaction.reply({ content: reponse, ephemeral: true });
                    } else {
                        const canvas = createCanvas(600, 400)
                        const ctx = canvas.getContext('2d')

                        function print_flag() {
                            const out = fs.createWriteStream('flags/output.png')
                            const stream = canvas.createPNGStream()

                            return new Promise((resolve, reject) => {
                                stream.on('data', (chunk) => {
                                    out.write(chunk);
                                });

                                stream.on('end', () => {
                                    out.end();
                                    resolve();

                                    const attachment = new AttachmentBuilder('flags/output.png', {name: 'drapeau.png'});

                                    interaction.channel.send({files: [attachment]});
                                    interaction.deferUpdate()
                                });

                                stream.on('error', (error) => {
                                    reject(error);
                                });
                            });
                        }

                        const figures = chance.pickone([
                            "fond",
                            "bandes",
                            "lignes",
                            "anglais",
                            "suisse",
                            "scandinave",
                        ])

                        function couleurs(nombre) {
                            return chance.pickset([
                                "#ffffff",
                                "#000000",
                                "#012269",
                                "#0018a8",
                                "#003593",
                                "#0153a5",
                                "#428fdf",
                                "#3a7dce",
                                "#74acdf",
                                "#0080ff",
                                "#00778b",
                                "#009e61",
                                "#41b226",
                                "#3f9c34",
                                "#007848",
                                "#006233",
                                "#fec400",
                                "#ffdd00",
                                "#d57800",
                                "#f67f00",
                                "#fe4e12",
                                "#eb2839",
                                "#fe0000",
                                "#c9072a",
                                "#8d1b3d",
                            ], nombre)
                        }

                        let logo;
                        const width = 600;   // Largeur du canevas
                        const height = 400;
                        const couleur = couleurs(1)[0];
                        let crossThickness = 72; // Épaisseur de la croix
                        switch (figures) {
                            case "fond":
                                ctx.fillStyle = couleurs(1)[0]
                                ctx.fillRect(0, 0, 600, 400)

                                logo = chance.pickone([
                                    'full_avec_logo',
                                    'full_sans_logo',
                                    'simple_logo'
                                ])

                                switch (logo) {
                                    case 'full_avec_logo':
                                        loadImage('flags/full_avec_logo' + chance.integer({
                                            min: 1,
                                            max: process.env.NBR_FULL_AVEC_LOGO
                                        }) + '.png')
                                            .then((image) => {
                                                ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
                                                loadImage('flags/simple_logo' + chance.integer({
                                                    min: 1,
                                                    max: process.env.NBR_SIMPLE_LOGO
                                                }) + '.png')
                                                    .then((image) => {
                                                        const position = chance.pickone(['full', 'haut_droite', 'haut_gauche', 'bas_droite', 'bas_gauche'])
                                                        switch (position) {
                                                            case 'full':
                                                                ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
                                                                break;
                                                            case 'haut_droite':
                                                                ctx.drawImage(image, canvas.width / 2, 0, canvas.width / 2, canvas.height / 2);
                                                                break;
                                                            case 'haut_gauche':
                                                                ctx.drawImage(image, 0, 0, canvas.width / 2, canvas.height / 2);
                                                                break;
                                                            case 'bas_droite':
                                                                ctx.drawImage(image, canvas.width / 2, canvas.height / 2, canvas.width / 2, canvas.height / 2);
                                                                break;
                                                            case 'bas_gauche':
                                                                ctx.drawImage(image, 0, canvas.height / 2, canvas.width / 2, canvas.height / 2);
                                                                break;
                                                        }
                                                        print_flag()
                                                    })
                                            })
                                        break;
                                    case 'full_sans_logo':
                                        loadImage('flags/full_sans_logo' + chance.integer({
                                            min: 1,
                                            max: process.env.NBR_FULL_SANS_LOGO
                                        }) + '.png')
                                            .then((image) => {
                                                ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
                                                print_flag()
                                            })
                                        break;
                                    case 'simple_logo':
                                        loadImage('flags/simple_logo' + chance.integer({
                                            min: 1,
                                            max: process.env.NBR_SIMPLE_LOGO
                                        }) + '.png')
                                            .then((image) => {
                                                ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
                                                print_flag()
                                            })
                                        break;
                                }
                                break;
                            case "bandes":
                                for (let i = 0; i < 3; i++) {
                                    ctx.fillStyle = couleurs(3)[i]
                                    ctx.fillRect(i * (canvas.width / 3), 0, canvas.width / 3, canvas.height);
                                }
                                logo = chance.pickone([
                                    'rien',
                                    'rien',
                                    'full_avec_logo',
                                    'full_sans_logo',
                                    'simple_logo'
                                ])

                                switch (logo) {
                                    case 'rien':
                                        print_flag()
                                        break;
                                    case 'full_avec_logo':
                                        loadImage('flags/full_avec_logo' + chance.integer({
                                            min: 1,
                                            max: process.env.NBR_FULL_AVEC_LOGO
                                        }) + '.png')
                                            .then((image) => {
                                                ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
                                                print_flag()
                                            })
                                        break;
                                    case 'full_sans_logo':
                                        loadImage('flags/full_sans_logo' + chance.integer({
                                            min: 1,
                                            max: process.env.NBR_FULL_SANS_LOGO
                                        }) + '.png')
                                            .then((image) => {
                                                ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
                                                print_flag()
                                            })
                                        break;
                                    case 'simple_logo':
                                        loadImage('flags/simple_logo' + chance.integer({
                                            min: 1,
                                            max: process.env.NBR_SIMPLE_LOGO
                                        }) + '.png')
                                            .then((image) => {
                                                ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
                                                print_flag()
                                            })
                                        break;
                                }
                                break;
                            case "lignes":
                                for (let i = 0; i < 3; i++) {
                                    ctx.fillStyle = couleurs(3)[i]
                                    ctx.fillRect(0, i * (canvas.height / 3), canvas.width, canvas.height / 3);
                                }

                                logo = chance.pickone([
                                    'rien',
                                    'rien',
                                    'full_avec_logo',
                                    'full_sans_logo',
                                    'simple_logo'
                                ])

                                switch (logo) {
                                    case 'rien':
                                        print_flag()
                                        break;
                                    case 'full_avec_logo':
                                        loadImage('flags/full_avec_logo' + chance.integer({
                                            min: 1,
                                            max: process.env.NBR_FULL_AVEC_LOGO
                                        }) + '.png')
                                            .then((image) => {
                                                ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
                                                print_flag()
                                            })
                                        break;
                                    case 'full_sans_logo':
                                        loadImage('flags/full_sans_logo' + chance.integer({
                                            min: 1,
                                            max: process.env.NBR_FULL_SANS_LOGO
                                        }) + '.png')
                                            .then((image) => {
                                                ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
                                                print_flag()
                                            })
                                        break;
                                    case 'simple_logo':
                                        loadImage('flags/simple_logo' + chance.integer({
                                            min: 1,
                                            max: process.env.NBR_SIMPLE_LOGO
                                        }) + '.png')
                                            .then((image) => {
                                                ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
                                                print_flag()
                                            })
                                        break;
                                }
                                break;
                            case "anglais":
                                ctx.fillStyle = couleurs(1)[0];
                                ctx.fillRect(0, 0, 600, 400);

                                crossThickness = 72;  // Épaisseur de la croix en pixels

                                // Dessin de la croix horizontale
                                ctx.fillStyle = couleur;
                                ctx.fillRect(0, (height - crossThickness) / 2, width, crossThickness);

                                // Dessin de la croix verticale
                                ctx.fillRect((width - crossThickness) / 2, 0, crossThickness, height);


                                logo = chance.pickone([
                                    'rien',
                                    'rien',
                                    'simple_logo'
                                ])

                                switch (logo) {
                                    case 'rien':
                                        print_flag()
                                        break;
                                    case 'simple_logo':
                                        loadImage('flags/simple_logo' + chance.integer({
                                            min: 1,
                                            max: process.env.NBR_SIMPLE_LOGO
                                        }) + '.png')
                                            .then((image) => {
                                                ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
                                                print_flag()
                                            })
                                        break;
                                }
                                break;
                            case "suisse":
                                ctx.fillStyle = couleurs(1)[0]
                                ctx.fillRect(0, 0, 600, 400);

                                // Dessin des bras verticaux de la croix
                                ctx.fillStyle = couleurs(1)[0]
                                ctx.fillRect((600 - 40) / 2, (400 - 240) / 2, 40, 240);

                                // Dessin des bras horizontaux de la croix
                                ctx.fillRect((600 - 240) / 2, (400 - 40) / 2, 240, 40);

                                print_flag()
                                break;
                            case "scandinave":
                                ctx.fillStyle = couleurs(1)[0];
                                ctx.fillRect(0, 0, 600, 400);

                                crossThickness = 75;  // Épaisseur de la croix en pixels

                                // Dessin de la croix horizontale
                                ctx.fillStyle = couleur;
                                ctx.fillRect(0, (height - crossThickness) / 2, width, crossThickness);

                                // Dessin de la croix verticale
                                ctx.fillRect(187.5, 0, crossThickness, height);

                                logo = chance.pickone([
                                    'rien',
                                    'rien',
                                    'simple_logo'
                                ])

                                switch (logo) {
                                    case 'rien':
                                        print_flag()
                                        break;
                                    case 'simple_logo':
                                        loadImage('flags/simple_logo' + chance.integer({
                                            min: 1,
                                            max: process.env.NBR_SIMPLE_LOGO
                                        }) + '.png')
                                            .then((image) => {
                                                ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
                                                print_flag()
                                            })
                                        break;
                                }
                                break;
                        }
                    }
                });
                //endregion
            } else if (interaction.customId.includes('drapeau_custom') === true) {
                //region Drapeau custom
                const userCooldowned = await drapeauCommandCooldown.getUser(interaction.member.id);

                if (userCooldowned) {
                    const timeLeft = msToMinutes(userCooldowned.msLeft, false);
                    const reponse = codeBlock('ansi', `\u001b[0;0m\u001b[1;31mVous avez déjà changé votre drapeau récemment. Il reste ${timeLeft.days}j ${timeLeft.hours}h ${timeLeft.minutes}min avant de pouvoir la changer à nouveau.`);
                    await interaction.reply({ content: reponse, ephemeral: true });
                } else {
                    const modal = new ModalBuilder()
                        .setCustomId(`drapeau`)
                        .setTitle(`Choisir une drapeau`);

                    const image_annonce = new TextInputBuilder()
                        .setCustomId('image_annonce')
                        .setLabel(`Ajouter un drapeau :`)
                        .setPlaceholder(`Lien de l'image`)
                        .setStyle(TextInputStyle.Short)
                        .setMaxLength(150)
                        .setRequired(true)

                    const firstActionRow = new ActionRowBuilder().addComponents(image_annonce);
                    modal.addComponents(firstActionRow);
                    interaction.showModal(modal);
                }
                //endregion
            } else if (interaction.customId.includes('supprimer') === true) {
                //region Supprimer
                id_joueur = interaction.customId.slice(10);
                if (id_joueur === interaction.member.id) {

                    fields = interaction.message.embeds[0].fields;
                    espace = fields[0].value.indexOf("Prix");
                    ressource = fields[0].value.slice(6, espace - 3);

                    const quantiteAvecVirgule = interaction.message.embeds[0].fields[1].value.slice(6, fields[1].value.length - 4);
                    const search = ',';
                    const replaceWith = '';
                    const quantite = parseInt(quantiteAvecVirgule.split(search).join(replaceWith));

                    switch (ressource) {
                        case 'Acier':
                            res = `acier`;
                            break;
                        case 'Béton':
                            res = `beton`;
                            break;
                        case 'Biens de consommation':
                            res = `bc`;
                            break;
                        case 'Bois':
                            res = `bois`;
                            break;
                        case 'Carburant':
                            res = `carburant`;
                            break;
                        case 'Charbon':
                            res = `charbon`;
                            break;
                        case 'Eau':
                            res = `eau`;
                            break;
                        case 'Eolienne':
                            res = `eolienne`;
                            break;
                        case 'Metaux':
                            res = `metaux`;
                            break;
                        case 'Nourriture':
                            res = `nourriture`;
                            break;
                        case 'Pétrole':
                            res = `petrole`;
                            break;
                        case 'Sable':
                            res = `sable`;
                            break;
                        case 'Verre':
                            res = `verre`;
                            break;
                    }

                    sql = `UPDATE ressources
                           SET ${res}=${res} + ${quantite}
                           WHERE id_joueur = "${interaction.user.id}"`;
                    connection.query(sql, async (err) => {
                        if (err) {
                            throw err;
                        }
                    })
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
                    let sql = `
                        SELECT * FROM diplomatie WHERE id_joueur='${id_joueur}';
                        SELECT * FROM pays WHERE id_joueur='${id_joueur}';
                        SELECT * FROM population WHERE id_joueur='${id_joueur}';
                        SELECT * FROM territoire WHERE id_joueur='${id_joueur}'
                    `;
                    connection.query(sql, async (err, results) => {if (err) {throw err;}
                        const Pays = results[0][0];
                        const Territoire = results[1][0];

                        const explorateurCooldown = new CommandCooldown('explorateur', ms(`${eval(`biomeObject.${Territoire.region}.cooldown`)}min`));
                        const userCooldowned = await explorateurCooldown.getUser(interaction.member.id);
                        if (userCooldowned) {
                            const timeLeft = msToMinutes(userCooldowned.msLeft, false);
                            const reponse = codeBlock('ansi', `\u001b[0m\u001b[1;31mVous avez déjà envoyé l'explorateur récemment. Il reste ${timeLeft.hours}h ${timeLeft.minutes}min avant que celui-ci ne revienne.`);
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
                                    `• Celui-ci vous notifira de sa rentrée dans ${convertMillisecondsToTime(ms(`${eval(`biomeObject.${Territoire.region}.cooldown`)}min`))}.`) + `\u200B`,
                                color: interaction.member.displayColor,
                                timestamp: new Date(),
                                footer: {
                                    text: Pays.devise
                                },
                            };
                            await interaction.reply({embeds: [embedSuccess], components: []});
                            await explorateurCooldown.addUser(interaction.member.id);

                            const maintenant = new Date();
                            const tempsActuel = maintenant.getTime();
                            const tempsCooldwon = new Date(tempsActuel + ms(`${eval(`biomeObject.${Territoire.region}.cooldown`)}min`))
                            const annee = tempsCooldwon.getFullYear();
                            const mois = String(tempsCooldwon.getMonth() + 1).padStart(2, '0'); // Les mois sont indexés à partir de 0 (0 = janvier)
                            const jour = String(tempsCooldwon.getDate()).padStart(2, '0');
                            const heure = String(tempsCooldwon.getHours()).padStart(2, '0');
                            const minute = String(tempsCooldwon.getMinutes()).padStart(2, '0');
                            const seconde = String(tempsCooldwon.getSeconds()).padStart(2, '0');
                            const dateFormatee = `${annee}-${mois}-${jour} ${heure}:${minute}:${seconde}`;
                            sql = `
                                    INSERT INTO processus 
                                    SET id_joueur="${interaction.user.id}",
                                        date="${dateFormatee}",
                                        type='exploration'
                                `;
                            connection.query(sql, async (err) => {if (err) {throw err;}})
                        }
                    })
                } else {
                    reponse = codeBlock('ansi', `\u001b[0m\u001b[1;31mVous n'êtes pas l'auteur de cette commande`);
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

                    //const regex = /(\d+(?:,\d+)?)\s+(\w+)/g;
                    //let match;
                    //const tranchesAge = {};
                    //while ((match = regex.exec(interaction.message.embeds[0].fields[1].value)) !== null) {
                    //    const nombre = parseFloat(match[1].replace(',', ''));
                    //    const tranche = match[2].toLowerCase();
                    //    tranchesAge[tranche] = nombre;
                    //}

                    let sql = `UPDATE territoire
                               SET T_total=T_total + ${taille},
                                   T_controle=T_controle + ${taille},
                                   ${biome.toLowerCase()}=${biome.toLowerCase()} + ${taille}
                               WHERE id_joueur = '${interaction.member.id}'`;
                               //UPDATE population SET habitant=habitant+${tranchesAge.enfants + tranchesAge.jeunes + tranchesAge.adultes + tranchesAge.personnes},
                               //                      enfant=enfant+${tranchesAge.enfants},
                               //                      jeune=jeune+${tranchesAge.jeunes},
                               //                      adulte=adulte+${tranchesAge.adultes},
                               //                      vieux=vieux+${tranchesAge.personnes} WHERE id_joueur='${interaction.member.id}';
                    connection.query(sql, async (err) => {if (err) {throw err;}});

                    sql = `
                        SELECT * FROM pays WHERE id_joueur='${interaction.member.id}';
                        SELECT * FROM territoire WHERE id_joueur='${interaction.member.id}'
                    `;
                    connection.query(sql, async (err, results) => {if (err) {throw err;}
                        const Pays = results[0][0];
                        const Territoire = results[1][0];

                        function convertMillisecondsToTime(milliseconds) {
                            const seconds = Math.floor(milliseconds / 1000);
                            const hours = Math.floor(seconds / 3600);
                            const minutes = Math.floor((seconds % 3600) / 60);
                            const remainingSeconds = seconds % 60;
                            return `${hours} heures, ${minutes} minutes, ${remainingSeconds} secondes`;
                        }

                        const receivedEmbed = interaction.message.embeds[0];
                        const embed = EmbedBuilder.from(receivedEmbed).setFields([{
                            name: `‎`,
                            value: codeBlock(
                                `• Vous avez intégré${description.value.slice(spaceIndices[3], de - 1)} de ${taille} km² à votre territoire contôlé.\n` +
                                `• Celui-ci deviendra national dans ${convertMillisecondsToTime(ms(`2d`) * eval(`gouvernementObject.${Pays.ideologie}.assimilation`))}.`) + `\u200B`
                        }]);

                        const row2 = new ActionRowBuilder()
                            .addComponents(
                                new ButtonBuilder()
                                    .setLabel(`Renvoyer un explorateur`)
                                    .setEmoji(`🧭`)
                                    .setCustomId('explorateur-' + interaction.member.id)
                                    .setStyle(ButtonStyle.Success)
                            );

                        interaction.message.edit({embeds: [embed], components: [row2]});
                        interaction.deferUpdate()

                        if (Math.floor(Territoire.T_total / 15000) !== Territoire.hexagone) {
                            let sql = `UPDATE territoire
                                       SET hexagone=territoire.hexagone + 1
                                       WHERE id_joueur = '${interaction.member.id}'`;
                            connection.query(sql, async (err) => {if (err) {throw err;}});

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
                                    `• ${Pays.regime} de ${Pays.nom} contrôle une nouvelle case en ${eval(`biomeObject.${Territoire.region}.nom`)}\n` +
                                    `• Direction : ${direction}`) + `\u200B`
                                ,
                                timestamp: new Date(),
                                footer: {
                                    text: `${Pays.devise}`
                                },
                                color: 0x57F287
                            };
                            client.channels.cache.get(process.env.SALON_CARTE).send({embeds: [annonce]})

                            const row = new ActionRowBuilder()
                                .addComponents(
                                    new ButtonBuilder()
                                        .setLabel(`Renvoyer un explorateur`)
                                        .setEmoji(`🧭`)
                                        .setCustomId('explorateur-' + interaction.member.id)
                                        .setStyle(ButtonStyle.Success)
                                )
                                .addComponents(
                                    new ButtonBuilder()
                                        .setLabel(`Nouvelle case !`)
                                        .setEmoji(`🧭`)
                                        .setURL(`https://discord.com/channels/826427184305537054/1058462262916042862`)
                                        .setStyle(ButtonStyle.Link),
                                );
                            interaction.message.edit({ components: [row]});
                        }

                        const maintenant = new Date();
                        const tempsActuel = maintenant.getTime();
                        const tempsCooldwon = new Date(tempsActuel + ms(`2d`) * eval(`gouvernementObject.${Pays.ideologie}.assimilation`))
                        const annee = tempsCooldwon.getFullYear();
                        const mois = String(tempsCooldwon.getMonth() + 1).padStart(2, '0'); // Les mois sont indexés à partir de 0 (0 = janvier)
                        const jour = String(tempsCooldwon.getDate()).padStart(2, '0');
                        const heure = String(tempsCooldwon.getHours()).padStart(2, '0');
                        const minute = String(tempsCooldwon.getMinutes()).padStart(2, '0');
                        const seconde = String(tempsCooldwon.getSeconds()).padStart(2, '0');
                        const dateFormatee = `${annee}-${mois}-${jour} ${heure}:${minute}:${seconde}`;
                        sql = `
                                    INSERT INTO processus 
                                    SET id_joueur="${interaction.user.id}",
                                        date="${dateFormatee}",
                                        type='integration',
                                        option2='${taille}'
                                `;
                        connection.query(sql, async (err) => {if (err) {throw err;}})
                    })
                } else {
                    reponse = codeBlock('ansi', `\u001b[0m\u001b[1;31mVous n'êtes pas l'auteur de cette commande`);
                    interaction.reply({content: reponse, ephemeral: true});
                }
                //endregion
            }  else if (interaction.customId.includes('matiere_premiere') === true) {
                //region Matières premières
                menuConsommation("edit", interaction, connection, armeeObject , batimentObject, gouvernementObject, populationObject, regionObject);
                //endregion
            } else if (interaction.customId.includes('ressource_manufacture') === true) {
                //region Ressources manufacturées
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

                    //region Calcul du taux d'emploie
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
                    function convertMillisecondsToTime(milliseconds) {
                        const seconds = Math.floor(milliseconds / 1000);
                        const hours = Math.floor(seconds / 3600);
                        return `${hours}h`;
                    }
                    let Prod;
                    let Conso;
                    let Diff;

                    let acierName;
                    const conso_T_acierie_charbon = Math.round(batimentObject.acierie.CONSO_ACIERIE_CHARBON * Batiment.acierie * eval(`gouvernementObject.${Pays.ideologie}.consommation`) * emplois);
                    const conso_T_acierie_metaux = Math.round(batimentObject.acierie.CONSO_ACIERIE_METAUX * Batiment.acierie * eval(`gouvernementObject.${Pays.ideologie}.consommation`) * emplois);
                    if (conso_T_acierie_charbon > Ressources.charbon) {
                        acierName = `> ⚠️ Acier : ⚠️`;
                    } else if (conso_T_acierie_metaux > Ressources.metaux) {
                        acierName = `> ⚠️ Acier : ⚠️`;
                    } else if (prod_elec < conso_elec) {
                        acierName = `> 🪫 Acier : 🪫`;
                    } else if (emplois < 0.5) {
                        acierName = `> 🚷 Acier : 🚷`;
                    } else {
                        acierName = `> <:acier:1075776411329122304> Acier :`;
                    }
                    let Acier;
                    Prod = Math.round(batimentObject.acierie.PROD_ACIERIE * Batiment.acierie * eval(`gouvernementObject.${Pays.ideologie}.production`) * emplois);
                    Conso = 0
                    Diff = Prod - Conso;
                    if (Diff / Prod > 0.1) {
                        Acier = codeBlock('md', `> -${Conso.toLocaleString('en-US')} | +${Prod.toLocaleString('en-US')} | :${Diff.toLocaleString('en-US')}" | 📦 ${Ressources.acier.toLocaleString('en-US')} | 🟩 ∞`);
                    } else if (Diff / Prod >= 0) {
                        Acier = codeBlock('ansi', `\u001b[0;0m\u001b[1;33m> -${Conso.toLocaleString('en-US')} | +${Prod.toLocaleString('en-US')} | :${Diff.toLocaleString('en-US')} | 📦 ${Ressources.acier.toLocaleString('en-US')} | 🟩 ∞`);
                    } else {
                        Acier = codeBlock('ansi', `\u001b[0;0m\u001b[1;31m> -${Conso.toLocaleString('en-US')} | +${Prod.toLocaleString('en-US')} | :${Diff.toLocaleString('en-US')} | 📦 ${Ressources.acier.toLocaleString('en-US')} | 🟩 ∞`);
                    }

                    let betonName;
                    const conso_T_cimenterie_eau = Math.round(batimentObject.cimenterie.CONSO_CIMENTERIE_EAU * Batiment.cimenterie * eval(`gouvernementObject.${Pays.ideologie}.consommation`) * emplois);
                    const conso_T_cimenterie_petrole = Math.round(batimentObject.cimenterie.CONSO_CIMENTERIE_PETROLE * Batiment.cimenterie * eval(`gouvernementObject.${Pays.ideologie}.consommation`) * emplois);
                    const conso_T_cimenterie_sable = Math.round(batimentObject.cimenterie.CONSO_CIMENTERIE_SABLE * Batiment.cimenterie * eval(`gouvernementObject.${Pays.ideologie}.consommation`) * emplois);
                    if (conso_T_cimenterie_eau > Ressources.eau) {
                        betonName = `> ⚠️ Béton : ⚠️`;
                    } else if (conso_T_cimenterie_petrole > Ressources.petrole) {
                        betonName = `> ⚠️ Béton : ⚠️`;
                    } else if (conso_T_cimenterie_sable > Ressources.sable) {
                        betonName = `> ⚠️ Béton : ⚠️`;
                    } else if (prod_elec < conso_elec) {
                        betonName = `> 🪫 Béton : 🪫`;
                    } else if (emplois < 0.5) {
                        betonName = `> 🚷 Béton : 🚷`;
                    } else {
                        betonName = `> <:beton:1075776342227943526> Béton :`;
                    }
                    let Beton;
                    Prod = Math.round(batimentObject.cimenterie.PROD_CIMENTERIE * Batiment.cimenterie * eval(`gouvernementObject.${Pays.ideologie}.production`) * emplois);
                    Conso = 0
                    Diff = Prod - Conso;
                    if (Prod / Conso > 1.1) {
                        Beton = codeBlock('md', `> -${Conso.toLocaleString('en-US')} | +${Prod.toLocaleString('en-US')} | :${Diff.toLocaleString('en-US')}" | 📦 ${Ressources.beton.toLocaleString('en-US')} | 🟩 ∞`);
                    } else if (Prod / Conso >= 1) {
                        Beton = codeBlock('ansi', `\u001b[0;0m\u001b[1;33m> -${Conso.toLocaleString('en-US')} | +${Prod.toLocaleString('en-US')} | :${Diff.toLocaleString('en-US')} | 📦 ${Ressources.beton.toLocaleString('en-US')} | 🟩 ∞`);
                    } else {
                        Beton = codeBlock('ansi', `\u001b[0;0m\u001b[1;31m> -${Conso.toLocaleString('en-US')} | +${Prod.toLocaleString('en-US')} | :${Diff.toLocaleString('en-US')} | 📦 ${Ressources.beton.toLocaleString('en-US')} | 🟩 ∞`);
                    }

                    let carburantName;
                    const conso_T_raffinerie_petrole = Math.round(batimentObject.raffinerie.CONSO_RAFFINERIE_PETROLE * Batiment.raffinerie * eval(`gouvernementObject.${Pays.ideologie}.consommation`) * emplois);
                    if (conso_T_raffinerie_petrole > Ressources.petrole) {
                        carburantName = `> ⚠️ Carburant : ⚠️`;
                    } else if (prod_elec < conso_elec) {
                        carburantName = `> 🪫 Carburant : 🪫`;
                    } else if (emplois < 0.5) {
                        carburantName = `> 🚷 Carburant : 🚷`;
                    } else {
                        carburantName = `> ⛽ Carburant :`;
                    }
                    let Carburant;
                    Prod = Math.round(batimentObject.raffinerie.PROD_RAFFINERIE * Batiment.raffinerie * eval(`gouvernementObject.${Pays.ideologie}.production`) * emplois);
                    const conso_T_carriere_sable_carburant = Math.round(batimentObject.carriere_sable.CONSO_CARRIERE_SABLE_CARBURANT * Batiment.carriere_sable * eval(`gouvernementObject.${Pays.ideologie}.consommation`) * emplois);
                    const conso_T_champ_carburant = Math.round(batimentObject.champ.CONSO_CHAMP_CARBURANT * Batiment.champ * eval(`gouvernementObject.${Pays.ideologie}.consommation`) * emplois);
                    const conso_T_mine_charbon_carburant = Math.round(batimentObject.mine_charbon.CONSO_MINE_CHARBON_CARBURANT * Batiment.mine_charbon * eval(`gouvernementObject.${Pays.ideologie}.consommation`) * emplois);
                    const conso_T_mine_metaux_carburant = Math.round(batimentObject.mine_metaux.CONSO_MINE_METAUX_CARBURANT * Batiment.mine_metaux * eval(`gouvernementObject.${Pays.ideologie}.consommation`) * emplois);
                    const conso_T_station_pompage_carburant = Math.round(batimentObject.station_pompage.CONSO_STATION_POMPAGE_CARBURANT * Batiment.station_pompage * eval(`gouvernementObject.${Pays.ideologie}.consommation`) * emplois);
                    const conso_T_scierie_carburant = Math.round(batimentObject.scierie.CONSO_SCIERIE_CARBURANT * Batiment.scierie * eval(`gouvernementObject.${Pays.ideologie}.consommation`) * emplois);
                    Conso = conso_T_carriere_sable_carburant + conso_T_centrale_fioul_carburant + conso_T_champ_carburant + conso_T_mine_charbon_carburant + conso_T_mine_metaux_carburant + conso_T_station_pompage_carburant + conso_T_scierie_carburant;
                    Diff = Prod - Conso;
                    if (Diff / Prod > 0.1) {
                        Carburant = codeBlock('md', `> -${Conso.toLocaleString('en-US')} | +${Prod.toLocaleString('en-US')} | :${Diff.toLocaleString('en-US')}" | 📦 ${Ressources.carburant.toLocaleString('en-US')} | 🟩 ∞`);
                    } else if (Diff / Prod >= 0) {
                        Carburant = codeBlock('ansi', `\u001b[0;0m\u001b[1;33m> -${Conso.toLocaleString('en-US')} | +${Prod.toLocaleString('en-US')} | :${Diff.toLocaleString('en-US')} | 📦 ${Ressources.carburant.toLocaleString('en-US')} | 🟨 ∞`);
                    } else {
                        Carburant = codeBlock('ansi', `\u001b[0;0m\u001b[1;31m> -${Conso.toLocaleString('en-US')} | +${Prod.toLocaleString('en-US')} | :${Diff.toLocaleString('en-US')} | 📦 ${Ressources.carburant.toLocaleString('en-US')} | 🟥⌛ ${convertMillisecondsToTime(Math.floor(- Ressources.carburant / Diff) * 10 * 60 * 1000)}`);
                    }

                    let verreName;
                    const conso_T_atelier_verre_eau = Math.round(batimentObject.atelier_verre.CONSO_ATELIER_VERRE_EAU * Batiment.atelier_verre * eval(`gouvernementObject.${Pays.ideologie}.consommation`) * emplois);
                    const conso_T_atelier_verre_sable = Math.round(batimentObject.atelier_verre.CONSO_ATELIER_VERRE_SABLE * Batiment.atelier_verre * eval(`gouvernementObject.${Pays.ideologie}.consommation`) * emplois);
                    if (conso_T_atelier_verre_eau > Ressources.eau) {
                        verreName = `> ⚠️ Verre : ⚠️`;
                    } else if (conso_T_atelier_verre_sable > Ressources.sable) {
                        verreName = `> ⚠️ Verre : ⚠️`;
                    } else if (prod_elec < conso_elec) {
                        verreName = `> 🪫 Verre : 🪫`;
                    } else if (emplois < 0.5) {
                        verreName = `> 🚷 Verre : 🚷`;
                    } else {
                        verreName = `> 🪟 Verre :`;
                    }
                    let Verre;
                    Prod = Math.round(batimentObject.atelier_verre.PROD_ATELIER_VERRE * Batiment.atelier_verre * eval(`gouvernementObject.${Pays.ideologie}.production`) * emplois);
                    const conso_T_usine_civile_verre = Math.round(batimentObject.usine_civile.CONSO_USINE_CIVILE_VERRE * Batiment.usine_civile * eval(`gouvernementObject.${Pays.ideologie}.consommation`) * emplois);
                    Conso = conso_T_usine_civile_verre;
                    Diff = Prod - Conso;
                    if (Diff / Prod > 0.1) {
                        Verre = codeBlock('md', `> -${Conso.toLocaleString('en-US')} | +${Prod.toLocaleString('en-US')} | :${Diff.toLocaleString('en-US')}" | 📦 ${Ressources.verre.toLocaleString('en-US')} | 🟩 ∞`);
                    } else if (Diff / Prod >= 0) {
                        Verre = codeBlock('ansi', `\u001b[0;0m\u001b[1;33m> -${Conso.toLocaleString('en-US')} | +${Prod.toLocaleString('en-US')} | :${Diff.toLocaleString('en-US')} | 📦 ${Ressources.verre.toLocaleString('en-US')} | 🟨 ∞`);
                    } else {
                        Verre = codeBlock('ansi', `\u001b[0;0m\u001b[1;31m> -${Conso.toLocaleString('en-US')} | +${Prod.toLocaleString('en-US')} | :${Diff.toLocaleString('en-US')} | 📦 ${Ressources.verre.toLocaleString('en-US')} | 🟥⌛ ${convertMillisecondsToTime(Math.floor(- Ressources.verre / Diff) * 10 * 60 * 1000)}`);
                    }

                    const embed = {
                        author: {
                            name: `${Pays.rang} de ${Pays.nom}`,
                            icon_url: interaction.member.displayAvatarURL()
                        },
                        thumbnail: {
                            url: Pays.drapeau
                        },
                        title: `\`Consommation en : Ressources manufacturées\``,
                        fields: [
                            {
                                name: acierName,
                                value: Acier,
                            },
                            {
                                name: betonName,
                                value: Beton,
                            },
                            {
                                name: carburantName,
                                value: Carburant,
                            },
                            {
                                name: verreName,
                                value: Verre,
                            }
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
                                .setStyle(ButtonStyle.Primary)
                        ).addComponents(
                            new ButtonBuilder()
                                .setLabel(`Ressources manufacturés`)
                                .setCustomId('ressource_manufacture')
                                .setEmoji('<:acier:1075776411329122304>')
                                .setStyle(ButtonStyle.Secondary)
                                .setDisabled(true)
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

                    interaction.deferUpdate()
                    interaction.message.edit({embeds: [embed], components: [row] })
                });
                //endregion
            } else if (interaction.customId.includes('produit_manufacture') === true) {
                //region Produits manufacturés
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

                    //region Calcul du taux d'emploie
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
                    function convertMillisecondsToTime(milliseconds) {
                        const seconds = Math.floor(milliseconds / 1000);
                        const hours = Math.floor(seconds / 3600);
                        return `${hours}h`;
                    }
                    let Prod;
                    let Conso;
                    let Diff;

                    let bcName;
                    const conso_T_usine_civile_bois = Math.round(batimentObject.usine_civile.CONSO_USINE_CIVILE_BOIS * Batiment.usine_civile * eval(`gouvernementObject.${Pays.ideologie}.consommation`) * emplois);
                    const conso_T_usine_civile_metaux = Math.round(batimentObject.usine_civile.CONSO_USINE_CIVILE_METAUX * Batiment.usine_civile * eval(`gouvernementObject.${Pays.ideologie}.consommation`) * emplois);
                    const conso_T_usine_civile_petrole = Math.round(batimentObject.usine_civile.CONSO_USINE_CIVILE_PETROLE * Batiment.usine_civile * eval(`gouvernementObject.${Pays.ideologie}.consommation`) * emplois);
                    const conso_T_usine_civile_verre = Math.round(batimentObject.usine_civile.CONSO_USINE_CIVILE_VERRE * Batiment.usine_civile * eval(`gouvernementObject.${Pays.ideologie}.consommation`) * emplois);
                    if (conso_T_usine_civile_bois > Ressources.bois) {
                        bcName = `> ⚠️ Biens de consommation : ⚠️`;
                    } else if (conso_T_usine_civile_metaux > Ressources.metaux) {
                        bcName = `> ⚠️ Biens de consommation : ⚠️`;
                    } else if (conso_T_usine_civile_petrole > Ressources.petrole) {
                        bcName = `> ⚠️ Biens de consommation : ⚠️`;
                    } else if (conso_T_usine_civile_verre > Ressources.verre) {
                        bcName = `> ⚠️ Biens de consommation : ⚠️`;
                    } else if (prod_elec < conso_elec) {
                        bcName = `> 🪫 Biens de consommation : 🪫`;
                    } else if (emplois < 0.5) {
                        bcName = `> 🚷 Biens de consommation : 🚷`;
                    } else {
                        bcName = `> 💻 Biens de consommation :`;
                    }
                    let Bc;
                    Prod = Math.round(batimentObject.usine_civile.PROD_USINE_CIVILE * Batiment.usine_civile * eval(`gouvernementObject.${Pays.ideologie}.production`) * emplois);
                    Conso = Math.round((1 + Population.bc_acces * 0.04 + Population.bonheur * 0.016 + (Population.habitant / 10000000) * 0.04) * Population.habitant / 48 * eval(`gouvernementObject.${Pays.ideologie}.conso_bc`));
                    Diff = Prod - Conso;
                    if (Diff > 0) {
                        Bc = codeBlock('md', `> -${Conso.toLocaleString('en-US')} | +${Prod.toLocaleString('en-US')} | :${Diff.toLocaleString('en-US')}" | 📦 ${Ressources.bc.toLocaleString('en-US')} | 🟩 ∞`);
                    } else if (Diff === 0) {
                        Bc = codeBlock('ansi', `\u001b[0;0m\u001b[1;33m> -${Conso.toLocaleString('en-US')} | +${Prod.toLocaleString('en-US')} | :${Diff.toLocaleString('en-US')} | 📦 ${Ressources.bc.toLocaleString('en-US')} | 🟨 ∞`);
                    } else {
                        Bc = codeBlock('ansi', `\u001b[0;0m\u001b[1;31m> -${Conso.toLocaleString('en-US')} | +${Prod.toLocaleString('en-US')} | :${Diff.toLocaleString('en-US')} | 📦 ${Ressources.bc.toLocaleString('en-US')} | 🟥⌛ ${convertMillisecondsToTime(Math.floor(- Ressources.bc / Diff) * 10 * 60 * 1000)}`);
                    }

                    const embed = {
                        author: {
                            name: `${Pays.rang} de ${Pays.nom}`,
                            icon_url: interaction.member.displayAvatarURL()
                        },
                        thumbnail: {
                            url: Pays.drapeau
                        },
                        title: `\`Consommation en : Produits manufacturées\``,
                        fields: [
                            {
                                name: bcName,
                                value: Bc,
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
                                .setStyle(ButtonStyle.Primary)
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
                                .setStyle(ButtonStyle.Secondary)
                                .setDisabled(true)
                        )
                        .addComponents(
                            new ButtonBuilder()
                                .setLabel(`Autre`)
                                .setCustomId('autre')
                                .setEmoji('⚡')
                                .setStyle(ButtonStyle.Primary)
                        )

                    interaction.deferUpdate()
                    interaction.message.edit({embeds: [embed], components: [row] })
                });
                //endregion
            } else if (interaction.customId.includes('autre') === true) {
                //region Autres
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

                    //region Calcul du taux d'emploie
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

                    const coef_eolienne = eval(`regionObject.${Territoire.region}.eolienne`)

                    let Prod;
                    let Conso;
                    let Diff;
                    //region Production d'électricté des centrales biomasse
                    const conso_T_centrale_biomasse_bois = batimentObject.centrale_biomasse.CONSO_CENTRALE_BIOMASSE_BOIS * Batiment.centrale_biomasse
                    let prod_centrale = true;
                    if (conso_T_centrale_biomasse_bois > Ressources.bois && conso_T_centrale_biomasse_bois !== 0) {
                        prod_centrale = false;
                    }
                    const conso_T_centrale_biomasse_eau = batimentObject.centrale_biomasse.CONSO_CENTRALE_BIOMASSE_EAU * Batiment.centrale_biomasse
                    if (conso_T_centrale_biomasse_eau > Ressources.eau && conso_T_centrale_biomasse_eau !== 0) {
                        prod_centrale = false;
                    }
                    //endregion
                    //region Production d'électricté des centrales au charbon
                    const conso_T_centrale_charbon_charbon = batimentObject.centrale_charbon.CONSO_CENTRALE_CHARBON_CHARBON * Batiment.centrale_charbon
                    if (conso_T_centrale_charbon_charbon > Ressources.charbon && conso_T_centrale_charbon_charbon !== 0) {
                        prod_centrale = false;
                    }
                    const conso_T_centrale_charbon_eau = batimentObject.centrale_charbon.CONSO_CENTRALE_CHARBON_EAU * Batiment.centrale_charbon
                    if (conso_T_centrale_charbon_eau > Ressources.eau && conso_T_centrale_charbon_eau !== 0) {
                        prod_centrale = false;
                    }
                    //endregion
                    //region Production d'électricité des centrales au fioul
                    const conso_T_centrale_fioul_carburant = batimentObject.centrale_fioul.CONSO_CENTRALE_FIOUL_CARBURANT * Batiment.centrale_fioul
                    if (conso_T_centrale_fioul_carburant > Ressources.carburant && conso_T_centrale_fioul_carburant !== 0) {
                        prod_centrale = false;
                    }
                    const conso_T_centrale_fioul_eau = batimentObject.centrale_fioul.CONSO_CENTRALE_FIOUL_EAU * Batiment.centrale_fioul
                    if (conso_T_centrale_fioul_eau > Ressources.eau && conso_T_centrale_fioul_eau !== 0) {
                        prod_centrale = false;
                    }
                    //endregion

                    let elecName;
                    if (prod_centrale === false) {
                        elecName = `> ⚠️ Electricité : ⚠️`;
                    } else if (emplois < 0.5) {
                        elecName = `> 🚷 Electricité : 🚷`;
                    } else {
                        elecName = `> ⚡ Electricité :`;
                    }
                    let Electricite;
                    Prod = batimentObject.centrale_biomasse.PROD_CENTRALE_BIOMASSE * Batiment.centrale_biomasse + batimentObject.centrale_charbon.PROD_CENTRALE_CHARBON * Batiment.centrale_charbon + batimentObject.centrale_fioul.PROD_CENTRALE_FIOUL * Batiment.centrale_fioul + Math.round(batimentObject.eolienne.PROD_EOLIENNE * Batiment.eolienne * coef_eolienne);
                    Conso = Math.round(
                        (batimentObject.acierie.CONSO_ACIERIE_ELEC * Batiment.acierie +
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
                        batimentObject.usine_civile.CONSO_USINE_CIVILE_ELEC * Batiment.usine_civile)
                    );
                    Diff = Prod - Conso;
                    if (Diff / Prod > 0.1) {
                        Electricite = codeBlock('md', `> ${Conso.toLocaleString('en-US')}/${Prod.toLocaleString('en-US')} | ${Diff.toLocaleString('en-US')}" | 🟩 ∞`);
                    } else if (Diff / Prod >= 0) {
                        Electricite = codeBlock('ansi', `\u001b[0;0m\u001b[1;33m> ${Conso.toLocaleString('en-US')}/${Prod.toLocaleString('en-US')} | ${Diff.toLocaleString('en-US')} | 🟨 ∞`);
                    } else {
                        Electricite = codeBlock('ansi', `\u001b[0;0m\u001b[1;31m> ${Conso.toLocaleString('en-US')}/${Prod.toLocaleString('en-US')} | ${Diff.toLocaleString('en-US')} | 🟥`);
                    }

                    const embed = {
                        author: {
                            name: `${Pays.rang} de ${Pays.nom}`,
                            icon_url: interaction.member.displayAvatarURL()
                        },
                        thumbnail: {
                            url: Pays.drapeau
                        },
                        title: `\`Consommation en : Autre\``,
                        fields: [
                            {
                                name: elecName,
                                value: Electricite,
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
                                .setStyle(ButtonStyle.Primary)
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
                                .setStyle(ButtonStyle.Secondary)
                                .setDisabled(true)
                        )

                    interaction.deferUpdate()
                    interaction.message.edit({embeds: [embed], components: [row] })
                });
                //endregion
            } else if (interaction.customId === 'ressources') {
                //region Ressources
                const sql = `
                    SELECT * FROM batiments WHERE id_joueur='${interaction.member.id}';
                    SELECT * FROM pays WHERE id_joueur='${interaction.member.id}';
                    SELECT * FROM ressources WHERE id_joueur='${interaction.member.id}';
                    SELECT * FROM territoire WHERE id_joueur='${interaction.member.id}';
                `;
                connection.query(sql, async(err, results) => {if (err) {throw err;}
                    const Pays = results[1][0];
                    const Ressources = results[2][0];
                    const Territoire = results[3][0];

                    //region Calcul des coefficients de production des ressources
                    const coef_bois = eval(`regionObject.${Territoire.region}.bois`)
                    const coef_charbon = eval(`regionObject.${Territoire.region}.charbon`)
                    const coef_eau = eval(`regionObject.${Territoire.region}.eau`)
                    const coef_metaux = eval(`regionObject.${Territoire.region}.metaux`)
                    const coef_nourriture = eval(`regionObject.${Territoire.region}.nourriture`)
                    const coef_petrole = eval(`regionObject.${Territoire.region}.petrole`)
                    const coef_sable = eval(`regionObject.${Territoire.region}.sable`)
                    //endregion

                    const embed = {
                        author: {
                            name: `${Pays.rang} de ${Pays.nom}`,
                            icon_url: interaction.member.displayAvatarURL()
                        },
                        thumbnail: {
                            url: Pays.drapeau
                        },
                        title: `\`Ressources\``,
                        fields: [
                            {
                                name: `> <:acier:1075776411329122304> Acier :`,
                                value: codeBlock(`• ${Ressources.acier.toLocaleString('en-US')}`)
                            },
                            {
                                name: `> <:beton:1075776342227943526> Béton :`,
                                value: codeBlock(`• ${Ressources.beton.toLocaleString('en-US')}`)
                            },
                            {
                                name: `> \uD83D\uDCBB Biens de consommation :`,
                                value: codeBlock(`• ${Ressources.bc.toLocaleString('en-US')}`)
                            },
                            {
                                name: `> 🪵 Bois : ⛏️ x${coef_bois}`,
                                value: codeBlock(`• ${Ressources.bois.toLocaleString('en-US')}`)
                            },
                            {
                                name: `> ⛽ Carburant :`,
                                value: codeBlock(`• ${Ressources.carburant.toLocaleString('en-US')}`)
                            },
                            {
                                name: `> <:charbon:1075776385517375638> Charbon : ⛏️ x${coef_charbon}`,
                                value: codeBlock(`• ${Ressources.charbon.toLocaleString('en-US')}`)
                            },
                            {
                                name: `> 💧 Eau : ⛏️ x${coef_eau}`,
                                value: codeBlock(`• ${Ressources.eau.toLocaleString('en-US')}`)
                            },
                            {
                                name: `> <:windmill:1108767955442991225> Eolienne :`,
                                value: codeBlock(`• ${Ressources.eolienne.toLocaleString('en-US')}`)
                            },
                            {
                                name: `> 🪨 Metaux : ⛏️ x${coef_metaux}`,
                                value: codeBlock(`• ${Ressources.metaux.toLocaleString('en-US')}`)
                            },
                            {
                                name: `> 🌽 Nourriture : ⛏️ x${coef_nourriture}`,
                                value: codeBlock(`• ${Ressources.nourriture.toLocaleString('en-US')}`)
                            },
                            {
                                name: `> 🛢️ Pétrole : ⛏️ x${coef_petrole}`,
                                value: codeBlock(`• ${Ressources.petrole.toLocaleString('en-US')}`)
                            },
                            {
                                name: `> <:sable:1075776363782479873> Sable : ⛏️ x${coef_sable}`,
                                value: codeBlock(`• ${Ressources.sable.toLocaleString('en-US')}`)
                            },
                            {
                                name: `> 🪟 Verre :`,
                                value: codeBlock(`• ${Ressources.verre.toLocaleString('en-US')}`)
                            },
                        ],
                        color: interaction.member.displayColor,
                        timestamp: new Date(),
                        footer: { text: Pays.devise }
                    };

                    interaction.deferUpdate()
                    interaction.message.edit({embeds: [embed]})
                });
                //endregion
            } else if (interaction.customId === 'militaire') {
                //region Militaire
                const sql = `
                    SELECT * FROM armee WHERE id_joueur='${interaction.member.id}';
                    SELECT * FROM pays WHERE id_joueur='${interaction.member.id}';
                `;
                connection.query(sql, async(err, results) => {if (err) {throw err;}
                    const Armee = results[0][0];
                    const Pays = results[1][0];

                    const embed = {
                        author: {
                            name: `${Pays.rang} de ${Pays.nom}`,
                            icon_url: interaction.member.displayAvatarURL()
                        },
                        thumbnail: {
                            url: Pays.drapeau
                        },
                        title: `\`Militaire\``,
                        fields: [
                            {
                                name: `> <:avion:1123611379522347048> Avion :`,
                                value: codeBlock(`• ${Armee.avion.toLocaleString('en-US')}`)
                            },
                            {
                                name: `> 📡 Equipement de support :`,
                                value: codeBlock(`• ${Armee.equipement_support.toLocaleString('en-US')}`)
                            },
                            {
                                name: `> <:materieldinfanterie:1123611393535512626> Matériel d'infanterie :`,
                                value: codeBlock(`• ${Armee.materiel_infanterie.toLocaleString('en-US')}`)
                            },
                            {
                                name: `> <:vehicule:1123611407573860362> Véhicule :`,
                                value: codeBlock(`• ${Armee.vehicule.toLocaleString('en-US')}`)
                            }
                        ],
                        color: interaction.member.displayColor,
                        timestamp: new Date(),
                        footer: { text: Pays.devise }
                    };

                    interaction.deferUpdate()
                    interaction.message.edit({embeds: [embed]})
                });
                //endregion
            } else if ((interaction.customId.includes('unite-') || interaction.customId.includes('unite+')) === true) {
                //region Définir Unité
                quantite = parseInt(interaction.customId.slice(5));

                let sql = `
                    SELECT * FROM armee WHERE id_joueur='${interaction.member.id}'
                `;
                connection.query(sql, async(err, results) => {if (err) {throw err;}
                    const Armee = results[0];

                    sql = `UPDATE armee SET unite=unite+${quantite},
                                            aviation=aviation-${(quantite * eval(`armeeObject.${Armee.strategie}.aviation`))},
                                            infanterie=infanterie-${(quantite * eval(`armeeObject.${Armee.strategie}.infanterie`))},
                                            mecanise=mecanise-${(quantite * eval(`armeeObject.${Armee.strategie}.mecanise`))},
                                            support=support-${(quantite * eval(`armeeObject.${Armee.strategie}.support`))} WHERE id_joueur='${interaction.member.id}'`;
                    connection.query(sql, async(err) => { if (err) { throw err; } });
                })
                await wait(1000)
                sql = `
                    SELECT * FROM armee WHERE id_joueur='${interaction.member.id}';
                    SELECT * FROM pays WHERE id_joueur='${interaction.member.id}'
                `;
                connection.query(sql, async(err, results) => {if (err) {throw err;}
                    const Armee = results[0][0];
                    const Pays = results[1][0];
                    const homme = (Armee.aviation * armeeObject.aviation.homme) + (Armee.infanterie * armeeObject.infanterie.homme) + (Armee.mecanise * armeeObject.mecanise.homme) + (Armee.support * armeeObject.support.homme);
                    const hommeUnite =
                        Armee.unite * eval(`armeeObject.${Armee.strategie}.aviation`) * eval(`armeeObject.aviation.homme`) +
                        Armee.unite * eval(`armeeObject.${Armee.strategie}.infanterie`) * eval(`armeeObject.infanterie.homme`) +
                        Armee.unite * eval(`armeeObject.${Armee.strategie}.mecanise`) * eval(`armeeObject.mecanise.homme`) +
                        Armee.unite * eval(`armeeObject.${Armee.strategie}.support`) * eval(`armeeObject.support.homme`);


                    const embed = {
                        author: {
                            name: `${Pays.rang} de ${Pays.nom}`,
                            icon_url: interaction.member.displayAvatarURL()
                        },
                        thumbnail: {
                            url: Pays.drapeau
                        },
                        title: `\`Menu de mobilisation\``,
                        fields: [
                            {
                                name: `> 🪖 Unités : opérationnelles | réserves`,
                                value: codeBlock(
                                    `• Unité : ${Armee.unite.toLocaleString('en-US')} | ${Math.floor(Math.min((Armee.aviation/eval(`armeeObject.${Armee.strategie}.aviation`)), (Armee.infanterie/eval(`armeeObject.${Armee.strategie}.infanterie`)), (Armee.mecanise/eval(`armeeObject.${Armee.strategie}.mecanise`)), (Armee.support/eval(`armeeObject.${Armee.strategie}.support`)))).toLocaleString('en-US')}\n` +
                                    ` dont :\n` +
                                    `  • Aviation : ${(Armee.unite * eval(`armeeObject.${Armee.strategie}.aviation`)).toLocaleString('en-US')} | ${Armee.aviation.toLocaleString('en-US')}\n` +
                                    `  • Infanterie : ${(Armee.unite * eval(`armeeObject.${Armee.strategie}.infanterie`)).toLocaleString('en-US')} | ${Armee.infanterie.toLocaleString('en-US')}\n` +
                                    `  • Mécanisé : ${(Armee.unite * eval(`armeeObject.${Armee.strategie}.mecanise`)).toLocaleString('en-US')} | ${Armee.mecanise.toLocaleString('en-US')}\n` +
                                    `  • Support : ${(Armee.unite * eval(`armeeObject.${Armee.strategie}.support`)).toLocaleString('en-US')} | ${Armee.support.toLocaleString('en-US')}\n` +
                                    `‎\n` +
                                    `  • Homme : ${hommeUnite.toLocaleString('en-US')} | ${homme.toLocaleString('en-US')}`) + `\u200B`
                            },
                        ],
                        color: interaction.member.displayColor,
                        timestamp: new Date(),
                        footer: {
                            text: `${Pays.devise}`
                        },
                    };
                    const unitePossible = Math.floor(Math.min((Armee.aviation/eval(`armeeObject.${Armee.strategie}.aviation`)), (Armee.infanterie/eval(`armeeObject.${Armee.strategie}.infanterie`)), (Armee.mecanise/eval(`armeeObject.${Armee.strategie}.mecanise`)), (Armee.support/eval(`armeeObject.${Armee.strategie}.support`))));
                    let plusDix = false;
                    if (unitePossible < 10) {
                        plusDix = true;
                    }
                    let plusUn = false;
                    if (unitePossible < 1) {
                        plusUn = true;
                    }
                    let moinsDix = false;
                    if (Armee.unite < 10) {
                        moinsDix = true;
                    }
                    let moinsUn = false;
                    if (Armee.unite < 1) {
                        moinsUn = true;
                    }

                    const row1 = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setLabel(`10`)
                                .setCustomId('unite+10')
                                .setEmoji('➕')
                                .setStyle(ButtonStyle.Success)
                                .setDisabled(plusDix)
                        )
                        .addComponents(
                            new ButtonBuilder()
                                .setLabel(`1`)
                                .setCustomId('unite+1')
                                .setEmoji('➕')
                                .setStyle(ButtonStyle.Success)
                                .setDisabled(plusUn)
                        )
                        .addComponents(
                            new ButtonBuilder()
                                .setEmoji(`🪖`)
                                .setCustomId('unite')
                                .setStyle(ButtonStyle.Secondary)
                                .setDisabled(true)
                        )
                        .addComponents(
                            new ButtonBuilder()
                                .setLabel(`1`)
                                .setCustomId('unite-1')
                                .setEmoji('➖')
                                .setStyle(ButtonStyle.Danger)
                                .setDisabled(moinsUn)
                        )
                        .addComponents(
                            new ButtonBuilder()
                                .setLabel(`10`)
                                .setCustomId('unite-10')
                                .setEmoji('➖')
                                .setStyle(ButtonStyle.Danger)
                                .setDisabled(moinsDix)
                        )

                    interaction.deferUpdate()
                    interaction.message.edit({embeds: [embed], components: [row1]})
                });
                //endregion
            } else if (interaction.customId.includes('assaut_masse') === true) {
                //region Assaut de masse
                sql = `
                    SELECT * FROM armee WHERE id_joueur='${interaction.member.id}';
                    SELECT * FROM pays WHERE id_joueur='${interaction.member.id}';
                `;
                connection.query(sql, async(err, results) => {if (err) {throw err;}
                    const Armee = results[0][0];
                    const Pays = results[1][0];

                    const embed = {
                        author: {
                            name: `${Pays.rang} de ${Pays.nom}`,
                            icon_url: interaction.member.displayAvatarURL()
                        },
                        thumbnail: {
                            url: Pays.drapeau
                        },
                        title: `\`Menu des stratégies\``,
                        fields: [
                            {
                                name: `> ♟️ Assaut de masse`,
                                value: codeBlock(
                                    `  • Aviation : ${eval(`armeeObject.assaut_masse.aviation`)}\n` +
                                    `  • Infanterie : ${eval(`armeeObject.assaut_masse.infanterie`)}\n` +
                                    `  • Mécanisé : ${eval(`armeeObject.assaut_masse.mecanise`)}\n` +
                                    `  • Support : ${eval(`armeeObject.assaut_masse.support`)}\n`) + `\u200B`
                            },
                        ],
                        color: interaction.member.displayColor,
                        timestamp: new Date(),
                        footer: {
                            text: Pays.devise
                        },
                    };
                    const userCooldowned = await strategieCommandCooldown.getUser(interaction.member.id);
                    let choisir
                    if (Armee.strategie === 'assaut_masse') {
                        choisir = true
                    } else if (userCooldowned) {
                        choisir = true
                    } else {
                        choisir = false
                    }

                    const row = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setLabel(`Assaut de masse`)
                                .setCustomId('assaut_masse')
                                .setEmoji('💯')
                                .setStyle(ButtonStyle.Secondary)
                                .setDisabled(true)
                        )
                        .addComponents(
                            new ButtonBuilder()
                                .setLabel(`Défense`)
                                .setCustomId('defense')
                                .setEmoji('🛡️')
                                .setStyle(ButtonStyle.Primary)
                        )
                        .addComponents(
                            new ButtonBuilder()
                                .setLabel(`Motorisation`)
                                .setCustomId('motorisation')
                                .setEmoji('🛞')
                                .setStyle(ButtonStyle.Primary)
                        )
                        .addComponents(
                            new ButtonBuilder()
                                .setLabel(`Puissance de feu`)
                                .setCustomId('puissance_feu')
                                .setEmoji('💥')
                                .setStyle(ButtonStyle.Primary)
                        )

                    const row1 = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setLabel(`Choisir cette stratégie`)
                                .setCustomId('choisir')
                                .setStyle(ButtonStyle.Success)
                                .setDisabled(choisir)
                        )

                    interaction.message.edit({ embeds: [embed], components: [row, row1] });
                    interaction.deferUpdate()
                });
                //endregion
            } else if (interaction.customId.includes('defense') === true) {
                //region Défense
                sql = `
                    SELECT * FROM armee WHERE id_joueur='${interaction.member.id}';
                    SELECT * FROM pays WHERE id_joueur='${interaction.member.id}';
                `;
                connection.query(sql, async(err, results) => {if (err) {throw err;}
                    const Armee = results[0][0];
                    const Pays = results[1][0];

                    const embed = {
                        author: {
                            name: `${Pays.rang} de ${Pays.nom}`,
                            icon_url: interaction.member.displayAvatarURL()
                        },
                        thumbnail: {
                            url: Pays.drapeau
                        },
                        title: `\`Menu des stratégies\``,
                        fields: [
                            {
                                name: `> ♟️ Défense`,
                                value: codeBlock(
                                    `  • Aviation : ${eval(`armeeObject.defense.aviation`)}\n` +
                                    `  • Infanterie : ${eval(`armeeObject.defense.infanterie`)}\n` +
                                    `  • Mécanisé : ${eval(`armeeObject.defense.mecanise`)}\n` +
                                    `  • Support : ${eval(`armeeObject.defense.support`)}\n`) + `\u200B`
                            },
                        ],
                        color: interaction.member.displayColor,
                        timestamp: new Date(),
                        footer: {
                            text: `${Pays.devise}`
                        },
                    };
                    const userCooldowned = await strategieCommandCooldown.getUser(interaction.member.id);
                    let choisir
                    if (Armee.strategie === 'defense') {
                        choisir = true
                    } else if (userCooldowned) {
                        choisir = true
                    } else {
                        choisir = false
                    };

                    const row = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setLabel(`Assaut de masse`)
                                .setCustomId('assaut_masse')
                                .setEmoji('💯')
                                .setStyle(ButtonStyle.Primary)
                        )
                        .addComponents(
                            new ButtonBuilder()
                                .setLabel(`Défense`)
                                .setCustomId('defense')
                                .setEmoji('🛡️')
                                .setStyle(ButtonStyle.Secondary)
                                .setDisabled(true)
                        )
                        .addComponents(
                            new ButtonBuilder()
                                .setLabel(`Motorisation`)
                                .setCustomId('motorisation')
                                .setEmoji('🛞')
                                .setStyle(ButtonStyle.Primary)
                        )
                        .addComponents(
                            new ButtonBuilder()
                                .setLabel(`Puissance de feu`)
                                .setCustomId('puissance_feu')
                                .setEmoji('💥')
                                .setStyle(ButtonStyle.Primary)
                        )

                    const row1 = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setLabel(`Choisir cette stratégie`)
                                .setCustomId('choisir')
                                .setStyle(ButtonStyle.Success)
                                .setDisabled(choisir)
                        )

                    interaction.message.edit({ embeds: [embed], components: [row, row1] });
                    interaction.deferUpdate()
                });
                //endregion
            } else if (interaction.customId.includes('motorisation') === true) {
                //region Motorisation
                sql = `
                    SELECT * FROM armee WHERE id_joueur='${interaction.member.id}';
                    SELECT * FROM pays WHERE id_joueur='${interaction.member.id}';
                `;
                connection.query(sql, async(err, results) => {if (err) {throw err;}
                    const Armee = results[0][0];
                    const Pays = results[1][0];

                    const embed = {
                        author: {
                            name: `${Pays.rang} de ${Pays.nom}`,
                            icon_url: interaction.member.displayAvatarURL()
                        },
                        thumbnail: {
                            url: Pays.drapeau
                        },
                        title: `\`Menu des stratégies\``,
                        fields: [
                            {
                                name: `> ♟️ Motorisation`,
                                value: codeBlock(
                                    `  • Aviation : ${eval(`armeeObject.motorisation.aviation`)}\n` +
                                    `  • Infanterie : ${eval(`armeeObject.motorisation.infanterie`)}\n` +
                                    `  • Mécanisé : ${eval(`armeeObject.motorisation.mecanise`)}\n` +
                                    `  • Support : ${eval(`armeeObject.motorisation.support`)}\n`) + `\u200B`
                            },
                        ],
                        color: interaction.member.displayColor,
                        timestamp: new Date(),
                        footer: {
                            text: `${Pays.devise}`
                        },
                    };
                    const userCooldowned = await strategieCommandCooldown.getUser(interaction.member.id);
                    let choisir
                    if (Armee.strategie === 'motorisation') {
                        choisir = true
                    } else if (userCooldowned) {
                        choisir = true
                    } else {
                        choisir = false
                    };

                    const row = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setLabel(`Assaut de masse`)
                                .setCustomId('assaut_masse')
                                .setEmoji('💯')
                                .setStyle(ButtonStyle.Primary)
                        )
                        .addComponents(
                            new ButtonBuilder()
                                .setLabel(`Défense`)
                                .setCustomId('defense')
                                .setEmoji('🛡️')
                                .setStyle(ButtonStyle.Primary)
                        )
                        .addComponents(
                            new ButtonBuilder()
                                .setLabel(`Motorisation`)
                                .setCustomId('motorisation')
                                .setEmoji('🛞')
                                .setStyle(ButtonStyle.Secondary)
                                .setDisabled(true)
                        )
                        .addComponents(
                            new ButtonBuilder()
                                .setLabel(`Puissance de feu`)
                                .setCustomId('puissance_feu')
                                .setEmoji('💥')
                                .setStyle(ButtonStyle.Primary)
                        )

                    const row1 = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setLabel(`Choisir cette stratégie`)
                                .setCustomId('choisir')
                                .setStyle(ButtonStyle.Success)
                                .setDisabled(choisir)
                        )

                    interaction.message.edit({ embeds: [embed], components: [row, row1] });
                    interaction.deferUpdate()
                });
                //endregion
            } else if (interaction.customId.includes('puissance_feu') === true) {
                //region Puissance de feu
                sql = `
                    SELECT * FROM armee WHERE id_joueur='${interaction.member.id}';
                    SELECT * FROM pays WHERE id_joueur='${interaction.member.id}';
                `;
                connection.query(sql, async(err, results) => {if (err) {throw err;}
                    const Armee = results[0][0];
                    const Pays = results[1][0];

                    const embed = {
                        author: {
                            name: `${Pays.rang} de ${Pays.nom}`,
                            icon_url: interaction.member.displayAvatarURL()
                        },
                        thumbnail: {
                            url: Pays.drapeau
                        },
                        title: `\`Menu des stratégies\``,
                        fields: [
                            {
                                name: `> ♟️ Puissance de feu`,
                                value: codeBlock(
                                    `  • Aviation : ${eval(`armeeObject.puissance_feu.aviation`)}\n` +
                                    `  • Infanterie : ${eval(`armeeObject.puissance_feu.infanterie`)}\n` +
                                    `  • Mécanisé : ${eval(`armeeObject.puissance_feu.mecanise`)}\n` +
                                    `  • Support : ${eval(`armeeObject.puissance_feu.support`)}\n`) + `\u200B`
                            },
                        ],
                        color: interaction.member.displayColor,
                        timestamp: new Date(),
                        footer: {
                            text: `${Pays.devise}`
                        },
                    };
                    const userCooldowned = await strategieCommandCooldown.getUser(interaction.member.id);
                    let choisir
                    if (Armee.strategie === 'puissance_feu') {
                        choisir = true
                    } else if (userCooldowned) {
                        choisir = true
                    } else {
                        choisir = false
                    }

                    const row = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setLabel(`Assaut de masse`)
                                .setCustomId('assaut_masse')
                                .setEmoji('💯')
                                .setStyle(ButtonStyle.Primary)
                        )
                        .addComponents(
                            new ButtonBuilder()
                                .setLabel(`Défense`)
                                .setCustomId('defense')
                                .setEmoji('🛡️')
                                .setStyle(ButtonStyle.Primary)
                        )
                        .addComponents(
                            new ButtonBuilder()
                                .setLabel(`Motorisation`)
                                .setCustomId('motorisation')
                                .setEmoji('🛞')
                                .setStyle(ButtonStyle.Primary)
                        )
                        .addComponents(
                            new ButtonBuilder()
                                .setLabel(`Puissance de feu`)
                                .setCustomId('puissance_feu')
                                .setEmoji('💥')
                                .setStyle(ButtonStyle.Secondary)
                                .setDisabled(true)
                        )

                    const row1 = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setLabel(`Choisir cette stratégie`)
                                .setCustomId('choisir')
                                .setStyle(ButtonStyle.Success)
                                .setDisabled(choisir)
                        )

                    interaction.message.edit({ embeds: [embed], components: [row, row1] });
                    interaction.deferUpdate()
                });
                //endregion
            } else if (interaction.customId.includes('choisir') === true) {
                //region Choisir stratégie
                const strat = interaction.message.embeds[0].fields[0].name.slice(5);
                let nom;
                if (strat === 'Assaut de masse') {
                    nom = 'assaut_masse'
                } else if (strat === 'Défense') {
                    nom = 'defense'
                } else if (strat === 'Motorisation') {
                    nom = 'motorisation'
                } else if (strat === 'Puissance de feu') {
                    nom = 'puissance_feu'
                }

                sql = `
                    SELECT * FROM armee WHERE id_joueur='${interaction.member.id}';
                    SELECT * FROM pays WHERE id_joueur='${interaction.member.id}';
                `;
                connection.query(sql, async(err, results) => {if (err) {throw err;}
                    const Armee = results[0][0];
                    const aviation = eval(`armeeObject.${Armee.strategie}.aviation`) * Armee.unite;
                    const infanterie = eval(`armeeObject.${Armee.strategie}.infanterie`) * Armee.unite;
                    const mecanise = eval(`armeeObject.${Armee.strategie}.mecanise`) * Armee.unite;
                    const support = eval(`armeeObject.${Armee.strategie}.support`) * Armee.unite;
                    let sql = `UPDATE armee SET unite=0,
                                                aviation=aviation+${aviation},
                                                infanterie=infanterie+${infanterie},
                                                mecanise=mecanise+${mecanise},
                                                support=support+${support},
                                                strategie='${nom}' WHERE id_joueur='${interaction.member.id}'`;
                    connection.query(sql, async (err) => {if (err) {throw err;}});
                });
                await wait(1000)

                sql = `
                    SELECT * FROM armee WHERE id_joueur='${interaction.member.id}';
                    SELECT * FROM pays WHERE id_joueur='${interaction.member.id}';
                `;
                connection.query(sql, async(err, results) => {if (err) {throw err;}
                    const Armee = results[0][0];
                    const Pays = results[1][0];

                    const embed = {
                        author: {
                            name: `${Pays.rang} de ${Pays.nom}`,
                            icon_url: interaction.member.displayAvatarURL()
                        },
                        thumbnail: {
                            url: Pays.drapeau
                        },
                        title: `\`Menu des stratégies\``,
                        fields: [
                            {
                                name: `> ♟️ ${strat}`,
                                value: codeBlock(
                                    `Vous avez changé de stratégie. Vous pourrez la changer à nouveau dans 1 semaine.\n`) + `\u200B`
                            },
                        ],
                        color: interaction.member.displayColor,
                        timestamp: new Date(),
                        footer: {
                            text: `${Pays.devise}`
                        },
                    };
                    let assaut_masse = false;
                    let couleur1 = ButtonStyle.Primary;
                    if (Armee.strategie === 'assaut_masse') {
                        assaut_masse = true;
                        couleur1 = ButtonStyle.Secondary;
                    }
                    let defense = false;
                    let couleur2 = ButtonStyle.Primary;
                    if (Armee.strategie === 'defense') {
                        defense = true;
                        couleur2 = ButtonStyle.Secondary;
                    }
                    let motorisation = false;
                    let couleur3 = ButtonStyle.Primary;
                    if (Armee.strategie === 'motorisation') {
                        motorisation = true;
                        couleur3 = ButtonStyle.Secondary;
                    }
                    let puissance_feu = false;
                    let couleur4 = ButtonStyle.Primary;
                    if (Armee.strategie === 'puissance_feu') {
                        puissance_feu = true;
                        couleur4 = ButtonStyle.Secondary;
                    }

                    const row = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setLabel(`Assaut de masse`)
                                .setCustomId('assaut_masse')
                                .setEmoji('💯')
                                .setStyle(couleur1)
                                .setDisabled(assaut_masse)
                        )
                        .addComponents(
                            new ButtonBuilder()
                                .setLabel(`Défense`)
                                .setCustomId('defense')
                                .setEmoji('🛡️')
                                .setStyle(couleur2)
                                .setDisabled(defense)
                        )
                        .addComponents(
                            new ButtonBuilder()
                                .setLabel(`Motorisation`)
                                .setCustomId('motorisation')
                                .setEmoji('🛞')
                                .setStyle(couleur3)
                                .setDisabled(motorisation)
                        )
                        .addComponents(
                            new ButtonBuilder()
                                .setLabel(`Puissance de feu`)
                                .setCustomId('puissance_feu')
                                .setEmoji('💥')
                                .setStyle(couleur4)
                                .setDisabled(puissance_feu)
                        )

                    const row1 = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setLabel(`Choisir cette stratégie`)
                                .setCustomId('choisir')
                                .setStyle(ButtonStyle.Success)
                                .setDisabled(true)
                        )

                    await strategieCommandCooldown.addUser(interaction.member.id);
                    interaction.message.edit({ embeds: [embed], components: [row, row1] })
                    interaction.deferUpdate()
                });
                //endregion
            } else if (interaction.customId === "sortirvacances") {
            //region Sortir de vacances
                const sql = `
                    UPDATE pays SET vacances=0 WHERE id_joueur='${interaction.member.id}';
                `;
                connection.query(sql, async(err) => {if (err) {throw err;}
                    const reponse = codeBlock('md', `> Vous n'êtes plus en vacances, vous pouvez désormais utiliser des commandes.`);
                    interaction.message.edit({ content: reponse, components: [] });
                    interaction.deferUpdate()
                    await vacancesCommandCooldown.addUser(interaction.member.id);
                })
            //endregion
            } else if (interaction.customId.includes('raid') === true) {
                //region Raid
                id_joueur = interaction.customId.slice(5);
                let ArmeeA = interaction.message.embeds[0].fields[1].value
                ArmeeA = ArmeeA.slice(6, ArmeeA.length - 13)
                const sql = `
                    SELECT * FROM armee WHERE id_joueur='${id_joueur}';
                    SELECT * FROM batiments WHERE id_joueur='${id_joueur}';
                    SELECT * FROM pays WHERE id_joueur='${id_joueur}';
                    SELECT * FROM population WHERE id_joueur='${id_joueur}';
                    SELECT * FROM ressources WHERE id_joueur='${id_joueur}';
                    SELECT * FROM territoire WHERE id_joueur='${id_joueur}';
                    SELECT * FROM armee WHERE id_joueur='${interaction.member.id}';
                    SELECT * FROM pays WHERE id_joueur='${interaction.member.id}';
                    SELECT * FROM population WHERE id_joueur='${interaction.member.id}';
                `;
                connection.query(sql, async(err, results) => {if (err) {throw err;}
                    const ArmeeB = results[0][0];
                    const BatimentB = results[1][0];
                    const PaysB = results[2][0];
                    const PopulationB = results[3][0];
                    const RessourceB = results[4][0];
                    const TerritoireB = results[5][0];
                    const BDDA = results[6][0];
                    const PaysA = results[7][0];
                    const PopulationA = results[8][0];

                    const minArmee = 1100 * Math.min(ArmeeA, ArmeeB.unite);
                    const biomeNom = ['desert', 'foret', 'jungle', 'prairie', 'rocheuses', 'savane', 'steppe', 'taiga', 'toundra', 'ville'];
                    const biomeB_taille = [TerritoireB.desert, TerritoireB.foret, TerritoireB.jungle, TerritoireB.prairie, TerritoireB.rocheuses, TerritoireB.savane, TerritoireB.steppe, TerritoireB.taiga, TerritoireB.toundra, TerritoireB.ville]
                    const biomeB_max = biomeNom[biomeB_taille.indexOf(Math.max(...biomeB_taille))];
                    const biomeB_poids = [];
                    let tailleTotal = 0;
                    for (let i = 0; i < biomeB_taille.length; i++) {
                        if (biomeB_taille[i] < minArmee) {
                            biomeB_taille[i] = 0;
                        } else {
                            tailleTotal += biomeB_taille[i];
                        }
                    }
                    for (let i = 0; i < biomeB_taille.length; i++) {
                        biomeB_poids.push(biomeB_taille[i] / tailleTotal);
                    }
                    let biomeBataille;
                    if (tailleTotal === 0) {
                        biomeBataille = biomeB_max;
                    } else {
                        biomeBataille = chance.weighted(biomeNom, biomeB_poids);
                    }

                    const batimentNom = ['acierie', 'atelier_verre', 'carriere_sable', 'centrale_biomasse', 'centrale_charbon', 'centrale_fioul', 'champ', 'cimenterie', 'derrick', 'eolienne', 'mine_charbon', 'mine_metaux', 'station_pompage', 'quartier', 'raffinerie', 'scierie', 'usine_civile'];
                    const batimentNombre = [BatimentB.acierie, BatimentB.atelier_verre, BatimentB.carriere_sable, BatimentB.centrale_biomasse, BatimentB.centrale_charbon, BatimentB.centrale_fioul, BatimentB.champ, BatimentB.cimenterie, BatimentB.derrick, BatimentB.eolienne, BatimentB.mine_charbon, BatimentB.mine_metaux, BatimentB.station_pompage, BatimentB.quartier, BatimentB.raffinerie, BatimentB.scierie, BatimentB.usine_civile];
                    const batimentPoids = [];
                    for (let i = 0; i < batimentNombre.length; i++) {
                        batimentPoids.push(batimentNombre[i] / BatimentB.usine_total);
                    }
                    const batimentBataille = chance.weighted(batimentNom, batimentPoids);

                    let nomBatiment;
                    let ressource;
                    switch (batimentBataille) {
                        case 'acierie':
                            nomBatiment = 'Acierie';
                            ressource = 'acier';
                            break;
                        case 'atelier_verre':
                            nomBatiment = 'Atelier de verre';
                            ressource = 'verre';
                            break;
                        case 'carriere_sable':
                            nomBatiment = 'Carrière de sable';
                            ressource = 'sable';
                            break;
                        case 'centrale_biomasse':
                            nomBatiment = 'Centrale à biomasse';
                            ressource = 'none';
                            break;
                        case 'centrale_charbon':
                            nomBatiment = 'Centrale à charbon';
                            ressource = 'none';
                            break;
                        case 'centrale_fioul':
                            nomBatiment = 'Centrale à fioul';
                            ressource = 'none';
                            break;
                        case 'champ':
                            nomBatiment = 'Champ';
                            ressource = 'nourriture';
                            break;
                        case 'cimenterie':
                            nomBatiment = 'Cimenterie';
                            ressource = 'beton';
                            break;
                        case 'derrick':
                            nomBatiment = 'Derrick';
                            ressource = 'petrole';
                            break;
                        case 'eolienne':
                            nomBatiment = 'Éolienne';
                            ressource = 'none';
                            break;
                        case 'mine_charbon':
                            nomBatiment = 'Mine de charbon';
                            ressource = 'charbon';
                            break;
                        case 'mine_metaux':
                            nomBatiment = 'Mine de métaux';
                            ressource = 'metaux';
                            break;
                        case 'station_pompage':
                            nomBatiment = 'Station de pompage';
                            ressource = 'eau';
                            break;
                        case 'quartier':
                            nomBatiment = 'Quartier';
                            ressource = 'none';
                            break;
                        case 'raffinerie':
                            nomBatiment = 'Raffinerie';
                            ressource = 'carburant';
                            break;
                        case 'scierie':
                            nomBatiment = 'Scierie';
                            ressource = 'bois';
                            break;
                        case 'usine_civile':
                            nomBatiment = 'Usine civile';
                            ressource = 'bc';
                            break;
                    }
                    let pillage = chance.integer({min: 0, max: 10000});
                    if (eval(`RessourceB.${ressource}`) < pillage && ressource !== 'none') {
                        pillage = eval(`RessourceB.${ressource}`);
                    }

                    if (ArmeeB.unite === 0) {
                        const embedA = {
                            author: {
                                name: `${PaysA.rang} de ${PaysA.nom}`,
                                icon_url: interaction.member.displayAvatarURL()
                            },
                            thumbnail: {
                                url: PaysA.drapeau
                            },
                            title: `\`Victoire du Raid\``,
                            fields: [
                                {
                                    name: `> 🛡️ Défenseur`,
                                    value:
                                        `<@${PaysB.id_joueur}>\n` + `\u200B`
                                },
                                {
                                    name: `> 🪖 Unités`,
                                    value: codeBlock(
                                        ` Attaquant : ${ArmeeA}\n` +
                                        ` Défenseur : 0\n`) + `\u200B`
                                },
                                {
                                    name: `> 🏕️ Autres`,
                                    value: codeBlock(
                                        ` Biome : ${chance.capitalize(biomeBataille)}\n` +
                                        ` Bâtiment détruit : ${nomBatiment}\n` +
                                        ` Pillage : ${pillage} ${ressource}\n`) + `\u200B`
                                }
                            ],
                            color: 0x00cc00,
                            timestamp: new Date(),
                            footer: {
                                text: PaysA.devise
                            },
                        };
                        interaction.message.edit({embeds: [embedA], components: []});
                        interaction.deferUpdate()

                        const embedB = {
                            author: {
                                name: `${PaysB.rang} de ${PaysB.nom}`,
                                icon_url: PaysB.avatarURL
                            },
                            thumbnail: {
                                url: PaysB.drapeau
                            },
                            title: `\`Défaite d'un Raid\``,
                            fields: [
                                {
                                    name: `> 🗡️ Attaquant`,
                                    value:
                                        `<@${interaction.user.id}>\n` + `\u200B`
                                },
                                {
                                    name: `> 🪖 Unités`,
                                    value: codeBlock(
                                        ` Attaquant : ${ArmeeA}\n` +
                                        ` Défenseur : 0\n`) + `\u200B`
                                },
                                {
                                    name: `> 🏕️ Autres`,
                                    value: codeBlock(
                                        ` Biome : ${chance.capitalize(biomeBataille)}\n` +
                                        ` Bâtiment détruit : ${nomBatiment}\n` +
                                        ` Pillage : ${pillage} ${ressource}\n`) + `\u200B`
                                }
                            ],
                            color: 0xFF0000,
                            timestamp: new Date(),
                            footer: {
                                text: `${PaysB.devise}`
                            },
                        };
                        const salonB = interaction.client.channels.cache.get(PaysB.id_salon);
                        salonB.send({embeds: [embedB]});

                        const embedGuerre = {
                            title: `\`Rapport de raid\``,
                            fields: [
                                {
                                    name: `> Combattants`,
                                    value:
                                        `* 🗡️ Attaquant : <@${interaction.user.id}>\n` +
                                        `* 🛡️ Défenseur : <@${PaysB.id_joueur}>\n` + `\u200B`
                                },
                                {
                                    name: `> 🪖 Unités`,
                                    value: codeBlock(
                                        ` Attaquant : ${ArmeeA}\n` +
                                        ` Défenseur : 0\n`) + `\u200B`
                                },
                                {
                                    name: `> 🏕️ Autres`,
                                    value: codeBlock(
                                        ` Biome : ${chance.capitalize(biomeBataille)}\n` +
                                        ` Bâtiment détruit: ${nomBatiment}\n` +
                                        ` Pillage : ${pillage} ${ressource}\n`) + `\u200B`
                                },
                            ],
                            timestamp: new Date(),
                        }
                        const salonGuerre = interaction.client.channels.cache.get(process.env.SALON_GUERRE);
                        salonGuerre.send({embeds: [embedGuerre]});

                        let sql = `
                                    UPDATE armee
                                    SET victoire=victoire + 1
                                    WHERE id_joueur = '${interaction.user.id}';
                                    UPDATE ressources
                                    SET ${ressource}=${ressource} + ${pillage}
                                    WHERE id_joueur = '${interaction.user.id}';
                                    UPDATE armee
                                    SET defaite=defaite + 1
                                    WHERE id_joueur = '${id_joueur}';
                                    UPDATE ressources
                                    SET ${ressource}=${ressource} - ${pillage}
                                    WHERE id_joueur = '${id_joueur}';
                                    UPDATE batiments
                                    SET ${batimentBataille}=${batimentBataille} - 1
                                    WHERE id_joueur = '${id_joueur}';
                                `;
                        connection.query(sql, async (err) => {if (err) {throw err;}})
                    } else {
                        let raidUniteMin = Math.ceil(0.1 * ArmeeA);
                        let raidUniteMax = 2 * ArmeeA;
                        if (ArmeeA > ArmeeB.unite) {
                            raidUniteMax = Math.min(raidUniteMax, 1.5 * ArmeeB.unite);
                        } else {
                            raidUniteMax = Math.min(raidUniteMax, 0.75 * ArmeeB.unite);
                        }
                        const modifStratA = eval(`armeeObject.${BDDA.strategie}.bonus_taille`);
                        const modifStratB = eval(`armeeObject.${ArmeeB.strategie}.bonus_taille`);
                        const modifBiome = 1;
                        let raidUnite = Math.round(chance.floating({
                            min: raidUniteMin,
                            max: raidUniteMax
                        }) * modifStratA * modifStratB * modifBiome);
                        raidUnite = Math.min(raidUnite, raidUniteMax);
                        let raidUniteA = Math.min(raidUnite, ArmeeA);
                        let raidUniteB = Math.min(raidUnite, ArmeeB.unite);


                        let attaqueA = eval(`strategieObject.${biomeBataille}.${BDDA.strategie}.${ArmeeB.strategie}.attaquant`);
                        let defenseB = eval(`strategieObject.${biomeBataille}.${BDDA.strategie}.${ArmeeB.strategie}.defenseur`);

                        function pallier(sup, inf) {
                            const p = (sup - inf) / inf * 100;
                            if (p < 10) {
                                return 0;
                            } else if (p < 15) {
                                return 10;
                            } else if (p < 20) {
                                return 20;
                            } else if (p < 25) {
                                return 30;
                            } else if (p < 30) {
                                return 40;
                            } else if (p < 40) {
                                return 50;
                            } else {
                                return 60;
                            }
                        }

                        let perteA = 0.1;
                        let perteB = 0.1;

                        if (raidUniteA > raidUniteB) {
                            defenseB = defenseB - pallier(raidUniteA, raidUniteB);
                            perteB = perteB * (raidUniteA / raidUniteB)
                        } else {
                            attaqueA = attaqueA - pallier(raidUniteB, raidUniteA);
                            perteA = perteA * (raidUniteB / raidUniteA)
                        }
                        perteA = perteA * eval(`strategieObject.perte_attaquant.strategie_attaquant.${BDDA.strategie}`) * eval(`strategieObject.perte_attaquant.strategie_defenseur.${ArmeeB.strategie}`);
                        perteB = perteB * eval(`strategieObject.perte_defenseur.strategie_attaquant.${BDDA.strategie}`) * eval(`strategieObject.perte_defenseur.strategie_defenseur.${ArmeeB.strategie}`);

                        const uniteEnMoinsA = Math.ceil(perteA * raidUniteA);
                        //2 à remove des unités
                        const uniteEnMoinsB = Math.ceil(perteB * raidUniteB);

                        const resteUniteA = uniteEnMoinsA - perteA * raidUniteA;
                        //2 - 1,3 = 70% d'une unité à remettre en réserve
                        const resteUniteB = uniteEnMoinsB - perteB * raidUniteB;

                        const aviationA = Math.round(eval(`armeeObject.${BDDA.strategie}.aviation`) * resteUniteA);
                        const infanterieA = Math.round(eval(`armeeObject.${BDDA.strategie}.infanterie`) * resteUniteA);
                        const mecaniseA = Math.round(eval(`armeeObject.${BDDA.strategie}.mecanise`) * resteUniteA);
                        const supportA = Math.round(eval(`armeeObject.${BDDA.strategie}.support`) * resteUniteA);
                        const mortA = Math.round(perteA * raidUniteA * (
                            eval(`armeeObject.${BDDA.strategie}.aviation`) * eval(`armeeObject.aviation.homme`) +
                            eval(`armeeObject.${BDDA.strategie}.infanterie`) * eval(`armeeObject.infanterie.homme`) +
                            eval(`armeeObject.${BDDA.strategie}.mecanise`) * eval(`armeeObject.mecanise.homme`) +
                            eval(`armeeObject.${BDDA.strategie}.support`) * eval(`armeeObject.support.homme`)
                        ));

                        const aviationB = Math.round(eval(`armeeObject.${ArmeeB.strategie}.aviation`) * resteUniteB);
                        const infanterieB = Math.round(eval(`armeeObject.${ArmeeB.strategie}.infanterie`) * resteUniteB);
                        const mecaniseB = Math.round(eval(`armeeObject.${ArmeeB.strategie}.mecanise`) * resteUniteB);
                        const supportB = Math.round(eval(`armeeObject.${ArmeeB.strategie}.support`) * resteUniteB)
                        const mortB = Math.round(perteB * raidUniteB * (
                            eval(`armeeObject.${ArmeeB.strategie}.aviation`) * eval(`armeeObject.aviation.homme`) +
                            eval(`armeeObject.${ArmeeB.strategie}.infanterie`) * eval(`armeeObject.infanterie.homme`) +
                            eval(`armeeObject.${ArmeeB.strategie}.mecanise`) * eval(`armeeObject.mecanise.homme`) +
                            eval(`armeeObject.${ArmeeB.strategie}.support`) * eval(`armeeObject.support.homme`)
                        ));

                        let mortJeuneA = mortA;
                        let mortAdulteA = 0;
                        if (mortA > PopulationA.jeune) {
                            mortAdulteA = mortA - PopulationA.jeune;
                            mortJeuneA = PopulationA.jeune;
                        }
                        let mortJeuneB = mortB;
                        let mortAdulteB = 0;
                        if (mortB > PopulationB.jeune) {
                            mortAdulteB = mortB - PopulationB.jeune;
                            mortJeuneB = PopulationB.jeune;
                        }

                        let sql;
                        if (attaqueA > defenseB) {
                            //Attaquant wins
                            if (ressource === 'none') {
                                const embedA = {
                                    author: {
                                        name: `${PaysA.rang} de ${PaysA.nom}`,
                                        icon_url: interaction.member.displayAvatarURL()
                                    },
                                    thumbnail: {
                                        url: PaysA.drapeau
                                    },
                                    title: `\`Victoire du Raid\``,
                                    fields: [
                                        {
                                            name: `> 🛡️ Défenseur`,
                                            value:
                                                `<@${PaysB.id_joueur}>\n` + `\u200B`
                                        },
                                        {
                                            name: `> 🪖 Unités`,
                                            value: codeBlock(
                                                ` Attaquant : ${raidUniteA}\n` +
                                                ` Défenseur : ${raidUniteB}\n`) + `\u200B`
                                        },
                                        {
                                            name: `> 🏕️ Autres`,
                                            value: codeBlock(
                                                ` Biome : ${chance.capitalize(biomeBataille)}\n` +
                                                ` Bâtiment détruit : ${nomBatiment}\n`) + `\u200B`
                                        },
                                        {
                                            name: `> 💥 Dégâts`,
                                            value: codeBlock(
                                                ` Attaque : ${attaqueA}\n` +
                                                ` Défense : ${defenseB}\n`) + `\u200B`
                                        },
                                        {
                                            name: `> 🪦 Pertes`,
                                            value: codeBlock(
                                                ` Perte Attaquant : ${(perteA * raidUniteA).toFixed(2)} Unités\n` +
                                                ` Perte Attaquant : ${mortA.toLocaleString('en-US')} hommes\n` +
                                                ` Perte Défenseur : ${(perteB * raidUniteB).toFixed(2)} Unités\n` +
                                                ` Perte Défenseur : ${mortB.toLocaleString('en-US')} hommes\n`) + `\u200B`
                                        },
                                    ],
                                    color: 0x00cc00,
                                    timestamp: new Date(),
                                    footer: {
                                        text: `${PaysA.devise}`
                                    },
                                };
                                interaction.message.edit({embeds: [embedA], components: []});
                                interaction.deferUpdate()

                                const embedB = {
                                    author: {
                                        name: `${PaysB.rang} de ${PaysB.nom}`,
                                        icon_url: PaysB.avatarURL
                                    },
                                    thumbnail: {
                                        url: PaysB.drapeau
                                    },
                                    title: `\`Défaite d'un Raid\``,
                                    fields: [
                                        {
                                            name: `> 🗡️ Attaquant`,
                                            value:
                                                `<@${interaction.user.id}>\n` + `\u200B`
                                        },
                                        {
                                            name: `> 🪖 Unités`,
                                            value: codeBlock(
                                                ` Attaquant : ${raidUniteA}\n` +
                                                ` Défenseur : ${raidUniteB}\n`) + `\u200B`
                                        },
                                        {
                                            name: `> 🏕️ Autres`,
                                            value: codeBlock(
                                                ` Biome : ${chance.capitalize(biomeBataille)}\n` +
                                                ` Bâtiment détruit : ${nomBatiment}\n`) + `\u200B`
                                        },
                                        {
                                            name: `> 💥 Dégâts`,
                                            value: codeBlock(
                                                ` Attaque : ${attaqueA}\n` +
                                                ` Défense : ${defenseB}\n`) + `\u200B`
                                        },
                                        {
                                            name: `> 🪦 Pertes`,
                                            value: codeBlock(
                                                ` Perte Attaquant : ${(perteA * raidUniteA).toFixed(2)} Unités\n` +
                                                ` Perte Attaquant : ${mortA.toLocaleString('en-US')} hommes\n` +
                                                ` Perte Défenseur : ${(perteB * raidUniteB).toFixed(2)} Unités\n` +
                                                ` Perte Défenseur : ${mortB.toLocaleString('en-US')} hommes\n`) + `\u200B`
                                        },
                                    ],
                                    color: 0xFF0000,
                                    timestamp: new Date(),
                                    footer: {
                                        text: `${PaysB.devise}`
                                    },
                                };
                                const salonB = interaction.client.channels.cache.get(PaysB.id_salon);
                                salonB.send({embeds: [embedB]});

                                const embedGuerre = {
                                    title: `\`Rapport de raid\``,
                                    fields: [
                                        {
                                            name: `> Combattants`,
                                            value:
                                                `* 🗡️ Attaquant : <@${interaction.user.id}>\n` +
                                                `* 🛡️ Défenseur : <@${PaysB.id_joueur}>\n` + `\u200B`
                                        },
                                        {
                                            name: `> 🪖 Unités`,
                                            value: codeBlock(
                                                ` Attaquant : ${raidUniteA}\n` +
                                                ` Défenseur : ${raidUniteB}\n`) + `\u200B`
                                        },
                                        {
                                            name: `> 🏕️ Autres`,
                                            value: codeBlock(
                                                ` Biome : ${chance.capitalize(biomeBataille)}\n` +
                                                ` Bâtiment détruit: ${nomBatiment}\n` +
                                                ` Pillage : ${pillage} ${ressource}\n`) + `\u200B`
                                        },
                                        {
                                            name: `> 💥 Dégâts`,
                                            value: codeBlock(
                                                ` Attaque : ${attaqueA}\n` +
                                                ` Défense : ${defenseB}\n`) + `\u200B`
                                        },
                                        {
                                            name: `> 🪦 Pertes`,
                                            value: codeBlock(
                                                ` Perte Attaquant : ${(perteA * raidUniteA).toFixed(2)} Unités\n` +
                                                ` Perte Attaquant : ${mortA.toLocaleString('en-US')} hommes\n` +
                                                ` Perte Défenseur : ${(perteB * raidUniteB).toFixed(2)} Unités\n` +
                                                ` Perte Défenseur : ${mortB.toLocaleString('en-US')} hommes\n`) + `\u200B`
                                        },
                                    ],
                                    timestamp: new Date(),
                                }
                                const salonGuerre = interaction.client.channels.cache.get(process.env.SALON_GUERRE);
                                salonGuerre.send({embeds: [embedGuerre]});

                                sql = `
                                    UPDATE armee
                                    SET unite=unite - ${uniteEnMoinsA},
                                        aviation=aviation + ${aviationA},
                                        infanterie=infanterie + ${infanterieA},
                                        mecanise=mecanise + ${mecaniseA},
                                        support=support + ${supportA},
                                        victoire=victoire + 1
                                    WHERE id_joueur = '${interaction.user.id}';
                                    UPDATE population
                                    SET jeune=jeune - ${mortJeuneA},
                                        adulte=adulte - ${mortAdulteA}
                                    WHERE id_joueur = '${interaction.user.id}';
                                    UPDATE armee
                                    SET unite=unite - ${uniteEnMoinsB},
                                        aviation=aviation + ${aviationB},
                                        infanterie=infanterie + ${infanterieB},
                                        mecanise=mecanise + ${mecaniseB},
                                        support=support + ${supportB},
                                        defaite = defaite + 1
                                    WHERE id_joueur = '${id_joueur}';
                                    UPDATE batiments
                                    SET ${batimentBataille}=${batimentBataille} - 1
                                    WHERE id_joueur = '${id_joueur}';
                                    UPDATE population
                                    SET jeune=jeune - ${mortJeuneB},
                                        adulte=adulte - ${mortAdulteB}
                                    WHERE id_joueur = '${id_joueur}';
                                `;
                                connection.query(sql, async (err) => {
                                    if (err) {
                                        throw err;
                                    }
                                })
                            } else {
                                const embedA = {
                                    author: {
                                        name: `${PaysA.rang} de ${PaysA.nom}`,
                                        icon_url: interaction.member.displayAvatarURL()
                                    },
                                    thumbnail: {
                                        url: PaysA.drapeau
                                    },
                                    title: `\`Victoire du Raid\``,
                                    fields: [
                                        {
                                            name: `> 🛡️ Défenseur`,
                                            value:
                                                `<@${PaysB.id_joueur}>\n` + `\u200B`
                                        },
                                        {
                                            name: `> 🪖 Unités`,
                                            value: codeBlock(
                                                ` Attaquant : ${raidUniteA}\n` +
                                                ` Défenseur : ${raidUniteB}\n`) + `\u200B`
                                        },
                                        {
                                            name: `> 🏕️ Autres`,
                                            value: codeBlock(
                                                ` Biome : ${chance.capitalize(biomeBataille)}\n` +
                                                ` Bâtiment détruit : ${nomBatiment}\n` +
                                                ` Pillage : ${pillage} ${ressource}\n`) + `\u200B`
                                        },
                                        {
                                            name: `> 💥 Dégâts`,
                                            value: codeBlock(
                                                ` Attaque : ${attaqueA}\n` +
                                                ` Défense : ${defenseB}\n`) + `\u200B`
                                        },
                                        {
                                            name: `> 🪦 Pertes`,
                                            value: codeBlock(
                                                ` Perte Attaquant : ${(perteA * raidUniteA).toFixed(2)} Unités\n` +
                                                ` Perte Attaquant : ${mortA.toLocaleString('en-US')} hommes\n` +
                                                ` Perte Défenseur : ${(perteB * raidUniteB).toFixed(2)} Unités\n` +
                                                ` Perte Défenseur : ${mortB.toLocaleString('en-US')} hommes\n`) + `\u200B`
                                        },
                                    ],
                                    color: 0x00cc00,
                                    timestamp: new Date(),
                                    footer: {
                                        text: `${PaysA.devise}`
                                    },
                                };
                                interaction.message.edit({embeds: [embedA], components: []});
                                interaction.deferUpdate()

                                const embedB = {
                                    author: {
                                        name: `${PaysB.rang} de ${PaysB.nom}`,
                                        icon_url: PaysB.avatarURL
                                    },
                                    thumbnail: {
                                        url: PaysB.drapeau
                                    },
                                    title: `\`Défaite d'un Raid\``,
                                    fields: [
                                        {
                                            name: `> 🗡️ Attaquant`,
                                            value:
                                                `<@${interaction.user.id}>\n` + `\u200B`
                                        },
                                        {
                                            name: `> 🪖 Unités`,
                                            value: codeBlock(
                                                ` Attaquant : ${raidUniteA}\n` +
                                                ` Défenseur : ${raidUniteB}\n`) + `\u200B`
                                        },
                                        {
                                            name: `> 🏕️ Autres`,
                                            value: codeBlock(
                                                ` Biome : ${chance.capitalize(biomeBataille)}\n` +
                                                ` Bâtiment détruit : ${nomBatiment}\n` +
                                                ` Pillage : ${pillage} ${ressource}\n`) + `\u200B`
                                        },
                                        {
                                            name: `> 💥 Dégâts`,
                                            value: codeBlock(
                                                ` Attaque : ${attaqueA}\n` +
                                                ` Défense : ${defenseB}\n`) + `\u200B`
                                        },
                                        {
                                            name: `> 🪦 Pertes`,
                                            value: codeBlock(
                                                ` Perte Attaquant : ${(perteA * raidUniteA).toFixed(2)} Unités\n` +
                                                ` Perte Attaquant : ${mortA.toLocaleString('en-US')} hommes\n` +
                                                ` Perte Défenseur : ${(perteB * raidUniteB).toFixed(2)} Unités\n` +
                                                ` Perte Défenseur : ${mortB.toLocaleString('en-US')} hommes\n`) + `\u200B`
                                        },
                                    ],
                                    color: 0xFF0000,
                                    timestamp: new Date(),
                                    footer: {
                                        text: `${PaysB.devise}`
                                    },
                                };
                                const salonB = interaction.client.channels.cache.get(PaysB.id_salon);
                                salonB.send({embeds: [embedB]});

                                const embedGuerre = {
                                    title: `\`Rapport de raid\``,
                                    fields: [
                                        {
                                            name: `> Combattants`,
                                            value:
                                                `* 🗡️ Attaquant : <@${interaction.user.id}>\n` +
                                                `* 🛡️ Défenseur : <@${PaysB.id_joueur}>\n` + `\u200B`
                                        },
                                        {
                                            name: `> 🪖 Unités`,
                                            value: codeBlock(
                                                ` Attaquant : ${raidUniteA}\n` +
                                                ` Défenseur : ${raidUniteB}\n`) + `\u200B`
                                        },
                                        {
                                            name: `> 🏕️ Autres`,
                                            value: codeBlock(
                                                ` Biome : ${chance.capitalize(biomeBataille)}\n` +
                                                ` Bâtiment détruit: ${nomBatiment}\n` +
                                                ` Pillage : ${pillage} ${ressource}\n`) + `\u200B`
                                        },
                                        {
                                            name: `> 💥 Dégâts`,
                                            value: codeBlock(
                                                ` Attaque : ${attaqueA}\n` +
                                                ` Défense : ${defenseB}\n`) + `\u200B`
                                        },
                                        {
                                            name: `> 🪦 Pertes`,
                                            value: codeBlock(
                                                ` Perte Attaquant : ${(perteA * raidUniteA).toFixed(2)} Unités\n` +
                                                ` Perte Attaquant : ${mortA.toLocaleString('en-US')} hommes\n` +
                                                ` Perte Défenseur : ${(perteB * raidUniteB).toFixed(2)} Unités\n` +
                                                ` Perte Défenseur : ${mortB.toLocaleString('en-US')} hommes\n`) + `\u200B`
                                        },
                                    ],
                                    timestamp: new Date(),
                                }
                                const salonGuerre = interaction.client.channels.cache.get(process.env.SALON_GUERRE);
                                salonGuerre.send({embeds: [embedGuerre]});

                                sql = `
                                    UPDATE armee
                                    SET unite=unite - ${uniteEnMoinsA},
                                        aviation=aviation + ${aviationA},
                                        infanterie=infanterie + ${infanterieA},
                                        mecanise=mecanise + ${mecaniseA},
                                        support=support + ${supportA},
                                        victoire=victoire + 1
                                    WHERE id_joueur = '${interaction.user.id}';
                                    UPDATE ressources
                                    SET ${ressource}=${ressource} + ${pillage}
                                    WHERE id_joueur = '${interaction.user.id}';
                                    UPDATE population
                                    SET jeune=jeune - ${mortJeuneA},
                                        adulte=adulte - ${mortAdulteA}
                                    WHERE id_joueur = '${interaction.user.id}';
                                    UPDATE armee
                                    SET unite=unite - ${uniteEnMoinsB},
                                        aviation=aviation + ${aviationB},
                                        infanterie=infanterie + ${infanterieB},
                                        mecanise=mecanise + ${mecaniseB},
                                        support=support + ${supportB},
                                        defaite = defaite + 1
                                    WHERE id_joueur = '${id_joueur}';
                                    UPDATE ressources
                                    SET ${ressource}=${ressource} - ${pillage}
                                    WHERE id_joueur = '${id_joueur}';
                                    UPDATE batiments
                                    SET ${batimentBataille}=${batimentBataille} - 1
                                    WHERE id_joueur = '${id_joueur}';
                                    UPDATE population
                                    SET jeune=jeune - ${mortJeuneB},
                                        adulte=adulte - ${mortAdulteB}
                                    WHERE id_joueur = '${id_joueur}';
                                `;
                                connection.query(sql, async (err) => {
                                    if (err) {
                                        throw err;
                                    }
                                })
                            }
                        } else {
                            //Defender wins
                            const embedA = {
                                author: {
                                    name: `${PaysA.rang} de ${PaysA.nom}`,
                                    icon_url: interaction.member.displayAvatarURL()
                                },
                                thumbnail: {
                                    url: PaysA.drapeau
                                },
                                title: `\`Victoire du Raid\``,
                                fields: [
                                    {
                                        name: `> 🛡️ Défenseur`,
                                        value:
                                            `<@${PaysB.id_joueur}>\n` + `\u200B`
                                    },
                                    {
                                        name: `> 🪖 Unités`,
                                        value: codeBlock(
                                            ` Attaquant : ${raidUniteA}\n` +
                                            ` Défenseur : ${raidUniteB}\n`) + `\u200B`
                                    },
                                    {
                                        name: `> 🏕️ Autres`,
                                        value: codeBlock(
                                            ` Biome : ${chance.capitalize(biomeBataille)}\n` +
                                            ` Bâtiment détruit : ${nomBatiment}\n`) + `\u200B`
                                    },
                                    {
                                        name: `> 💥 Dégâts`,
                                        value: codeBlock(
                                            ` Attaque : ${attaqueA}\n` +
                                            ` Défense : ${defenseB}\n`) + `\u200B`
                                    },
                                    {
                                        name: `> 🪦 Pertes`,
                                        value: codeBlock(
                                            ` Perte Attaquant : ${(perteA * raidUniteA).toFixed(2)} Unités\n` +
                                            ` Perte Attaquant : ${mortA.toLocaleString('en-US')} hommes\n` +
                                            ` Perte Défenseur : ${(perteB * raidUniteB).toFixed(2)} Unités\n` +
                                            ` Perte Défenseur : ${mortB.toLocaleString('en-US')} hommes\n`) + `\u200B`
                                    },
                                ],
                                color: 0xFF0000,
                                timestamp: new Date(),
                                footer: {
                                    text: `${PaysA.devise}`
                                },
                            };
                            interaction.message.edit({embeds: [embedA], components: []});
                            interaction.deferUpdate()

                            const embedB = {
                                author: {
                                    name: `${PaysB.rang} de ${PaysB.nom}`,
                                    icon_url: PaysB.avatarURL
                                },
                                thumbnail: {
                                    url: PaysB.drapeau
                                },
                                title: `\`Victoire contre un Raid\``,
                                fields: [
                                    {
                                        name: `> 🗡️ Attaquant`,
                                        value:
                                            `<@${interaction.user.id}>\n` + `\u200B`
                                    },
                                    {
                                        name: `> 🪖 Unités`,
                                        value: codeBlock(
                                            ` Attaquant : ${raidUniteA}\n` +
                                            ` Défenseur : ${raidUniteB}\n`) + `\u200B`
                                    },
                                    {
                                        name: `> 🏕️ Autres`,
                                        value: codeBlock(
                                            ` Biome : ${chance.capitalize(biomeBataille)}\n` +
                                            ` Bâtiment détruit : ${nomBatiment}\n`) + `\u200B`
                                    },
                                    {
                                        name: `> 💥 Dégâts`,
                                        value: codeBlock(
                                            ` Attaque : ${attaqueA}\n` +
                                            ` Défense : ${defenseB}\n`) + `\u200B`
                                    },
                                    {
                                        name: `> 🪦 Pertes`,
                                        value: codeBlock(
                                            ` Perte Attaquant : ${(perteA * raidUniteA).toFixed(2)} Unités\n` +
                                            ` Perte Attaquant : ${mortA.toLocaleString('en-US')} hommes\n` +
                                            ` Perte Défenseur : ${(perteB * raidUniteB).toFixed(2)} Unités\n` +
                                            ` Perte Défenseur : ${mortB.toLocaleString('en-US')} hommes\n`) + `\u200B`
                                    },
                                ],
                                color: 0x00cc00,
                                timestamp: new Date(),
                                footer: {
                                    text: `${PaysB.devise}`
                                },
                            };
                            const salonB = interaction.client.channels.cache.get(PaysB.id_salon);
                            salonB.send({embeds: [embedB]});

                            const embedGuerre = {
                                title: `\`Rapport de raid\``,
                                fields: [
                                    {
                                        name: `> Combattants`,
                                        value:
                                            `* 🗡️ Attaquant : <@${interaction.user.id}>\n` +
                                            `* 🛡️ Défenseur : <@${PaysB.id_joueur}>\n` + `\u200B`
                                    },
                                    {
                                        name: `> 🪖 Unités`,
                                        value: codeBlock(
                                            ` Attaquant : ${raidUniteA}\n` +
                                            ` Défenseur : ${raidUniteB}\n`) + `\u200B`
                                    },
                                    {
                                        name: `> 🏕️ Autres`,
                                        value: codeBlock(
                                            ` Biome : ${chance.capitalize(biomeBataille)}\n` +
                                            ` Bâtiment détruit: ${nomBatiment}\n` +
                                            ` Pillage : ${pillage} ${ressource}\n`) + `\u200B`
                                    },
                                    {
                                        name: `> 💥 Dégâts`,
                                        value: codeBlock(
                                            ` Attaque : ${attaqueA}\n` +
                                            ` Défense : ${defenseB}\n`) + `\u200B`
                                    },
                                    {
                                        name: `> 🪦 Pertes`,
                                        value: codeBlock(
                                            ` Perte Attaquant : ${(perteA * raidUniteA).toFixed(2)} Unités\n` +
                                            ` Perte Attaquant : ${mortA.toLocaleString('en-US')} hommes\n` +
                                            ` Perte Défenseur : ${(perteB * raidUniteB).toFixed(2)} Unités\n` +
                                            ` Perte Défenseur : ${mortB.toLocaleString('en-US')} hommes\n`) + `\u200B`
                                    },
                                ],
                                timestamp: new Date(),
                            }
                            const salonGuerre = interaction.client.channels.cache.get(process.env.SALON_GUERRE);
                            salonGuerre.send({embeds: [embedGuerre]});

                            sql = `
                                UPDATE armee
                                SET unite=unite - ${uniteEnMoinsA},
                                    aviation=aviation + ${aviationA},
                                    infanterie=infanterie + ${infanterieA},
                                    mecanise=mecanise + ${mecaniseA},
                                    support=support + ${supportA},
                                    defaite = defaite + 1
                                WHERE id_joueur = '${interaction.user.id}';
                                UPDATE population
                                SET jeune=jeune - ${mortJeuneA},
                                    adulte=adulte - ${mortAdulteA}
                                WHERE id_joueur = '${interaction.user.id}';
                                UPDATE armee
                                SET unite=unite - ${uniteEnMoinsB},
                                    aviation=aviation + ${aviationB},
                                    infanterie=infanterie + ${infanterieB},
                                    mecanise=mecanise + ${mecaniseB},
                                    support=support + ${supportB},
                                    victoire=victoire + 1
                                WHERE id_joueur = '${id_joueur}';
                                UPDATE batiments
                                SET ${batimentBataille}=${batimentBataille} - 1
                                WHERE id_joueur = '${id_joueur}';
                                UPDATE population
                                SET jeune=jeune - ${mortJeuneB},
                                    adulte=adulte - ${mortAdulteB}
                                WHERE id_joueur = '${id_joueur}';
                            `;
                            connection.query(sql, async (err) => {
                                if (err) {
                                    throw err;
                                }
                            })
                        }

                        const embed = {
                            title: `\`Raid\``,
                            fields: [
                                {
                                    name: `> Combattants`,
                                    value:
                                        `* 🗡️ Attaquant : <@${interaction.user.id}>\n` +
                                        `* 🛡️ Défenseur : <@${PaysB.id_joueur}>\n` + `\u200B`
                                },
                                {
                                    name: `> 🪖 Unités`,
                                    value: codeBlock(
                                        ` Attaquant : ${raidUniteA}\n` +
                                        ` Défenseur : ${raidUniteB}\n`) + `\u200B`
                                },
                                {
                                    name: `> 🏕️ Autres`,
                                    value: codeBlock(
                                        ` Biome : ${chance.capitalize(biomeBataille)}\n` +
                                        ` raidUnite : ${raidUnite}\n` +
                                        ` Bâtiment détruit: ${nomBatiment}\n` +
                                        ` Pillage : ${pillage} ${ressource}\n`) + `\u200B`
                                },
                                {
                                    name: `> 💥 Dégâts`,
                                    value: codeBlock(
                                        ` Attaque : ${attaqueA}\n` +
                                        ` Défense : ${defenseB}\n`) + `\u200B`
                                },
                                {
                                    name: `> 🪦 Pertes`,
                                    value: codeBlock(
                                        ` Perte Attaquant : ${(perteA * raidUniteA).toFixed(2)} Unités\n` +
                                        ` Perte Attaquant : ${mortA.toLocaleString('en-US')} hommes\n` +
                                        ` Perte Défenseur : ${(perteB * raidUniteB).toFixed(2)} Unités\n` +
                                        ` Perte Défenseur : ${mortB.toLocaleString('en-US')} hommes\n`) + `\u200B`
                                },
                            ],
                            timestamp: new Date(),
                        }
                        const salon_logs = interaction.client.channels.cache.get(process.env.SALON_LOGS);
                        salon_logs.send({embeds: [embed]});
                    }
                });
                //endregion
            }
            //endregion
        } else if (interaction.isStringSelectMenu()) {
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
                    SELECT * FROM armee WHERE id_joueur=${interaction.member.id};
                    SELECT * FROM batiments WHERE id_joueur=${interaction.member.id};
                    SELECT * FROM pays WHERE id_joueur=${interaction.member.id};
                    SELECT * FROM population WHERE id_joueur=${interaction.member.id};
                    SELECT * FROM ressources WHERE id_joueur=${interaction.member.id};
                    SELECT * FROM territoire WHERE id_joueur='${interaction.member.id}'
                `;
                connection.query(sql, async (err, results) => {if (err) {throw err;}
                    const Armee = results[0][0];
                    const Batiment = results[1][0];
                    const Pays = results[2][0];
                    const Population = results[3][0];
                    const Ressources = results[4][0];
                    const Territoire = results[5][0];
                    let Electricite;
                    let Prod;
                    let Conso;
                    let Diff;

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

                    if (interaction.values === 'acierie') {
                        //region Acierie

                        const prod_acierie = Math.round(batimentObject.acierie.PROD_ACIERIE * eval(`gouvernementObject.${Pays.ideologie}.production`));
                        const conso_acierie_charbon = Math.round(batimentObject.acierie.CONSO_ACIERIE_CHARBON * eval(`gouvernementObject.${Pays.ideologie}.consommation`));
                        const conso_acierie_metaux = Math.round(batimentObject.acierie.CONSO_ACIERIE_METAUX * eval(`gouvernementObject.${Pays.ideologie}.consommation`));
                        const conso_acierie_elec = Math.round(batimentObject.acierie.CONSO_ACIERIE_ELEC);

                        let acierName;
                        const conso_T_acierie_charbon = Math.round(batimentObject.acierie.CONSO_ACIERIE_CHARBON * Batiment.acierie * eval(`gouvernementObject.${Pays.ideologie}.consommation`) * emplois);
                        const conso_T_acierie_metaux = Math.round(batimentObject.acierie.CONSO_ACIERIE_METAUX * Batiment.acierie * eval(`gouvernementObject.${Pays.ideologie}.consommation`) * emplois);
                        if (conso_T_acierie_charbon > Ressources.charbon) {
                            acierName = `> ⚠️ Acier : ⚠️`;
                        } else if (conso_T_acierie_metaux > Ressources.metaux) {
                            acierName = `> ⚠️ Acier : ⚠️`;
                        } else if (prod_elec < conso_elec) {
                            acierName = `> ⚠️ Acier : ⚠️`;
                        } else {
                            acierName = `> <:acier:1075776411329122304> Acier :`;
                        }
                        let Acier;
                        Prod = Math.round(batimentObject.acierie.PROD_ACIERIE * Batiment.acierie * eval(`gouvernementObject.${Pays.ideologie}.production`) * emplois);
                        Conso = 0
                        Diff = Prod - Conso;
                        if (Diff / Prod > 0.1) {
                            Acier = codeBlock('md', `> -${Conso.toLocaleString('en-US')} | +${Prod.toLocaleString('en-US')} | :${Diff.toLocaleString('en-US')}" | 📦 ${Ressources.acier.toLocaleString('en-US')}`);
                        } else if (Diff / Prod >= 0) {
                            Acier = codeBlock('ansi', `\u001b[0;0m\u001b[1;33m> -${Conso.toLocaleString('en-US')} | +${Prod.toLocaleString('en-US')} | :${Diff.toLocaleString('en-US')} | 📦 ${Ressources.acier.toLocaleString('en-US')}`);
                        } else {
                            Acier = codeBlock('ansi', `\u001b[0;0m\u001b[1;31m> -${Conso.toLocaleString('en-US')} | +${Prod.toLocaleString('en-US')} | :${Diff.toLocaleString('en-US')} | 📦 ${Ressources.acier.toLocaleString('en-US')}`);
                        }

                        const embed = {
                            author: {
                                name: `${Pays.rang} de ${Pays.nom}`,
                                icon_url: interaction.member.displayAvatarURL()
                            },
                            thumbnail: {
                                url: Pays.drapeau
                            },
                            title: `\`Usine : ${Batiment.acierie} Acierie\``,
                            fields: [
                                {
                                    name: `> <:charbon:1075776385517375638> Consommation :`,
                                    value:
                                        `Unitaire : \n` +
                                        codeBlock(
                                            `• ${conso_acierie_charbon.toLocaleString('en-US')}\n`) +
                                        `Total : \n` +
                                        codeBlock(
                                            `• ${(conso_acierie_charbon * Batiment.acierie).toLocaleString('en-US')}`) + `\u200B`,
                                    inline: true
                                },
                                {
                                    name: `> 🪨 Consommation :`,
                                    value:
                                        `Unitaire : \n` +
                                        codeBlock(
                                            `• ${conso_acierie_metaux.toLocaleString('en-US')}\n`) +
                                        `Total : \n` +
                                        codeBlock(
                                            `• ${(conso_acierie_metaux * Batiment.acierie).toLocaleString('en-US')}`) + `\u200B`,
                                    inline: true
                                },
                                {
                                    name: `> ⚡ Consommation :`,
                                    value:
                                        `Unitaire : \n` +
                                        codeBlock(
                                            `• ${conso_acierie_elec.toLocaleString('en-US')}\n`) +
                                        `Total : \n` +
                                        codeBlock(
                                            `• ${(conso_acierie_elec * Batiment.acierie).toLocaleString('en-US')}`) + `\u200B`,
                                    inline: true
                                },
                                {
                                    name: `> <:acier:1075776411329122304> Production : Acier`,
                                    value: codeBlock(
                                            `• Par usine : ${prod_acierie.toLocaleString('en-US')}\n` +
                                            `• Totale : ${(prod_acierie * Batiment.acierie).toLocaleString('en-US')}`) + `\u200B`
                                },
                                {
                                    name: acierName,
                                    value: Acier + `\u200B`,
                                },
                                {
                                    name: `> 🏞️ Surface :`,
                                    value:
                                        `Unitaire : \n` +
                                        codeBlock(
                                            `• ${(batimentObject.acierie.SURFACE_ACIERIE).toLocaleString('en-US')} km²`) +
                                        `Totale : \n` +
                                        codeBlock(
                                            `• ${(batimentObject.acierie.SURFACE_ACIERIE * Batiment.acierie).toLocaleString('en-US')} km²`) + `\u200B`,
                                    inline: true
                                },
                                {
                                    name: `> 👩‍🔧 Employés :`,
                                    value:
                                        `Unitaire : \n` +
                                        codeBlock(
                                            `• ${(batimentObject.acierie.EMPLOYES_ACIERIE).toLocaleString('en-US')}`) +
                                        `Totale : \n` +
                                        codeBlock(
                                            `• ${(batimentObject.acierie.EMPLOYES_ACIERIE * Batiment.acierie).toLocaleString('en-US')}`) + `\u200B`,
                                    inline: true
                                },
                            ],
                            color: interaction.member.displayColor,
                            timestamp: new Date(),
                            footer: {
                                text: `${Pays.devise}`
                            }
                        };

                        interaction.reply({embeds: [embed]})
                        //endregion
                    } else if (interaction.values === 'atelier_verre') {
                        //region Atelier de verre
                        const prod_atelier_verre = Math.round(batimentObject.atelier_verre.PROD_ATELIER_VERRE * eval(`gouvernementObject.${Pays.ideologie}.production`));
                        const conso_atelier_verre_eau = Math.round(batimentObject.atelier_verre.CONSO_ATELIER_VERRE_EAU * eval(`gouvernementObject.${Pays.ideologie}.consommation`));
                        const conso_atelier_verre_sable = Math.round(batimentObject.atelier_verre.CONSO_ATELIER_VERRE_SABLE * eval(`gouvernementObject.${Pays.ideologie}.consommation`));
                        const conso_atelier_verre_elec = Math.round(batimentObject.atelier_verre.CONSO_ATELIER_VERRE_ELEC);

                        let verreName;
                        const conso_T_atelier_verre_eau = Math.round(batimentObject.atelier_verre.CONSO_ATELIER_VERRE_EAU * Batiment.atelier_verre * eval(`gouvernementObject.${Pays.ideologie}.consommation`) * emplois);
                        const conso_T_atelier_verre_sable = Math.round(batimentObject.atelier_verre.CONSO_ATELIER_VERRE_SABLE * Batiment.atelier_verre * eval(`gouvernementObject.${Pays.ideologie}.consommation`) * emplois);
                        if (conso_T_atelier_verre_eau > Ressources.eau) {
                            verreName = `> ⚠️ Verre : ⚠️`;
                        } else if (conso_T_atelier_verre_sable > Ressources.sable) {
                            verreName = `> ⚠️ Verre : ⚠️`;
                        } else if (prod_elec < conso_elec) {
                            verreName = `> ⚠️ Verre : ⚠️`;
                        } else {
                            verreName = `> 🪟 Verre :`;
                        }
                        let Verre;
                        Prod = Math.round(batimentObject.atelier_verre.PROD_ATELIER_VERRE * Batiment.atelier_verre * eval(`gouvernementObject.${Pays.ideologie}.production`) * emplois);
                        const conso_T_usine_civile_verre = Math.round(batimentObject.usine_civile.CONSO_USINE_CIVILE_VERRE * Batiment.usine_civile * eval(`gouvernementObject.${Pays.ideologie}.consommation`) * emplois);
                        Conso = conso_T_usine_civile_verre;
                        Diff = Prod - Conso;
                        if (Diff / Prod > 0.1) {
                            Verre = codeBlock('md', `> -${Conso.toLocaleString('en-US')} | +${Prod.toLocaleString('en-US')} | :${Diff.toLocaleString('en-US')}" | 📦 ${Ressources.verre.toLocaleString('en-US')}`);
                        } else if (Diff / Prod >= 0) {
                            Verre = codeBlock('ansi', `\u001b[0;0m\u001b[1;33m> -${Conso.toLocaleString('en-US')} | +${Prod.toLocaleString('en-US')} | :${Diff.toLocaleString('en-US')} | 📦 ${Ressources.verre.toLocaleString('en-US')}`);
                        } else {
                            Verre = codeBlock('ansi', `\u001b[0;0m\u001b[1;31m> -${Conso.toLocaleString('en-US')} | +${Prod.toLocaleString('en-US')} | :${Diff.toLocaleString('en-US')} | 📦 ${Ressources.verre.toLocaleString('en-US')}`);
                        }
                        const embed = {
                            author: {
                                name: `${Pays.rang} de ${Pays.nom}`,
                                icon_url: interaction.member.displayAvatarURL()
                            },
                            thumbnail: {
                                url: Pays.drapeau
                            },
                            title: `\`Usine : ${Batiment.atelier_verre} Atelier de verre\``,
                            fields: [
                                {
                                    name: `> 💧 Consommation :`,
                                    value:
                                        `Unitaire : \n` +
                                        codeBlock(
                                            `• ${conso_atelier_verre_eau.toLocaleString('en-US')}\n`) +
                                        `Total : \n` +
                                        codeBlock(
                                            `• ${(conso_atelier_verre_eau * Batiment.atelier_verre).toLocaleString('en-US')}`) + `\u200B`,
                                    inline: true
                                },
                                {
                                    name: `> <:sable:1075776363782479873> Consommation :`,
                                    value:
                                        `Unitaire : \n` +
                                        codeBlock(
                                            `• ${conso_atelier_verre_sable.toLocaleString('en-US')}\n`) +
                                        `Total : \n` +
                                        codeBlock(
                                            `• ${(conso_atelier_verre_sable * Batiment.atelier_verre).toLocaleString('en-US')}`) + `\u200B`,
                                    inline: true
                                },
                                {
                                    name: `> ⚡ Consommation :`,
                                    value:
                                        `Unitaire : \n` +
                                        codeBlock(
                                            `• ${conso_atelier_verre_elec.toLocaleString('en-US')}\n`) +
                                        `Total : \n` +
                                        codeBlock(
                                            `• ${(conso_atelier_verre_elec * Batiment.atelier_verre).toLocaleString('en-US')}`) + `\u200B`,
                                    inline: true
                                },
                                {
                                    name: `> 🪟 Production : Verre`,
                                    value: codeBlock(
                                            `• Par usine : ${prod_atelier_verre.toLocaleString('en-US')}\n` +
                                            `• Totale : ${(prod_atelier_verre * Batiment.atelier_verre).toLocaleString('en-US')}`) + `\u200B`
                                },
                                {
                                    name: verreName,
                                    value: Verre + `\u200B`
                                },
                                {
                                    name: `> 🏞️ Surface :`,
                                    value: `Unitaire : \n` +
                                        codeBlock(
                                            `• ${(batimentObject.atelier_verre.SURFACE_ATELIER_VERRE).toLocaleString('en-US')} km²`) +
                                        `Totale : \n` +
                                        codeBlock(
                                            `• ${(batimentObject.atelier_verre.SURFACE_ATELIER_VERRE * Batiment.atelier_verre).toLocaleString('en-US')} km²`) + `\u200B`,
                                    inline: true
                                },
                                {
                                    name: `> 👩‍🔧 Employés :`,
                                    value:
                                        `Unitaire : \n` +
                                        codeBlock(
                                            `• ${(batimentObject.atelier_verre.EMPLOYES_ATELIER_VERRE).toLocaleString('en-US')}`) +
                                        `Totale : \n` +
                                        codeBlock(
                                            `• ${(batimentObject.atelier_verre.EMPLOYES_ATELIER_VERRE * Batiment.atelier_verre).toLocaleString('en-US')}`) + `\u200B`,
                                    inline: true
                                },
                            ],
                            color: interaction.member.displayColor,
                            timestamp: new Date(),
                            footer: {
                                text: `${Pays.devise}`
                            }
                        };

                        interaction.reply({embeds: [embed]})
                        //endregion
                    } else if (interaction.values === 'carriere_sable') {
                        //region Carriere de sable
                        const coef_sable = eval(`regionObject.${Territoire.region}.sable`)

                        const prod_carriere_sable = Math.round(batimentObject.carriere_sable.PROD_CARRIERE_SABLE * Batiment.carriere_sable * eval(`gouvernementObject.${Pays.ideologie}.production`) * coef_sable);
                        const conso_carriere_sable_carburant = Math.round(batimentObject.carriere_sable.CONSO_CARRIERE_SABLE_CARBURANT * eval(`gouvernementObject.${Pays.ideologie}.consommation`));
                        const conso_carriere_sable_elec = Math.round(batimentObject.carriere_sable.CONSO_CARRIERE_SABLE_ELEC);

                        let sableName;
                        const conso_T_carriere_sable_carburant = Math.round(batimentObject.carriere_sable.CONSO_CARRIERE_SABLE_CARBURANT * Batiment.carriere_sable * eval(`gouvernementObject.${Pays.ideologie}.consommation`) * emplois);
                        if (conso_T_carriere_sable_carburant > Ressources.carburant) {
                            sableName = `> ⚠️ Sable : ⛏️ x${coef_sable} ⚠️️`;
                        } else if (prod_elec < conso_elec) {
                            sableName = `> ⚠️ Sable : ⛏️ x${coef_sable} ⚠️`;
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
                            title: `\`Usine : ${Batiment.carriere_sable} Carrière de sable\``,
                            fields: [
                                {
                                    name: `> ⛽ Consommation :`,
                                    value:
                                        `Unitaire : \n` +
                                        codeBlock(
                                            `• ${conso_carriere_sable_carburant.toLocaleString('en-US')}\n`) +
                                        `Total : \n` +
                                        codeBlock(
                                            `• ${(conso_carriere_sable_carburant * Batiment.carriere_sable).toLocaleString('en-US')}`) + `\u200B`,
                                    inline: true
                                },
                                {
                                    name: `> ⚡ Consommation :`,
                                    value:
                                        `Unitaire : \n` +
                                        codeBlock(
                                            `• ${conso_carriere_sable_elec.toLocaleString('en-US')}\n`) +
                                        `Total : \n` +
                                        codeBlock(
                                            `• ${(conso_carriere_sable_elec * Batiment.carriere_sable).toLocaleString('en-US')}`) + `\u200B`,
                                    inline: true
                                },
                                {
                                    name: `> <:sable:1075776363782479873> Production : Sable`,
                                    value: `⛏️ x${coef_sable}\n` +
                                        codeBlock(
                                        `• Par usine : ${prod_carriere_sable.toLocaleString('en-US')}\n` +
                                        `• Totale : ${(prod_carriere_sable * Batiment.carriere_sable).toLocaleString('en-US')}`) + `\u200B`
                                },
                                {
                                    name: sableName,
                                    value: Sable + `\u200B`
                                },
                                {
                                    name: `> 🏞️ Surface :`,
                                    value: `Unitaire : \n` +
                                        codeBlock(
                                            `• ${(batimentObject.carriere_sable.SURFACE_CARRIERE_SABLE).toLocaleString('en-US')} km²`) +
                                        `Totale : \n` +
                                        codeBlock(
                                            `• ${(batimentObject.carriere_sable.SURFACE_CARRIERE_SABLE * Batiment.carriere_sable).toLocaleString('en-US')} km²`) + `\u200B`,
                                    inline: true
                                },
                                {
                                    name: `> 👩‍🔧 Employés :`,
                                    value:
                                        `Unitaire : \n` +
                                        codeBlock(
                                            `• ${(batimentObject.carriere_sable.EMPLOYES_CARRIERE_SABLE).toLocaleString('en-US')}`) +
                                        `Totale : \n` +
                                        codeBlock(
                                            `• ${(batimentObject.carriere_sable.EMPLOYES_CARRIERE_SABLE * Batiment.carriere_sable).toLocaleString('en-US')}`) + `\u200B`,
                                    inline: true
                                },
                            ],
                            color: interaction.member.displayColor,
                            timestamp: new Date(),
                            footer: {
                                text: `${Pays.devise}`
                            }
                        };

                        interaction.reply({embeds: [embed]})
                        //endregion
                    } else if (interaction.values === 'centrale_biomasse') {
                        //region Centrale biomasse
                        const coef_eolienne = eval(`regionObject.${Territoire.region}.eolienne`)
                        const prod_centrale_biomasse = batimentObject.centrale_biomasse.PROD_CENTRALE_BIOMASSE
                        const conso_centrale_biomasse_bois = Math.round(batimentObject.centrale_biomasse.CONSO_CENTRALE_BIOMASSE_BOIS);
                        const conso_centrale_biomasse_eau = Math.round(batimentObject.centrale_biomasse.CONSO_CENTRALE_BIOMASSE_EAU);

                        let Prod = Math.round(batimentObject.eolienne.PROD_EOLIENNE * Batiment.eolienne * coef_eolienne);
                        Prod += batimentObject.centrale_biomasse.PROD_CENTRALE_BIOMASSE * Batiment.centrale_biomasse
                        Prod += batimentObject.centrale_charbon.PROD_CENTRALE_CHARBON * Batiment.centrale_charbon
                        Prod += batimentObject.centrale_fioul.PROD_CENTRALE_FIOUL * Batiment.centrale_fioul
                        const Conso = Math.round(
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
                        const Diff = Prod - Conso;
                        if (Diff / Prod > 0.1) {
                            Electricite = codeBlock('md', `> ${Conso.toLocaleString('en-US')}/${Prod.toLocaleString('en-US')} | ${Diff.toLocaleString('en-US')}'`);
                        } else if (Diff / Prod >= 0) {
                            Electricite = codeBlock('ansi', `\u001b[0;0m\u001b[1;33m> ${Conso.toLocaleString('en-US')}/${Prod.toLocaleString('en-US')} | ${Diff.toLocaleString('en-US')}`);
                        } else {
                            Electricite = codeBlock('ansi', `\u001b[0;0m\u001b[1;31m> ${Conso.toLocaleString('en-US')}/${Prod.toLocaleString('en-US')} | ${Diff.toLocaleString('en-US')}`);
                        }

                        const embed = {
                            author: {
                                name: `${Pays.rang} de ${Pays.nom}`,
                                icon_url: interaction.member.displayAvatarURL()
                            },
                            thumbnail: {
                                url: Pays.drapeau
                            },
                            title: `\`Usine : ${Batiment.centrale_biomasse} Centrale biomasse\``,
                            fields: [
                                {
                                    name: `> 🪵 Consommation :`,
                                    value:
                                        `Unitaire : \n` +
                                        codeBlock(
                                            `• ${conso_centrale_biomasse_bois.toLocaleString('en-US')}\n`) +
                                        `Total : \n` +
                                        codeBlock(
                                            `• ${(conso_centrale_biomasse_bois * Batiment.centrale_biomasse).toLocaleString('en-US')}`) + `\u200B`,
                                    inline: true
                                },
                                {
                                    name: `> 💧 Consommation :`,
                                    value:
                                        `Unitaire : \n` +
                                        codeBlock(
                                            `• ${conso_centrale_biomasse_eau.toLocaleString('en-US')}\n`) +
                                        `Total : \n` +
                                        codeBlock(
                                            `• ${(conso_centrale_biomasse_eau * Batiment.centrale_biomasse).toLocaleString('en-US')}`) + `\u200B`,
                                    inline: true
                                },
                                {
                                    name: `> ⚡ Production : Electricité`,
                                    value: codeBlock(
                                        `• Par usine : ${(prod_centrale_biomasse).toLocaleString('en-US')}\n` +
                                        `• Totale : ${(prod_centrale_biomasse * Batiment.centrale_biomasse).toLocaleString('en-US')}`) + `\u200B`
                                },
                                {
                                    name: `> ⚡ Flux :`,
                                    value: Electricite + `\u200B`
                                },
                                {
                                    name: `> 🏞️ Surface :`,
                                    value:
                                        `Unitaire : \n` +
                                        codeBlock(
                                            `• ${(batimentObject.centrale_biomasse.SURFACE_CENTRALE_BIOMASSE).toLocaleString('en-US')} km²`) +
                                        `Totale : \n` +
                                        codeBlock(
                                            `• ${(batimentObject.centrale_biomasse.SURFACE_CENTRALE_BIOMASSE * Batiment.centrale_biomasse).toLocaleString('en-US')} km²`) + `\u200B`,
                                    inline: true
                                },
                                {
                                    name: `> 👩‍🔧 Employés :`,
                                    value:
                                        `Unitaire : \n` +
                                        codeBlock(
                                            `• ${(batimentObject.centrale_biomasse.EMPLOYES_CENTRALE_BIOMASSE).toLocaleString('en-US')}`) +
                                        `Totale : \n` +
                                        codeBlock(
                                            `• ${(batimentObject.centrale_biomasse.EMPLOYES_CENTRALE_BIOMASSE * Batiment.centrale_biomasse).toLocaleString('en-US')}`) + `\u200B`,
                                    inline: true
                                },
                            ],
                            color: interaction.member.displayColor,
                            timestamp: new Date(),
                            footer: {
                                text: `${Pays.devise}`
                            }
                        };

                        interaction.reply({embeds: [embed]})
                        //endregion
                    } else if (interaction.values === 'centrale_charbon') {
                        //region Centrale au charbon
                        const coef_eolienne = eval(`regionObject.${Territoire.region}.eolienne`)
                        const prod_centrale_charbon = batimentObject.centrale_charbon.PROD_CENTRALE_CHARBON
                        const conso_centrale_charbon_charbon = Math.round(batimentObject.centrale_charbon.CONSO_CENTRALE_CHARBON_CHARBON);
                        const conso_centrale_charbon_eau = Math.round(batimentObject.centrale_charbon.CONSO_CENTRALE_CHARBON_EAU);

                        let Prod = Math.round(batimentObject.eolienne.PROD_EOLIENNE * Batiment.eolienne * coef_eolienne);
                        Prod += batimentObject.centrale_biomasse.PROD_CENTRALE_BIOMASSE * Batiment.centrale_biomasse
                        Prod += batimentObject.centrale_charbon.PROD_CENTRALE_CHARBON * Batiment.centrale_charbon
                        Prod += batimentObject.centrale_fioul.PROD_CENTRALE_FIOUL * Batiment.centrale_fioul
                        const Conso = Math.round(
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
                        const Diff = Prod - Conso;
                        if (Diff / Prod > 0.1) {
                            Electricite = codeBlock('md', `> ${Conso.toLocaleString('en-US')}/${Prod.toLocaleString('en-US')} | ${Diff.toLocaleString('en-US')}'`);
                        } else if (Diff / Prod >= 0) {
                            Electricite = codeBlock('ansi', `\u001b[0;0m\u001b[1;33m> ${Conso.toLocaleString('en-US')}/${Prod.toLocaleString('en-US')} | ${Diff.toLocaleString('en-US')}`);
                        } else {
                            Electricite = codeBlock('ansi', `\u001b[0;0m\u001b[1;31m> ${Conso.toLocaleString('en-US')}/${Prod.toLocaleString('en-US')} | ${Diff.toLocaleString('en-US')}`);
                        }

                        const embed = {
                            author: {
                                name: `${Pays.rang} de ${Pays.nom}`,
                                icon_url: interaction.member.displayAvatarURL()
                            },
                            thumbnail: {
                                url: Pays.drapeau
                            },
                            title: `\`Usine : ${Batiment.centrale_charbon} Centrale au charbon\``,
                            fields: [
                                {
                                    name: `> <:charbon:1075776385517375638> Consommation :`,
                                    value:
                                        `Unitaire : \n` +
                                        codeBlock(
                                            `• ${conso_centrale_charbon_charbon.toLocaleString('en-US')}\n`) +
                                        `Total : \n` +
                                        codeBlock(
                                            `• ${(conso_centrale_charbon_charbon * Batiment.centrale_charbon).toLocaleString('en-US')}`) + `\u200B`,
                                    inline: true
                                },
                                {
                                    name: `> 💧 Consommation :`,
                                    value:
                                        `Unitaire : \n` +
                                        codeBlock(
                                            `• ${conso_centrale_charbon_eau.toLocaleString('en-US')}\n`) +
                                        `Total : \n` +
                                        codeBlock(
                                            `• ${(conso_centrale_charbon_eau * Batiment.centrale_charbon).toLocaleString('en-US')}`) + `\u200B`,
                                    inline: true
                                },
                                {
                                    name: `> ⚡ Production : Electricité`,
                                    value: codeBlock(
                                        `• Par usine : ${(prod_centrale_charbon).toLocaleString('en-US')}\n` +
                                        `• Totale : ${(prod_centrale_charbon * Batiment.centrale_charbon).toLocaleString('en-US')}`) + `\u200B`
                                },
                                {
                                    name: `> ⚡ Flux :`,
                                    value: Electricite + `\u200B`
                                },
                                {
                                    name: `> 🏞️ Surface :`,
                                    value:
                                        `Unitaire : \n` +
                                        codeBlock(
                                            `• ${(batimentObject.centrale_charbon.SURFACE_CENTRALE_CHARBON).toLocaleString('en-US')} km²`) +
                                        `Totale : \n` +
                                        codeBlock(
                                            `• ${(batimentObject.centrale_charbon.SURFACE_CENTRALE_CHARBON * Batiment.centrale_charbon).toLocaleString('en-US')} km²`) + `\u200B`,
                                    inline: true
                                },
                                {
                                    name: `> 👩‍🔧 Employés :`,
                                    value:
                                        `Unitaire : \n` +
                                        codeBlock(
                                            `• ${(batimentObject.centrale_charbon.EMPLOYES_CENTRALE_CHARBON).toLocaleString('en-US')}`) +
                                        `Totale : \n` +
                                        codeBlock(
                                            `• ${(batimentObject.centrale_charbon.EMPLOYES_CENTRALE_CHARBON * Batiment.centrale_charbon).toLocaleString('en-US')}`) + `\u200B`,
                                    inline: true
                                },
                            ],
                            color: interaction.member.displayColor,
                            timestamp: new Date(),
                            footer: {
                                text: `${Pays.devise}`
                            }
                        };

                        interaction.reply({embeds: [embed]})
                        //endregion
                    } else if (interaction.values === 'centrale_fioul') {
                        //region Centrale au fioul
                        const coef_eolienne = eval(`regionObject.${Territoire.region}.eolienne`)
                        const prod_centrale_fioul = batimentObject.centrale_fioul.PROD_CENTRALE_FIOUL
                        const conso_centrale_fioul_carburant = Math.round(batimentObject.centrale_fioul.CONSO_CENTRALE_FIOUL_CARBURANT);
                        const conso_centrale_fioul_eau = Math.round(batimentObject.centrale_fioul.CONSO_CENTRALE_FIOUL_EAU);

                        let Prod = Math.round(batimentObject.eolienne.PROD_EOLIENNE * Batiment.eolienne * coef_eolienne);
                        Prod += batimentObject.centrale_biomasse.PROD_CENTRALE_BIOMASSE * Batiment.centrale_biomasse
                        Prod += batimentObject.centrale_charbon.PROD_CENTRALE_CHARBON * Batiment.centrale_charbon
                        Prod += batimentObject.centrale_fioul.PROD_CENTRALE_FIOUL * Batiment.centrale_fioul
                        const Conso = Math.round(
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
                        const Diff = Prod - Conso;
                        if (Diff / Prod > 0.1) {
                            Electricite = codeBlock('md', `> ${Conso.toLocaleString('en-US')}/${Prod.toLocaleString('en-US')} | ${Diff.toLocaleString('en-US')}'`);
                        } else if (Diff / Prod >= 0) {
                            Electricite = codeBlock('ansi', `\u001b[0;0m\u001b[1;33m> ${Conso.toLocaleString('en-US')}/${Prod.toLocaleString('en-US')} | ${Diff.toLocaleString('en-US')}`);
                        } else {
                            Electricite = codeBlock('ansi', `\u001b[0;0m\u001b[1;31m> ${Conso.toLocaleString('en-US')}/${Prod.toLocaleString('en-US')} | ${Diff.toLocaleString('en-US')}`);
                        }

                        const embed = {
                            author: {
                                name: `${Pays.rang} de ${Pays.nom}`,
                                icon_url: interaction.member.displayAvatarURL()
                            },
                            thumbnail: {
                                url: Pays.drapeau
                            },
                            title: `\`Usine : ${Batiment.centrale_fioul} Centrale au fioul\``,
                            fields: [
                                {
                                    name: `> ⛽ Consommation :`,
                                    value:
                                        `Unitaire : \n` +
                                        codeBlock(
                                            `• ${conso_centrale_fioul_carburant.toLocaleString('en-US')}\n`) +
                                        `Total : \n` +
                                        codeBlock(
                                            `• ${(conso_centrale_fioul_carburant * Batiment.centrale_fioul).toLocaleString('en-US')}`) + `\u200B`,
                                    inline: true
                                },
                                {
                                    name: `> 💧 Consommation :`,
                                    value:
                                        `Unitaire : \n` +
                                        codeBlock(
                                            `• ${conso_centrale_fioul_eau.toLocaleString('en-US')}\n`) +
                                        `Total : \n` +
                                        codeBlock(
                                            `• ${(conso_centrale_fioul_eau * Batiment.centrale_fioul).toLocaleString('en-US')}`) + `\u200B`,
                                    inline: true
                                },
                                {
                                    name: `> ⚡ Production : Electricité`,
                                    value: codeBlock(
                                        `• Par usine : ${(prod_centrale_fioul).toLocaleString('en-US')}\n` +
                                        `• Totale : ${(prod_centrale_fioul * Batiment.centrale_fioul).toLocaleString('en-US')}`) + `\u200B`
                                },
                                {
                                    name: `> ⚡ Flux :`,
                                    value: Electricite + `\u200B`
                                },
                                {
                                    name: `> 🏞️ Surface :`,
                                    value:
                                        `Unitaire : \n` +
                                        codeBlock(
                                            `• ${(batimentObject.centrale_fioul.SURFACE_CENTRALE_FIOUL).toLocaleString('en-US')} km²`) +
                                        `Totale : \n` +
                                        codeBlock(
                                            `• ${(batimentObject.centrale_fioul.SURFACE_CENTRALE_FIOUL * Batiment.centrale_fioul).toLocaleString('en-US')} km²`) + `\u200B`,
                                    inline: true
                                },
                                {
                                    name: `> 👩‍🔧 Employés :`,
                                    value:
                                        `Unitaire : \n` +
                                        codeBlock(
                                            `• ${(batimentObject.centrale_fioul.EMPLOYES_CENTRALE_FIOUL).toLocaleString('en-US')}`) +
                                        `Totale : \n` +
                                        codeBlock(
                                            `• ${(batimentObject.centrale_fioul.EMPLOYES_CENTRALE_FIOUL * Batiment.centrale_fioul).toLocaleString('en-US')}`) + `\u200B`,
                                    inline: true
                                },
                            ],
                            color: interaction.member.displayColor,
                            timestamp: new Date(),
                            footer: {
                                text: `${Pays.devise}`
                            }
                        };

                        interaction.reply({embeds: [embed]})
                        //endregion
                    } else if (interaction.values === 'champ') {
                        //region Champ
                        const coef_nourriture = eval(`regionObject.${Territoire.region}.nourriture`)
                        const prod_champ = Math.round(batimentObject.champ.PROD_CHAMP * eval(`gouvernementObject.${Pays.ideologie}.production`) * coef_nourriture);
                        const conso_champ_carburant = Math.round(batimentObject.champ.CONSO_CHAMP_CARBURANT * eval(`gouvernementObject.${Pays.ideologie}.consommation`));
                        const conso_champ_eau = Math.round(batimentObject.champ.CONSO_CHAMP_EAU * eval(`gouvernementObject.${Pays.ideologie}.consommation`));
                        const conso_champ_elec = Math.round(batimentObject.champ.CONSO_CHAMP_ELEC);

                        let nourritureName;
                        const conso_T_champ_carburant = Math.round(batimentObject.champ.CONSO_CHAMP_CARBURANT * Batiment.champ * eval(`gouvernementObject.${Pays.ideologie}.consommation`) * emplois);
                        const conso_T_champ_eau = Math.round(batimentObject.champ.CONSO_CHAMP_EAU * Batiment.champ * eval(`gouvernementObject.${Pays.ideologie}.consommation`) * emplois);
                        if (conso_T_champ_carburant > Ressources.carburant) {
                            nourritureName = `> ⚠️ Nourriture : ⛏️ x${coef_nourriture} ⚠️`;
                        } else if (conso_T_champ_eau > Ressources.eau) {
                            nourritureName = `> ⚠️ Nourriture : ⛏️ x${coef_nourriture} ⚠️`;
                        } else if (prod_elec < conso_elec) {
                            nourritureName = `> ⚠️ Nourriture : ⛏️ x${coef_nourriture} ⚠️`;
                        } else {
                            nourritureName = `> 🌽 Nourriture : ⛏️ x${coef_nourriture}`;
                        }
                        let Nourriture;
                        Prod = Math.round(batimentObject.champ.PROD_CHAMP * Batiment.champ * eval(`gouvernementObject.${Pays.ideologie}.production`) * coef_nourriture * emplois);
                        Conso = Math.round((Population.habitant * populationObject.NOURRITURE_CONSO) / 48);
                        Diff = Prod - Conso;
                        if (Diff / Prod > 0.1) {
                            Nourriture = codeBlock('md', `> -${Conso.toLocaleString('en-US')} | +${Prod.toLocaleString('en-US')} | :${Diff.toLocaleString('en-US')}" | 📦 ${Ressources.nourriture.toLocaleString('en-US')}`);
                        } else if (Diff / Prod >= 0) {
                            Nourriture = codeBlock('ansi', `\u001b[0;0m\u001b[1;33m> -${Conso.toLocaleString('en-US')} | +${Prod.toLocaleString('en-US')} | :${Diff.toLocaleString('en-US')} | 📦 ${Ressources.nourriture.toLocaleString('en-US')}`);
                        } else {
                            Nourriture = codeBlock('ansi', `\u001b[0;0m\u001b[1;31m> -${Conso.toLocaleString('en-US')} | +${Prod.toLocaleString('en-US')} | :${Diff.toLocaleString('en-US')} | 📦 ${Ressources.nourriture.toLocaleString('en-US')}`);
                        }

                        const embed = {
                            author: {
                                name: `${Pays.rang} de ${Pays.nom}`,
                                icon_url: interaction.member.displayAvatarURL()
                            },
                            thumbnail: {
                                url: Pays.drapeau
                            },
                            title: `\`Usine : ${Batiment.champ} Champ\``,
                            fields: [
                                {
                                    name: `> ⛽ Consommation :`,
                                    value:
                                        `Unitaire : \n` +
                                        codeBlock(
                                            `• ${conso_champ_carburant.toLocaleString('en-US')}\n`) +
                                        `Total : \n` +
                                        codeBlock(
                                            `• ${(conso_champ_carburant * Batiment.champ).toLocaleString('en-US')}`) + `\u200B`,
                                    inline: true
                                },
                                {
                                    name: `> 💧 Consommation :`,
                                    value:
                                        `Unitaire : \n` +
                                        codeBlock(
                                            `• ${conso_champ_eau.toLocaleString('en-US')}\n`) +
                                        `Total : \n` +
                                        codeBlock(
                                            `• ${(conso_champ_eau * Batiment.champ).toLocaleString('en-US')}`) + `\u200B`,
                                    inline: true
                                },
                                {
                                    name: `> ⚡ Consommation :`,
                                    value:
                                        `Unitaire : \n` +
                                        codeBlock(
                                            `• ${conso_champ_elec.toLocaleString('en-US')}\n`) +
                                        `Total : \n` +
                                        codeBlock(
                                            `• ${(conso_champ_elec * Batiment.champ).toLocaleString('en-US')}`) + `\u200B`,
                                    inline: true
                                },
                                {
                                    name: `> 🌽 Production : Nourriture`,
                                    value: `⛏️ x${coef_nourriture}\n` +
                                        codeBlock(
                                        `• Par usine : ${prod_champ.toLocaleString('en-US')}\n` +
                                        `• Totale : ${(prod_champ * Batiment.champ).toLocaleString('en-US')}`) + `\u200B`
                                },
                                {
                                    name: nourritureName,
                                    value: Nourriture + `\u200B`
                                },
                                {
                                    name: `> 🏞️ Surface :`,
                                    value: `Unitaire : \n` +
                                        codeBlock(
                                            `• ${(batimentObject.champ.SURFACE_CHAMP).toLocaleString('en-US')} km²`) +
                                        `Totale : \n` +
                                        codeBlock(
                                            `• ${(batimentObject.champ.SURFACE_CHAMP * Batiment.champ).toLocaleString('en-US')} km²`) + `\u200B`,
                                    inline: true
                                },
                                {
                                    name: `> 👩‍🔧 Employés :`,
                                    value:
                                        `Unitaire : \n` +
                                        codeBlock(
                                            `• ${(batimentObject.champ.EMPLOYES_CHAMP).toLocaleString('en-US')}`) +
                                        `Totale : \n` +
                                        codeBlock(
                                            `• ${(batimentObject.champ.EMPLOYES_CHAMP * Batiment.champ).toLocaleString('en-US')}`) + `\u200B`,
                                    inline: true
                                },
                            ],
                            color: interaction.member.displayColor,
                            timestamp: new Date(),
                            footer: {
                                text: `${Pays.devise}`
                            }
                        };

                        interaction.reply({embeds: [embed]})
                        //endregion
                    } else if (interaction.values === 'eolienne') {
                        //region Champ d'éolienne
                        const coef_eolienne = eval(`regionObject.${Territoire.region}.eolienne`)
                        const prod_eolienne = Math.round(batimentObject.eolienne.PROD_EOLIENNE * coef_eolienne);

                        let Prod = Math.round(batimentObject.eolienne.PROD_EOLIENNE * Batiment.eolienne * coef_eolienne);
                        Prod += batimentObject.centrale_biomasse.PROD_CENTRALE_BIOMASSE * Batiment.centrale_biomasse
                        Prod += batimentObject.centrale_charbon.PROD_CENTRALE_CHARBON * Batiment.centrale_charbon
                        Prod += batimentObject.centrale_fioul.PROD_CENTRALE_FIOUL * Batiment.centrale_fioul
                        const Conso = Math.round(
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
                        const Diff = Prod - Conso;
                        if (Diff / Prod > 0.1) {
                            Electricite = codeBlock('md', `> ${Conso.toLocaleString('en-US')}/${Prod.toLocaleString('en-US')} | ${Diff.toLocaleString('en-US')}'`);
                        } else if (Diff / Prod >= 0) {
                            Electricite = codeBlock('ansi', `\u001b[0;0m\u001b[1;33m> ${Conso.toLocaleString('en-US')}/${Prod.toLocaleString('en-US')} | ${Diff.toLocaleString('en-US')}`);
                        } else {
                            Electricite = codeBlock('ansi', `\u001b[0;0m\u001b[1;31m> ${Conso.toLocaleString('en-US')}/${Prod.toLocaleString('en-US')} | ${Diff.toLocaleString('en-US')}`);
                        }

                        const embed = {
                            author: {
                                name: `${Pays.rang} de ${Pays.nom}`,
                                icon_url: interaction.member.displayAvatarURL()
                            },
                            thumbnail: {
                                url: Pays.drapeau
                            },
                            title: `\`Usine : ${Batiment.eolienne} champs d'éoliennes\``,
                            fields: [
                                {
                                    name: `> ⚡ Production : Electricité`,
                                    value: codeBlock(
                                        `• Par usine : ${(prod_eolienne).toLocaleString('en-US')}\n` +
                                        `• Totale : ${(prod_eolienne * Batiment.eolienne).toLocaleString('en-US')}`) + `\u200B`
                                },
                                {
                                    name: `> ⚡ Flux :`,
                                    value: Electricite + `\u200B`
                                },
                                {
                                    name: `> 🏞️ Surface :`,
                                    value:
                                        `Unitaire : \n` +
                                        codeBlock(
                                            `• ${(batimentObject.eolienne.SURFACE_EOLIENNE).toLocaleString('en-US')} km²`) +
                                        `Totale : \n` +
                                        codeBlock(
                                            `• ${(batimentObject.eolienne.SURFACE_EOLIENNE * Batiment.eolienne).toLocaleString('en-US')} km²`) + `\u200B`,
                                    inline: true
                                },
                                {
                                    name: `> 👩‍🔧 Employés :`,
                                    value:
                                        `Unitaire : \n` +
                                        codeBlock(
                                            `• ${(batimentObject.eolienne.EMPLOYES_EOLIENNE).toLocaleString('en-US')}`) +
                                        `Totale : \n` +
                                        codeBlock(
                                            `• ${(batimentObject.eolienne.EMPLOYES_EOLIENNE * Batiment.eolienne).toLocaleString('en-US')}`) + `\u200B`,
                                    inline: true
                                },
                            ],
                            color: interaction.member.displayColor,
                            timestamp: new Date(),
                            footer: {
                                text: `${Pays.devise}`
                            }
                        };

                        interaction.reply({embeds: [embed]})
                        //endregion
                    } else if (interaction.values === 'cimenterie') {
                        //region Cimenterie
                        const prod_cimenterie = Math.round(batimentObject.cimenterie.PROD_CIMENTERIE * eval(`gouvernementObject.${Pays.ideologie}.production`));
                        const conso_cimenterie_eau = Math.round(batimentObject.cimenterie.CONSO_CIMENTERIE_EAU * eval(`gouvernementObject.${Pays.ideologie}.consommation`));
                        const conso_cimenterie_petrole = Math.round(batimentObject.cimenterie.CONSO_CIMENTERIE_PETROLE * eval(`gouvernementObject.${Pays.ideologie}.consommation`));
                        const conso_cimenterie_sable = Math.round(batimentObject.cimenterie.CONSO_CIMENTERIE_SABLE * eval(`gouvernementObject.${Pays.ideologie}.consommation`));
                        const conso_cimenterie_elec = Math.round(batimentObject.cimenterie.CONSO_CIMENTERIE_ELEC);

                        let betonName;
                        const conso_T_cimenterie_eau = Math.round(batimentObject.cimenterie.CONSO_CIMENTERIE_EAU * Batiment.cimenterie * eval(`gouvernementObject.${Pays.ideologie}.consommation`) * emplois);
                        const conso_T_cimenterie_petrole = Math.round(batimentObject.cimenterie.CONSO_CIMENTERIE_PETROLE * Batiment.cimenterie * eval(`gouvernementObject.${Pays.ideologie}.consommation`) * emplois);
                        const conso_T_cimenterie_sable = Math.round(batimentObject.cimenterie.CONSO_CIMENTERIE_SABLE * Batiment.cimenterie * eval(`gouvernementObject.${Pays.ideologie}.consommation`) * emplois);
                        if (conso_T_cimenterie_eau > Ressources.eau) {
                            betonName = `> ⚠️ Béton : ⚠️`;
                        } else if (conso_T_cimenterie_petrole > Ressources.petrole) {
                            betonName = `> ⚠️ Béton : ⚠️`;
                        }else if (conso_T_cimenterie_sable > Ressources.sable) {
                            betonName = `> ⚠️ Béton : ⚠️`;
                        }else if (prod_elec < conso_elec) {
                            betonName = `> ⚠️ Béton : ⚠️`;
                        } else {
                            betonName = `> <:beton:1075776342227943526> Béton :`;
                        }
                        let Beton;
                        Prod = Math.round(batimentObject.cimenterie.PROD_CIMENTERIE * Batiment.cimenterie * eval(`gouvernementObject.${Pays.ideologie}.production`) * emplois);
                        Conso = 0
                        Diff = Prod - Conso;
                        if (Diff / Prod > 0.1) {
                            Beton = codeBlock('md', `> -${Conso.toLocaleString('en-US')} | +${Prod.toLocaleString('en-US')} | :${Diff.toLocaleString('en-US')}" | 📦 ${Ressources.beton.toLocaleString('en-US')}`);
                        } else if (Diff / Prod >= 0) {
                            Beton = codeBlock('ansi', `\u001b[0;0m\u001b[1;33m> -${Conso.toLocaleString('en-US')} | +${Prod.toLocaleString('en-US')} | :${Diff.toLocaleString('en-US')} | 📦 ${Ressources.beton.toLocaleString('en-US')}`);
                        } else {
                            Beton = codeBlock('ansi', `\u001b[0;0m\u001b[1;31m> -${Conso.toLocaleString('en-US')} | +${Prod.toLocaleString('en-US')} | :${Diff.toLocaleString('en-US')} | 📦 ${Ressources.beton.toLocaleString('en-US')}`);
                        }
                        const embed = {
                            author: {
                                name: `${Pays.rang} de ${Pays.nom}`,
                                icon_url: interaction.member.displayAvatarURL()
                            },
                            thumbnail: {
                                url: Pays.drapeau
                            },
                            title: `\`Usine : ${Batiment.cimenterie} Cimenterie\``,
                            fields: [
                                {
                                    name: `> 💧 Consommation :`,
                                    value:
                                        `Unitaire : \n` +
                                        codeBlock(
                                            `• ${conso_cimenterie_eau.toLocaleString('en-US')}\n`) +
                                        `Total : \n` +
                                        codeBlock(
                                            `• ${(conso_cimenterie_eau * Batiment.cimenterie).toLocaleString('en-US')}`) + `\u200B`,
                                    inline: true
                                },
                                {
                                    name: `> 🛢️ Consommation :`,
                                    value:
                                        `Unitaire : \n` +
                                        codeBlock(
                                            `• ${conso_cimenterie_petrole.toLocaleString('en-US')}\n`) +
                                        `Total : \n` +
                                        codeBlock(
                                            `• ${(conso_cimenterie_petrole * Batiment.cimenterie).toLocaleString('en-US')}`) + `\u200B`,
                                    inline: true
                                },
                                {
                                    name: `> <:sable:1075776363782479873> Consommation :`,
                                    value:
                                        `Unitaire : \n` +
                                        codeBlock(
                                            `• ${conso_cimenterie_sable.toLocaleString('en-US')}\n`) +
                                        `Total : \n` +
                                        codeBlock(
                                            `• ${(conso_cimenterie_sable * Batiment.cimenterie).toLocaleString('en-US')}`) + `\u200B`,
                                    inline: true
                                },
                                {
                                    name: `> ⚡ Consommation :`,
                                    value:
                                        `Unitaire : \n` +
                                        codeBlock(
                                            `• ${conso_cimenterie_elec.toLocaleString('en-US')}\n`) +
                                        `Total : \n` +
                                        codeBlock(
                                            `• ${(conso_cimenterie_elec * Batiment.cimenterie).toLocaleString('en-US')}`) + `\u200B`,
                                    inline: true
                                },
                                {
                                    name: `> <:beton:1075776342227943526> Production : Béton`,
                                    value: codeBlock(
                                            `• Par usine : ${prod_cimenterie.toLocaleString('en-US')}\n` +
                                            `• Totale : ${(prod_cimenterie * Batiment.cimenterie).toLocaleString('en-US')}`) + `\u200B`
                                },
                                {
                                    name: betonName,
                                    value: Beton + `\u200B`
                                },
                                {
                                    name: `> 🏞️ Surface :`,
                                    value:
                                        `Unitaire : \n` +
                                        codeBlock(
                                            `• ${(batimentObject.cimenterie.SURFACE_CIMENTERIE).toLocaleString('en-US')} km²`) +
                                        `Totale : \n` +
                                        codeBlock(
                                            `• ${(batimentObject.cimenterie.SURFACE_CIMENTERIE * Batiment.cimenterie).toLocaleString('en-US')} km²`) + `\u200B`,
                                    inline: true
                                },
                                {
                                    name: `> 👩‍🔧 Employés :`,
                                    value:
                                        `Unitaire : \n` +
                                        codeBlock(
                                            `• ${(batimentObject.cimenterie.EMPLOYES_CIMENTERIE).toLocaleString('en-US')}`) +
                                        `Totale : \n` +
                                        codeBlock(
                                            `• ${(batimentObject.cimenterie.EMPLOYES_CIMENTERIE * Batiment.cimenterie).toLocaleString('en-US')}`) + `\u200B`,
                                    inline: true
                                },
                            ],
                            color: interaction.member.displayColor,
                            timestamp: new Date(),
                            footer: {
                                text: `${Pays.devise}`
                            }
                        };

                        interaction.reply({embeds: [embed]})
                        //endregion
                    } else if (interaction.values === 'derrick') {
                        //region Derrick
                        const coef_petrole = eval(`regionObject.${Territoire.region}.petrole`)

                        const prod_derrick = Math.round(batimentObject.derrick.PROD_DERRICK * eval(`gouvernementObject.${Pays.ideologie}.production`) * coef_petrole);
                        const conso_derrick_metaux = Math.round(batimentObject.derrick.CONSO_DERRICK_METAUX * eval(`gouvernementObject.${Pays.ideologie}.consommation`));
                        const conso_derrick_elec = Math.round(batimentObject.derrick.CONSO_DERRICK_ELEC);
                        const conso_T_derrick_metaux = Math.round(batimentObject.derrick.CONSO_DERRICK_METAUX * Batiment.derrick * eval(`gouvernementObject.${Pays.ideologie}.consommation`) * emplois);

                        let petroleName;
                        if (conso_T_derrick_metaux > Ressources.metaux) {
                            petroleName = `> ⚠️ Pétrole : ⛏️ x${coef_petrole} ⚠️`;
                        } else if (prod_elec < conso_elec) {
                            petroleName = `> ⚠️ Pétrole : ⛏️ x${coef_petrole} ⚠️`;
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
                            Petrole = codeBlock('md', `> -${Conso.toLocaleString('en-US')} | +${Prod.toLocaleString('en-US')} | :${Diff.toLocaleString('en-US')}" | 📦 ${Ressources.petrole.toLocaleString('en-US')}`);
                        } else if (Diff / Prod >= 0) {
                            Petrole = codeBlock('ansi', `\u001b[0;0m\u001b[1;33m> -${Conso.toLocaleString('en-US')} | +${Prod.toLocaleString('en-US')} | :${Diff.toLocaleString('en-US')} | 📦 ${Ressources.petrole.toLocaleString('en-US')}`);
                        } else {
                            Petrole = codeBlock('ansi', `\u001b[0;0m\u001b[1;31m> -${Conso.toLocaleString('en-US')} | +${Prod.toLocaleString('en-US')} | :${Diff.toLocaleString('en-US')} | 📦 ${Ressources.petrole.toLocaleString('en-US')}`);
                        }

                        const embed = {
                            author: {
                                name: `${Pays.rang} de ${Pays.nom}`,
                                icon_url: interaction.member.displayAvatarURL()
                            },
                            thumbnail: {
                                url: Pays.drapeau
                            },
                            title: `\`Usine : ${Batiment.derrick} Derrick\``,
                            fields: [
                                {
                                    name: `> 🪨 Consommation :`,
                                    value:
                                        `Unitaire : \n` +
                                        codeBlock(
                                            `• ${conso_derrick_metaux.toLocaleString('en-US')}\n`) +
                                        `Total : \n` +
                                        codeBlock(
                                            `• ${(conso_derrick_metaux * Batiment.derrick).toLocaleString('en-US')}`) + `\u200B`,
                                    inline: true
                                },
                                {
                                    name: `> ⚡ Consommation :`,
                                    value:
                                        `Unitaire : \n` +
                                        codeBlock(
                                            `• ${conso_derrick_elec.toLocaleString('en-US')}\n`) +
                                        `Total : \n` +
                                        codeBlock(
                                            `• ${(conso_derrick_elec * Batiment.derrick).toLocaleString('en-US')}`) + `\u200B`,
                                    inline: true
                                },
                                {
                                    name: `> 🛢️ Production : Pétrole`,
                                    value: `⛏️ x${coef_petrole}\n` +
                                        codeBlock(
                                            `• Par usine : ${prod_derrick.toLocaleString('en-US')}\n` +
                                            `• Totale : ${(prod_derrick * Batiment.derrick).toLocaleString('en-US')}`) + `\u200B`
                                },
                                {
                                    name: petroleName,
                                    value: Petrole + `\u200B`
                                },
                                {
                                    name: `> 🏞️ Surface :`,
                                    value:
                                        `Unitaire : \n` +
                                        codeBlock(
                                            `• ${(batimentObject.derrick.SURFACE_DERRICK).toLocaleString('en-US')} km²`) +
                                        `Totale : \n` +
                                        codeBlock(
                                            `• ${(batimentObject.derrick.SURFACE_DERRICK * Batiment.derrick).toLocaleString('en-US')} km²`) + `\u200B`,
                                    inline: true
                                },
                                {
                                    name: `> 👩‍🔧 Employés :`,
                                    value:
                                        `Unitaire : \n` +
                                        codeBlock(
                                            `• ${(batimentObject.derrick.EMPLOYES_DERRICK).toLocaleString('en-US')}`) +
                                        `Totale : \n` +
                                        codeBlock(
                                            `• ${(batimentObject.derrick.EMPLOYES_DERRICK * Batiment.derrick).toLocaleString('en-US')}`) + `\u200B`,
                                    inline: true
                                },
                            ],
                            color: interaction.member.displayColor,
                            timestamp: new Date(),
                            footer: {
                                text: `${Pays.devise}`
                            }
                        };

                        interaction.reply({embeds: [embed]})
                        //endregion
                    } else if (interaction.values === 'mine_charbon') {
                        //region Mine de charbon
                        const coef_charbon = eval(`regionObject.${Territoire.region}.charbon`)

                        const prod_mine_charbon = Math.round(batimentObject.mine_charbon.PROD_MINE_CHARBON * eval(`gouvernementObject.${Pays.ideologie}.production`) * coef_charbon);
                        const conso_mine_charbon_carburant = Math.round(batimentObject.mine_charbon.CONSO_MINE_CHARBON_CARBURANT * eval(`gouvernementObject.${Pays.ideologie}.consommation`));
                        const conso_mine_charbon_elec = Math.round(batimentObject.mine_charbon.CONSO_MINE_CHARBON_ELEC);

                        let charbonName;
                        const conso_T_mine_charbon_carburant = Math.round(batimentObject.mine_charbon.CONSO_MINE_CHARBON_CARBURANT * Batiment.mine_charbon * eval(`gouvernementObject.${Pays.ideologie}.consommation`) * emplois);
                        if (conso_T_mine_charbon_carburant > Ressources.carburant) {
                            charbonName = `> ⚠️ Charbon : ⛏️ x${coef_charbon} ⚠️`;
                        } else if (prod_elec < conso_elec) {
                            charbonName = `> ⚠️ Charbon : ⛏️ x${coef_charbon} ⚠️`;
                        } else {
                            charbonName = `> <:charbon:1075776385517375638> Charbon : ⛏️ x${coef_charbon}`;
                        }
                        let Charbon;
                        Prod = Math.round(batimentObject.mine_charbon.PROD_MINE_CHARBON * Batiment.mine_charbon * eval(`gouvernementObject.${Pays.ideologie}.production`) * coef_charbon * emplois);
                        const conso_T_acierie_charbon = Math.round(batimentObject.acierie.CONSO_ACIERIE_CHARBON * Batiment.acierie * eval(`gouvernementObject.${Pays.ideologie}.consommation`) * emplois);
                        Conso = conso_T_acierie_charbon + conso_T_centrale_charbon_charbon;
                        Diff = Prod - Conso;
                        if (Diff / Prod > 0.1) {
                            Charbon = codeBlock('md', `> -${Conso.toLocaleString('en-US')} | +${Prod.toLocaleString('en-US')} | :${Diff.toLocaleString('en-US')}" | 📦 ${Ressources.charbon.toLocaleString('en-US')}`);
                        } else if (Diff / Prod >= 0) {
                            Charbon = codeBlock('ansi', `\u001b[0;0m\u001b[1;33m> -${Conso.toLocaleString('en-US')} | +${Prod.toLocaleString('en-US')} | :${Diff.toLocaleString('en-US')} | 📦 ${Ressources.charbon.toLocaleString('en-US')}`);
                        } else {
                            Charbon = codeBlock('ansi', `\u001b[0;0m\u001b[1;31m> -${Conso.toLocaleString('en-US')} | +${Prod.toLocaleString('en-US')} | :${Diff.toLocaleString('en-US')} | 📦 ${Ressources.charbon.toLocaleString('en-US')}`);
                        }

                        const embed = {
                            author: {
                                name: `${Pays.rang} de ${Pays.nom}`,
                                icon_url: interaction.member.displayAvatarURL()
                            },
                            thumbnail: {
                                url: Pays.drapeau
                            },
                            title: `\`Usine : ${Batiment.mine_charbon} Mine de charbon\``,
                            fields: [
                                {
                                    name: `> ⛽ Consommation :`,
                                    value:
                                        `Unitaire : \n` +
                                        codeBlock(
                                            `• ${conso_mine_charbon_carburant.toLocaleString('en-US')}\n`) +
                                        `Total : \n` +
                                        codeBlock(
                                            `• ${(conso_mine_charbon_carburant * Batiment.mine_charbon).toLocaleString('en-US')}`) + `\u200B`,
                                    inline: true
                                },
                                {
                                    name: `> ⚡ Consommation :`,
                                    value:
                                        `Unitaire : \n` +
                                        codeBlock(
                                            `• ${conso_mine_charbon_elec.toLocaleString('en-US')}\n`) +
                                        `Total : \n` +
                                        codeBlock(
                                            `• ${(conso_mine_charbon_elec * Batiment.mine_charbon).toLocaleString('en-US')}`) + `\u200B`,
                                    inline: true
                                },
                                {
                                    name: `> <:charbon:1075776385517375638> Production : Charbon`,
                                    value: `⛏️ x${coef_charbon}\n` +
                                        codeBlock(
                                            `• Par usine : ${prod_mine_charbon.toLocaleString('en-US')}\n` +
                                            `• Totale : ${(prod_mine_charbon * Batiment.mine_charbon).toLocaleString('en-US')}`) + `\u200B`
                                },
                                {
                                    name: charbonName,
                                    value: Charbon + `\u200B`
                                },
                                {
                                    name: `> 🏞️ Surface :`,
                                    value: `Unitaire : \n` +
                                        codeBlock(
                                            `• ${(batimentObject.mine_charbon.SURFACE_MINE_CHARBON).toLocaleString('en-US')} km²`) +
                                        `Totale : \n` +
                                        codeBlock(
                                            `• ${(batimentObject.mine_charbon.SURFACE_MINE_CHARBON * Batiment.mine_charbon).toLocaleString('en-US')} km²`) + `\u200B`,
                                    inline: true
                                },
                                {
                                    name: `> 👩‍🔧 Employés :`,
                                    value:
                                        `Unitaire : \n` +
                                        codeBlock(
                                            `• ${(batimentObject.mine_charbon.EMPLOYES_MINE_CHARBON).toLocaleString('en-US')}`) +
                                        `Totale : \n` +
                                        codeBlock(
                                            `• ${(batimentObject.mine_charbon.EMPLOYES_MINE_CHARBON * Batiment.mine_charbon).toLocaleString('en-US')}`) + `\u200B`,
                                    inline: true
                                },
                            ],
                            color: interaction.member.displayColor,
                            timestamp: new Date(),
                            footer: {
                                text: `${Pays.devise}`
                            }
                        };

                        interaction.reply({embeds: [embed]})
                        //endregion
                    } else if (interaction.values === 'mine_metaux') {
                        //region Mine de métaux
                        const coef_metaux = eval(`regionObject.${Territoire.region}.metaux`)

                        const prod_mine_metaux = Math.round(batimentObject.mine_metaux.PROD_MINE_METAUX * eval(`gouvernementObject.${Pays.ideologie}.production`) * coef_metaux);
                        const conso_mine_metaux_carburant = Math.round(batimentObject.mine_metaux.CONSO_MINE_METAUX_CARBURANT * eval(`gouvernementObject.${Pays.ideologie}.consommation`));
                        const conso_mine_metaux_elec = Math.round(batimentObject.mine_metaux.CONSO_MINE_METAUX_ELEC);

                        let metauxName;
                        const conso_T_mine_metaux_carburant = Math.round(batimentObject.mine_metaux.CONSO_MINE_METAUX_CARBURANT * Batiment.mine_metaux * eval(`gouvernementObject.${Pays.ideologie}.consommation`) * emplois);
                        if (conso_T_mine_metaux_carburant > Ressources.carburant) {
                            metauxName = `> ⚠️ Metaux : ⛏️ x${coef_metaux} ⚠️`;
                        } else if (prod_elec < conso_elec) {
                            metauxName = `> ⚠️ Metaux : ⛏️ x${coef_metaux} ⚠️`;
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
                            Metaux = codeBlock('md', `> -${Conso.toLocaleString('en-US')} | +${Prod.toLocaleString('en-US')} | :${Diff.toLocaleString('en-US')}" | 📦 ${Ressources.metaux.toLocaleString('en-US')}`);
                        } else if (Diff / Prod >= 0) {
                            Metaux = codeBlock('ansi', `\u001b[0;0m\u001b[1;33m> -${Conso.toLocaleString('en-US')} | +${Prod.toLocaleString('en-US')} | :${Diff.toLocaleString('en-US')} | 📦 ${Ressources.metaux.toLocaleString('en-US')}`);
                        } else {
                            Metaux = codeBlock('ansi', `\u001b[0;0m\u001b[1;31m> -${Conso.toLocaleString('en-US')} | +${Prod.toLocaleString('en-US')} | :${Diff.toLocaleString('en-US')} | 📦 ${Ressources.metaux.toLocaleString('en-US')}`);
                        }

                        const embed = {
                            author: {
                                name: `${Pays.rang} de ${Pays.nom}`,
                                icon_url: interaction.member.displayAvatarURL()
                            },
                            thumbnail: {
                                url: Pays.drapeau
                            },
                            title: `\`Usine : ${Batiment.mine_metaux} Mine de métaux\``,
                            fields: [
                                {
                                    name: `> ⛽ Consommation :`,
                                    value:
                                        `Unitaire : \n` +
                                        codeBlock(
                                            `• ${conso_mine_metaux_carburant.toLocaleString('en-US')}\n`) +
                                        `Total : \n` +
                                        codeBlock(
                                            `• ${(conso_mine_metaux_carburant * Batiment.mine_metaux).toLocaleString('en-US')}`) + `\u200B`,
                                    inline: true
                                },
                                {
                                    name: `> ⚡ Consommation :`,
                                    value:
                                        `Unitaire : \n` +
                                        codeBlock(
                                            `• ${conso_mine_metaux_elec.toLocaleString('en-US')}\n`) +
                                        `Total : \n` +
                                        codeBlock(
                                            `• ${(conso_mine_metaux_elec * Batiment.mine_metaux).toLocaleString('en-US')}`) + `\u200B`,
                                    inline: true
                                },
                                {
                                    name: `> 🪨 Production : Métaux`,
                                    value: `⛏️ x${coef_metaux}\n` +
                                        codeBlock(
                                            `• Par usine : ${prod_mine_metaux.toLocaleString('en-US')}\n` +
                                            `• Totale : ${(prod_mine_metaux * Batiment.mine_metaux).toLocaleString('en-US')}`) + `\u200B`
                                },
                                {
                                    name: metauxName,
                                    value: Metaux + `\u200B`
                                },
                                {
                                    name: `> 🏞️ Surface :`,
                                    value:
                                        `Unitaire : \n` +
                                        codeBlock(
                                            `• ${(batimentObject.mine_metaux.SURFACE_MINE_METAUX).toLocaleString('en-US')} km²`) +
                                        `Totale : \n` +
                                        codeBlock(
                                            `• ${(batimentObject.mine_metaux.SURFACE_MINE_METAUX * Batiment.mine_metaux).toLocaleString('en-US')} km²`) + `\u200B`,
                                    inline: true
                                },
                                {
                                    name: `> 👩‍🔧 Employés :`,
                                    value:
                                        `Unitaire : \n` +
                                        codeBlock(
                                            `• ${(batimentObject.mine_metaux.EMPLOYES_MINE_METAUX).toLocaleString('en-US')}`) +
                                        `Totale : \n` +
                                        codeBlock(
                                            `• ${(batimentObject.mine_metaux.EMPLOYES_MINE_METAUX * Batiment.mine_metaux).toLocaleString('en-US')}`) + `\u200B`,
                                    inline: true
                                },
                            ],
                            color: interaction.member.displayColor,
                            timestamp: new Date(),
                            footer: {
                                text: `${Pays.devise}`
                            }
                        };

                        interaction.reply({embeds: [embed]})
                        //endregion
                    } else if (interaction.values === 'station_pompage') {
                        //region Station de pompage
                        const coef_eau = eval(`regionObject.${Territoire.region}.eau`)

                        const prod_station_pompage = Math.round(batimentObject.station_pompage.PROD_STATION_POMPAGE * eval(`gouvernementObject.${Pays.ideologie}.production`) * coef_eau);
                        const conso_station_pompage_carburant = Math.round(batimentObject.station_pompage.CONSO_STATION_POMPAGE_CARBURANT * eval(`gouvernementObject.${Pays.ideologie}.consommation`));
                        const conso_station_pompage_elec = Math.round(batimentObject.station_pompage.CONSO_STATION_POMPAGE_ELEC);

                        let eauName;
                        const conso_T_station_pompage_carburant = Math.round(batimentObject.station_pompage.CONSO_STATION_POMPAGE_CARBURANT * Batiment.station_pompage * eval(`gouvernementObject.${Pays.ideologie}.consommation`) * emplois);
                        if (conso_T_station_pompage_carburant > Ressources.carburant) {
                            eauName = `> ⚠️ Eau : ⛏️ x${coef_eau} ⚠️`;
                        } else if (prod_elec < conso_elec) {
                            eauName = `> ⚠️ Eau : ⛏️ x${coef_eau} ⚠️`;
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
                            Eau = codeBlock('md', `> -${Conso.toLocaleString('en-US')} | +${Prod.toLocaleString('en-US')} | :${Diff.toLocaleString('en-US')}" | 📦 ${Ressources.eau.toLocaleString('en-US')}`);
                        } else if (Diff / Prod >= 0) {
                            Eau = codeBlock('ansi', `\u001b[0;0m\u001b[1;33m> -${Conso.toLocaleString('en-US')} | +${Prod.toLocaleString('en-US')} | :${Diff.toLocaleString('en-US')} | 📦 ${Ressources.eau.toLocaleString('en-US')}`);
                        } else {
                            Eau = codeBlock('ansi', `\u001b[0;0m\u001b[1;31m> -${Conso.toLocaleString('en-US')} | +${Prod.toLocaleString('en-US')} | :${Diff.toLocaleString('en-US')} | 📦 ${Ressources.eau.toLocaleString('en-US')}`);
                        }

                        const embed = {
                            author: {
                                name: `${Pays.rang} de ${Pays.nom}`,
                                icon_url: interaction.member.displayAvatarURL()
                            },
                            thumbnail: {
                                url: Pays.drapeau
                            },
                            title: `\`Usine : ${Batiment.station_pompage} Station de pompage\``,
                            fields: [
                                {
                                    name: `> ⛽ Consommation :`,
                                    value:
                                        `Unitaire : \n` +
                                        codeBlock(
                                            `• ${conso_station_pompage_carburant.toLocaleString('en-US')}\n`) +
                                        `Total : \n` +
                                        codeBlock(
                                            `• ${(conso_station_pompage_carburant * Batiment.station_pompage).toLocaleString('en-US')}`) + `\u200B`,
                                    inline: true
                                },
                                {
                                    name: `> ⚡ Consommation :`,
                                    value:
                                        `Unitaire : \n` +
                                        codeBlock(
                                            `• ${conso_station_pompage_elec.toLocaleString('en-US')}\n`) +
                                        `Total : \n` +
                                        codeBlock(
                                            `• ${(conso_station_pompage_elec * Batiment.station_pompage).toLocaleString('en-US')}`) + `\u200B`,
                                    inline: true
                                },
                                {
                                    name: `> 💧 Production : Eau`,
                                    value: `⛏️ x${coef_eau}\n` +
                                        codeBlock(
                                            `• Par usine : ${prod_station_pompage.toLocaleString('en-US')}\n` +
                                            `• Totale : ${(prod_station_pompage * Batiment.station_pompage).toLocaleString('en-US')}`) + `\u200B`
                                },
                                {
                                    name: eauName,
                                    value: Eau + `\u200B`
                                },
                                {
                                    name: `> 🏞️ Surface :`,
                                    value:
                                        `Unitaire : \n` +
                                        codeBlock(
                                            `• ${(batimentObject.station_pompage.SURFACE_STATION_POMPAGE).toLocaleString('en-US')} km²`) +
                                        `Totale : \n` +
                                        codeBlock(
                                            `• ${(batimentObject.station_pompage.SURFACE_STATION_POMPAGE * Batiment.station_pompage).toLocaleString('en-US')} km²`) + `\u200B`,
                                    inline: true
                                },
                                {
                                    name: `> 👩‍🔧 Employés :`,
                                    value:
                                        `Unitaire : \n` +
                                        codeBlock(
                                            `• ${(batimentObject.station_pompage.EMPLOYES_STATION_POMPAGE).toLocaleString('en-US')}`) +
                                        `Totale : \n` +
                                        codeBlock(
                                            `• ${(batimentObject.station_pompage.EMPLOYES_STATION_POMPAGE * Batiment.station_pompage).toLocaleString('en-US')}`) + `\u200B`,
                                    inline: true
                                },
                            ],
                            color: interaction.member.displayColor,
                            timestamp: new Date(),
                            footer: {
                                text: `${Pays.devise}`
                            }
                        };

                        interaction.reply({embeds: [embed]})
                        //endregion
                    } else if (interaction.values === 'raffinerie') {
                        //region Raffinerie
                        const prod_raffinerie = Math.round(batimentObject.raffinerie.PROD_RAFFINERIE * eval(`gouvernementObject.${Pays.ideologie}.production`));
                        const conso_raffinerie_petrole = Math.round(batimentObject.raffinerie.CONSO_RAFFINERIE_PETROLE * eval(`gouvernementObject.${Pays.ideologie}.consommation`));
                        const conso_raffinerie_elec = Math.round(batimentObject.raffinerie.CONSO_RAFFINERIE_ELEC);

                        let carburantName;
                        const conso_T_raffinerie_petrole = Math.round(batimentObject.raffinerie.CONSO_RAFFINERIE_PETROLE * Batiment.raffinerie * eval(`gouvernementObject.${Pays.ideologie}.consommation`) * emplois);
                        if (conso_T_raffinerie_petrole > Ressources.petrole) {
                            carburantName = `> ⚠️ Carburant : ⚠️`;
                        } else if (prod_elec < conso_elec) {
                            carburantName = `> ⚠️ Carburant : ⚠️`;
                        } else {
                            carburantName = `> ⛽ Carburant :`;
                        }
                        let Carburant;
                        Prod = Math.round(batimentObject.raffinerie.PROD_RAFFINERIE * Batiment.raffinerie * eval(`gouvernementObject.${Pays.ideologie}.production`) * emplois);
                        const conso_T_carriere_sable_carburant = Math.round(batimentObject.carriere_sable.CONSO_CARRIERE_SABLE_CARBURANT * Batiment.carriere_sable * eval(`gouvernementObject.${Pays.ideologie}.consommation`) * emplois);
                        const conso_T_champ_carburant = Math.round(batimentObject.champ.CONSO_CHAMP_CARBURANT * Batiment.champ * eval(`gouvernementObject.${Pays.ideologie}.consommation`) * emplois);
                        const conso_T_mine_charbon_carburant = Math.round(batimentObject.mine_charbon.CONSO_MINE_CHARBON_CARBURANT * Batiment.mine_charbon * eval(`gouvernementObject.${Pays.ideologie}.consommation`) * emplois);
                        const conso_T_mine_metaux_carburant = Math.round(batimentObject.mine_metaux.CONSO_MINE_METAUX_CARBURANT * Batiment.mine_metaux * eval(`gouvernementObject.${Pays.ideologie}.consommation`) * emplois);
                        const conso_T_station_pompage_carburant = Math.round(batimentObject.station_pompage.CONSO_STATION_POMPAGE_CARBURANT * Batiment.station_pompage * eval(`gouvernementObject.${Pays.ideologie}.consommation`) * emplois);
                        const conso_T_scierie_carburant = Math.round(batimentObject.scierie.CONSO_SCIERIE_CARBURANT * Batiment.scierie * eval(`gouvernementObject.${Pays.ideologie}.consommation`) * emplois);
                        Conso = conso_T_carriere_sable_carburant + conso_T_champ_carburant + conso_T_mine_charbon_carburant + conso_T_mine_metaux_carburant + conso_T_station_pompage_carburant + conso_T_scierie_carburant + conso_T_centrale_fioul_carburant;
                        Diff = Prod - Conso;
                        if (Diff / Prod > 0.1) {
                            Carburant = codeBlock('md', `> -${Conso.toLocaleString('en-US')} | +${Prod.toLocaleString('en-US')} | :${Diff.toLocaleString('en-US')}" | 📦 ${Ressources.carburant.toLocaleString('en-US')}`);
                        } else if (Diff / Prod >= 0) {
                            Carburant = codeBlock('ansi', `\u001b[0;0m\u001b[1;33m> -${Conso.toLocaleString('en-US')} | +${Prod.toLocaleString('en-US')} | :${Diff.toLocaleString('en-US')} | 📦 ${Ressources.carburant.toLocaleString('en-US')}`);
                        } else {
                            Carburant = codeBlock('ansi', `\u001b[0;0m\u001b[1;31m> -${Conso.toLocaleString('en-US')} | +${Prod.toLocaleString('en-US')} | :${Diff.toLocaleString('en-US')} | 📦 ${Ressources.carburant.toLocaleString('en-US')}`);
                        }

                        const embed = {
                            author: {
                                name: `${Pays.rang} de ${Pays.nom}`,
                                icon_url: interaction.member.displayAvatarURL()
                            },
                            thumbnail: {
                                url: Pays.drapeau
                            },
                            title: `\`Usine : ${Batiment.raffinerie} Raffinerie\``,
                            fields: [
                                {
                                    name: `> 🛢️ Consommation :`,
                                    value:
                                        `Unitaire : \n` +
                                        codeBlock(
                                            `• ${conso_raffinerie_petrole.toLocaleString('en-US')}\n`) +
                                        `Total : \n` +
                                        codeBlock(
                                            `• ${(conso_raffinerie_petrole * Batiment.raffinerie).toLocaleString('en-US')}`) + `\u200B`,
                                    inline: true
                                },
                                {
                                    name: `> ⚡ Consommation :`,
                                    value:
                                        `Unitaire : \n` +
                                        codeBlock(
                                            `• ${conso_raffinerie_elec.toLocaleString('en-US')}\n`) +
                                        `Total : \n` +
                                        codeBlock(
                                            `• ${(conso_raffinerie_elec * Batiment.raffinerie).toLocaleString('en-US')}`) + `\u200B`,
                                    inline: true
                                },
                                {
                                    name: `> ⛽ Production : Carburant`,
                                    value: codeBlock(
                                            `• Par usine : ${prod_raffinerie.toLocaleString('en-US')}\n` +
                                            `• Totale : ${(prod_raffinerie * Batiment.raffinerie).toLocaleString('en-US')}`) + `\u200B`
                                },
                                {
                                    name: carburantName,
                                    value: Carburant + `\u200B`
                                },
                                {
                                    name: `> 🏞️ Surface :`,
                                    value:
                                        `Unitaire : \n` +
                                        codeBlock(
                                            `• ${(batimentObject.raffinerie.SURFACE_RAFFINERIE).toLocaleString('en-US')} km²`) +
                                        `Totale : \n` +
                                        codeBlock(
                                            `• ${(batimentObject.raffinerie.SURFACE_RAFFINERIE * Batiment.raffinerie).toLocaleString('en-US')} km²`) + `\u200B`,
                                    inline: true
                                },
                                {
                                    name: `> 👩‍🔧 Employés :`,
                                    value:
                                        `Unitaire : \n` +
                                        codeBlock(
                                            `• ${(batimentObject.raffinerie.EMPLOYES_RAFFINERIE).toLocaleString('en-US')}`) +
                                        `Totale : \n` +
                                        codeBlock(
                                            `• ${(batimentObject.raffinerie.EMPLOYES_RAFFINERIE * Batiment.raffinerie).toLocaleString('en-US')}`) + `\u200B`,
                                    inline: true
                                },
                            ],
                            color: interaction.member.displayColor,
                            timestamp: new Date(),
                            footer: {
                                text: `${Pays.devise}`
                            }
                        };

                        interaction.reply({embeds: [embed]})
                        //endregion
                    } else if (interaction.values === 'scierie') {
                        //region Scierie
                        const coef_bois = eval(`regionObject.${Territoire.region}.bois`)

                        const prod_scierie = Math.round(batimentObject.scierie.PROD_SCIERIE * eval(`gouvernementObject.${Pays.ideologie}.production`) * coef_bois);
                        const conso_scierie_carburant = Math.round(batimentObject.scierie.CONSO_SCIERIE_CARBURANT * eval(`gouvernementObject.${Pays.ideologie}.consommation`));
                        const conso_scierie_elec = Math.round(batimentObject.scierie.CONSO_SCIERIE_ELEC);

                        let boisName;
                        const conso_T_scierie_carburant = Math.round(batimentObject.scierie.CONSO_SCIERIE_CARBURANT * Batiment.scierie * eval(`gouvernementObject.${Pays.ideologie}.consommation`) * emplois);
                        if (conso_T_scierie_carburant > Ressources.carburant) {
                            boisName = `> ⚠️ Bois : ⛏️ x${coef_bois} ⚠️`;
                        } else if (prod_elec < conso_elec) {
                            boisName = `> ⚠️ Bois : ⛏️ x${coef_bois} ⚠️`;
                        } else {
                            boisName = `> 🪵 Bois : ⛏️ x${coef_bois}`;
                        }
                        let Bois;
                        Prod = Math.round(batimentObject.scierie.PROD_SCIERIE * Batiment.scierie * eval(`gouvernementObject.${Pays.ideologie}.production`) * coef_bois * emplois);
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

                        const embed = {
                            author: {
                                name: `${Pays.rang} de ${Pays.nom}`,
                                icon_url: interaction.member.displayAvatarURL()
                            },
                            thumbnail: {
                                url: Pays.drapeau
                            },
                            title: `\`Usine : ${Batiment.scierie} Scierie\``,
                            fields: [
                                {
                                    name: `> ⛽ Consommation :`,
                                    value:
                                        `Unitaire : \n` +
                                        codeBlock(
                                            `• ${conso_scierie_carburant.toLocaleString('en-US')}\n`) +
                                        `Total : \n` +
                                        codeBlock(
                                            `• ${(conso_scierie_carburant * Batiment.scierie).toLocaleString('en-US')}`) + `\u200B`,
                                    inline: true
                                },
                                {
                                    name: `> ⚡ Consommation :`,
                                    value:
                                        `Unitaire : \n` +
                                        codeBlock(
                                            `• ${conso_scierie_elec.toLocaleString('en-US')}\n`) +
                                        `Total : \n` +
                                        codeBlock(
                                            `• ${(conso_scierie_elec * Batiment.scierie).toLocaleString('en-US')}`) + `\u200B`,
                                    inline: true
                                },
                                {
                                    name: `> 🪵 Production : Bois`,
                                    value: `⛏️ x${coef_bois}\n` +
                                        codeBlock(
                                            `• Par usine : ${prod_scierie.toLocaleString('en-US')}\n` +
                                            `• Totale : ${(prod_scierie * Batiment.scierie).toLocaleString('en-US')}`) + `\u200B`
                                },
                                {
                                    name: boisName,
                                    value: Bois + `\u200B`
                                },
                                {
                                    name: `> 🏞️ Surface :`,
                                    value:
                                        `Unitaire : \n` +
                                        codeBlock(
                                            `• ${(batimentObject.scierie.SURFACE_SCIERIE).toLocaleString('en-US')} km²`) +
                                        `Totale : \n` +
                                        codeBlock(
                                            `• ${(batimentObject.scierie.SURFACE_SCIERIE * Batiment.scierie).toLocaleString('en-US')} km²`) + `\u200B`,
                                    inline: true
                                },
                                {
                                    name: `> 👩‍🔧 Employés :`,
                                    value:
                                        `Unitaire : \n` +
                                        codeBlock(
                                            `• ${(batimentObject.scierie.EMPLOYES_SCIERIE).toLocaleString('en-US')}`) +
                                        `Totale : \n` +
                                        codeBlock(
                                            `• ${(batimentObject.scierie.EMPLOYES_SCIERIE * Batiment.scierie).toLocaleString('en-US')}`) + `\u200B`,
                                    inline: true
                                },
                            ],
                            color: interaction.member.displayColor,
                            timestamp: new Date(),
                            footer: {
                                text: `${Pays.devise}`
                            }
                        };

                        interaction.reply({embeds: [embed]})
                        //endregion
                    } else if (interaction.values === 'usine_civile') {
                        //region Usine civile

                        const prod_usine_civile = Math.round(batimentObject.usine_civile.PROD_USINE_CIVILE * eval(`gouvernementObject.${Pays.ideologie}.production`));
                        const conso_usine_civile_bois = Math.round(batimentObject.usine_civile.CONSO_USINE_CIVILE_BOIS * eval(`gouvernementObject.${Pays.ideologie}.consommation`));
                        const conso_usine_civile_metaux = Math.round(batimentObject.usine_civile.CONSO_USINE_CIVILE_METAUX * eval(`gouvernementObject.${Pays.ideologie}.consommation`));
                        const conso_usine_civile_petrole = Math.round(batimentObject.usine_civile.CONSO_USINE_CIVILE_PETROLE * eval(`gouvernementObject.${Pays.ideologie}.consommation`));
                        const conso_usine_civile_verre = Math.round(batimentObject.usine_civile.CONSO_USINE_CIVILE_VERRE * eval(`gouvernementObject.${Pays.ideologie}.consommation`));
                        const conso_usine_civile_elec = Math.round(batimentObject.usine_civile.CONSO_USINE_CIVILE_ELEC);

                        let bcName;
                        const conso_T_usine_civile_bois = Math.round(batimentObject.usine_civile.CONSO_USINE_CIVILE_BOIS * Batiment.usine_civile * eval(`gouvernementObject.${Pays.ideologie}.consommation`) * emplois);
                        const conso_T_usine_civile_metaux = Math.round(batimentObject.usine_civile.CONSO_USINE_CIVILE_METAUX * Batiment.usine_civile * eval(`gouvernementObject.${Pays.ideologie}.consommation`) * emplois);
                        const conso_T_usine_civile_petrole = Math.round(batimentObject.usine_civile.CONSO_USINE_CIVILE_PETROLE * Batiment.usine_civile * eval(`gouvernementObject.${Pays.ideologie}.consommation`) * emplois);
                        const conso_T_usine_civile_verre = Math.round(batimentObject.usine_civile.CONSO_USINE_CIVILE_VERRE * Batiment.usine_civile * eval(`gouvernementObject.${Pays.ideologie}.consommation`) * emplois);
                        if (conso_T_usine_civile_bois > Ressources.bois) {
                            bcName = `> ⚠️ Biens de consommation : ⚠️`;
                        } else if (conso_T_usine_civile_metaux > Ressources.metaux) {
                            bcName = `> ⚠️ Biens de consommation : ⚠️`;
                        } else if (conso_T_usine_civile_petrole > Ressources.petrole) {
                            bcName = `> ⚠️ Biens de consommation : ⚠️`;
                        } else if (conso_T_usine_civile_verre > Ressources.verre) {
                            bcName = `> ⚠️ Biens de consommation : ⚠️`;
                        } else if (prod_elec < conso_elec) {
                            bcName = `> ⚠️ Biens de consommation : ⚠️`;
                        } else {
                            bcName = `> 💻 Biens de consommation :`;
                        }
                        let Bc;
                        Prod = Math.round(batimentObject.usine_civile.PROD_USINE_CIVILE * Batiment.usine_civile * eval(`gouvernementObject.${Pays.ideologie}.production`) * emplois);
                        Conso = Math.round((1 + Population.bc_acces * 0.04 + Population.bonheur * 0.016 + (Population.habitant / 10000000) * 0.04) * Population.habitant / 48 * eval(`gouvernementObject.${Pays.ideologie}.conso_bc`));
                        Diff = Prod - Conso;
                        if (Diff > 0) {
                            Bc = codeBlock('md', `> -${Conso.toLocaleString('en-US')} | +${Prod.toLocaleString('en-US')} | :${Diff.toLocaleString('en-US')}" | 📦 ${Ressources.bc.toLocaleString('en-US')}`);
                        } else if (Diff === 0) {
                            Bc = codeBlock('ansi', `\u001b[0;0m\u001b[1;33m> -${Conso.toLocaleString('en-US')} | +${Prod.toLocaleString('en-US')} | :${Diff.toLocaleString('en-US')} | 📦 ${Ressources.bc.toLocaleString('en-US')}`);
                        } else {
                            Bc = codeBlock('ansi', `\u001b[0;0m\u001b[1;31m> -${Conso.toLocaleString('en-US')} | +${Prod.toLocaleString('en-US')} | :${Diff.toLocaleString('en-US')} | 📦 ${Ressources.bc.toLocaleString('en-US')}`);
                        }

                        const embed = {
                            author: {
                                name: `${Pays.rang} de ${Pays.nom}`,
                                icon_url: interaction.member.displayAvatarURL()
                            },
                            thumbnail: {
                                url: Pays.drapeau
                            },
                            title: `\`Usine : ${Batiment.usine_civile} Usine civile\``,
                            fields: [
                                {
                                    name: `> 🪵 Consommation :`,
                                    value:
                                        `Unitaire : \n` +
                                        codeBlock(
                                            `• ${conso_usine_civile_bois.toLocaleString('en-US')}\n`) +
                                        `Total : \n` +
                                        codeBlock(
                                            `• ${(conso_usine_civile_bois * Batiment.usine_civile).toLocaleString('en-US')}`) + `\u200B`,
                                    inline: true
                                },
                                {
                                    name: `> 🪨 Consommation :`,
                                    value:
                                        `Unitaire : \n` +
                                        codeBlock(
                                            `• ${conso_usine_civile_metaux.toLocaleString('en-US')}\n`) +
                                        `Total : \n` +
                                        codeBlock(
                                            `• ${(conso_usine_civile_metaux * Batiment.usine_civile).toLocaleString('en-US')}`) + `\u200B`,
                                    inline: true
                                },
                                {
                                    name: `> 🛢️ Consommation :`,
                                    value:
                                        `Unitaire : \n` +
                                        codeBlock(
                                            `• ${conso_usine_civile_petrole.toLocaleString('en-US')}\n`) +
                                        `Total : \n` +
                                        codeBlock(
                                            `• ${(conso_usine_civile_petrole * Batiment.usine_civile).toLocaleString('en-US')}`) + `\u200B`,
                                    inline: true
                                },
                                {
                                    name: `> 🪟 Consommation :`,
                                    value:
                                        `Unitaire : \n` +
                                        codeBlock(
                                            `• ${conso_usine_civile_verre.toLocaleString('en-US')}\n`) +
                                        `Total : \n` +
                                        codeBlock(
                                            `• ${(conso_usine_civile_verre * Batiment.usine_civile).toLocaleString('en-US')}`) + `\u200B`,
                                    inline: true
                                },
                                {
                                    name: `> ⚡ Consommation :`,
                                    value:
                                        `Unitaire : \n` +
                                        codeBlock(
                                            `• ${conso_usine_civile_elec.toLocaleString('en-US')}\n`) +
                                        `Total : \n` +
                                        codeBlock(
                                            `• ${(conso_usine_civile_elec * Batiment.usine_civile).toLocaleString('en-US')}`) + `\u200B`,
                                    inline: true
                                },
                                {
                                    name: `> 💻 Production : Biens de consommation`,
                                    value: codeBlock(
                                            `• Par usine : ${prod_usine_civile.toLocaleString('en-US')}\n` +
                                            `• Totale : ${(prod_usine_civile * Batiment.usine_civile).toLocaleString('en-US')}`) + `\u200B`
                                },
                                {
                                    name: bcName,
                                    value: Bc + `\u200B`
                                },
                                {
                                    name: `> 🏞️ Surface :`,
                                    value:
                                        `Unitaire : \n` +
                                        codeBlock(
                                            `• ${(batimentObject.usine_civile.SURFACE_USINE_CIVILE).toLocaleString('en-US')} km²`) +
                                        `Totale : \n` +
                                        codeBlock(
                                            `• ${(batimentObject.usine_civile.SURFACE_USINE_CIVILE * Batiment.usine_civile).toLocaleString('en-US')} km²`) + `\u200B`,
                                    inline: true
                                },
                                {
                                    name: `> 👩‍🔧 Employés :`,
                                    value:
                                        `Unitaire : \n` +
                                        codeBlock(
                                            `• ${(batimentObject.usine_civile.EMPLOYES_USINE_CIVILE).toLocaleString('en-US')}`) +
                                        `Totale : \n` +
                                        codeBlock(
                                            `• ${(batimentObject.usine_civile.EMPLOYES_USINE_CIVILE * Batiment.usine_civile).toLocaleString('en-US')}`) + `\u200B`,
                                    inline: true
                                },
                            ],
                            color: interaction.member.displayColor,
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
            } else if (interaction.customId === 'menu_start') {
                //region Start
                sql = `SELECT * FROM pays WHERE id_joueur='${interaction.member.id}'`;
                connection.query(sql, async (err, results) => {if (err) {throw err;}
                    if (results.length === 0) {
                        function modalStart(region) {
                            const modal = new ModalBuilder()
                                .setCustomId(`start-${interaction.values[0]}`)
                                .setTitle(`Créer votre cité en ${region}`);

                            const nom_cite = new TextInputBuilder()
                                .setCustomId('nom_cite')
                                .setLabel(`Quelle ville voulez-vous choisir ?`)
                                .setStyle(TextInputStyle.Short)
                                .setPlaceholder('Ne pas prendre une ville déjà prise par un autre joueur')
                                .setMaxLength(40)
                                .setRequired(true)

                            const firstActionRow = new ActionRowBuilder().addComponents(nom_cite);
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
                            case 'amerique_latine':
                                modalStart('Amérique latine')
                                break;
                            case 'amerique_du_nord':
                                modalStart('Amérique du nord')
                                break;
                            case 'amerique_du_sud':
                                modalStart('Amérique du sud')
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
                            case 'grand_nord':
                                modalStart('Grand nord')
                                break;
                            case 'moyen_orient':
                                modalStart('Moyen orient')
                                break;
                            case 'oceanie':
                                modalStart('Océanie')
                                break;
                        }
                    } else {
                        const reponse = codeBlock('ansi', `\u001b[0;0m\u001b[1;31mVous avez déjà un pays. Demandez au staff pour recommencer une simulation`);
                        await interaction.reply({content: reponse, ephemeral: true});
                    }
                })
                //endregion
            } else if (interaction.customId === 'action-armee') {
                //region Action Armée
                switch (interaction.values[0]) {
                    case 'unite':
                        //region Mobiliser une unité
                        sql = `
                            SELECT * FROM pays WHERE id_joueur='${interaction.member.id}';
                            SELECT * FROM armee WHERE id_joueur='${interaction.member.id}'
                        `;
                        connection.query(sql, async(err, results) => {if (err) {throw err;}
                            const Pays = results[0][0];
                            const Armee = results[1][0];

                            if (!results[0][0]) {
                                const reponse = codeBlock('diff', `- Cette personne ne joue pas.`);
                                await interaction.reply({ content: reponse, ephemeral: true });
                            } else {
                                const homme = (Armee.aviation * armeeObject.aviation.homme) + (Armee.infanterie * armeeObject.infanterie.homme) + (Armee.mecanise * armeeObject.mecanise.homme) + (Armee.support * armeeObject.support.homme);
                                const hommeUnite =
                                    Armee.unite * eval(`armeeObject.${Armee.strategie}.aviation`) * eval(`armeeObject.aviation.homme`) +
                                    Armee.unite * eval(`armeeObject.${Armee.strategie}.infanterie`) * eval(`armeeObject.infanterie.homme`) +
                                    Armee.unite * eval(`armeeObject.${Armee.strategie}.mecanise`) * eval(`armeeObject.mecanise.homme`) +
                                    Armee.unite * eval(`armeeObject.${Armee.strategie}.support`) * eval(`armeeObject.support.homme`);


                                const embed = {
                                    author: {
                                        name: `${Pays.rang} de ${Pays.nom}`,
                                        icon_url: interaction.member.displayAvatarURL()
                                    },
                                    thumbnail: {
                                        url: Pays.drapeau
                                    },
                                    title: `\`Menu de l'approvisionnement\``,
                                    fields: [
                                        {
                                            name: `> 🪖 Unités : opérationnelles | réserves`,
                                            value: codeBlock(
                                                `• Unité : ${Armee.unite.toLocaleString('en-US')} | ${Math.floor(Math.min((Armee.aviation/eval(`armeeObject.${Armee.strategie}.aviation`)), (Armee.infanterie/eval(`armeeObject.${Armee.strategie}.infanterie`)), (Armee.mecanise/eval(`armeeObject.${Armee.strategie}.mecanise`)), (Armee.support/eval(`armeeObject.${Armee.strategie}.support`)))).toLocaleString('en-US')}\n` +
                                                ` dont :\n` +
                                                `  • Aviation : ${(Armee.unite * eval(`armeeObject.${Armee.strategie}.aviation`)).toLocaleString('en-US')} | ${Armee.aviation.toLocaleString('en-US')}\n` +
                                                `  • Infanterie : ${(Armee.unite * eval(`armeeObject.${Armee.strategie}.infanterie`)).toLocaleString('en-US')} | ${Armee.infanterie.toLocaleString('en-US')}\n` +
                                                `  • Mécanisé : ${(Armee.unite * eval(`armeeObject.${Armee.strategie}.mecanise`)).toLocaleString('en-US')} | ${Armee.mecanise.toLocaleString('en-US')}\n` +
                                                `  • Support : ${(Armee.unite * eval(`armeeObject.${Armee.strategie}.support`)).toLocaleString('en-US')} | ${Armee.support.toLocaleString('en-US')}\n` +
                                                `‎\n` +
                                                `  • Homme : ${hommeUnite.toLocaleString('en-US')} | ${homme.toLocaleString('en-US')}`) + `\u200B`
                                        },
                                    ],
                                    color: interaction.member.displayColor,
                                    timestamp: new Date(),
                                    footer: {
                                        text: `${Pays.devise}`
                                    },
                                };
                                const unitePossible = Math.floor(Math.min((Armee.aviation/eval(`armeeObject.${Armee.strategie}.aviation`)), (Armee.infanterie/eval(`armeeObject.${Armee.strategie}.infanterie`)), (Armee.mecanise/eval(`armeeObject.${Armee.strategie}.mecanise`)), (Armee.support/eval(`armeeObject.${Armee.strategie}.support`))));
                                let plusDix = false;
                                if (unitePossible < 10) {
                                    plusDix = true;
                                }
                                let plusUn = false;
                                if (unitePossible < 1) {
                                    plusUn = true;
                                }
                                let moinsDix = false;
                                if (Armee.unite < 10) {
                                    moinsDix = true;
                                }
                                let moinsUn = false;
                                if (Armee.unite < 1) {
                                    moinsUn = true;
                                }

                                const row1 = new ActionRowBuilder()
                                    .addComponents(
                                        new ButtonBuilder()
                                            .setLabel(`10`)
                                            .setCustomId('unite+10')
                                            .setEmoji('➕')
                                            .setStyle(ButtonStyle.Success)
                                            .setDisabled(plusDix)
                                    )
                                    .addComponents(
                                        new ButtonBuilder()
                                            .setLabel(`1`)
                                            .setCustomId('unite+1')
                                            .setEmoji('➕')
                                            .setStyle(ButtonStyle.Success)
                                            .setDisabled(plusUn)
                                    )
                                    .addComponents(
                                        new ButtonBuilder()
                                            .setEmoji(`🪖`)
                                            .setCustomId('unite')
                                            .setStyle(ButtonStyle.Secondary)
                                            .setDisabled(true)
                                    )
                                    .addComponents(
                                        new ButtonBuilder()
                                            .setLabel(`1`)
                                            .setCustomId('unite-1')
                                            .setEmoji('➖')
                                            .setStyle(ButtonStyle.Danger)
                                            .setDisabled(moinsUn)
                                    )
                                    .addComponents(
                                        new ButtonBuilder()
                                            .setLabel(`10`)
                                            .setCustomId('unite-10')
                                            .setEmoji('➖')
                                            .setStyle(ButtonStyle.Danger)
                                            .setDisabled(moinsDix)
                                    )

                                await interaction.reply({ embeds: [embed], components: [row1] });
                            }
                        });
                        //endregion
                        break;
                    case 'strategie':
                        //region Strategie
                        sql = `
                            SELECT * FROM armee WHERE id_joueur='${interaction.member.id}';
                            SELECT * FROM pays WHERE id_joueur='${interaction.member.id}';
                        `;
                        connection.query(sql, async(err, results) => {if (err) {throw err;}
                            const Armee = results[0][0];
                            const Pays = results[1][0];

                            const embed = {
                                author: {
                                    name: `${Pays.rang} de ${Pays.nom}`,
                                    icon_url: interaction.member.displayAvatarURL()
                                },
                                thumbnail: {
                                    url: Pays.drapeau
                                },
                                title: `\`Menu des stratégies\``,
                                fields: [
                                    {
                                        name: `> ♟️ ${eval(`armeeObject.${Armee.strategie}.nom`)}`,
                                        value: codeBlock(
                                            `  • Aviation : ${eval(`armeeObject.${Armee.strategie}.aviation`)}\n` +
                                            `  • Infanterie : ${eval(`armeeObject.${Armee.strategie}.infanterie`)}\n` +
                                            `  • Mécanisé : ${eval(`armeeObject.${Armee.strategie}.mecanise`)}\n` +
                                            `  • Support : ${eval(`armeeObject.${Armee.strategie}.support`)}\n`) + `\u200B`
                                    },
                                ],
                                color: interaction.member.displayColor,
                                timestamp: new Date(),
                                footer: {
                                    text: `${Pays.devise}`
                                },
                            };
                            let assaut_masse = false;
                            let couleur1 = ButtonStyle.Primary;
                            if (Armee.strategie === 'assaut_masse') {
                                assaut_masse = true;
                                couleur1 = ButtonStyle.Secondary;
                            }
                            let defense = false;
                            let couleur2 = ButtonStyle.Primary;
                            if (Armee.strategie === 'defense') {
                                defense = true;
                                couleur2 = ButtonStyle.Secondary;
                            }
                            let motorisation = false;
                            let couleur3 = ButtonStyle.Primary;
                            if (Armee.strategie === 'motorisation') {
                                motorisation = true;
                                couleur3 = ButtonStyle.Secondary;
                            }
                            let puissance_feu = false;
                            let couleur4 = ButtonStyle.Primary;
                            if (Armee.strategie === 'puissance_feu') {
                                puissance_feu = true;
                                couleur4 = ButtonStyle.Secondary;
                            }

                            const row = new ActionRowBuilder()
                                .addComponents(
                                    new ButtonBuilder()
                                        .setLabel(`Assaut de masse`)
                                        .setCustomId('assaut_masse')
                                        .setEmoji('💯')
                                        .setStyle(couleur1)
                                        .setDisabled(assaut_masse)
                                )
                                .addComponents(
                                    new ButtonBuilder()
                                        .setLabel(`Défense`)
                                        .setCustomId('defense')
                                        .setEmoji('🛡️')
                                        .setStyle(couleur2)
                                        .setDisabled(defense)
                                )
                                .addComponents(
                                    new ButtonBuilder()
                                        .setLabel(`Motorisation`)
                                        .setCustomId('motorisation')
                                        .setEmoji('🛞')
                                        .setStyle(couleur3)
                                        .setDisabled(motorisation)
                                )
                                .addComponents(
                                    new ButtonBuilder()
                                        .setLabel(`Puissance de feu`)
                                        .setCustomId('puissance_feu')
                                        .setEmoji('💥')
                                        .setStyle(couleur4)
                                        .setDisabled(puissance_feu)
                                )

                            const row1 = new ActionRowBuilder()
                                .addComponents(
                                    new ButtonBuilder()
                                        .setLabel(`Choisir cette stratégie`)
                                        .setCustomId('choisir')
                                        .setStyle(ButtonStyle.Success)
                                        .setDisabled(true)
                                )

                            interaction.reply({ embeds: [embed], components: [row, row1] });
                        });
                        //endregion
                        break;
                }
                //endregion
            } else if (interaction.customId == 'action-diplomatie') {
                //region Action Diplomatie
                let userCooldowned;
                switch (interaction.values[0]) {
                    case 'creer-ambassade':
                        //region Crée une ambassade
                        const modal = new ModalBuilder()
                            .setCustomId(`creer-ambassade`)
                            .setTitle(`Créer une ambassade`);

                        const cite = new TextInputBuilder()
                            .setCustomId('cite')
                            .setLabel(`Nom de la ville:`)
                            .setPlaceholder(`Exemple : Paris`)
                            .setStyle(TextInputStyle.Short)
                            .setMaxLength(150)

                        const text_annonce = new TextInputBuilder()
                            .setCustomId('text_annonce')
                            .setLabel(`Le texte de votre demande :`)
                            .setStyle(TextInputStyle.Paragraph)
                            .setMinLength(50)
                            .setMaxLength(1500)
                            .setRequired(true)

                        const firstActionRow = new ActionRowBuilder().addComponents(cite);
                        const secondActionRow = new ActionRowBuilder().addComponents(text_annonce);
                        modal.addComponents(firstActionRow, secondActionRow);
                        interaction.showModal(modal);
                        //endregion
                        break;
                    case 'organisation':
                        //region Organisation
                        if (
                            interaction.member.roles.cache.some(role => role.name === "👤 » Maire") ||
                            interaction.member.roles.cache.some(role => role.name === "👤 » Dirigent") ||
                            interaction.member.roles.cache.some(role => role.name === "👤 » Chef d'état") ||
                            interaction.member.roles.cache.some(role => role.name === "👤 » Empereur")
                        ) {
                            userCooldowned = await organisationCommandCooldown.getUser(interaction.member.id);
                            if (userCooldowned) {
                                const timeLeft = msToMinutes(userCooldowned.msLeft, false);
                                const reponse = codeBlock('ansi', `\u001b[0;0m\u001b[1;31mVous avez déjà créé une organisation récemment. Il reste ${timeLeft.days}j ${timeLeft.hours}h ${timeLeft.minutes}min avant de pouvoir en créer une nouvelle.`);
                                await interaction.reply({ content: reponse, ephemeral: true });
                            } else {
                                const modal = new ModalBuilder()
                                    .setCustomId(`organisation`)
                                    .setTitle(`Créer une organisation`);

                                const text_nom = new TextInputBuilder()
                                    .setCustomId('text_nom')
                                    .setLabel(`Le nom de votre organisation :`)
                                    .setStyle(TextInputStyle.Short)
                                    .setMaxLength(40)
                                    .setRequired(true)

                                const text_annonce = new TextInputBuilder()
                                    .setCustomId('text_annonce')
                                    .setLabel(`Le texte de votre annonce :`)
                                    .setStyle(TextInputStyle.Paragraph)
                                    .setMinLength(50)
                                    .setMaxLength(1500)
                                    .setRequired(true)

                                const image_annonce = new TextInputBuilder()
                                    .setCustomId('image_annonce')
                                    .setLabel(`Ajouter une image :`)
                                    .setStyle(TextInputStyle.Short)
                                    .setMaxLength(150)

                                const firstActionRow = new ActionRowBuilder().addComponents(text_nom);
                                const secondActionRow = new ActionRowBuilder().addComponents(text_annonce);
                                const thirdActionRow = new ActionRowBuilder().addComponents(image_annonce);
                                modal.addComponents(firstActionRow, secondActionRow, thirdActionRow);
                                interaction.showModal(modal);
                            }
                        } else {
                            const reponse = codeBlock('ansi', `\u001b[0;0m\u001b[1;31mVous devez être une Cité-Etat pour pouvoir créer des organisations.`);
                            await interaction.reply({ content: reponse, ephemeral: true });
                        }
                        //endregion
                        break;
                }
                //endregion
            } else if (interaction.customId == 'action-gouv') {
                //region Action Gouvernement
                let userCooldowned;
                switch (interaction.values[0]) {
                    case 'annonce':
                        //region Annonce
                        const modal = new ModalBuilder()
                        .setCustomId(`annonce`)
                        .setTitle(`Faire une annonce`);

                        const text_annonce = new TextInputBuilder()
                            .setCustomId('text_annonce')
                            .setLabel(`Le texte de votre annonce :`)
                            .setStyle(TextInputStyle.Paragraph)
                            .setMinLength(100)
                            .setMaxLength(1500)
                            .setRequired(true)

                        const image_annonce = new TextInputBuilder()
                            .setCustomId('image_annonce')
                            .setLabel(`Ajouter une image :`)
                            .setPlaceholder(`Lien de l'image`)
                            .setStyle(TextInputStyle.Short)
                            .setMaxLength(150)
                            .setRequired(false)

                        const firstActionRow = new ActionRowBuilder().addComponents(text_annonce);
                        const secondActionRow = new ActionRowBuilder().addComponents(image_annonce);
                        modal.addComponents(firstActionRow, secondActionRow);
                        interaction.showModal(modal);
                        //endregion
                        break;
                    case 'devise':
                        //region Devise
                        userCooldowned = await deviseCommandCooldown.getUser(interaction.member.id);

                        if (userCooldowned) {
                            const timeLeft = msToMinutes(userCooldowned.msLeft, false);
                            const reponse = codeBlock('ansi', `\u001b[0;0m\u001b[1;31mVous avez déjà changé votre devise récemment. Il reste ${timeLeft.days}j ${timeLeft.hours}h ${timeLeft.minutes}min avant de pouvoir la changer à nouveau.`);
                            await interaction.reply({ content: reponse, ephemeral: true });
                        } else {
                            const modal = new ModalBuilder()
                                .setCustomId(`devise`)
                                .setTitle(`Choisir une devise`);

                            const text_devise = new TextInputBuilder()
                                .setCustomId('text_devise')
                                .setLabel(`Votre nouvelle devise :`)
                                .setPlaceholder(`Liberté Egalité Fraternité`)
                                .setStyle(TextInputStyle.Short)
                                .setMaxLength(40)
                                .setRequired(true)

                            const discours = new TextInputBuilder()
                                .setCustomId('discours')
                                .setLabel(`Donner un discours :`)
                                .setStyle(TextInputStyle.Paragraph)
                                .setRequired(false)
                                .setMaxLength(1000)

                            const firstActionRow = new ActionRowBuilder().addComponents(text_devise);
                            const secondActionRow = new ActionRowBuilder().addComponents(discours);
                            modal.addComponents(firstActionRow, secondActionRow);
                            interaction.showModal(modal);
                        }
                        //endregion
                        break;
                    case 'drapeau':
                        //region Drapeau
                        const sql = `SELECT * FROM pays WHERE id_joueur='${interaction.member.id}'`;
                        connection.query(sql, async(err, results) => {if (err) {throw err;}
                            const Pays = results[0];

                            if (!results[0]) {
                                const reponse = codeBlock('diff', `- Vous ne jouez pas.`);
                                await interaction.reply({ content: reponse, ephemeral: true });
                            } else {
                                const embed = {
                                    author: {
                                        name: `${Pays.rang} de ${Pays.nom}`,
                                        icon_url: interaction.member.displayAvatarURL()

                                    },
                                    title: `\`Menu du drapeau\``,
                                    description: `Voici votre drapeau actuel :`,
                                    color: interaction.member.displayColor,
                                    image: {
                                        url: Pays.drapeau
                                    },
                                    timestamp: new Date(),
                                    footer: { text: `${Pays.devise}` }
                                };

                                const row = new ActionRowBuilder()
                                    .addComponents(
                                        new ButtonBuilder()
                                            .setLabel(`Générer un drapeau aléatoire`)
                                            .setEmoji(`🔀`)
                                            .setCustomId('drapeau_aleatoire')
                                            .setStyle(ButtonStyle.Primary),
                                    )
                                    .addComponents(
                                        new ButtonBuilder()
                                            .setLabel(`Choisir un drapeau custom`)
                                            .setEmoji(`⏭`)
                                            .setCustomId('drapeau_custom')
                                            .setStyle(ButtonStyle.Success),
                                    )

                                await interaction.reply({ embeds: [embed], components: [row] });
                            }
                        });
                        //endregion
                        break;
                    case 'pweeter':
                        //region Pweeter
                        userCooldowned = await pweeterCommandCooldown.getUser(interaction.member.id);

                        if (userCooldowned) {
                            const timeLeft = msToMinutes(userCooldowned.msLeft, false);
                            const reponse = codeBlock('ansi', `\u001b[0m\u001b[1;31mVous avez déjà changé le nom de votre compte récemment. Il reste ${timeLeft.days}j ${timeLeft.hours}h ${timeLeft.minutes}min avant de pouvoir la changer à nouveau.`);
                            await interaction.reply({ content: reponse, ephemeral: true });
                        } else {
                            const modal = new ModalBuilder()
                                .setCustomId(`pweeter`)
                                .setTitle(`Choisir un pseudo Pweeter`);

                            const text_devise = new TextInputBuilder()
                                .setCustomId('pseudo')
                                .setLabel(`Votre nouveau pseudo :`)
                                .setStyle(TextInputStyle.Short)
                                .setMaxLength(60)
                                .setRequired(true)

                            const firstActionRow = new ActionRowBuilder().addComponents(text_devise);
                            modal.addComponents(firstActionRow);
                            interaction.showModal(modal);
                        }
                        //endregion
                        break;
                }
                //endregion
            } else if (interaction.customId == 'action-pays') {
                //region Action Pays
                switch (interaction.values[0]) {
                    case 'armee':
                        //region Armée
                        menuArmee(interaction, connection, armeeObject)
                        //endregion
                        break;
                    case 'diplomatie':
                        //region Diplomatie
                        menuDiplomatie(interaction, connection);
                        //endregion
                        break;
                    case 'economie':
                        //region Economie
                        menuEconomie(interaction, connection, armeeObject, batimentObject);
                        //endregion
                        break;
                    case 'gouvernement':
                        //region Gouvernement
                        menuGouvernement(interaction, connection);
                        //endregion
                        break;
                    case 'industrie':
                        //region Industrie
                        menuIndustrie(interaction, connection)
                        //endregion
                        break;
                    case 'options':
                        //region Options
                        const sql = `
                            SELECT * FROM pays WHERE id_joueur='${interaction.member.id}'
                        `;
                        connection.query(sql, async(err, results) => {if (err) {throw err;}
                            const Pays = results[0];
                            const vacances = Pays.vacances === 0 ? `Désactivé` : `Activé`

                            const embed = {
                                author: {
                                    name: `${Pays.rang} de ${Pays.nom}`,
                                    icon_url: interaction.member.displayAvatarURL()
                                },
                                thumbnail: {
                                    url: Pays.drapeau
                                },
                                title: `\`Options de jeu\``,
                                fields: [
                                    {
                                        name: `> 🏖️ Mode Vacances :`,
                                        value: codeBlock(`• ${vacances}`) + `\u200B`
                                    }
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
                                        .setCustomId('action-options')
                                        .setPlaceholder(`Effectuer une action`)
                                        .addOptions([
                                            {
                                                label: `Mode Vacances`,
                                                emoji: `🏖️`,
                                                description: `Votre cité est en pause. Vous êtes inactifs jusqu'à votre retour.`,
                                                value: 'vacances',
                                            },
                                        ]),
                                );

                            interaction.reply({ embeds: [embed], components: [row] });
                        });
                        //endregion
                        break;
                    case 'population':
                        //region Population
                        menuPopulation(interaction, connection, armeeObject, batimentObject, gouvernementObject, populationObject, regionObject)
                        //endregion
                        break;
                    case 'territoire':
                        //region Territoire
                        menuTerritoire(interaction, connection, biomeObject)
                        //endregion
                        break;
                }
                //endregion
            } else if (interaction.customId == 'action-economie') {
                //region Action Economie
                let sql;
                switch (interaction.values[0]) {
                    case 'consommations':
                        //region Matières premières
                        menuConsommation("menu", interaction, connection, armeeObject , batimentObject, gouvernementObject, populationObject, regionObject);
                        //endregion
                        break;
                    case 'industrie':
                        //region Industrie
                        menuIndustrie(interaction, connection)
                        //endregion
                        break;
                    case 'emploi':
                        //region Emploi
                        sql = `
                            SELECT * FROM armee WHERE id_joueur='${interaction.member.id}';
                            SELECT * FROM batiments WHERE id_joueur='${interaction.member.id}';
                            SELECT * FROM pays WHERE id_joueur='${interaction.member.id}';
                            SELECT * FROM population WHERE id_joueur='${interaction.member.id}'
                        `;
                        connection.query(sql, async(err, results) => {if (err) {throw err;}
                            const Armee = results[0][0];
                            const Batiment = results[1][0];
                            const Pays = results[2][0];
                            const Population = results[3][0];

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
                            const emploisTotaux =
                                emploies_acierie + emploies_atelier_verre + emploies_carriere_sable +
                                emploies_centrale_biomasse + emploies_centrale_charbon + emploies_centrale_fioul +
                                emploies_champ + emploies_cimenterie + emploies_derrick + emploies_eolienne +
                                emploies_mine_charbon + emploies_mine_metaux + emploies_station_pompage +
                                emploies_raffinerie + emploies_scierie + emploies_usine_civile;
                            const emploies = calculerEmploi(Armee, Batiment, Population, armeeObject, batimentObject).emploies
                            const efficacite = calculerEmploi(Armee, Batiment, Population, armeeObject, batimentObject).efficacite;

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
                                title: `\`Menu des emplois : nb employés | % main d'oeuvre totale\``,
                                thumbnail: {
                                    url: Pays.drapeau
                                },
                                description:
                                    `> <:acier:1075776411329122304> \`${Batiment.acierie} Acierie : ${emploies_acierie.toLocaleString('en-US')} | ${(emploies_acierie/emploisTotaux*100).toFixed(1)}%\`\n` + `\u200B\n` +
                                    `> 🪟 \`${Batiment.atelier_verre} Atelier de verre : ${emploies_atelier_verre.toLocaleString('en-US')} | ${(emploies_atelier_verre/emploisTotaux*100).toFixed(1)}%\`\n` + `\u200B\n` +
                                    `> <:sable:1075776363782479873> \`${Batiment.carriere_sable} Carrière de sable : ${emploies_carriere_sable.toLocaleString('en-US')} | ${(emploies_carriere_sable/emploisTotaux*100).toFixed(1)}%\`\n` + `\u200B\n` +
                                    `> ⚡ \`${Batiment.centrale_biomasse} Centrale biomasse : ${emploies_centrale_biomasse.toLocaleString('en-US')} | ${(emploies_centrale_biomasse/emploisTotaux*100).toFixed(1)}%\`\n` + `\u200B\n` +
                                    `> ⚡ \`${Batiment.centrale_charbon} Centrale au charbon : ${emploies_centrale_charbon.toLocaleString('en-US')} | ${(emploies_centrale_charbon/emploisTotaux*100).toFixed(1)}%\`\n` + `\u200B\n` +
                                    `> ⚡ \`${Batiment.centrale_fioul} Centrale au fioul : ${emploies_centrale_fioul.toLocaleString('en-US')} | ${(emploies_centrale_fioul/emploisTotaux*100).toFixed(1)}%\`\n` + `\u200B\n` +
                                    `> 🌽 \`${Batiment.champ} Champ : ${emploies_champ.toLocaleString('en-US')} | ${(emploies_champ/emploisTotaux*100).toFixed(1)}%\`\n` + `\u200B\n` +
                                    `> ⚡ \`${Batiment.eolienne} Champ d'éoliennes : ${emploies_eolienne.toLocaleString('en-US')} | ${(emploies_eolienne/emploisTotaux*100).toFixed(1)}%\`\n` + `\u200B\n` +
                                    `> <:beton:1075776342227943526> \`${Batiment.cimenterie} Cimenterie : ${emploies_cimenterie.toLocaleString('en-US')} | ${(emploies_cimenterie/emploisTotaux*100).toFixed(1)}%\`\n` + `\u200B\n` +
                                    `> 🛢️ \`${Batiment.derrick} Derrick : ${emploies_derrick.toLocaleString('en-US')} | ${(emploies_derrick/emploisTotaux*100).toFixed(1)}%\`\n` + `\u200B\n` +
                                    `> <:charbon:1075776385517375638> \`${Batiment.mine_charbon} Mine de charbon : ${emploies_mine_charbon.toLocaleString('en-US')} | ${(emploies_mine_charbon/emploisTotaux*100).toFixed(1)}%\`\n` + `\u200B\n` +
                                    `> 🪨 \`${Batiment.mine_metaux} Mine de métaux : ${emploies_mine_metaux.toLocaleString('en-US')} | ${(emploies_mine_metaux/emploisTotaux*100).toFixed(1)}%\`\n` + `\u200B\n` +
                                    `> 💧 \`${Batiment.station_pompage} Station de pompage : ${emploies_station_pompage.toLocaleString('en-US')} | ${(emploies_station_pompage/emploisTotaux*100).toFixed(1)}%\`\n` + `\u200B\n` +
                                    `> ⛽ \`${Batiment.raffinerie} Raffinerie : ${emploies_raffinerie.toLocaleString('en-US')} | ${(emploies_raffinerie/emploisTotaux*100).toFixed(1)}%\`\n` + `\u200B\n` +
                                    `> 🪵 \`${Batiment.scierie} Scierie : ${emploies_scierie.toLocaleString('en-US')} | ${(emploies_scierie/emploisTotaux*100).toFixed(1)}%\`\n` + `\u200B\n` +
                                    `> 💻 \`${Batiment.usine_civile} Usine civile : ${emploies_usine_civile.toLocaleString('en-US')} | ${(emploies_usine_civile/emploisTotaux*100).toFixed(1)}%\`\n` + `\u200B\n`,
                                fields: [
                                    {
                                        name: `> 👩‍🔧 Emplois :`,
                                        value: Emploi + `\u200B`
                                    }
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
                                        .setCustomId('usine')
                                        .setPlaceholder(`Le type d\'usine`)
                                        .addOptions([
                                            {
                                                label: `Acierie`,
                                                emoji: `<:acier:1075776411329122304>`,
                                                description: `Produit de l'acier`,
                                                value: 'acierie',
                                            },
                                            {
                                                label: `Atelier de verre`,
                                                emoji: `🪟`,
                                                description: `Produit du verre`,
                                                value: 'atelier_verre',
                                            },
                                            {
                                                label: `Carrière de sable`,
                                                emoji: `<:sable:1075776363782479873>`,
                                                description: `Produit du sable`,
                                                value: 'carriere_sable',
                                            },
                                            {
                                                label: `Centrale biomasse`,
                                                emoji: `⚡`,
                                                description: `Produit de l'électricité`,
                                                value: 'centrale_biomasse',
                                            },
                                            {
                                                label: `Centrale au charbon`,
                                                emoji: `⚡`,
                                                description: `Produit de l'électricité`,
                                                value: 'centrale_charbon',
                                            },
                                            {
                                                label: `Centrale au fioul`,
                                                emoji: `⚡`,
                                                description: `Produit de l'électricité`,
                                                value: 'centrale_fioul',
                                            },
                                            {
                                                label: `Champ`,
                                                emoji: `🌽`,
                                                description: `Produit de la nourriture`,
                                                value: 'champ',
                                            },
                                            {
                                                label: `Champ d'éoliennes`,
                                                emoji: `⚡`,
                                                description: `Produit de l'électricité`,
                                                value: 'eolienne',
                                            },
                                            {
                                                label: `Cimenterie`,
                                                emoji: `<:beton:1075776342227943526>`,
                                                description: `Produit du béton`,
                                                value: 'cimenterie',
                                            },
                                            {
                                                label: `Derrick`,
                                                emoji: `🛢️`,
                                                description: `Produit du pétrole`,
                                                value: 'derrick',
                                            },
                                            {
                                                label: `Mine de charbon`,
                                                emoji: `<:charbon:1075776385517375638>`,
                                                description: `Produit du charbon`,
                                                value: 'mine_charbon',
                                            },
                                            {
                                                label: `Mine de métaux`,
                                                emoji: `🪨`,
                                                description: `Produit des métaux`,
                                                value: 'mine_metaux',
                                            },
                                            {
                                                label: `Station de pompage`,
                                                emoji: `💧`,
                                                description: `Produit de l\'eau`,
                                                value: 'station_pompage',
                                            },
                                            {
                                                label: `Raffinerie`,
                                                emoji: `⛽`,
                                                description: `Produit du carburant`,
                                                value: 'raffinerie',
                                            },
                                            {
                                                label: `Scierie`,
                                                emoji: `🪵`,
                                                description: `Produit du bois`,
                                                value: 'scierie',
                                            },
                                            {
                                                label: `Usine civile`,
                                                emoji: `💻`,
                                                description: `Produit des biens de consommation`,
                                                value: 'usine_civile',
                                            },
                                        ]),
                                );

                            await interaction.reply({ embeds: [embed], components: [row] });
                        });
                }
                //endregion
                //endregion
            } else if (interaction.customId == 'action-options') {
                //region Action Options
                switch (interaction.values[0]) {
                    case 'vacances':
                        //region Vacances
                        const userCooldowned = await vacancesCommandCooldown.getUser(interaction.member.id);

                        if (userCooldowned) {
                            const timeLeft = msToMinutes(userCooldowned.msLeft, false);
                            const reponse = codeBlock('ansi', `\u001b[0;0m\u001b[1;31mVous revenez de vacances ! Il reste ${timeLeft.days}j ${timeLeft.hours}h ${timeLeft.minutes}min avant que vous puissiez partir à nouveau.`);
                            await interaction.reply({ content: reponse, ephemeral: true });
                        } else {
                            const sql = `
                                UPDATE pays SET vacances=1 WHERE id_joueur='${interaction.member.id}';
                            `;
                            connection.query(sql, async(err) => {if (err) {throw err;}
                                const reponse = codeBlock('md', `> Vous êtes désormais en mode Vacances. Profitez bien de votre pause, rien ne bougera dans chez vous. Vous restez inactif jusqu'à votre retour.`);
                                interaction.reply({ content: reponse});
                                await vacancesCommandCooldown.addUser(interaction.member.id);
                            })
                        }
                        //endregion
                        break;
                }
                //endregion
            }  else if (interaction.customId == 'action-population') {
                //region Action Population
                switch (interaction.values[0]) {
                }
                //endregion
            } else if (interaction.customId == 'action-territoire') {
                //region Action Territoire
                switch (interaction.values[0]) {
                    case 'biome':
                        sql = `
                            SELECT * FROM pays WHERE id_joueur='${interaction.member.id}';
                            SELECT * FROM territoire WHERE id_joueur='${interaction.member.id}';
                        `;
                        connection.query(sql, async(err, results) => {if (err) {throw err;}
                            const Pays = results[0][0];
                            const Territoire = results[1][0];

                            const pourVille = Math.round(Territoire.ville / Territoire.T_total * 100)
                            const pourForet = Math.round(Territoire.foret / Territoire.T_total * 100)
                            const pourPrairie = Math.round(Territoire.prairie / Territoire.T_total * 100)
                            const pourDesert = Math.round(Territoire.desert / Territoire.T_total * 100)
                            const pourToundra = Math.round(Territoire.toundra / Territoire.T_total * 100)
                            const pourTaiga = Math.round(Territoire.taiga / Territoire.T_total * 100)
                            const pourSavane = Math.round(Territoire.savane / Territoire.T_total * 100)
                            const pourRocheuses = Math.round(Territoire.rocheuses / Territoire.T_total * 100)
                            const pourVolcan = Math.round(Territoire.volcan / Territoire.T_total * 100)
                            const pourMangrove = Math.round(Territoire.mangrove / Territoire.T_total * 100)
                            const pourSteppe = Math.round(Territoire.steppe / Territoire.T_total * 100)
                            const pourJungle = Math.round(Territoire.jungle / Territoire.T_total * 100)
                            const pourLac = Math.round(Territoire.lac / Territoire.T_total * 100)

                            let Ville = codeBlock(`${Territoire.ville.toLocaleString('en-US')}/${Territoire.T_total.toLocaleString('en-US')} | ${pourVille}%`);
                            let Foret = codeBlock(`${Territoire.foret.toLocaleString('en-US')}/${Territoire.T_total.toLocaleString('en-US')} | ${pourForet}%`);
                            let Prairie = codeBlock(`${Territoire.prairie.toLocaleString('en-US')}/${Territoire.T_total.toLocaleString('en-US')} | ${pourPrairie}%`);
                            let Desert = codeBlock(`${Territoire.desert.toLocaleString('en-US')}/${Territoire.T_total.toLocaleString('en-US')} | ${pourDesert}%`);
                            let Toundra = codeBlock(`${Territoire.toundra.toLocaleString('en-US')}/${Territoire.T_total.toLocaleString('en-US')} | ${pourToundra}%`);
                            let Taiga = codeBlock(`${Territoire.taiga.toLocaleString('en-US')}/${Territoire.T_total.toLocaleString('en-US')} | ${pourTaiga}%`);
                            let Savane = codeBlock(`${Territoire.savane.toLocaleString('en-US')}/${Territoire.T_total.toLocaleString('en-US')} | ${pourSavane}%`);
                            let Rocheuses = codeBlock(`${Territoire.rocheuses.toLocaleString('en-US')}/${Territoire.T_total.toLocaleString('en-US')} | ${pourRocheuses}%`);
                            let Volcan = codeBlock(`${Territoire.volcan.toLocaleString('en-US')}/${Territoire.T_total.toLocaleString('en-US')} | ${pourVolcan}%`);;
                            let Mangrove = codeBlock(`${Territoire.mangrove.toLocaleString('en-US')}/${Territoire.T_total.toLocaleString('en-US')} | ${pourMangrove}%`);
                            let Steppe = codeBlock(`${Territoire.steppe.toLocaleString('en-US')}/${Territoire.T_total.toLocaleString('en-US')} | ${pourSteppe}%`);
                            let Jungle = codeBlock(`${Territoire.jungle.toLocaleString('en-US')}/${Territoire.T_total.toLocaleString('en-US')} | ${pourJungle}%`);
                            let Lac = codeBlock(`${Territoire.lac.toLocaleString('en-US')}/${Territoire.T_total.toLocaleString('en-US')} | ${pourLac}%`);

                            const embed = {
                                author: {
                                    name: `${Pays.rang} de ${Pays.nom}`,
                                    icon_url: interaction.member.displayAvatarURL()
                                },
                                thumbnail: {
                                    url: Pays.drapeau
                                },
                                title: `\`Biomes\``,
                                fields: [
                                    {
                                        name: `> 🏜️ Desert : `,
                                        value: Desert,
                                        inline: true
                                    },
                                    {
                                        name: `> 🌳 Foret : `,
                                        value: Foret,
                                        inline: true
                                    },
                                    {
                                        name: `> 🍌 Jungle : `,
                                        value: Jungle,
                                        inline: true
                                    },
                                    {
                                        name: `> 🌊 Lac : `,
                                        value: Lac,
                                        inline: true
                                    },
                                    {
                                        name: `> 🏝️ Mangrove : `,
                                        value: Mangrove,
                                        inline: true
                                    },
                                    {
                                        name: `> 🍀 Prairie : `,
                                        value: Prairie,
                                        inline: true
                                    },
                                    {
                                        name: `> ⛰ Rocheuses : `,
                                        value: Rocheuses,
                                        inline: true
                                    },
                                    {
                                        name: `> 🪹 Savane : `,
                                        value: Savane,
                                        inline: true
                                    },
                                    {
                                        name: `> 🌄 Steppe : `,
                                        value: Steppe,
                                        inline: true
                                    },
                                    {
                                        name: `> 🌲 Taiga : `,
                                        value: Taiga,
                                        inline: true
                                    },
                                    {
                                        name: `> 🪵 Toundra : `,
                                        value: Toundra,
                                        inline: true
                                    },
                                    {
                                        name: `> 🏙️ Ville : `,
                                        value: Ville,
                                        inline: true
                                    },
                                    {
                                        name: `> 🌋 Volcan : `,
                                        value: Volcan,
                                        inline: true
                                    },
                                ],
                                color: interaction.member.displayColor,
                                timestamp: new Date(),
                                footer: {
                                    text: Pays.devise
                                }
                            };

                            await interaction.reply({ embeds: [embed] });
                        });
                        break;
                }
                //endregion
            }
            //endregion
            //endregion
        } else if (interaction.isModalSubmit()) {
            //region Modals

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
                let cite_sans_maj = interaction.fields.getTextInputValue('nom_cite');
                function capitalizeFirstLetter(sentence) {
                    return sentence.charAt(0).toUpperCase() + sentence.slice(1).toLowerCase();
                }
                let cite = capitalizeFirstLetter(cite_sans_maj)
                const region = interaction.customId.slice(6)

                sql = `SELECT * FROM pays WHERE nom="${cite}"`;
                connection.query(sql, async (err, results) => {if (err) {throw err;}

                    if (!results[0]) {
                        const member = interaction.member;
                        if (member.roles.cache.some(role => role.name === '🕊️ » Administrateur')) {
                        } else {
                            await interaction.member.setNickname(`[${cite}] ${interaction.member.displayName}`);
                        }
                        function success(salon) {
                            function creationDb(message) {
                                const cash = chance.integer({min: 5000000, max: 5050000});
                                const jeune = chance.integer({min: 50000, max: 50100});

                                let sql = `
                                        INSERT INTO armee SET id_joueur="${interaction.user.id}";
                                        INSERT INTO batiments SET id_joueur="${interaction.user.id}";
                                        INSERT INTO diplomatie SET id_joueur="${interaction.user.id}";
                                        INSERT INTO pays SET id_joueur="${interaction.user.id}",
                                                             nom="${cite}",
                                                             id_salon="${salon.id.toString()}",
                                                             drapeau="${message.embeds[0].thumbnail.url}",
                                                             avatarURL="${interaction.member.displayAvatarURL()}",
                                                             cash='${cash}',
                                                             pweeter="@${interaction.member.displayName}";
                                        INSERT INTO population SET id_joueur="${interaction.user.id}",
                                                                   habitant='${jeune}',
                                                                   jeune='${jeune}',
                                                                   ancien_pop='${jeune}';
                                        INSERT INTO ressources SET id_joueur="${interaction.user.id}"
                                    `;
                                connection.query(sql, async (err) => {if (err) {throw err;}});
                            };

                            const canvas = createCanvas(600, 400)
                            const ctx = canvas.getContext('2d')

                            function print_flag() {
                                const out = fs.createWriteStream('flags/output.png')
                                const stream = canvas.createPNGStream()

                                return new Promise((resolve, reject) => {
                                    stream.on('data', (chunk) => {
                                        out.write(chunk);
                                    });

                                    stream.on('end', () => {
                                        out.end();
                                        resolve();

                                        const attachment = new AttachmentBuilder('flags/output.png', { name: 'drapeau.png'});
                                        const salon_drapeau = interaction.client.channels.cache.get("942796854389784628");
                                        salon_drapeau.send({files: [attachment]});
                                    });

                                    stream.on('error', (error) => {
                                        reject(error);
                                    });
                                });
                            }

                            const figures = chance.pickone([
                                "fond",
                                "bandes",
                                "lignes",
                                "anglais",
                                "suisse",
                                "scandinave",
                            ])
                            function couleurs(nombre) {
                                return chance.pickset([
                                    "#ffffff",
                                    "#000000",
                                    "#012269",
                                    "#0018a8",
                                    "#003593",
                                    "#0153a5",
                                    "#428fdf",
                                    "#3a7dce",
                                    "#74acdf",
                                    "#0080ff",
                                    "#00778b",
                                    "#009e61",
                                    "#41b226",
                                    "#3f9c34",
                                    "#007848",
                                    "#006233",
                                    "#fec400",
                                    "#ffdd00",
                                    "#d57800",
                                    "#f67f00",
                                    "#fe4e12",
                                    "#eb2839",
                                    "#fe0000",
                                    "#c9072a",
                                    "#8d1b3d",
                                ], nombre)}

                            let logo;
                            const width = 600;   // Largeur du canevas
                            const height = 400;
                            const couleur = couleurs(1)[0];
                            let crossThickness = 72; // Épaisseur de la croix
                            switch (figures) {
                                case "fond":
                                    ctx.fillStyle = couleurs(1)[0]
                                    ctx.fillRect(0, 0, 600, 400)

                                    logo = chance.pickone([
                                        'full_avec_logo',
                                        'full_sans_logo',
                                        'simple_logo'
                                    ])

                                    switch (logo) {
                                        case 'full_avec_logo':
                                            loadImage('flags/full_avec_logo'+chance.integer({min: 1, max: process.env.NBR_FULL_AVEC_LOGO})+'.png')
                                                .then((image) => {
                                                    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
                                                    loadImage('flags/simple_logo'+chance.integer({min: 1, max: process.env.NBR_SIMPLE_LOGO})+'.png')
                                                        .then((image) => {
                                                            const position = chance.pickone(['full', 'haut_droite', 'haut_gauche', 'bas_droite', 'bas_gauche'])
                                                            switch (position) {
                                                                case 'full':
                                                                    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
                                                                    break;
                                                                case 'haut_droite':
                                                                    ctx.drawImage(image, canvas.width/2, 0, canvas.width/2, canvas.height/2);
                                                                    break;
                                                                case 'haut_gauche':
                                                                    ctx.drawImage(image, 0, 0, canvas.width/2, canvas.height/2);
                                                                    break;
                                                                case 'bas_droite':
                                                                    ctx.drawImage(image, canvas.width/2, canvas.height/2, canvas.width/2, canvas.height/2);
                                                                    break;
                                                                case 'bas_gauche':
                                                                    ctx.drawImage(image, 0, canvas.height/2, canvas.width/2, canvas.height/2);
                                                                    break;
                                                            }
                                                            print_flag()
                                                        })
                                                })
                                            break;
                                        case 'full_sans_logo':
                                            loadImage('flags/full_sans_logo'+chance.integer({min: 1, max: process.env.NBR_FULL_SANS_LOGO})+'.png')
                                                .then((image) => {
                                                    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
                                                    print_flag()
                                                })
                                            break;
                                        case 'simple_logo':
                                            loadImage('flags/simple_logo'+chance.integer({min: 1, max: process.env.NBR_SIMPLE_LOGO})+'.png')
                                                .then((image) => {
                                                    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
                                                    print_flag()
                                                })
                                            break;
                                    }
                                    break;
                                case "bandes":
                                    for (let i = 0; i < 3; i++) {
                                        ctx.fillStyle = couleurs(3)[i]
                                        ctx.fillRect(i * (canvas.width / 3), 0, canvas.width / 3, canvas.height);
                                    }
                                    logo = chance.pickone([
                                        'rien',
                                        'rien',
                                        'full_avec_logo',
                                        'full_sans_logo',
                                        'simple_logo'
                                    ])

                                    switch (logo) {
                                        case 'rien':
                                            print_flag()
                                            break;
                                        case 'full_avec_logo':
                                            loadImage('flags/full_avec_logo'+chance.integer({min: 1, max: process.env.NBR_FULL_AVEC_LOGO})+'.png')
                                                .then((image) => {
                                                    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
                                                    print_flag()
                                                })
                                            break;
                                        case 'full_sans_logo':
                                            loadImage('flags/full_sans_logo'+chance.integer({min: 1, max: process.env.NBR_FULL_SANS_LOGO})+'.png')
                                                .then((image) => {
                                                    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
                                                    print_flag()
                                                })
                                            break;
                                        case 'simple_logo':
                                            loadImage('flags/simple_logo'+chance.integer({min: 1, max: process.env.NBR_SIMPLE_LOGO})+'.png')
                                                .then((image) => {
                                                    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
                                                    print_flag()
                                                })
                                            break;
                                    }
                                    break;
                                case "lignes":
                                    for (let i = 0; i < 3; i++) {
                                        ctx.fillStyle = couleurs(3)[i]
                                        ctx.fillRect(0, i * (canvas.height / 3), canvas.width, canvas.height / 3);
                                    }

                                    logo = chance.pickone([
                                        'rien',
                                        'rien',
                                        'full_avec_logo',
                                        'full_sans_logo',
                                        'simple_logo'
                                    ])

                                    switch (logo) {
                                        case 'rien':
                                            print_flag()
                                            break;
                                        case 'full_avec_logo':
                                            loadImage('flags/full_avec_logo'+chance.integer({min: 1, max: process.env.NBR_FULL_AVEC_LOGO})+'.png')
                                                .then((image) => {
                                                    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
                                                    print_flag()
                                                })
                                            break;
                                        case 'full_sans_logo':
                                            loadImage('flags/full_sans_logo'+chance.integer({min: 1, max: process.env.NBR_FULL_SANS_LOGO})+'.png')
                                                .then((image) => {
                                                    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
                                                    print_flag()
                                                })
                                            break;
                                        case 'simple_logo':
                                            loadImage('flags/simple_logo'+chance.integer({min: 1, max: process.env.NBR_SIMPLE_LOGO})+'.png')
                                                .then((image) => {
                                                    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
                                                    print_flag()
                                                })
                                            break;
                                    }
                                    break;
                                case "anglais":
                                    ctx.fillStyle = couleurs(1)[0];
                                    ctx.fillRect(0, 0, 600, 400);

                                    // Dessin de la croix horizontale
                                    ctx.fillStyle = couleur;
                                    ctx.fillRect(0, (height - crossThickness) / 2, width, crossThickness);

                                    // Dessin de la croix verticale
                                    ctx.fillRect((width - crossThickness) / 2, 0, crossThickness, height);


                                    logo = chance.pickone([
                                        'rien',
                                        'rien',
                                        'simple_logo'
                                    ])

                                    switch (logo) {
                                        case 'rien':
                                            print_flag()
                                            break;
                                        case 'simple_logo':
                                            loadImage('flags/simple_logo'+chance.integer({min: 1, max: process.env.NBR_SIMPLE_LOGO})+'.png')
                                                .then((image) => {
                                                    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
                                                    print_flag()
                                                })
                                            break;
                                    }
                                    break;
                                case "suisse":
                                    ctx.fillStyle = couleurs(1)[0]
                                    ctx.fillRect(0, 0, 600, 400);

                                    // Dessin des bras verticaux de la croix
                                    ctx.fillStyle = couleurs(1)[0]
                                    ctx.fillRect((600 - 40) / 2, (400 - 240) / 2, 40, 240);

                                    // Dessin des bras horizontaux de la croix
                                    ctx.fillRect((600 - 240) / 2, (400 - 40) / 2, 240, 40);

                                    print_flag()
                                    break;
                                case "scandinave":
                                    ctx.fillStyle = couleurs(1)[0];
                                    ctx.fillRect(0, 0, 600, 400);

                                    crossThickness = 75;  // Épaisseur de la croix en pixels

                                    // Dessin de la croix horizontale
                                    ctx.fillStyle = couleur;
                                    ctx.fillRect(0, (height - crossThickness) / 2, width, crossThickness);

                                    // Dessin de la croix verticale
                                    ctx.fillRect(187.5, 0, crossThickness, height);

                                    logo = chance.pickone([
                                        'rien',
                                        'rien',
                                        'simple_logo'
                                    ])

                                    switch (logo) {
                                        case 'rien':
                                            print_flag()
                                            break;
                                        case 'simple_logo':
                                            loadImage('flags/simple_logo' + chance.integer({
                                                min: 1,
                                                max: process.env.NBR_SIMPLE_LOGO
                                            }) + '.png')
                                                .then((image) => {
                                                    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
                                                    print_flag()
                                                })
                                            break;
                                    }
                                    break;
                            }

                            const attachment = new AttachmentBuilder('flags/output.png', { name: 'drapeau.png'});
                            const nouveauSalon = {
                                author: {
                                    name: `Cité de ${cite}`,
                                    icon_url: interaction.member.displayAvatarURL()
                                },
                                thumbnail: {
                                    url: 'attachment://drapeau.png',
                                },
                                title: `\`Bienvenue dans votre cité !\``,
                                fields: [{
                                    name: `Commencement :`,
                                    value: `Menez votre peuple à la gloire ! Ici se trouve votre salon, vous ferez la plupart de vos commandes ici. C'est un jeu assez complexe, mais nous avons un tutoriel qui commence juste ici <#983315824217579520> !`
                                }],
                                color: 0x57F287,
                                timestamp: new Date(),
                                footer: {
                                    text: `Paz Nation, le meilleur serveur Discord français`
                                },
                            };
                            salon.send({content: `<@${interaction.member.id}>`, embeds: [nouveauSalon], files: [attachment]})
                                .then(message => creationDb(message));

                            const T_total = 16000;
                            const T_occ = 15 + 6 * batimentObject.champ.SURFACE_CHAMP + 2 * batimentObject.derrick.SURFACE_DERRICK;
                            const T_libre = T_total - T_occ;
                            switch (region) {
                                case 'afrique_australe':
                                    sql = `INSERT INTO territoire
                                           SET id_joueur="${interaction.user.id}",
                                               T_total='${T_total}',
                                               T_libre='${T_libre}',
                                               T_occ='${T_occ}',
                                               region='afrique_australe',
                                               desert=2400,
                                               foret=0,
                                               jungle=4880,
                                               lac=1520,
                                               mangrove=0,
                                               prairie=2400,
                                               rocheuses=480,
                                               savane=1600,
                                               steppe=1680,
                                               taiga=0,
                                               toundra=0,
                                               ville=960,
                                               volcan=80
                                           `;
                                    break;
                                case 'afrique_equatoriale':
                                    sql = `INSERT INTO territoire
                                           SET id_joueur="${interaction.user.id}",
                                               T_total='${T_total}',
                                               T_libre='${T_libre}',
                                               T_occ='${T_occ}',
                                               region='afrique_equatoriale',
                                               desert=0,
                                               foret=0,
                                               jungle=8800,
                                               lac=160,
                                               mangrove=800,
                                               prairie=2000,
                                               rocheuses=480,
                                               savane=2720,
                                               steppe=0,
                                               taiga=0,
                                               toundra=0,
                                               ville=960,
                                               volcan=80
                                    `;
                                    break;
                                case 'afrique_du_nord':
                                    sql = `INSERT INTO territoire
                                           SET id_joueur="${interaction.user.id}",
                                               T_total='${T_total}',
                                               T_libre='${T_libre}',
                                               T_occ='${T_occ}',
                                               region='afrique_du_nord',
                                               desert=12000,
                                               foret=0,
                                               jungle=0,
                                               lac=80,
                                               mangrove=0,
                                               prairie=0,
                                               rocheuses=480,
                                               savane=2720,
                                               steppe=2400,
                                               taiga=0,
                                               toundra=0,
                                               ville=960,
                                               volcan=80
                                    `;
                                    break;
                                case 'amerique_latine':
                                    sql = `INSERT INTO territoire
                                           SET id_joueur="${interaction.user.id}",
                                               T_total='${T_total}',
                                               T_libre='${T_libre}',
                                               T_occ='${T_occ}',
                                               region='amerique_latine',
                                               desert=1600,
                                               foret=0,
                                               jungle=4800,
                                               lac=800,
                                               mangrove=2400,
                                               prairie=3760,
                                               rocheuses=480,
                                               savane=0,
                                               steppe=0,
                                               taiga=0,
                                               toundra=1120,
                                               ville=960,
                                               volcan=80
                                    `;
                                    break;
                                case 'amerique_du_nord':
                                    sql = `INSERT INTO territoire
                                           SET id_joueur="${interaction.user.id}",
                                               T_total='${T_total}',
                                               T_libre='${T_libre}',
                                               T_occ='${T_occ}',
                                               region='amerique_du_nord',
                                               desert=2400,
                                               foret=3200,
                                               jungle=800,
                                               lac=800,
                                               mangrove=800,
                                               prairie=2800,
                                               rocheuses=480,
                                               savane=0,
                                               steppe=2400,
                                               taiga=0,
                                               toundra=0,
                                               ville=960,
                                               volcan=80
                                    `;
                                    break;
                                case 'amerique_du_sud':
                                    sql = `INSERT INTO territoire
                                           SET id_joueur="${interaction.user.id}",
                                               T_total='${T_total}',
                                               T_libre='${T_libre}',
                                               T_occ='${T_occ}',
                                               region='amerique_du_sud',
                                               desert=1440,
                                               foret=480,
                                               jungle=3250,
                                               lac=160,
                                               mangrove=0,
                                               prairie=3520,
                                               rocheuses=480,
                                               savane=1840,
                                               steppe=3520,
                                               taiga=0,
                                               toundra=0,
                                               ville=960,
                                               volcan=80
                                    `;
                                    break;
                                case 'asie_du_nord':
                                    sql = `INSERT INTO territoire
                                           SET id_joueur="${interaction.user.id}",
                                               T_total='${T_total}',
                                               T_libre='${T_libre}',
                                               T_occ='${T_occ}',
                                               region='asie_du_nord',
                                               desert=2720,
                                               foret=3680,
                                               jungle=2400,
                                               lac=800,
                                               mangrove=0,
                                               prairie=2080,
                                               rocheuses=480,
                                               savane=1280,
                                               steppe=1920,
                                               taiga=880,
                                               toundra=0,
                                               ville=960,
                                               volcan=80
                                    `;
                                    break;
                                case 'asie_du_sud':
                                    sql = `INSERT INTO territoire
                                           SET id_joueur="${interaction.user.id}",
                                               T_total='${T_total}',
                                               T_libre='${T_libre}',
                                               T_occ='${T_occ}',
                                               region='asie_du_sud',
                                               desert=0,
                                               foret=0,
                                               jungle=10160,
                                               lac=320,
                                               mangrove=1600,
                                               prairie=0,
                                               rocheuses=480,
                                               savane=0,
                                               steppe=0,
                                               taiga=0,
                                               toundra=2400,
                                               ville=960,
                                               volcan=80
                                    `;
                                    break;
                                case 'europe':
                                    sql = `INSERT INTO territoire
                                           SET id_joueur="${interaction.user.id}",
                                               T_total='${T_total}',
                                               T_libre='${T_libre}',
                                               T_occ='${T_occ}',
                                               region='europe',
                                               desert=0,
                                               foret=10480,
                                               jungle=0,
                                               lac=800,
                                               mangrove=0,
                                               prairie=3200,
                                               rocheuses=480,
                                               savane=0,
                                               steppe=0,
                                               taiga=0,
                                               toundra=0,
                                               ville=960,
                                               volcan=80
                                    `;
                                    break;
                                case 'grand_nord':
                                    sql = `INSERT INTO territoire
                                           SET id_joueur="${interaction.user.id}",
                                               T_total='${T_total}',
                                               T_libre='${T_libre}',
                                               T_occ='${T_occ}',
                                               region='grand_nord',
                                               desert=0,
                                               foret=0,
                                               jungle=0,
                                               lac=800,
                                               mangrove=0,
                                               prairie=0,
                                               rocheuses=480,
                                               savane=0,
                                               steppe=0,
                                               taiga=10160,
                                               toundra=3520,
                                               ville=960,
                                               volcan=80
                                    `;
                                    break;
                                case 'moyen_orient':
                                    sql = `INSERT INTO territoire
                                           SET id_joueur="${interaction.user.id}",
                                               T_total='${T_total}',
                                               T_libre='${T_libre}',
                                               T_occ='${T_occ}',
                                               region='moyen_orient',
                                               desert=12800,
                                               foret=0,
                                               jungle=0,
                                               lac=80,
                                               mangrove=0,
                                               prairie=0,
                                               rocheuses=480,
                                               savane=0,
                                               steppe=1600,
                                               taiga=0,
                                               toundra=0,
                                               ville=960,
                                               volcan=80
                                    `;
                                    break;
                                case 'oceanie':
                                    sql = `INSERT INTO territoire
                                           SET id_joueur="${interaction.user.id}",
                                               T_total='${T_total}',
                                               T_libre='${T_libre}',
                                               T_occ='${T_occ}',
                                               region='oceanie',
                                               desert=5600,
                                               foret=1280,
                                               jungle=1280,
                                               lac=160,
                                               mangrove=1120,
                                               prairie=4000,
                                               rocheuses=480,
                                               savane=1040,
                                               steppe=0,
                                               taiga=0,
                                               toundra=0,
                                               ville=960,
                                               volcan=80
                                    `;
                                    break;
                            }
                            connection.query(sql, async (err) => {
                                if (err) {
                                    throw err;
                                }
                            });

                            if (member.roles.cache.some(role => role.name === '🕊️ » Administrateur')) {
                            } else {
                                let roleJoueur = interaction.guild.roles.cache.find(r => r.name === "👤 » Joueur");
                                interaction.member.roles.add(roleJoueur)
                                let roleBourgmestre = interaction.guild.roles.cache.find(r => r.name === "👤 » Bourgmestre");
                                interaction.member.roles.add(roleBourgmestre)
                            }

                            const ville = {
                                author: {
                                    name: `Cité de ${cite}`,
                                    icon_url: interaction.member.displayAvatarURL()
                                },
                                thumbnail: {
                                    url: 'attachment://drapeau.png',
                                },
                                title: `\`Vous avez fondé votre cité !\``,
                                fields: [{
                                    name: `Place de votre gouvernement :`,
                                    value: `${salon.toString()}`
                                }],
                                image: {
                                    url: 'https://lexica-serve-encoded-images2.sharif.workers.dev/full_jpg/9e902420-1d09-456e-9778-5f973bee36b5',
                                },
                                color: 0x57F287,
                                timestamp: new Date(),
                                footer: {
                                    text: `Paz Nation, le meilleur serveur Discord français`
                                },
                            };

                            const annonce = {
                                thumbnail: {
                                    url: 'attachment://drapeau.png',
                                },
                                title: `\`Une nouvelle Cité rejoint la civilisation :\``,
                                description: `<@${interaction.member.id}>`,
                                image: {
                                    url: 'https://lexica-serve-encoded-images2.sharif.workers.dev/full_jpg/57c16003-ed3d-4b5f-b392-f8f50a9ab43f',
                                },
                                color: 0x57F287,
                                footer: {
                                    text: `Paz Nation, le meilleur serveur Discord français`
                                },
                            };

                            const salon_carte = interaction.client.channels.cache.get(process.env.SALON_CARTE);
                            salon_carte.send({embeds: [annonce], files: [attachment]});
                            interaction.user.send({embeds: [ville], files: [attachment]});
                        }

                        const { ViewChannel, SendMessages, ManageRoles, ReadMessageHistory, ManageMessages, UseApplicationCommands } = PermissionFlagsBits
                        interaction.guild.channels.create({
                            name: cite,
                            type: ChannelType.GuildText,
                            permissionOverwrites: [
                                {
                                    id: interaction.member.id,
                                    allow: [ViewChannel, SendMessages, ManageRoles, ReadMessageHistory, ManageMessages, UseApplicationCommands],
                                },
                                {
                                    id: interaction.guild.roles.everyone,
                                    deny: [ViewChannel]
                                },
                            ],
                            parent: process.env.CATEGORY_PAYS,
                        })
                            .then(salon => success(salon))
                    } else {
                        const reponse = codeBlock('ansi', `\u001b[0m\u001b[1;31mCette cité est déjà prise. Pour voir la liste des cités déjà controlées, cliquez sur le bouton ci-dessous`);
                        const row = new ActionRowBuilder()
                            .addComponents(
                                new ButtonBuilder()
                                    .setLabel(`Liste des cités`)
                                    .setEmoji(`🌇`)
                                    .setURL('https://discord.com/channels/826427184305537054/983316109367345152/987038188801503332')
                                    .setStyle(ButtonStyle.Link),
                            );
                        await interaction.user.send({content: reponse, components: [row]});
                    }
                })
                interaction.deferUpdate()
                //endregion
            } else if (interaction.customId.includes('annonce') == true) {
                //region Annonce
                const SalonAnnonce = interaction.client.channels.cache.get(process.env.SALON_ANNONCE);
                const annonce = interaction.fields.getTextInputValue('text_annonce');
                const image = interaction.fields.getTextInputValue('image_annonce');

                sql = `SELECT * FROM pays WHERE id_joueur='${interaction.member.id}'`;
                connection.query(sql, async (err, results) => {if (err) {throw err;}
                    const Pays = results[0];

                    if (image) {
                        if (await isImageURL(image) === true) {
                            const embed = {
                                author: {
                                    name: `${Pays.rang} de ${Pays.nom}`,
                                    icon_url: interaction.member.displayAvatarURL()
                                },
                                title: `\`Annonce officielle :\``,
                                thumbnail: {
                                    url: Pays.drapeau
                                },
                                image: {
                                    url: image,
                                },
                                timestamp: new Date(),
                                description: annonce,
                                color: interaction.member.displayColor,
                                footer: {
                                    text: `${Pays.devise}`
                                },
                            };

                            SalonAnnonce.send({embeds: [embed]})
                            const reponse = `__**Votre annonce a été publié dans ${SalonAnnonce}**__`;
                            await interaction.reply({content: reponse});
                        } else {
                            reponse = codeBlock('ansi', `\u001b[0;0m\u001b[1;31mVous n'avez pas fourni une URL valide`);
                            await interaction.reply({content: reponse, ephemeral: true});
                        }
                    } else {
                        const embed = {
                            author: {
                                name: `${Pays.rang} de ${Pays.nom}`,
                                icon_url: interaction.member.displayAvatarURL()
                            },
                            title: `\`Annonce officielle :\``,
                            thumbnail: {
                                url: Pays.drapeau
                            },
                            timestamp: new Date(),
                            description: annonce,
                            color: interaction.member.displayColor,
                            footer: {
                                text: `${Pays.devise}`
                            },
                        };

                        SalonAnnonce.send({embeds: [embed]})
                        const reponse = `__**Votre annonce a été publié dans ${SalonAnnonce}**__`;
                        await interaction.reply({content: reponse});
                    }
                });
                //endregion
            } else if (interaction.customId.includes('devise') == true) {
                //region Devise

                const SalonAnnonce = interaction.client.channels.cache.get(process.env.SALON_ANNONCE);
                const devise = interaction.fields.getTextInputValue('text_devise');
                const discours = interaction.fields.getTextInputValue('discours');
                let newdevise = "";

                for (let i = 0; i < devise.length; i++)
                    if (!(devise[i] == '\n' || devise[i] == '\r'))
                        newdevise += devise[i];

                let sql = `UPDATE pays
                       SET devise="${newdevise}"
                       WHERE id_joueur = '${interaction.member.id}'
                       LIMIT 1`;
                connection.query(sql, async (err) => {if (err) {throw err;}});

                sql = `SELECT * FROM pays WHERE id_joueur='${interaction.member.id}'`;
                connection.query(sql, async (err, results) => {if (err) {throw err;}
                    const Pays = results[0];
                        const embed = {
                            author: {
                                name: `${Pays.rang} de ${Pays.nom}`,
                                icon_url: interaction.member.displayAvatarURL()
                            },
                            thumbnail: {
                                url: Pays.drapeau
                            },
                            title: `\`Annonce officielle :\``,
                            description: discours + `\u200B`,
                            timestamp: new Date(),
                            fields: [
                                {
                                    name: `> 📯 Nouvelle devise :`,
                                    value: `\n*${newdevise}*` + `\n\u200B`
                                }
                            ],
                            color: interaction.member.displayColor,
                            footer: {text: `${Pays.devise}`},
                        };

                        SalonAnnonce.send({embeds: [embed]})
                        const reponse = `__**Votre annonce a été publié dans ${SalonAnnonce}**__`;
                        await interaction.reply({content: reponse});
                        await deviseCommandCooldown.addUser(interaction.member.id);
                });
                //endregion
            } else if (interaction.customId.includes('drapeau') == true) {
                //region Drapeau

                sql = `SELECT * FROM pays WHERE id_joueur='${interaction.member.id}'`;
                connection.query(sql, async (err, results) => {if (err) {throw err;}
                    const Pays = results[0];
                    const image = interaction.fields.getTextInputValue('image_annonce');

                    if (await isImageURL(image) === true) {
                        const embed = {
                            author: {
                                name: `${Pays.rang} de ${Pays.nom}`,
                                icon_url: interaction.member.displayAvatarURL()
                            },
                            title: `\`Annonce officielle :\``,
                            thumbnail: {
                                url: Pays.drapeau
                            },
                            description: `> 🎌 Nouveau drapeau :`,
                            image: {
                                url: image,
                            },
                            timestamp: new Date(),
                            color: interaction.member.displayColor,
                            footer: {
                                text: `${Pays.devise}`
                            },
                        };

                        const SalonAnnonce = interaction.client.channels.cache.get(process.env.SALON_ANNONCE);
                        SalonAnnonce.send({embeds: [embed]})

                        const reponse = `__**Votre annonce a été publié dans ${SalonAnnonce}**__`;
                        await interaction.reply({content: reponse});
                        await drapeauCommandCooldown.addUser(interaction.member.id);

                        let sql = `UPDATE pays SET drapeau="${image}" WHERE id_joueur = '${interaction.member.id}' LIMIT 1`;
                        connection.query(sql, async (err) => {if (err) {throw err;}});
                    } else {
                        reponse = codeBlock('ansi', `\u001b[0;0m\u001b[1;31mVous n'avez pas fourni une URL valide`);
                        await interaction.reply({content: reponse, ephemeral: true});
                    }
                });
                //endregion
            } else if (interaction.customId.includes('pweeter') == true) {
                //region Pweeter
                const compte = interaction.fields.getTextInputValue('pseudo');
                let newcompte = "";

                for (let i = 0; i < compte.length; i++)
                    if (!(compte[i] == '\n' || compte[i] == '\r'))
                        newcompte += compte[i];

                let sql = `UPDATE pays SET pweeter="@${newcompte}" WHERE id_joueur='${interaction.member.id}' LIMIT 1`;
                connection.query(sql, async(err) => {if (err) {throw err;}});

                sql = `SELECT * FROM pays WHERE id_joueur='${interaction.member.id}'`;
                connection.query(sql, async(err, results) => {if (err) {throw err;}
                    const Pays = results[0];

                    const embed = {
                        author: {
                            name: `${Pays.rang} de ${Pays.nom}`,
                            icon_url: interaction.member.displayAvatarURL()
                        },
                        thumbnail: {
                            url: `${Pays.drapeau}`,
                        },
                        title: `\`Votre compte Pweeter s'appelle désormais :\``,
                        description: newcompte,
                        color: interaction.member.displayColor
                    };

                    await interaction.reply({ embeds: [embed] });
                    await pweeterCommandCooldown.addUser(interaction.member.id);
                });
                //endregion
            } else if (interaction.customId.includes('creer-ambassade') == true) {
                //region Créer ambassade
                const cite = interaction.fields.getTextInputValue('cite');
                sql = `SELECT * FROM pays WHERE nom='${cite}'`;
                connection.query(sql, async(err, results) => {if (err) {throw err;}
                    if (results[0] === undefined) {
                        reponse = codeBlock('ansi', `\u001b[0;0m\u001b[1;31mCette ville n'existe pas`);
                        await interaction.reply({content: reponse, ephemeral: true});
                    } else {
                        const inviteJoueur = client.users.cache.get(results[0].id_joueur);

                        sql = `
                            SELECT * FROM diplomatie WHERE id_joueur='${inviteJoueur.id}';
                            SELECT * FROM pays WHERE id_joueur='${inviteJoueur.id}';
                        `;
                        connection.query(sql, async(err, results) => {if (err) {throw err;}
                            const Diplomatie2 = results[0][0];
                            const Pays2 = results[1][0];

                            if (!Pays2) {
                                const reponse = codeBlock('ansi', `\u001b[0;0m\u001b[1;31mCette personne ne joue pas.`);
                                await interaction.reply({ content: reponse, ephemeral: true });
                            } else if (inviteJoueur.id === interaction.member.id) {
                                const reponse = codeBlock('ansi', `\u001b[0;0m\u001b[1;31mVous ne pouvez pas créer d'ambassade avec vous même !`);
                                await interaction.reply({ content: reponse, ephemeral: true });
                            } else {
                                //region regarder si on a déjà une ambassade avec ce pays
                                sql = `
                                    SELECT * FROM diplomatie WHERE id_joueur='${interaction.member.id}';
                                    SELECT * FROM pays WHERE id_joueur='${interaction.member.id}';
                                `;
                                connection.query(sql, async(err, results) => {if (err) {throw err;}
                                    const Diplomatie = results[0][0];
                                    const Pays = results[1][0];

                                    if (Diplomatie.ambassade.includes(inviteJoueur.id) === true) {
                                        const reponse = codeBlock('ansi', `\u001b[0;0m\u001b[1;31mVous avez déjà une ambassade avec ${Pays2.nom} !`);
                                        await interaction.reply({ content: reponse, ephemeral: true });
                                    } else {

                                        const invitation = {
                                            author: {
                                                name: `${Pays.rang} de ${Pays.nom}`,
                                                icon_url: interaction.member.displayAvatarURL()
                                            },
                                            thumbnail: {
                                                url: Pays.drapeau
                                            },
                                            title: `\`Invitation reçue !\``,
                                            description: `Vous avez reçu une demande d'ambassade de ${interaction.member}.\n` +
                                                `Vous pouvez accepter pour construire mutuellement une ambassade, ou refuser.`,
                                            fields: [
                                                {
                                                    name: `Message :`,
                                                    value: interaction.fields.getTextInputValue('text_annonce')
                                                }
                                            ],
                                            color: interaction.member.displayColor,
                                            timestamp: new Date(),
                                            footer: {
                                                text: `${Pays.devise}`
                                            },
                                        };

                                        const row1 = new ActionRowBuilder()
                                            .addComponents(
                                                new ButtonBuilder()
                                                    .setLabel(`Accepter`)
                                                    .setEmoji(`✔`)
                                                    .setCustomId('ambassade-oui-' + interaction.member.id)
                                                    .setStyle(ButtonStyle.Success),
                                            )
                                            .addComponents(
                                                new ButtonBuilder()
                                                    .setLabel(`Refuser`)
                                                    .setEmoji(`✖`)
                                                    .setCustomId('ambassade-non-' + interaction.member.id)
                                                    .setStyle(ButtonStyle.Danger),
                                            )

                                        function bouton(message) {
                                            return new ActionRowBuilder()
                                                .addComponents(
                                                    new ButtonBuilder()
                                                        .setLabel(`Lien vers le message`)
                                                        .setEmoji(`🏛️`)
                                                        .setURL(message.url)
                                                        .setStyle(ButtonStyle.Link),
                                                )
                                        }

                                        interaction.client.channels.cache.get(Pays2.id_salon)
                                            .send({embeds: [invitation], components: [row1]})
                                            .then(message => inviteJoueur.send({
                                                embeds: [invitation],
                                                components: [bouton(message)]
                                            }))


                                        const embed = {
                                            author: {
                                                name: `${Pays.rang} de ${Pays.nom}`,
                                                icon_url: interaction.member.displayAvatarURL()
                                            },
                                            thumbnail: {
                                                url: Pays.drapeau
                                            },
                                            title: `\`Invitation envoyée !\``,
                                            description: `Vous avez envoyé une demande d'ambassade à ${inviteJoueur}.\n` +
                                                `Elle est désormais en attente de réponse.`,
                                            color: interaction.member.displayColor,
                                            timestamp: new Date(),
                                            footer: {
                                                text: `${Pays.devise}`
                                            },
                                        };

                                        interaction.reply({embeds: [embed]})
                                    }
                                });
                                //endregion
                            }
                        });
                    }
                });
                //endregion
            } else if (interaction.customId.includes('organisation') == true) {
                //region Organisation

                const SalonAnnonce = interaction.client.channels.cache.get(process.env.SALON_ORGANISATION);
                const nom = interaction.fields.getTextInputValue('text_nom');
                const annonce = interaction.fields.getTextInputValue('text_annonce');
                const image = interaction.fields.getTextInputValue('image_annonce');

                sql = `SELECT * FROM pays WHERE id_joueur='${interaction.member.id}'`;
                connection.query(sql, async (err, results) => {if (err) {throw err;}
                    const Pays = results[0];

                    function organisation(channel) {
                        channel.send(`${interaction.member}`)
                        const embed = {
                            author: {
                                name: `${Pays.rang} de ${Pays.nom}`,
                                icon_url: interaction.member.displayAvatarURL()
                            },
                            thumbnail: {
                                url: Pays.drapeau,
                            },
                            title: `\`Vous avez fondé : ${nom} !\``,
                            description: `Pour rajouter des joueurs à votre organisation, il vous suffit de les ping dans ce salon.`,
                            fields: [{
                                name: `Place de votre organisation :`,
                                value: `${channel.toString()}`
                            }],
                            image: {
                                url: image,
                            },
                            color: interaction.member.displayColor,
                            timestamp: new Date(),
                            footer: {
                                text: Pays.devise
                            },
                        };
                        interaction.user.send({embeds: [embed]});
                    }

                    let response;
                    if (await isImageURL(image) === true) {
                        const embed = {
                            author: {
                                name: `${Pays.rang} de ${Pays.nom}`,
                                icon_url: interaction.member.displayAvatarURL()
                            },
                            thumbnail: {
                                url: Pays.drapeau
                            },
                            title: `\`Création d'une nouvelle organisation :\``,
                            description: annonce + `\u200B`,
                            fields: [
                                {
                                    name: `> 🪧 Nom`,
                                    value: nom
                                },
                            ],
                            image: {
                                url: image,
                            },
                            timestamp: new Date(),
                            color: interaction.member.displayColor,
                            footer: {
                                text: `${Pays.devise}`
                            },
                        };

                        SalonAnnonce.send({embeds: [embed]})
                        reponse = `__**Votre annonce a été publié dans ${SalonAnnonce}**__`;
                        await interaction.reply({content: reponse});

                        const channel = client.channels.cache.get(process.env.SALON_ORGANISATION);
                        channel.threads
                            .create({
                                name: `${nom}`,
                                autoArchiveDuration: ThreadAutoArchiveDuration.OneWeek,
                                type: ChannelType.PrivateThread,
                                reason: 'Nouvelle organisation',
                            })
                            .then(channel => organisation(channel))
                            .catch(console.error);

                        await organisationCommandCooldown.addUser(interaction.member.id);
                    } else {
                        reponse = codeBlock('ansi', `\u001b[0;0m\u001b[1;31mVous n'avez pas fourni une URL valide`);
                        await interaction.reply({content: reponse, ephemeral: true});
                    }
                });
                //endregion
            }
        }
    }
};