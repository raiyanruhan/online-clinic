import Header from '../components/Header';
import Footer from '../components/Footer';

const BookAppointment = () => {
    return (
        <div className="bg-background-light dark:bg-background-dark min-h-screen flex flex-col font-display text-text-main dark:text-gray-100">
            <Header />
            <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-10 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Main Booking Form */}
                    <div className="flex-1 space-y-6">
                        <div className="bg-white dark:bg-[#2a2a2a] rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 dark:border-gray-800">
                            <h1 className="text-2xl font-bold text-text-main dark:text-white mb-6 border-b border-gray-100 dark:border-gray-800 pb-4">
                                অ্যাপয়েন্টমেন্ট বুকিং
                            </h1>
                            
                            {/* Step Indicator */}
                            <div className="flex items-center justify-between mb-8 px-2 relative">
                                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 dark:bg-gray-700 -z-10"></div>
                                <div className="flex flex-col items-center gap-2 bg-white dark:bg-[#2a2a2a] px-2">
                                    <div className="size-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">১</div>
                                    <span className="text-xs font-bold text-primary">ডাক্তার</span>
                                </div>
                                <div className="flex flex-col items-center gap-2 bg-white dark:bg-[#2a2a2a] px-2">
                                    <div className="size-8 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-500 flex items-center justify-center font-bold text-sm">২</div>
                                    <span className="text-xs font-medium text-gray-500">সময়</span>
                                </div>
                                <div className="flex flex-col items-center gap-2 bg-white dark:bg-[#2a2a2a] px-2">
                                    <div className="size-8 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-500 flex items-center justify-center font-bold text-sm">৩</div>
                                    <span className="text-xs font-medium text-gray-500">তথ্য</span>
                                </div>
                            </div>
                            
                            <form className="space-y-6">
                                <div className="space-y-4">
                                    <label className="block text-sm font-bold text-text-main dark:text-white">রোগীর নাম</label>
                                    <input type="text" className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-transparent focus:bg-white focus:ring-2 focus:ring-primary/20 dark:text-white" placeholder="আপনার নাম লিখুন" />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="block text-sm font-bold text-text-main dark:text-white">বয়স</label>
                                        <input type="number" className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-transparent focus:bg-white focus:ring-2 focus:ring-primary/20 dark:text-white" placeholder="বয়স" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-sm font-bold text-text-main dark:text-white">ফোন নাম্বার</label>
                                        <input type="tel" className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-transparent focus:bg-white focus:ring-2 focus:ring-primary/20 dark:text-white" placeholder="017XXXXXXXX" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-bold text-text-main dark:text-white">সমস্যা সম্পর্কে লিখুন (ঐচ্ছিক)</label>
                                    <textarea rows={4} className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-transparent focus:bg-white focus:ring-2 focus:ring-primary/20 dark:text-white" placeholder="আপনার শারীরিক সমস্যা সংক্ষেপে লিখুন..."></textarea>
                                </div>
                            </form>
                        </div>
                    </div>
                    
                    {/* Sidebar Summary */}
                    <div className="w-full lg:w-96 space-y-6">
                        <div className="bg-white dark:bg-[#2a2a2a] rounded-2xl p-6 shadow-md border border-gray-100 dark:border-gray-800 sticky top-24">
                            <h3 className="text-lg font-bold text-text-main dark:text-white mb-4">বুকিং সারাংশ</h3>
                            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100 dark:border-gray-800">
                                <div className="size-16 rounded-xl bg-gray-200 bg-cover bg-center" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuB-MVRHF2uiM2XhkYw8nRrvzbYk0YwBpDIABa6ke4nRpYEVwFHDRg_AFruaD-wzwUOYbjBjI1HvqOC-F8P45VccHMJXBGnGORilXYBc81z6mN8c9tUKNMhcurL_OqskZlS1ipG4qtb0j23XusXYdzdWhKJCuS55kz0yLrZ6muT0-SjTB3SCdueF_IaQ4K-E3i6zGWYowKQvSk-BlI0l8RwGDQ2f6fw3WrUNy4XItvQHhWyX9y7EcUu685jnj30rrIMG0-P-VAJMPGA")'}}></div>
                                <div>
                                    <h4 className="font-bold text-text-main dark:text-white">ডা. নুসরাত জাহান</h4>
                                    <p className="text-xs text-gray-500">গাইনোকোলজিস্ট</p>
                                </div>
                            </div>
                            <div className="space-y-3 text-sm text-text-sub dark:text-gray-400">
                                <div className="flex justify-between">
                                    <span>তারিখ</span>
                                    <span className="font-bold text-text-main dark:text-white">২৫ অক্টোবর, ২০২৩</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>সময়</span>
                                    <span className="font-bold text-text-main dark:text-white">০৫:৩০ PM</span>
                                </div>
                                <div className="flex justify-between pt-3 border-t border-gray-100 dark:border-gray-800">
                                    <span className="font-bold text-text-main dark:text-white">ফি</span>
                                    <span className="font-bold text-primary text-lg">৳ ১০০০</span>
                                </div>
                            </div>
                            <button className="w-full mt-6 bg-primary hover:bg-red-700 text-white font-bold py-3 rounded-xl shadow-lg transition-all">
                                নিশ্চিত করুন
                            </button>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default BookAppointment;
