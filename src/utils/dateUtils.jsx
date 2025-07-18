import React from 'react'
import { Typography } from '@mui/material'

/**
 * @fileoverview Date utility functions for handling timezone issues in MUI DataGrid
 * @author System
 * @version 1.0.0
 */

/**
 * Safely parses a date value to prevent timezone-related display issues
 * This function ensures that date-only strings (YYYY-MM-DD) are interpreted
 * in the local timezone rather than UTC, preventing the "one day off" problem
 * 
 * @param {string|Date|null|undefined} value - The date value to parse
 * @returns {Date|null} Parsed date object or null if invalid
 * 
 * @example
 * // These will all be parsed correctly without timezone offset issues:
 * parseDateSafely('2025-01-15')           // Returns Jan 15, 2025 00:00:00 local time
 * parseDateSafely('2025-01-15T10:30:00')  // Returns Jan 15, 2025 10:30:00 local time
 * parseDateSafely(new Date())             // Returns the date as-is
 * parseDateSafely(null)                   // Returns null
 */
export const parseDateSafely = (value) => {
  if (!value) return null
  
  // If already a valid Date object, return it
  if (value instanceof Date) {
    return isNaN(value.getTime()) ? null : value
  }
  
  // Handle string values
  if (typeof value === 'string') {
    let date
    
    // Check for date-only format (YYYY-MM-DD)
    if (value.match(/^\d{4}-\d{2}-\d{2}$/)) {
      // Add local time to prevent UTC interpretation
      date = new Date(value + 'T00:00:00')
    } 
    // Check if it already has time component
    else if (value.includes('T') || value.includes(' ')) {
      date = new Date(value)
    } 
    // Fallback for other formats
    else {
      // Try to parse as date-only by adding time
      date = new Date(value + 'T00:00:00')
    }
    
    return isNaN(date.getTime()) ? null : date
  }
  
  // Try to parse any other type
  const date = new Date(value)
  return isNaN(date.getTime()) ? null : date
}

/**
 * Formats a date for consistent display in DataGrid cells
 * 
 * @param {Date|string|null} date - The date to format
 * @param {string} [locale='en-US'] - The locale for formatting
 * @param {Object} [options] - Additional formatting options
 * @returns {string} Formatted date string or 'N/A' if invalid
 * 
 * @example
 * formatDateForDisplay(new Date('2025-01-15'))     // Returns "01/15/2025"
 * formatDateForDisplay('2025-01-15')               // Returns "01/15/2025"
 * formatDateForDisplay(null)                       // Returns "N/A"
 */
export const formatDateForDisplay = (date, locale = 'en-US', options = {}) => {
  const parsedDate = parseDateSafely(date)
  
  if (!parsedDate) return 'N/A'
  
  const defaultOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    ...options
  }
  
  try {
    return parsedDate.toLocaleDateString(locale, defaultOptions)
  } catch (error) {
    console.warn('Date formatting error:', error)
    return 'Invalid Date'
  }
}

/**
 * Creates a DataGrid date column configuration with proper date handling
 * 
 * @param {string} field - The field name
 * @param {string} [headerName] - Custom header name (defaults to formatted field name)
 * @param {number} [width=120] - Column width
 * @param {Object} [additionalProps] - Additional column properties
 * @returns {Object} DataGrid column configuration
 * 
 * @example
 * const dateColumn = createDateColumn('created_date', 'Created Date', 150)
 * const hireDateColumn = createDateColumn('hire_date')
 */
export const createDateColumn = (field, headerName, width = 120, additionalProps = {}) => {
  const formattedHeaderName = headerName || field.split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
  
  return {
    field,
    headerName: formattedHeaderName,
    width,
    type: 'date',
    filterable: true,
    sortable: true,
    valueGetter: (value, row) => parseDateSafely(value),
    renderCell: (params) => (
      <span style={{ fontSize: '0.8rem' }}>
        {formatDateForDisplay(params.value)}
      </span>
    ),
    ...additionalProps
  }
}

/**
 * Common date validation function
 * 
 * @param {any} value - Value to validate
 * @returns {boolean} True if value is a valid date
 */
export const isValidDate = (value) => {
  const date = parseDateSafely(value)
  return date !== null && !isNaN(date.getTime())
}

/**
 * Gets the current date as a properly formatted string for database storage
 * 
 * @returns {string} Date in YYYY-MM-DD format
 */
export const getCurrentDateString = () => {
  const now = new Date()
  return now.getFullYear() + '-' + 
         String(now.getMonth() + 1).padStart(2, '0') + '-' + 
         String(now.getDate()).padStart(2, '0')
}

/**
 * Converts a date to database-safe format (YYYY-MM-DD)
 * 
 * @param {Date|string} date - Date to convert
 * @returns {string|null} Date string in YYYY-MM-DD format or null if invalid
 */
export const toDateString = (date) => {
  const parsedDate = parseDateSafely(date)
  if (!parsedDate) return null
  
  return parsedDate.getFullYear() + '-' + 
         String(parsedDate.getMonth() + 1).padStart(2, '0') + '-' + 
         String(parsedDate.getDate()).padStart(2, '0')
}
