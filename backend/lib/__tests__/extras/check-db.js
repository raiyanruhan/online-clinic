const pool = require('../config/db');

async function checkSchema() {
    try {
        console.log('--- Tables ---');
        const tables = await pool.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'");
        console.log(tables.rows.map(r => r.table_name));

        console.log('\n--- Appointments Columns ---');
        const appCols = await pool.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'appointments'");
        console.log(appCols.rows);

        console.log('\n--- Prescriptions Columns ---');
        const presCols = await pool.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'prescriptions'");
        console.log(presCols.rows);

        console.log('\n--- Doctor Columns ---');
        const docCols = await pool.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'doctors'");
        console.log(docCols.rows);

    } catch (e) {
        console.error(e);
    } finally {
        process.exit();
    }
}

checkSchema();
