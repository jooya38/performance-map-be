require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { Post } = require("./models/Post");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

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

app.listen(PORT, () => {
  console.log(`🚀 서버 실행 중: http://localhost:${PORT}`);
});


app.get("/", (req, res) => {
  res.send(" 서버가 정상적으로 실행 중입니다!");
});


const { ObjectId } = require("mongodb"); // ObjectId 추가

app.get("/api/post/:id", async (req, res) => {
  try {
    const postId = req.params.id;

    // ObjectId 형식이 아닌 경우 처리
    if (!ObjectId.isValid(postId)) {
      return res.status(400).json({
        success: false,
        status_code: 400,
        message: "Invalid ID format",
      });
    }

    const post = await Post.findById(postId);

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
