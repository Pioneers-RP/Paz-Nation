import { readdirSync } from 'fs'
import path from 'node:path';
import { Client, GatewayIntentBits, Partials, Collection } from 'discord.js';
import dotenv from 'dotenv';
dotenv.config();
import { AppDataSource } from "./data-source.js"

AppDataSource.initialize()
    .then(() => {
        console.log("Database initialized")
    })
    .catch((error) => console.log(error))

import mysql from 'mysql';
const connection = new mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    port: process.env.PORT,
    multipleStatements: true
})
const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildPresences, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.DirectMessages, GatewayIntentBits.MessageContent],
    partials: [Partials.Channel, Partials.Message, Partials.User, Partials.GuildMember, Partials.Reaction],
});
module.exports = { connection, client };
// @ts-ignore
client.commands = new Collection();
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = readdirSync(foldersPath);

async function loadCommands() {
    for (const folder of commandFolders) {
        const commandsPath = path.join(foldersPath, folder);
        const commandFiles = readdirSync(commandsPath).filter((file) => file.endsWith('.ts'));
        for (const file of commandFiles) {
            const filePath = path.join(commandsPath, file);
            const command = await import(filePath);
            if ('data' in command && 'execute' in command) {
                // @ts-ignore
                client.commands.set(command.data.name, command);
            } else {
                console.log(
                    `[ATTENTION] La commande à l'emplacement ${filePath} ne contient pas les propriétés "data" ou "execute" requises.`
                );
            }
        }
    }
}
loadCommands().catch((error) => {
    console.error(error);
});

const eventsPath = path.join(__dirname, 'events');
const eventFiles = readdirSync(eventsPath).filter((file) => file.endsWith('.ts'));

async function loadEvents() {
    for (const file of eventFiles) {
        const filePath = path.join(eventsPath, file);
        const event = await import(filePath);
        if (event.once) {
            client.once(event.name, (...args: any[]) => event.execute(...args));
        } else {
            client.on(event.name, (...args: any[]) => event.execute(...args));
        }
    }
}
loadEvents().catch((error) => {
    console.error(error);
});

process.on('exit', (code) => {
    console.log(`Le bot s'est arrêté avec le code : ${code} !`);
});
process.on('uncaughtException', (err, origin) => {
    console.log(`ERREUR_NON_CAPTURÉE : ${err}`, `Origine : ${origin}`);
});
process.on('unhandledRejection', (reason, promise) => {
    console.log(`REJET_NON_GÉRÉ : ${reason}\n-----\n`, promise);
});
process.on('warning', (...args: any[]) => {
    console.log(...args);
});

client.login(process.env.TOKEN!).then(() => {
    console.log(`Lancé sous le bot ${client.user.tag}`);
});
