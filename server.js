const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.static('public'));
app.use(express.json());

// Route files to client via HTTP request
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'notes.html'));
});

// Establish API routes
app.get('/api/notes', (req, res) => {
    fs.readFile(path.join(__dirname, 'db', 'notes.json'), 'utf8', (error, data) => {
      error ? console.error(error) : res.json(JSON.parse(data));
    });
});

// Post request to save new notes
app.post('/api/notes', (req, res) => {
  const newNote = req.body;

  fs.readFile(path.join(__dirname, 'db', 'notes.json'), 'utf8', (error, data) => {
      if (error) {
          console.log(error);
      }

      // Parsing data to manipulate
      const notes = JSON.parse(data);

      // Assign timestamp of new note as note specific ID
      newNote.id = Date.now().toString();
      notes.push(newNote);

      fs.writeFile(path.join(__dirname, 'db', 'notes.json'), JSON.stringify(notes), error => {
          if (error) {
              console.log(error);
          }
          res.json(newNote);
      });
  });
});

// Route index.html for any unspecified route
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});