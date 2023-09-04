const { ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder, codeBlock} = require('discord.js');
const { readFileSync } = require('fs');
const gouvernementObject = JSON.parse(readFileSync('data/gouvernement.json', 'utf-8'));
const assemblageObject = JSON.parse(readFileSync('data/assemblage.json', 'utf-8'));

module.exports = {
    data: new SlashCommandBuilder()
        .setName('assembler')
        .setDescription(`Assembler du matériel`)
        .addStringOption(ressource =>
            ressource.setName('materiel')
                .setDescription(`Le type de matériel que vous voulez assembler`)
                .addChoices(
                    { name: `Avion`, value: `Avion`},
                    { name: `Eolienne`, value: `Eolienne`},
                    { name: `Equipement de support`, value: `Equipement de support`},
                    { name: `Matériel d'infanterie`, value: `Matériel d'infanterie`},
                    { name: `Véhicule`, value: `Véhicule`},
                )
                .setRequired(true))
        .addIntegerOption(nombre =>
            nombre.setName('nombre')
                .setDescription(`Le nombre de matériels que vous voulez assembler`)
                .setMinValue(1)
                .setRequired(true)),

    async execute(interaction) {
        const { connection } = require('../../index.js');
        const BatimentChoisi = interaction.options.getString('materiel');
        const nombre = interaction.options.getInteger('nombre');

        const sql = `
            SELECT * FROM pays WHERE id_joueur='${interaction.member.id}';
            SELECT * FROM ressources WHERE id_joueur='${interaction.member.id}';
        `;
        connection.query(sql, async(err, results) => {if (err) {throw err;}
            const Pays = results[0][0];
            const Ressources = results[1][0];

            let manque_acier;
            let const_acier;
            let manque_beton;
            let const_beton;
            let manque_bois;
            let const_bois;
            let manque_metaux;
            let const_metaux;
            let manque_verre;
            let const_verre;

            let const_batiment = true;
            let need_acier = false;
            let need_beton = false;
            let need_bois = false;
            let need_metaux = false;
            let need_verre = false;


            switch (BatimentChoisi) {
                case 'Avion':
                    //region Avion
                    need_acier = true;
                    need_metaux = true;

                    const_acier = Math.round(assemblageObject.avion.CONST_AVION_ACIER * nombre * eval(`gouvernementObject.${Pays.ideologie}.construction`));
                    if (const_acier > Ressources.acier) {
                        const_batiment = false;
                        manque_acier = true;
                    }
                    const_metaux = Math.round(assemblageObject.avion.CONST_AVION_METAUX * nombre * eval(`gouvernementObject.${Pays.ideologie}.construction`));
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

                    const_acier = Math.round(assemblageObject.eolienne.CONST_EOLIENNE_ACIER * nombre * eval(`gouvernementObject.${Pays.ideologie}.construction`));
                    if (const_acier > Ressources.acier) {
                        const_batiment = false;
                        manque_acier = true;
                    }
                    const_verre = Math.round(assemblageObject.eolienne.CONST_EOLIENNE_VERRE * nombre * eval(`gouvernementObject.${Pays.ideologie}.construction`));
                    if (const_verre > Ressources.verre) {
                        const_batiment = false;
                        manque_verre = true;
                    }
                    //endregion
                    break;
                case 'Equipement de support':
                    //region Equipement de support
                    need_acier = true;
                    need_metaux = true;

                    const_acier = Math.round(assemblageObject.equipement_support.CONST_EQUIPEMENT_SUPPORT_ACIER * nombre * eval(`gouvernementObject.${Pays.ideologie}.construction`));
                    if (const_acier > Ressources.acier) {
                        const_batiment = false;
                        manque_acier = true;
                    }
                    const_metaux = Math.round(assemblageObject.equipement_support.CONST_EQUIPEMENT_SUPPORT_METAUX * nombre * eval(`gouvernementObject.${Pays.ideologie}.construction`));
                    if (const_metaux > Ressources.metaux) {
                        const_batiment = false;
                        manque_metaux = true;
                    }
                    //endregion
                    break;
                case 'Matériel d\'infanterie':
                    //region Matériel d'infanterie
                    need_acier = true;
                    need_metaux = true;

                    const_acier = Math.round(assemblageObject.materiel_infanterie.CONST_MATERIEL_INFANTERIE_ACIER * nombre * eval(`gouvernementObject.${Pays.ideologie}.construction`));
                    if (const_acier > Ressources.acier) {
                        const_batiment = false;
                        manque_acier = true;
                    }
                    const_metaux = Math.round(assemblageObject.materiel_infanterie.CONST_MATERIEL_INFANTERIE_METAUX * nombre * eval(`gouvernementObject.${Pays.ideologie}.construction`));
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

                    const_acier = Math.round(assemblageObject.vehicule.CONST_VEHICULE_ACIER * nombre * eval(`gouvernementObject.${Pays.ideologie}.construction`));
                    if (const_acier > Ressources.acier) {
                        const_batiment = false;
                        manque_acier = true;
                    }
                    const_metaux = Math.round(assemblageObject.vehicule.CONST_VEHICULE_METAUX * nombre * eval(`gouvernementObject.${Pays.ideologie}.construction`));
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

            const embed = {
                author: {
                    name: `${Pays.rang} de ${Pays.nom}`,
                    icon_url: interaction.member.displayAvatarURL()
                },
                thumbnail: {
                    url: `${Pays.drapeau}`
                },
                title: `\`Assemblage : ${nombre.toLocaleString('en-US')} ${BatimentChoisi}\``,
                fields: fields,
                color: interaction.member.displayColor,
                timestamp: new Date(),
                footer: {
                    text: `${Pays.devise}`
                },
            };

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

                await interaction.reply({ embeds: [embed], components: [row] });
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

                await interaction.reply({ embeds: [embed], components: [row] });
            }
        });
    },
};