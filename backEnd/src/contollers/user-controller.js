const { asyncHandler } = require('../utils/asyncHandler.js');
const { ApiResponse } = require('../utils/ApiResponse.js');
const { ApiError } = require('../utils/ApiError.js');
const { User } = require('../models/user.model.js');
const { z } = require('zod');
const { uploadOnCloudinary } = require('../utils/cloudinary.js');

const registerUser = asyncHandler (async(req, res) => {
    // user ki details lenge header(body) se
    // then usko check kre gai ki using zod
    // check kre hai ki user alredy register toh nhi hai
    // check for avatar
    // upload them on cloudinary
    // remove password andrefreshToken from that
    // check ki user create hua ya nhi
    // return response

    const { username, fullName, password, email, bio, skills } = req.body;

    // convert string array
    if (typeof req.body.skills === "string") {
        req.body.skills = req.body.skills.split(',').map(skill => skill.trim());
    }


    // create zod Schema for validation
    const requiredBody = z.object({
        username : z.string().toLowerCase().min(3),
        email : z.string().email(),
        fullName : z.string().min(3),
        bio : z.string().max(200),
        skills : z.array(z.string()).min(1),
        password : z.string().min(6)
            .regex(/[A-Z]/, 'Passwaord must contain one upperCase')
            .regex(/[a-z]/, "Password must contain one lowerCase")
            .regex(/[0-9]/, "Password must contain one numeric value")
            .regex(/[\w_]/, "Password must contain one special character")
    })

    // Parse the request body using the requireBody.safeParse() method to validate the data format
    const parsedDataSuccess = requiredBody.safeParse(req.body);

    // if data is not correct then yeh response return kr do
    if (!parsedDataSuccess.success) {
        throw new ApiError(400, `Invalid data format : ${parsedDataSuccess.error}`)
    }

    // check body data are coming or not
    if (
        [username, email, fullName, password, bio, skills].some((field) => 
            field?.trim() === " "
        )
    ) {
        throw new ApiError(400, `All firld are required`)
    }

    // check ki user existing toh nhi hai
    const existingUser = await User.findOne({
        $or : [{username}, {email}]
    })

    if (existingUser) {
        throw new ApiError(409, 'User already register')
    }

    // multer middlware ko file ka path do
    console.log(`Multer file path`, req.files);

    const avatarPath = req.files?.avatar[0]?.path;
    console.log(avatarPath);

    if (!avatarPath) {
        throw new ApiError(400, 'Avatar file is required')
    }

    const avatar = await uploadOnCloudinary(avatarPath);

    if (!avatar) {
        throw new ApiError(400, 'Avatar file required')
    }

    // create new user
    const user = await User.create({
        username,
        email,
        fullName,
        password,
        avatar : avatar?.url || " ",
        bio,
        skills
    });

    const createdUser = await User.findById(user._id).select(
        '-password -refreshToken'
    )

    if (!createdUser) {
        throw new ApiError(400, 'Somethign went wrong while registering a user')
    }

    return res.status(200).json(
        new ApiResponse(200, createdUser, 'User successfully registered')
    );
})

const loginUser = asyncHandler (async (req, res) => {

})

const logoutUser = asyncHandler (async (req, res) => {

})

const getCurrentUser = asyncHandler (async(req, res) => {

})

const changeCurrentPassward = asyncHandler (async (req, res) => {

})

const updateAccountDetails = asyncHandler( async (req, res) => {

})

const searchUsers = asyncHandler ( async (req, res) => {

})


const getAllUsers = asyncHandler( async (req, res) => {

})

const getUserById = asyncHandler( async (req, res) => {

})

const getSuggestedUsers = asyncHandler( async (req, res) => {

})

const deleteUser = asyncHandler( async (req, res) => {

})

const getUserProjects = asyncHandler( async (req, res) => {

})

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    getCurrentUser,
    changeCurrentPassward,
    updateAccountDetails,
    searchUsers,
    getAllUsers,
    getUserById,
    getSuggestedUsers,
    deleteUser,
    getUserProjects
}

