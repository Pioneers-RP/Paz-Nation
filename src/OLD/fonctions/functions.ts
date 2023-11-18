import {codeBlock, ActionRowBuilder, StringSelectMenuBuilder, ButtonBuilder, ButtonStyle} from "discord.js";
import {readFileSync} from "fs";
const armeeObject = JSON.parse(readFileSync('src/OLD/data/armee.json', 'utf-8'));
const assemblageObject = JSON.parse(readFileSync('src/OLD/data/assemblage.json', 'utf-8'));
const batimentObject = JSON.parse(readFileSync('src/OLD/data/batiment.json', 'utf-8'));
const biomeObject = JSON.parse(readFileSync('src/OLD/data/biome.json', 'utf-8'));
const gouvernementObject = JSON.parse(readFileSync('src/OLD/data/gouvernement.json', 'utf-8'));
const populationObject = JSON.parse(readFileSync('src/OLD/data/population.json', 'utf-8'));
const regionObject = JSON.parse(readFileSync('src/OLD/data/region.json', 'utf-8'));

export function calculerEmploi(armee: any, batiment: any, population: any) {
    const batiments = ['acierie', 'atelier_verre', 'carriere_sable', 'centrale_biomasse', 'centrale_charbon', 'centrale_fioul', 'champ', 'cimenterie', 'derrick', 'eolienne', 'mine_charbon', 'mine_metaux', 'station_pompage', 'raffinerie', 'scierie', 'usine_civile'];

    let jobsOverall = 0;
    batiments.forEach(type => {
        const key = `EMPLOYES_${type.toUpperCase()}`;
        const currentJobs = batimentObject[type][key] * batiment[type];
        jobsOverall += currentJobs;
    });

    const soldierCount = calculerSoldat(armee);
    const totalPopulation = population.jeune + population.adulte;
    const availableWorkers = totalPopulation - soldierCount;

    let unemployment = 0;
    if (jobsOverall < availableWorkers) {
        unemployment = Number((((availableWorkers - jobsOverall) / availableWorkers) * 100).toFixed(2));
    }

    const efficiency = Math.min(Number((availableWorkers / jobsOverall).toFixed(4)), 1);

    return { jobsOverall, availableWorkers, unemployment, efficiency };
}

export function calculerSoldat(armee: any) {
    const strategy = armeeObject[armee.strategie];

    return armee.unite * strategy.aviation * armeeObject.aviation.homme +
        armee.unite * strategy.infanterie * armeeObject.infanterie.homme +
        armee.unite * strategy.mecanise * armeeObject.mecanise.homme +
        armee.unite * strategy.support * armeeObject.support.homme +
        armee.aviation * armeeObject.aviation.homme +
        armee.infanterie * armeeObject.infanterie.homme +
        armee.mecanise * armeeObject.mecanise.homme +
        armee.support * armeeObject.support.homme;
}


export function menuArmee(interaction: any, connection: any) {
    const sql = `
        SELECT * FROM armee WHERE id_joueur='${interaction.member.id}';
        SELECT * FROM pays WHERE id_joueur='${interaction.member.id}'
    `;
    connection.query(sql, async(err: any, results: any[][]) => {if (err) {throw err;}
        const Armee = results[0][0];
        const Pays = results[1][0];
        const homme =
            (Armee.aviation * armeeObject.aviation.homme) +
            (Armee.infanterie * armeeObject.infanterie.homme) +
            (Armee.mecanise * armeeObject.mecanise.homme) +
            (Armee.support * armeeObject.support.homme);
        const hommeUnite =
            Armee.unite * eval(`armeeObject.${Armee.strategie}.aviation`) * eval(`armeeObject.aviation.homme`) +
            Armee.unite * eval(`armeeObject.${Armee.strategie}.infanterie`) * eval(`armeeObject.infanterie.homme`) +
            Armee.unite * eval(`armeeObject.${Armee.strategie}.mecanise`) * eval(`armeeObject.mecanise.homme`) +
            Armee.unite * eval(`armeeObject.${Armee.strategie}.support`) * eval(`armeeObject.support.homme`);

        const embed = {
            author: {
                name: `${Pays.rang} de ${Pays.nom}`,
                icon_url: interaction.member.displayAvatarURL()
            },
            thumbnail: {
                url: Pays.drapeau
            },
            title: `\`Vue globale du pays\``,
            fields: [
                {
                    name: `> ♟️ Stratégie :`,
                    value: codeBlock(`• ${eval(`armeeObject.${Armee.strategie}.nom`)}`) + `\u200B`
                },
                {
                    name: `> ⚖️ Performance :`,
                    value: codeBlock(
                        `• Victoires : ${Armee.victoire}\n` +
                        `• Défaites : ${Armee.defaite}\n`) + `\u200B`
                },
                {
                    name: `> 🪖 Unités : opérationnelles | réserves`,
                    value: codeBlock(
                        `• Unité : ${Armee.unite.toLocaleString('en-US')} | ${Math.floor(Math.min((Armee.aviation/eval(`armeeObject.${Armee.strategie}.aviation`)), (Armee.infanterie/eval(`armeeObject.${Armee.strategie}.infanterie`)), (Armee.mecanise/eval(`armeeObject.${Armee.strategie}.mecanise`)), (Armee.support/eval(`armeeObject.${Armee.strategie}.support`)))).toLocaleString('en-US')}\n` +
                        ` dont :\n` +
                        `  • Aviation : ${(Armee.unite * eval(`armeeObject.${Armee.strategie}.aviation`)).toLocaleString('en-US')} | ${Armee.aviation.toLocaleString('en-US')}\n` +
                        `  • Infanterie : ${(Armee.unite * eval(`armeeObject.${Armee.strategie}.infanterie`)).toLocaleString('en-US')} | ${Armee.infanterie.toLocaleString('en-US')}\n` +
                        `  • Mécanisé : ${(Armee.unite * eval(`armeeObject.${Armee.strategie}.mecanise`)).toLocaleString('en-US')} | ${Armee.mecanise.toLocaleString('en-US')}\n` +
                        `  • Support : ${(Armee.unite * eval(`armeeObject.${Armee.strategie}.support`)).toLocaleString('en-US')} | ${Armee.support.toLocaleString('en-US')}\n` +
                        `‎\n` +
                        `  • Homme : ${hommeUnite.toLocaleString('en-US')} | ${homme.toLocaleString('en-US')}`) + `\u200B`
                },
                {
                    name: `> <:materieldinfanterie:1123611393535512626> Matériel militaire :`,
                    value: codeBlock(
                        `• ${Armee.avion.toLocaleString('en-US')} avions\n` +
                        `• ${Armee.equipement_support.toLocaleString('en-US')} equipements de support\n` +
                        `• ${Armee.materiel_infanterie.toLocaleString('en-US')} materiel d\'infanterie\n` +
                        `• ${Armee.vehicule.toLocaleString('en-US')} véhicules\n`) + `\u200B`
                },
            ],
            color: interaction.member.displayColor,
            timestamp: new Date(),
            footer: {
                text: Pays.devise
            },
        };
        const options = [
            {
                label: `Mobiliser des Unités`,
                emoji: `🪖`,
                description: `Transférer des unités de votre réserve vers votre armée`,
                value: 'unite',
            },
            {
                label: `Stratégie`,
                emoji: `♟️`,
                description: `Choisir une stratégie pour votre armée`,
                value: 'strategie',
            },
        ];
        const row1 = addSelectMenu('action-armee', "Sélectionner une action", options);
        interaction.reply({ embeds: [embed], components: [row1] });
    });
}

