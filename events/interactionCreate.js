module.exports = {
    name: 'interactionCreate',
    execute(interaction) {
        if (interaction.isCommand()) {
            console.log(`${interaction.user.tag} a utilisé une intéraction dans #${interaction.channel.name}.`);

        } //FIN DU CODE POUR LES SLASHS COMMANDES

        //code pour les boutons
        else if (interaction.isButton()) {
            console.log(`${interaction.user.tag} a utilisé un bouton dans #${interaction.channel.name}.`);

            //Menu de l'économie
            if (interaction.customId === 'menu_économie') {
                const embed = {
                    author: {
                        name: `<\\Nom du pays>`,
                        icon_url: interaction.member.displayAvatarURL()
                    },
                    thumbnail: {
                        url: 'https://cdn.discordapp.com/attachments/939251032297463879/940642380640583770/paz_v3.png',
                    },
                    title: `Menu de l\'économie :`,
                    fields: [{
                        name: `Work in Progress`,
                        value: `Work in Progress`
                    }],
                    color: interaction.member.displayHexColor,
                    footer: {
                        text: `Suède, Travail, Investissement`
                    }
                };

                interaction.reply({ embeds: [embed] })

                //Menu de la population
            } else if (interaction.customId === 'menu_population') {
                const embed = {
                    author: {
                        name: `<\\Nom du pays>`,
                        icon_url: interaction.member.displayAvatarURL()
                    },
                    thumbnail: {
                        url: 'https://cdn.discordapp.com/attachments/939251032297463879/940642380640583770/paz_v3.png',
                    },
                    title: `Menu de la population :`,
                    fields: [{
                        name: `Work in Progress`,
                        value: `Work in Progress`
                    }],
                    color: interaction.member.displayHexColor,
                    footer: {
                        text: `Suède, Travail, Investissement`
                    }
                };

                interaction.reply({ embeds: [embed] })

                //Menu du gouvernement
            } else if (interaction.customId === 'menu_gouvernement') {
                const embed = {
                    author: {
                        name: `<\\Nom du pays>`,
                        icon_url: interaction.member.displayAvatarURL()
                    },
                    thumbnail: {
                        url: 'https://cdn.discordapp.com/attachments/939251032297463879/940642380640583770/paz_v3.png',
                    },
                    title: `Menu du gouvernement :`,
                    fields: [{
                        name: `Forme de gouvernement : `,
                        value: `Work in Progress`
                    }, {
                        name: `Idéologie : `,
                        value: `Work in Progress`
                    }, {
                        name: `Rang : `,
                        value: `Work in Progress`
                    }, {
                        name: `Nom de l'Etat : `,
                        value: `Work in Progress`
                    }, {
                        name: `Devise : `,
                        value: `Work in Progress`
                    }],
                    color: interaction.member.displayHexColor,
                    footer: {
                        text: `Suède, Travail, Investissement`
                    }
                };

                interaction.reply({ embeds: [embed] })
                    //Menu de l'armée
            } else if (interaction.customId === 'menu_armée') {
                const embed = {
                    author: {
                        name: `<\\Nom du pays>`,
                        icon_url: interaction.member.displayAvatarURL()
                    },
                    thumbnail: {
                        url: 'https://cdn.discordapp.com/attachments/939251032297463879/940642380640583770/paz_v3.png',
                    },
                    title: `Menu de l\'armée :`,
                    fields: [{
                        name: `Work in Progress`,
                        value: `Work in Progress`
                    }],
                    color: interaction.member.displayHexColor,
                    footer: {
                        text: `Suède, Travail, Investissement`
                    }
                };

                interaction.reply({ embeds: [embed] })

                //International market
            } else if (interaction.customId === 'menu_IM') {
                const embed = {
                    thumbnail: {
                        url: 'https://cdn.discordapp.com/attachments/939251032297463879/940642380640583770/paz_v3.png',
                    },
                    title: `Marché International (IM) :`,
                    fields: [{
                        name: `Work in Progress`,
                        value: `Work in Progress`
                    }],
                    color: interaction.member.displayHexColor,
                };
                interaction.reply({ embeds: [embed] })

                //Quick Sell
            } else if (interaction.customId === 'menu_QS') {
                const embed = {
                    thumbnail: {
                        url: 'https://cdn.discordapp.com/attachments/939251032297463879/940642380640583770/paz_v3.png',
                    },
                    title: `Quick Sell (QS) :`,
                    fields: [{
                        name: `Work in Progress`,
                        value: `Work in Progress`
                    }],
                    color: interaction.member.displayHexColor,
                };
                interaction.reply({ embeds: [embed] })

                //Choix pacifique
            } else if (interaction.customId === 'choix_pacifique') {
                const embed = {
                    author: {
                        name: `<\\Nom du pays>`,
                        icon_url: interaction.member.displayAvatarURL()
                    },
                    thumbnail: {
                        url: 'https://cdn.discordapp.com/attachments/939251032297463879/940642380640583770/paz_v3.png',
                    },
                    title: `Négociation en cours :`,
                    fields: [{
                        name: `Work in Progress`,
                        value: `Work in Progress`
                    }],
                    color: interaction.member.displayHexColor,
                    footer: {
                        text: `Suède, Travail, Investissement`
                    }
                };

                interaction.reply({ embeds: [embed] })

                //Choix dissuasif
            } else if (interaction.customId === 'choix_dissuasif') {
                const embed = {
                    author: {
                        name: `<\\Nom du pays>`,
                        icon_url: interaction.member.displayAvatarURL()
                    },
                    thumbnail: {
                        url: 'https://cdn.discordapp.com/attachments/939251032297463879/940642380640583770/paz_v3.png',
                    },
                    title: `Négociation armée en cours :`,
                    fields: [{
                        name: `Work in Progress`,
                        value: `Work in Progress`
                    }],
                    color: interaction.member.displayHexColor,
                    footer: {
                        text: `Suède, Travail, Investissement`
                    }
                }

                interaction.reply({ embeds: [embed] })

                //Choix armée
            } else if (interaction.customId === 'choix_armée') {
                const embed = {
                    author: {
                        name: `<\\Nom du pays>`,
                        icon_url: interaction.member.displayAvatarURL()
                    },
                    thumbnail: {
                        url: 'https://cdn.discordapp.com/attachments/939251032297463879/940642380640583770/paz_v3.png',
                    },
                    title: `Vous avez envoyer l\'armée :`,
                    fields: [{
                        name: `Work in Progress`,
                        value: `Work in Progress`
                    }],
                    color: interaction.member.displayHexColor,
                    footer: {
                        text: `Suède, Travail, Investissement`
                    }
                };

                interaction.reply({ embeds: [embed] })

            } //FIN DU CODE POUR LES BOUTONS

            //code pour les menus
        } else if (interaction.isSelectMenu()) {
            console.log(`${interaction.user.tag} a utilisé un menu dans #${interaction.channel.name}.`);
            if (interaction.customId == 'usine') {
                if (interaction.values == 'briqueterie') {

                    const embed = {
                        author: {
                            name: `<\\Nom du pays>`,
                            icon_url: interaction.member.displayAvatarURL()
                        },
                        thumbnail: {
                            url: 'https://cdn.discordapp.com/attachments/939251032297463879/940642380640583770/paz_v3.png',
                        },
                        title: `Usine : Briqueterie`,
                        description: `Nombre d'usines total : \n` +
                            `Territoire utilisé :`,
                        fields: [{
                                name: `Production :`,
                                value: `Ressource : brique\n` +
                                    `Par usine : \n` +
                                    `Totale :`,
                                inline: true
                            },
                            {
                                name: `En réserve :`,
                                value: `<>`,
                                inline: true
                            },
                            {
                                name: '\u200B',
                                value: '\u200B'
                            },
                            {
                                name: `Consommation :`,
                                value: `- Par usine : \n` +
                                    `<ressource1> :\n` +
                                    `<ressource2>:\n` +
                                    `<ressource3>:\n`,
                                inline: true
                            },
                            {
                                name: `\u200B`,
                                value: `- Totale : \n` +
                                    `<ressource1>:\n` +
                                    `<ressource2>:\n` +
                                    `<ressource3>:`,
                                inline: true
                            },
                            {
                                name: `Construction :`,
                                value: `*pour une usine* \n` +
                                    `<ressource1>:\n` +
                                    `<ressource2>:\n` +
                                    `<ressource3>:`
                            }
                        ],
                        color: interaction.member.displayHexColor,
                        footer: {
                            text: `Suède, Travail, Investissement`
                        }
                    };

                    interaction.reply({ embeds: [embed] })
                }
                if (interaction.values == 'champ') {

                    const embed = {
                        author: {
                            name: `<\\Nom du pays>`,
                            icon_url: interaction.member.displayAvatarURL()
                        },
                        thumbnail: {
                            url: 'https://cdn.discordapp.com/attachments/939251032297463879/940642380640583770/paz_v3.png',
                        },
                        title: `Usine : Champ`,
                        description: `Nombre d'usines total : \n` +
                            `Territoire utilisé :`,
                        fields: [{
                                name: `Production :`,
                                value: `Ressource : nourriture\n` +
                                    `Par usine : \n` +
                                    `Totale :`,
                                inline: true
                            },
                            {
                                name: `En réserve :`,
                                value: `<>`,
                                inline: true
                            },
                            {
                                name: '\u200B',
                                value: '\u200B'
                            },
                            {
                                name: `Consommation :`,
                                value: `- Par usine : \n` +
                                    `<ressource1> :\n` +
                                    `<ressource2>:\n` +
                                    `<ressource3>:\n`,
                                inline: true
                            },
                            {
                                name: `\u200B`,
                                value: `- Totale : \n` +
                                    `<ressource1>:\n` +
                                    `<ressource2>:\n` +
                                    `<ressource3>:`,
                                inline: true
                            },
                            {
                                name: `Construction :`,
                                value: `*pour une usine* \n` +
                                    `<ressource1>:\n` +
                                    `<ressource2>:\n` +
                                    `<ressource3>:`
                            }
                        ],
                        color: interaction.member.displayHexColor,
                        footer: {
                            text: `Suède, Travail, Investissement`
                        }
                    };

                    interaction.reply({ embeds: [embed] })
                }
                if (interaction.values == 'centrale_électrique') {

                    const embed = {
                        author: {
                            name: `<\\Nom du pays>`,
                            icon_url: interaction.member.displayAvatarURL()
                        },
                        thumbnail: {
                            url: 'https://cdn.discordapp.com/attachments/939251032297463879/940642380640583770/paz_v3.png',
                        },
                        title: `Usine : Centrale électrique`,
                        description: `Nombre d'usines total : \n` +
                            `Territoire utilisé :`,
                        fields: [{
                                name: `Production :`,
                                value: `Ressource : électricité\n` +
                                    `Par usine : \n` +
                                    `Totale :`,
                                inline: true
                            },
                            {
                                name: `En réserve :`,
                                value: `<>`,
                                inline: true
                            },
                            {
                                name: '\u200B',
                                value: '\u200B'
                            },
                            {
                                name: `Consommation :`,
                                value: `- Par usine : \n` +
                                    `<ressource1> :\n` +
                                    `<ressource2>:\n` +
                                    `<ressource3>:\n`,
                                inline: true
                            },
                            {
                                name: `\u200B`,
                                value: `- Totale : \n` +
                                    `<ressource1>:\n` +
                                    `<ressource2>:\n` +
                                    `<ressource3>:`,
                                inline: true
                            },
                            {
                                name: `Construction :`,
                                value: `*pour une usine* \n` +
                                    `<ressource1>:\n` +
                                    `<ressource2>:\n` +
                                    `<ressource3>:`
                            }
                        ],
                        color: interaction.member.displayHexColor,
                        footer: {
                            text: `Suède, Travail, Investissement`
                        }
                    };

                    interaction.reply({ embeds: [embed] })
                }
                if (interaction.values == 'mine') {

                    const embed = {
                        author: {
                            name: `<\\Nom du pays>`,
                            icon_url: interaction.member.displayAvatarURL()
                        },
                        thumbnail: {
                            url: 'https://cdn.discordapp.com/attachments/939251032297463879/940642380640583770/paz_v3.png',
                        },
                        title: `Usine : Mine`,
                        description: `Nombre d'usines total : \n` +
                            `Territoire utilisé :`,
                        fields: [{
                                name: `Production :`,
                                value: `Ressource : métaux\n` +
                                    `Par usine : \n` +
                                    `Totale :`,
                                inline: true
                            },
                            {
                                name: `En réserve :`,
                                value: `<>`,
                                inline: true
                            },
                            {
                                name: '\u200B',
                                value: '\u200B'
                            },
                            {
                                name: `Consommation :`,
                                value: `- Par usine : \n` +
                                    `<ressource1> :\n` +
                                    `<ressource2>:\n` +
                                    `<ressource3>:\n`,
                                inline: true
                            },
                            {
                                name: `\u200B`,
                                value: `- Totale : \n` +
                                    `<ressource1>:\n` +
                                    `<ressource2>:\n` +
                                    `<ressource3>:`,
                                inline: true
                            },
                            {
                                name: `Construction :`,
                                value: `*pour une usine* \n` +
                                    `<ressource1>:\n` +
                                    `<ressource2>:\n` +
                                    `<ressource3>:`
                            }
                        ],
                        color: interaction.member.displayHexColor,
                        footer: {
                            text: `Suède, Travail, Investissement`
                        }
                    };

                    interaction.reply({ embeds: [embed] })
                }
                if (interaction.values == 'pompe_à_eau') {

                    const embed = {
                        author: {
                            name: `<\\Nom du pays>`,
                            icon_url: interaction.member.displayAvatarURL()
                        },
                        thumbnail: {
                            url: 'https://cdn.discordapp.com/attachments/939251032297463879/940642380640583770/paz_v3.png',
                        },
                        title: `Usine : Pompe à eau`,
                        description: `Nombre d'usines total : \n` +
                            `Territoire utilisé :`,
                        fields: [{
                                name: `Production :`,
                                value: `Ressource : eau\n` +
                                    `Par usine : \n` +
                                    `Totale :`,
                                inline: true
                            },
                            {
                                name: `En réserve :`,
                                value: `<>`,
                                inline: true
                            },
                            {
                                name: '\u200B',
                                value: '\u200B'
                            },
                            {
                                name: `Consommation :`,
                                value: `- Par usine : \n` +
                                    `<ressource1> :\n` +
                                    `<ressource2>:\n` +
                                    `<ressource3>:\n`,
                                inline: true
                            },
                            {
                                name: `\u200B`,
                                value: `- Totale : \n` +
                                    `<ressource1>:\n` +
                                    `<ressource2>:\n` +
                                    `<ressource3>:`,
                                inline: true
                            },
                            {
                                name: `Construction :`,
                                value: `*pour une usine* \n` +
                                    `<ressource1>:\n` +
                                    `<ressource2>:\n` +
                                    `<ressource3>:`
                            }
                        ],
                        color: interaction.member.displayHexColor,
                        footer: {
                            text: `Suède, Travail, Investissement`
                        }
                    };

                    interaction.reply({ embeds: [embed] })
                }
                if (interaction.values == 'pumpjack') {

                    const embed = {
                        author: {
                            name: `<\\Nom du pays>`,
                            icon_url: interaction.member.displayAvatarURL()
                        },
                        thumbnail: {
                            url: 'https://cdn.discordapp.com/attachments/939251032297463879/940642380640583770/paz_v3.png',
                        },
                        title: `Usine : Pumpjack`,
                        description: `Nombre d'usines total : \n` +
                            `Territoire utilisé :`,
                        fields: [{
                                name: `Production :`,
                                value: `Ressource : pétrole\n` +
                                    `Par usine : \n` +
                                    `Totale :`,
                                inline: true
                            },
                            {
                                name: `En réserve :`,
                                value: `<>`,
                                inline: true
                            },
                            {
                                name: '\u200B',
                                value: '\u200B'
                            },
                            {
                                name: `Consommation :`,
                                value: `- Par usine : \n` +
                                    `<ressource1> :\n` +
                                    `<ressource2>:\n` +
                                    `<ressource3>:\n`,
                                inline: true
                            },
                            {
                                name: `\u200B`,
                                value: `- Totale : \n` +
                                    `<ressource1>:\n` +
                                    `<ressource2>:\n` +
                                    `<ressource3>:`,
                                inline: true
                            },
                            {
                                name: `Construction :`,
                                value: `*pour une usine* \n` +
                                    `<ressource1>:\n` +
                                    `<ressource2>:\n` +
                                    `<ressource3>:`
                            }
                        ],
                        color: interaction.member.displayHexColor,
                        footer: {
                            text: `Suède, Travail, Investissement`
                        }
                    };

                    interaction.reply({ embeds: [embed] })
                }
                if (interaction.values == 'scierie') {

                    const embed = {
                        author: {
                            name: `<\\Nom du pays>`,
                            icon_url: interaction.member.displayAvatarURL()
                        },
                        thumbnail: {
                            url: 'https://cdn.discordapp.com/attachments/939251032297463879/940642380640583770/paz_v3.png',
                        },
                        title: `Usine : Scierie`,
                        description: `Nombre d'usines total : \n` +
                            `Territoire utilisé :`,
                        fields: [{
                                name: `Production :`,
                                value: `Ressource : bois\n` +
                                    `Par usine : \n` +
                                    `Totale :`,
                                inline: true
                            },
                            {
                                name: `En réserve :`,
                                value: `<>`,
                                inline: true
                            },
                            {
                                name: '\u200B',
                                value: '\u200B'
                            },
                            {
                                name: `Consommation :`,
                                value: `- Par usine : \n` +
                                    `<ressource1> :\n` +
                                    `<ressource2>:\n` +
                                    `<ressource3>:\n`,
                                inline: true
                            },
                            {
                                name: `\u200B`,
                                value: `- Totale : \n` +
                                    `<ressource1>:\n` +
                                    `<ressource2>:\n` +
                                    `<ressource3>:`,
                                inline: true
                            },
                            {
                                name: `Construction :`,
                                value: `*pour une usine* \n` +
                                    `<ressource1>:\n` +
                                    `<ressource2>:\n` +
                                    `<ressource3>:`
                            }
                        ],
                        color: interaction.member.displayHexColor,
                        footer: {
                            text: `Suède, Travail, Investissement`
                        }
                    };

                    interaction.reply({ embeds: [embed] })
                }
                if (interaction.values == 'usine_civile') {

                    const embed = {
                        author: {
                            name: `<\\Nom du pays>`,
                            icon_url: interaction.member.displayAvatarURL()
                        },
                        thumbnail: {
                            url: 'https://cdn.discordapp.com/attachments/939251032297463879/940642380640583770/paz_v3.png',
                        },
                        title: `Usine : Civile`,
                        description: `Nombre d'usines total : \n` +
                            `Territoire utilisé :`,
                        fields: [{
                                name: `Production :`,
                                value: `Ressource : biens de consommation\n` +
                                    `Par usine : \n` +
                                    `Totale :`,
                                inline: true
                            },
                            {
                                name: `En réserve :`,
                                value: `<>`,
                                inline: true
                            },
                            {
                                name: '\u200B',
                                value: '\u200B'
                            },
                            {
                                name: `Consommation :`,
                                value: `- Par usine : \n` +
                                    `<ressource1> :\n` +
                                    `<ressource2>:\n` +
                                    `<ressource3>:\n`,
                                inline: true
                            },
                            {
                                name: `\u200B`,
                                value: `- Totale : \n` +
                                    `<ressource1>:\n` +
                                    `<ressource2>:\n` +
                                    `<ressource3>:`,
                                inline: true
                            },
                            {
                                name: `Construction :`,
                                value: `*pour une usine* \n` +
                                    `<ressource1>:\n` +
                                    `<ressource2>:\n` +
                                    `<ressource3>:`
                            }
                        ],
                        color: interaction.member.displayHexColor,
                        footer: {
                            text: `Suède, Travail, Investissement`
                        }
                    };

                    interaction.reply({ embeds: [embed] })
                }
            }; //FIN DU CODE POUR LES MENUS
        };
    }
};