'use client'

import React, { useState, useEffect } from 'react'
import { Container, Button, Alert } from 'react-bootstrap'
import { useRouter } from 'next/navigation'
import 'bootstrap/dist/css/bootstrap.min.css'
import './profile.css'

interface UserData {
  id: number
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

const ProfilePage = () => {
  const router = useRouter()
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('posts')

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Get user ID from localStorage
        const storedUser = localStorage.getItem('user')
        if (!storedUser) {
          router.push('/login')
          return
        }

        const parsedUser = JSON.parse(storedUser)[0]
        const userId = parsedUser.id

        // Fetch user data from API
        const response = await fetch(`http://localhost:5000/Users/${userId}`)
        if (!response.ok) {
          throw new Error('Không thể tải thông tin người dùng')
        }

        const data = await response.json()
        setUserData(data)
      } catch (err) {
        setError('Có lỗi xảy ra khi tải thông tin người dùng')
        console.error('Error fetching user data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [router])

  const handleEditUserAccountClick = () => {
    router.push('/edit-profile')
  }

  const handleTabClick = (tab: string) => {
    setActiveTab(tab)
  }

  if (loading) {
    return (
      <div className="user-account-wrapper">
        <div className="user-account-container">
          <div className="loading-spinner">Đang tải...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="user-account-wrapper">
        <div className="user-account-container">
          <Alert variant="danger">{error}</Alert>
        </div>
      </div>
    )
  }

  if (!userData) {
    return null
  }

  // Format date from timestamp
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp)
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="user-account-wrapper">
      <div className="user-account-container">
        <div className="profile-layout">
          {/* Left side - Profile information */}
          <div className="profile-left">
            <div className="profile-card">
              <div className="profile-img-wrapper">
                {userData.avatar ? (
                  <img 
                    src={userData.avatar} 
                    alt="User avatar" 
                    className="profile-img"
                  />
                ) : (
                  <div className="profile-img-placeholder">
                    <i className="fas fa-user"></i>
                  </div>
                )}
              </div>
              <h2 className="username">{userData.name}</h2>
              <p className="user-handle">@{userData.username}</p>
              <button onClick={handleEditUserAccountClick} className="edit-profile-btn">
                Chỉnh sửa trang cá nhân
              </button>
              <div className="profile-stats">
                <div className="stat-item">
                  <p className="stat-value">0</p>
                  <p className="stat-label">followers</p>
                </div>
                <div className="stat-item">
                  <p className="stat-value">0</p>
                  <p className="stat-label">following</p>
                </div>
                <div className="stat-item">
                  <p className="stat-value">0</p>
                  <p className="stat-label">spiders</p>
                </div>
              </div>
              <div className="user-bio">
                {userData.bio ? (
                  <p className="bio-text">{userData.bio}</p>
                ) : (
                  <p className="bio-placeholder">Chưa có tiểu sử</p>
                )}
              </div>
            </div>
          </div>

          {/* Right side - Navigation tabs and content */}
          <div className="profile-right">
            <div className="tabs">
              <div 
                className={`tab ${activeTab === 'posts' ? 'active' : ''}`}
                onClick={() => handleTabClick('posts')}
              >
                Bài viết
              </div>
              <div 
                className={`tab ${activeTab === 'series' ? 'active' : ''}`}
                onClick={() => handleTabClick('series')}
              >
                Series
              </div>
              <div 
                className={`tab ${activeTab === 'saved' ? 'active' : ''}`}
                onClick={() => handleTabClick('saved')}
              >
                Đã lưu
              </div>
            </div>

            <div className="tab-content">
              {activeTab === 'posts' && (
                <div className="no-content-message">
                  Chưa có bài viết nào
                </div>
              )}

              {activeTab === 'series' && (
                <div className="no-content-message">
                  Chưa có series nào
                </div>
              )}

              {activeTab === 'saved' && (
                <div className="no-content-message">
                  Chưa có bài viết nào được lưu
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage 