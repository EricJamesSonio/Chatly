import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import type { PostProps, CommentType } from "../../types/posts"; // ✅ shared types

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
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState<CommentType[]>(initialComments);

  const { user } = useAuth();

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

  const handleLike = async () => {
    if (!user) return;

    try {
      await axios.post(`${API_URL}/api/posts/${id}/like`, { userId: user.id });
      refreshFeed?.();
    } catch (err) {
      console.error("❌ likePost error:", err);
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
        border: "1px solid #ddd",
        padding: "12px",
        marginBottom: "16px",
        borderRadius: "8px",
        background: "#fff",
      }}
    >
      <div style={{ marginBottom: "8px" }}>
        <strong>{userName}</strong>{" "}
        <span style={{ color: "#777", fontSize: "0.9em" }}>
          {formatDate(createdAt)}
        </span>
      </div>

      <p style={{ marginBottom: "8px" }}>{content}</p>

      {media.length > 0 && (
        <div
          style={{
            display: "flex",
            gap: "8px",
            flexWrap: "wrap",
            marginBottom: "8px",
          }}
        >
          {media.map((m: { url: string; type: string }, idx: number) =>
            m.type === "image" ? (
              <img
                key={idx}
                src={m.url}
                alt="media"
                style={{
                  width: "120px",
                  height: "120px",
                  borderRadius: "6px",
                  objectFit: "cover",
                }}
              />
            ) : (
              <video
                key={idx}
                src={m.url}
                controls
                style={{
                  width: "200px",
                  height: "120px",
                  borderRadius: "6px",
                }}
              />
            )
          )}
        </div>
      )}

      <div style={{ marginTop: "4px" }}>
        <button
          onClick={handleLike}
          style={{
            background: "#007bff",
            color: "white",
            border: "none",
            padding: "6px 12px",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          👍 Like ({likes.length})
        </button>
      </div>

      <div style={{ marginTop: "12px" }}>
        <strong>Comments:</strong>
        {comments.length === 0 && (
          <p style={{ color: "#777", marginTop: "4px" }}>No comments yet</p>
        )}

        {comments.map((c) => (
          <div
            key={c.id}
            style={{
              background: "#f9f9f9",
              padding: "6px 10px",
              borderRadius: "6px",
              marginTop: "6px",
            }}
          >
            <div style={{ fontSize: "0.9em" }}>
              <strong>{c.user_name}</strong>{" "}
              <span style={{ color: "#777", fontSize: "0.8em" }}>
                {formatDate(c.created_at)}
              </span>
            </div>
            <div style={{ marginTop: "2px" }}>{c.content}</div>
          </div>
        ))}

        <div style={{ marginTop: "10px" }}>
          <input
            type="text"
            value={newComment}
            placeholder="Write a comment..."
            onChange={(e) => setNewComment(e.target.value)}
            style={{
              width: "70%",
              marginRight: "8px",
              padding: "6px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />
          <button
            onClick={handleAddComment}
            disabled={!user}
            style={{
              background: "#28a745",
              color: "white",
              border: "none",
              padding: "6px 12px",
              borderRadius: "4px",
              cursor: user ? "pointer" : "not-allowed",
              opacity: user ? 1 : 0.6,
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
