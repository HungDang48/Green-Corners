'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import './admin-header.css'

const AdminHeader = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const pathname = usePathname()

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen)
  }

  const handleLogout = () => {
    // Xử lý đăng xuất ở đây
    console.log('Logout')
  }

  return (
    <header className="admin-header">
      <div className="admin-header-container">
        <Link href="/admin" className="admin-logo">
          <Image
            src="/images/logo.png"
            alt="Admin Logo"
            width={40}
            height={40}
          />
          <h1>Admin Dashboard</h1>
        </Link>

        <nav className="admin-nav">
          <Link
            href="/admin"
            className={`admin-nav-link ${pathname === '/admin' ? 'active' : ''}`}
          >
            Dashboard
          </Link>
          <Link
            href="/admin/users"
            className={`admin-nav-link ${pathname === '/admin/users' ? 'active' : ''}`}
          >
            Users
          </Link>
          <Link
            href="/admin/posts"
            className={`admin-nav-link ${pathname === '/admin/posts' ? 'active' : ''}`}
          >
            Posts
          </Link>
          <Link
            href="/admin/categories"
            className={`admin-nav-link ${pathname === '/admin/categories' ? 'active' : ''}`}
          >
            Categories
          </Link>
          <Link
            href="/admin/settings"
            className={`admin-nav-link ${pathname === '/admin/settings' ? 'active' : ''}`}
          >
            Settings
          </Link>
        </nav>

        <div className="admin-user-menu">
          <button className="admin-user-button" onClick={toggleDropdown}>
            <Image
              src="/images/avatar.png"
              alt="User Avatar"
              width={32}
              height={32}
              className="admin-user-avatar"
            />
            <span className="admin-user-name">Admin User</span>
          </button>

          <div className={`admin-dropdown-menu ${isDropdownOpen ? 'show' : ''}`}>
            <Link href="/admin/profile" className="admin-dropdown-item">
              Profile
            </Link>
            <Link href="/admin/settings" className="admin-dropdown-item">
              Settings
            </Link>
            <div className="admin-dropdown-divider" />
            <button onClick={handleLogout} className="admin-dropdown-item">
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default AdminHeader 