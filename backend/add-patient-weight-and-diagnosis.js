const pool = require('./config/db');

async function addPatientWeightAndDiagnosis() {
    try {
        console.log('Adding patient_weight to appointments and diagnosis to prescriptions...');

        // Add patient_weight column to appointments
        await pool.query(`
            ALTER TABLE appointments 
            ADD COLUMN IF NOT EXISTS patient_weight VARCHAR(50);
        `);
        console.log('✅ Added patient_weight column to appointments');

        // Add diagnosis column to prescriptions
        await pool.query(`
            ALTER TABLE prescriptions 
            ADD COLUMN IF NOT EXISTS diagnosis TEXT;
        `);
        console.log('✅ Added diagnosis column to prescriptions');

        process.exit(0);
    } catch (err) {
        console.error('Error adding columns:', err.message);
        process.exit(1);
    }
}

addPatientWeightAndDiagnosis();



