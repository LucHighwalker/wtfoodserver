function getOne(Model, id, populates = []) {
  return new Promise((resolve, reject) => {
    switch (populates.length) {
      case 0:
        Model.findById(id, (error, response) => {
          if (error) {
            reject(error);
          } else {
            resolve(response);
          }
        });
        break;

      case 1:
        Model.findById(id)
          .populate(populates[0])
          .exec((error, response) => {
            if (error) {
              reject(error);
            } else {
              resolve(response);
            }
          });
        break;

      case 2:
        Model.findById(id)
          .populate(populates[0])
          .populate(populates[1])
          .exec((error, response) => {
            if (error) {
              reject(error);
            } else {
              resolve(response);
            }
          });
        break;

      case 3:
        Model.findById(id)
          .populate(populates[0])
          .populate(populates[1])
          .populate(populates[2])
          .exec((error, response) => {
            if (error) {
              reject(error);
            } else {
              resolve(response);
            }
          });
        break;

      default:
        reject('too many populates');
    }
  });
}

function find(Model, search = {}) {
  return new Promise((resolve, reject) => {
    const query = search;
    Model.find(query, (error, response) => {
      if (error) {
        reject(error);
      } else if (response.length > 1) {
        resolve(response);
      } else {
        resolve(response[0]);
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

function update(Model, id, data) {
  return new Promise((resolve, reject) => {
    Model.update(
      {
        _id: id
      },
      data,
      (error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      }
    );
  });
}

function del(Model, id) {
  return new Promise((resolve, reject) => {
    Model.deleteOne(
      {
        _id: id
      },
      (error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      }
    );
  });
}

module.exports = {
  getOne,
  find,
  save,
  update,
  del
};
