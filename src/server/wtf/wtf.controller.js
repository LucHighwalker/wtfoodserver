const MenuModel = require('../models/menu');
const UserModel = require('../models/user.js');
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
    db.getOne(MenuModel, menuId, ['editPermission'])
      .then((menu) => {
        resolve({
          _id: menuId,
          menuName: menu.menuName,
          permissions: menu.editPermission
        });
      })
      .catch((error) => {
        reject(error);
      });
  });
}

function addPermission(token, email, menuId) {
  return new Promise((resolve, reject) => {
    db.find(UserModel, {
      email
    })
      .then((user) => {
        user.permissions.unshift(menuId);
        db.save(user)
          .then(() => {
            db.getOne(MenuModel, menuId).then((menu) => {
              const permissions = menu.editPermission;
              permissions.push(user._id);
              db.update(MenuModel, menu._id, {
                editPermission: permissions
              })
                .then(() => {
                  resolve(menu);
                })
                .catch((error) => {
                  reject(error);
                });
            }).catch((error) => {
              reject(error);
            });
          })
          .catch((error) => {
            reject(error);
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
  const userId = user._id.toString();
  let permission = false;

  if (userId === menu.createdBy._id) {
    permission = true;
  }

  /* eslint-disable consistent-return */
  menu.editPermission.forEach((id) => {
    if (userId === id) {
      permission = true;
    }
  });
  /* eslint-enable consistent-return */

  return permission;
}

module.exports = {
  getMenu,
  getPermissions,
  addPermission,
  saveMenu
};
