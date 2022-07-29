const { SlashCommandBuilder, codeBlock } = require('@discordjs/builders');
const { CommandCooldown, msToMinutes } = require('discord-command-cooldown');
const ms = require('ms');
const régimeCommandCooldown = new CommandCooldown('régime', ms('7d'));

module.exports = {
    data: new SlashCommandBuilder()
        .setName('regime')
        .setDescription(`Choisissez votre régime politique`)
        .addStringOption(gouvernement =>
            gouvernement.setName('forme')
            .setDescription(`Votre forme de gouvernement`)
            .addChoice(`Duché`, 'Duché')
            .addChoice(`Emirat`, 'Emirat')
            .addChoice(`Principauté`, 'Principauté')
            .addChoice(`République`, 'République')
            .addChoice(`Royaume`, 'Royaume')
            .setRequired(true))
        .addStringOption(option =>
            option.setName('discours')
            .setDescription(`Vous devez faire un discours pour justifier votre acte (Minimum 50 caractères)`)
            .setRequired(true)),

    async execute(interaction) {
        const { connection } = require('../index.js');

        const régime = interaction.options.getString('forme');
        const discours = interaction.options.getString('discours');

        const userCooldowned = await régimeCommandCooldown.getUser(interaction.member.id);
        if (userCooldowned) {
            const timeLeft = msToMinutes(userCooldowned.msLeft, false);
            var reponse = codeBlock('diff', `- Vous avez déjà changé votre gouvernement récemment. Il reste ${timeLeft.days}j ${timeLeft.hours}h ${timeLeft.minutes}min avant de pouvoir le changer à nouveau.`);
            await interaction.reply({ content: reponse, ephemeral: true });
        } else if (discours.length <= 115) {
            var reponse = codeBlock('diff', `- Votre discours doit faire au minimum : 50 caractères`);
            await interaction.reply({ content: reponse, ephemeral: true });
        } else if (discours.length >= 2000) {
            var reponse = codeBlock('diff', `- Votre discours doit faire au maximum : 2000 caractères`);
            await interaction.reply({ content: reponse, ephemeral: true });
        } else {

            var sql = `UPDATE pays SET regime="${régime}" WHERE id_joueur=${interaction.member.id} LIMIT 1`;
            connection.query(sql, async(err) => {if (err) {throw err;}});

            var sql = `SELECT * FROM pays WHERE id_joueur=${interaction.member.id}`;
            connection.query(sql, async(err, results) => {if (err) {throw err;}

                const annonce = {
                    author: {
                        name: `${results[0].rang} de ${results[0].nom}`,
                        icon_url: interaction.member.displayAvatarURL()
                    },
                    thumbnail: {
                        url: `${results[0].drapeau}`,
                    },
                    title: `Une nouveau gouvernement a été mis en place :`,
                    description: discours,
                    fields: [{
                        name: `> Nouveau régime`,
                        value: `*${régime}*`
                    }],
                    color: interaction.member.displayHexColor,
                    timestamp: new Date(),
                    footer: {
                        text: `${results[0].devise}`
                    },
                };

                const salon_annonce = interaction.client.channels.cache.get(process.env.SALON_ANNONCE);
                salon_annonce.send({ embeds: [annonce] });
                var reponse = `__**Votre annonce a été publié dans ${salon_annonce}**__`;

                await régimeCommandCooldown.addUser(interaction.member.id);

                await interaction.reply({ content: reponse });
            });
        }
    },
};