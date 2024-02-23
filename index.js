// index.js

/**
 * Required External Modules
 */

const express = require("express");
const path = require("path");
const LogInCollection = require("./mongodb");
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const session = require('express-session');

/**
 * App Variables
 */
const studentsMap = new Map();
const selectedClass = "";
const selectedSection = "";
const groupSize = 0;
let students = [];

const app = express();
const port = process.env.PORT || "8000";

const upload = multer({dest: 'uploads/'});
/**
 *  App Configuration
 */

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({extended:false}));
app.use(express.json());

app.use(session({
    secret: 'secret-key',
    resave: true,
    saveUninitialized: true
}));

function requireLogin(req, res, next){
    if(req.session && req.session.username){
        return next();
    } else {
        return res.redirect('/login');
    }
}
/**
 * Routes Definitions
 */

app.get("/", (req, res) => {
    res.render('login', {title: "Login"}); // Renders login.pug
});

app.get("/signup", (req, res) => {
    res.render('signup', {title: "SignUp"}); // Renders login.pug
});

app.get("/options", async(req, res) => {
    const check = await LogInCollection.findOne({username:req.session.username});

    const results = {};

            fs.createReadStream('./data.csv')
                .pipe(csv())
                .on('data', (data) => {
                    const classKey = data.class;
                    const profValue = data.prof;
                    const sectionsArray = Object.values(data).slice(2); 
                    studentsMap.set(data.class, { prof: profValue, section: sectionsArray, class: classKey});
                    students = Array.from(studentsMap.values());
                })
                .on('end', () => {
                    res.render('options', { students, username: req.session.username, selectedClass, selectedSection, groupSize });
                });
            
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

res.render("login");

});

app.post('/login', upload.single('csvfile'), async (req, res) => {
   try{
        const check = await LogInCollection.findOne({username:req.body.username});
        if(check.password == req.body.password){   
            req.session.username = req.body.username;         
            fs.createReadStream('./data.csv')
                .pipe(csv())
                .on('data', (data) => {
                    const classKey = data.class;
                    const profValue = data.prof;
                    const sectionsArray = Object.values(data).slice(2); 
                    studentsMap.set(data.class, { prof: profValue, section: sectionsArray, class: classKey});
                    students = Array.from(studentsMap.values());
                })
                .on('end', () => {
                    res.render('options', { students, username: req.body.username, selectedClass, selectedSection, groupSize});
                });
        }else{
            res.render('login', { title: "Login", errorMessage: "Incorrect username or password!" });
        }

    }
    catch{
        console.error(err);
        res.render('login', { title: "Login", errorMessage: "Error during login." });
    };


});

app.post('/results', (req, res) => {
    const selectedClass = req.body.selectedClass; // Retrieve selectedClass from form data
    const selectedSection = req.body.selectedSection; // Retrieve selectedSection from form data
  
    // Pass selectedClass and selectedSection to results.pug
    res.render('results', { selectedClass, selectedSection });
});
/**
 * Server Activation
 */

app.listen(port, () => {
    console.log(`Listening to requests on http://localhost:${port}`);
  });