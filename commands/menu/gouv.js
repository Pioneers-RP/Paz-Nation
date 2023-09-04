const { ActionRowBuilder, StringSelectMenuBuilder, SlashCommandBuilder, codeBlock} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('gouv')
        .setDescription(`Menu du gouvernement`),

    async execute(interaction) {
        const { connection } = require('../../index.js');

        const sql = `SELECT * FROM pays WHERE id_joueur='${interaction.member.id}'`;
        connection.query(sql, async(err, results) => {if (err) {throw err;}
            const Pays = results[0];

            if (!results[0]) {
                const reponse = codeBlock('diff', `- Cette personne ne joue pas.`);
                await interaction.reply({ content: reponse, ephemeral: true });
            } else {
                const embed = {
                    author: {
                        name: `${Pays.rang} de ${Pays.nom}`,
                        icon_url: interaction.member.displayAvatarURL()
                    },
                    thumbnail: {
                        url: Pays.drapeau
                    },
                    title: `\`Menu du gouvernement\``,
                    fields: [{
                            name: `> 🪧 Nom de l'Etat : `,
                            value: codeBlock(`• ${Pays.nom}`) + `\u200B`
                        },
                        {
                            name: `> :white_square_button: Rang : `,
                            value: codeBlock(`• ${Pays.rang}`) + `\u200B`
                        },
                        {
                            name: `> 🔱 Régime politique : `,
                            value: codeBlock(`• ${Pays.regime}`) + `\u200B`
                        },
                        {
                            name: `> 🧠 Idéologie : `,
                            value: codeBlock(`• ${Pays.ideologie}`) + `\u200B`
                        },
                        {
                            name: `> 📃 Devise : `,
                            value: codeBlock(`• ${Pays.devise}`) + `\u200B`
                        },
                        {
                            name: `> <:Pweeter:983399130154008576> Pweeter : `,
                            value: codeBlock(`• ${Pays.pweeter}`) + `\u200B`
                        }
                    ],
                    color: interaction.member.displayColor,
                    timestamp: new Date(),
                    footer: { text: `${Pays.devise}` }
                };

                const row = new ActionRowBuilder()
                    .addComponents(
                        new StringSelectMenuBuilder()
                            .setCustomId('action-gouv')
                            .setPlaceholder(`Effectuer une action`)
                            .addOptions([
                                {
                                    label: `Annonce`,
                                    emoji: `📢`,
                                    description: `Faire une annonce`,
                                    value: 'annonce',
                                },
                                {
                                    label: `Devise`,
                                    emoji: `📃`,
                                    description: `Choisir une nouvelle devise`,
                                    value: 'devise',
                                },
                                {
                                    label: `Drapeau`,
                                    emoji: `🎌`,
                                    description: `Choisir un nouveau drapeau`,
                                    value: 'drapeau',
                                },
                                {
                                    label: `Pweeter`,
                                    emoji: `<:Pweeter:983399130154008576>`,
                                    description: `Changer son pseudo pweeter`,
                                    value: 'pweeter',
                                },
                            ]),
                    );

                await interaction.reply({ embeds: [embed], components: [row] });
            }
        });
    },
};