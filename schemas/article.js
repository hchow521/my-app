let mongoose = require('mongoose'),
  Schema = mongoose.Schema;

module.exports = new Schema({
  createDate: { type: String, required: true, index: { unique: true }, default: Date.now()},
  author: { type: String, required: true},
  email: { type: String },
  headCover: { type: String, required: true},
  title: { type: String, required: true},
  content: { type: String, required: true},
});