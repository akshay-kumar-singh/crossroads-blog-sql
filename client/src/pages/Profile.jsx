import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUserProfile } from "../services/api"; // ✅ imported correctly

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // for better UX
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const data = await getUserProfile(token);

        if (data.id) {
          setUser(data);
        } else {
          localStorage.removeItem("token"); // 🛠 remove invalid token
          navigate("/login");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        localStorage.removeItem("token"); // 🛠 remove invalid token
        navigate("/login");
      } finally {
        setLoading(false); // ✅ stop loading after try/catch is finished
      }
    };

    fetchUserProfile();
  }, [navigate]);

  if (loading) return <div>Loading...</div>; // ✅ show loading only while loading

  if (!user) return <div>No user data found.</div>; // ✅ additional safety

  return (
    <div className="profile-container">
      <h2>Welcome, {user.name}</h2>
      <p>Email: {user.email}</p>
    </div>
  );
};

export default Profile;
