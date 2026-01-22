import React from 'react';

const DashboardPage: React.FC = () => {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Dashboard</h1>
      <p>Welcome to your dashboard!</p>

      {/* Example: Stats or widgets */}
      <div style={{ marginTop: '1rem' }}>
        <div style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '1rem' }}>
          <h2>Total Users</h2>
          <p>123</p>
        </div>
        <div style={{ border: '1px solid #ccc', padding: '1rem' }}>
          <h2>Total Businesses</h2>
          <p>45</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
