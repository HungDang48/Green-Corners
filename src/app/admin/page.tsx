'use client'

import React from 'react'
import './admin.css'

const AdminDashboard = () => {
  return (
    <div>
      <div className="admin-stats">
        <div className="admin-stat-card">
          <div className="admin-stat-title">Total Users</div>
          <div className="admin-stat-value">1,234</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-title">Total Posts</div>
          <div className="admin-stat-value">5,678</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-title">Total Categories</div>
          <div className="admin-stat-value">45</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-title">Total Comments</div>
          <div className="admin-stat-value">12,345</div>
        </div>
      </div>

      <div className="admin-recent-activity">
        <h2 className="admin-section-title">Recent Activity</h2>
        <ul className="admin-activity-list">
          <li className="admin-activity-item">
            <div className="admin-activity-icon">👤</div>
            <div className="admin-activity-content">
              <div className="admin-activity-title">New user registered</div>
              <div className="admin-activity-time">2 minutes ago</div>
            </div>
          </li>
          <li className="admin-activity-item">
            <div className="admin-activity-icon">📝</div>
            <div className="admin-activity-content">
              <div className="admin-activity-title">New post created</div>
              <div className="admin-activity-time">15 minutes ago</div>
            </div>
          </li>
          <li className="admin-activity-item">
            <div className="admin-activity-icon">💬</div>
            <div className="admin-activity-content">
              <div className="admin-activity-title">New comment added</div>
              <div className="admin-activity-time">30 minutes ago</div>
            </div>
          </li>
          <li className="admin-activity-item">
            <div className="admin-activity-icon">📊</div>
            <div className="admin-activity-content">
              <div className="admin-activity-title">System update completed</div>
              <div className="admin-activity-time">1 hour ago</div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default AdminDashboard 