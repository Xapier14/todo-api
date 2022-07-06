const express = require('express')
const router = express.Router();

router.use('/signup', require('./account/signup'));
router.use('/login', require('./account/login'));

module.exports = router;