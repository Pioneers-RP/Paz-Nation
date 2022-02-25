const { MessageActionRow, MessageButton } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('exp')
        .setDescription(`Etendez votre territoire`),

    async execute(interaction) {

        const embed = {
            author: {
                name: `<\\Nom du pays>`,
                icon_url: interaction.member.displayAvatarURL()
            },
            title: `Conquête territoriale`,
            thumbnail: {
                url: 'https://cdn.discordapp.com/attachments/939251032297463879/940642380640583770/paz_v3.png',
            },
            description: `Vous souhaitez vous étendre, pour cela vous disposez de trois solutions :\n` +
                `\n__**🤝 Choix pacifique :**__ 60%\n` +
                `\n> Négociation avec la peuple adversaire afin de partagez le territoire \n` +
                `\n__**🪖 Choix dissuasif :**__ 80%\n` +
                `\n> Dissuader l\'ennemi à l\'aide de votre artillerie sans pour autant l\'utiliser\n` +
                `\n__**⚔ Choix Force :**__ 90%\n` +
                `\n> Utilisation de votre armée afin d\'écraser le peuple et de conquérir son territoire`,
            color: interaction.member.displayHexColor,
            footer: { text: `Suède, Travail, Investissement` }
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
    },
};