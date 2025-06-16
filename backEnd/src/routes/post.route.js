const express = require('express');
const router = express.Router();
const { Upload } = require('../middlewares/multer.middleware.js');
const { verifyJWT } = require('../middlewares/auth.middleware.js');
const { createPost,
        getAllPosts,
        getPostById,
        updatePost,
        deletePost,
        getPostsByUser
} = require('../contollers/post-controller.js'); 


router.use(verifyJWT);

router.post('/createPost', createPost); 
router.get('/posts', getAllPosts);
router.get('/:postId', getPostById);
router.patch('/:postId', updatePost);
router.delete('/:postId', deletePost);
router.get('/user/:userId', getPostsByUser);

module.exports = {
    postRouter : router
}