const pool = require('./config/db');

async function createGoogleOAuthTable() {
    try {
        console.log('Creating google_oauth_tokens table...');

        await pool.query(`
            CREATE TABLE IF NOT EXISTS google_oauth_tokens (
                id SERIAL PRIMARY KEY,
                access_token TEXT NOT NULL,
                refresh_token TEXT NOT NULL,
                expires_at TIMESTAMP NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('✅ google_oauth_tokens table created/verified');

        process.exit(0);
    } catch (err) {
        console.error('Error creating google_oauth_tokens table:', err.message);
        process.exit(1);
    }
}

createGoogleOAuthTable();


