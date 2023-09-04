const { ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder, codeBlock} = require('discord.js');
const { readFileSync } = require('fs');
const batimentObject = JSON.parse(readFileSync('data/batiment.json', 'utf-8'));
const gouvernementObject = JSON.parse(readFileSync('data/gouvernement.json', 'utf-8'));

module.exports = {
    data: new SlashCommandBuilder()
        .setName('demolir')
        .setDescription(`Démolir un bâtiment`)
        .addStringOption(ressource =>
            ressource.setName('batiment')
                .setDescription(`Le type de bâtiment que vous voulez construire`)
                .addChoices(
                    { name: `Acierie`, value: `Acierie`},
                    { name: `Atelier de verre`, value: `Atelier de verre`},
                    { name: `Carriere de sable`, value: `Carriere de sable`},
                    { name: `Centrale biomasse`, value: `Centrale biomasse`},
                    { name: `Centrale au charbon`, value: `Centrale au charbon`},
                    { name: `Centrale au fioul`, value: `Centrale au fioul`},
                    { name: `Champ`, value: `Champ`},
                    { name: `Champ d'eoliennes`, value: `Champ d'eoliennes`},
                    { name: `Cimenterie`, value: `Cimenterie`},
                    { name: `Derrick`, value: `Derrick`},
                    { name: `Mine de charbon`, value: `Mine de charbon`},
                    { name: 'Mine de metaux', value: 'Mine de metaux'},
                    { name: `Station de pompage`, value: `Station de pompage`},
                    { name: `Quartier`, value: `Quartier`},
                    { name: `Raffinerie`, value: `Raffinerie`},
                    { name: `Scierie`, value: `Scierie`},
                    { name: `Usine civile`, value: `Usine civile`}
                )
                .setRequired(true))
        .addIntegerOption(nombre =>
            nombre.setName('nombre')
                .setDescription(`Le nombre de bâtiment(s) que vous voulez construire`)
                .setMinValue(1)
                .setRequired(true)),

    async execute(interaction) {
        const { connection } = require('../../index.js');
        const batiment = interaction.options.getString('batiment');
        const nombre = interaction.options.getInteger('nombre');

        const sql = `
            SELECT * FROM batiments WHERE id_joueur='${interaction.member.id}';
            SELECT * FROM pays WHERE id_joueur='${interaction.member.id}'
        `;
        connection.query(sql, async(err, results) => {if (err) {throw err;}
            const Batiment = results[0][0];
            const Pays = results[1][0];

            let demo_T_libre;
            let demo_acier;
            let demo_bois;
            let demo_eolienne;
            let demo_verre;

            let reponse;
            let apres;
            let avant;

            let demo_batiment = true;
            let need_acier = false;
            let need_bois = false;
            let need_eolienne = false;
            let need_verre = false;

            switch (batiment) {
                case 'Acierie':
                    //region Acierie
                    need_acier = true;

                    if (nombre > Batiment.acierie) {
                        demo_batiment = false;
                        reponse = codeBlock('ansi', `\u001b[0m\u001b[1;31mVous n'avez que ${Batiment.acierie}/${nombre} acieries`);
                        await interaction.reply({ content: reponse, ephemeral: true });
                    }
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
                    demo_T_libre = batimentObject.champ.SURFACE_CHAMP * nombre;
                    demo_acier = Math.round(batimentObject.champ.CONST_CHAMP_ACIER * nombre * eval(`gouvernementObject.${Pays.ideologie}.construction`) * batimentObject.RETOUR_POURCENTAGE);
                    demo_bois = Math.round(batimentObject.champ.CONST_CHAMP_BOIS * nombre * eval(`gouvernementObject.${Pays.ideologie}.construction`) * batimentObject.RETOUR_POURCENTAGE);
                    avant = Batiment.champ;
                    apres = Batiment.champ - nombre;
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
                    demo_T_libre = batimentObject.cimenterie.SURFACE_CIMENTERIE * nombre;
                    demo_acier = Math.round(batimentObject.cimenterie.CONST_CIMENTERIE_ACIER * nombre * eval(`gouvernementObject.${Pays.ideologie}.construction`) * batimentObject.RETOUR_POURCENTAGE);
                    avant = Batiment.cimenterie;
                    apres = Batiment.cimenterie - nombre;
                    //endregion
                    break;

                case 'Champ d\'eoliennes':
                    //region Eolienne
                    need_eolienne = true;

                    if (nombre > Batiment.eolienne) {
                        demo_batiment = false;
                        reponse = codeBlock('ansi', `\u001b[0m\u001b[1;31mVous n'avez que ${Batiment.eolienne}/${nombre} champs d'éoliennes`);
                        await interaction.reply({ content: reponse, ephemeral: true });
                    }
                    demo_T_libre = batimentObject.eolienne.SURFACE_EOLIENNE * nombre;
                    demo_eolienne = Math.round(batimentObject.eolienne.CONST_EOLIENNE_EOLIENNE * nombre);
                    avant = Batiment.eolienne;
                    apres = Batiment.eolienne - nombre;
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
                    demo_T_libre = batimentObject.usine_civile.SURFACE_USINE_CIVILE * nombre;
                    demo_acier = Math.round(batimentObject.usine_civile.CONST_USINE_CIVILE_ACIER * nombre * eval(`gouvernementObject.${Pays.ideologie}.construction`) * batimentObject.RETOUR_POURCENTAGE);
                    demo_bois = Math.round(batimentObject.usine_civile.CONST_USINE_CIVILE_BOIS * nombre * eval(`gouvernementObject.${Pays.ideologie}.construction`) * batimentObject.RETOUR_POURCENTAGE);
                    avant = Batiment.usine_civile;
                    apres = Batiment.usine_civile - nombre;
                    //endregion
                    break;
            }

            if (demo_batiment === true) {
                var fields = [];

                fields.push({
                    name: `> 🏭 ${batiment} :`,
                    value: codeBlock(`• Avant : ${avant.toLocaleString('en-US')}\n• Après : ${apres.toLocaleString('en-US')}`) + `\u200B`
                })
                fields.push({
                    name: `> 🌄 Terrain libre :`,
                    value: codeBlock(`• Terrain : +${demo_T_libre.toLocaleString('en-US')} km²\n`) + `\u200B`
                })

                if (need_acier === true) {
                    fields.push({
                        name: `> <:acier:1075776411329122304> Acier récupéré :`,
                        value: codeBlock(`• +${Math.round(demo_acier).toLocaleString('en-US')}`) + `\u200B`
                    })
                }
                if (need_bois === true) {
                    fields.push({
                        name: `> 🪵 Bois récupéré :`,
                        value: codeBlock(`• +${Math.round(demo_bois).toLocaleString('en-US')}`) + `\u200B`
                    })
                }
                if (need_eolienne === true) {
                    fields.push({
                        name: `> <:windmill:1108767955442991225> Eolienne récupéré :`,
                        value: codeBlock(`• +${Math.round(demo_eolienne).toLocaleString('en-US')}`) + `\u200B`
                    })
                }
                if (need_verre === true) {
                    fields.push({
                        name: `> 🪟 Verre récupéré :`,
                        value: codeBlock(`• +${Math.round(demo_verre).toLocaleString('en-US')}`) + `\u200B`
                    })
                }

                const embed = {
                    author: {
                        name: `${Pays.rang} de ${Pays.nom}`,
                        icon_url: interaction.member.displayAvatarURL()
                    },
                    thumbnail: {
                        url: `${Pays.drapeau}`
                    },
                    title: `\`Demolition : ${nombre} ${batiment}\``,
                    fields: fields,
                    color: interaction.member.displayColor,
                    timestamp: new Date(),
                    footer: {
                        text: `${Pays.devise}`
                    },
                };

                const row = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setLabel(`Démolir`)
                            .setEmoji(`🧨`)
                            .setCustomId(`demolition-${interaction.user.id}`)
                            .setStyle(ButtonStyle.Success),
                    )
                    .addComponents(
                        new ButtonBuilder()
                            .setLabel(`Refuser`)
                            .setEmoji(`✋`)
                            .setCustomId(`refuser-${interaction.user.id}`)
                            .setStyle(ButtonStyle.Danger),
                    )

                await interaction.reply({ embeds: [embed], components: [row] });
            }
        });
    },
};