import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
import ActiveOrders from './ActiveOrders';
import { useNotification, useEarnings } from '../context/NotificationContext';
import { useOrders } from '../context/OrderContext';
import logo from '../assets/logo.png';


const Dashboard = () => {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [restaurantName, setRestaurantName] = useState('');
  const navigate = useNavigate();
  const { unreadCount, notifications, clearNotifications } = useNotification();
  const { todayEarnings } = useEarnings();
  const [showPopup, setShowPopup] = useState(false);
  const [currentNotification, setCurrentNotification] = useState(null);
  const { activeOrdersCount, todayDeliveries } = useOrders();
  const [reviews, setReviews] = useState([]);
// this function is used for fetching the restaurant name from the backend and storing it in the state variable restaurantName using the setRestaurantName function.
  useEffect(() => {
    const fetchRestaurantData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/restaurants');
        const data = await response.json();
        if (data && data.length > 0) {
          setRestaurantName(data[1].restaurantName);
        }
      } catch (error) {
        console.error('Error fetching restaurant data:', error);
      }
    };
    fetchRestaurantData();
  }, []);

  const fetchReviews = async () => {    // API implimentation to fetch the rewiews from userspannel
    try {
      const response = await fetch(``);
      const data = await response.json();
      setReviews(data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);
  useEffect(() => {
    if (notifications && notifications.length > 0) {
      const latestNotification = notifications[notifications.length - 1];
      setCurrentNotification(latestNotification);
      setShowPopup(true);

      const timer = setTimeout(() => {
        setShowPopup(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [notifications]);
  return (
    <div className="app-container">
      <div className="mobile-header">
        {/* <button className="menu-toggle" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          <i className="fas fa-bars"></i>
        </button> */}
        <button className="menu-toggle" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
        <span></span>
        </button>
        <span className="mobile-title">{restaurantName || 'Captian-Hub'}</span>
        <div className="user-info">
          <div className="notification-icon" onClick={clearNotifications}>
            <i className="fas fa-bell"></i>
            {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
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
      </div>
      <nav className={`sidebar ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="logo">
          <img src={logo} alt="Logo" className="logo-image" />
        </div>
        <ul className="nav-items">
          <li className="active"><i className="fas fa-home"></i> Dashboard</li>
          <li onClick={() => navigate('/communications')}><i className="fas fa-comments"></i> Communications</li>
          <li onClick={() => navigate('/earnings')}><i className="fas fa-dollar-sign"></i> Earnings</li>
        </ul>
      </nav>
      
      <main className="main-content">
      <header className="top-header">
        <div className="header-content">
          <span className="app-title">{restaurantName || 'Captian-Hub'}</span>
          <div className="user-info">
            <div className="notification-icon" onClick={clearNotifications}>
              <i className="fas fa-bell"></i>
              {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
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
        </div>
      </header>

      
      <div className="stats">
          <div className="stat-card orange">
            <h3>&nbsp;&nbsp;&nbsp;Active Orders&nbsp;&nbsp;</h3>
            <div className="stat-value">{activeOrdersCount}</div>
          </div>
          <div className="stat-card green">
            <h3>Today's Deliveries</h3>
            <div className="stat-value">{todayDeliveries}</div>
          </div>
          <div className="stat-card blue">
            <h3> Today's Earnings </h3>
            <div className="stat-value">RS:- {todayEarnings.toFixed(2)}</div>
          </div>
          <div className="stat-card gray">
            <h3>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Rating&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</h3>
              <div>{}</div>
          </div>
        </div>
        <ActiveOrders/>

      {showPopup && currentNotification && (
        <div className={`notification-popup ${!showPopup ? 'hide' : ''}`}>
          <h4>New Message</h4>
          <p>{currentNotification.message}</p>
        </div>
      )}
    </main>
  </div>
  );
};

export default Dashboard;