import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Earnings.css';
import logo from '../assets/logo.png';
import { useEarnings } from '../context/NotificationContext';
import ProfileSection from './ProfileSection';

const Earnings = () => {
  const navigate = useNavigate();
  const { setTodayEarnings } = useEarnings();
  const [selectedPeriod, setSelectedPeriod] = useState('today');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [earningsData, setEarningsData] = useState({
    today: { total: 0, orders: 0 },
    week: { total: 0, orders: 0 },
    month: { total: 0, orders: 0 }
  });

  const fetchDailyEarnings = async (date) => {
    try {
      // TODO: Replace with actual API endpoint
      // const response = await fetch(`/api/earnings/${date}`);
      // const data = await response.json();
      // return data;
      
      // Placeholder data for demonstration
      return {
        total: Math.random() * 500,
        orders: Math.floor(Math.random() * 50)
      };
    } catch (error) {
      console.error('Error fetching earnings:', error);
      return { total: 0, orders: 0 };
    }
  };


  // const fetchDailyEarnings = async (date) => {
  //   try {
  //     // Replace with your actual API endpoint
  //     const API_KEY = 'your_api_key_here';  // 🔹 Replace with your actual API key
  //     const response = await fetch(`https://your-api.com/earnings/${date}`, {
  //       method: 'GET',  // or 'POST' depending on API requirements
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'Authorization': `Bearer ${API_KEY}` // 🔹 API key authentication (if required)
  //       }
  //     });
  
  //     // Check if response is OK (status 200-299)
  //     if (!response.ok) {
  //       throw new Error(`HTTP error! Status: ${response.status}`);
  //     }
  
  //     const data = await response.json(); // Convert response to JSON
  //     return data;  // 🔹 Return the actual earnings data
  
  //   } catch (error) {
  //     console.error('Error fetching earnings:', error);
      
  //     // Return fallback default values to avoid UI breaking
  //     return { total: 0, orders: 0 };
  //   }
  // };
  









  const calculatePeriodEarnings = async () => {
    const today = new Date();
    let dailyData = await fetchDailyEarnings(today.toISOString());
    
    let weekTotal = dailyData.total;
    let weekOrders = dailyData.orders;
    let monthTotal = dailyData.total;
    let monthOrders = dailyData.orders;

    // Calculate last 7 days
    for (let i = 1; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dayData = await fetchDailyEarnings(date.toISOString());
      weekTotal += dayData.total;
      weekOrders += dayData.orders;
      monthTotal += dayData.total;
      monthOrders += dayData.orders;
    }

    // Calculate remaining days for month (23 more days as 7 are already calculated)
    for (let i = 7; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dayData = await fetchDailyEarnings(date.toISOString());
      monthTotal += dayData.total;
      monthOrders += dayData.orders;
    }

    const newEarningsData = {
      today: dailyData,
      week: { total: weekTotal, orders: weekOrders },
      month: { total: monthTotal, orders: monthOrders }
    };
    setEarningsData(newEarningsData);
    setTodayEarnings(dailyData.total);
  };

  useEffect(() => {
    calculatePeriodEarnings();
  }, []);

  return (
    <div className="app-container">
      <div className="mobile-header">
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
          <li onClick={() => navigate('/communications')}><i className="fas fa-comments"></i> Communications</li>
          <li className="active"><i className="fas fa-dollar-sign"></i> Earnings</li>
        </ul>
      </nav>
      
      <main className="main-content">
        <header className="top-header">
          <div className="header-content">
            <span className="app-title">Captian-Hub</span>
            <ProfileSection />
          </div>
        </header>

        <div className="earnings-container">
          <div className="earnings-header">
            <h2>Captian Earnings</h2>
            <div className="date-selector">
              <button 
                className={`btn-date ${selectedPeriod === 'today' ? 'active' : ''}`}
                onClick={() => setSelectedPeriod('today')}
              >Today</button>
              <button 
                className={`btn-date ${selectedPeriod === 'week' ? 'active' : ''}`}
                onClick={() => setSelectedPeriod('week')}
              >Week</button>
              <button 
                className={`btn-date ${selectedPeriod === 'month' ? 'active' : ''}`}
                onClick={() => setSelectedPeriod('month')}
              >Month</button>
            </div>
          </div>

          <div className="earnings-summary">
            <div className="summary-card total">
              <h3>Total Earnings</h3>
              <div className="amount">RS:- {earningsData[selectedPeriod].total.toFixed(2)}</div>
            </div>

            <div className="summary-card orders">
              <h3>Total Orders</h3>
              <div className="amount">{earningsData[selectedPeriod].orders}</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Earnings;