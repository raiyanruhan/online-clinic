const pool = require('./config/db');
const fs = require('fs');
const path = require('path');

async function updateSchema() {
    try {
        const sql = fs.readFileSync(path.join(__dirname, 'schema_update.sql'), 'utf8');
        await pool.query(sql);
        console.log('✅ Database Schema Updated Successfully');
        process.exit(0);
    } catch (err) {
        console.error('❌ Schema Update Failed:', err.message);
        process.exit(1);
    }
}

updateSchema();
