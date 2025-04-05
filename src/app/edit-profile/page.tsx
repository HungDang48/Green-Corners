'use client'

import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Form, Button, Card, Alert } from 'react-bootstrap'
import { useRouter } from 'next/navigation'
import { sendRequest } from '@/app/Utils/api'
import ProfileImageUpload from '@/components/profile/ProfileImageUpload'
import './edit-profile.css'

interface UserData {
  id: number;
  email: string;
  fullName?: string;
  phone?: string;
  address?: string;
  avatar?: string;
  description?: string;
  bio?: string;
  createdAt?: string;
  updatedAt?: string;
}

const EditProfilePage = () => {
  const router = useRouter()
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    description: '',
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
    fetchUserData(parsedUser.id)
  }, [router])

  const fetchUserData = async (userId: number) => {
    try {
      setLoading(true)
      const response = await sendRequest<UserData>({
        url: `http://localhost:5000/Users/${userId}`,
        method: 'GET'
      })
      
      if (!('statusCode' in response)) {
        setUserData(response)
        setFormData({
          fullName: response.fullName || '',
          phone: response.phone || '',
          address: response.address || '',
          description: response.description || '',
          bio: response.bio || ''
        })
      } else {
        setError('Không thể tải thông tin người dùng')
      }
    } catch (error) {
      console.error('Error fetching user data:', error)
      setError('Có lỗi xảy ra khi tải thông tin người dùng')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
      
      const response = await sendRequest({
        url: `http://localhost:5000/Users/${userData.id}`,
        method: 'PATCH',
        body: {
          ...userData,
          ...formData,
          updatedAt: new Date().toISOString()
        }
      })
      
      if (!('statusCode' in response)) {
        setUserData(response as UserData)
        setSuccess('Cập nhật thông tin thành công')
      } else {
        setError('Không thể cập nhật thông tin')
      }
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
                    value={userData?.email || ''} 
                    disabled 
                  />
                  <Form.Text className="text-muted">
                    Email không thể thay đổi
                  </Form.Text>
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Họ và tên</Form.Label>
                  <Form.Control 
                    type="text" 
                    name="fullName"
                    value={formData.fullName} 
                    onChange={handleInputChange}
                    placeholder="Nhập họ và tên của bạn"
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Số điện thoại</Form.Label>
                  <Form.Control 
                    type="text" 
                    name="phone"
                    value={formData.phone} 
                    onChange={handleInputChange}
                    placeholder="Nhập số điện thoại của bạn"
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Địa chỉ</Form.Label>
                  <Form.Control 
                    type="text" 
                    name="address"
                    value={formData.address} 
                    onChange={handleInputChange}
                    placeholder="Nhập địa chỉ của bạn"
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Giới thiệu</Form.Label>
                  <Form.Control 
                    as="textarea" 
                    rows={3}
                    name="description"
                    value={formData.description} 
                    onChange={handleInputChange}
                    placeholder="Giới thiệu về bản thân"
                  />
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
                  <Form.Text className="text-muted">
                    Tiểu sử sẽ hiển thị trên trang cá nhân của bạn
                  </Form.Text>
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