const dotenv = require('dotenv');

// Charge les variables d'environnement du fichier .env
dotenv.config();

module.exports = {
  type: 'mysql',
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT || 3306,
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_DATABASE,
  synchronize: true, // À utiliser uniquement en développement
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
