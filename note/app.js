const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const Note = require('./models/note'); // Import the Note model
const app = express();
const port = 3000;

// Set up EJS as the template engine
app.set('view engine', 'ejs');

// Use body-parser middleware to parse JSON and URL-encoded bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static assets (CSS, JavaScript, images)
app.use(express.static(__dirname + '/public'));

// Connect to the MongoDB database
mongoose.connect('mongodb+srv://sadgun:GZUtst088Is5VwyK@cluster0.2vtncqq.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

// Define a route for the root URL ("/")
app.get('/', async (req, res) => {
  try {
    // Fetch all notes from the database
    const notes = await Note.find({});
    
    // Render the "index.ejs" template and provide data
    res.render('index', { title: 'Your Page Title', notes: notes });
  } catch (error) {
    console.error('Error fetching notes:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Handle form submission to add a new note
app.post('/add-note', async (req, res) => {
  const { title, content } = req.body;
  
  try {
    // Create a new note and save it to the database
    await Note.create({ title, content });
    
    // Send a success response
    res.json({ success: true });
  } catch (error) {
    console.error('Error adding note:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

// Handle note deletion
app.delete('/delete-note/:id', async (req, res) => {
  const noteId = req.params.id;
  
  try {
    // Delete the note from the database
    await Note.findByIdAndDelete(noteId);
    
    // Send a success response
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting note:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
