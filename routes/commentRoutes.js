const express = require('express');
// const { getCommentsByBlogId } = require('../controllers/commentController');
const {addComment,updateComment,  deleteComment,getCommentsByBlogId} = require('../controllers/commentController');
const  auth  = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/blogs/:id/comments', auth, addComment);
router.put('/blogs/:blogId/comments/:commentId', auth, updateComment);
router.delete('/blogs/:blogId/comments/:commentId', auth, deleteComment);
router.get('/blog/:id', getCommentsByBlogId);


module.exports = router;
