const { google } = require('googleapis');
const pool = require('../config/db');
const { oauth2Client } = require('../controllers/googleAuthController');

<<<<<<< HEAD
// Check if OAuth is configured
=======
// Check if OAuth is configured  
>>>>>>> 58b88cb347b3e55f9f6f8b45a0c9b6aa286b1e2e
const isOAuthConfigured = async () => {
    try {
        const tokenResult = await pool.query('SELECT id FROM google_oauth_tokens ORDER BY id DESC LIMIT 1');
        return tokenResult.rows.length > 0;
    } catch (err) {
        console.error('Error checking OAuth configuration:', err);
        return false;
    }
};

// Get valid access token (refresh if needed)
const getValidAccessToken = async () => {
    try {
        // Get tokens from database
        const tokenResult = await pool.query('SELECT * FROM google_oauth_tokens ORDER BY id DESC LIMIT 1');
        
        if (tokenResult.rows.length === 0) {
            throw new Error('No OAuth tokens found. Please authorize Google Calendar access first by visiting /auth/google');
        }

        const tokenData = tokenResult.rows[0];
        const expiresAt = new Date(tokenData.expires_at);
        const now = new Date();

        // Check if access token is expired or will expire in next 5 minutes
        if (expiresAt <= new Date(now.getTime() + 5 * 60 * 1000)) {
            console.log('Access token expired or expiring soon, refreshing...');
            return await refreshAccessToken(tokenData.refresh_token);
        }

        return tokenData.access_token;
    } catch (err) {
        console.error('Error getting valid access token:', err);
        throw err;
    }
};

// Refresh access token using refresh token
const refreshAccessToken = async (refreshToken) => {
    try {
        oauth2Client.setCredentials({
            refresh_token: refreshToken
        });

        const { credentials } = await oauth2Client.refreshAccessToken();
        
        if (!credentials.access_token) {
            throw new Error('Failed to refresh access token');
        }

        // Calculate new expiration time
        const expiresAt = new Date();
        expiresAt.setSeconds(expiresAt.getSeconds() + (credentials.expiry_date ? Math.floor((credentials.expiry_date - Date.now()) / 1000) : 3600));

        // Update tokens in database
        await pool.query(
            `UPDATE google_oauth_tokens 
             SET access_token = $1, expires_at = $2, updated_at = CURRENT_TIMESTAMP 
             WHERE refresh_token = $3`,
            [credentials.access_token, expiresAt, refreshToken]
        );

        console.log('✅ Access token refreshed');
        return credentials.access_token;
    } catch (err) {
        console.error('Error refreshing access token:', err);
        throw err;
    }
};

