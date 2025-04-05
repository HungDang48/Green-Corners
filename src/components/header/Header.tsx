'use client'

import React from 'react'
import './header.css'
import BlogDropdown from './BlogDropdown'
import UserDropdown from './UserDropdown'
import { useAuth } from '@/context/AuthContext'

const Header = () => {
  const { isLoggedIn } = useAuth()

  return (
    <nav className="header-wrapper">
      <div className="container-header">
        <div className="left-header">
          <div className="logo-header">Green<span>Corner</span></div>
        </div>
        <div className="mid-header">
          <div className="nav-links-header">
            <a href="/">TRANG CHỦ</a>
            <a href="/about">GIỚI THIỆU</a>
            <BlogDropdown />
            <a href="/contact">LIÊN HỆ</a>
          </div>
        </div>
        <div className="right-header">
          <div className="auth-links-header">
            {isLoggedIn ? (
              <UserDropdown />
            ) : (
              <>
                <a href="/login">ĐĂNG NHẬP</a>
                <a href="/register">ĐĂNG KÝ</a>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Header