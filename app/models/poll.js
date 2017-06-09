const mongoose = require('mongoose');

const PollSchema = new mongoose.Schema({
  user: {
    type: String,
    require: true,
  },
  title: {
    type: String,
    require: true,
  },
  options: [{
    content: String,
    votes: {type: Number, default: 0},
    _id: false,
  }],
});

const Poll = mongoose.model('poll', PollSchema);

module.exports = Poll;
