const { MessageActionRow, MessageButton } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
var mysql = require('mysql');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('marché')
        .setDescription(`Marché international`),

    async execute(interaction) {

        const embed = {
            author: {
                name: `<\\Nom du pays>`,
                icon_url: 'https://cdn.discordapp.com/attachments/939251032297463879/940642380640583770/paz_v3.png'
            },
            thumbnail: {
                url: 'https://cdn.discordapp.com/attachments/939251032297463879/940642380640583770/paz_v3.png',
            },
            title: `Marché International (IM)`,
            fields: [{
                    name: `Marché International (IM) — marché entre joueurs`,
                    value: `Dans le Marché International entre les pays,` +
                        ` vous pouvez proposer des offres pour vendre vos ressources,` +
                        ` ou acheter des offres d'autres pays. ` +
                        `Le joueur qui créé l'offre définit la quantité de ressources et le prix.` +
                        ` Le prix est obligatoirement compris entre -25% et +25% du prix actuel de la ressource.\n` +
                        `Si une offre vous intéresse, vous pouvez décider de l'acheter directement,` +
                        ` ou de négocier dans le thread de l'offre, en cliquant sur le nom de l'offre??`
                },
                {
                    name: `Vente Rapide / Quick Sell (QS) — marché avec le bot`,
                    value: `Si il n'y a pas d'offre dispnible ou qu'aucune ne vous intéresse,` +
                        ` ou bien si vous souhaitez vendre directement vos ressources sans attendre et sans créer d'offre,` +
                        ` vous pouvez échanger directement avec le bot.\n` +
                        `Cependant le prix sera toujours moins avantageux qu'avec les joueurs :` +
                        ` 30% en-dessous ou au-dessus du prix actuel de la ressource.\n\n` +
                        `Cliquez sur les boutons ci-dessous pour accéder au marché.`
                }
            ],
            color: interaction.member.displayHexColor,
        };

        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                .setLabel(`Marché International (IM)`)
                .setCustomId('menu_IM')
                .setStyle('SUCCESS'),
            )
            .addComponents(
                new MessageButton()
                .setLabel(`Quick Sell (QS)`)
                .setCustomId('menu_QS')
                .setStyle('PRIMARY'),
            );

        await interaction.reply({ embeds: [embed], components: [row] });

    },
};