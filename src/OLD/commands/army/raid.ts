import {ActionRowBuilder, ButtonBuilder, ButtonStyle} from 'discord.js';
import {SlashCommandBuilder, codeBlock} from '@discordjs/builders';
import {readFileSync} from 'fs';
import {msToMinutes, CommandCooldown} from "discord-command-cooldown";
import ms from "ms";
import {failReply} from "../../fonctions/functions";
const biomeObject = JSON.parse(readFileSync('src/data/biome.json', 'utf-8'));
const raidCommandCooldown = new CommandCooldown('raid', ms('1d'));

module.exports = {
    data: new SlashCommandBuilder()
        .setName('raid')
        .setDescription(`Lancer un raid sur un pays`)
        .addUserOption(user =>
            user.setName('joueur')
                .setDescription(`Le joueur que vous voulez attaquer`)
                .setRequired(true))
        .addIntegerOption(nombre =>
            nombre.setName('nombre')
                .setDescription(`Le nombre d'Unités que vous voulez envoyer`)
                .setMinValue(1)
                .setRequired(true)),

    async execute(interaction: any) {
        const { connection } = require('../../index.ts');
        const defender = interaction.options.getUser('joueur');
        const numberUnit = interaction.options.getInteger('nombre');
        const userCooldowned = await raidCommandCooldown.getUser(interaction.member.id);

        if (userCooldowned) {
            const timeLeft = msToMinutes(userCooldowned.msLeft, false);
            failReply(interaction, `Vous avez fait un raid récemment. Il reste ${timeLeft.hours}h ${timeLeft.minutes}min avant de pouvoir un faire un nouveau.`);
        } else {
            const sql = `
                SELECT *
                FROM armee
                WHERE id_joueur = '${interaction.member.id}';
                SELECT *
                FROM pays
                WHERE id_joueur = '${defender.id}';
                SELECT *
                FROM territoire
                WHERE id_joueur = '${defender.id}'
            `;
            connection.query(sql, async (err: any, results: any[][]) => {if (err) {throw err;}
                const Armee = results[0][0];
                const Pays = results[1][0];
                const Territoire = results[2][0];

                if (!Pays) {
                    failReply(interaction, `Cette personne ne joue pas.`);
                } else if (Pays.rang === 'Cité') {
                    failReply(interaction, `Vous ne pouvez pas attaquer les cités.`);
                } else if (Pays.vacances === 1) {
                    failReply(interaction, `Vous ne pouvez pas attaquer les joueurs en vacances.`);
                } else if (defender.id === interaction.member.id) {
                    failReply(interaction, `Vous ne pouvez pas vous attaquer vous-même.`);
                } else if (numberUnit > (0.8 * Armee.unite)) {
                    failReply(interaction, `Vous ne pouvez pas envoyer plus de 80% de votre armée.`);
                } else {
                    const embedRaid = {
                        author: {
                            name: `${Pays.rang} de ${Pays.nom}`,
                            icon_url: defender.displayAvatarURL()
                        },
                        thumbnail: {
                            url: Pays.drapeau
                        },
                        title: `\`Lancer un raid\``,
                        fields: [
                            {
                                name: `> 🌄 Territoire :`,
                                value: codeBlock(
                                    `• ${eval(`biomeObject.${Territoire.region}.nom`)}\n` +
                                    `• ${Territoire.T_total.toLocaleString('en-US')} km² total`) + `\u200B`

                            },
                            {
                                name: `> 🪖 Assaut :`,
                                value: codeBlock(
                                    `• ${numberUnit} unités\n`) + `\u200B`
                            },
                        ],
                        color: 0xFF0000,
                        timestamp: new Date(),
                        footer: {
                            text: Pays.devise
                        },
                    };

                    const row = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setLabel(`Raid`)
                                .setEmoji(`⚔️`)
                                .setCustomId(`raid-${defender.id}`)
                                .setStyle(ButtonStyle.Success),
                        )
                        .addComponents(
                            new ButtonBuilder()
                                .setLabel(`Refuser`)
                                .setEmoji(`✋`)
                                .setCustomId(`refuser-${interaction.user.id}`)
                                .setStyle(ButtonStyle.Danger),
                        )

                    await interaction.reply({embeds: [embedRaid], components: [row]});
                }
            });
        }
    },
};