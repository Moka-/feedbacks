'use strict';

var express = require('express');
var router = express.Router();

router.get('/Widget', function(req, res, next) {
  res.render('widget.html');
});

module.exports = router;
