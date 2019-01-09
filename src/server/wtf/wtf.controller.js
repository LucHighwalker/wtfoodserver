const MenuModel = require('../models/menu');
const auth = require('../auth/auth.controller');
const db = require('../database/database.controller');

function getMenu(menuId) {
  return new Promise((resolve, reject) => {
    db.getOne(MenuModel, menuId).then((menu) => {
      resolve(menu);
    }).catch((error) => {
      reject(error);
    });
  });
}

function saveMenu(token, menu) {
  return new Promise((resolve, reject) => {
    auth
      .getUser(token)
      .then((user) => {
        const newMenu = new MenuModel();

        newMenu.menuName = 'new menu';
        newMenu.createdBy.email = user.email;
        newMenu.createdBy._id = user._id;

        newMenu.menu = menu;

        try {
          db.save(newMenu).then(() => {
            user.menus.unshift(newMenu);
            db.save(user).then(() => {
              resolve(newMenu);
            }).catch((error) => {
              reject(error);
            });
          }).catch((error) => {
            reject(error);
          });
        } catch (error) {
          reject(error);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
}

module.exports = {
  getMenu,
  saveMenu
};
