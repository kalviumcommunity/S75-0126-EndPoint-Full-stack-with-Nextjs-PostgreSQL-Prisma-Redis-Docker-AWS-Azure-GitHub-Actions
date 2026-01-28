import React from 'react';

const DashboardPage: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Business Dashboard</h1>
      <p className="mb-6 text-gray-600 dark:text-gray-300">Welcome to your business dashboard!</p>

      {/* Example: Stats or widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-300">Total Users</h2>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">123</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-300">Total Businesses</h2>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">45</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-300">Revenue</h2>
          <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">$12,345</p>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-300">Recent Activity</h2>
        <ul className="space-y-3">
          <li className="flex items-center justify-between border-b pb-2">
            <span>New user registered</span>
            <span className="text-sm text-gray-500">2 min ago</span>
          </li>
          <li className="flex items-center justify-between border-b pb-2">
            <span>Payment received</span>
            <span className="text-sm text-gray-500">1 hour ago</span>
          </li>
          <li className="flex items-center justify-between">
            <span>Business updated</span>
            <span className="text-sm text-gray-500">3 hours ago</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default DashboardPage;
