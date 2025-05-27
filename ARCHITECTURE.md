# React MUI Data Browser Application - Architecture Diagram

## Overview
This is a React-based data browser application built with Material-UI (MUI) that provides data visualization, filtering, and NOD (Number of Decimals) formatting capabilities.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              REACT MUI APP                                      │
│                         (React 19 + MUI + Vite)                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                                 APP LAYER                                       │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐                  │
│  │      App.jsx    │  │   Layout.jsx    │  │  AppDrawer.jsx  │                  │
│  │  (Root App)     │  │  (Main Layout)  │  │ (Navigation)    │                  │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘                  │
└─────────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                                PAGES LAYER                                      │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐                  │
│  │    Home.jsx     │  │ DataBrowser.jsx │  │  TableDemo.jsx  │                  │
│  │  (Dashboard)    │  │ (Main Feature)  │  │ (Table Demos)   │                  │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘                  │
│  ┌─────────────────┐                                                            │
│  │   Other.jsx     │                                                            │
│  │ (Other Pages)   │                                                            │
│  └─────────────────┘                                                            │
└─────────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           DATA BROWSER COMPONENTS                               │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐                  │
│  │DataBrowserHeader│  │ConfigurationPanel│  │  FilterPanel    │                 │
│  │  (App Header)   │  │ (Table Config)   │  │ (Filters/Search)│                 │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘                  │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐                  │
│  │ DataGridSection │  │RecordDetailsModal│  │ CustomToolbar   │                 │
│  │ (Data Display)  │  │ (Record Details) │  │ (Grid Actions)  │                 │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘                  │
└─────────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                            SHARED COMPONENTS                                    │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐                  │
│  │   DataGrid.jsx  │  │ReusableDataTable│  │DatabaseMetrics  │                  │
│  │ (Legacy Grid)   │  │ (Enhanced Grid) │  │  (DB Metrics)   │                  │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘                  │
│  ┌─────────────────┐                                                            │
│  │SystemInformation│                                                            │
│  │ (System Info)   │                                                            │
│  └─────────────────┘                                                            │
└─────────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              UTILITIES LAYER                                    │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐                  │
│  │amountFormatter  │  │ columnConfig    │  │mockDataGenerator│                  │
│  │ (NOD Formatting)│  │ (Grid Columns)  │  │ (Test Data)     │                  │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘                  │
│  ┌─────────────────┐  ┌─────────────────┐                                       │
│  │   constants     │  │    api.js       │                                       │
│  │ (App Constants) │  │ (API Services)  │                                       │
│  └─────────────────┘  └─────────────────┘                                       │
└─────────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                               HOOKS LAYER                                       │
│  ┌─────────────────┐                                                            │
│  │ useTableData.js │                                                            │
│  │ (Data Management)│                                                           │
│  └─────────────────┘                                                            │
└─────────────────────────────────────────────────────────────────────────────────┘
```

## Key Features

### 🔢 NOD (Number of Decimals) System
- **Purpose**: Format amount fields with configurable decimal precision (0-4)
- **Components**: amountFormatter.js utility with 7 formatting functions
- **Integration**: DataGrid columns, Record Details Modal, and all amount fields

### 📊 Data Management
- **Mock Data**: 4 different table types with realistic test data
- **Filtering**: Quick search, date filtering, account number validation
- **Display**: MUI DataGrid with custom column configurations

### 🎨 UI/UX Features
- **Material-UI**: Modern, responsive design system
- **Dark/Light Mode**: Theme switching capability
- **Responsive Layout**: Drawer navigation, grid layouts
- **Interactive Components**: Modals, chips, buttons, form controls

## Data Flow

```
User Interaction → Component State → Data Processing → Utility Functions → Display
     ↓                   ↓                ↓               ↓              ↓
  Click/Input    →   useState/Props  →  Filter/Format →  NOD/Column  →  Render
     ↓                   ↓                ↓               ↓              ↓
  Events         →   State Updates   →  Business Logic → Formatters   →  UI Update
```

## Technology Stack

- **Frontend**: React 19, Material-UI 6, Emotion
- **Build Tool**: Vite 6
- **State Management**: React useState/useEffect hooks
- **Data Grid**: MUI X DataGrid
- **Styling**: Emotion CSS-in-JS, MUI theming
- **Icons**: Material-UI Icons
- **Development**: ESLint, Hot Module Replacement

## File Organization

```
src/
├── components/     # Reusable UI components
├── pages/         # Route-based page components
├── utils/         # Business logic and utilities
├── hooks/         # Custom React hooks
└── services/      # API and external services
```

## Key Patterns

1. **Component Composition**: Breaking down complex UI into smaller, reusable components
2. **Utility Functions**: Separating business logic from UI components
3. **Props Drilling**: Passing data down through component hierarchy
4. **State Lifting**: Managing shared state in parent components
5. **Custom Hooks**: Encapsulating stateful logic for reuse

## NOD Architecture

```
┌─────────────────────────────────────┐
│        NOD (Number of Decimals)     │
├─────────────────────────────────────┤
│  formatAmount()                     │
│  formatAmountFields()               │
│  formatAmountByType()               │
│  parseFormattedAmount()             │
│  isValidNOD()                       │
│  getRecommendedNOD()                │
│  DEFAULT_AMOUNT_FIELDS              │
└─────────────────────────────────────┘
              ↓ Used by ↓
┌─────────────────────────────────────┐
│        Component Integration        │
├─────────────────────────────────────┤
│  DataGrid Columns (columnConfig)    │
│  Record Details Modal (NOD UI)      │
│  Mock Data Generator (4 decimals)   │
└─────────────────────────────────────┘
```

## Component Hierarchy Details

### ReusableDataTable Component
The `ReusableDataTable` is a comprehensive, reusable component that wraps MUI's DataGrid with additional features:

**Features:**
- ✅ Loading spinner with backdrop overlay
- ✅ Real-time search functionality across all columns
- ✅ Theme-aware styling (dark/light mode)
- ✅ Customizable pagination options
- ✅ Empty state handling with custom messages
- ✅ Flexible toolbar slot for custom actions
- ✅ Configurable search behavior (enable/disable)
- ✅ Responsive design with customizable heights

**Usage Examples:**
```jsx
// Basic usage
<ReusableDataTable
  title="Users"
  data={userData}
  columns={userColumns}
  loading={isLoading}
  searchText={searchQuery}
  onSearchChange={setSearchQuery}
  darkMode={isDark}
/>

// Advanced configuration
<ReusableDataTable
  title="Products"
  data={productData}
  columns={productColumns}
  loading={false}
  height="500px"
  initialPageSize={50}
  pageSizeOptions={[25, 50, 100]}
  enableSearch={true}
  searchPlaceholder="Search products..."
  toolbarSlot={<CustomToolbar />}
  emptyMessage="No products found"
/>
```

**Component Architecture:**
```
ReusableDataTable
├── Loading Backdrop (with spinner)
├── Header Section
│   ├── Title with icon
│   ├── Record count chip
│   └── Search field (optional)
├── Data Grid Container
│   ├── Empty State (when no data)
│   └── MUI DataGrid (with data)
└── Custom Styling (theme-aware)
```
