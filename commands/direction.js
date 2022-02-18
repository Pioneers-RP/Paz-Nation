const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('direction')
        .setDescription(`Choisissez dans quelle direction vous voulez vous étendre`)
        .addStringOption(direction =>
            direction.setName('vers')
            .setDescription(`Choisissez dans quelle direction vous voulez vous étendre`)
            .addChoice(`⬆️ Nord`, 'Nord')
            .addChoice(`⬅️ Ouest`, 'Ouest')
            .addChoice(`➡️ Est`, 'Est')
            .addChoice(`⬇️ Sud`, 'Sud')
            .setRequired(true)),

    async execute(interaction) {

        const direction = interaction.options.getString('vers');

        const embed = {
            author: {
                name: `<\\Nom du pays>`,
                icon_url: interaction.member.displayAvatarURL()
            },
            thumbnail: {
                url: 'https://cdn.discordapp.com/attachments/939251032297463879/940642380640583770/paz_v3.png',
            },
            title: `Vous vous étendez désormais vers le ${direction}`,
            color: interaction.member.displayHexColor
        };

        await interaction.reply({ embeds: [embed] });
    },
};