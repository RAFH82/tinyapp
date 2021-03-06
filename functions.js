// Generates random 6 digit string for userId
function generateRandomString() {
  let text = "";
  const sourceArr = [
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
    "z",
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
  ];
  for (let i = 0; i < 7; i++) {
    text += sourceArr[Math.floor(Math.random() * sourceArr.length)];
  }
  return text;
}

// Returns User object from Users database
function getUserByEmail(users, email) {
  let returnUser = {};
  for (let key of Object.keys(users)) {
    if (users[key]["email"] === email) {
      returnUser = users[key];
      return returnUser;
    }
  }
  return undefined;
}

function checkIfUserExists(users, email) {
  for (let key of Object.keys(users)) {
    if (users[key]["email"] === email) {
      return true;
    }
  }
  return false;
}

function getUrlsById(urlDatabase, userId) {
  let returnObject = {};
  for (let url in urlDatabase) {
    if (urlDatabase[url]["userId"] === userId) {
      returnObject[url] = {
        longURL: urlDatabase[url]["longURL"],
        userId: urlDatabase[url]["userId"],
      };
    }
  }
  return returnObject;
}

module.exports = {
  generateRandomString,
  getUserByEmail,
  checkIfUserExists,
  getUrlsById,
};