export function menuDiplomatie(interaction: any, connection: any) {
    const sql = `
        SELECT * FROM diplomatie WHERE id_joueur='${interaction.member.id}';
        SELECT * FROM pays WHERE id_joueur='${interaction.member.id}';
    `;
    connection.query(sql, async(err: any, results: any[][]) => {if (err) {throw err;}
        const Diplomatie = results[0][0];
        const Pays = results[1][0];

        //transofmrer une string en array
        const Ambassade = JSON.parse(Diplomatie.ambassade.replace(/\s/g, ''));

        const embed = {
            author: {
                name: `${Pays.rang} de ${Pays.nom}`,
                icon_url: interaction.member.displayAvatarURL()
            },
            thumbnail: {
                url: Pays.drapeau
            },
            title: `\`Menu de la diplomatie\``,
            fields: [
                {
                    name: `> 🪩 Influence :`,
                    value: codeBlock(
                        `• ${Diplomatie.influence}\n`) + `\u200B`
                },
                {
                    name: `> 🏦 Ambassades :`,
                    value: codeBlock(
                        `• ${Ambassade.length}\n`) + `\u200B`
                },
            ],
            color: interaction.member.displayColor,
            timestamp: new Date(),
            footer: {
                text: Pays.devise
            },
        };
        const components = [];
        const options = [
            {
                label: `Créer une ambassade`,
                emoji: `☎️`,
                description: `Créer une nouvelle ambassade`,
                value: 'creer-ambassade',
            },
            {
                label: `Organisation`,
                emoji: `🇺🇳`,
                description: `Créer une nouvelle organisation`,
                value: 'organisation',
            }
        ];

        if (Pays.rang !== 'Cité') {
            const row1 = addSelectMenu('action-diplomatie', "Sélectionner une action", options);
            components.push(row1);
        }

        await interaction.reply({ embeds: [embed], components: components });
    });
}
export function menuEconomie(interaction: any, connection: any) {
    let sql = `
        SELECT *
        FROM armee
        WHERE id_joueur = '${interaction.member.id}';
        SELECT *
        FROM batiments
        WHERE id_joueur = '${interaction.member.id}';
        SELECT *
        FROM pays
        WHERE id_joueur = '${interaction.member.id}';
        SELECT *
        FROM population
        WHERE id_joueur = '${interaction.member.id}'
    `;
    connection.query(sql, async(err: any, results: any[][]) => {if (err) {throw err;}
        const Armee = results[0][0];
        const Batiment = results[1][0];
        const Pays = results[2][0];
        const Population = results[3][0];

        if (!results[0][0]) {
            const reponse = codeBlock('ansi', `\u001b[0;0m\u001b[1;31mCette personne ne joue pas.`);
            await interaction.reply({ content: reponse, ephemeral: true });
        } else {
            const Argent = codeBlock('ansi', `\u001b[0;0m\u001b[1;33m> -0 | +0 | :0 | ${Pays.cash.toLocaleString('en-US')} $`);

            const availableWorkers = calculerEmploi(Armee, Batiment, Population).availableWorkers;
            const jobsOverall = calculerEmploi(Armee, Batiment, Population).jobsOverall;
            const efficiency = calculerEmploi(Armee, Batiment, Population).efficiency;

            let Emploi;
            if (efficiency >= 0.9) {
                Emploi = codeBlock('md', `> • ${availableWorkers.toLocaleString('en-US')}/${jobsOverall.toLocaleString('en-US')} emplois (${efficiency*100}% d'efficacité)`);
            } else if (efficiency >= 0.5) {
                Emploi = codeBlock('ansi', `\u001b[0;0m\u001b[1;33m> • ${availableWorkers.toLocaleString('en-US')}/${jobsOverall.toLocaleString('en-US')} emplois (${efficiency*100}% d'efficacité)`);
            } else {
                Emploi = codeBlock('ansi', `\u001b[0;0m\u001b[1;31m> • ${availableWorkers.toLocaleString('en-US')}/${jobsOverall.toLocaleString('en-US')} emplois (${efficiency*100}% d'efficacité)`);
            }

            const embed = {
                author: {
                    name: `${Pays.rang} de ${Pays.nom}`,
                    icon_url: interaction.member.displayAvatarURL()
                },
                thumbnail: {
                    url: Pays.drapeau
                },
                title: `\`Menu de l'économie\``,
                fields: [
                    {
                        name: `> <:PAZ:1108440620101546105> Argent :`,
                        value: Argent + `\u200B`
                    },
                    {
                        name: `> 👩‍🔧 Emplois :`,
                        value: Emploi + `\u200B`
                    },
                    {
                        name: `> 🏭 Nombre d'usine total :`,
                        value: codeBlock(`• ${Batiment.usine_total.toLocaleString('en-US')}`) + `\u200B`
                    },
                ],
                color: interaction.member.displayColor,
                timestamp: new Date(),
                footer: {
                    text: Pays.devise
                },
            };

            const options = [
                {
                    label: `Consommations`,
                    emoji: `📦`,
                    description: `Voir vos flux de ressources`,
                    value: 'consommations',
                },
                {
                    label: `Emploi`,
                    emoji: `👩‍🔧`,
                    description: `Voir vos postes de travail`,
                    value: 'emploi',
                },
                {
                    label: `Industrie`,
                    emoji: `🏭`,
                    description: `Voir vos industries`,
                    value: 'industrie',
                }
            ];
            const row1 = addSelectMenu('action-economie', "Sélectionner un menu", options);
            await interaction.reply({ embeds: [embed], components: [row1] });
        }
    });
}

export function menuGouvernement(interaction: any, connection: any) {
    const sql = `SELECT * FROM pays WHERE id_joueur='${interaction.member.id}'`;
    connection.query(sql, async(err: any, results: any[]) => {if (err) {throw err;}
        const Pays = results[0];

        const embed = {
            author: {
                name: `${Pays.rang} de ${Pays.nom}`,
                icon_url: interaction.member.displayAvatarURL()
            },
            thumbnail: {
                url: Pays.drapeau
            },
            title: `\`Menu du gouvernement\``,
            fields: [
                {
                    name: `> 🪧 Nom de l'Etat : `,
                    value: codeBlock(`• ${Pays.nom}`) + `\u200B`
                },
                {
                    name: `> :white_square_button: Rang : `,
                    value: codeBlock(`• ${Pays.rang}`) + `\u200B`
                },
                {
                    name: `> 🔱 Régime politique : `,
                    value: codeBlock(`• ${Pays.regime}`) + `\u200B`
                },
                {
                    name: `> 🧠 Idéologie : `,
                    value: codeBlock(`• ${Pays.ideologie}`) + `\u200B`
                },
                {
                    name: `> 📃 Devise : `,
                    value: codeBlock(`• ${Pays.devise}`) + `\u200B`
                },
                {
                    name: `> <:Pweeter:983399130154008576> Pweeter : `,
                    value: codeBlock(`• ${Pays.pweeter}`) + `\u200B`
                }
            ],
            color: interaction.member.displayColor,
            timestamp: new Date(),
            footer: {
                text: Pays.devise
            }
        };
        const options = [
            {
                label: `Annonce`,
                emoji: `📢`,
                description: `Faire une annonce`,
                value: 'annonce',
            },
            {
                label: `Devise`,
                emoji: `📃`,
                description: `Choisir une nouvelle devise`,
                value: 'devise',
            },
            {
                label: `Drapeau`,
                emoji: `🎌`,
                description: `Choisir un nouveau drapeau`,
                value: 'drapeau',
            },
            {
                label: `Pweeter`,
                emoji: `<:Pweeter:983399130154008576>`,
                description: `Changer son pseudo pweeter`,
                value: 'pweeter',
            },
        ];
        const row1 = addSelectMenu('action-gouv', "Sélectionner une action", options);
        await interaction.reply({ embeds: [embed], components: [row1] });
    });
}

