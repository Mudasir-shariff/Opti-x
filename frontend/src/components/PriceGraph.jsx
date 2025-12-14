import { useState, useEffect } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import { db } from '../services/supabase'
import { COCOON_LOCATIONS } from '../utils/constants'

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

const PriceGraph = () => {
  const [graphType, setGraphType] = useState('average')
  const [chartData, setChartData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchChartData()
  }, [graphType])

  const fetchChartData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const { data, error: fetchError } = await db.cocoon.getMonthly(graphType)
      
      if (fetchError) {
        throw fetchError
      }

      if (!data || data.length === 0) {
        setChartData(null)
        setLoading(false)
        return
      }

      // Group data by month and location
      const months = [...new Set(data.map(item => item.month))].sort()
      const locations = COCOON_LOCATIONS // Only show fixed locations

      // Create datasets for each location
      const datasets = locations.map((location, index) => {
        const locationData = data.filter(item => item.location === location)
        const prices = months.map(month => {
          const monthData = locationData.find(item => item.month === month)
          return monthData ? parseFloat(monthData.price) : null
        })

        const colors = [
          { border: 'rgb(59, 130, 246)', background: 'rgba(59, 130, 246, 0.1)' },
          { border: 'rgb(16, 185, 129)', background: 'rgba(16, 185, 129, 0.1)' },
          { border: 'rgb(245, 158, 11)', background: 'rgba(245, 158, 11, 0.1)' }
        ]

        const color = colors[index % colors.length]

        return {
          label: location,
          data: prices,
          borderColor: color.border,
          backgroundColor: color.background,
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointHoverRadius: 6
        }
      })

      setChartData({
        labels: months,
        datasets: datasets
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
        position: 'top',
      },
      title: {
        display: true,
        text: `Monthly Cocoon Prices - ${graphType.charAt(0).toUpperCase() + graphType.slice(1)} Price`,
        font: {
          size: 16
        }
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ₹${context.parsed.y?.toFixed(2) || 'N/A'}`
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: false,
        ticks: {
          callback: function(value) {
            return '₹' + value.toFixed(0)
          }
        },
        title: {
          display: true,
          text: 'Price (₹)'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Month'
        }
      }
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 h-96 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading chart data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 h-96 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-2">Error loading chart</p>
          <p className="text-sm text-gray-600">{error}</p>
        </div>
      </div>
    )
  }

  if (!chartData || chartData.datasets.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 h-96 flex items-center justify-center">
        <p className="text-gray-500">No chart data available</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Graph Type Selector */}
      <div className="mb-4 flex justify-end">
        <div className="flex gap-2">
          <button
            onClick={() => setGraphType('highest')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              graphType === 'highest'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            MAX Price
          </button>
          <button
            onClick={() => setGraphType('average')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              graphType === 'average'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            AVG Price
          </button>
          <button
            onClick={() => setGraphType('minimum')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              graphType === 'minimum'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            MIN Price
          </button>
        </div>
      </div>

      {/* Chart */}
      <div className="h-96">
        <Line data={chartData} options={options} />
      </div>
    </div>
  )
}

export default PriceGraph
