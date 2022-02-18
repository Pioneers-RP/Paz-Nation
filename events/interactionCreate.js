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
                    thumbnail: 'https://media.discordapp.net/attachments/845932351811878913/934778568846762054/flag.png?width=757&height=473',
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
                    thumbnail: 'https://media.discordapp.net/attachments/845932351811878913/934778568846762054/flag.png?width=757&height=473',
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
                    thumbnail: 'https://media.discordapp.net/attachments/845932351811878913/934778568846762054/flag.png?width=757&height=473',
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
                    thumbnail: 'https://media.discordapp.net/attachments/845932351811878913/934778568846762054/flag.png?width=757&height=473',
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
                    thumbnail: `https://cdn.discordapp.com/attachments/939251032297463879/940642380640583770/paz_v3.png`,
                    title: `Marché International (IM) :`,
                    fields: [{
                        "name": `Work in Progress`,
                        "value": `Work in Progress`
                    }],
                    color: interaction.member.displayHexColor,
                };
                interaction.reply({ embeds: [embed] })

                //Quick Sell
            } else if (interaction.customId === 'menu_QS') {
                const embed = {
                    thumbnail: `https://cdn.discordapp.com/attachments/939251032297463879/940642380640583770/paz_v3.png`,
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
                    thumbnail: 'https://media.discordapp.net/attachments/845932351811878913/934778568846762054/flag.png?width=757&height=473',
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
                    thumbnail: 'https://media.discordapp.net/attachments/845932351811878913/934778568846762054/flag.png?width=757&height=473',
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
                    thumbnail: 'https://media.discordapp.net/attachments/845932351811878913/934778568846762054/flag.png?width=757&height=473',
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
                        thumbnail: 'https://media.discordapp.net/attachments/845932351811878913/934778568846762054/flag.png?width=757&height=473',
                        title: `Usine : Briqueterie`,
                        fields: [{
                                name: `\u200B`,
                                value: `Nombre d'usines total : \nTerritoire total :`
                            },
                            {
                                name: `Consommation :`,
                                value: `- Par usine : \n<ressource1> :\n<ressource2>:\n<ressource3>:\n- Totale : \n<ressource1>:\n<ressource2>:\n<ressource3>:`,
                                inline: true
                            },
                            {
                                name: `Construction :`,
                                value: `*pour une usine* \n<ressource1>:\n<ressource2>:\n<ressource3>:`
                            },
                            {
                                name: `Production :`,
                                value: `Par usine : \nTotale :\n\n**En réserve :**`
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
                        thumbnail: 'https://media.discordapp.net/attachments/845932351811878913/934778568846762054/flag.png?width=757&height=473',
                        title: `Usine : Champ`,
                        fields: [{
                                name: `\u200B`,
                                value: `Nombre d'usines total : \nTerritoire total :`
                            },
                            {
                                name: `Consommation :`,
                                value: `- Par usine : \n<ressource1> :\n<ressource2>:\n<ressource3>:\n- Totale : \n<ressource1>:\n<ressource2>:\n<ressource3>:`,
                                inline: true
                            },
                            {
                                name: `Construction :`,
                                value: `*pour une usine* \n<ressource1>:\n<ressource2>:\n<ressource3>:`
                            },
                            {
                                name: `Production :`,
                                value: `Par usine : \nTotale :\n\n**En réserve :**`
                            }
                        ],
                        color: interaction.member.displayHexColor,
                        footer: {
                            text: `Suède, Travail, Investissement`
                        }
                    };

                    interaction.reply({ embeds: [embed] })
                }
                if (interaction.values == 'centrale_éléctrique') {

                    const embed = {
                        author: {
                            name: `<\\Nom du pays>`,
                            icon_url: interaction.member.displayAvatarURL()
                        },
                        thumbnail: 'https://media.discordapp.net/attachments/845932351811878913/934778568846762054/flag.png?width=757&height=473',
                        title: `Usine : Centrale électrique`,
                        fields: [{
                                name: `\u200B`,
                                value: `Nombre d'usines total : \nTerritoire total :`
                            },
                            {
                                name: `Consommation :`,
                                value: `- Par usine : \n<ressource1> :\n<ressource2>:\n<ressource3>:\n- Totale : \n<ressource1>:\n<ressource2>:\n<ressource3>:`,
                                inline: true
                            },
                            {
                                name: `Construction :`,
                                value: `*pour une usine* \n<ressource1>:\n<ressource2>:\n<ressource3>:`
                            },
                            {
                                name: `Production :`,
                                value: `Par usine : \nTotale :\n\n**En réserve :**`
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
                        thumbnail: 'https://media.discordapp.net/attachments/845932351811878913/934778568846762054/flag.png?width=757&height=473',
                        title: `Usine : Mine`,
                        fields: [{
                                name: `\u200B`,
                                value: `Nombre d'usines total : \nTerritoire total :`
                            },
                            {
                                name: `Consommation :`,
                                value: `- Par usine : \n<ressource1> :\n<ressource2>:\n<ressource3>:\n- Totale : \n<ressource1>:\n<ressource2>:\n<ressource3>:`,
                                inline: true
                            },
                            {
                                name: `Construction :`,
                                value: `*pour une usine* \n<ressource1>:\n<ressource2>:\n<ressource3>:`
                            },
                            {
                                name: `Production :`,
                                value: `Par usine : \nTotale :\n\n**En réserve :**`
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
                        thumbnail: 'https://media.discordapp.net/attachments/845932351811878913/934778568846762054/flag.png?width=757&height=473',
                        title: `Usine : Pompe à eau`,
                        fields: [{
                                name: `\u200B`,
                                value: `Nombre d'usines total : \nTerritoire total :`
                            },
                            {
                                name: `Consommation :`,
                                value: `- Par usine : \n<ressource1> :\n<ressource2>:\n<ressource3>:\n- Totale : \n<ressource1>:\n<ressource2>:\n<ressource3>:`,
                                inline: true
                            },
                            {
                                name: `Construction :`,
                                value: `*pour une usine* \n<ressource1>:\n<ressource2>:\n<ressource3>:`
                            },
                            {
                                name: `Production :`,
                                value: `Par usine : \nTotale :\n\n**En réserve :**`
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
                        thumbnail: 'https://media.discordapp.net/attachments/845932351811878913/934778568846762054/flag.png?width=757&height=473',
                        title: `Usine : Pumpjack`,
                        fields: [{
                                name: `\u200B`,
                                value: `Nombre d'usines total : \nTerritoire total :`
                            },
                            {
                                name: `Consommation :`,
                                value: `- Par usine : \n<ressource1> :\n<ressource2>:\n<ressource3>:\n- Totale : \n<ressource1>:\n<ressource2>:\n<ressource3>:`,
                                inline: true
                            },
                            {
                                name: `Construction :`,
                                value: `*pour une usine* \n<ressource1>:\n<ressource2>:\n<ressource3>:`
                            },
                            {
                                name: `Production :`,
                                value: `Par usine : \nTotale :\n\n**En réserve :**`
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
                        thumbnail: 'https://media.discordapp.net/attachments/845932351811878913/934778568846762054/flag.png?width=757&height=473',
                        title: `Usine : Scierie`,
                        fields: [{
                                name: `\u200B`,
                                value: `Nombre d'usines total : \nTerritoire total :`
                            },
                            {
                                name: `Consommation :`,
                                value: `- Par usine : \n<ressource1> :\n<ressource2>:\n<ressource3>:\n- Totale : \n<ressource1>:\n<ressource2>:\n<ressource3>:`,
                                inline: true
                            },
                            {
                                name: `Construction :`,
                                value: `*pour une usine* \n<ressource1>:\n<ressource2>:\n<ressource3>:`
                            },
                            {
                                name: `Production :`,
                                value: `Par usine : \nTotale :\n\n**En réserve :**`
                            }
                        ],
                        color: interaction.member.displayHexColor,
                        footer: {
                            text: `Suède, Travail, Investissement`
                        }
                    };

                    interaction.reply({ embeds: [embed] })
                }
                if (interaction.values == 'usine_bienconso') {

                    const embed = {
                        author: {
                            name: `<\\Nom du pays>`,
                            icon_url: interaction.member.displayAvatarURL()
                        },
                        thumbnail: 'https://media.discordapp.net/attachments/845932351811878913/934778568846762054/flag.png?width=757&height=473',
                        title: `Usine : Biens de consommation`,
                        fields: [{
                                name: `\u200B`,
                                value: `Nombre d'usines total : \nTerritoire total :`
                            },
                            {
                                name: `Consommation :`,
                                value: `- Par usine : \n<ressource1> :\n<ressource2>:\n<ressource3>:\n- Totale : \n<ressource1>:\n<ressource2>:\n<ressource3>:`,
                                inline: true
                            },
                            {
                                name: `Construction :`,
                                value: `*pour une usine* \n<ressource1>:\n<ressource2>:\n<ressource3>:`
                            },
                            {
                                name: `Production :`,
                                value: `Par usine : \nTotale :\n\n**En réserve :**`
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