import { createClient } from '@supabase/supabase-js'

// Supabase configuration from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY')
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database helper functions
export const db = {
  // Cocoon rates
  cocoon: {
    getAll: async () => {
      const { data, error } = await supabase
        .from('cocoon_rates')
        .select('*')
        .order('date', { ascending: false })
        .order('location', { ascending: true })
      return { data, error }
    },

    getLocations: async () => {
      const { data, error } = await supabase
        .from('cocoon_rates')
        .select('location, max_price, avg_price, min_price, quantity')
      
      if (error) return { data: null, error }
      
      if (!data || data.length === 0) {
        return { data: [], error: null }
      }
      
      // Aggregate by location
      const locations = {}
      data.forEach(rate => {
        if (!locations[rate.location]) {
          locations[rate.location] = {
            location: rate.location,
            max_prices: [],
            avg_prices: [],
            min_prices: [],
            quantities: []
          }
        }
        locations[rate.location].max_prices.push(parseFloat(rate.max_price))
        locations[rate.location].avg_prices.push(parseFloat(rate.avg_price))
        locations[rate.location].min_prices.push(parseFloat(rate.min_price))
        locations[rate.location].quantities.push(parseFloat(rate.quantity))
      })

      const aggregated = Object.values(locations).map(loc => ({
        location: loc.location,
        highest_price: Math.max(...loc.max_prices),
        average_price: loc.avg_prices.reduce((a, b) => a + b, 0) / loc.avg_prices.length,
        minimum_price: Math.min(...loc.min_prices),
        total_quantity: loc.quantities.reduce((a, b) => a + b, 0),
        lot_count: loc.quantities.reduce((a, b) => a + b, 0) // Sum of all lots (quantity field now represents number of lots)
      }))

      return { data: aggregated, error: null }
    },

    getMonthly: async (priceType = 'average') => {
      const typeMap = {
        'highest': 'max_price',
        'average': 'avg_price',
        'minimum': 'min_price'
      }
      const column = typeMap[priceType] || 'avg_price'

      const { data, error } = await supabase
        .from('cocoon_rates')
        .select('date, location, max_price, avg_price, min_price')
        .order('date', { ascending: true })

      if (error) return { data: null, error }

      // Group by month and location
      const monthly = {}
      data.forEach(rate => {
        const month = rate.date.substring(0, 7) // YYYY-MM
        const key = `${month}-${rate.location}`
        if (!monthly[key]) {
          monthly[key] = {
            month,
            location: rate.location,
            prices: []
          }
        }
        monthly[key].prices.push(rate[column])
      })

      const result = Object.values(monthly).map(item => ({
        month: item.month,
        location: item.location,
        price: item.prices.reduce((a, b) => a + b, 0) / item.prices.length
      }))

      return { data: result, error: null }
    },

    // RPC functions for write operations (require admin password)
    insertRPC: async (record, adminPassword) => {
      const { data, error } = await supabase.rpc('insert_cocoon_rate', {
        p_password: adminPassword,
        p_location: record.location,
        p_date: record.date,
        p_max_price: record.max_price,
        p_avg_price: record.avg_price,
        p_min_price: record.min_price,
        p_quantity: record.quantity
      })
      
      if (error) {
        return { data: null, error }
      }
      
      // Fetch the inserted record
      const { data: inserted, error: fetchError } = await supabase
        .from('cocoon_rates')
        .select('*')
        .eq('id', data)
        .single()
      
      return { data: inserted, error: fetchError }
    },

    updateRPC: async (id, updates, adminPassword) => {
      const { data, error } = await supabase.rpc('update_cocoon_rate', {
        p_password: adminPassword,
        p_id: id,
        p_location: updates.location || null,
        p_date: updates.date || null,
        p_max_price: updates.max_price || null,
        p_avg_price: updates.avg_price || null,
        p_min_price: updates.min_price || null,
        p_quantity: updates.quantity || null
      })
      
      if (error) {
        return { data: null, error }
      }
      
      // Fetch the updated record
      const { data: updated, error: fetchError } = await supabase
        .from('cocoon_rates')
        .select('*')
        .eq('id', id)
        .single()
      
      return { data: updated, error: fetchError }
    },

    deleteRPC: async (id, adminPassword) => {
      const { error } = await supabase.rpc('delete_cocoon_rate', {
        p_password: adminPassword,
        p_id: id
      })
      return { error }
    }
  },

  // Silk prices
  silk: {
    getAll: async () => {
      const { data, error } = await supabase
        .from('silk_prices')
        .select('*')
        .order('date', { ascending: false })
        .order('location', { ascending: true })
      return { data, error }
    },

    getLocations: async () => {
      // Get latest price for each location
      const { data, error } = await supabase
        .from('silk_prices')
        .select('*')
        .order('date', { ascending: false })

      if (error) return { data: null, error }

      // Get latest entry for each location
      const latest = {}
      data.forEach(price => {
        if (!latest[price.location] || new Date(price.date) > new Date(latest[price.location].date)) {
          latest[price.location] = price
        }
      })

      return { data: Object.values(latest).sort((a, b) => a.location.localeCompare(b.location)), error: null }
    },

    // RPC functions for write operations (require admin password)
    insertRPC: async (record, adminPassword) => {
      const { data, error } = await supabase.rpc('insert_silk_price', {
        p_password: adminPassword,
        p_location: record.location,
        p_price: record.price,
        p_date: record.date
      })
      
      if (error) {
        return { data: null, error }
      }
      
      // Fetch the inserted record
      const { data: inserted, error: fetchError } = await supabase
        .from('silk_prices')
        .select('*')
        .eq('id', data)
        .single()
      
      return { data: inserted, error: fetchError }
    },

    updateRPC: async (id, updates, adminPassword) => {
      const { data, error } = await supabase.rpc('update_silk_price', {
        p_password: adminPassword,
        p_id: id,
        p_location: updates.location || null,
        p_price: updates.price || null,
        p_date: updates.date || null
      })
      
      if (error) {
        return { data: null, error }
      }
      
      // Fetch the updated record
      const { data: updated, error: fetchError } = await supabase
        .from('silk_prices')
        .select('*')
        .eq('id', id)
        .single()
      
      return { data: updated, error: fetchError }
    },

    deleteRPC: async (id, adminPassword) => {
      const { error } = await supabase.rpc('delete_silk_price', {
        p_password: adminPassword,
        p_id: id
      })
      return { error }
    }
  }
}

export default supabase

