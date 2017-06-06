const mongoose = require('mongoose');
const Poll = require('./models/poll');

var data = [
  {
    user: 'Bob',
    title: 'Mac vs PC',
    options: [
      {content: 'Mac', votes: 0},
      {content: 'PC', votes: 0}
    ]
  },
  {
    user: 'Evan',
    title: 'React vs Angular',
    options: [
      {content: 'React', votes: 0},
      {content: 'Angular', votes: 0}
    ]
  }
]

function seedDB() {
  Poll.remove({}, function(){
    console.log('Remove all collections');
  }
  );

  data.forEach(function(seed){
    Poll.create(seed);
    console.log('Seed data');
  });
};

module.exports = seedDB;
