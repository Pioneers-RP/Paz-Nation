const { SlashCommandBuilder, codeBlock } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('gouvernement')
        .setDescription(`Choisissez votre forme de gouvernement`)
        .addStringOption(gouvernement =>
            gouvernement.setName('forme')
            .setDescription(`Votre forme de gouvernement`)
            .addChoice(`Emirat`, 'Emirat')
            .addChoice(`Confédération`, 'Confédération')
            .addChoice(`Fédération`, 'Fédération')
            .addChoice(`Principauté`, 'Principauté')
            .addChoice(`République`, 'République')
            .addChoice(`Royaume`, 'Royaume')
            .setRequired(true)),

    async execute(interaction) {

        const gouvernement = interaction.options.getString('forme');

        const annonce = {
            author: {
                name: `<\\Nom du pays>`,
                icon_url: interaction.member.displayAvatarURL()
            },
            thumbnail: {
                url: 'https://cdn.discordapp.com/attachments/939251032297463879/940642380640583770/paz_v3.png',
            },
            title: `Une nouveau gouvernement a été mis en place :`,
            description: `${gouvernement}`,
            color: interaction.member.displayHexColor
        };
        const salon_annonce = interaction.client.channels.cache.get('882168634967982121');
        salon_annonce.send({ embeds: [annonce] });
        var reponse = `Votre annonce a été publié dans <#882168634967982121>`;


        await interaction.reply({ content: reponse });
    },
};