'use client'

import React, { useState, useRef } from 'react'
import { Button, Image } from 'react-bootstrap'
import { FaCamera } from 'react-icons/fa'
import './ProfileImageUpload.css'

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
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(currentAvatar)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Create preview URL
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string)
    }
    reader.readAsDataURL(file)

    // Upload file
    await handleUpload(file)
  }

  const handleUpload = async (file: File) => {
    try {
      setIsUploading(true)
      
      const formData = new FormData()
      formData.append('image', file)
      formData.append('userId', userId.toString())

      const response = await fetch('http://localhost:5000/upload-avatar', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const data = await response.json()
      onUploadSuccess(data.avatarUrl)
    } catch (error) {
      console.error('Error uploading avatar:', error)
      alert('Có lỗi xảy ra khi tải lên ảnh đại diện')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="profile-image-upload">
      <div className="image-container" onClick={handleImageClick}>
        {previewUrl ? (
          <Image src={previewUrl} alt="Profile" roundedCircle className="profile-image" />
        ) : (
          <div className="placeholder-image">
            <FaCamera size={24} />
          </div>
        )}
        <div className="overlay">
          <FaCamera size={24} />
          <span>Thay đổi ảnh</span>
        </div>
      </div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        style={{ display: 'none' }}
      />
      {isUploading && <div className="uploading-indicator">Đang tải lên...</div>}
    </div>
  )
}

export default ProfileImageUpload 