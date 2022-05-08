const { MessageActionRow, MessageButton } = require('discord.js');
const { SlashCommandBuilder, codeBlock } = require('@discordjs/builders');
var mysql = require('mysql');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('demolir')
        .setDescription(`Démolir un bâtiment`)
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

            var demo_batiment = true
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

                if (nombre > results[0].briqueterie) {
                    var demo_batiment = false
                    var reponse = codeBlock('diff', `- Vous n'avez que ${results[0].briqueterie}/${nombre} briqueteries`);
                    await interaction.reply({ content: reponse, ephemeral: true });
                }
                var demo_T_libre = process.env.SURFACE_BRIQUETERIE * nombre;
                var demo_bois = process.env.CONST_BRIQUETERIE_BOIS * nombre * process.env.RETOUR_POURCENTAGE;
                var demo_brique = process.env.CONST_BRIQUETERIE_BRIQUE * nombre * process.env.RETOUR_POURCENTAGE;
                var demo_metaux = process.env.CONST_BRIQUETERIE_METAUX * nombre * process.env.RETOUR_POURCENTAGE;
                var avant = results[0].briqueterie;
                var après = results[0].briqueterie - nombre;

            } else if (batiment == 'Champ') {
                var need_bois = true;
                var need_brique = true;
                var need_metaux = true;

                if (nombre > results[0].champ) {
                    var demo_batiment = false
                    var reponse = codeBlock('diff', `- Vous n'avez que ${results[0].champ}/${nombre} champs`);
                    await interaction.reply({ content: reponse, ephemeral: true });
                }
                var demo_T_libre = process.env.SURFACE_CHAMP * nombre;
                var demo_bois = process.env.CONST_CHAMP_BOIS * nombre * process.env.RETOUR_POURCENTAGE;
                var demo_brique = process.env.CONST_CHAMP_BRIQUE * nombre * process.env.RETOUR_POURCENTAGE;
                var demo_metaux = process.env.CONST_CHAMP_METAUX * nombre * process.env.RETOUR_POURCENTAGE;
                var avant = results[0].champ;
                var après = results[0].champ - nombre;

            } else if (batiment == 'Mine') {
                var need_bois = true;
                var need_brique = true;
                var need_metaux = true;

                if (nombre > results[0].mine) {
                    var demo_batiment = false
                    var reponse = codeBlock('diff', `- Vous n'avez que ${results[0].mine}/${nombre} mines`);
                    await interaction.reply({ content: reponse, ephemeral: true });
                }
                var demo_T_libre = process.env.SURFACE_MINE * nombre;
                var demo_bois = process.env.CONST_MINE_BOIS * nombre * process.env.RETOUR_POURCENTAGE;
                var demo_brique = process.env.CONST_MINE_BRIQUE * nombre * process.env.RETOUR_POURCENTAGE;
                var demo_metaux = process.env.CONST_MINE_METAUX * nombre * process.env.RETOUR_POURCENTAGE;
                var avant = results[0].mine;
                var après = results[0].mine - nombre;

            } else if (batiment == 'Pompe à eau') {
                var need_bois = true;
                var need_brique = true;
                var need_metaux = true;

                if (nombre > results[0].pompe_a_eau) {
                    var demo_batiment = false
                    var reponse = codeBlock('diff', `- Vous n'avez que ${results[0].pompe_a_eau}/${nombre} pompes à eau`);
                    await interaction.reply({ content: reponse, ephemeral: true });
                }
                var demo_T_libre = process.env.SURFACE_POMPE_A_EAU * nombre;
                var demo_bois = process.env.CONST_POMPE_A_EAU_BOIS * nombre * process.env.RETOUR_POURCENTAGE;
                var demo_brique = process.env.CONST_POMPE_A_EAU_BRIQUE * nombre * process.env.RETOUR_POURCENTAGE;
                var demo_metaux = process.env.CONST_POMPE_A_EAU_METAUX * nombre * process.env.RETOUR_POURCENTAGE;
                var avant = results[0].pompe_a_eau;
                var après = results[0].pompe_a_eau - nombre;

            } else if (batiment == 'Pumpjack') {
                var need_bois = true;
                var need_brique = true;
                var need_metaux = true;

                if (nombre > results[0].pumpjack) {
                    var demo_batiment = false
                    var reponse = codeBlock('diff', `- Vous n'avez que ${results[0].pumpjack}/${nombre} pumpjacks`);
                    await interaction.reply({ content: reponse, ephemeral: true });
                }
                var demo_T_libre = process.env.SURFACE_PUMPJACK * nombre;
                var demo_bois = process.env.CONST_PUMPJACK_BOIS * nombre * process.env.RETOUR_POURCENTAGE;
                var demo_brique = process.env.CONST_PUMPJACK_BRIQUE * nombre * process.env.RETOUR_POURCENTAGE;
                var demo_metaux = process.env.CONST_PUMPJACK_METAUX * nombre * process.env.RETOUR_POURCENTAGE;
                var avant = results[0].pumpjack;
                var après = results[0].pumpjack - nombre;

            } else if (batiment == 'Scierie') {
                var need_bois = true;
                var need_brique = true;
                var need_metaux = true;

                if (nombre > results[0].scierie) {
                    var demo_batiment = false
                    var reponse = codeBlock('diff', `- Vous n'avez que ${results[0].scierie}/${nombre} scieries`);
                    await interaction.reply({ content: reponse, ephemeral: true });
                }
                var demo_T_libre = process.env.SURFACE_SCIERIE * nombre;
                var demo_bois = process.env.CONST_SCIERIE_BOIS * nombre * process.env.RETOUR_POURCENTAGE;
                var demo_brique = process.env.CONST_SCIERIE_BRIQUE * nombre * process.env.RETOUR_POURCENTAGE;
                var demo_metaux = process.env.CONST_SCIERIE_METAUX * nombre * process.env.RETOUR_POURCENTAGE;
                var avant = results[0].scierie;
                var après = results[0].scierie - nombre;

            } else if (batiment == 'Usine civile') {
                var need_bois = true;
                var need_brique = true;
                var need_metaux = true;

                if (nombre > results[0].usine_civile) {
                    var demo_batiment = false
                    var reponse = codeBlock('diff', `- Vous n'avez que ${results[0].usine_civile}/${nombre} usines civile`);
                    await interaction.reply({ content: reponse, ephemeral: true });
                }
                var demo_T_libre = process.env.SURFACE_USINE_CIVILE * nombre;
                var demo_bois = process.env.CONST_USINE_CIVILE_BOIS * nombre * process.env.RETOUR_POURCENTAGE;
                var demo_brique = process.env.CONST_USINE_CIVILE_BRIQUE * nombre * process.env.RETOUR_POURCENTAGE;
                var demo_metaux = process.env.CONST_USINE_CIVILE_METAUX * nombre * process.env.RETOUR_POURCENTAGE;
                var avant = results[0].usine_civile;
                var après = results[0].usine_civile - nombre;

            }

            if (demo_batiment == true) {
                var fields = [];

                fields.push({
                    name: `> ${batiment} :`,
                    value: `Avant : ${avant}\n` +
                        `Après : ${après}`
                })
                fields.push({
                    name: `> Terrain libre :`,
                    value: `Terrain : +${demo_T_libre}\n`
                })

                switch (true) {
                    case need_bois:
                        fields.push({
                            name: `> Bois récupéré :`,
                            value: `Bois : +${demo_bois}\n`
                        })
                    case need_brique:
                        fields.push({
                            name: `> Brique récupéré :`,
                            value: `Brique : +${demo_brique}\n`
                        })
                    case need_metaux:
                        fields.push({
                            name: `> Métaux récupéré :`,
                            value: `Métaux : +${demo_metaux}\n`
                        })
                }

                var embed = {
                    author: {
                        name: `${results[0].rang} de ${results[0].nom}`,
                        icon_url: interaction.member.displayAvatarURL()
                    },
                    thumbnail: {
                        url: `${results[0].drapeau}`
                    },
                    title: `\`Demolition : ${nombre} ${batiment}\``,
                    fields: fields,
                    color: interaction.member.displayHexColor,
                    timestamp: new Date(),
                    footer: {
                        text: `${results[0].devise}`
                    },
                }

                const row = new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                        .setLabel(`Démolir`)
                        .setEmoji(`🧨`)
                        .setCustomId(`demolition-${interaction.user.id}`)
                        .setStyle('SUCCESS'),
                    )

                await interaction.reply({ embeds: [embed], components: [row] });
            }
        });
    },
};