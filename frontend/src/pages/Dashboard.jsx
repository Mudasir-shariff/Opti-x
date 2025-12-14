import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { db } from '../services/supabase'
import CocoonRateCards from '../components/CocoonRateCards'
import SilkPriceSection from '../components/SilkPriceSection'
import PriceGraph from '../components/PriceGraph'
import CocoonPriceBarChart from '../components/CocoonPriceBarChart'
import SilkIcon from '../components/SilkIcon'

const Dashboard = () => {
  const [cocoonLocations, setCocoonLocations] = useState([])
  const [silkPrices, setSilkPrices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const [cocoonRes, silkRes] = await Promise.all([
        db.cocoon.getLocations(),
        db.silk.getLocations()
      ])

      if (cocoonRes.error) {
        throw new Error(cocoonRes.error.message || 'Failed to fetch cocoon data')
      }
      if (silkRes.error) {
        throw new Error(silkRes.error.message || 'Failed to fetch silk data')
      }

      setCocoonLocations(cocoonRes.data || [])
      setSilkPrices(silkRes.data || [])
    } catch (err) {
      console.error('Error fetching data:', err)
      setError(err.message || 'Failed to load data from Supabase')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-4">
            <h2 className="text-lg font-semibold text-red-800 mb-2">Error Loading Data</h2>
            <p className="text-red-600 text-sm mb-4">{error}</p>
            <div className="text-left text-xs text-gray-600 bg-white p-3 rounded">
              <p className="font-semibold mb-2">Troubleshooting:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Check Supabase connection settings</li>
                <li>Verify environment variables are set</li>
                <li>Check browser console for detailed errors</li>
              </ul>
            </div>
          </div>
          <button
            onClick={fetchData}
            className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 transition-colors"
          >
            Retry
          </button>
        </div>
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
                <SilkIcon className="w-8 h-8 sm:w-12 sm:h-12" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-0.5 sm:mb-1">Opti-X </h1>
                <p className="text-blue-100 text-xs sm:text-sm">Real-time market price Dashboard</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
              <Link
                to="/calci"
                className="px-3 sm:px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg backdrop-blur-sm transition-colors font-medium flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                  <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                </svg>
                Calculator
              </Link>
              <Link
                to="/admin-login"
                className="px-3 sm:px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg backdrop-blur-sm transition-colors font-medium flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                Admin Login
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Cocoon Rate Cards Section */}
        <section className="mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4">Cocoon Price by Location</h2>
          <CocoonRateCards locations={cocoonLocations} />
        </section>

        {/* Bar Graph Section */}
        <section className="mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4">Cocoon Prices by Location</h2>
          <CocoonPriceBarChart />
        </section>

        {/* Line Graph Section */}
        {/* <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Daily Cocoon Price Trends (Line Chart)</h2>
          <PriceGraph />
        </section> */}

        {/* Silk Price Section */}
        <section>
          <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4">Silk Prices by Location</h2>
          <SilkPriceSection prices={silkPrices} />
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-900 via-black to-gray-900 border-t-4 border-blue-500 mt-8 sm:mt-12">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              <p className="text-white font-medium text-sm sm:text-base">
                © 2026 <span className="text-blue-400 font-bold">Mudasir Shariff</span> - Opti-X
              </p>
            </div>
            <div className="flex items-center gap-3 sm:gap-4">
              <a
                href="mailto:shariffmudasirshariff@gmail.com"
                className="text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-2 font-medium text-sm sm:text-base" 
              > 
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20"> 
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                <span className="hidden sm:inline">Contact me</span>
                <span className="sm:hidden">Contact</span>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Dashboard
