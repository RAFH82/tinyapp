const { assert } = require('chai');

const { getUserByEmail } = require('../functions.js');

const users = {
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};

describe('getUserByEmail', function() {
  it('should return a user with valid email', function() {
    const user = getUserByEmail(users, "user@example.com")
    const expectedOutput = {
      id: "userRandomID", 
      email: "user@example.com", 
      password: "purple-monkey-dinosaur",
    };
    
    assert.deepEqual(user, expectedOutput);
  });

  it('should return an empty object with an invalid email', function() {
    const user = getUserByEmail(users, "im-not-here@missing.com")
    const expectedOutput = {};
    
    assert.deepEqual(user, expectedOutput);
  });
});