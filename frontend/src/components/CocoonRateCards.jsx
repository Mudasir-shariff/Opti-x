import SilkIcon from './SilkIcon'

const CocoonRateCards = ({ locations }) => {
  if (!locations || locations.length === 0) {
    return (
      <div className="text-center py-12 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-8 border-2 border-blue-200">
        <div className="flex justify-center mb-4">
          <SilkIcon className="w-16 h-16 opacity-50" />
        </div>
        <p className="text-gray-600 font-medium text-lg">No cocoon rate data available</p>
        <p className="text-sm text-gray-500 mt-2">Data will appear here once admin adds market rates</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {locations.map((location, index) => (
        <div
          key={index}
          className="bg-gradient-to-br from-white to-blue-50 rounded-lg shadow-md p-4 sm:p-6 hover:shadow-xl transition-all border-2 border-blue-100 hover:border-purple-300"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-gradient-to-br from-blue-500 to-purple-500 rounded-full p-2">
              <SilkIcon className="w-6 h-6" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800">
              {location.location}
            </h3>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Highest Price:</span>
              <span className="text-base sm:text-lg font-bold text-green-600">
                ₹{location.highest_price.toFixed(2)}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-sm sm:text-base">Average Price:</span>
              <span className="text-base sm:text-lg font-bold text-blue-600">
                ₹{location.average_price.toFixed(2)}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-sm sm:text-base">Minimum Price:</span>
              <span className="text-base sm:text-lg font-bold text-red-600">
                ₹{location.minimum_price.toFixed(2)}
              </span>
            </div>
            
            <div className="border-t pt-3 mt-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm sm:text-base">Number of Lots:</span>
                <span className="text-base sm:text-lg font-semibold text-gray-800">
                  {location.lot_count}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default CocoonRateCards

