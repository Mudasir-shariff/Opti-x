import SilkIcon from './SilkIcon'
import { formatDate } from '../utils/dateFormatter'

const SilkPriceSection = ({ prices }) => {
  if (!prices || prices.length === 0) {
    return (
      <div className="text-center py-12 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-8 border-2 border-purple-200">
        <div className="flex justify-center mb-4">
          <SilkIcon className="w-16 h-16 opacity-50" />
        </div>
        <p className="text-gray-600 font-medium text-lg">No silk price data available</p>
        <p className="text-sm text-gray-500 mt-2">Data will appear here once admin adds silk prices</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {prices.map((price, index) => (
        <div
          key={index}
          className="bg-gradient-to-br from-white to-purple-50 rounded-lg shadow-md p-4 sm:p-6 hover:shadow-xl transition-all border-2 border-purple-100 hover:border-purple-300"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-2">
              <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-full p-1.5">
                <SilkIcon className="w-5 h-5" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800">
                {price.location}
              </h3>
            </div>
            <span className="text-xs text-gray-500">
              {formatDate(price.date)}
            </span>
          </div>
          
          <div className="text-center py-3 sm:py-4">
            <p className="text-xs sm:text-sm text-gray-600 mb-2">Current Price</p>
            <p className="text-2xl sm:text-3xl font-bold text-primary-600">
              ₹{parseFloat(price.price).toFixed(2)}
            </p>
            <p className="text-xs text-gray-500 mt-2">per kg</p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default SilkPriceSection

