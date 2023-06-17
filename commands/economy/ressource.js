const { SlashCommandBuilder, codeBlock} = require('discord.js');
const { readFileSync } = require('fs');
const regionObject = JSON.parse(readFileSync('data/region.json', 'utf-8'));
const ressourceObject = JSON.parse(readFileSync('data/ressource.json', 'utf-8'));

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ressource')
        .setDescription(`Affiche vos ressources`),

    async execute(interaction) {
        const { connection } = require('../../index.js');

        const sql = `
            SELECT * FROM batiments WHERE id_joueur='${interaction.member.id}';
            SELECT * FROM pays WHERE id_joueur='${interaction.member.id}';
            SELECT * FROM ressources WHERE id_joueur='${interaction.member.id}';
            SELECT * FROM territoire WHERE id_joueur='${interaction.member.id}';
        `;
        connection.query(sql, async(err, results) => {if (err) {throw err;}
            const Pays = results[1][0];
            const Ressources = results[2][0];
            const Territoire = results[3][0];

            //region Calcul des coefficients de production des ressources
            let T_bois = (Territoire.foret + Territoire.taiga + Territoire.rocheuses + Territoire.mangrove + Territoire.jungle);
            if (T_bois === 0) {
                T_bois = 1;
            }
            let T_eau = (Territoire.foret + Territoire.prairie + Territoire.toundra + Territoire.taiga + Territoire.savane + Territoire.rocheuses + Territoire.mangrove + Territoire.steppe + Territoire.jungle + Territoire.lac);
            if (T_eau === 0) {
                T_eau = 1;
            }
            let T_nourriture = (Territoire.prairie + Territoire.desert + Territoire.savane + Territoire.steppe + Territoire.jungle)
            if (T_nourriture === 0) {
                T_nourriture = 1;
            }
            const coef_bois = parseFloat(((Territoire.foret/T_bois) * ressourceObject.bois.foret + (Territoire.taiga/T_bois) * ressourceObject.bois.taiga + (Territoire.rocheuses/T_bois) * ressourceObject.bois.rocheuses + (Territoire.mangrove/T_bois) * ressourceObject.bois.mangrove + (Territoire.jungle/T_bois) * ressourceObject.bois.jungle).toFixed(2))
            const coef_charbon = eval(`regionObject.${Territoire.region}.charbon`)
            const coef_eau = parseFloat(((Territoire.foret/T_eau) * ressourceObject.eau.foret + (Territoire.prairie/T_eau) * ressourceObject.eau.prairie + (Territoire.toundra/T_eau) * ressourceObject.eau.toundra + (Territoire.taiga/T_eau) * ressourceObject.eau.taiga + (Territoire.savane/T_eau) * ressourceObject.eau.savane + (Territoire.rocheuses/T_eau) * ressourceObject.eau.rocheuses + (Territoire.mangrove/T_eau) * ressourceObject.eau.mangrove + (Territoire.steppe/T_eau) * ressourceObject.eau.steppe  + (Territoire.jungle/T_eau) * ressourceObject.eau.jungle  + (Territoire.lac/T_eau) * ressourceObject.eau.lac).toFixed(2))
            const coef_metaux = eval(`regionObject.${Territoire.region}.metaux`)
            const coef_nourriture = parseFloat(((Territoire.prairie/T_nourriture) * ressourceObject.nourriture.prairie + (Territoire.savane/T_nourriture) * ressourceObject.nourriture.savane + (Territoire.mangrove/T_nourriture) * ressourceObject.nourriture.mangrove + (Territoire.steppe/T_nourriture) * ressourceObject.nourriture.steppe + (Territoire.jungle/T_nourriture) * ressourceObject.nourriture.jungle).toFixed(2))
            const coef_petrole = eval(`regionObject.${Territoire.region}.petrole`)
            const coef_sable = eval(`regionObject.${Territoire.region}.sable`)
            //endregion

            const embed = {
                author: {
                    name: `${Pays.rang} de ${Pays.nom}`,
                    icon_url: interaction.member.displayAvatarURL()
                },
                thumbnail: {
                    url: Pays.drapeau
                },
                title: `\`Ressources\``,
                fields: [
                    {
                        name: `> <:acier:1075776411329122304> Acier :`,
                        value: codeBlock(`• ${Ressources.acier.toLocaleString('en-US')}`)
                    },
                    {
                        name: `> <:beton:1075776342227943526> Béton :`,
                        value: codeBlock(`• ${Ressources.beton.toLocaleString('en-US')}`)
                    },
                    {
                        name: `> \uD83D\uDCBB Biens de consommation :`,
                        value: codeBlock(`• ${Ressources.bc.toLocaleString('en-US')}`)
                    },
                    {
                        name: `> 🪵 Bois : ⚙ x${coef_bois}`,
                        value: codeBlock(`• ${Ressources.bois.toLocaleString('en-US')}`)
                    },
                    {
                        name: `> ⛽ Carburant :`,
                        value: codeBlock(`• ${Ressources.carburant.toLocaleString('en-US')}`)
                    },
                    {
                        name: `> <:charbon:1075776385517375638> Charbon : ⚙ x${coef_charbon}`,
                        value: codeBlock(`• ${Ressources.charbon.toLocaleString('en-US')}`)
                    },
                    {
                        name: `> 💧 Eau : ⚙ x${coef_eau}`,
                        value: codeBlock(`• ${Ressources.eau.toLocaleString('en-US')}`)
                    },
                    {
                        name: `> <:windmill:1108767955442991225> Eolienne :`,
                        value: codeBlock(`• ${Ressources.eolienne.toLocaleString('en-US')}`)
                    },
                    {
                        name: `> 🪨 Metaux : ⚙ x${coef_metaux}`,
                        value: codeBlock(`• ${Ressources.metaux.toLocaleString('en-US')}`)
                    },
                    {
                        name: `> 🌽 Nourriture : ⚙ x${coef_nourriture}`,
                        value: codeBlock(`• ${Ressources.nourriture.toLocaleString('en-US')}`)
                    },
                    {
                        name: `> 🛢️ Pétrole : ⚙ x${coef_petrole}`,
                        value: codeBlock(`• ${Ressources.petrole.toLocaleString('en-US')}`)
                    },
                    {
                        name: `> <:sable:1075776363782479873> Sable : ⚙ x${coef_sable}`,
                        value: codeBlock(`• ${Ressources.sable.toLocaleString('en-US')}`)
                    },
                    {
                        name: `> 🪟 Verre :`,
                        value: codeBlock(`• ${Ressources.verre.toLocaleString('en-US')}`)
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
