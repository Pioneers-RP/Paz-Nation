import {SlashCommandBuilder, codeBlock, ActionRowBuilder, ButtonBuilder, ButtonStyle} from 'discord.js';
import {CommandCooldown, msToMinutes} from "discord-command-cooldown";
import ms from "ms";
import {readFileSync} from "fs";
import {convertMillisecondsToTime, failReply} from "../../fonctions/functions";

const biomeObject = JSON.parse(readFileSync('src/OLD/data/biome.json', 'utf-8'));

module.exports = {
    data: new SlashCommandBuilder()
        .setName('exploration')
        .setDescription(`Envoyer un explorateur en mission`),

    async execute(interaction: any) {
        const { connection } = require("../../index");
        let sql;
        sql = `
            SELECT * FROM diplomatie WHERE id_joueur='${interaction.member.id}';
            SELECT * FROM pays WHERE id_joueur='${interaction.member.id}';
            SELECT * FROM population WHERE id_joueur='${interaction.member.id}';
            SELECT * FROM territoire WHERE id_joueur='${interaction.member.id}'
                    `;
        connection.query(sql, async (err: any, results: any[][]) => {if (err) {throw err;}
            const Diplomatie = results[0][0];
            const Pays = results[1][0];
            const Population = results[2][0];
            const Territoire = results[3][0];

            const explorateurCooldown = new CommandCooldown('explorateur', ms(`${eval(`biomeObject.${Territoire.region}.cooldown`)}min`));
            const userCooldowned = await explorateurCooldown.getUser(interaction.member.id);
            if (userCooldowned) {
                const timeLeft = msToMinutes(userCooldowned.msLeft, false);
                failReply(interaction, `Vous avez déjà envoyé l'explorateur récemment. Il reste ${timeLeft.hours}h ${timeLeft.minutes}min avant que celui-ci ne revienne.`)
            } else {
                const embedExploration = {
                    author: {
                        name: `${Pays.rang} de ${Pays.nom}`,
                        icon_url: interaction.member.displayAvatarURL()
                    },
                    thumbnail: {
                        url: Pays.drapeau
                    },
                    title: `\`Expansion territoriale\``,
                    description: codeBlock(
                        `• Vous avez envoyé l'explorateur en mission.\n` +
                        `• Celui-ci vous notifira de sa rentrée dans ${convertMillisecondsToTime(ms(`${eval(`biomeObject.${Territoire.region}.cooldown`)}min`))}.`) + `\u200B`,
                    color: interaction.member.displayColor,
                    timestamp: new Date(),
                    footer: {
                        text: Pays.devise
                    },
                };
                await interaction.reply({embeds: [embedExploration]});
                await explorateurCooldown.addUser(interaction.member.id);

                const now = new Date();
                const actualTime = now.getTime();
                const cooldownTime = new Date(actualTime + ms(`${eval(`biomeObject.${Territoire.region}.cooldown`)}min`))
                const year = cooldownTime.getFullYear();
                const month = String(cooldownTime.getMonth() + 1).padStart(2, '0');
                const day = String(cooldownTime.getDate()).padStart(2, '0');
                const hour = String(cooldownTime.getHours()).padStart(2, '0');
                const minute = String(cooldownTime.getMinutes()).padStart(2, '0');
                const seconde = String(cooldownTime.getSeconds()).padStart(2, '0');
                const dateFormated = `${year}-${month}-${hour} ${day}:${minute}:${seconde}`;
                sql = `
                    INSERT INTO processus 
                    SET id_joueur="${interaction.user.id}",
                        date="${dateFormated}",
                        type='exploration'
                `;
                connection.query(sql, async (err: any) => {if (err) {throw err;}})
            }
        })
    }
};