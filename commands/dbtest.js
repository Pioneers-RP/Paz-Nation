var connection = require('../index');
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

        try {
            await connection.query(`INSERT INTO 'pays' VALUES '(${valeur}')`);
        } catch (err) {
            console.log(err);
        };

        await interaction.reply({ content: `${valeur}` });
    },
};