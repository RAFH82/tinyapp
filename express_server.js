const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const { urlDatabase, users } = require("./data");
const { generateRandomString, getUserByEmail, checkIfUserExists } = require("./functions");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'));

app.set("view engine", "ejs");

// Displays urlDatabase
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

// Home
app.get("/", (req, res) => {
  const currentUser = req.cookies["userId"];
  const templateVars = { 
    urls: urlDatabase,
    userId: currentUser,
    user: users[currentUser]
  };
    res.render("urls_index", templateVars);
});

// Home
app.get("/urls", (req, res) => {
  const currentUser = req.cookies["userId"];
  const templateVars = { 
    urls: urlDatabase,
    userId: currentUser,
    user: users[currentUser]
  };
    res.render("urls_index", templateVars);
});

// Login
app.get("/login", (req, res) => {
  const currentUser = req.cookies["userId"];
  const templateVars = { 
    userId: currentUser,
    user: users[currentUser],
  };
  res.render("login", templateVars);
})

// Register
app.get("/register", (req, res) => {
  const currentUser = req.cookies["userId"];
  const templateVars = { 
    userId: currentUser,
  };
  res.render("register", templateVars);
});

// Create new shortURL
app.get("/urls_new", (req, res) => {
  const currentUser = req.cookies["userId"];
  if (currentUser) {
    const templateVars = {
      urls: urlDatabase,
      userId: currentUser,
      user: users[currentUser]
    };
    res.render("urls_new", templateVars);
  } else {
    res.redirect("/login");
  }
});

// Edit existing shortURL
app.get("/urls/:shortURL/update", (req, res) => {
  const currentUser = req.cookies["userId"];
  const templateVars = {
    userId: currentUser,
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL]['longURL'],
    user: users[currentUser],
  };
  res.render("urls_show", templateVars);
});

// Display new shortURL
app.get("/urls/:shortURL", (req, res) => {
  const currentUser = req.cookies["userId"];
  const templateVars = {
    userId: currentUser,
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL]['longURL'],
    user: users[currentUser],
  };
  res.render("urls_show", templateVars);
});

// Redirect to longURL
app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL]['longURL'];
    res.redirect(longURL);
});

// Create new shortURL
app.post("/urls", (req, res) => {
  const shortURL = generateRandomString();
  const currentUser = req.cookies["userId"]
  urlDatabase[shortURL] = { longURL: req.body.longURL, userId: currentUser };
  res.redirect(`/urls/${shortURL}`);
});

// Register
app.post('/register', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  if (!email || !password) {
    return res.status(400).send('Please enter a valid email/password');
  } else { 
    const userExists = checkIfUserExists(users, email);
    if (userExists) {
      return res.status(302).send('User/Password already exists');
    } else if (!userExists) {
      const userId = generateRandomString();
      const id = userId;
      users[userId] = { id, email, password, };
      res.cookie('userId', userId);
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
    if (Object.keys(userInfo).length > 0) {
      if (password === userInfo['password']) {
        res.cookie("userId", userInfo['id']);
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
  res.clearCookie("userId");
  res.redirect("/login");
});

// Updates existing shortURL
app.post("/urls/:shortURL/update", (req, res) => {
  urlDatabase[req.params.shortURL]['longURL'] = req.body.longURL;
  res.redirect("/urls");
});

// Deletes existing shortURL
app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls");
});

app.listen(PORT, () => {
  console.log(`TinyApp listening on port ${PORT}!`);
});
