require('dotenv').config();

const express = require('express')
const app = express();
const cors = require('cors');
const authRoutes = require('./routes/auth.routes.js')

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const PORT = process.env.PORT;
let connectDB = require('./database.js');

let db

connectDB.then((client)=>{
  console.log('DB연결성공');
  db = client.db('forum');
  app.listen(PORT, () => {
    console.log(`http://localhost:${PORT} 에서 서버 실행중`)
  });
}).catch((err)=>{
  console.log(err);
});

app.use("/api", authRoutes);