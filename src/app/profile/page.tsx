'use client'

import React, { useState, useEffect } from 'react'
import { Container, Button, Alert } from 'react-bootstrap'
import { useRouter } from 'next/navigation'
import 'bootstrap/dist/css/bootstrap.min.css'
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
}

interface Post {
  id: number
  title: string
  shortDescription: string
  longDescription: string
  content: string
  image: string
  categoryIds: number[]
  createdAt: number
  updatedAt: number
  userId: number
}

interface Category {
  id: number
  name: string
}

const ProfilePage = () => {
  const router = useRouter()
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('posts')
  const [posts, setPosts] = useState<Post[]>([])
  const [categories, setCategories] = useState<Category[]>([])

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
        const userId = parsedUser.userId

        // Fetch user data from API
        const response = await fetch(`http://localhost:5000/Users?userId=${userId}`)
        if (!response.ok) {
          throw new Error('Không thể tải thông tin người dùng')
        }

        const data = await response.json()
        if (data.length === 0) {
          throw new Error('Không tìm thấy thông tin người dùng')
        }
        setUserData(data[0])
      } catch (err) {
        setError('Có lỗi xảy ra khi tải thông tin người dùng')
        console.error('Error fetching user data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [router])

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!userData) return

        const [postsResponse, categoriesResponse] = await Promise.all([
          fetch(`http://localhost:5000/BlogPost?userId=${userData.userId}`),
          fetch('http://localhost:5000/categories')
        ])

        if (!postsResponse.ok || !categoriesResponse.ok) {
          throw new Error('Failed to fetch data')
        }

        const postsData = await postsResponse.json()
        const categoriesData = await categoriesResponse.json()

        setPosts(postsData)
        setCategories(categoriesData)
      } catch (err) {
        setError('Error loading data')
      }
    }

    fetchData()
  }, [userData])

  const handleEditUserAccountClick = () => {
    router.push('/edit-profile')
  }

  const handleTabClick = (tab: string) => {
    setActiveTab(tab)
  }

  const getCategoryNames = (categoryIds: number[]) => {
    if (!categories || categories.length === 0) {
      return 'No categories'
    }
    if (!categoryIds || !Array.isArray(categoryIds) || categoryIds.length === 0) {
      return 'No categories'
    }
    const categoryNames = categoryIds
      .map(id => categories.find(cat => cat.id === id)?.name)
      .filter(Boolean)
    return categoryNames.length > 0 ? categoryNames.join(', ') : 'No categories'
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString()
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
                <div className="posts-section">
                  <div className="profile-header">
                    <h2>My Posts</h2>
                    <button 
                      className="add-post-btn"
                      onClick={() => router.push('/create-post')}
                    >
                      Thêm bài viết
                    </button>
                  </div>
                  <div className="posts-grid">
                    {posts.length > 0 ? (
                      posts.map(post => (
                        <div key={post.id} className="post-card">
                          {post.image && (
                            <img src={post.image} alt={post.title} className="post-image" />
                          )}
                          <div className="post-content">
                            <h3>{post.title}</h3>
                            <p className="post-description">{post.shortDescription}</p>
                            <div className="post-meta">
                              <span className="post-categories">
                                {getCategoryNames(post.categoryIds)}
                              </span>
                              <span className="post-date">
                                {formatDate(post.createdAt)}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="no-content-message">
                        Chưa có bài viết nào
                      </div>
                    )}
                  </div>
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