const { SlashCommandBuilder, codeBlock } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('gouv')
        .setDescription(`Menu du gouvernement`)
        .addUserOption(user =>
            user.setName('joueur')
            .setDescription(`Le joueur dont vous voulez voir l'économie`)),

    async execute(interaction) {
        const { connection } = require('../index.js');
        var joueur = interaction.options.getUser('joueur');

        if (!joueur) {
            var joueur = interaction.member;
        };

        function gouv(joueur) {
            var sql = `SELECT * FROM pays WHERE id_joueur='${joueur.id}'`;
            connection.query(sql, async(err, results) => {if (err) {throw err;}

                if (!results[0]) {
                    var reponse = codeBlock('diff', `- Cette personne ne joue pas.`);
                    await interaction.reply({ content: reponse, ephemeral: true });
                } else {

                    const embed = {
                        author: {
                            name: `${results[0].rang} de ${results[0].nom}`,
                            icon_url: joueur.displayAvatarURL()
                        },
                        thumbnail: {
                            url: `${results[0].drapeau}`
                        },
                        title: `\`Menu du gouvernement\``,
                        fields: [{
                                name: `> 🪧 Nom de l'Etat : `,
                                value: codeBlock(`• ${results[0].nom}`) + `\u200B`
                            },
                            {
                                name: `> ®️ Rang : `,
                                value: codeBlock(`• ${results[0].rang}`) + `\u200B`
                            },
                            {
                                name: `> 🔱 Régime politique : `,
                                value: codeBlock(`• ${results[0].regime}`) + `\u200B`
                            },
                            {
                                name: `> 🧠 Idéologie : `,
                                value: codeBlock(`• ${results[0].ideologie}`) + `\u200B`
                            },
                            {
                                name: `> 📯 Devise : `,
                                value: codeBlock(`• ${results[0].devise}`) + `\u200B`
                            }
                        ],
                        color: joueur.displayHexColor,
                        timestamp: new Date(),
                        footer: { text: `${results[0].devise}` }
                    };

                    await interaction.reply({ embeds: [embed] });
                }
            });
        };

        gouv(joueur);
    },
};