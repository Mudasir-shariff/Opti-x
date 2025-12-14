import { formatDate } from '../../utils/dateFormatter'

const DataTable = ({ data, type, onEdit, onDelete }) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-500">
        No records found
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto -mx-4 sm:mx-0">
        <div className="inline-block min-w-full align-middle">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {type === 'cocoon' ? (
                  <>
                    <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Max
                    </th>
                    <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Avg
                    </th>
                    <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Min
                    </th>
                    <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Lots
                    </th>
                    <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </>
                ) : (
                  <>
                    <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  {type === 'cocoon' ? (
                    <>
                      <td className="px-3 sm:px-4 py-3 whitespace-nowrap text-xs sm:text-sm font-medium text-gray-900">
                        {item.location}
                      </td>
                      <td className="px-3 sm:px-4 py-3 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                        {formatDate(item.date)}
                      </td>
                      <td className="px-3 sm:px-4 py-3 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                        ₹{parseFloat(item.max_price).toFixed(2)}
                      </td>
                      <td className="px-3 sm:px-4 py-3 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                        ₹{parseFloat(item.avg_price).toFixed(2)}
                      </td>
                      <td className="px-3 sm:px-4 py-3 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                        ₹{parseFloat(item.min_price).toFixed(2)}
                      </td>
                      <td className="px-3 sm:px-4 py-3 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                        {parseInt(item.quantity)}
                      </td>
                      <td className="px-3 sm:px-4 py-3 whitespace-nowrap text-xs sm:text-sm font-medium">
                        <div className="flex flex-col sm:flex-row gap-2">
                          <button
                            onClick={() => onEdit('cocoon', item)}
                            className="text-primary-600 hover:text-primary-900 px-2 py-1 rounded touch-manipulation"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => onDelete('cocoon', item.id)}
                            className="text-red-600 hover:text-red-900 px-2 py-1 rounded touch-manipulation"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-3 sm:px-4 py-3 whitespace-nowrap text-xs sm:text-sm font-medium text-gray-900">
                        {item.location}
                      </td>
                      <td className="px-3 sm:px-4 py-3 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                        {formatDate(item.date)}
                      </td>
                      <td className="px-3 sm:px-4 py-3 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                        ₹{parseFloat(item.price).toFixed(2)}
                      </td>
                      <td className="px-3 sm:px-4 py-3 whitespace-nowrap text-xs sm:text-sm font-medium">
                        <div className="flex flex-col sm:flex-row gap-2">
                          <button
                            onClick={() => onEdit('silk', item)}
                            className="text-primary-600 hover:text-primary-900 px-2 py-1 rounded touch-manipulation"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => onDelete('silk', item.id)}
                            className="text-red-600 hover:text-red-900 px-2 py-1 rounded touch-manipulation"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default DataTable

