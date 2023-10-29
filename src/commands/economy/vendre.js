const { ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder, codeBlock} = require('discord.js');
const { readFileSync } = require('fs');
const { CommandCooldown, msToMinutes } = require('discord-command-cooldown');
const ms = require('ms');
const gouvernementObject = JSON.parse(readFileSync('src/data/gouvernement.json', 'utf-8'));

module.exports = {
    data: new SlashCommandBuilder()
        .setName('vendre')
        .setDescription(`Vendre des ressources sur le marché international (IM)`)
        .addStringOption(ressource =>
            ressource.setName('ressource')
                .setDescription(`La ressource que vous voulez vendre`)
                .addChoices(
                    { name: `Acier`, value: `Acier`},
                    { name: `Béton`, value: `Béton`},
                    { name: `Biens de consommation`, value: `Biens de consommation`},
                    { name: `Bois`, value: `Bois`},
                    { name: `Carburant`, value: `Carburant`},
                    { name: `Charbon`, value: `Charbon`},
                    { name: `Eau`, value: `Eau`},
                    { name: `Eolienne`, value: `Eolienne`},
                    { name: `Métaux`, value: `Métaux`},
                    { name: `Nourriture`, value: `Nourriture`},
                    { name: `Pétrole`, value: `Pétrole`},
                    { name: `Sable`, value: `Sable`},
                    { name: `Verre`, value: `Verre`}
                )
            .setRequired(true))
        .addIntegerOption(quantite =>
            quantite.setName('quantité')
            .setDescription(`La quantité de ressources que vous voulez vendre`)
                .setMinValue(1)
            .setRequired(true))
        .addNumberOption(prix =>
            prix.setName('prix')
            .setDescription(`Le prix à l'unité pour la quantité de ressource`)
            .setRequired(true)),

    async execute(interaction) {
        const { connection } = require('../../index.ts');

        const sql = `
            SELECT * FROM pays WHERE id_joueur=${interaction.member.id};
            SELECT * FROM ressources WHERE id_joueur=${interaction.member.id}
        `;
        connection.query(sql, async(err, results) => {if (err) {throw err;}
            const Pays = results[0][0];
            const Ressources = results[1][0];

            let prix_haut;
            let prix_bas;
            let reponse;
            const vendreCommandCooldown = new CommandCooldown('vendre', ms(`${eval(`gouvernementObject.${Pays.ideologie}.commerce`)}m`));

            const userCooldowned = await vendreCommandCooldown.getUser(interaction.member.id);
            if (userCooldowned) {
                const timeLeft = msToMinutes(userCooldowned.msLeft, false);
                const reponse = codeBlock('ansi', `\u001b[0m\u001b[1;31mVous avez déjà fait une offre récemment. Il reste ${timeLeft.minutes}min ${timeLeft.seconds}sec avant d'en faire une autre.`);
                await interaction.reply({ content: reponse, ephemeral: true });
            } else {
                const ressource = interaction.options.getString('ressource');
                const quantite = interaction.options.getInteger('quantité');
                const prix_u = interaction.options.getNumber('prix');
                const jsonPrix = JSON.parse(readFileSync('data/prix.json', 'utf-8'));

                function offre(prixMoyen, pourcentage, emoji) {
                    const prix = Math.round(quantite * prix_u);

                    const embed = {
                        author: {
                            name: `${Pays.rang} de ${Pays.nom}`,
                            icon_url: interaction.member.displayAvatarURL()
                        },
                        thumbnail: {
                            url: Pays.drapeau
                        },
                        title: `\`Vendre au marché international :\``,
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
                                    `• A l'unité : ${(prix_u).toFixed(2)} (${pourcentage}%)\n` +
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
                            .setLabel(`Vendre`)
                            .setEmoji(`💵`)
                            .setCustomId(`vendre-${interaction.member.id}`)
                            .setStyle(ButtonStyle.Success),
                        )
                        .addComponents(
                            new ButtonBuilder()
                            .setLabel(`Refuser`)
                            .setEmoji(`✋`)
                            .setCustomId(`refuser-${interaction.member.id}`)
                            .setStyle(ButtonStyle.Danger),
                        )

                    interaction.reply({ embeds: [embed], components: [row] });
                }

                switch (ressource) {
                    case 'Acier':
                        if (quantite > Ressources.acier) {
                            reponse = codeBlock('ansi', `\u001b[0m\u001b[1;31mVous n'avez pas assez d'acier : ${Ressources.acier.toLocaleString('en-US')}/${quantite.toLocaleString('en-US')}`);
                            await interaction.reply({ content: reponse, ephemeral: true });
                            break;
                        } else {
                            prix_bas = (jsonPrix.acier * 0.7).toFixed(2);
                            prix_haut = (jsonPrix.acier * 1.3).toFixed(2);

                            if (prix_u < prix_bas) {
                                reponse = codeBlock('ansi', `\u001b[0m\u001b[1;31mLe prix de vente de l'acier est fixé entre : ${prix_bas} et ${prix_haut} l'unité`);
                                await interaction.reply({ content: reponse, ephemeral: true });
                            } else if (prix_u > prix_haut) {
                                reponse = codeBlock('ansi', `\u001b[0m\u001b[1;31mLe prix de vente de l'acier est fixé entre : ${prix_bas} et ${prix_haut} l'unité`);
                                await interaction.reply({ content: reponse, ephemeral: true });
                            } else {
                                const pourcentage = (prix_u / jsonPrix.acier * 100).toFixed(1);
                                offre(jsonPrix.acier, pourcentage, '<:acier:1075776411329122304>')
                            }
                            break;
                        }
                    case 'Béton':
                        if (quantite > Ressources.beton) {
                            reponse = codeBlock('ansi', `\u001b[0m\u001b[1;31mVous n'avez pas assez de béton : ${Ressources.beton.toLocaleString('en-US')}/${quantite.toLocaleString('en-US')}`);
                            await interaction.reply({ content: reponse, ephemeral: true });
                            break;
                        } else {
                            prix_bas = (jsonPrix.beton * 0.7).toFixed(2);
                            prix_haut = (jsonPrix.beton * 1.3).toFixed(2);

                            if (prix_u < prix_bas) {
                                reponse = codeBlock('ansi', `\u001b[0m\u001b[1;31mLe prix de vente du béton est fixé entre : ${prix_bas} et ${prix_haut} l'unité`);
                                await interaction.reply({ content: reponse, ephemeral: true });
                            } else if (prix_u > prix_haut) {
                                reponse = codeBlock('ansi', `\u001b[0m\u001b[1;31mLe prix de vente du béton est fixé entre : ${prix_bas} et ${prix_haut} l'unité`);
                                await interaction.reply({ content: reponse, ephemeral: true });
                            } else {
                                const pourcentage = (prix_u / jsonPrix.beton * 100).toFixed(1);
                                offre(jsonPrix.beton, pourcentage, '<:beton:1075776342227943526>')
                            }
                            break;
                        }
                    case 'Biens de consommation':
                        if (quantite > Ressources.bc) {
                            reponse = codeBlock('ansi', `\u001b[0m\u001b[1;31mVous n'avez pas assez de biens de consommation : ${Ressources.bc.toLocaleString('en-US')}/${quantite.toLocaleString('en-US')}`);
                            await interaction.reply({ content: reponse, ephemeral: true });
                            break;
                        } else {
                            prix_bas = (jsonPrix.bc * 0.7).toFixed(2);
                            prix_haut = (jsonPrix.bc * 1.3).toFixed(2);

                            if (prix_u < prix_bas) {
                                reponse = codeBlock('ansi', `\u001b[0m\u001b[1;31mLe prix de vente des biens de consommations est fixé entre : ${prix_bas} et ${prix_haut} l'unité`);
                                await interaction.reply({ content: reponse, ephemeral: true });
                            } else if (prix_u > prix_haut) {
                                reponse = codeBlock('ansi', `\u001b[0m\u001b[1;31mLe prix de vente des biens de consommations est fixé entre : ${prix_bas} et ${prix_haut} l'unité`);
                                await interaction.reply({ content: reponse, ephemeral: true });
                            } else {
                                const pourcentage = (prix_u / jsonPrix.bc * 100).toFixed(1);
                                offre(jsonPrix.bc, pourcentage, '\uD83D\uDCBB')
                            }
                            break;
                        }
                    case 'Bois':
                        if (quantite > Ressources.bois) {
                            reponse = codeBlock('ansi', `\u001b[0m\u001b[1;31mVous n'avez pas assez de bois : ${Ressources.bois.toLocaleString('en-US')}/${quantite.toLocaleString('en-US')}`);
                            await interaction.reply({ content: reponse, ephemeral: true });
                            break;
                        } else {
                            prix_bas = (jsonPrix.bois * 0.7).toFixed(2);
                            prix_haut = (jsonPrix.bois * 1.3).toFixed(2);

                            if (prix_u < prix_bas) {
                                reponse = codeBlock('ansi', `\u001b[0m\u001b[1;31mLe prix de vente du bois est fixé entre : ${prix_bas} et ${prix_haut} l'unité`);
                                await interaction.reply({ content: reponse, ephemeral: true });
                            } else if (prix_u > prix_haut) {
                                reponse = codeBlock('ansi', `\u001b[0m\u001b[1;31mLe prix de vente du bois est fixé entre : ${prix_bas} et ${prix_haut} l'unité`);
                                await interaction.reply({ content: reponse, ephemeral: true });
                            } else {
                                const pourcentage = (prix_u / jsonPrix.bois * 100).toFixed(1);
                                offre(jsonPrix.bois, pourcentage, '🪵')
                            }
                            break;
                        }
                    case 'Carburant':
                        if (quantite > Ressources.carburant) {
                            reponse = codeBlock('ansi', `\u001b[0m\u001b[1;31mVous n'avez pas assez de carburant : ${Ressources.carburant.toLocaleString('en-US')}/${quantite.toLocaleString('en-US')}`);
                            await interaction.reply({ content: reponse, ephemeral: true });
                            break;
                        } else {
                            prix_bas = (jsonPrix.carburant * 0.7).toFixed(2);
                            prix_haut = (jsonPrix.carburant * 1.3).toFixed(2);

                            if (prix_u < prix_bas) {
                                reponse = codeBlock('ansi', `\u001b[0m\u001b[1;31mLe prix de vente du carburant est fixé entre : ${prix_bas} et ${prix_haut} l'unité`);
                                await interaction.reply({ content: reponse, ephemeral: true });
                            } else if (prix_u > prix_haut) {
                                reponse = codeBlock('ansi', `\u001b[0m\u001b[1;31mLe prix de vente du carburant est fixé entre : ${prix_bas} et ${prix_haut} l'unité`);
                                await interaction.reply({ content: reponse, ephemeral: true });
                            } else {
                                const pourcentage = (prix_u / jsonPrix.carburant * 100).toFixed(1);
                                offre(jsonPrix.carburant, pourcentage, '⛽')
                            }
                            break;
                        }
                    case 'Charbon':
                        if (quantite > Ressources.charbon) {
                            reponse = codeBlock('ansi', `\u001b[0m\u001b[1;31mVous n'avez pas assez de charbon : ${Ressources.charbon.toLocaleString('en-US')}/${quantite.toLocaleString('en-US')}`);
                            await interaction.reply({ content: reponse, ephemeral: true });
                            break;
                        } else {
                            prix_bas = (jsonPrix.charbon * 0.7).toFixed(2);
                            prix_haut = (jsonPrix.charbon * 1.3).toFixed(2);

                            if (prix_u < prix_bas) {
                                reponse = codeBlock('ansi', `\u001b[0m\u001b[1;31mLe prix de vente du charbon est fixé entre : ${prix_bas} et ${prix_haut} l'unité`);
                                await interaction.reply({ content: reponse, ephemeral: true });
                            } else if (prix_u > prix_haut) {
                                reponse = codeBlock('ansi', `\u001b[0m\u001b[1;31mLe prix de vente du charbon est fixé entre : ${prix_bas} et ${prix_haut} l'unité`);
                                await interaction.reply({ content: reponse, ephemeral: true });
                            } else {
                                const pourcentage = (prix_u / jsonPrix.charbon * 100).toFixed(1);
                                offre(jsonPrix.charbon, pourcentage, '<:charbon:1075776385517375638>')
                            }
                            break;
                        }
                    case 'Eau':
                        if (quantite > Ressources.eau) {
                            reponse = codeBlock('ansi', `\u001b[0m\u001b[1;31mVous n'avez pas assez d'eau : ${Ressources.eau.toLocaleString('en-US')}/${quantite.toLocaleString('en-US')}`);
                            await interaction.reply({ content: reponse, ephemeral: true });
                            break;
                        } else {
                            prix_bas = (jsonPrix.eau * 0.7).toFixed(2);
                            prix_haut = (jsonPrix.eau * 1.3).toFixed(2);

                            if (prix_u < prix_bas) {
                                reponse = codeBlock('ansi', `\u001b[0m\u001b[1;31mLe prix de vente de l'eau est fixé entre : ${prix_bas} et ${prix_haut} l'unité`);
                                await interaction.reply({ content: reponse, ephemeral: true });
                            } else if (prix_u > prix_haut) {
                                reponse = codeBlock('ansi', `\u001b[0m\u001b[1;31mLe prix de vente de l'eau est fixé entre : ${prix_bas} et ${prix_haut} l'unité`);
                                await interaction.reply({ content: reponse, ephemeral: true });
                            } else {
                                const pourcentage = (prix_u / jsonPrix.eau * 100).toFixed(1);
                                offre(jsonPrix.eau, pourcentage, '💧')
                            }
                            break;
                        }
                    case 'Eolienne':
                        if (quantite > Ressources.eolienne) {
                            reponse = codeBlock('ansi', `\u001b[0m\u001b[1;31mVous n'avez pas assez d'éolienne : ${Ressources.eolienne.toLocaleString('en-US')}/${quantite.toLocaleString('en-US')}`);
                            await interaction.reply({ content: reponse, ephemeral: true });
                            break;
                        } else {
                                offre('Pas de prix moyen', '100', '<:windmill:1108767955442991225>')
                            break;
                        }
                    case 'Métaux':
                        if (quantite > Ressources.metaux) {
                            reponse = codeBlock('ansi', `\u001b[0m\u001b[1;31mVous n'avez pas assez de métaux : ${Ressources.metaux.toLocaleString('en-US')}/${quantite.toLocaleString('en-US')}`);
                            await interaction.reply({ content: reponse, ephemeral: true });
                            break;
                        } else {
                            prix_bas = (jsonPrix.metaux * 0.7).toFixed(2);
                            prix_haut = (jsonPrix.metaux * 1.3).toFixed(2);

                            if (prix_u < prix_bas) {
                                reponse = codeBlock('ansi', `\u001b[0m\u001b[1;31mLe prix de vente des métaux est fixé entre : ${prix_bas} et ${prix_haut} l'unité`);
                                await interaction.reply({ content: reponse, ephemeral: true });
                            } else if (prix_u > prix_haut) {
                                reponse = codeBlock('ansi', `\u001b[0m\u001b[1;31mLe prix de vente des métaux est fixé entre : ${prix_bas} et ${prix_haut} l'unité`);
                                await interaction.reply({ content: reponse, ephemeral: true });
                            } else {
                                const pourcentage = (prix_u / jsonPrix.metaux * 100).toFixed(1);
                                offre(jsonPrix.metaux, pourcentage, '🪨')
                            }
                            break;
                        }
                    case 'Nourriture':
                        if (quantite > Ressources.nourriture) {
                            reponse = codeBlock('ansi', `\u001b[0m\u001b[1;31mVous n'avez pas assez de nourriture : ${Ressources.nourriture.toLocaleString('en-US')}/${quantite.toLocaleString('en-US')}`);
                            await interaction.reply({ content: reponse, ephemeral: true });
                            break;
                        } else {
                            prix_bas = (jsonPrix.nourriture * 0.7).toFixed(2);
                            prix_haut = (jsonPrix.nourriture * 1.3).toFixed(2);

                            if (prix_u < prix_bas) {
                                reponse = codeBlock('ansi', `\u001b[0m\u001b[1;31mLe prix de vente de la nourriture est fixé entre : ${prix_bas} et ${prix_haut} l'unité`);
                                await interaction.reply({ content: reponse, ephemeral: true });
                            } else if (prix_u > prix_haut) {
                                reponse = codeBlock('ansi', `\u001b[0m\u001b[1;31mLe prix de vente de la nourriture est fixé entre : ${prix_bas} et ${prix_haut} l'unité`);
                                await interaction.reply({ content: reponse, ephemeral: true });
                            } else {
                                const pourcentage = (prix_u / jsonPrix.nourriture * 100).toFixed(1);
                                offre(jsonPrix.nourriture, pourcentage, '🌽')
                            }
                            break;
                        }
                    case 'Pétrole':
                        if (quantite > Ressources.petrole) {
                            reponse = codeBlock('ansi', `\u001b[0m\u001b[1;31mVous n'avez pas assez de pétrole : ${Ressources.petrole.toLocaleString('en-US')}/${quantite.toLocaleString('en-US')}`);
                            await interaction.reply({ content: reponse, ephemeral: true });
                            break;
                        } else {
                            prix_bas = (jsonPrix.petrole * 0.7).toFixed(2);
                            prix_haut = (jsonPrix.petrole * 1.3).toFixed(2);

                            if (prix_u < prix_bas) {
                                reponse = codeBlock('ansi', `\u001b[0m\u001b[1;31mLe prix de vente du pétrole est fixé entre : ${prix_bas} et ${prix_haut} l'unité`);
                                await interaction.reply({ content: reponse, ephemeral: true });
                            } else if (prix_u > prix_haut) {
                                reponse = codeBlock('ansi', `\u001b[0m\u001b[1;31mLe prix de vente du pétrole est fixé entre : ${prix_bas} et ${prix_haut} l'unité`);
                                await interaction.reply({ content: reponse, ephemeral: true });
                            } else {
                                const pourcentage = (prix_u / jsonPrix.petrole * 100).toFixed(1);
                                offre(jsonPrix.petrole, pourcentage, '🛢️')
                            }
                            break;
                        }
                    case 'Sable':
                        if (quantite > Ressources.sable) {
                            reponse = codeBlock('ansi', `\u001b[0m\u001b[1;31mVous n'avez pas assez de sable : ${Ressources.sable.toLocaleString('en-US')}/${quantite.toLocaleString('en-US')}`);
                            await interaction.reply({ content: reponse, ephemeral: true });
                            break;
                        } else {
                            prix_bas = (jsonPrix.sable * 0.7).toFixed(2);
                            prix_haut = (jsonPrix.sable * 1.3).toFixed(2);

                            if (prix_u < prix_bas) {
                                reponse = codeBlock('ansi', `\u001b[0m\u001b[1;31mLe prix de vente du sable est fixé entre : ${prix_bas} et ${prix_haut} l'unité`);
                                await interaction.reply({ content: reponse, ephemeral: true });
                            } else if (prix_u > prix_haut) {
                                reponse = codeBlock('ansi', `\u001b[0m\u001b[1;31mLe prix de vente du sable est fixé entre : ${prix_bas} et ${prix_haut} l'unité`);
                                await interaction.reply({ content: reponse, ephemeral: true });
                            } else {
                                const pourcentage = (prix_u / jsonPrix.sable * 100).toFixed(1);
                                offre(jsonPrix.sable, pourcentage, '<:sable:1075776363782479873>')
                            }
                            break;
                        }
                    case 'Verre':
                        if (quantite > Ressources.verre) {
                            reponse = codeBlock('ansi', `\u001b[0m\u001b[1;31mVous n'avez pas assez de verre : ${Ressources.verre.toLocaleString('en-US')}/${quantite.toLocaleString('en-US')}`);
                            await interaction.reply({ content: reponse, ephemeral: true });
                            break;
                        } else {
                            prix_bas = (jsonPrix.verre * 0.7).toFixed(2);
                            prix_haut = (jsonPrix.verre * 1.3).toFixed(2);

                            if (prix_u < prix_bas) {
                                reponse = codeBlock('ansi', `\u001b[0m\u001b[1;31mLe prix de vente du verre est fixé entre : ${prix_bas} et ${prix_haut} l'unité`);
                                await interaction.reply({ content: reponse, ephemeral: true });
                            } else if (prix_u > prix_haut) {
                                reponse = codeBlock('ansi', `\u001b[0m\u001b[1;31mLe prix de vente du verre est fixé entre : ${prix_bas} et ${prix_haut} l'unité`);
                                await interaction.reply({ content: reponse, ephemeral: true });
                            } else {
                                const pourcentage = (prix_u / jsonPrix.verre * 100).toFixed(1);
                                offre(jsonPrix.verre, pourcentage, '🪟')
                            }
                            break;
                        }
                }
            }
        })
    },
};