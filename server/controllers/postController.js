const db = require("../db");
const path = require("path");

// 🔥 CREATE a new blog post
const createPost = (req, res) => {
  const { title, content } = req.body;
  const userId = req.user.id;
  const coverImage = req.file ? `/uploads/${req.file.filename}` : null;

  const sql = "INSERT INTO posts (title, content, coverImage, userId) VALUES (?, ?, ?, ?)";
  db.query(sql, [title, content, coverImage, userId], (err, result) => {
    if (err) return res.status(500).json({ message: "Failed to create post", error: err });
    res.status(201).json({ message: "Post created successfully", postId: result.insertId });
  });
};

// 🔥 GET all posts with author name and email
const getAllPosts = (req, res) => {
  const sql = `
    SELECT 
      posts.id, posts.title, posts.content, posts.coverImage, posts.createdAt,
      users.id AS authorId, users.name AS authorName, users.email AS authorEmail
    FROM posts
    INNER JOIN users ON posts.userId = users.id
    ORDER BY posts.createdAt DESC
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ message: "Failed to fetch posts", error: err });

    // 🛠 Map neatly into frontend expected structure
    const posts = results.map(post => ({
      id: post.id,
      title: post.title,
      content: post.content,
      coverImage: post.coverImage,
      createdAt: post.createdAt,
      author: {
        id: post.authorId,
        name: post.authorName,
        email: post.authorEmail,
      },
    }));

    res.json(posts);
  });
};

// 🔥 GET a single post by ID
const getPostById = (req, res) => {
  const postId = req.params.id;
  const sql = `
    SELECT 
      posts.id, posts.title, posts.content, posts.coverImage, posts.createdAt,
      users.id AS authorId, users.name AS authorName, users.email AS authorEmail
    FROM posts
    INNER JOIN users ON posts.userId = users.id
    WHERE posts.id = ?
  `;
  db.query(sql, [postId], (err, results) => {
    if (err) return res.status(500).json({ message: "Failed to fetch post", error: err });
    if (results.length === 0) return res.status(404).json({ message: "Post not found" });

    const post = results[0];
    const formattedPost = {
      id: post.id,
      title: post.title,
      content: post.content,
      coverImage: post.coverImage,
      createdAt: post.createdAt,
      author: {
        id: post.authorId,
        name: post.authorName,
        email: post.authorEmail,
      },
    };

    res.json(formattedPost);
  });
};

// 🔥 UPDATE a post
const updatePost = (req, res) => {
  const postId = req.params.id;
  const { title, content } = req.body;
  const userId = req.user.id;
  const coverImage = req.file ? `/uploads/${req.file.filename}` : null;

  // Step 1: Check if post exists and belongs to user
  const checkSql = "SELECT * FROM posts WHERE id = ?";
  db.query(checkSql, [postId], (err, results) => {
    if (err) return res.status(500).json({ message: "Failed to check post", error: err });
    if (results.length === 0) return res.status(404).json({ message: "Post not found" });

    const post = results[0];
    if (post.userId !== userId) return res.status(403).json({ message: "Unauthorized" });

    // Step 2: Update post
    const updateSql = coverImage
      ? "UPDATE posts SET title = ?, content = ?, coverImage = ? WHERE id = ?"
      : "UPDATE posts SET title = ?, content = ? WHERE id = ?";
    const params = coverImage
      ? [title, content, coverImage, postId]
      : [title, content, postId];

    db.query(updateSql, params, (err) => {
      if (err) return res.status(500).json({ message: "Failed to update post", error: err });
      res.json({ message: "Post updated successfully" });
    });
  });
};

// 🔥 DELETE a post
const deletePost = (req, res) => {
  const postId = req.params.id;
  const userId = req.user.id;

  // Step 1: Check if post exists and belongs to user
  const checkSql = "SELECT * FROM posts WHERE id = ?";
  db.query(checkSql, [postId], (err, results) => {
    if (err) return res.status(500).json({ message: "Failed to check post", error: err });
    if (results.length === 0) return res.status(404).json({ message: "Post not found" });

    const post = results[0];
    if (post.userId !== userId) return res.status(403).json({ message: "Unauthorized" });

    // Step 2: Delete post
    const deleteSql = "DELETE FROM posts WHERE id = ?";
    db.query(deleteSql, [postId], (err) => {
      if (err) return res.status(500).json({ message: "Failed to delete post", error: err });
      res.json({ message: "Post deleted successfully" });
    });
  });
};

const getMyPosts = (req, res) => {
  const userId = req.user.id;

  const sql = `
    SELECT 
      posts.id, posts.title, posts.content, posts.coverImage, posts.createdAt,
      users.id AS authorId, users.name AS authorName, users.email AS authorEmail
    FROM posts
    INNER JOIN users ON posts.userId = users.id
    WHERE posts.userId = ?
    ORDER BY posts.createdAt DESC
  `;
  db.query(sql, [userId], (err, results) => {
    if (err) return res.status(500).json({ message: "Failed to fetch your posts", error: err });

    const myPosts = results.map(post => ({
      id: post.id,
      title: post.title,
      content: post.content,
      coverImage: post.coverImage,
      createdAt: post.createdAt,
      author: {
        id: post.authorId,
        name: post.authorName,
        email: post.authorEmail,
      },
    }));

    res.json(myPosts);
  });
};

module.exports = {
  createPost,
  getAllPosts,
  getMyPosts,
  getPostById,
  updatePost,
  deletePost,
};
