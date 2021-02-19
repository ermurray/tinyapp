const { assert } = require('chai');
const { getUserByEmail, urlsForUser } = require('../helpers.js');

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

const urlDatabase = {
  'b2xVn2': {longURL:'http://www.lighthouselabs.ca', userID: '1a2b3c'},
  '9sm5xK': {longURL:'http://www.google.com', userID: '1a2b3c'}
};


describe('getUserByEmail', function() {
  it('should return a user with valid email', function() {
    const user = getUserByEmail("example@example.com", users);
    const expectedOutput = "1a2b3c";
    assert.strictEqual(user, expectedOutput);
  });

  it('should return undefined if email does not exist', function() {
    assert.strictEqual(getUserByEmail("blah@dontexist.com", users),);
  });
});

describe('urlsForUser', function() {
  it('should return object containing only urls belonging to that user', function() {
    assert.deepEqual(urlsForUser('1a2b3c', urlDatabase), {
      'b2xVn2': 'http://www.lighthouselabs.ca',
      '9sm5xK': 'http://www.google.com'
    });
  });

  it('should return empty object if no urls stored to user', function() {
    assert.deepEqual(urlsForUser('2b3c4d', urlDatabase), {});
  });

  it('should not return object containing urls belonging to a different user', function() {
    assert.notDeepEqual(urlsForUser('2b3c4d', urlDatabase), {
      'b2xVn2': 'http://www.lighthouselabs.ca',
      '9sm5xK': 'http://www.google.com'
    });
  });
});