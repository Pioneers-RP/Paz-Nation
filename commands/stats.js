const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stats')
        .setDescription('Vue global de votre pays')
        .addStringOption(option =>
            option.setName('category')
            .setDescription('The gif category')
            .setRequired(true)
            .addChoice('Funny', 'gif_funny')
            .addChoice('Meme', 'gif_meme')
            .addChoice('Movie', 'gif_movie')
        )
        .addSubcommand(subcommand =>
            subcommand
            .setName('server')
            .setDescription('Info about the server')
        ),

    async execute(interaction) {
        await interaction.reply('Pong!');
    },
};