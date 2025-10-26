import React from "react";
import "../css/ChatModal.css";

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
}

const ChatModal: React.FC<ChatModalProps> = ({
  isOpen,
  onClose,
  userName,
}) => {
  if (!isOpen) return null;

  return (
    <div className="chat-modal-overlay">
      <div className="chat-modal">
        <header>
          <h3>Chat with {userName}</h3>
          <button onClick={onClose}>X</button>
        </header>

        <div className="chat-body">
          {/* chat messages here */}
        </div>

        <footer className="chat-input-area">
          <input type="text" placeholder="Type a message..." />
          <button>Send</button>
        </footer>
      </div>
    </div>
  );
};

export default ChatModal;
