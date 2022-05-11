import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import chalk from 'chalk';
dotenv.config();

const mongoClient = new MongoClient(process.env.MONGO_URI);
try {
    await mongoClient.connect();
    console.log(chalk.blue('Conectado ao MongoDB'));
} catch {
    console.log(chalk.red('Erro ao conectar ao MongoDB'));
}

const db = mongoClient.db(process.env.DB_NAME);
export default db;