const fs = require('node:fs');
const path = require('node:path');
const { Client, Events, GatewayIntentBits, Partials, Collection} = require('discord.js');
//
const dotenv = require('dotenv');
dotenv.config();
//
const mysql = require('mysql');
//
const connection = new mysql.createConnection({
    host: 'eu02-sql.pebblehost.com',
    user: 'customer_355631_test',
    password: 'AETcK7VBES~fZKW@lF1r',
    database: 'customer_355631_test',
    multipleStatements: true
})
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.MessageContent
    ],
    partials: [Partials.Channel, Partials.Message, Partials.User, Partials.GuildMember, Partials.Reaction]
});
module.exports = { connection, client };
connection.connect(function(err) {
    if (err) {
        console.error('Il y a eu une erreur en se connectant à la base de données ' + err.stack);
        return;
    }

    console.log('Connecté à la base de donnée sous l\'id: ' + connection.threadId);
});


client.commands = new Collection();
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        // Set a new item in the Collection with the key as the command name and the value as the exported module
        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
        } else {
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }
}

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
}

process.on('exit', code => {
    console.log(`Le bot a crash à cause du code: ${code} !`)
});
process.on('uncaughtException', (err, origin) => {
    console.log(`UNCAUGHT_EXCEPTION: ${err}`, `Origine: ${origin}`)
});
process.on('unhandledRejection', (reason, promise) => {
    console.log(`UNHANDLE_REJECTION: ${reason}\n-----\n`, promise)
});
process.on('warning', (...args) => {
    console.log(...args)
});

client.login(process.env.TOKEN);