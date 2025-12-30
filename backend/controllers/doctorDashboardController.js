const pool = require('../config/db');

// Get Doctor Stats (Today's overview)
const getDoctorStats = async (req, res) => {
    try {
        const { doctorId } = req.params; // Expecting doctor ID from query or auth middleware (if using auth) 
        // For now, let's assume valid doctorId is valid user_id from auth, but we need the actual doctor_id from doctors table
        // Actually, let's fetch doctor_id using the user_id from req.user (middleware)
        
        const userId = req.user.user_id;
        const doctorRes = await pool.query('SELECT doctor_id FROM doctors WHERE user_id = $1', [userId]);
        
        if (doctorRes.rows.length === 0) {
            console.log(`Doctor profile not found for user_id: ${userId}`);
            return res.status(404).json({ message: 'Doctor profile not found for this user' });
        }
        const doctorIdToUse = doctorRes.rows[0].doctor_id;

        // Use PostgreSQL CURRENT_DATE for accurate date comparison
        const today = new Date().toISOString().split('T')[0];

        // Today's appointments - use date comparison
        const todayAppointments = await pool.query(
            `SELECT COUNT(*) FROM appointments 
             WHERE doctor_id = $1 AND date::date = CURRENT_DATE`,
            [doctorIdToUse]
        );

        // Upcoming appointments - date >= today AND status = upcoming
        const upcomingAppointments = await pool.query(
            `SELECT COUNT(*) FROM appointments 
             WHERE doctor_id = $1 AND date::date >= CURRENT_DATE AND status = $2`,
            [doctorIdToUse, 'upcoming']
        );

        // Completed Today - date = today AND status = completed
        const completedToday = await pool.query(
            `SELECT COUNT(*) FROM appointments 
             WHERE doctor_id = $1 AND date::date = CURRENT_DATE AND status = $2`,
            [doctorIdToUse, 'completed']
        );

        res.json({
            todayCount: parseInt(todayAppointments.rows[0].count),
            upcomingCount: parseInt(upcomingAppointments.rows[0].count),
            completedToday: parseInt(completedToday.rows[0].count)
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Get Doctor Appointments (with filters)
const getDoctorAppointments = async (req, res) => {
    try {
        const userId = req.user.user_id;
        const doctorRes = await pool.query('SELECT doctor_id FROM doctors WHERE user_id = $1', [userId]);
        if (doctorRes.rows.length === 0) return res.status(404).json({ message: 'Doctor not found' });
        const doctorId = doctorRes.rows[0].doctor_id;

        const { filter } = req.query; // today, upcoming, history

        let query = `
            SELECT a.*, u.email as patient_email 
            FROM appointments a
            LEFT JOIN users u ON a.patient_id = u.user_id
            WHERE a.doctor_id = $1
        `;
        const params = [doctorId];

        if (filter === 'today') {
            query += ' AND a.date::date = CURRENT_DATE ORDER BY a.time ASC';
        } else if (filter === 'upcoming') {
            query += ' AND a.date::date >= CURRENT_DATE AND a.status = $2 ORDER BY a.date ASC, a.time ASC';
            params.push('upcoming');
        } else if (filter === 'history') {
            // History: completed OR cancelled OR past dates
            query += ' AND (a.status IN ($2, $3) OR a.date::date < CURRENT_DATE) ORDER BY a.date DESC, a.time DESC';
            params.push('completed', 'cancelled');
        } else {
            // All appointments: latest first (newest date and time at top)
            query += ' ORDER BY a.date DESC, a.time DESC';
        }

        const appointments = await pool.query(query, params);
        res.json(appointments.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Get Single Appointment Details
const getAppointmentDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const appointment = await pool.query(`
            SELECT a.*, 
                   d.name as doctor_name,
                   d.specialty as doctor_specialty,
                   d.qualification as doctor_qualification,
                   d.experience as doctor_experience,
                   d.designation as doctor_designation,
                   d.institute as doctor_institute,
                   d.bio as doctor_bio,
                   d.image_url as doctor_image_url
            FROM appointments a
            JOIN doctors d ON a.doctor_id = d.doctor_id
            WHERE a.appointment_id = $1
        `, [id]);

        if (appointment.rows.length === 0) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        // Get prescription if exists
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

// Update Appointment Status
const updateAppointmentStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, meeting_link } = req.body;

        const updated = await pool.query(
            'UPDATE appointments SET status = COALESCE($1, status), meeting_link = COALESCE($2, meeting_link) WHERE appointment_id = $3 RETURNING *',
            [status, meeting_link, id]
        );

        res.json(updated.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Create Prescription
const createPrescription = async (req, res) => {
    try {
        const { appointmentId } = req.params;
        const { medicines, advice, follow_up_date, diagnosis } = req.body;

        // First, verify the appointment exists and get its status
        const appointmentRes = await pool.query(
            'SELECT appointment_id, status, doctor_id FROM appointments WHERE appointment_id = $1',
            [appointmentId]
        );

        if (appointmentRes.rows.length === 0) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        const appointment = appointmentRes.rows[0];

        // Verify the appointment belongs to this doctor
        const userId = req.user.user_id;
        const doctorRes = await pool.query('SELECT doctor_id FROM doctors WHERE user_id = $1', [userId]);
        if (doctorRes.rows.length === 0) {
            return res.status(403).json({ message: 'Doctor not found' });
        }
        const doctorId = doctorRes.rows[0].doctor_id;

        if (appointment.doctor_id !== doctorId) {
            return res.status(403).json({ message: 'You do not have permission to create prescription for this appointment' });
        }

        // Prevent creating prescription for cancelled appointments
        if (appointment.status === 'cancelled') {
            return res.status(400).json({ 
                message: 'Cannot create prescription for a cancelled appointment. Prescriptions can only be created for upcoming or completed appointments.' 
            });
        }

        const newPrescription = await pool.query(
            'INSERT INTO prescriptions (appointment_id, medicines, advice, follow_up_date, diagnosis) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [appointmentId, JSON.stringify(medicines), advice, follow_up_date || null, diagnosis || null]
        );

        // Mark appointment as completed if not already (but not if it's cancelled)
        if (appointment.status !== 'cancelled') {
        await pool.query('UPDATE appointments SET status = $1 WHERE appointment_id = $2', ['completed', appointmentId]);
        }

        res.json(newPrescription.rows[0]);
    } catch (err) {
        console.error('Error in createPrescription:', err);
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};

// Get Doctor Availability
const getDoctorAvailability = async (req, res) => {
    try {
        const userId = req.user.user_id;
        const doctorRes = await pool.query('SELECT availability, is_available FROM doctors WHERE user_id = $1', [userId]);
        
        if (doctorRes.rows.length === 0) return res.status(404).json({ message: 'Doctor not found' });

        // Return default structure if availability is null or empty
        const availability = doctorRes.rows[0].availability || {
            weekdays: {},
            specialDays: []
        };

        res.json({
            availability: availability,
            is_available: doctorRes.rows[0].is_available !== false
        });
    } catch (err) {
        console.error('Error in getDoctorAvailability:', err);
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};

// Update Availability
const updateDoctorAvailability = async (req, res) => {
    try {
        const userId = req.user.user_id;
        const { availability, is_available } = req.body;

        // Validate availability structure
        if (availability && typeof availability !== 'object') {
            return res.status(400).json({ message: 'Invalid availability format' });
        }

        // First get doctor_id
        const doctorRes = await pool.query('SELECT doctor_id FROM doctors WHERE user_id = $1', [userId]);
        if (doctorRes.rows.length === 0) return res.status(404).json({ message: 'Doctor not found' });
        const doctorId = doctorRes.rows[0].doctor_id;

        const updated = await pool.query(
            'UPDATE doctors SET availability = COALESCE($1, availability), is_available = COALESCE($2, is_available) WHERE doctor_id = $3 RETURNING *',
            [JSON.stringify(availability), is_available !== undefined ? is_available : true, doctorId]
        );

        res.json({
            availability: updated.rows[0].availability,
            is_available: updated.rows[0].is_available
        });
    } catch (err) {
        console.error('Error in updateDoctorAvailability:', err);
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};

// Get Available Time Slots for a Specific Date (Public endpoint for booking page)
const getAvailableSlots = async (req, res) => {
    try {
        const { doctorId } = req.params;
        const { date } = req.query;

        if (!date) {
            return res.status(400).json({ message: 'Date parameter is required' });
        }

        // Get doctor availability
        const doctorRes = await pool.query(
            'SELECT availability, is_available FROM doctors WHERE doctor_id = $1',
            [doctorId]
        );

        if (doctorRes.rows.length === 0) {
            return res.status(404).json({ message: 'Doctor not found' });
        }

        // Parse availability - PostgreSQL JSONB is automatically parsed by pg library, but handle both cases
        let availability = doctorRes.rows[0].availability;
        if (!availability) {
            availability = { weekdays: {}, specialDays: [] };
        } else if (typeof availability === 'string') {
            try {
                availability = JSON.parse(availability);
            } catch (e) {
                console.error('Error parsing availability JSON:', e);
                availability = { weekdays: {}, specialDays: [] };
            }
        }
        
        // Ensure availability has the expected structure
        if (!availability.weekdays) availability.weekdays = {};
        if (!availability.specialDays) availability.specialDays = [];
        
        // Normalize date string to YYYY-MM-DD format
        const dateStr = date.includes('T') ? date.split('T')[0] : date.split(' ')[0];
        
        // Parse date components to avoid timezone issues
        const [year, month, day] = dateStr.split('-').map(Number);
        if (!year || !month || !day) {
            return res.status(400).json({ message: 'Invalid date format' });
        }
        
        // Use Zeller's congruence algorithm to calculate day of week without timezone issues
        // This is more reliable than Date.getDay() which can be affected by timezone
        const q = day;
        const m = month < 3 ? month + 12 : month;
        const y = month < 3 ? year - 1 : year;
        const K = y % 100;
        const J = Math.floor(y / 100);
        
        // Zeller's congruence: h = (q + floor(13(m+1)/5) + K + floor(K/4) + floor(J/4) - 2J) mod 7
        // h = 0 is Saturday, 1 is Sunday, 2 is Monday, etc. in Zeller's
        // We need: 0 = Sunday, 1 = Monday, etc.
        let h = (q + Math.floor(13 * (m + 1) / 5) + K + Math.floor(K / 4) + Math.floor(J / 4) - 2 * J) % 7;
        // Convert Zeller's (0=Sat, 1=Sun, 2=Mon...) to our format (0=Sun, 1=Mon, 2=Tue...)
        const dayOfWeek = (h + 6) % 7;
        
        const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        const dayName = dayNames[dayOfWeek];
        
        // Also create date for validation and logging
        const selectedDate = new Date(year, month - 1, day);
        
        // Validate date
        if (isNaN(selectedDate.getTime())) {
            return res.status(400).json({ message: 'Invalid date format' });
        }
        
        // Additional debug: verify the date calculation
        const dateGetDay = selectedDate.getDay(); // For comparison
        console.log('Date calculation check:', {
            inputDate: dateStr,
            parsedYear: year,
            parsedMonth: month,
            parsedDay: day,
            zellerDayOfWeek: dayOfWeek,
            dateGetDay: dateGetDay,
            dayName: dayName,
            expectedDay: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayOfWeek],
            match: dayOfWeek === dateGetDay ? 'YES' : 'NO (timezone issue)'
        });
        const specialDay = availability.specialDays?.find((sd) => sd.date === dateStr);
        
        // Check global availability flag - but allow specific weekday/special day availability to override
        const globalIsAvailable = doctorRes.rows[0].is_available !== false;
        const hasSpecificAvailability = (specialDay && specialDay.isAvailable === true) || 
                                        (availability.weekdays?.[dayName]?.isAvailable === true);
        
        // Debug logging
        const weekdayData = availability.weekdays?.[dayName];
        console.log('getAvailableSlots Debug:', {
            doctorId,
            dateStr,
            dayName,
            dayOfWeek,
            globalIsAvailable,
            hasSpecificAvailability,
            availabilityKeys: Object.keys(availability.weekdays || {}),
            weekdayExists: !!weekdayData,
            weekdayIsAvailable: weekdayData?.isAvailable,
            weekdayTimeRanges: weekdayData?.timeRanges,
            weekdayTimeRangesLength: weekdayData?.timeRanges?.length,
            weekdayTimeRangesType: Array.isArray(weekdayData?.timeRanges),
            fullWeekdayData: weekdayData,
            hasSpecialDay: !!specialDay,
            fullAvailability: JSON.stringify(availability, null, 2)
        });
        
        // If global flag is false AND no specific availability for this date, return unavailable
        if (!globalIsAvailable && !hasSpecificAvailability) {
            return res.json({ availableSlots: [], message: 'Doctor is currently unavailable' });
        }
        
        if (specialDay && specialDay.isAvailable === false) {
            return res.json({ availableSlots: [], message: 'Doctor is not available on this date' });
        }

        // Generate time slots from time ranges
        let timeSlots = [];
        const slotInterval = 30; // 30 minutes interval
        
        // Helper function to generate slots from a time range
        const generateSlotsFromRange = (start, end) => {
            const slots = [];
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
        
        if (specialDay && specialDay.isAvailable === true) {
            // Use timeRanges if available, otherwise fall back to timeSlots (old format)
            if (specialDay.timeRanges && specialDay.timeRanges.length > 0) {
                specialDay.timeRanges.forEach(range => {
                    timeSlots.push(...generateSlotsFromRange(range.start, range.end));
                });
            } else if (specialDay.timeSlots && specialDay.timeSlots.length > 0) {
                timeSlots = specialDay.timeSlots;
            }
            // If special day is available but has no time ranges/slots, return empty
        } else if (availability.weekdays && availability.weekdays[dayName]) {
            const weekday = availability.weekdays[dayName];
            console.log(`Processing weekday "${dayName}":`, {
                isAvailable: weekday.isAvailable,
                hasTimeRanges: !!(weekday.timeRanges && Array.isArray(weekday.timeRanges)),
                timeRangesLength: weekday.timeRanges?.length || 0,
                timeRanges: weekday.timeRanges,
                hasTimeSlots: !!(weekday.timeSlots && Array.isArray(weekday.timeSlots)),
                timeSlotsLength: weekday.timeSlots?.length || 0
            });
            
            // Check if weekday is available
            if (weekday.isAvailable === true) {
                // Use timeRanges if available, otherwise fall back to timeSlots (old format)
                if (weekday.timeRanges && Array.isArray(weekday.timeRanges) && weekday.timeRanges.length > 0) {
                    weekday.timeRanges.forEach((range, idx) => {
                        if (range && range.start && range.end) {
                            try {
                                console.log(`Generating slots from range ${idx}:`, range);
                                const slots = generateSlotsFromRange(range.start, range.end);
                                console.log(`Generated ${slots.length} slots:`, slots);
                                timeSlots.push(...slots);
                            } catch (e) {
                                console.error('Error generating slots from range:', range, e);
                            }
                        } else {
                            console.warn(`Invalid range at index ${idx}:`, range);
                        }
                    });
                } else if (weekday.timeSlots && Array.isArray(weekday.timeSlots) && weekday.timeSlots.length > 0) {
                    timeSlots = weekday.timeSlots;
                    console.log(`Using timeSlots (old format):`, timeSlots);
                } else {
                    console.warn(`Weekday "${dayName}" is available but has no timeRanges or timeSlots`);
                }
            } else {
                console.log(`Weekday "${dayName}" is not available (isAvailable: ${weekday.isAvailable})`);
            }
            // If weekday is not available or has no time ranges/slots, timeSlots remains empty
        } else {
            console.log(`No weekday data found for "${dayName}" in availability.weekdays`);
        }
        
        // Remove duplicates and sort
        timeSlots = [...new Set(timeSlots)].sort();
        
        // Debug: Log generated slots
        console.log('Generated timeSlots before filtering:', timeSlots.length, 'slots');

        // Get already booked appointments for this date
        // Only consider 'upcoming' appointments as booked slots (completed appointments free up the slot)
        const bookedAppointments = await pool.query(
            `SELECT time FROM appointments 
             WHERE doctor_id = $1 AND date = $2 AND status = 'upcoming'`,
            [doctorId, dateStr]
        );

        // Normalize booked times to HH:MM format (remove seconds if present)
        // Also handle TIME type from PostgreSQL which might be in different formats
        const bookedTimes = bookedAppointments.rows.map((apt) => {
            const timeStr = apt.time.toString();
            // Handle both "HH:MM:SS" and "HH:MM" formats
            // Extract just the HH:MM part
            const normalized = timeStr.length >= 5 ? timeStr.substring(0, 5) : timeStr;
            // Ensure it's in HH:MM format (pad if needed)
            if (normalized.length === 4 && normalized.indexOf(':') === 1) {
                return '0' + normalized; // Handle H:MM format
            }
            return normalized;
        });
        
        // Remove duplicates and ensure all are in HH:MM format
        const uniqueBookedTimes = [...new Set(bookedTimes)].filter(t => /^\d{2}:\d{2}$/.test(t));

        // Filter out booked slots - backend enforces 30-minute slot exclusivity
        // Each slot can only be booked by one patient at a time
        // Use case-insensitive and format-normalized comparison
        const availableSlots = timeSlots.filter((slot) => {
            // Normalize slot time to HH:MM format
            const normalizedSlot = slot.length > 5 ? slot.substring(0, 5) : slot;
            // Check if this slot is booked
            return !uniqueBookedTimes.some(booked => {
                const normalizedBooked = booked.length > 5 ? booked.substring(0, 5) : booked;
                return normalizedSlot === normalizedBooked;
            });
        });
        
        // Debug logging
        console.log('Slot filtering:', {
            totalSlots: timeSlots.length,
            bookedSlots: bookedTimes.length,
            availableSlots: availableSlots.length,
            bookedTimes: bookedTimes.slice(0, 5), // Show first 5 booked times
            sampleSlots: timeSlots.slice(0, 5) // Show first 5 available slots
        });

        res.json({ 
            availableSlots, 
            bookedSlots: uniqueBookedTimes, // Include booked slots so frontend can gray them out
            allSlots: timeSlots,
            debug: {
                dayName,
                hasWeekday: !!availability.weekdays?.[dayName],
                weekdayIsAvailable: availability.weekdays?.[dayName]?.isAvailable,
                hasTimeRanges: !!(availability.weekdays?.[dayName]?.timeRanges?.length > 0),
                timeRangesCount: availability.weekdays?.[dayName]?.timeRanges?.length || 0
            }
        });
    } catch (err) {
        console.error('Error in getAvailableSlots:', err);
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};

// Get Available Dates in a Range (Optimized for calendar)
const getAvailableDates = async (req, res) => {
    try {
        const { doctorId } = req.params;
        const { startDate, endDate } = req.query;

        if (!startDate || !endDate) {
            return res.status(400).json({ message: 'startDate and endDate parameters are required' });
        }

        // Get doctor availability
        const doctorRes = await pool.query(
            'SELECT availability, is_available FROM doctors WHERE doctor_id = $1',
            [doctorId]
        );

        if (doctorRes.rows.length === 0) {
            return res.status(404).json({ message: 'Doctor not found' });
        }

        if (!doctorRes.rows[0].is_available) {
            return res.json({ availableDates: [] });
        }

        const availability = doctorRes.rows[0].availability || { weekdays: {}, specialDays: [] };
        const slotInterval = 30; // 30 minutes interval
        
        // Helper function to generate slots from a time range
        const generateSlotsFromRange = (start, end) => {
            const slots = [];
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

        // Normalize dates and parse to avoid timezone issues
        const startDateStr = startDate.includes('T') ? startDate.split('T')[0] : startDate.split(' ')[0];
        const endDateStr = endDate.includes('T') ? endDate.split('T')[0] : endDate.split(' ')[0];
        
        // Parse date components
        const [startYear, startMonth, startDay] = startDateStr.split('-').map(Number);
        const [endYear, endMonth, endDay] = endDateStr.split('-').map(Number);
        
        // Create dates in local timezone (month is 0-indexed)
        const start = new Date(startYear, startMonth - 1, startDay);
        const end = new Date(endYear, endMonth - 1, endDay);
        
        const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        const availableDates = [];
        
        // Get all booked appointments in the date range
        // Only consider 'upcoming' appointments as booked (completed appointments free up slots)
        const bookedAppointments = await pool.query(
            `SELECT date, time FROM appointments 
             WHERE doctor_id = $1 AND date >= $2 AND date <= $3 AND status = 'upcoming'`,
            [doctorId, startDateStr, endDateStr]
        );
        
        // Group booked appointments by date
        const bookedByDate = {};
        bookedAppointments.rows.forEach(apt => {
            if (!bookedByDate[apt.date]) {
                bookedByDate[apt.date] = [];
            }
            bookedByDate[apt.date].push(apt.time);
        });

        // Check each date in the range
        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
            // Format date as YYYY-MM-DD in local timezone
            const year = d.getFullYear();
            const monthNum = d.getMonth() + 1;
            const dayNum = d.getDate();
            const month = String(monthNum).padStart(2, '0');
            const day = String(dayNum).padStart(2, '0');
            const dateStr = `${year}-${month}-${day}`;
            
            // Use Zeller's congruence for accurate day calculation (timezone-independent)
            const q = dayNum;
            const m = monthNum < 3 ? monthNum + 12 : monthNum;
            const y = monthNum < 3 ? year - 1 : year;
            const K = y % 100;
            const J = Math.floor(y / 100);
            let h = (q + Math.floor(13 * (m + 1) / 5) + K + Math.floor(K / 4) + Math.floor(J / 4) - 2 * J) % 7;
            const dayOfWeek = (h + 6) % 7; // Convert Zeller's (0=Sat) to our format (0=Sun)
            const dayName = dayNames[dayOfWeek];
            
            // Check if date is in special days
            const specialDay = availability.specialDays?.find((sd) => sd.date === dateStr);
            
            if (specialDay && specialDay.isAvailable === false) {
                continue; // Skip unavailable dates
            }
            
            let timeSlots = [];
            
            if (specialDay && specialDay.isAvailable === true) {
                // Use timeRanges if available, otherwise fall back to timeSlots (old format)
                if (specialDay.timeRanges && specialDay.timeRanges.length > 0) {
                    specialDay.timeRanges.forEach(range => {
                        timeSlots.push(...generateSlotsFromRange(range.start, range.end));
                    });
                } else if (specialDay.timeSlots && specialDay.timeSlots.length > 0) {
                    timeSlots = specialDay.timeSlots;
                }
            } else if (availability.weekdays && availability.weekdays[dayName] && availability.weekdays[dayName].isAvailable) {
                const weekday = availability.weekdays[dayName];
                if (weekday.timeRanges && weekday.timeRanges.length > 0) {
                    weekday.timeRanges.forEach(range => {
                        timeSlots.push(...generateSlotsFromRange(range.start, range.end));
                    });
                } else if (weekday.timeSlots && weekday.timeSlots.length > 0) {
                    timeSlots = weekday.timeSlots;
                }
            }
            
            if (timeSlots.length > 0) {
                // Remove duplicates and sort
                timeSlots = [...new Set(timeSlots)].sort();
                
                // Filter out booked slots
                // Normalize booked times to HH:MM format for accurate comparison
                const bookedTimesForDate = (bookedByDate[dateStr] || []).map((time) => {
                    const timeStr = time.toString();
                    // Extract HH:MM part, handle both HH:MM:SS and HH:MM formats
                    const normalized = timeStr.length >= 5 ? timeStr.substring(0, 5) : timeStr;
                    // Ensure proper format
                    if (normalized.length === 4 && normalized.indexOf(':') === 1) {
                        return '0' + normalized; // Handle H:MM format
                    }
                    return normalized;
                });
                const uniqueBookedTimesForDate = [...new Set(bookedTimesForDate)].filter(t => /^\d{2}:\d{2}$/.test(t));
                
                // Filter out booked slots with normalized comparison
                const availableSlots = timeSlots.filter((slot) => {
                    const normalizedSlot = slot.length > 5 ? slot.substring(0, 5) : slot;
                    return !uniqueBookedTimesForDate.some(booked => {
                        const normalizedBooked = booked.length > 5 ? booked.substring(0, 5) : booked;
                        return normalizedSlot === normalizedBooked;
                    });
                });
                
                // Only add date if there are available slots
                if (availableSlots.length > 0) {
                    availableDates.push(dateStr);
                }
            }
        }

        res.json({ availableDates });
    } catch (err) {
        console.error('Error in getAvailableDates:', err);
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};

module.exports = {
    getDoctorStats,
    getDoctorAppointments,
    getAppointmentDetails,
    updateAppointmentStatus,
    createPrescription,
    getDoctorAvailability,
    updateDoctorAvailability,
    getAvailableSlots,
    getAvailableDates
};
