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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

const ProfitLossBarChart = ({ calculationHistory = [] }) => {
  // If no history, show empty state
  if (!calculationHistory || calculationHistory.length === 0) {
    return (
      <div className="bg-white rounded-xl p-8 border-2 border-blue-200 text-center">
        <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        <p className="text-gray-600 font-medium">No calculation history yet</p>
        <p className="text-sm text-gray-500 mt-2">Start calculating to see your profit/loss trends</p>
      </div>
    )
  }

  // Prepare data for chart
  const labels = calculationHistory.map((item, index) => 
    `Calc ${index + 1}`
  )
  
  const profitLossData = calculationHistory.map(item => item.profitLoss)
  const colors = profitLossData.map(value => 
    value >= 0 ? 'rgba(76, 175, 80, 0.8)' : 'rgba(244, 67, 54, 0.8)'
  )

  const data = {
    labels,
    datasets: [
      {
        label: 'Profit/Loss (₹)',
        data: profitLossData,
        backgroundColor: colors,
        borderColor: profitLossData.map(value => 
          value >= 0 ? 'rgba(76, 175, 80, 1)' : 'rgba(244, 67, 54, 1)'
        ),
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      }
    ]
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
          size: 14,
          weight: 'bold'
        },
        bodyFont: {
          size: 13
        },
        callbacks: {
          label: function(context) {
            const value = context.parsed.y
            const sign = value >= 0 ? '+' : ''
            return `${sign}₹${value.toFixed(2)}`
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
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            size: 11
          }
        }
      }
    },
    animation: {
      duration: 1000,
      easing: 'easeInOutQuart'
    }
  }

  return (
    <div className="bg-gradient-to-br from-white to-blue-50 rounded-xl p-6 border-2 border-blue-200 shadow-lg">
      <div className="mb-4">
        <h3 className="text-xl font-bold text-blue-900 flex items-center gap-2">
          <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
          </svg>
          Profit/Loss Trend Analysis
        </h3>
        <p className="text-sm text-gray-600 mt-1">Track your calculations over time</p>
      </div>
      <div className="h-64">
        <Bar data={data} options={options} />
      </div>
      <div className="mt-4 flex items-center justify-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded"></div>
          <span className="text-gray-700">Profit</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-500 rounded"></div>
          <span className="text-gray-700">Loss</span>
        </div>
      </div>
    </div>
  )
}

export default ProfitLossBarChart

