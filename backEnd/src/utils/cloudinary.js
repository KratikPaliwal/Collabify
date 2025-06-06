const cloudinary = require('cloudinary').v2;
const fs = require('fs');

// cloudinary configuration
cloudinary.config({
    cloud_name : process.env.CLOUDINARY_CLOUD_NAME,
    api_key : process.env.CLOUDINARY_API_KEY,
    api_secret : process.env.CLOUDINARY_API_SECRET
});

// to upload image on cloudinary 
const uploadOnCloudinary = async (localFilePath) => {
    try {
        // firstly check ki localFile path aaya hai ki nhi
        if (!localFilePath) {
            return null
        }

        // then upload on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type : 'auto'
        });
        // file successfully uploaded
        // console.log(`file url : ${response.url}`);

        // unlink file 
        fs.unlinkSync(localFilePath);
        return response;

    } catch (error) {
        console.log(`Something went wrong while uploading an image on cloudinary`);
        throw { error };
    }
}


// to delete image from cloudinary 
const deleteFromCloudinary = async (imageUrl) => {
    try {
        const publicId = imageUrl.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(publicId);
        return true;
    } catch (error) {
        console.log(`Something went wrong while deleting url from cloudinary`);
        throw { error }; 
    }
}
 

module.exports = {
    deleteFromCloudinary,
    uploadOnCloudinary
}