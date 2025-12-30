import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { useModal } from '../contexts/ModalContext';

const SPECIALTIES = [
    'General Medicine', 'Gynecology & Obs.', 'Pediatrics', 'Dermatology',
    'Cardiology', 'Orthopedics', 'ENT', 'Neurology', 'Psychiatry',
    'Ophthalmology', 'Gastroenterology', 'Urology', 'Dentistry', 'Other'
];

const SERVICE_CATEGORIES = [
    'গাইনোকোলজি', 'শিশুরোগ', 'জেনারেল মেডিসিন', 'মানসিক স্বাস্থ্য',
    'পুষ্টি ও ডায়েট', 'চর্মরোগ', 'ডায়াবেটিস কেয়ার'
];

const EXPERIENCE_OPTIONS = [
    '1-3 Years', '3-5 Years', '5-10 Years', '10-15 Years', '15+ Years', 'Other'
];

const DESIGNATIONS = [
    'Consultant', 'Senior Consultant', 'Associate Professor', 'Professor',
    'Assistant Professor', 'Registrar', 'Medical Officer', 'Other'
];

const AdminDashboard = () => {
    const { showAlert, showConfirm } = useModal();
    const navigate = useNavigate();
    const [doctors, setDoctors] = useState<any[]>([]);

    // Form state
    const [isEditing, setIsEditing] = useState(false);
    const [editDoctorId, setEditDoctorId] = useState<number | null>(null);

    const [name, setName] = useState('');
    const [specialty, setSpecialty] = useState('');
    const [serviceCategory, setServiceCategory] = useState('');
    const [customSpecialty, setCustomSpecialty] = useState('');
    const [qualification, setQualification] = useState('');
    const [experience, setExperience] = useState('');
    const [customExperience, setCustomExperience] = useState('');
    const [designation, setDesignation] = useState('');
    const [customDesignation, setCustomDesignation] = useState('');
    const [institute, setInstitute] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [fee, setFee] = useState('500');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (!userStr) {
            navigate('/login');
            return;
        }

        const user = JSON.parse(userStr);
        if (user.role !== 'admin') {
            navigate('/dashboard');
            return;
        }

        fetchDoctors();
    }, [navigate]);

    const fetchDoctors = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/doctors');
            const data = await res.json();
            setDoctors(data);
        } catch (error) {
            console.error('Error fetching doctors:', error);
        }
    };

    const resetForm = () => {
        setName(''); setSpecialty(''); setServiceCategory(''); setCustomSpecialty(''); setQualification('');
        setExperience(''); setCustomExperience(''); setDesignation(''); setCustomDesignation(''); setInstitute('');
        setImageUrl(''); setFee('500'); setEmail(''); setPassword('');
        setIsEditing(false); setEditDoctorId(null);
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const url = isEditing
                ? `http://localhost:5000/api/doctors/${editDoctorId}`
                : 'http://localhost:5000/api/doctors';

            const method = isEditing ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name,
                    specialty: specialty === 'Other' ? customSpecialty : specialty,
                    service_category: serviceCategory,
                    qualification,
                    experience: experience === 'Other' ? customExperience : experience,
                    designation: designation === 'Other' ? customDesignation : designation,
                    institute,
                    image_url: imageUrl,
                    fee: parseInt(fee),
                    email: email || undefined,
                    password: password || undefined
                })
            });

            if (response.ok) {
                const data = await response.json();
                const msg = isEditing
                    ? 'Doctor updated successfully!'
                    : (data.hasAccount ? 'Doctor added with login account!' : 'Doctor added (no login account)');
                showAlert({ message: msg, type: 'success' });
                fetchDoctors();
                resetForm();
            } else {
                const errorData = await response.json();
                showAlert({ message: errorData.message || (isEditing ? 'Failed to update doctor' : 'Failed to add doctor'), type: 'error' });
            }
        } catch (error) {
            console.error('Error saving doctor:', error);
            showAlert({ message: 'Something went wrong', type: 'error' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEditClick = (doc: any) => {
        setIsEditing(true);
        setEditDoctorId(doc.doctor_id);
        setName(doc.name);
        setServiceCategory(doc.service_category || '');

        if (SPECIALTIES.includes(doc.specialty)) {
            setSpecialty(doc.specialty);
            setCustomSpecialty('');
        } else {
            setSpecialty('Other');
            setCustomSpecialty(doc.specialty);
        }

        setQualification(doc.qualification);

        if (EXPERIENCE_OPTIONS.includes(doc.experience)) {
            setExperience(doc.experience);
            setCustomExperience('');
        } else {
            setExperience('Other');
            setCustomExperience(doc.experience || '');
        }

        if (DESIGNATIONS.includes(doc.designation)) {
            setDesignation(doc.designation);
            setCustomDesignation('');
        } else {
            setDesignation('Other');
            setCustomDesignation(doc.designation || '');
        }

        setInstitute(doc.institute);
        setImageUrl(doc.image_url || '');
        setFee(doc.fee.toString());
        setEmail(doc.email || ''); // Pre-fill email/password fields are tricky for updates, usually handled separately or left blank
        setPassword('');

        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDeleteDoctor = async (id: number) => {
        const confirmed = await showConfirm({
            title: 'Delete Doctor',
            message: 'Are you sure you want to delete this doctor? This action cannot be undone.',
            type: 'danger',
            confirmText: 'Delete',
            cancelText: 'Cancel'
        });
        if (!confirmed) return;
        
        try {
            const response = await fetch(`http://localhost:5000/api/doctors/${id}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                showAlert({ message: 'Doctor deleted successfully', type: 'success' });
                fetchDoctors();
            } else {
                showAlert({ message: 'Failed to delete', type: 'error' });
            }
        } catch (error) {
            console.error('Error deleting doctor:', error);
        }
    };

    return (
        <div className="bg-gray-100 dark:bg-gray-900 min-h-screen font-body">
            <Header />

            <div className="max-w-7xl mx-auto p-4 md:p-8">
                {/* Page Title */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">admin_panel_settings</span>
                        Admin Dashboard
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400">Manage doctors and clinic settings</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Form Section */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
                            <h2 className="text-lg font-bold mb-5 text-gray-800 dark:text-white flex items-center gap-2">
                                <span className={`material-symbols-outlined ${isEditing ? 'text-blue-500' : 'text-green-500'}`}>
                                    {isEditing ? 'edit_note' : 'person_add'}
                                </span>
                                {isEditing ? 'Edit Doctor Details' : 'Add New Doctor'}
                            </h2>
                            <form onSubmit={handleFormSubmit} className="space-y-4">
                                {/* Name */}
                                <div>
                                    <label className="block text-sm font-semibold mb-1.5 text-gray-700 dark:text-gray-300">Doctor Name *</label>
                                    <input
                                        className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                        placeholder="ডা. নাম / Dr. Name"
                                        value={name}
                                        onChange={e => setName(e.target.value)}
                                        required
                                    />
                                </div>

                                {/* Specialty Dropdown */}
                                <div>
                                    <label className="block text-sm font-semibold mb-1.5 text-gray-700 dark:text-gray-300">Specialty *</label>
                                    <select
                                        className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all appearance-none cursor-pointer"
                                        value={specialty}
                                        onChange={e => setSpecialty(e.target.value)}
                                        required
                                    >
                                        <option value="">Select Specialty</option>
                                        {SPECIALTIES.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                    {specialty === 'Other' && (
                                        <input
                                            className="w-full p-3 mt-2 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                            placeholder="Enter custom specialty..."
                                            value={customSpecialty}
                                            onChange={e => setCustomSpecialty(e.target.value)}
                                            required
                                        />
                                    )}
                                </div>

                                {/* Service Category */}
                                <div>
                                    <label className="block text-sm font-semibold mb-1.5 text-gray-700 dark:text-gray-300">Service Category (For Services Page) *</label>
                                    <select
                                        className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all appearance-none cursor-pointer"
                                        value={serviceCategory}
                                        onChange={e => setServiceCategory(e.target.value)}
                                        required
                                    >
                                        <option value="">Select Category</option>
                                        {SERVICE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>

                                {/* Qualification */}
                                <div>
                                    <label className="block text-sm font-semibold mb-1.5 text-gray-700 dark:text-gray-300">Qualification</label>
                                    <input
                                        className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                        placeholder="MBBS, FCPS, MD..."
                                        value={qualification}
                                        onChange={e => setQualification(e.target.value)}
                                    />
                                </div>

                                {/* Experience & Fee Row */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-sm font-semibold mb-1.5 text-gray-700 dark:text-gray-300">Experience</label>
                                        <select
                                            className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all appearance-none cursor-pointer"
                                            value={experience}
                                            onChange={e => setExperience(e.target.value)}
                                        >
                                            <option value="">Select</option>
                                            {EXPERIENCE_OPTIONS.map(e => <option key={e} value={e}>{e}</option>)}
                                        </select>
                                        {experience === 'Other' && (
                                            <input
                                                className="w-full p-3 mt-2 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                                placeholder="e.g. 7 Years"
                                                value={customExperience}
                                                onChange={e => setCustomExperience(e.target.value)}
                                                required
                                            />
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold mb-1.5 text-gray-700 dark:text-gray-300">Fee (৳)</label>
                                        <input
                                            type="number"
                                            className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                            placeholder="500"
                                            value={fee}
                                            onChange={e => setFee(e.target.value)}
                                        />
                                    </div>
                                </div>

                                {/* Designation Dropdown */}
                                <div>
                                    <label className="block text-sm font-semibold mb-1.5 text-gray-700 dark:text-gray-300">Designation</label>
                                    <select
                                        className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all appearance-none cursor-pointer"
                                        value={designation}
                                        onChange={e => setDesignation(e.target.value)}
                                    >
                                        <option value="">Select Designation</option>
                                        {DESIGNATIONS.map(d => <option key={d} value={d}>{d}</option>)}
                                    </select>
                                    {designation === 'Other' && (
                                        <input
                                            className="w-full p-3 mt-2 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                            placeholder="Enter designation..."
                                            value={customDesignation}
                                            onChange={e => setCustomDesignation(e.target.value)}
                                            required
                                        />
                                    )}
                                </div>

                                {/* Institute */}
                                <div>
                                    <label className="block text-sm font-semibold mb-1.5 text-gray-700 dark:text-gray-300">Institute / Hospital</label>
                                    <input
                                        className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                        placeholder="Hospital / Medical College"
                                        value={institute}
                                        onChange={e => setInstitute(e.target.value)}
                                    />
                                </div>

                                {/* Image URL */}
                                <div>
                                    <label className="block text-sm font-semibold mb-1.5 text-gray-700 dark:text-gray-300">Image URL</label>
                                    <input
                                        className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                        placeholder="https://example.com/photo.jpg"
                                        value={imageUrl}
                                        onChange={e => setImageUrl(e.target.value)}
                                    />
                                </div>

                                {/* Account Section */}
                                <div className="pt-4 border-t border-gray-200 dark:border-gray-600">
                                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-purple-500 text-lg">account_circle</span>
                                        Login Account (Optional)
                                    </p>
                                    <div className="space-y-3">
                                        <div>
                                            <label className="block text-sm font-medium mb-1.5 text-gray-600 dark:text-gray-400">Email</label>
                                            <input
                                                type="email"
                                                className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                                placeholder="doctor@example.com"
                                                value={email}
                                                onChange={e => setEmail(e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1.5 text-gray-600 dark:text-gray-400">Password</label>
                                            <input
                                                type="password"
                                                className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                                placeholder="••••••••"
                                                value={password}
                                                onChange={e => setPassword(e.target.value)}
                                            />
                                        </div>
                                        <p className="text-xs text-gray-400">If email & password are provided, doctor can login to the website.</p>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    {isEditing && (
                                        <button
                                            type="button"
                                            onClick={resetForm}
                                            className="w-1/3 bg-gray-500 hover:bg-gray-600 text-white font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2"
                                        >
                                            <span className="material-symbols-outlined text-lg">close</span>
                                            Cancel
                                        </button>
                                    )}
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className={`flex-1 ${isEditing ? 'bg-blue-600 hover:bg-blue-700' : 'bg-primary hover:bg-red-700'} disabled:bg-gray-400 text-white font-bold py-3.5 rounded-xl transition-colors shadow-lg ${isEditing ? 'shadow-blue-600/20' : 'shadow-primary/20'} flex items-center justify-center gap-2`}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <span className="animate-spin material-symbols-outlined text-lg">progress_activity</span>
                                                {isEditing ? 'Updating...' : 'Adding...'}
                                            </>
                                        ) : (
                                            <>
                                                <span className="material-symbols-outlined text-lg">{isEditing ? 'save' : 'add_circle'}</span>
                                                {isEditing ? 'Update Doctor' : 'Add Doctor'}
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Live Preview Section */}
                    <div className="lg:col-span-1">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 sticky top-24">
                            <h2 className="text-lg font-bold mb-5 text-gray-800 dark:text-white flex items-center gap-2">
                                <span className="material-symbols-outlined text-blue-500">preview</span>
                                Live Card Preview
                            </h2>

                            {/* Preview Card */}
                            <div className="group flex flex-col rounded-2xl bg-gray-50 dark:bg-gray-700/50 p-5 shadow-sm border border-gray-200 dark:border-gray-600">
                                <div className="flex gap-4 mb-4">
                                    <div className="relative shrink-0">
                                        <div
                                            className="size-16 rounded-full bg-gray-200 dark:bg-gray-600 bg-cover bg-center ring-2 ring-gray-100 dark:ring-gray-700 flex items-center justify-center overflow-hidden"
                                            style={imageUrl ? { backgroundImage: `url("${imageUrl}")` } : {}}
                                        >
                                            {!imageUrl && <span className="material-symbols-outlined text-gray-400 text-3xl">person</span>}
                                        </div>
                                        <div className="absolute bottom-0 right-0 flex items-center justify-center bg-green-500 border-2 border-white dark:border-gray-800 rounded-full h-4 w-4" title="Online"></div>
                                    </div>
                                    <div className="flex flex-col justify-center min-w-0">
                                        <h3 className="text-secondary dark:text-teal-400 font-bold text-lg leading-tight truncate">
                                            {name || 'ডাক্তারের নাম'}
                                        </h3>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{designation || 'Designation'}</p>
                                        <div className="flex items-center gap-1 mt-1">
                                            <span className="material-symbols-outlined text-[16px] text-primary">verified</span>
                                            <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">Specialist</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-2 mb-5 flex-1">
                                    <div className="flex items-start gap-2">
                                        <span className="material-symbols-outlined text-gray-400 text-[18px] mt-0.5">stethoscope</span>
                                        <p className="text-sm text-gray-700 dark:text-gray-300 truncate">{specialty || 'Specialty'}</p>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <span className="material-symbols-outlined text-gray-400 text-[18px] mt-0.5">school</span>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{qualification || 'Qualification'}</p>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <span className="material-symbols-outlined text-gray-400 text-[18px] mt-0.5">work_history</span>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">{experience || 'Experience'}</p>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <span className="material-symbols-outlined text-gray-400 text-[18px] mt-0.5">apartment</span>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{institute || 'Institute'}</p>
                                    </div>
                                </div>
                                <div className="pt-4 border-t border-gray-200 dark:border-gray-600 flex items-center justify-between gap-3">
                                    <div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Consultation Fee</p>
                                        <p className="text-lg font-bold text-gray-900 dark:text-white">৳{fee || '0'}</p>
                                    </div>
                                    <button className="flex-1 bg-primary text-white font-bold py-2.5 px-4 rounded-xl text-sm shadow-md shadow-red-100 dark:shadow-none cursor-default">
                                        Consult Now
                                    </button>
                                </div>
                            </div>

                            <p className="text-xs text-gray-400 text-center mt-4">This is how the card will appear on the website</p>
                        </div>
                    </div>

                    {/* Doctor List Section */}
                    <div className="lg:col-span-1">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
                            <h2 className="text-lg font-bold mb-5 text-gray-800 dark:text-white flex items-center gap-2">
                                <span className="material-symbols-outlined text-purple-500">group</span>
                                Doctors ({doctors.length})
                            </h2>
                            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                                {doctors.map((doc: any) => (
                                    <div key={doc.doctor_id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                                        <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-600 overflow-hidden shrink-0">
                                            {doc.image_url ? (
                                                <img src={doc.image_url} className="w-full h-full object-cover" alt={doc.name} />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <span className="material-symbols-outlined text-gray-400">person</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <p className="font-bold text-gray-800 dark:text-white truncate">{doc.name}</p>
                                                {doc.email && (
                                                    <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-[10px] px-1.5 py-0.5 rounded-full font-bold" title={doc.email}>
                                                        ✉
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{doc.specialty}</p>
                                            {doc.service_category && (
                                                <p className="text-[10px] bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-bold px-1.5 py-0.5 rounded-md inline-block mt-0.5">
                                                    {doc.service_category}
                                                </p>
                                            )}
                                            {doc.email && (
                                                <p className="text-[10px] text-purple-500 truncate">{doc.email}</p>
                                            )}
                                        </div>
                                        <button
                                            onClick={() => handleEditClick(doc)}
                                            className="text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900/30 p-2 rounded-full transition-colors shrink-0"
                                            title="Edit"
                                        >
                                            <span className="material-symbols-outlined text-lg">edit</span>
                                        </button>
                                        <button
                                            onClick={() => handleDeleteDoctor(doc.doctor_id)}
                                            className="text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 p-2 rounded-full transition-colors shrink-0"
                                            title="Delete"
                                        >
                                            <span className="material-symbols-outlined text-lg">delete</span>
                                        </button>
                                    </div>
                                ))}
                                {doctors.length === 0 && (
                                    <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                                        <span className="material-symbols-outlined text-4xl mb-2">person_off</span>
                                        <p>No doctors yet</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
