const express = require('express');
const cors = require('cors');
require('dotenv').config();
const bodyParser = require('body-parser');
const path = require('path'); // ✅ Import path module

const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes'); // if exists

const app = express();

// ✅ MIDDLEWARE FIRST
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ ROUTES AFTER MIDDLEWARE
app.use('/auth', authRoutes);
app.use('/posts', postRoutes);

// ✅ SERVER
app.listen(5000, () => {
  console.log('Server running on port 5000');
});
