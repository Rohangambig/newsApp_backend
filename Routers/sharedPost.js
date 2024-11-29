const express = require('express');
const { sharedPost } = require('../Controllers/post'); 
const router = express.Router();

router.get('/sharedPost/:postId', sharedPost);

module.exports = router;
