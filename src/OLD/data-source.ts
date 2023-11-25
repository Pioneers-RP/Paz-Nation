import { DataSource } from "typeorm"

console.trace("Starting1 Datasource1.ts")
console.trace("process.env.DATABASE_HOST : " + process.env.DATABASE_HOST)
console.trace("process.env.DATABASE_USER : " + process.env.DATABASE_USER)
console.trace("process.env.DATABASE_PASSWORD : " + process.env.DATABASE_PASSWORD)
console.trace("process.env.DATABASE_DATABASE : " + process.env.DATABASE_DATABASE)
console.trace("process.env.DATABASE_PORT : " + process.env.DATABASE_PORT)
console.trace("process.env.TOKEN : " + process.env.TOKEN)
console.trace("Ending1 Datasource1.ts")

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
