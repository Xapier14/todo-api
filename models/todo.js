const mongoose = require('mongoose')

const TodoSchema = mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  contentType: {
    type: String,
    required: true
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
  createdOn: {
    type: Date,
    required: true
  },
  lastModified: {
    type: Date,
    required: true
  }
});

module.exports = mongoose.model('Todo', TodoSchema);