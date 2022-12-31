const { SlashCommandBuilder, codeBlock } = require('@discordjs/builders');
const isImageURL = require('image-url-validator').default;
const { CommandCooldown, msToMinutes } = require('discord-command-cooldown');
const ms = require('ms');
const drapeauCommandCooldown = new CommandCooldown('drapeau', ms('7d'));

module.exports = {
    data: new SlashCommandBuilder()
        .setName('drapeau')
        .setDescription(`Choisissez un drapeau qui sera affiché sur tous vos menus`)
        .addStringOption(option =>
            option.setName('url')
            .setDescription(`L'URL de l'image`)
            .setRequired(true))
        .addStringOption(option =>
            option.setName('discours')
            .setDescription(`Vous devez faire un discours pour justifier votre acte (Minimum 50 caractères)`)
            .setRequired(true)),

    async execute(interaction) {
        let reponse;
        const { connection } = require('../index.js');
        const drapeau = interaction.options.getString('url');
        const discours = interaction.options.getString('discours');
        const userCooldowned = await drapeauCommandCooldown.getUser(interaction.member.id);
        const salon_annonce = interaction.client.channels.cache.get(process.env.SALON_ANNONCE);

        if (userCooldowned) {
            const timeLeft = msToMinutes(userCooldowned.msLeft, false);
            reponse = codeBlock('diff', `- Vous avez déjà changé votre drapeau récemment. Il reste ${timeLeft.days}j ${timeLeft.hours}h ${timeLeft.minutes}min avant de pouvoir le changer à nouveau.`);
            await interaction.reply({ content: reponse, ephemeral: true });
        } else if (discours.length <= 115) {
            reponse = codeBlock('diff', `- Votre discours doit faire au minimum : 50 caractères`);
            await interaction.reply({ content: reponse, ephemeral: true });
        } else if (discours.length >= 2000) {
            reponse = codeBlock('diff', `- Votre discours doit faire au maximum : 2000 caractères`);
            await interaction.reply({ content: reponse, ephemeral: true });
        } else {
            if (await isImageURL(drapeau) === true) {

                let sql = `UPDATE pays SET drapeau="${drapeau}" WHERE id_joueur='${interaction.member.id}' LIMIT 1`;
                connection.query(sql, async(err) => {if (err) {throw err;}});

                sql = `SELECT * FROM pays WHERE id_joueur='${interaction.member.id}'`;
                connection.query(sql, async(err, results) => {if (err) {throw err;}
                    const Pays = results[0];

                    const annonce = {
                        author: {
                            name: `${Pays.rang} de ${Pays.nom}`,
                            icon_url: interaction.member.displayAvatarURL()
                        },
                        image: {
                            url: Pays.drapeau,
                        },
                        title: `\`Un nouveau drapeau a été adopté :\``,
                        timestamp: new Date(),
                        description: discours,
                        color: interaction.member.displayHexColor,
                        footer: {
                            text: `${Pays.devise}`
                        },
                    };

                    salon_annonce.send({ embeds: [annonce] });
                    const reponse = `__**Votre annonce a été publié dans ${salon_annonce}**__`;
                    await interaction.reply({ content: reponse });

                    await drapeauCommandCooldown.addUser(interaction.member.id);
                });
            } else {
                reponse = codeBlock('diff', `- Vous n'avez pas fourni une URL valide`);
                await interaction.reply({ content: reponse, ephemeral: true });
            }
        }
    }
};