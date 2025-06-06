// multer : Multer adds a body object and a file or files object to the request object, 
// which is primarily used for uploading files. 

const multer = require('multer');

const storage = multer.diskStorage({
    destination : function(req, file, cb) {
        cb(null, './public/temp')
    },
    filename : function(req, file, cb) {

        cb(null, file.originalname)
    }
})

export const upload = multer({
    storage
})