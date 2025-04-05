'use client'

import React from 'react'
import '../admin.css'

const CategoriesPage = () => {
  return (
    <div>
      <h1 className="admin-section-title">Category Management</h1>
      
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Slug</th>
              <th>Description</th>
              <th>Post Count</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>Programming</td>
              <td>programming</td>
              <td>Articles about programming and software development</td>
              <td>150</td>
              <td>
                <button className="admin-action-btn edit">Edit</button>
                <button className="admin-action-btn delete">Delete</button>
              </td>
            </tr>
            <tr>
              <td>2</td>
              <td>Web Design</td>
              <td>web-design</td>
              <td>Articles about web design and UI/UX</td>
              <td>75</td>
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

export default CategoriesPage 