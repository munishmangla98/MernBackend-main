const User = require('../models/User');
const Blog = require('../models/Blog');

exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.updateUserProfile = async (req, res) => {
    const { name, profilePicture, genre } = req.body;
    const updatedProfile = { name, profilePicture, genre };

    try {
        let user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        user = await User.findByIdAndUpdate(req.user.id, { $set: updatedProfile }, { new: true }).select('-password');
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.getUserBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find({ author: req.params.id }).populate('author', 'name');
        if (!blogs) {
            return res.status(404).json({ msg: 'No blogs found for this user' });
        }
        res.json(blogs);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
