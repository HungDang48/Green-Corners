'use client'

import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Form, Button, Card, Alert } from 'react-bootstrap'
import { useRouter } from 'next/navigation'
import { sendRequest } from '@/app/Utils/api'
import ProfileImageUpload from '@/components/profile/ProfileImageUpload'
import './edit-profile.css'

interface UserData {
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
  bio?: string
  password?: string
}

const EditProfilePage = () => {
  const router = useRouter()
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    birthday: '',
    gender: '',
    bio: ''
  })
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('user')
    if (!storedUser) {
      router.push('/login')
      return
    }

    // Get user data from localStorage
    const parsedUser = JSON.parse(storedUser)
    // Kiểm tra nếu parsedUser là một mảng
    const userData = Array.isArray(parsedUser) ? parsedUser[0] : parsedUser
    
    // Fetch complete user data from API
    fetchUserData(userData.id)
  }, [router])

  const fetchUserData = async (userId: number) => {
    try {
      setLoading(true)
      const response = await fetch(`http://localhost:5001/Users?userid=${userId}`)
      
      if (!response.ok) {
        throw new Error('Không thể tải thông tin người dùng')
      }

      const data = await response.json()
      if (data.length === 0) {
        throw new Error('Không tìm thấy thông tin người dùng')
      }

      const user = data[0]
      setUserData(user)
      setFormData({
        name: user.name || '',
        username: user.username || '',
        email: user.email || '',
        birthday: user.birthday || '',
        gender: user.gender || '',
        bio: user.bio || ''
      })
    } catch (error) {
      console.error('Error fetching user data:', error)
      setError('Có lỗi xảy ra khi tải thông tin người dùng')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if (name === 'currentPassword') {
      setCurrentPassword(value)
    } else if (name === 'newPassword') {
      setNewPassword(value)
    } else if (name === 'confirmPassword') {
      setConfirmPassword(value)
    }
  }

  const validatePasswords = () => {
    if (newPassword && newPassword.length < 6) {
      setPasswordError('Mật khẩu phải có ít nhất 6 ký tự')
      return false
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Mật khẩu xác nhận không khớp')
      return false
    }
    if (newPassword && currentPassword !== userData?.password) {
      setPasswordError('Mật khẩu hiện tại không chính xác')
      return false
    }
    setPasswordError('')
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!userData) return
    
    try {
      // Validate passwords if they are being changed
      if (newPassword && !validatePasswords()) {
        return
      }

      setLoading(true)
      setError('')
      setSuccess('')
      
      // Prepare the update data according to API structure
      const updateData = {
        id: userData.id,
        userid: userData.userid,
        name: formData.name,
        username: formData.username,
        email: formData.email,
        birthday: formData.birthday,
        gender: formData.gender,
        bio: formData.bio,
        password: newPassword || userData.password, // Use new password if provided
        isblock: userData.isblock,
        createdAt: userData.createdAt,
        updatedAt: Date.now(),
        avatar: userData.avatar
      }

      console.log('Sending update data:', updateData)

      const response = await fetch(`http://localhost:5001/Users/${userData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Không thể cập nhật thông tin')
      }

      const updatedUser = await response.json()
      console.log('Received updated user:', updatedUser)

      // Update state with new data
      setUserData(prev => ({
        ...prev!,
        ...updateData
      }))
      setSuccess('Cập nhật thông tin thành công')
      
      // Update localStorage with new user data
      const storedUser = localStorage.getItem('user')
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser)
        if (Array.isArray(parsedUser)) {
          parsedUser[0] = {
            ...parsedUser[0],
            id: updateData.id,
            email: updateData.email,
            avatar: updateData.avatar
          }
        } else {
          parsedUser.id = updateData.id
          parsedUser.email = updateData.email
          parsedUser.avatar = updateData.avatar
        }
        localStorage.setItem('user', JSON.stringify(parsedUser))
      }

      // Reset password fields
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setPasswordError('')

      // Redirect to profile page after successful update
      setTimeout(() => {
        router.push('/profile')
      }, 1500)
    } catch (error) {
      console.error('Error updating user data:', error)
      setError(error instanceof Error ? error.message : 'Có lỗi xảy ra khi cập nhật thông tin')
    } finally {
      setLoading(false)
    }
  }

  const handleAvatarUploadSuccess = (newAvatarUrl: string) => {
    if (userData) {
      // Update local state
      setUserData(prev => ({
        ...prev!,
        avatar: newAvatarUrl
      }))
      
      // Update form data
      setFormData(prev => ({
        ...prev,
        avatar: newAvatarUrl
      }))
      
      // Update localStorage
      const storedUser = localStorage.getItem('user')
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser)
        if (Array.isArray(parsedUser)) {
          parsedUser[0].avatar = newAvatarUrl
        } else {
          parsedUser.avatar = newAvatarUrl
        }
        localStorage.setItem('user', JSON.stringify(parsedUser))
      }
      
      setSuccess('Cập nhật ảnh đại diện thành công')
    }
  }

  const handleBackToProfile = () => {
    router.push('/profile')
  }

  if (loading && !userData) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Đang tải thông tin...</p>
      </div>
    )
  }

  if (error && !userData) {
    return (
      <Container className="error-container">
        <Alert variant="danger">{error}</Alert>
        <Button variant="primary" onClick={() => router.push('/')}>
          Quay lại trang chủ
        </Button>
      </Container>
    )
  }

  return (
    <Container className="edit-profile-container">
      <Card className="edit-profile-card">
        <Card.Header className="edit-profile-header">
          <h2>Chỉnh sửa trang cá nhân</h2>
        </Card.Header>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}
          
          <Row>
            <Col md={4} className="mb-4">
              <div className="avatar-section">
                <h4>Ảnh đại diện</h4>
                {userData && (
                  <ProfileImageUpload 
                    userId={userData.id}
                    currentAvatar={userData.avatar}
                    onUploadSuccess={handleAvatarUploadSuccess}
                  />
                )}
              </div>
            </Col>
            
            <Col md={8}>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control 
                    type="email" 
                    name="email"
                    value={formData.email} 
                    disabled
                    className="disabled-input"
                  />
                  <small className="text-muted">Email không thể thay đổi</small>
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Họ và tên</Form.Label>
                  <Form.Control 
                    type="text" 
                    name="name"
                    value={formData.name} 
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Tên đăng nhập</Form.Label>
                  <Form.Control 
                    type="text" 
                    name="username"
                    value={formData.username} 
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Ngày sinh</Form.Label>
                  <Form.Control 
                    type="date" 
                    name="birthday"
                    value={formData.birthday} 
                    onChange={handleInputChange}
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Giới tính</Form.Label>
                  <Form.Select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                  >
                    <option value="">Chọn giới tính</option>
                    <option value="male">Nam</option>
                    <option value="female">Nữ</option>
                    <option value="other">Khác</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Tiểu sử</Form.Label>
                  <Form.Control 
                    as="textarea" 
                    rows={4}
                    name="bio"
                    value={formData.bio} 
                    onChange={handleInputChange}
                    placeholder="Viết tiểu sử của bạn ở đây..."
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Mật khẩu hiện tại</Form.Label>
                  <Form.Control 
                    type="password" 
                    name="currentPassword"
                    value={currentPassword} 
                    onChange={handlePasswordChange}
                    placeholder="Nhập mật khẩu hiện tại"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Mật khẩu mới</Form.Label>
                  <Form.Control 
                    type="password" 
                    name="newPassword"
                    value={newPassword} 
                    onChange={handlePasswordChange}
                    placeholder="Nhập mật khẩu mới (để trống nếu không muốn thay đổi)"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Xác nhận mật khẩu mới</Form.Label>
                  <Form.Control 
                    type="password" 
                    name="confirmPassword"
                    value={confirmPassword} 
                    onChange={handlePasswordChange}
                    placeholder="Nhập lại mật khẩu mới"
                  />
                  {passwordError && (
                    <small className="text-danger">{passwordError}</small>
                  )}
                </Form.Group>
                
                <div className="d-flex justify-content-between">
                  <Button variant="secondary" onClick={handleBackToProfile}>
                    Quay lại
                  </Button>
                  <Button variant="primary" type="submit" disabled={loading}>
                    {loading ? 'Đang cập nhật...' : 'Lưu thay đổi'}
                  </Button>
                </div>
              </Form>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  )
}

export default EditProfilePage 