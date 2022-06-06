const { SlashCommandBuilder, codeBlock } = require('@discordjs/builders');
const { MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('admin')
        .setDescription(`Commandes admin`)
        .addSubcommand(subcommand =>
            subcommand
            .setName('give')
            .setDescription('Donner un item à joueur')
            .addUserOption(option =>
                option.setName('joueur')
                .setDescription('Le joueur à qui donner')
                .setRequired(true))
            .addStringOption(item =>
                item.setName('item')
                .setDescription(`L'item à donner`)
                .addChoice(`Argent`, 'cash')
                .addChoice(`Biens de consommation`, 'bc')
                .addChoice(`Bois`, 'bois')
                .addChoice(`Brique`, 'brique')
                .addChoice(`Eau`, 'eau')
                .addChoice(`Métaux`, 'metaux')
                .addChoice(`Nourriture`, 'nourriture')
                .addChoice(`Pétrole`, 'petrole')
                .addChoice(`Point d'action diplomatique`, 'action_diplo')
                .addChoice(`Population`, 'population')
                .addChoice(`Réputation`, 'reputation')
                .addChoice(`Territoire libre`, 'T_libre')
                .addChoice(`Territoire occupé`, 'T_occ')
                .setRequired(true))
            .addIntegerOption(quantité =>
                quantité.setName('quantité')
                .setDescription(`La quantité que vous voulez donner`)
                .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
            .setName('bouton')
            .setDescription('NE PAS UTILISER SVP')),

    async execute(interaction) {
        const { connection } = require('../index.js');

        switch (interaction.options.getSubcommand()) {
            case 'give':
                const joueur = interaction.options.getUser('joueur');
                const item = interaction.options.getString('item');
                var quantité = interaction.options.getInteger('quantité');

                var sql = `
                    SELECT * FROM pays WHERE id_joueur=${joueur.id}`;

                connection.query(sql, async(err, results) => {
                    if (err) {
                        throw err;
                    }

                    if (!results[0]) {
                        var reponse = codeBlock('diff', `- Cette personne ne joue pas.`);
                        await interaction.reply({ content: reponse, ephemeral: true });
                    } else {

                        var sql = `
                            UPDATE pays SET ${item}=${item}+${quantité} WHERE id_joueur="${joueur.id}"`;

                        if (item === 'T_libre' | 't_occ') {
                            var sql = sql + `;
                            UPDATE pays SET T_total=T_total+${quantité} WHERE id_joueur=${interaction.user.id}`

                            if ((results[0].T_total + quantité) > (results[0].hexagone * 15000)) {
                                var sql = sql + `;
                                    UPDATE pays SET hexagone=hexagone+1 WHERE id_joueur=${interaction.user.id}`

                                var annonce = {
                                    author: {
                                        name: `${results[0].rang} de ${results[0].nom}`,
                                        icon_url: interaction.member.displayAvatarURL()
                                    },
                                    thumbnail: {
                                        url: results[0].drapeau,
                                    },
                                    title: `\`Le/la ${results[0].regime} a désormais une influence sur une nouvelle case\``,
                                    description: `> Direction : ${results[0].direction}`,
                                    timestamp: new Date(),
                                    footer: {
                                        text: `${results[0].devise}`
                                    },
                                    color: interaction.member.displayHexColor
                                };

                                const salon_carte = interaction.client.channels.cache.get(process.env.SALON_CARTE);
                                salon_carte.send({ embeds: [annonce] });

                                const salon_joueur = interaction.client.channels.cache.get(results[0].id_salon);
                                salon_joueur.send({ content: `__**Vous vous êtes étendu sur une nouvelle case : ${salon_carte}**__` });
                            }
                        }
                        connection.query(sql, async(err, results) => {
                            if (err) {
                                throw err;
                            }
                        });

                        const embed = {
                            author: {
                                name: `${results[0].rang} de ${results[0].nom}`,
                                icon_url: joueur.displayAvatarURL()
                            },
                            thumbnail: {
                                url: `${results[0].drapeau}`
                            },
                            title: `\`Give par ${interaction.member.displayName}\``,
                            color: joueur.displayHexColor,
                            timestamp: new Date(),
                            footer: {
                                text: `${results[0].devise}`
                            },
                        };

                        await interaction.reply({ embeds: [embed] });
                    };
                });
                break;
            case 'bouton':

                const embed = {
                    title: `\`Accepter le réglement\``,
                    description: `En cliquant sur le bouton ci-dessous, vous acceptez le réglement`,
                    color: '#3BA55C',
                    timestamp: new Date(),
                    footer: {
                        text: `Bienvenue sur 🌍 𝐏𝐀𝐙 𝐍𝐀𝐓𝐈𝐎𝐍 👑 V3`
                    },
                };

                const row = new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                        .setLabel(`Rejoindre le serveur`)
                        .setEmoji(`✔`)
                        .setCustomId('réglement')
                        .setStyle('SUCCESS'),
                    )

                const salon_reglement = interaction.client.channels.cache.get('942796849222398039');
                salon_reglement.send({ embeds: [embed], components: [row] })
                await interaction.reply({ content: `Bouton envoyé` });
        }
    },
};