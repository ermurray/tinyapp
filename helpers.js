//helper functions for express_server.js
const generateRandomString = function(length = 6) {
  return Math.random().toString(36).substr(2,length);
  
};

const getUserByEmail = function(loginEmail, database) {
  for (const user in database) {
    if (database[user].email === loginEmail) {
      return database[user].id;
    }
  }
};

const urlsForUser = function(userID, database) {
  let userURLs = {};
  for (const url in database) {
    if (database[url].userID === userID) {
      userURLs[url] = database[url].longURL;
    }
  }
  return userURLs;
};

const checkEmail = function(regEmail, database) {
  for (const user in database) {
    if (database[user].email === regEmail) {
      return true;
    }
  }
  return false;
};

module.exports = {
  generateRandomString,
  getUserByEmail,
  urlsForUser,
  checkEmail
};