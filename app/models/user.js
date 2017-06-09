const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new mongoose.Schema({
  username: String,
  password: String,
  polls: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'poll',
  }],
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('user', UserSchema);
