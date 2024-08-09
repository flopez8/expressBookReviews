const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ 
    if (!username)
        return false
    return true
}

const authenticatedUser = (username,password)=>{ 
    if (users == null)
        return false
    
    const filteredUser = users.filter((user) => 
    user.username === username && user.password === password)
    return filteredUser.length > 0
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username
    const password = req.body.password
    
    if (!username || !password)
    return res.status(400).json({message: "Username or password are missing"})

  if (!authenticatedUser(username, password))
    return res.status(400).json({message: "User not authenticated"})

    let accessToken = jwt.sign({
        data: password
    }, 'access', { expiresIn: 60 * 60 }); 
    
    req.session.authorization = { accessToken, username }

  return res.send('User logged in successfully');
});

// Add a book review
regd_users.put("/auth/review/:isbn/:review", (req, res) => {
  
    const message = req.params.review
    const isbn = req.params.isbn

    const book = books[isbn]

    if (!book)
        res.status(400).json({message: 'Invalid ISBN'})

    const review = {
        username : jwt.decode(),
        message: message
    }

  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
