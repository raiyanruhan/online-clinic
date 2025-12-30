-- Add role column to users if it doesn't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='role') THEN 
        ALTER TABLE users ADD COLUMN role VARCHAR(50) DEFAULT 'patient'; 
    END IF; 
END $$;

-- Set admin role
UPDATE users SET role = 'admin' WHERE email = 'raiyaan.ruhan@gmail.com';

-- Create doctors table
CREATE TABLE IF NOT EXISTS doctors (
    doctor_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    specialty VARCHAR(255) NOT NULL,
    qualification VARCHAR(255),
    experience VARCHAR(100),
    designation VARCHAR(255),
    institute VARCHAR(255),
    image_url TEXT,
    fee INTEGER,
    availability_status VARCHAR(50) DEFAULT 'Available Today',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
