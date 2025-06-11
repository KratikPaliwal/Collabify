const express = require('express');
const router = express.Router();
const { verifyJWT } = require('../middlewares/auth.middleware.js');
const { Upload } = require('../middlewares/multer.middleware.js');
const { createProject,
        getAllProjects,
        getProjectById,
        updateProject,
        deleteProject,
        addMemberToProject,
        removeMemberFromProject,
 } = require('../contollers/project-controller.js')

router.use(verifyJWT);

// Routes
router.post('/createProject', createProject);
router.get('/projects', getAllProjects);
router.get('/:projectId', getProjectById);
router.patch('/:projectId', updateProject);
router.delete('/:projectId', deleteProject);

// Project member management
router.post('/:projectId/add-member', addMemberToProject);
router.post('/:projectId/remove-member', removeMemberFromProject);

module.exports = {
    projectRouter : router
}