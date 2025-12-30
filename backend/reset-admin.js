const pool = require('./config/db');
const bcrypt = require('bcryptjs');

async function resetAdminPassword() {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('admin123', salt);
        
        const res = await pool.query(
            "UPDATE users SET password = $1 WHERE email = 'raiyaan.ruhan@gmail.com' RETURNING user_id, name, email, role",
            [hashedPassword]
        );
        
        if (res.rows.length > 0) {
            console.log('✅ Admin password reset successfully!');
            console.log('User:', res.rows[0]);
            console.log('New password: admin123');
        } else {
            console.log('❌ Admin user not found. Creating one...');
            const newUser = await pool.query(
                "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *",
                ['Raiyaan Ruhan', 'raiyaan.ruhan@gmail.com', hashedPassword, 'admin']
            );
            console.log('✅ Admin user created:', newUser.rows[0]);
        }
        process.exit(0);
    } catch (err) {
        console.error('Error:', err.message);
        process.exit(1);
    }
}

resetAdminPassword();
