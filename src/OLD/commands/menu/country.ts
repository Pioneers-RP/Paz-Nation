import { SlashCommandBuilder, codeBlock } from 'discord.js';
import {calculerSoldat, calculerEmploi, addSelectMenu} from "../../fonctions/functions";
import { Pays } from '../../entities/Pays';
import {Batiments} from "../../entities/Batiments";
import {Armee} from "../../entities/Armee";
import {Diplomatie} from "../../entities/Diplomatie";
import {Population} from "../../entities/Population";
import {Territoire} from "../../entities/Territoire";
import {AppDataSource} from "../../data-source";
import {readFileSync} from "fs";
const biomeObject = JSON.parse(readFileSync('src/OLD/data/biome.json', 'utf-8'));

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pays')
        .setDescription(`Statistiques de votre pays`),

    async execute(interaction: any) {
        let armee: any = await AppDataSource.getRepository(Armee).findOneBy({ idJoueur: interaction.member.id });
        let batiment: any = await AppDataSource.getRepository(Batiments).findOneBy({ idJoueur: interaction.member.id });
        let diplomatie: any = await AppDataSource.getRepository(Diplomatie).findOneBy({ idJoueur: interaction.member.id });
        let pays: any = await AppDataSource.getRepository(Pays).findOneBy({ idJoueur: interaction.member.id });
        let population: any = await AppDataSource.getRepository(Population).findOneBy({ idJoueur: interaction.member.id });
        let territoire: any = await AppDataSource.getRepository(Territoire).findOneBy({ idJoueur: interaction.member.id });

        const region = eval(`biomeObject.${territoire.region}.nom`);

        //region Calcul du nombre d'employés
        const emploisTotaux = calculerEmploi(armee, batiment, population).emploisTotaux;
        const soldat = calculerSoldat(armee)

        let chomage;
        if (emploisTotaux/(population.jeune + population.adulte - soldat) > 1) {
            chomage = 0
        } else {
            chomage = ((((population.jeune + population.adulte - soldat)-emploisTotaux)/(population.jeune + population.adulte - soldat))*100).toFixed(2)
        }
        //endregion
        let embed = {
            author: {
                name: `${pays.rang} de ${pays.nom}`,
                icon_url: interaction.member.displayAvatarURL()
            },
            thumbnail: {
                url: pays.drapeau
            },
            title: `\`Vue globale du pays\``,
            fields: [
                {
                    name: `> <:PAZ:1108440620101546105> Argent :`,
                    value: codeBlock(`• ${parseInt(pays.cash).toLocaleString('en-US')} PAZ`) + `\u200B`
                },
                {
                    name: `> 👪 Population :`,
                    value: codeBlock(
                        `• ${population.habitant.toLocaleString('en-US')} habitants\n` +
                        `• ${chomage.toLocaleString('en-US')}% de chômage`) + `\u200B`
                },
                {
                    name: `> 🌄 Territoire :`,
                    value: codeBlock(
                        `• ${region}\n` +
                        `• ${territoire.tTotal.toLocaleString('en-US')} km² total\n` +
                        `• ${territoire.tLibre.toLocaleString('en-US')} km² libre\n` +
                        `• ${territoire.hexagone.toLocaleString('en-US')} cases\n` +
                        `• ${(territoire.cg * 1000).toLocaleString('en-US')} km² de capacité de gouvernance\n`) + `\u200B`
                },
                {
                    name: `> 🏦 Diplomatie :`,
                    value: codeBlock(
                        `• ${diplomatie.influence} influence\n`) + `\u200B`
                },
            ],
            color: interaction.member.displayColor,
            timestamp: new Date(),
            footer: {
                text: pays.devise
            },
        };

        const options = [
            {
                label: `Diplomatie`,
                emoji: `🏦`,
                description: `Menu de la diplomatie`,
                value: 'diplomatie',
            },
            {
                label: `Economie`,
                emoji: `💵`,
                description: `Menu de l'économie`,
                value: 'economie',
            },
            {
                label: `Gouvernement`,
                emoji: `🏛`,
                description: `Menu du gouvernement`,
                value: 'gouvernement',
            },
            {
                label: `Industrie`,
                emoji: `🏭`,
                description: `Menu des industries`,
                value: 'industrie',
            },
            {
                label: `Population`,
                emoji: `👪`,
                description: `Menu de la population`,
                value: 'population',
            },
            {
                label: `Options`,
                emoji: `⚙️`,
                description: `Menu des options`,
                value: 'options',
            },
            {
                label: `Territoire`,
                emoji: `🏞️`,
                description: `Menu du territoire`,
                value: 'territoire',
            }
        ];
        if (pays.rang !== 'Cité') {
            options.unshift(
                {
                    label: `Armée`,
                    emoji: `🪖`,
                    description: `Menu de l'armée`,
                    value: 'armee',
                })
        }
        const row1 = addSelectMenu('action-pays', "Sélectionner un menu", options)
        interaction.reply({ embeds: [embed], components: [row1] });
    },
};