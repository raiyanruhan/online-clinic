import Header from '../components/Header';
import Footer from '../components/Footer';

const Blog = () => {
    return (
        <div className="bg-background-light dark:bg-background-dark text-text-main dark:text-white antialiased min-h-screen flex flex-col font-bangla transition-colors duration-300">
            <Header />

            <main className="flex-grow w-full max-w-[1200px] mx-auto px-4 lg:px-8 py-8">
                {/* Page Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                    <div className="flex flex-col gap-2 max-w-2xl">
                        <div className="flex items-center gap-2 text-secondary mb-1">
                            <span className="material-symbols-outlined text-xl">health_and_safety</span>
                            <span className="text-sm font-bold uppercase tracking-wider font-display">Health Education</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-text-main dark:text-white leading-tight">
                            স্বাস্থ্য সেবা ব্লগ <span className="text-secondary">ও পরামর্শ</span>
                        </h2>
                        <p className="text-text-sub dark:text-gray-400 text-lg mt-1">
                            আপনার এবং আপনার পরিবারের সুস্বাস্থ্যের জন্য বিশেষজ্ঞ চিকিৎসকদের পরামর্শ ও টিপস।
                        </p>
                    </div>
                    {/* Search Bar */}
                    <div className="w-full md:w-auto md:min-w-[320px]">
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <span className="material-symbols-outlined text-text-sub dark:text-gray-400">search</span>
                            </div>
                            <input 
                                className="block w-full pl-10 pr-4 py-3 rounded-xl border-none bg-white dark:bg-[#2a2a2a] shadow-sm text-text-main dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-primary/20 focus:bg-white dark:focus:bg-[#2a2a2a] transition-all" 
                                placeholder="নিবন্ধ খুঁজুন (Search articles...)" 
                                type="text"
                            />
                        </div>
                    </div>
                </div>

                {/* Filter Chips */}
                <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-6 mb-2">
                    <button className="shrink-0 bg-primary text-white px-5 py-2 rounded-xl text-sm font-medium shadow-sm transition-transform active:scale-95">
                        সকল (All)
                    </button>
                    <button className="shrink-0 bg-white dark:bg-[#2a2a2a] border border-transparent hover:border-gray-200 dark:hover:border-gray-700 text-text-main dark:text-gray-200 px-5 py-2 rounded-xl text-sm font-medium shadow-sm hover:shadow-md transition-all">
                        নারীদের স্বাস্থ্য (Women's Health)
                    </button>
                    <button className="shrink-0 bg-white dark:bg-[#2a2a2a] border border-transparent hover:border-gray-200 dark:hover:border-gray-700 text-text-main dark:text-gray-200 px-5 py-2 rounded-xl text-sm font-medium shadow-sm hover:shadow-md transition-all">
                        শিশু যত্ন (Child Care)
                    </button>
                    <button className="shrink-0 bg-white dark:bg-[#2a2a2a] border border-transparent hover:border-gray-200 dark:hover:border-gray-700 text-text-main dark:text-gray-200 px-5 py-2 rounded-xl text-sm font-medium shadow-sm hover:shadow-md transition-all">
                        পুষ্টি ও ডায়েট (Nutrition)
                    </button>
                    <button className="shrink-0 bg-white dark:bg-[#2a2a2a] border border-transparent hover:border-gray-200 dark:hover:border-gray-700 text-text-main dark:text-gray-200 px-5 py-2 rounded-xl text-sm font-medium shadow-sm hover:shadow-md transition-all">
                        মানসিক স্বাস্থ্য (Mental Health)
                    </button>
                    <button className="shrink-0 bg-white dark:bg-[#2a2a2a] border border-transparent hover:border-gray-200 dark:hover:border-gray-700 text-text-main dark:text-gray-200 px-5 py-2 rounded-xl text-sm font-medium shadow-sm hover:shadow-md transition-all">
                        লাইফস্টাইল (Lifestyle)
                    </button>
                </div>

                {/* Featured Article Hero */}
                <section className="mb-12">
                    <div className="bg-white dark:bg-[#2a2a2a] rounded-2xl p-4 md:p-6 shadow-sm hover:shadow-lg transition-shadow duration-300 border border-gray-100 dark:border-gray-800 group cursor-pointer">
                        <div className="flex flex-col md:flex-row gap-6 lg:gap-8 items-stretch">
                            {/* Image Side */}
                            <div className="w-full md:w-1/2 lg:w-7/12 aspect-video md:aspect-auto relative overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800">
                                <div className="absolute top-4 left-4 bg-primary text-white text-xs font-bold px-3 py-1 rounded-lg uppercase tracking-wider z-10 shadow-sm font-display">
                                    Featured
                                </div>
                                <img alt="Mother holding newborn baby representing healthy pregnancy care" className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAP7V_5LQSOxc5Iw6bbuGpw66TPdZF6YnY9FGBpXgphnpjMg6RLuJ45-HvV754cVcEmuc6Zg0XJa5LgK38AiJErAuU1oaKtPtCRJB9Df8kBrmX4TBAHpalXqTSOUvVEdNgo_rFz9o81IQCT91TkRLIwNjGSMQZ_-VfuXqNn9nJfvt2DEsh3fUP6MvjHaT1UUNOkDI_TRmkS_-pWbN-ihM_KdsojWyPB-0Pegr2NPlqGDDThaJivGQXBpcDP5L9kMPlBduEtX4ojw_k" />
                            </div>
                            {/* Content Side */}
                            <div className="w-full md:w-1/2 lg:w-5/12 flex flex-col justify-center">
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="bg-secondary/10 text-secondary text-xs font-bold px-2 py-1 rounded-md">নারীদের স্বাস্থ্য</span>
                                    <span className="text-text-sub dark:text-gray-400 text-xs flex items-center gap-1 font-display">
                                        <span className="material-symbols-outlined text-[16px]">schedule</span> 5 min read
                                    </span>
                                </div>
                                <h3 className="text-2xl lg:text-3xl font-bold text-text-main dark:text-white mb-3 leading-snug group-hover:text-secondary transition-colors">
                                    সুস্থ গর্ভাবস্থার জন্য ১০টি জরুরি টিপস যা আপনার জানা প্রয়োজন
                                </h3>
                                <p className="text-text-sub dark:text-gray-400 text-base mb-6 line-clamp-3">
                                    গর্ভকালীন সময়ে মা ও শিশুর সুস্থতা নিশ্চিত করতে সঠিক পুষ্টি, বিশ্রাম এবং নিয়মিত চেকআপ অত্যন্ত গুরুত্বপূর্ণ। এই আর্টিকেলে আমরা আলোচনা করেছি এমন ১০টি বিষয় যা...
                                </p>
                                <div className="mt-auto flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
                                            <img alt="Portrait of Dr. Farhana" className="object-cover w-full h-full" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCktk0IQ5zOtfd5aYeShFLQGbe2RxMS5RU6sViCpzTU6IEaZbjGigDNBbxJj-lnX-ZYmUw1nZ5FmYjPBPBRwJoa7aqqhSB9kRL71sqsvXFPQaZ2QYTYitCRw-KGkUyLCEFrnEbmoqo1FCDa4f-Ikc6ujU9IbFPguydp5TpIoeU6M6us88diVh3r87ZWMzXsSn7Z9mUr5C8WN-UGtYWH4biLFUoerkH15Y5xPfC7YKXL8XuRgTveCTvM-k_cFCZzZBaa5yFx3U3XbIs" />
                                        </div>
                                        <div className="text-xs">
                                            <p className="font-bold text-text-main dark:text-white">ডাঃ ফারহানা আহমেদ</p>
                                            <p className="text-text-sub dark:text-gray-400">গাইনোকোলজিস্ট</p>
                                        </div>
                                    </div>
                                    <button className="flex items-center gap-1 text-primary font-bold text-sm hover:gap-2 transition-all">
                                        পুরোটা পড়ুন <span className="material-symbols-outlined text-lg">arrow_forward</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Article Grid */}
                <section>
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-2xl font-bold text-text-main dark:text-white">সর্বশেষ নিবন্ধ (Latest Articles)</h3>
                        <a className="text-secondary text-sm font-bold flex items-center gap-1 hover:underline cursor-pointer">
                            সব দেখুন <span className="material-symbols-outlined text-lg">chevron_right</span>
                        </a>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Article Card 1 */}
                        <article className="bg-white dark:bg-[#2a2a2a] rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group flex flex-col h-full border border-gray-100 dark:border-gray-800">
                            <div className="aspect-[16/10] overflow-hidden relative bg-gray-100 dark:bg-gray-800">
                                <img alt="A child eating healthy fruits representing child nutrition" className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCDap4ErMUx7_FGKytiLlDxbCqBtw2fNnYMa7YGQ551ZwKMPhc1tSjv355tg7nrj4JXCatiYYxl56rp3xn7NeNmctOLY1Li_vfMfCDtp2ADCBuMjb8R6fIwobK0UMQsoI6DirLA7wqPpNrqDh1rvtjsLfgvZIOjcmS0m1flPBVuim3zTAduehX0Fk_3KCBd_Q8LRVo5YOFzap3DpQbrznjvE9X_oHKTHSSIcEKd8v5VT7t4MbOpmmti6O3aWgPtdqGyRpN4olv6USA" />
                                <div className="absolute top-3 left-3">
                                    <span className="bg-white/90 dark:bg-black/80 backdrop-blur-sm text-secondary dark:text-teal-400 text-xs font-bold px-2 py-1 rounded-md shadow-sm">শিশু যত্ন</span>
                                </div>
                            </div>
                            <div className="p-5 flex flex-col flex-grow">
                                <h4 className="text-xl font-bold text-text-main dark:text-white mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                                    শিশুর বেড়ে ওঠায় সুষম খাবারের ভূমিকা ও তালিকা
                                </h4>
                                <p className="text-text-sub dark:text-gray-400 text-sm line-clamp-2 mb-4">
                                    শিশুর শারীরিক ও মানসিক বিকাশের জন্য সঠিক বয়সে সঠিক পুষ্টি নিশ্চিত করা অপরিহার্য। জেনে নিন বিস্তারিত।
                                </p>
                                <div className="mt-auto flex items-center justify-between border-t border-gray-100 dark:border-gray-800 pt-4">
                                    <span className="text-xs text-text-sub dark:text-gray-400 flex items-center gap-1 font-display">
                                        <span className="material-symbols-outlined text-[14px]">timer</span> 4 min read
                                    </span>
                                    <span className="text-primary text-sm font-bold cursor-pointer hover:underline">পড়ুন</span>
                                </div>
                            </div>
                        </article>
                        {/* Article Card 2 */}
                        <article className="bg-white dark:bg-[#2a2a2a] rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group flex flex-col h-full border border-gray-100 dark:border-gray-800">
                            <div className="aspect-[16/10] overflow-hidden relative bg-gray-100 dark:bg-gray-800">
                                <img alt="Doctor measuring blood pressure of patient representing diabetes checkup" className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCO12ngWC07_do0R1Lx7jzNgGkHrmmg8-v7ppRX0kQAwGxG47JhzLr38x5dLm6nq096heHzhHiBtKvgQp0l43shTyS4b74sB60yVPjNcMNoYcYDt_d8EQmNQ7FOFF6QpU_FV2voyLKTzSjIc2yCv-GUwQnGPB93mfrTyIvzNb2CQBEBfeGXM2CcdxT2Vd4jswYpj8Z4KNTBEPurFBeq1Q_WZAtalQwNzwwU5SHcTNRbzJfQi1YYtmq-CEv9A8NM6JgWAqp4XqJVQwc" />
                                <div className="absolute top-3 left-3">
                                    <span className="bg-white/90 dark:bg-black/80 backdrop-blur-sm text-secondary dark:text-teal-400 text-xs font-bold px-2 py-1 rounded-md shadow-sm">ডায়াবেটিস</span>
                                </div>
                            </div>
                            <div className="p-5 flex flex-col flex-grow">
                                <h4 className="text-xl font-bold text-text-main dark:text-white mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                                    ডায়াবেটিস নিয়ন্ত্রণে রাখার ৫টি সহজ উপায়
                                </h4>
                                <p className="text-text-sub dark:text-gray-400 text-sm line-clamp-2 mb-4">
                                    নিয়মিত ব্যায়াম এবং খাদ্যভাস পরিবর্তনের মাধ্যমে কীভাবে ডায়াবেটিস সম্পূর্ণ নিয়ন্ত্রণে রাখা যায়।
                                </p>
                                <div className="mt-auto flex items-center justify-between border-t border-gray-100 dark:border-gray-800 pt-4">
                                    <span className="text-xs text-text-sub dark:text-gray-400 flex items-center gap-1 font-display">
                                        <span className="material-symbols-outlined text-[14px]">timer</span> 6 min read
                                    </span>
                                    <span className="text-primary text-sm font-bold cursor-pointer hover:underline">পড়ুন</span>
                                </div>
                            </div>
                        </article>
                        {/* Article Card 3 */}
                        <article className="bg-white dark:bg-[#2a2a2a] rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group flex flex-col h-full border border-gray-100 dark:border-gray-800">
                            <div className="aspect-[16/10] overflow-hidden relative bg-gray-100 dark:bg-gray-800">
                                <img alt="Woman meditating outdoors representing mental health" className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDAcx8yrF-vCWHCpE3ttw3OiIjYMnK4MRM4V4q8UVLN7RgIjL701REu4LO8xKX2XTM2bUoi7wWFxXLjTOlwyz66CFJKDHHNqa0snQEJDZIssjgc7tB_JXCjOZa-Rg0SF4LLJXOUEWaVhy1IQjeMJ4s0sxLXFhUdvK54zlcNHl4y8aHUVQRARdKydJY00l_qfFzMu22U1MTlhV-_PyFbrtF5wnzcbct18iJZtKpUSMIncUEGfOJ_Va7YsVhxqdQnyB-hUjStuTXMi30" />
                                <div className="absolute top-3 left-3">
                                    <span className="bg-white/90 dark:bg-black/80 backdrop-blur-sm text-secondary dark:text-teal-400 text-xs font-bold px-2 py-1 rounded-md shadow-sm">মানসিক স্বাস্থ্য</span>
                                </div>
                            </div>
                            <div className="p-5 flex flex-col flex-grow">
                                <h4 className="text-xl font-bold text-text-main dark:text-white mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                                    মানসিক চাপ বা স্ট্রেস কমানোর কার্যকরী কৌশল
                                </h4>
                                <p className="text-text-sub dark:text-gray-400 text-sm line-clamp-2 mb-4">
                                    দৈনন্দিন জীবনের নানা চাপে মানসিক শান্তি বজায় রাখার জন্য কিছু মনস্তাত্ত্বিক টিপস।
                                </p>
                                <div className="mt-auto flex items-center justify-between border-t border-gray-100 dark:border-gray-800 pt-4">
                                    <span className="text-xs text-text-sub dark:text-gray-400 flex items-center gap-1 font-display">
                                        <span className="material-symbols-outlined text-[14px]">timer</span> 5 min read
                                    </span>
                                    <span className="text-primary text-sm font-bold cursor-pointer hover:underline">পড়ুন</span>
                                </div>
                            </div>
                        </article>
                        {/* Article Card 4 */}
                        <article className="bg-white dark:bg-[#2a2a2a] rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group flex flex-col h-full border border-gray-100 dark:border-gray-800">
                            <div className="aspect-[16/10] overflow-hidden relative bg-gray-100 dark:bg-gray-800">
                                <img alt="Fresh vegetables and fruits representing nutrition" className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDSsqOpa3gPI4u_AdliIMTcrY0W45qxf9OTK4JNpVLpqLzRGQRbKUDEHVmQj2cMMy-LxiAefg9jja2vz_4OqDdOM1sk3lmsl0kQf7UCniOJAxCowaHmEZI2CnGxwGwOVnHkocoI6usHLkuSZenAP7uV8toSj_Ws9Iulsya0rFoMgXA4t9pl4qpx2eySLO1QUwA0tf4s8h34PtTKKn6EzcV4bqAWRyOaAMeBUzpct49Hm_uYU9QL9LzlTQy54YfGlwa2VPU2JEv74m4" />
                                <div className="absolute top-3 left-3">
                                    <span className="bg-white/90 dark:bg-black/80 backdrop-blur-sm text-secondary dark:text-teal-400 text-xs font-bold px-2 py-1 rounded-md shadow-sm">পুষ্টি</span>
                                </div>
                            </div>
                            <div className="p-5 flex flex-col flex-grow">
                                <h4 className="text-xl font-bold text-text-main dark:text-white mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                                    রক্তস্বল্পতা বা অ্যানিমিয়া: লক্ষণ ও প্রতিকার
                                </h4>
                                <p className="text-text-sub dark:text-gray-400 text-sm line-clamp-2 mb-4">
                                    শরীরে রক্তের অভাব হলে কী কী লক্ষণ দেখা দেয় এবং কোন খাবারগুলো খেলে রক্ত বৃদ্ধি পায়।
                                </p>
                                <div className="mt-auto flex items-center justify-between border-t border-gray-100 dark:border-gray-800 pt-4">
                                    <span className="text-xs text-text-sub dark:text-gray-400 flex items-center gap-1 font-display">
                                        <span className="material-symbols-outlined text-[14px]">timer</span> 7 min read
                                    </span>
                                    <span className="text-primary text-sm font-bold cursor-pointer hover:underline">পড়ুন</span>
                                </div>
                            </div>
                        </article>
                        {/* Article Card 5 */}
                        <article className="bg-white dark:bg-[#2a2a2a] rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group flex flex-col h-full border border-gray-100 dark:border-gray-800">
                            <div className="aspect-[16/10] overflow-hidden relative bg-gray-100 dark:bg-gray-800">
                                <img alt="Vaccination process representing immunization" className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCL0VI5Te50yqItntl5pRDUO-tXwQ54od211UWAJaf5uHpq_PoEYLos0oGdBQhva3Aso3zyFVrpp9nZKZWJtoit_f5muYa0Cr83Owo2xTx5vlf7wVoKIlFrS9v4zrMSm9ivEA4la7jjuUg6of5n0oMOSuKPBEgh3smBLaWRKjjYfEj9YQ8hElhZMFbA9bX2dEY7Sj2gy9mQdXqgn-1WTVZwRVaIjv7EYp4Gxjir4E42iZeO_yo_XZlubrYSYYwVBy1AwRIkaoVo_l4" />
                                <div className="absolute top-3 left-3">
                                    <span className="bg-white/90 dark:bg-black/80 backdrop-blur-sm text-secondary dark:text-teal-400 text-xs font-bold px-2 py-1 rounded-md shadow-sm">টিকা ও ভ্যাকসিন</span>
                                </div>
                            </div>
                            <div className="p-5 flex flex-col flex-grow">
                                <h4 className="text-xl font-bold text-text-main dark:text-white mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                                    নবজাতকের টিকার সময়সূচি ও গুরুত্ব
                                </h4>
                                <p className="text-text-sub dark:text-gray-400 text-sm line-clamp-2 mb-4">
                                    জন্মের পর থেকে শিশুকে কোন বয়সে কোন টিকা দিতে হবে তার একটি পূর্ণাঙ্গ গাইডলাইন।
                                </p>
                                <div className="mt-auto flex items-center justify-between border-t border-gray-100 dark:border-gray-800 pt-4">
                                    <span className="text-xs text-text-sub dark:text-gray-400 flex items-center gap-1 font-display">
                                        <span className="material-symbols-outlined text-[14px]">timer</span> 8 min read
                                    </span>
                                    <span className="text-primary text-sm font-bold cursor-pointer hover:underline">পড়ুন</span>
                                </div>
                            </div>
                        </article>
                        {/* Article Card 6 */}
                        <article className="bg-white dark:bg-[#2a2a2a] rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group flex flex-col h-full border border-gray-100 dark:border-gray-800">
                            <div className="aspect-[16/10] overflow-hidden relative bg-gray-100 dark:bg-gray-800">
                                <img alt="Person jogging in park representing active lifestyle" className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCmHWDugi_avdjB2LHfeDXifrQ-Sa3PhL9mIbX-MLpEPQqbounmNvSiUmU8bou5q2j6qBJJN6g2trPKTQjzHT9sOkUnkPuLX-DNGQV6ZVn6QQ6jyQ6MCUPFD6pFPEUHny2XODBkGXntKKFI2Ji5Ux3Wn50Oa_7zv36Zzqe4lZbjQwb1sNN1Q3ZjMr_e67FElJKUF2AN7-_LV1iMG8CxJabcWnKGnhaU5IM3k0QbF1e6tIEii__HR4oRU9yXBdOjFI2IMkYQ3lFWsVQ" />
                                <div className="absolute top-3 left-3">
                                    <span className="bg-white/90 dark:bg-black/80 backdrop-blur-sm text-secondary dark:text-teal-400 text-xs font-bold px-2 py-1 rounded-md shadow-sm">লাইফস্টাইল</span>
                                </div>
                            </div>
                            <div className="p-5 flex flex-col flex-grow">
                                <h4 className="text-xl font-bold text-text-main dark:text-white mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                                    সুস্থ হার্ট: প্রতিদিনের অভ্যাসে ছোট পরিবর্তন
                                </h4>
                                <p className="text-text-sub dark:text-gray-400 text-sm line-clamp-2 mb-4">
                                    হৃদরোগের ঝুঁকি কমাতে আপনার প্রতিদিনের জীবনযাপনে আনুন এই সহজ পরিবর্তনগুলো।
                                </p>
                                <div className="mt-auto flex items-center justify-between border-t border-gray-100 dark:border-gray-800 pt-4">
                                    <span className="text-xs text-text-sub dark:text-gray-400 flex items-center gap-1 font-display">
                                        <span className="material-symbols-outlined text-[14px]">timer</span> 5 min read
                                    </span>
                                    <span className="text-primary text-sm font-bold cursor-pointer hover:underline">পড়ুন</span>
                                </div>
                            </div>
                        </article>
                    </div>
                    {/* Pagination */}
                    <div className="mt-12 flex justify-center">
                        <button className="bg-white dark:bg-[#2a2a2a] border border-gray-300 dark:border-gray-700 text-text-main dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-400 dark:hover:border-gray-600 font-bold py-3 px-8 rounded-xl shadow-sm transition-all flex items-center gap-2">
                            আরও দেখুন (Load More)
                            <span className="material-symbols-outlined">expand_more</span>
                        </button>
                    </div>
                </section>

                {/* Newsletter Section */}
                <section className="mt-16 bg-gradient-to-br from-secondary/10 to-primary/5 dark:from-secondary/20 dark:to-primary/10 rounded-3xl p-8 lg:p-12 relative overflow-hidden">
                    <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
                    <div className="relative z-10 max-w-3xl mx-auto text-center">
                        <div className="flex items-center justify-center mx-auto mb-6">
                            <div className="w-16 h-16 bg-white dark:bg-[#2a2a2a] rounded-2xl flex items-center justify-center shadow-sm text-primary">
                                <span className="material-symbols-outlined text-3xl">mail</span>
                            </div>
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold text-text-main dark:text-white mb-3">
                            সাপ্তাহিক স্বাস্থ্য টিপস পেতে সাবস্ক্রাইব করুন
                        </h2>
                        <p className="text-text-sub dark:text-gray-400 mb-8">
                            কোন স্প্যাম নয়, শুধুমাত্র আপনার সুস্থতার জন্য প্রয়োজনীয় পরামর্শ পৌঁছে যাবে আপনার ইনবক্সে।
                        </p>
                        <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                            <input 
                                className="flex-grow px-5 py-3 rounded-xl border border-gray-200 dark:border-gray-700 focus:border-primary focus:ring-1 focus:ring-primary outline-none text-text-main dark:text-white bg-white dark:bg-[#2a2a2a]" 
                                placeholder="আপনার ইমেইল (Your Email)" 
                                type="email"
                            />
                            <button className="bg-primary text-white font-bold px-6 py-3 rounded-xl shadow-md hover:bg-red-700 transition-colors whitespace-nowrap" type="button">
                                সাবস্ক্রাইব
                            </button>
                        </form>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default Blog;
