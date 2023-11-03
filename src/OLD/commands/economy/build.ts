import {ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder, codeBlock} from 'discord.js';
import {readFileSync} from 'fs';
const gouvernementObject = JSON.parse(readFileSync('src/data/gouvernement.json', 'utf-8'));
const batimentObject = JSON.parse(readFileSync('src/data/batiment.json', 'utf-8'));

module.exports = {
    data: new SlashCommandBuilder()
        .setName('construire')
        .setDescription(`Construire un bâtiment`)
        .addStringOption(chosenBuild =>
            chosenBuild.setName('batiment')
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
        .addIntegerOption(numberBuild =>
            numberBuild.setName('nombre')
                .setDescription(`Le nombre de bâtiment(s) que vous voulez construire`)
                .setMinValue(1)
                .setRequired(true)),

    async execute(interaction: any) {
        const { connection } = require('../../index.ts');
        const chosenBuild = interaction.options.getString('batiment');
        const numberBuild = interaction.options.getInteger('nombre');

        const sql = `
            SELECT * FROM pays WHERE id_joueur='${interaction.member.id}';
            SELECT * FROM ressources WHERE id_joueur='${interaction.member.id}';
            SELECT * FROM territoire WHERE id_joueur='${interaction.member.id}';
        `;
        connection.query(sql, async(err: any, results: any[][]) => {if (err) {throw err;}
            const Pays = results[0][0];
            const Ressources = results[1][0];
            const Territoire = results[2][0];

            let needSteel: boolean = false;
            let costSteel: number = 0
            let lackSteel: boolean = false;

            let needConcrete: boolean = false;
            let costConcrete: number = 0;
            let lackConcrete: boolean = false;

            let needWood: boolean = false;
            let costWood: number = 0;
            let lackWood: boolean = false;

            let needWindTurbine: boolean = false;
            let costWindTurbine: number = 0;
            let lackWindTurbine: boolean = false;

            let needGlass: boolean = false;
            let costGlass: number = 0;
            let lackGlass: boolean = false;

            let costSparePlace: number = 0;
            let lackSparePlace: boolean = false;

            let buildStatus: boolean = true;

            switch (chosenBuild) {
                case 'Acierie':
                    //region Acierie
                    needSteel = true;
                    needConcrete = true;

                    costSparePlace = batimentObject.acierie.SURFACE_ACIERIE * numberBuild;
                    if (costSparePlace > Territoire.T_libre) {
                        buildStatus = false;
                        lackSparePlace = true;
                    }

                    costSteel = Math.round(batimentObject.acierie.CONST_ACIERIE_ACIER * numberBuild * eval(`gouvernementObject.${Pays.ideologie}.construction`));
                    if (costSteel > Ressources.acier) {
                        buildStatus = false;
                        lackSteel = true;
                    }

                    costConcrete = Math.round(batimentObject.acierie.CONST_ACIERIE_BETON * numberBuild * eval(`gouvernementObject.${Pays.ideologie}.construction`));
                    if (costConcrete > Ressources.beton) {
                        buildStatus = false;
                        lackConcrete = true;
                    }
                    //endregion
                    break;

                case 'Atelier de verre':
                    //region Atelier de verre
                    needSteel = true;
                    needConcrete = true;
                    needWood = true;

                    costSparePlace = batimentObject.atelier_verre.SURFACE_ATELIER_VERRE * numberBuild;
                    if (costSparePlace > Territoire.T_libre) {
                        buildStatus = false;
                        lackSparePlace = true;
                    }

                    costSteel = Math.round(batimentObject.atelier_verre.CONST_ATELIER_VERRE_ACIER * numberBuild * eval(`gouvernementObject.${Pays.ideologie}.construction`));
                    if (costSteel > Ressources.acier) {
                        buildStatus = false;
                        lackSteel = true;
                    }

                    costConcrete = Math.round(batimentObject.atelier_verre.CONST_ATELIER_VERRE_BETON * numberBuild * eval(`gouvernementObject.${Pays.ideologie}.construction`));
                    if (costConcrete > Ressources.beton) {
                        buildStatus = false;
                        lackConcrete = true;
                    }

                    costWood = Math.round(batimentObject.atelier_verre.CONST_ATELIER_VERRE_BOIS * numberBuild * eval(`gouvernementObject.${Pays.ideologie}.construction`));
                    if (costWood > Ressources.bois) {
                        buildStatus = false;
                        lackWood = true;
                    }
                    //endregion
                    break;

                case 'Carriere de sable':
                    //region Carriere de sable
                    needSteel = true;

                    costSparePlace = batimentObject.carriere_sable.SURFACE_CARRIERE_SABLE * numberBuild;
                    if (costSparePlace > Territoire.T_libre) {
                        buildStatus = false;
                        lackSparePlace = true;
                    }

                    costSteel = Math.round(batimentObject.carriere_sable.CONST_CARRIERE_SABLE_ACIER * numberBuild * eval(`gouvernementObject.${Pays.ideologie}.construction`));
                    if (costSteel > Ressources.acier) {
                        buildStatus = false;
                        lackSteel = true;
                    }
                    //endregion
                    break;

                case 'Centrale biomasse':
                    //region Centrale biomasse
                    needSteel = true;
                    needConcrete = true;

                    costSparePlace = batimentObject.centrale_biomasse.SURFACE_CENTRALE_BIOMASSE * numberBuild;
                    if (costSparePlace > Territoire.T_libre) {
                        buildStatus = false;
                        lackSparePlace = true;
                    }

                    costSteel = Math.round(batimentObject.centrale_biomasse.CONST_CENTRALE_BIOMASSE_ACIER * numberBuild * eval(`gouvernementObject.${Pays.ideologie}.construction`));
                    if (costSteel > Ressources.acier) {
                        buildStatus = false;
                        lackSteel = true;
                    }

                    costConcrete = Math.round(batimentObject.centrale_biomasse.CONST_CENTRALE_BIOMASSE_BETON * numberBuild * eval(`gouvernementObject.${Pays.ideologie}.construction`));
                    if (costConcrete > Ressources.beton) {
                        buildStatus = false;
                        lackConcrete = true;
                    }
                    //endregion
                    break;

                case 'Centrale au charbon':
                    //region Centrale au charbon
                    needSteel = true;
                    needConcrete = true;

                    costSparePlace = batimentObject.centrale_charbon.SURFACE_CENTRALE_CHARBON * numberBuild;
                    if (costSparePlace > Territoire.T_libre) {
                        buildStatus = false;
                        lackSparePlace = true;
                    }

                    costSteel = Math.round(batimentObject.centrale_charbon.CONST_CENTRALE_CHARBON_ACIER * numberBuild * eval(`gouvernementObject.${Pays.ideologie}.construction`));
                    if (costSteel > Ressources.acier) {
                        buildStatus = false;
                        lackSteel = true;
                    }

                    costConcrete = Math.round(batimentObject.centrale_charbon.CONST_CENTRALE_CHARBON_BETON * numberBuild * eval(`gouvernementObject.${Pays.ideologie}.construction`));
                    if (costConcrete > Ressources.beton) {
                        buildStatus = false;
                        lackConcrete = true;
                    }
                    //endregion
                    break;

                case 'Centrale au fioul':
                    //region Centrale au fioul
                    needSteel = true;
                    needConcrete = true;

                    costSparePlace = batimentObject.centrale_fioul.SURFACE_CENTRALE_FIOUL * numberBuild;
                    if (costSparePlace > Territoire.T_libre) {
                        buildStatus = false;
                        lackSparePlace = true;
                    }

                    costSteel = Math.round(batimentObject.centrale_fioul.CONST_CENTRALE_FIOUL_ACIER * numberBuild * eval(`gouvernementObject.${Pays.ideologie}.construction`));
                    if (costSteel > Ressources.acier) {
                        buildStatus = false;
                        lackSteel = true;
                    }

                    costConcrete = Math.round(batimentObject.centrale_fioul.CONST_CENTRALE_FIOUL_BETON * numberBuild * eval(`gouvernementObject.${Pays.ideologie}.construction`));
                    if (costConcrete > Ressources.beton) {
                        buildStatus = false;
                        lackConcrete = true;
                    }
                    //endregion
                    break;

                case 'Champ':
                    //region Champ
                    needSteel = true;
                    needConcrete = true;
                    needWood = true;

                    costSparePlace = batimentObject.champ.SURFACE_CHAMP * numberBuild;
                    if (costSparePlace > Territoire.T_libre) {
                        buildStatus = false;
                        lackSparePlace = true;
                    }

                    costSteel = Math.round(batimentObject.champ.CONST_CHAMP_ACIER * numberBuild * eval(`gouvernementObject.${Pays.ideologie}.construction`));
                    if (costSteel > Ressources.acier) {
                        buildStatus = false;
                        lackSteel = true;
                    }

                    costConcrete = Math.round(batimentObject.champ.CONST_CHAMP_BETON * numberBuild * eval(`gouvernementObject.${Pays.ideologie}.construction`));
                    if (costConcrete > Ressources.beton) {
                        buildStatus = false;
                        lackConcrete = true;
                    }

                    costWood = Math.round(batimentObject.champ.CONST_CHAMP_BOIS * numberBuild * eval(`gouvernementObject.${Pays.ideologie}.construction`));
                    if (costWood > Ressources.bois) {
                        buildStatus = false;
                        lackWood = true;
                    }
                    //endregion
                    break;

                case 'Champ d\'eoliennes':
                    //region Eolienne
                    needConcrete = true;
                    needWindTurbine = true;

                    costSparePlace = batimentObject.eolienne.SURFACE_EOLIENNE * numberBuild;
                    if (costSparePlace > Territoire.T_libre) {
                        buildStatus = false;
                        lackSparePlace = true;
                    }

                    costConcrete = Math.round(batimentObject.eolienne.CONST_EOLIENNE_BETON * numberBuild * eval(`gouvernementObject.${Pays.ideologie}.construction`));
                    if (costConcrete > Ressources.beton) {
                        buildStatus = false;
                        lackConcrete = true;
                    }

                    costWindTurbine = Math.round(batimentObject.eolienne.CONST_EOLIENNE_EOLIENNE * numberBuild);
                    if (costWindTurbine > Ressources.eolienne) {
                        buildStatus = false;
                        lackWindTurbine = true;
                    }
                    //endregion
                    break;

                case 'Cimenterie':
                    //region Cimenterie
                    needSteel = true;
                    needConcrete = true;

                    costSparePlace = batimentObject.cimenterie.SURFACE_CIMENTERIE * numberBuild;
                    if (costSparePlace > Territoire.T_libre) {
                        buildStatus = false;
                        lackSparePlace = true;
                    }

                    costSteel = Math.round(batimentObject.cimenterie.CONST_CIMENTERIE_ACIER * numberBuild * eval(`gouvernementObject.${Pays.ideologie}.construction`));
                    if (costSteel > Ressources.acier) {
                        buildStatus = false;
                        lackSteel = true;
                    }

                    costConcrete = Math.round(batimentObject.cimenterie.CONST_CIMENTERIE_BETON * numberBuild * eval(`gouvernementObject.${Pays.ideologie}.construction`));
                    if (costConcrete > Ressources.beton) {
                        buildStatus = false;
                        lackConcrete = true;
                    }
                    //endregion
                    break;

                case 'Derrick':
                    //region Derrick
                    needSteel = true;
                    needConcrete = true;

                    costSparePlace = batimentObject.derrick.SURFACE_DERRICK * numberBuild;
                    if (costSparePlace > Territoire.T_libre) {
                        buildStatus = false;
                        lackSparePlace = true;
                    }

                    costSteel = Math.round(batimentObject.derrick.CONST_DERRICK_ACIER * numberBuild * eval(`gouvernementObject.${Pays.ideologie}.construction`));
                    if (costSteel > Ressources.acier) {
                        buildStatus = false;
                        lackSteel = true;
                    }

                    costConcrete = Math.round(batimentObject.derrick.CONST_DERRICK_BETON * numberBuild * eval(`gouvernementObject.${Pays.ideologie}.construction`));
                    if (costConcrete > Ressources.beton) {
                        buildStatus = false;
                        lackConcrete = true;
                    }
                    //endregion
                    break;

                case 'Mine de charbon':
                    //region Mine de charbon
                    needSteel = true;
                    needConcrete = true;

                    costSparePlace = batimentObject.mine_charbon.SURFACE_MINE_CHARBON * numberBuild;
                    if (costSparePlace > Territoire.T_libre) {
                        buildStatus = false;
                        lackSparePlace = true;
                    }

                    costSteel = Math.round(batimentObject.mine_charbon.CONST_MINE_CHARBON_ACIER * numberBuild * eval(`gouvernementObject.${Pays.ideologie}.construction`));
                    if (costSteel > Ressources.acier) {
                        buildStatus = false;
                        lackSteel = true;
                    }

                    costConcrete = Math.round(batimentObject.mine_charbon.CONST_MINE_CHARBON_BETON * numberBuild * eval(`gouvernementObject.${Pays.ideologie}.construction`));
                    if (costConcrete > Ressources.beton) {
                        buildStatus = false;
                        lackConcrete = true;
                    }
                    //endregion
                    break;

                case 'Mine de metaux':
                    //region Mine de metaux
                    needSteel = true;

                    costSparePlace = batimentObject.mine_metaux.SURFACE_MINE_METAUX * numberBuild;
                    if (costSparePlace > Territoire.T_libre) {
                        buildStatus = false;
                        lackSparePlace = true;
                    }

                    costSteel = Math.round(batimentObject.mine_metaux.CONST_MINE_METAUX_ACIER * numberBuild * eval(`gouvernementObject.${Pays.ideologie}.construction`));
                    if (costSteel > Ressources.acier) {
                        buildStatus = false;
                        lackSteel = true;
                    }
                    //endregion
                    break;

                case 'Station de pompage':
                    //region Station de pompage
                    needSteel = true;
                    needConcrete = true;

                    costSparePlace = batimentObject.station_pompage.SURFACE_STATION_POMPAGE * numberBuild;
                    if (costSparePlace > Territoire.T_libre) {
                        buildStatus = false;
                        lackSparePlace = true;
                    }

                    costSteel = Math.round(batimentObject.station_pompage.CONST_STATION_POMPAGE_ACIER * numberBuild * eval(`gouvernementObject.${Pays.ideologie}.construction`));
                    if (costSteel > Ressources.acier) {
                        buildStatus = false;
                        lackSteel = true;
                    }

                    costConcrete = Math.round(batimentObject.station_pompage.CONST_STATION_POMPAGE_BETON * numberBuild * eval(`gouvernementObject.${Pays.ideologie}.construction`));
                    if (costConcrete > Ressources.beton) {
                        buildStatus = false;
                        lackConcrete = true;
                    }
                    //endregion
                    break;

                case 'Quartier':
                    //region Quartier
                    needSteel = true;
                    needConcrete = true;
                    needWood = true;
                    needGlass = true;

                    costSparePlace = batimentObject.quartier.SURFACE_QUARTIER * numberBuild;
                    if (costSparePlace > Territoire.T_libre) {
                        buildStatus = false;
                        lackSparePlace = true;
                    }

                    costSteel = Math.round(batimentObject.quartier.CONST_QUARTIER_ACIER * numberBuild * eval(`gouvernementObject.${Pays.ideologie}.construction`));
                    if (costSteel > Ressources.acier) {
                        buildStatus = false;
                        lackSteel = true;
                    }

                    costConcrete = Math.round(batimentObject.quartier.CONST_QUARTIER_BETON * numberBuild * eval(`gouvernementObject.${Pays.ideologie}.construction`));
                    if (costConcrete > Ressources.beton) {
                        buildStatus = false;
                        lackConcrete = true;
                    }

                    costWood = Math.round(batimentObject.quartier.CONST_QUARTIER_BOIS * numberBuild * eval(`gouvernementObject.${Pays.ideologie}.construction`));
                    if (costWood > Ressources.bois) {
                        buildStatus = false;
                        lackWood = true;
                    }

                    costGlass = Math.round(batimentObject.quartier.CONST_QUARTIER_VERRE * numberBuild * eval(`gouvernementObject.${Pays.ideologie}.construction`));
                    if (costGlass > Ressources.verre) {
                        buildStatus = false;
                        lackGlass = true;
                    }
                    //endregion
                    break;

                case 'Raffinerie':
                    //region Raffinerie
                    needSteel = true;
                    needConcrete = true;

                    costSparePlace = batimentObject.raffinerie.SURFACE_RAFFINERIE * numberBuild;
                    if (costSparePlace > Territoire.T_libre) {
                        buildStatus = false;
                        lackSparePlace = true;
                    }

                    costSteel = Math.round(batimentObject.raffinerie.CONST_RAFFINERIE_ACIER * numberBuild * eval(`gouvernementObject.${Pays.ideologie}.construction`));
                    if (costSteel > Ressources.acier) {
                        buildStatus = false;
                        lackSteel = true;
                    }

                    costConcrete = Math.round(batimentObject.raffinerie.CONST_RAFFINERIE_BETON * numberBuild * eval(`gouvernementObject.${Pays.ideologie}.construction`));
                    if (costConcrete > Ressources.beton) {
                        buildStatus = false;
                        lackConcrete = true;
                    }
                    //endregion
                    break;

                case 'Scierie':
                    //region Scierie
                    needSteel = true;
                    needConcrete = true;
                    needWood = true;

                    costSparePlace = batimentObject.scierie.SURFACE_SCIERIE * numberBuild;
                    if (costSparePlace > Territoire.T_libre) {
                        buildStatus = false;
                        lackSparePlace = true;
                    }

                    costSteel = Math.round(batimentObject.scierie.CONST_SCIERIE_ACIER * numberBuild * eval(`gouvernementObject.${Pays.ideologie}.construction`));
                    if (costSteel > Ressources.acier) {
                        buildStatus = false;
                        lackSteel = true;
                    }

                    costConcrete = Math.round(batimentObject.scierie.CONST_SCIERIE_BETON * numberBuild * eval(`gouvernementObject.${Pays.ideologie}.construction`));
                    if (costConcrete > Ressources.beton) {
                        buildStatus = false;
                        lackConcrete = true;
                    }

                    costWood = Math.round(batimentObject.scierie.CONST_SCIERIE_BOIS * numberBuild * eval(`gouvernementObject.${Pays.ideologie}.construction`));
                    if (costWood > Ressources.bois) {
                        buildStatus = false;
                        lackWood = true;
                    }
                    //endregion
                    break;

                case 'Usine civile':
                    //region Usine civile
                    needSteel = true;
                    needConcrete = true;
                    needWood = true;

                    costSparePlace = batimentObject.usine_civile.SURFACE_USINE_CIVILE * numberBuild;
                    if (costSparePlace > Territoire.T_libre) {
                        buildStatus = false;
                        lackSparePlace = true;
                    }

                    costSteel = Math.round(batimentObject.usine_civile.CONST_USINE_CIVILE_ACIER * numberBuild * eval(`gouvernementObject.${Pays.ideologie}.construction`));
                    if (costSteel > Ressources.acier) {
                        buildStatus = false;
                        lackSteel = true;
                    }

                    costConcrete = Math.round(batimentObject.usine_civile.CONST_USINE_CIVILE_BETON * numberBuild * eval(`gouvernementObject.${Pays.ideologie}.construction`));
                    if (costConcrete > Ressources.beton) {
                        buildStatus = false;
                        lackConcrete = true;
                    }

                    costWood = Math.round(batimentObject.usine_civile.CONST_USINE_CIVILE_BOIS * numberBuild * eval(`gouvernementObject.${Pays.ideologie}.construction`));
                    if (costWood > Ressources.bois) {
                        buildStatus = false;
                        lackWood = true;
                    }
                    //endregion
                    break;
            }

            const fields = [];
            if (lackSparePlace) {
                fields.push({
                    name: `> ⛔ Manque de terrain libre ⛔ :`,
                    value: codeBlock(`• Terrain : ${Territoire.T_libre.toLocaleString('en-US')}/${costSparePlace.toLocaleString('en-US')}\n`) + `\u200B`
                })
            } else {
                fields.push({
                    name: `> ✅ Terrain libre suffisant ✅ :`,
                    value: codeBlock(`• Terrain : ${costSparePlace.toLocaleString('en-US')}/${costSparePlace.toLocaleString('en-US')}\n`) + `\u200B`
                })
            }

            if (needSteel) {
                if (lackSteel) {
                    fields.push({
                        name: `> ⛔ Manque d'acier ⛔ :`,
                        value: codeBlock(`• Acier : ${Ressources.acier.toLocaleString('en-US')}/${costSteel.toLocaleString('en-US')}\n`) + `\u200B`
                    })
                } else {
                    fields.push({
                        name: `> ✅ Acier suffisant ✅ :`,
                        value: codeBlock(`• Acier : ${costSteel.toLocaleString('en-US')}/${costSteel.toLocaleString('en-US')}\n`) + `\u200B`
                    })
                }
            }

            if (needConcrete) {
                if (lackConcrete) {
                    fields.push({
                        name: `> ⛔ Manque de béton ⛔ :`,
                        value: codeBlock(`• Béton : ${Ressources.beton.toLocaleString('en-US')}/${costConcrete.toLocaleString('en-US')}\n`) + `\u200B`
                    })
                } else {
                    fields.push({
                        name: `> ✅ Béton suffisant ✅ :`,
                        value: codeBlock(`• Béton : ${costConcrete.toLocaleString('en-US')}/${costConcrete.toLocaleString('en-US')}\n`) + `\u200B`
                    })
                }
            }

            if (needWood) {
                if (lackWood) {
                    fields.push({
                        name: `> ⛔ Manque de bois ⛔ :`,
                        value: codeBlock(`• Bois : ${Ressources.bois.toLocaleString('en-US')}/${costWood.toLocaleString('en-US')}\n`) + `\u200B`
                    })
                } else {
                    fields.push({
                        name: `> ✅ Bois suffisant ✅ :`,
                        value: codeBlock(`• Bois : ${costWood.toLocaleString('en-US')}/${costWood.toLocaleString('en-US')}\n`) + `\u200B`
                    })
                }
            }

            if (needWindTurbine) {
                if (lackWindTurbine) {
                    fields.push({
                        name: `> ⛔ Manque d'éolienne ⛔ :`,
                        value: codeBlock(`• Eolienne : ${Ressources.eolienne.toLocaleString('en-US')}/${costWindTurbine.toLocaleString('en-US')}\n`) + `\u200B`
                    })
                } else {
                    fields.push({
                        name: `> ✅ Eolienne suffisant ✅ :`,
                        value: codeBlock(`• Eolienne : ${costWindTurbine.toLocaleString('en-US')}/${costWindTurbine.toLocaleString('en-US')}\n`) + `\u200B`
                    })
                }
            }

            if (needGlass) {
                if (lackGlass) {
                    fields.push({
                        name: `> ⛔ Manque de verre ⛔ :`,
                        value: codeBlock(`• Verre : ${Ressources.verre.toLocaleString('en-US')}/${costGlass.toLocaleString('en-US')}\n`) + `\u200B`
                    })
                } else {
                    fields.push({
                        name: `> ✅ Verre suffisant ✅ :`,
                        value: codeBlock(`• Verre : ${costGlass.toLocaleString('en-US')}/${costGlass.toLocaleString('en-US')}\n`) + `\u200B`
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
                title: `\`Construction : ${numberBuild.toLocaleString('en-US')} ${chosenBuild}\``,
                fields: fields,
                color: interaction.member.displayColor,
                timestamp: new Date(),
                footer: {
                    text: `${Pays.devise}`
                },
            };

            if (buildStatus) {
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

                await interaction.reply({ embeds: [embed], components: [row] });
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

                await interaction.reply({ embeds: [embed], components: [row] });
            }
        });
    },
};