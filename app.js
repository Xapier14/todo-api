const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv/config');
const app = express();

// import routes
const v1 = require('./routes/api/v1');

// middlewares
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.json());
app.use('/api/v1', v1);

// routes
app.get('/', (req, res) => {
  res.send('We are on home');
});

// connect to mongodb
mongoose.connect(
  process.env.DB_CONNECTION,
  {
    useNewUrlParser: true
  },
  () => {
  console.log('Connected to mongodb');
});

// start listening
app.listen(3000);