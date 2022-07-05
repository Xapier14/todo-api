const express = require('express');
const requiresAuth = require('../../../middlewares/requiresAuth');

const router = express.Router();

router.use('/', requiresAuth);
router.get('/', (req, res) => {
  res.send('We are on posts');
});

module.exports = router;