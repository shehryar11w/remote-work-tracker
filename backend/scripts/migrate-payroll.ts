import { Client } from 'pg';
import dotenv from 'dotenv';
dotenv.config();
export default async function migratePayroll() {
	const client = new Client({
		host: process.env.DB_HOST,
		port: Number(process.env.DB_PORT),
		database: process.env.DB_NAME,
		user: process.env.DB_USER,
		password: process.env.DB_PASSWORD,
	});
	try {
		await client.connect();
		await client.query(`CREATE EXTENSION IF NOT EXISTS "pgcrypto";`);
		await client.query(`
			CREATE TABLE IF NOT EXISTS payroll (
				payroll_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
				user_id UUID NOT NULL,
				period_start DATE NOT NULL,
				period_end DATE NOT NULL,
				amount NUMERIC(12,2) NOT NULL CHECK (amount >= 0),
				created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
				updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
				CONSTRAINT fk_user FOREIGN KEY(user_id) REFERENCES users(user_id)
			);
		`);
		await client.query('CREATE INDEX IF NOT EXISTS idx_payroll_user_id ON payroll(user_id)');
		await client.query('CREATE INDEX IF NOT EXISTS idx_payroll_created_at ON payroll(created_at)');
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
					SELECT 1 FROM pg_trigger WHERE tgname = 'update_payroll_updated_at'
				) THEN
					CREATE TRIGGER update_payroll_updated_at
					BEFORE UPDATE ON payroll
					FOR EACH ROW
					EXECUTE FUNCTION update_updated_at_column();
				END IF;
			END;
			$$;
		`);
		console.log('Payroll table migrated successfully with auto-updating updated_at.');
	} catch (err) {
		console.error('Migration failed:', err);
		process.exit(1);
	} finally {
		await client.end();
	}
}
