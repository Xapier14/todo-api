const express = require('express')

const router = express.Router();

router.use('/account', require('./v1/account'));
router.use('/posts', require('./v1/posts'));
router.use('*', require('./v1/notFound'));

module.exports = router;