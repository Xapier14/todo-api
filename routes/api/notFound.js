const express = require('express')

const router = express.Router();

function invalidEndpointCallback(req, res) {
  res.status(404).send('Invalid endpoint');
}

router.get('*', invalidEndpointCallback);
router.put('*', invalidEndpointCallback);
router.post('*', invalidEndpointCallback);
router.patch('*', invalidEndpointCallback);

module.exports = router;