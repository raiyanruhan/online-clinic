import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useModal } from '../contexts/ModalContext';
import { formatBDDateWithMonth } from '../utils/dateUtils';

const BlogDetail = () => {
    const { showAlert } = useModal();
    const { id } = useParams();
    const [blog, setBlog] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [relatedBlogs, setRelatedBlogs] = useState<any[]>([]);

    useEffect(() => {
        fetchBlog();
        fetchRelatedBlogs();
    }, [id]);

    const fetchBlog = async () => {
        try {
            const res = await fetch(`http://localhost:5000/api/blogs/${id}`);
            if (res.ok) {
                const data = await res.json();
                setBlog(data);
            }
        } catch (error) {
            console.error('Error fetching blog:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchRelatedBlogs = async () => {
        try {
            const res = await fetch(`http://localhost:5000/api/blogs?limit=5`);
            if (res.ok) {
                const data = await res.json();
                // Filter out current blog and get up to 4 related blogs
                const related = data.filter((b: any) => b.blog_id !== parseInt(id || '0')).slice(0, 4);
                setRelatedBlogs(related);
            }
        } catch (error) {
            console.error('Error fetching related blogs:', error);
        }
    };

    const renderMarkdown = (text: string) => {
        if (!text) return '';
        
        let html = text
            .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold">$1</strong>')
            .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
            .replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1" class="max-w-full rounded-lg my-6 shadow-md" />')
            .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-primary hover:underline font-medium" target="_blank" rel="noopener noreferrer">$1</a>')
            .replace(/^### (.*$)/gim, '<h3 class="text-2xl font-bold mt-8 mb-4 text-gray-800 dark:text-white">$1</h3>')
            .replace(/^## (.*$)/gim, '<h2 class="text-3xl font-bold mt-10 mb-5 text-gray-800 dark:text-white">$1</h2>')
            .replace(/^# (.*$)/gim, '<h1 class="text-4xl font-bold mt-12 mb-6 text-gray-800 dark:text-white">$1</h1>')
            .replace(/^\- (.*$)/gim, '<li class="ml-6 mb-2 list-disc">$1</li>')
            .replace(/^\d+\. (.*$)/gim, '<li class="ml-6 mb-2 list-decimal">$1</li>')
            .split('\n\n')
            .map(para => para.trim() ? `<p class="mb-6 text-gray-700 dark:text-gray-300 leading-relaxed text-lg">${para.replace(/\n/g, '<br />')}</p>` : '')
            .join('');
        
        return html;
    };

    if (loading) {
        return (
            <div className="bg-background-light dark:bg-background-dark min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <span className="material-symbols-outlined text-5xl text-primary animate-spin">progress_activity</span>
                    <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
                </div>
            </div>
        );
    }

    if (!blog) {
        return (
            <div className="bg-background-light dark:bg-background-dark min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Blog not found</h2>
                    <Link to="/blog" className="text-primary hover:underline">Back to Blog</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-background-light dark:bg-background-dark min-h-screen flex flex-col font-display text-text-main dark:text-gray-100">
            <Header />
            <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Main Content */}
                    <article className="flex-1 min-w-0">
                        <Link to="/blog" className="inline-flex items-center gap-2 text-primary hover:underline mb-6">
                            <span className="material-symbols-outlined">arrow_back</span>
                            Back to Blog
                        </Link>

                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                            {blog.featured_image_url && (
                                <div className="w-full h-64 md:h-96 overflow-hidden">
                                    <img 
                                        src={blog.featured_image_url} 
                                        alt={blog.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}

                            <div className="p-6 md:p-10">
                                <div className="flex items-center gap-3 mb-4 flex-wrap">
                                    {blog.category && (
                                        <span className="bg-secondary/10 text-secondary text-sm font-bold px-3 py-1 rounded-md">
                                            {blog.category}
                                        </span>
                                    )}
                                    <span className="text-text-sub dark:text-gray-400 text-sm flex items-center gap-1">
                                        <span className="material-symbols-outlined text-base">schedule</span>
                                        {blog.reading_time || 5} min read
                                    </span>
                                    <span className="text-text-sub dark:text-gray-400 text-sm flex items-center gap-1">
                                        <span className="material-symbols-outlined text-base">visibility</span>
                                        {blog.views || 0} views
                                    </span>
                                </div>

                                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-text-main dark:text-white mb-4 leading-tight">
                                    {blog.title}
                                </h1>

                                {blog.excerpt && (
                                    <p className="text-lg md:text-xl text-text-sub dark:text-gray-400 mb-6 italic border-l-4 border-primary pl-4">
                                        {blog.excerpt}
                                    </p>
                                )}

                                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                                    <div className="w-14 h-14 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden flex-shrink-0">
                                        {blog.doctor_image ? (
                                            <img src={blog.doctor_image} alt={blog.doctor_name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-500">
                                                <span className="material-symbols-outlined text-2xl">person</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-text-main dark:text-white text-lg">{blog.doctor_name}</p>
                                        <p className="text-sm text-text-sub dark:text-gray-400">{blog.specialty}</p>
                                        {blog.designation && (
                                            <p className="text-xs text-text-sub dark:text-gray-400">{blog.designation}</p>
                                        )}
                                    </div>
                                    <div className="text-sm text-text-sub dark:text-gray-400 text-right flex-shrink-0">
                                        {formatBDDateWithMonth(blog.created_at, { month: 'long' })}
                                    </div>
                                </div>

                                {/* Share Button */}
                                <div className="mb-8 flex items-center gap-3">
                                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Share:</span>
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <button
                                            onClick={() => {
                                                if (navigator.share) {
                                                    navigator.share({
                                                        title: blog.title,
                                                        text: blog.excerpt || blog.title,
                                                        url: window.location.href
                                                    }).catch(() => {});
                                                } else {
                                                    navigator.clipboard.writeText(window.location.href);
                                                    showAlert({ message: 'Link copied to clipboard!', type: 'success' });
                                                }
                                            }}
                                            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 text-sm font-medium"
                                        >
                                            <span className="material-symbols-outlined text-lg">share</span>
                                            Share
                                        </button>
                                        <button
                                            onClick={() => {
                                                const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`;
                                                window.open(url, '_blank', 'width=600,height=400');
                                            }}
                                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm font-medium"
                                        >
                                            <span className="material-symbols-outlined text-lg">facebook</span>
                                            Facebook
                                        </button>
                                        <button
                                            onClick={() => {
                                                const url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(blog.title)}`;
                                                window.open(url, '_blank', 'width=600,height=400');
                                            }}
                                            className="px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors flex items-center gap-2 text-sm font-medium"
                                        >
                                            <span className="material-symbols-outlined text-lg">chat</span>
                                            Twitter
                                        </button>
                                        <button
                                            onClick={() => {
                                                const url = `https://wa.me/?text=${encodeURIComponent(blog.title + ' ' + window.location.href)}`;
                                                window.open(url, '_blank');
                                            }}
                                            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2 text-sm font-medium"
                                        >
                                            <span className="material-symbols-outlined text-lg">chat</span>
                                            WhatsApp
                                        </button>
                                        <button
                                            onClick={() => {
                                                navigator.clipboard.writeText(window.location.href);
                                                showAlert({ message: 'Link copied to clipboard!', type: 'success' });
                                            }}
                                            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors flex items-center gap-2 text-sm font-medium"
                                        >
                                            <span className="material-symbols-outlined text-lg">content_copy</span>
                                            Copy Link
                                        </button>
                                    </div>
                                </div>

                                <div 
                                    className="prose prose-lg max-w-none dark:prose-invert prose-headings:text-gray-800 dark:prose-headings:text-white prose-p:text-gray-700 dark:prose-p:text-gray-300"
                                    dangerouslySetInnerHTML={{ __html: renderMarkdown(blog.content_markdown || blog.content) }}
                                />
                            </div>
                        </div>
                    </article>

                    {/* Sidebar */}
                    <aside className="w-full lg:w-80 flex-shrink-0 space-y-6">
                        {/* Author Card */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 sticky top-24">
                            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">About the Author</h3>
                            <div className="flex flex-col items-center text-center">
                                <div className="w-20 h-20 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden mb-4">
                                    {blog.doctor_image ? (
                                        <img src={blog.doctor_image} alt={blog.doctor_name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-500">
                                            <span className="material-symbols-outlined text-3xl">person</span>
                                        </div>
                                    )}
                                </div>
                                <h4 className="font-bold text-lg text-gray-800 dark:text-white mb-1">{blog.doctor_name}</h4>
                                <p className="text-sm text-secondary dark:text-teal-400 font-medium mb-2">{blog.specialty}</p>
                                {blog.designation && (
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">{blog.designation}</p>
                                )}
                                <Link
                                    to={`/doctors`}
                                    className="text-sm text-primary hover:underline font-medium"
                                >
                                    View Profile →
                                </Link>
                            </div>
                        </div>

                        {/* Related Blogs */}
                        {relatedBlogs.length > 0 && (
                            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Related Articles</h3>
                                <div className="space-y-4">
                                    {relatedBlogs.map((relatedBlog) => (
                                        <Link
                                            key={relatedBlog.blog_id}
                                            to={`/blog/${relatedBlog.blog_id}`}
                                            className="block group"
                                        >
                                            <div className="flex gap-3">
                                                {relatedBlog.featured_image_url && (
                                                    <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 dark:bg-gray-700">
                                                        <img
                                                            src={relatedBlog.featured_image_url}
                                                            alt={relatedBlog.title}
                                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                        />
                                                    </div>
                                                )}
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="text-sm font-bold text-gray-800 dark:text-white line-clamp-2 group-hover:text-primary transition-colors mb-1">
                                                        {relatedBlog.title}
                                                    </h4>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                                        {formatBDDateWithMonth(relatedBlog.created_at, { month: 'short', day: 'numeric' })}
                                                    </p>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Quick Stats */}
                        <div className="bg-gradient-to-br from-primary/10 to-secondary/10 dark:from-primary/20 dark:to-secondary/20 rounded-2xl p-6 border border-primary/20">
                            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Article Stats</h3>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Reading Time</span>
                                    <span className="font-bold text-gray-800 dark:text-white">{blog.reading_time || 5} min</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Views</span>
                                    <span className="font-bold text-gray-800 dark:text-white">{blog.views || 0}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Published</span>
                                    <span className="font-bold text-gray-800 dark:text-white text-xs">
                                        {formatBDDateWithMonth(blog.created_at)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default BlogDetail;
