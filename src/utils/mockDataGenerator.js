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
 * Generate pipe-delimited data for testing
 * @returns {string} Pipe-delimited string
 */
const generatePipeDelimitedData = () => {
  // Define structured data with 7 fields per record
  const recordSets = [
    // Product records (Name|Category|Price|Stock|SKU|Supplier|Status)
    [
      ['Widget Pro', 'Electronics', '299.99', '50', 'WGT-001', 'TechCorp', 'Active'],
      ['Gadget X', 'Electronics', '199.99', '25', 'GDG-002', 'TechCorp', 'Active'],
      ['Tool Master', 'Tools', '89.99', '75', 'TLM-003', 'ToolCo', 'Active']
    ],
    // Employee records (Name|Department|Salary|HireDate|ID|Manager|Status)
    [
      ['John Smith', 'Engineering', '85000', '2023-01-15', 'EMP-001', 'Sarah Johnson', 'Active'],
      ['Jane Doe', 'Marketing', '75000', '2023-02-20', 'EMP-002', 'Mike Brown', 'Active'],
      ['Bob Wilson', 'Sales', '65000', '2023-03-10', 'EMP-003', 'Lisa Davis', 'Active']
    ],
    // Customer records (Name|Email|Phone|Address|City|State|Status)
    [
      ['Alice Johnson', 'alice@email.com', '555-0101', '123 Main St', 'New York', 'NY', 'Active'],
      ['David Brown', 'david@email.com', '555-0102', '456 Oak Ave', 'Los Angeles', 'CA', 'Active'],
      ['Emma Davis', 'emma@email.com', '555-0103', '789 Pine Rd', 'Chicago', 'IL', 'Active']
    ],
    // Order records (OrderID|CustomerID|Product|Quantity|Price|Date|Status)
    [
      ['ORD-001', 'CUST-101', 'Widget Pro', '2', '599.98', '2024-01-15', 'Shipped'],
      ['ORD-002', 'CUST-102', 'Gadget X', '1', '199.99', '2024-01-16', 'Processing'],
      ['ORD-003', 'CUST-103', 'Tool Master', '3', '269.97', '2024-01-17', 'Delivered']
    ],
    // Project records (ProjectID|Name|Manager|Budget|StartDate|EndDate|Status)
    [
      ['PRJ-001', 'Website Redesign', 'John Smith', '50000', '2024-01-01', '2024-06-30', 'In Progress'],
      ['PRJ-002', 'Mobile App', 'Jane Doe', '75000', '2024-02-01', '2024-08-31', 'Planning'],
      ['PRJ-003', 'Database Migration', 'Bob Wilson', '25000', '2024-03-01', '2024-05-31', 'Completed']
    ],
    // Transaction records (TransID|Account|Amount|Type|Date|Reference|Status)
    [
      ['TXN-001', 'ACC-001', '1500.00', 'Deposit', '2024-01-15', 'Direct Deposit', 'Cleared'],
      ['TXN-002', 'ACC-002', '250.00', 'Withdrawal', '2024-01-16', 'ATM Transaction', 'Cleared'],
      ['TXN-003', 'ACC-003', '3200.00', 'Transfer', '2024-01-17', 'Wire Transfer', 'Pending']
    ]
  ];
  
  // Select a random record set
  const selectedSet = recordSets[Math.floor(Math.random() * recordSets.length)];
  
  // Take first 2-3 records to avoid too much data
  const recordsToUse = selectedSet.slice(0, 3);
  
  // Flatten all records into a single array and join with pipes
  // This creates a string where every 7 fields represents one complete record
  const allFields = recordsToUse.flat();
  const result = allFields.join('|');
  
  console.log('Generated pipe-delimited data:', result);
  console.log('Number of fields:', allFields.length);
  console.log('Number of records:', recordsToUse.length);
  return result;
};

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
        case 'pipe_delimited':
          data[key] = generatePipeDelimitedData()
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
  // Legacy table names for backward compatibility
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
  },

  // New database table names
  // Customer Management
  'customer_accounts': {
    customer_name: { type: 'name' },
    account_number: { type: 'account' },
    balance: { type: 'amount' },
    registration_date: { type: 'date' },
    status: { type: 'status' },
    tags: { type: 'pipe_delimited' },
    categories: { type: 'pipe_delimited' }
  },
  'user_sessions': {
    user_name: { type: 'name' },
    session_id: { type: 'account' },
    login_time: { type: 'date' },
    duration_minutes: { type: 'stock' },
    status: { type: 'status' },
    permissions: { type: 'pipe_delimited' },
    roles: { type: 'pipe_delimited' }
  },
  'customer_support_tickets': {
    customer_name: { type: 'name' },
    ticket_id: { type: 'account' },
    issue_type: { type: 'category' },
    priority: { type: 'status' },
    created_date: { type: 'date' }
  },

  // Sales & Orders
  'order_details': {
    customer_name: { type: 'name' },
    order_id: { type: 'order' },
    total_amount: { type: 'total' },
    order_date: { type: 'date' },
    status: { type: 'status' }
  },
  'payment_transactions': {
    customer_name: { type: 'name' },
    transaction_id: { type: 'account' },
    amount: { type: 'amount' },
    payment_method: { type: 'category' },
    transaction_date: { type: 'date' }
  },
  'sales_reports': {
    sales_rep: { type: 'employee' },
    region: { type: 'department' },
    revenue: { type: 'total' },
    report_date: { type: 'date' },
    target_met: { type: 'status' }
  },

  // Inventory & Products
  'product_catalog': {
    product_name: { type: 'product' },
    category: { type: 'category' },
    price: { type: 'price' },
    stock_quantity: { type: 'stock' },
    last_updated: { type: 'date' }
  },
  'inventory_levels': {
    product_name: { type: 'product' },
    warehouse: { type: 'department' },
    current_stock: { type: 'stock' },
    reorder_level: { type: 'stock' },
    last_restock: { type: 'date' }
  },

  // Marketing & Analytics
  'campaign_performance': {
    campaign_name: { type: 'product' },
    channel: { type: 'category' },
    spend: { type: 'amount' },
    conversions: { type: 'stock' },
    launch_date: { type: 'date' }
  },
  'website_analytics': {
    page_name: { type: 'product' },
    visitors: { type: 'stock' },
    bounce_rate: { type: 'price' },
    avg_session: { type: 'stock' },
    report_date: { type: 'date' }
  },
  'customer_feedback': {
    customer_name: { type: 'name' },
    product_name: { type: 'product' },
    rating: { type: 'stock' },
    feedback_date: { type: 'date' },
    category: { type: 'category' }
  },

  // Financial & Reporting
  'revenue_breakdown': {
    department: { type: 'department' },
    revenue: { type: 'total' },
    expenses: { type: 'amount' },
    profit_margin: { type: 'price' },
    period_end: { type: 'date' }
  },
  'budget_allocations': {
    department: { type: 'department' },
    allocated_budget: { type: 'total' },
    spent_amount: { type: 'amount' },
    remaining: { type: 'amount' },
    allocation_date: { type: 'date' }
  },
  'expense_records': {
    employee_name: { type: 'employee' },
    expense_type: { type: 'category' },
    amount: { type: 'amount' },
    expense_date: { type: 'date' },
    status: { type: 'status' }
  },

  // System & Logs
  'audit_logs': {
    user_name: { type: 'name' },
    action: { type: 'category' },
    resource: { type: 'product' },
    timestamp: { type: 'date' },
    status: { type: 'status' }
  },
  'error_logs': {
    error_type: { type: 'category' },
    error_message: { type: 'product' },
    severity: { type: 'status' },
    occurrence_count: { type: 'stock' },
    last_seen: { type: 'date' }
  },
  'system_config': {
    config_name: { type: 'product' },
    config_value: { type: 'category' },
    environment: { type: 'department' },
    last_modified: { type: 'date' },
    is_active: { type: 'status' }
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
  const structure = dataStructures[tableName];
  
  if (!structure) {
    // Fallback structure for unknown table names
    console.warn(`No data structure found for table: ${tableName}. Using fallback structure.`);
    const fallbackStructure = {
      name: { type: 'name' },
      value: { type: 'amount' },
      category: { type: 'category' },
      date: { type: 'date' },
      status: { type: 'status' }
    };
    return generateData(100, fallbackStructure);
  }
  
  return generateData(100, structure);
}