'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Select, { MultiValue } from 'react-select'
import './create-post.css'

interface Category {
  id: number
  name: string
}

interface CategoryOption {
  value: number
  label: string
}

interface UserData {
  userid: number
  id: number
  email: string
  avatar: string | null
}

const CreatePostPage = () => {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [userData, setUserData] = useState<UserData | null>(null)

  const [formData, setFormData] = useState({
    title: '',
    shortDescription: '',
    longDescription: '',
    content: '',
    categoryIds: [] as number[],
    image: null as string | null
  })

  useEffect(() => {
    // Lấy thông tin người dùng từ localStorage
    const getUserData = () => {
      try {
        const userStr = localStorage.getItem('user')
        if (userStr) {
          const parsedUser = JSON.parse(userStr)
          // Kiểm tra nếu parsedUser là mảng, lấy phần tử đầu tiên
          const userData = Array.isArray(parsedUser) ? parsedUser[0] : parsedUser
          
          // Đảm bảo userid và id là số
          if (userData) {
            userData.userid = Number(userData.userid)
            userData.id = Number(userData.id)
            setUserData(userData)
          } else {
            router.push('/login')
          }
        } else {
          // Nếu không có thông tin người dùng, chuyển hướng đến trang đăng nhập
          router.push('/login')
        }
      } catch (error) {
        console.error('Error parsing user data:', error)
        router.push('/login')
      }
    }

    getUserData()

    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:5001/categories')
        if (!response.ok) {
          throw new Error('Failed to fetch categories')
        }
        const data = await response.json()
        setCategories(data)
      } catch (err) {
        console.error('Error fetching categories:', err)
        setError('Failed to load categories')
      }
    }

    fetchCategories()
  }, [router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleCategoryChange = (selectedOptions: MultiValue<CategoryOption>) => {
    setFormData(prev => ({
      ...prev,
      categoryIds: selectedOptions.map(option => option.value)
    }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Create preview URL
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64String = reader.result as string
        setImagePreview(base64String)
        setFormData(prev => ({
          ...prev,
          image: base64String
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const generateRandomId = () => {
    // Tạo một ID ngẫu nhiên dạng số
    return Math.floor(Math.random() * 1000000)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!userData) {
      setError('Vui lòng đăng nhập để tạo bài viết')
      return
    }
    
    setIsLoading(true)
    setError('')
    setSuccess('')

    try {
      // Tạo id và blogid ngẫu nhiên dạng số
      const newId = generateRandomId()
      const newBlogId = generateRandomId()

      const postData = {
        id: newId,
        blogid: newBlogId,
        userid: userData.userid,
        title: formData.title,
        shortDescription: formData.shortDescription,
        longDescription: formData.longDescription,
        content: formData.content,
        categoryIds: formData.categoryIds,
        image: formData.image,
        createdAt: Date.now(),
        updatedAt: Date.now()
      }

      console.log('Sending post data:', postData)

      const response = await fetch('http://localhost:5001/BlogPost', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(postData)
      })

      if (!response.ok) {
        throw new Error('Failed to create post')
      }

      setSuccess('Post created successfully!')
      setTimeout(() => {
        router.push('/profile')
      }, 2000)
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('An unexpected error occurred')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const categoryOptions: CategoryOption[] = categories.map(category => ({
    value: category.id,
    label: category.name
  }))

  if (!userData) {
    return (
      <div className="create-post-container">
        <div className="loading-message">Loading user data...</div>
      </div>
    )
  }

  return (
    <div className="create-post-container">
      <h1>Create New Post</h1>
      
      <form onSubmit={handleSubmit} className="create-post-form">
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="shortDescription">Short Description</label>
          <textarea
            id="shortDescription"
            name="shortDescription"
            value={formData.shortDescription}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="longDescription">Long Description</label>
          <textarea
            id="longDescription"
            name="longDescription"
            value={formData.longDescription}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="content">Content</label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Categories</label>
          <Select
            isMulti
            name="categories"
            options={categoryOptions}
            className="categories-select"
            classNamePrefix="select"
            onChange={handleCategoryChange}
            placeholder="Select categories..."
          />
        </div>

        <div className="form-group">
          <label htmlFor="image">Featured Image</label>
          <input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            onChange={handleImageChange}
            required
          />
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Preview"
              className="image-preview"
            />
          )}
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <button
          type="submit"
          className="submit-btn"
          disabled={isLoading || formData.categoryIds.length === 0}
        >
          {isLoading ? 'Creating...' : 'Create Post'}
        </button>
      </form>
    </div>
  )
}

export default CreatePostPage 