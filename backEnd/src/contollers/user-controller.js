const { asyncHandler } = require('../utils/asyncHandler.js');
const { ApiResponse } = require('../utils/ApiResponse.js');
const { ApiError } = require('../utils/ApiError.js');
const { User } = require('../models/user.model.js');
const { z } = require('zod');
const { uploadOnCloudinary } = require('../utils/cloudinary.js');
const { email } = require('zod/v4-mini');

const generateAccessAndRefreshToken = async (userId) => {
    try {
        // user ko find krna pde gai 
        // then usko token generate krna pde gai

        const user = await User.findById(userId);

        // token generate ho gye
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        // console.log(`accessToken`, accessToken);
        // console.log('refreshToken', refreshToken);

        // then refreshToken ko save krna hai
        user.refreshToken = refreshToken;

        await user.save({ validateBeforeSave : false});

        return { accessToken, refreshToken};
        
    } catch (error) {
        console.error("JWT Token Error:", error);
        throw new ApiError(500, "Something went wrong while creating a token");
    }
}

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

    // // convert string array
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

    console.log(req.body);

    // Parse the request body using the requireBody.safeParse() method to validate the data format
    const parsedDataSuccess = requiredBody.safeParse(req.body);

    // if data is not correct then yeh response return kr do
    if (!parsedDataSuccess.success) {
        throw new ApiError(400, `Invalid data format : ${parsedDataSuccess.error}`)
    }

    // check body data are coming or not
    if (!username || !fullName || !password || !email || !bio || !skills) {
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
    // user ka password, email, username send kre ga
    // then apan check kre gai ki user db mai hai ya nhi
    // agr hai toh user ke access token aur refresh token generate kr denge
    // send cookie

    const { email, username, password } = req.body;

    // then check ki email ya username mai koi bgi ek aaya ho
    if (!email || !username) {
        throw new ApiError(400, 'username and email are required');
    }

    // ab user ko find kre gai
    const user = await User.findOne({
        $or : [{username}, {email}]
    });

    // check ki user mila ya nhi
    if (!user) {
        throw new ApiError(400, `User doesn't exists`);
    }

    // password match kre lo 
    const correctPassword = await user.isPasswordCorrect(password);

    if (!correctPassword) {
        throw new ApiError(400, `Invalid User credentials`);
    }

    // agr hai toh token generate kr do
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

    // user ko updated info denge
    const loggesUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );

    // loggedUser isliye bhnaya kyuki cookie mai password nhi bhejte
    const options = {
        httpOnly : true,
        secure : true
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                user : loggesUser, accessToken,
                refreshToken,
            },
            'User loggedIn successfully'
        )
    );
})

const logoutUser = asyncHandler (async (req, res) => {
    // cookie and refreshToken clear krna pade gai

    await User.findOneAndUpdate(
        req.user._id, // user phele se login hoga
        {
            $unset : {
                refreshToken : 1
            }
        },
        {
            new : true
        }
    );

    const options = {
        httpOnly : true,
        secure : true
    };

    return res.status(200)
    .clearCookie("accessToken", options)
    .clearCookie('refreshToken', options)
    .json(
        new ApiResponse(
            200,
            {},
            "User logout successfully"
        )
    )
})

const getCurrentUser = asyncHandler (async (req, res) => {
    return res.status(200).json(
        new ApiResponse(
            200,
            req.user,
            "User fetched Successfully"
        )
    );
})

const changeCurrentPassward = asyncHandler (async (req, res) => {
    // oldPassword and new password lenge body se
    // then user ko find kre gai
    // then uske old password and olpassword body se aaya hai dono compare kre gai
    // then user.password = newPassword
    // then user.save
    // return response

    const { oldPassword, newPassword} = req.body;

    if (!oldPassword || !newPassword) {
        throw new ApiError(400, "passwords are required")
    }

    const user = await User.findById(req.user?._id);

    const checkPassword = await user.isPasswordCorrect(oldPassword);

    if (!checkPassword) {
        throw new ApiError(400, 'Invalid old Password')
    }

    user.password = newPassword;

    await user.save({ validateBeforeSave : false});

    return res.status(200).json(
        new ApiResponse(
            200,
            'Password changed successfully'
        )
    );

})

const updateAccountDetails = asyncHandler( async (req, res) => {
    // expect avatar image and password
    // details aye gi jo bhi update krni hogi req.body mai
    // then user ko find kre gai( phele se authenticated rhe ga)
    // then update kr denge
    // return res

    const { fullName, email, username, bio, skills } = req.body;

    if (!fullName || !email || !username || !bio) {
        throw new ApiError(400, "All fields are required");
    }

    if (!skills && !Array.isArray(skills)) {
        throw new ApiError(400, "skills field is required");
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set : {
                fullName,
                username,
                bio,
                email,
                skills
            }
        },
        {
            new : true
        }
    ).select('-password');

    return res.status(200).json(
        new ApiResponse(
            200,
            user,
            "Successfully Updated User details"
        )
    )

})

const getAllUsers = asyncHandler( async (req, res) => {
    const users = await User.find({});

    return res.status(200).json(
        new ApiResponse(
            200,
            users,
            "Successfully fetched All User"
        )
    );
})

const getUserById = asyncHandler( async (req, res) => {

    const{ userId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
        throw new ApiError(400, "Invalid User Id");
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            user,
            'Successfully find user'
        )
    );
})

const getSuggestedUsers = asyncHandler( async (req, res) => {

    const user = await User.aggregate([
        {
            $match : {
                _id : {
                    $ne : req.user?._id
                }
            }
        },
        {
            $sample : {
                size : 5
            }
        }
    ]);

    return res.status(200).json(
        new ApiResponse(
            200,
            user,
            "successfully suggested 5 users"
        )
    )
})

const deleteUser = asyncHandler( async (req, res) => {

})

const getUserProjects = asyncHandler( async (req, res) => {
    
})

const searchUsers = asyncHandler ( async (req, res) => {

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

