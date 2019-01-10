const MenuModel = require('../models/menu');
const auth = require('../auth/auth.controller');
const db = require('../database/database.controller');

function getMenu(menuId) {
  return new Promise((resolve, reject) => {
    db.getOne(MenuModel, menuId)
      .then((menu) => {
        resolve(menu);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

function saveMenu(token, menu) {
  return new Promise((resolve, reject) => {
    auth
      .getUser(token)
      .then((user) => {
        if (menu._id) {
          editMenu(user, menu).then((menuUpdate) => {
            resolve(menuUpdate);
          }).catch((error) => {
            reject(error);
          });
        } else {
          newMenu(user, menu).then((menuNew) => {
            resolve(menuNew);
          }).catch((error) => {
            reject(error);
          });
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
}

function editMenu(user, menu) {
  return new Promise((resolve, reject) => {
    const now = new Date();

    db.update(MenuModel, menu._id, {
      body: menu.body,
      updatedAt: now,
      editedBy: {
        email: user.email,
        _id: user._id
      }
    }).then(() => {
      resolve(menu);
    }).catch((error) => {
      reject(error);
    });
  });
}

function newMenu(user, menuNew) {
  return new Promise((resolve, reject) => {
    const menu = new MenuModel(menuNew);

    menu.createdBy.email = user.email;
    menu.createdBy._id = user._id;

    menu.editedBy.email = user.email;
    menu.editedBy._id = user._id;

    try {
      db.save(menu)
        .then(() => {
          user.menus.unshift(menu);
          db.save(user)
            .then(() => {
              resolve(menu);
            })
            .catch((error) => {
              reject(error);
            });
        })
        .catch((error) => {
          reject(error);
        });
    } catch (error) {
      reject(error);
    }
  });
}

module.exports = {
  getMenu,
  saveMenu
};
