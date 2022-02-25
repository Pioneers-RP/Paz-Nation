const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pay')
        .setDescription(`Donner de l'argent à un joueur`)
        .addUserOption(joueur =>
            joueur.setName('joueur')
            .setDescription(`Le joueur à qui vous voulez donner de l'argent`)
            .setRequired(true))
        .addIntegerOption(montant =>
            montant.setName('montant')
            .setDescription(`Le montant du transfert`)
            .setRequired(true)),

    async execute(interaction, client) {

        const joueur = interaction.options.getUser('joueur');
        const montant = interaction.options.getInteger('montant');

        const embed = {
            author: {
                name: `<\\Nom du pays>`,
                icon_url: interaction.member.displayAvatarURL()
            },
            thumbnail: {
                url: 'https://cdn.discordapp.com/attachments/939251032297463879/940642380640583770/paz_v3.png',
            },
            title: `Paiement validé !`,
            description: `Vous avez payé un joueur. ` +
                `Aucun remboursement ne sera effectué en cas d'erreur de votre part ou d'arnaque. ` +
                `Si vous voulez récupérer votre argent en cas d'erreur, veuillez vous adresser au joueur payé. ` +
                `Vous avez alors deux moyens de récupérer votre argent, la guerre ou la négociation.`,
            fields: [{
                    "name": "\u200B",
                    "value": "🏧 Argent en réserve : <valeur>",
                    "inline": true
                },
                {
                    "name": "\u200B",
                    "value": "💸 Valeur du paiement : <valeur>",
                    "inline": true
                }
            ],
            image: {
                url: 'https://media.discordapp.net/attachments/848913340737650698/944327803455832094/paiement.png'
            },
            color: interaction.member.displayHexColor,
            timestamp: new Date(),
            footer: {
                text: `Paz Nation, le meilleur serveur Discord Français`
            },
        };

        const paiement = {
            author: {
                name: `<\\Nom du pays>`,
                icon_url: interaction.member.displayAvatarURL()
            },
            thumbnail: {
                url: 'https://cdn.discordapp.com/attachments/939251032297463879/940642380640583770/paz_v3.png',
            },
            title: `Paiement validé !`,
            description: `Vous avez reçu un paiement de <@${interaction.member.id}>`,
            fields: [{
                    "name": "\u200B",
                    "value": "💸 Valeur du paiement : <valeur>",
                    "inline": true
                },
                {
                    "name": "\u200B",
                    "value": "🏧 Argent en réserve : <valeur>",
                    "inline": true
                }
            ],
            image: {
                url: 'https://media.discordapp.net/attachments/848913340737650698/944327803455832094/paiement.png'
            },
            color: interaction.member.displayHexColor,
            timestamp: new Date(),
            footer: {
                text: `Paz Nation, le meilleur serveur Discord Français`
            },
        };

        const user = await client.users.fetch(joueur.id);
        user.send({ embeds: [paiement] });

        await interaction.reply({ embeds: [embed] });
    },
};