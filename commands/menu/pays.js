const { ActionRowBuilder, SlashCommandBuilder, StringSelectMenuBuilder, ButtonBuilder, ButtonStyle, codeBlock} = require('discord.js');
const { readFileSync } = require('fs');
const batimentObject = JSON.parse(readFileSync('data/batiment.json', 'utf-8'));
const biomeObject = JSON.parse(readFileSync('data/biome.json', 'utf-8'));

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pays')
        .setDescription(`Statistiques de votre pays`),

    async execute(interaction) {
        const { connection } = require("../../index");

        const sql = `
                SELECT * FROM batiments WHERE id_joueur='${interaction.member.id}';
                SELECT * FROM diplomatie WHERE id_joueur='${interaction.member.id}';
                SELECT * FROM pays WHERE id_joueur='${interaction.member.id}';
                SELECT * FROM population WHERE id_joueur='${interaction.member.id}';
                SELECT * FROM territoire WHERE id_joueur='${interaction.member.id}'
        `;
        connection.query(sql, async(err, results) => {if (err) {throw err;}
            const Batiment = results[0][0];
            const Diplomatie = results[1][0];
            const Pays = results[2][0];
            const Population = results[3][0];
            const Territoire = results[4][0];

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
                if (Pays.daily === 0) {
                    let sql = `UPDATE pays SET daily=1, jour=jour+1 WHERE id_joueur="${interaction.member.id}"`;
                    connection.query(sql, async (err) => {if (err) {throw err;}})

                    if (Pays.jour === 2) {
                        let sql = `UPDATE pays SET rang='Cité-Etat' WHERE id_joueur="${interaction.member.id}"`;
                        connection.query(sql, async (err) => {if (err) {throw err;}})

                        if (interaction.member.roles.cache.some(role => role.name === '🕊️ » Administrateur')) {
                        } else {
                            let roleMaire = interaction.guild.roles.cache.find(r => r.name === "👤 » Maire");
                            interaction.member.roles.add(roleMaire);
                            let roleBourgmestre = interaction.guild.roles.cache.find(r => r.name === "👤 » Bourgmestre");
                            interaction.member.roles.remove(roleBourgmestre);
                        }
                        let embed;
                        let salon;
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
                                Ce passage au Rang de Cité-Etat débloque de nouveaux éléments de jeu.\n
                            `,
                            fields: [
                                {
                                    name: `> 🆕 Débloque :`,
                                    value: codeBlock(
                                        `• Gestion de l'approvisionnement de la population\n` +
                                        `• Changement d'idéologie\n` +
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
                    } else if (Pays.jour === 32) {
                        let sql = `UPDATE pays SET rang='Etat' WHERE id_joueur="${interaction.member.id}"`;
                        connection.query(sql, async (err) => {if (err) {throw err;}})

                        if (interaction.member.roles.cache.some(role => role.name === '🕊️ » Administrateur')) {
                        } else {
                            let roleDirigent = interaction.guild.roles.cache.find(r => r.name === "👤 » Dirigent");
                            interaction.member.roles.add(roleDirigent);
                            let roleMaire = interaction.guild.roles.cache.find(r => r.name === "👤 » Maire");
                            interaction.member.roles.remove(roleMaire);
                        }

                        let embed;
                        let salon;
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

                        const row = new ActionRowBuilder()
                            .addComponents(
                                new ButtonBuilder()
                                    .setLabel(`Choisir un nom d'Etat`)
                                    .setEmoji(`🪧`)
                                    .setCustomId('nom_etat')
                                    .setStyle(ButtonStyle.Success),
                            )
                        salon = interaction.client.channels.cache.get(Pays.id_salon);
                        salon.send({ embeds: [embed], components: [row] });

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
                    } else if (Pays.jour === 122) {
                        let sql = `UPDATE pays SET rang='Pays' WHERE id_joueur="${interaction.member.id}"`;
                        connection.query(sql, async (err) => {if (err) {throw err;}})

                        if (interaction.member.roles.cache.some(role => role.name === '🕊️ » Administrateur')) {
                        } else {
                            let roleChef = interaction.guild.roles.cache.find(r => r.name === "👤 » Chef d'état");
                            interaction.member.roles.add(roleChef);
                            let roleDirigent = interaction.guild.roles.cache.find(r => r.name === "👤 » Dirigent");
                            interaction.member.roles.remove(roleDirigent);
                        }

                        const embed = {
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
                        const salon = interaction.client.channels.cache.get(Pays.id_salon);
                        salon.send({ embeds: [embed] });
                    }
                }
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
                if (Population.habitant/emploies_total < 1) {
                    chomage = 0
                } else {
                    chomage = ((Population.habitant/emploies_total-1)*100).toFixed(2)
                }
                //endregion
                const embed = {
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
                                `• ${(Territoire.cg * 1000).toLocaleString('en-US')}km² de capacité de gouvernance\n`) + `\u200B`
                        },
                        {
                            name: `> 🏛️ Diplomatie :`,
                            value: codeBlock(
                                `• ${Diplomatie.influence} influences\n`) + `\u200B`
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
                            .setCustomId('action-pays')
                            .setPlaceholder(`Afficher un autre menu`)
                            .addOptions([
                                {
                                    label: `Diplomatie`,
                                    emoji: `🏛️`,
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
                            ]),
                    );
                interaction.reply({ embeds: [embed], components: [row] });
            }
        });
    },
};