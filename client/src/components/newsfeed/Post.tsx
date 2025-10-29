import React, { useState } from "react";
import Comment from "./Comment";
import axios from "axios";

interface Media {
  url: string;
  type: string;
}

interface CommentType {
  id: number;
  userId: number;
  content: string;
}

interface PostProps {
  id: number;
  userId: number;
  content: string;
  media: Media[];
  likes: number[];
  comments: CommentType[];
  refreshFeed?: () => void;
}

const Post: React.FC<PostProps> = ({ id, userId, content, media, likes, comments, refreshFeed }) => {
  const [newComment, setNewComment] = useState("");

  const handleAddComment = async () => {
    if (!newComment) return;
    await axios.post(`http://localhost:5000/api/posts/${id}/comment`, { user_id: 1, content: newComment }); // replace 1 with current user
    setNewComment("");
    refreshFeed?.();
  };

  const handleLike = async () => {
    await axios.post(`http://localhost:5000/api/posts/${id}/like`, { userId: 1 }); // replace 1 with current user
    refreshFeed?.();
  };

  return (
    <div style={{ border: "1px solid #ddd", padding: "12px", marginBottom: "12px", borderRadius: "8px" }}>
      <p><strong>User {userId}:</strong> {content}</p>

      {media.length > 0 && (
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {media.map((m, idx) =>
            m.type === "image" ? (
              <img key={idx} src={m.url} alt="media" style={{ width: "100px", height: "100px", objectFit: "cover" }} />
            ) : (
              <video key={idx} src={m.url} controls style={{ width: "150px", height: "100px" }} />
            )
          )}
        </div>
      )}

      <div style={{ marginTop: "8px" }}>
        <button onClick={handleLike}>Like ({likes.length})</button>
      </div>

      <div style={{ marginTop: "12px" }}>
        <strong>Comments:</strong>
        {comments.map((c) => (
          <Comment key={c.id} id={c.id} userId={c.userId} content={c.content} />
        ))}
        <div style={{ marginTop: "8px" }}>
          <input
            type="text"
            value={newComment}
            placeholder="Write a comment..."
            onChange={(e) => setNewComment(e.target.value)}
            style={{ width: "70%", marginRight: "8px" }}
          />
          <button onClick={handleAddComment}>Add</button>
        </div>
      </div>
    </div>
  );
};

export default Post;
