import { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import { FiHeart, FiTrash2, FiEdit2, FiSend } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";

const AllPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState({});

  // edit modal state
  const [editPostId, setEditPostId] = useState(null);
  const [editCaption, setEditCaption] = useState("");

  // get logged in userId from token
  const token = localStorage.getItem("token");
  let userId = null;
  if (token) {
    const decoded = jwtDecode(token);
    userId = decoded.id;
  }

  const fetchAllPosts = async () => {
    try {
      const res = await axios.get("https://instaclonebackend-1.onrender.com/api/v1/posts", {
        headers: { token: `Bearer ${token}` },
      });
      setPosts(res.data);
      setLoading(false);
    } catch (error) {
      console.log(error.response?.data);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllPosts();
  }, []); // eslint-disable-line

  // like / unlike
  const handleLike = async (postId) => {
    try {
      const res = await axios.post(
        `https://instaclonebackend-1.onrender.com/api/v1/${postId}/likes`,
        {},
        { headers: { token: `Bearer ${token}` } }
      );

      // update state directly - no full refetch
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId ? { ...post, likes: res.data.likes } : post
        )
      );
    } catch (error) {
      console.log(error.response?.data);
    }
  };

  // add comment
  const handleAddComment = async (postId) => {
    const text = commentText[postId];
    if (!text || text.trim() === "") return;

    try {
      const res = await axios.post(
        `https://instaclonebackend-1.onrender.com/api/v1/comment/${postId}`,
        { text },
        { headers: { token: `Bearer ${token}` } }
      );

      // add comment directly to state
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId
            ? { ...post, comments: [...(post.comments || []), res.data.comment] }
            : post
        )
      );

      setCommentText({ ...commentText, [postId]: "" });

    } catch (error) {
      console.log(error.response?.data);
      toast.error("Failed to add comment");
    }
  };

  // delete comment
  const handleDeleteComment = async (commentId, postId) => {
    try {
      await axios.delete(`https://instaclonebackend-1.onrender.com/api/v1/comment/${commentId}`, {
        headers: { token: `Bearer ${token}` },
      });

      // remove comment from state
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId
            ? { ...post, comments: post.comments.filter((c) => c._id !== commentId) }
            : post
        )
      );

    } catch (error) {
      console.log(error.response?.data);
      toast.error("Failed to delete comment");
    }
  };

  // delete post
  const handleDeletePost = async (postId) => {
    if (!window.confirm("Delete this post?")) return;

    try {
      await axios.delete(`https://instaclonebackend-1.onrender.com/api/v1/post/${postId}`, {
        headers: { token: `Bearer ${token}` },
      });

      setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
      toast.success("Post deleted!");

    } catch (error) {
      console.log(error.response?.data);
      toast.error("Failed to delete post");
    }
  };

  // open edit modal
  const handleOpenEdit = (post) => {
    setEditPostId(post._id);
    setEditCaption(post.caption);
  };

  // save edited caption
  const handleEditSave = async () => {
    try {
      await axios.put(
        `https://instaclonebackend-1.onrender.com/api/v1/post/${editPostId}`,
        { caption: editCaption },
        { headers: { token: `Bearer ${token}` } }
      );

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === editPostId ? { ...post, caption: editCaption } : post
        )
      );

      setEditPostId(null);
      toast.success("Caption updated!");

    } catch (error) {
      console.log(error.response?.data);
      toast.error("Failed to update");
    }
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
      <div style={{ width: "100%", maxWidth: 470 }}>

        {posts.length === 0 && (
          <p className="text-center" style={{ color: "var(--text-muted)" }}>
            No posts yet. Be the first to post! 📸
          </p>
        )}

        {posts.map((post) => {
          const isLiked = post.likes?.some((l) => l === userId || l?._id === userId);
          const isMyPost = post.author?._id === userId;

          return (
            <div key={post._id} className="post-card">

              {/* Post header */}
              <div className="post-card-header">
                {post.author?.profilePic ? (
                  <img
                    src={post.author.profilePic}
                    alt="pic"
                    className="profile-pic-sm me-2"
                  />
                ) : (
                  <div className="avatar-fallback me-2">
                    {post.author?.username?.[0]?.toUpperCase()}
                  </div>
                )}

                <span style={{ fontWeight: 600, fontSize: "0.9rem", flex: 1 }}>
                  {post.author?.username || "Unknown"}
                </span>

                {/* show edit and delete only for post owner */}
                {isMyPost && (
                  <div className="d-flex gap-2">
                    <button
                      className="icon-btn"
                      onClick={() => handleOpenEdit(post)}
                      title="Edit caption"
                    >
                      <FiEdit2 size={17} />
                    </button>
                    <button
                      className="icon-btn"
                      onClick={() => handleDeletePost(post._id)}
                      title="Delete post"
                      style={{ color: "#ed4956" }}
                    >
                      <FiTrash2 size={17} />
                    </button>
                  </div>
                )}
              </div>

              {/* Post image */}
              <img src={post.image} alt="post" className="post-image" />

              {/* Like button */}
              <div className="post-actions">
                <button className="icon-btn" onClick={() => handleLike(post._id)}>
                  {isLiked ? (
                    <FaHeart size={24} className="heart-liked" />
                  ) : (
                    <FiHeart size={24} className="heart-unliked" />
                  )}
                </button>
              </div>

              {/* Likes count */}
              <div className="post-likes">
                {post.likes?.length || 0} {post.likes?.length === 1 ? "like" : "likes"}
              </div>

              {/* Caption */}
              {post.caption && (
                <div className="post-caption">
                  <strong>{post.author?.username}</strong> {post.caption}
                </div>
              )}

              {/* Comments list */}
              <div className="comments-section mt-2">
                {post.comments && post.comments.length > 0 ? (
                  post.comments.map((c) => (
                    <div key={c._id} className="comment-item">
                      <span>
                        <strong>{c.user?.username}: </strong>
                        {c.text}
                      </span>

                      {/* delete comment - only comment owner */}
                      {c.user?._id === userId && (
                        <button
                          className="icon-btn ms-2"
                          style={{ color: "#ed4956", fontSize: "0.75rem" }}
                          onClick={() => handleDeleteComment(c._id, post._id)}
                        >
                          <FiTrash2 size={13} />
                        </button>
                      )}
                    </div>
                  ))
                ) : (
                  <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", margin: "8px 0" }}>
                    No comments yet
                  </p>
                )}
              </div>

              {/* Add comment box */}
              <div className="add-comment-box">
                <input
                  type="text"
                  placeholder="Add a comment..."
                  value={commentText[post._id] || ""}
                  onChange={(e) =>
                    setCommentText({ ...commentText, [post._id]: e.target.value })
                  }
                  onKeyDown={(e) => e.key === "Enter" && handleAddComment(post._id)}
                />
                <button
                  className="icon-btn"
                  onClick={() => handleAddComment(post._id)}
                  style={{ color: "#0095f6" }}
                >
                  <FiSend size={18} />
                </button>
              </div>

            </div>
          );
        })}

        {/* Edit caption modal */}
        {editPostId && (
          <div
            style={{
              position: "fixed", inset: 0,
              background: "rgba(0,0,0,0.5)",
              display: "flex", alignItems: "center", justifyContent: "center",
              zIndex: 999,
            }}
            onClick={() => setEditPostId(null)}
          >
            <div
              style={{
                background: "var(--card-bg)",
                border: "1px solid var(--border)",
                borderRadius: 12,
                padding: 24,
                width: "90%",
                maxWidth: 400,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <h6 style={{ color: "var(--text)", marginBottom: 16 }}>Edit Caption</h6>
              <textarea
                className="form-control edit-input mb-3"
                rows={3}
                value={editCaption}
                onChange={(e) => setEditCaption(e.target.value)}
                style={{ resize: "none" }}
              />
              <div className="d-flex gap-2">
                <button className="btn btn-primary flex-fill" onClick={handleEditSave}>
                  Save
                </button>
                <button
                  className="btn btn-outline-secondary flex-fill"
                  onClick={() => setEditPostId(null)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AllPosts;
