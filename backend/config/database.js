import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database file path (JSON file)
const dbPath = path.join(__dirname, '..', 'data', 'silk_market.json');

// Ensure data directory exists
const dataDir = path.dirname(dbPath);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// In-memory database
let db = {
  cocoon_rates: [],
  silk_prices: [],
  nextCocoonId: 1,
  nextSilkId: 1
};

// Load database from file
const loadDatabase = () => {
  try {
    if (fs.existsSync(dbPath)) {
      const data = fs.readFileSync(dbPath, 'utf8');
      db = JSON.parse(data);
      // Ensure IDs are set correctly
      if (db.cocoon_rates.length > 0) {
        db.nextCocoonId = Math.max(...db.cocoon_rates.map(r => r.id)) + 1;
      }
      if (db.silk_prices.length > 0) {
        db.nextSilkId = Math.max(...db.silk_prices.map(r => r.id)) + 1;
      }
      console.log(`Database loaded from: ${dbPath}`);
    } else {
      console.log(`Creating new database at: ${dbPath}`);
    }
  } catch (error) {
    console.error('Error loading database:', error);
    // Start with empty database
    db = {
      cocoon_rates: [],
      silk_prices: [],
      nextCocoonId: 1,
      nextSilkId: 1
    };
  }
};

// Save database to file
const saveDatabase = () => {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
  } catch (error) {
    console.error('Error saving database:', error);
    throw error;
  }
};

