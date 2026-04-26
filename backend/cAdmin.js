const pool = require('./config/db');
const bcrypt = require('bcryptjs');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function question(query) {
    return new Promise(resolve => rl.question(query, resolve));
}

async function createAdmin() {
    try {
        console.log('\n=== Create Admin User ===\n');
        
        const name = await question('Enter admin name: ');
        const email = await question('Enter admin email: ');
        const password = await question('Enter admin password: ');
        
        if (!name || !email || !password) {
            console.log('❌ All fields are required!');
            process.exit(1);
        }
        
        // Check if user already exists
        const userCheck = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userCheck.rows.length > 0) {
            console.log('❌ User with this email already exists!');
            console.log('   To make this user an admin, run this SQL:');
            console.log(`   UPDATE users SET role = 'admin' WHERE email = '${email}';`);
            process.exit(1);
        }
        
        // Hash password
        console.log('\nHashing password...');
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        // Insert admin user
        console.log('Creating admin user...');
        const result = await pool.query(
            'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING user_id, name, email, role',
            [name, email, hashedPassword, 'admin']
        );
        
        console.log('\n✅ Admin user created successfully!');
        console.log('\nAdmin Details:');
        console.log('  User ID:', result.rows[0].user_id);
        console.log('  Name:', result.rows[0].name);
        console.log('  Email:', result.rows[0].email);
        console.log('  Role:', result.rows[0].role);
        console.log('\nYou can now login with these credentials.');
        
        process.exit(0);
    } catch (err) {
        console.error('\n❌ Error creating admin:', err.message);
        process.exit(1);
    } finally {
        rl.close();
        pool.end();
    }
}

createAdmin();

