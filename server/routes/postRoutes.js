// routes/postRoutes.js
const express = require('express');
const router = express.Router();
const {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
  getMyPosts,
} = require('../controllers/postController');
const verifyToken = require('../middleware/verifyToken');
const upload = require('../middleware/multer'); // for image upload

router.post('/', verifyToken, upload.single('coverImage'), createPost);
router.get('/', getAllPosts);
router.get('/:id', getPostById);
router.put('/:id', verifyToken, upload.single('coverImage'), updatePost);
router.delete('/:id', verifyToken, deletePost);
router.get("/user/myposts",verifyToken,getMyPosts);

module.exports = router;
