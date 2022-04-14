const { SlashCommandBuilder, codeBlock } = require('@discordjs/builders');
const dotenv = require('dotenv');
var mysql = require('mysql');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('start')
        .setDescription(`Démarrer votre aventure en temps que cité !`)
        .addStringOption(option =>
            option.setName('cité')
            .setDescription(`Le nom de votre ville de départ`)
            .setRequired(true)),

    async execute(interaction) {

        const cité = interaction.options.getString('cité');
        const salon_carte = interaction.client.channels.cache.get(process.env.SALON_CARTE);

        const connection = new mysql.createConnection({
            host: 'eu01-sql.pebblehost.com',
            user: 'customer_260507_paznation',
            password: 'lidmGbk8edPkKXv1#ZO',
            database: 'customer_260507_paznation'
        })

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
                            deny: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY']
                        },
                        {
                            id: interaction.member.id,
                            allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'MANAGE_CHANNELS', 'MANAGE_ROLES'],
                        }
                    ],
                    parent: process.env.CATEGORY_PAYS,
                });

                var sql = `
                UPDATE pays SET id_salon="${salon.id}" WHERE id_joueur="${interaction.member.id}" LIMIT 1`;

                connection.query(sql, async(err, results) => {
                    if (err) {
                        throw err;
                    }
                });

                interaction.member.setNickname(`[${cité}] ${interaction.member.displayName}`);

                let role = interaction.guild.roles.cache.find(r => r.name === "👤 » Joueur");
                interaction.member.roles.add(role)

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
                        value: `Menez votre peuple à la gloire ! <dev>`
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
                await interaction.reply({ content: reponse });
            }
        });
    }
};