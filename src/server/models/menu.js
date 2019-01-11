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
  editedBy: {
    email: {
      type: String
    },
    _id: {
      type: Schema.Types.ObjectId
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
  dates: {
    begin: {
      type: Date
    },
    end: {
      type: Date
    }
  },
  body: [
    {
      class: { type: String },
      icon: { type: String },
      inputType: { type: String },
      children: [],
      price: { type: Number },
      name: { type: String }
    }
  ]
});

module.exports = mongoose.model('Menu', menuSchema);
