import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { useOrders } from '../context/OrderContext';
import axios from 'axios';

const ActiveOrders = () => {  //this is the function for total active orders section
  const navigate = useNavigate();
  const [tableCount, setTableCount] = useState('');
  const [expandedTables, setExpandedTables] = useState(new Set());
  // payment
  const [paidTables, setPaidTables] = useState(new Set());
  const [kotPrinted, setKotPrinted] = useState(new Set());
  const { orders, setOrders } = useOrders();
// 
// for frtching the required resturants menu from he backend 
const [menuItems, setMenuItems] = useState([]);
  const [restaurantName, setRestaurantName] = useState('');

  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/restaurants');
        if (response.data && response.data.length > 0) {
          const restaurant = response.data[1];
          const menuCategories = Object.entries(restaurant.menu).reduce((acc, [category, items]) => {
            items.forEach(item => {
              acc.push({
                ...item,
                category
              });
            });
            return acc;
          }, []);
          setMenuItems(menuCategories);
          setRestaurantName(restaurant.restaurantName);
        }
      } catch (error) {
        console.error('Error fetching menu data:', error);
      }
    };
    fetchMenuData();
  }, []);
//to generate hte no of tables
  const generateOrders = (tableCount) => {
    if (!menuItems.length) return [];
    
    const newOrders = [];
    let orderCounter = 1;

    const tables = Array.from({ length: tableCount }, (_, i) => 
      `T${String(i + 1).padStart(2, '0')}`
    );

    // Function to generate orders for a table
    const generateTableOrders = (table) => {
      const numberOfOrders = Math.floor(Math.random() * 6) + 1;
      const selectedItems = new Set();
      
      while(selectedItems.size < numberOfOrders) {
        const randomIndex = Math.floor(Math.random() * menuItems.length);
        selectedItems.add(menuItems[randomIndex]);
      }
      
      selectedItems.forEach(menuItem => {
        const quantity = Math.floor(Math.random() * 3) + 1;
        
        newOrders.push({
          id: `ORD-${String(orderCounter).padStart(3, '0')}`,
          table: table,
          items: `${quantity}x ${menuItem.itemName}`,
          totalItems: quantity,
          price: menuItem.price * quantity,
          category: menuItem.category,
          status: 'Ready'
        });
        orderCounter++;
      });
    };

    // Generate orders for all tables
    tables.forEach(table => generateTableOrders(table));


    return newOrders;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const tables = parseInt(tableCount);
    try {
      const response = await axios.get('http://localhost:5000/api/restaurants');
      const restaurant = response.data[1];
      if (tables <= 0) {
        alert('Please enter a valid number of tables (greater than 0)');
      } else if (tables > restaurant.numTables) {
        alert(`This restaurant has only ${restaurant.numTables} tables available. Please enter a number between 1 and ${restaurant.numTables}.`);
      } else {
        const newOrders = generateOrders(tables);
        setOrders(newOrders);
      }
    } catch (error) {
      console.error('Error validating table count:', error);
      alert('Error validating table count. Please try again.');
    }
  };

  const updateOrderStatus = (orderId) => {
    setOrders(prevOrders => {
      const orderToUpdate = prevOrders.find(order => order.id === orderId && order.status === 'Ready');
      if (orderToUpdate) {
        // Send POST request to store delivered order
        axios.post('http://localhost:5000/api/todaysdeliveries', {
          orderId: orderId,
          table: orderToUpdate.table,
          items: orderToUpdate.items,
          totalItems: orderToUpdate.totalItems,
          price: orderToUpdate.price,
          category: orderToUpdate.category,
          status: 'Delivered',
          deliveryDate: new Date().toISOString()
        }).catch(error => {
          console.error('Error storing delivered order:', error);
        });

        return prevOrders.map(order => 
          order.id === orderId ? { ...order, status: 'Delivered', deliveryDate: new Date().toISOString() } : order
        );
      }
      return prevOrders;
    });
  };

  const toggleTable = (table) => {
    setExpandedTables(prev => {
      const newSet = new Set(prev);
      if (newSet.has(table)) {
        newSet.delete(table);
      } else {
        newSet.add(table);
      }
      return newSet;
    });
  };

  const groupedOrders = orders.reduce((acc, order) => {
    if (!acc[order.table]) {
      acc[order.table] = [];
    }
    acc[order.table].push(order);
    return acc;
  }, {});

  return (
    <div className="app-container">
      <main className="main-content">
        <section className="active-orders">
          <div className="section-header">
            <h2>Active Orders</h2>
            <form onSubmit={handleSubmit} className="order-form">
              <input
                type="number"
                min="1"
                value={tableCount}
                onChange={(e) => setTableCount(e.target.value)}
                placeholder="Enter number of tables"
                className="order-input"
              />
              <button type="submit" className="btn-generate">Generate Orders</button>
            </form>
          </div>
          <div className="tables-container">
            {Object.entries(groupedOrders).map(([table, tableOrders]) => (
              <div key={table} className="table-section">
                <div 
                  className="table-header" 
                  onClick={() => toggleTable(table)}
                >
                  <h3>{table}</h3>
                  <FontAwesomeIcon 
                    icon={expandedTables.has(table) ? faChevronUp : faChevronDown} 
                    className="toggle-icon"
                  />
                </div>
                {expandedTables.has(table) && (
                  <table>
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Items</th>
                        <th>Total Items</th>
                        <th>Status</th>
                        <th>Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tableOrders.map(order => (
                        <tr key={order.id}>
                          <td>{order.id}</td>
                          <td>{order.items}</td>
                          <td>{order.totalItems}</td>
                          <td>
                            <button 
                              className={`btn-status ${order.status.toLowerCase()}`}
                              onClick={() => updateOrderStatus(order.id)}
                            >
                              {order.status}
                            </button>
                          </td>
                          <td>Rs:-{order.price.toFixed(2)}</td>
                        </tr>
                      ))}
                      {/* grandtotal section */}
                      <tr className="total-row">
                        <td colSpan="4">Grand Total:</td>
                        <td>Rs:-{tableOrders.reduce((sum, order) => sum + order.price, 0).toFixed(2)}</td>
                      </tr>
                      <tr>
                        <td colSpan="5">
                          {/* multi terminal Printing */}
                          {/* <div className="print-buttons"> */}
                            <button 
                              className={`btn-kot ${kotPrinted.has(table) ? 'printed' : 'print'}`}
                              onClick={() => {
                                if (!kotPrinted.has(table)) {
                                  setKotPrinted(prev => {
                                    const newSet = new Set(prev);
                                    newSet.add(table);
                                    return newSet;
                                  });
                                  const kotContent = `
                                    <div style="font-family: Arial, sans-serif; max-width: 300px; padding: 8px; border: 1px solid #ccc; font-size: 12px;">
                                      <div style="text-align: center; margin-bottom: 8px;">
                                        <h2 style="margin: 4px 0; font-size: 16px;">${restaurantName}</h2>
                                      <h3 style="margin: 4px 0; font-size: 14px;">KITCHEN ORDER TICKET</h3>
                                        <div style="font-size: 14px;">KOT No: KOT-${Math.floor(Math.random() * 1000)}</div>
                                      </div>
                                      
                                      <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 12px;">
                                        <div>Table: ${table}</div>
                                        <div>${new Date().toLocaleString()}</div>
                                      </div>
                                      
                                      <table style="width: 100%; border-collapse: collapse; margin-bottom: 8px; font-size: 12px;">
                                        <tr style="border-bottom: 2px solid #000;">
                                          <th style="text-align: left; padding: 4px;">Item</th>
                                          <th style="text-align: center; padding: 4px;">Qty</th>
                                        </tr>
                                        ${tableOrders.map(order => {
                                          const [qty, ...itemNameParts] = order.items.split('x ');
                                          const itemName = itemNameParts.join('x ').trim();
                                          return `
                                            <tr style="border-bottom: 1px solid #eee;">
                                              <td style="text-align: left; padding: 4px;">${itemName}</td>
                                              <td style="text-align: center; padding: 4px;">${qty}</td>
                                            </tr>
                                          `;
                                        }).join('')}
                                      </table>
                                    </div>
                                    
                                  `;
                                  const kotWindow = window.open('', '_blank');
                                  kotWindow.document.write(`<pre>${kotContent}</pre>`);
                                  kotWindow.document.close();
                                  kotWindow.print();
                                }
                              }}
                            >
                              {kotPrinted.has(table) ? 'KOT Printed' : 'Print KOT'}
                            </button>
                            <button 
                              className={`btn-payment ${paidTables.has(table) ? 'printed' : 'print'}`}
                              onClick={() => {
                              if (!paidTables.has(table)) {
                                setPaidTables(prev => {
                                  const newSet = new Set(prev);
                                  newSet.add(table);
                                  return newSet;
                                });
                                const printContent = `
                                  <div style="font-family: Arial, sans-serif; max-width: 300px; padding: 8px; border: 1px solid #ccc; font-size: 10px;">
                                    <div style="text-align: center; margin-bottom: 8px;">
                                      <div style="border: 1px dashed #ccc; padding: 4px; display: inline-block; margin-bottom: 4px; font-size: 12px;">Your Logo</div>
                                      <h2 style="margin: 4px 0; font-size: 14px;">${restaurantName}</h2>
                                      <div style="color: #666; font-size: 8px;">GST - 12345WERTYU</div>
                                      <div style="color: #666; font-size: 8px; margin-bottom: 4px;">FSSAI - ABC123ARPIT</div>
                                      <div style="font-weight: bold; font-size: 12px; color: #333; margin-bottom: 4px;">
                                        ${table.startsWith('AC') ? 'AC Section' : 'Non-AC Section'}
                                      </div>
                                    </div>
                                    
                                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 9px;">
                                      <div>Token no. ${Math.floor(Math.random() * 100)}</div>
                                      <div>${new Date().toLocaleString()}</div>
                                    </div>
                                    
                                    <div style="margin-bottom: 4px; font-size: 9px;">Table: ${table}</div>
                                    
                                    <table style="width: 100%; border-collapse: collapse; margin-bottom: 8px; font-size: 9px;">
                                      <tr style="border-bottom: 1px solid #ccc;">
                                        <th style="text-align: left; padding: 2px;">Item</th>
                                        <th style="text-align: center; padding: 2px;">Qty</th>
                                        <th style="text-align: right; padding: 2px;">Price</th>
                                        <th style="text-align: right; padding: 2px;">Amt</th>
                                      </tr>
                                      ${tableOrders.map(order => {
                                        const [qty, ...itemNameParts] = order.items.split('x ');
                                        const itemName = itemNameParts.join('x ').trim();
                                        const unitPrice = (order.price / parseInt(qty)).toFixed(2);
                                        return `
                                          <tr style="border-bottom: 1px solid #eee;">
                                            <td style="text-align: left; padding: 2px;">${itemName}</td>
                                            <td style="text-align: center; padding: 2px;">${qty}</td>
                                            <td style="text-align: right; padding: 2px;">₹${unitPrice}</td>
                                            <td style="text-align: right; padding: 2px;">₹${order.price.toFixed(2)}</td>
                                          </tr>
                                        `;
                                      }).join('')}
                                    </table>
                                    
                                    <div style="border-top: 1px solid #ccc; padding-top: 4px; font-size: 9px;">
                                      <div style="display: flex; justify-content: space-between; margin-bottom: 2px;">
                                        <div>Sub-total:</div>
                                        <div>₹${tableOrders.reduce((sum, order) => sum + order.price, 0).toFixed(2)}</div>
                                      </div>
                                      ${table.startsWith('AC') ? `
                                      <div style="display: flex; justify-content: space-between; margin-bottom: 2px; color: #666;">
                                        <div>AC Charges (10%):</div>
                                        <div>₹${(tableOrders.reduce((sum, order) => sum + order.price, 0) * 0.10).toFixed(2)}</div>
                                      </div>
                                      ` : ''}
                                      <div style="display: flex; justify-content: space-between; font-weight: bold; margin-top: 4px;">
                                        <div>Grand Total:</div>
                                        <div>₹${(tableOrders.reduce((sum, order) => sum + order.price, 0) * (table.startsWith('AC') ? 1.10 : 1)).toFixed(2)}</div>
                                      </div>
                                    </div>
                                    
                                    <div style="text-align: center; margin-top: 8px; font-size: 8px;">
                                      Thank you for dining with us!
                                    </div>
                                  </div>
                                `;
                                const printWindow = window.open('', '_blank');
                                printWindow.document.write(`<pre>${printContent}</pre>`);
                                printWindow.document.close();
                                printWindow.print();
                              }
                            }}
                          >
                            {paidTables.has(table) ? 'Printed' : 'print'}
                          </button>
                        </td>
                        
                      </tr>
                    </tbody>
                  </table>
                )}
              
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default ActiveOrders;