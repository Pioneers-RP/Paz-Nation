import { DataSource } from "typeorm"

console.log("Starting1 Datasource1.ts")
console.log("process.env.DATABASE_HOST : " + process.env.DATABASE_HOST)
console.log("process.env.DATABASE_USER : " + process.env.DATABASE_USER + '-orm')
console.log("process.env.DATABASE_PASSWORD : " + process.env.DATABASE_PASSWORD)
console.log("process.env.DATABASE_DATABASE : " + process.env.DATABASE_DATABASE)
console.log("process.env.DATABASE_PORT : " + process.env.DATABASE_PORT)
console.log("process.env.TOKEN : " + process.env.TOKEN)
console.log("Ending1 Datasource1.ts")

export const AppDataSource = new DataSource({
    type: 'mariadb',
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT ? parseInt(process.env.DATABASE_PORT, 10) : 3306,
    username: process.env.DATABASE_USER + '-orm',
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_DATABASE,
    entities: [
        __dirname + "/entities/*.ts",
    ],
    synchronize: true,
    multipleStatements: true,
    logging: false,
});