export function menuIndustrie(interaction: any, connection: any) {
    const sql = `
            SELECT * FROM batiments WHERE id_joueur=${interaction.member.id};
            SELECT * FROM pays WHERE id_joueur=${interaction.member.id}
        `;
    connection.query(sql, async(err: any, results: any[][]) => {if (err) {throw err;}
        const Batiment = results[0][0];
        const Pays = results[1][0];

        const embed = {
            author: {
                name: `${Pays.rang} de ${Pays.nom}`,
                icon_url: interaction.member.displayAvatarURL()
            },
            title: `\`Menu des industries\``,
            thumbnail: {
                url: Pays.drapeau
            },
            description:
                `> <:acier:1075776411329122304> \`Acierie : ${Batiment.acierie.toLocaleString('en-US')}\`\n` + `\u200B\n` +
                `> 🪟 \`Atelier de verre : ${Batiment.atelier_verre.toLocaleString('en-US')}\`\n` + `\u200B\n` +
                `> <:sable:1075776363782479873> \`Carrière de sable : ${Batiment.carriere_sable.toLocaleString('en-US')}\`\n` + `\u200B\n` +
                `> ⚡ \`Centrale biomasse : ${Batiment.centrale_biomasse.toLocaleString('en-US')}\`\n` + `\u200B\n` +
                `> ⚡ \`Centrale au charbon : ${Batiment.centrale_charbon.toLocaleString('en-US')}\`\n` + `\u200B\n` +
                `> ⚡ \`Centrale au fioul : ${Batiment.centrale_fioul.toLocaleString('en-US')}\`\n` + `\u200B\n` +
                `> 🌽 \`Champ : ${Batiment.champ.toLocaleString('en-US')}\`\n` + `\u200B\n` +
                `> ⚡ \`Champ d'éoliennes : ${Batiment.eolienne.toLocaleString('en-US')}\`\n` + `\u200B\n` +
                `> <:beton:1075776342227943526> \`Cimenterie : ${Batiment.cimenterie.toLocaleString('en-US')}\`\n` + `\u200B\n` +
                `> 🛢️ \`Derrick : ${Batiment.derrick.toLocaleString('en-US')}\`\n` + `\u200B\n` +
                `> <:charbon:1075776385517375638> \`Mine de charbon : ${Batiment.mine_charbon.toLocaleString('en-US')}\`\n` + `\u200B\n` +
                `> 🪨 \`Mine de métaux : ${Batiment.mine_metaux.toLocaleString('en-US')}\`\n` + `\u200B\n` +
                `> 💧 \`Station de pompage : ${Batiment.station_pompage.toLocaleString('en-US')}\`\n` + `\u200B\n` +
                `> ⛽ \`Raffinerie : ${Batiment.raffinerie.toLocaleString('en-US')}\`\n` + `\u200B\n` +
                `> 🪵 \`Scierie : ${Batiment.scierie.toLocaleString('en-US')}\`\n` + `\u200B\n` +
                `> 💻 \`Usine civile : ${Batiment.usine_civile.toLocaleString('en-US')}\`\n` + `\u200B\n`,
            color: interaction.member.displayColor,
            timestamp: new Date(),
            footer: {
                text: Pays.devise
            },
        };
        const options = [
            {
                label: `Acierie`,
                emoji: `<:acier:1075776411329122304>`,
                description: `Produit de l'acier`,
                value: 'acierie',
            },
            {
                label: `Atelier de verre`,
                emoji: `🪟`,
                description: `Produit du verre`,
                value: 'atelier_verre',
            },
            {
                label: `Carrière de sable`,
                emoji: `<:sable:1075776363782479873>`,
                description: `Produit du sable`,
                value: 'carriere_sable',
            },
            {
                label: `Centrale biomasse`,
                emoji: `⚡`,
                description: `Produit de l'électricité`,
                value: 'centrale_biomasse',
            },
            {
                label: `Centrale au charbon`,
                emoji: `⚡`,
                description: `Produit de l'électricité`,
                value: 'centrale_charbon',
            },
            {
                label: `Centrale au fioul`,
                emoji: `⚡`,
                description: `Produit de l'électricité`,
                value: 'centrale_fioul',
            },
            {
                label: `Champ`,
                emoji: `🌽`,
                description: `Produit de la nourriture`,
                value: 'champ',
            },
            {
                label: `Champ d'éoliennes`,
                emoji: `⚡`,
                description: `Produit de l'électricité`,
                value: 'eolienne',
            },
            {
                label: `Cimenterie`,
                emoji: `<:beton:1075776342227943526>`,
                description: `Produit du béton`,
                value: 'cimenterie',
            },
            {
                label: `Derrick`,
                emoji: `🛢️`,
                description: `Produit du pétrole`,
                value: 'derrick',
            },
            {
                label: `Mine de charbon`,
                emoji: `<:charbon:1075776385517375638>`,
                description: `Produit du charbon`,
                value: 'mine_charbon',
            },
            {
                label: `Mine de métaux`,
                emoji: `🪨`,
                description: `Produit des métaux`,
                value: 'mine_metaux',
            },
            {
                label: `Station de pompage`,
                emoji: `💧`,
                description: `Produit de l\'eau`,
                value: 'station_pompage',
            },
            {
                label: `Raffinerie`,
                emoji: `⛽`,
                description: `Produit du carburant`,
                value: 'raffinerie',
            },
            {
                label: `Scierie`,
                emoji: `🪵`,
                description: `Produit du bois`,
                value: 'scierie',
            },
            {
                label: `Usine civile`,
                emoji: `💻`,
                description: `Produit des biens de consommation`,
                value: 'usine_civile',
            },
        ];
        const row1 = addSelectMenu('usine', "Sélectionner une usine", options);
        await interaction.reply({ embeds: [embed], components: [row1] });
    });
}

