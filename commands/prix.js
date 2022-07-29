const { SlashCommandBuilder, codeBlock } = require('@discordjs/builders');
const { readFileSync } = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('prix')
        .setDescription(`Voir le prix moyen des ressources`),

    async execute(interaction) {
        const { connection } = require('../index.js');

        var sql = `SELECT * FROM pays WHERE id_joueur=${interaction.member.id}`;
        connection.query(sql, async(err, results) => {if (err) {throw err;}

            const jsonPrix = JSON.parse(readFileSync('data/prix.json', 'utf-8'));

            const embed = {
                author: {
                    name: `${results[0].rang} de ${results[0].nom}`,
                    icon_url: interaction.member.displayAvatarURL()
                },
                thumbnail: {
                    url: results[0].drapeau,
                },
                title: `Quick Market (QM) :`,
                fields: [{
                    name: `> 💻 Biens de consommation : `,
                    value: codeBlock(`• Vente : ${(jsonPrix.bc * 0.7).toFixed(2)} | Prix moyen : ${jsonPrix.bc} | Achat : ${(jsonPrix.bc * 1.3).toFixed(2)}`) + `\u200B`
                }, {
                    name: `> 🪵 Bois : `,
                    value: codeBlock(`• Vente : ${(jsonPrix.bois * 0.7).toFixed(2)} | Prix moyen : ${jsonPrix.bois} | Achat : ${(jsonPrix.bois * 1.3).toFixed(2)}`) + `\u200B`
                }, {
                    name: `> 🧱 Brique : `,
                    value: codeBlock(`• Vente : ${(jsonPrix.brique * 0.7).toFixed(2)} | Prix moyen : ${jsonPrix.brique} | Achat : ${(jsonPrix.brique * 1.3).toFixed(2)}`) + `\u200B`
                }, {
                    name: `> 💧 Eau : `,
                    value: codeBlock(`• Vente : ${(jsonPrix.eau * 0.7).toFixed(2)} | Prix moyen : ${jsonPrix.eau} | Achat : ${(jsonPrix.eau * 1.3).toFixed(2)}`) + `\u200B`
                }, {
                    name: `> 🪨 Métaux : `,
                    value: codeBlock(`• Vente : ${(jsonPrix.metaux * 0.7).toFixed(2)} | Prix moyen : ${jsonPrix.metaux} | Achat : ${(jsonPrix.metaux * 1.3).toFixed(2)}`) + `\u200B`
                }, {
                    name: `> 🌽 Nourriture : `,
                    value: codeBlock(`• Vente : ${(jsonPrix.nourriture * 0.7).toFixed(2)} | Prix moyen : ${jsonPrix.nourriture} | Achat : ${(jsonPrix.nourriture * 1.3).toFixed(2)}`) + `\u200B`
                }, {
                    name: `> 🛢️ Pétrole : `,
                    value: codeBlock(`• Vente : ${(jsonPrix.petrole * 0.7).toFixed(2)} | Prix moyen : ${jsonPrix.petrole} | Achat : ${(jsonPrix.petrole * 1.3).toFixed(2)}`) + `\u200B`
                }, ],
                color: interaction.member.displayHexColor,
            };

            await interaction.reply({ embeds: [embed] });
        });
    },
};