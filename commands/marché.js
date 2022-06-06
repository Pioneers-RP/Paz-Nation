const { MessageActionRow, MessageButton } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('marché')
        .setDescription(`Marché international`),

    async execute(interaction) {
        const { connection } = require('../index.js');

        var sql = `
            SELECT * FROM pays WHERE id_joueur=${interaction.member.id}`;
        connection.query(sql, async(err, results) => {
            if (err) {
                throw err;
            }

            const embed = {
                author: {
                    name: `${results[0].rang} de ${results[0].nom}`,
                    icon_url: interaction.member.displayAvatarURL()
                },
                thumbnail: {
                    url: results[0].drapeau,
                },
                title: `Marché International (IM)`,
                fields: [{
                        name: `Marché International (IM) — marché entre joueurs`,
                        value: `Dans le Marché International entre les pays,` +
                            ` vous pouvez proposer des offres pour vendre vos ressources,` +
                            ` ou acheter des offres d'autres pays. ` +
                            `Le joueur qui créé l'offre définit la quantité de ressources et le prix.` +
                            ` Toutes les offres sont disponibles dans <#${process.env.SALON_COMMERCE}>\n` +
                            `Si une offre vous intéresse, vous pouvez décider de l'acheter directement,` +
                            ` ou de négocier dans le thread de l'offre, en cliquant sur le nom de l'offre`
                    },
                    {
                        name: `Marché Rapide / Quick Market (QM) — marché avec le bot`,
                        value: `Si il n'y a pas d'offre disponible ou qu'aucune ne vous intéresse,` +
                            ` ou bien si vous souhaitez vendre directement vos ressources sans attendre et sans créer d'offre,` +
                            ` vous pouvez échanger directement avec le bot.\n` +
                            `Cependant le prix sera toujours moins avantageux qu'avec les joueurs.` +
                            `Cliquez sur les boutons ci-dessous pour accéder au marché.`
                    }
                ],
                color: interaction.member.displayHexColor,
            };

            const row = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                    .setLabel(`Quick Market (QM)`)
                    .setCustomId('menu_QM')
                    .setStyle('PRIMARY'),
                );

            await interaction.reply({ embeds: [embed], components: [row] });
        });
    },
};