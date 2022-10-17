const { MessageActionRow, MessageButton } = require('discord.js');
const { SlashCommandBuilder, codeBlock } = require('@discordjs/builders');
const { readFileSync } = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('demolir')
        .setDescription(`Démolir un bâtiment`)
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
            let apres;
            let avant;
            let demo_metaux;
            let demo_brique;
            let demo_bois;
            let demo_T_libre;
            let reponse;
            if (err) {throw err;}

            const batiment = interaction.options.getString('bâtiment');
            const nombre = interaction.options.getInteger('nombre');
            const batimentObject = JSON.parse(readFileSync('data/batiment.json', 'utf-8'));

            let demo_batiment = true;
            let need_bois = false;
            let need_brique = false;
            let need_metaux = false;

            if (nombre < 1) {
                reponse = codeBlock('diff', `- Veuillez indiquer un nombre de bâtiment positif`);
                await interaction.reply({ content: reponse, ephemeral: true });
            } else if (batiment == 'Briqueterie') {
                need_bois = true;
                need_brique = true;
                need_metaux = true;

                if (nombre > results[0].briqueterie) {
                    demo_batiment = false;
                    reponse = codeBlock('diff', `- Vous n'avez que ${results[0].briqueterie}/${nombre} briqueteries`);
                    await interaction.reply({ content: reponse, ephemeral: true });
                }
                demo_T_libre = batimentObject.briqueterie.SURFACE_BRIQUETERIE * nombre;
                demo_bois = batimentObject.briqueterie.CONST_BRIQUETERIE_BOIS * nombre * batimentObject.RETOUR_POURCENTAGE;
                demo_brique = batimentObject.briqueterie.CONST_BRIQUETERIE_BRIQUE * nombre * batimentObject.RETOUR_POURCENTAGE;
                demo_metaux = batimentObject.briqueterie.CONST_BRIQUETERIE_METAUX * nombre * batimentObject.RETOUR_POURCENTAGE;
                avant = results[0].briqueterie;
                apres = results[0].briqueterie - nombre;

            } else if (batiment == 'Champ') {
                need_bois = true;
                need_brique = true;
                need_metaux = true;

                if (nombre > results[0].champ) {
                    demo_batiment = false;
                    reponse = codeBlock('diff', `- Vous n'avez que ${results[0].champ.toLocaleString('en-US')}/${nombre.toLocaleString('en-US')} champs`);
                    await interaction.reply({ content: reponse, ephemeral: true });
                }
                demo_T_libre = batimentObject.champ.SURFACE_CHAMP * nombre;
                demo_bois = batimentObject.champ.CONST_CHAMP_BOIS * nombre * batimentObject.RETOUR_POURCENTAGE;
                demo_brique = batimentObject.champ.CONST_CHAMP_BRIQUE * nombre * batimentObject.RETOUR_POURCENTAGE;
                demo_metaux = batimentObject.champ.CONST_CHAMP_METAUX * nombre * batimentObject.RETOUR_POURCENTAGE;
                avant = results[0].champ;
                apres = results[0].champ - nombre;

            } else if (batiment == 'Centrale au fioul') {
                need_bois = true;
                need_brique = true;
                need_metaux = true;

                if (nombre > results[0].centrale_fioul) {
                    demo_batiment = false;
                    reponse = codeBlock('diff', `- Vous n'avez que ${results[0].centrale_fioul.toLocaleString('en-US')}/${nombre.toLocaleString('en-US')} centrales au fioul`);
                    await interaction.reply({ content: reponse, ephemeral: true });
                }
                demo_T_libre = batimentObject.centrale_fioul.SURFACE_CENTRALE_FIOUL * nombre;
                demo_bois = batimentObject.centrale_fioul.CONST_CENTRALE_FIOUL_BOIS * nombre * batimentObject.RETOUR_POURCENTAGE;
                demo_brique = batimentObject.centrale_fioul.CONST_CENTRALE_FIOUL_BRIQUE * nombre * batimentObject.RETOUR_POURCENTAGE;
                demo_metaux = batimentObject.centrale_fioul.CONST_CENTRALE_FIOUL_METAUX * nombre * batimentObject.RETOUR_POURCENTAGE;
                avant = results[0].centrale_fioul;
                apres = results[0].centrale_fioul - nombre;

            } else if (batiment == 'Eolienne') {
                need_bois = false;
                need_brique = false;
                need_metaux = true;

                if (nombre > results[0].eolienne) {
                    demo_batiment = false;
                    reponse = codeBlock('diff', `- Vous n'avez que ${results[0].centrale_elec.toLocaleString('en-US')}/${nombre.toLocaleString('en-US')} éoliennes`);
                    await interaction.reply({ content: reponse, ephemeral: true });
                }
                demo_T_libre = batimentObject.eolienne.SURFACE_EOLIENNE * nombre;
                demo_metaux = batimentObject.eolienne.CONST_EOLIENNE_METAUX * nombre * batimentObject.RETOUR_POURCENTAGE;
                avant = results[0].eolienne;
                apres = results[0].eolienne - nombre;

            } else if (batiment == 'Mine') {
                need_bois = true;
                need_brique = true;
                need_metaux = true;

                if (nombre > results[0].mine) {
                    demo_batiment = false;
                    reponse = codeBlock('diff', `- Vous n'avez que ${results[0].mine.toLocaleString('en-US')}/${nombre.toLocaleString('en-US')} mines`);
                    await interaction.reply({ content: reponse, ephemeral: true });
                }
                demo_T_libre = batimentObject.mine.SURFACE_MINE * nombre;
                demo_bois = batimentObject.mine.CONST_MINE_BOIS * nombre * batimentObject.RETOUR_POURCENTAGE;
                demo_brique = batimentObject.mine.CONST_MINE_BRIQUE * nombre * batimentObject.RETOUR_POURCENTAGE;
                demo_metaux = batimentObject.mine.CONST_MINE_METAUX * nombre * batimentObject.RETOUR_POURCENTAGE;
                avant = results[0].mine;
                apres = results[0].mine - nombre;

            } else if (batiment == 'Pompe à eau') {
                need_bois = true;
                need_brique = true;
                need_metaux = true;

                if (nombre > results[0].pompe_a_eau) {
                    demo_batiment = false;
                    reponse = codeBlock('diff', `- Vous n'avez que ${results[0].pompe_a_eau.toLocaleString('en-US')}/${nombre.toLocaleString('en-US')} pompes à eau`);
                    await interaction.reply({ content: reponse, ephemeral: true });
                }
                demo_T_libre = batimentObject.pompe_a_eau.SURFACE_POMPE_A_EAU * nombre;
                demo_bois = batimentObject.pompe_a_eau.CONST_POMPE_A_EAU_BOIS * nombre * batimentObject.RETOUR_POURCENTAGE;
                demo_brique = batimentObject.pompe_a_eau.CONST_POMPE_A_EAU_BRIQUE * nombre * batimentObject.RETOUR_POURCENTAGE;
                demo_metaux = batimentObject.pompe_a_eau.CONST_POMPE_A_EAU_METAUX * nombre * batimentObject.RETOUR_POURCENTAGE;
                avant = results[0].pompe_a_eau;
                apres = results[0].pompe_a_eau - nombre;

            } else if (batiment == 'Pumpjack') {
                need_bois = true;
                need_brique = true;
                need_metaux = true;

                if (nombre > results[0].pumpjack) {
                    demo_batiment = false;
                    reponse = codeBlock('diff', `- Vous n'avez que ${results[0].pumpjack.toLocaleString('en-US')}/${nombre.toLocaleString('en-US')} pumpjacks`);
                    await interaction.reply({ content: reponse, ephemeral: true });
                }
                demo_T_libre = batimentObject.pumpjack.SURFACE_PUMPJACK * nombre;
                demo_bois = batimentObject.pumpjack.CONST_PUMPJACK_BOIS * nombre * batimentObject.RETOUR_POURCENTAGE;
                demo_brique = batimentObject.pumpjack.CONST_PUMPJACK_BRIQUE * nombre * batimentObject.RETOUR_POURCENTAGE;
                demo_metaux = batimentObject.pumpjack.CONST_PUMPJACK_METAUX * nombre * batimentObject.RETOUR_POURCENTAGE;
                avant = results[0].pumpjack;
                apres = results[0].pumpjack - nombre;

            } else if (batiment == 'Quartier') {
                need_bois = true;
                need_brique = true;
                need_metaux = true;

                if (nombre > results[0].quartier) {
                    demo_batiment = false;
                    reponse = codeBlock('diff', `- Vous n'avez que ${results[0].quartier.toLocaleString('en-US')}/${nombre.toLocaleString('en-US')} quartiers`);
                    await interaction.reply({ content: reponse, ephemeral: true });
                }
                demo_T_libre = batimentObject.quartier.SURFACE_QUARTIER * nombre;
                demo_bois = batimentObject.quartier.CONST_QUARTIER_BOIS * nombre * batimentObject.RETOUR_POURCENTAGE;
                demo_brique = batimentObject.quartier.CONST_QUARTIER_BRIQUE * nombre * batimentObject.RETOUR_POURCENTAGE;
                demo_metaux = batimentObject.quartier.CONST_QUARTIER_METAUX * nombre * batimentObject.RETOUR_POURCENTAGE;
                avant = results[0].quartier;
                apres = results[0].quartier - nombre;

            } else if (batiment == 'Scierie') {
                need_bois = true;
                need_brique = true;
                need_metaux = true;

                if (nombre > results[0].scierie) {
                    demo_batiment = false;
                    reponse = codeBlock('diff', `- Vous n'avez que ${results[0].scierie.toLocaleString('en-US')}/${nombre.toLocaleString('en-US')} scieries`);
                    await interaction.reply({ content: reponse, ephemeral: true });
                }
                demo_T_libre = batimentObject.scierie.SURFACE_SCIERIE * nombre;
                demo_bois = batimentObject.scierie.CONST_SCIERIE_BOIS * nombre * batimentObject.RETOUR_POURCENTAGE;
                demo_brique = batimentObject.scierie.CONST_SCIERIE_BRIQUE * nombre * batimentObject.RETOUR_POURCENTAGE;
                demo_metaux = batimentObject.scierie.CONST_SCIERIE_METAUX * nombre * batimentObject.RETOUR_POURCENTAGE;
                avant = results[0].scierie;
                apres = results[0].scierie - nombre;

            } else if (batiment == 'Usine civile') {
                need_bois = true;
                need_brique = true;
                need_metaux = true;

                if (nombre > results[0].usine_civile) {
                    demo_batiment = false;
                    reponse = codeBlock('diff', `- Vous n'avez que ${results[0].usine_civile.toLocaleString('en-US')}/${nombre.toLocaleString('en-US')} usines civile`);
                    await interaction.reply({ content: reponse, ephemeral: true });
                }
                demo_T_libre = batimentObject.usine_civile.SURFACE_USINE_CIVILE * nombre;
                demo_bois = batimentObject.usine_civile.CONST_USINE_CIVILE_BOIS * nombre * batimentObject.RETOUR_POURCENTAGE;
                demo_brique = batimentObject.usine_civile.CONST_USINE_CIVILE_BRIQUE * nombre * batimentObject.RETOUR_POURCENTAGE;
                demo_metaux = batimentObject.usine_civile.CONST_USINE_CIVILE_METAUX * nombre * batimentObject.RETOUR_POURCENTAGE;
                avant = results[0].usine_civile;
                apres = results[0].usine_civile - nombre;

            }

            if (demo_batiment == true) {
                var fields = [];

                fields.push({
                    name: `> ${batiment} :`,
                    value: codeBlock(`• Avant : ${avant.toLocaleString('en-US')}\n• Après : ${apres.toLocaleString('en-US')}`) + `\u200B`
                })
                fields.push({
                    name: `> Terrain libre :`,
                    value: codeBlock(`• Terrain : +${demo_T_libre.toLocaleString('en-US')}\n`) + `\u200B`
                })

                switch (true) {
                    case need_bois:
                        fields.push({
                            name: `> Bois récupéré :`,
                            value: codeBlock(`• Bois : +${Math.round(demo_bois).toLocaleString('en-US')}`) + `\u200B`
                        })
                    case need_brique:
                        fields.push({
                            name: `> Brique récupéré :`,
                            value: codeBlock(`• Brique : +${Math.round(demo_brique).toLocaleString('en-US')}`) + `\u200B`
                        })
                    case need_metaux:
                        fields.push({
                            name: `> Métaux récupéré :`,
                            value: codeBlock(`• Métaux : +${Math.round(demo_metaux).toLocaleString('en-US')}`) + `\u200B`
                        })
                }

                const embed = {
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
                };

                const row = new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setLabel(`Démolir`)
                            .setEmoji(`🧨`)
                            .setCustomId(`demolition-${interaction.user.id}`)
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
            }
        });
    },
};