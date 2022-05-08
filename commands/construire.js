const { MessageActionRow, MessageButton } = require('discord.js');
const { SlashCommandBuilder, codeBlock } = require('@discordjs/builders');
var mysql = require('mysql');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('construire')
        .setDescription(`Construire un bâtiment`)
        .addStringOption(ressource =>
            ressource.setName('bâtiment')
            .setDescription(`Le type de bâtiment que vous voulez construire`)
            .addChoice(`Briqueterie`, 'Briqueterie')
            .addChoice(`Champ`, 'Champ')
            .addChoice(`Mine`, 'Mine')
            .addChoice(`Pompe à eau`, 'Pompe_a_eau')
            .addChoice(`Pumpjack`, 'Pumpjack')
            .addChoice(`Scierie`, 'Scierie')
            .addChoice(`Usine civile`, 'Usine_civile')
            .setRequired(true))
        .addIntegerOption(nombre =>
            nombre.setName('nombre')
            .setDescription(`Le nombre de bâtiment que vous voulez construire`)
            .setRequired(true)),

    async execute(interaction) {

        const connection = new mysql.createConnection({
            host: 'eu01-sql.pebblehost.com',
            user: 'customer_260507_paznation',
            password: 'lidmGbk8edPkKXv1#ZO',
            database: 'customer_260507_paznation',
            multipleStatements: true
        })

        var sql = `
        SELECT * FROM pays WHERE id_joueur='${interaction.member.id}'`;

        connection.query(sql, async(err, results) => {
            if (err) {
                throw err;
            }

            var batiment = interaction.options.getString('bâtiment');
            const nombre = interaction.options.getInteger('nombre');
            if (batiment == 'Pompe_a_eau') {
                batiment = 'Pompe à eau'
            } else if (batiment == 'Usine_civile') {
                batiment = 'Usine civile'
            }

            var const_batiment = true
            var need_bois = false;
            var need_brique = false;
            var need_metaux = false;

            if (nombre < 1) {
                var reponse = codeBlock('diff', `- Veuillez indiquer un nombre de bâtiment positif`);
                await interaction.reply({ content: reponse, ephemeral: true });
            } else if (batiment == 'Briqueterie') {
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
            } else if (batiment == 'Champ') {
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
            } else if (batiment == 'Mine') {
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
            } else if (batiment == 'Pompe à eau') {
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
            } else if (batiment == 'Pumpjack') {
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
            } else if (batiment == 'Scierie') {
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
            } else if (batiment == 'Usine civile') {
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
            }

            var fields = [];
            if (manque_T_libre == true) {
                fields.push({
                    name: `> ⛔ Manque de terrain libre ⛔ :`,
                    value: `Terrain : ${results[0].T_libre}/${const_T_libre}\n`
                })
            } else {
                fields.push({
                    name: `> ✅ Terrain libre suffisant ✅ :`,
                    value: `Terrain : ${const_T_libre}/${const_T_libre}\n`
                })
            }

            switch (true) {
                case need_bois:
                    if (manque_bois == true) {
                        fields.push({
                            name: `> ⛔ Manque de bois ⛔ :`,
                            value: `Bois : ${results[0].bois}/${const_bois}\n`
                        })
                    } else {
                        fields.push({
                            name: `> ✅ Bois suffisant ✅ :`,
                            value: `Bois : ${const_bois}/${const_bois}\n`
                        })
                    }
                case need_brique:
                    if (manque_brique == true) {
                        fields.push({
                            name: `> ⛔ Manque de brique ⛔ :`,
                            value: `Brique : ${results[0].brique}/${const_brique}\n`
                        })
                    } else {
                        fields.push({
                            name: `> ✅ Brique suffisante ✅ :`,
                            value: `Brique : ${const_brique}/${const_brique}\n`
                        })
                    }
                case need_metaux:

                    if (manque_metaux == true) {
                        fields.push({
                            name: `> ⛔ Manque de métaux ⛔ :`,
                            value: `Métaux : ${results[0].metaux}/${const_metaux}\n`
                        })
                    } else {
                        fields.push({
                            name: `> ✅ Métaux suffisant ✅ :`,
                            value: `Métaux : ${const_metaux}/${const_metaux}\n`
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

                await interaction.reply({ embeds: [embed], components: [row] });
            }
        });
    },
};