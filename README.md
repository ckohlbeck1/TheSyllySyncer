# TheSyllySyncer

In the realm of higher education, coordinating group meetings poses a recurring challenge, particularly when groups are randomly assigned on platforms like Canvas. This often results in incomplete attendance and inconvenient meeting times due to clashes in class schedules. The SyllySyncer emerges as a groundbreaking solution, designed to enable professors to effortlessly generate optimal groups by considering students' schedules.

## Table of Contents

1. [Installation](#Installation)
2. [Usage](#Usage)
3. [Contributions](#Contributions)
4. [Roadmap](#Roadmap)

## Installation

All the following should be completed in your terminal.

First clone the repository.
```bash
git clone https://github.com/ckohlbeck1/TheSyllySyncer
```
Then in the newly created "TheSyllySyncer" folder, run the following command to see if you have npm installed.
```bash
node -v
```
If no version number is returned, install npm. If a version number is returned, skip over this step.
```bash
npm install
```
Lastly, install the following libraries:
```bash
npm install mongoose
npm install multer
npm install express-session
```

## Usage

In order to run the website, use the following command:
```bash
npm run dev
```
Then, navigate to [http://localhost:8000/](http://localhost:8000/).

From here you will see a login screen: 
![login](https://github.com/ckohlbeck1/TheSyllySyncer/blob/main/READMEImages/login.png)

In order to test the program we have the following logins:
- Username: chris, Password: kohl
- Username: syd, Password: farm
- Username: john, Password: smith

After using one of those logins, you will be redirected to the options page:
![Options](https://github.com/ckohlbeck1/TheSyllySyncer/blob/main/READMEImages/options.png)

From here you will need to select all three options from the drop downs: class, section, and group size. The options that show up are dependent on the "professor" you log in as. It will only show the classes that the professor teaches, and then the sections of the chosen class. 
![Options](https://github.com/ckohlbeck1/TheSyllySyncer/blob/main/READMEImages/options(filled).png)

Once all options are selected, you can hit generate. This will compare all the student's schedules in the class and section chosen, and create optimal pairs based on availability using the hamming distance algorithm. 
![Results](https://github.com/ckohlbeck1/TheSyllySyncer/blob/main/READMEImages/results.png)

On the results page you can scroll through to see the UFIDs that were paired together and export the results to a csv.
![Export](https://github.com/ckohlbeck1/TheSyllySyncer/blob/main/READMEImages/export.png)

From here you have the option to login as a different professor or create more compatiable pairs for different classes/sections!

## Contributions

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## Roadmap

We see in the future adding the following features: 
- Canvas integration
- Adding compatibility algorithms to create groups of 3, 4, or 5

