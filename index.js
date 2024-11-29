const express = require('express');
const multer = require('multer');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const http = require('http');
const socket = require('socket.io');

// Load environment variables
dotenv.config(); 

// Importing the other files
const { signup, login, userinfo } = require('./Controllers/auth');
const { verifyToken } = require('./Middleware/auth');
const UploadPost = require('./Routers/post');
const getUsers = require('./Routers/usersData');
const getSharedPost = require('./Routers/sharedPost');

const app = express();
const server = http.createServer(app);
const io = socket(server, {
  cors: {
    origin: "http://localhost:3000", // Your React app URL
    methods: ["GET", "POST"]
  }
});

app.use(cors({
  origin: "http://localhost:3000", // Your React app URL
  methods: ["GET", "POST"],
  credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/public', express.static(path.join(__dirname, 'public')));

// Store the picture to the assets folder
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'public/assets/');
  },
  filename: function(req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

mongoose.connect('mongodb://localhost:27017/News', {})
  .then(() => {
    console.log("Database connected successfully");

    server.listen(5001, () => {
      console.log("Server listening...");
    });
  })
  .catch((err) => {
    console.log(err);
  });

app.set('socketio', io);

app.post('/auth/signup', upload.single('picture'), signup);
app.post('/auth/login', login);

app.get('/auth/userinfo', verifyToken, userinfo);

app.use('/post', UploadPost);
app.use('/user', getUsers);
app.use('/news', getSharedPost);
