const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const winston = require('winston');

// Configuration du logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

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
app.use(cors())
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url} - ${req.ip}`);
  next();
});

// GET all data from the database
app.get('/all', async (req, res) => {
  try {
    logger.info('Hello, world!');
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
app.listen(port,'0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});
