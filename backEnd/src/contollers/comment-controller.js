const { asyncHandler } = require('../utils/asyncHandler.js');
const { ApiError } = require('../utils/ApiError.js');
const { ApiResponse } = require('../utils/ApiResponse.js');
const { Comment } = require('../models/comment.model.js');
const { Post } = require('../models/posts.model.js');
const { z } = require('zod');
const { isValidObjectId } = require('mongoose');

const addComment = asyncHandler( async (req, res) => {
    // get postId from params -> validate
    // user phele se authenticated rhe ga
    // content body se aa jyega
    // then content create kr denge
    // return response

    const { postId } = req.params;
    const userId = req.user?._id;

    if (!isValidObjectId(postId)) {
        throw new ApiError(401, "Invalid post Id")
    }

    const { content } = req.body;

    const requireBody = z.object({
        content : z.string().min(1, "content is required")
    })

    const parseDataSucceed = requireBody.safeParse(req.body);

    if (!parseDataSucceed.success) {
        throw new ApiError(401, `Invalid data format : ${parseDataSucceed.error}`);
    }

    // check post exists or not
    const post = await Post.findById(postId);

    if (!post) {
        throw new ApiError(404, "Post not found");
    }

    const comment = await Comment.create({
        postId,
        authorId : userId,
        content
    });

    return res.status(201).json(
        new ApiResponse(
            201,
            comment,
            "Successfully added comment"
        )
    );
})

const deleteComment = asyncHandler( async (req, res) => {
    // commentID params se mile gai -> validate commentId
    // vo comment ko find krna hai
    // then delete that comment
    // delete likes on that comment
    // return response

    const { commentId } = req.params;
    const owner = req.user?._id;

    if (!isValidObjectId(commentId)) {
        throw new ApiError(401, "Invalid comment Id");
    }

    const comment = await Comment.findById(commentId);

    if (!comment) {
        throw new ApiError(404, "Comment not found");
    }

    if (comment.authorId.toString() !== owner) {
        throw new ApiError(403, "You are unAuthorized user to delete comment");
    }

    // delete likes on comment
    await Like.deleteMany({ commentId });

    await comment.deleteOne();

    return res.status(200).json(
        new ApiResponse(
            200,
            {},
            "Successfully deleted comment"
        )
    );
    
})

// get comment on posts
const getCommentByPosts = asyncHandler( async (req, res) => {
    
    const { postIdd } = req.params;

    if (!isValidObjectId(postIdd)) {
        throw new ApiError(401, "Invalid Post Id");
    }

    const comment = await Comment.aggregate([
        {
            $match : {
                postId : new mongoose.Types.ObjectId(postIdd)
            }
        },
        {
            $lookup : {
                from : "users",
                localField : "authorId",
                foreignField : "_id",
                as : "owner"
            }
        },
        {
            $unwind : "$owner"
        },
        {
            sort : {
                createdAt : -1
            }
        },
        {
            $project : {
                _id : 1,
                content : 1,
                createdAt : 1,
                authorId : {
                    _id : 1,
                    fullName : 1,
                    email : 1,
                    username : 1
                }
            }
        }
    ]);

    return res.status(200).json(
        new ApiResponse(
            200,
            comment,
            "Successfully fetch post comment"
        )
    );

})

const updateComment = asyncHandler( async (req, res) => {
    // params se commentId mil jyegi -> validate
    // then find kre gai
    // then update comment content
    // return response

    const owner = req.user?._id;

    const { commentId } = req.params;

    if (!isValidObjectId(commentId)) {
        throw new ApiError(401, "Invalid comment Id");
    }

    const { content } = req.body;

    if (!content) {
        throw new ApiError(401, "All fields are required");
    }

    const comment = await Comment.findById(commentId);

    if (!comment) {
        throw new ApiError(404, "Comment not found");
    }

    if (comment.authorId.toString() !== owner.toString()) {
        throw new ApiError(401, "You are unAuthorized User to update Comment");
    }

    comment.content = content || comment.content;

    await comment.save();

    return res.status(200).json(
        new ApiResponse(
            200,
            comment,
            "Successfully updated comment content"
        )
    );

})

module.exports = {
    addComment,
    deleteComment,
    getCommentByPosts,
    updateComment
}