export function menuPopulation(interaction: any, connection: any) {
    const sql = `
        SELECT * FROM armee WHERE id_joueur='${interaction.member.id}';
        SELECT * FROM batiments WHERE id_joueur='${interaction.member.id}';
        SELECT * FROM pays WHERE id_joueur='${interaction.member.id}';
        SELECT * FROM population WHERE id_joueur='${interaction.member.id}';
        SELECT * FROM ressources WHERE id_joueur='${interaction.member.id}';
        SELECT * FROM territoire WHERE id_joueur='${interaction.member.id}'
    `;
    connection.query(sql, async(err: any, results: any[][]) => {if (err) {throw err;}
        const Armee = results[0][0];
        const Batiment = results[1][0];
        const Pays = results[2][0];
        const Population = results[3][0];
        const Ressources = results[4][0];
        const Territoire = results[5][0];

        let Logement;
        const logement = Batiment.quartier * 1500
        if (logement / Population.habitant > 1.1) {
            Logement = codeBlock('md', `> • ${Population.habitant.toLocaleString('en-US')}/${logement.toLocaleString('en-US')} logements\n`);
        } else if (logement / Population.habitant >= 1) {
            Logement = codeBlock('ansi', `\u001b[0;0m\u001b[1;33m> • ${Population.habitant.toLocaleString('en-US')}/${logement.toLocaleString('en-US')} logements\n`);
        } else {
            const quartier = Math.ceil((Population.habitant - logement)/1500);
            Logement = codeBlock('ansi', `\u001b[0;0m\u001b[1;31m> • ${Population.habitant.toLocaleString('en-US')}/${logement.toLocaleString('en-US')} logements | ${quartier} quartiers manquants\n`);
        }

        //region Calcul du nombre d'employé
        const emploies_acierie = batimentObject.acierie.EMPLOYES_ACIERIE * Batiment.acierie;
        const emploies_atelier_verre = batimentObject.atelier_verre.EMPLOYES_ATELIER_VERRE * Batiment.atelier_verre;
        const emploies_carriere_sable = batimentObject.carriere_sable.EMPLOYES_CARRIERE_SABLE * Batiment.carriere_sable;
        const emploies_centrale_biomasse = batimentObject.centrale_biomasse.EMPLOYES_CENTRALE_BIOMASSE * Batiment.centrale_biomasse;
        const emploies_centrale_charbon = batimentObject.centrale_charbon.EMPLOYES_CENTRALE_CHARBON * Batiment.centrale_charbon;
        const emploies_centrale_fioul = batimentObject.centrale_fioul.EMPLOYES_CENTRALE_FIOUL * Batiment.centrale_fioul;
        const emploies_champ = batimentObject.champ.EMPLOYES_CHAMP * Batiment.champ;
        const emploies_cimenterie = batimentObject.cimenterie.EMPLOYES_CIMENTERIE * Batiment.cimenterie;
        const emploies_derrick = batimentObject.derrick.EMPLOYES_DERRICK * Batiment.derrick;
        const emploies_eolienne = batimentObject.eolienne.EMPLOYES_EOLIENNE * Batiment.eolienne;
        const emploies_mine_charbon = batimentObject.mine_charbon.EMPLOYES_MINE_CHARBON * Batiment.mine_charbon;
        const emploies_mine_metaux = batimentObject.mine_metaux.EMPLOYES_MINE_METAUX * Batiment.mine_metaux;
        const emploies_station_pompage = batimentObject.station_pompage.EMPLOYES_STATION_POMPAGE * Batiment.station_pompage;
        const emploies_raffinerie = batimentObject.raffinerie.EMPLOYES_RAFFINERIE * Batiment.raffinerie;
        const emploies_scierie = batimentObject.scierie.EMPLOYES_SCIERIE * Batiment.scierie;
        const emploies_usine_civile = batimentObject.usine_civile.EMPLOYES_USINE_CIVILE * Batiment.usine_civile;
        const emploies_total =
            emploies_acierie + emploies_atelier_verre + emploies_carriere_sable +
            emploies_centrale_biomasse + emploies_centrale_charbon + emploies_centrale_fioul +
            emploies_champ + emploies_cimenterie + emploies_derrick + emploies_eolienne +
            emploies_mine_charbon + emploies_mine_metaux + emploies_station_pompage +
            emploies_raffinerie + emploies_scierie + emploies_usine_civile;
        let chomage;
        const hommeArmee =
            Armee.unite * eval(`armeeObject.${Armee.strategie}.aviation`) * eval(`armeeObject.aviation.homme`) +
            Armee.unite * eval(`armeeObject.${Armee.strategie}.infanterie`) * eval(`armeeObject.infanterie.homme`) +
            Armee.unite * eval(`armeeObject.${Armee.strategie}.mecanise`) * eval(`armeeObject.mecanise.homme`) +
            Armee.unite * eval(`armeeObject.${Armee.strategie}.support`) * eval(`armeeObject.support.homme`) +
            (Armee.aviation * armeeObject.aviation.homme) +
            (Armee.infanterie * armeeObject.infanterie.homme) +
            (Armee.mecanise * armeeObject.mecanise.homme) +
            (Armee.support * armeeObject.support.homme);
        if (emploies_total/(Population.jeune + Population.adulte - hommeArmee) > 1) {
            chomage = 0
        } else {
            chomage = (((Population.jeune + Population.adulte - hommeArmee)-emploies_total)/(Population.jeune + Population.adulte - hommeArmee)*100).toFixed(2)
        }
        const Chomage = `• ${emploies_total.toLocaleString('en-US')} emplois (${chomage}% chômage)\n`;
        let emplois = (Population.jeune + Population.adulte - hommeArmee)/emploies_total
        if ((Population.jeune + Population.adulte - hommeArmee)/emploies_total > 1) {
            emplois = 1
        }
        //endregion
        let Prod;
        let Conso;
        let Diff;
        const coef_eau = eval(`regionObject.${Territoire.region}.eau`)
        const coef_nourriture = eval(`regionObject.${Territoire.region}.nourriture`)

        let Bc;
        Prod = Math.round(batimentObject.usine_civile.PROD_USINE_CIVILE * Batiment.usine_civile * eval(`gouvernementObject.${Pays.ideologie}.production`) * emplois * 48)
        Conso =  Math.round((1 + Population.bc_acces * 0.04 + Population.bonheur * 0.016 + (Population.habitant / 10000000) * 0.04) * Population.habitant * eval(`gouvernementObject.${Pays.ideologie}.conso_bc`))
        Diff = Prod - Conso;
        if (Prod / Conso > 1.1) {
            Bc = codeBlock('md', `> ${Conso.toLocaleString('en-US')}/${Prod.toLocaleString('en-US')} 💻 | 📦 ${Ressources.bc.toLocaleString('en-US')} | 🟩 ∞`);
        } else if (Prod / Conso >= 1) {
            Bc = codeBlock('ansi', `\u001b[0;0m\u001b[1;33m> ${Conso.toLocaleString('en-US')}/${Prod.toLocaleString('en-US')} 💻 | 📦 ${Ressources.bc.toLocaleString('en-US')} | 🟨 ∞`);
        } else {
            Bc = codeBlock('ansi', `\u001b[0;0m\u001b[1;31m> ${Conso.toLocaleString('en-US')}/${Prod.toLocaleString('en-US')} 💻 | 📦 ${Ressources.bc.toLocaleString('en-US')} | 🟥⌛ ${Math.floor(- Ressources.bc / Diff)}`);
        }

        let Eau;
        Prod = Math.round(batimentObject.station_pompage.PROD_STATION_POMPAGE * Batiment.station_pompage * eval(`gouvernementObject.${Pays.ideologie}.production`) * coef_eau * emplois * 48);
        Conso = Math.round((Population.habitant * populationObject.EAU_CONSO));
        Diff = Prod - Conso;
        if (Prod / Conso > 1.1) {
            Eau = codeBlock('md', `> ${Conso.toLocaleString('en-US')}/${Prod.toLocaleString('en-US')} 💧 | 📦 ${Ressources.eau.toLocaleString('en-US')} | 🟩 ∞`);
        } else if (Prod / Conso >= 1) {
            Eau = codeBlock('ansi', `\u001b[0;0m\u001b[1;33m> ${Conso.toLocaleString('en-US')}/${Prod.toLocaleString('en-US')} 💧 | 📦 ${Ressources.eau.toLocaleString('en-US')} | 🟨 ∞`);
        } else {
            Eau = codeBlock('ansi', `\u001b[0;0m\u001b[1;31m> ${Conso.toLocaleString('en-US')}/${Prod.toLocaleString('en-US')} 💧 | 📦 ${Ressources.eau.toLocaleString('en-US')} | 🟥⌛ ${Math.floor(- Ressources.eau / Diff)}`);
        }

        let Nourriture;
        Prod = Math.round(batimentObject.champ.PROD_CHAMP * Batiment.champ * eval(`gouvernementObject.${Pays.ideologie}.production`) * coef_nourriture * emplois * 48);
        Conso = Math.round((Population.habitant * populationObject.NOURRITURE_CONSO));
        Diff = Prod - Conso;
        if (Prod / Conso > 1.1) {
            Nourriture = codeBlock('md', `> ${Conso.toLocaleString('en-US')}/${Prod.toLocaleString('en-US')} 🌽 | 📦 ${Ressources.nourriture.toLocaleString('en-US')} | 🟩 ∞`);
        } else if (Prod / Conso >= 1) {
            Nourriture = codeBlock('ansi', `\u001b[0;0m\u001b[1;33m> ${Conso.toLocaleString('en-US')}/${Prod.toLocaleString('en-US')} 🌽 | 📦 ${Ressources.nourriture.toLocaleString('en-US')} | 🟨 ∞`);
        } else {
            Nourriture = codeBlock('ansi', `\u001b[0;0m\u001b[1;31m> ${Conso.toLocaleString('en-US')}/${Prod.toLocaleString('en-US')} 🌽 | 📦 ${Ressources.nourriture.toLocaleString('en-US')} | 🟥⌛ ${Math.floor(- Ressources.nourriture / Diff)}`);
        }

        const embed = {
            author: {
                name: `${Pays.rang} de ${Pays.nom}`,
                icon_url: interaction.member.displayAvatarURL()
            },
            thumbnail: {
                url: Pays.drapeau
            },
            title: `\`Vue globale de la population\``,
            fields: [
                {
                    name: `> 👪 Population`,
                    value: codeBlock(
                            `• ${Population.habitant.toLocaleString('en-US')} habitants\n` +
                            Chomage +
                            `• ${Population.bonheur}% bonheur\n`) +
                        Logement + `\u200B`
                },
                {
                    name: `> 🛒 Consommation/Approvisionnement toutes les 8h`,
                    value:
                        Bc +
                        Eau +
                        Nourriture +
                        `\u200B`
                },
                {
                    name: `> 🧎 Répartion`,
                    value: codeBlock(
                        `• ${Population.enfant.toLocaleString('en-US')} enfants\n` +
                        `• ${Population.jeune.toLocaleString('en-US')} jeunes\n` +
                        `• ${Population.adulte.toLocaleString('en-US')} adultes\n` +
                        `• ${Population.vieux.toLocaleString('en-US')} personnes âgées\n`) + `\u200B`
                },
                {
                    name: `> 🏘️ Batiments`,
                    value: codeBlock(
                        `• ${Batiment.quartier.toLocaleString('en-US')} quartiers`) + `\u200B`
                }
            ],
            color: interaction.member.displayColor,
            timestamp: new Date(),
            footer: {
                text: Pays.devise
            },
        };

        await interaction.reply({embeds: [embed]});
    });
}

