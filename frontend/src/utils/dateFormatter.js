/**
 * Format date to dd/mm/yyyy format
 * @param {string|Date} date - Date string or Date object
 * @returns {string} Formatted date string in dd/mm/yyyy format
 */
export const formatDate = (date) => {
  if (!date) return ''
  
  const dateObj = typeof date === 'string' ? new Date(date) : date
  
  if (isNaN(dateObj.getTime())) {
    return '' // Invalid date
  }
  
  const day = String(dateObj.getDate()).padStart(2, '0')
  const month = String(dateObj.getMonth() + 1).padStart(2, '0')
  const year = dateObj.getFullYear()
  
  return `${day}/${month}/${year}`
}

/**
 * Format date and time to dd/mm/yyyy, hh:mm format
 * @param {string|Date} date - Date string or Date object
 * @returns {string} Formatted date and time string
 */
export const formatDateTime = (date) => {
  if (!date) return ''
  
  const dateObj = typeof date === 'string' ? new Date(date) : date
  
  if (isNaN(dateObj.getTime())) {
    return '' // Invalid date
  }
  
  const day = String(dateObj.getDate()).padStart(2, '0')
  const month = String(dateObj.getMonth() + 1).padStart(2, '0')
  const year = dateObj.getFullYear()
  const hours = String(dateObj.getHours()).padStart(2, '0')
  const minutes = String(dateObj.getMinutes()).padStart(2, '0')
  
  return `${day}/${month}/${year}, ${hours}:${minutes}`
}

