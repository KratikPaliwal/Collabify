const jwt = require('jsonwebtoken');
const { asyncHandler } = require('../utils/asyncHandler.js');
const { ApiResponse } = require('../utils/ApiResponse');
const { ApiError } = require('../utils/ApiError');
const { User } = require('../models/user.model.js');

const verifyJWT = asyncHandler( async(req, res, next) => {
    try {
        const token = req.cookie?.accessToken || req.header('Authorization')?.replace("Bearer ", "");

        if (!token) {
            throw new ApiError(401, "Unauthorized Access");
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        const user = await User.findById(decodedToken?._id).select(
            "-password -refreshToken"
        );

        if (!user) {
            throw new ApiError(401, "unAuthorized Access");
        }

        req.user = user;
        next();

    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid Access token");
    }
})

module.exports = {
    verifyJWT
}