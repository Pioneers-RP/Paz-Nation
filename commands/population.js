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
            var sql = `
            SELECT * FROM pays WHERE id_joueur=${joueur.id}`;

            connection.query(sql, async(err, results) => {
                if (err) {
                    throw err;
                }

                if (!results[0]) {
                    var reponse = codeBlock('diff', `- Cette personne ne joue pas.`);
                    await interaction.reply({ content: reponse, ephemeral: true });
                } else {
                    densité = results[0].population / results[0].T_total;
                    densité = densité.toFixed(0);

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
                                value: codeBlock(`• ${results[0].population.toLocaleString('en-US')} habitants`) + `\u200B`
                            },
                            {
                                name: `> Approvisionnement`,
                                value: codeBlock(`• ${results[0].approvisionnement.toLocaleString('en-US')}`) + `\u200B`
                            },
                            {
                                name: `> Densité`,
                                value: codeBlock(`• ${densité.toLocaleString('en-US')} habitants/km²`) + `\u200B`
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