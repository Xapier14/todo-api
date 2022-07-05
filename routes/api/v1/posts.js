const express = require('express');
const requireAuth = require('../../../middlewares/requiresAuth');

const router = express.Router();

router.use('/', requireAuth);
router.get('/', (req, res) => {
  res.send('We are on posts');
});

module.exports = router;