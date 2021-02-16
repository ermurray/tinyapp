const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const app = express();
const PORT = 8080;

const urlDatabase = {
  'b2xVn2': 'http://www.lighthouselabs.ca',
  '9sm5xK': 'http://www.google.com'
};
const generateRandomString = function() {
  return Math.random().toString(36).substr(2,6);
  
};
app.use(morgan(':method :url :status :response-time ms - :res[content-length]'));
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');

app.get('/urls', (req, res) => {
  const templateVars = {urls: urlDatabase};
  res.render('urls_index', templateVars);
});

app.get('/urls/new', (req, res) => {
  res.render('urls_new');
});

app.post('/urls', (req, res) => {
  urlDatabase[generateRandomString()] = req.body.longURL;
  console.log(req.body);
  
  res.redirect('/urls/:shortURL');
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

app.get('/urls/:shortURL', (req, res) => {
  const templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL]
  };
  res.render('urls_show', templateVars);
});

app.get('/hello', (req, res) => {
  res.send('<html><body> hello <b>World</b><b/body<html>\n');
});

app.get('/', (req, res) => {
  res.send('Hello!');
});

app.post('/urls/:shortURL/delete', (req, res) => {
  console.log('you want to delete', urlDatabase[req.params.shortURL]);
  delete urlDatabase[req.params.shortURL];
  res.redirect('/urls');
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});