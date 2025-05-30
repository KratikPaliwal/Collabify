// these file is for database connection
const mongoose = require('mongoose');
const { DB_NAME } = require('../constant.js');

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGO_URL}/${DB_NAME}`);
        console.log(`MongoDB conneced || DB host : ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log('MongoDB connection error', error);
        process.exit(1);
    }
}

module.exports = {
    connectDB
}