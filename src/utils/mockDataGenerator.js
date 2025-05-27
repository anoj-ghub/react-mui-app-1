/**
 * @fileoverview Mock Data Generator for React MUI Data Browser Application
 * @author System
 * @version 1.0.0
 * 
 * This utility generates realistic test data for different table types with 4-decimal precision
 * for amount fields. Supports multiple data types including names, dates, amounts, and status values.
 * 
 * Features:
 * - 4 different table structures
 * - Realistic test data generation
 * - 4-decimal precision for amount fields
 * - Configurable data structures
 */

/** @type {string[]} Array of first names for generating realistic person names */
const firstNames = ['John', 'Jane', 'Bob', 'Alice', 'Charlie', 'Eva', 'Frank', 'Grace', 'David', 'Sarah', 'Mike', 'Lisa', 'Tom', 'Emma', 'James', 'Olivia', 'William', 'Sophia', 'Alexander', 'Isabella', 'Benjamin', 'Charlotte', 'Lucas', 'Amelia', 'Henry', 'Mia', 'Theodore', 'Harper', 'Sebastian', 'Evelyn']

/** @type {string[]} Array of last names for generating realistic person names */
const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson']

/** @type {string[]} Array of product categories */
const categories = ['Electronics', 'Home', 'Sports', 'Books', 'Clothing', 'Garden', 'Automotive', 'Health', 'Beauty', 'Toys']

/** @type {string[]} Array of company departments */
const departments = ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations', 'IT', 'Customer Service', 'Legal', 'R&D']

/** @type {string[]} Array of order status values */
const statuses = ['Shipped', 'Delivered', 'Pending', 'Processing', 'Cancelled', 'Returned']

/** @type {string[]} Array of product names */
const products = ['Widget A', 'Widget B', 'Widget C', 'Gadget X', 'Gadget Y', 'Device Pro', 'Device Lite', 'Tool Master', 'Tool Basic', 'Kit Deluxe']

/**
 * Generates an array of test data based on the provided data structure
 * @param {number} count - Number of records to generate
 * @param {Object} dataStructure - Object defining the structure and types of data to generate
 * @returns {Array<Object>} Array of generated data objects
 */
const generateData = (count, dataStructure) => {
  return Array.from({ length: count }, (_, index) => {
    const data = { id: index + 1 }
    
    Object.keys(dataStructure).forEach(key => {
      const config = dataStructure[key]
      switch (config.type) {
        case 'name':
          data[key] = `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`
          break
        case 'account':
          data[key] = `ACC${String(index + 1).padStart(3, '0')}`
          break
        case 'amount':
          data[key] = parseFloat((Math.random() * 5000 + 500).toFixed(4))
          break
        case 'date':
          const startDate = new Date(2024, 0, 1)
          const endDate = new Date(2025, 11, 31)
          const randomTime = startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime())
          data[key] = new Date(randomTime).toISOString().split('T')[0]
          break
        case 'product':
          data[key] = products[Math.floor(Math.random() * products.length)]
          break
        case 'category':
          data[key] = categories[Math.floor(Math.random() * categories.length)]
          break
        case 'price':
          data[key] = parseFloat((Math.random() * 500 + 10).toFixed(4))
          break
        case 'stock':
          data[key] = Math.floor(Math.random() * 200) + 1
          break
        case 'order':
          data[key] = `ORD${String(index + 1).padStart(3, '0')}`
          break
        case 'status':
          data[key] = statuses[Math.floor(Math.random() * statuses.length)]
          break
        case 'total':
          data[key] = parseFloat((Math.random() * 1000 + 50).toFixed(4))
          break
        case 'employee':
          data[key] = `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`
          break
        case 'department':
          data[key] = departments[Math.floor(Math.random() * departments.length)]
          break
        case 'salary':
          data[key] = parseFloat((Math.random() * 80000 + 40000).toFixed(4))
          break
        case 'hire_date':
          const hireStart = new Date(2020, 0, 1)
          const hireEnd = new Date(2024, 11, 31)
          const randomHireTime = hireStart.getTime() + Math.random() * (hireEnd.getTime() - hireStart.getTime())
          data[key] = new Date(randomHireTime).toISOString().split('T')[0]
          break
      }
    })
    
    return data
  })
}

/**
 * Data structure definitions for each table type
 * Defines the fields and their data types for generating mock data
 * @type {Object<string, Object>}
 */
const dataStructures = {
  'Table 1': {
    name: { type: 'name' },
    account: { type: 'account' },
    amount: { type: 'amount' },
    date: { type: 'date' }
  },
  'Table 2': {
    product: { type: 'product' },
    category: { type: 'category' },
    price: { type: 'price' },
    stock: { type: 'stock' }
  },
  'Table 3': {
    order: { type: 'order' },
    customer: { type: 'name' },
    status: { type: 'status' },
    total: { type: 'total' }
  },
  'Table 4': {
    employee: { type: 'employee' },
    department: { type: 'department' },
    salary: { type: 'salary' },
    hire_date: { type: 'hire_date' }
  }
}

/**
 * Generates mock data for a specific table type
 * @param {string} tableName - The name of the table to generate data for
 * @returns {Array<Object>} Array of 100 generated data objects
 * @example
 * const data = generateMockData('Table 1')
 * // Returns array of objects with id, name, account, amount, date fields
 */
export const generateMockData = (tableName) => {
  return generateData(100, dataStructures[tableName] || {})
}