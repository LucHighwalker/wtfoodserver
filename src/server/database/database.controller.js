function getOne(Model, id) {
  return new Promise((resolve, reject) => {
    Model.findById(id, (error, response) => {
      if (error) {
        reject(error);
      } else {
        resolve(response);
      }
    });
  });
}

function getAll(Model, search = {}) {
  return new Promise((resolve, reject) => {
    const query = search;
    Model.find(query, (error, response) => {
      if (error) {
        reject(error);
      } else {
        resolve(response);
      }
    });
  });
}

function save(model) {
  return new Promise((resolve, reject) => {
    const Model = model;
    const now = new Date();
    Model.updatedAt = now;
    if (!Model.createdAt) {
      Model.createdAt = now;
    }

    Model.save((error) => {
      if (error) {
        reject(error);
      } else {
        resolve(Model);
      }
    });
  });
}

function del(Model, id) {
  return new Promise((resolve, reject) => {
    Model.deleteOne({
      _id: id
    }, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}


module.exports = {
  getOne,
  getAll,
  save,
  del
};
