import React, { useState } from "react";
import axios from "axios";
import MediaUploader, { type Media } from "./MediaUploader";
import "../../css/CreatePost.css";
import { useAuth } from "../../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL;

interface CreatePostProps {
  refreshFeed?: () => void;
}

const CreatePost: React.FC<CreatePostProps> = ({ refreshFeed }) => {
  const { user } = useAuth();
  const [content, setContent] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !user) return;

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("user_id", user.id.toString());
      formData.append("content", content);

      files.forEach((file) => formData.append("media", file));

      await axios.post(`${API_URL}/api/posts`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setContent("");
      setFiles([]);
      refreshFeed?.();
    } catch (err) {
      console.error("❌ Failed to create post:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        border: "1px solid #ddd",
        padding: "12px",
        marginBottom: "12px",
        borderRadius: "8px",
        background: "#fff",
      }}
    >
      <textarea
        placeholder="What's on your mind?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        style={{
          width: "100%",
          height: "60px",
          marginBottom: "8px",
          padding: "6px",
          borderRadius: "4px",
          border: "1px solid #ccc",
        }}
      />
      <MediaUploader onMediaChange={(_, actualFiles) => setFiles(actualFiles)} />
      <button
        type="submit"
        disabled={loading || !content.trim()}
        style={{
          marginTop: "8px",
          padding: "6px 12px",
          background: loading || !content.trim() ? "#999" : "#007bff",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          cursor: loading || !content.trim() ? "not-allowed" : "pointer",
        }}
      >
        {loading ? "Posting..." : "Post"}
      </button>
    </form>
  );
};

export default CreatePost;
