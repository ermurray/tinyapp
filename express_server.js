const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cookieSession = require('cookie-session');
const bcrypt = require('bcryptjs');
const { getUserByEmail, urlsForUser, checkEmail, generateRandomString} = require('./helpers');
const app = express();
const PORT = 8080;

const urlDatabase = {
  'b2xVn2': {longURL:'http://www.lighthouselabs.ca', userID: '1a2b3c'},
  '9sm5xK': {longURL:'http://www.google.com', userID: '1a2b3c'}
};



const users = {
  "1a2b3c": {
    id: "1a2b3c",
    email: "example@example.com",
    password: "$2a$10$uVXOrZ7FtDyKDRTHqlpcGuVaPByoT0/Y41EXl7hEZEB32dp6WMuKi"

  },
  "2b3c4d": {
    id: "2b3c4d",
    email: "test@example.com",
    password: "$2a$10$WeViIClb6R6n0/F8520rS.ctshaSrYZhy8aGes626LRb4ZCjjNFWG"
  }
};


//MIDDLEWARE
app.use(morgan(':method :url :status :response-time ms - :res[content-length]'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieSession({
  name: 'session',
  keys: ['teeny', 'tiny', 'yellow', 'youKnowThe', 'REST']
}));
app.set('view engine', 'ejs');



app.get('/urls', (req, res) => {
  if (req.session['user_id']) {
    const userURLs = urlsForUser(req.session['user_id'], urlDatabase);
    console.log(userURLs);
    const templateVars = {
      urls: userURLs,
      user: users[req.session['user_id']]
    };
    return res.render('urls_index', templateVars);
  }
  res.redirect('/login');
});

app.get('/urls/new', (req, res) => {
  if (req.session['user_id']) {
    
    const templateVars = {
      urls: urlDatabase,
      user: users[req.session['user_id']]
    };
    res.render('urls_new', templateVars);
  }
  res.redirect('/login');
});


app.get('/register', (req, res) => {
  const templateVars = {
    user: users[req.session['user_id']]
  };
  res.render('urls_register', templateVars);
});

app.post('/register', (req, res) => {
  if (req.body['email'] === '' || req.body['password'] === '') {
    return res.status(400).send('cannot have blank email or password');
  }
  if (checkEmail(req.body['email'], users)) {
    return res.status(400).send('email already in use');
  }
  const randomID = generateRandomString(8);
  const password = req.body.password;
  const email = req.body.email;
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, (err, hash) =>{
      users[randomID] = {
        id: randomID,
        email,
        password: hash
      };
      console.log(hash);
      res.redirect('/login');
    });
  });
});

app.get('/login', (req, res) => {
  const templateVars = {
    user: users[req.session['user_id']]
  };
  res.render('urls_login', templateVars);
});

app.post('/login',(req, res) => {
  const email = req.body.email;
  const submitedPassword = req.body.password;
  const userID = getUserByEmail(email, users);
  if (!checkEmail(email, users)) {
    return res.status(401).send('invalid email or password');
  }
  bcrypt.compare(submitedPassword, users[userID].password, (err, result) => {
    console.log(result);
    if (result) {
      req.session['user_id'] = userID;
      res.redirect('/urls');
      return;
    } else {
      res.sendStatus(403);
    }
  });
});

app.get('/urls/:shortURL', (req, res) => {
  if (!urlDatabase[req.params.shortURL]) {
    return res.redirect('/404');
  }
  const templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL].longURL,
    user: users[req.session['user_id']]
  };
  res.render('urls_show', templateVars);
});


app.post('/logout', (req, res) => {
  req.session['user_id'] = null;
  res.redirect('/login');
});

app.post('/urls', (req, res) => {
  if (req.body.createURL === '') {
    return res.status(400).send('cannot set empty long URL');
  }
  let newURL = req.body.createURL;
  const shortURL = generateRandomString();
  if (!newURL.startsWith('http')) {
    newURL = `http://${newURL}`;
  }
  urlDatabase[shortURL] = {
    longURL: newURL,
    userID: req.session['user_id']
  };

  res.redirect(`/urls/${shortURL}`);
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL].longURL;
  res.redirect(longURL);
});


app.get('/', (req, res) => {
  res.send('Hello!');
});

app.get('/urls/:shortURL/edit', (req, res) => {
  res.redirect(`/urls/${req.params.shortURL}`);
});

app.post('/urls/:id', (req, res) => {
  if (!req.session['user_id']) {
    return res.status(401).send('not authorized to edit url');
  }
  if (req.body.longURL === '') {
    return res.status(400).send('cannot set empty long URL');
  }
  const newURL = req.body.longURL;
  if (!newURL.startsWith('http')) {
    urlDatabase[req.params.id].longURL = `http://${newURL}`;
    return res.redirect('/urls');
  }
  urlDatabase[req.params.id].longURL = newURL;
  res.redirect('/urls');
});

app.post('/urls/:shortURL/delete', (req, res) => {
  if (req.session['user_id']) {
    const urlToDelete = req.params.shortURL;
    const userURLs = Object.keys(urlsForUser(req.session['user_id'], urlDatabase));
    if (userURLs.includes(urlToDelete))
      delete urlDatabase[req.params.shortURL];
    return res.redirect('/urls');
  }
  res.status(401).send('unauthorized to delete this url');
});

app.get('*', (req, res) => {
  res.status(404);
  res.render('urls_404');
});

app.listen(PORT, () => {
  console.log(`TinyApp listening on port ${PORT}!`);
});