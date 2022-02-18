const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('sell')
        .setDescription(`Vendre des ressources sur le marché international (IM)`),

    async execute(interaction) {

        const embed = {
            author: {
                name: `<\\Nom du pays>`,
                icon_url: interaction.member.displayAvatarURL()
            },
            thumbnail: {
                url: 'https://cdn.discordapp.com/attachments/939251032297463879/940642380640583770/paz_v3.png',
            },
            title: `${interaction.member} a fait une offre :`,
            fields: [{
                    name: `<\\Ressource>`,
                    value: `<la ressource>`
                },
                {
                    name: `<\\Montant>`,
                    value: `<montant>`
                },
                {
                    name: `<\\Prix>`,
                    value: `<prix>`
                }
            ],
            color: interaction.member.displayHexColor,
            timestamp: new Date(),
            footer: {
                text: `Paz Nation, le meilleur serveur Discord Français`
            },
        };

        const salon_commerce = interaction.client.channels.cache.get('878676556543844443');
        const thread = await salon_commerce.threads
            .create({
                name: `[Bois] 0.78*u | 200k`,
                autoArchiveDuration: 60
            });

        await interaction.reply({ content: `${thread}` });
    },
};