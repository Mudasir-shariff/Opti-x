import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../services/supabase'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [adminPassword, setAdminPassword] = useState(null)

  // Check for existing admin session on mount
  useEffect(() => {
    const admin = sessionStorage.getItem('admin')
    const password = sessionStorage.getItem('adminPassword')
    
    if (admin === 'true' && password) {
      setIsAuthenticated(true)
      setAdminPassword(password)
    }
    
    setLoading(false)
  }, [])

  const login = async (password) => {
    try {
      // Verify password using RPC function
      const { data, error } = await supabase.rpc('verify_admin_password', {
        p_password: password
      })

      if (error) {
        return { success: false, error: error.message || 'Invalid password' }
      }

      if (data === true) {
        // Save session
        sessionStorage.setItem('admin', 'true')
        sessionStorage.setItem('adminPassword', password)
        setIsAuthenticated(true)
        setAdminPassword(password)
        return { success: true }
      } else {
        return { success: false, error: 'Invalid password' }
      }
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, error: error.message || 'Login failed' }
    }
  }

  const logout = () => {
    sessionStorage.clear()
    setIsAuthenticated(false)
    setAdminPassword(null)
  }

  const getAdminPassword = () => {
    return adminPassword || sessionStorage.getItem('adminPassword')
  }

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      loading,
      login,
      logout,
      getAdminPassword
    }}>
      {children}
    </AuthContext.Provider>
  )
}
