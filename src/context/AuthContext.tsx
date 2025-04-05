'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface AuthContextType {
  isLoggedIn: boolean
  login: (rememberMe?: boolean) => void
  logout: () => void
  isRemembered: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isRemembered, setIsRemembered] = useState(false)

  useEffect(() => {
    // Check if user is logged in on initial load
    const storedUser = localStorage.getItem('user')
    const rememberedToken = localStorage.getItem('rememberToken')
    
    if (storedUser && rememberedToken) {
      setIsLoggedIn(true)
      setIsRemembered(true)
    } else if (storedUser) {
      setIsLoggedIn(true)
      setIsRemembered(false)
    } else {
      setIsLoggedIn(false)
      setIsRemembered(false)
    }
  }, [])

  const login = (rememberMe = false) => {
    setIsLoggedIn(true)
    setIsRemembered(rememberMe)
    
    if (rememberMe) {
      // Generate a simple token for demonstration
      const token = Math.random().toString(36).substring(2, 15)
      localStorage.setItem('rememberToken', token)
    }
  }

  const logout = () => {
    setIsLoggedIn(false)
    setIsRemembered(false)
    localStorage.removeItem('rememberToken')
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, isRemembered }}>
      {children}
    </AuthContext.Provider>
  )
} 