export function menuTerritoire(interaction: any, connection: any) {
    const sql = `
        SELECT * FROM diplomatie WHERE id_joueur='${interaction.member.id}';
        SELECT * FROM pays WHERE id_joueur='${interaction.member.id}';
        SELECT * FROM territoire WHERE id_joueur='${interaction.member.id}'
    `;
    connection.query(sql, async(err: any, results: any[][]) => {if (err) {throw err;}
        const Diplomatie = results[0][0];
        const Pays = results[1][0];
        const Territoire = results[2][0];

        const embed = {
            author: {
                name: `${Pays.rang} de ${Pays.nom}`,
                icon_url: interaction.member.displayAvatarURL()
            },
            thumbnail: {
                url: Pays.drapeau
            },
            title: `\`Expansion territoriale\``,
            fields: [
                {
                    name: `> 🌄 Territoire :`,
                    value: codeBlock(
                        `• ${eval(`biomeObject.${Territoire.region}.nom`)}\n` +
                        `• ${Territoire.T_total.toLocaleString('en-US')} km² total\n` +
                        `• ${Territoire.T_national.toLocaleString('en-US')} km² national\n` +
                        `• ${Territoire.T_controle.toLocaleString('en-US')} km² contrôlé`) + `\u200B`
                },
                {
                    name: `> 🏗️ Construction :`,
                    value: codeBlock(
                        `• ${Territoire.T_libre.toLocaleString('en-US')} km² libres\n` +
                        `• ${Territoire.T_occ.toLocaleString('en-US')} km² construits`) + `\u200B`
                },
                {
                    name: `> ☎ Diplomatie :`,
                    value: codeBlock(
                        `• ${Diplomatie.influence} influences\n` +
                        `• ${(Territoire.cg * 1000).toLocaleString('en-US')}km² de capacité de gouvernance\n`) + `\u200B`
                },
            ],
            color: interaction.member.displayColor,
            timestamp: new Date(),
            footer: {
                text: Pays.devise
            },
        };

        const options = [
            {
                label: `Biome`,
                emoji: `🏞️`,
                description: `Menu des biomes`,
                value: 'biome',
            }
        ]
        const row1 = addSelectMenu('action-territoire', `Afficher un autre menu`, options)
        const row2 = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setLabel(`Envoyer un explorateur`)
                    .setEmoji(`🧭`)
                    .setCustomId('explorateur-' + interaction.member.id)
                    .setStyle(ButtonStyle.Success)
            );

        await interaction.reply({ embeds: [embed], components: [row1, row2] });
    });
}

