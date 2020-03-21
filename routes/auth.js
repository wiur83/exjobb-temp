const router = require('express').Router();
const User = require("../model/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { registerValidation, loginValidation } = require("../validation");


//REGISTRATION ROUTE
router.post("/register", async (req, res) => {
    //Validation
    const { error } = registerValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //Check if email exist
    const emailExist = await User.findOne({email: req.body.email});
    if (emailExist) return res.status(400).send("Email already exists");

    //Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    //User creation
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword
    });
    try {
      const savedUser = await user.save();
      res.send({ userId: user._id });
    } catch (err) {
        res.status(400).send(err);
    }
});

//LOGIN ROUTE
router.post("/login", async (req, res) => {
    //Validation
    const { error } = loginValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //Check if email exist
    const user = await User.findOne({email: req.body.email});
    if (!user) return res.status(400).send("Email is wrong");
    //Check if password is correct
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) return res.status(400).send("Password is wrong");

    //Create and asign jwt-token
    const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);

    res.header("auth-token", token).send(token);

    res.redirect("/test")
});

module.exports = router;
