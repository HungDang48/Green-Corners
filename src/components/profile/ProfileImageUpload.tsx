'use client'

import React, { useState, useRef } from 'react'
import { Button, Image } from 'react-bootstrap'
import { FaCamera } from 'react-icons/fa'
import './ProfileImageUpload.css'
import axios from 'axios'

interface ProfileImageUploadProps {
  userId: number
  currentAvatar?: string | null
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
      
      // Chuyển đổi file thành base64
      const reader = new FileReader()
      reader.readAsDataURL(file)
      
      reader.onload = async () => {
        try {
          const base64String = reader.result as string
          
          // Cập nhật avatar trực tiếp trong JSON server
          const response = await axios.put(`http://localhost:5001/Users/${userId}`, {
            avatar: base64String
          }, {
            headers: {
              'Content-Type': 'application/json'
            }
          })
          
          if (response.status === 200) {
            onUploadSuccess(base64String)
          } else {
            throw new Error('Không thể cập nhật avatar')
          }
        } catch (error) {
          console.error('Error updating avatar:', error)
          alert('Có lỗi xảy ra khi cập nhật ảnh đại diện: ' + (error instanceof Error ? error.message : 'Lỗi không xác định'))
        } finally {
          setIsUploading(false)
        }
      }
      
      reader.onerror = () => {
        console.error('Error reading file')
        alert('Có lỗi xảy ra khi đọc file')
        setIsUploading(false)
      }
    } catch (error) {
      console.error('Error uploading avatar:', error)
      alert('Có lỗi xảy ra khi tải lên ảnh đại diện: ' + (error instanceof Error ? error.message : 'Lỗi không xác định'))
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