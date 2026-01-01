const pool = require('../config/db');

// Middleware to verify admin role
const verifyAdmin = async (req, res, next) => {
    try {
        const userId = req.user.user_id;
        const userRes = await pool.query('SELECT role FROM users WHERE user_id = $1', [userId]);
        
        if (userRes.rows.length === 0 || userRes.rows[0].role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admin role required.' });
        }
        next();
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};

// Get Admin Dashboard Stats
const getAdminStats = async (req, res) => {
    try {
        const today = new Date().toISOString().split('T')[0];
        
        // Calculate week start (Monday)
        const now = new Date();
        const dayOfWeek = now.getDay();
        const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // Adjust to Monday
        const weekStart = new Date(now.setDate(diff));
        weekStart.setHours(0, 0, 0, 0);
        const weekStartStr = weekStart.toISOString().split('T')[0];
        
        // Calculate month start
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const monthStartStr = monthStart.toISOString().split('T')[0];
        
        // Today's appointments
        const todayStats = await pool.query(`
            SELECT 
                COUNT(*) FILTER (WHERE status = 'upcoming') as upcoming,
                COUNT(*) FILTER (WHERE status = 'completed') as completed,
                COUNT(*) FILTER (WHERE status = 'cancelled') as cancelled,
                COUNT(*) as total
            FROM appointments 
            WHERE date::date = CURRENT_DATE
        `);
        
        // This week's appointments
        const weekStats = await pool.query(`
            SELECT 
                COUNT(*) FILTER (WHERE status = 'upcoming') as upcoming,
                COUNT(*) FILTER (WHERE status = 'completed') as completed,
                COUNT(*) FILTER (WHERE status = 'cancelled') as cancelled,
                COUNT(*) as total
            FROM appointments 
            WHERE date::date >= $1 AND date::date <= CURRENT_DATE
        `, [weekStartStr]);
        
        // This month's appointments
        const monthStats = await pool.query(`
            SELECT 
                COUNT(*) FILTER (WHERE status = 'upcoming') as upcoming,
                COUNT(*) FILTER (WHERE status = 'completed') as completed,
                COUNT(*) FILTER (WHERE status = 'cancelled') as cancelled,
                COUNT(*) as total
            FROM appointments 
            WHERE date::date >= $1 AND date::date <= CURRENT_DATE
        `, [monthStartStr]);
        
        // Status breakdown for current month
        const statusBreakdown = await pool.query(`
            SELECT status, COUNT(*) as count
            FROM appointments
            WHERE date::date >= $1 AND date::date <= CURRENT_DATE
            GROUP BY status
        `, [monthStartStr]);
        
        // Doctor workload (this month)
        const doctorWorkload = await pool.query(`
            SELECT 
                d.doctor_id,
                d.name,
                d.specialty,
                COUNT(a.appointment_id) FILTER (WHERE a.date::date = CURRENT_DATE) as today_count,
                COUNT(a.appointment_id) as total_count
            FROM doctors d
            LEFT JOIN appointments a ON d.doctor_id = a.doctor_id 
                AND a.date::date >= $1 AND a.date::date <= CURRENT_DATE
            GROUP BY d.doctor_id, d.name, d.specialty
            ORDER BY total_count DESC
        `, [monthStartStr]);
        
        // Peak booking times (this month)
        const peakTimes = await pool.query(`
            SELECT 
                EXTRACT(HOUR FROM time)::int as hour,
                COUNT(*) as count
            FROM appointments
            WHERE date::date >= $1 AND date::date <= CURRENT_DATE
            GROUP BY EXTRACT(HOUR FROM time)
            ORDER BY hour
        `, [monthStartStr]);
        
        // Calculate average per day for month
        const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
        const daysPassed = now.getDate();
        const avgPerDay = monthStats.rows[0].total > 0 
            ? (parseInt(monthStats.rows[0].total) / daysPassed).toFixed(1)
            : '0';
        
        // Calculate no-show rate for week (cancelled / total)
        const weekTotal = parseInt(weekStats.rows[0].total);
        const weekCancelled = parseInt(weekStats.rows[0].cancelled);
        const noShowRate = weekTotal > 0 
            ? ((weekCancelled / weekTotal) * 100).toFixed(1)
            : '0';
        
        res.json({
            today: {
                total: parseInt(todayStats.rows[0].total),
                upcoming: parseInt(todayStats.rows[0].upcoming),
                completed: parseInt(todayStats.rows[0].completed),
                cancelled: parseInt(todayStats.rows[0].cancelled)
            },
            week: {
                total: parseInt(weekStats.rows[0].total),
                completed: parseInt(weekStats.rows[0].completed),
                cancelled: parseInt(weekStats.rows[0].cancelled),
                noShowRate: parseFloat(noShowRate)
            },
            month: {
                total: parseInt(monthStats.rows[0].total),
                completed: parseInt(monthStats.rows[0].completed),
                cancelled: parseInt(monthStats.rows[0].cancelled),
                avgPerDay: parseFloat(avgPerDay)
            },
            statusBreakdown: statusBreakdown.rows.map(r => ({
                status: r.status,
                count: parseInt(r.count)
            })),
            doctorWorkload: doctorWorkload.rows.map(r => ({
                doctorId: r.doctor_id,
                name: r.name,
                specialty: r.specialty,
                todayCount: parseInt(r.today_count),
                totalCount: parseInt(r.total_count)
            })),
            peakTimes: peakTimes.rows.map(r => ({
                hour: r.hour,
                count: parseInt(r.count)
            }))
        });
    } catch (err) {
        console.error('Error in getAdminStats:', err);
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};

// Get All Appointments (with filters)
const getAllAppointments = async (req, res) => {
    try {
        const { 
            startDate, 
            endDate, 
            doctorId, 
            status, 
            specialty,
            patientName,
            page = 1,
            limit = 50
        } = req.query;
        
        let query = `
            SELECT 
                a.*,
                d.name as doctor_name,
                d.specialty as doctor_specialty,
                d.image_url as doctor_image,
                u.email as patient_email,
                CASE WHEN p.prescription_id IS NOT NULL THEN true ELSE false END as has_prescription
            FROM appointments a
            JOIN doctors d ON a.doctor_id = d.doctor_id
            LEFT JOIN users u ON a.patient_id = u.user_id
            LEFT JOIN prescriptions p ON a.appointment_id = p.appointment_id
            WHERE 1=1
        `;
        
        const params = [];
        let paramCount = 0;
        
        if (startDate) {
            paramCount++;
            query += ` AND a.date::date >= $${paramCount}`;
            params.push(startDate);
        }
        
        if (endDate) {
            paramCount++;
            query += ` AND a.date::date <= $${paramCount}`;
            params.push(endDate);
        }
        
        if (doctorId) {
            paramCount++;
            query += ` AND a.doctor_id = $${paramCount}`;
            params.push(doctorId);
        }
        
        if (status) {
            // Handle multiple statuses for 'upcoming' tab (include both 'upcoming' and 'ready')
            if (status === 'upcoming') {
                query += ` AND a.status IN ('upcoming', 'ready')`;
            } else if (status === 'past') {
                // For past tab, show completed and cancelled
                query += ` AND a.status IN ('completed', 'cancelled')`;
            } else {
                paramCount++;
                query += ` AND a.status = $${paramCount}`;
                params.push(status);
            }
        }
        
        if (specialty) {
            paramCount++;
            query += ` AND d.specialty = $${paramCount}`;
            params.push(specialty);
        }
        
        if (patientName) {
            paramCount++;
            query += ` AND a.patient_name ILIKE $${paramCount}`;
            params.push(`%${patientName}%`);
        }
        
        // Get total count for pagination
        const countQuery = `SELECT COUNT(*) FROM (${query}) as filtered`;
        const countResult = await pool.query(countQuery, params);
        const total = parseInt(countResult.rows[0].count);
        
        // Add ordering and pagination
        query += ` ORDER BY a.date DESC, a.time DESC`;
        
        const offset = (parseInt(page) - 1) * parseInt(limit);
        paramCount++;
        query += ` LIMIT $${paramCount}`;
        params.push(parseInt(limit));
        
        paramCount++;
        query += ` OFFSET $${paramCount}`;
        params.push(offset);
        
        const appointments = await pool.query(query, params);
        
        res.json({
            appointments: appointments.rows,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                totalPages: Math.ceil(total / parseInt(limit))
            }
        });
    } catch (err) {
        console.error('Error in getAllAppointments:', err);
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};

// Get Single Appointment Details
const getAppointmentDetails = async (req, res) => {
    try {
        const { id } = req.params;
        
        const appointment = await pool.query(`
            SELECT 
                a.*,
                d.name as doctor_name,
                d.specialty as doctor_specialty,
                d.qualification as doctor_qualification,
                d.experience as doctor_experience,
                d.designation as doctor_designation,
                d.institute as doctor_institute,
                d.bio as doctor_bio,
                d.image_url as doctor_image_url,
                u.email as patient_email
            FROM appointments a
            JOIN doctors d ON a.doctor_id = d.doctor_id
            LEFT JOIN users u ON a.patient_id = u.user_id
            WHERE a.appointment_id = $1
        `, [id]);
        
        if (appointment.rows.length === 0) {
            return res.status(404).json({ message: 'Appointment not found' });
        }
        
        // Get prescription if exists
        const prescription = await pool.query(
            'SELECT * FROM prescriptions WHERE appointment_id = $1',
            [id]
        );
        
        res.json({
            ...appointment.rows[0],
            prescription: prescription.rows[0] || null
        });
    } catch (err) {
        console.error('Error in getAppointmentDetails:', err);
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};

// Update Appointment
const updateAppointment = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, meeting_link, notes } = req.body;
        
        // Verify appointment exists
        const appointmentCheck = await pool.query(
            'SELECT appointment_id FROM appointments WHERE appointment_id = $1',
            [id]
        );
        
        if (appointmentCheck.rows.length === 0) {
            return res.status(404).json({ message: 'Appointment not found' });
        }
        
        // Build update query dynamically
        const updates = [];
        const params = [];
        let paramCount = 0;
        
        if (status !== undefined) {
            paramCount++;
            updates.push(`status = $${paramCount}`);
            params.push(status);
        }
        
        if (meeting_link !== undefined) {
            paramCount++;
            updates.push(`meeting_link = $${paramCount}`);
            params.push(meeting_link);
        }
        
        if (updates.length === 0) {
            return res.status(400).json({ message: 'No fields to update' });
        }
        
        paramCount++;
        params.push(id);
        
        const query = `
            UPDATE appointments 
            SET ${updates.join(', ')}
            WHERE appointment_id = $${paramCount}
            RETURNING *
        `;
        
        const updated = await pool.query(query, params);
        
        res.json(updated.rows[0]);
    } catch (err) {
        console.error('Error in updateAppointment:', err);
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};

// Get Monthly Report Data
const getMonthlyReport = async (req, res) => {
    try {
        const { month, year } = req.query;
        
        if (!month || !year) {
            return res.status(400).json({ message: 'Month and year are required' });
        }
        
        const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
        const endDate = new Date(parseInt(year), parseInt(month), 0).toISOString().split('T')[0];
        
        // Summary statistics
        const summary = await pool.query(`
            SELECT 
                COUNT(*) as total,
                COUNT(*) FILTER (WHERE status = 'completed') as completed,
                COUNT(*) FILTER (WHERE status = 'cancelled') as cancelled,
                COUNT(*) FILTER (WHERE status = 'upcoming') as upcoming
            FROM appointments
            WHERE date::date >= $1 AND date::date <= $2
        `, [startDate, endDate]);
        
        // Appointments by doctor
        const byDoctor = await pool.query(`
            SELECT 
                d.name as doctor_name,
                d.specialty,
                COUNT(a.appointment_id) as total,
                COUNT(*) FILTER (WHERE a.status = 'completed') as completed,
                COUNT(*) FILTER (WHERE a.status = 'cancelled') as cancelled
            FROM doctors d
            LEFT JOIN appointments a ON d.doctor_id = a.doctor_id 
                AND a.date::date >= $1 AND a.date::date <= $2
            GROUP BY d.doctor_id, d.name, d.specialty
            HAVING COUNT(a.appointment_id) > 0
            ORDER BY total DESC
        `, [startDate, endDate]);
        
        // Appointments by status
        const byStatus = await pool.query(`
            SELECT status, COUNT(*) as count
            FROM appointments
            WHERE date::date >= $1 AND date::date <= $2
            GROUP BY status
            ORDER BY count DESC
        `, [startDate, endDate]);
        
        // Peak booking times
        const peakTimes = await pool.query(`
            SELECT 
                EXTRACT(HOUR FROM time)::int as hour,
                COUNT(*) as count
            FROM appointments
            WHERE date::date >= $1 AND date::date <= $2
            GROUP BY EXTRACT(HOUR FROM time)
            ORDER BY hour
        `, [startDate, endDate]);
        
        // Daily trends
        const dailyTrends = await pool.query(`
            SELECT 
                date::date as date,
                COUNT(*) as count
            FROM appointments
            WHERE date::date >= $1 AND date::date <= $2
            GROUP BY date::date
            ORDER BY date
        `, [startDate, endDate]);
        
        // All appointments in month
        const allAppointments = await pool.query(`
            SELECT 
                a.*,
                d.name as doctor_name,
                d.specialty as doctor_specialty,
                u.email as patient_email
            FROM appointments a
            JOIN doctors d ON a.doctor_id = d.doctor_id
            LEFT JOIN users u ON a.patient_id = u.user_id
            WHERE a.date::date >= $1 AND a.date::date <= $2
            ORDER BY a.date ASC, a.time ASC
        `, [startDate, endDate]);
        
        const total = parseInt(summary.rows[0].total);
        const completed = parseInt(summary.rows[0].completed);
        const completionRate = total > 0 ? ((completed / total) * 100).toFixed(1) : '0';
        
        res.json({
            period: {
                month: parseInt(month),
                year: parseInt(year),
                startDate,
                endDate
            },
            summary: {
                total,
                completed: parseInt(summary.rows[0].completed),
                cancelled: parseInt(summary.rows[0].cancelled),
                upcoming: parseInt(summary.rows[0].upcoming),
                completionRate: parseFloat(completionRate)
            },
            byDoctor: byDoctor.rows.map(r => ({
                doctorName: r.doctor_name,
                specialty: r.specialty,
                total: parseInt(r.total),
                completed: parseInt(r.completed),
                cancelled: parseInt(r.cancelled)
            })),
            byStatus: byStatus.rows.map(r => ({
                status: r.status,
                count: parseInt(r.count)
            })),
            peakTimes: peakTimes.rows.map(r => ({
                hour: r.hour,
                count: parseInt(r.count)
            })),
            dailyTrends: dailyTrends.rows.map(r => ({
                date: r.date,
                count: parseInt(r.count)
            })),
            appointments: allAppointments.rows
        });
    } catch (err) {
        console.error('Error in getMonthlyReport:', err);
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};

// Get Doctor Workload Stats
const getDoctorWorkload = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        
        let dateFilter = '';
        const params = [];
        
        if (startDate && endDate) {
            dateFilter = 'AND a.date::date >= $1 AND a.date::date <= $2';
            params.push(startDate, endDate);
        } else if (startDate) {
            dateFilter = 'AND a.date::date >= $1';
            params.push(startDate);
        } else if (endDate) {
            dateFilter = 'AND a.date::date <= $1';
            params.push(endDate);
        }
        
        const workload = await pool.query(`
            SELECT 
                d.doctor_id,
                d.name,
                d.specialty,
                COUNT(a.appointment_id) as total_appointments,
                COUNT(*) FILTER (WHERE a.status = 'completed') as completed,
                COUNT(*) FILTER (WHERE a.status = 'cancelled') as cancelled,
                COUNT(*) FILTER (WHERE a.date::date = CURRENT_DATE) as today_count
            FROM doctors d
            LEFT JOIN appointments a ON d.doctor_id = a.doctor_id ${dateFilter}
            GROUP BY d.doctor_id, d.name, d.specialty
            ORDER BY total_appointments DESC
        `, params);
        
        res.json(workload.rows.map(r => ({
            doctorId: r.doctor_id,
            name: r.name,
            specialty: r.specialty,
            totalAppointments: parseInt(r.total_appointments),
            completed: parseInt(r.completed),
            cancelled: parseInt(r.cancelled),
            todayCount: parseInt(r.today_count)
        })));
    } catch (err) {
        console.error('Error in getDoctorWorkload:', err);
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};

module.exports = {
    verifyAdmin,
    getAdminStats,
    getAllAppointments,
    getAppointmentDetails,
    updateAppointment,
    getMonthlyReport,
    getDoctorWorkload
};

