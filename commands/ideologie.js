const { SlashCommandBuilder, codeBlock } = require('@discordjs/builders');
const { CommandCooldown, msToMinutes } = require('discord-command-cooldown');
const ms = require('ms');
const ideologieCommandCooldown = new CommandCooldown('ideologie', ms('7d'));

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ideologie')
        .setDescription(`Choisissez votre idéologie`)
        .addStringOption(ideologie =>
            ideologie.setName('ideologie')
                .setDescription(`Choisissez votre idéologie`)
                .addChoice(`Oligarchisme`, 'Oligarchisme')
                .addChoice(`Conservatisme`, 'Conservatisme')
                .addChoice(`Libéralisme`, 'Libéralisme')
                .addChoice(`Centriste`, 'Centriste')
                .addChoice(`Socialisme`, 'Socialisme')
                .addChoice(`Communisme`, 'Communisme')
                .addChoice(`Anarchisme`, 'Anarchisme')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('discours')
                .setDescription(`Vous devez faire un discours pour justifier votre acte (Minimum 50 caractères)`)
                .setRequired(true)),

    async execute(interaction) {
        let reponse;
        const { connection } = require('../index.js');

        const ideologie = interaction.options.getString('ideologie');
        const discours = interaction.options.getString('discours');

        const userCooldowned = await ideologieCommandCooldown.getUser(interaction.member.id);
        if (userCooldowned) {
            const timeLeft = msToMinutes(userCooldowned.msLeft, false);
            reponse = codeBlock('diff', `- Vous avez déjà changé votre idéologie récemment. Il reste ${timeLeft.days}j ${timeLeft.hours}h ${timeLeft.minutes}min avant de pouvoir la changer à nouveau.`);
            await interaction.reply({ content: reponse, ephemeral: true });
        } else if (discours.length <= 115) {
            reponse = codeBlock('diff', `- Votre discours doit faire au minimum : 50 caractères`);
            await interaction.reply({ content: reponse, ephemeral: true });
        } else if (discours.length >= 2000) {
            reponse = codeBlock('diff', `- Votre discours doit faire au maximum : 2000 caractères`);
            await interaction.reply({ content: reponse, ephemeral: true });
        } else {

            let sql = `UPDATE pays SET ideologie="${ideologie}" WHERE id_joueur="${interaction.member.id}" LIMIT 1`;
            connection.query(sql, async(err) => {if (err) {throw err;}});

            sql = `SELECT * FROM pays WHERE id_joueur="${interaction.member.id}"`;
            connection.query(sql, async(err, results) => {if (err) {throw err;}

                const annonce = {
                    author: {
                        name: `${results[0].rang} de ${results[0].nom}`,
                        icon_url: interaction.member.displayAvatarURL()
                    },
                    thumbnail: {
                        url: `${results[0].drapeau}`,
                    },
                    title: `Une nouvelle idéologie a été mis en place :`,
                    description: discours,
                    fields: [{
                        name: `> Nouvelle idéologie`,
                        value: `*${ideologie}*`
                    }],
                    color: interaction.member.displayHexColor
                };

                const salon_annonce = interaction.client.channels.cache.get(process.env.SALON_ANNONCE);
                salon_annonce.send({ embeds: [annonce] });
                const reponse = `__**Votre annonce a été publié dans ${salon_annonce}**__`;

                await ideologieCommandCooldown.addUser(interaction.member.id);

                await interaction.reply({ content: reponse });
            });
        }
    },
};