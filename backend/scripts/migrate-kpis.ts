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
export default async function migrateKpis() {
	try {
		await client.connect();
		await client.query(`CREATE EXTENSION IF NOT EXISTS "pgcrypto";`);
		await client.query(`
			CREATE TABLE IF NOT EXISTS kpis (
				kpi_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
				goal_id UUID NOT NULL,
				title VARCHAR(255) NOT NULL,
				description TEXT,
				target NUMERIC(12,2),
				progress NUMERIC(12,2),
				created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
				updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
				CONSTRAINT fk_goal FOREIGN KEY(goal_id) REFERENCES goals(goal_id)
			);
		`);
		await client.query('CREATE INDEX IF NOT EXISTS idx_kpis_goal_id ON kpis(goal_id)');
		await client.query('CREATE INDEX IF NOT EXISTS idx_kpis_created_at ON kpis(created_at)');
		await client.query(`
			CREATE OR REPLACE FUNCTION update_updated_at_column()
			RETURNS TRIGGER AS $$
			BEGIN
				NEW.updated_at = NOW();
				RETURN NEW;
			END;
			$$ LANGUAGE 'plpgsql';
		`);
		await client.query(`
			DO $$
			BEGIN
				IF NOT EXISTS (
					SELECT 1 FROM pg_trigger WHERE tgname = 'update_kpis_updated_at'
				) THEN
					CREATE TRIGGER update_kpis_updated_at
					BEFORE UPDATE ON kpis
					FOR EACH ROW
					EXECUTE FUNCTION update_updated_at_column();
				END IF;
			END;
			$$;
		`);
		console.log('KPIs table migrated successfully with auto-updating updated_at.');
	} catch (err) {
		console.error('Migration failed:', err);
		process.exit(1);
	} finally {
		await client.end();
	}
}
