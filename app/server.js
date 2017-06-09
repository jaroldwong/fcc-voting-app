const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User = require('./models/user');
const Poll = require('./models/poll');
const app = express();
const seedDB = require('./seed');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/votingapp');

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// PASSPORT CONFIG
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');

seedDB();

// Polls Index
app.get('/polls', (req, res) => {
  Poll.find({}).then(
    (polls) => {
      res.render('index', {polls: polls});
    });
});

// New Polls
app.get('/polls/new', isLoggedIn, (req, res) => {
  res.render('new');
});

// Create Poll
app.post('/polls', (req, res) => {
  const title = req.body.title;
  const options = req.body.options.split(',').map((option) => {
    return option.trim();
  });

  const pollOptions = options.map((opt) => {
    return {content: opt, votes: 0};
  });

  Poll.create({
    user: 'anon',
    title: title,
    options: pollOptions,
  }, (err, poll) => {
    if (err) {
      console.error(err);
    }

    res.redirect('/');
  });
});

// Show Poll
app.get('/polls/:id', (req, res) => {
  const id = req.params.id;

  Poll.findById(id, (err, poll) => {
    res.render('show', {poll: poll});
  });
});

// Update Poll
app.post('/polls/:id', (req, res) => {
  const id = req.params.id;

  if (req.body.option) {
    const option = req.body.option;

    Poll.findById(id, (err, poll) => {
      if (err) {
        console.error(err);
      }

      poll.options[option].votes += 1;
      poll.save((err, data) => {
        console.log('successful update');
      });
    });
  }

  if (req.body.content) {
    const content = req.body.content;

    Poll.findById(id, (err, poll) => {
      if (err) {
        console.error(err);
      }

      poll.options.push({content: content, votes: 0});
      poll.save(() => {
        res.redirect('/polls/' + id);
      });
    });
  }
});

// Destroy Poll
app.delete('/polls/:id', (req, res) => {
  Poll.findById(req.params.id, (err, poll) => {
    if (err) {
      console.error(err);
    } else {
      poll.remove();
      res.redirect('/polls');
    }
  });
});

// AUTH ROUTES
app.get('/signup', (req, res) => {
  res.render('signup');
});

app.post('/signup', (req, res) => {
  const newUser = new User({username: req.body.username});
  User.register(newUser, req.body.password, (err, user) => {
    if (err) {
      console.log(err);
      return res.render('signup');
    }

    passport.authenticate('local')(req, res, () => {
      res.redirect('/polls');
    });
  });
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.post('/login', passport.authenticate('local',
  {
    successRedirect: '/polls',
    failureRedirect: '/login',
  }), (req, res) => {});

app.get('logout', (req, res) => {
  req.logout();
  res.redirect('/polls');
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
};

app.get('/', (req, res) => {
  res.redirect('/polls');
});

module.exports = app;
