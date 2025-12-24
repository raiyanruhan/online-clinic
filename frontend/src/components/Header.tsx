import { useState } from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border-color bg-white/95 backdrop-blur-sm dark:bg-background-dark/95 transition-all duration-300">
            <div className="layout-container flex h-full grow flex-col">
                <div className="px-4 md:px-10 lg:px-40 flex flex-1 justify-center py-3">
                    <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
                        <div className="flex items-center justify-between whitespace-nowrap">
                            <Link to="/" className="flex items-center gap-3 text-primary cursor-pointer" onClick={() => window.scrollTo(0,0)}>
                                <img src="/logo.png" alt="Roudromoyee Online Clinic" className="h-12 w-auto object-contain" />

                            </Link>

                            <div className="hidden lg:flex flex-1 justify-end gap-8 items-center">
                                <div className="flex items-center gap-8">
                                    <Link to="/" className="text-text-main dark:text-gray-200 text-base font-medium hover:text-primary transition-colors relative group">
                                        হোম
                                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
                                    </Link>
                                    <Link to="/services" className="text-text-main dark:text-gray-200 text-base font-medium hover:text-primary transition-colors relative group">
                                        সেবাসমূহ
                                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
                                    </Link>
                                    <Link to="/doctors" className="text-text-main dark:text-gray-200 text-base font-medium hover:text-primary transition-colors relative group">
                                        ডাক্তারগণ
                                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
                                    </Link>
                                    <Link to="/blog" className="text-text-main dark:text-gray-200 text-base font-medium hover:text-primary transition-colors relative group">
                                        ব্লগ
                                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
                                    </Link>
                                    <Link to="/contact" className="text-text-main dark:text-gray-200 text-base font-medium hover:text-primary transition-colors relative group">
                                        যোগাযোগ
                                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
                                    </Link>
                                </div>
                                <div className="flex gap-3">
                                    <Link to="/login" className="flex cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-5 bg-primary hover:bg-red-700 hover:scale-105 active:scale-95 transition-all text-white text-sm font-bold shadow-sm shadow-primary/20">
                                        <span className="truncate">লগ ইন</span>
                                    </Link>
                                </div>
                            </div>

                            {/* Mobile Menu Icon */}
                            <div className="lg:hidden">
                                <button 
                                    onClick={toggleMenu}
                                    className="p-2 text-text-main dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                                >
                                    <span className="material-symbols-outlined">menu</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Drawer */}
            {isMenuOpen && (
                <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm lg:hidden" onClick={toggleMenu}></div>
            )}
            <div className={`fixed top-0 right-0 z-[70] h-full w-[280px] bg-white dark:bg-background-dark shadow-2xl transform transition-transform duration-300 flex flex-col p-6 lg:hidden ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="flex justify-between items-center mb-8">
                    <h3 className="text-xl font-bold text-primary">মেনু</h3>
                    <button onClick={toggleMenu} className="p-2 text-gray-500 hover:text-primary rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>
                <div className="flex flex-col gap-6">
                    <Link to="/" className="text-lg font-medium hover:text-primary transition-colors">হোম</Link>
                    <Link to="/services" className="text-lg font-medium hover:text-primary transition-colors">সেবাসমূহ</Link>
                    <Link to="/doctors" className="text-lg font-medium hover:text-primary transition-colors">ডাক্তারগণ</Link>
                    <Link to="/blog" className="text-lg font-medium hover:text-primary transition-colors">ব্লগ</Link>
                    <Link to="/contact" className="text-lg font-medium hover:text-primary transition-colors">যোগাযোগ</Link>
                </div>
                <div className="mt-auto flex flex-col gap-4">
                    <button className="w-full flex items-center justify-center rounded-full h-12 bg-primary text-white font-bold shadow-lg">লগ ইন</button>
                    <button className="w-full flex items-center justify-center rounded-full h-12 bg-gray-100 dark:bg-gray-800 font-bold">বাংলা</button>
                </div>
            </div>
        </header>
    );
};

export default Header;
