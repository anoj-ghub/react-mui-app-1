const firstNames = ['John', 'Jane', 'Bob', 'Alice', 'Charlie', 'Eva', 'Frank', 'Grace', 'David', 'Sarah', 'Mike', 'Lisa', 'Tom', 'Emma', 'James', 'Olivia', 'William', 'Sophia', 'Alexander', 'Isabella', 'Benjamin', 'Charlotte', 'Lucas', 'Amelia', 'Henry', 'Mia', 'Theodore', 'Harper', 'Sebastian', 'Evelyn']
const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson']
const categories = ['Electronics', 'Home', 'Sports', 'Books', 'Clothing', 'Garden', 'Automotive', 'Health', 'Beauty', 'Toys']
const departments = ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations', 'IT', 'Customer Service', 'Legal', 'R&D']
const statuses = ['Shipped', 'Delivered', 'Pending', 'Processing', 'Cancelled', 'Returned']
const products = ['Widget A', 'Widget B', 'Widget C', 'Gadget X', 'Gadget Y', 'Device Pro', 'Device Lite', 'Tool Master', 'Tool Basic', 'Kit Deluxe']

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
          data[key] = Math.floor(Math.random() * 5000) + 500
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
          data[key] = parseFloat((Math.random() * 500 + 10).toFixed(2))
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
          data[key] = parseFloat((Math.random() * 1000 + 50).toFixed(2))
          break
        case 'employee':
          data[key] = `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`
          break
        case 'department':
          data[key] = departments[Math.floor(Math.random() * departments.length)]
          break
        case 'salary':
          data[key] = Math.floor(Math.random() * 80000) + 40000
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

export const generateMockData = (tableName) => {
  return generateData(100, dataStructures[tableName] || {})
}