const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios')


public_users.post("/register", (req,res) => {
    let username = req.body.username
    let password = req.body.password

    if (!username || !password) 
        return res.status(400).json({message: 'Username or password missing'})
    if (userExists(username))
        return res.status(400).json({message: 'User already exists'})

    users.push({'username': username, 'password': password})

    return res.status(200).json({message: 'User registered successfully'})
});

const userExists = (username) => {
    return users.find((user) => user.username === username) != undefined 
}


// Get the book list available in the shop
public_users.get('/', async function (req, res) {
    const booksResponse = await booksAsync()
    
    return res.send(JSON.stringify(booksResponse))
});

const booksAsync = async () => books



// Get book details based on ISBN
public_users.get('/isbn/:isbn',async function (req, res) {

    const booksResponse = await booksAsync()

    const filteredBook = booksResponse[req.params.isbn]
    
    if (!filteredBook) {
        return res.send('No books found!')
    }

    return res.send(JSON.stringify(filteredBook))
 });
  



// Get book details based on author
public_users.get('/author/:author',async function (req, res) {
    
    const booksResponse = await booksAsync()

    let filteredBook = [] 
    for(isbn in booksResponse) {
        if (books[isbn]['author'] === req.params.author)
            filteredBook.push(booksResponse[isbn])
    }
    
    if (filteredBook.length === 0) {
        return res.send('No books found!')
    }

    return res.send(JSON.stringify(filteredBook))
});

// Get all books based on title
public_users.get('/title/:title',async function (req, res) {
    const booksResponse = await booksAsync()
    
    let filteredBook = [] 
    for(isbn in booksResponse) {
        if (booksResponse[isbn]['title'] === req.params.title)
            filteredBook.push(booksResponse[isbn])
        //return res.send(JSON.stringify(books[isbn]))
    }
    
    if (filteredBook.length === 0) {
        return res.send('No books found!')
    }

    return res.send(JSON.stringify(filteredBook))
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    var filteredBook = books[req.params.isbn]
    
    if (!filteredBook) {
        return res.send('No books found!')
    }

    return res.send(JSON.stringify(filteredBook['reviews']))
});

module.exports.general = public_users;
