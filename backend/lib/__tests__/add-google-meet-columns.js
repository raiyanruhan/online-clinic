const pool = require('./config/db');

async function addGoogleMeetColumns() {
    try {
        console.log('Adding Google Meet columns to appointments table...');

        // Add calendar_event_id column
        await pool.query(`
            ALTER TABLE appointments
            ADD COLUMN IF NOT EXISTS calendar_event_id TEXT
        `);
        console.log('✅ Added calendar_event_id column');

        // Add meeting_provider column
        await pool.query(`
            ALTER TABLE appointments
            ADD COLUMN IF NOT EXISTS meeting_provider VARCHAR(20) DEFAULT 'google_meet'
        `);
        console.log('✅ Added meeting_provider column');

        console.log('✅ Google Meet columns added successfully');
        process.exit(0);
    } catch (err) {
        console.error('Error adding Google Meet columns:', err.message);
        process.exit(1);
    }
}

addGoogleMeetColumns();


