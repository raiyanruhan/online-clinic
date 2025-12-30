const pool = require('./config/db');

async function seedCategory() {
    try {
        const res = await pool.query(
            "UPDATE doctors SET service_category = 'শিশুরোগ' WHERE name LIKE '%রাফা%' RETURNING *"
        );
        console.log('Updated doctor:', res.rows[0]);
    } catch (err) {
        console.error(err.message);
    } finally {
        pool.end();
    }
}

seedCategory();
