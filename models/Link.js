const mongoose = require('mongoose');

const LinkSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    default: '',
  },
  favicon: {
    type: String,
    default: '',
  },
  summary: {
    type: String,
    default: '',
  },
  tags: {
    type: [String],
    default: [],
  },
  order: {
    type: Number,
    default: 0,
  },
  date: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

module.exports = mongoose.model('Link', LinkSchema);
