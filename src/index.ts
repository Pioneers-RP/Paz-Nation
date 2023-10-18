import { readdirSync } from 'fs'
import path from 'node:path';
import { Client, GatewayIntentBits, Partials, Collection } from 'discord.js';
import dotenv from 'dotenv';
import { AppDataSource } from "./data-source"
import mysql from 'mysql';

dotenv.config();

AppDataSource.initialize()
    .then(() => {
        console.log("Database initialized")})
    .catch((error) => console.log(error))

const connection = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_DATABASE,
    port: Number('3306'),
    multipleStatements: true
})

connection.connect(function(err) {
    if (err) {
        console.error('Il y a eu une erreur en se connectant à la base de données ' + err.stack);
        return;
    }

    console.log('Connecté à la base de donnée sous l\'id: ' + connection.threadId);
});

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
        const commandFiles = readdirSync(commandsPath).filter((file) => file.endsWith('.js'));
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
const eventFiles = readdirSync(eventsPath).filter((file) => file.endsWith('.js'));

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
    console.log(`Lancé sous le bot ${client.user?.tag}`);
});
