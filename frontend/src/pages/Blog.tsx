import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Blog = () => {
    const [blogs, setBlogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');

    const categories = [
        'নারীদের স্বাস্থ্য',
        'শিশু যত্ন',
        'পুষ্টি ও ডায়েট',
        'মানসিক স্বাস্থ্য',
        'লাইফস্টাইল',
        'ডায়াবেটিস',
        'হৃদরোগ',
        'অন্যান্য'
    ];

    useEffect(() => {
        fetchBlogs();
    }, [selectedCategory, searchQuery]);

    const fetchBlogs = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (selectedCategory) params.append('category', selectedCategory);
            if (searchQuery) params.append('search', searchQuery);
            
            const res = await fetch(`http://localhost:5000/api/blogs?${params.toString()}`);
            if (res.ok) {
                const data = await res.json();
                setBlogs(data);
            }
        } catch (error) {
            console.error('Error fetching blogs:', error);
        } finally {
            setLoading(false);
        }
    };

    const latestBlog = blogs.length > 0 ? blogs[0] : null;
    const otherBlogs = blogs.slice(1);

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
                                className="block w-full pl-10 pr-4 py-3 rounded-xl border-none bg-white dark:bg-[#2a2a2a] shadow-sm text-text-main dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-primary/20 focus:bg-white dark:focus:bg-[#2a2a2a] transition-all outline-none" 
                                placeholder="নিবন্ধ খুঁজুন (Search articles...)" 
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Filter Chips */}
                <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-6 mb-2">
                    <button 
                        onClick={() => setSelectedCategory('')}
                        className={`shrink-0 px-5 py-2 rounded-xl text-sm font-medium shadow-sm transition-transform active:scale-95 ${
                            selectedCategory === '' 
                                ? 'bg-primary text-white' 
                                : 'bg-white dark:bg-[#2a2a2a] border border-transparent hover:border-gray-200 dark:hover:border-gray-700 text-text-main dark:text-gray-200 hover:shadow-md'
                        }`}
                    >
                        সকল (All)
                    </button>
                    {categories.map(category => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`shrink-0 px-5 py-2 rounded-xl text-sm font-medium shadow-sm transition-all ${
                                selectedCategory === category
                                    ? 'bg-primary text-white'
                                    : 'bg-white dark:bg-[#2a2a2a] border border-transparent hover:border-gray-200 dark:hover:border-gray-700 text-text-main dark:text-gray-200 hover:shadow-md'
                            }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <span className="material-symbols-outlined text-5xl text-primary animate-spin">progress_activity</span>
                    </div>
                ) : blogs.length === 0 ? (
                    <div className="text-center py-20 bg-white dark:bg-[#2a2a2a] rounded-2xl border border-gray-200 dark:border-gray-700">
                        <span className="material-symbols-outlined text-5xl text-gray-300 mb-4">article</span>
                        <p className="text-gray-500 dark:text-gray-400 text-lg">No blogs found</p>
                        <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">Try adjusting your search or filters</p>
                    </div>
                ) : (
                    <>
                        {/* Featured Article Hero (Latest Blog) */}
                        {latestBlog && (
                            <section className="mb-12">
                                <div className="bg-white dark:bg-[#2a2a2a] rounded-2xl p-4 md:p-6 shadow-sm hover:shadow-lg transition-shadow duration-300 border border-gray-100 dark:border-gray-800 group cursor-pointer">
                                    <Link to={`/blog/${latestBlog.blog_id}`}>
                                        <div className="flex flex-col md:flex-row gap-6 lg:gap-8 items-stretch">
                                            {/* Image Side */}
                                            <div className="w-full md:w-1/2 lg:w-7/12 aspect-video md:aspect-auto relative overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800">
                                                <div className="absolute top-4 left-4 bg-primary text-white text-xs font-bold px-3 py-1 rounded-lg uppercase tracking-wider z-10 shadow-sm font-display">
                                                    Latest
                                                </div>
                                                {latestBlog.featured_image_url ? (
                                                    <img 
                                                        alt={latestBlog.title} 
                                                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700" 
                                                        src={latestBlog.featured_image_url} 
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
                                                        <span className="material-symbols-outlined text-6xl text-gray-400">article</span>
                                                    </div>
                                                )}
                                            </div>
                                            {/* Content Side */}
                                            <div className="w-full md:w-1/2 lg:w-5/12 flex flex-col justify-center">
                                                <div className="flex items-center gap-2 mb-3">
                                                    {latestBlog.category && (
                                                        <span className="bg-secondary/10 text-secondary text-xs font-bold px-2 py-1 rounded-md">
                                                            {latestBlog.category}
                                                        </span>
                                                    )}
                                                    <span className="text-text-sub dark:text-gray-400 text-xs flex items-center gap-1 font-display">
                                                        <span className="material-symbols-outlined text-[16px]">schedule</span>
                                                        {latestBlog.reading_time || 5} min read
                                                    </span>
                                                </div>
                                                <h3 className="text-2xl lg:text-3xl font-bold text-text-main dark:text-white mb-3 leading-snug group-hover:text-secondary transition-colors">
                                                    {latestBlog.title}
                                                </h3>
                                                <p className="text-text-sub dark:text-gray-400 text-base mb-6 line-clamp-3">
                                                    {latestBlog.excerpt || latestBlog.content?.substring(0, 200) + '...'}
                                                </p>
                                                <div className="mt-auto flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                                                            {latestBlog.doctor_image ? (
                                                                <img alt={latestBlog.doctor_name} className="object-cover w-full h-full" src={latestBlog.doctor_image} />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center text-gray-500">
                                                                    <span className="material-symbols-outlined text-sm">person</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="text-xs">
                                                            <p className="font-bold text-text-main dark:text-white">{latestBlog.doctor_name}</p>
                                                            <p className="text-text-sub dark:text-gray-400">{latestBlog.specialty}</p>
                                                        </div>
                                                    </div>
                                                    <span className="flex items-center gap-1 text-primary font-bold text-sm group-hover:gap-2 transition-all">
                                                        পুরোটা পড়ুন <span className="material-symbols-outlined text-lg">arrow_forward</span>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            </section>
                        )}

                        {/* Article Grid */}
                        {otherBlogs.length > 0 && (
                            <section>
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-2xl font-bold text-text-main dark:text-white">সকল ব্লগ (All Blogs)</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {otherBlogs.map((blog) => (
                                        <Link key={blog.blog_id} to={`/blog/${blog.blog_id}`}>
                                            <article className="bg-white dark:bg-[#2a2a2a] rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group flex flex-col h-full border border-gray-100 dark:border-gray-800">
                                                <div className="aspect-[16/10] overflow-hidden relative bg-gray-100 dark:bg-gray-800">
                                                    {blog.featured_image_url ? (
                                                        <img 
                                                            alt={blog.title} 
                                                            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" 
                                                            src={blog.featured_image_url} 
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
                                                            <span className="material-symbols-outlined text-4xl text-gray-400">article</span>
                                                        </div>
                                                    )}
                                                    {blog.category && (
                                                        <div className="absolute top-3 left-3">
                                                            <span className="bg-white/90 dark:bg-black/80 backdrop-blur-sm text-secondary dark:text-teal-400 text-xs font-bold px-2 py-1 rounded-md shadow-sm">
                                                                {blog.category}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="p-5 flex flex-col flex-grow">
                                                    <h4 className="text-xl font-bold text-text-main dark:text-white mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                                                        {blog.title}
                                                    </h4>
                                                    <p className="text-text-sub dark:text-gray-400 text-sm line-clamp-2 mb-4">
                                                        {blog.excerpt || blog.content?.substring(0, 150) + '...'}
                                                    </p>
                                                    <div className="mt-auto flex items-center justify-between border-t border-gray-100 dark:border-gray-800 pt-4">
                                                        <span className="text-xs text-text-sub dark:text-gray-400 flex items-center gap-1 font-display">
                                                            <span className="material-symbols-outlined text-[14px]">timer</span>
                                                            {blog.reading_time || 5} min read
                                                        </span>
                                                        <span className="text-primary text-sm font-bold cursor-pointer hover:underline">
                                                            পড়ুন
                                                        </span>
                                                    </div>
                                                </div>
                                            </article>
                                        </Link>
                                    ))}
                                </div>
                            </section>
                        )}
                    </>
                )}
            </main>

            <Footer />
        </div>
    );
};

export default Blog;
