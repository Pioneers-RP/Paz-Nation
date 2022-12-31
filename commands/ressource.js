const { SlashCommandBuilder, codeBlock } = require('@discordjs/builders');
const { readFileSync } = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ressource')
        .setDescription(`Affiche vos ressources`),

    async execute(interaction) {
        const { connection } = require('../index.js');
        const ressourceObject = JSON.parse(readFileSync('data/ressource.json', 'utf-8'));

        const sql = `
            SELECT * FROM pays WHERE id_joueur='${interaction.member.id}';
            SELECT * FROM ressources WHERE id_joueur='${interaction.member.id}';
            SELECT * FROM territoire WHERE id_joueur='${interaction.member.id}';
        `;
        connection.query(sql, async(err, results) => {if (err) {throw err;}
            const Pays = results[0][0];
            const Ressources = results[1][0];
            const Territoire = results[2][0];

            const pourVille = (Territoire.ville/Territoire.T_total)
            const pourForet = (Territoire.foret/Territoire.T_total)
            const pourPrairie = (Territoire.prairie/Territoire.T_total)
            const pourDesert = (Territoire.desert/Territoire.T_total)
            const pourToundra = (Territoire.toundra/Territoire.T_total)
            const pourTaiga = (Territoire.taiga/Territoire.T_total)
            const pourSavane = (Territoire.savane/Territoire.T_total)
            const pourRocheuses = (Territoire.rocheuses/Territoire.T_total)
            const pourVolcan = (Territoire.volcan/Territoire.T_total)
            const pourMangrove = (Territoire.mangrove/Territoire.T_total)
            const pourSteppe = (Territoire.steppe/Territoire.T_total)

            let Bc = codeBlock(`📦 ${Ressources.bc.toLocaleString('en-US')}`);

            let Prod = parseFloat((pourVille * ressourceObject.bois.ville + pourForet * ressourceObject.bois.foret + pourPrairie * ressourceObject.bois.prairie + pourDesert * ressourceObject.bois.desert + pourToundra * ressourceObject.bois.toundra + pourTaiga * ressourceObject.bois.taiga + pourSavane * ressourceObject.bois.savane + pourRocheuses * ressourceObject.bois.rocheuses + pourVolcan * ressourceObject.bois.volcan + pourMangrove * ressourceObject.bois.mangrove + pourSteppe * ressourceObject.bois.steppe).toFixed(2))
            let Bois = codeBlock(`📦 ${Ressources.bois.toLocaleString('en-US')} | ⚙ x${Prod}`);

            Prod = parseFloat((pourVille * ressourceObject.brique.ville + pourForet * ressourceObject.brique.foret + pourPrairie * ressourceObject.brique.prairie + pourDesert * ressourceObject.brique.desert + pourToundra * ressourceObject.brique.toundra + pourTaiga * ressourceObject.brique.taiga + pourSavane * ressourceObject.brique.savane + pourRocheuses * ressourceObject.brique.rocheuses + pourVolcan * ressourceObject.brique.volcan + pourMangrove * ressourceObject.brique.mangrove + pourSteppe * ressourceObject.brique.steppe).toFixed(2))
            let Brique = codeBlock(`📦 ${Ressources.brique.toLocaleString('en-US')} | ⚙ x${Prod}`);

            Prod = parseFloat((pourVille * ressourceObject.eau.ville + pourForet * ressourceObject.eau.foret + pourPrairie * ressourceObject.eau.prairie + pourDesert * ressourceObject.eau.desert + pourToundra * ressourceObject.eau.toundra + pourTaiga * ressourceObject.eau.taiga + pourSavane * ressourceObject.eau.savane + pourRocheuses * ressourceObject.eau.rocheuses + pourVolcan * ressourceObject.eau.volcan + pourMangrove * ressourceObject.eau.mangrove + pourSteppe * ressourceObject.eau.steppe).toFixed(2))
            let Eau = codeBlock(`📦 ${Ressources.eau.toLocaleString('en-US')} | ⚙ x${Prod}`);

            Prod = parseFloat((pourVille * ressourceObject.electricite.ville + pourForet * ressourceObject.electricite.foret + pourPrairie * ressourceObject.electricite.prairie + pourDesert * ressourceObject.electricite.desert + pourToundra * ressourceObject.electricite.toundra + pourTaiga * ressourceObject.electricite.taiga + pourSavane * ressourceObject.electricite.savane + pourRocheuses * ressourceObject.electricite.rocheuses + pourVolcan * ressourceObject.electricite.volcan + pourMangrove * ressourceObject.electricite.mangrove + pourSteppe * ressourceObject.electricite.steppe).toFixed(2))
            let Electricite = codeBlock(`⚙ x${Prod}`);

            Prod = parseFloat((pourVille * ressourceObject.metaux.ville + pourForet * ressourceObject.metaux.foret + pourPrairie * ressourceObject.metaux.prairie + pourDesert * ressourceObject.metaux.desert + pourToundra * ressourceObject.metaux.toundra + pourTaiga * ressourceObject.metaux.taiga + pourSavane * ressourceObject.metaux.savane + pourRocheuses * ressourceObject.metaux.rocheuses + pourVolcan * ressourceObject.metaux.volcan + pourMangrove * ressourceObject.metaux.mangrove + pourSteppe * ressourceObject.metaux.steppe).toFixed(2))
            let Metaux = codeBlock(`📦 ${Ressources.metaux.toLocaleString('en-US')} | ⚙ x${Prod}`);

            Prod = parseFloat((pourVille * ressourceObject.nourriture.ville + pourForet * ressourceObject.nourriture.foret + pourPrairie * ressourceObject.nourriture.prairie + pourDesert * ressourceObject.nourriture.desert + pourToundra * ressourceObject.nourriture.toundra + pourTaiga * ressourceObject.nourriture.taiga + pourSavane * ressourceObject.nourriture.savane + pourRocheuses * ressourceObject.nourriture.rocheuses + pourVolcan * ressourceObject.nourriture.volcan + pourMangrove * ressourceObject.nourriture.mangrove + pourSteppe * ressourceObject.nourriture.steppe).toFixed(2))
            let Nourriture = codeBlock(`📦 ${Ressources.nourriture.toLocaleString('en-US')} | ⚙ x${Prod}`);

            Prod = parseFloat((pourVille * ressourceObject.petrole.ville + pourForet * ressourceObject.petrole.foret + pourPrairie * ressourceObject.petrole.prairie + pourDesert * ressourceObject.petrole.desert + pourToundra * ressourceObject.petrole.toundra + pourTaiga * ressourceObject.petrole.taiga + pourSavane * ressourceObject.petrole.savane + pourRocheuses * ressourceObject.petrole.rocheuses + pourVolcan * ressourceObject.petrole.volcan + pourMangrove * ressourceObject.petrole.mangrove + pourSteppe * ressourceObject.petrole.steppe).toFixed(2))
            let Petrole = codeBlock(`📦 ${Ressources.petrole.toLocaleString('en-US')} | ⚙  x${Prod}`);

            const embed = {
                author: {
                    name: `${Pays.rang} de ${Pays.nom}`,
                    icon_url: interaction.member.displayAvatarURL()
                },
                thumbnail: {
                    url: `${Pays.drapeau}`,
                },
                title: `\`Ressources\``,
                fields: [
                    {
                        name: `> \uD83D\uDCBB Biens de consommation : `,
                        value: Bc
                    },
                    {
                        name: `> 🪵 Bois :`,
                        value: Bois
                    },
                    {
                        name: `> 🧱 Brique :`,
                        value: Brique
                    },
                    {
                        name: `> 💧 Eau :`,
                        value: Eau
                    },
                    {
                        name: `> ⚡ Electricité éolienne:`,
                        value: Electricite
                    },
                    {
                        name: `> 🪨 Metaux :`,
                        value: Metaux
                    },
                    {
                        name: `> 🌽 Nourriture :`,
                        value: Nourriture
                    },
                    {
                        name: `> 🛢️ Pétrole :`,
                        value: Petrole
                    }
                ],
                color: interaction.member.displayHexColor,
                timestamp: new Date(),
                footer: { text: Pays.devise }
            };

            await interaction.reply({ embeds: [embed] });
        });
    }
};
