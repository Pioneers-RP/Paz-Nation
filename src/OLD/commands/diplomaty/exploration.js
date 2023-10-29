const { SlashCommandBuilder, codeBlock, ActionRowBuilder, ButtonBuilder, ButtonStyle} = require('discord.js');
const { CommandCooldown, msToMinutes } = require("discord-command-cooldown");
const ms = require("ms");
const { setTimeout: wait } = require("node:timers/promises");
const { readFileSync } = require("fs");

const biomeObject = JSON.parse(readFileSync('src/OLD/data/biome.json', 'utf-8'));

module.exports = {
    data: new SlashCommandBuilder()
        .setName('exploration')
        .setDescription(`Envoyer un explorateur en mission`),

    async execute(interaction) {
        const { connection, client } = require("../../index");
        let sql;
        sql = `
            SELECT * FROM diplomatie WHERE id_joueur='${interaction.member.id}';
            SELECT * FROM pays WHERE id_joueur='${interaction.member.id}';
            SELECT * FROM population WHERE id_joueur='${interaction.member.id}';
            SELECT * FROM territoire WHERE id_joueur='${interaction.member.id}'
                    `;
        connection.query(sql, async (err, results) => {if (err) {throw err;}
            const Diplomatie = results[0][0];
            const Pays = results[1][0];
            const Population = results[2][0];
            const Territoire = results[3][0];

            const explorateurCooldown = new CommandCooldown('explorateur', ms(`${eval(`biomeObject.${Territoire.region}.cooldown`)}min`));
            const userCooldowned = await explorateurCooldown.getUser(interaction.member.id);
            if (userCooldowned) {
                const timeLeft = msToMinutes(userCooldowned.msLeft, false);
                const reponse = codeBlock('ansi', `\u001b[0m\u001b[1;31mVous avez déjà envoyé l'explorateur récemment. Il reste ${timeLeft.hours}h ${timeLeft.minutes}min avant que celui-ci ne revienne.`);
                await interaction.reply({content: reponse, ephemeral: true});
            } else {
                function convertMillisecondsToTime(milliseconds) {
                    const seconds = Math.floor(milliseconds / 1000);
                    const hours = Math.floor(seconds / 3600);
                    const minutes = Math.floor((seconds % 3600) / 60);
                    const remainingSeconds = seconds % 60;
                    return `${hours} heures, ${minutes} minutes, ${remainingSeconds} secondes`;
                }

                const embedSuccess = {
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
                        text: `${Pays.devise}`
                    },
                };
                await interaction.reply({embeds: [embedSuccess]});
                await explorateurCooldown.addUser(interaction.member.id);

                const maintenant = new Date();
                const tempsActuel = maintenant.getTime();
                const tempsCooldwon = new Date(tempsActuel + ms(`${eval(`biomeObject.${Territoire.region}.cooldown`)}min`))
                const annee = tempsCooldwon.getFullYear();
                const mois = String(tempsCooldwon.getMonth() + 1).padStart(2, '0'); // Les mois sont indexés à partir de 0 (0 = janvier)
                const jour = String(tempsCooldwon.getDate()).padStart(2, '0');
                const heure = String(tempsCooldwon.getHours()).padStart(2, '0');
                const minute = String(tempsCooldwon.getMinutes()).padStart(2, '0');
                const seconde = String(tempsCooldwon.getSeconds()).padStart(2, '0');
                const dateFormatee = `${annee}-${mois}-${jour} ${heure}:${minute}:${seconde}`;
                sql = `
                    INSERT INTO processus 
                    SET id_joueur="${interaction.user.id}",
                        date="${dateFormatee}",
                        type='exploration'
                `;
                connection.query(sql, async (err) => {if (err) {throw err;}})
            }
        })
    }
};