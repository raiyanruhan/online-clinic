import Header from '../components/Header';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';

const Doctors = () => {
    return (
        <div className="bg-background-light dark:bg-background-dark min-h-screen flex flex-col font-display text-text-main dark:text-gray-100">
            <Header />
            
            <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-secondary dark:text-teal-400 text-3xl md:text-4xl font-bold font-bangla mb-2">আমাদের বিশেষজ্ঞ ডাক্তারগণ</h1>
                    <p className="text-[#666666] dark:text-gray-400 text-base md:text-lg max-w-2xl font-bangla">
                        আপনার এবং আপনার পরিবারের জন্য সঠিক বিশেষজ্ঞ ডাক্তার খুঁজে নিন এবং পরামর্শ করুন।
                        <span className="font-display text-sm text-gray-500 block mt-1">(Find the right expert for you and your family and consult.)</span>
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8 relative">
                    {/* Sidebar Filters (Sticky on Desktop) */}
                    <aside className="w-full lg:w-72 flex-shrink-0">
                        <div className="lg:sticky lg:top-24 bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-5 border border-[#e4dcdc] dark:border-gray-700">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-bold text-lg text-[#171212] dark:text-white flex items-center gap-2">
                                    <span className="material-symbols-outlined text-gray-500">filter_list</span>
                                    Filter
                                </h3>
                                <button className="text-sm text-primary hover:text-red-700 font-medium">Reset</button>
                            </div>
                            <div className="space-y-4">
                                {/* Specialty Filter */}
                                <details className="group open:bg-white dark:open:bg-gray-800 rounded-xl transition-all duration-200" open>
                                    <summary className="flex cursor-pointer items-center justify-between py-3 px-2 font-medium text-[#171212] dark:text-gray-200">
                                        <span className="text-sm font-semibold">Specialty</span>
                                        <span className="material-symbols-outlined transition-transform group-open:rotate-180 text-gray-400">expand_more</span>
                                    </summary>
                                    <div className="px-2 pb-4 pt-1 space-y-3">
                                        <label className="flex items-center gap-3 cursor-pointer group/item">
                                            <input className="size-5 rounded border-gray-300 text-primary focus:ring-primary/20 cursor-pointer" type="checkbox"/>
                                            <span className="text-sm text-gray-600 dark:text-gray-300 group-hover/item:text-primary transition-colors">General Medicine</span>
                                        </label>
                                        <label className="flex items-center gap-3 cursor-pointer group/item">
                                            <input defaultChecked className="size-5 rounded border-gray-300 text-primary focus:ring-primary/20 cursor-pointer" type="checkbox"/>
                                            <span className="text-sm text-gray-600 dark:text-gray-300 group-hover/item:text-primary transition-colors">Gynecology & Obs.</span>
                                        </label>
                                        <label className="flex items-center gap-3 cursor-pointer group/item">
                                            <input className="size-5 rounded border-gray-300 text-primary focus:ring-primary/20 cursor-pointer" type="checkbox"/>
                                            <span className="text-sm text-gray-600 dark:text-gray-300 group-hover/item:text-primary transition-colors">Pediatrics</span>
                                        </label>
                                        <label className="flex items-center gap-3 cursor-pointer group/item">
                                            <input className="size-5 rounded border-gray-300 text-primary focus:ring-primary/20 cursor-pointer" type="checkbox"/>
                                            <span className="text-sm text-gray-600 dark:text-gray-300 group-hover/item:text-primary transition-colors">Dermatology</span>
                                        </label>
                                    </div>
                                </details>
                                <div className="h-px bg-gray-200 dark:bg-gray-700"></div>
                                {/* Availability Filter */}
                                <details className="group rounded-xl transition-all duration-200" open>
                                    <summary className="flex cursor-pointer items-center justify-between py-3 px-2 font-medium text-[#171212] dark:text-gray-200">
                                        <span className="text-sm font-semibold">Availability</span>
                                        <span className="material-symbols-outlined transition-transform group-open:rotate-180 text-gray-400">expand_more</span>
                                    </summary>
                                    <div className="px-2 pb-4 pt-1 space-y-3">
                                        <label className="flex items-center gap-3 cursor-pointer group/item">
                                            <input className="size-5 rounded border-gray-300 text-primary focus:ring-primary/20 cursor-pointer" type="checkbox"/>
                                            <span className="text-sm text-gray-600 dark:text-gray-300 group-hover/item:text-primary transition-colors">Available Today</span>
                                        </label>
                                        <label className="flex items-center gap-3 cursor-pointer group/item">
                                            <input className="size-5 rounded border-gray-300 text-primary focus:ring-primary/20 cursor-pointer" type="checkbox"/>
                                            <span className="text-sm text-gray-600 dark:text-gray-300 group-hover/item:text-primary transition-colors">Online Now</span>
                                        </label>
                                    </div>
                                </details>
                                <div className="h-px bg-gray-200 dark:bg-gray-700"></div>
                                {/* Experience Filter */}
                                <details className="group rounded-xl transition-all duration-200">
                                    <summary className="flex cursor-pointer items-center justify-between py-3 px-2 font-medium text-[#171212] dark:text-gray-200">
                                        <span className="text-sm font-semibold">Experience Level</span>
                                        <span className="material-symbols-outlined transition-transform group-open:rotate-180 text-gray-400">expand_more</span>
                                    </summary>
                                    <div className="px-2 pb-4 pt-1 space-y-3">
                                        <label className="flex items-center gap-3 cursor-pointer group/item">
                                            <input className="size-5 rounded border-gray-300 text-primary focus:ring-primary/20 cursor-pointer" type="checkbox"/>
                                            <span className="text-sm text-gray-600 dark:text-gray-300 group-hover/item:text-primary transition-colors">5+ Years</span>
                                        </label>
                                        <label className="flex items-center gap-3 cursor-pointer group/item">
                                            <input className="size-5 rounded border-gray-300 text-primary focus:ring-primary/20 cursor-pointer" type="checkbox"/>
                                            <span className="text-sm text-gray-600 dark:text-gray-300 group-hover/item:text-primary transition-colors">10+ Years</span>
                                        </label>
                                    </div>
                                </details>
                            </div>
                        </div>
                    </aside>

                    {/* Main Content Area */}
                    <section className="flex-1">
                        {/* Sorting & Count Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-[#e4dcdc] dark:border-gray-700">
                            <p className="text-[#333333] dark:text-gray-300 text-sm font-medium">
                                Showing <span className="font-bold text-primary">12</span> doctors
                            </p>
                            <div className="flex items-center gap-2">
                                <label className="text-sm text-gray-500 whitespace-nowrap" htmlFor="sort">Sort by:</label>
                                <div className="relative min-w-[180px]">
                                    <select className="w-full appearance-none rounded-lg border border-[#e4dcdc] bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white py-2 pl-3 pr-10 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" id="sort">
                                        <option>Relevance</option>
                                        <option>Price: Low to High</option>
                                        <option>Price: High to Low</option>
                                        <option>Experience</option>
                                    </select>
                                    <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-400">
                                        <span className="material-symbols-outlined text-lg">unfold_more</span>
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Doctor Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {/* Doctor Card 1 */}
                            <Link to="/doctor-details" className="group flex flex-col rounded-2xl bg-white dark:bg-gray-800 p-5 shadow-sm border border-[#e4dcdc] dark:border-gray-700 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                                <div className="flex gap-4 mb-4">
                                    <div className="relative shrink-0">
                                        <div className="size-16 rounded-full bg-gray-100 bg-cover bg-center ring-2 ring-gray-50 dark:ring-gray-700" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDbkMeR-QSWnhmFavbHYdEkWJ4FKaHCPAvis3ATN8d9JWERqr57NlO_W-NI8thFHDDbgsopPNKuqv-5CFacKa9p1X485--GYSS3vLz1kU50DndhBYTWGsIce2lmTCP6ErcvZaG1Z0QUnh8qutIedeqrhF7QajqSc8b3MvzgZ2_zOkKSU8LAn0_fWo3FbpxZHcKHDxrj6l6yYOgHcFqTF_xnOcHeGHuUU6yZlwnRq84Q0ZWywh6a8flQh-M8fXzTRL5I0hooCET4mfY")'}}></div>
                                        <div className="absolute bottom-0 right-0 flex items-center justify-center bg-green-500 border-2 border-white dark:border-gray-800 rounded-full h-4 w-4" title="Online"></div>
                                    </div>
                                    <div className="flex flex-col justify-center">
                                        <h3 className="text-secondary dark:text-teal-400 font-bold text-lg font-bangla leading-tight group-hover:text-primary transition-colors">ডা. হুমাইরা খান</h3>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 font-display">Dr. Humaira Khan</p>
                                        <div className="flex items-center gap-1 mt-1">
                                            <span className="material-symbols-outlined text-[16px] text-primary">verified</span>
                                            <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">Specialist</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-2 mb-5 flex-1">
                                    <div className="flex items-start gap-2">
                                        <span className="material-symbols-outlined text-gray-400 text-[18px] mt-0.5">stethoscope</span>
                                        <p className="text-sm text-gray-700 dark:text-gray-300">Gynecology & Obs.</p>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <span className="material-symbols-outlined text-gray-400 text-[18px] mt-0.5">school</span>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">MBBS, FCPS (Gynae)</p>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <span className="material-symbols-outlined text-gray-400 text-[18px] mt-0.5">work_history</span>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">8 Years Experience</p>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <span className="material-symbols-outlined text-gray-400 text-[18px] mt-0.5">schedule</span>
                                        <p className="text-xs font-medium text-green-600 bg-green-50 dark:bg-green-900/30 px-2 py-0.5 rounded">Available Today</p>
                                    </div>
                                </div>
                                <div className="pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between gap-3">
                                    <div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Consultation Fee</p>
                                        <p className="text-lg font-bold text-gray-900 dark:text-white font-bangla">৳৬০০</p>
                                    </div>
                                    <button className="flex-1 bg-primary hover:bg-red-700 active:scale-95 text-white font-bold py-2.5 px-4 rounded-xl text-sm transition-all shadow-md shadow-red-100 dark:shadow-none">
                                        Consult Now
                                    </button>
                                </div>
                            </Link>

                            {/* Doctor Card 2 */}
                             <Link to="/doctor-details" className="group flex flex-col rounded-2xl bg-white dark:bg-gray-800 p-5 shadow-sm border border-[#e4dcdc] dark:border-gray-700 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                                <div className="flex gap-4 mb-4">
                                    <div className="relative shrink-0">
                                        <div className="size-16 rounded-full bg-gray-100 bg-cover bg-center ring-2 ring-gray-50 dark:ring-gray-700" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDMqr8p0dkKa5TDMlU541in2yA3erx2g3RPRmk1CDRqpwoIU3j__WJ4Lzxr_QIb8OLlKZUZQUBC81auLv7D4JbsdGzjpEcWQar7xDv1dZ_Ya0RRKoXjfP7PFhXygy_wG92GFftse2JD974cEUeaP81LhfP_506xWvWmWfVxPSCvAZrWjuXFnt4VY2qg1NdVSlxhr8YNhvru9kKnorM9jQWTPlPU72HNRAvMoo0RdtzSxA8NyoNM5jZfBrDCn5MPhLu_TuL_SyIRqUg")'}}></div>
                                        <div className="absolute bottom-0 right-0 flex items-center justify-center bg-gray-400 border-2 border-white dark:border-gray-800 rounded-full h-4 w-4" title="Offline"></div>
                                    </div>
                                    <div className="flex flex-col justify-center">
                                        <h3 className="text-secondary dark:text-teal-400 font-bold text-lg font-bangla leading-tight group-hover:text-primary transition-colors">ডা. আহমেদ রহমান</h3>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 font-display">Dr. Ahmed Rahman</p>
                                        <div className="flex items-center gap-1 mt-1">
                                            <span className="material-symbols-outlined text-[16px] text-primary">verified</span>
                                            <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">Specialist</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-2 mb-5 flex-1">
                                    <div className="flex items-start gap-2">
                                        <span className="material-symbols-outlined text-gray-400 text-[18px] mt-0.5">stethoscope</span>
                                        <p className="text-sm text-gray-700 dark:text-gray-300">General Medicine</p>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <span className="material-symbols-outlined text-gray-400 text-[18px] mt-0.5">school</span>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">MBBS, MD (Medicine)</p>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <span className="material-symbols-outlined text-gray-400 text-[18px] mt-0.5">work_history</span>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">12 Years Experience</p>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <span className="material-symbols-outlined text-gray-400 text-[18px] mt-0.5">schedule</span>
                                        <p className="text-xs font-medium text-blue-600 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded">Tomorrow at 10 AM</p>
                                    </div>
                                </div>
                                <div className="pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between gap-3">
                                    <div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Consultation Fee</p>
                                        <p className="text-lg font-bold text-gray-900 dark:text-white font-bangla">৳৮০০</p>
                                    </div>
                                    <button className="flex-1 bg-primary hover:bg-red-700 active:scale-95 text-white font-bold py-2.5 px-4 rounded-xl text-sm transition-all shadow-md shadow-red-100 dark:shadow-none">
                                        Consult Now
                                    </button>
                                </div>
                            </Link>

                             {/* Doctor Card 3 */}
                             <Link to="/doctor-details" className="group flex flex-col rounded-2xl bg-white dark:bg-gray-800 p-5 shadow-sm border border-[#e4dcdc] dark:border-gray-700 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                                <div className="flex gap-4 mb-4">
                                    <div className="relative shrink-0">
                                        <div className="size-16 rounded-full bg-gray-100 bg-cover bg-center ring-2 ring-gray-50 dark:ring-gray-700" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBkwOuSxzfDWDbalWquHCcc7j66edt3LQ9CiS2okl0BN89Tpv4-fv-r6gmZfspt8OGYmhiPbE05nBIWW1mU9s1j62INKSQjL_2pwUTq7SmskZyhjnK4tJ06xb2frsASlBlIn6V0UyZqZl51IE1akrI10SJooX3yISYrn7EanInn7HquzilflkT4bJtCY5EEpx2ouT1lDZVyAPJpkLn4MAknre_ORxQg03ZKMT8O92cnrbwDpY-Y4kK2vhr2crqUTGjVAmUtmjis4YE")'}}></div>
                                        <div className="absolute bottom-0 right-0 flex items-center justify-center bg-green-500 border-2 border-white dark:border-gray-800 rounded-full h-4 w-4" title="Online"></div>
                                    </div>
                                    <div className="flex flex-col justify-center">
                                        <h3 className="text-secondary dark:text-teal-400 font-bold text-lg font-bangla leading-tight group-hover:text-primary transition-colors">ডা. নুসরাত জাহান</h3>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 font-display">Dr. Nusrat Jahan</p>
                                        <div className="flex items-center gap-1 mt-1">
                                            <span className="material-symbols-outlined text-[16px] text-primary">verified</span>
                                            <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">Specialist</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-2 mb-5 flex-1">
                                    <div className="flex items-start gap-2">
                                        <span className="material-symbols-outlined text-gray-400 text-[18px] mt-0.5">stethoscope</span>
                                        <p className="text-sm text-gray-700 dark:text-gray-300">Pediatrics</p>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <span className="material-symbols-outlined text-gray-400 text-[18px] mt-0.5">school</span>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">MBBS, DCH (Child Health)</p>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <span className="material-symbols-outlined text-gray-400 text-[18px] mt-0.5">work_history</span>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">6 Years Experience</p>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <span className="material-symbols-outlined text-gray-400 text-[18px] mt-0.5">schedule</span>
                                        <p className="text-xs font-medium text-green-600 bg-green-50 dark:bg-green-900/30 px-2 py-0.5 rounded">Available Today</p>
                                    </div>
                                </div>
                                <div className="pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between gap-3">
                                    <div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Consultation Fee</p>
                                        <p className="text-lg font-bold text-gray-900 dark:text-white font-bangla">৳৫০০</p>
                                    </div>
                                    <button className="flex-1 bg-primary hover:bg-red-700 active:scale-95 text-white font-bold py-2.5 px-4 rounded-xl text-sm transition-all shadow-md shadow-red-100 dark:shadow-none">
                                        Consult Now
                                    </button>
                                </div>
                            </Link>

                        </div>

                        {/* Load More */}
                        <div className="mt-10 flex justify-center">
                            <button className="bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:text-primary hover:border-primary border border-[#e4dcdc] dark:border-gray-700 px-6 py-3 rounded-xl text-sm font-semibold transition-colors shadow-sm">
                                Load More Doctors
                            </button>
                        </div>
                    </section>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Doctors;
