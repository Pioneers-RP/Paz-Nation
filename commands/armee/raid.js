const { ActionRowBuilder, ButtonBuilder, ButtonStyle} = require('discord.js');
const { SlashCommandBuilder, codeBlock } = require('@discordjs/builders');
const { readFileSync } = require('fs');
const {msToMinutes, CommandCooldown} = require("discord-command-cooldown");
const ms = require("ms");
const biomeObject = JSON.parse(readFileSync('data/biome.json', 'utf-8'));
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

    async execute(interaction) {
        const { connection } = require('../../index.js');
        const joueur = interaction.options.getUser('joueur');
        const nombre = interaction.options.getInteger('nombre');
        let sql;

        const userCooldowned = await raidCommandCooldown.getUser(interaction.member.id);

        if (userCooldowned) {
            const timeLeft = msToMinutes(userCooldowned.msLeft, false);
            const reponse = codeBlock('ansi', `\u001b[0;0m\u001b[1;31mVous avez fait un raid récemment. Il reste ${timeLeft.hours}h ${timeLeft.minutes}min avant de pouvoir un faire un nouveau.`);
            await interaction.reply({ content: reponse, ephemeral: true });
        } else {
            sql = `
                SELECT *
                FROM armee
                WHERE id_joueur = '${interaction.member.id}';
                SELECT *
                FROM pays
                WHERE id_joueur = '${joueur.id}';
                SELECT *
                FROM territoire
                WHERE id_joueur = '${joueur.id}'
            `;
            connection.query(sql, async (err, results) => {if (err) {throw err;}
                const Armee = results[0][0];
                const Pays = results[1][0];
                const Territoire = results[2][0];

                if (!Pays) {
                    const reponse = codeBlock('ansi', `\u001b[0;0m\u001b[1;31mCette personne ne joue pas.`);
                    await interaction.reply({content: reponse, ephemeral: true});
                } else if (Pays.rang === 'Cité') {
                    const reponse = codeBlock('ansi', `\u001b[0;0m\u001b[1;31mVous ne pouvez pas attaquer les cités.`);
                    await interaction.reply({content: reponse, ephemeral: true});
                } else if (Pays.vacances === 1) {
                    const reponse = codeBlock('ansi', `\u001b[0;0m\u001b[1;31mVous ne pouvez pas attaquer les joueurs en vacances.`);
                    await interaction.reply({content: reponse, ephemeral: true});
                } else if (joueur.id === interaction.member.id) {
                    const reponse = codeBlock('ansi', `\u001b[0;0m\u001b[1;31mVous ne pouvez pas vous attaquer vous-même.`);
                    await interaction.reply({content: reponse, ephemeral: true});
                } else if (nombre > (0.8 * Armee.unite)) {
                    const reponse = codeBlock('ansi', `\u001b[0;0m\u001b[1;31mVous ne pouvez pas envoyer plus de 80% de votre armée.`);
                    await interaction.reply({content: reponse, ephemeral: true});
                } else {
                    const embed = {
                        author: {
                            name: `${Pays.rang} de ${Pays.nom}`,
                            icon_url: joueur.displayAvatarURL()
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
                                    `• ${nombre} unités\n`) + `\u200B`
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
                                .setCustomId(`raid-${joueur.id}`)
                                .setStyle(ButtonStyle.Success),
                        )
                        .addComponents(
                            new ButtonBuilder()
                                .setLabel(`Refuser`)
                                .setEmoji(`✋`)
                                .setCustomId(`refuser-${interaction.user.id}`)
                                .setStyle(ButtonStyle.Danger),
                        )

                    await interaction.reply({embeds: [embed], components: [row]});
                }
            });
        }
    },
};