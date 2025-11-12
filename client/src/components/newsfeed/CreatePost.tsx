import React, { useState } from "react";
import axios from "axios";
import MediaUploader from "./MediaUploader"; // handles media selection
import type { Media } from "./MediaUploader"; 
import "../../css/CreatePost.css";
import { useAuth } from "../../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL;

interface CreatePostProps {
  refreshFeed?: () => void;
}

const CreatePost: React.FC<CreatePostProps> = ({ refreshFeed }) => {
  const { user } = useAuth();
  const [content, setContent] = useState("");
  const [media, setMedia] = useState<Media[]>([]);
  const [files, setFiles] = useState<File[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !user) return;

    try {
      const formData = new FormData();
      formData.append("user_id", user.id.toString());
      formData.append("content", content);

      files.forEach((file) => formData.append("media", file));

      await axios.post(`${API_URL}/api/posts`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setContent("");
      setMedia([]);
      setFiles([]);
      refreshFeed?.();
    } catch (err) {
      console.error("❌ Failed to create post:", err);
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
      <MediaUploader
        onMediaChange={(previewMedia, actualFiles) => {
          setMedia(previewMedia);
          setFiles(actualFiles);
        }}
      />
      <button
        type="submit"
        style={{
          marginTop: "8px",
          padding: "6px 12px",
          background: "#007bff",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Post
      </button>
    </form>
  );
};

export default CreatePost;
