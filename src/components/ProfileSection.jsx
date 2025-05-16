import React, { useState } from 'react';

const ProfileSection = () => {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  return (
    <div className="user-info">
      <div className="notification-icon" onClick={() => {}}>
        <i className="fas fa-bell"></i>
      </div>
      <div className="profile-section" onClick={(e) => {
        e.stopPropagation();
        setShowProfileDropdown(!showProfileDropdown);
      }}>
        <div className="profile-photo">
          <i className="fas fa-user"></i>
        </div>
        {showProfileDropdown && (
          <div className={`profile-dropdown ${showProfileDropdown ? 'show' : ''}`}>
            <div className="profile-details">
              <div className="profile-name">Name:-XXXXXX</div>
              <div className="profile-mobile">MobileNo:- XXXXXXXXXX</div>
            </div>
            <button className="logout-button" onClick={() => {}}>
              <i className="fas fa-sign-out-alt"></i> Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileSection;