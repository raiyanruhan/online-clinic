const pool = require('../config/db');

async function addServiceCategoryColumn() {
    try {
        await pool.query(`
            ALTER TABLE doctors 
            ADD COLUMN IF NOT EXISTS service_category VARCHAR(255);
        `);
        console.log("Successfully added 'service_category' column to 'doctors' table.");
    } catch (err) {
        console.error("Error adding column:", err.message);
    } finally {
        pool.end();
    }
}

addServiceCategoryColumn();
