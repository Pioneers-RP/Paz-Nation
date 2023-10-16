import { DataSource } from "typeorm"
import { Armee } from "./entities/Armee.js"
import { Batiments } from "./entities/Batiments.js"
import { Diplomatie } from "./entities/Diplomatie.js"
import { Historique } from "./entities/Historique.js"
import { Notification } from "./entities/Notification.js"
import { Population } from "./entities/Population.js"
import { Prix } from "./entities/Prix.js"
import { Processus } from "./entities/Processus.js"
import { Qachat } from "./entities/Qachat.js"
import { Qvente } from "./entities/Qvente.js"
import { Ressources } from "./entities/Ressources.js"
import { Territoire } from "./entities/Territoire.js"
import { Trade } from "./entities/Trade.js"

export const AppDataSource = new DataSource({
    type: 'mariadb',
    host: process.env.DATABASE_HOST,
    port:  Number(process.env.DATABASE_PORT),
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_DATABASE,
    entities: [
        Armee,
        Batiments,
        Diplomatie,
        Historique,
        Notification,
        Population,
        Prix,
        Processus,
        Qachat,
        Qvente,
        Ressources,
        Territoire,
        Trade,
    ],
    synchronize: true,
    logging: false,
});