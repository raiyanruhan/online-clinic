-- ============================================
-- Roudromoyee Online Clinic - Complete Database Schema
-- ============================================
-- This file creates all tables needed for the application
-- Run this in cPanel PostgreSQL Database (phpPgAdmin or SQL tab)
-- ============================================

-- ============================================
-- 1. USERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'patient',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 2. DOCTORS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS doctors (
    doctor_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id),
    name VARCHAR(255) NOT NULL,
    specialty VARCHAR(255) NOT NULL,
    service_category VARCHAR(255),
    qualification VARCHAR(255),
    experience VARCHAR(100),
    designation VARCHAR(255),
    institute VARCHAR(255),
    image_url TEXT,
    fee INTEGER,
    bio TEXT,
    availability_status VARCHAR(50) DEFAULT 'Available Today',
    availability JSONB DEFAULT '{}',
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 3. APPOINTMENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS appointments (
    appointment_id SERIAL PRIMARY KEY,
    doctor_id INTEGER REFERENCES doctors(doctor_id),
    patient_id INTEGER REFERENCES users(user_id),
    patient_name VARCHAR(255),
    patient_age VARCHAR(50),
    patient_gender VARCHAR(50),
    patient_weight VARCHAR(50),
    date DATE NOT NULL,
    time TIME NOT NULL,
    symptoms TEXT,
    status VARCHAR(50) DEFAULT 'upcoming',
    meeting_link TEXT,
    calendar_event_id TEXT,
    meeting_provider VARCHAR(20) DEFAULT 'google_meet',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 4. PRESCRIPTIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS prescriptions (
    prescription_id SERIAL PRIMARY KEY,
    appointment_id INTEGER REFERENCES appointments(appointment_id),
    medicines JSONB,
    advice TEXT,
    diagnosis TEXT,
    on_examination TEXT,
    investigation TEXT,
    follow_up_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 5. BLOGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS blogs (
    blog_id SERIAL PRIMARY KEY,
    doctor_id INTEGER REFERENCES doctors(doctor_id),
    title VARCHAR(500) NOT NULL,
    content TEXT NOT NULL,
    content_markdown TEXT,
    excerpt TEXT,
    category VARCHAR(255),
    featured_image_url TEXT,
    reading_time INTEGER DEFAULT 5,
    views INTEGER DEFAULT 0,
    status VARCHAR(50) DEFAULT 'published',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 6. GOOGLE OAUTH TOKENS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS google_oauth_tokens (
    id SERIAL PRIMARY KEY,
    access_token TEXT NOT NULL,
    refresh_token TEXT NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 7. CATEGORIES TABLE (Service Categories)
-- ============================================
CREATE TABLE IF NOT EXISTS categories (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    name_bangla VARCHAR(255),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

-- Users indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- Doctors indexes
CREATE INDEX IF NOT EXISTS idx_doctors_user_id ON doctors(user_id);
CREATE INDEX IF NOT EXISTS idx_doctors_specialty ON doctors(specialty);
CREATE INDEX IF NOT EXISTS idx_doctors_service_category ON doctors(service_category);
CREATE INDEX IF NOT EXISTS idx_doctors_is_available ON doctors(is_available);

-- Appointments indexes
CREATE INDEX IF NOT EXISTS idx_appointments_doctor_id ON appointments(doctor_id);
CREATE INDEX IF NOT EXISTS idx_appointments_patient_id ON appointments(patient_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(date);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
CREATE INDEX IF NOT EXISTS idx_appointments_date_time ON appointments(date, time);

-- Prescriptions indexes
CREATE INDEX IF NOT EXISTS idx_prescriptions_appointment_id ON prescriptions(appointment_id);

-- Blogs indexes
CREATE INDEX IF NOT EXISTS idx_blogs_doctor_id ON blogs(doctor_id);
CREATE INDEX IF NOT EXISTS idx_blogs_status ON blogs(status);
CREATE INDEX IF NOT EXISTS idx_blogs_category ON blogs(category);
CREATE INDEX IF NOT EXISTS idx_blogs_created_at ON blogs(created_at);

-- ============================================
-- INITIAL DATA (Optional - Uncomment if needed)
-- ============================================

-- Insert default admin user (change email and password as needed)
-- Password should be hashed with bcrypt before inserting
-- INSERT INTO users (name, email, password, role) 
-- VALUES ('Admin', 'admin@example.com', '$2a$10$hashedpasswordhere', 'admin');

-- Insert some default categories (optional)
-- INSERT INTO categories (name, name_bangla) VALUES
--     ('গাইনোকোলজি', 'গাইনোকোলজি'),
--     ('শিশুরোগ', 'শিশুরোগ'),
--     ('জেনারেল মেডিসিন', 'জেনারেল মেডিসিন'),
--     ('মানসিক স্বাস্থ্য', 'মানসিক স্বাস্থ্য'),
--     ('পুষ্টি ও ডায়েট', 'পুষ্টি ও ডায়েট'),
--     ('চর্মরোগ', 'চর্মরোগ'),
--     ('ডায়াবেটিস কেয়ার', 'ডায়াবেটিস কেয়ার'),
--     ('ভিডিও কনসালটেশন', 'ভিডিও কনসালটেশন')
-- ON CONFLICT (name) DO NOTHING;

-- ============================================
-- END OF SCHEMA
-- ============================================

