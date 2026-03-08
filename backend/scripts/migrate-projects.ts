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
async function migrateProjects() {
	try {
		await client.connect();
		await client.query(`
			CREATE TABLE IF NOT EXISTS projects (
				project_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
				name VARCHAR(100) NOT NULL,
				description VARCHAR(500),
				manager_id UUID NOT NULL,
				start_date DATE NOT NULL,
				end_date DATE NOT NULL,
				created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
				updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
			);
		`);
		await client.query('CREATE INDEX IF NOT EXISTS idx_projects_manager_id ON projects(manager_id)');
		await client.query('CREATE INDEX IF NOT EXISTS idx_projects_start_date ON projects(start_date)');
		await client.query('CREATE INDEX IF NOT EXISTS idx_projects_end_date ON projects(end_date)');
		console.log('Projects table migrated successfully.');
	} catch (err) {
		console.error('Migration failed:', err);
		process.exit(1);
	} finally {
		await client.end();
	}
}
migrateProjects();
