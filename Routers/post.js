const express = require('express');
const {post,getPost,handleLikes} = require('../Controllers/post');
const multer = require('multer');
const path = require('path');
const { verifyToken } = require('../Middleware/auth');

const storage = multer.diskStorage({
    destination:function(req,file,cb)
    {
        cb(null,'public/news/')
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({storage:storage})
const router = express.Router();

router.post('/',verifyToken,upload.single('picture'),post);
router.get('/allpost',getPost);
router.post('/like/:postId',verifyToken, handleLikes);

module.exports = router;