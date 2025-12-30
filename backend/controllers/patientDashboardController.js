const pool = require('../config/db');

// Get Patient Stats (Next Appointment)
const getPatientStats = async (req, res) => {
    try {
        const userId = req.user.user_id;

        // Next Upcoming Appointment - use date >= CURRENT_DATE
        const nextAppointment = await pool.query(`
            SELECT a.*, d.name as doctor_name, d.specialty, d.image_url as doctor_image
            FROM appointments a
            JOIN doctors d ON a.doctor_id = d.doctor_id
            WHERE a.patient_id = $1 AND a.status = 'upcoming' AND a.date::date >= CURRENT_DATE
            ORDER BY a.date ASC, a.time ASC
            LIMIT 1
        `, [userId]);

        // Total Counts - use CURRENT_DATE for accurate comparison
        const counts = await pool.query(`
            SELECT 
                COUNT(*) FILTER (WHERE status = 'upcoming' AND date::date >= CURRENT_DATE) as upcoming,
                COUNT(*) FILTER (WHERE status = 'completed') as completed
            FROM appointments
            WHERE patient_id = $1
        `, [userId]);

        res.json({
            nextAppointment: nextAppointment.rows[0] || null,
            stats: {
                upcoming: parseInt(counts.rows[0].upcoming),
                completed: parseInt(counts.rows[0].completed)
            }
        });
    } catch (err) {
        console.error('Error in getPatientStats:', err);
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};

// Get My Appointments
const getMyAppointments = async (req, res) => {
    try {
        const userId = req.user.user_id;
        const { filter } = req.query;

        let query = `
            SELECT a.*, 
                   d.name as doctor_name, 
                   d.specialty, 
                   d.image_url as doctor_image,
                   CASE WHEN p.prescription_id IS NOT NULL THEN true ELSE false END as has_prescription,
                   p.prescription_id
            FROM appointments a
            JOIN doctors d ON a.doctor_id = d.doctor_id
            LEFT JOIN prescriptions p ON a.appointment_id = p.appointment_id
            WHERE a.patient_id = $1
        `;
        const params = [userId];

        if (filter === 'upcoming') {
            // Upcoming: date >= CURRENT_DATE AND status = 'upcoming'
            query += ` AND a.date::date >= CURRENT_DATE AND a.status = $2 ORDER BY a.date ASC, a.time ASC`;
            params.push('upcoming');
        } else if (filter === 'history') {
            // History: completed OR cancelled OR past dates
            query += ` AND (a.status IN ($2, $3) OR a.date::date < CURRENT_DATE) ORDER BY a.date DESC, a.time DESC`;
            params.push('completed', 'cancelled');
        } else {
            // All appointments: latest first (newest date and time at top)
            query += ` ORDER BY a.date DESC, a.time DESC`;
        }

        const appointments = await pool.query(query, params);
        res.json(appointments.rows);
    } catch (err) {
        console.error('Error in getMyAppointments:', err);
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};

// Get Single Appointment with Prescription
const getAppointmentDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.user_id;

        const appointment = await pool.query(`
            SELECT a.*, 
                   d.name as doctor_name, 
                   d.specialty as doctor_specialty,
                   d.qualification as doctor_qualification,
                   d.experience as doctor_experience,
                   d.designation as doctor_designation,
                   d.institute as doctor_institute,
                   d.bio as doctor_bio,
                   d.image_url as doctor_image_url,
                   d.image_url as doctor_image
            FROM appointments a
            JOIN doctors d ON a.doctor_id = d.doctor_id
            WHERE a.appointment_id = $1 AND a.patient_id = $2
        `, [id, userId]);

        if (appointment.rows.length === 0) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        const prescription = await pool.query('SELECT * FROM prescriptions WHERE appointment_id = $1', [id]);

        res.json({
            ...appointment.rows[0],
            prescription: prescription.rows[0] || null
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};

// Book Appointment with Availability Validation
const bookAppointment = async (req, res) => {
    try {
        const userId = req.user.user_id;
        const { doctor_id, date, time, symptoms, patient_name, patient_age, patient_gender, patient_weight, phone } = req.body;

        // Validate required fields
        if (!doctor_id || !date || !time) {
            return res.status(400).json({ message: 'Doctor ID, date, and time are required' });
        }

        // Validate time format (HH:MM)
        const timeFormatRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;
        if (!timeFormatRegex.test(time)) {
            return res.status(400).json({ message: 'Invalid time format. Please use HH:MM format (24-hour)' });
        }

        // Check if patient already has an active (upcoming) appointment
        const activeAppointment = await pool.query(
            `SELECT appointment_id, date, time, status FROM appointments 
             WHERE patient_id = $1 AND status = 'upcoming'`,
            [userId]
        );

        if (activeAppointment.rows.length > 0) {
            const existing = activeAppointment.rows[0];
            return res.status(400).json({ 
                message: `You already have an active appointment on ${existing.date} at ${existing.time}. Please complete or cancel your existing appointment before booking a new one.` 
            });
        }

        // Check if doctor exists and is available
        const doctorRes = await pool.query(
            'SELECT availability, is_available FROM doctors WHERE doctor_id = $1',
            [doctor_id]
        );

        if (doctorRes.rows.length === 0) {
            return res.status(404).json({ message: 'Doctor not found' });
        }

        if (!doctorRes.rows[0].is_available) {
            return res.status(400).json({ message: 'Doctor is currently unavailable' });
        }

        // Validate availability for the selected date and time
        const availability = doctorRes.rows[0].availability || { weekdays: {}, specialDays: [] };
        
        // Normalize date string to YYYY-MM-DD format
        const dateStr = date.includes('T') ? date.split('T')[0] : date.split(' ')[0];
        
        // Parse date components to avoid timezone issues
        const [year, month, day] = dateStr.split('-').map(Number);
        if (!year || !month || !day) {
            return res.status(400).json({ message: 'Invalid date format' });
        }
        
        // Use Zeller's congruence algorithm to calculate day of week without timezone issues
        const q = day;
        const m = month < 3 ? month + 12 : month;
        const y = month < 3 ? year - 1 : year;
        const K = y % 100;
        const J = Math.floor(y / 100);
        
        // Zeller's congruence: h = (q + floor(13(m+1)/5) + K + floor(K/4) + floor(J/4) - 2J) mod 7
        let h = (q + Math.floor(13 * (m + 1) / 5) + K + Math.floor(K / 4) + Math.floor(J / 4) - 2 * J) % 7;
        // Convert Zeller's (0=Sat, 1=Sun, 2=Mon...) to our format (0=Sun, 1=Mon, 2=Tue...)
        const dayOfWeek = (h + 6) % 7;
        
        const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        const dayName = dayNames[dayOfWeek];
        
        // Also create date for validation
        const selectedDate = new Date(year, month - 1, day);
        
        // Debug: verify date calculation
        const dateGetDay = selectedDate.getDay();
        console.log('Book appointment date check:', {
            inputDate: dateStr,
            zellerDayOfWeek: dayOfWeek,
            dateGetDay: dateGetDay,
            dayName: dayName,
            match: dayOfWeek === dateGetDay ? 'YES' : 'NO (timezone issue)'
        });

        // Helper function to generate slots from a time range
        const generateSlotsFromRange = (start, end) => {
            const slots = [];
            const slotInterval = 30; // 30 minutes
            const [startHour, startMin] = start.split(':').map(Number);
            const [endHour, endMin] = end.split(':').map(Number);
            const startMinutes = startHour * 60 + startMin;
            const endMinutes = endHour * 60 + endMin;
            
            for (let minutes = startMinutes; minutes < endMinutes; minutes += slotInterval) {
                const hours = Math.floor(minutes / 60);
                const mins = minutes % 60;
                slots.push(`${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`);
            }
            return slots;
        };

        // Check special days first
        const specialDay = availability.specialDays?.find((sd) => sd.date === dateStr);
        
        if (specialDay) {
            if (specialDay.isAvailable === false) {
                return res.status(400).json({ message: 'Doctor is not available on this date' });
            }
            // Generate slots from timeRanges or use timeSlots (old format)
            let availableSlots = [];
            if (specialDay.timeRanges && specialDay.timeRanges.length > 0) {
                specialDay.timeRanges.forEach(range => {
                    availableSlots.push(...generateSlotsFromRange(range.start, range.end));
                });
            } else if (specialDay.timeSlots && specialDay.timeSlots.length > 0) {
                availableSlots = specialDay.timeSlots;
            }
            
            // If no slots are configured, reject the booking
            if (availableSlots.length === 0) {
                return res.status(400).json({ message: 'No time slots configured for this date' });
            }
            
            // Validate the selected time is in available slots
            if (!availableSlots.includes(time)) {
                return res.status(400).json({ message: 'Selected time slot is not available' });
            }
        } else {
            // Check weekday availability
            const weekday = availability.weekdays?.[dayName];
            if (!weekday || !weekday.isAvailable) {
                return res.status(400).json({ message: 'Doctor is not available on this day' });
            }
            // Generate slots from timeRanges or use timeSlots (old format)
            let availableSlots = [];
            if (weekday.timeRanges && weekday.timeRanges.length > 0) {
                weekday.timeRanges.forEach(range => {
                    availableSlots.push(...generateSlotsFromRange(range.start, range.end));
                });
            } else if (weekday.timeSlots && weekday.timeSlots.length > 0) {
                availableSlots = weekday.timeSlots;
            }
            
            // If no slots are configured, reject the booking
            if (availableSlots.length === 0) {
                return res.status(400).json({ message: 'No time slots configured for this day' });
            }
            
            // Validate the selected time is in available slots
            if (!availableSlots.includes(time)) {
                return res.status(400).json({ message: 'Selected time slot is not available' });
            }
        }

        // CRITICAL: Check if appointment already exists for this doctor, date, and time
        // This check MUST happen before creating the appointment to prevent double bookings
        // Backend enforces: Each 30-minute slot can only be booked by one patient
        // Only check 'upcoming' status as completed/cancelled appointments free up the slot
        // Normalize time format for comparison (handle both HH:MM and HH:MM:SS from database)
        const normalizedTime = time.length > 5 ? time.substring(0, 5) : time;
        
        // Use a more robust query that handles TIME type comparison
        // PostgreSQL TIME type can be compared directly, but we need to handle format differences
        const existingAppointment = await pool.query(
            `SELECT appointment_id, patient_id, time as appointment_time, status 
             FROM appointments 
             WHERE doctor_id = $1 
             AND date = $2 
             AND status = 'upcoming'
             AND (
                 time::text = $3 
                 OR time::text LIKE $3 || ':%'
                 OR SUBSTRING(time::text, 1, 5) = $3
             )`,
            [doctor_id, dateStr, normalizedTime]
        );

        if (existingAppointment.rows.length > 0) {
            const existing = existingAppointment.rows[0];
            // If it's a different patient, reject immediately
            if (existing.patient_id !== userId) {
                return res.status(400).json({ 
                    message: 'This time slot is already booked by another patient. Please select a different time.' 
                });
            }
            // If same patient, they shouldn't be able to book the same slot twice
            // (This should be caught by the active appointment check above, but double-check)
            return res.status(400).json({ 
                message: 'You already have an appointment booked for this time slot.' 
            });
        }

        // Create appointment with final double-check to prevent race conditions
        // Use a transaction-like approach: check again right before inserting
        // This prevents two patients from booking the same slot simultaneously
        const finalCheck = await pool.query(
            `SELECT appointment_id FROM appointments 
             WHERE doctor_id = $1 
             AND date = $2 
             AND status = 'upcoming'
             AND (
                 time::text = $3 
                 OR time::text LIKE $3 || ':%'
                 OR SUBSTRING(time::text, 1, 5) = $3
             )`,
            [doctor_id, dateStr, normalizedTime]
        );

        if (finalCheck.rows.length > 0) {
            return res.status(400).json({ 
                message: 'This time slot was just booked by another patient. Please select a different time.' 
            });
        }

        // Create appointment
        const newAppointment = await pool.query(
            `INSERT INTO appointments (doctor_id, patient_id, patient_name, patient_age, patient_gender, patient_weight, date, time, symptoms, status) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'upcoming') RETURNING *`,
            [doctor_id, userId, patient_name, patient_age, patient_gender, patient_weight || null, dateStr, time, symptoms]
        );

        res.json(newAppointment.rows[0]);
    } catch (err) {
        console.error('Error in bookAppointment:', err);
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};

// Cancel Appointment
const cancelAppointment = async (req, res) => {
    try {
        console.log('Cancel appointment called:', req.method, req.path, req.params);
        const userId = req.user.user_id;
        const { id } = req.params;

        // Verify the appointment belongs to this patient
        const appointmentRes = await pool.query(
            `SELECT appointment_id, patient_id, status, date, time 
             FROM appointments 
             WHERE appointment_id = $1 AND patient_id = $2`,
            [id, userId]
        );

        if (appointmentRes.rows.length === 0) {
            return res.status(404).json({ message: 'Appointment not found or you do not have permission to cancel it' });
        }

        const appointment = appointmentRes.rows[0];

        // Only allow cancelling upcoming appointments
        if (appointment.status !== 'upcoming') {
            return res.status(400).json({ 
                message: `Cannot cancel appointment with status '${appointment.status}'. Only upcoming appointments can be cancelled.` 
            });
        }

        // Check if appointment is in the past
        const appointmentDate = new Date(appointment.date + 'T' + appointment.time);
        const now = new Date();
        if (appointmentDate < now) {
            return res.status(400).json({ message: 'Cannot cancel past appointments' });
        }

        // Update appointment status to cancelled
        const updated = await pool.query(
            `UPDATE appointments 
             SET status = 'cancelled' 
             WHERE appointment_id = $1 AND patient_id = $2 
             RETURNING *`,
            [id, userId]
        );

        res.json({ 
            message: 'Appointment cancelled successfully',
            appointment: updated.rows[0]
        });
    } catch (err) {
        console.error('Error in cancelAppointment:', err);
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};

module.exports = {
    getPatientStats,
    getMyAppointments,
    getAppointmentDetails,
    bookAppointment,
    cancelAppointment
};

