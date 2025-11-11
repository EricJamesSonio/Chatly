import React from "react";

interface Props {
  view: "default" | "requests";
  sortBy: string;
  setSortBy: (v: "name" | "date") => void;
  setView: (v: "default" | "requests") => void;
  fetchPendingRequests: () => void;
  pendingRequestsCount: number;
}

const FriendsHeader: React.FC<Props> = ({
  view,
  sortBy,
  setSortBy,
  setView,
  fetchPendingRequests,
  pendingRequestsCount,
}) => {
  return (
    <div className="friends-header">
      {view === "default" ? (
        <>
          <h1>Friends</h1>
          <div className="header-actions">
            <div className="sort-options">
              <span>Sort by:</span>
              <button
                className={`sort-btn ${sortBy === "name" ? "active" : ""}`}
                onClick={() => setSortBy("name")}
              >
                Name
              </button>
              <button
                className={`sort-btn ${sortBy === "date" ? "active" : ""}`}
                onClick={() => setSortBy("date")}
              >
                Recently Added
              </button>
            </div>
            <div className="requests-btn-container">
              <button
                className="requests-btn"
                onClick={() => {
                  fetchPendingRequests();
                  setView("requests");
                }}
              >
                View Friend Requests
                {pendingRequestsCount > 0 && (
                  <span className="notification-badge">
                    {pendingRequestsCount > 9 ? '9+' : pendingRequestsCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </>
      ) : (
        <>
          <button className="back-btn" onClick={() => setView("default")}>
            ← Back
          </button>
          <h1>Friend Requests</h1>
        </>
      )}
    </div>
  );
};

export default FriendsHeader;
