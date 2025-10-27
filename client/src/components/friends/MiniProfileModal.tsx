import React from 'react';
import { useFriends } from '../../context/FriendsContext';
import '../../css/MiniProfileModal.css';

const MiniProfileModal: React.FC = () => {
  const { 
    selectedFriend, 
    isProfileModalOpen, 
    setIsProfileModalOpen 
  } = useFriends();

  if (!isProfileModalOpen || !selectedFriend) return null;

  return (
    <div className="modal-overlay" onClick={() => setIsProfileModalOpen(false)}>
      <div className="mini-profile-modal" onClick={e => e.stopPropagation()}>
        <button 
          className="close-modal"
          onClick={() => setIsProfileModalOpen(false)}
        >
          &times;
        </button>

        {/* Add wrapper for namespace safety */}
        <div className="mini-profile-content">
          <div className="mini-profile-header">
            <img 
              src={selectedFriend.profile_image} 
              alt={selectedFriend.name} 
              className="mini-profile-avatar"
            />
            <div className="mini-profile-names">
              <h2>{selectedFriend.name}</h2>
              <p className="mini-username">@{selectedFriend.username}</p>
            </div>
          </div>

          <div className="mini-profile-details">
            {selectedFriend.bio && <p className="mini-bio">{selectedFriend.bio}</p>}
            
            <div className="mini-detail-row">
              <span className="mini-detail-label">Location:</span>
              <span>{selectedFriend.location || 'Not specified'}</span>
            </div>
            
            {selectedFriend.birthdate && (
              <div className="mini-detail-row">
                <span className="mini-detail-label">Birthdate:</span>
                <span>{new Date(selectedFriend.birthdate).toLocaleDateString()}</span>
              </div>
            )}
            
            {selectedFriend.hobbies && (
              <div className="mini-detail-row">
                <span className="mini-detail-label">Hobbies:</span>
                <span>{selectedFriend.hobbies}</span>
              </div>
            )}
            
            {selectedFriend.talents && (
              <div className="mini-detail-row">
                <span className="mini-detail-label">Talents:</span>
                <span>{selectedFriend.talents}</span>
              </div>
            )}
            
            <div className="mini-social-links">
              {selectedFriend.facebook_url && (
                <a href={selectedFriend.facebook_url} target="_blank" rel="noopener noreferrer">
                  <i className="fab fa-facebook"></i>
                </a>
              )}
              {selectedFriend.instagram_url && (
                <a href={selectedFriend.instagram_url} target="_blank" rel="noopener noreferrer">
                  <i className="fab fa-instagram"></i>
                </a>
              )}
              {selectedFriend.tiktok_url && (
                <a href={selectedFriend.tiktok_url} target="_blank" rel="noopener noreferrer">
                  <i className="fab fa-tiktok"></i>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MiniProfileModal;
