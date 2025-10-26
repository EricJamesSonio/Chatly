import React from 'react';
import { useFriends } from '../context/FriendsContext';
import MiniProfileModal from '../components/friends/MiniProfileModal';
import '../css/FriendsPage.css';

const FriendsPage: React.FC = () => {
  const { 
    friends, 
    sortBy, 
    setSortBy, 
    setSelectedFriend,
    setIsProfileModalOpen,
    loading,
    error
  } = useFriends();

  const handleFriendClick = (friend: any) => {
    setSelectedFriend(friend);
    setIsProfileModalOpen(true);
  };

  if (loading) {
    return <div className="loading">Loading friends...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="friends-page">
      <div className="friends-header">
        <h1>Friends</h1>
        <div className="sort-options">
          <span>Sort by:</span>
          <button 
            className={`sort-btn ${sortBy === 'name' ? 'active' : ''}`}
            onClick={() => setSortBy('name')}
          >
            Name
          </button>
          <button 
            className={`sort-btn ${sortBy === 'date' ? 'active' : ''}`}
            onClick={() => setSortBy('date')}
          >
            Recently Added
          </button>
        </div>
      </div>

      <div className="friends-grid">
        {friends.length > 0 ? (
          friends.map((friend) => (
            <div 
              key={friend.id} 
              className="friend-card"
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
          ))
        ) : (
          <div className="no-friends">
            <p>You don't have any friends yet. Start adding some!</p>
          </div>
        )}
      </div>

      <MiniProfileModal />
    </div>
  );
};

export default FriendsPage;