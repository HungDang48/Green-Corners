'use client'

import React, { useState, useEffect } from 'react'
import { NavDropdown } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import { useRouter } from 'next/navigation'
import './header.css'
import { sendRequest } from '@/app/Utils/api'
import { useAuth } from '@/context/AuthContext'

interface UserData {
  id: number;
  email: string;
  avatar?: string;
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
        const parsedUser = JSON.parse(storedUser)[0]
        // Set initial user data immediately from localStorage
        setUserData({
          id: parsedUser.id,
          email: parsedUser.email,
          avatar: parsedUser.avatar
        })
        
        // Then fetch complete user data from API in the background
        fetchUserData(parsedUser.id)
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
      const response = await sendRequest<UserData>({
        url: `http://localhost:5000/Users/${userId}`,
        method: 'GET'
      })
      
      if (!('statusCode' in response)) {
        setUserData(response)
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