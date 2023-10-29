import { ActionRowBuilder, SlashCommandBuilder, StringSelectMenuBuilder, ButtonBuilder, ButtonStyle, codeBlock } from 'discord.js';
import { readFileSync } from 'fs';
import {calculerSoldat, calculerEmploi} from "../../fonctions/functions";
const armeeObject = JSON.parse(readFileSync('src/OLD/data/armee.json', 'utf-8'));
const batimentObject = JSON.parse(readFileSync('src/OLD/data/batiment.json', 'utf-8'));
const biomeObject = JSON.parse(readFileSync('src/OLD/data/biome.json', 'utf-8'));
import { Pays } from '../../entities/Pays';
import {Batiments} from "../../entities/Batiments";
import {Armee} from "../../entities/Armee";
import {Diplomatie} from "../../entities/Diplomatie";
import {Population} from "../../entities/Population";
import {Territoire} from "../../entities/Territoire";
import {AppDataSource} from "../../data-source";

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

        if (!pays) {
            const reponse = codeBlock('ansi', `\u001b[0;0m\u001b[1;31mVous ne jouez actuellement pas. Commencez dès maintenant en allant dans #commencer`);
            const bouton1 = new ButtonBuilder()
                        .setLabel(`Débuter sur Paz Nation`)
                        .setEmoji(`🔌`)
                        .setURL('https://discord.com/channels/826427184305537054/983316109367345152/1058766018123673680')
                        .setStyle(ButtonStyle.Link)
            const row = new ActionRowBuilder()
                .addComponents(bouton1)
            await interaction.reply({ content: reponse, components: [row], ephemeral: true });
        } else {
            const region = eval(`biomeObject.${territoire.region}.nom`);

            //region Calcul du nombre d'employés
            const emploisTotaux = calculerEmploi(armee, batiment, population, armeeObject, batimentObject).emploisTotaux;
            const soldat = calculerSoldat(armee, armeeObject)

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
            const row = new ActionRowBuilder()
                .addComponents(
                    new StringSelectMenuBuilder()
                        .setCustomId('action-pays')
                        .setPlaceholder(`Afficher un autre menu`)
                        .addOptions(options),
                );
            interaction.reply({ embeds: [embed], components: [row] });
        }
    },
};