export function menuConsommation(mode: 'menu' | 'edit', interaction: any, connection: any) {
    const sql = `
        SELECT * FROM armee WHERE id_joueur='${interaction.member.id}';
        SELECT * FROM batiments WHERE id_joueur='${interaction.member.id}';
        SELECT * FROM pays WHERE id_joueur='${interaction.member.id}';
        SELECT * FROM population WHERE id_joueur='${interaction.member.id}';
        SELECT * FROM ressources WHERE id_joueur='${interaction.member.id}';
        SELECT * FROM territoire WHERE id_joueur='${interaction.member.id}';
    `;
    connection.query(sql, async(err: any, results: any[][]) => {if (err) {throw err;}
        const Armee = results[0][0];
        const Batiment = results[1][0];
        const Pays = results[2][0];
        const Population = results[3][0];
        const Ressources = results[4][0];
        const Territoire = results[5][0];

        const coef_eolienne = eval(`regionObject.${Territoire.region}.eolienne`)

        //region Production d'électricité
        //region Production d'électricté des centrales biomasse
        const conso_T_centrale_biomasse_bois = batimentObject.centrale_biomasse.CONSO_CENTRALE_BIOMASSE_BOIS * Batiment.centrale_biomasse
        let prod_centrale_biomasse = true;
        if (conso_T_centrale_biomasse_bois > Ressources.bois && conso_T_centrale_biomasse_bois !== 0) {
            prod_centrale_biomasse = false;
        }
        const conso_T_centrale_biomasse_eau = batimentObject.centrale_biomasse.CONSO_CENTRALE_BIOMASSE_EAU * Batiment.centrale_biomasse
        if (conso_T_centrale_biomasse_eau > Ressources.eau && conso_T_centrale_biomasse_eau !== 0) {
            prod_centrale_biomasse = false;
        }
        //endregion
        //region Production d'électricté des centrales au charbon
        const conso_T_centrale_charbon_charbon = batimentObject.centrale_charbon.CONSO_CENTRALE_CHARBON_CHARBON * Batiment.centrale_charbon
        let prod_centrale_charbon = true;
        if (conso_T_centrale_charbon_charbon > Ressources.charbon && conso_T_centrale_charbon_charbon !== 0) {
            prod_centrale_charbon = false;
        }
        const conso_T_centrale_charbon_eau = batimentObject.centrale_charbon.CONSO_CENTRALE_CHARBON_EAU * Batiment.centrale_charbon
        if (conso_T_centrale_charbon_eau > Ressources.eau && conso_T_centrale_charbon_eau !== 0) {
            prod_centrale_charbon = false;
        }
        //endregion
        //region Production d'électricité des centrales au fioul
        const conso_T_centrale_fioul_carburant = batimentObject.centrale_fioul.CONSO_CENTRALE_FIOUL_CARBURANT * Batiment.centrale_fioul
        let prod_centrale_fioul = true;
        if (conso_T_centrale_fioul_carburant > Ressources.carburant && conso_T_centrale_fioul_carburant !== 0) {
            prod_centrale_fioul = false;
        }
        const conso_T_centrale_fioul_eau = batimentObject.centrale_fioul.CONSO_CENTRALE_FIOUL_EAU * Batiment.centrale_fioul
        if (conso_T_centrale_fioul_eau > Ressources.eau && conso_T_centrale_fioul_eau !== 0) {
            prod_centrale_fioul = false;
        }
        //endregion
        //region Production d'électricité des éoliennes
        let prod_elec = Math.round(batimentObject.eolienne.PROD_EOLIENNE * Batiment.eolienne * coef_eolienne);
        if (prod_centrale_biomasse === true) {
            prod_elec += batimentObject.centrale_biomasse.PROD_CENTRALE_BIOMASSE * Batiment.centrale_biomasse
        }
        if (prod_centrale_charbon === true) {
            prod_elec += batimentObject.centrale_charbon.PROD_CENTRALE_CHARBON * Batiment.centrale_charbon
        }
        if (prod_centrale_fioul === true) {
            prod_elec += batimentObject.centrale_fioul.PROD_CENTRALE_FIOUL * Batiment.centrale_fioul
        }
        //endregion
        //region Consommation totale d'électricté
        const conso_elec = Math.round(
            batimentObject.acierie.CONSO_ACIERIE_ELEC * Batiment.acierie +
            batimentObject.atelier_verre.CONSO_ATELIER_VERRE_ELEC * Batiment.atelier_verre +
            batimentObject.carriere_sable.CONSO_CARRIERE_SABLE_ELEC * Batiment.carriere_sable +
            batimentObject.champ.CONSO_CHAMP_ELEC * Batiment.champ +
            batimentObject.cimenterie.CONSO_CIMENTERIE_ELEC * Batiment.cimenterie +
            batimentObject.derrick.CONSO_DERRICK_ELEC * Batiment.derrick +
            batimentObject.mine_charbon.CONSO_MINE_CHARBON_ELEC * Batiment.mine_charbon +
            batimentObject.mine_metaux.CONSO_MINE_METAUX_ELEC * Batiment.mine_metaux +
            batimentObject.station_pompage.CONSO_STATION_POMPAGE_ELEC * Batiment.station_pompage +
            batimentObject.quartier.CONSO_QUARTIER_ELEC * Batiment.quartier +
            batimentObject.raffinerie.CONSO_RAFFINERIE_ELEC * Batiment.raffinerie +
            batimentObject.scierie.CONSO_SCIERIE_ELEC * Batiment.scierie +
            batimentObject.usine_civile.CONSO_USINE_CIVILE_ELEC * Batiment.usine_civile
        );
        //endregion
        //endregion

        //region Calcul des coefficients de production des ressources
        const efficacite = calculerEmploi(Armee, Batiment, Population).efficiency;

        const coef_bois = eval(`regionObject.${Territoire.region}.bois`)
        const coef_charbon = eval(`regionObject.${Territoire.region}.charbon`)
        const coef_eau = eval(`regionObject.${Territoire.region}.eau`)
        const coef_metaux = eval(`regionObject.${Territoire.region}.metaux`)
        const coef_nourriture = eval(`regionObject.${Territoire.region}.nourriture`)
        const coef_petrole = eval(`regionObject.${Territoire.region}.petrole`)
        const coef_sable = eval(`regionObject.${Territoire.region}.sable`)
        //endregion
        function convertMillisecondsToTime(milliseconds: number) {
            const seconds = Math.floor(milliseconds / 1000);
            const hours = Math.floor(seconds / 3600);
            return `${hours}h`;
        }

        let Prod;
        let Conso;
        let Diff;
        let boisName;
        const conso_T_scierie_carburant = Math.round(batimentObject.scierie.CONSO_SCIERIE_CARBURANT * Batiment.scierie * eval(`gouvernementObject.${Pays.ideologie}.consommation`) * efficacite);
        if (conso_T_scierie_carburant > Ressources.carburant) {
            boisName = `> ⚠️ Bois : ⛏️ x${coef_bois} ⚠️`;
        } else if (prod_elec < conso_elec) {
            boisName = `> 🪫 Bois : ⛏️ x${coef_bois} 🪫`;
        } else if (efficacite < 0.5) {
            boisName = `> 🚷 Bois : ⛏️ x${coef_bois} 🚷`;
        } else {
            boisName = `> 🪵 Bois : ⛏️ x${coef_bois}`;
        }
        let Bois;
        Prod = Math.round(batimentObject.scierie.PROD_SCIERIE * Batiment.scierie * eval(`gouvernementObject.${Pays.ideologie}.production`) * coef_bois * efficacite);
        const conso_T_usine_civile_bois = Math.round(batimentObject.usine_civile.CONSO_USINE_CIVILE_BOIS * Batiment.usine_civile * eval(`gouvernementObject.${Pays.ideologie}.consommation`) * efficacite);
        Conso = conso_T_usine_civile_bois + conso_T_centrale_biomasse_bois;
        Diff = Prod - Conso;
        if (Diff / Prod > 0.1) {
            Bois = codeBlock('md', `> -${Conso.toLocaleString('en-US')} | +${Prod.toLocaleString('en-US')} | :${Diff.toLocaleString('en-US')}" | 📦 ${Ressources.bois.toLocaleString('en-US')} | 🟩 ∞`);
        } else if (Diff / Prod >= 0) {
            Bois = codeBlock('ansi', `\u001b[0;0m\u001b[1;33m> -${Conso.toLocaleString('en-US')} | +${Prod.toLocaleString('en-US')} | :${Diff.toLocaleString('en-US')} | 📦 ${Ressources.bois.toLocaleString('en-US')} | 🟨 ∞`);
        } else {
            Bois = codeBlock('ansi', `\u001b[0;0m\u001b[1;31m> -${Conso.toLocaleString('en-US')} | +${Prod.toLocaleString('en-US')} | :${Diff.toLocaleString('en-US')} | 📦 ${Ressources.bois.toLocaleString('en-US')} | 🟥⌛ ${convertMillisecondsToTime(Math.floor(- Ressources.bois / Diff) * 10 * 60 * 1000)}`);
        }

        let charbonName;
        const conso_T_mine_charbon_carburant = Math.round(batimentObject.mine_charbon.CONSO_MINE_CHARBON_CARBURANT * Batiment.mine_charbon * eval(`gouvernementObject.${Pays.ideologie}.consommation`) * efficacite);
        if (conso_T_mine_charbon_carburant > Ressources.carburant) {
            charbonName = `> ⚠️ Charbon : ⛏️ x${coef_charbon} ⚠️`;
        } else if (prod_elec < conso_elec) {
            charbonName = `> 🪫 Charbon : ⛏️ x${coef_charbon} 🪫`;
        } else if (efficacite < 0.5) {
            charbonName = `> 🚷 Charbon : ⛏️ x${coef_charbon} 🚷`;
        } else {
            charbonName = `> <:charbon:1075776385517375638> Charbon : ⛏️ x${coef_charbon}`;
        }
        let Charbon;
        Prod = Math.round(batimentObject.mine_charbon.PROD_MINE_CHARBON * Batiment.mine_charbon * eval(`gouvernementObject.${Pays.ideologie}.production`) * coef_charbon * efficacite);
        const conso_T_acierie_charbon = Math.round(batimentObject.acierie.CONSO_ACIERIE_CHARBON * Batiment.acierie * eval(`gouvernementObject.${Pays.ideologie}.consommation`) * efficacite);
        Conso = conso_T_acierie_charbon + conso_T_centrale_charbon_charbon;
        Diff = Prod - Conso;
        if (Diff / Prod > 0.1) {
            Charbon = codeBlock('md', `> -${Conso.toLocaleString('en-US')} | +${Prod.toLocaleString('en-US')} | :${Diff.toLocaleString('en-US')}" | 📦 ${Ressources.charbon.toLocaleString('en-US')} | 🟩 ∞`);
        } else if (Diff / Prod >= 0) {
            Charbon = codeBlock('ansi', `\u001b[0;0m\u001b[1;33m> -${Conso.toLocaleString('en-US')} | +${Prod.toLocaleString('en-US')} | :${Diff.toLocaleString('en-US')} | 📦 ${Ressources.charbon.toLocaleString('en-US')} | 🟨 ∞`);
        } else {
            Charbon = codeBlock('ansi', `\u001b[0;0m\u001b[1;31m> -${Conso.toLocaleString('en-US')} | +${Prod.toLocaleString('en-US')} | :${Diff.toLocaleString('en-US')} | 📦 ${Ressources.charbon.toLocaleString('en-US')} | 🟥⌛ ${convertMillisecondsToTime(Math.floor(- Ressources.charbon / Diff) * 10 * 60 * 1000)}`);
        }

        let eauName;
        const conso_T_station_pompage_carburant = Math.round(batimentObject.station_pompage.CONSO_STATION_POMPAGE_CARBURANT * Batiment.station_pompage * eval(`gouvernementObject.${Pays.ideologie}.consommation`) * efficacite);
        if (conso_T_station_pompage_carburant > Ressources.carburant) {
            eauName = `> ⚠️ Eau : ⛏️ x${coef_eau} ⚠️`;
        } else if (prod_elec < conso_elec) {
            eauName = `> 🪫 Eau : ⛏️ x${coef_eau} 🪫`;
        } else if (efficacite < 0.5) {
            eauName = `> 🚷 Eau : ⛏️ x${coef_eau} 🚷`;
        } else {
            eauName = `> 💧 Eau : ⛏️ x${coef_eau}`;
        }
        let Eau;
        Prod = Math.round(batimentObject.station_pompage.PROD_STATION_POMPAGE * Batiment.station_pompage * eval(`gouvernementObject.${Pays.ideologie}.production`) * coef_eau * efficacite);
        const conso_T_atelier_verre_eau = Math.round(batimentObject.atelier_verre.CONSO_ATELIER_VERRE_EAU * Batiment.atelier_verre * eval(`gouvernementObject.${Pays.ideologie}.consommation`) * efficacite);
        const conso_T_champ_eau = Math.round(batimentObject.champ.CONSO_CHAMP_EAU * Batiment.champ * eval(`gouvernementObject.${Pays.ideologie}.consommation`) * efficacite);
        const conso_T_cimenterie_eau = Math.round(batimentObject.cimenterie.CONSO_CIMENTERIE_EAU * Batiment.cimenterie * eval(`gouvernementObject.${Pays.ideologie}.consommation`) * efficacite);
        const conso_pop = Math.round((Population.habitant * populationObject.EAU_CONSO) / 48);
        Conso = conso_T_atelier_verre_eau + conso_T_champ_eau + conso_T_cimenterie_eau + conso_T_centrale_biomasse_eau + conso_T_centrale_charbon_eau + conso_T_centrale_fioul_eau + conso_pop;
        Diff = Prod - Conso;
        if (Diff / Prod > 0.1) {
            Eau = codeBlock('md', `> -${Conso.toLocaleString('en-US')} | +${Prod.toLocaleString('en-US')} | :${Diff.toLocaleString('en-US')}" | 📦 ${Ressources.eau.toLocaleString('en-US')} | 🟩 ∞`);
        } else if (Diff / Prod >= 0) {
            Eau = codeBlock('ansi', `\u001b[0;0m\u001b[1;33m> -${Conso.toLocaleString('en-US')} | +${Prod.toLocaleString('en-US')} | :${Diff.toLocaleString('en-US')} | 📦 ${Ressources.eau.toLocaleString('en-US')} | 🟨 ∞`);
        } else {
            Eau = codeBlock('ansi', `\u001b[0;0m\u001b[1;31m> -${Conso.toLocaleString('en-US')} | +${Prod.toLocaleString('en-US')} | :${Diff.toLocaleString('en-US')} | 📦 ${Ressources.eau.toLocaleString('en-US')} | 🟥⌛ ${convertMillisecondsToTime(Math.floor(- Ressources.eau / Diff) * 10 * 60 * 1000)}`);
        }

        let metauxName;
        const conso_T_mine_metaux_carburant = Math.round(batimentObject.mine_metaux.CONSO_MINE_METAUX_CARBURANT * Batiment.mine_metaux * eval(`gouvernementObject.${Pays.ideologie}.consommation`) * efficacite);
        if (conso_T_mine_metaux_carburant > Ressources.carburant) {
            metauxName = `> ⚠️ Metaux : ⛏️ x${coef_metaux} ⚠️`;
        } else if (prod_elec < conso_elec) {
            metauxName = `> 🪫 Metaux : ⛏️ x${coef_metaux} 🪫`;
        } else if (efficacite < 0.5) {
            metauxName = `> 🚷 Metaux : ⛏️ x${coef_metaux} 🚷`;
        } else {
            metauxName = `> 🪨 Metaux : ⛏️ x${coef_metaux}`;
        }
        let Metaux;
        Prod = Math.round(batimentObject.mine_metaux.PROD_MINE_METAUX * Batiment.mine_metaux * eval(`gouvernementObject.${Pays.ideologie}.production`) * coef_metaux * efficacite);
        const conso_T_acierie_metaux = Math.round(batimentObject.acierie.CONSO_ACIERIE_METAUX * Batiment.acierie * eval(`gouvernementObject.${Pays.ideologie}.consommation`) * efficacite);
        const conso_T_derrick_metaux = Math.round(batimentObject.derrick.CONSO_DERRICK_METAUX * Batiment.derrick * eval(`gouvernementObject.${Pays.ideologie}.consommation`) * efficacite);
        const conso_T_usine_civile_metaux = Math.round(batimentObject.usine_civile.CONSO_USINE_CIVILE_METAUX * Batiment.usine_civile * eval(`gouvernementObject.${Pays.ideologie}.consommation`) * efficacite);
        Conso = conso_T_acierie_metaux + conso_T_derrick_metaux + conso_T_usine_civile_metaux;
        Diff = Prod - Conso;
        if (Diff / Prod > 0.1) {
            Metaux = codeBlock('md', `> -${Conso.toLocaleString('en-US')} | +${Prod.toLocaleString('en-US')} | :${Diff.toLocaleString('en-US')}" | 📦 ${Ressources.metaux.toLocaleString('en-US')} | 🟩 ∞`);
        } else if (Diff / Prod >= 0) {
            Metaux = codeBlock('ansi', `\u001b[0;0m\u001b[1;33m> -${Conso.toLocaleString('en-US')} | +${Prod.toLocaleString('en-US')} | :${Diff.toLocaleString('en-US')} | 📦 ${Ressources.metaux.toLocaleString('en-US')} | 🟨 ∞`);
        } else {
            Metaux = codeBlock('ansi', `\u001b[0;0m\u001b[1;31m> -${Conso.toLocaleString('en-US')} | +${Prod.toLocaleString('en-US')} | :${Diff.toLocaleString('en-US')} | 📦 ${Ressources.metaux.toLocaleString('en-US')} | 🟥⌛ ${convertMillisecondsToTime(Math.floor(- Ressources.metaux / Diff) * 10 * 60 * 1000)}`);
        }

        let nourritureName;
        const conso_T_champ_carburant = Math.round(batimentObject.champ.CONSO_CHAMP_CARBURANT * Batiment.champ * eval(`gouvernementObject.${Pays.ideologie}.consommation`) * efficacite);
        if (conso_T_champ_carburant > Ressources.carburant) {
            nourritureName = `> ⚠️ Nourriture : ⛏️ x${coef_nourriture} ⚠️`;
        } else if (conso_T_champ_eau > Ressources.eau) {
            nourritureName = `> ⚠️ Nourriture : ⛏️ x${coef_nourriture} ⚠️`;
        } else if (prod_elec < conso_elec) {
            nourritureName = `> 🪫 Nourriture : ⛏️ x${coef_nourriture} 🪫`;
        } else if (efficacite < 0.5) {
            nourritureName = `> 🚷 Nourriture : ⛏️ x${coef_nourriture} 🚷`;
        } else {
            nourritureName = `> 🌽 Nourriture : ⛏️ x${coef_nourriture}`;
        }
        let Nourriture;
        Prod = Math.round(batimentObject.champ.PROD_CHAMP * Batiment.champ * eval(`gouvernementObject.${Pays.ideologie}.production`) * coef_nourriture * efficacite);
        Conso = Math.round((Population.habitant * populationObject.NOURRITURE_CONSO) / 48);
        Diff = Prod - Conso;
        if (Diff / Prod > 0.1) {
            Nourriture = codeBlock('md', `> -${Conso.toLocaleString('en-US')} | +${Prod.toLocaleString('en-US')} | :${Diff.toLocaleString('en-US')}" | 📦 ${Ressources.nourriture.toLocaleString('en-US')} | 🟩 ∞`);
        } else if (Diff / Prod >= 0) {
            Nourriture = codeBlock('ansi', `\u001b[0;0m\u001b[1;33m> -${Conso.toLocaleString('en-US')} | +${Prod.toLocaleString('en-US')} | :${Diff.toLocaleString('en-US')} | 📦 ${Ressources.nourriture.toLocaleString('en-US')} | 🟨 ∞`);
        } else {
            Nourriture = codeBlock('ansi', `\u001b[0;0m\u001b[1;31m> -${Conso.toLocaleString('en-US')} | +${Prod.toLocaleString('en-US')} | :${Diff.toLocaleString('en-US')} | 📦 ${Ressources.nourriture.toLocaleString('en-US')} | 🟥⌛ ${convertMillisecondsToTime(Math.floor(- Ressources.nourriture / Diff) * 10 * 60 * 1000)}`);
        }

        let petroleName;
        if (conso_T_derrick_metaux > Ressources.metaux) {
            petroleName = `> ⚠️ Pétrole : ⛏️ x${coef_petrole} ⚠️`;
        } else if (prod_elec < conso_elec) {
            petroleName = `> 🪫 Pétrole : ⛏️ x${coef_petrole} 🪫`;
        } else if (efficacite < 0.5) {
            petroleName = `> 🚷 Pétrole : ⛏️ x${coef_petrole} 🚷`;
        } else {
            petroleName = `> 🛢️ Pétrole : ⛏️ x${coef_petrole}`;
        }
        let Petrole;
        Prod = Math.round(batimentObject.derrick.PROD_DERRICK * Batiment.derrick * eval(`gouvernementObject.${Pays.ideologie}.production`) * coef_petrole * efficacite);
        const conso_T_cimenterie_petrole = Math.round(batimentObject.cimenterie.CONSO_CIMENTERIE_PETROLE * Batiment.cimenterie * eval(`gouvernementObject.${Pays.ideologie}.consommation`) * efficacite);
        const conso_T_raffinerie_petrole = Math.round(batimentObject.raffinerie.CONSO_RAFFINERIE_PETROLE * Batiment.raffinerie * eval(`gouvernementObject.${Pays.ideologie}.consommation`) * efficacite);
        const conso_T_usine_civile_petrole = Math.round(batimentObject.usine_civile.CONSO_USINE_CIVILE_PETROLE * Batiment.usine_civile * eval(`gouvernementObject.${Pays.ideologie}.consommation`) * efficacite);
        Conso = conso_T_cimenterie_petrole + conso_T_raffinerie_petrole + conso_T_usine_civile_petrole;
        Diff = Prod - Conso;
        if (Diff / Prod > 0.1) {
            Petrole = codeBlock('md', `> -${Conso.toLocaleString('en-US')} | +${Prod.toLocaleString('en-US')} | :${Diff.toLocaleString('en-US')}" | 📦 ${Ressources.petrole.toLocaleString('en-US')} | 🟩 ∞`);
        } else if (Diff / Prod >= 0) {
            Petrole = codeBlock('ansi', `\u001b[0;0m\u001b[1;33m> -${Conso.toLocaleString('en-US')} | +${Prod.toLocaleString('en-US')} | :${Diff.toLocaleString('en-US')} | 📦 ${Ressources.petrole.toLocaleString('en-US')} | 🟨 ∞`);
        } else {
            Petrole = codeBlock('ansi', `\u001b[0;0m\u001b[1;31m> -${Conso.toLocaleString('en-US')} | +${Prod.toLocaleString('en-US')} | :${Diff.toLocaleString('en-US')} | 📦 ${Ressources.petrole.toLocaleString('en-US')} | 🟥⌛ ${convertMillisecondsToTime(Math.floor(- Ressources.petrole / Diff) * 10 * 60 * 1000)}`);
        }

        let sableName;
        const conso_T_carriere_sable_carburant = Math.round(batimentObject.carriere_sable.CONSO_CARRIERE_SABLE_CARBURANT * Batiment.carriere_sable * eval(`gouvernementObject.${Pays.ideologie}.consommation`) * efficacite);
        if (conso_T_carriere_sable_carburant > Ressources.carburant) {
            sableName = `> ⚠️ Sable : ⛏️ x${coef_sable} ⚠️️`;
        } else if (prod_elec < conso_elec) {
            sableName = `> 🪫 Sable : ⛏️ x${coef_sable} 🪫`;
        } else if (efficacite < 0.5) {
            sableName = `> 🚷 Sable : ⛏️ x${coef_sable} 🚷`;
        } else {
            sableName = `> <:sable:1075776363782479873> Sable : ⛏️ x${coef_sable}`;
        }
        let Sable;
        Prod = Math.round(batimentObject.carriere_sable.PROD_CARRIERE_SABLE * Batiment.carriere_sable * eval(`gouvernementObject.${Pays.ideologie}.production`) * coef_sable * efficacite);
        const conso_T_atelier_verre_sable = Math.round(batimentObject.atelier_verre.CONSO_ATELIER_VERRE_SABLE * Batiment.atelier_verre * eval(`gouvernementObject.${Pays.ideologie}.consommation`) * efficacite);
        const conso_T_cimenterie_sable = Math.round(batimentObject.cimenterie.CONSO_CIMENTERIE_SABLE * Batiment.cimenterie * eval(`gouvernementObject.${Pays.ideologie}.consommation`) * efficacite);
        Conso = conso_T_atelier_verre_sable + conso_T_cimenterie_sable;
        Diff = Prod - Conso;
        if (Diff / Prod > 0.1) {
            Sable = codeBlock('md', `> -${Conso.toLocaleString('en-US')} | +${Prod.toLocaleString('en-US')} | :${Diff.toLocaleString('en-US')}" | 📦 ${Ressources.sable.toLocaleString('en-US')} | 🟩 ∞`);
        } else if (Diff / Prod >= 0) {
            Sable = codeBlock('ansi', `\u001b[0;0m\u001b[1;33m> -${Conso.toLocaleString('en-US')} | +${Prod.toLocaleString('en-US')} | :${Diff.toLocaleString('en-US')} | 📦 ${Ressources.sable.toLocaleString('en-US')} | 🟨 ∞`);
        } else {
            Sable = codeBlock('ansi', `\u001b[0;0m\u001b[1;31m> -${Conso.toLocaleString('en-US')} | +${Prod.toLocaleString('en-US')} | :${Diff.toLocaleString('en-US')} | 📦 ${Ressources.sable.toLocaleString('en-US')} | 🟥⌛ ${convertMillisecondsToTime(Math.floor(- Ressources.sable / Diff) * 10 * 60 * 1000)}`);
        }

        const embed = {
            author: {
                name: `${Pays.rang} de ${Pays.nom}`,
                icon_url: interaction.member.displayAvatarURL()
            },
            thumbnail: {
                url: Pays.drapeau
            },
            title: `\`Consommation en : Matières premières\``,
            fields: [
                {
                    name: boisName,
                    value: Bois,
                },
                {
                    name: charbonName,
                    value: Charbon,
                },
                {
                    name: eauName,
                    value: Eau,
                },
                {
                    name: metauxName,
                    value: Metaux,
                },
                {
                    name: nourritureName,
                    value: Nourriture,
                },
                {
                    name: petroleName,
                    value: Petrole,
                },
                {
                    name: sableName,
                    value: Sable,
                },
            ],
            color: interaction.member.displayColor,
            timestamp: new Date(),
            footer: {
                text: Pays.devise
            }
        };

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setLabel(`Matières premières`)
                    .setCustomId('matiere_premiere')
                    .setEmoji('<:charbon:1075776385517375638>')
                    .setStyle(ButtonStyle.Secondary)
                    .setDisabled(true)
            ).addComponents(
                new ButtonBuilder()
                    .setLabel(`Ressources manufacturés`)
                    .setCustomId('ressource_manufacture')
                    .setEmoji('<:acier:1075776411329122304>')
                    .setStyle(ButtonStyle.Primary)
            )
            .addComponents(
                new ButtonBuilder()
                    .setLabel(`Produits manufacturés`)
                    .setCustomId('produit_manufacture')
                    .setEmoji('💻')
                    .setStyle(ButtonStyle.Primary)
            )
            .addComponents(
                new ButtonBuilder()
                    .setLabel(`Autre`)
                    .setCustomId('autre')
                    .setEmoji('⚡')
                    .setStyle(ButtonStyle.Primary)
            )

        if (mode === 'menu') {
            await interaction.reply({ embeds: [embed], components: [row] });
        } else {
            interaction.message.edit({embeds: [embed], components: [row] })
            interaction.deferUpdate()
        }
    })
}

