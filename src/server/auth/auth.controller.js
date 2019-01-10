const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../database/database.controller');
const UserModel = require('../models/user');

function comparePassword(password, hashedPass) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, hashedPass, (err, isMatch) => {
      if (err) {
        reject(err);
      } else {
        resolve(isMatch);
      }
    });
  });
}

function getUser(token, model = false) {
  return new Promise((resolve, reject) => {
    let decodedToken = null;
    if (token !== undefined && token !== '') {
      decodedToken = jwt.decode(token);
      UserModel.findOne({
        _id: decodedToken._id
      })
        .populate('menus')
        .exec((err, resp) => {
          if (err) {
            reject(err);
          } else if (!model) {
            resolve({
              email: resp.email,
              menus: resp.menus,
              _id: resp._id
            });
          } else {
            resolve(resp);
          }
        });
    } else {
      resolve(null);
    }
  });
}

function login(email, password) {
  return new Promise((resolve, reject) => {
    UserModel.findOne(
      {
        email
      },
      (err, user) => {
        if (err) {
          reject(err);
        } else if (!user) {
          reject('incorrect');
        } else {
          comparePassword(password, user.password)
            .then((match) => {
              if (match) {
                resolve(user);
              } else {
                reject('incorrect');
              }
            })
            .catch((error) => {
              reject(error);
            });
        }
      }
    );
  });
}

function signup(userData) {
  return new Promise((resolve, reject) => {
    const newUser = new UserModel(userData);
    db.save(newUser)
      .then((user) => {
        resolve(user);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

module.exports = {
  comparePassword,
  getUser,
  login,
  signup
};
