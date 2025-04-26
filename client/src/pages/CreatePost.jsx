import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPost } from "../services/api"; // ✅ import from your services/api.js
import "./CreatePost.css"; // optional styling

const CreatePost = () => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    coverImage: null,
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "coverImage") {
      setFormData({ ...formData, coverImage: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const postData = new FormData();
      postData.append("title", formData.title);
      postData.append("content", formData.content);
      if (formData.coverImage) {
        postData.append("coverImage", formData.coverImage);
      }

      await createPost(postData); // ✅ using our service function

      alert("Post created successfully!");
      navigate("/"); // redirect to home
    } catch (error) {
      console.error("Error creating post:", error);
      alert(error.message || "Failed to create post.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-post-container">
      <h2>Create New Post</h2>
      <form onSubmit={handleSubmit} className="create-post-form">
        <input
          type="text"
          name="title"
          placeholder="Post Title"
          value={formData.title}
          onChange={handleChange}
          required
        />

        <textarea
          name="content"
          placeholder="Write your content here..."
          value={formData.content}
          onChange={handleChange}
          required
          rows="8"
        />

        <input
          type="file"
          name="coverImage"
          accept="image/*"
          onChange={handleChange}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Post"}
        </button>
      </form>
    </div>
  );
};

export default CreatePost;
