'use client'

import React from 'react'
import '../admin.css'

const PostsPage = () => {
  return (
    <div>
      <h1 className="admin-section-title">Post Management</h1>
      
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Author</th>
              <th>Category</th>
              <th>Status</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>Getting Started with React</td>
              <td>john_doe</td>
              <td>Programming</td>
              <td>Published</td>
              <td>2024-03-15</td>
              <td>
                <button className="admin-action-btn edit">Edit</button>
                <button className="admin-action-btn delete">Delete</button>
              </td>
            </tr>
            <tr>
              <td>2</td>
              <td>Advanced CSS Techniques</td>
              <td>jane_smith</td>
              <td>Web Design</td>
              <td>Draft</td>
              <td>2024-03-14</td>
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

export default PostsPage 