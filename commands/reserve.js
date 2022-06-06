const { SlashCommandBuilder, codeBlock } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('reserve')
        .setDescription(`Voir vos reserves en ressource`),

    async execute(interaction) {
        const { connection } = require('../index.js');

        var sql = `
            SELECT * FROM pays WHERE id_joueur=${interaction.member.id}`;

        connection.query(sql, async(err, results) => {
            if (err) {
                throw err;
            }
            const embed = {
                author: {
                    name: `${results[0].rang} de ${results[0].nom}`,
                    icon_url: interaction.member.displayAvatarURL()
                },
                thumbnail: {
                    url: `${results[0].drapeau}`
                },
                title: `\`Réserve :\``,
                fields: [{
                    name: `> \uD83D\uDCBB Biens de consommation : `,
                    value: codeBlock(`• ${results[0].bc.toLocaleString('en-US')}`) + `\u200B`
                }, {
                    name: `> 🪵 Bois : `,
                    value: codeBlock(`• ${results[0].bois.toLocaleString('en-US')}`) + `\u200B`
                }, {
                    name: `> 🧱 Brique : `,
                    value: codeBlock(`• ${results[0].brique.toLocaleString('en-US')}`) + `\u200B`
                }, {
                    name: `> 💧 Eau : `,
                    value: codeBlock(`• ${results[0].eau.toLocaleString('en-US')}`) + `\u200B`
                }, {
                    name: `> 🪨 Métaux : `,
                    value: codeBlock(`• ${results[0].metaux.toLocaleString('en-US')}`) + `\u200B`
                }, {
                    name: `> 🌽 Nourriture : `,
                    value: codeBlock(`• ${results[0].nourriture.toLocaleString('en-US')}`) + `\u200B`
                }, {
                    name: `> 🛢️ Pétrole : `,
                    value: codeBlock(`• ${results[0].petrole.toLocaleString('en-US')}`) + `\u200B`
                }, ],
                color: interaction.member.displayHexColor,
                timestamp: new Date(),
                footer: {
                    text: `${results[0].devise}`
                },
            };

            await interaction.reply({ embeds: [embed] })
        });
    }
}