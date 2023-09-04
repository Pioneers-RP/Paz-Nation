const { ActionRowBuilder, StringSelectMenuBuilder, SlashCommandBuilder, codeBlock} = require("discord.js");
const { readFileSync } = require("fs");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('diplomatie')
        .setDescription(`Consultez votre diplomatie`),

    async execute(interaction) {
        const { connection } = require('../../index.js');

        sql = `
            SELECT * FROM diplomatie WHERE id_joueur='${interaction.member.id}';
            SELECT * FROM pays WHERE id_joueur='${interaction.member.id}';
        `;
        connection.query(sql, async(err, results) => {if (err) {throw err;}
            const Diplomatie = results[0][0];
            const Pays = results[1][0];

            if (!results[0][0]) {
                const reponse = codeBlock('ansi', `\u001b[0;0m\u001b[1;31mCette personne ne joue pas.`);
                await interaction.reply({ content: reponse, ephemeral: true });
            } else {
                //transofmrer une string en array
                const Ambassade = JSON.parse(Diplomatie.ambassade.replace(/\s/g, ''));

                const embed = {
                    author: {
                        name: `${Pays.rang} de ${Pays.nom}`,
                        icon_url: interaction.member.displayAvatarURL()
                    },
                    thumbnail: {
                        url: Pays.drapeau
                    },
                    title: `\`Menu de la diplomatie\``,
                    fields: [
                        {
                            name: `> 🪩 Influence :`,
                            value: codeBlock(
                                `• ${Diplomatie.influence}\n`) + `\u200B`
                        },
                        {
                            name: `> 🏦 Ambassades :`,
                            value: codeBlock(
                                `• ${Ambassade.length}\n`) + `\u200B`
                        },
                    ],
                    color: interaction.member.displayColor,
                    timestamp: new Date(),
                    footer: {
                        text: `${Pays.devise}`
                    },
                };
                const components = [];
                const options = [
                    {
                        label: `Créer une ambassade`,
                        emoji: `☎️`,
                        description: `Créer une nouvelle ambassade`,
                        value: 'creer-ambassade',
                    },
                    {
                        label: `Organisation`,
                        emoji: `🇺🇳`,
                        description: `Créer une nouvelle organisation`,
                        value: 'organisation',
                    }
                ];

                if (Pays.rang !== 'Cité') {
                    const row = new ActionRowBuilder()
                        .addComponents(
                            new StringSelectMenuBuilder()
                                .setCustomId('action-diplomatie')
                                .setPlaceholder(`Sélectionner une action`)
                                .addOptions(options),
                        );
                    components.push(row);
                }

                await interaction.reply({ embeds: [embed], components: components });
            }
        });
    },
};