# Generic Recent Values Component Usage Guide

## Overview

The `SecureRecentValuesButton` component has been enhanced to work generically with any form or screen. This guide shows how to configure and use it with different types of data inputs.

## Quick Start

### Basic Usage

```jsx
import { SecureRecentValuesButton } from '../components'
import { createStorageKey } from '../utils/recentValuesConfig'

// Basic usage with auto-detection
<SecureRecentValuesButton
  storageKey={createStorageKey('myApp', 'myForm')}
  onSelect={(entry) => setFormData(entry)}
  onSaveEntry={(saveFunction) => setSaveFunction(saveFunction)}
/>
```

### With Custom Configuration

```jsx
import { createFieldConfig, presetConfigs } from '../utils/recentValuesConfig'

// Using a preset configuration
<SecureRecentValuesButton
  storageKey="myApp.forms.login"
  fieldConfig={presetConfigs.loginForm}
  onSelect={handleSelect}
  onSaveEntry={setSaveFunction}
/>

// Custom field configuration
const customConfig = createFieldConfig({
  fields: [
    { key: 'name', label: 'Name', minWidth: 150 },
    { key: 'email', label: 'Email', minWidth: 200 },
    { key: 'status', label: 'Status', minWidth: 100 }
  ],
  displayFields: [
    { key: 'name', fallback: '(no name)' },
    { key: 'email', fallback: '(no email)' }
  ]
})

<SecureRecentValuesButton
  fieldConfig={customConfig}
  // ... other props
/>
```

## Configuration Options

### Field Configuration (`fieldConfig`)

The `fieldConfig` prop defines how your data should be displayed and structured:

```jsx
const fieldConfig = createFieldConfig({
  // Define columns for the DataGrid
  fields: [
    { 
      key: 'fieldName',           // Required: field key in your data
      label: 'Display Label',     // Required: column header
      minWidth: 150,              // Optional: minimum column width
      type: 'string',             // Optional: 'string', 'number', 'date', 'boolean'
      flex: 1                     // Optional: flex grow value
    }
    // ... more fields
  ],
  
  // Define how to display entries in the main text
  displayFields: [
    { 
      key: 'fieldName',           // Field to display
      fallback: '(default)',     // Optional: fallback text if field is empty
      label: 'Prefix'             // Optional: prefix label
    }
    // ... more display fields
  ],
  
  separator: ' • ',               // Optional: separator between display fields
  emptySubtext: 'No entries yet.' // Optional: text when no entries exist
})
```

### Component Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `storageKey` | string | Required | Unique key for storing data |
| `onSelect` | function | Required | Called when user selects an entry |
| `onSaveEntry` | function | Optional | Receives save function to store entries |
| `fieldConfig` | object | Auto-detected | Configuration for fields and display |
| `title` | string | "Recent Values" | Modal dialog title |
| `maxEntries` | number | 50 | Maximum entries to store |
| `useSecureStorage` | boolean | false | Use IndexedDB instead of localStorage |
| `showStorageToggle` | boolean | false | Show storage method toggle |
| `customFilter` | function | None | Custom filter for saving entries |
| `allowDuplicates` | boolean | true | Allow duplicate entries |
| `compact` | boolean | false | Compact button and modal size |
| `emptyMessage` | string | Auto-generated | Message when no entries |
| `buttonProps` | object | {} | Props passed to the button |

## Preset Configurations

The system includes several preset configurations for common scenarios:

### Available Presets

- **`presetConfigs.dataBrowser`** - For data browser/query forms
- **`presetConfigs.accountInquiry`** - For account search forms
- **`presetConfigs.loginForm`** - For login/authentication forms
- **`presetConfigs.searchForm`** - For general search forms
- **`presetConfigs.generic`** - Basic configuration for any form

### Using Presets

```jsx
import { presetConfigs } from '../utils/recentValuesConfig'

// Login form
<SecureRecentValuesButton
  fieldConfig={presetConfigs.loginForm}
  storageKey="app.login"
  // ... other props
/>

// Data browser
<SecureRecentValuesButton
  fieldConfig={presetConfigs.dataBrowser}
  storageKey="app.dataBrowser"
  // ... other props
/>
```

## Custom Filters

Use custom filters to control which entries are saved:

```jsx
import { createCustomFilter } from '../utils/recentValuesConfig'

// Only save entries with required fields
const filter = createCustomFilter({
  requiredFields: ['username', 'environment'],
  excludeValues: {
    environment: [''], // Don't save empty environment
    username: ['test', 'demo'] // Don't save test accounts
  },
  customLogic: (entry) => {
    // Custom validation logic
    return entry.username.length >= 3
  }
})

<SecureRecentValuesButton
  customFilter={filter}
  // ... other props
/>
```

## Storage Methods

### LocalStorage (Default)
- Fast and simple
- Data persists in browser
- Not suitable for sensitive data

