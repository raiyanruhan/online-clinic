const pool = require('../config/db');

// Get all blogs (public)
const getBlogs = async (req, res) => {
    try {
        const { category, search, limit = 50, offset = 0 } = req.query;

        let query = `
            SELECT b.*, d.name as doctor_name, d.specialty, d.image_url as doctor_image
            FROM blogs b
            JOIN doctors d ON b.doctor_id = d.doctor_id
            WHERE b.status = 'published'
        `;
        const params = [];
        let paramCount = 0;

        if (category) {
            paramCount++;
            query += ` AND b.category = $${paramCount}`;
            params.push(category);
        }

        if (search) {
            paramCount++;
            query += ` AND (b.title ILIKE $${paramCount} OR b.excerpt ILIKE $${paramCount} OR b.content ILIKE $${paramCount})`;
            params.push(`%${search}%`);
        }

        query += ` ORDER BY b.created_at DESC LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
        params.push(parseInt(limit), parseInt(offset));

        const blogs = await pool.query(query, params);
        res.json(blogs.rows);
    } catch (err) {
        console.error('Error fetching blogs:', err);
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};

// Get single blog by ID
const getBlog = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user?.user_id; // Optional - for checking if user owns the blog

        console.log('Getting blog with ID:', id, 'User ID:', userId);

        let query = `
            SELECT b.*, d.name as doctor_name, d.specialty, d.image_url as doctor_image, d.designation, d.user_id as doctor_user_id
            FROM blogs b
            JOIN doctors d ON b.doctor_id = d.doctor_id
            WHERE b.blog_id = $1
        `;
        const params = [id];

        // If user is authenticated and owns the blog, show it even if draft
        // Otherwise, only show published blogs
        if (userId) {
            query += ` AND (b.status = 'published' OR d.user_id = $2)`;
            params.push(userId);
        } else {
            query += ` AND b.status = 'published'`;
        }

        console.log('Executing query:', query, 'with params:', params);
        const blog = await pool.query(query, params);

        console.log('Query result:', blog.rows.length, 'rows');

        if (blog.rows.length === 0) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        // Increment views only for published blogs
        if (blog.rows[0].status === 'published') {
            await pool.query('UPDATE blogs SET views = views + 1 WHERE blog_id = $1', [id]);
        }

        res.json(blog.rows[0]);
    } catch (err) {
        console.error('Error fetching blog:', err);
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};

// Get blogs by doctor (for doctor dashboard)
const getMyBlogs = async (req, res) => {
    try {
        const userId = req.user.user_id;
        
        // Get doctor_id from user_id
        const doctorRes = await pool.query('SELECT doctor_id FROM doctors WHERE user_id = $1', [userId]);
        if (doctorRes.rows.length === 0) {
            return res.status(404).json({ message: 'Doctor profile not found' });
        }
        const doctorId = doctorRes.rows[0].doctor_id;

        const blogs = await pool.query(
            'SELECT * FROM blogs WHERE doctor_id = $1 ORDER BY created_at DESC',
            [doctorId]
        );

        res.json(blogs.rows);
    } catch (err) {
        console.error('Error fetching my blogs:', err);
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};

// Create blog
const createBlog = async (req, res) => {
    try {
        const userId = req.user.user_id;
        
        // Get doctor_id from user_id
        const doctorRes = await pool.query('SELECT doctor_id FROM doctors WHERE user_id = $1', [userId]);
        if (doctorRes.rows.length === 0) {
            return res.status(404).json({ message: 'Doctor profile not found' });
        }
        const doctorId = doctorRes.rows[0].doctor_id;

        const { title, content, content_markdown, excerpt, category, featured_image_url, reading_time, status } = req.body;

        // Validation
        if (!title || !title.trim()) {
            return res.status(400).json({ message: 'Title is required' });
        }
        if (!content || !content.trim()) {
            return res.status(400).json({ message: 'Content is required' });
        }

        // Calculate reading time if not provided (average reading speed: 200 words/min)
        let calculatedReadingTime = reading_time;
        if (!calculatedReadingTime && content) {
            const wordCount = content.split(/\s+/).filter(word => word.length > 0).length;
            calculatedReadingTime = Math.max(1, Math.ceil(wordCount / 200));
        }

        const newBlog = await pool.query(
            `INSERT INTO blogs (doctor_id, title, content, content_markdown, excerpt, category, featured_image_url, reading_time, status)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
             RETURNING *`,
            [
                doctorId, 
                title.trim(), 
                content.trim(), 
                (content_markdown || content).trim(), 
                excerpt ? excerpt.trim() : null, 
                category || null, 
                featured_image_url || null, 
                calculatedReadingTime || 5, 
                status || 'published'
            ]
        );

        res.json(newBlog.rows[0]);
    } catch (err) {
        console.error('Error creating blog:', err);
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};

// Update blog
const updateBlog = async (req, res) => {
    try {
        const userId = req.user.user_id;
        const { id } = req.params;

        // Get doctor_id from user_id
        const doctorRes = await pool.query('SELECT doctor_id FROM doctors WHERE user_id = $1', [userId]);
        if (doctorRes.rows.length === 0) {
            return res.status(404).json({ message: 'Doctor profile not found' });
        }
        const doctorId = doctorRes.rows[0].doctor_id;

        // Verify blog belongs to doctor
        const blogCheck = await pool.query('SELECT doctor_id FROM blogs WHERE blog_id = $1', [id]);
        if (blogCheck.rows.length === 0) {
            return res.status(404).json({ message: 'Blog not found' });
        }
        if (blogCheck.rows[0].doctor_id !== doctorId) {
            return res.status(403).json({ message: 'Not authorized to update this blog' });
        }

        const { title, content, content_markdown, excerpt, category, featured_image_url, reading_time, status } = req.body;

        const updateFields = [];
        const values = [];
        let paramCount = 0;

        if (title !== undefined) {
            paramCount++;
            updateFields.push(`title = $${paramCount}`);
            values.push(title);
        }
        if (content !== undefined) {
            paramCount++;
            updateFields.push(`content = $${paramCount}`);
            values.push(content);
        }
        if (content_markdown !== undefined) {
            paramCount++;
            updateFields.push(`content_markdown = $${paramCount}`);
            values.push(content_markdown);
        }
        if (excerpt !== undefined) {
            paramCount++;
            updateFields.push(`excerpt = $${paramCount}`);
            values.push(excerpt);
        }
        if (category !== undefined) {
            paramCount++;
            updateFields.push(`category = $${paramCount}`);
            values.push(category);
        }
        if (featured_image_url !== undefined) {
            paramCount++;
            updateFields.push(`featured_image_url = $${paramCount}`);
            values.push(featured_image_url);
        }
        if (reading_time !== undefined) {
            paramCount++;
            updateFields.push(`reading_time = $${paramCount}`);
            values.push(reading_time);
        }
        if (status !== undefined) {
            paramCount++;
            updateFields.push(`status = $${paramCount}`);
            values.push(status);
        }

        updateFields.push(`updated_at = CURRENT_TIMESTAMP`);
        paramCount++;
        values.push(id);

        const updatedBlog = await pool.query(
            `UPDATE blogs SET ${updateFields.join(', ')} WHERE blog_id = $${paramCount} RETURNING *`,
            values
        );

        res.json(updatedBlog.rows[0]);
    } catch (err) {
        console.error('Error updating blog:', err);
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};

// Delete blog
const deleteBlog = async (req, res) => {
    try {
        const userId = req.user.user_id;
        const { id } = req.params;

        // Get doctor_id from user_id
        const doctorRes = await pool.query('SELECT doctor_id FROM doctors WHERE user_id = $1', [userId]);
        if (doctorRes.rows.length === 0) {
            return res.status(404).json({ message: 'Doctor profile not found' });
        }
        const doctorId = doctorRes.rows[0].doctor_id;

        // Verify blog belongs to doctor
        const blogCheck = await pool.query('SELECT doctor_id FROM blogs WHERE blog_id = $1', [id]);
        if (blogCheck.rows.length === 0) {
            return res.status(404).json({ message: 'Blog not found' });
        }
        if (blogCheck.rows[0].doctor_id !== doctorId) {
            return res.status(403).json({ message: 'Not authorized to delete this blog' });
        }

        await pool.query('DELETE FROM blogs WHERE blog_id = $1', [id]);
        res.json({ message: 'Blog deleted successfully' });
    } catch (err) {
        console.error('Error deleting blog:', err);
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};

module.exports = {
    getBlogs,
    getBlog,
    getMyBlogs,
    createBlog,
    updateBlog,
    deleteBlog
};


