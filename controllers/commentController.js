const Blog = require('../models/Blog');
const User = require('../models/User');

// Add a comment to a blog post
const addComment = async (req, res) => {
  const blogId = req.params.id;
  const { content } = req.body;
  const userId = req.user.id;

  try {
    const blog = await Blog.findById(blogId);
    if (!blog) return res.status(404).json({ error: 'Blog not found' });

    const comment = {
      user: userId,
      content,
      date: new Date(),
    };

    blog.comments.push(comment);
    await blog.save();

    res.status(201).json(blog);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a comment on a blog post
const updateComment = async (req, res) => {
  const blogId = req.params.blogId;
  const commentId = req.params.commentId;
  const { content } = req.body;

  try {
    const blog = await Blog.findById(blogId);
    if (!blog) return res.status(404).json({ error: 'Blog not found' });

    const comment = blog.comments.id(commentId);
    if (!comment) return res.status(404).json({ error: 'Comment not found' });

    if (comment.user.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    comment.content = content;
    await blog.save();

    res.json(blog);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a comment on a blog post
const deleteComment = async (req, res) => {
  const blogId = req.params.blogId;
  const commentId = req.params.commentId;

  try {
    const blog = await Blog.findById(blogId);
    if (!blog) return res.status(404).json({ error: 'Blog not found' });

    const comment = blog.comments.id(commentId);
    if (!comment) return res.status(404).json({ error: 'Comment not found' });

    if (comment.user.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    // comment.remove();  //if this will not work then use below commad
    blog.comments.pull(commentId);

    await blog.save();  // Save the parent document to reflect the removal of the comment

    console.log('Comment removed:', comment);

    res.json(blog);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const getCommentsByBlogId = async (req, res) => {
  const blogId = req.params.id;

  try {
      const comments = await Comment.find({ blogId });
      res.json(comments);
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
  }
};
module.exports = {
  addComment,
  updateComment,
  deleteComment,
  getCommentsByBlogId,
};
