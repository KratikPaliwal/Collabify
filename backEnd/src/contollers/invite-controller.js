const { asyncHandler } = require('../utils/asyncHandler.js');
const { ApiError } = require('../utils/ApiError.js');
const { ApiResponse } = require('../utils/ApiResponse.js');
const { Invite } = require('../models/collabInvite.model.js');

const sendInvite = asyncHandler( async (req, res) => {

})

const acceptInvite = asyncHandler( async (req, res) => {

})

const rejectInvite = asyncHandler( async (req, res) => {

})

const getUserInvities = asyncHandler( async (req, res) => {

})

const pendingInvities = asyncHandler( async (req, res) => {

})

module.exports = {
    sendInvite,
    acceptInvite,
    rejectInvite,
    getUserInvities,
    pendingInvities
}