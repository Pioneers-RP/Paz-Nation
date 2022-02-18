const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('sell')
        .setDescription(`Vendre des ressources sur le marché international (IM)`)
        .addStringOption(ressource =>
            ressource.setName('ressource')
            .setDescription(`La ressource que vous voulez vendre`)
            .addChoice(`Biens de consommation`, 'Biens de consommation')
            .addChoice(`Bois`, 'Bois')
            .addChoice(`Brique`, 'Brique')
            .addChoice(`Eau`, 'Eau')
            .addChoice(`Métaux`, 'Métaux')
            .addChoice(`Nourriture`, 'Nourriture')
            .addChoice(`Pétrole`, 'Pétrole')
            .setRequired(true))
        .addIntegerOption(quantité =>
            quantité.setName('quantité')
            .setDescription(`La quantité de ressource que vous voulez vendre`)
            .setRequired(true))
        .addIntegerOption(prix =>
            prix.setName('prix')
            .setDescription(`Le prix pour la quantité de ressource`)
            .setRequired(true)),

    async execute(interaction) {

        const ressource = interaction.options.getString('ressource');
        var quantité = interaction.options.getInteger('quantité');
        var prix = interaction.options.getInteger('prix');
        var prix_u = quantité / prix;
        prix_u = prix_u.toFixed(2);
        if (quantité >= 1000000) {
            quantité = quantité / 1000000;
            quantité = quantité + 'M';
        } else {
            quantité = quantité / 1000;
            quantité = quantité + 'k';
        }
        if (prix >= 1000000) {
            prix = prix / 1000000;
            prix = prix + 'M';
        } else {
            prix = prix / 1000;
            prix = prix + 'k';
        }

        const salon_commerce = interaction.client.channels.cache.get('878676556543844443');
        const thread = await salon_commerce.threads
            .create({
                name: `[${ressource}] à ${prix_u} | u~ ${quantité} | ${prix} $ | ${interaction.member.displayName}`,
                autoArchiveDuration: 3600
            });

        const embed = {
            author: {
                name: `<\\Nom du pays>`,
                icon_url: interaction.member.displayAvatarURL()
            },
            thumbnail: {
                url: 'https://cdn.discordapp.com/attachments/939251032297463879/940642380640583770/paz_v3.png',
            },
            title: `Nouvelle offre :`,
            fields: [{
                    name: `Ressource :`,
                    value: `${ressource}`
                },
                {
                    name: `Quantité :`,
                    value: `${quantité}`
                },
                {
                    name: `Prix :`,
                    value: `Au total : ${prix}
                    A l'unité : ${prix_u}`
                }
            ],
            color: interaction.member.displayHexColor,
            timestamp: new Date(),
            footer: {
                text: `Paz Nation, le meilleur serveur Discord Français`
            },
        };

        thread.send({ embeds: [embed] })

        await interaction.reply({ content: `Votre offre a été publié : ${thread}` });
    },
};