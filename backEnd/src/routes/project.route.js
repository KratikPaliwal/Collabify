const express = require('express');
const router = express.Router();
const { verifyJWT } = require('../middlewares/auth.middleware.js');
const { Upload } = require('../middlewares/multer.middleware.js');
const { createProject,
        getAllProjects,
        searchProject,
        getProjectById,
        updateProject,
        deleteProject,
        addMemberToProject,
        removeMemberFromProject,
        getProjectsOfUser
 } = require('../contollers/project-controller.js')

router.use(verifyJWT);

// Routes
router.post('/', Upload.none(), createProject); // Add fields if files are uploaded
router.get('/', getAllProjects);
router.get('/search', searchProject);
router.get('/:projectId', getProjectById);
router.put('/:projectId', Upload.none(), updateProject);
router.delete('/:projectId', deleteProject);

// Project member management
router.post('/:projectId/add-member', addMemberToProject);
router.post('/:projectId/remove-member', removeMemberFromProject);

// User's projects
router.get('/user/:userId', getProjectsOfUser);

module.exports = {
    projectRouter : router
}