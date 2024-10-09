const express = require('express');
const { createUser, loginUser} = require('../controller/auth.controller');
const { deleteComment, deletePost, readPost,  } = require('../controller/post.controller');

const router = express.Router();

router.post('/sign-up', createUser);
router.post('/login', loginUser);
router.delete('/posts/:id', deletePost);
router.delete('/comments/:id', deleteComment);
router.read('/read/:id', readPost)

module.exports = router;
