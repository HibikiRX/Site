require('dotenv').config();
const express = require('express');
const multer = require('multer');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const session = require('express-session');
const app = express();

const upload = multer({ dest: 'uploads/' });

const db = new sqlite3.Database('./db/messages.db');
db.serialize(() => {
  db.run("CREATE TABLE IF NOT EXISTS messages (id INTEGER PRIMARY KEY, content TEXT, image TEXT, date TEXT)");
});

app.use(session({
  secret: process.env.SESSION_SECRET || 'motsecretchelou',
  resave: false,
  saveUninitialized: true
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

function checkAuth(req, res, next) {
  if (req.session.loggedIn) next();
  else res.redirect('/login');
}

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

app.post('/login', (req, res) => {
  if (req.body.password === process.env.ACCESS_PASSWORD) {
    req.session.loggedIn = true;
    res.redirect('/');
  } else {
    res.send("Mot de passe incorrect.");
  }
});

app.get('/', checkAuth, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/post', checkAuth, upload.single('image'), (req, res) => {
  const content = req.body.message || '';
  const image = req.file ? req.file.filename : null;
  const date = new Date().toISOString();
  db.run("INSERT INTO messages (content, image, date) VALUES (?, ?, ?)", [content, image, date]);
  res.redirect('/');
});

app.get('/messages', checkAuth, (req, res) => {
  db.all("SELECT * FROM messages ORDER BY date DESC", [], (err, rows) => {
    res.json(rows);
  });
});

app.listen(3000, () => console.log("✅ Serveur sur http://localhost:3000"));