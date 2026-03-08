import { withDatabase } from './utils/db';
export default async function migrateRefreshTokens() {
    await withDatabase(async (client) => {
        await client.query(`CREATE EXTENSION IF NOT EXISTS "pgcrypto";`);
        await client.query(`
            CREATE TABLE IF NOT EXISTS refresh_tokens (
                token_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                user_id UUID NOT NULL,
                token TEXT NOT NULL,
                expires_at TIMESTAMPTZ NOT NULL,
                created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                CONSTRAINT fk_user FOREIGN KEY(user_id) REFERENCES users(user_id)
            );
        `);
        await client.query('CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user_id ON refresh_tokens(user_id)');
        await client.query('CREATE INDEX IF NOT EXISTS idx_refresh_tokens_expires_at ON refresh_tokens(expires_at)');
        await client.query('CREATE INDEX IF NOT EXISTS idx_refresh_tokens_created_at ON refresh_tokens(created_at)');
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
                    SELECT 1 FROM pg_trigger WHERE tgname = 'update_refresh_tokens_updated_at'
                ) THEN
                    CREATE TRIGGER update_refresh_tokens_updated_at
                    BEFORE UPDATE ON refresh_tokens
                    FOR EACH ROW
                    EXECUTE FUNCTION update_updated_at_column();
                END IF;
            END;
            $$;
        `);
        console.log('Refresh tokens table migrated successfully with auto-updating updated_at.');
    });
}