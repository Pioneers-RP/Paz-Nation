const { MessageActionRow, MessageButton } = require('discord.js');
const { SlashCommandBuilder, codeBlock } = require('@discordjs/builders');

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

        var sql = `SELECT * FROM pays WHERE id_joueur='${interaction.member.id}'`;

        connection.query(sql, async(err, results) => {if (err) {throw err;}

            var batiment = interaction.options.getString('bâtiment');
            const nombre = interaction.options.getInteger('nombre');
            // if (batiment == 'Pompe_a_eau') {
            //     batiment = 'Pompe à eau'
            // } else if (batiment == 'Usine_civile') {
            //     batiment = 'Usine civile'
            // } else if (batiment == 'Centrale_elec') {
            //     batiment = 'Centrale électrique'
            // }

            var const_batiment = true
            var need_bois = false;
            var need_brique = false;
            var need_metaux = false;

            if (nombre < 1) {
                var reponse = codeBlock('diff', `- Veuillez indiquer un nombre de bâtiment positif`);
                await interaction.reply({ content: reponse, ephemeral: true });
            } else {
                switch (batiment) {
                    case 'Briqueterie':
                        var need_bois = true;
                        var need_brique = true;
                        var need_metaux = true;

                        var const_T_libre = process.env.SURFACE_BRIQUETERIE * nombre;
                        if (const_T_libre > results[0].T_libre) {
                            var const_batiment = false
                            var manque_T_libre = true
                        }

                        var const_bois = process.env.CONST_BRIQUETERIE_BOIS * nombre;
                        if (const_bois > results[0].bois) {
                            var const_batiment = false
                            var manque_bois = true
                        }

                        var const_brique = process.env.CONST_BRIQUETERIE_BRIQUE * nombre;
                        if (const_brique > results[0].brique) {
                            var const_batiment = false
                            var manque_brique = true
                        }

                        var const_metaux = process.env.CONST_BRIQUETERIE_METAUX * nombre;
                        if (const_metaux > results[0].metaux) {
                            var const_batiment = false
                            var manque_metaux = true
                        }
                        break;
                    case 'Champ':
                        var need_bois = true;
                        var need_brique = true;
                        var need_metaux = true;

                        var const_T_libre = process.env.SURFACE_CHAMP * nombre;
                        if (const_T_libre > results[0].T_libre) {
                            var const_batiment = false
                            var manque_T_libre = true
                        }

                        var const_bois = process.env.CONST_CHAMP_BOIS * nombre;
                        if (const_bois > results[0].bois) {
                            var const_batiment = false
                            var manque_bois = true
                        }

                        var const_brique = process.env.CONST_CHAMP_BRIQUE * nombre;
                        if (const_brique > results[0].brique) {
                            var const_batiment = false
                            var manque_brique = true
                        }

                        var const_metaux = process.env.CONST_CHAMP_METAUX * nombre;
                        if (const_metaux > results[0].metaux) {
                            var const_batiment = false
                            var manque_metaux = true
                        }
                        break;
                    case 'Centrale au fioul':
                        var need_bois = true;
                        var need_brique = true;
                        var need_metaux = true;

                        var const_T_libre = process.env.SURFACE_CENTRALE_FIOUL * nombre;
                        if (const_T_libre > results[0].T_libre) {
                            var const_batiment = false
                            var manque_T_libre = true
                        }

                        var const_bois = process.env.CONST_CENTRALE_FIOUL_BOIS * nombre;
                        if (const_bois > results[0].bois) {
                            var const_batiment = false
                            var manque_bois = true
                        }

                        var const_brique = process.env.CONST_CENTRALE_FIOUL_BRIQUE * nombre;
                        if (const_brique > results[0].brique) {
                            var const_batiment = false
                            var manque_brique = true
                        }

                        var const_metaux = process.env.CONST_CENTRALE_FIOUL_METAUX * nombre;
                        if (const_metaux > results[0].metaux) {
                            var const_batiment = false
                            var manque_metaux = true
                        }
                        break;
                    case 'Eolienne':
                        var need_bois = false;
                        var need_brique = false;
                        var need_metaux = true;

                        var const_T_libre = process.env.SURFACE_EOLIENNE * nombre;
                        if (const_T_libre > results[0].T_libre) {
                            var const_batiment = false
                            var manque_T_libre = true
                        }

                        var const_metaux = process.env.CONST_EOLIENNE_METAUX * nombre;
                        if (const_metaux > results[0].metaux) {
                            var const_batiment = false
                            var manque_metaux = true
                        }
                        break;
                    case 'Mine':
                        var need_bois = true;
                        var need_brique = true;
                        var need_metaux = true;

                        var const_T_libre = process.env.SURFACE_MINE * nombre;
                        if (const_T_libre > results[0].T_libre) {
                            var const_batiment = false
                            var manque_T_libre = true
                        }

                        var const_bois = process.env.CONST_MINE_BOIS * nombre;
                        if (const_bois > results[0].bois) {
                            var const_batiment = false
                            var manque_bois = true
                        }

                        var const_brique = process.env.CONST_MINE_BRIQUE * nombre;
                        if (const_brique > results[0].brique) {
                            var const_batiment = false
                            var manque_brique = true
                        }

                        var const_metaux = process.env.CONST_MINE_METAUX * nombre;
                        if (const_metaux > results[0].metaux) {
                            var const_batiment = false
                            var manque_metaux = true
                        }
                        break;
                    case 'Pompe à eau':
                        var need_bois = true;
                        var need_brique = true;
                        var need_metaux = true;

                        var const_T_libre = process.env.SURFACE_POMPE_A_EAU * nombre;
                        if (const_T_libre > results[0].T_libre) {
                            var const_batiment = false
                            var manque_T_libre = true
                        }

                        var const_bois = process.env.CONST_POMPE_A_EAU_BOIS * nombre;
                        if (const_bois > results[0].bois) {
                            var const_batiment = false
                            var manque_bois = true
                        }

                        var const_brique = process.env.CONST_POMPE_A_EAU_BRIQUE * nombre;
                        if (const_brique > results[0].brique) {
                            var const_batiment = false
                            var manque_brique = true
                        }

                        var const_metaux = process.env.CONST_POMPE_A_EAU_METAUX * nombre;
                        if (const_metaux > results[0].metaux) {
                            var const_batiment = false
                            var manque_metaux = true
                        }
                        break;
                    case 'Pumpjack':
                        var need_bois = true;
                        var need_brique = true;
                        var need_metaux = true;

                        var const_T_libre = process.env.SURFACE_PUMPJACK * nombre;
                        if (const_T_libre > results[0].T_libre) {
                            var const_batiment = false
                            var manque_T_libre = true
                        }

                        var const_bois = process.env.CONST_PUMPJACK_BOIS * nombre;
                        if (const_bois > results[0].bois) {
                            var const_batiment = false
                            var manque_bois = true
                        }

                        var const_brique = process.env.CONST_PUMPJACK_BRIQUE * nombre;
                        if (const_brique > results[0].brique) {
                            var const_batiment = false
                            var manque_brique = true
                        }

                        var const_metaux = process.env.CONST_PUMPJACK_METAUX * nombre;
                        if (const_metaux > results[0].metaux) {
                            var const_batiment = false
                            var manque_metaux = true
                        }
                        break;
                    case 'Quartier':
                        var need_bois = true;
                        var need_brique = true;
                        var need_metaux = true;

                        var const_T_libre = process.env.SURFACE_QUARTIER * nombre;
                        if (const_T_libre > results[0].T_libre) {
                            var const_batiment = false
                            var manque_T_libre = true
                        }

                        var const_bois = process.env.CONST_QUARTIER_BOIS * nombre;
                        if (const_bois > results[0].bois) {
                            var const_batiment = false
                            var manque_bois = true
                        }

                        var const_brique = process.env.CONST_QUARTIER_BRIQUE * nombre;
                        if (const_brique > results[0].brique) {
                            var const_batiment = false
                            var manque_brique = true
                        }

                        var const_metaux = process.env.CONST_QUARTIER_METAUX * nombre;
                        if (const_metaux > results[0].metaux) {
                            var const_batiment = false
                            var manque_metaux = true
                        }
                        break;
                    case 'Scierie':
                        var need_bois = true;
                        var need_brique = true;
                        var need_metaux = true;

                        var const_T_libre = process.env.SURFACE_SCIERIE * nombre;
                        if (const_T_libre > results[0].T_libre) {
                            var const_batiment = false
                            var manque_T_libre = true
                        }

                        var const_bois = process.env.CONST_SCIERIE_BOIS * nombre;
                        if (const_bois > results[0].bois) {
                            var const_batiment = false
                            var manque_bois = true
                        }

                        var const_brique = process.env.CONST_SCIERIE_BRIQUE * nombre;
                        if (const_brique > results[0].brique) {
                            var const_batiment = false
                            var manque_brique = true
                        }

                        var const_metaux = process.env.CONST_SCIERIE_METAUX * nombre;
                        if (const_metaux > results[0].metaux) {
                            var const_batiment = false
                            var manque_metaux = true
                        }
                        break;
                    case 'Usine civile':
                        var need_bois = true;
                        var need_brique = true;
                        var need_metaux = true;

                        var const_T_libre = process.env.SURFACE_USINE_CIVILE * nombre;
                        if (const_T_libre > results[0].T_libre) {
                            var const_batiment = false
                            var manque_T_libre = true
                        }

                        var const_bois = process.env.CONST_USINE_CIVILE_BOIS * nombre;
                        if (const_bois > results[0].bois) {
                            var const_batiment = false
                            var manque_bois = true
                        }

                        var const_brique = process.env.CONST_USINE_CIVILE_BRIQUE * nombre;
                        if (const_brique > results[0].brique) {
                            var const_batiment = false
                            var manque_brique = true
                        }

                        var const_metaux = process.env.CONST_USINE_CIVILE_METAUX * nombre;
                        if (const_metaux > results[0].metaux) {
                            var const_batiment = false
                            var manque_metaux = true
                        }
                        break;
                }
            }

            var fields = [];
            if (manque_T_libre == true) {
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
                    if (manque_bois == true) {
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
                    if (manque_brique == true) {
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

                    if (manque_metaux == true) {
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

            var embed = {
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
            }

            if (const_batiment == true) {
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