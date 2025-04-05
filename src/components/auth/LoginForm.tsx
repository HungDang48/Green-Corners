'use client'

import React, { useState } from 'react'
import { Form, Button, Container, Card, Alert } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import './auth.css'
import { useAuth } from '@/context/AuthContext'

const LoginForm = () => {
  const router = useRouter()
  const { login } = useAuth()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Fetch users from JSON Server
      const response = await fetch('http://localhost:5000/Users')
      const users = await response.json()
      
      // Find user with matching email and password
      const user = users.find((u: any) => 
        u.email === formData.email && u.password === formData.password
      )

      if (user) {
        // Create user array with id, email, and avatar
        const userData = [{
          id: user.id,
          email: user.email,
          avatar: user.avatar || null
        }]
        
        // Store user array in localStorage
        localStorage.setItem('user', JSON.stringify(userData))
        
        // Update auth context with rememberMe option
        login(formData.rememberMe)
        
        // Redirect to home page
        router.push('/')
      } else {
        setError('Email hoặc mật khẩu không chính xác')
      }
    } catch (err) {
      setError('Có lỗi xảy ra khi đăng nhập. Vui lòng thử lại sau.')
      console.error('Login error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container className="auth-container">
      <Card className="auth-card">
        <Card.Body>
          <h2 className="text-center mb-4">Đăng Nhập</h2>
          
          {error && (
            <Alert variant="danger" className="mb-3">
              {error}
            </Alert>
          )}
          
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Nhập email của bạn"
                required
                disabled={loading}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Mật khẩu</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Nhập mật khẩu"
                required
                disabled={loading}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                label="Ghi nhớ đăng nhập"
                disabled={loading}
              />
            </Form.Group>

            <Button 
              variant="primary" 
              type="submit" 
              className="w-100 mb-3"
              disabled={loading}
            >
              {loading ? 'Đang đăng nhập...' : 'Đăng Nhập'}
            </Button>

            <div className="text-center">
              <p>
                Chưa có tài khoản?{' '}
                <Link href="/register" className="auth-link">
                  Đăng ký ngay
                </Link>
              </p>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  )
}

export default LoginForm 