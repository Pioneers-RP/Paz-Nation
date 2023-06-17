const { ActionRowBuilder, ButtonBuilder, SlashCommandBuilder, StringSelectMenuBuilder, codeBlock} = require('discord.js');

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
                .addChoices(
                    { name: `Argent`, value: 'cash' },
                    { name: `Biens de consommation`, value: 'bc'},
                    { name: `Bois`, value: 'bois'},
                    { name: `Eau`, value: 'eau'},
                    { name: `Métaux`, value: 'metaux'},
                    { name: `Nourriture`, value: 'nourriture'},
                    { name: `Pétrole`, value: 'petrole'},
                    { name: `Population`, value: 'population'},
                    { name: `Territoire libre`, value: 'T_libre'},
                    { name: `Territoire occupé`, value: 'T_occ'})
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
            .setName('reglement')
            .setDescription('NE PAS UTILISER SVP'))
        .addSubcommand(subcommand =>
            subcommand
            .setName('lock')
            .setDescription('NE PAS UTILISER SVP'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('tags')
                .setDescription('NE PAS UTILISER SVP')),

    async execute(interaction) {
        let channelName;
        const { connection } = require('../../index.js');
        let embed;

        switch (interaction.options.getSubcommand()) {
            case 'tags':
                const salon_commerce = interaction.client.channels.cache.get(process.env.SALON_COMMERCE);
                console.log(salon_commerce.availableTags)
                break
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
                                    color: interaction.member.displayColor
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
                            color: joueur.displayColor,
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
                        description: codeBlock(`Choisissez une cité dans une région pour commencer votre aventure !`) + `\n Pour cela, aidez-vous de la [carte](https://cdn.discordapp.com/attachments/983319236942368818/987077067227152444/unknown.png).`,
                    };

                    const row0 = new ActionRowBuilder()
                        .addComponents(
                            new StringSelectMenuBuilder()
                                .setCustomId('menu_start')
                                .setPlaceholder(`La région de votre futur cité`)
                                .addOptions([
                                    {
                                        label: `Afrique australe`,
                                        emoji: `🇿🇦`,
                                        value: 'afrique_australe',
                                    },
                                    {
                                        label: `Afrique équatoriale`,
                                        emoji: `🇨🇩`,
                                        value: 'afrique_equatoriale',
                                    },
                                    {
                                        label: `Afrique du nord`,
                                        emoji: `🇩🇿`,
                                        value: 'afrique_du_nord',
                                    },
                                    {
                                        label: `Amérique du nord`,
                                        emoji: `🇺🇸`,
                                        value: 'amerique_du_nord',
                                    },
                                    {
                                        label: `Amérique latine du nord`,
                                        emoji: `🇧🇷`,
                                        value: 'nord_amerique_latine',
                                    },
                                    {
                                        label: `Amérique latine du sud`,
                                        emoji: `🇦🇷`,
                                        value: 'sud_amerique_latine',
                                    },
                                    {
                                        label: `Asie du nord`,
                                        emoji: `🇯🇵`,
                                        value: 'asie_du_nord',
                                    },
                                    {
                                        label: `Asie du sud`,
                                        emoji: `🇮🇳`,
                                        value: 'asie_du_sud',
                                    },
                                    {
                                        label: `Europe`,
                                        emoji: `🇪🇺`,
                                        value: 'europe',
                                    },
                                    {
                                        label: `Moyen orient`,
                                        emoji: `🇸🇦`,
                                        value: 'moyen_orient',
                                    },
                                    {
                                        label: `Océanie`,
                                        emoji: `🇦🇺`,
                                        value: 'oceanie',
                                    },
                                    {
                                        label: `Pays du nord`,
                                        emoji: `🇨🇦`,
                                        value: 'pays_du_nord',
                                    },
                                ]
                            ),
                        );

                    const salon_début = interaction.client.channels.cache.get('943105388960690238');
                    salon_début.send({ embeds: [embed], components: [row0] });
                    await interaction.reply({ content: `Bouton envoyé` });
                    break;

            case 'reglement':
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
                    title: `\`IV/ Paz Nation : le jeu\``,
                    description: codeBlock(`- L'utilisation de second compte est strictement interdit.`),
                };

                const salon_reglement = interaction.client.channels.cache.get('829292098921693194');
                salon_reglement.send({ embeds: [reglement1] })
                salon_reglement.send({ embeds: [reglement2] })
                salon_reglement.send({ embeds: [reglement3] })
                salon_reglement.send({ embeds: [reglement4] })
                await interaction.reply({ content: `Bouton envoyé` });
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