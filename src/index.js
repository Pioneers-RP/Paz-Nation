"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const node_path_1 = __importDefault(require("node:path"));
const discord_js_1 = require("discord.js");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const typeorm_1 = require("typeorm");
const Armee_js_1 = require("./entities/Armee.js");
const Batiments_js_1 = require("./entities/Batiments.js");
const Diplomatie_js_1 = require("./entities/Diplomatie.js");
const Historique_js_1 = require("./entities/Historique.js");
const Notification_js_1 = require("./entities/Notification.js");
const Population_js_1 = require("./entities/Population.js");
const Prix_js_1 = require("./entities/Prix.js");
const Processus_js_1 = require("./entities/Processus.js");
const Qachat_js_1 = require("./entities/Qachat.js");
const Qvente_js_1 = require("./entities/Qvente.js");
const Ressources_js_1 = require("./entities/Ressources.js");
const Territoire_js_1 = require("./entities/Territoire.js");
const Trade_js_1 = require("./entities/Trade.js");
const AppDataSource = new typeorm_1.DataSource({
    type: 'mariadb',
    host: process.env.HOST,
    port: process.env.PORT,
    username: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    entities: [
        Armee_js_1.Armee,
        Batiments_js_1.Batiments,
        Diplomatie_js_1.Diplomatie,
        Historique_js_1.Historique,
        Notification_js_1.Notification,
        Population_js_1.Population,
        Prix_js_1.Prix,
        Processus_js_1.Processus,
        Qachat_js_1.Qachat,
        Qvente_js_1.Qvente,
        Ressources_js_1.Ressources,
        Territoire_js_1.Territoire,
        Trade_js_1.Trade,
    ],
    synchronize: true,
    logging: false,
});
AppDataSource.initialize()
    .then(() => {
    console.log("Database initialized");
})
    .catch((error) => console.log(error));
const mysql_1 = __importDefault(require("mysql"));
const connection = new mysql_1.default.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    port: process.env.PORT,
    multipleStatements: true
});
const client = new discord_js_1.Client({
    intents: [discord_js_1.GatewayIntentBits.Guilds, discord_js_1.GatewayIntentBits.GuildMessages, discord_js_1.GatewayIntentBits.GuildPresences, discord_js_1.GatewayIntentBits.GuildMessageReactions, discord_js_1.GatewayIntentBits.DirectMessages, discord_js_1.GatewayIntentBits.MessageContent],
    partials: [discord_js_1.Partials.Channel, discord_js_1.Partials.Message, discord_js_1.Partials.User, discord_js_1.Partials.GuildMember, discord_js_1.Partials.Reaction],
});
module.exports = { connection, client };
// @ts-ignore
client.commands = new discord_js_1.Collection();
const foldersPath = node_path_1.default.join(__dirname, 'commands');
const commandFolders = (0, fs_1.readdirSync)(foldersPath);
async function loadCommands() {
    for (const folder of commandFolders) {
        const commandsPath = node_path_1.default.join(foldersPath, folder);
        const commandFiles = (0, fs_1.readdirSync)(commandsPath).filter((file) => file.endsWith('.ts'));
        for (const file of commandFiles) {
            const filePath = node_path_1.default.join(commandsPath, file);
            const command = await Promise.resolve(`${filePath}`).then(s => __importStar(require(s)));
            if ('data' in command && 'execute' in command) {
                // @ts-ignore
                client.commands.set(command.data.name, command);
            }
            else {
                console.log(`[ATTENTION] La commande à l'emplacement ${filePath} ne contient pas les propriétés "data" ou "execute" requises.`);
            }
        }
    }
}
loadCommands().catch((error) => {
    console.error(error);
});
const eventsPath = node_path_1.default.join(__dirname, 'events');
const eventFiles = (0, fs_1.readdirSync)(eventsPath).filter((file) => file.endsWith('.ts'));
async function loadEvents() {
    for (const file of eventFiles) {
        const filePath = node_path_1.default.join(eventsPath, file);
        const event = await Promise.resolve(`${filePath}`).then(s => __importStar(require(s)));
        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args));
        }
        else {
            client.on(event.name, (...args) => event.execute(...args));
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
process.on('warning', (...args) => {
    console.log(...args);
});
client.login(process.env.TOKEN).then(() => {
    console.log(`Lancé sous le bot ${client.user.tag}`);
});
//# sourceMappingURL=index.js.map