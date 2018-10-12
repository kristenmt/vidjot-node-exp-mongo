const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();


//user login rout
router.get("/login", (req, res) => {
    res.render("users/login");
});
//user register rout
router.get("/register", (req, res) => {
    res.render("users/register");
});

module.exports = router;
