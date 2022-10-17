const { MessageActionRow, MessageButton } = require('discord.js');
const { SlashCommandBuilder, codeBlock } = require('@discordjs/builders');
const { readFileSync } = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('construire')
        .setDescription(`Construire un bâtiment`)
        .addStringOption(ressource =>
            ressource.setName('bâtiment')
                .setDescription(`Le type de bâtiment que vous voulez construire`)
                .addChoice(`Briqueterie`, 'Briqueterie')
                .addChoice(`Champ`, 'Champ')
                .addChoice(`Centrale au fioul`, 'Centrale au fioul')
                .addChoice(`Eolienne`, 'Eolienne')
                .addChoice(`Mine`, 'Mine')
                .addChoice(`Pompe à eau`, 'Pompe à eau')
                .addChoice(`Pumpjack`, 'Pumpjack')
                .addChoice(`Quartier`, 'Quartier')
                .addChoice(`Scierie`, 'Scierie')
                .addChoice(`Usine civile`, 'Usine civile')
                .setRequired(true))
        .addIntegerOption(nombre =>
            nombre.setName('nombre')
                .setDescription(`Le nombre de bâtiment que vous voulez construire`)
                .setRequired(true)),

    async execute(interaction) {
        const { connection } = require('../index.js');

        const sql = `SELECT * FROM pays WHERE id_joueur='${interaction.member.id}'`;

        connection.query(sql, async(err, results) => {
            let manque_metaux;
            let const_metaux;
            let manque_brique;
            let const_brique;
            let manque_bois;
            let const_bois;
            let manque_T_libre;
            let const_T_libre;
            if (err) {throw err;}

            const batiment = interaction.options.getString('bâtiment');
            const nombre = interaction.options.getInteger('nombre');
            const gouvernementObject = JSON.parse(readFileSync('data/gouvernement.json', 'utf-8'));
            const batimentObject = JSON.parse(readFileSync('data/batiment.json', 'utf-8'));

            let const_batiment = true;
            let need_bois = false;
            let need_brique = false;
            let need_metaux = false;

            if (nombre < 1) {
                const reponse = codeBlock('diff', `- Veuillez indiquer un nombre de bâtiment positif`);
                await interaction.reply({ content: reponse, ephemeral: true });
            } else {
                switch (batiment) {
                    case 'Briqueterie':
                        need_bois = true;
                        need_brique = true;
                        need_metaux = true;

                        const_T_libre = batimentObject.briqueterie.SURFACE_BRIQUETERIE * nombre;
                        if (const_T_libre > results[0].T_libre) {
                            const_batiment = false;
                            manque_T_libre = true;
                        }

                        const_bois = Math.round(batimentObject.briqueterie.CONST_BRIQUETERIE_BOIS * nombre * eval(`gouvernementObject.${results[0].ideologie}.construction`));
                        if (const_bois > results[0].bois) {
                            const_batiment = false;
                            manque_bois = true;
                        }

                        const_brique = Math.round(batimentObject.briqueterie.CONST_BRIQUETERIE_BRIQUE * nombre * eval(`gouvernementObject.${results[0].ideologie}.construction`));
                        if (const_brique > results[0].brique) {
                            const_batiment = false;
                            manque_brique = true;
                        }

                        const_metaux = Math.round(batimentObject.briqueterie.CONST_BRIQUETERIE_METAUX * nombre * eval(`gouvernementObject.${results[0].ideologie}.construction`));
                        if (const_metaux > results[0].metaux) {
                            const_batiment = false;
                            manque_metaux = true;
                        }
                        break;

                    case 'Champ':
                        need_bois = true;
                        need_brique = true;
                        need_metaux = true;

                        const_T_libre = batimentObject.champ.SURFACE_CHAMP * nombre;
                        if (const_T_libre > results[0].T_libre) {
                            const_batiment = false;
                            manque_T_libre = true;
                        }

                        const_bois = Math.round(batimentObject.champ.CONST_CHAMP_BOIS * nombre * eval(`gouvernementObject.${results[0].ideologie}.construction`));
                        if (const_bois > results[0].bois) {
                            const_batiment = false;
                            manque_bois = true;
                        }

                        const_brique = Math.round(batimentObject.champ.CONST_CHAMP_BRIQUE * nombre * eval(`gouvernementObject.${results[0].ideologie}.construction`));
                        if (const_brique > results[0].brique) {
                            const_batiment = false;
                            manque_brique = true;
                        }

                        const_metaux = Math.round(batimentObject.champ.CONST_CHAMP_METAUX * nombre * eval(`gouvernementObject.${results[0].ideologie}.construction`));
                        if (const_metaux > results[0].metaux) {
                            const_batiment = false;
                            manque_metaux = true;
                        }
                        break;

                    case 'Centrale au fioul':
                        need_bois = true;
                        need_brique = true;
                        need_metaux = true;

                        const_T_libre = batimentObject.centrale_fioul.SURFACE_CENTRALE_FIOUL * nombre;
                        if (const_T_libre > results[0].T_libre) {
                            const_batiment = false;
                            manque_T_libre = true;
                        }

                        const_bois = Math.round(batimentObject.centrale_fioul.CONST_CENTRALE_FIOUL_BOIS * nombre * eval(`gouvernementObject.${results[0].ideologie}.construction`));
                        if (const_bois > results[0].bois) {
                            const_batiment = false;
                            manque_bois = true;
                        }

                        const_brique = Math.round(batimentObject.centrale_fioul.CONST_CENTRALE_FIOUL_BRIQUE * nombre * eval(`gouvernementObject.${results[0].ideologie}.construction`));
                        if (const_brique > results[0].brique) {
                            const_batiment = false;
                            manque_brique = true;
                        }

                        const_metaux = Math.round(batimentObject.centrale_fioul.CONST_CENTRALE_FIOUL_METAUX * nombre * eval(`gouvernementObject.${results[0].ideologie}.construction`));
                        if (const_metaux > results[0].metaux) {
                            const_batiment = false;
                            manque_metaux = true;
                        }
                        break;

                    case 'Eolienne':
                        need_bois = false;
                        need_brique = false;
                        need_metaux = true;

                        const_T_libre = batimentObject.eolienne.SURFACE_EOLIENNE * nombre;
                        if (const_T_libre > results[0].T_libre) {
                            const_batiment = false;
                            manque_T_libre = true;
                        }

                        const_metaux = Math.round(batimentObject.eolienne.CONST_EOLIENNE_METAUX * nombre * eval(`gouvernementObject.${results[0].ideologie}.construction`));
                        if (const_metaux > results[0].metaux) {
                            const_batiment = false;
                            manque_metaux = true;
                        }
                        break;

                    case 'Mine':
                        need_bois = true;
                        need_brique = true;
                        need_metaux = true;

                        const_T_libre = batimentObject.mine.SURFACE_MINE * nombre;
                        if (const_T_libre > results[0].T_libre) {
                            const_batiment = false;
                            manque_T_libre = true;
                        }

                        const_bois = Math.round(batimentObject.mine.CONST_MINE_BOIS * nombre * eval(`gouvernementObject.${results[0].ideologie}.construction`));
                        if (const_bois > results[0].bois) {
                            const_batiment = false;
                            manque_bois = true;
                        }

                        const_brique = Math.round(batimentObject.mine.CONST_MINE_BRIQUE * nombre * eval(`gouvernementObject.${results[0].ideologie}.construction`));
                        if (const_brique > results[0].brique) {
                            const_batiment = false;
                            manque_brique = true;
                        }

                        const_metaux = Math.round(batimentObject.mine.CONST_MINE_METAUX * nombre * eval(`gouvernementObject.${results[0].ideologie}.construction`));
                        if (const_metaux > results[0].metaux) {
                            const_batiment = false;
                            manque_metaux = true;
                        }
                        break;

                    case 'Pompe à eau':
                        need_bois = true;
                        need_brique = true;
                        need_metaux = true;

                        const_T_libre = batimentObject.pompe_a_eau.SURFACE_POMPE_A_EAU * nombre;
                        if (const_T_libre > results[0].T_libre) {
                            const_batiment = false;
                            manque_T_libre = true;
                        }

                        const_bois = Math.round(batimentObject.pompe_a_eau.CONST_POMPE_A_EAU_BOIS * nombre * eval(`gouvernementObject.${results[0].ideologie}.construction`));
                        if (const_bois > results[0].bois) {
                            const_batiment = false;
                            manque_bois = true;
                        }

                        const_brique = Math.round(batimentObject.pompe_a_eau.CONST_POMPE_A_EAU_BRIQUE * nombre * eval(`gouvernementObject.${results[0].ideologie}.construction`));
                        if (const_brique > results[0].brique) {
                            const_batiment = false;
                            manque_brique = true;
                        }

                        const_metaux = Math.round(batimentObject.pompe_a_eau.CONST_POMPE_A_EAU_METAUX * nombre * eval(`gouvernementObject.${results[0].ideologie}.construction`));
                        if (const_metaux > results[0].metaux) {
                            const_batiment = false;
                            manque_metaux = true;
                        }
                        break;

                    case 'Pumpjack':
                        need_bois = true;
                        need_brique = true;
                        need_metaux = true;

                        const_T_libre = batimentObject.pumpjack.SURFACE_PUMPJACK * nombre;
                        if (const_T_libre > results[0].T_libre) {
                            const_batiment = false;
                            manque_T_libre = true;
                        }

                        const_bois = Math.round(batimentObject.pumpjack.CONST_PUMPJACK_BOIS * nombre * eval(`gouvernementObject.${results[0].ideologie}.construction`));
                        if (const_bois > results[0].bois) {
                            const_batiment = false;
                            manque_bois = true;
                        }

                        const_brique = Math.round(batimentObject.pumpjack.CONST_PUMPJACK_BRIQUE * nombre * eval(`gouvernementObject.${results[0].ideologie}.construction`));
                        if (const_brique > results[0].brique) {
                            const_batiment = false;
                            manque_brique = true;
                        }

                        const_metaux = Math.round(batimentObject.pumpjack.CONST_PUMPJACK_METAUX * nombre * eval(`gouvernementObject.${results[0].ideologie}.construction`));
                        if (const_metaux > results[0].metaux) {
                            const_batiment = false;
                            manque_metaux = true;
                        }
                        break;

                    case 'Quartier':
                        need_bois = true;
                        need_brique = true;
                        need_metaux = true;

                        const_T_libre = batimentObject.quartier.SURFACE_QUARTIER * nombre;
                        if (const_T_libre > results[0].T_libre) {
                            const_batiment = false;
                            manque_T_libre = true;
                        }

                        const_bois = Math.round(batimentObject.quartier.CONST_QUARTIER_BOIS * nombre * eval(`gouvernementObject.${results[0].ideologie}.construction`));
                        if (const_bois > results[0].bois) {
                            const_batiment = false;
                            manque_bois = true;
                        }

                        const_brique = Math.round(batimentObject.quartier.CONST_QUARTIER_BRIQUE * nombre * eval(`gouvernementObject.${results[0].ideologie}.construction`));
                        if (const_brique > results[0].brique) {
                            const_batiment = false;
                            manque_brique = true;
                        }

                        const_metaux = Math.round(batimentObject.quartier.CONST_QUARTIER_METAUX * nombre * eval(`gouvernementObject.${results[0].ideologie}.construction`));
                        if (const_metaux > results[0].metaux) {
                            const_batiment = false;
                            manque_metaux = true;
                        }
                        break;

                    case 'Scierie':
                        need_bois = true;
                        need_brique = true;
                        need_metaux = true;

                        const_T_libre = batimentObject.scierie.SURFACE_SCIERIE * nombre;
                        if (const_T_libre > results[0].T_libre) {
                            const_batiment = false;
                            manque_T_libre = true;
                        }

                        const_bois = Math.round(batimentObject.scierie.CONST_SCIERIE_BOIS * nombre * eval(`gouvernementObject.${results[0].ideologie}.construction`));
                        if (const_bois > results[0].bois) {
                            const_batiment = false;
                            manque_bois = true;
                        }

                        const_brique = Math.round(batimentObject.scierie.CONST_SCIERIE_BRIQUE * nombre * eval(`gouvernementObject.${results[0].ideologie}.construction`));
                        if (const_brique > results[0].brique) {
                            const_batiment = false;
                            manque_brique = true;
                        }

                        const_metaux = Math.round(batimentObject.scierie.CONST_SCIERIE_METAUX * nombre * eval(`gouvernementObject.${results[0].ideologie}.construction`));
                        if (const_metaux > results[0].metaux) {
                            const_batiment = false;
                            manque_metaux = true;
                        }
                        break;

                    case 'Usine civile':
                        need_bois = true;
                        need_brique = true;
                        need_metaux = true;

                        const_T_libre = batimentObject.usine_civile.SURFACE_USINE_CIVILE * nombre;
                        if (const_T_libre > results[0].T_libre) {
                            const_batiment = false;
                            manque_T_libre = true;
                        }

                        const_bois = Math.round(batimentObject.usine_civile.CONST_USINE_CIVILE_BOIS * nombre * eval(`gouvernementObject.${results[0].ideologie}.construction`));
                        if (const_bois > results[0].bois) {
                            const_batiment = false;
                            manque_bois = true;
                        }

                        const_brique = Math.round(batimentObject.usine_civile.CONST_USINE_CIVILE_BRIQUE * nombre * eval(`gouvernementObject.${results[0].ideologie}.construction`));
                        if (const_brique > results[0].brique) {
                            const_batiment = false;
                            manque_brique = true;
                        }

                        const_metaux = Math.round(batimentObject.usine_civile.CONST_USINE_CIVILE_METAUX * nombre * eval(`gouvernementObject.${results[0].ideologie}.construction`));
                        if (const_metaux > results[0].metaux) {
                            const_batiment = false;
                            manque_metaux = true;
                        }
                        break;
                }
            }

            const fields = [];
            if (manque_T_libre === true) {
                fields.push({
                    name: `> ⛔ Manque de terrain libre ⛔ :`,
                    value: codeBlock(`• Terrain : ${results[0].T_libre.toLocaleString('en-US')}/${const_T_libre.toLocaleString('en-US')}\n`) + `\u200B`
                })
            } else {
                fields.push({
                    name: `> ✅ Terrain libre suffisant ✅ :`,
                    value: codeBlock(`• Terrain : ${const_T_libre.toLocaleString('en-US')}/${const_T_libre.toLocaleString('en-US')}\n`) + `\u200B`
                })
            }

            switch (true) {
                case need_bois:
                    if (manque_bois === true) {
                        fields.push({
                            name: `> ⛔ Manque de bois ⛔ :`,
                            value: codeBlock(`• Bois : ${results[0].bois.toLocaleString('en-US')}/${const_bois.toLocaleString('en-US')}\n`) + `\u200B`
                        })
                    } else {
                        fields.push({
                            name: `> ✅ Bois suffisant ✅ :`,
                            value: codeBlock(`• Bois : ${const_bois.toLocaleString('en-US')}/${const_bois.toLocaleString('en-US')}\n`) + `\u200B`
                        })
                    }
                case need_brique:
                    if (manque_brique === true) {
                        fields.push({
                            name: `> ⛔ Manque de brique ⛔ :`,
                            value: codeBlock(`• Brique : ${results[0].brique.toLocaleString('en-US')}/${const_brique.toLocaleString('en-US')}\n`) + `\u200B`
                        })
                    } else {
                        fields.push({
                            name: `> ✅ Brique suffisante ✅ :`,
                            value: codeBlock(`• Brique : ${const_brique.toLocaleString('en-US')}/${const_brique.toLocaleString('en-US')}\n`) + `\u200B`
                        })
                    }
                case need_metaux:
                    if (manque_metaux === true) {
                        fields.push({
                            name: `> ⛔ Manque de métaux ⛔ :`,
                            value: codeBlock(`• Métaux : ${results[0].metaux.toLocaleString('en-US')}/${const_metaux.toLocaleString('en-US')}\n`) + `\u200B`
                        })
                    } else {
                        fields.push({
                            name: `> ✅ Métaux suffisant ✅ :`,
                            value: codeBlock(`• Métaux : ${const_metaux.toLocaleString('en-US')}/${const_metaux.toLocaleString('en-US')}\n`) + `\u200B`
                        })
                    }
            }

            const embed = {
                author: {
                    name: `${results[0].rang} de ${results[0].nom}`,
                    icon_url: interaction.member.displayAvatarURL()
                },
                thumbnail: {
                    url: `${results[0].drapeau}`
                },
                title: `\`Construction : ${nombre} ${batiment}\``,
                fields: fields,
                color: interaction.member.displayHexColor,
                timestamp: new Date(),
                footer: {
                    text: `${results[0].devise}`
                },
            };

            if (const_batiment === true) {
                const row = new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setLabel(`Construire`)
                            .setEmoji(`🛠️`)
                            .setCustomId(`construction-${interaction.user.id}`)
                            .setStyle('SUCCESS'),
                    )
                    .addComponents(
                        new MessageButton()
                            .setLabel(`Refuser`)
                            .setEmoji(`✋`)
                            .setCustomId(`refuser-${interaction.user.id}`)
                            .setStyle('DANGER'),
                    )

                await interaction.reply({ embeds: [embed], components: [row] });
            } else {

                const row = new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setLabel(`Construire`)
                            .setEmoji(`🛠️`)
                            .setCustomId(`construction`)
                            .setStyle('DANGER')
                            .setDisabled(true)
                    )
                    .addComponents(
                        new MessageButton()
                            .setLabel(`Refuser`)
                            .setEmoji(`✋`)
                            .setCustomId(`refuser-${interaction.user.id}`)
                            .setStyle('DANGER'),
                    )

                await interaction.reply({ embeds: [embed], components: [row] });
            }
        });
    },
};