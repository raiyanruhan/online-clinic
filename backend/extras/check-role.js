const pool = require('../config/db');

async function checkUserRole() {
    try {
        const res = await pool.query("SELECT email, role FROM users WHERE email = 'raiyaan.ruhan@gmail.com'");
        console.log('User Role:', res.rows[0]);
        process.exit(0);
    } catch (err) {
        console.error('Error:', err.message);
        process.exit(1);
    }
}

checkUserRole();
