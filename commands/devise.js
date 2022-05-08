const { SlashCommandBuilder, codeBlock } = require('@discordjs/builders');
var mysql = require('mysql');
const { CommandCooldown, msToMinutes } = require('discord-command-cooldown');
const ms = require('ms');
const deviseCommandCooldown = new CommandCooldown('devise', ms('7d'));

module.exports = {
    data: new SlashCommandBuilder()
        .setName('devise')
        .setDescription(`Choisissez une devise qui sera affiché sous tous vos menus`)
        .addStringOption(option =>
            option.setName('définir')
            .setDescription(`Votre devise`)
            .setRequired(true)),

    async execute(interaction) {

        const devise = interaction.options.getString('définir');

        const userCooldowned = await deviseCommandCooldown.getUser(interaction.member.id);
        if (userCooldowned) {
            const timeLeft = msToMinutes(userCooldowned.msLeft, false);
            var reponse = codeBlock('diff', `- Vous avez déjà changé votre devise récemment. Il reste ${timeLeft.days}j ${timeLeft.hours}h ${timeLeft.minutes}min avant de pouvoir la changer à nouveau.`);
            await interaction.reply({ content: reponse, ephemeral: true });
        } else {
            if (devise.length <= 60) {

                var newdevise = "";

                for (var i = 0; i < devise.length; i++)
                    if (!(devise[i] == '\n' || devise[i] == '\r'))
                        newdevise += devise[i];

                const connection = new mysql.createConnection({
                    host: 'eu01-sql.pebblehost.com',
                    user: 'customer_260507_paznation',
                    password: 'lidmGbk8edPkKXv1#ZO',
                    database: 'customer_260507_paznation',
                    multipleStatements: true
                });

                var sql = `
                UPDATE pays SET devise="${newdevise}" WHERE id_joueur='${interaction.member.id}' LIMIT 1`;

                connection.query(sql, async(err, results) => {
                    if (err) {
                        throw err;
                    }
                });

                var sql = `
                SELECT * FROM pays WHERE id_joueur='${interaction.member.id}'`;

                connection.query(sql, async(err, results) => {
                    if (err) {
                        throw err;
                    }

                    var annonce = {
                        author: {
                            name: `${results[0].rang} de ${results[0].nom}`,
                            icon_url: interaction.member.displayAvatarURL()
                        },
                        thumbnail: {
                            url: results[0].drapeau,
                        },
                        title: `\`Une nouvelle devise a été adopté :\``,
                        description: `> *${newdevise}*`,
                        timestamp: new Date(),
                        color: interaction.member.displayHexColor
                    };

                    const salon_annonce = interaction.client.channels.cache.get(process.env.SALON_ANNONCE);

                    salon_annonce.send({ embeds: [annonce] });
                    var reponse = `__**Votre annonce a été publié dans ${salon_annonce}**__`;

                    await deviseCommandCooldown.addUser(interaction.member.id);
                    await interaction.reply({ content: reponse });
                });
            } else {
                var reponse = codeBlock('diff', `- Vous avez dépassé la limite de caratères: 60 max`);
                await interaction.reply({ content: reponse, ephemeral: true });
            }
        }
    },
};