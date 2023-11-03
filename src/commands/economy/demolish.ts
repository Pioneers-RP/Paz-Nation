import {ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder, codeBlock} from 'discord.js';
import {readFileSync} from 'fs';
import {failReply} from "../../fonctions/functions";
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
        const { connection } = require('../../index.ts');
        const chosenBuild = interaction.options.getString('batiment');
        const numberBuild = interaction.options.getInteger('numberBuild');

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

            let numberAfter: number = 0;
            let numberBefore: number = 0;

            let demolishStatus: boolean = true;
            let needSteel: boolean = false;
            let needWood: boolean = false;
            let needWindTurbine: boolean = false;
            let needGlass: boolean = false;

            switch (chosenBuild) {
                case 'Acierie':
                    //region Acierie
                    needSteel = true;

                    if (numberBuild > Batiment.acierie) {
                        demolishStatus = false;
                        failReply(interaction, `Vous n'avez que ${Batiment.acierie}/${numberBuild} acieries`);
                    }
                    gainSparePlace = batimentObject.acierie.SURFACE_ACIERIE * numberBuild;
                    gainSteel = Math.round(batimentObject.acierie.CONST_ACIERIE_ACIER * numberBuild * eval(`gouvernementObject.${Pays.ideologie}.construction`) * batimentObject.RETOUR_POURCENTAGE);
                    numberBefore = Batiment.acierie;
                    numberAfter = Batiment.acierie - numberBuild;
                    //endregion
                    break;

                case 'Atelier de verre':
                    //region Atelier de verre
                    needSteel = true;
                    needWood = true;

                    if (numberBuild > Batiment.atelier_verre) {
                        demolishStatus = false;
                        failReply(interaction, `Vous n'avez que ${Batiment.atelier_verre}/${numberBuild} ateliers de verre`);
                    }
                    gainSparePlace = batimentObject.atelier_verre.SURFACE_ATELIER_VERRE * numberBuild;
                    gainSteel = Math.round(batimentObject.atelier_verre.CONST_ATELIER_VERRE_ACIER * numberBuild * eval(`gouvernementObject.${Pays.ideologie}.construction`) * batimentObject.RETOUR_POURCENTAGE);
                    gainWood = Math.round(batimentObject.atelier_verre.CONST_ATELIER_VERRE_BOIS * numberBuild * eval(`gouvernementObject.${Pays.ideologie}.construction`) * batimentObject.RETOUR_POURCENTAGE);
                    numberBefore = Batiment.atelier_verre;
                    numberAfter = Batiment.atelier_verre - numberBuild;
                    //endregion
                    break;

                case 'Carriere de sable':
                    //region Carriere de sable
                    needSteel = true;

                    if (numberBuild > Batiment.carriere_sable) {
                        demolishStatus = false;
                        failReply(interaction, `Vous n'avez que ${Batiment.carriere_sable}/${numberBuild} carrieres de sable`);
                    }
                    gainSparePlace = batimentObject.carriere_sable.SURFACE_CARRIERE_SABLE * numberBuild;
                    gainSteel = Math.round(batimentObject.carriere_sable.CONST_CARRIERE_SABLE_ACIER * numberBuild * eval(`gouvernementObject.${Pays.ideologie}.construction`) * batimentObject.RETOUR_POURCENTAGE);
                    numberBefore = Batiment.carriere_sable;
                    numberAfter = Batiment.carriere_sable - numberBuild;
                    //endregion
                    break;

                case 'Centrale biomasse':
                    //region Centrale biomasse
                    needSteel = true;

                    if (numberBuild > Batiment.centrale_biomasse) {
                        demolishStatus = false;
                        failReply(interaction, `Vous n'avez que ${Batiment.centrale_biomasse}/${numberBuild} centrales biomasse`);
                    }
                    gainSparePlace = batimentObject.centrale_biomasse.SURFACE_CENTRALE_BIOMASSE * numberBuild;
                    gainSteel = Math.round(batimentObject.centrale_biomasse.CONST_CENTRALE_BIOMASSE_ACIER * numberBuild * eval(`gouvernementObject.${Pays.ideologie}.construction`) * batimentObject.RETOUR_POURCENTAGE);
                    numberBefore = Batiment.centrale_biomasse;
                    numberAfter = Batiment.centrale_biomasse - numberBuild;
                    //endregion
                    break;

                case 'Centrale au charbon':
                    //region Centrale au charbon
                    needSteel = true;

                    if (numberBuild > Batiment.centrale_charbon) {
                        demolishStatus = false;
                        failReply(interaction, `Vous n'avez que ${Batiment.centrale_charbon}/${numberBuild} centrales au charbon`);
                    }
                    gainSparePlace = batimentObject.centrale_charbon.SURFACE_CENTRALE_CHARBON * numberBuild;
                    gainSteel = Math.round(batimentObject.centrale_charbon.CONST_CENTRALE_CHARBON_ACIER * numberBuild * eval(`gouvernementObject.${Pays.ideologie}.construction`) * batimentObject.RETOUR_POURCENTAGE);
                    numberBefore = Batiment.centrale_charbon;
                    numberAfter = Batiment.centrale_charbon - numberBuild;
                    //endregion
                    break;

                case 'Centrale au fioul':
                    //region Centrale au fioul
                    needSteel = true;

                    if (numberBuild > Batiment.centrale_fioul) {
                        demolishStatus = false;
                        failReply(interaction, `Vous n'avez que ${Batiment.centrale_fioul}/${numberBuild} centrales au fioul`);
                    }
                    gainSparePlace = batimentObject.centrale_fioul.SURFACE_CENTRALE_FIOUL * numberBuild;
                    gainSteel = Math.round(batimentObject.centrale_fioul.CONST_CENTRALE_FIOUL_ACIER * numberBuild * eval(`gouvernementObject.${Pays.ideologie}.construction`) * batimentObject.RETOUR_POURCENTAGE);
                    numberBefore = Batiment.centrale_fioul;
                    numberAfter = Batiment.centrale_fioul - numberBuild;
                    //endregion
                    break;

                case 'Champ':
                    //region Champ
                    needSteel = true;
                    needWood = true;

                    if (numberBuild > Batiment.champ) {
                        demolishStatus = false;
                        failReply(interaction, `Vous n'avez que ${Batiment.champ}/${numberBuild} champs`);
                    }
                    gainSparePlace = batimentObject.champ.SURFACE_CHAMP * numberBuild;
                    gainSteel = Math.round(batimentObject.champ.CONST_CHAMP_ACIER * numberBuild * eval(`gouvernementObject.${Pays.ideologie}.construction`) * batimentObject.RETOUR_POURCENTAGE);
                    gainWood = Math.round(batimentObject.champ.CONST_CHAMP_BOIS * numberBuild * eval(`gouvernementObject.${Pays.ideologie}.construction`) * batimentObject.RETOUR_POURCENTAGE);
                    numberBefore = Batiment.champ;
                    numberAfter = Batiment.champ - numberBuild;
                    //endregion
                    break;

                case 'Cimenterie':
                    //region Cimenterie
                    needSteel = true;

                    if (numberBuild > Batiment.cimenterie) {
                        demolishStatus = false;
                        failReply(interaction, `Vous n'avez que ${Batiment.cimenterie}/${numberBuild} cimenteries`);
                    }
                    gainSparePlace = batimentObject.cimenterie.SURFACE_CIMENTERIE * numberBuild;
                    gainSteel = Math.round(batimentObject.cimenterie.CONST_CIMENTERIE_ACIER * numberBuild * eval(`gouvernementObject.${Pays.ideologie}.construction`) * batimentObject.RETOUR_POURCENTAGE);
                    numberBefore = Batiment.cimenterie;
                    numberAfter = Batiment.cimenterie - numberBuild;
                    //endregion
                    break;

                case 'Champ d\'eoliennes':
                    //region Eolienne
                    needWindTurbine = true;

                    if (numberBuild > Batiment.eolienne) {
                        demolishStatus = false;
                        failReply(interaction, `Vous n'avez que ${Batiment.eolienne}/${numberBuild} champs d'éoliennes`);
                    }
                    gainSparePlace = batimentObject.eolienne.SURFACE_EOLIENNE * numberBuild;
                    gainWindTurbine = Math.round(batimentObject.eolienne.CONST_EOLIENNE_EOLIENNE * numberBuild);
                    numberBefore = Batiment.eolienne;
                    numberAfter = Batiment.eolienne - numberBuild;
                    //endregion
                    break;

                case 'Derrick':
                    //region Derrick
                    needSteel = true;

                    if (numberBuild > Batiment.derrick) {
                        demolishStatus = false;
                        failReply(interaction, `Vous n'avez que ${Batiment.derrick}/${numberBuild} derricks`);
                    }
                    gainSparePlace = batimentObject.derrick.SURFACE_DERRICK * numberBuild;
                    gainSteel = Math.round(batimentObject.derrick.CONST_DERRICK_ACIER * numberBuild * eval(`gouvernementObject.${Pays.ideologie}.construction`) * batimentObject.RETOUR_POURCENTAGE);
                    numberBefore = Batiment.derrick;
                    numberAfter = Batiment.derrick - numberBuild;
                    //endregion
                    break;

                case 'Mine de charbon':
                    //region Mine de charbon
                    needSteel = true;

                    if (numberBuild > Batiment.mine_charbon) {
                        demolishStatus = false;
                        failReply(interaction, `Vous n'avez que ${Batiment.mine_charbon}/${numberBuild} mines de charbon`);
                    }
                    gainSparePlace = batimentObject.mine_charbon.SURFACE_MINE_CHARBON * numberBuild;
                    gainSteel = Math.round(batimentObject.mine_charbon.CONST_MINE_CHARBON_ACIER * numberBuild * eval(`gouvernementObject.${Pays.ideologie}.construction`)) * batimentObject.RETOUR_POURCENTAGE;
                    numberBefore = Batiment.mine_charbon;
                    numberAfter = Batiment.mine_charbon - numberBuild;
                    //endregion
                    break;

                case 'Mine de metaux':
                    //region Mine de metaux
                    needSteel = true;

                    if (numberBuild > Batiment.mine_metaux) {
                        demolishStatus = false;
                        failReply(interaction, `Vous n'avez que ${Batiment.mine_metaux}/${numberBuild} mines de metaux`);
                    }
                    gainSparePlace = batimentObject.mine_metaux.SURFACE_MINE_METAUX * numberBuild;
                    gainSteel = Math.round(batimentObject.mine_metaux.CONST_MINE_METAUX_ACIER * numberBuild * eval(`gouvernementObject.${Pays.ideologie}.construction`) * batimentObject.RETOUR_POURCENTAGE);
                    numberBefore = Batiment.mine_metaux;
                    numberAfter = Batiment.mine_metaux - numberBuild;
                    //endregion
                    break;

                case 'Station de pompage':
                    //region Station de pompage
                    needSteel = true;

                    if (numberBuild > Batiment.station_pompage) {
                        demolishStatus = false;
                        failReply(interaction, `Vous n'avez que ${Batiment.station_pompage}/${numberBuild} stations de pompage`);
                    }
                    gainSparePlace = batimentObject.station_pompage.SURFACE_STATION_POMPAGE * numberBuild;
                    gainSteel = Math.round(batimentObject.station_pompage.CONST_STATION_POMPAGE_ACIER * numberBuild * eval(`gouvernementObject.${Pays.ideologie}.construction`) * batimentObject.RETOUR_POURCENTAGE);
                    numberBefore = Batiment.station_pompage;
                    numberAfter = Batiment.station_pompage - numberBuild;
                    //endregion
                    break;

                case 'Quartier':
                    //region Quartier
                    needSteel = true;
                    needWood = true;
                    needGlass = true;

                    if (numberBuild > Batiment.quartier) {
                        demolishStatus = false;
                        failReply(interaction, `Vous n'avez que ${Batiment.quartier}/${numberBuild} quartiers`);
                    }
                    gainSparePlace = batimentObject.quartier.SURFACE_QUARTIER * numberBuild;
                    gainSteel = Math.round(batimentObject.quartier.CONST_QUARTIER_ACIER * numberBuild * eval(`gouvernementObject.${Pays.ideologie}.construction`) * batimentObject.RETOUR_POURCENTAGE);
                    gainWood = Math.round(batimentObject.quartier.CONST_QUARTIER_BOIS * numberBuild * eval(`gouvernementObject.${Pays.ideologie}.construction`) * batimentObject.RETOUR_POURCENTAGE);
                    gainGlass = Math.round(batimentObject.quartier.CONST_QUARTIER_VERRE * numberBuild * eval(`gouvernementObject.${Pays.ideologie}.construction`) * batimentObject.RETOUR_POURCENTAGE);
                    numberBefore = Batiment.quartier;
                    numberAfter = Batiment.quartier - numberBuild;
                    //endregion
                    break;

                case 'Raffinerie':
                    //region Raffinerie
                    needSteel = true;

                    if (numberBuild > Batiment.raffinerie) {
                        demolishStatus = false;
                        failReply(interaction, `Vous n'avez que ${Batiment.raffinerie}/${numberBuild} raffineries`);
                    }
                    gainSparePlace = batimentObject.raffinerie.SURFACE_RAFFINERIE * numberBuild;
                    gainSteel = Math.round(batimentObject.raffinerie.CONST_RAFFINERIE_ACIER * numberBuild * eval(`gouvernementObject.${Pays.ideologie}.construction`) * batimentObject.RETOUR_POURCENTAGE);
                    numberBefore = Batiment.raffinerie;
                    numberAfter = Batiment.raffinerie - numberBuild;
                    //endregion
                    break;

                case 'Scierie':
                    //region Scierie
                    needSteel = true;
                    needWood = true;

                    if (numberBuild > Batiment.scierie) {
                        demolishStatus = false;
                        failReply(interaction, `Vous n'avez que ${Batiment.scierie}/${numberBuild} scieries`);
                    }
                    gainSparePlace = batimentObject.scierie.SURFACE_SCIERIE * numberBuild;
                    gainSteel = Math.round(batimentObject.scierie.CONST_SCIERIE_ACIER * numberBuild * eval(`gouvernementObject.${Pays.ideologie}.construction`));
                    gainWood = Math.round(batimentObject.scierie.CONST_SCIERIE_BOIS * numberBuild * eval(`gouvernementObject.${Pays.ideologie}.construction`));
                    numberBefore = Batiment.scierie;
                    numberAfter = Batiment.scierie - numberBuild;
                    //endregion
                    break;

                case 'Usine civile':
                    //region Usine civile
                    needSteel = true;
                    needWood = true;

                    if (numberBuild > Batiment.usine_civile) {
                        demolishStatus = false;
                        failReply(interaction, `Vous n'avez que ${Batiment.usine_civile}/${numberBuild} usines civile`);
                    }
                    gainSparePlace = batimentObject.usine_civile.SURFACE_USINE_CIVILE * numberBuild;
                    gainSteel = Math.round(batimentObject.usine_civile.CONST_USINE_CIVILE_ACIER * numberBuild * eval(`gouvernementObject.${Pays.ideologie}.construction`) * batimentObject.RETOUR_POURCENTAGE);
                    gainWood = Math.round(batimentObject.usine_civile.CONST_USINE_CIVILE_BOIS * numberBuild * eval(`gouvernementObject.${Pays.ideologie}.construction`) * batimentObject.RETOUR_POURCENTAGE);
                    numberBefore = Batiment.usine_civile;
                    numberAfter = Batiment.usine_civile - numberBuild;
                    //endregion
                    break;
            }

            if (demolishStatus) {
                const fields = [];

                fields.push({
                    name: `> 🏭 ${chosenBuild} :`,
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
                        url: Pays.drapeau
                    },
                    title: `\`Demolition : ${numberBuild} ${chosenBuild}\``,
                    fields: fields,
                    color: interaction.member.displayColor,
                    timestamp: new Date(),
                    footer: {
                        text: Pays.devise
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