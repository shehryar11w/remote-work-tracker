import { Client } from 'pg';
import dotenv from 'dotenv';
dotenv.config();
export default async function migrateOrganizations() {
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
			CREATE TABLE IF NOT EXISTS organizations (
				organization_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
				name VARCHAR(100) NOT NULL,
				created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
				updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
			);
		`);
		await client.query('CREATE INDEX IF NOT EXISTS idx_organizations_name ON organizations(name)');
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
					SELECT 1 FROM pg_trigger WHERE tgname = 'update_organizations_updated_at'
				) THEN
					CREATE TRIGGER update_organizations_updated_at
					BEFORE UPDATE ON organizations
					FOR EACH ROW
					EXECUTE FUNCTION update_updated_at_column();
				END IF;
			END;
			$$;
		`);
		console.log('Organizations table migrated successfully with auto-updating updated_at.');
	} catch (err) {
		console.error('Migration failed:', err);
		process.exit(1);
	} finally {
		await client.end();
	}
}