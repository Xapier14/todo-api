const mongoose = require('mongoose')
const TokenSchema = mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  token: {
    type: String,
    required: true
  },
  validity: {
    type: Number,
    required: true
  },
  createdOn: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Token', TokenSchema);