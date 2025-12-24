const DoctorDashboard = () => {
    return (
        <div className="flex h-screen bg-background-light dark:bg-[#1a1a1a] font-display overflow-hidden">
            {/* Sidebar */}
            <aside className="w-64 bg-white dark:bg-[#201212] border-r border-gray-100 dark:border-gray-800 hidden md:flex flex-col z-20">
                <div className="p-6 flex items-center gap-3">
                    <div className="bg-primary/10 rounded-full p-2 text-primary">
                        <span className="material-symbols-outlined text-[28px]">local_hospital</span>
                    </div>
                    <div>
                        <h1 className="text-text-main dark:text-white text-lg font-bold leading-tight">MediCare BD</h1>
                        <p className="text-text-sub dark:text-gray-400 text-xs font-normal">Doctor Portal</p>
                    </div>
                </div>
                <nav className="flex-1 px-4 flex flex-col gap-2 mt-4">
                    <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-primary text-white shadow-md shadow-primary/20 transition-all">
                        <span className="material-symbols-outlined icon-filled">dashboard</span>
                        <span className="text-sm font-medium">Dashboard</span>
                    </a>
                    <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl text-text-sub dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group">
                        <span className="material-symbols-outlined group-hover:text-primary transition-colors">calendar_month</span>
                        <span className="text-sm font-medium group-hover:text-text-main dark:group-hover:text-white transition-colors">Appointments</span>
                    </a>
                    <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl text-text-sub dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group">
                        <span className="material-symbols-outlined group-hover:text-primary transition-colors">group</span>
                        <span className="text-sm font-medium group-hover:text-text-main dark:group-hover:text-white transition-colors">Patients</span>
                    </a>
                    {/* Add more nav items as needed */}
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-full relative overflow-hidden">
                {/* Top Header */}
                <header className="h-16 bg-white dark:bg-[#201212] border-b border-gray-100 dark:border-gray-800 px-6 flex items-center justify-between shrink-0">
                    <button className="md:hidden p-2 text-text-main dark:text-white">
                        <span className="material-symbols-outlined">menu</span>
                    </button>
                    <div className="hidden md:flex flex-1 max-w-md">
                        <div className="relative w-full">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl">search</span>
                            <input type="text" className="w-full h-10 pl-10 pr-4 bg-gray-50 dark:bg-gray-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/50 placeholder-gray-400 dark:text-white" placeholder="Search patients, ID, or appointments..." />
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                         <div className="flex items-center gap-3 cursor-pointer p-1 pr-2 rounded-full hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                            <div className="w-8 h-8 rounded-full bg-cover bg-center border border-gray-200" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBaUJEAyH8Z5-wr9ylQ0VkaakreXtdhK1TZPhkTSBlCDvLyQvpqPi81sKeZ8-X0WIPbhE3lGyqpvT8aNB7KuY0VObF_dfO5xuShsOPI9EoHNpVcGuqFQP2NmI0JdtDYS3fSHD2Jkd9qnlNfDDObodBSYh75zcNREN483H5NKUDwBMki3_D-GpNyaO2rz3V0DEaim7KFAv1cRnB4WEHhjwwlHgam5UudKtlGJ3zUYEtOBSMGUmgN7xeanBMQqJOUQL-jr-z2MF6H_Gc")'}}></div>
                            <span className="text-sm font-medium text-text-main dark:text-white hidden lg:block">Dr. Rahman</span>
                        </div>
                    </div>
                </header>

                {/* Dashboard Scrollable Area */}
                <div className="flex-1 overflow-y-auto overflow-x-hidden p-6">
                    <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6 h-full">
                        {/* Left Column */}
                        <div className="flex-1 flex flex-col gap-6">
                            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                                <div>
                                    <h2 className="text-2xl font-bold text-text-main dark:text-white tracking-tight">Good Morning, Dr. Rahman</h2>
                                    <p className="text-text-sub dark:text-gray-400 text-sm mt-1 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-base">calendar_today</span>
                                        Today is Monday, 24 October
                                        <span className="w-1 h-1 bg-gray-400 rounded-full mx-1"></span>
                                        <span className="text-primary font-medium">8 Appointments Scheduled</span>
                                    </p>
                                </div>
                                <button className="bg-primary hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors shadow-sm shadow-primary/30">
                                    <span className="material-symbols-outlined text-lg">add</span> Add Appointment
                                </button>
                            </div>

                            {/* Schedule Table */}
                            <div className="bg-white dark:bg-[#201212] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col flex-1 min-h-[400px]">
                                <div className="p-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                                    <h3 className="text-lg font-bold text-text-main dark:text-white flex items-center gap-2">
                                        <span className="material-symbols-outlined text-secondary">schedule</span> Daily Schedule
                                    </h3>
                                </div>
                                <div className="overflow-x-auto flex-1">
                                    <table className="w-full text-left border-collapse">
                                        <thead className="bg-gray-50/50 dark:bg-gray-800/50 sticky top-0 z-10">
                                            <tr>
                                                <th className="px-6 py-3 text-xs font-semibold text-text-sub dark:text-gray-400 uppercase tracking-wider">Time</th>
                                                <th className="px-6 py-3 text-xs font-semibold text-text-sub dark:text-gray-400 uppercase tracking-wider">Patient Name</th>
                                                <th className="px-6 py-3 text-xs font-semibold text-text-sub dark:text-gray-400 uppercase tracking-wider hidden md:table-cell">ID</th>
                                                <th className="px-6 py-3 text-xs font-semibold text-text-sub dark:text-gray-400 uppercase tracking-wider">Status</th>
                                                <th className="px-6 py-3 text-xs font-semibold text-text-sub dark:text-gray-400 uppercase tracking-wider text-right">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                            <tr className="bg-primary/5 hover:bg-primary/10 transition-colors group">
                                                <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm font-bold text-primary">10:00 AM</div></td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-3">
                                                        <div className="size-8 rounded-full bg-gray-200 bg-cover bg-center" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCVH-8Wv7U5B9YnHozaYoOiGiPnbx-NmV5dEQazOMzt3GfR5HpY-ZwkZsKTzfzBYQYdEdhQNafNr3UTbl6bHKVcDWdcBqNtV2ef0lozJ0ExEJSi_olToydMkBccxLOr1UTF3CJEfzsNBqnr0qcogAWoFfkR600YDqXFeRnHeGFfzNlnjHuHz0vgErxEct9ookpS1h9lRFms-6L1ZCHhPMGEifk3qbbKDrLz8dWZl3HGSsEcr6xshmsuJpBHXwZRyKtVO3qqcXHKDv8")'}}></div>
                                                        <div><div className="text-sm font-semibold text-text-main dark:text-white">Fatima Begum</div></div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell"><div className="text-sm text-text-sub dark:text-gray-400">P-1024</div></td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 border border-orange-200 dark:border-orange-800">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></span> Waiting
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                                    <button className="text-primary hover:text-red-800 font-medium text-sm inline-flex items-center gap-1">Call <span className="material-symbols-outlined text-lg">arrow_forward</span></button>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Next Patient */}
                        <div className="w-full lg:w-80 flex-shrink-0 flex flex-col gap-6">
                            <div className="bg-white dark:bg-[#201212] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden sticky top-0">
                                <div className="bg-primary p-4 text-white flex justify-between items-center">
                                    <h3 className="font-bold text-lg flex items-center gap-2"><span className="material-symbols-outlined">play_circle</span> Next Up</h3>
                                    <span className="text-xs bg-white/20 px-2 py-1 rounded-lg">10:00 AM</span>
                                </div>
                                <div className="p-6 flex flex-col items-center">
                                    <div className="size-24 rounded-full p-1 border-2 border-primary border-dashed mb-3">
                                        <div className="w-full h-full rounded-full bg-cover bg-center" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDvgNDRKtameOtKYE5msI3Q0Id1zu9mDbyFoLYmoyVByUUV-iVbVJ7D6eU0iajj-ezvyW_tK9ev_ih8msP_hUBumVKo7-IFg1LWygwkFRPji_uKBNo_Vi_4wMUgMIPv3ppQ1KsaWxHF8ofB-uZzzauWyWsU6Rhng9ogP423gydSjGIRtAg5fvijVgXdPk01tOQV4mCNv4joKIr-TlAAPffVG_ARd14A2wTWVQAs7v0-dVBGc6HAw1Uua-GRorlb2g6CZ9JW0jqiq84")'}}></div>
                                    </div>
                                    <h2 className="text-xl font-bold text-text-main dark:text-white">Fatima Begum</h2>
                                    <div className="mt-4 flex flex-col gap-3 w-full">
                                        <button className="w-full bg-primary hover:bg-red-700 text-white font-bold py-3 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2">
                                            <span className="material-symbols-outlined">stethoscope</span> Start Consultation
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default DoctorDashboard;
