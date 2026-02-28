require('reflect-metadata');
const { DataSource } = require('typeorm');
require('dotenv').config();

// Parse database URL if provided, otherwise use individual config
let dbConfig = {};
if (process.env.DB_URL) {
  dbConfig = {
    type: process.env.DB_TYPE || 'postgres',
    url: process.env.DB_URL,
  };
} else if (process.env.DB_TYPE === 'sqlite') {
  dbConfig = {
    type: 'sqlite',
    database: process.env.DB_NAME || 'taskmanagement.sqlite',
  };
} else {
  dbConfig = {
    type: process.env.DB_TYPE || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 5432,
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'taskmanagement',
  };
}

const AppDataSource = new DataSource({
  ...dbConfig,
  synchronize: true,
  logging: process.env.NODE_ENV === 'development',
  entities: [__dirname + '/../entity/*.js'],
});

AppDataSource.initialize()
  .then(() => {
    console.log('✅ Database connected successfully');
    console.log(`📊 Database: ${dbConfig.database || 'connected'}`);
  })
  .catch((err) => {
    console.error('❌ Database connection failed:', err.message);
    console.error('🔍 Check your .env file configuration:');
    console.error('   - DB_TYPE:', process.env.DB_TYPE);
    console.error('   - DB_URL:', process.env.DB_URL ? 'Set (check password encoding)' : 'Not set');
    console.error('   - Make sure PostgreSQL is running');
    console.error('   - Verify database exists: CREATE DATABASE taskmanagement;');
    process.exit(1);
  });

module.exports = { AppDataSource };
