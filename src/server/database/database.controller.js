function getOne(Model, id, populates = []) {
  return new Promise((resolve, reject) => {
    if (populates.length > 0) {
      let pops = '';

      for (let i = 0; i < populates.length; i += 1) {
        if (populates[i].length > 10) {
          reject(`populate string too long: ${populates[i]}`);
        }
        pops = `${pops}.populate(${populates[i]})`;
      }

      const expression = `Model.findById(id)
                          ${pops}
                          .exec((error, response) => {
                            if (error) {
                              reject(error);
                            } else {
                              resolve(response);
                            }
                          });`;

      eval(expression); // eslint-disable-line
    } else {
      Model.findById(id, (error, response) => {
        if (error) {
          reject(error);
        } else {
          resolve(response);
        }
      });
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
