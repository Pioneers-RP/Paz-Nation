const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('approvisionnement')
        .setDescription(`Choisissez la quantité de nourriture et d'eau à laquelle votre population a accès`)
        .addSubcommand(subcommand =>
            subcommand
            .setName('eau')
            .setDescription(`Choisissez la quantité d'eau à laquelle votre population a accès`)
            .addIntegerOption(nombre =>
                nombre.setName('quantité')
                .setDescription(`La quantité`)
                .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
            .setName('nourriture')
            .setDescription(`Choisissez la quantité de nourriture à laquelle votre population a accès`)
            .addIntegerOption(nombre =>
                nombre.setName('quantité')
                .setDescription(`La quantité`)
                .setRequired(true))),

    async execute(interaction) {
        const { connection } = require('../index');
        
        const quantite = interaction.options.getInteger('quantité');

        switch (interaction.options.getSubcommand()) {
            case 'eau':
                var donnee = 'eau_appro'
                break;
            case 'nourriture':
                var donnee = 'nourriture_appro'
                donnee 
                break;
        }

        var sql = `UPDATE pays SET ${donnee}='${quantite}' WHERE id_joueur='${interaction.member.id}' LIMIT 1`;
        connection.query(sql, async(err) => { if (err) { throw err; } });

        var sql = `SELECT * FROM pays WHERE id_joueur='${interaction.member.id}'`;
        connection.query(sql, async(err, results) => {if (err) {throw err;}

            const embed = {
                author: {
                    name: `${results[0].rang} de ${results[0].nom}`,
                    icon_url: interaction.member.displayAvatarURL()
                },
                thumbnail: {
                    url: `${results[0].drapeau}`,
                },
                title: `\`Votre population a désomais accès à :\``,
                description: `${quantite.toLocaleString('en-US')} ${interaction.options.getSubcommand()}`,
                color: interaction.member.displayHexColor
            };

            await interaction.reply({ embeds: [embed] });
        });
    },
};