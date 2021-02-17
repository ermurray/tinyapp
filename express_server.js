const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const app = express();
const PORT = 8080;

const urlDatabase = {
  'b2xVn2': 'http://www.lighthouselabs.ca',
  '9sm5xK': 'http://www.google.com'
};
const generateRandomString = function() {
  return Math.random().toString(36).substr(2,6);
  
};

const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "example@example.com",
    password: "blah-dah-wat"

  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "test@example.com",
    password: "wat-what-why"
  }
};

//MIDDLEWARE
app.use(morgan(':method :url :status :response-time ms - :res[content-length]'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.set('view engine', 'ejs');



app.get('/urls', (req, res) => {
  const templateVars = {
    urls: urlDatabase,
    username: req.cookies['username']
  };
  res.render('urls_index', templateVars);
});

app.get('/urls/new', (req, res) => {
  const templateVars = {username: req.cookies['username']};
  res.render('urls_new', templateVars);
});

//need to deal with _header partial login for registration page.
app.get('/registration', (req, res) => {

  res.render('urls_register');
});

// has bug that if url is entered with /urls/blah will allow creation of new entry with that shortURL.....
app.get('/urls/:shortURL', (req, res) => {
  const templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
    username: req.cookies['username']
  };
  res.render('urls_show', templateVars);
});

app.post('/login',(req, res) => {
  
  const username = req.body.username;
  res.cookie('username', username);
  res.redirect('/urls');
});

app.post('/logout', (req, res) => {
  res.clearCookie('username');
  res.redirect('/urls');
});

app.post('/urls', (req, res) => {
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect(`/urls/${shortURL}`);
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});


app.get('/', (req, res) => {
  res.send('Hello!');
});
app.get('/urls/:shortURL/edit', (req, res) => {
  res.redirect(`/urls/${req.params.shortURL}`);
});
app.post('/urls/:id', (req, res) => {
  urlDatabase[req.params.id] = req.body.longURL;
  res.redirect('/urls');
});

app.post('/urls/:shortURL/delete', (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect('/urls');
});

app.get('*', (req, res) => {
  res.status(404);
  res.render('urls_404');
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});