'use client'

import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Form, Button, Card, Alert } from 'react-bootstrap'
import { useRouter } from 'next/navigation'
import { sendRequest } from '@/app/Utils/api'
import ProfileImageUpload from '@/components/profile/ProfileImageUpload'
import './edit-profile.css'

interface UserData {
  userId: number
  name: string
  username: string
  email: string
  birthday: string
  gender: string
  createdAt: number
  updatedAt: number
  avatar?: string
  bio?: string
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

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('user')
    if (!storedUser) {
      router.push('/login')
      return
    }

    // Get user data from localStorage
    const parsedUser = JSON.parse(storedUser)[0]
    
    // Fetch complete user data from API
    fetchUserData(parsedUser.userId)
  }, [router])

  const fetchUserData = async (userId: number) => {
    try {
      setLoading(true)
      const response = await fetch(`http://localhost:5000/Users?userId=${userId}`)
      
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!userData) return
    
    try {
      setLoading(true)
      setError('')
      setSuccess('')
      
      const response = await fetch(`http://localhost:5000/Users/${userData.userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...userData,
          ...formData,
          updatedAt: Date.now()
        })
      })
      
      if (!response.ok) {
        throw new Error('Không thể cập nhật thông tin')
      }

      const updatedUser = await response.json()
      setUserData(updatedUser)
      setSuccess('Cập nhật thông tin thành công')
    } catch (error) {
      console.error('Error updating user data:', error)
      setError('Có lỗi xảy ra khi cập nhật thông tin')
    } finally {
      setLoading(false)
    }
  }

  const handleAvatarUploadSuccess = (newAvatarUrl: string) => {
    if (userData) {
      setUserData({
        ...userData,
        avatar: newAvatarUrl
      })
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
                    userId={userData.userId}
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
                    onChange={handleInputChange}
                    required
                  />
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