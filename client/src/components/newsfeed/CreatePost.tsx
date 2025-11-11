import React, { useState } from "react";
import axios from "axios";
import type { PostProps } from "./Post"; // ✅ type-only import for consistency
import MediaUploader from "./MediaUploader";
import "../../css/CreatePost.css";

interface CreatePostProps {
  refreshFeed?: () => void;
}

interface Media {
  url: string;
  type: string;
}

const CreatePost: React.FC<CreatePostProps> = ({ refreshFeed }) => {
  const [content, setContent] = useState("");
  const [media, setMedia] = useState<Media[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      await axios.post("http://localhost:5000/api/posts", {
        user_id: 1, // Replace with logged-in user ID if using AuthContext
        content,
        media,
      });

      setContent("");
      setMedia([]);
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
        style={{ width: "100%", height: "60px", marginBottom: "8px", padding: "6px", borderRadius: "4px", border: "1px solid #ccc" }}
      />
      <MediaUploader onMediaChange={setMedia} />
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
