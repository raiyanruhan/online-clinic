import { API_BASE_URL } from '../../config';
import { useState, useEffect } from 'react';
import { useModal } from '../../contexts/ModalContext';
import { useSearchParams, useNavigate } from 'react-router-dom';

const SPECIALTIES = [
    'General Medicine', 'Gynecology & Obs.', 'Pediatrics', 'Dermatology',
    'Cardiology', 'Orthopedics', 'ENT', 'Neurology', 'Psychiatry',
    'Ophthalmology', 'Gastroenterology', 'Urology', 'Dentistry', 'Other'
];

const SERVICE_CATEGORIES = [
    'গাইনোকোলজি', 'শিশুরোগ', 'জেনারেল মেডিসিন', 'মানসিক স্বাস্থ্য',
    'পুষ্টি ও ডায়েট', 'চর্মরোগ', 'ডায়াবেটিস কেয়ার', 'ভিডিও কনসালটেশন'
];

const EXPERIENCE_OPTIONS = [
    '1-3 Years', '3-5 Years', '5-10 Years', '10-15 Years', '15+ Years', 'Other'
];

const DESIGNATIONS = [
    'Consultant', 'Senior Consultant', 'Associate Professor', 'Professor',
    'Assistant Professor', 'Registrar', 'Medical Officer', 'Other'
];

