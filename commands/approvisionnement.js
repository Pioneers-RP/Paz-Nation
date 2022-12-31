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
        let Donnee;
        const { connection } = require('../index');
        const Quantite = interaction.options.getInteger('quantité');

        switch (interaction.options.getSubcommand()) {
            case 'eau':
                Donnee = 'eau_appro';
                break;
            case 'nourriture':
                Donnee = 'nourriture_appro'
                break;
        }

        let sql = `UPDATE population SET ${Donnee}='${Quantite}' WHERE id_joueur='${interaction.member.id}' LIMIT 1`;
        connection.query(sql, async(err) => { if (err) { throw err; } });

        sql = `SELECT * FROM pays WHERE id_joueur='${interaction.member.id}'`;
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
                title: `\`Votre population a désomais accès à :\``,
                description: `${Quantite.toLocaleString('en-US')} ${interaction.options.getSubcommand()}`,
                color: interaction.member.displayHexColor
            };

            await interaction.reply({ embeds: [embed] });
        });
    },
};