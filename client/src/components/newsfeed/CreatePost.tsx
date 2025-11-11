import React, { useState } from "react";
import axios from "axios";
import MediaUploader from "./MediaUploader";
import "../../css/CreatePost.css";

interface CreatePostProps {
  refreshFeed?: () => void;
}

const CreatePost: React.FC<CreatePostProps> = ({ refreshFeed }) => {
  const [content, setContent] = useState("");
  const [media, setMedia] = useState<{ url: string; type: string }[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content) return;

    await axios.post("http://localhost:5000/api/posts", { user_id: 1, content, media });

    setContent("");
    setMedia([]);
    refreshFeed?.();
  };

  return (
    <form onSubmit={handleSubmit} style={{ border: "1px solid #ddd", padding: "12px", marginBottom: "12px", borderRadius: "8px" }}>
      <textarea
        placeholder="What's on your mind?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        style={{ width: "100%", height: "60px", marginBottom: "8px" }}
      />
      <MediaUploader onMediaChange={setMedia} />
      <button type="submit" style={{ marginTop: "8px" }}>Post</button>
    </form>
  );
};

export default CreatePost;
