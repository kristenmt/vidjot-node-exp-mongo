const express = require ('express');
const path = require("path");
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const flash = require("connect-flash");
const session = require("express-session");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

// load routes
const ideas = require("./routes/ideas");
const users = require("./routes/users");

// map global promise to get rid of warning
mongoose.Promise = global.Promise;
// connect to mongoose

mongoose.connect("mongodb://localhost/vidjot-dev", {
    useMongoClient: true
})
.then(() => console.log("mongodb connected..."))
.catch(err => console.log(err));


// handlebars middleware

app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// static folder
app.use(express.static(path.join(__dirname, 'public')));


// method override middleware
app.use(methodOverride('_method'));

// express session middleware
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  }));

  app.use(flash());

  // global variables
  app.use(function(req, res, next){
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");
    res.locals.error = req.flash("error");
    next();
  });
  

// How middleware works
// app.use(function(req, res, next){
//     console.log(Date.now());
//     req.name = "Kristen";
//     next();
    
// });

// Index route
app.get("/", (req, res) => {
    // console.log(req.name);
    // res.send(req.name);
    const title = "Welcome";
     res.render("index", {
         title: title
     });
});
// About route
app.get("/about", (req, res) => {
    res.render("about");
});

// use routes
app.use("/ideas", ideas);
app.use("/users", users);

const port = 5000;
app.listen(port, () =>{
    console.log(`Server started on port ${port}`);
    
});