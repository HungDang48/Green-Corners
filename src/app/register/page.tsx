'use client'

import React, { useState } from 'react'
import { Container, Form, Button, Card, Alert } from 'react-bootstrap'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { sendRequest } from '@/app/Utils/api'
import './register.css'

interface RegisterFormData {
  name: string
  username: string
  email: string
  password: string
  confirmPassword: string
  birthday: string
  gender: string
}

interface UserResponse {
  id: number
  name: string
  username: string
  email: string
  birthday: string
  gender: string
  createdAt: string
  updatedAt: string
}

const RegisterPage = () => {
  const router = useRouter()
  const [formData, setFormData] = useState<RegisterFormData>({
    name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    birthday: '',
    gender: 'male'
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const validateForm = () => {
    if (!formData.name || !formData.username || !formData.email || !formData.password || !formData.confirmPassword || !formData.birthday) {
      setError('Vui lòng điền đầy đủ thông tin')
      return false
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp')
      return false
    }

    if (formData.password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự')
      return false
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setError('Email không hợp lệ')
      return false
    }

    return true
  }

  const checkEmailExists = async (email: string): Promise<boolean> => {
    try {
      // Lấy danh sách tất cả người dùng
      const response = await sendRequest<UserResponse[]>({
        url: 'http://localhost:5000/Users',
        method: 'GET'
      })
      
      if (!('statusCode' in response)) {
        // Kiểm tra xem email đã tồn tại chưa
        return response.some(user => user.email.toLowerCase() === email.toLowerCase())
      }
      
      return false
    } catch (error) {
      console.error('Error checking email:', error)
      return false
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    try {
      setLoading(true)
      setError('')
      setSuccess('')
      
      // Kiểm tra email đã tồn tại chưa
      const emailExists = await checkEmailExists(formData.email)
      if (emailExists) {
        setError('Email này đã được sử dụng. Vui lòng sử dụng email khác.')
        setLoading(false)
        return
      }
      
      // Prepare data for API
      const userData = {
        name: formData.name,
        username: formData.username,
        email: formData.email,
        password: formData.password,
        birthday: new Date(formData.birthday).toISOString(),
        gender: formData.gender,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      
      // Send registration request
      const response = await sendRequest<UserResponse>({
        url: 'http://localhost:5000/Users',
        method: 'POST',
        body: userData
      })
      
      if (!('statusCode' in response)) {
        setSuccess('Đăng ký thành công! Bạn có thể đăng nhập ngay bây giờ.')
        // Clear form
        setFormData({
          name: '',
          username: '',
          email: '',
          password: '',
          confirmPassword: '',
          birthday: '',
          gender: 'male'
        })
        // Redirect to login page after 2 seconds
        setTimeout(() => {
          router.push('/login')
        }, 2000)
      } else {
        setError('Đăng ký thất bại. Vui lòng thử lại.')
      }
    } catch (error) {
      console.error('Error during registration:', error)
      setError('Có lỗi xảy ra khi đăng ký. Vui lòng thử lại sau.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container className="register-container">
      <Card className="register-card">
        <Card.Header className="register-header">
          <h2>Đăng ký tài khoản</h2>
        </Card.Header>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}
          
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Họ và tên</Form.Label>
              <Form.Control 
                type="text" 
                name="name"
                value={formData.name} 
                onChange={handleInputChange}
                placeholder="Nhập họ và tên của bạn"
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Tên người dùng</Form.Label>
              <Form.Control 
                type="text" 
                name="username"
                value={formData.username} 
                onChange={handleInputChange}
                placeholder="Chọn tên người dùng"
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control 
                type="email" 
                name="email"
                value={formData.email} 
                onChange={handleInputChange}
                placeholder="Nhập email của bạn"
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Mật khẩu</Form.Label>
              <Form.Control 
                type="password" 
                name="password"
                value={formData.password} 
                onChange={handleInputChange}
                placeholder="Tạo mật khẩu"
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Xác nhận mật khẩu</Form.Label>
              <Form.Control 
                type="password" 
                name="confirmPassword"
                value={formData.confirmPassword} 
                onChange={handleInputChange}
                placeholder="Nhập lại mật khẩu"
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
                <option value="male">Nam</option>
                <option value="female">Nữ</option>
                <option value="other">Khác</option>
              </Form.Select>
            </Form.Group>
            
            <div className="d-grid gap-2">
              <Button variant="primary" type="submit" disabled={loading}>
                {loading ? 'Đang đăng ký...' : 'Đăng ký'}
              </Button>
            </div>
            
            <div className="text-center mt-3">
              <p>Đã có tài khoản? <Link href="/login">Đăng nhập</Link></p>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  )
}

export default RegisterPage 