const { SlashCommandBuilder, codeBlock } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('population')
        .setDescription(`Menu de votre population`)
        .addUserOption(user =>
            user.setName('joueur')
            .setDescription(`Le joueur dont vous voulez voir l'économie`)),

    async execute(interaction) {
        const { connection } = require('../index.js');
        var joueur = interaction.options.getUser('joueur');

        if (!joueur) {
            var joueur = interaction.member;
        };

        function population(joueur) {
            var sql = `SELECT * FROM pays WHERE id_joueur=${joueur.id}`;
            connection.query(sql, async(err, results) => {if (err) {throw err;}

                if (!results[0]) {
                    var reponse = codeBlock('diff', `- Cette personne ne joue pas.`);
                    await interaction.reply({ content: reponse, ephemeral: true });
                } else {
                    densité = results[0].population / results[0].T_total;
                    densité = densité.toFixed(0);
                    const gouvernementObject = JSON.parse(readFileSync('data/gouvernement.json', 'utf-8'));

                    const embed = {
                        author: {
                            name: `${results[0].rang} de ${results[0].nom}`,
                            icon_url: joueur.displayAvatarURL()
                        },
                        thumbnail: {
                            url: `${results[0].drapeau}`
                        },
                        title: `\`Vue globale de la population\``,
                        fields: [{
                                name: `> 👪 Population`,
                                value: codeBlock(
                                    `• ${results[0].population.toLocaleString('en-US')} habitants\n` +
                                    `• ${results[0].bonheur}% bonheur\n` +
                                    `• ${densité.toLocaleString('en-US')} habitants/km²`) + `\u200B`
                            },
                            {
                                name: `> 🛒 Consommation/Approvisionnement`,
                                value: codeBlock(
                                    `• ${Math.round((results[0].population * parseFloat(process.env.EAU_CONSO))).toLocaleString('en-US')}/${results[0].eau_appro.toLocaleString('en-US')} eau\n` +
                                    `• ${Math.round((results[0].population * parseFloat(process.env.NOURRITURE_CONSO))).toLocaleString('en-US')}/${results[0].nourriture_appro.toLocaleString('en-US')} nourriture\n` +
                                    `• ${((1 + results[0].bc_acces * 0.04 + results[0].bonheur * 0.016 + (results[0].population / 10000000) * 0.04) * eval(`gouvernementObject.${value.ideologie}.conso_bc`)).toFixed(1)}/${((process.env.PROD_USINE_CIVILE * results[0].usine_civile * 48 * eval(`gouvernementObject.${value.ideologie}.production`)) / results[0].population).toFixed(1)} biens de consommation`) + `\u200B`
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
                };
            });
        };

        population(joueur);
    },
};