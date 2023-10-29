const { SlashCommandBuilder, codeBlock} = require('discord.js');
const { CommandCooldown, msToMinutes } = require('discord-command-cooldown');
const ms = require('ms');
const ideologieCommandCooldown = new CommandCooldown('ideologie', ms('7d'));
const { readFileSync } = require("fs");
const gouvernementObject = JSON.parse(readFileSync('src/data/gouvernement.json', 'utf-8'));

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ideologie')
        .setDescription(`Choisissez votre idéologie`)
        .addStringOption(ideologie =>
            ideologie.setName('ideologie')
                .setDescription(`Choisissez votre idéologie`)
                .addChoices(
                    { name: `Oligarchisme`, value: 'Oligarchisme'},
                    { name: `Conservatisme`, value: 'Conservatisme'},
                    { name: `Libéralisme`, value: 'Libéralisme'},
                    { name: `Centrisme`, value: 'Centrisme'},
                    { name: `Socialisme`, value: 'Socialisme'},
                    { name: `Communisme`, value: 'Communisme'},
                    { name: `Anarchisme`, value: 'Anarchisme'})
                .setRequired(true))
        .addStringOption(option =>
            option.setName('discours')
                .setDescription(`Vous devez faire un discours pour justifier votre acte`)
                .setMinLength(50)
                .setMaxLength(400)
                .setRequired(true)),

    async execute(interaction) {
        let reponse;
        if (
            interaction.member.roles.cache.some(role => role.name === "👤 » Maire") ||
            interaction.member.roles.cache.some(role => role.name === "👤 » Dirigent") ||
            interaction.member.roles.cache.some(role => role.name === "👤 » Chef d'état") ||
            interaction.member.roles.cache.some(role => role.name === "👤 » Empereur")
        ) {
            const userCooldowned = await ideologieCommandCooldown.getUser(interaction.member.id);
            if (userCooldowned) {
                const timeLeft = msToMinutes(userCooldowned.msLeft, false);
                reponse = codeBlock('ansi', `\u001b[0m\u001b[1;31mVous avez déjà changé votre idéologie récemment. Il reste ${timeLeft.days}j ${timeLeft.hours}h ${timeLeft.minutes}min avant de pouvoir la changer à nouveau.`);
                await interaction.reply({ content: reponse, ephemeral: true });
            } else {
                const { connection } = require('../../index.ts');
                const ideologie = interaction.options.getString('ideologie');
                const discours = interaction.options.getString('discours');
                const salon_annonce = interaction.client.channels.cache.get(process.env.SALON_ANNONCE);

                let sql = `UPDATE pays SET ideologie="${ideologie}" WHERE id_joueur="${interaction.member.id}" LIMIT 1`;
                connection.query(sql, async(err) => {if (err) {throw err;}});

                sql = `SELECT * FROM pays WHERE id_joueur="${interaction.member.id}"`;
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
                        description: discours + `\u200B\n`,
                        fields: [{
                            name: `> 🧠 Nouvelle idéologie :`,
                            value: `*${ideologie}*` + `\u200B`
                        }],
                        color: interaction.member.displayColor,
                        footer: { text: `${Pays.devise}` }
                    };

                    salon_annonce.send({ embeds: [annonce] });
                    const reponse = `__**Votre annonce a été publié dans ${salon_annonce}**__`;

                    await ideologieCommandCooldown.addUser(interaction.member.id);
                    await interaction.reply({ content: reponse });
                });

                sql = `
                    SELECT * FROM diplomatie WHERE id_joueur='${interaction.member.id}';
                    SELECT * FROM pays WHERE id_joueur='${interaction.member.id}'
                `;
                connection.query(sql, async (err, results) => {if (err) {throw err;}
                    const Diplomatie = results[0][0];
                    const Pays = results[1][0]

                    function cg(influence, gouv, jour){
                        return parseFloat((72.4+(310.4-72.4)/180*jour)*gouv*Math.exp(influence*0.01).toFixed(2))
                    }

                    let sql = `UPDATE territoire SET cg=${cg(Diplomatie.influence, eval(`gouvernementObject.${Pays.ideologie}.gouvernance`), (Pays.jour))} WHERE id_joueur="${interaction.member.id}"`;
                    connection.query(sql, async (err) => {if (err) {throw err;}})
                })
            }
        } else {
            reponse = codeBlock('ansi', `\u001b[0;0m\u001b[1;31mVous devez être une Cité-Etat pour pouvoir choisir une idéologie.`);
            await interaction.reply({ content: reponse, ephemeral: true });
        }
    },
};