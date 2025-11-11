import React from "react";
const API_URL = import.meta.env.VITE_API_URL;
interface Props {
  requests: any[];
  fetchPendingRequests: () => void;
}

const FriendRequests: React.FC<Props> = ({ requests, fetchPendingRequests }) => {
  const handleAction = async (id: number, action: "accept" | "reject") => {
    const url =
      action === "accept"
        ? `${API_URL}/api/friends/accept/${id}`
        : `${API_URL}/api/friends/${id}`;
    const method = action === "accept" ? "PUT" : "DELETE";
    await fetch(url, { method });
    fetchPendingRequests();
  };

  return (
    <div className="friends-grid">
      {requests.length > 0 ? (
        requests.map((req) => (
          <div key={req.id} className="friend-card">
            <img src={req.profile_image} alt={req.name} className="friend-avatar" />
            <div className="friend-info">
              <h3>{req.name}</h3>
              <div className="buttons">
                <button className="accept-btn" onClick={() => handleAction(req.id, "accept")}>
                  Accept
                </button>
                <button className="reject-btn" onClick={() => handleAction(req.id, "reject")}>
                  Reject
                </button>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p className="no-requests">No pending friend requests.</p>
      )}
    </div>
  );
};

export default FriendRequests;
