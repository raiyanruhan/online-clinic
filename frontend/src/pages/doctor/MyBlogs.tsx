import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useModal } from '../../contexts/ModalContext';

const MyBlogs = () => {
    const navigate = useNavigate();
    const { showAlert, showConfirm } = useModal();
    const [blogs, setBlogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBlogs();
    }, []);

    const fetchBlogs = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:5000/api/blogs/doctor/my-blogs', {
                headers: { 'x-auth-token': token || '' }
            });
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

    const handleDelete = async (blogId: number) => {
        const confirmed = await showConfirm({
            title: 'Delete Blog',
            message: 'Are you sure you want to delete this blog? This action cannot be undone.',
            type: 'danger',
            confirmText: 'Delete',
            cancelText: 'Cancel'
        });

        if (!confirmed) {
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`http://localhost:5000/api/blogs/${blogId}`, {
                method: 'DELETE',
                headers: { 'x-auth-token': token || '' }
            });

            if (res.ok) {
                showAlert({ message: 'Blog deleted successfully', type: 'success' });
                fetchBlogs();
            } else {
                const data = await res.json();
                showAlert({ message: data.message || 'Failed to delete blog', type: 'error' });
            }
        } catch (error) {
            console.error('Error deleting blog:', error);
            showAlert({ message: 'Something went wrong', type: 'error' });
        }
    };

    const getStatusBadge = (status: string) => {
        if (status === 'published') {
            return (
                <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold rounded">
                    Published
                </span>
            );
        }
        return (
            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-400 text-xs font-bold rounded">
                Draft
            </span>
        );
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <span className="material-symbols-outlined text-5xl text-primary animate-spin">progress_activity</span>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">My Blogs</h2>
                <button
                    onClick={() => navigate('/write-blog')}
                    className="px-4 py-2 bg-primary text-white font-bold rounded-lg shadow-md hover:bg-red-700 transition-colors flex items-center gap-2"
                >
                    <span className="material-symbols-outlined">add</span>
                    New Blog
                </button>
            </div>

            {blogs.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 text-center border border-gray-200 dark:border-gray-700">
                    <span className="material-symbols-outlined text-6xl text-gray-300 dark:text-gray-600 mb-4">article</span>
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">No blogs yet</h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">Start sharing your knowledge by writing your first blog post.</p>
                    <button
                        onClick={() => navigate('/write-blog')}
                        className="px-6 py-3 bg-primary text-white font-bold rounded-lg shadow-md hover:bg-red-700 transition-colors inline-flex items-center gap-2"
                    >
                        <span className="material-symbols-outlined">edit</span>
                        Write Your First Blog
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {blogs.map((blog) => (
                        <div
                            key={blog.blog_id}
                            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
                        >
                            <div className="flex flex-col md:flex-row gap-4">
                                {blog.featured_image_url && (
                                    <div className="w-full md:w-32 h-32 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0">
                                        <img
                                            src={blog.featured_image_url}
                                            alt={blog.title}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                )}
                                <div className="flex-1 flex flex-col">
                                    <div className="flex items-start justify-between gap-4 mb-2">
                                        <div className="flex-1">
                                            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2 line-clamp-2">
                                                {blog.title}
                                            </h3>
                                            {blog.excerpt && (
                                                <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                                                    {blog.excerpt}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-3 mb-4">
                                        {getStatusBadge(blog.status)}
                                        {blog.category && (
                                            <span className="px-2 py-1 bg-secondary/10 text-secondary text-xs font-bold rounded">
                                                {blog.category}
                                            </span>
                                        )}
                                        <span className="text-xs text-gray-500 dark:text-gray-400">
                                            {formatBDDateWithMonth(blog.created_at)}
                                        </span>
                                        <span className="text-xs text-gray-500 dark:text-gray-400">
                                            {blog.views || 0} views
                                        </span>
                                        <span className="text-xs text-gray-500 dark:text-gray-400">
                                            {blog.reading_time || 5} min read
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3 mt-auto">
                                        <Link
                                            to={`/blog/${blog.blog_id}`}
                                            target="_blank"
                                            className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm font-medium flex items-center gap-2"
                                        >
                                            <span className="material-symbols-outlined text-base">visibility</span>
                                            View
                                        </Link>
                                        <button
                                            onClick={() => navigate(`/write-blog?edit=${blog.blog_id}`)}
                                            className="px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors text-sm font-medium flex items-center gap-2"
                                        >
                                            <span className="material-symbols-outlined text-base">edit</span>
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(blog.blog_id)}
                                            className="px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors text-sm font-medium flex items-center gap-2"
                                        >
                                            <span className="material-symbols-outlined text-base">delete</span>
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyBlogs;