// Create calendar event with Google Meet conference
const createCalendarEvent = async (appointment, doctorEmail, patientEmail) => {
    try {
        const accessToken = await getValidAccessToken();
        
        oauth2Client.setCredentials({
            access_token: accessToken
        });

        const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

        // Parse appointment date and time
        // appointment.date can be a Date object or string in format 'YYYY-MM-DD'
        // appointment.time is in format 'HH:MM:SS' or 'HH:MM' (PostgreSQL Time type)
        
        // Extract date string in YYYY-MM-DD format
        // PostgreSQL DATE type is returned as a Date object by pg library
        let dateStr;
        
        // First, log what we're receiving
        console.log('Raw appointment.date:', {
            value: appointment.date,
            type: typeof appointment.date,
            isDate: appointment.date instanceof Date,
            constructor: appointment.date?.constructor?.name
        });
        
        // Handle Date object (from PostgreSQL)
        if (appointment.date instanceof Date) {
            const year = appointment.date.getFullYear();
            const month = String(appointment.date.getMonth() + 1).padStart(2, '0');
            const day = String(appointment.date.getDate()).padStart(2, '0');
            dateStr = `${year}-${month}-${day}`;
            console.log('Extracted from Date object:', dateStr);
        } 
        // Handle string that might be ISO date string or YYYY-MM-DD
        else if (typeof appointment.date === 'string') {
            // If it's an ISO string like "2025-12-30T00:00:00.000Z", extract just the date part
            if (appointment.date.includes('T')) {
                dateStr = appointment.date.split('T')[0];
                console.log('Extracted from ISO string:', dateStr);
            } 
            // If it's already YYYY-MM-DD format
            else if (/^\d{4}-\d{2}-\d{2}$/.test(appointment.date)) {
                dateStr = appointment.date;
                console.log('Using YYYY-MM-DD string:', dateStr);
            }
            // Try to parse it as a date and extract YYYY-MM-DD
            else {
                const parsedDate = new Date(appointment.date);
                if (isNaN(parsedDate.getTime())) {
                    throw new Error(`Cannot parse date: ${appointment.date}`);
                }
                const year = parsedDate.getFullYear();
                const month = String(parsedDate.getMonth() + 1).padStart(2, '0');
                const day = String(parsedDate.getDate()).padStart(2, '0');
                dateStr = `${year}-${month}-${day}`;
                console.log('Parsed and extracted:', dateStr);
            }
        } 
        else {
            throw new Error(`Invalid date format: ${typeof appointment.date}, value: ${JSON.stringify(appointment.date)}`);
        }
        
        // Final validation - ensure dateStr is in correct format
        if (!dateStr || !/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
            throw new Error(`Date extraction failed. Got: ${dateStr}, Type: ${typeof dateStr}, Original: ${JSON.stringify(appointment.date)}`);
        }
        
        // Extract time string
        let timeStr = appointment.time ? appointment.time.toString() : '00:00:00';
        
        // Normalize time string (remove milliseconds if present, ensure format is HH:MM:SS)
        timeStr = timeStr.split('.')[0]; // Remove milliseconds if any
        const timeParts = timeStr.split(':');
        if (timeParts.length === 2) {
            timeStr = `${timeStr}:00`; // Add seconds if missing
        }
        
        console.log('Creating calendar event with:', {
            appointmentId: appointment.appointment_id,
            dateRaw: appointment.date,
            dateRawType: typeof appointment.date,
            dateStr: dateStr,
            timeRaw: appointment.time,
            timeStr: timeStr
        });
        
        // Validate date format (should be YYYY-MM-DD)
        if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
            console.error('Date format validation failed:', {
                dateStr,
                dateStrType: typeof dateStr,
                dateStrLength: dateStr?.length,
                dateStrValue: JSON.stringify(dateStr)
            });
            throw new Error(`Invalid date format: ${dateStr}. Expected YYYY-MM-DD`);
        }
        
        // Validate time format (should be HH:MM:SS)
        if (!/^\d{2}:\d{2}:\d{2}$/.test(timeStr)) {
            throw new Error(`Invalid time format: ${timeStr}. Expected HH:MM:SS`);
        }
        
        // Combine date and time: '2025-12-30T14:32:00'
        const dateTimeStr = `${dateStr}T${timeStr}`;
        
        console.log('Combined dateTime string:', dateTimeStr);
        
        // Create Date object - this will be interpreted in local timezone
        const startTime = new Date(dateTimeStr);
        
        // Validate the date
        if (isNaN(startTime.getTime())) {
            console.error('Invalid date created:', {
                dateTimeStr,
                dateStr,
                timeStr,
                startTimeValue: startTime.toString(),
                startTimeGetTime: startTime.getTime()
            });
            throw new Error(`Invalid date/time: ${dateTimeStr}. Date: ${dateStr}, Time: ${timeStr}`);
        }
        
        const endTime = new Date(startTime);
        endTime.setMinutes(endTime.getMinutes() + 30); // 30 minute duration

        // Format dates for Google Calendar API (RFC3339)
        // toISOString() converts to UTC, but we specify timezone in the event
        const startTimeISO = startTime.toISOString();
        const endTimeISO = endTime.toISOString();
        
        console.log('Calendar event time details:', {
            dateStr,
            timeStr,
            dateTimeStr,
            startTimeISO,
            endTimeISO,
            startTimeLocal: startTime.toString()
        });

        // Create event with Google Meet conference
        const event = {
            summary: 'Online Consultation',
            description: `Appointment ID: ${appointment.appointment_id}\nDoctor: ${appointment.doctor_name || 'Doctor'}\nPatient: ${appointment.patient_name || 'Patient'}\nSymptoms: ${appointment.symptoms || 'N/A'}`,
            start: {
                dateTime: startTimeISO,
                timeZone: process.env.GOOGLE_CALENDAR_TIMEZONE || 'Asia/Dhaka'
            },
            end: {
                dateTime: endTimeISO,
                timeZone: process.env.GOOGLE_CALENDAR_TIMEZONE || 'Asia/Dhaka'
            },
            attendees: [
                { email: doctorEmail },
                { email: patientEmail }
            ],
            conferenceData: {
                createRequest: {
                    requestId: `meet-${appointment.appointment_id}-${Date.now()}`,
                    conferenceSolutionKey: {
                        type: 'hangoutsMeet'
                    }
                }
            },
            reminders: {
                useDefault: false,
                overrides: [
                    { method: 'email', minutes: 24 * 60 }, // 1 day before
                    { method: 'popup', minutes: 15 } // 15 minutes before
                ]
            }
        };

        const response = await calendar.events.insert({
            calendarId: 'primary',
            conferenceDataVersion: 1,
            requestBody: event
        });

        const meetLink = response.data.conferenceData?.entryPoints?.[0]?.uri || response.data.hangoutLink;
        const eventId = response.data.id;

        if (!meetLink) {
            throw new Error('Google Meet link not generated');
        }

        return {
            meetingLink: meetLink,
            calendarEventId: eventId
        };
    } catch (err) {
        console.error('Error creating calendar event:', err);
        throw err;
    }
};

// Generate Meet link for an appointment
const generateMeetLink = async (appointment) => {
    try {
        // Get doctor email
        const doctorResult = await pool.query(
            `SELECT u.email 
             FROM doctors d 
             JOIN users u ON d.user_id = u.user_id 
             WHERE d.doctor_id = $1`,
            [appointment.doctor_id]
        );

        if (doctorResult.rows.length === 0) {
            throw new Error('Doctor not found');
        }

        const doctorEmail = doctorResult.rows[0].email;

        // Get patient email
        const patientResult = await pool.query(
            'SELECT email FROM users WHERE user_id = $1',
            [appointment.patient_id]
        );

        if (patientResult.rows.length === 0) {
            throw new Error('Patient not found');
        }

        const patientEmail = patientResult.rows[0].email;

        // Create calendar event and get Meet link
        const { meetingLink, calendarEventId } = await createCalendarEvent(
            appointment,
            doctorEmail,
            patientEmail
        );

        return {
            meetingLink,
            calendarEventId
        };
    } catch (err) {
        console.error('Error generating Meet link:', err);
        throw err;
    }
};

module.exports = {
    isOAuthConfigured,
    getValidAccessToken,
    refreshAccessToken,
    createCalendarEvent,
    generateMeetLink
};

