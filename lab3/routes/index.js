var express = require('express');
var router = express.Router();

router.all('/', function(req, res, next) { // all : get + post ...
  res.render('index');
});

/* GET about page. */
router.all('/about', function(req, res, next) {
  res.render('about');
});

module.exports = router;

/* <link rel="shortcut icon" href="../public/favicon.ico" type="image/x-icon"> */
