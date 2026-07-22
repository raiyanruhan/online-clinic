const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// CORS configuration for production
const corsOptions = {
    origin: [
        'https://clinic.roudromoyee.com',
        'http://clinic.roudromoyee.com',
        'https://med.api.hylith.com',
        'http://med.api.hylith.com',
        ...(process.env.NODE_ENV !== 'production' ? ['http://localhost:5173', 'http://localhost:3000'] : [])
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token']
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/auth', require('./routes/authRoutes')); // OAuth routes
app.use('/api/doctors', require('./routes/doctorRoutes'));
app.use('/api/doctor/dashboard', require('./routes/doctorDashboardRoutes'));
app.use('/api/patient/dashboard', require('./routes/patientDashboardRoutes'));
app.use('/api/blogs', require('./routes/blogRoutes'));
app.use('/api/medicines', require('./routes/medicineRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// Debug: Log all registered routes (only in development)
if (process.env.NODE_ENV !== 'production') {
    console.log('\n=== Registered Routes ===');
    console.log('GET  /api/doctors/:doctorId/available-dates');
    console.log('GET  /api/doctors/:doctorId/available-slots');
    console.log('PUT  /api/patient/dashboard/appointments/:id/cancel');
    console.log('GET  /api/admin/stats');
    console.log('GET  /api/admin/appointments');
    console.log('GET  /api/admin/appointments/:id');
    console.log('PUT  /api/admin/appointments/:id');
    console.log('GET  /api/admin/reports/monthly');
    console.log('GET  /api/admin/doctors/workload');
    console.log('========================\n');
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
