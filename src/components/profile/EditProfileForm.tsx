'use client'

import React, { useState, useEffect } from 'react'
import { Form, Button, Modal, Alert } from 'react-bootstrap'
import './profile.css'

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
  password?: string
}

interface EditProfileFormProps {
  userData: UserData
  show: boolean
  onHide: () => void
  onSave: (updatedUser: UserData) => void
}

const EditProfileForm: React.FC<EditProfileFormProps> = ({
  userData,
  show,
  onHide,
  onSave
}) => {
  const [formData, setFormData] = useState<UserData>(userData)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    setFormData(userData)
  }, [userData])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Update user data
      const response = await fetch(`http://localhost:5000/Users/${userData.userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          userId: userData.userId,
          password: userData.password,
          createdAt: userData.createdAt,
          updatedAt: Date.now(),
          avatar: userData.avatar
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Có lỗi xảy ra khi cập nhật thông tin')
      }

      const updatedUser = await response.json() as UserData
      
      // Call the success callback with updated user data
      onSave(updatedUser)
      onHide()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi cập nhật thông tin')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Chỉnh sửa trang cá nhân</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && (
          <Alert variant="danger" className="mb-3">
            {error}
          </Alert>
        )}
        
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Họ và tên</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Tên người dùng</Form.Label>
            <Form.Control
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Ngày sinh</Form.Label>
            <Form.Control
              type="date"
              name="birthday"
              value={formData.birthday}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Giới tính</Form.Label>
            <Form.Select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
            >
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
              value={formData.bio || ''}
              onChange={handleChange}
              placeholder="Viết tiểu sử của bạn ở đây..."
            />
          </Form.Group>

          <div className="d-flex justify-content-end gap-2">
            <Button variant="secondary" onClick={onHide} disabled={loading}>
              Hủy
            </Button>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  )
}

export default EditProfileForm 