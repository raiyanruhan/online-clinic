const pool = require('./config/db');

async function addUserIdColumn() {
    try {
        await pool.query(`
            ALTER TABLE doctors ADD COLUMN IF NOT EXISTS user_id INTEGER REFERENCES users(user_id);
        `);
        console.log('✅ user_id column added to doctors table');
        process.exit(0);
    } catch (err) {
        console.error('Error:', err.message);
        process.exit(1);
    }
}

addUserIdColumn();
