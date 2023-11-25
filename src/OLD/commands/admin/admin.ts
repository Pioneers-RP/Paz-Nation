import {ActionRowBuilder, AnyComponentBuilder,
    ButtonBuilder,
    SlashCommandBuilder,
    StringSelectMenuBuilder,
    codeBlock
} from 'discord.js';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('admin')
        .setDescription(`Commandes admin`)
        .addSubcommand(subcommand =>
            subcommand
                .setName('start')
                .setDescription('Message pour commencer le jeu'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('reglement')
                .setDescription('Messages du règlement'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('tags')
                .setDescription('Récupérer les tags d\'un forum')),

    async execute(interaction: any) {
        let channelName;
        const {connection} = require('../../index.ts');

        switch (interaction.options.getSubcommand()) {
            case 'tags':
                interaction.client.channels.fetch(process.env.SALON_COMMERCE)
                    .then((tags: { availableTags: any; }) => console.log(tags.availableTags))
                break

            case 'start':
                const embed = {
                    author: {
                        name: `Bienvenue sur 🌍 𝐏𝐀𝐙 𝐍𝐀𝐓𝐈𝐎𝐍 👑`,
                    },
                    title: `\`Commencer à jouer \``,
                    color: 0x3BA55C,
                    description: codeBlock(`Choisissez une ville QUI EXISTE dans une région pour commencer votre aventure !`) + `\n Les territoires déjà pris sont disponibles sur la <#1058462262916042862> ! Vous ne pouvez pas prendre une ville sur un territoire déjà pris !`,
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
                                        label: `Amérique latine`,
                                        emoji: `🇧🇷`,
                                        value: 'amerique_latine',
                                    },
                                    {
                                        label: `Amérique du nord`,
                                        emoji: `🇺🇸`,
                                        value: 'amerique_du_nord',
                                    },
                                    {
                                        label: `Amérique du sud`,
                                        emoji: `🇦🇷`,
                                        value: 'amerique_du_sud',
                                    },
                                    {
                                        label: `Asie du nord`,
                                        emoji: `🇨🇳`,
                                        value: 'asie_du_nord',
                                    },
                                    {
                                        label: `Asie du sud`,
                                        emoji: `🇮🇩`,
                                        value: 'asie_du_sud',
                                    },
                                    {
                                        label: `Europe`,
                                        emoji: `🇪🇺`,
                                        value: 'europe',
                                    },
                                    {
                                        label: `Grand nord`,
                                        emoji: `🇨🇦`,
                                        value: 'grand_nord',
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
                                ]
                            ),
                    );

                interaction.client.channels.fetch('983316109367345152')
                    .then((channel: any) => channel.send({ embeds: [embed], components: [row0] }))
                await interaction.reply({ content: `Bouton envoyé` });
                break;

            case 'reglement':
                const reglement1: object = {
                    author: {
                        name: `Règlement de 🌍 𝐏𝐀𝐙 𝐍𝐀𝐓𝐈𝐎𝐍 👑`,
                    },
                    title: `\`I/ Règles générales \``,
                    description: codeBlock(`- Respectez les TOS (Termes et conditions) de Discord.\n\n- Votre pseudo, votre description (“À propos”) et votre avatar ne doivent pas contenir de message à caractère diffamatoire, haineux, pornographique, et illégaux.`),
                };
                const reglement2: object = {
                    title: `\`II/ Discussions et Langage\``,
                    description: codeBlock(`- Évitez le langage malpoli et vulgaire. Vous avez le droit de dire merde, vous pouvez être familier, mais un langage en majorité correct et poli est préférable.\n\n` +
                        `Remarque : Comme partout, ce serveur est composé de personnes majeures et d'autres mineures.`),
                };
                const reglement3: object = {
                    title: `\`III/ Utilisation du serveur, des salons et des bots\``,
                    description: codeBlock(`- Chaque salon textuel a une fonction particulière. Elles sont précisées dans le nom ou la description (affichée en haut de la fenêtre quand vous êtes dans le salon, cliquez dessus pour l’afficher en entier). Merci de les respecter.\n\n` +
                        `- Publicité : La publicité pour un site, un réseau social ou un serveur est interdite. Si vous souhaitez partager votre contenu ou votre serveur Discord, adressez vous à un membre du Staff.\n\n` +
                        `- NSFW : Il n’y a pas de salons NSFW, le contenu “NSFW” (Not Safe For Work) est tout simplement interdit.\n\n` +
                        `- L’abus des fonctionnalités des bots, l’utilisation de failles et de bugs sont interdits. Si vous en trouvez, signalez-les.`),
                };
                const reglement4: object = {
                    title: `\`IV/ Paz Nation : le jeu\``,
                    description: codeBlock(`- L'utilisation de second compte est strictement interdit.`),
                };

                interaction.client.channels.fetch('829292098921693194')
                    .then((channel: any) => {
                        channel.send({ embeds: [reglement1] })
                        channel.send({embeds: [reglement2]})
                        channel.send({embeds: [reglement3]})
                        channel.send({embeds: [reglement4]})
                    })
                await interaction.reply({ content: `Bouton envoyé` });
                break;
        }
    },
};