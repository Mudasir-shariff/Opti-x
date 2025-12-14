import { useState, useEffect } from 'react'
import { COCOON_LOCATIONS } from '../../utils/constants'

const CocoonForm = ({ onSubmit, initialData, onCancel }) => {
  const [formData, setFormData] = useState({
    location: '',
    date: new Date().toISOString().split('T')[0],
    max_price: '',
    avg_price: '',
    min_price: '',
    quantity: ''
  })

  useEffect(() => {
    if (initialData) {
      setFormData({
        location: initialData.location || '',
        date: initialData.date ? new Date(initialData.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        max_price: initialData.max_price || '',
        avg_price: initialData.avg_price || '',
        min_price: initialData.min_price || '',
        quantity: initialData.quantity || ''
      })
    }
  }, [initialData])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Convert date to ISO string for Supabase
    const dateISO = new Date(formData.date + 'T00:00:00').toISOString()
    
    onSubmit('cocoon', {
      location: formData.location,
      date: dateISO,
      max_price: parseFloat(formData.max_price),
      avg_price: parseFloat(formData.avg_price),
      min_price: parseFloat(formData.min_price),
      quantity: parseFloat(formData.quantity)
    })
    
    // Reset form if not editing
    if (!initialData) {
      setFormData({
        location: '',
        date: new Date().toISOString().split('T')[0],
        max_price: '',
        avg_price: '',
        min_price: '',
        quantity: ''
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-4 sm:p-6 space-y-4">
      <div>
        <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
          Location *
        </label>
        <select
          id="location"
          name="location"
          required
          value={formData.location}
          onChange={handleChange}
          className="w-full px-3 py-3 sm:py-2 text-base sm:text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 touch-manipulation"
        >
          <option value="">Select location</option>
          {COCOON_LOCATIONS.map(loc => (
            <option key={loc} value={loc}>{loc}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
          Date *
        </label>
        <input
          type="date"
          id="date"
          name="date"
          required
          value={formData.date}
          onChange={handleChange}
          className="w-full px-3 py-3 sm:py-2 text-base sm:text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 touch-manipulation"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label htmlFor="max_price" className="block text-sm font-medium text-gray-700 mb-1">
            Max Price (₹) *
          </label>
          <input
            type="number"
            id="max_price"
            name="max_price"
            required
            min="0"
            step="0.01"
            value={formData.max_price}
            onChange={handleChange}
            className="w-full px-3 py-3 sm:py-2 text-base sm:text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 touch-manipulation"
          />
        </div>

        <div>
          <label htmlFor="avg_price" className="block text-sm font-medium text-gray-700 mb-1">
            Avg Price (₹) *
          </label>
          <input
            type="number"
            id="avg_price"
            name="avg_price"
            required
            min="0"
            step="0.01"
            value={formData.avg_price}
            onChange={handleChange}
            className="w-full px-3 py-3 sm:py-2 text-base sm:text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 touch-manipulation"
          />
        </div>

        <div>
          <label htmlFor="min_price" className="block text-sm font-medium text-gray-700 mb-1">
            Min Price (₹) *
          </label>
          <input
            type="number"
            id="min_price"
            name="min_price"
            required
            min="0"
            step="0.01"
            value={formData.min_price}
            onChange={handleChange}
            className="w-full px-3 py-3 sm:py-2 text-base sm:text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 touch-manipulation"
          />
        </div>
      </div>

      <div>
        <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
          Number of Lots *
        </label>
        <input
          type="number"
          id="quantity"
          name="quantity"
          required
          min="0"
          step="1"
          value={formData.quantity}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          placeholder="Enter number of lots"
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <button
          type="submit"
          className="flex-1 px-4 py-3 sm:py-2 text-base sm:text-sm bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors touch-manipulation"
        >
          {initialData ? 'Update' : 'Add'} Cocoon Rate
        </button>
        {initialData && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-3 sm:py-2 text-base sm:text-sm bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors touch-manipulation"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}

export default CocoonForm
