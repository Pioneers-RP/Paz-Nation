import {SlashCommandBuilder, codeBlock, Embed} from 'discord.js';
import {connection} from "../../index";
import {failReply} from "../../fonctions/functions";
const isImageURL = require('image-url-validator').default;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pweet')
        .setDescription(`Faites un pweet`)
        .addStringOption(option =>
            option.setName('pweet')
            .setDescription(`Le contenu de votre pweet (Maximum 280 caractères)`)
                .setMaxLength(280)
            .setRequired(true))
        .addStringOption(option =>
            option.setName('url')
            .setDescription(`L'URL de l'image`)),

    async execute(interaction: any) {
        const { connection } = require('../../index.ts');
        const pweet = interaction.options.getString('pweet');
        const image = interaction.options.getString('url');
        const channelPweeter = interaction.client.channels.cache.get(process.env.SALON_PWEETER);

        const sql = `SELECT * FROM pays WHERE id_joueur='${interaction.member.id}'`;
        connection.query(sql, async(err: any, results: any[]) => {if (err) {throw err;}
            const Pays = results[0];

            let embedPweet: any = {
                author: {
                    name: `${Pays.rang} de ${Pays.nom}`,
                    icon_url: interaction.member.displayAvatarURL()
                },
                timestamp: new Date(),
                description: `**${interaction.user.username} <:Certif:981918077027504159> (${Pays.pweeter})\n\u200B**` + pweet,
                footer: {
                    text: "Pweeter",
                    icon_url: "https://cdn.discordapp.com/attachments/939251032297463879/981915716821319680/Pweeter.png"
                },
                color: 0x1bc7df,
            }
            if (image) {
                if (await isImageURL(image)) {
                    embedPweet.image = { url: image };
                    channelPweeter.send({ embeds: [embedPweet] }).then((sentMessage: { react: (arg0: string) => void; }) => {
                        sentMessage.react('<:Pike:981918620282134579>');
                    });
                    await interaction.reply({ content: channelPweeter });
                } else {
                    failReply(interaction, `Vous n'avez pas fourni une URL valide`);
                }
            }
        });
    }
};