const { SlashCommandBuilder, codeBlock } = require('@discordjs/builders');
const { readFileSync } = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('consommation')
        .setDescription(`Affiche votre consommation de ressource`),

    async execute(interaction) {
        const { connection } = require('../index.js');
        const regionObject = JSON.parse(readFileSync('data/region.json', 'utf-8'));
        const gouvernementObject = JSON.parse(readFileSync('data/gouvernement.json', 'utf-8'));
        const batimentObject = JSON.parse(readFileSync('data/batiment.json', 'utf-8'));
        const sql = `SELECT * FROM pays WHERE id_joueur='${interaction.member.id}'`;
        connection.query(sql, async(err, results) => {
            let petrole;
            let nourriture;
            let metaux;
            let electricite;
            let eau;
            let brique;
            let bois;
            let bc;
            if (err) {throw err;}

            const habitants = results[0].enfant + results[0].jeune + results[0].adulte + results[0].vieux;
            let prod = Math.round(batimentObject.usine_civile.PROD_USINE_CIVILE * results[0].usine_civile * eval(`gouvernementObject.${results[0].ideologie}.production`));
            let conso = Math.round((1 + results[0].bc_acces * 0.04 + results[0].bonheur * 0.016 + (habitants / 10000000) * 0.04) * habitants / 48 * eval(`gouvernementObject.${results[0].ideologie}.conso_bc`));

            let diff = (prod - conso);
            if (diff > 0) {
                bc = codeBlock('ml', `"-${conso.toLocaleString('en-US')} | +${prod.toLocaleString('en-US')} | :${(prod - conso).toLocaleString('en-US')}" | 📦 ${results[0].bc.toLocaleString('en-US')}`);
            } else if (diff === 0) {
                bc = codeBlock('fix', `-${conso.toLocaleString('en-US')} | +${prod.toLocaleString('en-US')} | :${(prod - conso).toLocaleString('en-US')} | 📦 ${results[0].bc.toLocaleString('en-US')}`);
            } else {
                bc = codeBlock('diff', `-${conso.toLocaleString('en-US')} | +${prod.toLocaleString('en-US')} | :${(prod - conso).toLocaleString('en-US')} | 📦 ${results[0].bc.toLocaleString('en-US')}`);
            }

            prod = Math.round(batimentObject.scierie.PROD_SCIERIE * results[0].scierie * eval(`gouvernementObject.${results[0].ideologie}.production`) * ((parseInt((eval(`regionObject.${results[0].region}.bois`))) + 100) / 100));
            conso = Math.round((batimentObject.briqueterie.CONSO_BRIQUETERIE_BOIS * results[0].briqueterie + batimentObject.mine.CONSO_MINE_BOIS * results[0].mine + batimentObject.usine_civile.CONSO_USINE_CIVILE_BOIS * results[0].usine_civile) * eval(`gouvernementObject.${results[0].ideologie}.consommation`));
            diff = (prod - conso);
            if (diff > 0) {
                bois = codeBlock('ml', `"-${conso.toLocaleString('en-US')} | +${prod.toLocaleString('en-US')} | :${(prod - conso).toLocaleString('en-US')}" | 📦 ${results[0].bois.toLocaleString('en-US')}`);
            } else if (diff === 0) {
                bois = codeBlock('fix', `-${conso.toLocaleString('en-US')} | +${prod.toLocaleString('en-US')} | :${(prod - conso).toLocaleString('en-US')} | 📦 ${results[0].bois.toLocaleString('en-US')}`);
            } else {
                bois = codeBlock('diff', `-${conso.toLocaleString('en-US')} | +${prod.toLocaleString('en-US')} | :${(prod - conso).toLocaleString('en-US')} | 📦 ${results[0].bois.toLocaleString('en-US')}`);
            }

            prod = Math.round(batimentObject.briqueterie.PROD_BRIQUETERIE * results[0].briqueterie * eval(`gouvernementObject.${results[0].ideologie}.production`));
            conso = 0;
            diff = (prod - conso);
            if (diff > 0) {
                brique = codeBlock('ml', `"-${conso.toLocaleString('en-US')} | +${prod.toLocaleString('en-US')} | :${(prod - conso).toLocaleString('en-US')}" | 📦 ${results[0].brique.toLocaleString('en-US')}`);
            } else if (diff === 0) {
                brique = codeBlock('fix', `-${conso.toLocaleString('en-US')} | +${prod.toLocaleString('en-US')} | :${(prod - conso).toLocaleString('en-US')} | 📦 ${results[0].brique.toLocaleString('en-US')}`);
            } else {
                brique = codeBlock('diff', `-${conso.toLocaleString('en-US')} | +${prod.toLocaleString('en-US')} | :${(prod - conso).toLocaleString('en-US')} | 📦 ${results[0].brique.toLocaleString('en-US')}`);
            }

            prod = Math.round(batimentObject.pompe_a_eau.PROD_POMPE_A_EAU * results[0].pompe_a_eau * eval(`gouvernementObject.${results[0].ideologie}.production`) * ((parseInt((eval(`regionObject.${results[0].region}.eau`))) + 100) / 100));
            conso = Math.round((batimentObject.briqueterie.CONSO_BRIQUETERIE_EAU * results[0].briqueterie + batimentObject.champ.CONSO_CHAMP_EAU * results[0].champ + results[0].eau_appro / 48) * eval(`gouvernementObject.${results[0].ideologie}.consommation`));
            diff = (prod - conso);
            if (diff > 0) {
                eau = codeBlock('ml', `"-${conso.toLocaleString('en-US')} | +${prod.toLocaleString('en-US')} | :${(prod - conso).toLocaleString('en-US')}" | 📦 ${results[0].eau.toLocaleString('en-US')}`);
            } else if (diff === 0) {
                eau = codeBlock('fix', `-${conso.toLocaleString('en-US')} | +${prod.toLocaleString('en-US')} | :${(prod - conso).toLocaleString('en-US')} | 📦 ${results[0].eau.toLocaleString('en-US')}`);
            } else {
                eau = codeBlock('diff', `-${conso.toLocaleString('en-US')} | +${prod.toLocaleString('en-US')} | :${(prod - conso).toLocaleString('en-US')} | 📦 ${results[0].eau.toLocaleString('en-US')}`);
            }

            prod = Math.round((batimentObject.centrale_fioul.PROD_CENTRALE_FIOUL * results[0].centrale_fioul + batimentObject.eolienne.PROD_EOLIENNE * results[0].eolienne));
            conso = Math.round(batimentObject.briqueterie.CONSO_BRIQUETERIE_ELECTRICITE * results[0].briqueterie + batimentObject.champ.CONSO_CHAMP_ELECTRICITE * results[0].champ + batimentObject.mine.CONSO_MINE_ELECTRICITE * results[0].mine + batimentObject.pompe_a_eau.CONSO_POMPE_A_EAU_ELECTRICITE * results[0].pompe_a_eau + batimentObject.pumpjack.CONSO_PUMPJACK_ELECTRICITE * results[0].pumpjack + batimentObject.quartier.CONSO_QUARTIER_ELECTRICITE * results[0].quartier + batimentObject.scierie.CONSO_SCIERIE_ELECTRICITE * results[0].scierie + batimentObject.usine_civile.CONSO_USINE_CIVILE_ELECTRICITE * results[0].usine_civile);
            diff = (prod - conso);
            if (diff > 0) {
                electricite = codeBlock('ml', `"-${conso.toLocaleString('en-US')} | +${prod.toLocaleString('en-US')} | :${(prod - conso).toLocaleString('en-US')}"`);
            } else if (diff === 0) {
                electricite = codeBlock('fix', `-${conso.toLocaleString('en-US')} | +${prod.toLocaleString('en-US')} | :${(prod - conso).toLocaleString('en-US')}`);
            } else {
                electricite = codeBlock('diff', `-${conso.toLocaleString('en-US')} | +${prod.toLocaleString('en-US')} | :${(prod - conso).toLocaleString('en-US')}`);
            }

            prod = Math.round(batimentObject.mine.PROD_MINE * results[0].mine * eval(`gouvernementObject.${results[0].ideologie}.production`) * ((parseInt((eval(`regionObject.${results[0].region}.metaux`))) + 100) / 100));
            conso = Math.round(batimentObject.usine_civile.CONSO_USINE_CIVILE_METAUX * results[0].usine_civile * eval(`gouvernementObject.${results[0].ideologie}.consommation`));
            diff = (prod - conso);
            if (diff > 0) {
                metaux = codeBlock('ml', `"-${conso.toLocaleString('en-US')} | +${prod.toLocaleString('en-US')} | :${(prod - conso).toLocaleString('en-US')}" | 📦 ${results[0].metaux.toLocaleString('en-US')}`);
            } else if (diff === 0) {
                metaux = codeBlock('fix', `-${conso.toLocaleString('en-US')} | +${prod.toLocaleString('en-US')} | :${(prod - conso).toLocaleString('en-US')} | 📦 ${results[0].metaux.toLocaleString('en-US')}`);
            } else {
                metaux = codeBlock('diff', `-${conso.toLocaleString('en-US')} | +${prod.toLocaleString('en-US')} | :${(prod - conso).toLocaleString('en-US')} | 📦 ${results[0].metaux.toLocaleString('en-US')}`);
            }

            prod = Math.round(batimentObject.champ.PROD_CHAMP * results[0].champ * eval(`gouvernementObject.${results[0].ideologie}.production`) * ((parseInt((eval(`regionObject.${results[0].region}.nourriture`))) + 100) / 100));
            conso = Math.round((results[0].nourriture_appro) / 48 * eval(`gouvernementObject.${results[0].ideologie}.consommation`));
            diff = (prod - conso);
            if (diff > 0) {
                nourriture = codeBlock('ml', `"-${conso.toLocaleString('en-US')} | +${prod.toLocaleString('en-US')} | :${(prod - conso).toLocaleString('en-US')}" | 📦 ${results[0].nourriture.toLocaleString('en-US')}`);
            } else if (diff === 0) {
                nourriture = codeBlock('fix', `-${conso.toLocaleString('en-US')} | +${prod.toLocaleString('en-US')} | :${(prod - conso).toLocaleString('en-US')} | 📦 ${results[0].nourriture.toLocaleString('en-US')}`);
            } else {
                nourriture = codeBlock('diff', `-${conso.toLocaleString('en-US')} | +${prod.toLocaleString('en-US')} | :${(prod - conso).toLocaleString('en-US')} | 📦 ${results[0].nourriture.toLocaleString('en-US')}`);
            }

            prod = Math.round(batimentObject.pumpjack.PROD_PUMPJACK * results[0].pumpjack * eval(`gouvernementObject.${results[0].ideologie}.production`) * ((parseInt((eval(`regionObject.${results[0].region}.petrole`))) + 100) / 100));
            conso = Math.round((batimentObject.centrale_fioul.CONSO_CENTRALE_FIOUL_PETROLE * results[0].centrale_fioul + batimentObject.mine.CONSO_MINE_PETROLE * results[0].mine + batimentObject.pompe_a_eau.CONSO_POMPE_A_EAU_PETROLE * results[0].pompe_a_eau + batimentObject.scierie.CONSO_SCIERIE_PETROLE * results[0].scierie + batimentObject.usine_civile.CONSO_USINE_CIVILE_PETROLE * results[0].usine_civile) * eval(`gouvernementObject.${results[0].ideologie}.consommation`));
            diff = (prod - conso);
            if (diff > 0) {
                petrole = codeBlock('ml', `"-${conso.toLocaleString('en-US')} | +${prod.toLocaleString('en-US')} | :${(prod - conso).toLocaleString('en-US')}" | 📦 ${results[0].petrole.toLocaleString('en-US')}`);
            } else if (diff === 0) {
                petrole = codeBlock('fix', `-${conso.toLocaleString('en-US')} | +${prod.toLocaleString('en-US')} | :${(prod - conso).toLocaleString('en-US')} | 📦 ${results[0].petrole.toLocaleString('en-US')}`);
            } else {
                petrole = codeBlock('diff', `-${conso.toLocaleString('en-US')} | +${prod.toLocaleString('en-US')} | :${(prod - conso).toLocaleString('en-US')} | 📦 ${results[0].petrole.toLocaleString('en-US')}`);
            }

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
