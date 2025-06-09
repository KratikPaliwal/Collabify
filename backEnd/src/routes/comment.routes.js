const express = require('express');
const router = express.Router();
const { verifyJWT } = require('../middlewares/auth.middleware.js');
const { addComment,
        deleteComment,
        getCommentByPosts,
        updateComment
} = require('../contollers/comment-controller.js');

router.use(verifyJWT);

// Routes
router.post('/post/:postId', addComment);
router.delete('/:commentId', deleteComment);
router.get('/post/:postId', getCommentByPosts);
router.put('/:commentId', updateComment);

module.exports = {
    commentRouter : router
}