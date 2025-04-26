import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CreatePost from "./pages/CreatePost";
import Posts from "./pages/Posts";
import SinglePost from "./pages/SinglePost";
import Navbar from "./components/Navbar";
import Profile from "./pages/Profile";
import MyPosts from "./pages/MyPosts";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Posts />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/create" element={<CreatePost />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/post/:id" element={<SinglePost />} />

        <Route path="/myposts" element={<MyPosts />} />
      </Routes>
    </Router>
  );
}

export default App;
