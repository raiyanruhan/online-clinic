import { useState, useEffect, useMemo } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Link, useSearchParams } from 'react-router-dom';

// const SPECIALTIES = [
//     'General Medicine', 'Gynecology & Obs.', 'Pediatrics', 'Dermatology',
//     'Cardiology', 'Orthopedics', 'ENT', 'Neurology', 'Psychiatry',
//     'Ophthalmology', 'Gastroenterology', 'Urology', 'Dentistry'
// ];

const EXPERIENCE_OPTIONS = [
    '1-3 Years', '3-5 Years', '5-10 Years', '10-15 Years', '15+ Years'
];

const Doctors = () => {
    const [doctors, setDoctors] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Filter states
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
    const [selectedExperience, setSelectedExperience] = useState<string[]>([]);
    const [feeRange, setFeeRange] = useState<[number, number]>([0, 5000]);

    const [searchParams] = useSearchParams();

    useEffect(() => {
        const specialtyParam = searchParams.get('specialty');
        if (specialtyParam) {
            setSelectedSpecialties([specialtyParam]);
        }
        // Category param is handled directly in filteredDoctors
        fetchDoctors();
    }, [searchParams]);

    const fetchDoctors = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/doctors');
            const data = await res.json();
            setDoctors(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching doctors:', error);
            setLoading(false);
        }
    };

    // Get unique specialties from doctors data
    const availableSpecialties = useMemo(() => {
        const specs = new Set(doctors.map(d => d.specialty).filter(Boolean));
        return Array.from(specs);
    }, [doctors]);

    // Filtered doctors
    const filteredDoctors = useMemo(() => {
        return doctors.filter(doctor => {
            // Search filter
            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                const matchesSearch =
                    doctor.name?.toLowerCase().includes(query) ||
                    doctor.specialty?.toLowerCase().includes(query) ||
                    doctor.qualification?.toLowerCase().includes(query) ||
                    doctor.institute?.toLowerCase().includes(query);
                if (!matchesSearch) return false;
            }

            // Service Category filter (from URL query 'category')
            const categoryParam = searchParams.get('category');
            if (categoryParam) {
                if (doctor.service_category !== categoryParam) return false;
            }

            // Specialty filter
            if (selectedSpecialties.length > 0) {
                if (!selectedSpecialties.includes(doctor.specialty)) return false;
            }

            // Experience filter
            if (selectedExperience.length > 0) {
                if (!selectedExperience.includes(doctor.experience)) return false;
            }

            // Fee filter
            const fee = doctor.fee || 0;
            if (fee < feeRange[0] || fee > feeRange[1]) return false;

            return true;
        });
    }, [doctors, searchQuery, selectedSpecialties, selectedExperience, feeRange, searchParams]);

    const toggleSpecialty = (spec: string) => {
        setSelectedSpecialties(prev =>
            prev.includes(spec) ? prev.filter(s => s !== spec) : [...prev, spec]
        );
    };

    const toggleExperience = (exp: string) => {
        setSelectedExperience(prev =>
            prev.includes(exp) ? prev.filter(e => e !== exp) : [...prev, exp]
        );
    };

    const resetFilters = () => {
        setSearchQuery('');
        setSelectedSpecialties([]);
        setSelectedExperience([]);
        setFeeRange([0, 5000]);
    };

    const activeFiltersCount = selectedSpecialties.length + selectedExperience.length + (searchQuery ? 1 : 0);

    return (
        <div className="bg-background-light dark:bg-background-dark min-h-screen flex flex-col font-display text-text-main dark:text-gray-100">
            <Header />

            <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-secondary dark:text-teal-400 text-3xl md:text-4xl font-bold font-bangla mb-2">আমাদের বিশেষজ্ঞ ডাক্তারগণ</h1>
                    <p className="text-[#666666] dark:text-gray-400 text-base md:text-lg max-w-2xl font-bangla">
                        আপনার এবং আপনার পরিবারের জন্য সঠিক বিশেষজ্ঞ ডাক্তার খুঁজে নিন এবং পরামর্শ করুন।
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8 relative">
                    {/* Sidebar Filters (Sticky on Desktop) */}
                    <aside className="w-full lg:w-72 flex-shrink-0">
                        <div className="lg:sticky lg:top-24 bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-5 border border-[#e4dcdc] dark:border-gray-700 space-y-5">
                            <div className="flex items-center justify-between">
                                <h3 className="font-bold text-lg text-[#171212] dark:text-white flex items-center gap-2">
                                    <span className="material-symbols-outlined text-gray-500">filter_list</span>
                                    Filter
                                    {activeFiltersCount > 0 && (
                                        <span className="bg-primary text-white text-xs px-2 py-0.5 rounded-full">{activeFiltersCount}</span>
                                    )}
                                </h3>
                                <button onClick={resetFilters} className="text-sm text-primary hover:text-red-700 font-medium">Reset</button>
                            </div>

                            {/* Search */}
                            <div>
                                <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Search</label>
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg">search</span>
                                    <input
                                        type="text"
                                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
                                        placeholder="Search doctors..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Specialty Filter */}
                            <div>
                                <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Specialty</label>
                                <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                                    {availableSpecialties.map(spec => (
                                        <label key={spec} className="flex items-center gap-2 cursor-pointer group">
                                            <input
                                                type="checkbox"
                                                checked={selectedSpecialties.includes(spec)}
                                                onChange={() => toggleSpecialty(spec)}
                                                className="rounded text-primary border-gray-300 focus:ring-primary h-4 w-4 cursor-pointer"
                                            />
                                            <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-primary transition-colors">{spec}</span>
                                        </label>
                                    ))}
                                    {availableSpecialties.length === 0 && (
                                        <p className="text-xs text-gray-400">No specialties available</p>
                                    )}
                                </div>
                            </div>

                            {/* Experience Filter */}
                            <div>
                                <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Experience</label>
                                <div className="space-y-2">
                                    {EXPERIENCE_OPTIONS.map(exp => (
                                        <label key={exp} className="flex items-center gap-2 cursor-pointer group">
                                            <input
                                                type="checkbox"
                                                checked={selectedExperience.includes(exp)}
                                                onChange={() => toggleExperience(exp)}
                                                className="rounded text-primary border-gray-300 focus:ring-primary h-4 w-4 cursor-pointer"
                                            />
                                            <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-primary transition-colors">{exp}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Fee Range */}
                            <div>
                                <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                                    Fee Range: ৳{feeRange[0]} - ৳{feeRange[1]}
                                </label>
                                <input
                                    type="range"
                                    min="0"
                                    max="5000"
                                    step="100"
                                    value={feeRange[1]}
                                    onChange={(e) => setFeeRange([0, parseInt(e.target.value)])}
                                    className="w-full accent-primary"
                                />
                            </div>
                        </div>
                    </aside>

                    {/* Main Content Area */}
                    <section className="flex-1">
                        {/* Sorting & Count Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-[#e4dcdc] dark:border-gray-700">
                            <p className="text-[#333333] dark:text-gray-300 text-sm font-medium">
                                Showing <span className="font-bold text-primary">{filteredDoctors.length}</span> of {doctors.length} doctors
                            </p>
                            {activeFiltersCount > 0 && (
                                <button onClick={resetFilters} className="text-sm text-gray-500 hover:text-primary flex items-center gap-1">
                                    <span className="material-symbols-outlined text-base">close</span>
                                    Clear filters
                                </button>
                            )}
                        </div>

                        {/* Doctor Grid */}
                        {loading ? (
                            <div className="flex items-center justify-center py-20">
                                <span className="material-symbols-outlined text-5xl text-primary animate-spin">progress_activity</span>
                            </div>
                        ) : filteredDoctors.length === 0 ? (
                            <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
                                <span className="material-symbols-outlined text-5xl text-gray-300 mb-4">search_off</span>
                                <p className="text-gray-500 mb-4">No doctors found matching your criteria.</p>
                                <button onClick={resetFilters} className="text-primary font-bold hover:underline">Clear filters</button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {filteredDoctors.map((doctor) => (
                                    <Link key={doctor.doctor_id} to={`/doctors/${doctor.doctor_id}`} className="group flex flex-col rounded-2xl bg-white dark:bg-gray-800 p-5 shadow-sm border border-[#e4dcdc] dark:border-gray-700 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                                        <div className="flex gap-4 mb-4">
                                            <div className="relative shrink-0">
                                                <div className="size-16 rounded-full bg-gray-100 bg-cover bg-center ring-2 ring-gray-50 dark:ring-gray-700" style={{ backgroundImage: `url("${doctor.image_url || 'https://via.placeholder.com/150'}")` }}></div>
                                                <div className="absolute bottom-0 right-0 flex items-center justify-center bg-green-500 border-2 border-white dark:border-gray-800 rounded-full h-4 w-4" title="Online"></div>
                                            </div>
                                            <div className="flex flex-col justify-center">
                                                <h3 className="text-secondary dark:text-teal-400 font-bold text-lg font-bangla leading-tight group-hover:text-primary transition-colors">{doctor.name}</h3>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 font-display">{doctor.designation}</p>
                                                <div className="flex items-center gap-1 mt-1">
                                                    <span className="material-symbols-outlined text-[16px] text-primary">verified</span>
                                                    <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">Specialist</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-2 mb-5 flex-1">
                                            <div className="flex items-start gap-2">
                                                <span className="material-symbols-outlined text-gray-400 text-[18px] mt-0.5">stethoscope</span>
                                                <p className="text-sm text-gray-700 dark:text-gray-300">{doctor.specialty}</p>
                                            </div>
                                            <div className="flex items-start gap-2">
                                                <span className="material-symbols-outlined text-gray-400 text-[18px] mt-0.5">school</span>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">{doctor.qualification}</p>
                                            </div>
                                            <div className="flex items-start gap-2">
                                                <span className="material-symbols-outlined text-gray-400 text-[18px] mt-0.5">work_history</span>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">{doctor.experience}</p>
                                            </div>
                                            <div className="flex items-start gap-2">
                                                <span className="material-symbols-outlined text-gray-400 text-[18px] mt-0.5">apartment</span>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">{doctor.institute}</p>
                                            </div>
                                        </div>
                                        <div className="pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between gap-3">
                                            <div>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">Consultation Fee</p>
                                                <p className="text-lg font-bold text-gray-900 dark:text-white font-bangla">৳{doctor.fee}</p>
                                            </div>
                                            <button className="flex-1 bg-primary hover:bg-red-700 active:scale-95 text-white font-bold py-2.5 px-4 rounded-xl text-sm transition-all shadow-md shadow-red-100 dark:shadow-none">
                                                Consult Now
                                            </button>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </section>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Doctors;
