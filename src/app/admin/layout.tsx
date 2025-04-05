'use client'

import React from 'react'
import AdminHeader from '@/components/admin/header/AdminHeader'
import './admin.css'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="admin-dashboard">
      <AdminHeader />
      <main className="admin-content">
        {children}
      </main>
    </div>
  )
} 