//API 라우터들(회원가입, 로그인 API 라우트 관련)
const express = require('express');
const { signup, signin } = require('../controllers/auth.controller.js');

const router = express.Router();

router.post("/signup", signup); //회원가입
router.post("/signin", signin);  //로그인

module.exports = router;
