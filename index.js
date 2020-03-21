//Importing modules
const express = require('express');
const app = express();
const dotenv = require("dotenv");
const mongoose = require('mongoose');
const fetch = require("node-fetch");
const jwt = require("jsonwebtoken");

const User = require("./model/User");
const bcrypt = require("bcryptjs");
const { registerValidation, loginValidation } = require("./validation");

// //Importing routes
// const authRoute = require("./routes/auth");
// const testRoute = require("./routes/test"); //Test

let globalToken = "";

//Config
dotenv.config();
app.use(express.urlencoded({ extended: false }));

//connecting to db
mongoose.connect( process.env.DB_CONNECT, {useNewUrlParser: true, useUnifiedTopology: true}, () =>
    console.log("connected to DB")
);

//Index GET
app.get("/", (req, res) => {
    res.render("index.ejs");
});


//register GET
app.get("/register", (req, res) => {
    res.render("register.ejs");
});
//register POST
app.post("/register", async (req, res) => {
    try {
        await fetch('http://localhost:3000/api/user/register', {
            method: 'post',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password
            })
            }).then(function (response) {
                return response.json();
            })
            .then(function (result) {
                //IFsats med om token eller email eller apssword så gör olika
                //Wrong_email / pass eller email_exist alt. error(kolla)
                //FIXA UTSKRIFT MED EJS!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
                res.redirect('./login');
            })
    } catch(err) {
          console.log(err);
          res.status(400).send(err);
    }
});




//Login GET
app.get("/login", (req, res) => {
    res.render("login.ejs");
});
//login POST
app.post("/login", async (req, res) => {
    try {
        await fetch('http://localhost:3000/api/user/login', {
            method: 'post',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
              email: req.body.email,
              password: req.body.password
            })
            }).then(function (response) {
                return response.json();
            })
            .then(function (result) {
                //IFsats med om token eller email eller apssword så gör olika
                //Wrong_email / pass eller email_exist alt. error(kolla)
                //FIXA UTSKRIFT MED EJS!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
                globalToken = result.msg;
                console.log(result.msg);
                res.redirect('./token');
            })
    } catch(err) {
          console.log(err);
          res.status(400).send(err);
    }
});

//logout GET
app.get("/logout", (req, res) => {
    globalToken = "";
    res.redirect('./login')
});




//TEST ROUTE(testing moddleware)
app.get("/token", verify_token, (req, res) => {
    res.render("token.ejs");
});

function verify_token(req, res, next) {
    const token = globalToken;
    // const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    // console.log(verified);
    if (!token) return res.status(401).send("access denied");

    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        return res.status(400).send("Invalid token");
    }
}









//middleware
app.use(express.json());
// //Route middleware
// app.use("/api/user", authRoute);
// app.use("/test/token", testRoute); //Test

app.listen(3001, () => console.log("the server is running on posrt 3001"));
