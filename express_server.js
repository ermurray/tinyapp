const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const app = express();
const PORT = 8080;

const urlDatabase = {
  'b2xVn2': {longURL:'http://www.lighthouselabs.ca', userID: '1a2b3c'},
  '9sm5xK': {longURL:'http://www.google.com', userID: '1a2b3c'}
};

const generateRandomString = function(length = 6) {
  return Math.random().toString(36).substr(2,length);
  
};

const users = {
  "1a2b3c": {
    id: "1a2b3c",
    email: "example@example.com",
    password: "1234"

  },
  "2b3c4d": {
    id: "2b3c4d",
    email: "test@example.com",
    password: "4321"
  }
};
const verifyUser = function(loginEmail, loginPassword) {
  for (const user in users) {
    if (users[user].email === loginEmail && users[user].password === loginPassword) {
      return users[user].id;
    }
  }
  return false;
};

const urlsForUser = function(userID) {
  let userURLs = {};
  for (const url in urlDatabase) {
    if (urlDatabase[url].userID === userID) {
      userURLs[url] = urlDatabase[url].longURL;
    }
  }
  return userURLs;
};

const checkEmail = function(regEmail) {
  for (const user in users) {
    if (users[user].email === regEmail) {
      return true;
    }
  }
  return false;
};

//MIDDLEWARE
app.use(morgan(':method :url :status :response-time ms - :res[content-length]'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.set('view engine', 'ejs');



app.get('/urls', (req, res) => {
  if (req.cookies['user_id']) {
    const userURLs = urlsForUser(req.cookies['user_id']);
    const templateVars = {
      urls: userURLs,
      user: users[req.cookies['user_id']]
    };
    res.render('urls_index', templateVars);
  }
  res.redirect('/login');
});

app.get('/urls/new', (req, res) => {
  if (req.cookies['user_id']) {
    
    const templateVars = {
      urls: urlDatabase,
      user: users[req.cookies['user_id']]
    };
    res.render('urls_new', templateVars);
  }
  res.redirect('/login');
});


app.get('/register', (req, res) => {
  const templateVars = {
    user: users[req.cookies['user_id']]
  };
  res.render('urls_register', templateVars);
});

app.post('/register', (req, res) => {
  if (req.body['email'] === '' || req.body['password'] === '') {
    res.status(400).send('cannot have blank email or password');
  } else if (checkEmail(req.body['email'])) {
    res.status(400).send('email already in use');
  } else {
    const randomID = generateRandomString(8);
    users[randomID] = {
      id: randomID,
      email: req.body['email'],
      password: req.body['password']
    };
    res.cookie('user_id', randomID);
    console.log(users);
    res.redirect('/urls');
  }

});

app.get('/login', (req, res) => {
  const templateVars = {
    user: users[req.cookies['user_id']]
  };
  res.render('urls_login', templateVars);
});

app.post('/login',(req, res) => {
  if (req.body['email'] === '' || req.body['password'] === '') {
    res.status(400).send('cannot have blank email or password');
  } else if (checkEmail(req.body['email'])) {
    const userID = verifyUser(req.body['email'], req.body['password']);
    if (userID) {
      res.cookie('user_id', userID);
      res.redirect('/urls');
    } else {
      res.sendStatus(403);
    }
  } else {
    res.sendStatus(403);
  }
});

// has bug that if url is entered with /urls/blah will allow creation of new entry with that shortURL.....
app.get('/urls/:shortURL', (req, res) => {
  const templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL].longURL,
    user: users[req.cookies['user_id']]
  };
  res.render('urls_show', templateVars);
});


app.post('/logout', (req, res) => {
  res.clearCookie('user_id');
  res.redirect('/login');
});

app.post('/urls', (req, res) => {
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = {
    longURL: req.body.newURL,
    userID: req.cookies['user_id']
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
  if (req.body.longURL === '') {
    res.status(400).send('cannot set empty long URL');
  }
  const newURL = req.body.longURL;
  console.log(!newURL.startsWith('http://'));
  if (!newURL.startsWith('http')) {
    urlDatabase[req.params.id].longURL = `http://${newURL}`;
    res.redirect('/urls');
  } else {
    urlDatabase[req.params.id].longURL = newURL;
    res.redirect('/urls');
  }
});

app.post('/urls/:shortURL/delete', (req, res) => {
  if (req.cookies['user_id']) {
    const urlToDelete = req.params.shortURL;
    console.log(urlToDelete);
    const userURLs = Object.keys(urlsForUser(req.cookies['user_id']));
    if (userURLs.includes(urlToDelete))
      delete urlDatabase[req.params.shortURL];
    res.redirect('/urls');
  } else {
    res.status(401).send('unauthorized to delete this url');
  }
});

app.get('*', (req, res) => {
  res.status(404);
  res.render('urls_404');
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});