const Doctors = () => {
    const { showAlert, showConfirm } = useModal();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [doctors, setDoctors] = useState<any[]>([]);
    const [doctorStats, setDoctorStats] = useState<any>({});

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
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        fetchDoctors();
    }, []);

    // Check for edit param in URL on mount or when doctors are loaded
    useEffect(() => {
        const editParam = searchParams.get('edit');
        if (editParam && doctors.length > 0) {
            const doctorId = parseInt(editParam);
            const doctor = doctors.find(d => d.doctor_id === doctorId);
            if (doctor) {
                handleEditClick(doctor);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams, doctors]);

    useEffect(() => {
        if (doctors.length > 0) {
            fetchDoctorStats();
        }
    }, [doctors]);

    const fetchDoctors = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/doctors`);
            const data = await res.json();
            setDoctors(data);
        } catch (error) {
            console.error('Error fetching doctors:', error);
            showAlert({ message: 'Error loading doctors', type: 'error' });
        }
    };

    const fetchDoctorStats = async () => {
        try {
            const token = localStorage.getItem('token');
            const today = new Date().toISOString().split('T')[0];
            
            const stats: any = {};
            for (const doctor of doctors) {
                const res = await fetch(`${API_BASE_URL}/api/admin/appointments?doctorId=${doctor.doctor_id}&startDate=${today}&endDate=${today}`, {
                    headers: { 'x-auth-token': token || '' }
                });
                if (res.ok) {
                    const data = await res.json();
                    stats[doctor.doctor_id] = {
                        today: data.appointments?.length || 0,
                        total: data.pagination?.total || 0
                    };
                }
            }
            setDoctorStats(stats);
        } catch (error) {
            console.error('Error fetching doctor stats:', error);
        }
    };

    const resetForm = () => {
        setName(''); setSpecialty(''); setServiceCategory(''); setCustomSpecialty(''); setQualification('');
        setExperience(''); setCustomExperience(''); setDesignation(''); setCustomDesignation(''); setInstitute('');
        setImageUrl(''); setFee('500'); setEmail(''); setPassword('');
        setIsEditing(false); setEditDoctorId(null); setShowForm(false);
        
        // Remove edit param from URL
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.delete('edit');
        const newUrl = newSearchParams.toString() ? `/admin-dashboard/doctors?${newSearchParams.toString()}` : '/admin-dashboard/doctors';
        navigate(newUrl, { replace: true });
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const url = isEditing
                ? `${API_BASE_URL}/api/doctors/${editDoctorId}`
                : `${API_BASE_URL}/api/doctors`;

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
                // Clear edit param from URL after successful save
                const newSearchParams = new URLSearchParams(searchParams);
                newSearchParams.delete('edit');
                const newUrl = newSearchParams.toString() ? `/admin-dashboard/doctors?${newSearchParams.toString()}` : '/admin-dashboard/doctors';
                navigate(newUrl, { replace: true });
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
        setEmail(doc.email || '');
        setPassword('');
        setShowForm(true);
        
        // Update URL with edit param
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.set('edit', doc.doctor_id.toString());
        navigate(`/admin-dashboard/doctors?${newSearchParams.toString()}`, { replace: true });
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
            const response = await fetch(`${API_BASE_URL}/api/doctors/${id}`, {
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
            showAlert({ message: 'Error deleting doctor', type: 'error' });
        }
    };

    return (
        <div className="space-y-4 sm:space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4">
                <div className="w-full sm:w-auto text-center sm:text-left">
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 dark:text-white">Doctors Management</h1>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">Add, edit, and manage doctors</p>
                </div>
                <button
                    onClick={() => {
                        resetForm();
                        setShowForm(true);
                    }}
                    className="w-full sm:w-auto px-3 sm:px-4 py-2 text-sm sm:text-base bg-primary text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-1.5 sm:gap-2"
                >
                    <span className="material-symbols-outlined text-base sm:text-lg">person_add</span>
                    Add Doctor
                </button>
            </div>

            {/* Add/Edit Form */}
            {showForm && (
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                    <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-5 text-gray-800 dark:text-white flex items-center gap-2">
                        <span className={`material-symbols-outlined text-base sm:text-lg ${isEditing ? 'text-blue-500' : 'text-green-500'}`}>
                            {isEditing ? 'edit_note' : 'person_add'}
                        </span>
                        <span className="text-sm sm:text-base">{isEditing ? 'Edit Doctor Details' : 'Add New Doctor'}</span>
                    </h2>
                    <form onSubmit={handleFormSubmit} className="space-y-3 sm:space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                            <div>
                                <label className="block text-xs sm:text-sm font-semibold mb-1 sm:mb-1.5 text-gray-700 dark:text-gray-300">Doctor Name *</label>
                                <input
                                    className="w-full px-2 sm:px-3 py-2 sm:py-3 text-sm border border-gray-200 dark:border-gray-600 rounded-lg sm:rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                    placeholder="ডা. নাম / Dr. Name"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs sm:text-sm font-semibold mb-1 sm:mb-1.5 text-gray-700 dark:text-gray-300">Specialty *</label>
                                <select
                                    className="w-full px-2 sm:px-3 py-2 sm:py-3 text-sm border border-gray-200 dark:border-gray-600 rounded-lg sm:rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                    value={specialty}
                                    onChange={e => setSpecialty(e.target.value)}
                                    required
                                >
                                    <option value="">Select Specialty</option>
                                    {SPECIALTIES.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                                {specialty === 'Other' && (
                                    <input
                                        className="w-full px-2 sm:px-3 py-2 sm:py-3 mt-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg sm:rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                        placeholder="Enter custom specialty..."
                                        value={customSpecialty}
                                        onChange={e => setCustomSpecialty(e.target.value)}
                                        required
                                    />
                                )}
                            </div>

                            <div>
                                <label className="block text-xs sm:text-sm font-semibold mb-1 sm:mb-1.5 text-gray-700 dark:text-gray-300">Service Category *</label>
                                <select
                                    className="w-full px-2 sm:px-3 py-2 sm:py-3 text-sm border border-gray-200 dark:border-gray-600 rounded-lg sm:rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                    value={serviceCategory}
                                    onChange={e => setServiceCategory(e.target.value)}
                                    required
                                >
                                    <option value="">Select Category</option>
                                    {SERVICE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs sm:text-sm font-semibold mb-1 sm:mb-1.5 text-gray-700 dark:text-gray-300">Qualification</label>
                                <input
                                    className="w-full px-2 sm:px-3 py-2 sm:py-3 text-sm border border-gray-200 dark:border-gray-600 rounded-lg sm:rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                    placeholder="MBBS, FCPS, MD..."
                                    value={qualification}
                                    onChange={e => setQualification(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="block text-xs sm:text-sm font-semibold mb-1 sm:mb-1.5 text-gray-700 dark:text-gray-300">Experience</label>
                                <select
                                    className="w-full px-2 sm:px-3 py-2 sm:py-3 text-sm border border-gray-200 dark:border-gray-600 rounded-lg sm:rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                    value={experience}
                                    onChange={e => setExperience(e.target.value)}
                                >
                                    <option value="">Select</option>
                                    {EXPERIENCE_OPTIONS.map(e => <option key={e} value={e}>{e}</option>)}
                                </select>
                                {experience === 'Other' && (
                                    <input
                                        className="w-full px-2 sm:px-3 py-2 sm:py-3 mt-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg sm:rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                        placeholder="e.g. 7 Years"
                                        value={customExperience}
                                        onChange={e => setCustomExperience(e.target.value)}
                                        required
                                    />
                                )}
                            </div>

                            <div>
                                <label className="block text-xs sm:text-sm font-semibold mb-1 sm:mb-1.5 text-gray-700 dark:text-gray-300">Fee (৳)</label>
                                <input
                                    type="number"
                                    className="w-full px-2 sm:px-3 py-2 sm:py-3 text-sm border border-gray-200 dark:border-gray-600 rounded-lg sm:rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                    placeholder="500"
                                    value={fee}
                                    onChange={e => setFee(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="block text-xs sm:text-sm font-semibold mb-1 sm:mb-1.5 text-gray-700 dark:text-gray-300">Designation</label>
                                <select
                                    className="w-full px-2 sm:px-3 py-2 sm:py-3 text-sm border border-gray-200 dark:border-gray-600 rounded-lg sm:rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                    value={designation}
                                    onChange={e => setDesignation(e.target.value)}
                                >
                                    <option value="">Select Designation</option>
                                    {DESIGNATIONS.map(d => <option key={d} value={d}>{d}</option>)}
                                </select>
                                {designation === 'Other' && (
                                    <input
                                        className="w-full px-2 sm:px-3 py-2 sm:py-3 mt-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg sm:rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                        placeholder="Enter designation..."
                                        value={customDesignation}
                                        onChange={e => setCustomDesignation(e.target.value)}
                                        required
                                    />
                                )}
                            </div>

                            <div>
                                <label className="block text-xs sm:text-sm font-semibold mb-1 sm:mb-1.5 text-gray-700 dark:text-gray-300">Institute / Hospital</label>
                                <input
                                    className="w-full px-2 sm:px-3 py-2 sm:py-3 text-sm border border-gray-200 dark:border-gray-600 rounded-lg sm:rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                    placeholder="Hospital / Medical College"
                                    value={institute}
                                    onChange={e => setInstitute(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="block text-xs sm:text-sm font-semibold mb-1 sm:mb-1.5 text-gray-700 dark:text-gray-300">Image URL</label>
                                <input
                                    className="w-full px-2 sm:px-3 py-2 sm:py-3 text-sm border border-gray-200 dark:border-gray-600 rounded-lg sm:rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                    placeholder="https://example.com/photo.jpg"
                                    value={imageUrl}
                                    onChange={e => setImageUrl(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="pt-3 sm:pt-4 border-t border-gray-200 dark:border-gray-600">
                            <p className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 sm:mb-3 flex items-center gap-1.5 sm:gap-2">
                                <span className="material-symbols-outlined text-purple-500 text-base sm:text-lg">account_circle</span>
                                Login Account (Optional)
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                                <div>
                                    <label className="block text-xs sm:text-sm font-medium mb-1 sm:mb-1.5 text-gray-600 dark:text-gray-400">Email</label>
                                    <input
                                        type="email"
                                        className="w-full px-2 sm:px-3 py-2 sm:py-3 text-sm border border-gray-200 dark:border-gray-600 rounded-lg sm:rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                        placeholder="doctor@example.com"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs sm:text-sm font-medium mb-1 sm:mb-1.5 text-gray-600 dark:text-gray-400">Password</label>
                                    <input
                                        type="password"
                                        className="w-full px-2 sm:px-3 py-2 sm:py-3 text-sm border border-gray-200 dark:border-gray-600 rounded-lg sm:rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                    />
                                </div>
                            </div>
                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">If email & password are provided, doctor can login to the website.</p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                            <button
                                type="button"
                                onClick={resetForm}
                                className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base bg-gray-500 hover:bg-gray-600 text-white font-bold rounded-lg sm:rounded-xl transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`w-full sm:flex-1 ${isEditing ? 'bg-blue-600 hover:bg-blue-700' : 'bg-primary hover:bg-red-700'} disabled:bg-gray-400 text-white font-bold py-2.5 sm:py-3 rounded-lg sm:rounded-xl transition-colors flex items-center justify-center gap-1.5 sm:gap-2 text-sm sm:text-base`}
                            >
                                {isSubmitting ? (
                                    <>
                                        <span className="animate-spin material-symbols-outlined text-base sm:text-lg">progress_activity</span>
                                        <span>{isEditing ? 'Updating...' : 'Adding...'}</span>
                                    </>
                                ) : (
                                    <>
                                        <span className="material-symbols-outlined text-base sm:text-lg">{isEditing ? 'save' : 'add_circle'}</span>
                                        <span>{isEditing ? 'Update Doctor' : 'Add Doctor'}</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Doctors List */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-5 text-gray-800 dark:text-white flex items-center gap-2">
                    <span className="material-symbols-outlined text-purple-500 text-base sm:text-lg">group</span>
                    <span className="text-sm sm:text-base">Doctors ({doctors.length})</span>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    {doctors.map((doc: any) => (
                        <div key={doc.doctor_id} className="border border-gray-200 dark:border-gray-700 rounded-lg sm:rounded-xl p-3 sm:p-4 hover:shadow-md transition-shadow">
                            <div className="flex items-start gap-2 sm:gap-3">
                                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gray-200 dark:bg-gray-600 overflow-hidden shrink-0">
                                    {doc.image_url ? (
                                        <img src={doc.image_url} className="w-full h-full object-cover" alt={doc.name} />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <span className="material-symbols-outlined text-gray-400 text-xl sm:text-2xl">person</span>
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-1.5 sm:gap-2 mb-0.5 sm:mb-1">
                                        <p className="font-bold text-sm sm:text-base text-gray-800 dark:text-white truncate">{doc.name}</p>
                                        {doc.email && (
                                            <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-[9px] sm:text-[10px] px-1 sm:px-1.5 py-0.5 rounded-full font-bold shrink-0" title={doc.email}>
                                                ✉
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{doc.specialty}</p>
                                    {doc.service_category && (
                                        <p className="text-[9px] sm:text-[10px] bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-bold px-1 sm:px-1.5 py-0.5 rounded-md inline-block mt-0.5 break-words">
                                            {doc.service_category}
                                        </p>
                                    )}
                                    {doctorStats[doc.doctor_id] && (
                                        <div className="mt-1.5 sm:mt-2 text-xs text-gray-600 dark:text-gray-400">
                                            <span className="font-bold">Today:</span> {doctorStats[doc.doctor_id].today} | 
                                            <span className="font-bold ml-1">Total:</span> {doctorStats[doc.doctor_id].total}
                                        </div>
                                    )}
                                </div>
                                <div className="flex flex-col gap-1 shrink-0">
                                    <button
                                        onClick={() => handleEditClick(doc)}
                                        className="text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900/30 p-1.5 sm:p-2 rounded-full transition-colors"
                                        title="Edit"
                                    >
                                        <span className="material-symbols-outlined text-base sm:text-lg">edit</span>
                                    </button>
                                    <button
                                        onClick={() => handleDeleteDoctor(doc.doctor_id)}
                                        className="text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 p-1.5 sm:p-2 rounded-full transition-colors"
                                        title="Delete"
                                    >
                                        <span className="material-symbols-outlined text-base sm:text-lg">delete</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                {doctors.length === 0 && (
                    <div className="p-6 sm:p-8 text-center text-gray-500 dark:text-gray-400">
                        <span className="material-symbols-outlined text-3xl sm:text-4xl mb-2 block">person_off</span>
                        <p className="text-sm sm:text-base">No doctors yet</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Doctors;
