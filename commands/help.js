const { SlashCommandBuilder, codeBlock } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription(`Menu d'aide`),

    async execute(interaction) {
        const { connection } = require('../index.js');

        const sql = `SELECT * FROM pays WHERE id_joueur='${interaction.member.id}'`;
        connection.query(sql, async(err, results) => {if (err) {throw err;}
            const Pays = results[0];

            const embed = {
                author: {
                    name: `${Pays.rang} de ${Pays.nom}`,
                    icon_url: interaction.member.displayAvatarURL()
                },
                thumbnail: {
                    url: `${Pays.drapeau}`,
                },
                timestamp: new Date(),
                description: `[Toutes les informations sont présentes sur notre site internet](https://paznation.gitbook.io/wiki/)`,
                color: interaction.member.displayHexColor,
                footer: {
                    text: `${Pays.devise}`
                },
            };

            await interaction.reply({ embeds: [embed] });
        });
    }
};