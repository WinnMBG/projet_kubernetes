const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const port = 3001;

// MongoDB connection URI
const mongoURI = 'mongodb+srv://winn:2ROaHiGWnVle25Vs@atlascluster.8mzfc5e.mongodb.net/test?retryWrites=true&w=majority';

// MongoDB models
const Data = mongoose.model('Data', {
  name: String,
  description: String
});

// Connect to MongoDB
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// GET all data from the database
app.get('/all', async (req, res) => {
  try {
    const data = await Data.find();
    res.json(data);
  } catch (err) {
    console.error('Error querying database:', err);
    res.status(500).send('Error querying database');
  }
});

// POST data to the database
app.post('/data', async (req, res) => {
  const newData = new Data({
    name: req.body.name,
    description: req.body.description
  });

  try {
    await newData.save();
    res.status(201).send('Data inserted successfully');
  } catch (err) {
    console.error('Error inserting into database:', err);
    res.status(500).send('Error inserting into database');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
