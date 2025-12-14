import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import SilkIcon from '../components/SilkIcon'

const AdminLogin = () => {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = await login(password)
    
    if (result.success) {
      navigate('/admin')
    } else {
      setError(result.error || 'Invalid password')
    }
    
    setLoading(false)
  }

  return (
    <div 
      className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: 'url(https://img.freepik.com/free-photo/white-yellow-silkworm-cocoon_1357-184.jpg?semt=ais_hybrid&w=740&q=80 )',
        backgroundColor: '#f3e5d7'
      }}
    >
      {/* Overlay for better contrast */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 via-purple-900/30 to-blue-900/30"></div>
      
      <div className="max-w-md w-full relative z-10 px-4">
        {/* Transparent container for login form */}
        <div className="bg-white/20 backdrop-blur-sm rounded-2xl shadow-xl p-6 sm:p-8 border border-white/10">

        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-br from-blue-500 to-purple-500 rounded-full p-3 sm:p-4">
              <SilkIcon className="w-10 h-10 sm:w-12 sm:h-12" />
            </div>
          </div>
          <h2 className="mt-4 sm:mt-6 text-center text-2xl sm:text-3xl font-extrabold text-gray-900">
            Opti-X 
          </h2>
          <p className="mt-4 sm:mt-6 text-center text-xl sm:text-2xl lg:text-3xl font-extrabold text-gray-900">Admin Login</p>
         
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm">
            <div>
             
            <input
  id="password"
  name="password"
  type="password"
  required
  autoFocus
  className="appearance-none rounded-md relative block w-full px-4 py-3 sm:px-3 sm:py-2 text-base sm:text-sm border-one /30 bg-white/30 placeholder-gray-700 text-gray-900 backdrop-blur-sm focus:outline-none focus:ring-white/50 focus:border-white/30 focus:z-10"
  placeholder="Enter admin password"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  disabled={loading}
/>

            </div>
          </div>

          {error && (
            <div className="rounded-md bg-red-50 border border-red-200 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              </div>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 sm:py-2 px-4 border border-blue-500 text-base sm:text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors touch-manipulation"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="https://www.freepik.com/free-photos-vectors/silkworm-cocoon" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Verifying...
                </span>
              ) : (
                'Sign in'
              )}
            </button>
          </div>

          <div className="text-center">
            <a
              href="/"
              className="text-sm text-blue-600 hover:text-purple-500 transition-colors"
            >
              ← Back to Dashboard
            </a>
          </div>
        </form>
        </div>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-0 left-0 right-0 bg-gradient-to-r from-gray-900 via-black to-gray-900 border-t-4 border-primary-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-primary-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              <p className="text-white text-sm font-medium">
                © 2026 <span className="text-primary-400 font-bold">Mudasir Shariff</span> - Opti-X
              </p>
            </div>
            <div className="flex items-center gap-4">
              <a
                href="mailto:shariffmudasirshariff@gmail.com"
                className="text-primary-400 hover:text-primary-300 transition-colors flex items-center gap-2 text-sm font-medium"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
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

export default AdminLogin
