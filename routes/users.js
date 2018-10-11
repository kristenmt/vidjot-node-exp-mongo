const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();


//user login rout
router.get("/login", (req, res) => {
    res.send("login");
});
//user register rout
router.get("/register", (req, res) => {
    res.send("register");
});

module.exports = router;
