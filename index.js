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

/**
 * App Variables
 */
const studentsMap = new Map();
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
    const check = await LogInCollection.findOne({username:req.body.username});

    const results = {};

            fs.createReadStream('./data.csv')
                .pipe(csv())
                .on('data', (data) => {
                    studentsMap.set(data.student_id, { class: data.class, section: data.section});
                })
                .on('end', () => {
                    res.render('options', { students: Array.from(studentsMap.values()), username: req.body.username });
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

res.render("home");

});

app.post('/login', upload.single('csvfile'), async (req, res) => {
   try{
        const check = await LogInCollection.findOne({username:req.body.username});
        if(check.password == req.body.password){            
            fs.createReadStream('./data.csv')
                .pipe(csv())
                .on('data', (data) => {
                    studentsMap.set(data.student_id, { class: data.class, section: data.section});
                })
                .on('end', () => {
                    res.render('options', { students: Array.from(studentsMap.values()), username: req.body.username });
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

/**
 * Server Activation
 */

app.listen(port, () => {
    console.log(`Listening to requests on http://localhost:${port}`);
  });