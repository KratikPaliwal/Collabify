const { asyncHandler } = require('../utils/asyncHandler.js');
const { ApiError } = require('../utils/ApiError.js');
const { ApiResponse } = require('../utils/ApiResponse.js');
const { Post } = require('../models/posts.model.js');
const { User } = require('../models/user.model.js');
const { Project } = require('../models/project.model.js');
const { Comment } = require('../models/comment.model.js');
const { Like } = require('../models/like.model.js');
const { isValidObjectId, default: mongoose } = require('mongoose');


const createPost = asyncHandler( async (req, res) => {
    // content aaye ga req.body se
    // then post create kre gai
    // return response

    const { content, projectId } = req.body;

    if (!content || !projectId) {
        throw new ApiError(401, "All fields are required");
    }

    if (!isValidObjectId(projectId)) {
        throw new ApiError(401, "Invalid Project Id");
    }

    const owner = req.user._id;
    
    const post = await Post.create({
        projectId,
        authorId : owner,
        content
    });

    return res.status(200).json(
        new ApiResponse(
            200,
            post,
            "Successfullt created a post"
        )
    );
})

const getPostById = asyncHandler( async (req, res) => {
    
    const { postId } = req.params;

    if (!isValidObjectId(postId)) {
        throw new ApiError(401, "Invalid post Id");
    }

    const post = await Post.aggregate([
        {
            $match : {
                _id : new mongoose.Types.ObjectId(postId)
            }
        },
        {
            $lookup : {
                from : "users",
                localField : "authorId",
                foreignField : "_id",
                as : "author"
            }
        },
        {
            $lookup : {
                from : "projects",
                localField : "projectId",
                foreignField : "_id",
                as : "userProjects"
            }
        },
        {
            $unwind : {
                path : "$userProjects",
                preserveNullAndEmptyArrays : true
            }
        }
    ]);

    if (!post || post.length === 0) {
        throw new ApiError(400, "Posts not found");
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            post[0],
            "Successfully fetched post"
        )
    );
})

const getAllPosts = asyncHandler( async (req, res) => {
    // post pr aggregation lgna hai 
    // then unko sort kr denge
    // return res

    const posts = await Post.aggregate([
        {
            $sort : {
                createdAt : -1
            }
        },
        {
            $lookup : {
                from : "users",
                localField : "authorId",
                foreignField : "_id",
                as : "author"
            }
        },
        {
            $unwind : { 
                path : "$author"
            }
        },
        {
            $lookup : {
                from : "projects",
                localField : "ProjectId",
                foreignField : "_id",
                as : "usersProjects"
            }
        },
        {
            $unwind : {
                path : "$usersProjects",
                preserveNullAndEmptyArrays : true
            }
        }
    ]);

    if (!posts || !posts.length == " ") {
        throw new ApiError(400, "posts not found");
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            posts,
            "Successfully fetched all posts"
        )
    );
})

// only able to update posts content
const updatePost = asyncHandler( async (req, res) => {
    // user phele se authenticated rhe ga
    // then params mai postId mile gi jisko update krna hai
    // then we check postId is valid or not
    // then find by Id
    // then made update the post
    // return res

    const { postId } = req.params;

    const { content } = req.body;

    const requiredBody = z.Object({
        content : z.string().min(3)
    });

    if (!content) {
        throw new ApiError(401, "All fields are required");
    }

    const parsedDataSuccess = requiredBody.safeParse(req.body);

    if (!parsedDataSuccess.success) {
        throw new ApiError(401, "Invalid data format");
    }

    if (!isValidObjectId(postId)) {
        throw new ApiError(401, "Invalid post Id");
    }

    const post = await Post.findById(postId);

    if (!post) {
        throw new ApiError(400, "POst not found");
    }

    if(!post.authorId.equals(req.user?._id)) {
        throw new ApiError(400, "Not Authorized to update post");
    }

    post.content = content || post.content;

    await post.save();

    return res.status(200).json(
        new ApiResponse(
            200,
            post,
            "Successfully updated the post content"
        )
    );


})

const deletePost = asyncHandler( async (req, res) => {
    // postId mile gai
    // check ki vo post ki id valid hao ya nhi
    // then find that post
    // check ki post mili ya nhi
    // then check ki post create and delete krne wala user ek ki hai na
    // then delete post and its comment and likes
    // return response

    const { postId } = req.params;
    const owner = req.user?._id;

    if (!isValidObjectId(postId)) {
        throw new ApiError(401, "Invalid postId");
    }

    const post = await Post.findById(postId);

    if (!post) {
        throw new ApiError(400, `Post not found`);
    }

    if (!post.authorId.equals("owner")) {
        throw new ApiError(403, "You are not Authorized to delete these post");
    }

    await Comment.deleteMany({ postId });

    await Like.deleteMany({ postId });

    await post.deleteOne();

    return res.status(200).json(
        new ApiResponse(
            200,
            "Successfully deleted a post, related comments and likes"
        )
    );


})

const getPostsByUser = asyncHandler( async (req, res) => {
    // get userId in params 
    // then check that  is valid or not
    // then find user and match post of that sort them
    // return res

    const { userId } = req.params;

    if (!userId) {
        throw new ApiError(401, "Invalid user Id");
    }

    const posts = await Post.aggregate([
        {
            $match : {
                authorId : new mongoose.Types.ObjectId(userId)
            }
        },
        {
            $sort : {
                createdAt : -1 //(descending)
            }
        },
        {
            $lookup : {
                from : "users",
                localField : "authorId",
                foreignField : "_id",
                as : "createdBy"
            }
        },
        {
            $unwind : "$createdBy"
        },
        {
            $lookup : {
                from : "comments",
                localField : "_id",
                foreignField : "postId",
                as : "comments",
            }
        },
        {
            $lookup : {
                from : "likes",
                localField : "_id",
                foreignField : "postId",
                as : "likes"
            }
        },
        {
            $addFields : {
                countComment : {
                    $size : "$comments"
                },
                countLike : {
                    $size : "$likes"
                }
            }
        }
    ]);

    // count user posts
    const totalPosts = await Post.countDocuments({ authorId : userId});

    return res.status(200).json(
        new ApiResponse(
            200,
            posts,
            totalPosts,
            "Successfully fetched a post of a user"
        )
    );

})

module.exports = {
    createPost,
    getAllPosts,
    getPostById,
    updatePost,
    deletePost,
    getPostsByUser
}