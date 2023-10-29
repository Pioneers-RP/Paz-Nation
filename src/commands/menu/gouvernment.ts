import {SlashCommandBuilder} from "discord.js";
import {menuGouvernement} from "../../fonctions/functions";

module.exports = {
    data: new SlashCommandBuilder()
        .setName('gouv')
        .setDescription(`Menu du gouvernement`),

    async execute(interaction: any) {
        const { connection } = require('../../index');

        menuGouvernement(interaction, connection);
    },
};