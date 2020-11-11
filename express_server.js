const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const { urlDatabase, users } = require("./data");
const { generateRandomString } = require("./functions");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'));

app.set("view engine", "ejs");

// Displays urlDatabase
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

// REDIRECTS TO URLS
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
  const templateVars = {
    urls: urlDatabase,
    userId: currentUser,
    user: users[currentUser]
  };
  res.render("urls_new", templateVars);
});

// Display new shortURL
app.get("/urls/:shortURL", (req, res) => {
  const currentUser = req.cookies["userId"];
  const templateVars = {
    userId: currentUser,
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
    user: users[currentUser],
  };
  res.render("urls_show", templateVars);
});

// Edit existing shortURL
app.get("/urls/:shortURL/update", (req, res) => {
  const currentUser = req.cookies["userId"];
  const templateVars = {
    userId: currentUser,
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
    user: users[currentUser],
  };
  res.render("urls_show", templateVars);
});

// Redirect to longURL
app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  if (longURL) {
    res.redirect(longURL);
  } else {
    res.status(404).send("Error 404: link not found");
  }
});

// Create new shortURL
app.post("/urls", (req, res) => {
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect(`/urls/${shortURL}`);
});

// Register
app.post('/register', (req, res) => {
  const userId = generateRandomString();
  users[userId] = {
    id: userId, 
    email: req.body.email, 
    password: req.body.password,
   };
  res.cookie('userId', userId);
  res.redirect("/urls");
});

// Login
app.post("/login", (req, res) => {
  res.cookie("userId", req.body.userId);
  res.redirect("/urls");
});

// Logout
app.post("/logout", (req, res) => {
  res.clearCookie("userId");
  res.redirect("/urls");
});

// Updates existing shortURL
app.post("/urls/:shortURL/update", (req, res) => {
  urlDatabase[req.params.shortURL] = req.body.longURL;
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
