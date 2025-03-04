import React from 'react';

const StaffHomePage = ({ darkMode }) => {
  return (
    <div 
      className="staff-home-page"
      style={{ 
        minHeight: '100vh',
        padding: '20px',
        backgroundColor: darkMode ? '#1c2526' : '#fafafa'
      }}
    >
      <div className="staff-content">
        <h1 
          style={{ 
            color: darkMode ? '#ffffff' : '#1d1d1f',
            marginBottom: '20px'
          }}
        >
          Staff Home Page
        </h1>
        
        <div 
          className="staff-dashboard"
          style={{ 
            color: darkMode ? '#a1a1a6' : '#6e6e73'
          }}
        >
          <section className="welcome-section">
            <h2>Welcome, Staff Member!</h2>
            <p>This is your staff dashboard where you can manage your daily tasks.</p>
          </section>

          <section className="quick-links">
            <h3>Quick Actions</h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li style={{ margin: '10px 0' }}>
                <a 
                  href="/inventory" 
                  style={{ color: darkMode ? '#00d4ff' : '#007aff', textDecoration: 'none' }}
                >
                  View Inventory
                </a>
              </li>
              <li style={{ margin: '10px 0' }}>
                <a 
                  href="/schedules" 
                  style={{ color: darkMode ? '#00d4ff' : '#007aff', textDecoration: 'none' }}
                >
                  Check Schedules
                </a>
              </li>
              <li style={{ margin: '10px 0' }}>
                <a 
                  href="/inquiries" 
                  style={{ color: darkMode ? '#00d4ff' : '#007aff', textDecoration: 'none' }}
                >
                  Customer Inquiries
                </a>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};

export default StaffHomePage;