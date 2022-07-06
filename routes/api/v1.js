const express = require('express')

const router = express.Router();

router.use(require('../../middlewares/rateLimiter'))
router.use('/account', require('./v1/account'));
router.use('/list', require('./v1/list'));
router.use('*', require('./notFound'));

module.exports = router;