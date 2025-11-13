import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import type { PostProps, CommentType } from "../../types/posts";

const API_URL = import.meta.env.VITE_API_URL;

const Post: React.FC<PostProps> = ({
  id,
  userId,
  userName,
  content,
  media,
  likes,
  comments: initialComments,
  createdAt,
  refreshFeed,
}) => {
  const { user } = useAuth();
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState<CommentType[]>(initialComments);

  // Ensure likes are numbers
  const [likesState, setLikesState] = useState<number[]>(
    likes.map((l) => Number(l))
  );

  const handleAddComment = async () => {
    if (!newComment.trim() || !user) return;

    try {
      const res = await axios.post(`${API_URL}/api/posts/${id}/comment`, {
        user_id: user.id,
        content: newComment,
      });

      if (res.data.comment) {
        const commentWithName: CommentType = {
          ...res.data.comment,
          user_name: user.username,
        };
        setComments((prev) => [...prev, commentWithName]);
      }

      setNewComment("");
    } catch (err) {
      console.error("❌ addComment error:", err);
    }
  };

  const handleLikeToggle = async () => {
    if (!user) return;

    try {
      const userIdNum = Number(user.id); // ensure number type
      const hasLiked = likesState.includes(userIdNum);

      if (hasLiked) {
        await axios.post(`${API_URL}/api/posts/${id}/unlike`, { userId: userIdNum });
        setLikesState((prev) => prev.filter((uid) => uid !== userIdNum));
      } else {
        await axios.post(`${API_URL}/api/posts/${id}/like`, { userId: userIdNum });
        setLikesState((prev) => [...prev, userIdNum]);
      }

      refreshFeed?.();
    } catch (err) {
      console.error("❌ likeToggle error:", err);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleString([], {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div
      style={{
        borderRadius: "12px",
        background: "#fff",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        padding: "16px",
        marginBottom: "20px",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* Post Header */}
      <div style={{ marginBottom: "10px", display: "flex", justifyContent: "space-between" }}>
        <strong style={{ fontSize: "1.05em", color: "#333" }}>{userName}</strong>
        <span style={{ color: "#999", fontSize: "0.85em" }}>{formatDate(createdAt)}</span>
      </div>

      {/* Content */}
      <p style={{ marginBottom: "12px", lineHeight: "1.5em", fontSize: "0.95em", color: "#444" }}>
        {content}
      </p>

      {/* Media */}
      {media && media.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "12px" }}>
          {media.map((m, idx) =>
            m.type === "image" ? (
              <img
                key={idx}
                src={m.url}
                alt="media"
                style={{
                  width: "130px",
                  height: "130px",
                  objectFit: "cover",
                  borderRadius: "8px",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.15)",
                }}
              />
            ) : (
              <video
                key={idx}
                src={m.url}
                controls
                style={{
                  width: "220px",
                  height: "130px",
                  borderRadius: "8px",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.15)",
                }}
              />
            )
          )}
        </div>
      )}

      {/* Like Button */}
      <div style={{ marginBottom: "12px" }}>
        <button
          onClick={handleLikeToggle}
          style={{
            background: likesState.includes(Number(user?.id ?? 0)) ? "#0056b3" : "#007bff",
            color: "#fff",
            border: "none",
            padding: "8px 16px",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: 500,
            transition: "background 0.2s",
          }}
        >
          👍 {likesState.includes(Number(user?.id ?? 0)) ? "Unlike" : "Like"} ({likesState.length})
        </button>
      </div>

      {/* Comments */}
      <div>
        <strong style={{ fontSize: "0.95em" }}>Comments</strong>
        {comments.length === 0 && (
          <p style={{ color: "#999", fontSize: "0.85em", marginTop: "4px" }}>No comments yet</p>
        )}

        {comments.map((c) => (
          <div
            key={c.id}
            style={{
              background: "#f4f4f4",
              padding: "8px 12px",
              borderRadius: "8px",
              marginTop: "8px",
            }}
          >
            <div style={{ fontSize: "0.85em", color: "#555" }}>
              <strong>{c.user_name}</strong>{" "}
              <span style={{ color: "#999", fontSize: "0.75em" }}>{formatDate(c.created_at)}</span>
            </div>
            <div style={{ marginTop: "4px", fontSize: "0.9em", color: "#333" }}>{c.content}</div>
          </div>
        ))}

        {/* Add Comment */}
        <div style={{ marginTop: "12px", display: "flex", gap: "8px" }}>
          <input
            type="text"
            value={newComment}
            placeholder="Write a comment..."
            onChange={(e) => setNewComment(e.target.value)}
            style={{
              flex: 1,
              padding: "8px 10px",
              borderRadius: "6px",
              border: "1px solid #ccc",
              fontSize: "0.9em",
              outline: "none",
            }}
          />
          <button
            onClick={handleAddComment}
            disabled={!user}
            style={{
              background: "#28a745",
              color: "#fff",
              border: "none",
              padding: "8px 16px",
              borderRadius: "6px",
              cursor: user ? "pointer" : "not-allowed",
              fontWeight: 500,
              opacity: user ? 1 : 0.6,
              transition: "background 0.2s",
            }}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default Post;
