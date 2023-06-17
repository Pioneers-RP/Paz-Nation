const { SlashCommandBuilder, codeBlock} = require('discord.js');
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
                .addChoices(
                    { name: `Duché`, value: 'Duché'},
                    { name: `Emirat`, value: 'Emirat'},
                    { name: `Principauté`, value: 'Principauté'},
                    { name: `République`, value: 'République'},
                    { name: `République fédérale`, value: 'République fédérale'},
                    { name: `République populaire`, value: 'République populaire'},
                    { name: `Royaume`, value: 'Royaume'},
                    { name: `Sultanat`, value: 'Sultanat'})
                .setRequired(true))
        .addStringOption(option =>
            option.setName('discours')
                .setDescription(`Vous devez faire un discours pour justifier votre acte`)
                .setMinLength(50)
                .setMaxLength(400)
                .setRequired(true)),

    async execute(interaction) {
        let reponse;
        const { connection } = require('../../index.js');

        if (
            interaction.member.roles.cache.some(role => role.name === "👤 » Dirigent") ||
            interaction.member.roles.cache.some(role => role.name === "👤 » Chef d'état") ||
            interaction.member.roles.cache.some(role => role.name === "👤 » Empereur")
        ) {
            const userCooldowned = await regimeCommandCooldown.getUser(interaction.member.id);
            if (userCooldowned) {
                const timeLeft = msToMinutes(userCooldowned.msLeft, false);
                reponse = codeBlock('ansi', `\u001b[0m\u001b[1;31mVous avez déjà changé votre gouvernement récemment. Il reste ${timeLeft.days}j ${timeLeft.hours}h ${timeLeft.minutes}min avant de pouvoir le changer à nouveau.`);
                await interaction.reply({ content: reponse, ephemeral: true });
            } else {
                const regime = interaction.options.getString('forme');
                const discours = interaction.options.getString('discours');

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
                        title: `\`Annonce officielle :\``,
                        description: discours + `\u200B`,
                        fields: [{
                            name: `> 🔱 Nouveau régime :`,
                            value: `*${regime}*` + `\u200B`
                        }],
                        color: interaction.member.displayColor,
                        timestamp: new Date(),
                        footer: {text: `${Pays.devise}`},
                    };

                    const salon_annonce = interaction.client.channels.cache.get(process.env.SALON_ANNONCE);
                    salon_annonce.send({ embeds: [annonce] });
                    const reponse = `__**Votre annonce a été publié dans ${salon_annonce}**__`;

                    await regimeCommandCooldown.addUser(interaction.member.id);

                    await interaction.reply({ content: reponse });
                });
            }
        } else {
            reponse = codeBlock('ansi', `\u001b[0;0m\u001b[1;31mVous devez être un Etat pour pouvoir choisir une forme de gouvernement.`);
            await interaction.reply({ content: reponse, ephemeral: true });
        }
    },
};