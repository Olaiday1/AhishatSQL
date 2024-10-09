const express = require('express');
const { createPost, editPost, readPost, deletePost, deleteComment } = require('../controller/post.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');
const router = express.Router();

router.post('/create', authMiddleware, createPost);
router.put('/edit', authMiddleware, editPost);
router.get('/read', authMiddleware, readPost);
router.delete('/posts/:postId', authMiddleware, deletePost);
router.delete('/comments/:commentId', authMiddleware, deleteComment);


module.exports = router;
