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
export default async function migrateActivityLogs() {
	try {
		await client.connect();
		await client.query(`CREATE EXTENSION IF NOT EXISTS "pgcrypto";`);
		await client.query(`
			CREATE TABLE IF NOT EXISTS activity_logs (
				log_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
				user_id UUID NOT NULL,
				activity_type VARCHAR(100) NOT NULL,
				description TEXT,
				created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
				updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
				CONSTRAINT fk_user FOREIGN KEY(user_id) REFERENCES users(user_id)
			);
		`);
		await client.query('CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON activity_logs(user_id)');
		await client.query('CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON activity_logs(created_at)');
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
					SELECT 1 FROM pg_trigger WHERE tgname = 'update_activity_logs_updated_at'
				) THEN
					CREATE TRIGGER update_activity_logs_updated_at
					BEFORE UPDATE ON activity_logs
					FOR EACH ROW
					EXECUTE FUNCTION update_updated_at_column();
				END IF;
			END;
			$$;
		`);
		console.log('Activity logs table migrated successfully with auto-updating updated_at.');
	} catch (err) {
		console.error('Migration failed:', err);
		process.exit(1);
	} finally {
		await client.end();
	}
}
