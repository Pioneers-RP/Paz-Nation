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