import {
    ActionRowBuilder,
    ModalBuilder,
    SlashCommandBuilder,
    TextInputBuilder,
    TextInputStyle
} from "discord.js";

module.exports = {
    data: new SlashCommandBuilder()
        .setName('annonce')
        .setDescription(`Faire une annonce au monde entier`),

    async execute(interaction: any) {
        const modal = new ModalBuilder()
            .setCustomId(`annonce`)
            .setTitle(`Faire une annonce`);

        const text_annonce = new TextInputBuilder()
            .setCustomId('text_annonce')
            .setLabel(`Le texte de votre annonce :`)
            .setStyle(TextInputStyle.Paragraph)
            .setMinLength(50)
            .setMaxLength(1500)
            .setRequired(true)

        const image_annonce = new TextInputBuilder()
            .setCustomId('image_annonce')
            .setLabel(`Ajouter une image :`)
            .setStyle(TextInputStyle.Short)
            .setMaxLength(150)
            .setRequired(false)

        const firstActionRow: any = new ActionRowBuilder().addComponents(text_annonce);
        const secondActionRow: any = new ActionRowBuilder().addComponents(image_annonce);
        modal.addComponents(firstActionRow, secondActionRow);
        interaction.showModal(modal);
    }
};