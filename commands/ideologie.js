const { SlashCommandBuilder, codeBlock } = require('@discordjs/builders');
var mysql = require('mysql');
const { CommandCooldown, msToMinutes } = require('discord-command-cooldown');
const ms = require('ms');
const ideologieCommandCooldown = new CommandCooldown('gouvernement', ms('7d'));

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ideologie')
        .setDescription(`Choisissez votre idéologie`)
        .addStringOption(ideologie =>
            ideologie.setName('ideologie')
            .setDescription(`Choisissez votre idéologie`)
            .addChoice(`Libéralisme`, 'Libéralisme')
            .addChoice(`Capitalisme`, 'Capitalisme')
            .addChoice(`Oligarchique`, 'Oligarchique')
            .addChoice(`Centriste`, 'Centriste')
            .addChoice(`Socialisme`, 'Socialisme')
            .addChoice(`Marxisme`, 'Marxisme')
            .addChoice(`Anarchisme`, 'Anarchisme')
            .setRequired(true)),
    async execute(interaction) {

        const ideologie = interaction.options.getString('ideologie');

        const userCooldowned = await ideologieCommandCooldown.getUser(interaction.member.id);
        if (userCooldowned) {
            const timeLeft = msToMinutes(userCooldowned.msLeft, false);
            var reponse = codeBlock('diff', `- Vous avez déjà changé votre idéologie récemment. Il reste ${timeLeft.days}j ${timeLeft.hours}h ${timeLeft.minutes}min avant de pouvoir la changer à nouveau.`);
            await interaction.reply({ content: reponse, ephemeral: true });
        } else {
            const connection = new mysql.createConnection({
                host: 'eu01-sql.pebblehost.com',
                user: 'customer_260507_paznation',
                password: 'lidmGbk8edPkKXv1#ZO',
                database: 'customer_260507_paznation',
                multipleStatements: true
            });

            var sql = `
            UPDATE pays SET ideologie="${ideologie}" WHERE id_joueur="${interaction.member.id}" LIMIT 1`;

            connection.query(sql, async(err, results) => {
                if (err) {
                    throw err;
                }
            });

            var sql = `
            SELECT * FROM pays WHERE id_joueur="${interaction.member.id}"`;

            connection.query(sql, async(err, results) => {
                if (err) {
                    throw err;
                }

                const annonce = {
                    author: {
                        name: `${results[0].rang} de ${results[0].nom}`,
                        icon_url: interaction.member.displayAvatarURL()
                    },
                    thumbnail: {
                        url: `${results[0].drapeau}`,
                    },
                    title: `Une nouvelle idéologie a été mis en place :`,
                    description: `${results[0].ideologie}`,
                    color: interaction.member.displayHexColor
                };

                const salon_annonce = interaction.client.channels.cache.get(process.env.SALON_ANNONCE);
                salon_annonce.send({ embeds: [annonce] });
                var reponse = `__**Votre annonce a été publié dans ${salon_annonce}**__`;

                await interaction.reply({ content: reponse });
            });
        }
    },
};