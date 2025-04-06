'use client'

import React, { useState, useEffect } from 'react'
import { Container, Button, Alert, Modal } from 'react-bootstrap'
import { useRouter } from 'next/navigation'
import 'bootstrap/dist/css/bootstrap.min.css'
import './profile.css'

interface UserData {
  id: number
  userid: number
  name: string
  username: string
  email: string
  birthday: string
  gender: string
  isblock: boolean
  createdAt: number
  updatedAt: number
  avatar: string | null
  bio?: string
  password?: string
}

interface Post {
  id: number
  blogid: number
  userid: number
  title: string
  shortDescription: string
  longDescription: string
  content: string
  image: string
  categoryIds: number[]
  createdAt: number
  updatedAt: number
}

interface Category {
  id: number
  name: string
}

interface Series {
  id: number
  title: string
  content: string
  userId: number
  categoryId: number
  seriesId?: number
}

const ProfilePage = () => {
  const router = useRouter()
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('posts')
  const [posts, setPosts] = useState<Post[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [series, setSeries] = useState<Series[]>([])
  const [showAddSeriesModal, setShowAddSeriesModal] = useState(false)
  const [newSeries, setNewSeries] = useState<Series>({
    id: 0,
    title: '',
    content: '',
    userId: 0,
    categoryId: 0
  })

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Get user ID from localStorage
        const storedUser = localStorage.getItem('user')
        if (!storedUser) {
          router.push('/login')
          return
        }

        const parsedUser = JSON.parse(storedUser)
        // Kiểm tra nếu parsedUser là một mảng
        const userData = Array.isArray(parsedUser) ? parsedUser[0] : parsedUser
        const userId = userData.userid

        // Fetch user data from API
        const response = await fetch(`http://localhost:5001/Users?userid=${userId}`)
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

        // Fetch all posts
        const postsResponse = await fetch('http://localhost:5001/BlogPost')
        if (!postsResponse.ok) {
          throw new Error('Failed to fetch posts')
        }
        const allPosts = await postsResponse.json()
        
        // Filter posts by userid
        const userPosts = allPosts.filter((post: Post) => post.userid === userData.userid)
        setPosts(userPosts)

        // Fetch categories
        const categoriesResponse = await fetch('http://localhost:5001/categories')
        if (!categoriesResponse.ok) {
          throw new Error('Failed to fetch categories')
        }
        const categoriesData = await categoriesResponse.json()
        setCategories(categoriesData)

        // Fetch series
        const seriesResponse = await fetch('http://localhost:5001/series')
        if (!seriesResponse.ok) {
          throw new Error('Failed to fetch series')
        }
        const seriesData = await seriesResponse.json()
        const userSeries = seriesData.filter((series: Series) => series.userId === userData.userid)
        setSeries(userSeries)
      } catch (err) {
        setError('Error loading data')
        console.error('Error fetching data:', err)
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

  const handleAddSeries = () => {
    setShowAddSeriesModal(true)
  }

  const handleSeriesChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setNewSeries(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSeriesSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userData) return

    try {
      setLoading(true)
      setError('')

      // Fetch the latest series to get the next id and seriesId
      const response = await fetch('http://localhost:5001/series')
      if (!response.ok) {
        throw new Error('Failed to fetch series')
      }
      const existingSeries = await response.json()
      const latestSeries = existingSeries[existingSeries.length - 1]
      const nextId = latestSeries ? latestSeries.id + 1 : 1
      const nextSeriesId = latestSeries ? latestSeries.seriesId + 1 : 1

      const seriesData = {
        id: nextId,
        title: newSeries.title,
        content: newSeries.content,
        userId: userData.userid,
        categoryId: parseInt(newSeries.categoryId.toString()),
        seriesId: nextSeriesId
      }

      const addResponse = await fetch('http://localhost:5001/series', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(seriesData)
      })

      if (!addResponse.ok) {
        const errorData = await addResponse.json()
        throw new Error(errorData.message || 'Không thể thêm series')
      }

      const addedSeries = await addResponse.json()
      setSeries(prev => [...prev, addedSeries])
      setShowAddSeriesModal(false)
      setNewSeries({
        id: 0,
        title: '',
        content: '',
        userId: 0,
        categoryId: 0
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi thêm series')
    } finally {
      setLoading(false)
    }
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
                <div className="series-section">
                  <div className="profile-header">
                    <h2>My Series</h2>
                    <button 
                      className="add-series-btn"
                      onClick={handleAddSeries}
                    >
                      Thêm series
                    </button>
                  </div>
                  <div className="series-grid">
                    {series.length > 0 ? (
                      series.map(series => (
                        <div key={series.id} className="series-card">
                          <div className="series-content">
                            <h3>{series.title}</h3>
                            <p className="series-description">{series.content}</p>
                            <div className="series-meta">
                              <span className="series-category">
                                {categories.find(cat => cat.id === series.categoryId)?.name || 'No category'}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="no-content-message">
                        Chưa có series nào
                      </div>
                    )}
                  </div>
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

      {/* Add Series Modal */}
      <Modal show={showAddSeriesModal} onHide={() => setShowAddSeriesModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Thêm Series</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSeriesSubmit} className="series-form">
            <div className="form-group">
              <label htmlFor="title">Tiêu đề</label>
              <input
                type="text"
                id="title"
                name="title"
                value={newSeries.title}
                onChange={handleSeriesChange}
                required
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label htmlFor="content">Nội dung</label>
              <textarea
                id="content"
                name="content"
                value={newSeries.content}
                onChange={handleSeriesChange}
                required
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label htmlFor="categoryId">Danh mục</label>
              <select
                id="categoryId"
                name="categoryId"
                value={newSeries.categoryId}
                onChange={handleSeriesChange}
                required
                className="form-control"
              >
                <option value="">Chọn danh mục</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="modal-actions">
              <Button variant="secondary" onClick={() => setShowAddSeriesModal(false)} className="btn-cancel">
                Hủy
              </Button>
              <Button variant="primary" type="submit" disabled={loading} className="btn-submit">
                {loading ? 'Đang thêm...' : 'Thêm'}
              </Button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  )
}

export default ProfilePage 