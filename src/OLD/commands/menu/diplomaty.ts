import {SlashCommandBuilder} from "discord.js";
import {menuDiplomatie} from "../../fonctions/functions";

module.exports = {
    data: new SlashCommandBuilder()
        .setName('diplomatie')
        .setDescription(`Consultez votre diplomatie`),

    async execute(interaction: any) {
        const { connection } = require('../../index');

        menuDiplomatie(interaction, connection);
    },
};