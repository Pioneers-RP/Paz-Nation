const fs = require('fs');
const { Client, Collection, Intents, Guild } = require('discord.js');
//
const dotenv = require('dotenv');
dotenv.config();
//
var mysql = require('mysql');
//
const { globalBox } = require('global-box');
const box = globalBox();
//
const connection = new mysql.createConnection({
    host: 'eu01-sql.pebblehost.com',
    user: 'customer_260507_paznation',
    password: 'lidmGbk8edPkKXv1#ZO',
    database: 'customer_260507_paznation',
    multipleStatements: true
})

module.exports = { connection };
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
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'Il y a eu une erreur !', ephemeral: true });
    }
});

client.on('guildMemberAdd', async member => {
    if (member.guild != '826427184305537054') {
        var embed = {
            author: {
                name: `Nouveau membre !`,
                icon_url: `https://cdn.discordapp.com/attachments/772878794213031936/845971000892981248/image-removebg-preview_13.png`
            },
            thumbnail: {
                url: `https://cdn.discordapp.com/attachments/845674635810439200/845970548445806612/PAZ_1-removebg-preview_1.png`,
            },
            timestamp: new Date(),
            description: `Bienvenue à ${member} sur 🌍 𝐏𝐀𝐙 𝐍𝐀𝐓𝐈𝐎𝐍 👑 !\n` +
                `Rendez-vous dans <#845687492526473246> pour commencer l'aventure !`,
            color: '#32EB42',
            footer: {
                text: `N'hésitez pas à demander de l'aide dans les salons #💬┃public et #🔧┃support !`
            },
        };

        const paz = client.guilds.cache.get('826427184305537054');
        const salon_public = paz.channels.cache.get('942796849625055236');
        salon_public.send({ embeds: [embed] })
    }
});

client.on('guildMemberRemove', async member => {
    if (member.guild != '826427184305537054') {
        var embed = {
            author: {
                name: `Nouveau membre !`,
                icon_url: `https://cdn.discordapp.com/attachments/772878794213031936/845971000892981248/image-removebg-preview_13.png`
            },
            thumbnail: {
                url: `https://cdn.discordapp.com/attachments/845674635810439200/845970548445806612/PAZ_1-removebg-preview_1.png`,
            },
            timestamp: new Date(),
            description: `Bienvenue à ${member} sur 🌍 𝐏𝐀𝐙 𝐍𝐀𝐓𝐈𝐎𝐍 👑 !\n` +
                `Rendez-vous dans <#845687492526473246> pour commencer l'aventure !`,
            color: '#32EB42',
            footer: {
                text: `N'hésitez pas à demander de l'aide dans les salons #💬┃public et #🔧┃support !`
            },
        };

        const paz = client.guilds.cache.get('826427184305537054');
        const salon_public = paz.channels.cache.get('942796849625055236');
        salon_public.send({ embeds: [embed] })
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