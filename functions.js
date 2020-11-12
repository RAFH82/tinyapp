// Generates random 6 digit string for userId 
function generateRandomString() {
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
  const indexOne = Math.floor(Math.random() * 63);
  const indexTwo = Math.floor(Math.random() * 63);
  const indexThree = Math.floor(Math.random() * 63);
  const indexFour = Math.floor(Math.random() * 63);
  const indexFive = Math.floor(Math.random() * 63);
  const indexSix = Math.floor(Math.random() * 63);
  let outputStr = `${sourceArr[indexOne]}${sourceArr[indexTwo]}${sourceArr[indexThree]}${sourceArr[indexFour]}${sourceArr[indexFive]}${sourceArr[indexSix]}`;
  return outputStr;
};

// Returns User object from Users database
function getUserByEmail(users, email) {
  let returnUser = {};
  for (let key of Object.keys(users)) {
    if (users[key]['email'] === email) {
      returnUser = users[key];
      return returnUser;
    } 
  }
  return returnUser;
};

function checkIfUserExists(users, email) {
  for (let key of Object.keys(users)) {
    if (users[key]['email'] === email) {
      return true;
    } 
  }
  return false;
};

function getUrlsById(urlDatabase, userId) {
  let returnObject = {};
  for (let url in urlDatabase) {
    if (urlDatabase[url]['userId'] === userId) {
      returnObject[url] = {
        longURL: urlDatabase[url]['longURL'],
        userId: urlDatabase[url]['userId'],
      };
    }
  }
  return returnObject;
};

module.exports = { generateRandomString, getUserByEmail, checkIfUserExists, getUrlsById };