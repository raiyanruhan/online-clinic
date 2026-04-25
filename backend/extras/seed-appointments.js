const pool = require('../config/db');

async function seedAppointments() {
    try {
        console.log('--- Seeding Appointments ---');

        // 1. Get a Doctor
        const doctors = await pool.query('SELECT doctor_id FROM doctors LIMIT 1');
        if (doctors.rows.length === 0) {
            console.log('❌ No doctors found. Please add a doctor first.');
            process.exit(1);
        }
        const doctorId = doctors.rows[0].doctor_id;
        console.log(`Using Doctor ID: ${doctorId}`);

        // 2. Get a Patient (User)
        // Just pick any user who is NOT a doctor if possible, or just any user
        const users = await pool.query("SELECT user_id, name FROM users WHERE role != 'doctor' LIMIT 1");
        let patientId, patientName;
        
        if (users.rows.length === 0) {
            console.log('⚠️ No patient users found. Using doctor as patient for testing.');
             const anyUser = await pool.query("SELECT user_id, name FROM users LIMIT 1");
             patientId = anyUser.rows[0].user_id;
             patientName = anyUser.rows[0].name;
        } else {
            patientId = users.rows[0].user_id;
            patientName = users.rows[0].name;
        }
        console.log(`Using Patient ID: ${patientId} (${patientName})`);

        // 3. Create Appointments
        const today = new Date().toISOString().split('T')[0];
        
        // Appointment 1: Upcoming Today
        await pool.query(`
            INSERT INTO appointments (doctor_id, patient_id, patient_name, patient_age, patient_gender, date, time, symptoms, status)
            VALUES ($1, $2, $3, '25', 'Male', $4, '10:00:00', 'Fever and headache', 'upcoming')
        `, [doctorId, patientId, patientName, today]);

        // Appointment 2: Completed Today
        await pool.query(`
            INSERT INTO appointments (doctor_id, patient_id, patient_name, patient_age, patient_gender, date, time, symptoms, status)
            VALUES ($1, $2, $3, '30', 'Female', $4, '09:00:00', 'Back pain', 'completed')
        `, [doctorId, patientId, "Test Patient 2", today]); // Hardcoding name for diversity

        // Appointment 3: Upcoming Future
        await pool.query(`
            INSERT INTO appointments (doctor_id, patient_id, patient_name, patient_age, patient_gender, date, time, symptoms, status)
            VALUES ($1, $2, $3, '40', 'Male', '2025-12-30', '11:00:00', 'Regular checkup', 'upcoming')
        `, [doctorId, patientId, "Future Patient"]);

        console.log('✅ 3 Sample Appointments Created');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

seedAppointments();
