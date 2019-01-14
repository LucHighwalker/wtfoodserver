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

function getPermissions(menuId) {
  return new Promise((resolve, reject) => {
    db.getOne(MenuModel, menuId, ['permissions'])
      .then((menu) => {
        resolve({
          _id: menuId,
          menuName: menu.menuName,
          permissions: menu.permissions
        });
      })
      .catch((error) => {
        reject(error);
      });
  });
}

function saveMenu(token, menu) {
  return new Promise((resolve, reject) => {
    auth
      .getUser(token, true)
      .then((user) => {
        if (menu._id) {
          editMenu(user, menu)
            .then((menuUpdate) => {
              resolve(menuUpdate);
            })
            .catch((error) => {
              reject(error);
            });
        } else {
          newMenu(user, menu)
            .then((menuNew) => {
              resolve(menuNew);
            })
            .catch((error) => {
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

    if (hasPermission(user, menu)) {
      db.update(MenuModel, menu._id, {
        menuName: menu.menuName,
        dates: menu.dates,
        permissions: menu.permissions,
        body: menu.body,
        updatedAt: now,
        editedBy: {
          email: user.email,
          _id: user._id
        }
      })
        .then(() => {
          resolve(menu);
        })
        .catch((error) => {
          reject(error);
        });
    } else {
      reject('no permission');
    }
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

// Helpers

function hasPermission(user, menu) {
  // TODO: Why is createdBy._id read as a string?
  if (user._id.toString() === menu.createdBy._id) {
    return true;
  }

  /* eslint-disable consistent-return */
  menu.editPermission.forEach((id) => {
    if (user._id === id) {
      return true;
    }
  });
  /* eslint-enable consistent-return */

  return false;
}

module.exports = {
  getMenu,
  getPermissions,
  saveMenu
};
