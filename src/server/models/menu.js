const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const menuSchema = new Schema({
  createdBy: {
    email: {
      type: String,
      required: true
    },
    _id: {
      type: Schema.Types.ObjectId,
      required: true
    }
  },
  createdAt: {
    type: Date
  },
  updatedAt: {
    type: Date
  },
  menuName: {
    type: String,
    required: true
  },
  menu: [
  ]
  // categories: [
  //   {
  //     name: {
  //       type: String
  //     },
  //     items: [
  //       {
  //         name: {
  //           type: String,
  //           required: true
  //         },
  //         price: {
  //           type: Number
  //         },
  //         desc: {
  //           type: String
  //         },
  //         main_ingr: [
  //           {
  //             type: String
  //           }
  //         ],
  //         other_ingr: [
  //           {
  //             type: String
  //           }
  //         ]
  //       }
  //     ]
  //   }
  // ]
});

module.exports = mongoose.model('Menu', menuSchema);
