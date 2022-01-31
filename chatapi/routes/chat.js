const express = require('express');
const router = express.Router();
const auth = require('../auth/auth');


router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/create', auth.verifyUser, async (req, res, next) => {
  const data = req.body;

});

module.exports = router;