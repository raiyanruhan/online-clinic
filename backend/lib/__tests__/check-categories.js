const pool = require('./config/db');

async function checkCategories() {
    try {
        const res = await pool.query('SELECT doctor_id, name, service_category FROM doctors');
        console.log(res.rows);
    } catch (err) {
        console.error(err.message);
    } finally {
        pool.end();
    }
}

checkCategories();
