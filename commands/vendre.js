const { SlashCommandBuilder, codeBlock } = require('@discordjs/builders');
const { MessageActionRow, MessageButton } = require('discord.js');
const { readFileSync } = require('fs');
const { CommandCooldown, msToMinutes } = require('discord-command-cooldown');
const ms = require('ms');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('vendre')
        .setDescription(`Vendre des ressources sur le marché international (IM)`)
        .addStringOption(ressource =>
            ressource.setName('ressource')
            .setDescription(`La ressource que vous voulez vendre`)
            .addChoice(`Biens de consommation`, 'Biens de consommation')
            .addChoice(`Bois`, 'Bois')
            .addChoice(`Brique`, 'Brique')
            .addChoice(`Eau`, 'Eau')
            .addChoice(`Métaux`, 'Metaux')
            .addChoice(`Nourriture`, 'Nourriture')
            .addChoice(`Pétrole`, 'Petrole')
            .setRequired(true))
        .addIntegerOption(quantité =>
            quantité.setName('quantité')
            .setDescription(`La quantité de ressource que vous voulez vendre`)
            .setRequired(true))
        .addNumberOption(prix =>
            prix.setName('prix')
            .setDescription(`Le prix à l'unité pour la quantité de ressource`)
            .setRequired(true)),

    async execute(interaction) {
        const { connection } = require('../index.js');

        var sql = `SELECT * FROM pays WHERE id_joueur=${interaction.member.id}`;
        connection.query(sql, async(err, results) => {if (err) {throw err;}
            const gouvernementObject = JSON.parse(readFileSync('data/gouvernement.json', 'utf-8'));
            const vendreCommandCooldown = new CommandCooldown('vendre', ms(`${eval(`gouvernementObject.${results[0].ideologie}.commerce`)}m`));

            const userCooldowned = await vendreCommandCooldown.getUser(interaction.member.id);
            if (userCooldowned) {
                const timeLeft = msToMinutes(userCooldowned.msLeft, false);
                const reponse = codeBlock('diff', `- Vous avez déjà fait une offre récemment. Il reste ${timeLeft.minutes}min ${timeLeft.seconds}sec avant de pouvoir la changer à nouveau.`);
                await interaction.reply({ content: reponse, ephemeral: true });
            } else {
                const ressource = interaction.options.getString('ressource');
                var quantité = interaction.options.getInteger('quantité');
                var prix_u = interaction.options.getNumber('prix');
                const jsonPrix = JSON.parse(readFileSync('data/prix.json', 'utf-8'));

                if (quantité <= 0) {
                    var reponse = codeBlock('diff', `- Veillez indiquer une quantité positive`);
                    await interaction.reply({ content: reponse, ephemeral: true });
                } else {

                    function offre(prix_moyen) {
                        const pourcentage = (prix_u / prix_moyen * 100).toFixed(1)
                        const prix = Math.round(quantité * prix_u);

                        const embed = {
                            author: {
                                name: `${results[0].rang} de ${results[0].nom}`,
                                icon_url: interaction.member.displayAvatarURL()
                            },
                            thumbnail: {
                                url: results[0].drapeau
                            },
                            title: `\`Vendre au marché international :\``,
                            fields: [{
                                    name: `Ressource :`,
                                    value: codeBlock(
                                        `• ${ressource}\n` +
                                        `• Prix moyen : ${prix_moyen}`) + `\u200B`
                                },
                                {
                                    name: `Quantité :`,
                                    value: codeBlock(`• ${quantité.toLocaleString('en-US')}`) + `\u200B`
                                },
                                {
                                    name: `Prix :`,
                                    value: codeBlock(
                                        `• A l'unité : ${(prix_u).toFixed(2)} (${pourcentage}%)\n` +
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
                                .setLabel(`Vendre`)
                                .setEmoji(`💵`)
                                .setCustomId(`vendre-${interaction.member.id}`)
                                .setStyle('SUCCESS'),
                            )
                            .addComponents(
                                new MessageButton()
                                .setLabel(`Refuser`)
                                .setEmoji(`✋`)
                                .setCustomId(`refuser-${interaction.member.id}`)
                                .setStyle('DANGER'),
                            )

                        interaction.reply({ embeds: [embed], components: [row] });
                    }

                    switch (ressource) {
                        case 'Biens de consommation':
                            if (quantité > results[0].bc) {
                                var reponse = codeBlock('diff', `- Vous n'avez pas assez de biens de consommation : ${results[0].bc.toLocaleString('en-US')}/${quantité.toLocaleString('en-US')}`);
                                await interaction.reply({ content: reponse, ephemeral: true });
                                break;
                            } else {
                                var prix_bas = (jsonPrix.bc * 0.7).toFixed(2);
                                var prix_haut = (jsonPrix.bc * 1.3).toFixed(2);

                                if (prix_u < prix_bas) {
                                    var reponse = codeBlock('diff', `- Le prix de vente des biens de consommations est fixé entre : ${prix_bas} et ${prix_haut} l'unité`);
                                    await interaction.reply({ content: reponse, ephemeral: true });
                                } else if (prix_u > prix_haut) {
                                    var reponse = codeBlock('diff', `- Le prix de vente des biens de consommations est fixé entre : ${prix_bas} et ${prix_haut} l'unité`);
                                    await interaction.reply({ content: reponse, ephemeral: true });
                                } else {
                                    offre(jsonPrix.bc)
                                }
                                break;
                            }
                        case 'Bois':
                            if (quantité > results[0].bois) {
                                var reponse = codeBlock('diff', `- Vous n'avez pas assez de bois : ${results[0].bois.toLocaleString('en-US')}/${quantité.toLocaleString('en-US')}`);
                                await interaction.reply({ content: reponse, ephemeral: true });
                                break;
                            } else {
                                var prix_bas = (jsonPrix.bois * 0.7).toFixed(2);
                                var prix_haut = (jsonPrix.bois * 1.3).toFixed(2);

                                if (prix_u < prix_bas) {
                                    var reponse = codeBlock('diff', `- Le prix de vente du bois est fixé entre : ${prix_bas} et ${prix_haut} l'unité`);
                                    await interaction.reply({ content: reponse, ephemeral: true });
                                } else if (prix_u > prix_haut) {
                                    var reponse = codeBlock('diff', `- Le prix de vente du bois est fixé entre : ${prix_bas} et ${prix_haut} l'unité`);
                                    await interaction.reply({ content: reponse, ephemeral: true });
                                } else {
                                    offre(jsonPrix.bois)
                                }
                                break;
                            }
                        case 'Brique':
                            if (quantité > results[0].brique) {
                                var reponse = codeBlock('diff', `- Vous n'avez pas assez de brique : ${results[0].brique.toLocaleString('en-US')}/${quantité.toLocaleString('en-US')}`);
                                await interaction.reply({ content: reponse, ephemeral: true });
                                break;
                            } else {
                                var prix_bas = (jsonPrix.brique * 0.7).toFixed(2);
                                var prix_haut = (jsonPrix.brique * 1.3).toFixed(2);

                                if (prix_u < prix_bas) {
                                    var reponse = codeBlock('diff', `- Le prix de vente des briques est fixé entre : ${prix_bas} et ${prix_haut} l'unité`);
                                    await interaction.reply({ content: reponse, ephemeral: true });
                                } else if (prix_u > prix_haut) {
                                    var reponse = codeBlock('diff', `- Le prix de vente des briques est fixé entre : ${prix_bas} et ${prix_haut} l'unité`);
                                    await interaction.reply({ content: reponse, ephemeral: true });
                                } else {
                                    offre(jsonPrix.brique)
                                }
                                break;
                            }
                        case 'Eau':
                            if (quantité > results[0].eau) {
                                var reponse = codeBlock('diff', `- Vous n'avez pas assez d'eau : ${results[0].eau.toLocaleString('en-US')}/${quantité.toLocaleString('en-US')}`);
                                await interaction.reply({ content: reponse, ephemeral: true });
                                break;
                            } else {
                                var prix_bas = (jsonPrix.eau * 0.7).toFixed(2);
                                var prix_haut = (jsonPrix.eau * 1.3).toFixed(2);

                                if (prix_u < prix_bas) {
                                    var reponse = codeBlock('diff', `- Le prix de vente de l'eau est fixé entre : ${prix_bas} et ${prix_haut} l'unité`);
                                    await interaction.reply({ content: reponse, ephemeral: true });
                                } else if (prix_u > prix_haut) {
                                    var reponse = codeBlock('diff', `- Le prix de vente de l'eau est fixé entre : ${prix_bas} et ${prix_haut} l'unité`);
                                    await interaction.reply({ content: reponse, ephemeral: true });
                                } else {
                                    offre(jsonPrix.eau)
                                }
                                break;
                            }
                        case 'Metaux':
                            if (quantité > results[0].metaux) {
                                var reponse = codeBlock('diff', `- Vous n'avez pas assez de métaux : ${results[0].metaux.toLocaleString('en-US')}/${quantité.toLocaleString('en-US')}`);
                                await interaction.reply({ content: reponse, ephemeral: true });
                                break;
                            } else {
                                var prix_bas = (jsonPrix.metaux * 0.7).toFixed(2);
                                var prix_haut = (jsonPrix.metaux * 1.3).toFixed(2);

                                if (prix_u < prix_bas) {
                                    var reponse = codeBlock('diff', `- Le prix de vente des métaux est fixé entre : ${prix_bas} et ${prix_haut} l'unité`);
                                    await interaction.reply({ content: reponse, ephemeral: true });
                                } else if (prix_u > prix_haut) {
                                    var reponse = codeBlock('diff', `- Le prix de vente des métaux est fixé entre : ${prix_bas} et ${prix_haut} l'unité`);
                                    await interaction.reply({ content: reponse, ephemeral: true });
                                } else {
                                    offre(jsonPrix.metaux)
                                }
                                break;
                            }
                        case 'Nourriture':
                            if (quantité > results[0].nourriture) {
                                var reponse = codeBlock('diff', `- Vous n'avez pas assez de nourriture : ${results[0].nourriture.toLocaleString('en-US')}/${quantité.toLocaleString('en-US')}`);
                                await interaction.reply({ content: reponse, ephemeral: true });
                                break;
                            } else {
                                var prix_bas = (jsonPrix.nourriture * 0.7).toFixed(2);
                                var prix_haut = (jsonPrix.nourriture * 1.3).toFixed(2);

                                if (prix_u < prix_bas) {
                                    var reponse = codeBlock('diff', `- Le prix de vente de la nourriture est fixé entre : ${prix_bas} et ${prix_haut} l'unité`);
                                    await interaction.reply({ content: reponse, ephemeral: true });
                                } else if (prix_u > prix_haut) {
                                    var reponse = codeBlock('diff', `- Le prix de vente de la nourriture est fixé entre : ${prix_bas} et ${prix_haut} l'unité`);
                                    await interaction.reply({ content: reponse, ephemeral: true });
                                } else {
                                    offre(jsonPrix.nourriture)
                                }
                                break;
                            }
                        case 'Petrole':
                            if (quantité > results[0].petrole) {
                                var reponse = codeBlock('diff', `- Vous n'avez pas assez de pétrole : ${results[0].petrole.toLocaleString('en-US')}/${quantité.toLocaleString('en-US')}`);
                                await interaction.reply({ content: reponse, ephemeral: true });
                                break;
                            } else {
                                var prix_bas = (jsonPrix.petrole * 0.7).toFixed(2);
                                var prix_haut = (jsonPrix.petrole * 1.3).toFixed(2);

                                if (prix_u < prix_bas) {
                                    var reponse = codeBlock('diff', `- Le prix de vente du pétrole est fixé entre : ${prix_bas} et ${prix_haut} l'unité`);
                                    await interaction.reply({ content: reponse, ephemeral: true });
                                } else if (prix_u > prix_haut) {
                                    var reponse = codeBlock('diff', `- Le prix de vente du pétrole est fixé entre : ${prix_bas} et ${prix_haut} l'unité`);
                                    await interaction.reply({ content: reponse, ephemeral: true });
                                } else {
                                    offre(jsonPrix.petrole)
                                }
                                break;
                            }
                    }
                };
            };
        })
    },
};