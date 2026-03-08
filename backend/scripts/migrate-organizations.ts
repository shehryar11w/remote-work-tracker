import { withDatabase } from './utils/db';
export default async function migrateOrganizations() {
    await withDatabase(async (client) => {
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
    });
}