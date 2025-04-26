import axios from "axios";

// 🔹 Set baseURL for all API requests
const apiUrl = "http://localhost:5000";

// 🔹 Axios instance
const API = axios.create({
  baseURL: apiUrl,
});

// 🔒 Attach token automatically if available
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ===============================
// 🔥 AUTH APIs
// ===============================

export const registerUser = async (formData) => {
  try {
    const response = await API.post("/auth/register", formData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Registration failed");
  }
};

export const loginUser = async (credentials) => {
  try {
    const response = await API.post("/auth/login", credentials);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Login failed");
  }
};

export const getUserProfile = async () => {
  try {
    const response = await API.get("/auth/profile");
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch profile");
  }
};

// ===============================
// 🔥 POSTS APIs
// ===============================

export const createPost = async (formData) => {
  try {
    const response = await API.post("/posts", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to create post");
  }
};

export const getAllPosts = async () => {
  try {
    const response = await API.get("/posts");
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch posts");
  }
};

export const getPostById = async (id) => {
  try {
    const response = await API.get(`/posts/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch post");
  }
};

export const updatePost = async (id, formData) => {
  try {
    const response = await API.put(`/posts/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to update post");
  }
};

export const deletePost = async (id) => {
  try {
    const response = await API.delete(`/posts/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to delete post");
  }
};

// ===============================
// 🌟 NEW: MY POSTS API
// ===============================

export const getMyPosts = async () => {
  try {
    const response = await API.get("/posts/user/myposts");
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch your posts");
  }
};
