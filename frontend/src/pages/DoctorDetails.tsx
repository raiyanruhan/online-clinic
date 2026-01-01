import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useModal } from '../contexts/ModalContext';

const SPECIALTIES = [
    'General Medicine', 'Gynecology & Obs.', 'Pediatrics', 'Dermatology',
    'Cardiology', 'Orthopedics', 'ENT', 'Neurology', 'Psychiatry',
    'Ophthalmology', 'Gastroenterology', 'Urology', 'Dentistry', 'Other'
];

const EXPERIENCE_OPTIONS = [
    '1-3 Years', '3-5 Years', '5-10 Years', '10-15 Years', '15+ Years', 'Other'
];

const DESIGNATIONS = [
    'Consultant', 'Senior Consultant', 'Associate Professor', 'Professor',
    'Assistant Professor', 'Registrar', 'Medical Officer', 'Other'
];

const DoctorDetails = () => {
    const { showAlert } = useModal();
    const { id } = useParams<{ id: string }>();
    const [doctor, setDoctor] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [user, setUser] = useState<any>(null);

    // Edit form state
    const [editForm, setEditForm] = useState({
        name: '',
        specialty: '',
        qualification: '',
        experience: '',
        designation: '',
        institute: '',
        image_url: '',
        fee: '',
        bio: ''
    });

    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            setUser(JSON.parse(userStr));
        }
        fetchDoctor();
    }, [id]);

    const fetchDoctor = async () => {
        try {
            const res = await fetch(`http://localhost:5000/api/doctors/${id}`);
            if (res.ok) {
                const data = await res.json();
                setDoctor(data);
                setEditForm({
                    name: data.name || '',
                    specialty: data.specialty || '',
                    qualification: data.qualification || '',
                    experience: data.experience || '',
                    designation: data.designation || '',
                    institute: data.institute || '',
                    image_url: data.image_url || '',
                    fee: data.fee?.toString() || '',
                    bio: data.bio || ''
                });
            }
        } catch (error) {
            console.error('Error fetching doctor:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const res = await fetch(`http://localhost:5000/api/doctors/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...editForm,
                    fee: parseInt(editForm.fee) || 0
                })
            });
            if (res.ok) {
                const updated = await res.json();
                setDoctor(updated);
                setIsEditing(false);
            }
        } catch (error) {
            console.error('Error updating doctor:', error);
            showAlert({ message: 'Failed to update', type: 'error' });
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        setEditForm({
            name: doctor.name || '',
            specialty: doctor.specialty || '',
            qualification: doctor.qualification || '',
            experience: doctor.experience || '',
            designation: doctor.designation || '',
            institute: doctor.institute || '',
            image_url: doctor.image_url || '',
            fee: doctor.fee?.toString() || '',
            bio: doctor.bio || ''
        });
        setIsEditing(false);
    };

    if (loading) {
        return (
            <div className="bg-background-light dark:bg-background-dark min-h-screen flex flex-col font-display">
                <Header />
                <main className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <span className="material-symbols-outlined text-5xl text-primary animate-spin">progress_activity</span>
                        <p className="mt-4 text-gray-500">Loading...</p>
                    </div>
                </main>
            </div>
        );
    }

    if (!doctor) {
        return (
            <div className="bg-background-light dark:bg-background-dark min-h-screen flex flex-col font-display">
                <Header />
                <main className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <span className="material-symbols-outlined text-5xl text-gray-400">person_off</span>
                        <p className="mt-4 text-gray-500">Doctor not found</p>
                        <Link to="/doctors" className="mt-4 inline-block text-primary font-bold hover:underline">← Back to Doctors</Link>
                    </div>
                </main>
            </div>
        );
    }

    const isAdmin = user?.role === 'admin';
    const inputClass = "w-full p-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all";
    const selectClass = "w-full p-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all appearance-none cursor-pointer";

    return (
        <div className="bg-background-light dark:bg-background-dark min-h-screen flex flex-col font-display text-text-main dark:text-gray-100">
            <Header />
            <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-10 py-8">
                {/* Breadcrumb & Edit Toggle */}
                <div className="flex items-center justify-between mb-6">
                    <nav className="text-sm">
                        <Link to="/doctors" className="text-gray-500 hover:text-primary">ডাক্তারগণ</Link>
                        <span className="mx-2 text-gray-400">/</span>
                        <span className="text-gray-700 dark:text-gray-300">{doctor.name}</span>
                    </nav>
                    {isAdmin && (
                        <button
                            onClick={() => setIsEditing(!isEditing)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-colors ${isEditing ? 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                        >
                            <span className="material-symbols-outlined text-lg">{isEditing ? 'close' : 'edit'}</span>
                            {isEditing ? 'Cancel Edit' : 'Edit Doctor'}
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Column: Doctor Details */}
                    <div className="lg:col-span-8 space-y-6">
                        {/* Profile Header Card */}
                        <div className="bg-white dark:bg-[#2a2a2a] rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
                            {isEditing ? (
                                <div className="space-y-4">
                                    <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Edit Profile</h3>

                                    <div>
                                        <label className="block text-sm font-semibold mb-1.5 text-gray-700 dark:text-gray-300">Name *</label>
                                        <input className={inputClass} value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold mb-1.5 text-gray-700 dark:text-gray-300">Specialty</label>
                                            <select className={selectClass} value={editForm.specialty} onChange={e => setEditForm({ ...editForm, specialty: e.target.value })}>
                                                <option value="">Select</option>
                                                {SPECIALTIES.map(s => <option key={s} value={s}>{s}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold mb-1.5 text-gray-700 dark:text-gray-300">Designation</label>
                                            <select className={selectClass} value={editForm.designation} onChange={e => setEditForm({ ...editForm, designation: e.target.value })}>
                                                <option value="">Select</option>
                                                {DESIGNATIONS.map(d => <option key={d} value={d}>{d}</option>)}
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold mb-1.5 text-gray-700 dark:text-gray-300">Qualification</label>
                                        <input className={inputClass} value={editForm.qualification} onChange={e => setEditForm({ ...editForm, qualification: e.target.value })} placeholder="MBBS, FCPS..." />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold mb-1.5 text-gray-700 dark:text-gray-300">Experience</label>
                                            <select className={selectClass} value={editForm.experience} onChange={e => setEditForm({ ...editForm, experience: e.target.value })}>
                                                <option value="">Select</option>
                                                {EXPERIENCE_OPTIONS.map(e => <option key={e} value={e}>{e}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold mb-1.5 text-gray-700 dark:text-gray-300">Fee (৳)</label>
                                            <input type="number" className={inputClass} value={editForm.fee} onChange={e => setEditForm({ ...editForm, fee: e.target.value })} />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold mb-1.5 text-gray-700 dark:text-gray-300">Institute / Hospital</label>
                                        <input className={inputClass} value={editForm.institute} onChange={e => setEditForm({ ...editForm, institute: e.target.value })} />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold mb-1.5 text-gray-700 dark:text-gray-300">Image URL</label>
                                        <input className={inputClass} value={editForm.image_url} onChange={e => setEditForm({ ...editForm, image_url: e.target.value })} placeholder="https://..." />
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col md:flex-row gap-6">
                                    <div className="shrink-0 flex flex-col items-center md:items-start gap-4">
                                        <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-2xl overflow-hidden shadow-md">
                                            <div
                                                className="w-full h-full bg-cover bg-center bg-gray-200"
                                                style={doctor.image_url ? { backgroundImage: `url("${doctor.image_url}")` } : {}}
                                            >
                                                {!doctor.image_url && (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <span className="material-symbols-outlined text-5xl text-gray-400">person</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col flex-1 text-center md:text-left">
                                        <h1 className="text-secondary text-2xl md:text-3xl font-bold leading-tight mb-2 flex items-center justify-center md:justify-start gap-2">
                                            {doctor.name}
                                            <span className="material-symbols-outlined text-green-500 icon-filled text-xl" title="ভেরিফাইড">verified</span>
                                        </h1>
                                        <p className="text-text-main/80 dark:text-gray-300 text-base md:text-lg mb-1">{doctor.qualification}</p>
                                        <p className="text-text-main/60 dark:text-gray-400 text-sm md:text-base font-medium mb-3">{doctor.specialty}</p>
                                        <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-2">
                                            {doctor.experience && (
                                                <div className="px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 flex items-center gap-2">
                                                    <span className="material-symbols-outlined text-secondary">medical_services</span>
                                                    <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{doctor.experience}</span>
                                                </div>
                                            )}
                                            {doctor.institute && (
                                                <div className="px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 flex items-center gap-2">
                                                    <span className="material-symbols-outlined text-secondary">apartment</span>
                                                    <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{doctor.institute}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* About Section */}
                        <div className="bg-white dark:bg-[#2a2a2a] rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
                            <h3 className="text-secondary text-xl font-bold mb-4 flex items-center gap-2">
                                <span className="material-symbols-outlined">person</span>
                                আমার সম্পর্কে
                            </h3>
                            {isEditing ? (
                                <textarea
                                    className="w-full p-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white min-h-[150px] focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                    value={editForm.bio}
                                    onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                                    placeholder="Write about yourself..."
                                />
                            ) : (
                                <div className="text-text-main/80 dark:text-gray-300 text-base leading-relaxed">
                                    {doctor.bio ? (
                                        <p>{doctor.bio}</p>
                                    ) : (
                                        <p className="text-gray-400 italic">No bio added yet.</p>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Save/Cancel Buttons */}
                        {isEditing && (
                            <div className="flex gap-4">
                                <button
                                    onClick={handleSave}
                                    disabled={isSaving}
                                    className="flex-1 bg-primary hover:bg-red-700 disabled:bg-gray-400 text-white font-bold py-3.5 rounded-xl transition-colors shadow-lg flex items-center justify-center gap-2"
                                >
                                    {isSaving ? (
                                        <>
                                            <span className="animate-spin material-symbols-outlined">progress_activity</span>
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <span className="material-symbols-outlined">save</span>
                                            Save Changes
                                        </>
                                    )}
                                </button>
                                <button
                                    onClick={handleCancel}
                                    className="px-6 py-3.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-bold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Right Column: Booking Widget */}
                    <div className="lg:col-span-4 relative h-full">
                        <div className="sticky top-24 space-y-4">
                            <div className="bg-white dark:bg-[#2a2a2a] rounded-2xl shadow-lg border border-secondary/20 overflow-hidden">
                                <div className="bg-secondary p-4 text-white text-center">
                                    <h3 className="text-lg font-bold">অ্যাপয়েন্টমেন্ট নিন</h3>
                                    {doctor.institute && (
                                        <p className="text-teal-100 text-sm">চেম্বার: {doctor.institute}</p>
                                    )}
                                </div>
                                <div className="p-5 flex flex-col gap-6">
                                    <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-800 p-3 rounded-lg border border-gray-100 dark:border-gray-700">
                                        <span className="text-gray-600 dark:text-gray-300 font-medium text-sm">কনসালটেশন ফি</span>
                                        <span className="text-primary font-bold text-lg">৳ {doctor.fee || 'N/A'}</span>
                                    </div>
                                    {user && (user.role !== 'doctor' && user.role !== 'admin') ? (
                                        <Link to={`/appointment/${id}`} className="w-full bg-primary hover:bg-red-700 text-white font-bold py-3.5 rounded-xl shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2">
                                            <span>বুক করুন</span>
                                            <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                        </Link>
                                    ) : user && (user.role === 'doctor' || user.role === 'admin') ? (
                                        <div className="w-full bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400 font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 cursor-not-allowed">
                                            <span>{user.role === 'doctor' ? 'Doctors cannot book appointments' : 'Admins cannot book appointments'}</span>
                                        </div>
                                    ) : (
                                        <Link to={`/appointment/${id}`} className="w-full bg-primary hover:bg-red-700 text-white font-bold py-3.5 rounded-xl shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2">
                                            <span>বুক করুন</span>
                                            <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                        </Link>
                                    )}
                                </div>
                            </div>

                            {/* Live Preview during edit */}
                            {isEditing && (
                                <div className="bg-white dark:bg-[#2a2a2a] rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-800">
                                    <p className="text-xs text-gray-500 text-center mb-3">Live Preview</p>
                                    <div className="flex gap-3 items-center">
                                        <div
                                            className="w-12 h-12 rounded-full bg-gray-200 bg-cover bg-center shrink-0"
                                            style={editForm.image_url ? { backgroundImage: `url("${editForm.image_url}")` } : {}}
                                        ></div>
                                        <div className="min-w-0">
                                            <p className="font-bold text-gray-800 dark:text-white truncate">{editForm.name || 'Name'}</p>
                                            <p className="text-xs text-gray-500 truncate">{editForm.specialty || 'Specialty'}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default DoctorDetails;
