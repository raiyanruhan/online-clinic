const pool = require('../config/db');

async function checkDoctors() {
    try {
        const res = await pool.query('SELECT name, specialty, service_category FROM doctors');
        console.table(res.rows);
    } catch (err) {
        console.error(err.message);
    } finally {
        pool.end();
    }
}

checkDoctors();
