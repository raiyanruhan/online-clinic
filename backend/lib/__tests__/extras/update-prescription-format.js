const pool = require('../config/db');
require('dotenv').config();

async function updatePrescriptionFormat() {
    try {
        console.log('Updating prescription format...');

        // Add on_examination column if it doesn't exist
        try {
            await pool.query(`
                ALTER TABLE prescriptions 
                ADD COLUMN IF NOT EXISTS on_examination TEXT
            `);
            console.log('✅ Added on_examination column to prescriptions');
        } catch (err) {
            if (err.code !== '42701') { // Column already exists
                throw err;
            }
            console.log('ℹ️  on_examination column already exists');
        }

        // Add investigation column if it doesn't exist
        try {
            await pool.query(`
                ALTER TABLE prescriptions 
                ADD COLUMN IF NOT EXISTS investigation TEXT
            `);
            console.log('✅ Added investigation column to prescriptions');
        } catch (err) {
            if (err.code !== '42701') { // Column already exists
                throw err;
            }
            console.log('ℹ️  investigation column already exists');
        }

        console.log('✅ Prescription format updated successfully!');
        process.exit(0);
    } catch (err) {
        console.error('❌ Error updating prescription format:', err.message);
        process.exit(1);
    }
}

updatePrescriptionFormat();

