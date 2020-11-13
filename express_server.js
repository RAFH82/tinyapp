const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bcrypt = require('bcrypt');
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const morgan = require("morgan");
const { urlDatabase, users } = require("./data");
const { generateRandomString, getUserByEmail, checkIfUserExists, getUrlsById } = require("./functions");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieSession({
  name: 'session',
  keys: ["onekey"],
}));
app.use(morgan('dev'));
app.set("view engine", "ejs");

// Displays urlDatabase
// app.get("/urls.json", (req, res) => {
//   res.json(urlDatabase);
// });

// Home
app.get("/", (req, res) => {
  const currentUser = req.session.userId;
  if (currentUser) {
    const userUrls = getUrlsById(urlDatabase, currentUser);
    const templateVars = {
      urls: userUrls,
      userId: currentUser,
      user: users[currentUser]
    };
    res.render("urls_index", templateVars);
  } else { // need this for userId check in _header.ejs partial, otherwise it errors with userId is not defined
    const templateVars = {
      urls: '',
      userId: '',
      user: '',
    };
    res.render("urls_index", templateVars);
  }
});

// Home
app.get("/urls", (req, res) => {
  const currentUser = req.session.userId;
  if (currentUser) {
    const userUrls = getUrlsById(urlDatabase, currentUser);
    const templateVars = {
      urls: userUrls,
      userId: currentUser,
      user: users[currentUser]
    };
    res.render("urls_index", templateVars);
  } else { // need this for userId check in _header.ejs partial, otherwise it errors with userId is not defined
    const templateVars = {
      urls: '',
      userId: '',
      user: '',
    };
    res.render("urls_index", templateVars);
  }
});

// Login
app.get("/login", (req, res) => {
  const currentUser = req.session.userId;
  const templateVars = {
    userId: currentUser,
    user: users[currentUser],
  };
  res.render("login", templateVars);
})

// Register
app.get("/register", (req, res) => {
  const currentUser = req.session.userId;
  if (currentUser) {
    const userUrls = getUrlsById(urlDatabase, currentUser);
    const templateVars = {
      urls: userUrls,
      userId: currentUser,
      user: users[currentUser]
    };
    return res.render("urls_index", templateVars);
  }
  const templateVars = {
    userId: currentUser,
    user: users[currentUser],
  };
  res.render("register", templateVars);
});

// Create new shortURL
app.get("/urls_new", (req, res) => {
  const currentUser = req.session.userId;
  if (currentUser) {
    const templateVars = {
      urls: urlDatabase,
      userId: currentUser,
      user: users[currentUser]
    };
    res.render("urls_new", templateVars);
  } else {
    res.render("Error401");
  }
});

// Display new shortURL
app.get("/urls/:shortURL", (req, res) => {
  const currentUser = req.session.userId;
  const shortURL = req.params.shortURL;
  if (!currentUser) {
    res.render("Error401");
  } if (urlDatabase[req.params.shortURL]) {
    const templateVars = {
      userId: currentUser,
      shortURL: req.params.shortURL,
      longURL: urlDatabase[req.params.shortURL]['longURL'],
      urlUserId: urlDatabase[shortURL]['userId'],
      user: users[currentUser],
    };
    return res.render("urls_show", templateVars);
  } else {
    } res.redirect('Error404');
});

// Redirect to longURL
app.get("/u/:shortURL", (req, res) => {
  // const longURL = urlDatabase[req.params.shortURL]['longURL'];
  if (urlDatabase[req.params.shortURL]) {
    const longURL = urlDatabase[req.params.shortURL]['longURL'];
    res.redirect(longURL);
  } else {
    res.redirect('Error404');
  }
});

// Create new shortURL
app.post("/urls", (req, res) => {
  const currentUser = req.session.userId;
  if (currentUser) {
    const shortURL = generateRandomString();
  urlDatabase[shortURL] = { longURL: req.body.longURL, userId: currentUser };
  res.redirect(`/urls/${shortURL}`);
  } else {
    return res.render("Error401");
  }
});

// Register
app.post('/register', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const hashedPassword = bcrypt.hashSync(password, 10);
  if (!email || !password) {
    return res.status(400).send('Please enter a valid email/password');
  } else {
    const userExists = checkIfUserExists(users, email);  // returns Boolean
    if (userExists) {
      return res.status(302).send('User/Password already exists');
    } else {
      const userId = generateRandomString();
      console.log("here is the randomString", userId);
      const id = userId;
      users[userId] = { id, email, hashedPassword, };
      console.log("Here is the user", users[userId]);
      req.session.userId = userId;
      console.log("here is the reg.session cookie", req.session.userId);
      res.redirect("/urls");
    }
  }
});

// Login
app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  if (!email || !password) {
    return res.status(400).send('Please enter a valid email/password');
  } else {
    const userInfo = getUserByEmail(users, email);
    if (userInfo) {
      if (bcrypt.compareSync(password, userInfo['hashedPassword'])) {
        req.session.userId = userInfo['id'];
        console.log("here is the login session cookie", req.session.userId);
        res.redirect("/urls");
      } else {
        return res.status(400).send('Please enter a valid email/password');
      }
    } else {
      return res.status(403).send('Email/Password does not exist');
    }
  }
});

// Logout
app.post("/logout", (req, res) => {
  req.session.userId = null;
  res.redirect("urls");
});

// Updates existing shortURL
app.post("/urls/:shortURL/update", (req, res) => {
  // urlDatabase[req.params.shortURL]['longURL'] = req.body.longURL;
  // res.redirect("/urls");
  const currentUser = req.session.userId;
  const shortURL = req.params.shortURL;
  const urlUserId = urlDatabase[shortURL]['userId']
  if (currentUser === urlUserId) {
    urlDatabase[req.params.shortURL]['longURL'] = req.body.longURL;
    res.redirect("/urls");
  } else {
    return res.status(401).send("Error code 401: Unauthorized Access");
  }
});

// Deletes existing shortURL
app.post("/urls/:shortURL/delete", (req, res) => {
  const currentUser = req.session.userId;
  const shortURL = req.params.shortURL;
  const urlUserId = urlDatabase[shortURL]['userId']
  if (currentUser === urlUserId) {
    delete urlDatabase[shortURL];
    res.redirect("/urls");
  } else {
    return res.status(401).send("Error code 401: Unauthorized Access");
  }
});

app.listen(PORT, () => {
  console.log(`TinyApp listening on port ${PORT}!`);
});
