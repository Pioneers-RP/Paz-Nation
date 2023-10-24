import { DataSource } from "typeorm"
import { Armee } from "./entities/Armee"
import { Batiments } from "./entities/Batiments"
import { Diplomatie } from "./entities/Diplomatie"
import { Historique } from "./entities/Historique"
import { Notification } from "./entities/Notification"
import { Population } from "./entities/Population"
import { Prix } from "./entities/Prix"
import { Processus } from "./entities/Processus"
import { Qachat } from "./entities/Qachat"
import { Qvente } from "./entities/Qvente"
import { Ressources } from "./entities/Ressources"
import { Territoire } from "./entities/Territoire"
import { Trade } from "./entities/Trade"
import dotenv from 'dotenv';
dotenv.config();

export const AppDataSource = new DataSource({
    type: 'mariadb',
    host: process.env.DATABASE_HOST ?? 'localhost',
    port: process.env.DATABASE_PORT ? parseInt(process.env.DATABASE_PORT, 10) : 3306,
    username: process.env.DATABASE_USER ?? 'root',
    password: process.env.DATABASE_PASSWORD ?? 'password',
    database: process.env.DATABASE_DATABASE ?? 'database',
    entities: [
        // Armee,
        // Batiments,
        // Diplomatie,
        // Historique,
        // Notification,
        // Population,
        // Prix,
        // Processus,
        // Qachat,
        // Qvente,
        // Ressources,
        // Territoire,
        // Trade,
    __dirname + "/entities/*Armee.ts", // Au final essayer de remplacer seulement avec *
    __dirname + "/entities/*Batiments.ts" // Au final essayer de remplacer seulement avec *
    ],
    synchronize: true,
    multipleStatements: true,
    logging: false,
});
