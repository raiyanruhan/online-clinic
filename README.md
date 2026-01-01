# Roudromoyee Online Clinic

A comprehensive telemedicine platform that connects patients with healthcare providers for online consultations, appointment scheduling, prescription management, and medical services.

## Features

### Patient Features
- **User Registration & Authentication** - Secure signup and login system
- **Doctor Discovery** - Browse and search for available doctors
- **Appointment Booking** - Schedule appointments with preferred doctors
- **Google Meet Integration** - Automatic video consultation links for appointments
- **Prescription Management** - View and download prescriptions
- **Appointment History** - Track past and upcoming appointments
- **Patient Dashboard** - Centralized view of all patient activities

### Doctor Features
- **Doctor Dashboard** - Manage appointments and patient interactions
- **Availability Management** - Set working hours and available time slots
- **Prescription Editor** - Create and manage digital prescriptions
- **Blog Management** - Write and publish medical blogs
- **Appointment Management** - View and manage patient appointments
- **Google Calendar Integration** - Automatic calendar event creation with Meet links

### Admin Features
- **Admin Dashboard** - Comprehensive system overview
- **Appointment Management** - View and manage all appointments
- **Doctor Management** - Manage doctor profiles and accounts
- **Reports & Analytics** - Monthly reports and workload statistics
- **System Statistics** - Real-time platform metrics

### General Features
- **Medical Blog System** - Read and publish healthcare articles
- **Medicine Database** - Searchable database of medicines
- **Responsive Design** - Mobile-friendly interface with bottom navigation
- **Modern UI/UX** - Built with React, TypeScript, and Tailwind CSS
- **Secure Authentication** - JWT-based authentication system
- **Google OAuth** - Optional Google sign-in integration

## Tech Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Lucide React** - Icon library
- **jsPDF** - PDF generation for prescriptions

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **PostgreSQL** - Relational database
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **Google APIs** - Calendar and Meet integration
- **CORS** - Cross-origin resource sharing

## Project Structure

```
├── backend/
│   ├── config/          # Database configuration
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Authentication middleware
│   ├── routes/          # API routes
│   ├── services/        # Business logic services
│   ├── datasets/        # Medicine and generic data
│   └── server.js        # Express server entry point
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable React components
│   │   ├── pages/       # Page components
│   │   ├── contexts/    # React contexts
│   │   ├── utils/       # Utility functions
│   │   └── api/         # API client functions
│   └── public/          # Static assets
└── README.md
```

## Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **PostgreSQL** (v12 or higher)
- **Git**

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/raiyanruhan/online-clinic.git
cd online-clinic
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=online_clinic
DB_USER=your_db_user
DB_PASSWORD=your_db_password

# JWT Configuration
JWT_SECRET=your_jwt_secret_key

# Server Configuration
PORT=5000
NODE_ENV=development

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:5000/auth/google/callback
```

### 3. Database Setup

1. Create a PostgreSQL database:
```sql
CREATE DATABASE online_clinic;
```

2. Run the database schema:
```bash
psql -U your_db_user -d online_clinic -f backend/database.sql
```

3. (Optional) Run any additional schema updates:
```bash
psql -U your_db_user -d online_clinic -f backend/schema_update.sql
```

### 4. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend` directory (if needed):

```env
VITE_API_URL=http://localhost:5000/api
```

### 5. Run Database Seeders (Optional)

```bash
cd backend
node seed-category.js
node seed-appointments.js
```

## Running the Application

### Development Mode

1. **Start the Backend Server:**
```bash
cd backend
node server.js
```
The backend will run on `http://localhost:5000`

2. **Start the Frontend Development Server:**
```bash
cd frontend
npm run dev
```
The frontend will run on `http://localhost:5173` (or the port Vite assigns)

### Production Build

1. **Build the Frontend:**
```bash
cd frontend
npm run build
```

2. **Serve the Backend:**
```bash
cd backend
node server.js
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /auth/google` - Google OAuth initiation
- `GET /auth/google/callback` - Google OAuth callback

### Doctors
- `GET /api/doctors` - Get all doctors
- `GET /api/doctors/:id` - Get doctor details
- `GET /api/doctors/:doctorId/available-dates` - Get available dates
- `GET /api/doctors/:doctorId/available-slots` - Get available time slots

### Appointments
- `POST /api/patient/dashboard/appointments` - Book appointment
- `GET /api/patient/dashboard/appointments` - Get patient appointments
- `PUT /api/patient/dashboard/appointments/:id/cancel` - Cancel appointment
- `GET /api/doctor/dashboard/appointments` - Get doctor appointments

### Prescriptions
- `POST /api/doctor/dashboard/prescriptions` - Create prescription
- `GET /api/patient/dashboard/prescriptions` - Get patient prescriptions

### Blogs
- `GET /api/blogs` - Get all blogs
- `GET /api/blogs/:id` - Get blog details
- `POST /api/blogs` - Create blog (doctor only)
- `PUT /api/blogs/:id` - Update blog (doctor only)
- `DELETE /api/blogs/:id` - Delete blog (doctor only)

### Medicines
- `GET /api/medicines` - Search medicines
- `GET /api/medicines/:id` - Get medicine details

### Admin
- `GET /api/admin/stats` - Get system statistics
- `GET /api/admin/appointments` - Get all appointments
- `GET /api/admin/doctors` - Get all doctors
- `GET /api/admin/reports/monthly` - Get monthly reports

## Google Calendar & Meet Integration

The application automatically generates Google Meet links for appointments:

1. When a patient books an appointment, the system:
   - Creates a Google Calendar event
   - Generates a Google Meet link
   - Updates the appointment status to "ready"

2. Both doctor and patient can join the meeting using the generated link

3. The integration uses Google Calendar API with OAuth 2.0 authentication

For detailed integration documentation, see `meet instructions.md`

## Database Schema

Key tables:
- `users` - User accounts (patients, doctors, admins)
- `doctors` - Doctor profiles and information
- `appointments` - Appointment records
- `prescriptions` - Prescription data
- `blogs` - Medical blog posts
- `medicines` - Medicine database
- `categories` - Service categories

## Environment Variables

### Backend (.env)
- `DB_HOST` - PostgreSQL host
- `DB_PORT` - PostgreSQL port
- `DB_NAME` - Database name
- `DB_USER` - Database user
- `DB_PASSWORD` - Database password
- `JWT_SECRET` - Secret key for JWT tokens
- `PORT` - Backend server port
- `GOOGLE_CLIENT_ID` - Google OAuth client ID
- `GOOGLE_CLIENT_SECRET` - Google OAuth client secret
- `GOOGLE_REDIRECT_URI` - Google OAuth redirect URI

### Frontend (.env)
- `VITE_API_URL` - Backend API URL

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Security Notes

- Never commit `.env` files to version control
- Use strong JWT secrets in production
- Keep Google OAuth credentials secure
- Implement rate limiting for production
- Use HTTPS in production environments
- Regularly update dependencies for security patches

## License

This project is licensed under the ISC License.

## Support

For issues and questions, please open an issue on the GitHub repository.

## Acknowledgments

- Google Calendar API for meeting integration
- All healthcare professionals using the platform
- Open source community for excellent tools and libraries

