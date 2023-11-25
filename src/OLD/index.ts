import { readdirSync } from 'fs'
import path from 'node:path';
import { Client, GatewayIntentBits, Partials, Collection } from 'discord.js';
import { AppDataSource } from "./data-source"
import mysql from 'mysql';

console.log("Starting1 Index.ts")
console.log("process.env.DATABASE_HOST : " + process.env.DATABASE_HOST)
console.log("process.env.DATABASE_USER : " + process.env.DATABASE_USER)
console.log("process.env.DATABASE_PASSWORD : " + process.env.DATABASE_PASSWORD)
console.log("process.env.DATABASE_DATABASE : " + process.env.DATABASE_DATABASE)
console.log("process.env.DATABASE_PORT : " + process.env.DATABASE_PORT)
console.log("process.env.TOKEN : " + process.env.TOKEN)
console.log("Ending1 Index.ts")

export const connect = AppDataSource.initialize()
    .then(() => {
        console.log("Database initialized with TypeORM")})
    .catch((error) => console.log(error))

export const connection = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT ? parseInt(process.env.DATABASE_PORT, 10) : 3306,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_DATABASE,
    multipleStatements: true
})

connection.connect(function(err) {
    if (err) {
        console.error('There was an error connecting to the Database with MySQL ' + err.stack);
        return;
    }
    console.log('Database initialized with MySQL under ID : ' + connection.threadId);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error(`Rejet non géré : ${reason}\n-----\n`, promise);
    // Fermez la connexion MySQL en cas d'erreur
    connection.end();
  });

export const client = new Client({
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
                    `[WARNING] The command at the path ${filePath} doesn't contain any "data" or "execute" properties needed .`
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
    console.log(`Bot crashed with code : ${code} !`);
});
process.on('uncaughtException', (err, origin) => {
    console.log(`Uncaught Exception : ${err}`, `Origine : ${origin}`);
});
process.on('unhandledRejection', (reason, promise) => {
    console.log(`Unhandled Rejection : ${reason}\n-----\n`, promise);
});
process.on('Warning', (...args: any[]) => {
    console.log(...args);
});

client.login(process.env.TOKEN!).then(() => {
    console.log(`Bot launched under : ${client.user?.tag}`);
});
