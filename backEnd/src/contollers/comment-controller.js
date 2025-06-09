const { asyncHandler } = require('../utils/asyncHandler.js');
const { ApiError } = require('../utils/ApiError.js');
const { ApiResponse } = require('../utils/ApiResponse.js');
const { Comment } = require('../models/comment.model.js');

const addComment = asyncHandler( async (req, res) => {

})

const deleteComment = asyncHandler( async (req, res) => {

})

const getCommentByPosts = asyncHandler( async (req, res) => {

})

const updateComment = asyncHandler( async (req, res) => {

})

module.exports = {
    addComment,
    deleteComment,
    getCommentByPosts,
    updateComment
}