### IndexedDB with Encryption
- Secure storage with AES-GCM encryption
- PBKDF2 key derivation
- Suitable for PII and sensitive data

```jsx
<SecureRecentValuesButton
  useSecureStorage={true}
  showStorageToggle={true}
  onStorageModeChange={(isSecure) => console.log('Storage mode:', isSecure)}
  // ... other props
/>
```

## Complete Examples

### 1. Contact Form

```jsx
const ContactForm = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '' })
  const [saveFunction, setSaveFunction] = useState(null)

  const contactConfig = createFieldConfig({
    fields: [
      { key: 'name', label: 'Name', minWidth: 150 },
      { key: 'email', label: 'Email', minWidth: 200 },
      { key: 'subject', label: 'Subject', minWidth: 180 }
    ],
    displayFields: [
      { key: 'name', fallback: '(no name)' },
      { key: 'email', fallback: '(no email)' }
    ]
  })

  const handleSubmit = async () => {
    if (saveFunction) {
      await saveFunction(form)
    }
    // Submit form logic
  }

  return (
    <form>
      <TextField value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
      <TextField value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
      <TextField value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} />
      
      <SecureRecentValuesButton
        storageKey={createStorageKey('app', 'contact')}
        fieldConfig={contactConfig}
        onSelect={setForm}
        onSaveEntry={setSaveFunction}
      />
      
      <Button onClick={handleSubmit}>Submit</Button>
    </form>
  )
}
```

### 2. Search Form with Validation

```jsx
const SearchForm = () => {
  const [search, setSearch] = useState({ query: '', category: '', dateRange: '' })
  const [saveFunction, setSaveFunction] = useState(null)

  const searchFilter = createCustomFilter({
    requiredFields: ['query'],
    customLogic: (entry) => entry.query.length >= 3
  })

  const searchConfig = createFieldConfig({
    fields: [
      { key: 'query', label: 'Search Query', minWidth: 200 },
      { key: 'category', label: 'Category', minWidth: 120 },
      { key: 'dateRange', label: 'Date Range', minWidth: 140 }
    ],
    displayFields: [
      { key: 'query' },
      { key: 'category', fallback: 'All' }
    ]
  })

  return (
    <form>
      <TextField value={search.query} onChange={e => setSearch({...search, query: e.target.value})} />
      <Select value={search.category} onChange={e => setSearch({...search, category: e.target.value})}>
        <MenuItem value="">All Categories</MenuItem>
        <MenuItem value="docs">Documents</MenuItem>
        <MenuItem value="images">Images</MenuItem>
      </Select>
      
      <SecureRecentValuesButton
        storageKey="app.search"
        fieldConfig={searchConfig}
        customFilter={searchFilter}
        onSelect={setSearch}
        onSaveEntry={setSaveFunction}
        compact={true}
      />
      
      <Button onClick={() => saveFunction?.(search)}>Search</Button>
    </form>
  )
}
```

## Storage Key Best Practices

Use `createStorageKey` for consistent key generation:

```jsx
import { createStorageKey } from '../utils/recentValuesConfig'

// Pattern: createStorageKey(appSection, formType)
const keys = {
  login: createStorageKey('auth', 'login'),
  search: createStorageKey('main', 'search'),
  settings: createStorageKey('admin', 'settings'),
  contact: createStorageKey('support', 'contact')
}
```

## Migration Guide

### From Old Component

**Before:**
```jsx
<SecureRecentValuesButton
  renderItem={(item) => `${item.name} • ${item.email}`}
  storageKey="app.contact"
/>
```

**After:**
```jsx
<SecureRecentValuesButton
  fieldConfig={createFieldConfig({
    displayFields: [
      { key: 'name' },
      { key: 'email' }
    ]
  })}
  storageKey={createStorageKey('app', 'contact')}
/>
```

### Benefits of New Approach

1. **Consistent DataGrid Display** - All entries show in a properly formatted table
2. **Auto-Detection** - Component can work without configuration
3. **Type Safety** - Better TypeScript support with defined field types
4. **Reusability** - Same component works across different forms
5. **Maintainability** - Centralized configuration management

## Troubleshooting

### Common Issues

1. **No entries showing**: Check that `onSaveEntry` is properly setting the save function
2. **Entries not saving**: Verify `customFilter` isn't rejecting entries
3. **Display issues**: Ensure `fieldConfig` matches your data structure
4. **Storage errors**: Check browser console for IndexedDB or localStorage errors

### Debug Mode

Add console logging to track behavior:

```jsx
<SecureRecentValuesButton
  onSelect={(entry) => {
    console.log('Selected entry:', entry)
    setForm(entry)
  }}
  onSaveEntry={(fn) => {
    console.log('Save function received:', typeof fn)
    setSaveFunction(() => fn)
  }}
  // ... other props
/>
```
