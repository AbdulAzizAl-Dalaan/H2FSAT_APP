var express = require('express');
const User = require('../models/User')
var router = express.Router();


/* GET home page. */

router.get('/', function(req, res, next) {
  if(req.query.msg)
  {
    res.locals.msg = req.query.msg
  }
  res.render('about');
});

module.exports = router;