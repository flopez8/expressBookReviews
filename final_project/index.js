const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){

if (req.session.authorization) {
let token = req.session.authorization['accessToken']

jwt.verify(token, 'access', (err, user) => {
    if (err) {
        return res.status(403).json({message: 'The user is not authenticated'})
    }

    req.user = user
    next()
})
}
else {
    return res.status(403).json({message: 'The user is not logged in'})
}
});
 
const PORT =9999;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
