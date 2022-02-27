const connection = require('../index');
const mysql = require('mysql');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('dbtest')
        .setDescription(`tdrcgbhjserdcgbhj`)
        .addStringOption(option =>
            option.setName('valeur')
            .setDescription(`valeur`)
            .setRequired(true)),

    async execute(interaction) {

        const valeur = interaction.options.getString('valeur');

        var mysql = require('mysql');
        const connection = new mysql.createConnection({
            host: 'eu01-sql.pebblehost.com',
            user: 'customer_260507_paznation',
            password: 'lidmGbk8edPkKXv1#ZO',
            database: 'customer_260507_paznation'
        })

        connection.query(`INSERT INTO pays(nom) VALUES ("${valeur}")`)

        connection.end(function(err) {
            // The connection is terminated now
        });

        await interaction.reply({ content: `${valeur}` });
    },
};