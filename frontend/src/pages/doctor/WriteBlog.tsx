import { API_BASE_URL } from '../../config';
import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Header from '../../components/Header';
import { useModal } from '../../contexts/ModalContext';

const WriteBlog = () => {
    const { showAlert, showPrompt } = useModal();
    const navigate = useNavigate();
    const searchParams = useSearchParams()[0];
    const editId = searchParams.get('edit');
    const [blogId, setBlogId] = useState<number | null>(editId ? parseInt(editId) : null);
    const [loading, setLoading] = useState(!!editId);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [excerpt, setExcerpt] = useState('');
    const [category, setCategory] = useState('');
    const [featuredImageUrl, setFeaturedImageUrl] = useState('');
    const [status, setStatus] = useState('published');
    const [saving, setSaving] = useState(false);
    
    const editorRef = useRef<HTMLDivElement>(null);

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
        if (editId) {
            fetchBlog();
        }
    }, [editId]);

    useEffect(() => {
        if (editorRef.current && content) {
            // Convert markdown to HTML for editing
            const html = markdownToHtml(content);
            if (editorRef.current.innerHTML !== html) {
                editorRef.current.innerHTML = html;
            }
        }
    }, []);

    const fetchBlog = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_BASE_URL}/api/blogs/${editId}`, {
                headers: { 
                    'x-auth-token': token || '',
                    'Content-Type': 'application/json'
                }
            });
            
            if (res.ok) {
                const data = await res.json();
                setBlogId(data.blog_id);
                setTitle(data.title || '');
                setContent(data.content || '');
                setExcerpt(data.excerpt || '');
                setCategory(data.category || '');
                setFeaturedImageUrl(data.featured_image_url || '');
                setStatus(data.status || 'published');
                
                // Set editor content after a brief delay to ensure ref is ready
                setTimeout(() => {
                    if (editorRef.current && data.content) {
                        editorRef.current.innerHTML = markdownToHtml(data.content);
                    }
                }, 100);
            } else {
                const errorData = await res.json().catch(() => ({ message: 'Failed to load blog' }));
                showAlert({ message: errorData.message || 'Failed to load blog', type: 'error' });
                navigate('/dashboard');
            }
        } catch (error) {
            console.error('Error fetching blog:', error);
            showAlert({ message: 'Something went wrong while loading the blog', type: 'error' });
            navigate('/dashboard');
        } finally {
            setLoading(false);
        }
    };

    const markdownToHtml = (markdown: string): string => {
        if (!markdown) return '<p><br /></p>';
        
        // Process line by line to handle headings properly
        const lines = markdown.split('\n');
        let html = '';
        let inParagraph = false;
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            
            // Headings (must check in order: h1, h2, h3)
            if (line.startsWith('# ')) {
                if (inParagraph) {
                    html += '</p>';
                    inParagraph = false;
                }
                const text = line.substring(2).trim();
                html += `<h1 style="font-size: 2.25rem; font-weight: bold; margin-top: 2.5rem; margin-bottom: 1.25rem; color: inherit;">${text}</h1>`;
            } else if (line.startsWith('## ')) {
                if (inParagraph) {
                    html += '</p>';
                    inParagraph = false;
                }
                const text = line.substring(3).trim();
                html += `<h2 style="font-size: 1.875rem; font-weight: bold; margin-top: 2rem; margin-bottom: 1rem; color: inherit;">${text}</h2>`;
            } else if (line.startsWith('### ')) {
                if (inParagraph) {
                    html += '</p>';
                    inParagraph = false;
                }
                const text = line.substring(4).trim();
                html += `<h3 style="font-size: 1.5rem; font-weight: bold; margin-top: 1.5rem; margin-bottom: 0.75rem; color: inherit;">${text}</h3>`;
            } else if (line === '') {
                // Empty line - close paragraph if open
                if (inParagraph) {
                    html += '</p>';
                    inParagraph = false;
                }
                html += '<p><br /></p>';
            } else {
                // Regular text line
                if (!inParagraph) {
                    html += '<p>';
                    inParagraph = true;
                } else {
                    html += '<br />';
                }
                
                // Process inline formatting
                let processedLine = line
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    .replace(/\*(.*?)\*/g, '<em>$1</em>')
                    .replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1" style="max-width: 100%; border-radius: 0.5rem; margin: 1rem 0;" />')
                    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" style="color: #d11010; text-decoration: underline;">$1</a>');
                
                html += processedLine;
            }
        }
        
        // Close any open paragraph
        if (inParagraph) {
            html += '</p>';
        }
        
        return html || '<p><br /></p>';
    };

    const htmlToMarkdown = (html: string): string => {
        if (!html) return '';
        
        let markdown = html
            // Headings
            .replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1\n\n')
            .replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n\n')
            .replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1\n\n')
            // Bold and italic
            .replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**')
            .replace(/<b[^>]*>(.*?)<\/b>/gi, '**$1**')
            .replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*')
            .replace(/<i[^>]*>(.*?)<\/i>/gi, '*$1*')
            // Images
            .replace(/<img[^>]*src=["']([^"']*)["'][^>]*alt=["']([^"']*)["'][^>]*>/gi, '![$2]($1)')
            .replace(/<img[^>]*src=["']([^"']*)["'][^>]*>/gi, '![]($1)')
            // Links
            .replace(/<a[^>]*href=["']([^"']*)["'][^>]*>(.*?)<\/a>/gi, '[$2]($1)')
            // Paragraphs and line breaks
            .replace(/<p[^>]*>/gi, '')
            .replace(/<\/p>/gi, '\n\n')
            .replace(/<br\s*\/?>/gi, '\n')
            .replace(/<div[^>]*>/gi, '')
            .replace(/<\/div>/gi, '\n')
            // Remove other HTML tags
            .replace(/<[^>]+>/g, '')
            // Clean up extra newlines
            .replace(/\n{3,}/g, '\n\n')
            .trim();
        
        return markdown;
    };

    const handleEditorInput = () => {
        if (editorRef.current) {
            const html = editorRef.current.innerHTML;
            const markdown = htmlToMarkdown(html);
            setContent(markdown);
        }
    };

    const handleEditorPaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const text = e.clipboardData.getData('text/plain');
        
        // Check if the text contains markdown syntax
        const hasMarkdown = /^#+\s|^\*\*|^\*[^*]|!\[.*?\]\(|\[.*?\]\(/.test(text) || 
                           text.includes('**') || 
                           text.includes('*') && !text.match(/^\*[^*]/) ||
                           text.includes('[') && text.includes('](') ||
                           text.includes('![') && text.includes('](');
        
        if (hasMarkdown) {
            // Convert markdown to HTML and insert
            const html = markdownToHtml(text);
            const selection = window.getSelection();
            if (selection && selection.rangeCount > 0) {
                const range = selection.getRangeAt(0);
                range.deleteContents();
                
                // Create a temporary div to parse the HTML
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = html;
                
                // Insert each node from the converted HTML
                const fragment = document.createDocumentFragment();
                while (tempDiv.firstChild) {
                    fragment.appendChild(tempDiv.firstChild);
                }
                range.insertNode(fragment);
                
                // Move cursor to end of inserted content
                range.collapse(false);
                selection.removeAllRanges();
                selection.addRange(range);
            }
        } else {
            // Plain text - insert as is
            document.execCommand('insertText', false, text);
        }
        
        handleEditorInput();
    };

    const handleEditorKeyDown = (e: React.KeyboardEvent) => {
        // Enable undo/redo with Ctrl+Z and Ctrl+Y / Ctrl+Shift+Z
        if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
            // Ctrl+Z or Cmd+Z - Undo
            e.preventDefault();
            document.execCommand('undo', false);
            handleEditorInput();
        } else if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
            // Ctrl+Y or Ctrl+Shift+Z or Cmd+Y or Cmd+Shift+Z - Redo
            e.preventDefault();
            document.execCommand('redo', false);
            handleEditorInput();
        }
    };

    const execCommand = (command: string, value: string | undefined = undefined) => {
        document.execCommand(command, false, value);
        editorRef.current?.focus();
        handleEditorInput();
    };

    const handleBold = () => execCommand('bold');
    const handleItalic = () => execCommand('italic');
    const handleHeading = (level: number) => {
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            const selectedText = range.toString();
            
            if (selectedText) {
                // If text is selected, wrap it in heading
                const heading = document.createElement(`h${level}`);
                heading.textContent = selectedText;
                heading.style.fontSize = level === 1 ? '2.25rem' : level === 2 ? '1.875rem' : '1.5rem';
                heading.style.fontWeight = 'bold';
                heading.style.marginTop = level === 1 ? '2.5rem' : level === 2 ? '2rem' : '1.5rem';
                heading.style.marginBottom = level === 1 ? '1.25rem' : level === 2 ? '1rem' : '0.75rem';
                heading.style.color = 'inherit';
                range.deleteContents();
                range.insertNode(heading);
                selection.removeAllRanges();
                const newRange = document.createRange();
                newRange.selectNodeContents(heading);
                newRange.collapse(false);
                selection.addRange(newRange);
            } else {
                // If no selection, create heading at cursor
                execCommand('formatBlock', `h${level}`);
                // Apply styles to the newly created heading
                setTimeout(() => {
                    const heading = editorRef.current?.querySelector('h1, h2, h3');
                    if (heading) {
                        const hLevel = parseInt(heading.tagName.charAt(1));
                        (heading as HTMLElement).style.fontSize = hLevel === 1 ? '2.25rem' : hLevel === 2 ? '1.875rem' : '1.5rem';
                        (heading as HTMLElement).style.fontWeight = 'bold';
                        (heading as HTMLElement).style.marginTop = hLevel === 1 ? '2.5rem' : hLevel === 2 ? '2rem' : '1.5rem';
                        (heading as HTMLElement).style.marginBottom = hLevel === 1 ? '1.25rem' : hLevel === 2 ? '1rem' : '0.75rem';
                        (heading as HTMLElement).style.color = 'inherit';
                    }
                }, 0);
            }
            handleEditorInput();
        }
    };
    
    const handleInsertImage = async () => {
        const url = await showPrompt({
            title: 'Insert Image',
            message: 'Enter image URL:',
            placeholder: 'https://example.com/image.jpg',
            type: 'url'
        });
        if (url) {
            const alt = await showPrompt({
                title: 'Image Description',
                message: 'Enter image description (optional):',
                placeholder: 'Image description',
                defaultValue: ''
            }) || '';
            const img = document.createElement('img');
            img.src = url;
            img.alt = alt;
            img.style.maxWidth = '100%';
            img.style.borderRadius = '0.5rem';
            img.style.margin = '1rem 0';
            document.execCommand('insertHTML', false, img.outerHTML);
            handleEditorInput();
        }
    };

    const handleLink = async () => {
        const url = await showPrompt({
            title: 'Insert Link',
            message: 'Enter URL:',
            placeholder: 'https://example.com',
            type: 'url'
        });
        if (url) {
            const text = await showPrompt({
                title: 'Link Text',
                message: 'Enter link text (optional):',
                placeholder: 'Link text',
                defaultValue: url
            }) || url;
            document.execCommand('createLink', false, url);
            const selection = window.getSelection();
            if (selection && selection.rangeCount > 0) {
                const range = selection.getRangeAt(0);
                if (range.startContainer.nodeType === Node.TEXT_NODE) {
                    range.startContainer.textContent = text;
                }
            }
            handleEditorInput();
        }
    };

    const handleSave = async () => {
        if (!title.trim()) {
            showAlert({ message: 'Please enter a title', type: 'warning' });
            return;
        }

        if (editorRef.current) {
            const html = editorRef.current.innerHTML;
            const markdown = htmlToMarkdown(html);
            if (!markdown.trim()) {
                showAlert({ message: 'Please add some content', type: 'warning' });
                return;
            }
            setContent(markdown);
        }

        if (!content.trim()) {
            showAlert({ message: 'Please add some content', type: 'warning' });
            return;
        }

        setSaving(true);
        try {
            const token = localStorage.getItem('token');
            const url = blogId 
                ? `${API_BASE_URL}/api/blogs/${blogId}`
                : `${API_BASE_URL}/api/blogs`;
            const method = blogId ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token || ''
                },
                body: JSON.stringify({
                    title,
                    content,
                    content_markdown: content,
                    excerpt: excerpt || content.substring(0, 200).replace(/\n/g, ' '),
                    category,
                    featured_image_url: featuredImageUrl,
                    status
                })
            });

            if (response.ok) {
                showAlert({ message: blogId ? 'Blog updated successfully!' : 'Blog saved successfully!', type: 'success' });
                navigate('/dashboard');
            } else {
                try {
                    const data = await response.json();
                    showAlert({ message: data.message || data.error || 'Failed to save blog', type: 'error' });
                } catch (parseError) {
                    const text = await response.text();
                    showAlert({ message: `Failed to save blog: ${text || 'Unknown error'}`, type: 'error' });
                }
            }
        } catch (error: any) {
            console.error('Error saving blog:', error);
            showAlert({ message: `Something went wrong: ${error.message || 'Unknown error'}`, type: 'error' });
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="bg-background-light dark:bg-background-dark min-h-screen flex flex-col font-display text-text-main dark:text-gray-100">
            <Header />
            <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 pb-20 md:pb-8">
                {loading ? (
                    <div className="flex items-center justify-center py-12 sm:py-20">
                        <span className="material-symbols-outlined text-4xl sm:text-5xl text-primary animate-spin">progress_activity</span>
                    </div>
                ) : (
                    <>
                        <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">
                                {blogId ? 'Edit Blog' : 'Write Blog'}
                            </h1>
                            <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
                                <button
                                    onClick={() => navigate('/dashboard')}
                                    className="flex-1 sm:flex-initial px-4 py-2 text-sm sm:text-base bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="flex-1 sm:flex-initial px-4 sm:px-6 py-2 text-sm sm:text-base bg-primary text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors font-bold"
                                >
                                    {saving ? (blogId ? 'Updating...' : 'Saving...') : (blogId ? 'Update' : 'Publish')}
                                </button>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 space-y-4 sm:space-y-6">
                            {/* Title */}
                            <div>
                                <label className="block text-xs sm:text-sm font-semibold mb-1.5 sm:mb-2 text-gray-700 dark:text-gray-300">Title</label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                                    placeholder="Enter blog title..."
                                />
                            </div>

                            {/* Category and Featured Image */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                                <div>
                                    <label className="block text-xs sm:text-sm font-semibold mb-1.5 sm:mb-2 text-gray-700 dark:text-gray-300">Category</label>
                                    <select
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                                    >
                                        <option value="">Select category</option>
                                        {categories.map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs sm:text-sm font-semibold mb-1.5 sm:mb-2 text-gray-700 dark:text-gray-300">Featured Image URL</label>
                                    <input
                                        type="url"
                                        value={featuredImageUrl}
                                        onChange={(e) => setFeaturedImageUrl(e.target.value)}
                                        className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                                        placeholder="https://..."
                                    />
                                </div>
                            </div>

                            {/* Excerpt */}
                            <div>
                                <label className="block text-xs sm:text-sm font-semibold mb-1.5 sm:mb-2 text-gray-700 dark:text-gray-300">Excerpt (Short description)</label>
                                <textarea
                                    value={excerpt}
                                    onChange={(e) => setExcerpt(e.target.value)}
                                    rows={3}
                                    className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary outline-none resize-none"
                                    placeholder="Brief description of the blog..."
                                />
                            </div>

                            {/* Toolbar */}
                            <div className="flex flex-wrap gap-1.5 sm:gap-2 p-2 sm:p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 overflow-x-auto">
                                <button
                                    onClick={handleBold}
                                    className="px-2 sm:px-3 py-1.5 sm:py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-xs sm:text-sm shrink-0"
                                    title="Bold"
                                    type="button"
                                >
                                    <span className="font-bold">B</span>
                                </button>
                                <button
                                    onClick={handleItalic}
                                    className="px-2 sm:px-3 py-1.5 sm:py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-xs sm:text-sm shrink-0"
                                    title="Italic"
                                    type="button"
                                >
                                    <span className="italic">I</span>
                                </button>
                                <div className="border-l border-gray-300 dark:border-gray-600 mx-0.5 sm:mx-1 shrink-0"></div>
                                <button
                                    onClick={() => handleHeading(1)}
                                    className="px-2 sm:px-3 py-1.5 sm:py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-xs sm:text-sm font-bold shrink-0"
                                    title="Heading 1"
                                    type="button"
                                >
                                    H1
                                </button>
                                <button
                                    onClick={() => handleHeading(2)}
                                    className="px-2 sm:px-3 py-1.5 sm:py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-xs sm:text-sm font-bold shrink-0"
                                    title="Heading 2"
                                    type="button"
                                >
                                    H2
                                </button>
                                <button
                                    onClick={() => handleHeading(3)}
                                    className="px-2 sm:px-3 py-1.5 sm:py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-xs sm:text-sm font-bold shrink-0"
                                    title="Heading 3"
                                    type="button"
                                >
                                    H3
                                </button>
                                <div className="border-l border-gray-300 dark:border-gray-600 mx-0.5 sm:mx-1 shrink-0"></div>
                                <button
                                    onClick={handleInsertImage}
                                    className="px-2 sm:px-3 py-1.5 sm:py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-1 shrink-0"
                                    title="Insert Image"
                                    type="button"
                                >
                                    <span className="material-symbols-outlined text-base sm:text-lg">image</span>
                                </button>
                                <button
                                    onClick={handleLink}
                                    className="px-2 sm:px-3 py-1.5 sm:py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-1 shrink-0"
                                    title="Insert Link"
                                    type="button"
                                >
                                    <span className="material-symbols-outlined text-base sm:text-lg">link</span>
                                </button>
                            </div>

                            {/* Content Editor - WYSIWYG */}
                            <div className="sm:sticky sm:top-4 z-10">
                                <label className="block text-xs sm:text-sm font-semibold mb-1.5 sm:mb-2 text-gray-700 dark:text-gray-300">Content</label>
                                <div
                                    ref={editorRef}
                                    contentEditable
                                    onInput={handleEditorInput}
                                    onPaste={handleEditorPaste}
                                    onKeyDown={handleEditorKeyDown}
                                    className="min-h-[400px] sm:min-h-[500px] md:min-h-[600px] max-h-[calc(100vh-200px)] sm:max-h-[calc(100vh-300px)] overflow-y-auto w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                                    style={{
                                        whiteSpace: 'pre-wrap',
                                        wordWrap: 'break-word',
                                        lineHeight: '1.75'
                                    }}
                                    suppressContentEditableWarning={true}
                                >
                                    <p><br /></p>
                                </div>
                                <p className="mt-1.5 sm:mt-2 text-xs text-gray-500 dark:text-gray-400">
                                    Click here to start writing. Use the toolbar above to format your text.
                                </p>
                            </div>

                            {/* Status */}
                            <div className="relative z-10">
                                <label className="block text-xs sm:text-sm font-semibold mb-1.5 sm:mb-2 text-gray-700 dark:text-gray-300">Status</label>
                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary outline-none relative z-[101]"
                                >
                                    <option value="published">Published</option>
                                    <option value="draft">Draft</option>
                                </select>
                            </div>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
};

export default WriteBlog;
