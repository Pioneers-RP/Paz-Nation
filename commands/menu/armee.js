const { ActionRowBuilder, SlashCommandBuilder, StringSelectMenuBuilder, ButtonBuilder, ButtonStyle, codeBlock} = require('discord.js');
const { readFileSync } = require('fs');
const armeeObject = JSON.parse(readFileSync('data/armee.json', 'utf-8'));

module.exports = {
    data: new SlashCommandBuilder()
        .setName('armee')
        .setDescription(`Menu de votre armée`),

    async execute(interaction) {
        const { connection } = require("../../index");

        const sql = `
                SELECT * FROM armee WHERE id_joueur='${interaction.member.id}';
                SELECT * FROM pays WHERE id_joueur='${interaction.member.id}'
        `;
        connection.query(sql, async(err, results) => {if (err) {throw err;}
            const Armee = results[0][0];
            const Pays = results[1][0];
            const homme = (Armee.aviation * armeeObject.aviation.homme) + (Armee.infanterie * armeeObject.infanterie.homme) + (Armee.mecanise * armeeObject.mecanise.homme) + (Armee.support * armeeObject.support.homme);
            const hommeUnite =
                Armee.unite * eval(`armeeObject.${Armee.strategie}.aviation`) * eval(`armeeObject.aviation.homme`) +
                Armee.unite * eval(`armeeObject.${Armee.strategie}.infanterie`) * eval(`armeeObject.infanterie.homme`) +
                Armee.unite * eval(`armeeObject.${Armee.strategie}.mecanise`) * eval(`armeeObject.mecanise.homme`) +
                Armee.unite * eval(`armeeObject.${Armee.strategie}.support`) * eval(`armeeObject.support.homme`);

            const embed = {
                author: {
                    name: `${Pays.rang} de ${Pays.nom}`,
                    icon_url: interaction.member.displayAvatarURL()
                },
                thumbnail: {
                    url: Pays.drapeau
                },
                title: `\`Vue globale du pays\``,
                fields: [
                    {
                        name: `> ♟️ Stratégie :`,
                        value: codeBlock(`• ${eval(`armeeObject.${Armee.strategie}.nom`)}`) + `\u200B`
                    },
                    {
                        name: `> ⚖️ Performance :`,
                        value: codeBlock(
                            `• Victoires : ${Armee.victoire}\n` +
                            `• Défaites : ${Armee.defaite}\n`) + `\u200B`
                    },
                    {
                        name: `> 🪖 Unités : opérationnelles | réserves`,
                        value: codeBlock(
                            `• Unité : ${Armee.unite.toLocaleString('en-US')} | ${Math.floor(Math.min((Armee.aviation/eval(`armeeObject.${Armee.strategie}.aviation`)), (Armee.infanterie/eval(`armeeObject.${Armee.strategie}.infanterie`)), (Armee.mecanise/eval(`armeeObject.${Armee.strategie}.mecanise`)), (Armee.support/eval(`armeeObject.${Armee.strategie}.support`)))).toLocaleString('en-US')}\n` +
                            ` dont :\n` +
                            `  • Aviation : ${(Armee.unite * eval(`armeeObject.${Armee.strategie}.aviation`)).toLocaleString('en-US')} | ${Armee.aviation.toLocaleString('en-US')}\n` +
                            `  • Infanterie : ${(Armee.unite * eval(`armeeObject.${Armee.strategie}.infanterie`)).toLocaleString('en-US')} | ${Armee.infanterie.toLocaleString('en-US')}\n` +
                            `  • Mécanisé : ${(Armee.unite * eval(`armeeObject.${Armee.strategie}.mecanise`)).toLocaleString('en-US')} | ${Armee.mecanise.toLocaleString('en-US')}\n` +
                            `  • Support : ${(Armee.unite * eval(`armeeObject.${Armee.strategie}.support`)).toLocaleString('en-US')} | ${Armee.support.toLocaleString('en-US')}\n` +
                            `‎\n` +
                            `  • Homme : ${hommeUnite.toLocaleString('en-US')} | ${homme.toLocaleString('en-US')}`) + `\u200B`
                    },
                    {
                        name: `> <:materieldinfanterie:1123611393535512626> Matériel militaire :`,
                        value: codeBlock(
                            `• ${Armee.avion.toLocaleString('en-US')} avions\n` +
                            `• ${Armee.equipement_support.toLocaleString('en-US')} equipements de support\n` +
                            `• ${Armee.materiel_infanterie.toLocaleString('en-US')} materiel d\'infanterie\n` +
                            `• ${Armee.vehicule.toLocaleString('en-US')} véhicules\n`) + `\u200B`
                    },
                ],
                color: interaction.member.displayColor,
                timestamp: new Date(),
                footer: {
                    text: `${Pays.devise}`
                },
            };

            const row = new ActionRowBuilder()
                .addComponents(
                    new StringSelectMenuBuilder()
                        .setCustomId('action-armee')
                        .setPlaceholder(`Afficher un autre menu`)
                        .addOptions([
                            {
                                label: `Mobiliser des Unités`,
                                emoji: `🪖`,
                                description: `Transférer des unités de votre réserve vers votre armée`,
                                value: 'unite',
                            },
                            {
                                label: `Stratégie`,
                                emoji: `♟️`,
                                description: `Choisir une stratégie pour votre armée`,
                                value: 'strategie',
                            },
                        ]),
                );
            interaction.reply({ embeds: [embed], components: [row] });
        });
    },
};