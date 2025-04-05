'use client'

import React, { useState, useEffect } from 'react'
import '../admin.css'

interface User {
  userid: number
  name: string
  username: string
  email: string
  birthday: string
  gender: string
  createdAt: number
  updatedAt: number
  avatar: string | null
}

const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:5000/Users')
        if (!response.ok) {
          throw new Error('Failed to fetch users')
        }
        const data = await response.json()
        setUsers(data)
      } catch (err) {
        setError('Error loading users')
        console.error('Error fetching users:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString()
  }

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="spinner"></div>
        <p>Loading users...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="admin-error">
        <p>{error}</p>
      </div>
    )
  }

  return (
    <div className="admin-users-container">
      <h1 className="admin-section-title">Quản lý người dùng</h1>
      
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Avatar</th>
              <th>Tên</th>
              <th>Username</th>
              <th>Email</th>
              <th>Ngày sinh</th>
              <th>Giới tính</th>
              <th>Ngày tạo</th>
              <th>Thao tác</th>
            </tr>   
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.userid}>
                <td>
                  <div className="user-avatar-cell">
                    {user.avatar ? (
                      <img 
                        src={user.avatar} 
                        alt={`${user.name}'s avatar`}
                        className="user-avatar"
                      />
                    ) : (
                      <div className="avatar-placeholder">
                        <i className="fas fa-user"></i>
                      </div>
                    )}
                  </div>
                </td>
                <td>{user.name}</td>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.birthday}</td>
                <td>{user.gender === 'male' ? 'Nam' : user.gender === 'female' ? 'Nữ' : 'Khác'}</td>
                <td>{formatDate(user.createdAt)}</td>
                <td>
                  <button className="admin-action-btn edit">Sửa</button>
                  <button className="admin-action-btn delete">Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default UsersPage 