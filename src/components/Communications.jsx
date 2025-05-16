import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '../context/NotificationContext';
import './Communications.css';
import logo from '../assets/logo.png';
import ProfileSection from './ProfileSection';

const initialMessages = [
  {
    id: 1,
    sender: 'Chef Mike',
    text: 'Order #123 is ready for pickup',
    time: '10:30 AM',
    type: 'chef'
  },
  {
    id: 2,
    sender: 'You',
    text: 'On my way to collect it',
    time: '10:31 AM',
    type: 'captain'
  },
  {
    id: 3,
    sender: 'Chef Mike',
    text: "Table 5's special request will take 5 more minutes",
    time: '10:35 AM',
    type: 'chef'
  }
];

const Communications = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState(initialMessages);
  const [newMessage, setNewMessage] = useState('');
  const { addNotification } = useNotification();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="app-container">
      <div className="mobile-header">
        {/* <button className="menu-toggle" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          <i className="fas fa-bars"></i>
        </button> */}
        <button className="menu-toggle" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
        <span></span>
        </button>
        <span className="mobile-title">Captian-Hub</span>
        <div className="user-info">
          <ProfileSection />
        </div>
      </div>
      <nav className={`sidebar ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="logo">
          <img src={logo} alt="Logo" className="logo-image" />
        </div>
        <ul className="nav-items">
          <li onClick={() => navigate('/')}><i className="fas fa-home"></i> Dashboard</li>
          <li className="active"><i className="fas fa-comments"></i> Communications</li>
          <li onClick={() => navigate('/earnings')}><i className="fas fa-dollar-sign"></i> Earnings</li>
        </ul>
      </nav>
      
      <main className="main-content">
        <header className="top-header">
          <div className="header-content">
            <span className="app-title">Captian-Hub</span>
            <ProfileSection />
          </div>
        </header>

        <div className="communications-panels">
          <div className="panel notifications-panel">
            <h3>Latest Notifications</h3>
            <div className="notification-item">
              <p>New order assigned to Table 5</p>
              <span className="notification-time">2 minutes ago</span>
            </div>
            <div className="notification-item">
              <p>Kitchen completed order #123</p>
              <span className="notification-time">5 minutes ago</span>
            </div>
          </div>

          <div className="panel chat-panel">
            <h3>Chat with Kitchen</h3>
            <div className="chat-container">
              <div className="chat-messages">
                 {messages.map((message) => (
                   <div key={message.id} className={`message ${message.type}`}>
                     <span className="sender">{message.sender}</span>
                     <p>{message.text}</p>
                     <span className="time">{message.time}</span>
                   </div>
                 ))}
              </div>
              <div className="chat-input">
                <input 
                   type="text" 
                   placeholder="Type your message..."
                   value={newMessage}
                   onChange={(e) => setNewMessage(e.target.value)}
                   onKeyPress={(e) => {
                     if (e.key === 'Enter' && newMessage.trim()) {
                       const newMsg = {
                         id: messages.length + 1,
                         sender: 'You',
                         text: newMessage.trim(),
                         time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                         type: 'captain'
                       };
                       setMessages([...messages, newMsg]);
                       setNewMessage('');
                       // Notify when a new message is received from the chef
                       if (messages[messages.length - 1]?.type === 'chef') {
                         addNotification('New message from Chef: ' + messages[messages.length - 1].text);
                       }
                     }
                   }}
                 />
                 <button 
                   className="send-button"
                   onClick={() => {
                     if (newMessage.trim()) {
                       const newMsg = {
                         id: messages.length + 1,
                         sender: 'You',
                         text: newMessage.trim(),
                         time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                         type: 'captain'
                       };
                       setMessages([...messages, newMsg]);
                       setNewMessage('');
                       // Notify when a new message is received from the chef
                       if (messages[messages.length - 1]?.type === 'chef') {
                         addNotification('New message from Chef: ' + messages[messages.length - 1].text);
                       }
                     }
                   }}
                 >
                   <i className="fas fa-paper-plane"></i>
                 </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Communications;