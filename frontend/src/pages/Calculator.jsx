import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import ProfitLossBarChart from '../components/ProfitLossBarChart'
import SilkIcon from '../components/SilkIcon'
import { formatDateTime } from '../utils/dateFormatter'

const Calculator = () => {
  const [nafePrice, setNafePrice] = useState('')
  const [totalWeight, setTotalWeight] = useState('')
  const [ghaniWeight, setGhaniWeight] = useState('') // in grams
  const [silkPerGhani, setSilkPerGhani] = useState('') // in grams
  const [silkRate, setSilkRate] = useState('')
  
  const [results, setResults] = useState({
    materialCost: 0,
    commission: 0,
    transport: 0,
    totalCost: 0,
    totalSilk: 0,
    sellingPrice: 0,
    profitLoss: 0,
    percentage: 0
  })
  
  const [status, setStatus] = useState('neutral') // profit, loss, neutral
  const [notification, setNotification] = useState(null)
  const [calculationHistory, setCalculationHistory] = useState([])

  // Format currency
  const formatCurrency = (amount) => {
    return '₹' + amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')
  }

  // Format number
  const formatNumber = (num, decimals = 2) => {
    return num.toFixed(decimals)
  }

  // Convert grams to kg
  const gramsToKg = (grams) => {
    return grams / 1000
  }

  // Show notification
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 4000)
  }

  // Validate inputs
  const validateInputs = () => {
    const inputs = [
      { value: nafePrice, name: 'Nafe Price' },
      { value: totalWeight, name: 'Total Weight' },
      { value: ghaniWeight, name: 'Ghani Weight' },
      { value: silkPerGhani, name: 'Silk per Ghani' },
      { value: silkRate, name: 'Silk Rate' }
    ]

    for (let input of inputs) {
      const value = parseFloat(input.value)
      if (isNaN(value) || value < 0) {
        showNotification(`Please enter a valid number for ${input.name}`, 'error')
        return false
      }
    }

    if (parseFloat(ghaniWeight) === 0) {
      showNotification('Ghani weight cannot be zero', 'error')
      return false
    }

    return true
  }

  // Calculate everything
  const calculate = () => {
    if (!validateInputs()) return

    const nafe = parseFloat(nafePrice)
    const total = parseFloat(totalWeight)
    const ghaniGrams = parseFloat(ghaniWeight) // in grams
    const silkGrams = parseFloat(silkPerGhani) // in grams
    const rate = parseFloat(silkRate)

    // Convert ghani weight from grams to kg
    const ghaniKg = ghaniGrams

    // Calculate costs
    const materialCost = nafe * total
    const commission = materialCost * 0.01
    const transport = total * 2
    const totalCost = materialCost + commission + transport

    // Calculate silk production
    // Number of ghanis = total weight / ghani weight (in kg)
    const numberOfGhanis = total / ghaniKg
    // Total silk = number of ghanis * silk per ghani (convert to kg)
    const totalSilkKg = (numberOfGhanis * silkGrams) / 1000
    const sellingPrice = totalSilkKg * rate

    // Calculate profit/loss
    const profitLoss = sellingPrice - totalCost
    const percentage = totalCost > 0 ? (profitLoss / totalCost) * 100 : 0

    setResults({
      materialCost,
      commission,
      transport,
      totalCost,
      totalSilk: totalSilkKg,
      sellingPrice,
      profitLoss,
      percentage
    })

    // Set status
    if (profitLoss > 0) {
      setStatus('profit')
    } else if (profitLoss < 0) {
      setStatus('loss')
    } else {
      setStatus('neutral')
    }

    const resultText = profitLoss > 0 ? 'Profit' : profitLoss < 0 ? 'Loss' : 'Break-even'
    showNotification(`Calculation complete! ${resultText}: ${formatCurrency(Math.abs(profitLoss))}`)
    
    // Add to history (keep last 10 calculations)
    const newHistory = [...calculationHistory, {
      profitLoss,
      timestamp: new Date().toLocaleTimeString()
    }].slice(-10)
    setCalculationHistory(newHistory)
  }

  // Reset all
  const reset = () => {
    setNafePrice('200')
    setTotalWeight('5')
    setGhaniWeight('1000')
    setSilkPerGhani('50')
    setSilkRate('1200')
    setResults({
      materialCost: 0,
      commission: 0,
      transport: 0,
      totalCost: 0,
      totalSilk: 0,
      sellingPrice: 0,
      profitLoss: 0,
      percentage: 0
    })
    setStatus('neutral')
    showNotification('All fields have been reset to default values', 'info')
  }

  // Auto-calculate costs on input change
  useEffect(() => {
    const nafe = parseFloat(nafePrice) || 0
    const total = parseFloat(totalWeight) || 0
    const materialCost = nafe * total
    const commission = materialCost * 0.01
    const transport = total * 2
    const totalCost = materialCost + commission + transport

    setResults(prev => ({
      ...prev,
      materialCost,
      commission,
      transport,
      totalCost
    }))
  }, [nafePrice, totalWeight])

  // Don't auto-calculate on mount if fields are empty
  useEffect(() => {
    if (nafePrice && totalWeight && ghaniWeight && silkPerGhani && silkRate) {
      // Only show welcome message
      setTimeout(() => {
        showNotification('Welcome to Opti-X! Enter your values and click Calculate.', 'info')
      }, 1000)
    }
  }, [])

  // Print results
  const printResults = () => {
    if (results.totalCost === 0) {
      showNotification('No results to print. Please calculate first.', 'error')
      return
    }

    const printContent = `
      <html>
      <head>
        <title>Opti-X - Silk Calculation</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 30px; }
          h1 { color: #2196f3; border-bottom: 3px solid #9c27b0; padding-bottom: 10px; }
          .result { margin: 15px 0; padding: 15px; background: #f3e5f5; border-radius: 8px; }
          .total { font-weight: bold; font-size: 1.3em; background: #e8f5e9; }
          @media print { body { padding: 20px; } }
        </style>
      </head>
      <body>
        <h1>Opti-X - Silk Profit/Loss Calculation</h1>
        <div class="result"><strong>Input Values:</strong><br>
        Cocoon Price: ₹${nafePrice}/kg<br>
        Total Weight: ${totalWeight} kg<br>
        Ghani Weight: ${ghaniWeight} grams<br>
        Silk per Ghani: ${silkPerGhani} grams<br>
        Silk Rate: ₹${silkRate}/kg</div>
        <div class="result">Material Cost: ${formatCurrency(results.materialCost)}</div>
        <div class="result">Total Silk: ${formatNumber(results.totalSilk)} kg</div>
        <div class="result">Selling Price: ${formatCurrency(results.sellingPrice)}</div>
        <div class="result total">Profit/Loss: ${formatCurrency(results.profitLoss)}</div>
        <div class="result">Status: ${status === 'profit' ? 'PROFIT' : status === 'loss' ? 'LOSS' : 'NO PROFIT OR LOSS'}</div>
        <div class="result">Profit/Loss Percentage: ${formatNumber(results.percentage)}%</div>
        <p>Calculated on: ${formatDateTime(new Date())}</p>
                    <p style="margin-top: 20px; font-style: italic;">© 2024 Mudasir Shariff - Opti-X</p>
      </body>
      </html>
    `

    const printWindow = window.open('', '_blank')
    printWindow.document.write(printContent)
    printWindow.document.close()
    printWindow.focus()
    setTimeout(() => {
      printWindow.print()
      printWindow.close()
    }, 250)
  }

  // Show help
  const showHelp = () => {
    const helpMessage = `Opti-X - Silk Profit/Loss Calculator Instructions:

1. Nafe Price: Cost of raw material per kg (₹)
2. Total Weight: Total quantity of material (kg)
3. Ghani Weight: Capacity of one ghani (grams)
4. Silk per Ghani: Silk produced per ghani (grams)
5. Silk Rate: Selling price of silk per kg (₹)

Commission: 1% of material cost
Transport: ₹2 per kg of total weight

Click Calculate to see your profit/loss!`
    
    alert(helpMessage)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-blue-100">
      {/* Notification */}
      {notification && (
        <div className={`fixed bottom-4 right-4 sm:bottom-8 sm:right-8 z-50 px-4 sm:px-6 py-3 sm:py-4 rounded-lg shadow-xl flex items-center gap-3 sm:gap-4 animate-slide-in ${
          notification.type === 'success' ? 'bg-green-500' :
          notification.type === 'error' ? 'bg-red-500' :
          notification.type === 'warning' ? 'bg-yellow-500' :
          'bg-blue-500'
        } text-white max-w-[calc(100vw-2rem)] sm:max-w-md text-sm sm:text-base`}>
          <span>{notification.message}</span>
          <button
            onClick={() => setNotification(null)}
            className="text-white hover:bg-white/20 rounded-full w-8 h-8 flex items-center justify-center transition-colors"
          >
            ×
          </button>
        </div>
      )}

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
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-1 sm:mb-2">Opti-X</h1>
                <p className="text-blue-100 text-sm sm:text-lg">Calculator</p>
              </div>
            </div>
            <Link
              to="/"
              className="px-4 sm:px-6 py-2 sm:py-3 bg-white/20 hover:bg-white/30 rounded-lg backdrop-blur-sm transition-colors font-medium text-sm sm:text-base w-full sm:w-auto text-center"
            >
              ← Dashboard
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          {/* Input Section */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl shadow-xl p-4 sm:p-6 border-2 border-blue-200">
            {/* <h2 className="text-2xl font-bold text-blue-900 mb-6 flex items-center gap-3 border-b-3 border-purple-500 pb-3">
              <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
              Enter Details
            </h2> */}

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-blue-900 mb-2 flex items-center gap-2">
                  <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                  </svg>
                  Cocoon Price (per kg)
                </label>
                <div className="flex items-center bg-white rounded-lg border-2 border-blue-200 focus-within:border-purple-500 transition-colors shadow-inner">
                  <input
                    type="number"
                    value={nafePrice}
                    onChange={(e) => setNafePrice(e.target.value)}
                    step="0.01"
                    min="0"
                    className="flex-1 px-3 sm:px-4 py-3 text-base sm:text-lg border-none outline-none text-gray-900 font-medium"
                    placeholder="Enter price"
                  />
                  <span className="px-3 sm:px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold min-w-[70px] sm:min-w-[80px] text-center text-sm sm:text-base">
                    ₹/kg
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-blue-900 mb-2 flex items-center gap-2">
                  <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  Total Weight
                </label>
                <div className="flex items-center bg-white rounded-lg border-2 border-blue-200 focus-within:border-purple-500 transition-colors shadow-inner">
                  <input
                    type="number"
                    value={totalWeight}
                    onChange={(e) => setTotalWeight(e.target.value)}
                    step="0.01"
                    min="0"
                    className="flex-1 px-3 sm:px-4 py-3 text-base sm:text-lg border-none outline-none text-gray-900 font-medium"
                    placeholder="Enter weight"
                  />
                  <span className="px-3 sm:px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold min-w-[70px] sm:min-w-[80px] text-center text-sm sm:text-base">
                    kg
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-blue-900 mb-2 flex items-center gap-2">
                  <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                    <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                  </svg>
                  Ghani Weight
                </label>
                <div className="flex items-center bg-white rounded-lg border-2 border-blue-200 focus-within:border-purple-500 transition-colors shadow-inner">
                  <input
                    type="number"
                    value={ghaniWeight}
                    onChange={(e) => setGhaniWeight(e.target.value)}
                    step="0.01"
                    min="0"
                    className="flex-1 px-3 sm:px-4 py-3 text-base sm:text-lg border-none outline-none text-gray-900 font-medium"
                    placeholder="Enter capacity"
                  />
                  <span className="px-3 sm:px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold min-w-[70px] sm:min-w-[80px] text-center text-sm sm:text-base">
                    kg
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-blue-900 mb-2 flex items-center gap-2">
                  <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  Silk per Ghani
                </label>
                <div className="flex items-center bg-white rounded-lg border-2 border-blue-200 focus-within:border-purple-500 transition-colors shadow-inner">
                  <input
                    type="number"
                    value={silkPerGhani}
                    onChange={(e) => setSilkPerGhani(e.target.value)}
                    step="0.01"
                    min="0"
                    className="flex-1 px-3 sm:px-4 py-3 text-base sm:text-lg border-none outline-none text-gray-900 font-medium"
                    placeholder="Enter silk amount"
                  />
                  <span className="px-3 sm:px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold min-w-[70px] sm:min-w-[80px] text-center text-sm sm:text-base">
                    grams
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-blue-900 mb-2 flex items-center gap-2">
                  <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                  </svg>
                  Silk Rate (per kg)
                </label>
                <div className="flex items-center bg-white rounded-lg border-2 border-blue-200 focus-within:border-purple-500 transition-colors shadow-inner">
                  <input
                    type="number"
                    value={silkRate}
                    onChange={(e) => setSilkRate(e.target.value)}
                    step="0.01"
                    min="0"
                    className="flex-1 px-3 sm:px-4 py-3 text-base sm:text-lg border-none outline-none text-gray-900 font-medium"
                    placeholder="Enter rate"
                  />
                  <span className="px-3 sm:px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold min-w-[70px] sm:min-w-[80px] text-center text-sm sm:text-base">
                    ₹/kg
                  </span>
                </div>
              </div>
            </div>

            {/* Cost Breakdown */}
            <div className="mt-6 bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl p-5 border-l-4 border-orange-500 shadow-inner">
              <h3 className="text-lg font-bold text-orange-900 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                  <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                </svg>
                Cost Calculation
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-orange-200">
                  <span className="text-orange-800 font-medium">Material Cost:</span>
                  <span className="text-orange-900 font-bold">{formatCurrency(results.materialCost)}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-orange-200">
                  <span className="text-orange-800 font-medium">Commission (1%):</span>
                  <span className="text-orange-900 font-bold">{formatCurrency(results.commission)}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-orange-200">
                  <span className="text-orange-800 font-medium">Transport (₹2/kg):</span>
                  <span className="text-orange-900 font-bold">{formatCurrency(results.transport)}</span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t-2 border-orange-400">
                  <span className="text-orange-900 font-bold text-xl">Total Cost:</span>
                  <span className="text-orange-900 font-bold text-2xl">{formatCurrency(results.totalCost)}</span>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 mt-6">
                    <button
                        onClick={calculate}
                        className="flex-1 px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg font-bold text-base sm:text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2 touch-manipulation"
                      >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                  <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                </svg>
                Calculate
              </button>
                      <button
                        onClick={reset}
                        className="px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white rounded-lg font-bold text-base sm:text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2 touch-manipulation"
                      >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                </svg>
                Reset
              </button>
            </div>
          </div>

                  {/* Results Section */}
                  <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 border-2 border-blue-200">
            <h2 className="text-2xl font-bold text-blue-900 mb-6 flex items-center gap-3 border-b-3 border-purple-500 pb-3">
              <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
              </svg>
              Results
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-5 border-t-4 border-blue-500 shadow-md hover:shadow-lg transition-shadow">
                <div className="text-sm font-semibold text-blue-700 mb-2 uppercase tracking-wide">Material Cost</div>
                <div className="text-2xl font-bold text-blue-900">{formatCurrency(results.materialCost)}</div>
                <div className="text-xs text-gray-600 mt-1 italic">Raw Material Expense</div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-5 border-t-4 border-blue-500 shadow-md hover:shadow-lg transition-shadow">
                <div className="text-sm font-semibold text-blue-700 mb-2 uppercase tracking-wide">Total Silk</div>
                <div className="text-2xl font-bold text-blue-900">{formatNumber(results.totalSilk)} kg</div>
                <div className="text-xs text-gray-600 mt-1 italic">Silk Produced</div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-5 border-t-4 border-blue-500 shadow-md hover:shadow-lg transition-shadow">
                <div className="text-sm font-semibold text-blue-700 mb-2 uppercase tracking-wide">Selling Price</div>
                <div className="text-2xl font-bold text-blue-900">{formatCurrency(results.sellingPrice)}</div>
                <div className="text-xs text-gray-600 mt-1 italic">Revenue from Silk</div>
              </div>

              <div className={`bg-gradient-to-br rounded-xl p-5 border-4 shadow-lg ${
                status === 'profit' ? 'from-green-50 to-green-100 border-green-500' :
                status === 'loss' ? 'from-red-50 to-red-100 border-red-500' :
                'from-blue-50 to-purple-50 border-blue-500'
              }`}>
                <div className={`text-sm font-semibold mb-2 uppercase tracking-wide ${
                  status === 'profit' ? 'text-green-700' :
                  status === 'loss' ? 'text-red-700' :
                  'text-blue-700'
                }`}>Profit/Loss</div>
                <div className={`text-3xl font-bold ${
                  status === 'profit' ? 'text-green-700' :
                  status === 'loss' ? 'text-red-700' :
                  'text-blue-900'
                }`}>{formatCurrency(results.profitLoss)}</div>
                <div className="text-xs text-gray-600 mt-1 italic">Final Result</div>
              </div>
            </div>

            {/* Status Display */}
            <div className={`rounded-xl p-6 text-center font-bold text-xl mb-4 ${
              status === 'profit' ? 'bg-gradient-to-r from-green-100 to-green-200 text-green-800 border-3 border-green-500' :
              status === 'loss' ? 'bg-gradient-to-r from-red-100 to-red-200 text-red-800 border-3 border-red-500' :
              'bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 border-3 border-blue-500'
            }`}>
              <div className="flex items-center justify-center gap-3">
                {status === 'profit' && (
                  <>
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>PROFIT: {formatCurrency(results.profitLoss)}</span>
                  </>
                )}
                {status === 'loss' && (
                  <>
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>LOSS: {formatCurrency(Math.abs(results.profitLoss))}</span>
                  </>
                )}
                {status === 'neutral' && (
                  <>
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                    <span>NO PROFIT OR LOSS</span>
                  </>
                )}
              </div>
            </div>

            {/* Percentage Display */}
            <div className="bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl p-5 text-center border-2 border-gray-300">
              <div className="flex items-center justify-center gap-3">
                <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                </svg>
                <span className="font-bold text-gray-800">Profit/Loss Percentage: {formatNumber(results.percentage)}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bar Chart Section */}
        {/* <div className="mt-8">
          <ProfitLossBarChart calculationHistory={calculationHistory} />
        </div> */}
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-black via-gray-900 to-black border-t-4 border-orange-500 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <svg className="w-6 h-6 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              <p className="text-white font-medium">
                © 2026 <span className="text-orange-500 font-bold">Mudasir Shariff</span> - Opti-X
              </p>
            </div>
            <div className="flex items-center gap-4">
              <a
                href="mailto:shariffmudasirshariff@gmail.com"
                className="text-orange-400 hover:text-orange-300 transition-colors flex items-center gap-2 font-medium"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                Contact
              </a>
              <button
                onClick={showHelp}
                className="text-orange-400 hover:text-orange-300 transition-colors flex items-center gap-2 font-medium"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
                Help
              </button>
              <button
                onClick={printResults}
                className="text-orange-400 hover:text-orange-300 transition-colors flex items-center gap-2 font-medium"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4z" clipRule="evenodd" />
                </svg>
                Print
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Calculator
