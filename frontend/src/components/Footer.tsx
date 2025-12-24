import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-white dark:bg-background-dark border-t border-border-color pt-16 pb-8" id="contact">
            <div className="layout-container">
                <div className="px-4 md:px-10 lg:px-40 flex justify-center">
                    <div className="layout-content-container max-w-[960px] w-full flex flex-col gap-12">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                            <div className="col-span-1 md:col-span-2 flex flex-col gap-4">
                                <div className="flex items-center gap-2 text-primary">
                                    <span className="material-symbols-outlined icon-filled text-3xl">local_hospital</span>
                                    <h2 className="text-[#171212] dark:text-white text-xl font-bold">Roudromoyee Online Clinic</h2>
                                </div>
                                <p className="text-text-sub dark:text-gray-400 max-w-sm">সবার জন্য সহজলভ্য এবং মানসম্মত স্বাস্থ্যসেবা নিশ্চিত করাই আমাদের লক্ষ্য। বিশ্বাস এবং আস্থার সাথে আছি আপনার পাশে।</p>
                                <div className="flex gap-4 mt-2">
                                    <a href="#" className="size-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-primary hover:text-white transition-colors">
                                        <span className="text-sm font-bold">Fb</span>
                                    </a>
                                    <a href="#" className="size-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-primary hover:text-white transition-colors">
                                        <span className="text-sm font-bold">In</span>
                                    </a>
                                    <a href="#" className="size-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-primary hover:text-white transition-colors">
                                        <span className="text-sm font-bold">Yt</span>
                                    </a>
                                </div>
                            </div>
                            <div className="flex flex-col gap-4">
                                <h3 className="text-text-main dark:text-white font-bold">গুরুত্বপূর্ণ লিঙ্ক</h3>
                                <div className="flex flex-col gap-2 text-text-sub dark:text-gray-400 text-sm">
                                    <a href="#" className="hover:text-primary transition-colors">আমাদের সম্পর্কে</a>
                                    <Link to="/doctors" className="hover:text-primary transition-colors">ডাক্তারদের তালিকা</Link>
                                    <a href="#" className="hover:text-primary transition-colors">ব্লগ</a>
                                    <a href="#" className="hover:text-primary transition-colors">প্রাইভেসি পলিসি</a>
                                </div>
                            </div>
                            <div className="flex flex-col gap-4">
                                <h3 className="text-text-main dark:text-white font-bold">যোগাযোগ</h3>
                                <div className="flex flex-col gap-3 text-text-sub dark:text-gray-400 text-sm">
                                    <div className="flex items-start gap-2">
                                        <span className="material-symbols-outlined text-primary text-lg">location_on</span>
                                        <span>বাড়ি ৩৪, রোড ১০, ধানমন্ডি,<br/>ঢাকা-১২০৯</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="material-symbols-outlined text-primary text-lg">call</span>
                                        <span>+৮৮০ ১৭১১ ০০০০০০</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="material-symbols-outlined text-primary text-lg">mail</span>
                                        <span>info@healthcarebd.com</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="border-t border-gray-100 dark:border-gray-800 pt-8 text-center">
                            <p className="text-xs text-gray-400">© 2024 Roudromoyee Online Clinic. All rights reserved. <br/>Medical Disclaimer: This website provides general information only and is not a substitute for professional medical advice.</p>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
