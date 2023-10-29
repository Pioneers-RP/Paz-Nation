import { readdirSync, writeFile } from 'fs'
import path from 'node:path';
import { Client, GatewayIntentBits, Partials, Collection } from 'discord.js';
import dotenv from 'dotenv';
import { AppDataSource } from "./data-source"
import mysql from 'mysql';

dotenv.config();
export const connect = AppDataSource.initialize()
    .then(() => {
        console.log("Database initialized with TypeORM")})
    .catch((error) => console.log(error))

export const connection = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_DATABASE,
    port: Number('3306'),
    multipleStatements: true
})

connection.connect(function(err) {
    if (err) {
        console.error('There was an error connecting to the Database with MySQL ' + err.stack);
        return;
    }

    console.log('Database initialized with MySQL under ID : ' + connection.threadId);
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
        const commandFiles = readdirSync(commandsPath).filter((file) => file.endsWith('.js') || file.endsWith('.ts'));
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
    // Check if the bot is healthy
    writeFile('/tmp/healthy', 'OK', (err) => {
        if (err) {
        console.error('Failed to create health check file:', err);
        } else {
        console.log('Health check file created successfully.');
        }
    });
});
