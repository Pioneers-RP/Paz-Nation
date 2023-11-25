import {SlashCommandBuilder, codeBlock} from 'discord.js';
import {CommandCooldown, msToMinutes} from 'discord-command-cooldown';
import ms from 'ms';
import {failReply} from "../../fonctions/functions";
const regimeCommandCooldown = new CommandCooldown('régime', ms('7d'));

module.exports = {
    data: new SlashCommandBuilder()
        .setName('regime')
        .setDescription(`Choisissez votre régime politique`)
        .addStringOption(gouvernement =>
            gouvernement.setName('forme')
                .setDescription(`Votre forme de gouvernement`)
                .addChoices(
                    { name: `Duché`, value: 'Duché'},
                    { name: `Emirat`, value: 'Emirat'},
                    { name: `Principauté`, value: 'Principauté'},
                    { name: `République`, value: 'République'},
                    { name: `République fédérale`, value: 'République fédérale'},
                    { name: `République populaire`, value: 'République populaire'},
                    { name: `Royaume`, value: 'Royaume'},
                    { name: `Sultanat`, value: 'Sultanat'})
                .setRequired(true))
        .addStringOption(option =>
            option.setName('discours')
                .setDescription(`Vous devez faire un discours pour justifier votre acte`)
                .setMinLength(50)
                .setMaxLength(400)
                .setRequired(true)),

    async execute(interaction: any) {
        const { connection } = require('../../index.ts');

        const userCooldowned = await regimeCommandCooldown.getUser(interaction.member.id);
        if (userCooldowned) {
            const timeLeft = msToMinutes(userCooldowned.msLeft, false);
            // @ts-ignore
            failReply(interaction, `Vous avez déjà changé votre gouvernement récemment. Il reste ${timeLeft.days}j ${timeLeft.hours}h ${timeLeft.minutes}min avant de pouvoir le changer à nouveau.`)
        } else {
            const regime = interaction.options.getString('forme');
            const speech = interaction.options.getString('discours');

            let sql = `UPDATE pays SET regime="${regime}" WHERE id_joueur=${interaction.member.id} LIMIT 1`;
            connection.query(sql, async(err: any) => {if (err) {throw err;}});

            sql = `SELECT * FROM pays WHERE id_joueur=${interaction.member.id}`;
            connection.query(sql, async(err: any, results: any[]) => {if (err) {throw err;}
                const Pays = results[0];

                const annonce = {
                    author: {
                        name: `${Pays.rang} de ${Pays.nom}`,
                        icon_url: interaction.member.displayAvatarURL()
                    },
                    thumbnail: {
                        url: Pays.drapeau
                    },
                    title: `\`Annonce officielle :\``,
                    description: speech + `\u200B`,
                    fields: [{
                        name: `> 🔱 Nouveau régime :`,
                        value: `*${regime}*` + `\u200B`
                    }],
                    color: interaction.member.displayColor,
                    timestamp: new Date(),
                    footer: {
                        text: Pays.devise
                    }
                };
                interaction.client.channels.fetch(process.env.SALON_ANNONCE)
                    .then((channel: any) => {
                        channel.send({ embeds: [annonce] });
                        interaction.reply({ content: `__**Votre annonce a été publié dans ${channel}**__` });
                    })
                await regimeCommandCooldown.addUser(interaction.member.id);
            });
        }
    },
};