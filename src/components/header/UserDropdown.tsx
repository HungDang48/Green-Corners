'use client'

import React, { useState, useEffect } from 'react'
import { NavDropdown } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import { useRouter } from 'next/navigation'
import './header.css'
import { useAuth } from '@/context/AuthContext'

interface UserData {
  id: number;
  userid: number;
  email: string;
  avatar: string | null;
}

const UserDropdown = () => {
  const router = useRouter()
  const { logout } = useAuth()
  const [userData, setUserData] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Get user data from localStorage
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser)
        // Kiểm tra nếu parsedUser là một mảng
        const userData = Array.isArray(parsedUser) ? parsedUser[0] : parsedUser
        
        // Set initial user data immediately from localStorage
        setUserData({
          id: userData.id,
          userid: userData.id, // Sử dụng id làm userid
          email: userData.email,
          avatar: userData.avatar
        })
        
        // Then fetch complete user data from API in the background
        fetchUserData(userData.id)
      } catch (error) {
        console.error('Error parsing user data:', error)
        setIsLoading(false)
      }
    } else {
      setIsLoading(false)
    }
  }, [])

  const fetchUserData = async (userId: number) => {
    try {
      const response = await fetch(`http://localhost:5001/Users?userid=${userId}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch user data')
      }

      const data = await response.json()
      if (data.length > 0) {
        setUserData({
          id: data[0].id,
          userid: data[0].userid,
          email: data[0].email,
          avatar: data[0].avatar
        })
      }
    } catch (error) {
      console.error('Error fetching user data:', error)
      // Keep using the basic user data from localStorage
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    // Remove user data from localStorage
    localStorage.removeItem('user')
    
    // Update auth context
    logout()
    
    // Redirect to home page
    router.push('/')
  }

  if (isLoading) {
    return (
      <div className="user-avatar-wrapper">
        <span className="user-icon">
          <i className="fas fa-spinner fa-spin"></i>
        </span>
      </div>
    )
  }

  if (!userData) return null

  return (
    <NavDropdown 
      title={
        <span className="user-avatar-wrapper">
          {userData.avatar ? (
            <img 
              src={userData.avatar} 
              alt="User avatar" 
              className="user-avatar"
            />
          ) : (
            <span className="user-icon">
              <i className="fas fa-user"></i>
            </span>
          )}
        </span>
      } 
      id="user-dropdown"
      className="user-dropdown"
    >
      <div className="user-info">
        <p className="user-email">{userData.email}</p>
      </div>
      <NavDropdown.Divider />
      <NavDropdown.Item href="/profile">Thông tin cá nhân</NavDropdown.Item>
      <NavDropdown.Item onClick={handleLogout}>Đăng xuất</NavDropdown.Item>
    </NavDropdown>
  )
}

export default UserDropdown 