const { MessageActionRow, MessageButton } = require('discord.js');
const { SlashCommandBuilder, codeBlock} = require('@discordjs/builders');
const {readFileSync} = require("fs");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('expansion')
        .setDescription(`Etendez votre territoire`),

    async execute(interaction) {
        const { connection } = require('../index.js');

        const sql = `
                    SELECT * FROM diplomatie WHERE id_joueur='${interaction.member.id}';
                    SELECT * FROM pays WHERE id_joueur='${interaction.member.id}';
                    SELECT * FROM territoire WHERE id_joueur='${interaction.member.id}'
        `;
        connection.query(sql, async(err, results) => {if (err) {throw err;}
            const Diplomatie = results[0][0];
            const Pays = results[1][0];
            const Territoire = results[2][0];

            const regionObject = JSON.parse(readFileSync('data/region.json', 'utf-8'));
            const region = eval(`regionObject.${Territoire.region}.nom`);

            const embed = {
                author: {
                    name: `${Pays.rang} de ${Pays.nom}`,
                    icon_url: interaction.member.displayAvatarURL()
                },
                thumbnail: {
                    url: Pays.drapeau
                },
                title: `\`Expansion territoriale\``,
                fields: [
                    {
                        name: `> 🌄 Territoire :`,
                        value: codeBlock(
                            `• ${region}\n` +
                            `• ${Territoire.T_total.toLocaleString('en-US')} km² total\n` +
                            `• ${Territoire.T_national.toLocaleString('en-US')} km² national\n` +
                            `• ${Territoire.T_controle.toLocaleString('en-US')} km² contrôlé`) + `\u200B`
                    },
                    {
                        name: `> 🏗️ Construction :`,
                        value: codeBlock(
                            `• ${Territoire.T_libre.toLocaleString('en-US')} km² libres\n` +
                            `• ${Territoire.T_occ.toLocaleString('en-US')} km² construits`) + `\u200B`
                    },
                    {
                        name: `> ☎ Diplomatie :`,
                        value: codeBlock(
                            `• ${Diplomatie.influence} influences\n` +
                            `• ${(Territoire.cg * 1000)}km² de capacité de gouvernance\n`) + `\u200B`
                    },
                ],
                color: interaction.member.displayHexColor,
                timestamp: new Date(),
                footer: {
                    text: `${Pays.devise}`
                },
            };

            const row = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                    .setLabel(`Envoyer un explorateur`)
                    .setEmoji(`🧭`)
                    .setCustomId('explorateur-' + interaction.member.id)
                    .setStyle('SUCCESS')
                );

            await interaction.reply({ embeds: [embed], components: [row] });
        });
    },
};