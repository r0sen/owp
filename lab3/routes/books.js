var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');

var readDoc = function(fileName) {
	var filePath = path.join(__dirname, fileName);
	return new Promise(function(resolve, reject)
  {
		fs.readFile(filePath, {encoding: 'utf-8'}, function(err, data) {
			if (!err) {
				resolve(data);
			}
      else {
				reject(err);
			}
		});
	});
};

router.all('/', function(req, res, next) {
	let arr = []; // array of my books
	readDoc('../public/json/books.json').then(function(contents) {
		let jsonList = JSON.parse(contents);
		for (let i = 0; i < jsonList.length; i++) {
			let myBook = jsonList[i];
			let myTitle = myBook.id;
			arr.push({
			  book: myBook.title, // field 'book' in my current book in json
				href:  myTitle,
				imgPath: myBook.image_url
			});
		}
		res.render('books', { arr: arr });
	}).catch(function(err) {
		err = new Error('Json file is absent');
		err.status = 500;
		next(err);
	});
});

router.all('/*', function(req, res, next) {
console.log("AHTUNG!!!");
  let clientArtPath = req.path;
      let needfulBook = null;
  clientArtPath = clientArtPath.slice(1); // cut '/'
console.log(clientArtPath);
  readDoc('../public/json/books.json')
    .then(function(contents) {

      let jsonList = JSON.parse(contents);

//////////////////////////////////////////////
      for (let i = 0; i < jsonList.length; i++) {
							console.log("AHTUNG!!!++++++++");
        let myBook = jsonList[i];
        let myTitle = myBook.id;
        if (myTitle == clientArtPath) {
								console.log("AHTUNG!!!++++++++_!_!__!_");
          needfulBook = myBook;
          break;
        }

      }
			console.log("SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSs");
			console.log(needfulBook);

      if (needfulBook !== null) {
				console.log("SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSs");

				var widthArg = "300px";
				var lengthArg = "300px";
				let myTitle = needfulBook.title.toLowerCase();

        res.render('book', {
					title: needfulBook.title,
			    genre: needfulBook.genre,
			    description: needfulBook.description,
			    author: needfulBook.author,
			    publisher: needfulBook.publisher,
			    pages: needfulBook.pages,
			    image_url: needfulBook.image_url,
			    price: needfulBook.price,
			    release_date: needfulBook.release_date,
			    age_limit: needfulBook.age_limit,
			    language: needfulBook.language,
          });
      }
      else {
        let err = new Error("Requested book doesn't exist"); 
        err.status = 404;
        next(err);
      }
    })
    .catch(function(err) {
      err = new Error('Json file is absent');
      err.status = 500;
      next(err);
    });
});

module.exports = router;
