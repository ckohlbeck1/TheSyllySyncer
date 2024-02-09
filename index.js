// index.js

/**
 * Required External Modules
 */

const express = require("express");
const path = require("path");
const LogInCollection = require("./mongodb");

/**
 * App Variables
 */

const app = express();
const port = process.env.PORT || "8000";

/**
 *  App Configuration
 */

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({extended:false}));
app.use(express.json());

/**
 * Routes Definitions
 */

app.get("/", (req, res) => {
    res.render('login', {title: "Login"}); // Renders login.pug
});

app.get("/signup", (req, res) => {
    res.render('signup', {title: "SignUp"}); // Renders login.pug
});

app.get("/options", (req, res) => {
    res.render('options', {title: "Options"}); // Renders options.pug
});

app.get("/results", (req, res) => {
    res.render('results', {title: "results"}); // Renders results.pug
});

app.post('/signup', async (req, res) => {
    const data ={
        username: req.body.username,
        password: req.body.password
    }

await LogInCollection.insertMany([data]);

res.render("home");

});

app.post('/login', async (req, res) => {
   try{
        const check = await LogInCollection.findOne({username:req.body.username});
        if(check.password == req.body.password){
            res.render('options', { username: req.body.username });
        }else{
            res.render('login', { title: "Login", errorMessage: "Incorrect username or password!" });
        }

    }
    catch{
        console.error(err);
        res.render('login', { title: "Login", errorMessage: "Error during login." });
    };


});

/**
 * Server Activation
 */

app.listen(port, () => {
    console.log(`Listening to requests on http://localhost:${port}`);
  });