const { ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder, codeBlock} = require('discord.js');
const { readFileSync } = require('fs');
const gouvernementObject = JSON.parse(readFileSync('data/gouvernement.json', 'utf-8'));
const batimentObject = JSON.parse(readFileSync('data/batiment.json', 'utf-8'));

module.exports = {
    data: new SlashCommandBuilder()
        .setName('construire')
        .setDescription(`Construire un bâtiment`)
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
                    { name: `Cimenterie`, value: `Cimenterie`},
                    { name: `Derrick`, value: `Derrick`},
                    { name: `Eolienne`, value: `Eolienne`},
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
        const BatimentChoisi = interaction.options.getString('batiment');
        const nombre = interaction.options.getInteger('nombre');

        const sql = `
            SELECT * FROM pays WHERE id_joueur='${interaction.member.id}';
            SELECT * FROM ressources WHERE id_joueur='${interaction.member.id}';
            SELECT * FROM territoire WHERE id_joueur='${interaction.member.id}';
        `;
        connection.query(sql, async(err, results) => {if (err) {throw err;}
            const Pays = results[0][0];
            const Ressources = results[1][0];
            const Territoire = results[2][0];

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


            switch (BatimentChoisi) {
                case 'Acierie':
                    //region Acierie
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

                case 'Cimenterie':
                    //region Cimenterie
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

                case 'Eolienne':
                    //region Eolienne
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

                case 'Mine de charbon':
                    //region Mine de charbon
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
                        name: `> ⛔ Manque d'éolienne ⛔ :`,
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

            const embed = {
                author: {
                    name: `${Pays.rang} de ${Pays.nom}`,
                    icon_url: interaction.member.displayAvatarURL()
                },
                thumbnail: {
                    url: `${Pays.drapeau}`
                },
                title: `\`Construction : ${nombre.toLocaleString('en-US')} ${BatimentChoisi}\``,
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