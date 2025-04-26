import { useEffect, useState } from "react";
import { getMyPosts, updatePost, deletePost } from "../services/api"; // deletePost imported
import { Link } from "react-router-dom";
import "./MyPosts.css";

function MyPosts() {
  const [myPosts, setMyPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingPostId, setEditingPostId] = useState(null);
  const [editForm, setEditForm] = useState({ title: "", content: "" });

  useEffect(() => {
    const fetchMyPosts = async () => {
      try {
        const posts = await getMyPosts();
        setMyPosts(posts);
      } catch (error) {
        console.error("Error fetching posts:", error);
        alert(error.message || "Failed to load your posts");
      } finally {
        setLoading(false);
      }
    };

    fetchMyPosts();
  }, []);

  const handleEditClick = (post) => {
    setEditingPostId(post.id);
    setEditForm({ title: post.title, content: post.content });
  };

  const handleFormChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("title", editForm.title);
      formData.append("content", editForm.content);
      await updatePost(editingPostId, formData);
      alert("Post updated successfully!");

      const updatedPosts = await getMyPosts();
      setMyPosts(updatedPosts);
      setEditingPostId(null);
    } catch (error) {
      console.error("Error updating post:", error);
      alert(error.message || "Failed to update post");
    }
  };

  const handleDelete = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      await deletePost(postId);
      alert("Post deleted successfully!");
      const updatedPosts = await getMyPosts();
      setMyPosts(updatedPosts);
    } catch (error) {
      console.error("Error deleting post:", error);
      alert(error.message || "Failed to delete post");
    }
  };

  if (loading) {
    return <div className="myposts-container"><p>Loading your posts...</p></div>;
  }

  if (myPosts.length === 0) {
    return <div className="myposts-container"><p>No posts created by you yet!</p></div>;
  }

  return (
    <div className="myposts-container">
      <h2 className="heading">My Posts</h2>
      <div className="myposts-grid">
        {myPosts.map((post) => (
          <div key={post.id} className="mypost-card">
            <div className="image-wrapper">
              <img src={`http://localhost:5000${post.coverImage}`} alt="Cover" />
            </div>
            <div className="content-wrapper">
              {editingPostId === post.id ? (
                <form onSubmit={handleUpdate} className="edit-form">
                  <input
                    type="text"
                    name="title"
                    value={editForm.title}
                    onChange={handleFormChange}
                    placeholder="Title"
                    required
                  />
                  <textarea
                    name="content"
                    value={editForm.content}
                    onChange={handleFormChange}
                    placeholder="Content"
                    rows="4"
                    required
                  />
                  <div className="form-buttons">
                    <button type="submit" className="save-button">Save</button>
                    <button type="button" onClick={() => setEditingPostId(null)} className="cancel-button">Cancel</button>
                  </div>
                </form>
              ) : (
                <>
                  <h3>{post.title}</h3>
                  <p className="preview">{post.content.slice(0, 100)}...</p>
                  <div className="action-buttons">
                    <Link to={`/post/${post.id}`} className="read-more-button">Read More</Link>
                    <button onClick={() => handleEditClick(post)} className="edit-button">Edit</button>
                    <button onClick={() => handleDelete(post.id)} className="delete-button">Delete</button>
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyPosts;
