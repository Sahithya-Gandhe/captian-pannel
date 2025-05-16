import React, { createContext, useContext, useState, useEffect } from 'react';

const OrderContext = createContext();

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState(() => {
    const savedOrders = localStorage.getItem('orders');
    return savedOrders ? JSON.parse(savedOrders) : [];
  });

  const activeOrdersCount = orders.filter(order => order.status === 'Ready').length;
  const todayDeliveries = orders.filter(order => {
    const orderDate = new Date(order.deliveryDate || order.date);
    const today = new Date();
    return orderDate.toDateString() === today.toDateString() && order.status === 'Delivered';
  }).length;

  const setActiveOrdersCount = (count) => {
    // This is now handled automatically through orders state
    console.warn('setActiveOrdersCount is deprecated - counts are now derived from orders');
  };

  const setTodayDeliveries = (count) => {
    // This is now handled automatically through orders state
    console.warn('setTodayDeliveries is deprecated - counts are now derived from orders');
  };

  useEffect(() => {
    localStorage.setItem('orders', JSON.stringify(orders));
  }, [orders]);



  useEffect(() => {
    localStorage.setItem('todayDeliveries', todayDeliveries.toString());
  }, [todayDeliveries])

  const value = {
    orders,
    setOrders,
    activeOrdersCount,
    setActiveOrdersCount,
    todayDeliveries,
    setTodayDeliveries
  };

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  );
};