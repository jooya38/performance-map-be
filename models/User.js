const mongoose = require("mongoose");

// 유저 스키마 정의
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxlength: 50,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
});

// User 모델 생성
const User = mongoose.model("User", userSchema);
module.exports = { User };
