const express = require ('express');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const flash = require("connect-flash");
const session = require("express-session");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
// map global promise to get rid of warning
mongoose.Promise = global.Promise;
// connect to mongoose

mongoose.connect("mongodb://localhost/vidjot-dev", {
    useMongoClient: true
})
.then(() => console.log("mongodb connected..."))
.catch(err => console.log(err));

// load idea model

require("./models/Idea");
const Idea = mongoose.model("ideas");

// handlebars middleware

app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
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

// idea index page
app.get("/ideas", (req, res) => {
    Idea.find({})
    .sort({date:"desc"})
    .then(ideas => {
        res.render("ideas/index", {
            ideas:ideas
        });
    });
    
});
// add idea form
app.get("/ideas/add", (req, res) => {
    res.render("ideas/add");
});

// edit idea form
app.get("/ideas/edit/:id", (req, res) => {
    Idea.findOne({
        _id: req.params.id
    })
    .then(idea => {
        res.render("ideas/edit", {
            idea:idea
        }); 
    });
});

// process form
app.post("/ideas", (req, res) => {
    //console.log(req.body);
    //res.send("ok");
    let errors = [];
    if(!req.body.title){
        errors.push({text:"Please add a title"});
    }
    if(!req.body.details){
        errors.push({text:"Please add some details"});
    }
    if(errors.length > 0){
        res.render("ideas/add", {
            errors: errors,
            title: req.body.title,
            details: req.body.details
        });
    } else {
        const newUser = {
            title: req.body.title,
            details: req.body.details
        }
        new Idea(newUser)
        .save()
        .then(idea => {
            req.flash("success_msg", "Video idea added");
            res.redirect("/ideas");
        })
    }
});

// edit form process
app.put("/ideas/:id", (req, res) => {
    // res.send("PUT");
    Idea.findOne({
        _id: req.params.id
    })
    .then(idea => {
        // new values
        idea.title = req.body.title;
        idea.details = req.body.details;
        idea.save()
        .then(idea => {
            req.flash("success_msg", "Video idea updated");
            res.redirect("/ideas");
        })
    })
});
// Delete idea
app.delete("/ideas/:id", (req, res) => {
    Idea.remove({_id: req.params.id})
    .then(() => {
        req.flash("success_msg", "Video idea removed");
        res.redirect("/ideas");
    })
});

const port = 5000;
app.listen(port, () =>{
    console.log(`Server started on port ${port}`);
    
});