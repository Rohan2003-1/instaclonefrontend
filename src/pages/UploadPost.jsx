import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const UploadPost = () => {
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      toast.error("Please select an image");
      return;
    }

    setLoading(true);

    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("image", image);
    formData.append("caption", caption);

    try {
      await axios.post("http://localhost:8000/api/v1/post", formData, {
        headers: {
          token: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Post uploaded!");
      navigate("/");

    } catch (error) {
      toast.error(error.response?.data?.message || "Upload failed");
    }

    setLoading(false);
  };

  return (
    <div className="d-flex justify-content-center" style={{ padding: "30px 16px" }}>
      <div className="upload-card">
        <h5 className="mb-4" style={{ color: "var(--text)", fontWeight: 600 }}>
          Create New Post
        </h5>

        <form onSubmit={handleSubmit}>
          {/* image preview */}
          {preview ? (
            <div className="mb-3 text-center">
              <img
                src={preview}
                alt="preview"
                style={{ width: "100%", maxHeight: 350, objectFit: "cover", borderRadius: 8 }}
              />
            </div>
          ) : (
            <div
              className="mb-3 d-flex justify-content-center align-items-center"
              style={{
                height: 200,
                border: "2px dashed var(--border)",
                borderRadius: 8,
                color: "var(--text-muted)",
                cursor: "pointer",
              }}
              onClick={() => document.getElementById("imageInput").click()}
            >
              <div className="text-center">
                <div style={{ fontSize: "2rem" }}>📷</div>
                <p className="mb-0" style={{ fontSize: "0.9rem" }}>Click to select photo</p>
              </div>
            </div>
          )}

          <input
            id="imageInput"
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleImageChange}
          />

          {!preview && (
            <button
              type="button"
              className="btn btn-outline-secondary w-100 mb-3"
              onClick={() => document.getElementById("imageInput").click()}
            >
              Select Photo
            </button>
          )}

          {preview && (
            <button
              type="button"
              className="btn btn-outline-secondary w-100 mb-3"
              onClick={() => { setImage(null); setPreview(null); }}
            >
              Change Photo
            </button>
          )}

          <div className="mb-3">
            <textarea
              className="form-control auth-input"
              placeholder="Write a caption..."
              rows={3}
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              style={{ resize: "none" }}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={loading}
          >
            {loading ? "Uploading..." : "Share Post"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadPost;
