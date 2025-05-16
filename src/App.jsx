import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Communications from './components/Communications';
import Earnings from './components/Earnings';
import './App.css';
import { NotificationProvider, EarningsProvider } from './context/NotificationContext';
import { OrderProvider } from './context/OrderContext';

// import LoginPage from './components/LoginPage';

function App() {
  return (
    <Router>
      <NotificationProvider>
        <EarningsProvider>
          <OrderProvider>
            <div className="App">
              <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/communications" element={<Communications />} />
              <Route path="/earnings" element={<Earnings />} />
              </Routes>
            </div>
          </OrderProvider>
        </EarningsProvider>
      </NotificationProvider>
    </Router>
    // <div><LoginPage/></div>
  );
}

export default App;

