const pool = require('./config/db');

async function testConnection() {
  try {
    const res = await pool.query('SELECT NOW()');
    console.log('✅ Database Connected Successfully:', res.rows[0]);
    
    // Check for users table
    const tableRes = await pool.query("SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'users')");
    if (tableRes.rows[0].exists) {
        console.log('✅ Table "users" exists.');
    } else {
        console.log('❌ WARNING: Table "users" does NOT exist.');
    }
    process.exit(0);
  } catch (err) {
    console.error('❌ Database Connection Failed:', err.message);
    process.exit(1);
  }
}

testConnection();
