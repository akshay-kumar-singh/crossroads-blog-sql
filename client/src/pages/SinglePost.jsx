import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPostById } from "../services/api"; // ✅ import from services
import "./SinglePost.css";

function SinglePost() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const api = "http://localhost:5000";

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = await getPostById(id); // ✅ fetch post from API
        setPost(data);
      } catch (error) {
        console.error("Error fetching post:", error);
        alert(error.message || "Failed to load post.");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) {
    return <div className="single-post-container"><p>Loading post...</p></div>;
  }

  if (!post) {
    return <div className="single-post-container"><p>Post not found.</p></div>;
  }

  return (
    <div className="single-post-container">
      {post.coverImage && (
        <img
        src={`${api}${post.coverImage}`}
          alt="Cover"
          className="cover-image"
        />
      )}
      <h1>{post.title}</h1>
      <p className="meta">
        by {post.author?.name || "Unknown"} ({post.author?.email || "N/A"}) on{" "}
        {new Date(post.createdAt).toLocaleDateString()}
      </p>
      <div className="post-content">
        <p>{post.content}</p>
      </div>
    </div>
  );
}

export default SinglePost;
