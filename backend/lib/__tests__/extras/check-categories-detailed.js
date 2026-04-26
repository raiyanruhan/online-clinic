const pool = require('../config/db');

async function checkCategoriesDetailed() {
    try {
        const res = await pool.query('SELECT doctor_id, name, service_category FROM doctors');
        console.log(JSON.stringify(res.rows, null, 2));
    } catch (err) {
        console.error(err.message);
    } finally {
        pool.end();
    }
}

checkCategoriesDetailed();
