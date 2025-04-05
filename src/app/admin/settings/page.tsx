'use client'

import React from 'react'
import '../admin.css'

const SettingsPage = () => {
  return (
    <div>
      <h1 className="admin-section-title">Settings</h1>
      
      <div className="admin-settings-container">
        <div className="admin-settings-section">
          <h2>General Settings</h2>
          <div className="admin-settings-form">
            <div className="admin-form-group">
              <label>Site Title</label>
              <input type="text" defaultValue="My Blog" />
            </div>
            <div className="admin-form-group">
              <label>Site Description</label>
              <textarea defaultValue="A blog about technology and programming"></textarea>
            </div>
            <div className="admin-form-group">
              <label>Admin Email</label>
              <input type="email" defaultValue="admin@example.com" />
            </div>
          </div>
        </div>

        <div className="admin-settings-section">
          <h2>Appearance</h2>
          <div className="admin-settings-form">
            <div className="admin-form-group">
              <label>Theme</label>
              <select defaultValue="light">
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </div>
            <div className="admin-form-group">
              <label>Primary Color</label>
              <input type="color" defaultValue="#007bff" />
            </div>
          </div>
        </div>

        <div className="admin-settings-section">
          <h2>Security</h2>
          <div className="admin-settings-form">
            <div className="admin-form-group">
              <label>Enable Two-Factor Authentication</label>
              <input type="checkbox" />
            </div>
            <div className="admin-form-group">
              <label>Session Timeout (minutes)</label>
              <input type="number" defaultValue="30" />
            </div>
          </div>
        </div>

        <div className="admin-settings-actions">
          <button className="admin-action-btn save">Save Changes</button>
          <button className="admin-action-btn reset">Reset to Default</button>
        </div>
      </div>
    </div>
  )
}

export default SettingsPage 