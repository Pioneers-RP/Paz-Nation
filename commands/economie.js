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

        function getEconomie(joueur) {
            const sql = `
                SELECT * FROM batiments WHERE id_joueur='${joueur.id}';
                SELECT * FROM pays WHERE id_joueur='${joueur.id}'
            `;
            connection.query(sql, async(err, results) => {if (err) {throw err;}
                const Batiment = results[0][0];
                const Pays = results[1][0];

                if (!results[0][0]) {
                    const reponse = codeBlock('diff', `- Cette personne ne joue pas.`);
                    await interaction.reply({ content: reponse, ephemeral: true });
                } else {

                    const embed = {
                        author: {
                            name: `${Pays.rang} de ${Pays.nom}`,
                            icon_url: joueur.displayAvatarURL()
                        },
                        thumbnail: {
                            url: Pays.drapeau
                        },
                        title: `\`Menu de l'économie\``,
                        fields: [{
                                name: `> 💵 Argent :`,
                                value: codeBlock(`• ${Pays.cash.toLocaleString('en-US')} $`) + `\u200B`
                            },
                            {
                                name: `> 🏭 Nombre d'usine total :`,
                                value: codeBlock(`• ${Batiment.usine_total.toLocaleString('en-US')}`) + `\u200B`
                            },
                        ],
                        color: joueur.displayHexColor,
                        timestamp: new Date(),
                        footer: {
                            text: `${Pays.devise}`
                        },
                    };

                    await interaction.reply({ embeds: [embed] });
                }
            });
        }

        getEconomie(joueur)
    },
};