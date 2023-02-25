const mongoose = require('mongoose');
const schema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: [true, 'Message is required'],
      maxLength: [200, 'Maximum 200 characters']
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required']
    },
    image: {
      type: String
    },
    song: {
      type: String
    },
    likes: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Post', schema);