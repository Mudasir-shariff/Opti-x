import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { db } from '../services/supabase'
import CocoonForm from '../components/admin/CocoonForm'
import SilkForm from '../components/admin/SilkForm'
import DataTable from '../components/admin/DataTable'
import SilkIcon from '../components/SilkIcon'

const AdminPanel = () => {
  const { isAuthenticated, loading: authLoading, logout, getAdminPassword } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('cocoon')
  const [cocoonData, setCocoonData] = useState([])
  const [silkData, setSilkData] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingCocoon, setEditingCocoon] = useState(null)
  const [editingSilk, setEditingSilk] = useState(null)

  // Protect route - check admin session
  useEffect(() => {
    if (!authLoading) {
      const admin = sessionStorage.getItem('admin')
      if (admin !== 'true') {
        navigate('/admin-login')
        return
      }
      
      if (!isAuthenticated) {
        navigate('/admin-login')
      }
    }
  }, [isAuthenticated, authLoading, navigate])

  useEffect(() => {
    if (isAuthenticated) {
      fetchData()
    }
  }, [isAuthenticated, activeTab])

  const fetchData = async () => {
    try {
      setLoading(true)
      if (activeTab === 'cocoon') {
        const { data, error } = await db.cocoon.getAll()
        if (error) throw error
        setCocoonData(data || [])
      } else {
        const { data, error } = await db.silk.getAll()
        if (error) throw error
        setSilkData(data || [])
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      alert('Failed to load data: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (type, id) => {
    if (!window.confirm('Are you sure you want to delete this record?')) {
      return
    }

    const adminPassword = getAdminPassword()
    if (!adminPassword) {
      alert('Admin session expired. Please login again.')
      logout()
      navigate('/admin-login')
      return
    }

    try {
      if (type === 'cocoon') {
        const { error } = await db.cocoon.deleteRPC(id, adminPassword)
        if (error) throw error
        setCocoonData(cocoonData.filter(item => item.id !== id))
      } else {
        const { error } = await db.silk.deleteRPC(id, adminPassword)
        if (error) throw error
        setSilkData(silkData.filter(item => item.id !== id))
      }
    } catch (error) {
      console.error('Error deleting:', error)
      alert('Failed to delete record: ' + error.message)
    }
  }

  const handleEdit = (type, item) => {
    if (type === 'cocoon') {
      setEditingCocoon(item)
    } else {
      setEditingSilk(item)
    }
  }

  const handleFormSubmit = async (type, data) => {
    const adminPassword = getAdminPassword()
    if (!adminPassword) {
      alert('Admin session expired. Please login again.')
      logout()
      navigate('/admin-login')
      return
    }

    try {
      if (type === 'cocoon') {
        if (editingCocoon) {
          const { error } = await db.cocoon.updateRPC(editingCocoon.id, data, adminPassword)
          if (error) throw error
          setEditingCocoon(null)
        } else {
          const { error } = await db.cocoon.insertRPC(data, adminPassword)
          if (error) throw error
        }
        await fetchData()
      } else {
        if (editingSilk) {
          const { error } = await db.silk.updateRPC(editingSilk.id, data, adminPassword)
          if (error) throw error
          setEditingSilk(null)
        } else {
          const { error } = await db.silk.insertRPC(data, adminPassword)
          if (error) throw error
        }
        await fetchData()
      }
    } catch (error) {
      console.error('Error saving:', error)
      alert('Failed to save record: ' + error.message)
    }
  }

  if (authLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 text-white shadow-xl border-b-4 border-purple-400 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '30px 30px'
          }}></div>
        </div>
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 relative z-10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="bg-white/20 rounded-full p-2 sm:p-3 backdrop-blur-sm">
                <SilkIcon className="w-8 h-8 sm:w-10 sm:h-10" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-0.5 sm:mb-1">Opti-X Admin Panel</h1>
                <p className="text-blue-100 text-xs sm:text-sm">Manage market data</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
              <a
                href="/"
                className="px-3 sm:px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg backdrop-blur-sm transition-colors font-medium text-sm sm:text-base text-center"
              >
                View Dashboard
              </a>
              <button
                onClick={() => {
                  logout()
                  navigate('/admin-login')
                }}
                className="px-3 sm:px-4 py-2 bg-red-600/90 hover:bg-red-700 text-white rounded-lg transition-colors font-medium text-sm sm:text-base"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Tabs */}
        <div className="border-b border-gray-200 mb-4 sm:mb-6 overflow-x-auto">
          <nav className="-mb-px flex space-x-4 sm:space-x-8 min-w-max sm:min-w-0">
            <button
              onClick={() => {
                setActiveTab('cocoon')
                setEditingCocoon(null)
                setEditingSilk(null)
              }}
              className={`py-3 sm:py-4 px-2 sm:px-1 border-b-2 font-medium text-sm sm:text-base whitespace-nowrap transition-colors ${
                activeTab === 'cocoon'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Cocoon Rates
            </button>
            <button
              onClick={() => {
                setActiveTab('silk')
                setEditingCocoon(null)
                setEditingSilk(null)
              }}
              className={`py-3 sm:py-4 px-2 sm:px-1 border-b-2 font-medium text-sm sm:text-base whitespace-nowrap transition-colors ${
                activeTab === 'silk'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Silk Prices
            </button>
          </nav>
        </div>

        {/* Forms and Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          {/* Form Section */}
          <div>
            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">
              {activeTab === 'cocoon' 
                ? (editingCocoon ? 'Edit Cocoon Rate' : 'Add Cocoon Rate')
                : (editingSilk ? 'Edit Silk Price' : 'Add Silk Price')
              }
            </h2>
            {activeTab === 'cocoon' ? (
              <CocoonForm
                onSubmit={handleFormSubmit}
                initialData={editingCocoon}
                onCancel={() => setEditingCocoon(null)}
              />
            ) : (
              <SilkForm
                onSubmit={handleFormSubmit}
                initialData={editingSilk}
                onCancel={() => setEditingSilk(null)}
              />
            )}
          </div>

          {/* Data Table Section */}
          <div>
            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Existing Records</h2>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
              </div>
            ) : activeTab === 'cocoon' ? (
              <DataTable
                data={cocoonData}
                type="cocoon"
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ) : (
              <DataTable
                data={silkData}
                type="silk"
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-900 via-black to-gray-900 border-t-4 border-primary-500 mt-8 sm:mt-12">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-primary-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              <p className="text-white font-medium text-sm sm:text-base">
                © 2026 <span className="text-primary-400 font-bold">Mudasir Shariff</span> - Opti-X
              </p>
            </div>
            <div className="flex items-center gap-3 sm:gap-4">
              <a
                href="mailto:shariffmudasirshariff@gmail.com"
                className="text-primary-400 hover:text-primary-300 transition-colors flex items-center gap-2 font-medium text-sm sm:text-base"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default AdminPanel
