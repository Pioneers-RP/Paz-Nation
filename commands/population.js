const { SlashCommandBuilder, codeBlock } = require('@discordjs/builders');
const { readFileSync } = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('population')
        .setDescription(`Menu de votre population`)
        .addUserOption(user =>
            user.setName('joueur')
                .setDescription(`Le joueur dont vous voulez voir l'économie`)),

    async execute(interaction) {
        const { connection } = require('../index.js');
        let joueur = interaction.options.getUser('joueur');

        if (!joueur) {
            joueur = interaction.member;
        }

        function population(joueur) {
            const sql = `SELECT * FROM pays WHERE id_joueur='${joueur.id}'`;
            connection.query(sql, async(err, results) => {if (err) {throw err;}

                if (!results[0]) {
                    const reponse = codeBlock('diff', `- Cette personne ne joue pas.`);
                    await interaction.reply({ content: reponse, ephemeral: true });
                } else {
                    const habitants = results[0].enfant + results[0].jeune + results[0].adulte + results[0].vieux;
                    const densite = (habitants / results[0].T_total).toFixed(0);
                    const populationObject = JSON.parse(readFileSync('data/population.json', 'utf-8'));
                    const batimentObject = JSON.parse(readFileSync('data/batiment.json', 'utf-8'));

                    const embed = {
                        author: {
                            name: `${results[0].rang} de ${results[0].nom}`,
                            icon_url: joueur.displayAvatarURL()
                        },
                        thumbnail: {
                            url: results[0].drapeau
                        },
                        title: `\`Vue globale de la population\``,
                        fields: [{
                            name: `> 👪 Population`,
                            value: codeBlock(
                                `• ${habitants.toLocaleString('en-US')} habitants\n` +
                                `• ${results[0].bonheur}% bonheur\n` +
                                `• ${densite.toLocaleString('en-US')} habitants/km²`) + `\u200B`
                        },
                            {
                                name: `> 🛒 Consommation/Approvisionnement`,
                                value: codeBlock(
                                    `• ${Math.round((habitants * parseFloat(populationObject.EAU_CONSO))).toLocaleString('en-US')}/${results[0].eau_appro.toLocaleString('en-US')} eau\n` +
                                    `• ${Math.round((habitants * parseFloat(populationObject.NOURRITURE_CONSO))).toLocaleString('en-US')}/${results[0].nourriture_appro.toLocaleString('en-US')} nourriture\n` +
                                    `• ${(1 + results[0].bc_acces * 0.04 + results[0].bonheur * 0.016 + (habitants / 10000000) * 0.04).toFixed(1)}/${(batimentObject.usine_civile.PROD_USINE_CIVILE * results[0].usine_civile * 48 / habitants).toFixed(1)} biens de consommation`) + `\u200B`
                            },
                            {
                                name: `> 🧎 Répartion`,
                                value: codeBlock(
                                    `• ${results[0].enfant.toLocaleString('en-US')} enfants\n` +
                                    `• ${results[0].jeune.toLocaleString('en-US')} jeunes\n` +
                                    `• ${results[0].adulte.toLocaleString('en-US')} adultes\n` +
                                    `• ${results[0].vieux.toLocaleString('en-US')} vieux\n`) + `\u200B`
                            },
                            {
                                name: `> 🏘️ Batiments`,
                                value: codeBlock(
                                    `• ${results[0].quartier.toLocaleString('en-US')} quartiers`) + `\u200B`
                            }
                        ],
                        color: joueur.displayHexColor,
                        timestamp: new Date(),
                        footer: {
                            text: `${results[0].devise}`
                        },
                    };

                    await interaction.reply({ embeds: [embed] });
                }
            });
        }

        population(joueur);
    },
};