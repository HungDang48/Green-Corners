'use client'

import React from 'react'
import '../admin.css'

const UsersPage = () => {
  return (
    <div>
      <h1 className="admin-section-title">User Management</h1>
      
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>   
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>john_doe</td>
              <td>john@example.com</td>
              <td>User</td>
              <td>Active</td>
              <td>
                <button className="admin-action-btn edit">Edit</button>
                <button className="admin-action-btn delete">Delete</button>
              </td>
            </tr>
            <tr>
              <td>2</td>
              <td>jane_smith</td>
              <td>jane@example.com</td>
              <td>Admin</td>
              <td>Active</td>
              <td>
                <button className="admin-action-btn edit">Edit</button>
                <button className="admin-action-btn delete">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default UsersPage 