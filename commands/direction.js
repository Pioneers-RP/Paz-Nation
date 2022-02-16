const { MessageActionRow, MessageButton } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('direction')
        .setDescription(`Choisissez dans quelle direction vous voulez vous étendre`),

    async execute(interaction) {

        const embed = {
            author: {
                name: `<\\Nom du pays>`,
                icon_url: interaction.member.displayAvatarURL()
            },
            thumbnail: {
                url: 'https://cdn.discordapp.com/attachments/939251032297463879/940642380640583770/paz_v3.png',
            },
            title: `Vous vous étendez actuellement vers le <placeholder>`,
            description: `Vers où voulez-vous vous étendre ?`,
            color: interaction.member.displayHexColor
        };

        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                .setLabel(`Ouest`)
                .setEmoji(`⬅️`)
                .setCustomId('vers_ouest')
                .setStyle('PRIMARY'),
            )
            .addComponents(
                new MessageButton()
                .setLabel(`Nord`)
                .setEmoji(`⬆️`)
                .setCustomId('vers_nord')
                .setStyle('PRIMARY')
            )
            .addComponents(
                new MessageButton()
                .setLabel(`Sud`)
                .setEmoji(`⬇️`)
                .setCustomId('vers_sud')
                .setStyle('PRIMARY')
            )
            .addComponents(
                new MessageButton()
                .setLabel(`Est`)
                .setEmoji(`➡️`)
                .setCustomId('vers_est')
                .setStyle('PRIMARY')
            );

        await interaction.reply({ embeds: [embed], components: [row] });
    },
};