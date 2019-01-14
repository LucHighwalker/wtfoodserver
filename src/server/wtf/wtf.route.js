const express = require('express');
const controller = require('./wtf.controller');

const router = express.Router(); // eslint-disable-line new-cap

router.route('/');

router.get('/get/:menuId', (req, res) => {
  const menuId = req.params.menuId;
  controller.getMenu(menuId).then((menu) => {
    res.json({
      get: 'success',
      menu
    });
  }).catch((error) => {
    res.json({
      get: 'fail',
      error
    });
  });
});

router.get('/getperm/:menuId', (req, res) => {
  const menuId = req.params.menuId;
  controller.getPermissions(menuId).then((permObj) => {
    res.json({
      get: 'success',
      permObj
    });
  }).catch((error) => {
    res.json({
      get: 'fail',
      error
    });
  });
});

router.post('/save', (req, res) => {
  const token = req.body.token ? req.body.token : null;
  const menu = req.body.menu ? req.body.menu : null;
  if (token !== null && menu !== null) {
    controller
      .saveMenu(token, menu)
      .then(() => {
        // res.sendStatus(200);
        res.json({
          save: 'success',
          menu
        });
      })
      .catch((error) => {
        // res.sendStatus(422);
        res.json({
          save: 'fail',
          error
        });
      });
  } else {
    // res.sendStatus(401);
    res.json({
      save: 'fail',
      error: token === null ? 'missing token' : 'missing menu'
    });
  }
});

// #TODO: Implement thing.route.js.

module.exports = router;
