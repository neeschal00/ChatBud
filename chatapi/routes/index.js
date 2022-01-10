var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/login', function(req, res, next) {
  const bodyData = req.body;
  return res.json(bodyData); 
});
router.get('/log', function(req, res, next) {
  return res.json({"message":"logged in"});
 
});

module.exports = router;
