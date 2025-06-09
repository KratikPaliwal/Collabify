const express = require('express');
const router = express.Router();
const { Upload } = require('../middlewares/multer.middleware.js');
const { verifyJWT } = require('../middlewares/auth.middleware.js');
const { registerUser, 
        loginUser,
        logoutUser,
        getCurrentUser,
        changeCurrentPassward,
        updateAccountDetails,
        searchUsers,
        getAllUsers,
        getSuggestedUsers,
        getUserById,
        deleteUser,
        getUserProjects
} = require('../contollers/user-controller.js');

router.route('/register').post(
    Upload.fields([
        {
            name : "avatar",
            maxCount : 1
        }
    ]),
    registerUser
);
router.route('/login').post(loginUser);

router.use(verifyJWT);

// Protected Routes
router.post('/logout', logoutUser);
router.get('/current-user', getCurrentUser);
router.put('/change-password', changeCurrentPassward);
router.put('/update', Upload.none(), updateAccountDetails); // For updating info only (no files)
router.get('/search', searchUsers);
router.get('/', getAllUsers);
router.get('/suggested', getSuggestedUsers);
router.get('/:id', getUserById);
router.delete('/delete', deleteUser);
router.get('/:id/projects', getUserProjects);

module.exports = {
    userRouter : router
}