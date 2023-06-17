const { SlashCommandBuilder, codeBlock} = require('discord.js');
const { readFileSync } = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('biome')
        .setDescription(`Affiche vos biomes`),

    async execute(interaction) {
        const { connection } = require('../../index.js');

        const sql = `
            SELECT * FROM pays WHERE id_joueur='${interaction.member.id}';
            SELECT * FROM territoire WHERE id_joueur='${interaction.member.id}';
        `;
        connection.query(sql, async(err, results) => {if (err) {throw err;}
            const Pays = results[0][0];
            const Territoire = results[1][0];

            const pourVille = Math.round(Territoire.ville / Territoire.T_total * 100)
            const pourForet = Math.round(Territoire.foret / Territoire.T_total * 100)
            const pourPrairie = Math.round(Territoire.prairie / Territoire.T_total * 100)
            const pourDesert = Math.round(Territoire.desert / Territoire.T_total * 100)
            const pourToundra = Math.round(Territoire.toundra / Territoire.T_total * 100)
            const pourTaiga = Math.round(Territoire.taiga / Territoire.T_total * 100)
            const pourSavane = Math.round(Territoire.savane / Territoire.T_total * 100)
            const pourRocheuses = Math.round(Territoire.rocheuses / Territoire.T_total * 100)
            const pourVolcan = Math.round(Territoire.volcan / Territoire.T_total * 100)
            const pourMangrove = Math.round(Territoire.mangrove / Territoire.T_total * 100)
            const pourSteppe = Math.round(Territoire.steppe / Territoire.T_total * 100)
            const pourJungle = Math.round(Territoire.jungle / Territoire.T_total * 100)
            const pourLac = Math.round(Territoire.lac / Territoire.T_total * 100)

            let Ville = codeBlock(`${Territoire.ville.toLocaleString('en-US')}/${Territoire.T_total.toLocaleString('en-US')} | ${pourVille}%`);
            let Foret = codeBlock(`${Territoire.foret.toLocaleString('en-US')}/${Territoire.T_total.toLocaleString('en-US')} | ${pourForet}%`);
            let Prairie = codeBlock(`${Territoire.prairie.toLocaleString('en-US')}/${Territoire.T_total.toLocaleString('en-US')} | ${pourPrairie}%`);
            let Desert = codeBlock(`${Territoire.desert.toLocaleString('en-US')}/${Territoire.T_total.toLocaleString('en-US')} | ${pourDesert}%`);
            let Toundra = codeBlock(`${Territoire.toundra.toLocaleString('en-US')}/${Territoire.T_total.toLocaleString('en-US')} | ${pourToundra}%`);
            let Taiga = codeBlock(`${Territoire.taiga.toLocaleString('en-US')}/${Territoire.T_total.toLocaleString('en-US')} | ${pourTaiga}%`);
            let Savane = codeBlock(`${Territoire.savane.toLocaleString('en-US')}/${Territoire.T_total.toLocaleString('en-US')} | ${pourSavane}%`);
            let Rocheuses = codeBlock(`${Territoire.rocheuses.toLocaleString('en-US')}/${Territoire.T_total.toLocaleString('en-US')} | ${pourRocheuses}%`);
            let Volcan = codeBlock(`${Territoire.volcan.toLocaleString('en-US')}/${Territoire.T_total.toLocaleString('en-US')} | ${pourVolcan}%`);;
            let Mangrove = codeBlock(`${Territoire.mangrove.toLocaleString('en-US')}/${Territoire.T_total.toLocaleString('en-US')} | ${pourMangrove}%`);
            let Steppe = codeBlock(`${Territoire.steppe.toLocaleString('en-US')}/${Territoire.T_total.toLocaleString('en-US')} | ${pourSteppe}%`);
            let Jungle = codeBlock(`${Territoire.jungle.toLocaleString('en-US')}/${Territoire.T_total.toLocaleString('en-US')} | ${pourJungle}%`);
            let Lac = codeBlock(`${Territoire.lac.toLocaleString('en-US')}/${Territoire.T_total.toLocaleString('en-US')} | ${pourLac}%`);

            const embed = {
                author: {
                    name: `${Pays.rang} de ${Pays.nom}`,
                    icon_url: interaction.member.displayAvatarURL()
                },
                thumbnail: {
                    url: Pays.drapeau
                },
                title: `\`Biomes\``,
                fields: [
                    {
                        name: `> 🏜️ Desert : `,
                        value: Desert,
                        inline: true
                    },
                    {
                        name: `> 🌳 Foret : `,
                        value: Foret,
                        inline: true
                    },
                    {
                        name: `> 🍌 Jungle : `,
                        value: Jungle,
                        inline: true
                    },
                    {
                        name: `> 🌊 Lac : `,
                        value: Lac,
                        inline: true
                    },
                    {
                        name: `> 🏝️ Mangrove : `,
                        value: Mangrove,
                        inline: true
                    },
                    {
                        name: `> 🍀 Prairie : `,
                        value: Prairie,
                        inline: true
                    },
                    {
                        name: `> ⛰ Rocheuses : `,
                        value: Rocheuses,
                        inline: true
                    },
                    {
                        name: `> 🪹 Savane : `,
                        value: Savane,
                        inline: true
                    },
                    {
                        name: `> 🌄 Steppe : `,
                        value: Steppe,
                        inline: true
                    },
                    {
                        name: `> 🌲 Taiga : `,
                        value: Taiga,
                        inline: true
                    },
                    {
                        name: `> 🪵 Toundra : `,
                        value: Toundra,
                        inline: true
                    },
                    {
                        name: `> 🏙️ Ville : `,
                        value: Ville,
                        inline: true
                    },
                    {
                        name: `> 🌋 Volcan : `,
                        value: Volcan,
                        inline: true
                    },
                ],
                color: interaction.member.displayColor,
                timestamp: new Date(),
                footer: { text: Pays.devise }
            };

            await interaction.reply({ embeds: [embed] });
        });
    }
};
