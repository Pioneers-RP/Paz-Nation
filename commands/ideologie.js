const { SlashCommandBuilder, codeBlock } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ideologie')
        .setDescription(`Choisissez votre idéologie`)
        .addStringOption(ideologie =>
            ideologie.setName('ideologie')
            .setDescription(`Choisissez votre idéologie`)
            .addChoice(`Libéralisme`, 'Libéralisme')
            .addChoice(`Capitalisme`, 'Capitalisme')
            .addChoice(`Oligarchique`, 'Oligarchique')
            .addChoice(`Centriste`, 'Centriste')
            .addChoice(`Socialisme`, 'Socialisme')
            .addChoice(`Maxisme`, 'Maxisme')
            .addChoice(`Anarchisme`, 'Anarchisme')
            .setRequired(true)),

    async execute(interaction) {

        const ideologie = interaction.options.getString('ideologie');

        const annonce = {
            author: {
                name: `<\\Nom du pays>`,
                icon_url: interaction.member.displayAvatarURL()
            },
            thumbnail: {
                url: 'https://cdn.discordapp.com/attachments/939251032297463879/940642380640583770/paz_v3.png',
            },
            title: `Une nouvelle idéologie a été adoptée : ${ideologie}`,
            color: interaction.member.displayHexColor
        };
        const salon_annonce = interaction.client.channels.cache.get('882168634967982121');
        salon_annonce.send({ embeds: [annonce] });
        var reponse = `Votre annonce a été publié dans <#882168634967982121>`;

        await interaction.reply({ content: reponse });
    },
};