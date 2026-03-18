import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FiEdit2 } from "react-icons/fi";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [myPosts, setMyPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [bio, setBio] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [saving, setSaving] = useState(false);

  const token = localStorage.getItem("token");

  const fetchProfile = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/v1/profile", {
        headers: { token: `Bearer ${token}` },
      });
      setUser(res.data);
      setBio(res.data.bio || "");
    } catch (error) {
      console.log(error.response?.data);
    }
  };

  const fetchMyPosts = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/v1/posts", {
        headers: { token: `Bearer ${token}` },
      });

      // filter only my posts
      const { jwtDecode } = await import("jwt-decode");
      const decoded = jwtDecode(token);
      const mine = res.data.filter((p) => p.author?._id === decoded.id);
      setMyPosts(mine);
    } catch (error) {
      console.log(error.response?.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProfile();
    fetchMyPosts();
  }, []); // eslint-disable-line

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSaving(true);

    const formData = new FormData();
    formData.append("bio", bio);
    if (profilePic) {
      formData.append("profilePic", profilePic);
    }

    try {
      const res = await axios.put("http://localhost:8000/api/v1/profile", formData, {
        headers: {
          token: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setUser(res.data.user);
      setEditMode(false);
      toast.success("Profile updated!");

    } catch (error) {
      console.log(error.response?.data);
      toast.error("Update failed");
    }

    setSaving(false);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "60vh" }}>
        <div className="spinner-border" style={{ color: "var(--text)" }} />
      </div>
    );
  }

  return (
    <div className="d-flex justify-content-center" style={{ padding: "24px 16px" }}>
      <div style={{ width: "100%", maxWidth: 600 }}>

        {/* Profile info card */}
        <div className="profile-card mb-4">
          <div className="d-flex align-items-center gap-4 mb-3">

            {/* profile pic */}
            {user?.profilePic ? (
              <img src={user.profilePic} alt="profile" className="profile-pic-lg" />
            ) : (
              <div className="avatar-fallback-lg">
                {user?.username?.[0]?.toUpperCase()}
              </div>
            )}

            <div>
              <h5 style={{ color: "var(--text)", marginBottom: 4 }}>{user?.username}</h5>
              <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", margin: 0 }}>
                {user?.email}
              </p>
              <p style={{ color: "var(--text)", fontSize: "0.9rem", marginTop: 6 }}>
                {user?.bio || "No bio yet"}
              </p>
              <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginTop: 4 }}>
                🗂 {myPosts.length} {myPosts.length === 1 ? "post" : "posts"}
              </p>
            </div>
          </div>

          <button
            className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1"
            onClick={() => setEditMode(!editMode)}
          >
            <FiEdit2 size={14} />
            {editMode ? "Cancel" : "Edit Profile"}
          </button>

          {/* edit form */}
          {editMode && (
            <form onSubmit={handleUpdateProfile} className="mt-3">
              <div className="mb-3">
                <label style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>Bio</label>
                <textarea
                  className="form-control edit-input mt-1"
                  rows={2}
                  placeholder="Write something about yourself..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  style={{ resize: "none" }}
                />
              </div>

              <div className="mb-3">
                <label style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
                  Profile Picture
                </label>
                <input
                  type="file"
                  accept="image/*"
                  className="form-control edit-input mt-1"
                  onChange={(e) => setProfilePic(e.target.files[0])}
                />
              </div>

              <button type="submit" className="btn btn-primary btn-sm" disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </form>
          )}
        </div>

        {/* My posts grid */}
        <h6 style={{ color: "var(--text)", marginBottom: 12 }}>My Posts</h6>

        {myPosts.length === 0 ? (
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
            No posts yet. Share your first photo! 📸
          </p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 4,
            }}
          >
            {myPosts.map((post) => (
              <div key={post._id} style={{ aspectRatio: "1", overflow: "hidden", borderRadius: 4 }}>
                <img
                  src={post.image}
                  alt="my post"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default Profile;
