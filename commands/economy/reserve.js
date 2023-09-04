const { SlashCommandBuilder, codeBlock, ActionRowBuilder, ButtonBuilder, ButtonStyle} = require('discord.js');
const { readFileSync } = require('fs');
const regionObject = JSON.parse(readFileSync('data/region.json', 'utf-8'));

module.exports = {
    data: new SlashCommandBuilder()
        .setName('reserve')
        .setDescription(`Affiche vos réserves`),

    async execute(interaction) {
        const { connection } = require('../../index.js');

        const sql = `
            SELECT * FROM batiments WHERE id_joueur='${interaction.member.id}';
            SELECT * FROM pays WHERE id_joueur='${interaction.member.id}';
            SELECT * FROM ressources WHERE id_joueur='${interaction.member.id}';
            SELECT * FROM territoire WHERE id_joueur='${interaction.member.id}';
        `;
        connection.query(sql, async(err, results) => {if (err) {throw err;}
            const Pays = results[1][0];
            const Ressources = results[2][0];
            const Territoire = results[3][0];

            //region Calcul des coefficients de production des ressources
            const coef_bois = eval(`regionObject.${Territoire.region}.bois`)
            const coef_charbon = eval(`regionObject.${Territoire.region}.charbon`)
            const coef_eau = eval(`regionObject.${Territoire.region}.eau`)
            const coef_metaux = eval(`regionObject.${Territoire.region}.metaux`)
            const coef_nourriture = eval(`regionObject.${Territoire.region}.nourriture`)
            const coef_petrole = eval(`regionObject.${Territoire.region}.petrole`)
            const coef_sable = eval(`regionObject.${Territoire.region}.sable`)
            //endregion

            const embed = {
                author: {
                    name: `${Pays.rang} de ${Pays.nom}`,
                    icon_url: interaction.member.displayAvatarURL()
                },
                thumbnail: {
                    url: Pays.drapeau
                },
                title: `\`Ressources\``,
                fields: [
                    {
                        name: `> <:acier:1075776411329122304> Acier :`,
                        value: codeBlock(`• ${Ressources.acier.toLocaleString('en-US')}`)
                    },
                    {
                        name: `> <:beton:1075776342227943526> Béton :`,
                        value: codeBlock(`• ${Ressources.beton.toLocaleString('en-US')}`)
                    },
                    {
                        name: `> \uD83D\uDCBB Biens de consommation :`,
                        value: codeBlock(`• ${Ressources.bc.toLocaleString('en-US')}`)
                    },
                    {
                        name: `> 🪵 Bois : ⛏️ x${coef_bois}`,
                        value: codeBlock(`• ${Ressources.bois.toLocaleString('en-US')}`)
                    },
                    {
                        name: `> ⛽ Carburant :`,
                        value: codeBlock(`• ${Ressources.carburant.toLocaleString('en-US')}`)
                    },
                    {
                        name: `> <:charbon:1075776385517375638> Charbon : ⛏️ x${coef_charbon}`,
                        value: codeBlock(`• ${Ressources.charbon.toLocaleString('en-US')}`)
                    },
                    {
                        name: `> 💧 Eau : ⛏️ x${coef_eau}`,
                        value: codeBlock(`• ${Ressources.eau.toLocaleString('en-US')}`)
                    },
                    {
                        name: `> <:windmill:1108767955442991225> Eolienne :`,
                        value: codeBlock(`• ${Ressources.eolienne.toLocaleString('en-US')}`)
                    },
                    {
                        name: `> 🪨 Metaux : ⛏️ x${coef_metaux}`,
                        value: codeBlock(`• ${Ressources.metaux.toLocaleString('en-US')}`)
                    },
                    {
                        name: `> 🌽 Nourriture : ⛏️ x${coef_nourriture}`,
                        value: codeBlock(`• ${Ressources.nourriture.toLocaleString('en-US')}`)
                    },
                    {
                        name: `> 🛢️ Pétrole : ⛏️ x${coef_petrole}`,
                        value: codeBlock(`• ${Ressources.petrole.toLocaleString('en-US')}`)
                    },
                    {
                        name: `> <:sable:1075776363782479873> Sable : ⛏️ x${coef_sable}`,
                        value: codeBlock(`• ${Ressources.sable.toLocaleString('en-US')}`)
                    },
                    {
                        name: `> 🪟 Verre :`,
                        value: codeBlock(`• ${Ressources.verre.toLocaleString('en-US')}`)
                    },
                ],
                color: interaction.member.displayColor,
                timestamp: new Date(),
                footer: { text: Pays.devise }
            };

            if (Pays.rang !== 'Cité') {
                const row = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setLabel(`Ressources`)
                            .setCustomId('ressources')
                            .setEmoji('🪵')
                            .setStyle(ButtonStyle.Secondary)
                    ).addComponents(
                        new ButtonBuilder()
                            .setLabel(`Militaire`)
                            .setCustomId('militaire')
                            .setEmoji('⚔️')
                            .setStyle(ButtonStyle.Secondary)
                    )
                await interaction.reply({ embeds: [embed], components: [row] });
            } else {
                await interaction.reply({ embeds: [embed] });
            }
        });
    }
};
