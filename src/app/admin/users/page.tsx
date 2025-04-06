'use client'

import React, { useState, useEffect } from 'react'
 
import axios, { AxiosError } from 'axios'
import './UserAdmin.css'

interface User {
  id: number
  userid: number
  name: string
  username: string
  email: string
  birthday: string
  gender: string
  isblock: boolean
  createdAt: number
  updatedAt: number
  avatar: string | null
  password?: string
}

interface EditModalProps {
  user: User
  onClose: () => void
  onSave: (updatedUser: User) => void
}

const EditModal: React.FC<EditModalProps> = ({ user, onClose, onSave }) => {
  const [editedUser, setEditedUser] = useState<User>({ ...user })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setEditedUser(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if (name === 'newPassword') {
      setNewPassword(value)
    } else if (name === 'confirmPassword') {
      setConfirmPassword(value)
    }
  }

  const validatePasswords = () => {
    if (newPassword && newPassword !== confirmPassword) {
      setPasswordError('Mật khẩu xác nhận không khớp')
      return false
    }
    if (newPassword && newPassword.length < 6) {
      setPasswordError('Mật khẩu phải có ít nhất 6 ký tự')
      return false
    }
    setPasswordError('')
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validatePasswords()) {
      return
    }
    
    setLoading(true)
    setError('')

    try {
      // Cập nhật thời gian
      const updatedUser = {
        ...editedUser,
        updatedAt: Date.now()
      }
      
      // Nếu có mật khẩu mới, thêm vào dữ liệu cập nhật
      if (newPassword) {
        updatedUser.password = newPassword
      }

      // Gọi API để cập nhật người dùng
      const response = await axios.put(`http://localhost:5001/Users/${user.id}`, updatedUser)

      if (response.status === 200) {
        onSave(response.data)
      } else {
        setError('Không thể cập nhật người dùng')
      }
    } catch (error) {
      console.error('Error updating user:', error)
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{ message: string }>
        setError(axiosError.response?.data?.message || 'Có lỗi xảy ra khi cập nhật người dùng')
      } else {
        setError('Có lỗi xảy ra khi cập nhật người dùng')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Chỉnh sửa người dùng</h2>
          <button className="close-button" onClick={onClose}>&times;</button>
        </div>
        <div className="modal-body">
          {error && <div className="error-message">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Tên</label>
              <input
                type="text"
                id="name"
                name="name"
                value={editedUser.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="username">Tên đăng nhập</label>
              <input
                type="text"
                id="username"
                name="username"
                value={editedUser.username}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={editedUser.email}
                disabled
                className="disabled-input"
              />
              <small className="text-muted">Email không thể thay đổi</small>
            </div>
            <div className="form-group">
              <label htmlFor="birthday">Ngày sinh</label>
              <input
                type="date"
                id="birthday"
                name="birthday"
                value={editedUser.birthday.split('T')[0]}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="gender">Giới tính</label>
              <select
                id="gender"
                name="gender"
                value={editedUser.gender}
                onChange={handleInputChange}
                required
              >
                <option value="male">Nam</option>
                <option value="female">Nữ</option>
                <option value="other">Khác</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="newPassword">Mật khẩu mới (để trống nếu không muốn thay đổi)</label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={newPassword}
                onChange={handlePasswordChange}
                placeholder="Nhập mật khẩu mới"
              />
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword">Xác nhận mật khẩu mới</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={confirmPassword}
                onChange={handlePasswordChange}
                placeholder="Nhập lại mật khẩu mới"
              />
              {passwordError && <div className="error-message">{passwordError}</div>}
            </div>
            <div className="modal-footer">
              <button type="button" className="cancel-button" onClick={onClose}>
                Hủy
              </button>
              <button type="submit" className="save-button" disabled={loading}>
                {loading ? 'Đang lưu...' : 'Lưu'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await axios.get('http://localhost:5001/Users')
      setUsers(response.data)
    } catch (error) {
      console.error('Error fetching users:', error)
      setError('Không thể tải danh sách người dùng')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (user: User) => {
    setSelectedUser(user)
    setShowEditModal(true)
  }

  const handleSaveEdit = (updatedUser: User) => {
    setUsers(prevUsers => 
      prevUsers.map(user => 
        user.id === updatedUser.id ? updatedUser : user
      )
    )
    setShowEditModal(false)
    setSelectedUser(null)
  }

  const handleToggleBlock = async (user: User) => {
    try {
      const updatedUser = {
        ...user,
        isblock: !user.isblock,
        updatedAt: Date.now()
      }
      
      const response = await axios.put(`http://localhost:5001/Users/${user.id}`, updatedUser)
      
      if (response.status === 200) {
        setUsers(prevUsers => 
          prevUsers.map(u => 
            u.id === user.id ? updatedUser : u
          )
        )
        alert(`Đã ${updatedUser.isblock ? 'khóa' : 'mở khóa'} người dùng ${user.name}`)
      }
    } catch (error) {
      console.error('Error toggling user block status:', error)
      alert('Có lỗi xảy ra khi thay đổi trạng thái người dùng')
    }
  }

  const handleDelete = async (user: User) => {
    // Confirm before deleting
    if (!window.confirm(`Bạn có chắc chắn muốn xóa người dùng ${user.name}?`)) {
      return
    }

    try {
      // Sử dụng phương thức DELETE và đường dẫn phù hợp với API
      const response = await axios.delete(`http://localhost:5001/Users/${user.id || user.userid}`)
      
      if (response.status === 200) {
        // Remove the deleted user from the state
        setUsers((prevUsers) => prevUsers.filter((u) => (u.id || u.userid) !== (user.id || user.userid)))
        
        // Show success message
        alert('Xóa người dùng thành công')
      }
    } catch (error) {
      console.error('Error deleting user:', error)
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{ message: string }>
        alert(axiosError.response?.data?.message || 'Có lỗi xảy ra khi xóa người dùng')
      } else {
        alert('Có lỗi xảy ra khi xóa người dùng')
      }
    }
  }

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
              <th>Trạng thái</th>
              <th>Khóa/Mở khóa</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id || user.userid}>
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
                  <span className={`status-badge ${user.isblock ? 'blocked' : 'active'}`}>
                    {user.isblock ? 'Đã khóa' : 'Đang hoạt động'}
                  </span>
                </td>
                <td>
                  <button 
                    className={`toggle-block-btn ${user.isblock ? 'unblock' : 'block'}`}
                    onClick={() => handleToggleBlock(user)}
                  >
                    {user.isblock ? 'Mở khóa' : 'Khóa'}
                  </button>
                </td>
                <td>
                  <div className="action-buttons">
                    <button 
                      className="admin-action-btn edit"
                      onClick={() => handleEdit(user)}
                    >
                      Sửa
                    </button>
                    <button 
                      className="admin-action-btn delete"
                      onClick={() => handleDelete(user)}
                    >
                      Xóa
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showEditModal && selectedUser && (
        <EditModal
          user={selectedUser}
          onClose={() => {
            setShowEditModal(false)
            setSelectedUser(null)
          }}
          onSave={handleSaveEdit}
        />
      )}
    </div>
  )
}

 

// Thêm style vào document
 
export default UsersPage 