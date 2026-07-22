import { Link } from 'react-router-dom';
import { CONTACT } from '../config';

const Footer = () => {
    return (
        <footer className="w-full bg-white dark:bg-gray-900 text-black dark:text-white rounded-t-4xl overflow-hidden relative shadow-2xl flex flex-col transition-colors duration-300 mt-8 sm:mt-16 lg:mt-20 border-t-2 border-gray-200 dark:border-gray-700 pb-20 md:pb-0">
            
            {/* Geometric Lines Overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-10 dark:opacity-20 z-0">
                <svg height="100%" preserveAspectRatio="none" width="100%" className="w-full h-full">
                    <line stroke="black" strokeWidth="0.5" className="dark:stroke-white" x1="60%" x2="45%" y1="0" y2="100%" />
                    <line stroke="black" strokeWidth="0.5" className="dark:stroke-white" x1="75%" x2="95%" y1="0" y2="100%" />
                    <line stroke="black" strokeWidth="0.5" className="dark:stroke-white" x1="65%" x2="85%" y1="30%" y2="50%" />
                    <line stroke="black" strokeWidth="0.5" className="dark:stroke-white" x1="45%" x2="70%" y1="60%" y2="80%" />
                </svg>
            </div>

            <div className="relative z-10 px-4 py-5 sm:px-6 sm:py-10 md:px-8 md:py-12 lg:px-12 lg:py-16">
                <div className="max-w-7xl mx-auto">
                    
                    {/* Mobile + Tablet: Your Original Layout */}
                    {/* Desktop: Better balanced layout */}
                    <div className="space-y-8 lg:space-y-0 lg:grid lg:grid-cols-12 lg:gap-12">

                        {/* Left Section - Brand & Description (Kept exact mobile behavior) */}
                        <div className="flex flex-col items-center sm:items-start justify-start lg:col-span-5">
                            <div className="space-y-3 sm:space-y-5 text-center sm:text-left w-full">
                                <Link to="/" className="flex items-center justify-center sm:justify-start gap-3 inline-block">
                                    <img src="/logo.png" alt="Roudromoyee Online Clinic" className="h-8 sm:h-10 w-auto" />
                                </Link>

                                <div className="space-y-2 sm:space-y-3 max-w-md mx-auto sm:mx-0">
                                    <p className="font-bangla text-sm sm:text-lg leading-relaxed text-gray-700 dark:text-gray-300">
                                        নারী ও পরিবারের সুস্বাস্থ্যের বিশ্বস্ত সঙ্গী। উন্নত প্রযুক্তি এবং মানবিক সেবার সমন্বয়ে আমরা আছি আপনার পাশে।
                                    </p>
                                    <p className="font-sans text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                        Empowering families with accessible, quality healthcare through advanced technology and compassionate service.
                                    </p>
                                </div>

                                <div className="flex items-center justify-center sm:justify-start gap-4 sm:gap-5 pt-1 sm:pt-2">
                                    <a 
                                        aria-label="Facebook" 
                                        href="https://www.facebook.com/share/1JWe4pK4T6/" 
                                        target="_blank" 
                                        rel="noreferrer"
                                        className="text-black dark:text-white hover:text-[#C62828] transition-colors"
                                    >
                                        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"></path>
                                        </svg>
                                    </a>
                                    <a 
                                        aria-label="WhatsApp" 
                                        href={`https://wa.me/${CONTACT.whatsapp}`}
                                        target="_blank" 
                                        rel="noreferrer"
                                        className="text-black dark:text-white hover:text-[#C62828] transition-colors"
                                    >
                                        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"></path>
                                        </svg>
                                    </a>
                                    <a 
                                        aria-label="Email" 
                                        href={`mailto:${CONTACT.email}`}
                                        className="text-black dark:text-white hover:text-[#C62828] transition-colors"
                                    >
                                        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"></path>
                                        </svg>
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Navigation Sections - Improved for Desktop */}
                        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-7 gap-6 sm:gap-8 lg:gap-10 lg:col-span-7">
                            
                            {/* Site Map */}
                            <div className="flex flex-col items-center sm:items-start justify-start lg:col-span-2">
                                <h3 className="text-xs sm:text-base font-semibold mb-2.5 sm:mb-5 text-black dark:text-white font-sans">Site Map</h3>
                                <ul className="space-y-1.5 sm:space-y-3 text-xs sm:text-sm text-gray-700 dark:text-gray-300 text-center sm:text-left">
                                    <li><Link to="/" className="hover:text-[#C62828] transition-colors inline-block">হোম</Link></li>
                                    <li><Link to="/services" className="hover:text-[#C62828] transition-colors inline-block">সেবাসমূহ</Link></li>
                                    <li><Link to="/doctors" className="hover:text-[#C62828] transition-colors inline-block">ডাক্তারগণ</Link></li>
                                    <li><Link to="/blog" className="hover:text-[#C62828] transition-colors inline-block">ব্লগ</Link></li>
                                    <li><Link to="/contact" className="hover:text-[#C62828] transition-colors inline-block">যোগাযোগ</Link></li>
                                    <li><Link to="/dashboard" className="hover:text-[#C62828] transition-colors inline-block">ড্যাশবোর্ড</Link></li>
                                </ul>
                            </div>

                            {/* Contact */}
                            <div className="flex flex-col items-center sm:items-start justify-start lg:col-span-3">
                                <h3 className="text-xs sm:text-base font-semibold mb-2.5 sm:mb-5 text-black dark:text-white font-sans">যোগাযোগ</h3>
                                <ul className="space-y-2 sm:space-y-4 text-xs sm:text-sm text-gray-700 dark:text-gray-300 text-center sm:text-left">
                                    <li className="flex items-start justify-center sm:justify-start gap-2 sm:gap-3">
                                        <span className="material-symbols-outlined text-base sm:text-lg flex-shrink-0 text-[#C62828] mt-0.5">location_on</span>
                                        <span className="leading-relaxed text-left">{CONTACT.address}</span>
                                    </li>
                                    <li className="flex items-center justify-center sm:justify-start gap-2 sm:gap-3">
                                        <span className="material-symbols-outlined text-base sm:text-lg flex-shrink-0 text-[#C62828]">call</span>
                                        <a href={`tel:${CONTACT.phone}`} className="hover:text-[#C62828] transition-colors">{CONTACT.phoneDisplay}</a>
                                    </li>
                                    <li className="flex items-center justify-center sm:justify-start gap-2 sm:gap-3">
                                        <span className="material-symbols-outlined text-base sm:text-lg flex-shrink-0 text-[#C62828]">mail</span>
                                        <button
                                            type="button"
                                            onClick={() => window.location.href = `mailto:${CONTACT.email}`}
                                            className="hover:text-[#C62828] transition-colors break-all bg-transparent border-none p-0 m-0 cursor-pointer text-left"
                                            style={{ font: 'inherit' }}
                                        >
                                            <span className="inline-flex items-center justify-center gap-1 px-3 py-1 text-xs font-semibold bg-[#C62828] text-white rounded transition-colors hover:bg-[#b71c1c]">
                                                Mail Us
                                            </span>
                                        </button>
                                    </li>
                                </ul>
                            </div>

                            {/* Legal */}
                            <div className="flex flex-col items-center sm:items-start justify-start lg:col-span-2">
                                <h3 className="text-xs sm:text-base font-semibold mb-2.5 sm:mb-5 text-black dark:text-white font-sans">Legal</h3>
                                <ul className="space-y-1.5 sm:space-y-3 text-xs sm:text-sm text-gray-700 dark:text-gray-300 text-center sm:text-left">
                                    <li><Link to="/privacy-policy" className="hover:text-[#C62828] transition-colors inline-block">Privacy Policy</Link></li>
                                    <li><Link to="/terms-of-service" className="hover:text-[#C62828] transition-colors inline-block">Terms of Service</Link></li>
                                    <li><Link to="/medical-disclaimer" className="hover:text-[#C62828] transition-colors inline-block">Medical Disclaimer</Link></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Copyright Bar */}
            <div className="bg-[#C62828] text-white py-2.5 sm:py-4 px-4 sm:px-6 text-center text-[10px] sm:text-xs font-bold uppercase tracking-wider">
                Copyright © {new Date().getFullYear()} Roudromoyee Online Clinic. All Rights Reserved.
            </div>
        </footer>
    );
};

export default Footer;