const { SlashCommandBuilder, codeBlock } = require('@discordjs/builders');
const { CommandCooldown, msToMinutes } = require('discord-command-cooldown');
const ms = require('ms');
const pweeterCommandCooldown = new CommandCooldown('devise', ms('7d'));

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pweeter')
        .setDescription(`Choisissez le nom de votre compte pweeter`)
        .addStringOption(option =>
            option.setName('compte')
            .setDescription(`Votre compte (Maximum 60 caractères)`)
            .setRequired(true)),

    async execute(interaction) {
        let reponse;
        const { connection } = require('../index.js');

        const compte = interaction.options.getString('compte');

        const userCooldowned = await pweeterCommandCooldown.getUser(interaction.member.id);
        if (userCooldowned) {
            const timeLeft = msToMinutes(userCooldowned.msLeft, false);
            reponse = codeBlock('diff', `- Vous avez déjà changé le nom de votre compte récemment. Il reste ${timeLeft.days}j ${timeLeft.hours}h ${timeLeft.minutes}min avant de pouvoir la changer à nouveau.`);
            await interaction.reply({ content: reponse, ephemeral: true });
        } else {
            if (compte.length <= 60) {

                let newcompte = "";

                for (let i = 0; i < compte.length; i++)
                    if (!(compte[i] == '\n' || compte[i] == '\r'))
                        newcompte += compte[i];

                let sql = `UPDATE pays SET pweeter="@${newcompte}" WHERE id_joueur='${interaction.member.id}' LIMIT 1`;
                connection.query(sql, async(err) => {if (err) {throw err;}});

                sql = `SELECT * FROM pays WHERE id_joueur='${interaction.member.id}'`;

                connection.query(sql, async(err, results) => {if (err) {throw err;}

                    const embed = {
                        author: {
                            name: `${results[0].rang} de ${results[0].nom}`,
                            icon_url: interaction.member.displayAvatarURL()
                        },
                        thumbnail: {
                            url: `${results[0].drapeau}`,
                        },
                        title: `\`Votre compte Pweeter s'appelle désormais :\``,
                        description: newcompte,
                        color: interaction.member.displayHexColor
                    };

                    await interaction.reply({ embeds: [embed] });

                    await pweeterCommandCooldown.addUser(interaction.member.id);
                });
            } else {
                reponse = codeBlock('diff', `- Le nom de votre compte doit faire au maximum : 60 caractères`);
                await interaction.reply({ content: reponse, ephemeral: true });
            }
        }
    },
};