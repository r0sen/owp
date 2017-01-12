var express = require('express');
var router = express.Router();
var passport       = require('passport');
var LocalStrategy  = require('passport-local').Strategy;
//***********************************UPLOAD
var path = require('path');
var multer  = require('multer');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/pics/avatars/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)) //Appending extension
  }
});




var avatar = multer({ storage: storage });



router.post('/profile', ensureAuthenticated, avatar.single('avatar'), function (req, res, next) {
  User.getUserById(req.user.id, function(err, myuser) {
    if (err) throw err;
    myuser.avatar = req.file.filename;
    //console.log(myuser.avatar);
    User.updateUser(req.user.id, myuser, {}, function(err, mynewuser){
      if(err) throw err;
      //console.log(mynewuser.avatar);
      res.redirect('/users/profile');
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

//**********************************************
router.get('/register', function(req, res, next) {
  res.render('signup');
});

router.get('/login', function(req, res, next) {
  res.render('login');
});

router.get('/profile', ensureAuthenticated, function(req, res, next) {
    res.render('user');
});
router.post('/register', function(req, res) {
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var email = req.body.email;
    var username = req.body.username;
    var password = req.body.password;
    var confirmPassword = req.body.confirmPassword;
    console.log("User sent: firstname: "+firstname+"; lastname: "+lastname+"; email: "+email+"; username: "+username+"; password1: "+password+"; password2: "+confirmPassword);

    //validation
    req.checkBody('firstname', 'First name is required').notEmpty();
    req.checkBody('lastname', 'Last name is required').notEmpty();
    req.checkBody('email', 'Email is required').isEmail();
    req.checkBody('username', 'Username is required').notEmpty();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('confirmPassword', 'Passwords do not match').equals(req.body.password);

    var errors = req.validationErrors();

    if(errors){
      res.render('signup', {errors: errors});
    }else{
      var newUser = new User({
        username: username,
        firstname: firstname,
        lastname: lastname,
        email: email,
        password: password
      });

      User.createUser(newUser, function(err, user){
        if(err) throw err;
        console.log(user);
      });

      req.flash('success_msg', 'You are registred and now can log in');
      res.redirect('login');
    };
});

passport.use(new LocalStrategy(
  function(username, password, done) {
    User.getUserByUsername(username, function(err, user){
      if (err) throw err;
      if(!user){
        return done(null, false, {message: 'Unknown user'});
      }

      User.comparePassword(password, user.password, function(err, isMatch){
          if(err) throw err;
          if(isMatch){
            return done(null, user);
          } else{
            return done(null, false, {message: 'Invalid password'});
          }
      });
    });
}));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

router.post('/login',
  passport.authenticate('local', {successRedirect:'/', failureRedirect:'/users/login', failureFlash: true}),
  function(req, res) {
    res.redirect('/');
});

router.get('/logout', function(req, res){
  req.logout();
  req.flash('success_msg', "Ypu are logged out");
  res.redirect('/users/login');
});

module.exports = router;
