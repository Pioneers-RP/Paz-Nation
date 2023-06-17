const { ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder, SlashCommandBuilder, codeBlock} = require('discord.js');
const { readFileSync } = require("fs");
const biomeObject = JSON.parse(readFileSync('data/biome.json', 'utf-8'));

module.exports = {
    data: new SlashCommandBuilder()
        .setName('territoire')
        .setDescription(`Vue globale de votre territoire`),

    async execute(interaction) {
        const { connection } = require('../../index.js');

        const sql = `
                    SELECT * FROM diplomatie WHERE id_joueur='${interaction.member.id}';
                    SELECT * FROM pays WHERE id_joueur='${interaction.member.id}';
                    SELECT * FROM territoire WHERE id_joueur='${interaction.member.id}'
        `;
        connection.query(sql, async(err, results) => {if (err) {throw err;}
            const Diplomatie = results[0][0];
            const Pays = results[1][0];
            const Territoire = results[2][0];

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
                            `• ${eval(`biomeObject.${Territoire.region}.nom`)}\n` +
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
                            `• ${(Territoire.cg * 1000).toLocaleString('en-US')}km² de capacité de gouvernance\n`) + `\u200B`
                    },
                ],
                color: interaction.member.displayColor,
                timestamp: new Date(),
                footer: {
                    text: `${Pays.devise}`
                },
            };

            const row1 = new ActionRowBuilder()
                .addComponents(
                    new StringSelectMenuBuilder()
                        .setCustomId('action-territoire')
                        .setPlaceholder(`Afficher un autre menu`)
                        .addOptions([
                            {
                                label: `Biome`,
                                emoji: `🏞️`,
                                description: `Menu des biomes`,
                                value: 'biome',
                            }
                        ]),
                );

            const row2 = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                    .setLabel(`Envoyer un explorateur`)
                    .setEmoji(`🧭`)
                    .setCustomId('explorateur-' + interaction.member.id)
                    .setStyle(ButtonStyle.Success)
                );

            await interaction.reply({ embeds: [embed], components: [row1, row2] });
        });
    },
};