const express = require('express');
const app = express();

const cors = require('cors');
const cookieparser = require('cookie-parser');
const cookieParser = require('cookie-parser');

// configuration -> Middleware
app.use(cors({
    origin : process.env.CORS_ORIGIN,
    confidential : true
}));


// to parse incoming request with content and makes them in json of req.body
// limit the size of request
// by default it is 100kb
app.use(express.json({ limit : '16kb' }));


// to encode data from url
app.use(express.urlencoded({ extended : true, limit : '16kb'}));

// it is used for serving static files like fonts, html, js etc.
// to keep them in public folder which is to keep with user
// app.use(express.static());

// user ke browser se cookie set bhi kr do aur access bhi kr lo
// jisko sirf server hi pad pata hai
app.use(cookieParser());


// add routing




module.exports = {
    app
}