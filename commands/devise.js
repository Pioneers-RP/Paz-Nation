const { SlashCommandBuilder, codeBlock } = require('@discordjs/builders');
const { CommandCooldown, msToMinutes } = require('discord-command-cooldown');
const ms = require('ms');
const deviseCommandCooldown = new CommandCooldown('devise', ms('7d'));

module.exports = {
    data: new SlashCommandBuilder()
        .setName('devise')
        .setDescription(`Choisissez une devise qui sera affiché sous tous vos menus`)
        .addStringOption(option =>
            option.setName('définir')
            .setDescription(`Votre devise (Maximum 60 caractères)`)
            .setRequired(true))
        .addStringOption(option =>
            option.setName('discours')
            .setDescription(`Vous devez faire un discours pour justifier votre acte (Minimum 50 caractères)`)
            .setRequired(true)),

    async execute(interaction) {
        let reponse;
        const { connection } = require('../index.js');

        const devise = interaction.options.getString('définir');
        const discours = interaction.options.getString('discours');

        const userCooldowned = await deviseCommandCooldown.getUser(interaction.member.id);
        if (userCooldowned) {
            const timeLeft = msToMinutes(userCooldowned.msLeft, false);
            reponse = codeBlock('diff', `- Vous avez déjà changé votre devise récemment. Il reste ${timeLeft.days}j ${timeLeft.hours}h ${timeLeft.minutes}min avant de pouvoir la changer à nouveau.`);
            await interaction.reply({ content: reponse, ephemeral: true });
        } else if (discours.length <= 115) {
            reponse = codeBlock('diff', `- Votre discours doit faire au minimum : 50 caractères`);
            await interaction.reply({ content: reponse, ephemeral: true });
        } else if (discours.length >= 2000) {
            reponse = codeBlock('diff', `- Votre discours doit faire au maximum : 2000 caractères`);
            await interaction.reply({ content: reponse, ephemeral: true });
        } else {
            if (devise.length <= 60) {

                let newdevise = "";

                for (let i = 0; i < devise.length; i++)
                    if (!(devise[i] == '\n' || devise[i] == '\r'))
                        newdevise += devise[i];

                let sql = `UPDATE pays SET devise="${newdevise}" WHERE id_joueur='${interaction.member.id}' LIMIT 1`;
                connection.query(sql, async(err) => {if (err) {throw err;}});

                sql = `SELECT * FROM pays WHERE id_joueur='${interaction.member.id}'`;
                connection.query(sql, async(err, results) => {if (err) {throw err;}

                    const annonce = {
                        author: {
                            name: `${results[0].rang} de ${results[0].nom}`,
                            icon_url: interaction.member.displayAvatarURL()
                        },
                        thumbnail: {
                            url: results[0].drapeau,
                        },
                        title: `\`Une nouvelle devise a été adopté :\``,
                        description: discours,
                        fields: [{
                            name: `> Nouvelle devise`,
                            value: `*${newdevise}*`
                        }],
                        timestamp: new Date(),
                        color: interaction.member.displayHexColor
                    };

                    const salon_annonce = interaction.client.channels.cache.get(process.env.SALON_ANNONCE);

                    salon_annonce.send({ embeds: [annonce] });
                    const reponse = `__**Votre annonce a été publié dans ${salon_annonce}**__`;
                    await interaction.reply({ content: reponse });

                    await deviseCommandCooldown.addUser(interaction.member.id);
                });
            } else {
                reponse = codeBlock('diff', `- Vous avez dépassé la limite de caratères : 60 max`);
                await interaction.reply({ content: reponse, ephemeral: true });
            }
        }
    },
};