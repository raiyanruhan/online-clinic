<<<<<<< HEAD
const pool = require('../config/db');
const bcrypt = require('bcryptjs');

// Add a new doctor (with user account)
const addDoctor = async (req, res) => {
    try {
        const { name, specialty, service_category, qualification, experience, designation, institute, image_url, fee, bio, email, password } = req.body;
        
        let userId = null;
        
        // If email and password provided, create user account
        if (email && password) {
            // Check if user already exists
            const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
            if (existingUser.rows.length > 0) {
                return res.status(400).json({ message: 'A user with this email already exists' });
            }
            
            // Hash password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            
            // Create user with role 'doctor'
            const newUser = await pool.query(
                'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING user_id',
                [name, email, hashedPassword, 'doctor']
            );
            userId = newUser.rows[0].user_id;
        }
        
        // Create doctor profile
        const newDoctor = await pool.query(
            'INSERT INTO doctors (name, specialty, service_category, qualification, experience, designation, institute, image_url, fee, bio, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *',
            [name, specialty, service_category, qualification, experience, designation, institute, image_url, fee, bio || '', userId]
        );

        res.json({ ...newDoctor.rows[0], hasAccount: !!userId });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Get all doctors
const getDoctors = async (req, res) => {
    try {
        const allDoctors = await pool.query(`
            SELECT d.*, u.email 
            FROM doctors d 
            LEFT JOIN users u ON d.user_id = u.user_id 
            ORDER BY d.created_at DESC
        `);
        res.json(allDoctors.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Get single doctor by ID
const getDoctor = async (req, res) => {
    try {
        const { id } = req.params;
        const doctor = await pool.query(`
            SELECT d.*, u.email 
            FROM doctors d 
            LEFT JOIN users u ON d.user_id = u.user_id 
            WHERE d.doctor_id = $1
        `, [id]);
        
        if (doctor.rows.length === 0) {
            return res.status(404).json({ message: 'Doctor not found' });
        }
        
        res.json(doctor.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Update doctor
const updateDoctor = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, specialty, service_category, qualification, experience, designation, institute, image_url, fee, bio } = req.body;
        
        const updatedDoctor = await pool.query(
            `UPDATE doctors SET 
                name = COALESCE($1, name),
                specialty = COALESCE($2, specialty),
                service_category = COALESCE($3, service_category),
                qualification = COALESCE($4, qualification),
                experience = COALESCE($5, experience),
                designation = COALESCE($6, designation),
                institute = COALESCE($7, institute),
                image_url = COALESCE($8, image_url),
                fee = COALESCE($9, fee),
                bio = COALESCE($10, bio)
            WHERE doctor_id = $11 RETURNING *`,
            [name, specialty, service_category, qualification, experience, designation, institute, image_url, fee, bio, id]
        );
        
        if (updatedDoctor.rows.length === 0) {
            return res.status(404).json({ message: 'Doctor not found' });
        }
        
        res.json(updatedDoctor.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Delete a doctor
const deleteDoctor = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Get doctor to find user_id
        const doctor = await pool.query('SELECT user_id FROM doctors WHERE doctor_id = $1', [id]);
        
        // Delete doctor
        await pool.query('DELETE FROM doctors WHERE doctor_id = $1', [id]);
        
        // If doctor had a user account, delete it too
        if (doctor.rows[0]?.user_id) {
            await pool.query('DELETE FROM users WHERE user_id = $1', [doctor.rows[0].user_id]);
        }
        
        res.json({ message: 'Doctor deleted successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

module.exports = { addDoctor, getDoctors, getDoctor, updateDoctor, deleteDoctor };
=======
const pool = require('../config/db');
const bcrypt = require('bcryptjs');

// Add a new doctor (with user account)
const addDoctor = async (req, res) => {
    try {
        const { name, specialty, service_category, qualification, experience, designation, institute, image_url, fee, bio, email, password } = req.body;
        
        let userId = null;
        
        // If email and password provided, create user account
        if (email && password) {
            // Check if user already exists
            const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
            if (existingUser.rows.length > 0) {
                return res.status(400).json({ message: 'A user with this email already exists' });
            }
            
            // Hash password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            
            // Create user with role 'doctor'
            const newUser = await pool.query(
                'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING user_id',
                [name, email, hashedPassword, 'doctor']
            );
            userId = newUser.rows[0].user_id;
        }
        
        // Create doctor profile
        const newDoctor = await pool.query(
            'INSERT INTO doctors (name, specialty, service_category, qualification, experience, designation, institute, image_url, fee, bio, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *',
            [name, specialty, service_category, qualification, experience, designation, institute, image_url, fee, bio || '', userId]
        );

        res.json({ ...newDoctor.rows[0], hasAccount: !!userId });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Get all doctors
const getDoctors = async (req, res) => {
    try {
        const allDoctors = await pool.query(`
            SELECT d.*, u.email 
            FROM doctors d 
            LEFT JOIN users u ON d.user_id = u.user_id 
            ORDER BY d.created_at DESC
        `);
        res.json(allDoctors.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Get single doctor by ID
const getDoctor = async (req, res) => {
    try {
        const { id } = req.params;
        const doctor = await pool.query(`
            SELECT d.*, u.email 
            FROM doctors d 
            LEFT JOIN users u ON d.user_id = u.user_id 
            WHERE d.doctor_id = $1
        `, [id]);
        
        if (doctor.rows.length === 0) {
            return res.status(404).json({ message: 'Doctor not found' });
        }
        
        res.json(doctor.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Update doctor
const updateDoctor = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, specialty, service_category, qualification, experience, designation, institute, image_url, fee, bio } = req.body;
        
        const updatedDoctor = await pool.query(
            `UPDATE doctors SET 
                name = COALESCE($1, name),
                specialty = COALESCE($2, specialty),
                service_category = COALESCE($3, service_category),
                qualification = COALESCE($4, qualification),
                experience = COALESCE($5, experience),
                designation = COALESCE($6, designation),
                institute = COALESCE($7, institute),
                image_url = COALESCE($8, image_url),
                fee = COALESCE($9, fee),
                bio = COALESCE($10, bio)
            WHERE doctor_id = $11 RETURNING *`,
            [name, specialty, service_category, qualification, experience, designation, institute, image_url, fee, bio, id]
        );
        
        if (updatedDoctor.rows.length === 0) {
            return res.status(404).json({ message: 'Doctor not found' });
        }
        
        res.json(updatedDoctor.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Delete a doctor
const deleteDoctor = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Get doctor to find user_id
        const doctor = await pool.query('SELECT user_id FROM doctors WHERE doctor_id = $1', [id]);
        
        // Delete doctor
        await pool.query('DELETE FROM doctors WHERE doctor_id = $1', [id]);
        
        // If doctor had a user account, delete it too
        if (doctor.rows[0]?.user_id) {
            await pool.query('DELETE FROM users WHERE user_id = $1', [doctor.rows[0].user_id]);
        }
        
        res.json({ message: 'Doctor deleted successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

module.exports = { addDoctor, getDoctors, getDoctor, updateDoctor, deleteDoctor };
>>>>>>> 58b88cb347b3e55f9f6f8b45a0c9b6aa286b1e2e
