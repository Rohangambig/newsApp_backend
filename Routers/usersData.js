const express = require('express');
const {getUserById} = require('../Controllers/users')

router = express.Router();

router.get('/:userId',getUserById);

module.exports = router;