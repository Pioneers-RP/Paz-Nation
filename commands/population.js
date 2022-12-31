const { SlashCommandBuilder, codeBlock } = require('@discordjs/builders');
const { readFileSync } = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('population')
        .setDescription(`Menu de votre population`)
        .addUserOption(user =>
            user.setName('joueur')
                .setDescription(`Le joueur dont vous voulez voir l'économie`)),

    async execute(interaction) {
        const { connection } = require('../index.js');
        let Joueur = interaction.options.getUser('joueur');

        if (!Joueur) {
            Joueur = interaction.member;
        }

        function getPopulation(joueur) {
            const sql = `
                    SELECT * FROM batiments WHERE id_joueur='${joueur.id}';
                    SELECT * FROM pays WHERE id_joueur='${joueur.id}';
                    SELECT * FROM population WHERE id_joueur='${joueur.id}';
                    SELECT * FROM territoire WHERE id_joueur='${joueur.id}'
            `;
            connection.query(sql, async(err, results) => {if (err) {throw err;}
                const Batiment = results[0][0];
                const Pays = results[1][0];
                const Population = results[2][0];
                const Territoire = results[3][0];

                if (!results[0][0]) {
                    const reponse = codeBlock('diff', `- Cette personne ne joue pas.`);
                    await interaction.reply({ content: reponse, ephemeral: true });
                } else {
                    const Habitants = Population.enfant + Population.jeune + Population.adulte + Population.vieux;
                    const Densite = (Habitants / Territoire.T_total).toFixed(0);
                    const populationObject = JSON.parse(readFileSync('data/population.json', 'utf-8'));
                    const batimentObject = JSON.parse(readFileSync('data/batiment.json', 'utf-8'));

                    const ConsoEau = Math.round((Habitants * parseFloat(populationObject.EAU_CONSO))).toLocaleString('en-US');
                    const ApproEau = Population.eau_appro.toLocaleString('en-US');
                    const ConsoNourriture = Math.round((Habitants * parseFloat(populationObject.NOURRITURE_CONSO))).toLocaleString('en-US');
                    const ApproNourriture = Population.nourriture_appro.toLocaleString('en-US');
                    const ConsoBc = (1 + Population.bc_acces * 0.04 + Population.bonheur * 0.016 + (Habitants / 10000000) * 0.04).toFixed(1)
                    const ApproBc = (batimentObject.usine_civile.PROD_USINE_CIVILE * Batiment.usine_civile * 48 / Habitants).toFixed(1)

                    const embed = {
                        author: {
                            name: `${Pays.rang} de ${Pays.nom}`,
                            icon_url: joueur.displayAvatarURL()
                        },
                        thumbnail: {
                            url: Pays.drapeau
                        },
                        title: `\`Vue globale de la population\``,
                        fields: [{
                            name: `> 👪 Population`,
                            value: codeBlock(
                                `• ${Habitants.toLocaleString('en-US')} habitants\n` +
                                `• ${Population.bonheur}% bonheur\n` +
                                `• ${Densite.toLocaleString('en-US')} habitants/km²`) + `\u200B`
                        },
                            {
                                name: `> 🛒 Consommation/Approvisionnement`,
                                value: codeBlock(
                                    `• ${ConsoEau}/${ApproEau} eau\n` +
                                    `• ${ConsoNourriture}/${ApproNourriture} nourriture\n` +
                                    `• ${ConsoBc}/${ApproBc} biens de consommation`) + `\u200B`
                            },
                            {
                                name: `> 🧎 Répartion`,
                                value: codeBlock(
                                    `• ${Population.enfant.toLocaleString('en-US')} enfants\n` +
                                    `• ${Population.jeune.toLocaleString('en-US')} jeunes\n` +
                                    `• ${Population.adulte.toLocaleString('en-US')} adultes\n` +
                                    `• ${Population.vieux.toLocaleString('en-US')} vieux\n`) + `\u200B`
                            },
                            {
                                name: `> 🏘️ Batiments`,
                                value: codeBlock(
                                    `• ${Batiment.quartier.toLocaleString('en-US')} quartiers`) + `\u200B`
                            }
                        ],
                        color: joueur.displayHexColor,
                        timestamp: new Date(),
                        footer: {
                            text: `${Pays.devise}`
                        },
                    };

                    await interaction.reply({ embeds: [embed] });
                }
            });
        }

        getPopulation(Joueur);
    },
};