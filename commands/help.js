const { SlashCommandBuilder, codeBlock } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription(`Menu d'aide`),

    async execute(interaction) {
        const { connection } = require('../index.js');

        const sql = `SELECT * FROM pays WHERE id_joueur='${interaction.member.id}'`;
        connection.query(sql, async(err, results) => {if (err) {throw err;}

            const embed = {
                author: {
                    name: `${results[0].rang} de ${results[0].nom}`,
                    icon_url: interaction.member.displayAvatarURL()
                },
                thumbnail: {
                    url: `${results[0].drapeau}`,
                },
                timestamp: new Date(),
                description: `[Toutes les informations sont présentes sur notre site internet](https://paznation.gitbook.io/wiki/)`,
                color: interaction.member.displayHexColor,
                footer: {
                    text: `${results[0].devise}`
                },
            };

            await interaction.reply({ embeds: [embed] });
        });
    }
};