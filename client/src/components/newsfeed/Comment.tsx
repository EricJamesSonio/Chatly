import React from "react";

interface CommentProps {
  id: number;
  userId: number;
  content: string;
  onDelete?: (commentId: number) => void;
}

const Comment: React.FC<CommentProps> = ({ id, userId, content, onDelete }) => {
  return (
    <div style={{ padding: "6px 0", borderBottom: "1px solid #eee" }}>
      <strong>User {userId}:</strong> {content}
      {onDelete && (
        <button
          onClick={() => onDelete(id)}
          style={{ marginLeft: "10px", color: "red" }}
        >
          Delete
        </button>
      )}
    </div>
  );
};

export default Comment;
