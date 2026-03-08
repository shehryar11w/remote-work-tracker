import { Client } from 'pg';
import dotenv from 'dotenv';
dotenv.config();
const client = new Client({
	host: process.env.DB_HOST,
	port: Number(process.env.DB_PORT),
	database: process.env.DB_NAME,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
});
async function migrateUsers() {
	try {
		await client.connect();
		await client.query(`
			CREATE TABLE IF NOT EXISTS users (
				user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
				name VARCHAR(100) NOT NULL,
				email VARCHAR(100) UNIQUE NOT NULL,
				role_id UUID NOT NULL,
				department_id UUID NOT NULL,
				region CHAR(2) NOT NULL,
				salary NUMERIC(12,2) NOT NULL CHECK (salary >= 0),
				created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
				updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
			);
		`);
		await client.query('CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)');
		await client.query('CREATE INDEX IF NOT EXISTS idx_users_department_id ON users(department_id)');
		await client.query('CREATE INDEX IF NOT EXISTS idx_users_role_id ON users(role_id)');
		await client.query('CREATE INDEX IF NOT EXISTS idx_users_region ON users(region)');
		console.log('Users table migrated successfully.');
	} catch (err) {
		console.error('Migration failed:', err);
		process.exit(1);
	} finally {
		await client.end();
	}
}
migrateUsers();