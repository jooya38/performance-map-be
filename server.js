require('dotenv').config();

const express = require('express')
const app = express()

const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb')

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const PORT = 8080;
const DB_URL = process.env.DB_URL; 

let db
const url = process.env.DB_URL
new MongoClient(url).connect().then((client)=>{
  console.log('DB연결성공')
  db = client.db('forum')
}).catch((err)=>{
  console.log(err)
})

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT} 에서 서버 실행중`)
})