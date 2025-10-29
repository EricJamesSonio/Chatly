import React from "react";
import "../../css/Comment.css";

interface CommentProps {
  id: number;
  userId: number;
  content: string;
  onDelete?: (commentId: number) => void;
}

const Comment: React.FC<CommentProps> = ({ id, userId, content, onDelete }) => {
  return (
    <div className="comment">
      <div className="comment-header">
        <span className="comment-user">User {userId}</span>
      </div>
      <p className="comment-content">{content}</p>
      {onDelete && (
        <button className="comment-delete" onClick={() => onDelete(id)}>
          Delete
        </button>
      )}
    </div>
  );
};

export default Comment;
