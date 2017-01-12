var express = require('express');
var router = express.Router();
var passport       = require('passport');
var LocalStrategy  = require('passport-local').Strategy;
var path = require('path');
var multer  = require('multer');




/*var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/pics/users/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)) //Appending extension
  }
});




var avatar = multer({ storage: storage });*/

var avatar = multer({ inMemory: true,
                     storage: multer.memoryStorage({}) });





router.post('/account', ensureAuthenticated, avatar.single('avatar'), function (req, res, next) {
  User.getUserById(req.user.id, function(err, myuser) {
    if (err) throw err;
  myuser.avatar = req.file.buffer.toString('base64');
    //console.log(myuser.avatar);
  //console.log('_______________________HERE----------------------------------------------------------------');
    User.updateUser(req.user.id, myuser, {}, function(err, mynewuser){
      if(err) throw err;
      console.log(mynewuser.avatar);
      res.redirect('/');
    });
  });
});




function ensureAuthenticated(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  else{
    req.flash('error_msg', 'You are not logged in');
    res.redirect('/users/login');
  }
}
module.exports = router;
