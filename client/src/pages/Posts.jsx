import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllPosts } from "../services/api"; // ✅ import API function
import "./Posts.css";


function Posts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const apiUrl = "http://localhost:5000";

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await getAllPosts(); // 🔥 fetch posts from server
        setPosts(data);
      } catch (error) {
        console.error("Error fetching posts:", error);
        alert(error.message || "Failed to load posts.");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return <div className="posts-container"><p>Loading posts...</p></div>;
  }

  if (posts.length === 0) {
    return <div className="posts-container"><p>No posts found.</p></div>;
  }

  return (
    <div className="posts-container">
      <h2>All Blog Posts</h2>
      <div className="posts-grid">
        {posts.map((post) => (
          <div key={post._id} className="post-card">
            {post.coverImage && (
              <img
                src={post.coverImage.startsWith("http") 
                  ? post.coverImage 
                  : `${apiUrl}${post.coverImage}`
                }
                alt="Cover"
              />
            )}
            <h3>{post.title}</h3>
            <p>{post.content?.slice(0, 100)}...</p> {/* only a short preview */}
            <small>by {post.author?.name || "Unknown"}</small>
            <Link to={`/post/${post.id}`} className="read-more-button">Read More</Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Posts;
