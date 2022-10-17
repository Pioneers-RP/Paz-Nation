const { SlashCommandBuilder, codeBlock } = require('@discordjs/builders');
const { MessageActionRow, MessageButton, MessageSelectMenu } = require('discord.js');

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
            .setName('start')
            .setDescription('NE PAS UTILISER SVP'))
        .addSubcommand(subcommand =>
            subcommand
            .setName('bouton')
            .setDescription('NE PAS UTILISER SVP'))
        .addSubcommand(subcommand =>
            subcommand
            .setName('role')
            .setDescription('NE PAS UTILISER SVP'))
        .addSubcommand(subcommand =>
            subcommand
            .setName('lock')
            .setDescription('NE PAS UTILISER SVP')),

    async execute(interaction) {
        let channelName;
        const { connection } = require('../index.js');

        let embed;switch (interaction.options.getSubcommand()) {
            case 'give':
                const joueur = interaction.options.getUser('joueur');
                const item = interaction.options.getString('item');
                const quantite = interaction.options.getInteger('quantité');

                const sql = `SELECT * FROM pays WHERE id_joueur=${joueur.id}`;
                connection.query(sql, async(err, results) => {if (err) { throw err; }

                    if (!results[0]) {
                        const reponse = codeBlock('diff', `- Cette personne ne joue pas.`);
                        await interaction.reply({ content: reponse, ephemeral: true });
                    } else {

                        let sql = `UPDATE pays SET ${item}=${item}+${quantite} WHERE id_joueur="${joueur.id}"`;

                        if (item === 'T_libre' || 't_occ') {
                            sql = sql + `;UPDATE pays SET T_total=T_total+${quantite} WHERE id_joueur=${interaction.user.id}`;

                            if ((results[0].T_total + quantite) > (results[0].hexagone * 15000)) {
                                sql = sql + `;UPDATE pays SET hexagone=hexagone+1 WHERE id_joueur=${interaction.user.id}`;

                                const annonce = {
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
                        connection.query(sql, async(err, results) => { if (err) { throw err; } });

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
                    }
                });
                break;

                case 'start':
                    embed = {
                        author: {
                            name: `Bienvenue sur 🌍 𝐏𝐀𝐙 𝐍𝐀𝐓𝐈𝐎𝐍 👑`,
                        },
                        title: `\`Commencer à jouer \``,
                        color: '#3BA55C',
                        description: codeBlock(`Cliquez sur le bouton ci dessous pour commencer votre aventure.`),
                    };

                    let row = new MessageActionRow()
                        .addComponents(
                            new MessageButton()
                                .setLabel(`Créer votre Cité`)
                                .setEmoji(`📯`)
                                .setCustomId('start')
                                .setStyle('SUCCESS'),
                        );

                    await interaction.reply({ embeds: [embed], components: [row] });
                    break;

            case 'bouton':
                const reglement1 = {
                    author: {
                        name: `Règlement de 🌍 𝐏𝐀𝐙 𝐍𝐀𝐓𝐈𝐎𝐍 👑`,
                    },
                    title: `\`I/ Règles générales \``,
                    description: codeBlock(`- Respectez les TOS (Termes et conditions) de Discord.\n\n- Votre pseudo, votre description (“À propos”) et votre avatar ne doivent pas contenir de message à caractère diffamatoire, haineux, pornographique, et illégaux.`),
                };
                const reglement2 = {
                    title: `\`II/ Discussions et Langage\``,
                    description: codeBlock(`- Évitez le langage malpoli et vulgaire. Vous avez le droit de dire merde, vous pouvez être familier, mais un langage en majorité correct et poli est préférable.\n\n` +
                        `Remarque : Comme partout, ce serveur est composé de personnes majeures et d'autres mineures.`),
                };
                const reglement3 = {
                    title: `\`III/ Utilisation du serveur, des salons et des bots\``,
                    description: codeBlock(`- Chaque salon textuel a une fonction particulière. Elles sont précisées dans le nom ou la description (affichée en haut de la fenêtre quand vous êtes dans le salon, cliquez dessus pour l’afficher en entier). Merci de les respecter.\n\n` +
                        `- Publicité : La publicité pour un site, un réseau social ou un serveur est interdite. Si vous souhaitez partager votre contenu ou votre serveur Discord, adressez vous à un membre du Staff.\n\n` +
                        `- NSFW : Il n’y a pas de salons NSFW, le contenu “NSFW” (Not Safe For Work) est tout simplement interdit.\n\n` +
                        `- L’abus des fonctionnalités des bots, l’utilisation de failles et de bugs sont interdits. Si vous en trouvez, signalez-les.`),
                };
                const reglement4 = {
                    title: `\`IV/ Paz Nation le jeu\``,
                    description: codeBlock(` - Paz Nation est un Semi-Rp géopolitique, des salons sont dédiés pour le rp et d'autre non, merci donc de bien vouloir respecter.\n\n` +
                        `- L'utilisation de second compte est strictement interdit.`),
                };

                embed = {
                    title: `\`Accepter le réglement\``,
                    description: `En cliquant sur le bouton ci-dessous, vous acceptez le réglement`,
                    color: '#3BA55C',
                    timestamp: new Date(),
                    footer: {
                        text: `Bienvenue sur 🌍 𝐏𝐀𝐙 𝐍𝐀𝐓𝐈𝐎𝐍 👑 V3`
                    },
                };

                row = new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setLabel(`Rejoindre le serveur`)
                            .setEmoji(`✔`)
                            .setCustomId('réglement')
                            .setStyle('SUCCESS'),
                    );

                const salon_reglement = interaction.client.channels.cache.get('829292098921693194');
                salon_reglement.send({ embeds: [reglement1] })
                salon_reglement.send({ embeds: [reglement2] })
                salon_reglement.send({ embeds: [reglement3] })
                salon_reglement.send({ embeds: [reglement4] })
                salon_reglement.send({ embeds: [embed], components: [row] })
                await interaction.reply({ content: `Bouton envoyé` });
                break;

            case 'role':

                embed = {
                    title: `\`👥 » Rôles Notifications\``,
                    description: `<@&845691866116915250> Pour être averti(e) des annonces\n` +
                        `<@&845692674111045673> Pour être averti(e) des concours\n` +
                        `<@&845691209027813417> Pour être averti(e) des giveaways\n` +
                        `<@&845691285678587935> Pour être averti(e) des animations\n` +
                        `<@&845691874111127552> Pour être averti(e) des mises à jour`,
                    color: '#3BA55C',
                    timestamp: new Date(),
                    footer: {
                        text: `Bienvenue sur 🌍 𝐏𝐀𝐙 𝐍𝐀𝐓𝐈𝐎𝐍 👑 V3`
                    },
                };

                row = new MessageActionRow()
                    .addComponents(
                        new MessageSelectMenu()
                            .setCustomId('roles')
                            .setMaxValues(5)
                            .setPlaceholder(`Vos rôles notifications`)
                            .addOptions([{
                                label: `Annonce`,
                                emoji: `📢`,
                                description: `Pour être averti(e) d'une annonce`,
                                value: 'annonce',
                            },
                                {
                                    label: `Concours`,
                                    emoji: `🏆`,
                                    description: `Pour être averti(e) d'un concours`,
                                    value: 'concours',
                                },
                                {
                                    label: `Giveaway`,
                                    emoji: `🎁`,
                                    description: `Pour être averti(e) d'un giveaway`,
                                    value: 'giveaway',
                                },
                                {
                                    label: `Animation`,
                                    emoji: `🧩`,
                                    description: `Pour être averti(e) des animations`,
                                    value: 'animation',
                                },
                                {
                                    label: `Mise à jour`,
                                    emoji: `🎮`,
                                    description: `Pour être averti(e) d'une mise à jour`,
                                    value: 'mise_a_jour',
                                }
                            ]),
                    );

                const salon_roles = interaction.client.channels.cache.get('845657854266441768');
                salon_roles.send({ embeds: [embed], components: [row] })
                await interaction.reply({ content: `Roles envoyés` });
                break;
            case 'lock':
                const channel = interaction.channel;
                if (channel.name.includes("🔒") == true) {
                    channelName = channel.name.slice(2);
                    channel.setName(channelName);
                    channel.permissionOverwrites.edit('875056356820918292', { SEND_MESSAGES: true })
                    await interaction.reply({ content: `Channel lock` });
                } else {
                    channelName = channel.name;
                    channel.setName("🔒-" + channelName);
                    channel.permissionOverwrites.edit('875056356820918292', { SEND_MESSAGES: false })
                    await interaction.reply({ content: `Channel unlock` });
                }
        }
    },
};