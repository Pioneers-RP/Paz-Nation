const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('reserve')
        .setDescription(`Voir vos reserves en ressource`),

    async execute(interaction) {

        const embed = {
            author: {
                name: `<\\Nom du pays>`,
                icon_url: 'https://cdn.discordapp.com/attachments/939251032297463879/940642380640583770/paz_v3.png'
            },
            thumbnail: {
                url: 'https://cdn.discordapp.com/attachments/939251032297463879/940642380640583770/paz_v3.png',
            },
            title: `Réserve :`,
            fields: [{
                name: `\u200B`,
                value: `Biens de consommation :\n
                Bois :\n
                Brique :\n
                Eau :\n
                Métaux :\n
                Nourriture :\n
                Pétrole :\n`
            }],
            color: interaction.member.displayHexColor,
        };

        await interaction.reply({ embeds: [embed] });
    },
};