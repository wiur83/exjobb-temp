//Importing modules
const express = require('express');
const app = express();
const dotenv = require("dotenv");
const mongoose = require('mongoose');
//Importing routes
const authRoute = require("./routes/auth");
const testRoute = require("./routes/test"); //Test

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

//Login GET
app.get("/login", (req, res) => {
    res.render("login.ejs");
});

//register GET
app.get("/register", (req, res) => {
    res.render("register.ejs");
});

//logout GET
app.get("/logout", (req, res) => {
    res.header("auth-token", "");
});

//Test GET
app.get("/test", (req, res) => {
    res.render("test.ejs", ({name: "pelle"}));
});

//middleware
app.use(express.json());
//Route middleware
app.use("/api/user", authRoute);
app.use("/test/token", testRoute); //Test

app.listen(3000, () => console.log("the server is running on posrt 3000"));
