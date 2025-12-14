import { useState, useEffect } from 'react'
import { SILK_LOCATIONS } from '../../utils/constants'

const SilkForm = ({ onSubmit, initialData, onCancel }) => {
  const [formData, setFormData] = useState({
    location: '',
    price: '',
    date: new Date().toISOString().split('T')[0]
  })

  useEffect(() => {
    if (initialData) {
      setFormData({
        location: initialData.location || '',
        price: initialData.price || '',
        date: initialData.date ? new Date(initialData.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
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
    
    onSubmit('silk', {
      location: formData.location,
      price: parseFloat(formData.price),
      date: dateISO
    })
    
    // Reset form if not editing
    if (!initialData) {
      setFormData({
        location: '',
        price: '',
        date: new Date().toISOString().split('T')[0]
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
          {SILK_LOCATIONS.map(loc => (
            <option key={loc} value={loc}>{loc}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
          Price (₹) *
        </label>
        <input
          type="number"
          id="price"
          name="price"
          required
          min="0"
          step="0.01"
          value={formData.price}
          onChange={handleChange}
          className="w-full px-3 py-3 sm:py-2 text-base sm:text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 touch-manipulation"
          placeholder="e.g., 3500.00"
        />
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

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <button
          type="submit"
          className="flex-1 px-4 py-3 sm:py-2 text-base sm:text-sm bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors touch-manipulation"
        >
          {initialData ? 'Update' : 'Add'} Silk Price
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

export default SilkForm
