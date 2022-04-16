const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 3001;
const uuid = require('./helpers/uuid');

//Initialize app
const app = express();

//Middleware 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

//imports
const fs = require('fs');
const utils = require('util');
const readFromFile = utils.promisify(fs.readFile);



//Home route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

//Home route for notes route
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

//Get all current notes
app.get('/api/notes', (req,res) => {
    readFromFile('./db/db.json').then((data)=> {
        res.json(JSON.parse(data));
    })
    // fs.readFile('./db/db.json');
    // res.json(data);
});



app.post('/api/notes', (req,res) => {
    readFromFile('./db/db.json').then((data) => {
        const notesArray = JSON.parse(data);
        const {title, text} = req.body;
        const newNotes = {title, text, id:uuid()};
        notesArray.push(newNotes);
        fs.writeFile('./db/db.json', JSON.stringify(notesArray),  (err) =>
        err
        ? console.error(err)
        : console.log(
            `Note has been written to JSON file`
          ));
    });
    res.json('end of the route')
})

app.listen(PORT, () => 
    console.log(`Express server listing on port http://localhost:${PORT}`));