import { DataSource } from "typeorm"
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
        __dirname + "/entities/*.ts",
    ],
    synchronize: true,
    multipleStatements: true,
    logging: false,
});
