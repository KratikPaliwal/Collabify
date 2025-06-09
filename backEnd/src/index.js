// require dotenv file
require('dotenv').config({path: './.env'});
// require mongoose
const mongoose = require('mongoose');
// require app
const { app } = require('./app.js');
// require db name
const { DB_NAME } = require('./constant.js');
// require connecting db file
const { connectDB } = require('./db/index.js');

// it will return a promise
connectDB()
.then(
    // server listening
    app.listen(process.env.PORT || 8080, () => {
        console.log(`Server is listening on port : ${process.env.PORT}`);
    })

)
.catch((error) => console.log(`MongoDb connection failed : ${error}`));

