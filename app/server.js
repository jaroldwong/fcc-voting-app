const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const Poll = require('./models/poll');
const app = express();
const seedDB = require('./seed');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/votingapp');

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

seedDB();

app.get('/', (req, res) => {
  Poll.find({}).then(
    polls => {
      res.render('index', {polls: polls});
    }
  )
});

app.post('/polls', (req, res) => {
  // create
});

app.put('/polls/:id', (req, res) => {
  // update
});

app.delete('/polls/:id', (req, res) => {
  // delete
});

module.exports = app;
