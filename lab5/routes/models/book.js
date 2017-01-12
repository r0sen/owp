var mongoose = require('mongoose');

// Book Schema
var bookSchema = mongoose.Schema({
	title:{
		type: String,
		//required: true
	},
	genre:{
		type: String,
		//required: true
	},
	description:{
		//type: String
	},
	author:{
		type: String,
		//required: true
	},
	publisher:{
		type: String
	},
	pages:{
		type: String
	},
	image_url:{
		type: String
	},
	price:{
		type: String
	},
	release_date:{
		type: String
	},
	age_limit:{
		type: String
	},
	language:{
		type: String
	},
	create_date:{
		type: Date,
		default: Date.now
	}
});

var Book = module.exports = mongoose.model('Book', bookSchema);

// Get Books
module.exports.getBooks = function(callback, limit){
	Book.find(callback).limit(limit);
}

// Get Book
module.exports.getBookById = function(id, callback){
	Book.findById(id, callback);
}

// Add Book
module.exports.addBook = function(book, callback){
	Book.create(book, callback);
}

// Update Book
module.exports.updateBook = function(id, book, options, callback){
	var query = {_id: id};
	var update = {
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
    language: book.language
	}
	Book.findOneAndUpdate(query, update, options, callback);
}

// Delete Book
module.exports.removeBook = function(id, callback){
	var query = {_id: id};
	Book.remove(query, callback);
}
module.exports.searchBookByName = function(title,callback,limit){
  var query = {'title' : new RegExp('^'+title,"i")}
  Book.find(query,callback).limit(limit);
}
