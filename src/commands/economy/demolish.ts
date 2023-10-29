import {ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder, codeBlock} from 'discord.js';
import {readFileSync} from 'fs';
const batimentObject = JSON.parse(readFileSync('src/data/batiment.json', 'utf-8'));
const gouvernementObject = JSON.parse(readFileSync('src/data/gouvernement.json', 'utf-8'));

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

    async execute(interaction: any) {
        const { connection } = require('../../index');
        const batiment = interaction.options.getString('batiment');
        const nombre = interaction.options.getInteger('nombre');

        const sql = `
            SELECT * FROM batiments WHERE id_joueur='${interaction.member.id}';
            SELECT * FROM pays WHERE id_joueur='${interaction.member.id}'
        `;
        connection.query(sql, async(err: any, results: any[][]) => {if (err) {throw err;}
            const Batiment = results[0][0];
            const Pays = results[1][0];

            let gainSparePlace: number = 0;
            let gainSteel: number = 0;
            let gainWood: number = 0;
            let gainWindTurbine: number = 0;
            let gainGlass: number = 0;

            let failReply: string;
            let numberAfter: number = 0;
            let numberBefore: number = 0;

            let demolishStatus: boolean = true;
            let needSteel: boolean = false;
            let needWood: boolean = false;
            let needWindTurbine: boolean = false;
            let needGlass: boolean = false;

            switch (batiment) {
                case 'Acierie':
                    //region Acierie
                    needSteel = true;

                    if (nombre > Batiment.acierie) {
                        demolishStatus = false;
                        failReply = codeBlock('ansi', `\u001b[0m\u001b[1;31mVous n'avez que ${Batiment.acierie}/${nombre} acieries`);
                        await interaction.reply({ content: failReply, ephemeral: true });
                    }
                    gainSparePlace = batimentObject.acierie.SURFACE_ACIERIE * nombre;
                    gainSteel = Math.round(batimentObject.acierie.CONST_ACIERIE_ACIER * nombre * eval(`gouvernementObject.${Pays.ideologie}.construction`) * batimentObject.RETOUR_POURCENTAGE);
                    numberBefore = Batiment.acierie;
                    numberAfter = Batiment.acierie - nombre;
                    //endregion
                    break;

                case 'Atelier de verre':
                    //region Atelier de verre
                    needSteel = true;
                    needWood = true;

                    if (nombre > Batiment.atelier_verre) {
                        demolishStatus = false;
                        failReply = codeBlock('ansi', `\u001b[0m\u001b[1;31mVous n'avez que ${Batiment.atelier_verre}/${nombre} ateliers de verre`);
                        await interaction.reply({ content: failReply, ephemeral: true });
                    }
                    gainSparePlace = batimentObject.atelier_verre.SURFACE_ATELIER_VERRE * nombre;
                    gainSteel = Math.round(batimentObject.atelier_verre.CONST_ATELIER_VERRE_ACIER * nombre * eval(`gouvernementObject.${Pays.ideologie}.construction`) * batimentObject.RETOUR_POURCENTAGE);
                    gainWood = Math.round(batimentObject.atelier_verre.CONST_ATELIER_VERRE_BOIS * nombre * eval(`gouvernementObject.${Pays.ideologie}.construction`) * batimentObject.RETOUR_POURCENTAGE);
                    numberBefore = Batiment.atelier_verre;
                    numberAfter = Batiment.atelier_verre - nombre;
                    //endregion
                    break;

                case 'Carriere de sable':
                    //region Carriere de sable
                    needSteel = true;

                    if (nombre > Batiment.carriere_sable) {
                        demolishStatus = false;
                        failReply = codeBlock('ansi', `\u001b[0m\u001b[1;31mVous n'avez que ${Batiment.carriere_sable}/${nombre} carrieres de sable`);
                        await interaction.reply({ content: failReply, ephemeral: true });
                    }
                    gainSparePlace = batimentObject.carriere_sable.SURFACE_CARRIERE_SABLE * nombre;
                    gainSteel = Math.round(batimentObject.carriere_sable.CONST_CARRIERE_SABLE_ACIER * nombre * eval(`gouvernementObject.${Pays.ideologie}.construction`) * batimentObject.RETOUR_POURCENTAGE);
                    numberBefore = Batiment.carriere_sable;
                    numberAfter = Batiment.carriere_sable - nombre;
                    //endregion
                    break;

                case 'Centrale biomasse':
                    //region Centrale biomasse
                    needSteel = true;

                    if (nombre > Batiment.centrale_biomasse) {
                        demolishStatus = false;
                        failReply = codeBlock('ansi', `\u001b[0m\u001b[1;31mVous n'avez que ${Batiment.centrale_biomasse}/${nombre} centrales biomasse`);
                        await interaction.reply({ content: failReply, ephemeral: true });
                    }
                    gainSparePlace = batimentObject.centrale_biomasse.SURFACE_CENTRALE_BIOMASSE * nombre;
                    gainSteel = Math.round(batimentObject.centrale_biomasse.CONST_CENTRALE_BIOMASSE_ACIER * nombre * eval(`gouvernementObject.${Pays.ideologie}.construction`) * batimentObject.RETOUR_POURCENTAGE);
                    numberBefore = Batiment.centrale_biomasse;
                    numberAfter = Batiment.centrale_biomasse - nombre;
                    //endregion
                    break;

                case 'Centrale au charbon':
                    //region Centrale au charbon
                    needSteel = true;

                    if (nombre > Batiment.centrale_charbon) {
                        demolishStatus = false;
                        failReply = codeBlock('ansi', `\u001b[0m\u001b[1;31mVous n'avez que ${Batiment.centrale_charbon}/${nombre} centrales au charbon`);
                        await interaction.reply({ content: failReply, ephemeral: true });
                    }
                    gainSparePlace = batimentObject.centrale_charbon.SURFACE_CENTRALE_CHARBON * nombre;
                    gainSteel = Math.round(batimentObject.centrale_charbon.CONST_CENTRALE_CHARBON_ACIER * nombre * eval(`gouvernementObject.${Pays.ideologie}.construction`) * batimentObject.RETOUR_POURCENTAGE);
                    numberBefore = Batiment.centrale_charbon;
                    numberAfter = Batiment.centrale_charbon - nombre;
                    //endregion
                    break;

                case 'Centrale au fioul':
                    //region Centrale au fioul
                    needSteel = true;

                    if (nombre > Batiment.centrale_fioul) {
                        demolishStatus = false;
                        failReply = codeBlock('ansi', `\u001b[0m\u001b[1;31mVous n'avez que ${Batiment.centrale_fioul}/${nombre} centrales au fioul`);
                        await interaction.reply({ content: failReply, ephemeral: true });
                    }
                    gainSparePlace = batimentObject.centrale_fioul.SURFACE_CENTRALE_FIOUL * nombre;
                    gainSteel = Math.round(batimentObject.centrale_fioul.CONST_CENTRALE_FIOUL_ACIER * nombre * eval(`gouvernementObject.${Pays.ideologie}.construction`) * batimentObject.RETOUR_POURCENTAGE);
                    numberBefore = Batiment.centrale_fioul;
                    numberAfter = Batiment.centrale_fioul - nombre;
                    //endregion
                    break;

                case 'Champ':
                    //region Champ
                    needSteel = true;
                    needWood = true;

                    if (nombre > Batiment.champ) {
                        demolishStatus = false;
                        failReply = codeBlock('ansi', `\u001b[0m\u001b[1;31mVous n'avez que ${Batiment.champ}/${nombre} champs`);
                        await interaction.reply({ content: failReply, ephemeral: true });
                    }
                    gainSparePlace = batimentObject.champ.SURFACE_CHAMP * nombre;
                    gainSteel = Math.round(batimentObject.champ.CONST_CHAMP_ACIER * nombre * eval(`gouvernementObject.${Pays.ideologie}.construction`) * batimentObject.RETOUR_POURCENTAGE);
                    gainWood = Math.round(batimentObject.champ.CONST_CHAMP_BOIS * nombre * eval(`gouvernementObject.${Pays.ideologie}.construction`) * batimentObject.RETOUR_POURCENTAGE);
                    numberBefore = Batiment.champ;
                    numberAfter = Batiment.champ - nombre;
                    //endregion
                    break;

                case 'Cimenterie':
                    //region Cimenterie
                    needSteel = true;

                    if (nombre > Batiment.cimenterie) {
                        demolishStatus = false;
                        failReply = codeBlock('ansi', `\u001b[0m\u001b[1;31mVous n'avez que ${Batiment.cimenterie}/${nombre} cimenteries`);
                        await interaction.reply({ content: failReply, ephemeral: true });
                    }
                    gainSparePlace = batimentObject.cimenterie.SURFACE_CIMENTERIE * nombre;
                    gainSteel = Math.round(batimentObject.cimenterie.CONST_CIMENTERIE_ACIER * nombre * eval(`gouvernementObject.${Pays.ideologie}.construction`) * batimentObject.RETOUR_POURCENTAGE);
                    numberBefore = Batiment.cimenterie;
                    numberAfter = Batiment.cimenterie - nombre;
                    //endregion
                    break;

                case 'Champ d\'eoliennes':
                    //region Eolienne
                    needWindTurbine = true;

                    if (nombre > Batiment.eolienne) {
                        demolishStatus = false;
                        failReply = codeBlock('ansi', `\u001b[0m\u001b[1;31mVous n'avez que ${Batiment.eolienne}/${nombre} champs d'éoliennes`);
                        await interaction.reply({ content: failReply, ephemeral: true });
                    }
                    gainSparePlace = batimentObject.eolienne.SURFACE_EOLIENNE * nombre;
                    gainWindTurbine = Math.round(batimentObject.eolienne.CONST_EOLIENNE_EOLIENNE * nombre);
                    numberBefore = Batiment.eolienne;
                    numberAfter = Batiment.eolienne - nombre;
                    //endregion
                    break;

                case 'Derrick':
                    //region Derrick
                    needSteel = true;

                    if (nombre > Batiment.derrick) {
                        demolishStatus = false;
                        failReply = codeBlock('ansi', `\u001b[0m\u001b[1;31mVous n'avez que ${Batiment.derrick}/${nombre} derricks`);
                        await interaction.reply({ content: failReply, ephemeral: true });
                    }
                    gainSparePlace = batimentObject.derrick.SURFACE_DERRICK * nombre;
                    gainSteel = Math.round(batimentObject.derrick.CONST_DERRICK_ACIER * nombre * eval(`gouvernementObject.${Pays.ideologie}.construction`) * batimentObject.RETOUR_POURCENTAGE);
                    numberBefore = Batiment.derrick;
                    numberAfter = Batiment.derrick - nombre;
                    //endregion
                    break;

                case 'Mine de charbon':
                    //region Mine de charbon
                    needSteel = true;

                    if (nombre > Batiment.mine_charbon) {
                        demolishStatus = false;
                        failReply = codeBlock('ansi', `\u001b[0m\u001b[1;31mVous n'avez que ${Batiment.mine_charbon}/${nombre} mines de charbon`);
                        await interaction.reply({ content: failReply, ephemeral: true });
                    }
                    gainSparePlace = batimentObject.mine_charbon.SURFACE_MINE_CHARBON * nombre;
                    gainSteel = Math.round(batimentObject.mine_charbon.CONST_MINE_CHARBON_ACIER * nombre * eval(`gouvernementObject.${Pays.ideologie}.construction`)) * batimentObject.RETOUR_POURCENTAGE;
                    numberBefore = Batiment.mine_charbon;
                    numberAfter = Batiment.mine_charbon - nombre;
                    //endregion
                    break;

                case 'Mine de metaux':
                    //region Mine de metaux
                    needSteel = true;

                    if (nombre > Batiment.mine_metaux) {
                        demolishStatus = false;
                        failReply = codeBlock('ansi', `\u001b[0m\u001b[1;31mVous n'avez que ${Batiment.mine_metaux}/${nombre} mines de metaux`);
                        await interaction.reply({ content: failReply, ephemeral: true });
                    }
                    gainSparePlace = batimentObject.mine_metaux.SURFACE_MINE_METAUX * nombre;
                    gainSteel = Math.round(batimentObject.mine_metaux.CONST_MINE_METAUX_ACIER * nombre * eval(`gouvernementObject.${Pays.ideologie}.construction`) * batimentObject.RETOUR_POURCENTAGE);
                    numberBefore = Batiment.mine_metaux;
                    numberAfter = Batiment.mine_metaux - nombre;
                    //endregion
                    break;

                case 'Station de pompage':
                    //region Station de pompage
                    needSteel = true;

                    if (nombre > Batiment.station_pompage) {
                        demolishStatus = false;
                        failReply = codeBlock('ansi', `\u001b[0m\u001b[1;31mVous n'avez que ${Batiment.station_pompage}/${nombre} stations de pompage`);
                        await interaction.reply({ content: failReply, ephemeral: true });
                    }
                    gainSparePlace = batimentObject.station_pompage.SURFACE_STATION_POMPAGE * nombre;
                    gainSteel = Math.round(batimentObject.station_pompage.CONST_STATION_POMPAGE_ACIER * nombre * eval(`gouvernementObject.${Pays.ideologie}.construction`) * batimentObject.RETOUR_POURCENTAGE);
                    numberBefore = Batiment.station_pompage;
                    numberAfter = Batiment.station_pompage - nombre;
                    //endregion
                    break;

                case 'Quartier':
                    //region Quartier
                    needSteel = true;
                    needWood = true;
                    needGlass = true;

                    if (nombre > Batiment.quartier) {
                        demolishStatus = false;
                        failReply = codeBlock('ansi', `\u001b[0m\u001b[1;31mVous n'avez que ${Batiment.quartier}/${nombre} quartiers`);
                        await interaction.reply({ content: failReply, ephemeral: true });
                    }
                    gainSparePlace = batimentObject.quartier.SURFACE_QUARTIER * nombre;
                    gainSteel = Math.round(batimentObject.quartier.CONST_QUARTIER_ACIER * nombre * eval(`gouvernementObject.${Pays.ideologie}.construction`) * batimentObject.RETOUR_POURCENTAGE);
                    gainWood = Math.round(batimentObject.quartier.CONST_QUARTIER_BOIS * nombre * eval(`gouvernementObject.${Pays.ideologie}.construction`) * batimentObject.RETOUR_POURCENTAGE);
                    gainGlass = Math.round(batimentObject.quartier.CONST_QUARTIER_VERRE * nombre * eval(`gouvernementObject.${Pays.ideologie}.construction`) * batimentObject.RETOUR_POURCENTAGE);
                    numberBefore = Batiment.quartier;
                    numberAfter = Batiment.quartier - nombre;
                    //endregion
                    break;

                case 'Raffinerie':
                    //region Raffinerie
                    needSteel = true;

                    if (nombre > Batiment.raffinerie) {
                        demolishStatus = false;
                        failReply = codeBlock('ansi', `\u001b[0m\u001b[1;31mVous n'avez que ${Batiment.raffinerie}/${nombre} raffineries`);
                        await interaction.reply({ content: failReply, ephemeral: true });
                    }
                    gainSparePlace = batimentObject.raffinerie.SURFACE_RAFFINERIE * nombre;
                    gainSteel = Math.round(batimentObject.raffinerie.CONST_RAFFINERIE_ACIER * nombre * eval(`gouvernementObject.${Pays.ideologie}.construction`) * batimentObject.RETOUR_POURCENTAGE);
                    numberBefore = Batiment.raffinerie;
                    numberAfter = Batiment.raffinerie - nombre;
                    //endregion
                    break;

                case 'Scierie':
                    //region Scierie
                    needSteel = true;
                    needWood = true;

                    if (nombre > Batiment.scierie) {
                        demolishStatus = false;
                        failReply = codeBlock('ansi', `\u001b[0m\u001b[1;31mVous n'avez que ${Batiment.scierie}/${nombre} scieries`);
                        await interaction.reply({ content: failReply, ephemeral: true });
                    }
                    gainSparePlace = batimentObject.scierie.SURFACE_SCIERIE * nombre;
                    gainSteel = Math.round(batimentObject.scierie.CONST_SCIERIE_ACIER * nombre * eval(`gouvernementObject.${Pays.ideologie}.construction`));
                    gainWood = Math.round(batimentObject.scierie.CONST_SCIERIE_BOIS * nombre * eval(`gouvernementObject.${Pays.ideologie}.construction`));
                    numberBefore = Batiment.scierie;
                    numberAfter = Batiment.scierie - nombre;
                    //endregion
                    break;

                case 'Usine civile':
                    //region Usine civile
                    needSteel = true;
                    needWood = true;

                    if (nombre > Batiment.usine_civile) {
                        demolishStatus = false;
                        failReply = codeBlock('ansi', `\u001b[0m\u001b[1;31mVous n'avez que ${Batiment.usine_civile}/${nombre} usines civile`);
                        await interaction.reply({ content: failReply, ephemeral: true });
                    }
                    gainSparePlace = batimentObject.usine_civile.SURFACE_USINE_CIVILE * nombre;
                    gainSteel = Math.round(batimentObject.usine_civile.CONST_USINE_CIVILE_ACIER * nombre * eval(`gouvernementObject.${Pays.ideologie}.construction`) * batimentObject.RETOUR_POURCENTAGE);
                    gainWood = Math.round(batimentObject.usine_civile.CONST_USINE_CIVILE_BOIS * nombre * eval(`gouvernementObject.${Pays.ideologie}.construction`) * batimentObject.RETOUR_POURCENTAGE);
                    numberBefore = Batiment.usine_civile;
                    numberAfter = Batiment.usine_civile - nombre;
                    //endregion
                    break;
            }

            if (demolishStatus) {
                const fields = [];

                fields.push({
                    name: `> 🏭 ${batiment} :`,
                    value: codeBlock(`• Avant : ${numberBefore.toLocaleString('en-US')}\n• Après : ${numberAfter.toLocaleString('en-US')}`) + `\u200B`
                })
                fields.push({
                    name: `> 🌄 Terrain libre :`,
                    value: codeBlock(`• Terrain : +${gainSparePlace.toLocaleString('en-US')} km²\n`) + `\u200B`
                })

                if (needSteel) {
                    fields.push({
                        name: `> <:acier:1075776411329122304> Acier récupéré :`,
                        value: codeBlock(`• +${Math.round(gainSteel).toLocaleString('en-US')}`) + `\u200B`
                    })
                }
                if (needWood) {
                    fields.push({
                        name: `> 🪵 Bois récupéré :`,
                        value: codeBlock(`• +${Math.round(gainWood).toLocaleString('en-US')}`) + `\u200B`
                    })
                }
                if (needWindTurbine) {
                    fields.push({
                        name: `> <:windmill:1108767955442991225> Eolienne récupéré :`,
                        value: codeBlock(`• +${Math.round(gainWindTurbine).toLocaleString('en-US')}`) + `\u200B`
                    })
                }
                if (needGlass) {
                    fields.push({
                        name: `> 🪟 Verre récupéré :`,
                        value: codeBlock(`• +${Math.round(gainGlass).toLocaleString('en-US')}`) + `\u200B`
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