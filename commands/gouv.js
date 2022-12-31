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
        let joueur = interaction.options.getUser('joueur');

        if (!joueur) {
            joueur = interaction.member;
        }

        function getGouvernement(joueur) {
            const sql = `SELECT * FROM pays WHERE id_joueur='${joueur.id}'`;
            connection.query(sql, async(err, results) => {if (err) {throw err;}
                const Pays = results[0];

                if (!results[0]) {
                    const reponse = codeBlock('diff', `- Cette personne ne joue pas.`);
                    await interaction.reply({ content: reponse, ephemeral: true });
                } else {

                    const embed = {
                        author: {
                            name: `${Pays.rang} de ${Pays.nom}`,
                            icon_url: joueur.displayAvatarURL()
                        },
                        thumbnail: {
                            url: `${Pays.drapeau}`
                        },
                        title: `\`Menu du gouvernement\``,
                        fields: [{
                                name: `> 🪧 Nom de l'Etat : `,
                                value: codeBlock(`• ${Pays.nom}`) + `\u200B`
                            },
                            {
                                name: `> ®️ Rang : `,
                                value: codeBlock(`• ${Pays.rang}`) + `\u200B`
                            },
                            {
                                name: `> 🔱 Régime politique : `,
                                value: codeBlock(`• ${Pays.regime}`) + `\u200B`
                            },
                            {
                                name: `> 🧠 Idéologie : `,
                                value: codeBlock(`• ${Pays.ideologie}`) + `\u200B`
                            },
                            {
                                name: `> 📯 Devise : `,
                                value: codeBlock(`• ${Pays.devise}`) + `\u200B`
                            }
                        ],
                        color: joueur.displayHexColor,
                        timestamp: new Date(),
                        footer: { text: `${Pays.devise}` }
                    };

                    await interaction.reply({ embeds: [embed] });
                }
            });
        }

        getGouvernement(joueur);
    },
};