"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const Armee_1 = require("./entities/Armee");
const Batiments_1 = require("./entities/Batiments");
const Diplomatie_1 = require("./entities/Diplomatie");
const Historique_1 = require("./entities/Historique");
const Notification_1 = require("./entities/Notification");
const Population_1 = require("./entities/Population");
const Prix_1 = require("./entities/Prix");
const Processus_1 = require("./entities/Processus");
const Qachat_1 = require("./entities/Qachat");
const Qvente_1 = require("./entities/Qvente");
const Ressources_1 = require("./entities/Ressources");
const Territoire_1 = require("./entities/Territoire");
const Trade_1 = require("./entities/Trade");
exports.AppDataSource = new typeorm_1.DataSource({
    type: "mariadb",
    host: process.env.HOST,
    port: process.env.PORT,
    username: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    synchronize: true,
    logging: true,
    entities: [Armee_1.Armee, Batiments_1.Batiments, Diplomatie_1.Diplomatie, Historique_1.Historique, Notification_1.Notification, Population_1.Population, Prix_1.Prix, Processus_1.Processus, Qachat_1.Qachat, Qvente_1.Qvente, Ressources_1.Ressources, Territoire_1.Territoire, Trade_1.Trade],
    subscribers: [],
    migrations: [],
});
//# sourceMappingURL=data-source.js.map