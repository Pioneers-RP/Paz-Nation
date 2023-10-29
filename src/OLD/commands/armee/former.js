const { SlashCommandBuilder, codeBlock, ActionRowBuilder, ButtonBuilder, ButtonStyle} = require('discord.js');
const { readFileSync } = require("fs");
const armeeObject = JSON.parse(readFileSync('src/OLD/data/armee.json', 'utf-8'));

module.exports = {
    data: new SlashCommandBuilder()
        .setName('former')
        .setDescription(`Former des unités militaires`)
        .addStringOption(unite =>
            unite.setName('unité')
                .setDescription(`Le type d'unité que vous voulez former`)
                .addChoices(
                    { name: `Aviation`, value: `Aviation`},
                    { name: `Infanterie`, value: `Infanterie`},
                    { name: `Mécanisé`, value: `Mécanisé`},
                    { name: `Support`, value: `Support`},
                )
                .setRequired(true))
        .addIntegerOption(nombre =>
            nombre.setName('nombre')
                .setDescription(`Le nombre d'unités que vous voulez former`)
                .setMinValue(1)
                .setRequired(true)),

    async execute(interaction) {
        const { connection } = require('../../index');
        const uniteChoisi = interaction.options.getString('unité');
        const nombre = interaction.options.getInteger('nombre');

        const sql = `
            SELECT * FROM armee WHERE id_joueur='${interaction.member.id}';
            SELECT * FROM pays WHERE id_joueur='${interaction.member.id}';
            SELECT * FROM population WHERE id_joueur='${interaction.member.id}';
            SELECT * FROM ressources WHERE id_joueur='${interaction.member.id}';
        `;
        connection.query(sql, async(err, results) => {if (err) {throw err;}
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

            const embed = {
                author: {
                    name: `${Pays.rang} de ${Pays.nom}`,
                    icon_url: interaction.member.displayAvatarURL()
                },
                thumbnail: {
                    url: `${Pays.drapeau}`
                },
                title: `\`Former : ${nombre.toLocaleString('en-US')} ${uniteChoisi}\``,
                fields: fields,
                color: interaction.member.displayColor,
                timestamp: new Date(),
                footer: {
                    text: `${Pays.devise}`
                },
            };

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

                await interaction.reply({ embeds: [embed], components: [row] });
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

                await interaction.reply({ embeds: [embed], components: [row] });
            }
        });
    }
};