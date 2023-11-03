import {SlashCommandBuilder} from "discord.js";
import {menuConsommation} from "../../fonctions/functions";
import {connection} from '../../index';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('consommation')
        .setDescription(`Affiche votre consommation de ressource`),

    async execute(interaction: any) {
        menuConsommation('menu', interaction, connection);
    }
};
