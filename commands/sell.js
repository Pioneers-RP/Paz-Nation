const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton } = require('discord.js');
var mysql = require('mysql');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('sell')
        .setDescription(`Vendre des ressources sur le marché international (IM)`)
        .addStringOption(ressource =>
            ressource.setName('ressource')
            .setDescription(`La ressource que vous voulez vendre`)
            .addChoice(`Biens de consommation`, 'Biens de consommation')
            .addChoice(`Bois`, 'Bois')
            .addChoice(`Brique`, 'Brique')
            .addChoice(`Eau`, 'Eau')
            .addChoice(`Métaux`, 'Metaux')
            .addChoice(`Nourriture`, 'Nourriture')
            .addChoice(`Pétrole`, 'Petrole')
            .setRequired(true))
        .addIntegerOption(quantité =>
            quantité.setName('quantité')
            .setDescription(`La quantité de ressource que vous voulez vendre`)
            .setRequired(true))
        .addNumberOption(prix =>
            prix.setName('prix')
            .setDescription(`Le prix à l'unité pour la quantité de ressource`)
            .setRequired(true)),

    async execute(interaction) {

        const connection = new mysql.createConnection({
            host: 'eu01-sql.pebblehost.com',
            user: 'customer_260507_paznation',
            password: 'lidmGbk8edPkKXv1#ZO',
            database: 'customer_260507_paznation',
            multipleStatements: true
        });

        var sql = `
        SELECT * FROM pays WHERE id_joueur=${interaction.member.id}`;

        connection.query(sql, async(err, results) => {
            if (err) {
                throw err;
            }

            const ressource = interaction.options.getString('ressource');
            var quantité = interaction.options.getInteger('quantité');
            var prix = interaction.options.getNumber('prix');

            prix = prix.toFixed(2);
            var prix_t = quantité * prix;
            if (quantité >= 1000000) {
                e_quantité = quantité / 1000000;
                e_quantité = e_quantité + 'M';
            } else {
                e_quantité = quantité / 1000;
                e_quantité = e_quantité + 'k';
            }
            if (prix_t >= 1000000) {
                e_prix_t = prix_t / 1000000;
                e_prix_t = e_prix_t + 'M';
            } else {
                e_prix_t = prix_t / 1000;
                e_prix_t = e_prix_t + 'k';
            }

            const salon_commerce = interaction.client.channels.cache.get(process.env.SALON_COMMERCE);
            const thread = await salon_commerce.threads
                .create({
                    name: `${e_quantité} [${ressource}] à ${prix} | ${e_prix_t} $ | ${interaction.member.displayName}`
                });

            var sql1 = `
                INSERT INTO trade SET id_joueur="${interaction.user.id}", id_salon="${thread.id}", ressource="${ressource}", quantite='${quantité}', prix='${prix_t}', prix_u='${prix}'`;

            connection.query(sql1, async(err, results) => {
                if (err) {
                    throw err;
                }
            });

            const embed = {
                author: {
                    name: `${results[0].rang} de ${results[0].nom}`,
                    icon_url: interaction.member.displayAvatarURL()
                },
                thumbnail: {
                    url: results[0].drapeau
                },
                title: `\`Nouvelle offre :\``,
                fields: [{
                        name: `Ressource :`,
                        value: `${ressource}`
                    },
                    {
                        name: `Quantité :`,
                        value: `${e_quantité}`
                    },
                    {
                        name: `Prix :`,
                        value: `Au total : ${e_prix_t}
                        A l'unité : ${prix}`
                    }
                ],
                color: interaction.member.displayHexColor,
                timestamp: new Date(),
                footer: {
                    text: `${results[0].devise}`
                },
            };
            const row = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                    .setLabel(`Acheter`)
                    .setEmoji(`💵`)
                    .setCustomId('acheter-' + thread.id)
                    .setStyle('SUCCESS'),
                )
            thread.send({ embeds: [embed], components: [row] })

            await interaction.reply({ content: `Votre offre a été publié pour 1 jour : ${thread}` });
        })
    },
};