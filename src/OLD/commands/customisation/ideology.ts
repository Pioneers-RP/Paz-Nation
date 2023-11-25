import {SlashCommandBuilder, codeBlock} from 'discord.js';
import {CommandCooldown, msToMinutes} from 'discord-command-cooldown';
import ms from 'ms';
const ideologieCommandCooldown = new CommandCooldown('ideologie', ms('7d'));
import {readFileSync} from "fs";
import {failReply} from "../../fonctions/functions";
const gouvernementObject = JSON.parse(readFileSync('src/OLD/data/gouvernement.json', 'utf-8'));

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ideologie')
        .setDescription(`Choisissez votre idéologie`)
        .addStringOption(ideologie =>
            ideologie.setName('ideologie')
                .setDescription(`Choisissez votre idéologie`)
                .addChoices(
                    { name: `Oligarchisme`, value: 'Oligarchisme'},
                    { name: `Conservatisme`, value: 'Conservatisme'},
                    { name: `Libéralisme`, value: 'Libéralisme'},
                    { name: `Centrisme`, value: 'Centrisme'},
                    { name: `Socialisme`, value: 'Socialisme'},
                    { name: `Communisme`, value: 'Communisme'},
                    { name: `Anarchisme`, value: 'Anarchisme'})
                .setRequired(true))
        .addStringOption(option =>
            option.setName('discours')
                .setDescription(`Vous devez faire un discours pour justifier votre acte`)
                .setMinLength(50)
                .setMaxLength(400)
                .setRequired(true)),

    async execute(interaction: any) {
        const userCooldowned = await ideologieCommandCooldown.getUser(interaction.member.id);

        if (userCooldowned) {
            const timeLeft = msToMinutes(userCooldowned.msLeft, false);
            // @ts-ignore
            failReply(interaction, `Vous avez déjà changé votre idéologie récemment. Il reste ${timeLeft.days}j ${timeLeft.hours}h ${timeLeft.minutes}min avant de pouvoir la changer à nouveau.`)
        } else {
            const { connection } = require('../../index.ts');
            const ideology = interaction.options.getString('ideologie');
            const speech = interaction.options.getString('discours');

            let sql = `UPDATE pays SET ideologie="${ideology}" WHERE id_joueur="${interaction.member.id}" LIMIT 1`;
            connection.query(sql, async(err: any) => {if (err) {throw err;}});

            sql = `SELECT * FROM pays WHERE id_joueur="${interaction.member.id}"`;
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
                    description: speech + `\u200B\n`,
                    fields: [{
                        name: `> 🧠 Nouvelle idéologie :`,
                        value: `*${ideology}*` + `\u200B`
                    }],
                    color: interaction.member.displayColor,
                    footer: { text: `${Pays.devise}` }
                };
                interaction.client.channels.fetch(process.env.SALON_ANNONCE)
                    .then((channel: any) => {
                        channel.send({ embeds: [annonce] })
                        interaction.reply({ content: `__**Votre annonce a été publié dans ${channel}**__` })
                    })
                await ideologieCommandCooldown.addUser(interaction.member.id);
            });

            sql = `
                SELECT * FROM diplomatie WHERE id_joueur='${interaction.member.id}';
                SELECT * FROM pays WHERE id_joueur='${interaction.member.id}'
            `;
            connection.query(sql, async (err: any, results: any[][]) => {if (err) {throw err;}
                const Diplomatie = results[0][0];
                const Pays = results[1][0]

                function cg(influence: number, gouv: number, jour: number) {
                    let cg: number = (72.4+(310.4-72.4)/180*jour)*gouv*Math.exp(influence*0.01)
                    return parseFloat(cg.toFixed(2))
                }

                let sql = `UPDATE territoire SET cg=${cg(Diplomatie.influence, eval(`gouvernementObject.${Pays.ideologie}.gouvernance`), (Pays.jour))} WHERE id_joueur="${interaction.member.id}"`;
                connection.query(sql, async (err: any) => {if (err) {throw err;}})
            })
        }
    },
};