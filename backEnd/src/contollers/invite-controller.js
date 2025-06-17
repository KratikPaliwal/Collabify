const { asyncHandler } = require('../utils/asyncHandler.js');
const { ApiError } = require('../utils/ApiError.js');
const { ApiResponse } = require('../utils/ApiResponse.js');
const { Invite } = require('../models/collabInvite.model.js');
const { isValidObjectId, default: mongoose } = require('mongoose');
const { Project } = require('../models/project.model.js');
const { User } = require('../models/user.model.js');
const { email } = require('zod/v4-mini');

const sendInvite = asyncHandler( async (req, res) => {
    // senderId -> user jo authenticated rhe ga
    // receiver and project Id get from params 
    // then check ki valid hai ya nhi
    // and check ki receiver aur sender Id same toh nhi hai
    // then check ki exisiting invite toh nhi hai pending mai
    // then create a invite
    // return response

    const senderId = req.user?._id;

    const { receiverId, projectId } = req.body;

    if (!isValidObjectId(receiverId) || !isValidObjectId(projectId)) {
        throw new ApiError(401, "Invalid receiver or project Id");
    }
    
    if (senderId.toString() == receiverId.toString()) {
        throw new ApiError(401, "cannot send Invite to self");
    }

    // check ki receiverId and projectId exist on db  or not
    const project = await Project.findOne({ 
        _id : projectId 
    });

    const receiverUser = await User.findOne({ 
        _id : receiverId 
    });

    if (!receiverUser || !project) {
        throw new ApiError(403, "ReceiverUser or Project not found");
    }

    // check ki invite existing toh nhi hai
    const existingInvite = await Invite.findOne({
        senderId,
        receiverId,
        projectId,
        status : "pending"
    });

    if (existingInvite) {
        throw new ApiError(403, "Already sended Invite to user");
    }

    const invite = await Invite.create({
        senderId,
        receiverId,
        projectId,
    })

    return res.status(201).json(
        new ApiResponse(
            200,
            invite,
            "Suceesfully sended invite to user"
        )
    );

})

const acceptInvite = asyncHandler( async (req, res) => {
    // invite Id se check kre gai params se
    // find that invite in db
    // then check ki receiver Id aur user ki Id same hai ya nhi
    // agr same hai toh updateInvite as status : accepted
    // return response

    const { inviteId } = req.params;    
    console.log(`InviteId : `, inviteId);

    const userId = req.user?._id;

    if (!isValidObjectId(inviteId)) {
        throw new ApiError(401, "Invalid inviteId");
    }

    const invite = await Invite.findById(inviteId);

    if (!invite) {
        throw new ApiError(404, "Invite not found");
    }

    if (invite.receiverId.toString() !== userId.toString()) {
        throw new ApiError(401, "You are unAuthorized User to accept the invite");
    }

    const updatingInvite = await Invite.findByIdAndUpdate(
        inviteId,
        {
            status : "accepted"
        },
        {
            new : true
        }
    );

    return res.status(201).json(
        new ApiResponse(
            201,
            updatingInvite,
            "Successfully accepted an Invite"
        )
    );

})

const rejectInvite = asyncHandler( async (req, res) => {
    // same as accepted
    
    const userId = req.user._id;

    const { inviteId } = req.params;

    if (!isValidObjectId(inviteId)) {
        throw new ApiError(401, "Invalid inviteId");
    }

    // find invite
    const invite = await Invite.findById( inviteId );

    if (!invite) {
        throw new ApiError(404, "Invite not found");
    }

    if (invite.receiverId.toString() !== userId.toString()) {
        throw new ApiError(403, "You are unAuthorized user to reject an Invite");
    }

    const updatingInvite = await Invite.findByIdAndUpdate(
        inviteId,
        {
            status : "rejected"
        },
        {
            new : true
        }
    );

    return res.status(201).json(
        new ApiResponse(
            201,
            updatingInvite,
            "Successfully rejeted an Invite"
        )
    );

})

const getUserInvities = asyncHandler( async (req, res) => {
    // user phele se authenticated rhe ga
    // check its invite
    // return response

    const userId = req.user._id;

    const invites = await Invite.aggregate([
        {
            $match : {
                receiverId : new mongoose.Types.ObjectId(userId)
            }
        },
        {
            $lookup : {
                from : "users",
                localField : "senderId",
                foreignField : "_id", 
                as : "sender"
            }
        },
        {
            $unwind : "$sender"
        },
        {
            $lookup : {
                from : "projects",
                localField : "projectId",
                foreignField : "_id",
                as : "userProject"
            }
        },
        {
            $unwind : "$userProject"
        },
        {
            $project : {
                _id : 1,
                status : 1,
                createdAt : 1,
                senderId : {
                    _id : 1,
                    fullName : 1,
                    username : 1,
                    email : 1
                },
                projectId : {
                    _id : 1,
                    title : 1,
                    description : 1
                }
            }
        },
        {
            $sort : {
                createdAt : -1
            }
        }
    ]);

    if (invites.length === 0) {
        throw new ApiError(403, `User don't any invites`);
    }

    return res.status(201).json(
        new ApiResponse(
            201,
            invites,
            "Successfully find all invites of user"
        )
    );

})

const pendingInvities = asyncHandler( async (req, res) => {
    // same as getUserInvities

    const userId = req.user?._id;

    const pendingInvite = await Invite.aggregate([
        {
            $match : {
                receiverId : new mongoose.Types.ObjectId(userId),
                status : "pending"
            }
        },
        {
            $lookup : {
                from : "users",
                localField : 'senderId',
                foreignField : "_id",
                as : "user"
            }
        },
        {
            $unwind : "$user"
        },
        {
            $lookup : {
                from : "projects",
                localField : "projectId",
                foreignField : "_id",
                as : "userProject"
            }
        },
        {
            $unwind : "$userProject"
        },
        {
            $project : {
                _id : 1,
                status : 1,
                createdAt : 1,
                senderId : {
                    _id : 1,
                    fullName : 1,
                    username : 1,
                    email : 1
                },
                projectId : {
                    _id : 1,
                    title : 1,
                    description : 1
                }
            }
        },
        {
            $sort : {
                createdAt : -1
            }
        }
    ]);

    return res.status(201).json(
        new ApiResponse(
            201,
            pendingInvite,
            "successfully fetched pending invite"
        )
    );
    
})

module.exports = {
    sendInvite,
    acceptInvite,
    rejectInvite,
    getUserInvities,
    pendingInvities
}