const { SlashCommandBuilder, codeBlock } = require('@discordjs/builders');
const dotenv = require('dotenv');
var Chance = require('chance');
var chance = new Chance();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('start')
        .setDescription(`Démarrer votre aventure en temps que cité !`)
        .addStringOption(option =>
            option.setName('cité')
            .setDescription(`Le nom de votre ville de départ`)
            .setRequired(true)),

    async execute(interaction) {
        const { connection } = require('../index.js');

        const cité = interaction.options.getString('cité');
        const salon_carte = interaction.client.channels.cache.get(process.env.SALON_CARTE);

        var sql1 = `
        SELECT * FROM pays WHERE id_joueur=${interaction.member.id}`;

        connection.query(sql1, async(err, results) => {
            if (err) {
                throw err;
            }

            if (!results[0]) {

                console.log(`Pays créé`)

                var sql = `
                INSERT INTO pays SET id_joueur="${interaction.user.id}", nom="${cité}"`;

                connection.query(sql, async(err, results) => {
                    if (err) {
                        throw err;
                    }
                });

                const salon = await interaction.guild.channels.create(`${cité}`, {
                    type: "GUILD_TEXT",
                    permissionOverwrites: [{
                            id: interaction.guild.roles.everyone,
                            deny: ['VIEW_CHANNEL']
                        },
                        {
                            id: interaction.member.id,
                            allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'MANAGE_CHANNELS', 'MANAGE_ROLES', 'READ_MESSAGE_HISTORY'],
                        }
                    ],
                    parent: process.env.CATEGORY_PAYS,
                });

                var T_total = chance.integer({ min: 14000, max: 16000 });
                var T_occ = 15 + 1 * process.env.SURFACE_CHAMP + 1 * process.env.SURFACE_MINE + 1 * process.env.SURFACE_POMPE_A_EAU + 1 * process.env.SURFACE_PUMPJACK + 1 * process.env.SURFACE_SCIERIE + 1 * process.env.SURFACE_CENTRALE_ELEC;
                var T_libre = T_total - T_occ;
                var cash = chance.integer({ min: 950000, max: 1050000 });
                var pop = chance.integer({ min: 9500, max: 10500 });

                var sql = `
                UPDATE pays SET id_salon="${salon.id}", cash='${cash}', population='${pop}', T_total='${T_total}', T_occ='${T_occ}', T_libre='${T_libre}', pweeter="@${interaction.user.username}", avatarURL="${interaction.user.avatarURL()}" WHERE id_joueur="${interaction.member.id}" LIMIT 1`;

                connection.query(sql, async(err, results) => {
                    if (err) {
                        throw err;
                    }
                });

                interaction.member.setNickname(`[${cité}] ${interaction.member.displayName}`);

                let roleJoueur = interaction.guild.roles.cache.find(r => r.name === "👤 » Joueur");
                interaction.member.roles.add(roleJoueur)

                let roleInvité = interaction.guild.roles.cache.find(r => r.name === "👤 » Invité");
                interaction.member.roles.remove(roleInvité)

                const ville = {
                    author: {
                        name: `Cité de ${cité}`,
                        icon_url: interaction.member.displayAvatarURL()
                    },
                    thumbnail: {
                        url: 'https://cdn.discordapp.com/attachments/939251032297463879/940642380640583770/paz_v3.png',
                    },
                    title: `\`Vous avez fondé votre cité !\``,
                    fields: [{
                        name: `Place de votre gouvernement :`,
                        value: `${salon}`
                    }],
                    color: interaction.member.displayHexColor,
                    timestamp: new Date(),
                    footer: {
                        text: `Paz Nation, le meilleur serveur Discord Français`
                    },
                };

                const annonce = {
                    description: `**<@${interaction.member.id}> a fondé une nouvelle Cité : ${cité}**`,
                    image: {
                        url: 'https://media.discordapp.net/attachments/848913340737650698/947508565415981096/zefghyiuuie.png',
                    },
                    color: interaction.member.displayHexColor,
                    footer: {
                        text: `Paz Nation, le meilleur serveur Discord Français`
                    },
                };

                const nouveau_salon = {
                    author: {
                        name: `Cité de ${cité}`,
                        icon_url: interaction.member.displayAvatarURL()
                    },
                    thumbnail: {
                        url: 'https://cdn.discordapp.com/attachments/939251032297463879/940642380640583770/paz_v3.png',
                    },
                    title: `\`Bienvenue dans votre cité !\``,
                    fields: [{
                        name: `Commencement :`,
                        value: `Menez votre peuple à la gloire !`
                    }],
                    color: interaction.member.displayHexColor,
                    timestamp: new Date(),
                    footer: {
                        text: `Paz Nation, le meilleur serveur Discord Français`
                    },
                };

                salon_carte.send({ embeds: [annonce] });

                salon.send({ content: `<@${interaction.member.id}>`, embeds: [nouveau_salon] })

                await interaction.reply({ embeds: [ville] });
            } else {
                var reponse = codeBlock('diff', `- Vous avez déjà un pays. Demandez au staff pour recommencer une histoire`);
                await interaction.reply({ content: reponse, ephemeral: true });
            }
        });
    }
};