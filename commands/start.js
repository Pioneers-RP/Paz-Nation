const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('start')
        .setDescription(`Démarrer votre aventure en temps que cité !`)
        .addStringOption(option =>
            option.setName('cité')
            .setDescription(`Le nom de votre ville de départ`)
            .setRequired(true)),

    async execute(interaction) {

        const cité = interaction.options.getString('cité');

        const ville = {
            author: {
                name: `Cité de ` + cité,
                icon_url: interaction.member.displayAvatarURL()
            },
            thumbnail: {
                url: 'https://cdn.discordapp.com/attachments/939251032297463879/940642380640583770/paz_v3.png',
            },
            title: `Vous avez fondé votre Cité !`,
            fields: [{
                name: `Work in Progress`,
                value: `Work in Progress`
            }],
            color: interaction.member.displayHexColor,
            timestamp: new Date(),
            footer: {
                text: `Paz Nation, le meilleur serveur Discord Français`
            },
        };
        interaction.member.setNickname(`[${cité}] ${interaction.member.displayName}`);

        const salon_carte = interaction.client.channels.cache.get('845932447652380702');

        const annonce = {
            description: `**<@${interaction.member.id}> a fondé une nouvelle Cité : ${cité}`,
            image: {
                url: 'https://media.discordapp.net/attachments/703348479065325609/774478972054405130/militantroguedrawing.png?width=840&height=473',
            },
            color: interaction.member.displayHexColor,
            footer: {
                text: `Suède, Travail, Investissement`
            },
        };

        salon_carte.send({ embeds: [annonce] });

        await interaction.reply({ embeds: [ville] });
    },
};