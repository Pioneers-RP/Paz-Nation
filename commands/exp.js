const { MessageActionRow, MessageButton } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
var mysql = require('mysql');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('exp')
        .setDescription(`Etendez votre territoire`),

    async execute(interaction) {

        const connection = new mysql.createConnection({
            host: 'eu01-sql.pebblehost.com',
            user: 'customer_260507_paznation',
            password: 'lidmGbk8edPkKXv1#ZO',
            database: 'customer_260507_paznation',
            multipleStatements: true
        });

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
                title: `\`Expansion territoriale\``,
                thumbnail: {
                    url: 'https://cdn.discordapp.com/attachments/939251032297463879/940642380640583770/paz_v3.png',
                },
                description: `Vous souhaitez vous étendre, pour cela vous disposez de trois solutions :\n` +
                    `\n__**🤝 Choix pacifique :**__ ${results[0].réputation}%\n` +
                    `\n> Négociation avec la peuple adversaire afin de partagez le territoire \n` +
                    `\n__**🪖 Choix dissuasif :**__ 0%\n` +
                    `\n> Dissuader l\'ennemi à l\'aide de votre artillerie sans pour autant l\'utiliser\n` +
                    `\n__**⚔ Choix force :**__ 0%\n` +
                    `\n> Utilisation de votre armée afin d\'écraser le peuple et de conquérir son territoire`,
                color: interaction.member.displayHexColor,
                timestamp: new Date(),
                footer: {
                    text: `${results[0].devise}`
                },
            };

            const row = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                    .setLabel(`Choix pacifique`)
                    .setEmoji(`🤝`)
                    .setCustomId('choix_pacifique')
                    .setStyle('PRIMARY')
                )
                .addComponents(
                    new MessageButton()
                    .setLabel(`Choix dissuasif`)
                    .setEmoji(`🪖`)
                    .setCustomId('choix_dissuasif')
                    .setStyle('PRIMARY')
                    .setDisabled(true)
                )
                .addComponents(
                    new MessageButton()
                    .setLabel(`Envoyer l\'armée`)
                    .setEmoji(`⚔`)
                    .setCustomId('choix_armée')
                    .setStyle('PRIMARY')
                    .setDisabled(true),
                );

            await interaction.reply({ embeds: [embed], components: [row] });
        })
    },
};