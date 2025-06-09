const express = require('express');
const router = express.Router();
const { verifyJWT } = require('../middlewares/auth.middleware.js');
const { createNotification,
        getUserNotifications,
        markAsRead,
        deleteNotification,
        clearAllNotitcation
} = require('../contollers/notification-controller.js');

router.use(verifyJWT);

router.post('/', createNotification);
router.get('/', getUserNotifications);
router.patch('/:notificationId/read', markAsRead);
router.delete('/:notificationId', deleteNotification);
router.delete('/clear/all', clearAllNotitcation);

module.exports = {
    notificationRouter : router
}