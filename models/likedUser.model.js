const mongoose = require('mongoose');

const schema = new mongoose.Schema(
  {
    from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required']
    },
    to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required']
    },
  }
)

module.exports = mongoose.model('LikedUser', schema);