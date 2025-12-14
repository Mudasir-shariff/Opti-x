import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000 // 10 second timeout
})

// Add request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`)
    return config
  },
  (error) => {
    console.error('API Request Error:', error)
    return Promise.reject(error)
  }
)

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    console.error('API Response Error:', error.response?.data || error.message)
    return Promise.reject(error)
  }
)

// Cocoon Rates API
export const cocoonAPI = {
  getAll: () => api.get('/cocoon'),
  getLocations: () => api.get('/cocoon/locations'),
  getMonthly: (type = 'average') => api.get(`/cocoon/monthly?type=${type}`)
}

// Silk Prices API
export const silkAPI = {
  getAll: () => api.get('/silk'),
  getLocations: () => api.get('/silk/locations')
}

// Admin API (requires authentication)
export const adminAPI = {
  // Cocoon rates
  addCocoon: (data, authHeader) => 
    api.post('/admin/cocoon', data, { headers: authHeader }),
  updateCocoon: (id, data, authHeader) => 
    api.put(`/admin/cocoon/${id}`, data, { headers: authHeader }),
  deleteCocoon: (id, authHeader) => 
    api.delete(`/admin/cocoon/${id}`, { headers: authHeader }),
  
  // Silk prices
  addSilk: (data, authHeader) => 
    api.post('/admin/silk', data, { headers: authHeader }),
  updateSilk: (id, data, authHeader) => 
    api.put(`/admin/silk/${id}`, data, { headers: authHeader }),
  deleteSilk: (id, authHeader) => 
    api.delete(`/admin/silk/${id}`, { headers: authHeader })
}

export default api

