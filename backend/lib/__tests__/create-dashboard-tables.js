const pool = require('./config/db');

async function createDashboardTables() {
    try {
        console.log('Creating dashboard tables...');

        // 1. Appointments Table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS appointments (
                appointment_id SERIAL PRIMARY KEY,
                doctor_id INTEGER REFERENCES doctors(doctor_id),
                patient_id INTEGER REFERENCES users(user_id),
                patient_name VARCHAR(255),
                patient_age VARCHAR(50),
                patient_gender VARCHAR(50),
                date DATE NOT NULL,
                time TIME NOT NULL,
                symptoms TEXT,
                status VARCHAR(50) DEFAULT 'upcoming', -- upcoming, completed, cancelled
                meeting_link VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('✅ appointments table created/verified');

        // 2. Prescriptions Table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS prescriptions (
                prescription_id SERIAL PRIMARY KEY,
                appointment_id INTEGER REFERENCES appointments(appointment_id),
                medicines JSONB, -- List of {name, dosage, duration, instruction}
                advice TEXT,
                follow_up_date DATE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('✅ prescriptions table created/verified');

        // 3. Update Doctors Table (Availability)
        await pool.query(`
            ALTER TABLE doctors 
            ADD COLUMN IF NOT EXISTS availability JSONB DEFAULT '{}',
            ADD COLUMN IF NOT EXISTS is_available BOOLEAN DEFAULT true;
        `);
        console.log('✅ doctors table updated with availability columns');

        process.exit(0);
    } catch (err) {
        console.error('Error creating tables:', err.message);
        process.exit(1);
    }
}

createDashboardTables();
