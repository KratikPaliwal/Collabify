const express = require('express');
const router = express.Router();
const { verifyJWT } = require('../middlewares/auth.middleware.js');
const { toggleComments,
        togglePosts
 } = require('../contollers/like-controller.js');

router.use(verifyJWT);

// Routes
router.post('/post/:postId', togglePosts);
router.post('/comment/:commentId', toggleComments);

module.exports = {
    likeRouter : router
}