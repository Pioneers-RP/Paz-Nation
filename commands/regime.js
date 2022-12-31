const { SlashCommandBuilder, codeBlock } = require('@discordjs/builders');
const { CommandCooldown, msToMinutes } = require('discord-command-cooldown');
const ms = require('ms');
const regimeCommandCooldown = new CommandCooldown('régime', ms('7d'));

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
                .addChoice(`République fédérale`, 'République fédérale')
                .addChoice(`République populaire`, 'République populaire')
                .addChoice(`Royaume`, 'Royaume')
                .addChoice(`Sultanat`, 'Sultanat')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('discours')
                .setDescription(`Vous devez faire un discours pour justifier votre acte (Minimum 50 caractères)`)
                .setRequired(true)),

    async execute(interaction) {
        let reponse;
        const { connection } = require('../index.js');

        const regime = interaction.options.getString('forme');
        const discours = interaction.options.getString('discours');

        const userCooldowned = await regimeCommandCooldown.getUser(interaction.member.id);
        if (userCooldowned) {
            const timeLeft = msToMinutes(userCooldowned.msLeft, false);
            reponse = codeBlock('diff', `- Vous avez déjà changé votre gouvernement récemment. Il reste ${timeLeft.days}j ${timeLeft.hours}h ${timeLeft.minutes}min avant de pouvoir le changer à nouveau.`);
            await interaction.reply({ content: reponse, ephemeral: true });
        } else if (discours.length <= 115) {
            reponse = codeBlock('diff', `- Votre discours doit faire au minimum : 50 caractères`);
            await interaction.reply({ content: reponse, ephemeral: true });
        } else if (discours.length >= 2000) {
            reponse = codeBlock('diff', `- Votre discours doit faire au maximum : 2000 caractères`);
            await interaction.reply({ content: reponse, ephemeral: true });
        } else {

            let sql = `UPDATE pays SET regime="${regime}" WHERE id_joueur=${interaction.member.id} LIMIT 1`;
            connection.query(sql, async(err) => {if (err) {throw err;}});

            sql = `SELECT * FROM pays WHERE id_joueur=${interaction.member.id}`;
            connection.query(sql, async(err, results) => {if (err) {throw err;}
                const Pays = results[0];

                const annonce = {
                    author: {
                        name: `${Pays.rang} de ${Pays.nom}`,
                        icon_url: interaction.member.displayAvatarURL()
                    },
                    thumbnail: {
                        url: `${Pays.drapeau}`,
                    },
                    title: `Une nouveau gouvernement a été mis en place :`,
                    description: discours,
                    fields: [{
                        name: `> Nouveau régime`,
                        value: `*${regime}*`
                    }],
                    color: interaction.member.displayHexColor,
                    timestamp: new Date(),
                    footer: {
                        text: `${Pays.devise}`
                    },
                };

                const salon_annonce = interaction.client.channels.cache.get(process.env.SALON_ANNONCE);
                salon_annonce.send({ embeds: [annonce] });
                const reponse = `__**Votre annonce a été publié dans ${salon_annonce}**__`;

                await regimeCommandCooldown.addUser(interaction.member.id);

                await interaction.reply({ content: reponse });
            });
        }
    },
};