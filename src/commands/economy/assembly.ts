import {ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder, codeBlock} from 'discord.js';
import {readFileSync} from 'fs';
const assemblageObject = JSON.parse(readFileSync('src/data/assemblage.json', 'utf-8'));

module.exports = {
    data: new SlashCommandBuilder()
        .setName('assembler')
        .setDescription(`Assembler du matériel`)
        .addStringOption(ressource =>
            ressource.setName('materiel')
                .setDescription(`Le type de matériel que vous voulez assembler`)
                .addChoices(
                    { name: `Eolienne`, value: `Eolienne`}
                )
                .setRequired(true))
        .addIntegerOption(nombre =>
            nombre.setName('nombre')
                .setDescription(`Le nombre de matériels que vous voulez assembler`)
                .setMinValue(1)
                .setRequired(true)),

    async execute(interaction: any) {
        const { connection } = require('../../index.ts');
        const chosenBuild = interaction.options.getString('materiel');
        const numberBuild = interaction.options.getInteger('nombre');

        const sql = `
            SELECT * FROM pays WHERE id_joueur='${interaction.member.id}';
            SELECT * FROM ressources WHERE id_joueur='${interaction.member.id}';
        `;
        connection.query(sql, async(err: any, results: any[][]) => {if (err) {throw err;}
            const Pays = results[0][0];
            const Ressources = results[1][0];

            let needSteel: boolean = false;
            let costSteel: number = 0;
            let lackSteel: boolean = false;

            let needGlass: boolean = false;
            let costGlass: number = 0;
            let lackGlass: boolean = false;

            let assemblyStatus: boolean = true;

            switch (chosenBuild) {
                case 'Eolienne':
                    //region Eolienne
                    needSteel = true;
                    needGlass = true;

                    costSteel = assemblageObject.eolienne.CONST_EOLIENNE_ACIER * numberBuild;
                    if (costSteel > Ressources.acier) {
                        assemblyStatus = false;
                        lackSteel = true;
                    }
                    costGlass = assemblageObject.eolienne.CONST_EOLIENNE_VERRE * numberBuild;
                    if (costGlass > Ressources.verre) {
                        assemblyStatus = false;
                        lackGlass = true;
                    }
                    //endregion
                    break;
            }

            const fields = [];

            if (needSteel) {
                if (lackSteel) {
                    fields.push({
                        name: `> ⛔ Manque d'acier ⛔ :`,
                        value: codeBlock(`• Acier : ${Ressources.acier.toLocaleString('en-US')}/${costSteel.toLocaleString('en-US')}\n`) + `\u200B`
                    })
                } else {
                    fields.push({
                        name: `> ✅ Acier suffisant ✅ :`,
                        value: codeBlock(`• Acier : ${costSteel.toLocaleString('en-US')}/${costSteel.toLocaleString('en-US')}\n`) + `\u200B`
                    })
                }
            }

            if (needGlass) {
                if (lackGlass) {
                    fields.push({
                        name: `> ⛔ Manque de verre ⛔ :`,
                        value: codeBlock(`• Verre : ${Ressources.verre.toLocaleString('en-US')}/${costGlass.toLocaleString('en-US')}\n`) + `\u200B`
                    })
                } else {
                    fields.push({
                        name: `> ✅ Verre suffisant ✅ :`,
                        value: codeBlock(`• Verre : ${costGlass.toLocaleString('en-US')}/${costGlass.toLocaleString('en-US')}\n`) + `\u200B`
                    })
                }
            }

            const embed = {
                author: {
                    name: `${Pays.rang} de ${Pays.nom}`,
                    icon_url: interaction.member.displayAvatarURL()
                },
                thumbnail: {
                    url: Pays.drapeau
                },
                title: `\`Assemblage : ${numberBuild.toLocaleString('en-US')} ${chosenBuild}\``,
                fields: fields,
                color: interaction.member.displayColor,
                timestamp: new Date(),
                footer: {
                    text: `${Pays.devise}`
                },
            };

            if (assemblyStatus) {
                const row = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setLabel(`Assembler`)
                            .setEmoji(`🪛`)
                            .setCustomId(`assemblage-${interaction.user.id}`)
                            .setStyle(ButtonStyle.Success),
                    )
                    .addComponents(
                        new ButtonBuilder()
                            .setLabel(`Refuser`)
                            .setEmoji(`✋`)
                            .setCustomId(`refuser-${interaction.user.id}`)
                            .setStyle(ButtonStyle.Danger),
                    )
                    .addComponents(
                        new ButtonBuilder()
                            .setLabel(`Actualiser`)
                            .setEmoji(`🔁`)
                            .setCustomId(`assembly-reload-${interaction.user.id}`)
                            .setStyle(ButtonStyle.Primary),
                    )

                await interaction.reply({ embeds: [embed], components: [row] });
            } else {
                const row = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setLabel(`Assembler`)
                            .setEmoji(`🪛`)
                            .setCustomId(`assemblage`)
                            .setStyle(ButtonStyle.Danger)
                            .setDisabled(true)
                    )
                    .addComponents(
                        new ButtonBuilder()
                            .setLabel(`Refuser`)
                            .setEmoji(`✋`)
                            .setCustomId(`refuser-${interaction.user.id}`)
                            .setStyle(ButtonStyle.Danger),
                    )
                    .addComponents(
                        new ButtonBuilder()
                            .setLabel(`Actualiser`)
                            .setEmoji(`🔁`)
                            .setCustomId(`assembly-reload-${interaction.user.id}`)
                            .setStyle(ButtonStyle.Primary),
                    )

                await interaction.reply({ embeds: [embed], components: [row] });
            }
        });
    },
};