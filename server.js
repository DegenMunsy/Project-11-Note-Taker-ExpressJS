const express = require('express');
const { fstat } = require('fs');
const path = require('path');
const { v4:uuidv4 } = require('uuid')
// const { clog } = require('./middleware/clog');
// const api = require('./routes/index.js');

const PORT = process.env.PORT || 3001;

const app = express();

// Import custom middleware, "cLog"
// app.use(clog);

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use('/api', api);

app.use(express.static('public'));

// GET Route for homepage
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

// GET Route for Notes page
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

// GET Route for notes
app.get('/api/notes', (req, res) => {
    fs.readFile('db/db.json', 'utf8', (err,data) => {
        err ? console.log(err) : res.json(JSON.parse(data))
    })
});

// POST Route to get a new note
app.post('/api/notes', (req, res) => {
    var title = req.body.title
    var text = req.body.text
    var newNote = {
    title, text, id:uuidv4()
    }
    fs.readFile('db/db.json', 'utf8', (err,data) => {
        var currentNotes = JSON.parse(data)
        currentNotes.push(newNote)
        fs.writeFile('db/db.json', JSON.stringify(currentNotes), (err) => {
            err ? console.log(err) : console.log(newNote.title + 'has been created')
        })
        res.sendFile(path.join(__dirname, '/public/notes.html'))
    })
})

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);
