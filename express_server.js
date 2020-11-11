const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const { urlDatabase, users } = require("./data");
const { generateRandomString } = require("./functions");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.set("view engine", "ejs");

// GET If typed by mistake, redirect to url_index
app.get("/", (req, res) => {
  const templateVars = { 
  urls: urlDatabase,
  userId: req.cookies["userId"],
  users: users};
  res.render("urls_index", templateVars);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

// GET default urls from Database object
app.get("/urls", (req, res) => {
  const templateVars = { 
    urls: urlDatabase,
    userId: req.cookies["userId"],
    users: users
  };
  res.render("urls_index", templateVars);
});

// GET register new user
app.get("/register", (req, res) => {
  const templateVars = { 
    urls: urlDatabase,
    userId: req.cookies["userId"],
    users: users
  };
  res.render("register", templateVars);
});

// GET create new shortURL
app.get("/urls_new", (req, res) => {
  const templateVars = { 
  userId: req.cookies["userId"],
   users: users,
  };
  res.render("urls_new", templateVars);
});

// GET shows newly created shortURL
app.get("/urls/:shortURL", (req, res) => {
  const templateVars = {
    userId: req.cookies["userId"],
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
    users: users,
  };
  res.render("urls_show", templateVars);
});

// GET edit existing shortURL
app.get("/urls/:shortURL/update", (req, res) => {
  const templateVars = {
    userId: req.cookies["userId"],
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
    users: users,
  };
  res.render("urls_show", templateVars);
});

// GET redirect to longURL
app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  if (longURL) {
    res.redirect(longURL);
  } else {
    res.status(404).send("Error 404: link not found");
  }
});

// POST generates new shortURL
app.post("/urls", (req, res) => {
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect(`/urls/${shortURL}`);
});

// POST new user's object to users object
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

// POST username and assigns it to a cookie
app.post("/login", (req, res) => {
  res.cookie("userId", req.body.userId);
  res.redirect("/urls");
});

// POST logout username
app.post("/logout", (req, res) => {
  res.clearCookie("userId");
  res.redirect("/urls");
});

// POST updates existing shortURL
app.post("/urls/:shortURL/update", (req, res) => {
  urlDatabase[req.params.shortURL] = req.body.longURL;
  res.redirect("/urls");
});

// POST deletes existing shortURL
app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls");
});

app.listen(PORT, () => {
  console.log(`TinyApp listening on port ${PORT}!`);
});
