const { asyncHandler } = require('../utils/asyncHandler.js');
const { ApiError } = require('../utils/ApiError.js');
const { ApiResponse } = require('../utils/ApiResponse.js');
const { Notification } = require('../models/notification.model.js');

const createNotification = asyncHandler( async (req, res) => {

})

const getUserNotifications = asyncHandler( async (req, res) => {

})

const markAsRead = asyncHandler( async (req, res) => {

})

const deleteNotification = asyncHandler( async (req, res) => {

})

const clearAllNotitcation = asyncHandler( async (req, res) => {

})

module.exports = {
    createNotification,
    getUserNotifications,
    markAsRead,
    deleteNotification,
    clearAllNotitcation
}