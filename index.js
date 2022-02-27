const fs = require('fs');
const { Client, Collection, Intents } = require('discord.js');
const dotenv = require('dotenv');
dotenv.config();
const mysql = require('mysql');

const connection = new mysql.createConnection({
    host: 'eu01-sql.pebblehost.com',
    user: 'customer_260507_paznation',
    password: 'lidmGbk8edPkKXv1#ZO',
    database: 'customer_260507_paznation'
})

connection.connect(function(err) {
    if (err) {
        console.error('Il y a eu une erreur en se connectant à la base de données ' + err.stack);
        return;
    }

    console.log('Connecté à la base de donnée sous l\'id: ' + connection.threadId);
});

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.data.name, command);
}

const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const event = require(`./events/${file}`);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
}

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {
        await command.execute(interaction, client);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'Il y a eu une erreur !', ephemeral: true });
    }
});

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