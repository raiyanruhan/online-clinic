const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user exists
        const userCheck = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userCheck.rows.length > 0) {
            return res.status(401).json({ message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const bcryptPassword = await bcrypt.hash(password, salt);

        // Insert user
        const newUser = await pool.query(
            'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *',
            [name, email, bcryptPassword]
        );

        // Generate Token
        const token = jwt.sign({ user_id: newUser.rows[0].user_id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ token, user: { user_id: newUser.rows[0].user_id, name: newUser.rows[0].name, email: newUser.rows[0].email } });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (user.rows.length === 0) {
            return res.status(401).json({ message: 'Invalid Credential' });
        }

        // Check password
        const validPassword = await bcrypt.compare(password, user.rows[0].password);
        if (!validPassword) {
            return res.status(401).json({ message: 'Invalid Credential' });
        }

        // Generate Token
        const token = jwt.sign({ user_id: user.rows[0].user_id, role: user.rows[0].role }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ token, user: { user_id: user.rows[0].user_id, name: user.rows[0].name, email: user.rows[0].email, role: user.rows[0].role } });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

module.exports = { register, login };
