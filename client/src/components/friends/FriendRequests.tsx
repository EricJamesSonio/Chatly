import React from "react";

interface Props {
  requests: any[];
  fetchPendingRequests: () => void;
}

const FriendRequests: React.FC<Props> = ({ requests, fetchPendingRequests }) => {
  const handleAction = async (id: number, action: "accept" | "reject") => {
    const url =
      action === "accept"
        ? `http://localhost:5000/api/friends/accept/${id}`
        : `http://localhost:5000/api/friends/${id}`;
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
