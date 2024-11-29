const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  picture: String,
  discription: String,
  likes: { type: Number, default: 0 },
  likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

const Posts = mongoose.model('Posts', postSchema);

module.exports = { Posts };
