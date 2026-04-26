const pool = require('./config/db');

async function addBioColumn() {
    try {
        await pool.query(`
            ALTER TABLE doctors ADD COLUMN IF NOT EXISTS bio TEXT;
        `);
        console.log('✅ Bio column added to doctors table');
        process.exit(0);
    } catch (err) {
        console.error('Error:', err.message);
        process.exit(1);
    }
}

addBioColumn();
