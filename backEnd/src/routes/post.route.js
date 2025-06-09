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

router.post('/', Upload.none(), createPost); // Add `upload.fields([...])` if you're uploading images
router.get('/', getAllPosts);
router.get('/:postId', getPostById);
router.put('/:postId', Upload.none(), updatePost); // Or use upload.fields() for media
router.delete('/:postId', deletePost);
router.get('/user/:userId', getPostsByUser);

module.exports = {
    postRouter : router
}