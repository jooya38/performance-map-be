require("dotenv").config();
const mongoose = require("mongoose");
const { Post } = require("./models/Post");
const express = require('express');
const app = express();
const cors = require('cors');
const authRoutes = require('./routes/auth.routes.js');

app.use(express.json());

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

const PORT = process.env.PORT;
const DB_URL = process.env.DB_URL;

mongoose
  .connect(DB_URL)
  .then(() => console.log("MongoDB 연결 성공!"))
  .catch((err) => console.error("MongoDB 연결 실패:", err));


app.post("/api/", async (req, res) => {
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

app.get("/api/", async (req, res) => {
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


app.get("/api/post/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({
        success: false,
        status_code: 404,
        message: "Post not found",
      });
    }

    res.status(200).json({
      success: true,
      status_code: 200,
      data: post,
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


// app.set('db', db);
app.use("/api", authRoutes);

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT} 에서 서버 실행중`)
})