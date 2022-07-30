const { SlashCommandBuilder, codeBlock } = require('@discordjs/builders');
const { readFileSync } = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('consommation')
        .setDescription(`Affiche votre consommation de ressource`),

    async execute(interaction) {
        const { connection } = require('../index.js');
        const jsonObject = JSON.parse(readFileSync('data/region.json', 'utf-8'));
        var sql = `SELECT * FROM pays WHERE id_joueur='${interaction.member.id}'`;
        connection.query(sql, async(err, results) => {if (err) {throw err;}

            var prod = Math.round(process.env.PROD_USINE_CIVILE * results[0].usine_civile);
            var conso = Math.round((1 + results[0].bc_acces * 0.04 + results[0].bonheur * 0.016 + (results[0].population / 10000000) * 0.04) * results[0].population / 48);
            var diff = (prod - conso);
            if (diff > 0) {
                var bc = codeBlock('ml', `"-${conso.toLocaleString('en-US')} | +${prod.toLocaleString('en-US')} | :${(prod - conso).toLocaleString('en-US')}" | 📦 ${results[0].bc.toLocaleString('en-US')}`);
            } else if (diff == 0) {
                var bc = codeBlock('fix', `-${conso.toLocaleString('en-US')} | +${prod.toLocaleString('en-US')} | :${(prod - conso).toLocaleString('en-US')} | 📦 ${results[0].bc.toLocaleString('en-US')}`);
            } else {
                var bc = codeBlock('diff', `-${conso.toLocaleString('en-US')} | +${prod.toLocaleString('en-US')} | :${(prod - conso).toLocaleString('en-US')} | 📦 ${results[0].bc.toLocaleString('en-US')}`);
            };

            var prod = Math.round(process.env.PROD_SCIERIE * results[0].scierie * ((parseInt((eval(`jsonObject.${results[0].region}.bois`))) + 100) / 100));
            var conso = Math.round(process.env.CONSO_BRIQUETERIE_BOIS * results[0].briqueterie + process.env.CONSO_MINE_BOIS * results[0].mine + process.env.CONSO_USINE_CIVILE_BOIS * results[0].usine_civile);
            var diff = (prod - conso);
            if (diff > 0) {
                var bois = codeBlock('ml', `"-${conso.toLocaleString('en-US')} | +${prod.toLocaleString('en-US')} | :${(prod - conso).toLocaleString('en-US')}" | 📦 ${results[0].bois.toLocaleString('en-US')}`);
            } else if (diff == 0) {
                var bois = codeBlock('fix', `-${conso.toLocaleString('en-US')} | +${prod.toLocaleString('en-US')} | :${(prod - conso).toLocaleString('en-US')} | 📦 ${results[0].bois.toLocaleString('en-US')}`);
            } else {
                var bois = codeBlock('diff', `-${conso.toLocaleString('en-US')} | +${prod.toLocaleString('en-US')} | :${(prod - conso).toLocaleString('en-US')} | 📦 ${results[0].bois.toLocaleString('en-US')}`);
            };

            var prod = Math.round(process.env.PROD_BRIQUETERIE * results[0].briqueterie);
            var conso = 0;
            var diff = (prod - conso);
            if (diff > 0) {
                var brique = codeBlock('ml', `"-${conso.toLocaleString('en-US')} | +${prod.toLocaleString('en-US')} | :${(prod - conso).toLocaleString('en-US')}" | 📦 ${results[0].brique.toLocaleString('en-US')}`);
            } else if (diff == 0) {
                var brique = codeBlock('fix', `-${conso.toLocaleString('en-US')} | +${prod.toLocaleString('en-US')} | :${(prod - conso).toLocaleString('en-US')} | 📦 ${results[0].brique.toLocaleString('en-US')}`);
            } else {
                var brique = codeBlock('diff', `-${conso.toLocaleString('en-US')} | +${prod.toLocaleString('en-US')} | :${(prod - conso).toLocaleString('en-US')} | 📦 ${results[0].brique.toLocaleString('en-US')}`);
            };

            var prod = Math.round(process.env.PROD_POMPE_A_EAU * results[0].pompe_a_eau * ((parseInt((eval(`jsonObject.${results[0].region}.eau`))) + 100) / 100));
            var conso = Math.round(process.env.CONSO_BRIQUETERIE_EAU * results[0].briqueterie + process.env.CONSO_CHAMP_EAU * results[0].champ + results[0].eau_appro / 48);
            var diff = (prod - conso);
            if (diff > 0) {
                var eau = codeBlock('ml', `"-${conso.toLocaleString('en-US')} | +${prod.toLocaleString('en-US')} | :${(prod - conso).toLocaleString('en-US')}" | 📦 ${results[0].eau.toLocaleString('en-US')}`);
            } else if (diff == 0) {
                var eau = codeBlock('fix', `-${conso.toLocaleString('en-US')} | +${prod.toLocaleString('en-US')} | :${(prod - conso).toLocaleString('en-US')} | 📦 ${results[0].eau.toLocaleString('en-US')}`);
            } else {
                var eau = codeBlock('diff', `-${conso.toLocaleString('en-US')} | +${prod.toLocaleString('en-US')} | :${(prod - conso).toLocaleString('en-US')} | 📦 ${results[0].eau.toLocaleString('en-US')}`);
            };

            var prod = Math.round(process.env.PROD_CENTRALE_FIOUL * results[0].centrale_fioul + process.env.PROD_EOLIENNE * results[0].eolienne);
            var conso = Math.round(process.env.CONSO_BRIQUETERIE_ELECTRICITE * results[0].briqueterie + process.env.CONSO_CHAMP_ELECTRICITE * results[0].champ + process.env.CONSO_MINE_ELECTRICITE * results[0].mine + process.env.CONSO_POMPE_A_EAU_ELECTRICITE * results[0].pompe_a_eau + process.env.CONSO_PUMPJACK_ELECTRICITE * results[0].pumpjack + process.env.CONSO_QUARTIER_ELECTRICITE * results[0].quartier + process.env.CONSO_SCIERIE_ELECTRICITE * results[0].scierie + process.env.CONSO_USINE_CIVILE_ELECTRICITE * results[0].usine_civile);
            var diff = (prod - conso);
            if (diff > 0) {
                var electricite = codeBlock('ml', `"-${conso.toLocaleString('en-US')} | +${prod.toLocaleString('en-US')} | :${(prod - conso).toLocaleString('en-US')}"`);
            } else if (diff == 0) {
                var electricite = codeBlock('fix', `-${conso.toLocaleString('en-US')} | +${prod.toLocaleString('en-US')} | :${(prod - conso).toLocaleString('en-US')}`);
            } else {
                var electricite = codeBlock('diff', `-${conso.toLocaleString('en-US')} | +${prod.toLocaleString('en-US')} | :${(prod - conso).toLocaleString('en-US')}`);
            };

            var prod = Math.round(process.env.PROD_MINE * results[0].mine * ((parseInt((eval(`jsonObject.${results[0].region}.metaux`))) + 100) / 100));
            var conso = Math.round(process.env.CONSO_USINE_CIVILE_METAUX * results[0].usine_civile);
            var diff = (prod - conso);
            if (diff > 0) {
                var metaux = codeBlock('ml', `"-${conso.toLocaleString('en-US')} | +${prod.toLocaleString('en-US')} | :${(prod - conso).toLocaleString('en-US')}" | 📦 ${results[0].metaux.toLocaleString('en-US')}`);
            } else if (diff == 0) {
                var metaux = codeBlock('fix', `-${conso.toLocaleString('en-US')} | +${prod.toLocaleString('en-US')} | :${(prod - conso).toLocaleString('en-US')} | 📦 ${results[0].metaux.toLocaleString('en-US')}`);
            } else {
                var metaux = codeBlock('diff', `-${conso.toLocaleString('en-US')} | +${prod.toLocaleString('en-US')} | :${(prod - conso).toLocaleString('en-US')} | 📦 ${results[0].metaux.toLocaleString('en-US')}`);
            };

            var prod = Math.round(process.env.PROD_CHAMP * results[0].champ * ((parseInt((eval(`jsonObject.${results[0].region}.nourriture`))) + 100) / 100));
            var conso = Math.round((results[0].nourriture_appro) / 48)
            var diff = (prod - conso);
            if (diff > 0) {
                var nourriture = codeBlock('ml', `"-${conso.toLocaleString('en-US')} | +${prod.toLocaleString('en-US')} | :${(prod - conso).toLocaleString('en-US')}" | 📦 ${results[0].nourriture.toLocaleString('en-US')}`);
            } else if (diff == 0) {
                var nourriture = codeBlock('fix', `-${conso.toLocaleString('en-US')} | +${prod.toLocaleString('en-US')} | :${(prod - conso).toLocaleString('en-US')} | 📦 ${results[0].nourriture.toLocaleString('en-US')}`);
            } else {
                var nourriture = codeBlock('diff', `-${conso.toLocaleString('en-US')} | +${prod.toLocaleString('en-US')} | :${(prod - conso).toLocaleString('en-US')} | 📦 ${results[0].nourriture.toLocaleString('en-US')}`);
            };

            var prod = Math.round(process.env.PROD_PUMPJACK * results[0].pumpjack * ((parseInt((eval(`jsonObject.${results[0].region}.petrole`))) + 100) / 100));
            var conso = Math.round(process.env.CONSO_CENTRALE_FIOUL_PETROLE * results[0].centrale_fioul + process.env.CONSO_MINE_PETROLE * results[0].mine + process.env.CONSO_POMPE_A_EAU_PETROLE * results[0].pompe_a_eau + process.env.CONSO_SCIERIE_PETROLE * results[0].scierie + process.env.CONSO_USINE_CIVILE_PETROLE * results[0].usine_civile);
            var diff = (prod - conso);
            if (diff > 0) {
                var petrole = codeBlock('ml', `"-${conso.toLocaleString('en-US')} | +${prod.toLocaleString('en-US')} | :${(prod - conso).toLocaleString('en-US')}" | 📦 ${results[0].petrole.toLocaleString('en-US')}`);
            } else if (diff == 0) {
                var petrole = codeBlock('fix', `-${conso.toLocaleString('en-US')} | +${prod.toLocaleString('en-US')} | :${(prod - conso).toLocaleString('en-US')} | 📦 ${results[0].petrole.toLocaleString('en-US')}`);
            } else {
                var petrole = codeBlock('diff', `-${conso.toLocaleString('en-US')} | +${prod.toLocaleString('en-US')} | :${(prod - conso).toLocaleString('en-US')} | 📦 ${results[0].petrole.toLocaleString('en-US')}`);
            };

            const embed = {
                author: {
                    name: `${results[0].rang} de ${results[0].nom}`,
                    icon_url: interaction.member.displayAvatarURL()
                },
                thumbnail: {
                    url: `${results[0].drapeau}`,
                },
                title: `\`Consommation en ressources\``,
                fields: [{
                        name: `> 💻 Biens de consommation :`,
                        value: bc,
                    },
                    {
                        name: `> 🪵 Bois :`,
                        value: bois,
                    },
                    {
                        name: `> 🧱 Brique :`,
                        value: brique,
                    },
                    {
                        name: `> 💧 Eau :`,
                        value: eau,
                    },
                    {
                        name: `> ⚡ Electricité :`,
                        value: electricite,
                    },
                    {
                        name: `> 🪨 Metaux :`,
                        value: metaux,
                    },
                    {
                        name: `> 🌽 Nourriture :`,
                        value: nourriture,
                    },
                    {
                        name: `> 🛢️ Pétrole :`,
                        value: petrole,
                    }
                ],
                color: interaction.member.displayHexColor,
                timestamp: new Date(),
                footer: { text: results[0].devise }
            };

            await interaction.reply({ embeds: [embed] });
        });
    }
};
