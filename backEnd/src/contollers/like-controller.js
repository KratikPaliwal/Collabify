const { asyncHandler } = require('../utils/asyncHandler.js');
const { ApiError } = require('../utils/ApiError.js');
const { ApiResponse } = require('../utils/ApiResponse.js'); 
const { Like } = require('../models/like.model.js');
const { isValidObjectId } = require('mongoose');

const togglePosts = asyncHandler( async (req, res) => {
    // same as comment

    const { postId } = req.params;
    
    const userId = req.user?._id;

    if (!isValidObjectId(postId)) {
        throw new ApiError(401, "Invalid post Id");
    }

    const existingLike = await Like.findOne({
        postId,
        likedBy : userId
    });

    if (existingLike) {
        
        await existingLike.deleteOne();

        return res.status(200).json(
            new ApiResponse(
                200,
                existingLike,
                "Successfully unlike a post"
            )
        );
    }
    else {

        const like = await Like.create({
            postId,
            likedBy : userId
        });

        return res.status(200).json(
            new ApiResponse(
                200,
                like,
                "Successfully added a like on post"
            )
        );
    }
})

const toggleComments = asyncHandler( async (req, res) => {
    // commentId params se mil jye gi -> validate
    // user phele se authenticate rhe ga
    // then check ki phele se like toh nhi hai
    // hai to delete kre de
    // nhi hai toh like kr de
    // return response
    
    const owner = req.user?._id;

    const { commentId } = req.params;

    if (!isValidObjectId(commentId)) {
        throw new ApiError(401, "Invalid Comment Id");
    }

    const existingLike = await Like.findOne({
        commentId,
        likedBy : owner
    });

    // like hai phele se
    // toh delete kr denge
    if (existingLike) {
        await existingLike.deleteOne();

        return res.status(200).json(
            new ApiResponse(
                200,
                existingLike,
                "Successfully unlike the comment"
            )
        )
    }
    
    else{
        // matlab like phele se nhi hai
        // then like add kr do

        const like = await Like.create({
            commentId,
            likedBy : owner
        });

        return res.status(200).json(
            new ApiResponse(
                200,
                like,
                "Successfully added like on Comment"
            )
        );
    }
})


module.exports = {
    togglePosts,
    toggleComments
}