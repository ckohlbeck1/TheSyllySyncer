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
const studentInfoMap = new Map();
const selectedClass = "";
const selectedSection = "";
const groupSize = 0;
let students = [];
let studentInfo = [];

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

app.get("/results", async(req, res) => {
    res.render('results', {title: "results"}); 
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

// Add the following function to calculate the Hamming distance between two binary arrays
function hammingDistance(arr1, arr2) {
    let distance = 0;
    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) {
            distance++;
        }
    }
    return distance;
}

app.post('/results', upload.single('csvfile'), async (req, res) => {
    const check = await LogInCollection.findOne({ username: req.body.username });

    const selectedClass = req.body.selectedClass;
    const selectedSection = req.body.selectedSection;
    const matchingStudents = [];

    fs.createReadStream('./student.csv')
        .pipe(csv())
        .on('data', (student) => {
            const ufidValue = student.ufid;
            const class1Value = student.class1;
            const section1Value = student.section1;
            const class2Value = student.class2;
            const section2Value = student.section2;
            const class3Value = student.class3;
            const section3Value = student.section3;
            const class4Value = student.class4;
            const section4Value = student.section4;
            const timeArrayValue = Object.values(student).slice(9);

            if ((class1Value === selectedClass && section1Value === selectedSection) ||
                (class2Value === selectedClass && section2Value === selectedSection) ||
                (class3Value === selectedClass && section3Value === selectedSection) ||
                (class4Value === selectedClass && section4Value === selectedSection)) {
                matchingStudents.push({ ufid: ufidValue, timeArray: timeArrayValue });
            }
        })
        .on('end', () => {
            // Calculate compatibility scores and sort the students based on these scores
            matchingStudents.forEach(student => {
                student.compatibility = matchingStudents.map(otherStudent => ({
                    ufid: otherStudent.ufid,
                    score: hammingDistance(student.timeArray, otherStudent.timeArray)
                })).filter(other => other.ufid !== student.ufid)
                .sort((a, b) => a.score - b.score);
            });

            // Pair students based on compatibility, ensuring each student is paired only once
            const pairs = [];
            const pairedStudents = new Set();

            matchingStudents.forEach(student => {
                if (!pairedStudents.has(student.ufid)) {
                    const mostCompatibleMatch = student.compatibility.find(other => !pairedStudents.has(other.ufid));
                    if (mostCompatibleMatch) {
                        pairs.push({ student1: student.ufid, student2: mostCompatibleMatch.ufid });
                        pairedStudents.add(student.ufid);
                        pairedStudents.add(mostCompatibleMatch.ufid);
                    }
                }
            });

            res.render('results', { pairs, username: req.session.username, selectedClass, selectedSection });
        });
});

/**
 * Server Activation
 */

app.listen(port, () => {
    console.log(`Listening to requests on http://localhost:${port}`);
  });