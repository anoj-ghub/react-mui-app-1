/**
 * Test file for NOD (Number of Decimals) functionality
 * This file contains tests to validate the amount formatter utility
 */

import { formatAmount, formatAmountFields, isValidNOD, getRecommendedNOD } from './src/utils/amountFormatter.js';

// Test data with 4 decimal precision
const testAmounts = [
  1234.5678,
  999.9999,
  0.0001,
  5000.0000,
  123456.7890
];

console.log('=== NOD Functionality Tests ===\n');

// Test 1: Format with different NOD values
console.log('Test 1: Formatting with different NOD values');
testAmounts.forEach(amount => {
  console.log(`\nAmount: ${amount}`);
  for (let nod = 0; nod <= 4; nod++) {
    const formatted = formatAmount(amount, nod);
    console.log(`  NOD ${nod}: ${formatted}`);
  }
});

// Test 2: Validate NOD function
console.log('\n\nTest 2: NOD Validation');
for (let i = -1; i <= 5; i++) {
  console.log(`isValidNOD(${i}): ${isValidNOD(i)}`);
}

// Test 3: Recommended NOD values
console.log('\n\nTest 3: Recommended NOD values');
const fieldNames = ['amount', 'price', 'salary', 'total', 'percentage', 'rate'];
fieldNames.forEach(field => {
  console.log(`${field}: ${getRecommendedNOD(field)}`);
});

// Test 4: Format multiple fields
console.log('\n\nTest 4: Format multiple amount fields');
const testData = {
  id: 1,
  name: 'Test Record',
  amount: 1234.5678,
  price: 99.9999,
  salary: 75000.0000,
  total: 2500.1234
};

const amountFields = ['amount', 'price', 'salary', 'total'];
console.log('Original data:', testData);

for (let nod = 0; nod <= 4; nod++) {
  const formatted = formatAmountFields(testData, amountFields, nod);
  console.log(`\nNOD ${nod}:`, formatted);
}

console.log('\n=== Tests Complete ===');
