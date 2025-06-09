const express = require('express');
const router = express.Router();
const { verifyJWT } = require('../middlewares/auth.middleware.js');
const { sendInvite,
        acceptInvite,
        rejectInvite,
        getUserInvities,
        pendingInvities
} = require('../contollers/invite-controller.js');

router.use(verifyJWT);

// Routes
router.post('/send', sendInvite);
router.post('/:inviteId/accept', acceptInvite);
router.post('/:inviteId/reject', rejectInvite);
router.get('/my-invites', getUserInvities);
router.get('/pending', pendingInvities);

module.exports = {
    inviteRouter : router
}