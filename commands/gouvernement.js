const { SlashCommandBuilder, codeBlock } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('gouvernement')
        .setDescription(`Choisissez votre forme de gouvernement`)
        .addStringOption(option =>
            option.setName('forme')
            .setDescription(`Votre forme de gouvernement`)
            .setRequired(true)),

    async execute(interaction) {

        if (devise.length <= 60) {

            const annonce = {
                author: {
                    name: `<\\Nom du pays>`,
                    icon_url: interaction.member.displayAvatarURL()
                },
                thumbnail: {
                    url: 'https://cdn.discordapp.com/attachments/939251032297463879/940642380640583770/paz_v3.png',
                },
                title: `Une nouvelle 📑 Devise a été adoptée :`,
                description: `${devise}`,
                color: interaction.member.displayHexColor
            };
            const salon_annonce = interaction.client.channels.cache.get('882168634967982121');
            salon_annonce.send({ embeds: [annonce] });
            var reponse = `Votre annonce a été publié dans <#882168634967982121>`;

        } else {
            var reponse = codeBlock('diff', `- Vous avez dépassé la limite de caratère: 60 max`);
        }

        await interaction.reply({ content: reponse });
    },
};