export function failReply(interaction: any, message: string) {
    interaction.reply({content: codeBlock('ansi', `\u001b[0;0m\u001b[1;31m${message}`), ephemeral: true});
}

export function convertMillisecondsToTime(milliseconds: number) {
    const seconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours} heures, ${minutes} minutes, ${remainingSeconds} secondes`;
}

export function addSelectMenu(customId: string, placeholder: string, options: any[]) {
    return new ActionRowBuilder()
        .addComponents(
            new StringSelectMenuBuilder()
                .setCustomId(customId)
                .setPlaceholder(placeholder)
                .addOptions(options),
        );
}

export function toId(name: string) {
    switch (name) {
        case 'Acierie':
            return 'acierie';
        case 'Atelier de verre':
            return 'atelier_verre';
        case 'Carrière de sable':
            return 'carriere_sable';
        case 'Centrale à biomasse':
            return 'centrale_biomasse';
        case 'Centrale à charbon':
            return 'centrale_charbon';
        case 'Centrale à fioul':
            return 'centrale_fioul';
        case 'Champ':
            return 'champ';
        case 'Champ d\'éoliennes':
            return 'eolienne';
        case 'Cimenterie':
            return 'cimenterie';
        case 'Derrick':
            return 'derrick';
        case 'Mine de charbon':
            return 'mine_charbon';
        case 'Mine de métaux':
            return 'mine_metaux';
        case 'Station de pompage':
            return 'station_pompage';
        case 'Quartier':
            return 'quartier';
        case 'Raffinerie':
            return 'raffinerie';
        case 'Scierie':
            return 'scierie';
        case 'Usine civile':
            return 'usine_civile';
    }
}

// @ts-ignore
export function toName(id: string): string {
    switch (id) {
        case 'acier':
            return 'Acier';
        case 'beton':
            return 'Béton';
        case 'bc':
            return 'Biens de consommation';
        case 'bois':
            return 'Bois';
        case 'carburant':
            return 'Carburant';
        case 'charbon':
            return 'Charbon';
        case 'eau':
            return 'Eau';
        case 'metaux':
            return 'Métaux';
        case 'nourriture':
            return 'Nourriture';
        case 'petrole':
            return 'Pétrole';
        case 'sable':
            return 'Sable';
        case 'verre':
            return 'Verre';
        case 'acierie':
            return 'Acierie';
        case 'atelier_verre':
            return 'Atelier de verre';
        case 'carriere_sable':
            return 'Carrière de sable';
        case 'centrale_biomasse':
            return 'Centrale à biomasse';
        case 'centrale_charbon':
            return 'Centrale à charbon';
        case 'centrale_fioul':
            return 'Centrale à fioul';
        case 'champ':
            return 'Champ';
        case 'eolienne':
            return 'Champ d\'éoliennes';
        case 'cimenterie':
            return 'Cimenterie';
        case 'derrick':
            return 'Derrick';
        case 'mine_charbon':
            return 'Mine de charbon';
        case 'mine_metaux':
            return 'Mine de métaux';
        case 'station_pompage':
            return 'Station de pompage';
        case 'quartier':
            return 'Quartier';
        case 'raffinerie':
            return 'Raffinerie';
        case 'scierie':
            return 'Scierie';
        case 'usine_civile':
            return 'Usine civile';
    }
}

// @ts-ignore
export function toEmoji(id: string): string {
    switch (id) {
        case 'acier':
            return '<:acier:1075776411329122304>';
        case 'beton':
            return '<:beton:1075776342227943526>';
        case 'bc':
            return '💻';
        case 'bois':
            return '🪵';
        case 'carburant':
            return '⛽';
        case 'charbon':
            return '<:charbon:1075776385517375638>';
        case 'eau':
            return '💧';
        case 'metaux':
            return '🪨';
        case 'nourriture':
            return '🌽';
        case 'petrole':
            return '🛢️';
        case 'sable':
            return '<:sable:1075776363782479873>';
        case 'verre':
            return '🪟';
    }
}

module.exports = {
    calculerEmploi,
    calculerSoldat,
    menuArmee,
    menuConsommation,
    menuDiplomatie,
    menuGouvernement,
    menuEconomie,
    menuIndustrie,
    menuPopulation,
    menuTerritoire,
    failReply,
    convertMillisecondsToTime,
    addSelectMenu,
    toId,
    toName,
    toEmoji,
}