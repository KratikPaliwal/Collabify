const express = require('express');
const app = express();

const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');

// importing routes
const { userRouter } = require('./routes/user.route.js');
const { projectRouter } = require('./routes/project.route.js');
const { postRouter } = require('./routes/post.route.js');
const { notificationRouter } = require('./routes/notification.route.js');
const { likeRouter } = require('./routes/like.route.js');
const { inviteRouter } = require('./routes/invite.route.js');
const { commentRouter } = require('./routes/comment.routes.js');

// configuration -> Middleware
app.use(cors({
    origin : process.env.CORS_ORIGIN,
    confidential : true
}));


// to parse incoming request with content and makes them in json of req.body
// limit the size of request
// by default it is 100kb
app.use(express.json());


// to encode data from url
app.use(express.urlencoded({ extended : true}));

// it is used for serving static files like fonts, html, js etc.
// to keep them in public folder which is to keep with user
app.use(express.static(path.join(__dirname, '../public/temp')));


// user ke browser se cookie set bhi kr do aur access bhi kr lo
// jisko sirf server hi pad pata hai
app.use(cookieParser());


// add routing
app.use('/api/v1/users', userRouter);
app.use('/api/v1/project', projectRouter);
app.use('/api/v1/post', postRouter);
app.use('/api/v1/n', notificationRouter);
app.use('/api/v1/c', commentRouter);
app.use('/api/v1/l', likeRouter);
app.use('/api/v1/invite', inviteRouter);


module.exports = {
    app
}