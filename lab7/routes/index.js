var express = require('express');
var router = express.Router();
var Book = require('./models/book.js');

//router.use(csrfProtection);
/* GET home page. */

router.get('/', function(req, res, next) {
  console.log(req.query.q);
if(null != req.query.q){
  Book.searchBookByName(req.query.q,function(err,books){


      console.log(books);

      res.render("index",{arr:books});

  });

}
else{
  var arr = []; // array of my books
  Book.getBooks(function(err, books){
    if (err){
    res.render('error');
    return;
    }

    res.render('index', { arr: books });

  });
}

});


router.post('/delete/:id',ensureAuthenticated, function(req, res){
	var id = req.params.id;
  console.log(id);
	Book.removeBook(id, function(err, book){
		if(err){
			res.render("error");
      return;
		}
    res.redirect('/users/adminmenu');
		//res.json(book);
	});
});
router.get('/signup', function(req, res, next) {

  res.render('signup');
});

router.get('/about', function(req, res, next) {
  res.render('about');
});
router.get('/users/account', function(req, res, next) {
  res.render('users');
});
router.post('/', function(req, res) {
    var login = req.body.login;
    var password = req.body.password;
    console.log("User income: login: "+login+"; password: "+password);
    res.render('index');
});

router.post('/signup', function(req, res) {
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var email = req.body.email;
    var regPassword1 = req.body.regPassword1;
    var regPassword2 = req.body.regPassword2;

    console.log("User sent: firstname: "+firstname+"; lastname: "+lastname+"; email: "+email+"; password1: "+regPassword1+"; password2: "+regPassword2);
    if(regPassword1!==regPassword2){
      //error
    }

});
router.get('/:_id', function(req, res, next) {
  Book.getBookById(req.params._id, function(err, book){
    if (err){
      res.render('error');
      return;
    }
    res.render('book', {
	  title: book.title,
    genre: book.genre,
    description: book.description,
    author: book.author,
    publisher: book.publisher,
    pages: book.pages,
    image_url: book.image_url,
    price: book.price,
    release_date: book.release_date,
    age_limit: book.age_limit,
    language: book.language,
    id:req.params._id
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
