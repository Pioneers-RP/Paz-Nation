const { SlashCommandBuilder, codeBlock } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('reserve')
        .setDescription(`Voir vos reserves en ressource`),

    async execute(interaction) {
        const { connection } = require('../index.js');

        const sql = `
            SELECT * FROM pays WHERE id_joueur=${interaction.member.id};
            SELECT * FROM ressources WHERE id_joueur=${interaction.member.id}
        `;
        connection.query(sql, async(err, results) => {if (err) {throw err;}
            const Pays = results[0][0];
            const Ressources = results[1][0];

            const embed = {
                author: {
                    name: `${Pays.rang} de ${Pays.nom}`,
                    icon_url: interaction.member.displayAvatarURL()
                },
                thumbnail: {
                    url: `${Pays.drapeau}`
                },
                title: `\`Réserve :\``,
                fields: [{
                    name: `> \uD83D\uDCBB Biens de consommation : `,
                    value: codeBlock(`• ${Ressources.bc.toLocaleString('en-US')}`) + `\u200B`
                }, {
                    name: `> 🪵 Bois : `,
                    value: codeBlock(`• ${Ressources.bois.toLocaleString('en-US')}`) + `\u200B`
                }, {
                    name: `> 🧱 Brique : `,
                    value: codeBlock(`• ${Ressources.brique.toLocaleString('en-US')}`) + `\u200B`
                }, {
                    name: `> 💧 Eau : `,
                    value: codeBlock(`• ${Ressources.eau.toLocaleString('en-US')}`) + `\u200B`
                }, {
                    name: `> 🪨 Métaux : `,
                    value: codeBlock(`• ${Ressources.metaux.toLocaleString('en-US')}`) + `\u200B`
                }, {
                    name: `> 🌽 Nourriture : `,
                    value: codeBlock(`• ${Ressources.nourriture.toLocaleString('en-US')}`) + `\u200B`
                }, {
                    name: `> 🛢️ Pétrole : `,
                    value: codeBlock(`• ${Ressources.petrole.toLocaleString('en-US')}`) + `\u200B`
                }, ],
                color: interaction.member.displayHexColor,
                timestamp: new Date(),
                footer: {
                    text: `${Pays.devise}`
                },
            };

            await interaction.reply({ embeds: [embed] })
        });
    }
}