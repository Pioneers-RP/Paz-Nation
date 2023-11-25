module.exports = {
  type: 'mariadb',
  host: process.env.DATABASE_HOST ?? 'localhost',
  port: process.env.DATABASE_PORT ? parseInt(process.env.DATABASE_PORT, 10) : 3306,
  username: process.env.DATABASE_USER ?? 'root',
  password: process.env.DATABASE_PASSWORD ?? 'password',
  database: process.env.DATABASE_DATABASE ?? 'database',
  synchronize: process.env.NODE_ENV === 'development',
  logging: false,
  entities: [
    process.env.NODE_ENV === 'development' ? 'src/**/*.entity.ts' : 'dist/**/*.entity.js'
  ],
  migrations: [
    process.env.NODE_ENV === 'development' ? 'src/migration/**/*.ts' : 'dist/migration/**/*.js'
  ],
  subscribers: [
    process.env.NODE_ENV === 'development' ? 'src/subscriber/**/*.ts' : 'dist/subscriber/**/*.js'
  ],
  cli: {
    entitiesDir: process.env.NODE_ENV === 'development' ? 'src/entity' : 'dist/entity',
    migrationsDir: process.env.NODE_ENV === 'development' ? 'src/migration' : 'dist/migration',
    subscribersDir: process.env.NODE_ENV === 'development' ? 'src/subscriber' : 'dist/subscriber'
  }
};
