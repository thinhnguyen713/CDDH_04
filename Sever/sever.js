const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "music_app",
});

db.connect((err) => {
  if (err) throw err;
  console.log("Connected to MySQL database");
});

app.get("/comments/:songId", (req, res) => {
  const songId = req.params.songId;
  const query = "SELECT * FROM comments WHERE songId = ? ORDER BY createdAt DESC";
  db.query(query, [songId], (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

app.post("/comments", (req, res) => {
  const { songId, userId, content } = req.body;
  const query = "INSERT INTO comments (songId, userId, content) VALUES (?, ?, ?)";
  db.query(query, [songId, userId, content], (err, result) => {
    if (err) throw err;
    res.json({ id: result.insertId, songId, userId, content });
  });
});

app.post("/comments/like/:id", (req, res) => {
  const commentId = req.params.id;
  const query = "UPDATE comments SET likes = likes + 1 WHERE id = ?";
  db.query(query, [commentId], (err, result) => {
    if (err) throw err;
    res.json({ message: "Liked!" });
  });
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
