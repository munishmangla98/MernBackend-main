const Blog = require('../models/Blog');

exports.getAllBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find().populate('author', 'name');
        res.json(blogs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createBlog = async (req, res) => {
    const { title, content } = req.body;
    try {
        const blog = new Blog({ title, content, author: req.user._id });
        await blog.save();
        res.status(201).json(blog);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};


const mongoose = require('mongoose');

exports.updateBlog = async (req, res) => {
    const { id } = req.params;
    const { title, content, author } = req.body;

    try {
        let blog = await Blog.findById(id);

        if (!blog) {
            return res.status(404).json({ error: 'Blog not found' });
        }

        console.log('Blog author ID:', blog.author.toString());
        console.log('Logged in user ID:', req.user.id);

        // Check if the logged-in user is the author of the blog
        if (blog.author.toString() !== req.user.id) {
            return res.status(401).json({ error: 'Not authorized' });
        }

        blog.title = title || blog.title;
        blog.content = content || blog.content;

        // Check if author is provided and if it's a valid ObjectId
        if (author && mongoose.Types.ObjectId.isValid(author)) {
            blog.author = author;
        }

        await blog.save();
        res.json(blog);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};


exports.deleteBlog = async (req, res) => {
    const { id } = req.params;

    try {
        const blog = await Blog.findById(id);
        if (!blog) {
            return res.status(404).json({ error: 'Blog not found' });
        }

        console.log('Blog author ID:', blog.author.toString());
        console.log('Logged in user ID:', req.user.id);

        if (blog.author.toString() !== req.user.id) {
            console.error('Authorization failed: User is not the author of the blog');
            return res.status(403).json({ error: 'User is not authorized to delete this blog' });
        }

        await Blog.deleteOne({ _id: id });
        console.log('Blog removed:', blog);
        res.json({ msg: 'Blog removed' });
    } catch (err) {
        console.error('Error deleting blog:', err.message);
        res.status(500).send('Server Error');
    }
};

// Controller function to get a single blog by ID
exports.getBlogById = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id).populate('author', 'name email');
        if (!blog) {
            return res.status(404).json({ error: 'Blog not found' });
        }
        res.status(200).json(blog);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};


// Search blogs by title or content
// exports.searchBlogs = async (req, res) => {
//     const { query } = req.query;
//     try {
//         const blogs = await Blog.find({
//             $or: [
//                 { title: { $regex: query, $options: 'i' } },
//                 { content: { $regex: query, $options: 'i' } }
//             ]
//         });
//         res.json(blogs);
//     } catch (error) {
//         res.status(500).json({ error: 'Error searching blogs' });
//     }
// };
exports.searchBlogs = async (req, res) => {
    try {
        const query = req.query.query;
        console.log('Search query:', query); // Add this line

        if (!query) {
            return res.status(400).json({ error: 'Query parameter is required' });
        }

        const blogs = await Blog.find({
            $or: [
                { title: { $regex: query, $options: 'i' } },
                { content: { $regex: query, $options: 'i' } }
            ]
        });

        console.log('Blogs found:', blogs); // Add this line

        res.json(blogs);
    } catch (error) {
        console.error('Error fetching blogs:', error);
        res.status(500).json({ error: 'Server error' });
    }
};