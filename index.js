//Importing modules
const express = require('express');
const app = express();
const dotenv = require("dotenv");
const mongoose = require('mongoose');
//Importing routes
const authRoute = require("./routes/auth");
const testRoute = require("./routes/test"); //Test

dotenv.config();

//connecting to db
mongoose.connect( process.env.DB_CONNECT, {useNewUrlParser: true, useUnifiedTopology: true}, () =>
    console.log("connected to DB")
);

//middleware
app.use(express.json());
//Route middleware
app.use("/api/user", authRoute);
app.use("/test/token", testRoute); //Test

app.listen(3000, () => console.log("the server is running on posrt 3000"));
