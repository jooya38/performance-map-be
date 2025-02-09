require("dotenv").config();
const mongoose = require("mongoose");
const { Post } = require("./models/Post");
const express = require('express');
const app = express();
const cors = require('cors');
const authRoutes = require('./routes/auth.routes.js');

app.use(express.json());
app.use(cors());
const PORT = process.env.PORT || 3000;

const DB_URL = process.env.DB_URL || "mongodb+srv://ddugel3:0000d@forum.2fril.mongodb.net/?retryWrites=true&w=majority&appName=forum";

mongoose
  .connect(DB_URL)
  .then(() => console.log("MongoDB 연결 성공!"))
  .catch((err) => console.error("MongoDB 연결 실패:", err));


app.post("/api/posts", async (req, res) => {
  try {
    const newPost = new Post(req.body);
    const savedPost = await newPost.save();

    res.status(201).json({
      success: true,
      status_code: 201,
      message: "게시물이 성공적으로 생성되었습니다.",
      data: savedPost,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      status_code: 400,
      message: "Bad Request",
      error: error.message,
    });
  }
});

app.get("/api/posts", async (req, res) => {
  try {
    const posts = await Post.find();

    res.status(200).json({
      success: true,
      status_code: 200,
      data: posts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      status_code: 500,
      message: "Internal Server Error",
      error: error.message,
    });
  }
});

app.set('db', db);
app.use("/api", authRoutes);

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT} 에서 서버 실행중`)
})