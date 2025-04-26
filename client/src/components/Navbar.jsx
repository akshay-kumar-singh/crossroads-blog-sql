import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./Navbar.css";

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInitial, setUserInitial] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("email"); // assuming you store email

    setIsLoggedIn(!!token);

    if (email) {
      setUserInitial(email.charAt(0).toUpperCase());
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email"); // also remove email if you stored it
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <h2 className="logo">
        <Link to="/">MyBlog</Link>
      </h2>
      <ul className="nav-links">
  <li><Link to="/">Home</Link></li>

  {isLoggedIn ? (
    <>
      <li><Link to="/create">Create Post</Link></li>
      <li><Link to="/myposts">My Posts</Link></li>
      <li className="profile-dropdown">
        <div className="profile-initial">{userInitial}</div>
        <div className="dropdown-menu">
          <Link to="/profile">Profile</Link>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </li>
    </>
  ) : (
    <>
      <li><Link to="/login">Login</Link></li>
      <li><Link to="/register">Register</Link></li>
    </>
  )}
</ul>

    </nav>
  );
  
}

export default Navbar;
