const { asyncHandler } = require('../utils/asyncHandler.js');
const { ApiError } = require('../utils/ApiError.js');
const { ApiResponse } = require('../utils/ApiResponse.js'); 
const { Like } = require('../models/like.model.js');

const togglePosts = asyncHandler( async (req, res) => {
    
})

const toggleComments = asyncHandler( async (req, res) => {

})


module.exports = {
    togglePosts,
    toggleComments
}