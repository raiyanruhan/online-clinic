import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { useModal } from '../contexts/ModalContext';

const Register = () => {
    const { showAlert } = useModal();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password })
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                navigate('/dashboard');
            } else {
                showAlert({ message: data.message || 'Registration failed', type: 'error' });
            }
        } catch (error) {
            console.error('Registration error:', error);
            showAlert({ message: 'Something went wrong', type: 'error' });
        }
    };

    return (
        <div className="flex flex-col min-h-screen font-body bg-background-light dark:bg-background-dark text-text-main dark:text-white transition-colors duration-300">
            <Header />

            <div className="flex flex-1 items-center justify-center px-4 py-8 sm:px-6 lg:px-8 relative">
                {/* Background Pattern (Subtle) */}
                <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#d11010 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>

                {/* Main Card Container */}
                <div className="w-full max-w-[1100px] bg-white dark:bg-surface-dark rounded-xl shadow-xl overflow-hidden flex flex-col lg:flex-row min-h-[600px] z-10 border border-[#f3e7e7] dark:border-[#3a2020]">
                    {/* Left Side: Register Form */}
                    <div className="w-full lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
                        <div className="max-w-md mx-auto w-full">
                            {/* Headings */}
                            <div className="mb-8">
                                <h1 className="text-primary dark:text-red-500 text-[32px] font-bold leading-tight text-left pb-2 font-display">রেজিস্ট্রেশন</h1>
                                <p className="text-[#6b7280] dark:text-[#9ca3af] text-base font-normal leading-normal">নতুন অ্যাকাউন্ট তৈরি করতে সঠিক তথ্য দিন</p>
                            </div>
                            {/* Form */}
                            <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
                                {/* Name Field */}
                                <div className="flex flex-col gap-2">
                                    <label className="text-[#1b0d0d] dark:text-[#fcf8f8] text-base font-medium leading-normal">আপনার নাম</label>
                                    <input
                                        className="flex w-full min-w-0 resize-none overflow-hidden rounded-lg text-[#1b0d0d] dark:text-white placeholder:text-[#9ca3af] dark:placeholder:text-[#6b7280] focus:outline-none focus:ring-2 focus:ring-primary/20 border border-[#e7cfcf] dark:border-[#5a3a3a] bg-[#fcf8f8] dark:bg-[#1a0a0a] focus:border-primary h-14 p-[15px] text-base font-normal leading-normal transition-colors"
                                        placeholder="আপনার পূর্ণ নাম"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                </div>
                                {/* Email Field */}
                                <div className="flex flex-col gap-2">
                                    <label className="text-[#1b0d0d] dark:text-[#fcf8f8] text-base font-medium leading-normal">ইমেইল</label>
                                    <input
                                        className="flex w-full min-w-0 resize-none overflow-hidden rounded-lg text-[#1b0d0d] dark:text-white placeholder:text-[#9ca3af] dark:placeholder:text-[#6b7280] focus:outline-none focus:ring-2 focus:ring-primary/20 border border-[#e7cfcf] dark:border-[#5a3a3a] bg-[#fcf8f8] dark:bg-[#1a0a0a] focus:border-primary h-14 p-[15px] text-base font-normal leading-normal transition-colors"
                                        placeholder="example@mail.com"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                {/* Password Field */}
                                <div className="flex flex-col gap-2">
                                    <label className="text-[#1b0d0d] dark:text-[#fcf8f8] text-base font-medium leading-normal">পাসওয়ার্ড</label>
                                    <input
                                        className="flex w-full min-w-0 resize-none overflow-hidden rounded-lg text-[#1b0d0d] dark:text-white placeholder:text-[#9ca3af] dark:placeholder:text-[#6b7280] focus:outline-none focus:ring-2 focus:ring-primary/20 border border-[#e7cfcf] dark:border-[#5a3a3a] bg-[#fcf8f8] dark:bg-[#1a0a0a] focus:border-primary h-14 p-[15px] text-base font-normal leading-normal transition-colors"
                                        placeholder="••••••••"
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>

                                {/* Submit Button */}
                                <button className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-4 bg-primary hover:bg-[#b00d0d] text-[#fcf8f8] text-lg font-bold leading-normal tracking-[0.015em] transition-all shadow-md mt-2">
                                    <span className="truncate">রেজিস্টার করুন</span>
                                </button>
                                {/* Register Footer */}
                                <div className="text-center mt-4">
                                    <p className="text-[#4b5563] dark:text-[#d1d5db] text-base font-normal leading-normal">
                                        আগেই একাউন্ট আছে?
                                        <Link to="/login" className="text-secondary dark:text-[#4fd1e5] font-bold hover:underline ml-1">লগইন করুন</Link>
                                    </p>
                                </div>
                            </form>
                        </div>
                    </div>
                    {/* Right Side: Image/Illustration */}
                    <div className="hidden lg:flex w-1/2 bg-[#fcf8f8] dark:bg-[#1a0a0a] relative overflow-hidden group">
                        <div className="absolute inset-0 bg-center bg-no-repeat bg-cover" style={{ backgroundImage: 'url("https://res.cloudinary.com/dzjrhl1vi/image/upload/v1766580660/uploads/1766580661313-photo-1483354483454-4cd359948304.avif.avif")' }}>
                        </div>
                        {/* Overlay Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-12">
                            <div className="transform translate-y-0 transition-transform duration-500">
                                <div className="flex items-center gap-2 mb-3 text-white/90">
                                    <span className="material-symbols-outlined text-2xl">verified_user</span>
                                    <span className="text-sm font-bold uppercase tracking-wider font-display">Trusted Healthcare</span>
                                </div>
                                <h3 className="text-white text-3xl font-bold mb-3 font-display leading-tight">আপনার এবং আপনার পরিবারের সুস্বাস্থ্যের নিশ্চয়তা</h3>
                                <p className="text-white/80 text-lg max-w-md">২৪/৭ বিশেষজ্ঞ ডাক্তারদের পরামর্শ নিন ঘরে বসেই।</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
