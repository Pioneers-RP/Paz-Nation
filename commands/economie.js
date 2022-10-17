const { SlashCommandBuilder, codeBlock } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('economie')
        .setDescription(`Consultez votre économie`)
        .addUserOption(user =>
            user.setName('joueur')
            .setDescription(`Le joueur dont vous voulez voir l'économie`)),

    async execute(interaction) {
        const { connection } = require('../index.js');
        let joueur = interaction.options.getUser('joueur');

        if (!joueur) {
            joueur = interaction.member;
        }

        function economie(joueur) {
            const sql = `SELECT * FROM pays WHERE id_joueur='${joueur.id}'`;
            connection.query(sql, async(err, results) => {if (err) {throw err;}

                if (!results[0]) {
                    const reponse = codeBlock('diff', `- Cette personne ne joue pas.`);
                    await interaction.reply({ content: reponse, ephemeral: true });
                } else {

                    const embed = {
                        author: {
                            name: `${results[0].rang} de ${results[0].nom}`,
                            icon_url: joueur.displayAvatarURL()
                        },
                        thumbnail: {
                            url: results[0].drapeau
                        },
                        title: `\`Menu de l'économie\``,
                        fields: [{
                                name: `> 💵 Argent :`,
                                value: codeBlock(`• ${results[0].cash.toLocaleString('en-US')} $`) + `\u200B`
                            },
                            {
                                name: `> 🏭 Nombre d'usine total :`,
                                value: codeBlock(`• ${results[0].usine_total.toLocaleString('en-US')}`) + `\u200B`
                            },
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

        economie(joueur)
    },
};