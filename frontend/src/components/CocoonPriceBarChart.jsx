import { useState, useEffect } from 'react'
import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import { db } from '../services/supabase'
import { COCOON_LOCATIONS } from '../utils/constants'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

const CocoonPriceBarChart = () => {
  const [priceType, setPriceType] = useState('average') // 'highest', 'average', 'minimum'
  const [chartData, setChartData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchChartData()
  }, [priceType])

  const fetchChartData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const { data, error: fetchError } = await db.cocoon.getLocations()
      
      if (fetchError) {
        throw fetchError
      }

      if (!data || data.length === 0) {
        setChartData(null)
        setLoading(false)
        return
      }

      // Prepare data for bar chart
      const locations = COCOON_LOCATIONS
      const prices = locations.map(location => {
        const locationData = data.find(item => item.location === location)
        if (!locationData) return 0
        
        switch (priceType) {
          case 'highest':
            return parseFloat(locationData.highest_price)
          case 'average':
            return parseFloat(locationData.average_price)
          case 'minimum':
            return parseFloat(locationData.minimum_price)
          default:
            return parseFloat(locationData.average_price)
        }
      })

      const colors = [
        { bg: 'rgba(59, 130, 246, 0.8)', border: 'rgb(59, 130, 246)' },
        { bg: 'rgba(16, 185, 129, 0.8)', border: 'rgb(16, 185, 129)' },
        { bg: 'rgba(245, 158, 11, 0.8)', border: 'rgb(245, 158, 11)' }
      ]

      setChartData({
        labels: locations,
        datasets: [
          {
            label: `${priceType.charAt(0).toUpperCase() + priceType.slice(1)} Price (₹)`,
            data: prices,
            backgroundColor: locations.map((_, index) => colors[index % colors.length].bg),
            borderColor: locations.map((_, index) => colors[index % colors.length].border),
            borderWidth: 2,
            borderRadius: 8,
            borderSkipped: false,
          }
        ]
      })
    } catch (err) {
      console.error('Error fetching chart data:', err)
      setError(err.message || 'Failed to load chart data')
    } finally {
      setLoading(false)
    }
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: {
          size: 16,
          weight: 'bold'
        },
        bodyFont: {
          size: 13
        },
        callbacks: {
          label: function(context) {
            return `Price: ₹${context.parsed.y.toFixed(2)}`
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
          drawBorder: false
        },
        ticks: {
          callback: function(value) {
            return '₹' + value.toFixed(0)
          },
          font: {
            size: 11
          }
        },
        title: {
          display: true,
          text: 'Price (₹)',
          font: {
            size: 12,
            weight: 'bold'
          }
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            size: window.innerWidth < 640 ? 9 : 11
          }
        },
        title: {
          display: true,
          text: 'Location',
          font: {
            size: 12,
            weight: 'bold'
          }
        }
      }
    },
    animation: {
      duration: 1000,
      easing: 'easeInOutQuart'
    }
  }

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-white to-blue-50 rounded-xl p-6 border-2 border-blue-200 shadow-lg h-96 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading chart data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-gradient-to-br from-white to-red-50 rounded-xl p-6 border-2 border-red-200 shadow-lg h-96 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-2 font-medium">Error loading chart</p>
          <p className="text-sm text-gray-600">{error}</p>
        </div>
      </div>
    )
  }

  if (!chartData) {
    return (
      <div className="bg-gradient-to-br from-white to-blue-50 rounded-xl p-6 border-2 border-blue-200 shadow-lg h-96 flex items-center justify-center">
        <div className="text-center">
          <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <p className="text-gray-600 font-medium">No chart data available</p>
          <p className="text-sm text-gray-500 mt-2">Data will appear here once admin adds cocoon rates</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-br from-white to-blue-50 rounded-xl p-4 sm:p-6 border-2 border-blue-200 shadow-lg">
      <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-blue-900 flex items-center gap-2">
            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
            </svg>
            Cocoon Prices by Location
          </h3>
         
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button
            onClick={() => setPriceType('highest')}
            className={`flex-1 sm:flex-none px-3 py-2 sm:py-1.5 rounded-md text-xs sm:text-sm font-medium transition-colors touch-manipulation ${
              priceType === 'highest'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
            }`}
          >
            MAX
          </button>
          <button
            onClick={() => setPriceType('average')}
            className={`flex-1 sm:flex-none px-3 py-2 sm:py-1.5 rounded-md text-xs sm:text-sm font-medium transition-colors touch-manipulation ${
              priceType === 'average'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
            }`}
          >
            AVG
          </button>
          <button
            onClick={() => setPriceType('minimum')}
            className={`flex-1 sm:flex-none px-3 py-2 sm:py-1.5 rounded-md text-xs sm:text-sm font-medium transition-colors touch-manipulation ${
              priceType === 'minimum'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
            }`}
          >
            MIN
          </button>
        </div>
      </div>
      <div className="h-64 sm:h-80">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  )
}

export default CocoonPriceBarChart

