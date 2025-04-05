'use client'

import React, { useState } from 'react'
import { Button, Alert } from 'react-bootstrap'
import { sendRequest } from '@/app/Utils/api'
import './profile.css'

interface ProfileImageUploadProps {
  userId: number
  currentAvatar?: string
  onUploadSuccess: (newAvatarUrl: string) => void
}

const ProfileImageUpload: React.FC<ProfileImageUploadProps> = ({
  userId,
  currentAvatar,
  onUploadSuccess
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>(currentAvatar || '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError('Kích thước file không được vượt quá 5MB')
        return
      }
      if (!file.type.startsWith('image/')) {
        setError('File phải là hình ảnh')
        return
      }
      setSelectedFile(file)
      setPreviewUrl(URL.createObjectURL(file))
      setError('')
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Vui lòng chọn ảnh để tải lên')
      return
    }

    setLoading(true)
    setError('')

    try {
      // Convert image to base64
      const reader = new FileReader()
      reader.readAsDataURL(selectedFile)
      
      reader.onload = async () => {
        const base64String = reader.result as string
        
        // First, get the current user data
        const getUserResponse = await sendRequest({
          url: `http://localhost:5000/Users/${userId}`,
          method: 'GET'
        })
        
        if ('statusCode' in getUserResponse) {
          throw new Error('Không thể lấy thông tin người dùng')
        }
        
        // Update user data with the base64 image
        const response = await sendRequest({
          url: `http://localhost:5000/Users/${userId}`,
          method: 'PATCH',
          body: {
            ...getUserResponse,
            avatar: base64String,
            updatedAt: Date.now()
          }
        })

        if ('statusCode' in response) {
          throw new Error(response.message || 'Có lỗi xảy ra khi tải ảnh lên')
        }

        // Call the success callback with the base64 string
        onUploadSuccess(base64String)
        setLoading(false)
      }
      
      reader.onerror = () => {
        setError('Có lỗi xảy ra khi đọc file')
        setLoading(false)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi tải ảnh lên')
      setLoading(false)
    }
  }

  return (
    <div className="profile-image-upload">
      <div className="profile-img-wrapper">
        <img
          src={previewUrl || "https://via.placeholder.com/200"}
          alt="Profile"
          className="profile-img"
        />
      </div>
      
      <div className="upload-controls">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="file-input"
          id="avatar-upload"
        />
        <label htmlFor="avatar-upload" className="upload-label">
          Chọn ảnh
        </label>
        
        {selectedFile && (
          <Button
            onClick={handleUpload}
            disabled={loading}
            className="upload-button"
          >
            {loading ? 'Đang tải lên...' : 'Tải lên'}
          </Button>
        )}
      </div>

      {error && (
        <Alert variant="danger" className="mt-2">
          {error}
        </Alert>
      )}
    </div>
  )
}

export default ProfileImageUpload 