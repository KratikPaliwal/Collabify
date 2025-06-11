const { asyncHandler } = require('../utils/asyncHandler.js');
const { ApiError } = require('../utils/ApiError.js');
const { ApiResponse } = require('../utils/ApiResponse.js');
const { Post } = require('../models/posts.model.js');


const createPost = asyncHandler( async (req, res) => {
    // 
})

const getPostById = asyncHandler( async (req, res) => {

})

const getAllPosts = asyncHandler( async (req, res) => {

})

const updatePost = asyncHandler( async (req, res) => {

})

const deletePost = asyncHandler( async (req, res) => {

})

const getPostsByUser = asyncHandler( async (req, res) => {

})

module.exports = {
    createPost,
    getAllPosts,
    getPostById,
    updatePost,
    deletePost,
    getPostsByUser
}