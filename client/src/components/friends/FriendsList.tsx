import React from "react";
import FriendButtons from "./FriendButtons";

interface Props {
  friends: any[];
  nonFriends: any[];
  currentUserId: number;
  handleFriendClick: (friend: any) => void;
}

const FriendsList: React.FC<Props> = ({
  friends,
  nonFriends,
  currentUserId,
  handleFriendClick,
}) => {
  return (
    <>
      {/* ✅ FRIENDS GRID — with button at bottom */}
      <div className="friends-grid">
        {friends.length > 0 ? (
          friends.map((friend) => (
            <div key={friend.id} className="friend-card">
              <div
                className="friend-content"
                onClick={() => handleFriendClick(friend)}
              >
                <img
                  src={friend.profile_image}
                  alt={friend.name}
                  className="friend-avatar"
                />
                <div className="friend-info">
                  <h3>{friend.name}</h3>
                  <p className="username">@{friend.username}</p>
                </div>
              </div>

              {/* ✅ Bottom action area */}
              <div className="friend-actions">
                <FriendButtons
                  currentUserId={currentUserId}
                  targetUserId={friend.id}
                />
              </div>
            </div>
          ))
        ) : (
          <div className="no-friends">
            <p>You don't have any friends yet.</p>
          </div>
        )}
      </div>

      {/* ✅ NON-FRIENDS GRID — same structure, button below */}
      <div className="non-friends-section">
        <h2>People You May Know</h2>
        <div className="friends-grid">
          {nonFriends.map((user) => (
            <div key={user.id} className="friend-card">
              <div className="friend-content">
                <img
                  src={user.profile_image}
                  alt={user.name}
                  className="friend-avatar"
                />
                <div className="friend-info">
                  <h3>{user.name}</h3>
                </div>
              </div>
              <div className="friend-actions">
                <FriendButtons
                  currentUserId={currentUserId}
                  targetUserId={user.id}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default FriendsList;
