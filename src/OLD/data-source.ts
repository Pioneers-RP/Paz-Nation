import { DataSource } from "typeorm"
import dotenv from 'dotenv';
dotenv.config();

export const AppDataSource = new DataSource({
    // type: 'mariadb',
    type: "sqlite",
    // host: process.env.DATABASE_HOST ?? 'localhost',
    // port: process.env.DATABASE_PORT ? parseInt(process.env.DATABASE_PORT, 10) : 3306,
    // username: process.env.DATABASE_USER ?? 'root',
    // password: process.env.DATABASE_PASSWORD ?? 'password',
    // database: process.env.DATABASE_DATABASE ?? 'database',
    database: __dirname+`/data/paznation.sqlite`,
    entities: [
        __dirname + "/entities/*Armee.ts", // Au final essayer de remplacer seulement avec *
        __dirname + "/entities/*Batiments.ts",
        __dirname + "/entities/*Diplomatie.ts",
        __dirname + "/entities/*Historique.ts",
        __dirname + "/entities/*Pays.ts",
        __dirname + "/entities/*Population.ts",
        __dirname + "/entities/*Processus.ts",
        __dirname + "/entities/*Qachat.ts",
        __dirname + "/entities/*Qvente.ts",
        __dirname + "/entities/*Ressources.ts",
        __dirname + "/entities/*Territoire.ts",
        __dirname + "/entities/*Trade.ts"
    ],
    synchronize: true,
    // multipleStatements: true,
    logging: false,
});
