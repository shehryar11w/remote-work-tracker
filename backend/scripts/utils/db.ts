// db.ts
import { Client } from 'pg';
import dotenv from 'dotenv';
dotenv.config();
export async function withDatabase<T>(callback: (client: Client) => Promise<T>) {
    const client = new Client({
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
    });
    try {
        await client.connect();
        return await callback(client);
    } catch (err) {
        console.error('Database operation failed:', err);
        process.exit(1);
    } finally {
        await client.end();
    }
}