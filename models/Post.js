const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  place: { type: String, required: true },
  longitude: { type: Number, required: true },
  latitude: { type: Number, required: true },
  image: { type: String, required: true },
  date: { type: String, required: true },
  content: { type: String, required: true },
  like: { type: Number, default: 0 },
  link: { type: String, required: true },
}, { timestamps: true });

const Post = mongoose.model("Post", postSchema);
module.exports = { Post };
