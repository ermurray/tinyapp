//helper functions for express_server.js
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
  getUserByEmail,
  urlsForUser,
  checkEmail
};