// Database API (mimics SQL interface)
const database = {
  // Cocoon rates operations
  cocoon: {
    getAll: () => db.cocoon_rates.sort((a, b) => {
      const dateCompare = new Date(b.date) - new Date(a.date);
      if (dateCompare !== 0) return dateCompare;
      return a.location.localeCompare(b.location);
    }),
    
    getById: (id) => db.cocoon_rates.find(r => r.id === parseInt(id)),
    
    insert: (data) => {
      const record = {
        id: db.nextCocoonId++,
        ...data,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      db.cocoon_rates.push(record);
      saveDatabase();
      return { lastInsertRowid: record.id, changes: 1 };
    },
    
    update: (id, updates) => {
      const index = db.cocoon_rates.findIndex(r => r.id === parseInt(id));
      if (index === -1) return { changes: 0 };
      
      db.cocoon_rates[index] = {
        ...db.cocoon_rates[index],
        ...updates,
        updated_at: new Date().toISOString()
      };
      saveDatabase();
      return { changes: 1 };
    },
    
    delete: (id) => {
      const index = db.cocoon_rates.findIndex(r => r.id === parseInt(id));
      if (index === -1) return { changes: 0 };
      
      db.cocoon_rates.splice(index, 1);
      saveDatabase();
      return { changes: 1 };
    },
    
    getLocations: () => {
      const locations = {};
      db.cocoon_rates.forEach(rate => {
        if (!locations[rate.location]) {
          locations[rate.location] = {
            max_prices: [],
            avg_prices: [],
            min_prices: [],
            quantities: []
          };
        }
        locations[rate.location].max_prices.push(rate.max_price);
        locations[rate.location].avg_prices.push(rate.avg_price);
        locations[rate.location].min_prices.push(rate.min_price);
        locations[rate.location].quantities.push(rate.quantity);
      });
      
      return Object.keys(locations).map(location => {
        const loc = locations[location];
        return {
          location,
          highest_price: Math.max(...loc.max_prices),
          average_price: loc.avg_prices.reduce((a, b) => a + b, 0) / loc.avg_prices.length,
          minimum_price: Math.min(...loc.min_prices),
          total_quantity: loc.quantities.reduce((a, b) => a + b, 0),
          lot_count: loc.quantities.length
        };
      });
    },
    
    getMonthly: (priceType) => {
      const typeMap = {
        'highest': 'max_price',
        'average': 'avg_price',
        'minimum': 'min_price'
      };
      const column = typeMap[priceType] || 'avg_price';
      
      const monthly = {};
      db.cocoon_rates.forEach(rate => {
        const month = rate.date.substring(0, 7); // YYYY-MM
        const key = `${month}-${rate.location}`;
        if (!monthly[key]) {
          monthly[key] = {
            month,
            location: rate.location,
            prices: []
          };
        }
        monthly[key].prices.push(rate[column]);
      });
      
      return Object.values(monthly).map(item => ({
        month: item.month,
        location: item.location,
        price: item.prices.reduce((a, b) => a + b, 0) / item.prices.length
      }));
    }
  },
  
  // Silk prices operations
  silk: {
    getAll: () => db.silk_prices.sort((a, b) => {
      const dateCompare = new Date(b.date) - new Date(a.date);
      if (dateCompare !== 0) return dateCompare;
      return a.location.localeCompare(b.location);
    }),
    
    getById: (id) => db.silk_prices.find(r => r.id === parseInt(id)),
    
    insert: (data) => {
      const record = {
        id: db.nextSilkId++,
        ...data,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      db.silk_prices.push(record);
      saveDatabase();
      return { lastInsertRowid: record.id, changes: 1 };
    },
    
    update: (id, updates) => {
      const index = db.silk_prices.findIndex(r => r.id === parseInt(id));
      if (index === -1) return { changes: 0 };
      
      db.silk_prices[index] = {
        ...db.silk_prices[index],
        ...updates,
        updated_at: new Date().toISOString()
      };
      saveDatabase();
      return { changes: 1 };
    },
    
    delete: (id) => {
      const index = db.silk_prices.findIndex(r => r.id === parseInt(id));
      if (index === -1) return { changes: 0 };
      
      db.silk_prices.splice(index, 1);
      saveDatabase();
      return { changes: 1 };
    },
    
    getLocations: () => {
      const latest = {};
      db.silk_prices.forEach(price => {
        const key = price.location;
        if (!latest[key] || new Date(price.date) > new Date(latest[key].date)) {
          latest[key] = price;
        }
      });
      return Object.values(latest).sort((a, b) => a.location.localeCompare(b.location));
    }
  }
};

// Initialize database
export const initializeDatabase = () => {
  try {
    loadDatabase();
    
    // Insert sample data if database is empty
    if (db.cocoon_rates.length === 0) {
      const sampleCocoonData = [
        { location: 'Karnataka', date: '2024-01-15', max_price: 450.00, avg_price: 420.00, min_price: 400.00, quantity: 1500.00 },
        { location: 'Karnataka', date: '2024-01-16', max_price: 460.00, avg_price: 430.00, min_price: 410.00, quantity: 1800.00 },
        { location: 'Tamil Nadu', date: '2024-01-15', max_price: 440.00, avg_price: 410.00, min_price: 390.00, quantity: 1200.00 },
        { location: 'Tamil Nadu', date: '2024-01-16', max_price: 450.00, avg_price: 420.00, min_price: 400.00, quantity: 1400.00 },
        { location: 'West Bengal', date: '2024-01-15', max_price: 470.00, avg_price: 440.00, min_price: 420.00, quantity: 2000.00 },
        { location: 'West Bengal', date: '2024-01-16', max_price: 480.00, avg_price: 450.00, min_price: 430.00, quantity: 2200.00 }
      ];
      
      sampleCocoonData.forEach(data => database.cocoon.insert(data));
    }
    
    if (db.silk_prices.length === 0) {
      const sampleSilkData = [
        { location: 'Karnataka', price: 3500.00, date: '2024-01-15' },
        { location: 'Karnataka', price: 3550.00, date: '2024-01-16' },
        { location: 'Tamil Nadu', price: 3450.00, date: '2024-01-15' },
        { location: 'Tamil Nadu', price: 3500.00, date: '2024-01-16' },
        { location: 'West Bengal', price: 3600.00, date: '2024-01-15' },
        { location: 'West Bengal', price: 3650.00, date: '2024-01-16' }
      ];
      
      sampleSilkData.forEach(data => database.silk.insert(data));
    }
    
    console.log('Database initialized successfully');
    console.log(`Cocoon rates: ${db.cocoon_rates.length} records`);
    console.log(`Silk prices: ${db.silk_prices.length} records`);
    return true;
  } catch (error) {
    console.error('Database initialization error:', error);
    console.error('Error details:', error.message);
    throw error;
  }
};

// Test database connection
export const testConnection = () => {
  try {
    loadDatabase();
    console.log('Database connected successfully');
    return true;
  } catch (error) {
    console.error('Database connection error:', error.message);
    return false;
  }
};

export default database;
